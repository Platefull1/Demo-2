/**
 * Reprocessa notas EM_REVISAO (e opcionalmente ERRO) após importar catálogo.
 * Usa o mesmo catálogo da aba Produtos (tenant RH + merge).
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { loadCatalogoEstoqueForUserId } from '@/lib/estoque/catalogo';
import { gerarLancamentosAprovacao } from './approve';
import { competenciaFromDataEntrada } from './dates';
import {
  defaultPipelineConfig,
  processarNota,
  type PipelineInsumoConfig,
  type PipelineMapeamento,
} from './pipeline';

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

function inferSecao(categoriaId: string): 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA' {
  const c = categoriaId.toLowerCase();
  if (c.includes('embal')) return 'EMBALAGEM';
  if (c.includes('bebid')) return 'BEBIDA';
  return 'MATERIA_PRIMA';
}

export async function reprocessarNotasEmRevisao(userId: string): Promise<{
  processadas: number;
  aprovadas: number;
  aindaEmRevisao: number;
  sugeridos: number;
  catalogoSize: number;
  tenantUserId: string;
}> {
  const catalogoEstoque = await loadCatalogoEstoqueForUserId(userId);
  const tenantUserId = catalogoEstoque?.tenantUserId ?? userId;

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

  const configByInsumoId = new Map(configs.map((c) => [c.estoqueInsumoId, c]));

  const catalogo =
    catalogoEstoque?.itens
      .filter((i) => i.ativo)
      .map((i) => ({ id: i.id, nome: i.nome })) ??
    configs.map((c) => ({ id: c.estoqueInsumoId, nome: c.estoqueInsumo.nome }));

  const insumosConfig: Record<string, PipelineInsumoConfig> = {};
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
        kgPorUnidade: null,
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

  const pipelineConfig = defaultPipelineConfig({
    autoAprovar: nfeConfig?.autoAprovar ?? false,
    toleranciaTotalReais: Number(nfeConfig?.toleranciaTotalReais ?? 1),
    toleranciaTotalPercent: Number(nfeConfig?.toleranciaTotalPercent ?? 0.5),
    limiteVariacaoCustoPercent: Number(nfeConfig?.limiteVariacaoCustoPercent ?? 30),
    maxTentativas: nfeConfig?.maxTentativas ?? 3,
  });

  const notas = await prisma.nfeNota.findMany({
    where: { userId, status: { in: ['EM_REVISAO', 'ERRO_PROCESSAMENTO'] } },
    include: { itens: true, fornecedor: true },
    take: 500,
  });

  let processadas = 0;
  let aprovadas = 0;
  let aindaEmRevisao = 0;
  let sugeridos = 0;

  for (const nota of notas) {
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

    const out = processarNota({
      valorTotal: Number(nota.valorTotal),
      impostosNota,
      fornecedorIgnorarCmv: nota.fornecedor.ignorarCmv,
      saiposTransferenciaId: nota.saiposTransferenciaId,
      itens: nota.itens.map((it) => ({
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
      })),
      mapeamentos: mapeamentosPorFornecedor.get(nota.fornecedorId) ?? [],
      catalogo,
      insumosConfig,
      custoMedioPorInsumo,
      tentativasAtuais: nota.tentativas,
      config: pipelineConfig,
    });

    processadas++;
    sugeridos += out.itens.filter((i) => i.status === 'SUGERIDO').length;

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
        competencia: nota.competencia || competenciaFromDataEntrada(nota.dataEntrada),
        dataEntrada: nota.dataEntrada,
      });
      aprovadas++;
    } else if (out.status === 'EM_REVISAO') {
      aindaEmRevisao++;
    }
  }

  return {
    processadas,
    aprovadas,
    aindaEmRevisao,
    sugeridos,
    catalogoSize: catalogo.length,
    tenantUserId,
  };
}
