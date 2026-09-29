/**
 * Reprocessa notas do tenant dono sem puxar Stack Auth (script CLI).
 * npx tsx scripts/reprocess-cmv-real-stats.ts
 */
import { Prisma, PrismaClient } from '@prisma/client';
import {
  defaultPipelineConfig,
  processarNota,
  type PipelineInsumoConfig,
  type PipelineMapeamento,
} from '../src/lib/nfe/pipeline';
import { competenciaFromDataEntrada } from '../src/lib/nfe/dates';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const prisma = new PrismaClient();

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

async function main() {
  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER, ativo: true },
    include: { estoqueInsumo: { select: { id: true, nome: true, insumoId: true } } },
  });
  console.log('CmvRealInsumoConfig ativos:', configs.length);

  const catalogo = configs.map((c) => ({
    id: c.estoqueInsumoId,
    nome: c.estoqueInsumo.nome,
    secao: c.secao as 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA',
  }));

  const insumosConfig: Record<string, PipelineInsumoConfig> = {};
  for (const c of configs) {
    insumosConfig[c.estoqueInsumoId] = {
      estoqueInsumoId: c.estoqueInsumoId,
      unidade: c.unidade,
      secao: c.secao,
      kgPorUnidade: null,
    };
  }

  const mapeamentos = await prisma.nfeMapeamento.findMany({ where: { userId: OWNER } });
  const nfeConfig = await prisma.nfeConfig.findUnique({ where: { userId: OWNER } });

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

  const pipelineConfig = defaultPipelineConfig({
    autoAprovar: nfeConfig?.autoAprovar ?? false,
    toleranciaTotalReais: Number(nfeConfig?.toleranciaTotalReais ?? 1),
    toleranciaTotalPercent: Number(nfeConfig?.toleranciaTotalPercent ?? 0.5),
    limiteVariacaoCustoPercent: Number(nfeConfig?.limiteVariacaoCustoPercent ?? 30),
    maxTentativas: nfeConfig?.maxTentativas ?? 3,
  });

  const notas = await prisma.nfeNota.findMany({
    where: { userId: OWNER, status: { in: ['EM_REVISAO', 'ERRO_PROCESSAMENTO'] } },
    include: { itens: true, fornecedor: true },
    take: 500,
  });
  console.log('Notas a reprocessar:', notas.length);

  let sugeridos = 0;
  let semMapeamento = 0;
  let mapeados = 0;
  let ignorados = 0;

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
      tentativasAtuais: nota.tentativas,
      config: pipelineConfig,
    });

    sugeridos += out.itens.filter((i) => i.status === 'SUGERIDO').length;
    semMapeamento += out.itens.filter((i) => i.status === 'SEM_MAPEAMENTO').length;
    mapeados += out.itens.filter((i) => i.status === 'MAPEADO').length;
    ignorados += out.itens.filter((i) => i.status === 'IGNORADO').length;

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
      await tx.nfeNota.update({
        where: { id: nota.id },
        data: {
          status: out.status,
          tentativas: out.tentativas,
          ultimoErro: out.ultimoErro,
          alertas: out.alertas,
          somaItensLiquido: decimal(out.somaItensLiquido),
          aprovadaEm: out.status === 'APROVADA' ? new Date() : undefined,
          // competencia unchanged
          competencia: nota.competencia || competenciaFromDataEntrada(nota.dataEntrada),
        },
      });
    });
  }

  console.log('\n=== Resultado do reprocessamento ===');
  console.log({
    notas: notas.length,
    catalogoSize: catalogo.length,
    sugeridos,
    semMapeamento,
    mapeados,
    ignorados,
    totalItens: sugeridos + semMapeamento + mapeados + ignorados,
  });

  const byStatus = await prisma.nfeItem.groupBy({
    by: ['status'],
    where: { nota: { userId: OWNER } },
    _count: true,
  });
  console.log('\nItens no banco por status:');
  console.log(byStatus);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
