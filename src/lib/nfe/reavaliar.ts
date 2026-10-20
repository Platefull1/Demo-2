/**
 * Reavaliação de notas CMV Real (itens prontos → auto-aprovação).
 * Suporta dry-run (simulação) e apply idempotente.
 */

import { Prisma, PrismaClient, type NfeNotaStatus } from '@prisma/client';
import { competenciaFromDataEntrada } from './dates';
import { itemEstaPronto } from './item-pronto';
import {
  defaultPipelineConfig,
  processarNota,
  type PipelineConfig,
  type PipelineInsumoConfig,
  type PipelineItemPreservar,
  type PipelineMapeamento,
  type PipelineResult,
} from './pipeline';

/** Prisma lazy — evita puxar Stack Auth em scripts CLI. */
function getPrisma(): PrismaClient {
  return new PrismaClient();
}

const STORES = ['ahu', 'pilarzinho', 'portao', 'uberaba'] as const;

export type ReavaliarDecisao =
  | 'APROVADA'
  | 'APROVADA_COM_ALERTA'
  | 'IGNORADA'
  | 'EM_REVISAO'
  | 'ANTERIOR_CMV_REAL'
  | 'SKIP';

export type ReavaliarNotaLinha = {
  id: string;
  numero: string;
  storeSlug: string;
  competencia: string;
  fornecedor: string;
  prontos: string;
  alertas: string[];
  decisao: ReavaliarDecisao;
  motivo: string;
  statusAtual: string;
};

export type ReavaliarResumoCell = {
  aprovadas: number;
  aprovadasComAlerta: number;
  ignoradas: number;
  emRevisao: number;
  anteriorCmv: number;
};

export type ReavaliarResultado = {
  dryRun: boolean;
  inicioCmvReal: string;
  autoAprovar: boolean;
  alertasQueBloqueiam: string[];
  processadas: number;
  linhas: ReavaliarNotaLinha[];
  porLojaComp: Record<string, ReavaliarResumoCell>;
  totais: ReavaliarResumoCell;
};

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

function cnpjRaiz(cnpj: string): string {
  return cnpj.replace(/\D/g, '').slice(0, 8);
}

function emptyCell(): ReavaliarResumoCell {
  return {
    aprovadas: 0,
    aprovadasComAlerta: 0,
    ignoradas: 0,
    emRevisao: 0,
    anteriorCmv: 0,
  };
}

function bump(cell: ReavaliarResumoCell, d: ReavaliarDecisao) {
  if (d === 'APROVADA') cell.aprovadas++;
  else if (d === 'APROVADA_COM_ALERTA') cell.aprovadasComAlerta++;
  else if (d === 'IGNORADA') cell.ignoradas++;
  else if (d === 'EM_REVISAO') cell.emRevisao++;
  else if (d === 'ANTERIOR_CMV_REAL') cell.anteriorCmv++;
}

function parseAlertasQueBloqueiam(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === 'string');
}

type Ctx = {
  catalogo: Array<{ id: string; nome: string; secao: 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA' }>;
  insumosConfig: Record<string, PipelineInsumoConfig>;
  mapeamentosPorFornecedor: Map<string, PipelineMapeamento[]>;
  custoMedioPorInsumo: Record<string, number>;
  pipelineConfig: PipelineConfig;
  inicioCmvReal: string;
  fechamentosFechados: Set<string>; // storeSlug|competencia
};

async function ensureNfeConfig(prisma: PrismaClient, userId: string) {
  return prisma.nfeConfig.upsert({
    where: { userId },
    create: {
      userId,
      autoAprovar: true,
      alertasQueBloqueiam: [],
      inicioCmvReal: '2026-10',
    },
    update: {},
  });
}

async function loadReavaliarContext(
  prisma: PrismaClient,
  userId: string,
  opts?: { forceAutoAprovar?: boolean },
): Promise<Ctx> {
  const [configs, mapeamentos, nfeConfig, fornecedores, lancamentosRecentes, fechamentos, produtoCfgs] =
    await Promise.all([
      prisma.cmvRealInsumoConfig.findMany({
        where: { userId, ativo: true },
        include: { estoqueInsumo: { select: { id: true, nome: true, insumoId: true } } },
      }),
      prisma.nfeMapeamento.findMany({ where: { userId } }),
      prisma.nfeConfig.findUnique({ where: { userId } }),
      prisma.nfeFornecedor.findMany({
        where: { userId },
        select: { id: true, cnpj: true },
      }),
      prisma.cmvLancamento.findMany({
        where: {
          userId,
          tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
          data: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        },
        select: { estoqueInsumoId: true, quantidade: true, valorTotal: true },
      }),
      prisma.cmvFechamento.findMany({
        where: { userId, status: 'FECHADO' },
        select: { storeSlug: true, competencia: true },
      }),
      prisma.estoqueProdutoConfig.findMany({
        where: { userId },
        select: { produtoId: true, kgPorUnidade: true },
      }),
    ]);

  const inicioCmvReal = nfeConfig?.inicioCmvReal || '2026-10';
  const alertasQueBloqueiam = parseAlertasQueBloqueiam(nfeConfig?.alertasQueBloqueiam);
  const autoAprovar =
    opts?.forceAutoAprovar ?? nfeConfig?.autoAprovar ?? false;

  const kgBySlug = new Map(
    produtoCfgs.map((c) => [c.produtoId, c.kgPorUnidade]),
  );

  const catalogo = configs.map((c) => ({
    id: c.estoqueInsumoId,
    nome: c.estoqueInsumo.nome,
    secao: c.secao as 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA',
  }));

  const insumosConfig: Record<string, PipelineInsumoConfig> = {};
  for (const c of configs) {
    const slug = c.estoqueInsumo.insumoId;
    insumosConfig[c.estoqueInsumoId] = {
      estoqueInsumoId: c.estoqueInsumoId,
      unidade: c.unidade,
      secao: c.secao,
      kgPorUnidade: kgBySlug.get(slug) ?? null,
    };
  }
  // Mapeamentos por fornecedor + herança por CNPJ raiz
  const mapsByForn = new Map<string, PipelineMapeamento[]>();
  for (const m of mapeamentos) {
    const list = mapsByForn.get(m.fornecedorId) ?? [];
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
    mapsByForn.set(m.fornecedorId, list);
  }

  const fornIdsByRaiz = new Map<string, string[]>();
  for (const f of fornecedores) {
    const raiz = cnpjRaiz(f.cnpj);
    const list = fornIdsByRaiz.get(raiz) ?? [];
    list.push(f.id);
    fornIdsByRaiz.set(raiz, list);
  }

  const mapeamentosPorFornecedor = new Map<string, PipelineMapeamento[]>();
  for (const f of fornecedores) {
    const raiz = cnpjRaiz(f.cnpj);
    const ids = fornIdsByRaiz.get(raiz) ?? [f.id];
    const merged = new Map<string, PipelineMapeamento>();
    // Preferência: mapeamento do próprio fornecedor sobrescreve o da raiz
    for (const fid of ids) {
      if (fid === f.id) continue;
      for (const m of mapsByForn.get(fid) ?? []) {
        if (!merged.has(m.chave)) merged.set(m.chave, m);
      }
    }
    for (const m of mapsByForn.get(f.id) ?? []) {
      merged.set(m.chave, m);
    }
    mapeamentosPorFornecedor.set(f.id, [...merged.values()]);
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

  const pipelineConfig = defaultPipelineConfig({
    autoAprovar,
    toleranciaTotalReais: Number(nfeConfig?.toleranciaTotalReais ?? 1),
    toleranciaTotalPercent: Number(nfeConfig?.toleranciaTotalPercent ?? 0.5),
    limiteVariacaoCustoPercent: Number(nfeConfig?.limiteVariacaoCustoPercent ?? 30),
    maxTentativas: nfeConfig?.maxTentativas ?? 3,
    alertasQueBloqueiam,
  });

  const fechamentosFechados = new Set(
    fechamentos.map((f) => `${f.storeSlug}|${f.competencia}`),
  );

  return {
    catalogo,
    insumosConfig,
    mapeamentosPorFornecedor,
    custoMedioPorInsumo,
    pipelineConfig,
    inicioCmvReal,
    fechamentosFechados,
  };
}

function processarNotaDb(
  nota: {
    id: string;
    valorTotal: Prisma.Decimal;
    saiposTransferenciaId: number | null;
    tentativas: number;
    rawDetalhe: unknown;
    rawReport: unknown;
    fornecedorId: string;
    fornecedor: { ignorarCmv: boolean };
    itens: Array<{
      saiposItemId: number;
      numeroItem: number;
      descricao: string;
      ean: string | null;
      ncm: string | null;
      cfop: string | null;
      unidadeComercial: string;
      quantidade: Prisma.Decimal;
      valorBruto: Prisma.Decimal;
      valorLiquido: Prisma.Decimal | null;
      status: string;
      estoqueInsumoId: string | null;
      mapeamentoId: string | null;
      fatorConversao: Prisma.Decimal | null;
      quantidadeConvertida: Prisma.Decimal | null;
      unidadeConvertida: 'KG' | 'UN' | null;
    }>;
  },
  ctx: Ctx,
  mesFechado: boolean,
): PipelineResult {
  const raw = (nota.rawDetalhe ?? nota.rawReport) as Record<string, unknown> | null;
  const impostosNota: Record<string, number | null | undefined> = {};
  if (raw) {
    for (const k of ['total_fcp_st', 'total_ipi', 'total_other_cost', 'total_prod_amount']) {
      impostosNota[k] = num(raw[k]);
    }
  }

  const rawItems = Array.isArray(raw?.items) ? (raw!.items as Record<string, unknown>[]) : [];
  const netBySaipos = new Map<number, number>();
  for (const ri of rawItems) {
    const id = num(ri.id_store_provider_nfe_item);
    const net = num(ri.net_item_value);
    if (id != null && net != null) netBySaipos.set(id, net);
  }

  return processarNota({
    valorTotal: Number(nota.valorTotal),
    impostosNota,
    fornecedorIgnorarCmv: nota.fornecedor.ignorarCmv,
    saiposTransferenciaId: nota.saiposTransferenciaId,
    itens: nota.itens.map((it) => {
      let preservar: PipelineItemPreservar | null = null;
      if (it.status === 'MAPEADO' || it.status === 'IGNORADO') {
        preservar = {
          status: it.status,
          estoqueInsumoId: it.estoqueInsumoId,
          mapeamentoId: it.mapeamentoId,
          fatorConversao: it.fatorConversao != null ? Number(it.fatorConversao) : null,
          quantidadeConvertida:
            it.quantidadeConvertida != null ? Number(it.quantidadeConvertida) : null,
          unidadeConvertida: it.unidadeConvertida,
        };
      }
      return {
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
        preservar,
      };
    }),
    mapeamentos: ctx.mapeamentosPorFornecedor.get(nota.fornecedorId) ?? [],
    catalogo: ctx.catalogo,
    insumosConfig: ctx.insumosConfig,
    custoMedioPorInsumo: ctx.custoMedioPorInsumo,
    tentativasAtuais: nota.tentativas,
    config: { ...ctx.pipelineConfig, mesFechado },
  });
}

function decisaoFromOut(out: PipelineResult): ReavaliarDecisao {
  if (out.status === 'IGNORADA') return 'IGNORADA';
  if (out.status === 'APROVADA') {
    return out.aprovadaComAlerta ? 'APROVADA_COM_ALERTA' : 'APROVADA';
  }
  return 'EM_REVISAO';
}

async function aplicarNota(
  prisma: PrismaClient,
  userId: string,
  nota: {
    id: string;
    storeSlug: string;
    competencia: string;
    dataEntrada: Date;
  },
  out: PipelineResult,
  statusFinal: NfeNotaStatus,
): Promise<void> {
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
          sugestoes: it.sugestoes,
          alertas: it.alertas,
        },
      });
    }

    const aprovada = statusFinal === 'APROVADA';
    await tx.nfeNota.update({
      where: { id: nota.id },
      data: {
        status: statusFinal,
        tentativas: out.tentativas,
        ultimoErro: out.ultimoErro,
        alertas: out.alertas,
        somaItensLiquido: decimal(out.somaItensLiquido),
        aprovadaEm: aprovada ? new Date() : null,
        aprovadaPorId: null,
        aprovacaoAutomatica: aprovada,
        aprovadaComAlerta: aprovada ? out.aprovadaComAlerta : false,
        aprovacaoRegra: aprovada
          ? out.aprovacaoRegra
          : statusFinal === 'IGNORADA'
            ? out.aprovacaoRegra
            : statusFinal === 'ANTERIOR_CMV_REAL'
              ? 'anterior_cmv_real'
              : null,
      },
    });
  });

  if (out.gerarLancamentos && statusFinal === 'APROVADA') {
    const { gerarLancamentosAprovacao } = await import('./approve');
    await gerarLancamentosAprovacao({
      userId,
      notaId: nota.id,
      storeSlug: nota.storeSlug,
      competencia: nota.competencia || competenciaFromDataEntrada(nota.dataEntrada),
      dataEntrada: nota.dataEntrada,
    });
  }
}

/**
 * Reavalia notas EM_REVISAO (e opcionalmente outras) das 4 lojas.
 * dryRun=true: não grava nada (nem cria NfeConfig).
 */
export async function reavaliarNotasCmvReal(params: {
  userId: string;
  dryRun?: boolean;
  /** No dry-run, simula com autoAprovar=true mesmo sem config. */
  simularAutoAprovar?: boolean;
}): Promise<ReavaliarResultado> {
  const dryRun = params.dryRun !== false;
  const userId = params.userId;
  const prisma = getPrisma();

  try {
  if (!dryRun) {
    await ensureNfeConfig(prisma, userId);
    await prisma.nfeConfig.update({
      where: { userId },
      data: {
        autoAprovar: true,
        alertasQueBloqueiam: [],
      },
    });
  }

  const ctx = await loadReavaliarContext(prisma, userId, {
    forceAutoAprovar: dryRun
      ? (params.simularAutoAprovar ?? true)
      : true,
  });

  if (!dryRun) {
    const cfg = await prisma.nfeConfig.findUnique({ where: { userId } });
    ctx.pipelineConfig.autoAprovar = cfg?.autoAprovar ?? true;
    ctx.pipelineConfig.alertasQueBloqueiam = parseAlertasQueBloqueiam(
      cfg?.alertasQueBloqueiam,
    );
    ctx.inicioCmvReal = cfg?.inicioCmvReal || '2026-10';
  } else {
    ctx.pipelineConfig.autoAprovar = params.simularAutoAprovar ?? true;
    ctx.pipelineConfig.alertasQueBloqueiam = [];
    ctx.inicioCmvReal = ctx.inicioCmvReal || '2026-10';
  }

  const notas = await prisma.nfeNota.findMany({
    where: {
      userId,
      status: { in: ['EM_REVISAO', 'ERRO_PROCESSAMENTO'] },
      storeSlug: { in: [...STORES] },
    },
    include: {
      itens: true,
      fornecedor: {
        select: { ignorarCmv: true, razaoSocial: true, nomeFantasia: true },
      },
    },
    orderBy: [{ storeSlug: 'asc' }, { competencia: 'asc' }, { numero: 'asc' }],
  });

  const linhas: ReavaliarNotaLinha[] = [];
  const porLojaComp: Record<string, ReavaliarResumoCell> = {};
  const totais = emptyCell();

  for (const nota of notas) {
    const competencia =
      nota.competencia || competenciaFromDataEntrada(nota.dataEntrada);
    const key = `${nota.storeSlug}|${competencia}`;
    if (!porLojaComp[key]) porLojaComp[key] = emptyCell();

    const fornNome =
      nota.fornecedor.nomeFantasia || nota.fornecedor.razaoSocial;

    // Fornecedor fora do CMV tem prioridade (mesmo em mês anterior ao início)
    if (nota.fornecedor.ignorarCmv) {
      const linha: ReavaliarNotaLinha = {
        id: nota.id,
        numero: nota.numero,
        storeSlug: nota.storeSlug,
        competencia,
        fornecedor: fornNome,
        prontos: `${nota.itens.filter((i) => itemEstaPronto(i)).length}/${nota.itens.length}`,
        alertas: ['FORNECEDOR_IGNORADO'],
        decisao: 'IGNORADA',
        motivo: 'fornecedor ignorarCmv',
        statusAtual: nota.status,
      };
      linhas.push(linha);
      bump(porLojaComp[key], 'IGNORADA');
      bump(totais, 'IGNORADA');
      if (!dryRun) {
        await prisma.$transaction([
          prisma.nfeNota.update({
            where: { id: nota.id },
            data: {
              status: 'IGNORADA',
              alertas: ['FORNECEDOR_IGNORADO'],
              aprovacaoRegra: 'fornecedor_fora_cmv',
              aprovacaoAutomatica: false,
              aprovadaComAlerta: false,
              aprovadaEm: null,
              aprovadaPorId: null,
            },
          }),
          prisma.nfeItem.updateMany({
            where: { notaId: nota.id },
            data: { status: 'IGNORADO' },
          }),
        ]);
      }
      continue;
    }

    if (competencia < ctx.inicioCmvReal) {
      const linha: ReavaliarNotaLinha = {
        id: nota.id,
        numero: nota.numero,
        storeSlug: nota.storeSlug,
        competencia,
        fornecedor: fornNome,
        prontos: `${nota.itens.filter((i) => itemEstaPronto(i)).length}/${nota.itens.length}`,
        alertas: Array.isArray(nota.alertas) ? (nota.alertas as string[]) : [],
        decisao: 'ANTERIOR_CMV_REAL',
        motivo: `competência ${competencia} < início CMV Real ${ctx.inicioCmvReal}`,
        statusAtual: nota.status,
      };
      linhas.push(linha);
      bump(porLojaComp[key], 'ANTERIOR_CMV_REAL');
      bump(totais, 'ANTERIOR_CMV_REAL');

      if (!dryRun) {
        await prisma.nfeNota.update({
          where: { id: nota.id },
          data: {
            status: 'ANTERIOR_CMV_REAL',
            aprovacaoRegra: 'anterior_cmv_real',
            aprovacaoAutomatica: false,
            aprovadaComAlerta: false,
            aprovadaEm: null,
            aprovadaPorId: null,
          },
        });
      }
      continue;
    }

    const mesFechado = ctx.fechamentosFechados.has(key);
    const out = processarNotaDb(nota, ctx, mesFechado);
    const decisao = decisaoFromOut(out);
    const alertas = [
      ...out.alertas,
      ...out.itens.flatMap((i) => i.alertas),
    ];
    const prontos = `${out.itens.filter((i) => itemEstaPronto(i)).length}/${out.itens.length}`;

    const linha: ReavaliarNotaLinha = {
      id: nota.id,
      numero: nota.numero,
      storeSlug: nota.storeSlug,
      competencia,
      fornecedor: fornNome,
      prontos,
      alertas: [...new Set(alertas)],
      decisao,
      motivo:
        decisao === 'EM_REVISAO'
          ? out.motivoRevisao || 'em revisão'
          : decisao === 'APROVADA_COM_ALERTA'
            ? `aprovada com alerta: ${[...new Set(alertas)].join(', ') || '—'}`
            : decisao === 'APROVADA'
              ? 'itens prontos'
              : decisao === 'IGNORADA'
                ? out.aprovacaoRegra || 'ignorada'
                : '',
      statusAtual: nota.status,
    };
    linhas.push(linha);
    bump(porLojaComp[key], decisao);
    bump(totais, decisao);

    if (!dryRun) {
      const statusFinal: NfeNotaStatus =
        out.status === 'APROVADA'
          ? 'APROVADA'
          : out.status === 'IGNORADA'
            ? 'IGNORADA'
            : 'EM_REVISAO';
      await aplicarNota(prisma, userId, nota, out, statusFinal);
    }
  }

  return {
    dryRun,
    inicioCmvReal: ctx.inicioCmvReal,
    autoAprovar: ctx.pipelineConfig.autoAprovar,
    alertasQueBloqueiam: ctx.pipelineConfig.alertasQueBloqueiam,
    processadas: linhas.length,
    linhas,
    porLojaComp,
    totais,
  };
  } finally {
    await prisma.$disconnect();
  }
}

/** Reavalia uma nota (e opcionalmente outras EM_REVISAO do mesmo fornecedor). */
export async function reavaliarNotaAposMapeamento(params: {
  userId: string;
  notaId: string;
  fornecedorId?: string;
}): Promise<{ notas: number; aprovadas: number }> {
  const prisma = getPrisma();
  try {
    await ensureNfeConfig(prisma, params.userId);
    const cfg = await prisma.nfeConfig.findUnique({
      where: { userId: params.userId },
    });
    if (cfg && !cfg.autoAprovar) {
      await prisma.nfeConfig.update({
        where: { userId: params.userId },
        data: { autoAprovar: true },
      });
    }

    const ctx = await loadReavaliarContext(prisma, params.userId, {
      forceAutoAprovar: true,
    });

    const where = {
      userId: params.userId,
      status: 'EM_REVISAO' as const,
      storeSlug: { in: [...STORES] },
      competencia: { gte: ctx.inicioCmvReal },
      OR: [
        { id: params.notaId },
        ...(params.fornecedorId ? [{ fornecedorId: params.fornecedorId }] : []),
      ],
    };

    const notas = await prisma.nfeNota.findMany({
      where,
      include: {
        itens: true,
        fornecedor: {
          select: { ignorarCmv: true, razaoSocial: true, nomeFantasia: true },
        },
      },
    });

    let aprovadas = 0;
    for (const nota of notas) {
      const key = `${nota.storeSlug}|${nota.competencia}`;
      const mesFechado = ctx.fechamentosFechados.has(key);
      const out = processarNotaDb(nota, ctx, mesFechado);
      const statusFinal: NfeNotaStatus =
        out.status === 'APROVADA'
          ? 'APROVADA'
          : out.status === 'IGNORADA'
            ? 'IGNORADA'
            : 'EM_REVISAO';
      await aplicarNota(prisma, params.userId, nota, out, statusFinal);
      if (statusFinal === 'APROVADA') aprovadas++;
    }

    return { notas: notas.length, aprovadas };
  } finally {
    await prisma.$disconnect();
  }
}
