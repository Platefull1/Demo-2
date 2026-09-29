/**
 * Ingestão idempotente da resposta do scraper POST /nfe/sync.
 */

import { Prisma, type NfeNotaStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { gerarLancamentosAprovacao } from './approve';
import { competenciaFromDataEntrada } from './dates';
import {
  normalizarCnpj,
  normalizarDescricao,
  normalizarUnidade,
} from './normalize';
import { notificarProblemasIngest } from './notificar';
import {
  defaultPipelineConfig,
  processarNota,
  type PipelineConfig,
  type PipelineInsumoConfig,
  type PipelineMapeamento,
  type PipelineProblema,
} from './pipeline';
import { storeSlugFromSaiposId } from './stores';

export interface IngestSyncPayload {
  ok?: boolean;
  porLoja?: Record<string, { notas?: unknown[] }>;
  erros?: Array<{ storeId?: number; etapa?: string; mensagem?: string }>;
}

export interface IngestResultado {
  recebidas: number;
  novas: number;
  emRevisao: number;
  aprovadas: number;
  ignoradas: number;
  erros: number;
  aguardandoDetalhe: Array<{ storeId: number; ids: number[] }>;
  problemasNovos: PipelineProblema[];
}

type RawNota = Record<string, unknown>;
type RawItem = Record<string, unknown>;

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function str(v: unknown, fallback = ''): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}

function asDate(v: unknown): Date {
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return new Date(0);
  return d;
}

function getProvider(nota: RawNota): Record<string, unknown> {
  const p = nota.provider;
  if (p && typeof p === 'object') return p as Record<string, unknown>;
  return {};
}

function getItems(nota: RawNota): RawItem[] {
  return Array.isArray(nota.items) ? (nota.items as RawItem[]) : [];
}

function temDetalhe(itens: RawItem[]): boolean {
  return itens.some((it) => it.net_item_value != null && it.net_item_value !== '');
}

function conciliada(itens: RawItem[]): boolean {
  if (itens.length === 0) return false;
  return itens.every((it) => it.movement != null);
}

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

async function loadContext(userId: string) {
  const { loadCatalogoEstoqueForUserId } = await import('@/lib/estoque/catalogo');
  const catalogoEstoque = await loadCatalogoEstoqueForUserId(userId);
  const tenantUserId = catalogoEstoque?.tenantUserId ?? userId;

  // CmvRealInsumoConfig vive no tenant RH (aba Produtos); NF-e/mapeamentos na conta da API key
  const [configs, mapeamentos, nfeConfig, lancamentosRecentes] = await Promise.all([
    prisma.cmvRealInsumoConfig.findMany({
      where: { userId: tenantUserId, ativo: true },
      include: { estoqueInsumo: { select: { id: true, nome: true, insumoId: true } } },
    }),
    prisma.nfeMapeamento.findMany({ where: { userId } }),
    prisma.nfeConfig.findUnique({ where: { userId } }),
    prisma.cmvLancamento.findMany({
      where: {
        userId,
        tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
        data: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
      select: { estoqueInsumoId: true, quantidade: true, valorTotal: true },
    }),
  ]);

  // Catálogo para similaridade = produtos da aba Estoque (179 merge)
  // Preferir nomes do Estoque; se houver CmvRealInsumoConfig, filtrar ativos por config
  const configByInsumoId = new Map(configs.map((c) => [c.estoqueInsumoId, c]));
  const kgByInsumoId = new Map(
    (catalogoEstoque?.itens ?? []).map((i) => [i.id, i.kgPorUnidade]),
  );
  // também por slug→id caso config aponte a outra cópia do mesmo slug
  const estoqueById = new Map((catalogoEstoque?.itens ?? []).map((i) => [i.id, i]));

  const catalogo =
    catalogoEstoque?.itens
      .filter((i) => i.ativo)
      .map((i) => ({ id: i.id, nome: i.nome })) ??
    configs.map((c) => ({ id: c.estoqueInsumoId, nome: c.estoqueInsumo.nome }));

  const insumosConfig: Record<string, PipelineInsumoConfig> = {};
  // A partir do catálogo Estoque + overlay de CmvRealInsumoConfig
  for (const item of catalogoEstoque?.itens ?? []) {
    const cfg = configByInsumoId.get(item.id);
    if (cfg && !cfg.ativo) continue;
    insumosConfig[item.id] = {
      estoqueInsumoId: item.id,
      unidade: cfg?.unidade ?? (item.unidade === 'un' ? 'UN' : 'KG'),
      secao: cfg?.secao ?? inferSecao(item.categoriaId),
      kgPorUnidade: item.kgPorUnidade,
    };
  }
  for (const c of configs) {
    if (!insumosConfig[c.estoqueInsumoId]) {
      insumosConfig[c.estoqueInsumoId] = {
        estoqueInsumoId: c.estoqueInsumoId,
        unidade: c.unidade,
        secao: c.secao,
        kgPorUnidade:
          kgByInsumoId.get(c.estoqueInsumoId) ??
          estoqueById.get(c.estoqueInsumoId)?.kgPorUnidade ??
          null,
      };
    }
  }

  const mapeamentosPorFornecedor = new Map<string, PipelineMapeamento[]>();
  for (const m of mapeamentos) {
    const list = mapeamentosPorFornecedor.get(m.fornecedorId) ?? [];
    list.push({
      id: m.id,
      chave: m.chave,
      estoqueInsumoId: m.estoqueInsumoId,
      fatorConversao: Number(m.fatorConversao),
      ignorar: m.ignorar,
      unidadeConvertida: m.estoqueInsumoId
        ? insumosConfig[m.estoqueInsumoId]?.unidade
        : undefined,
      secao: m.estoqueInsumoId ? insumosConfig[m.estoqueInsumoId]?.secao : undefined,
    });
    mapeamentosPorFornecedor.set(m.fornecedorId, list);
  }

  const custoMedioPorInsumo: Record<string, number> = {};
  const acc = new Map<string, { qtd: number; valor: number }>();
  for (const l of lancamentosRecentes) {
    const q = Number(l.quantidade);
    const v = Number(l.valorTotal);
    if (q <= 0) continue;
    const cur = acc.get(l.estoqueInsumoId) ?? { qtd: 0, valor: 0 };
    cur.qtd += q;
    cur.valor += v;
    acc.set(l.estoqueInsumoId, cur);
  }
  for (const [id, a] of acc) {
    if (a.qtd > 0) custoMedioPorInsumo[id] = a.valor / a.qtd;
  }

  const pipelineConfig: PipelineConfig = defaultPipelineConfig({
    autoAprovar: nfeConfig?.autoAprovar ?? false,
    toleranciaTotalReais: Number(nfeConfig?.toleranciaTotalReais ?? 1),
    toleranciaTotalPercent: Number(nfeConfig?.toleranciaTotalPercent ?? 0.5),
    limiteVariacaoCustoPercent: Number(nfeConfig?.limiteVariacaoCustoPercent ?? 30),
    maxTentativas: nfeConfig?.maxTentativas ?? 3,
  });

  return {
    catalogo,
    insumosConfig,
    mapeamentosPorFornecedor,
    custoMedioPorInsumo,
    pipelineConfig,
    tenantUserId,
  };
}

function inferSecao(categoriaId: string): 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA' {
  const c = categoriaId.toLowerCase();
  if (c.includes('embal')) return 'EMBALAGEM';
  if (c.includes('bebid')) return 'BEBIDA';
  return 'MATERIA_PRIMA';
}

async function upsertFornecedor(
  userId: string,
  provider: Record<string, unknown>,
) {
  const cnpj = normalizarCnpj(str(provider.cnpj || provider.document || '00000000000000'));
  const razaoSocial = str(
    provider.corporate_name || provider.razao_social || provider.name || 'SEM NOME',
  );
  const nomeFantasia = str(provider.trade_name || provider.nome_fantasia || '') || null;

  return prisma.nfeFornecedor.upsert({
    where: { userId_cnpj: { userId, cnpj } },
    create: { userId, cnpj, razaoSocial, nomeFantasia },
    update: { razaoSocial, nomeFantasia: nomeFantasia ?? undefined },
  });
}

async function aplicarPipelineNaNota(
  userId: string,
  notaId: string,
  ctx: Awaited<ReturnType<typeof loadContext>>,
  problemasNovos: PipelineProblema[],
  problemasJaVistos: Set<string>,
): Promise<NfeNotaStatus> {
  const nota = await prisma.nfeNota.findFirst({
    where: { id: notaId, userId },
    include: { itens: true, fornecedor: true },
  });
  if (!nota) return 'ERRO_PROCESSAMENTO';

  const mapeamentos = ctx.mapeamentosPorFornecedor.get(nota.fornecedorId) ?? [];

  const impostosNota: Record<string, number | null | undefined> = {};
  const raw = (nota.rawDetalhe ?? nota.rawReport) as Record<string, unknown> | null;
  if (raw) {
    for (const k of ['total_fcp_st', 'total_ipi', 'total_other_cost', 'total_prod_amount']) {
      impostosNota[k] = num(raw[k]);
    }
  }

  const rawItems = getItems((nota.rawDetalhe ?? nota.rawReport) as RawNota);
  const netBySaipos = new Map<number, number>();
  for (const ri of rawItems) {
    const id = num(ri.id_store_provider_nfe_item);
    const net = num(ri.net_item_value);
    if (id != null && net != null) netBySaipos.set(id, net);
  }

  const itensComNet = nota.itens.map((it) => ({
    saiposItemId: it.saiposItemId,
    numeroItem: it.numeroItem,
    descricao: it.descricao,
    ean: it.ean,
    ncm: it.ncm,
    cfop: it.cfop,
    unidadeComercial: it.unidadeComercial,
    quantidade: Number(it.quantidade),
    valorBruto: Number(it.valorBruto),
    netItemValue:
      netBySaipos.get(it.saiposItemId) ??
      (it.valorLiquido != null ? Number(it.valorLiquido) : Number(it.valorBruto)),
  }));

  const out = processarNota({
    valorTotal: Number(nota.valorTotal),
    impostosNota,
    fornecedorIgnorarCmv: nota.fornecedor.ignorarCmv,
    saiposTransferenciaId: nota.saiposTransferenciaId,
    itens: itensComNet,
    mapeamentos,
    catalogo: ctx.catalogo,
    insumosConfig: ctx.insumosConfig,
    custoMedioPorInsumo: ctx.custoMedioPorInsumo,
    tentativasAtuais: nota.tentativas,
    config: ctx.pipelineConfig,
  });

  for (const p of out.problemasNovos) {
    const key = `${nota.saiposNotaId}:${p.tipo}:${p.saiposItemId ?? ''}:${p.mensagem}`;
    if (!problemasJaVistos.has(key)) {
      problemasJaVistos.add(key);
      problemasNovos.push({ ...p });
    }
  }

  await prisma.$transaction(async (tx) => {
    for (const it of out.itens) {
      await tx.nfeItem.updateMany({
        where: { notaId: nota.id, saiposItemId: it.saiposItemId },
        data: {
          descricaoNormalizada: it.descricaoNormalizada,
          unidadeComercial: it.unidadeComercial,
          valorLiquido: decimal(it.valorLiquido),
          fcpStRateado: it.fcpStRateado ? decimal(it.fcpStRateado) : null,
          status: it.status,
          estoqueInsumoId: it.estoqueInsumoId,
          mapeamentoId: it.mapeamentoId,
          fatorConversao: it.fatorConversao != null ? decimal(it.fatorConversao) : null,
          quantidadeConvertida:
            it.quantidadeConvertida != null ? decimal(it.quantidadeConvertida) : null,
          unidadeConvertida: it.unidadeConvertida,
          custoUnitario: it.custoUnitario != null ? decimal(it.custoUnitario) : null,
          fatorSugerido: it.fatorSugerido != null ? decimal(it.fatorSugerido) : null,
          fatorSugeridoOrigem: it.fatorSugeridoOrigem,
          sugestaoInsumoId: it.sugestaoInsumoId,
          sugestaoScore: it.sugestaoScore,
          alertas: it.alertas,
        },
      });
    }

    await tx.nfeNota.update({
      where: { id: nota.id },
      data: {
        status: out.status,
        tentativas: out.tentativas,
        ultimoErro: out.ultimoErro,
        alertas: out.alertas,
        somaItensLiquido: decimal(out.somaItensLiquido),
        aprovadaEm: out.status === 'APROVADA' ? new Date() : undefined,
      },
    });
  });

  if (out.gerarLancamentos) {
    await gerarLancamentosAprovacao({
      userId,
      notaId: nota.id,
      storeSlug: nota.storeSlug,
      competencia: nota.competencia,
      dataEntrada: nota.dataEntrada,
    });
  }

  return out.status;
}

async function upsertNotaEItens(
  userId: string,
  storeId: number,
  storeSlug: string,
  rawNota: RawNota,
  ctx: Awaited<ReturnType<typeof loadContext>>,
  counters: IngestResultado,
  problemasJaVistos: Set<string>,
): Promise<void> {
  const saiposNotaId = num(rawNota.id_store_provider_nfe);
  if (saiposNotaId == null) {
    counters.erros++;
    return;
  }

  const provider = getProvider(rawNota);
  const fornecedor = await upsertFornecedor(userId, provider);
  const itens = getItems(rawNota);
  const comDetalhe = temDetalhe(itens);

  const dataEntrada = asDate(rawNota.date_entry || rawNota.created_at);
  const dataEmissao = asDate(rawNota.date_emission || rawNota.date_entry || rawNota.created_at);
  const dataCadastro = asDate(rawNota.created_at || rawNota.date_entry);
  const competencia = competenciaFromDataEntrada(dataEntrada);
  const valorTotal = num(rawNota.total_amount) ?? 0;
  const transferenciaId = num(rawNota.id_store_stock_transfer);

  const existing = await prisma.nfeNota.findUnique({
    where: { userId_saiposNotaId: { userId, saiposNotaId } },
  });

  counters.recebidas++;

  if (existing && (existing.status === 'APROVADA' || existing.status === 'IGNORADA')) {
    await prisma.nfeNota.update({
      where: { id: existing.id },
      data: {
        conciliadaSaipos: conciliada(itens),
        rawReport: rawNota as Prisma.InputJsonValue,
        rawDetalhe: comDetalhe ? (rawNota as Prisma.InputJsonValue) : existing.rawDetalhe,
        saiposTransferenciaId: transferenciaId,
      },
    });
    return;
  }

  const isNova = !existing;
  if (isNova) counters.novas++;

  const statusInicial: NfeNotaStatus = comDetalhe
    ? 'PENDENTE_PROCESSAMENTO'
    : 'AGUARDANDO_DETALHE';

  const nota = await prisma.nfeNota.upsert({
    where: { userId_saiposNotaId: { userId, saiposNotaId } },
    create: {
      userId,
      storeSlug,
      saiposStoreId: storeId,
      saiposNotaId,
      chaveAcesso: str(rawNota.access_key || rawNota.chave_acesso || ''),
      numero: str(rawNota.number_nfe || rawNota.numero || saiposNotaId),
      fornecedorId: fornecedor.id,
      dataEmissao,
      dataEntrada,
      dataCadastroSaipos: dataCadastro,
      competencia,
      valorTotal: decimal(valorTotal),
      status: statusInicial,
      conciliadaSaipos: conciliada(itens),
      saiposTransferenciaId: transferenciaId,
      rawReport: rawNota as Prisma.InputJsonValue,
      rawDetalhe: comDetalhe ? (rawNota as Prisma.InputJsonValue) : undefined,
      alertas: [],
    },
    update: {
      chaveAcesso: str(rawNota.access_key || rawNota.chave_acesso || ''),
      numero: str(rawNota.number_nfe || rawNota.numero || saiposNotaId),
      fornecedorId: fornecedor.id,
      dataEmissao,
      dataEntrada,
      dataCadastroSaipos: dataCadastro,
      competencia,
      valorTotal: decimal(valorTotal),
      conciliadaSaipos: conciliada(itens),
      saiposTransferenciaId: transferenciaId,
      rawReport: rawNota as Prisma.InputJsonValue,
      rawDetalhe: comDetalhe ? (rawNota as Prisma.InputJsonValue) : undefined,
      status:
        existing?.status === 'EM_REVISAO' || existing?.status === 'FALHA'
          ? existing.status
          : statusInicial,
    },
  });

  for (const ri of itens) {
    const saiposItemId = num(ri.id_store_provider_nfe_item);
    if (saiposItemId == null) continue;
    const descricao = str(ri.desc_item || ri.description || '');
    const und = normalizarUnidade(str(ri.commercial_unit || 'UN'));
    const qtd = num(ri.quantity_items) ?? 0;
    const bruto = num(ri.item_value) ?? 0;
    const liquido = num(ri.net_item_value);
    const ean = str(ri.xml_cean || ri.ean || '').replace(/\D/g, '') || null;

    await prisma.nfeItem.upsert({
      where: { notaId_saiposItemId: { notaId: nota.id, saiposItemId } },
      create: {
        notaId: nota.id,
        saiposItemId,
        numeroItem: num(ri.numero_item) ?? 0,
        descricao,
        descricaoNormalizada: normalizarDescricao(descricao),
        ean,
        ncm: str(ri.xml_ncm || '') || null,
        cfop: str(ri.xml_cfop || '') || null,
        unidadeComercial: und,
        quantidade: decimal(qtd),
        valorBruto: decimal(bruto),
        valorLiquido: liquido != null ? decimal(liquido) : null,
        status: 'SEM_MAPEAMENTO',
        alertas: [],
      },
      update: {
        descricao,
        descricaoNormalizada: normalizarDescricao(descricao),
        ean,
        ncm: str(ri.xml_ncm || '') || null,
        cfop: str(ri.xml_cfop || '') || null,
        unidadeComercial: und,
        quantidade: decimal(qtd),
        valorBruto: decimal(bruto),
        valorLiquido: liquido != null ? decimal(liquido) : undefined,
      },
    });
  }

  if (!comDetalhe) {
    const bucket = counters.aguardandoDetalhe.find((a) => a.storeId === storeId);
    if (bucket) bucket.ids.push(saiposNotaId);
    else counters.aguardandoDetalhe.push({ storeId, ids: [saiposNotaId] });
    return;
  }

  const status = await aplicarPipelineNaNota(
    userId,
    nota.id,
    ctx,
    counters.problemasNovos,
    problemasJaVistos,
  );

  if (status === 'EM_REVISAO') counters.emRevisao++;
  else if (status === 'APROVADA') counters.aprovadas++;
  else if (status === 'IGNORADA') counters.ignoradas++;
  else if (status === 'ERRO_PROCESSAMENTO' || status === 'FALHA') counters.erros++;
}

export async function ingestNfeSync(
  userId: string,
  payload: IngestSyncPayload,
): Promise<IngestResultado> {
  const counters: IngestResultado = {
    recebidas: 0,
    novas: 0,
    emRevisao: 0,
    aprovadas: 0,
    ignoradas: 0,
    erros: 0,
    aguardandoDetalhe: [],
    problemasNovos: [],
  };

  const ctx = await loadContext(userId);
  const problemasJaVistos = new Set<string>();

  // Problemas já alertados: notas EM_REVISAO com alertas existentes não recontam
  const existentes = await prisma.nfeNota.findMany({
    where: { userId, status: { in: ['EM_REVISAO', 'FALHA'] } },
    select: { saiposNotaId: true, alertas: true, itens: { select: { saiposItemId: true, status: true, alertas: true } } },
  });
  for (const n of existentes) {
    const alertas = Array.isArray(n.alertas) ? (n.alertas as string[]) : [];
    for (const a of alertas) {
      problemasJaVistos.add(`${n.saiposNotaId}:${a}::`);
    }
    for (const it of n.itens) {
      problemasJaVistos.add(`${n.saiposNotaId}:${it.status}:${it.saiposItemId}:`);
    }
  }

  const porLoja = payload.porLoja ?? {};
  for (const [storeIdStr, bloco] of Object.entries(porLoja)) {
    const storeId = Number(storeIdStr);
    const storeSlug = storeSlugFromSaiposId(storeId);
    if (!storeSlug) {
      counters.erros++;
      continue;
    }
    const notas = Array.isArray(bloco?.notas) ? bloco.notas : [];
    for (const raw of notas) {
      try {
        await upsertNotaEItens(
          userId,
          storeId,
          storeSlug,
          raw as RawNota,
          ctx,
          counters,
          problemasJaVistos,
        );
      } catch (err) {
        console.error('[nfe.ingest] erro na nota', err);
        counters.erros++;
      }
    }
  }

  // Reprocessa ERRO_PROCESSAMENTO com tentativas < max
  const paraRetry = await prisma.nfeNota.findMany({
    where: {
      userId,
      status: 'ERRO_PROCESSAMENTO',
      tentativas: { lt: ctx.pipelineConfig.maxTentativas },
    },
    select: { id: true },
    take: 50,
  });
  for (const n of paraRetry) {
    try {
      await aplicarPipelineNaNota(
        userId,
        n.id,
        ctx,
        counters.problemasNovos,
        problemasJaVistos,
      );
    } catch (err) {
      console.error('[nfe.ingest] retry falhou', err);
    }
  }

  await notificarProblemasIngest({
    userId,
    problemasNovos: counters.problemasNovos,
  });

  return counters;
}
