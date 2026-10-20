/**
 * Diagnóstico (somente leitura): notas EM_REVISAO das 4 lojas.
 * npx tsx scripts/diag-em-revisao-cmv.ts
 */
import { PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const STORES = ['ahu', 'pilarzinho', 'portao', 'uberaba'] as const;
const AHU_FOCUS = new Set([
  '153377',
  '6641',
  '305640',
  '740826',
  '740828',
  '740827',
  '9636376',
  '38137',
  '9636377',
  '1762799',
  '40846',
  '2140149',
  '324995',
]);

const prisma = new PrismaClient();

type ItemRow = {
  status: string;
  estoqueInsumoId: string | null;
  fatorConversao: unknown;
  quantidadeConvertida: unknown;
  alertas: unknown;
};

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(String(v));
  return Number.isFinite(n) ? n : null;
}

/** Critério atual da coluna "Itens prontos" na lista (status MAPEADO|IGNORADO). */
function itemProntoUi(i: ItemRow): boolean {
  return i.status === 'MAPEADO' || i.status === 'IGNORADO';
}

/**
 * Critério proposto no brief (mais estrito): MAPEADO com produto/fator/qtd válidos, ou IGNORADO.
 */
function itemProntoProposto(i: ItemRow): boolean {
  if (i.status === 'IGNORADO') return true;
  if (i.status !== 'MAPEADO') return false;
  const fator = num(i.fatorConversao);
  const qtd = num(i.quantidadeConvertida);
  return Boolean(i.estoqueInsumoId) && fator != null && fator > 0 && qtd != null && qtd > 0;
}

function motivoNaoAprovada(opts: {
  autoAprovar: boolean;
  itens: ItemRow[];
  alertasNota: string[];
  fornecedorIgnorarCmv: boolean;
}): { motivo: string; detalhes: string[] } {
  const { autoAprovar, itens, alertasNota, fornecedorIgnorarCmv } = opts;
  const detalhes: string[] = [];

  if (fornecedorIgnorarCmv) {
    return {
      motivo: 'fornecedor fora do CMV (deveria ser IGNORADA, não EM_REVISAO)',
      detalhes: [],
    };
  }

  const prontosUi = itens.filter(itemProntoUi).length;
  const total = itens.length;
  const mapeados = itens.filter((i) => i.status === 'MAPEADO').length;
  const ignorados = itens.filter((i) => i.status === 'IGNORADO').length;
  const sugeridos = itens.filter((i) => i.status === 'SUGERIDO').length;
  const semMap = itens.filter((i) => i.status === 'SEM_MAPEAMENTO').length;

  const alertasItens = new Set<string>();
  for (const i of itens) {
    const arr = Array.isArray(i.alertas) ? (i.alertas as string[]) : [];
    for (const a of arr) alertasItens.add(a);
  }
  const todosAlertas = [...new Set([...alertasNota, ...alertasItens])];

  if (!autoAprovar) {
    detalhes.push('NfeConfig.autoAprovar = false (pipeline nunca auto-aprova)');
  }

  if (prontosUi < total) {
    detalhes.push(
      `itens incompletos na UI: ${prontosUi}/${total} (MAPEADO=${mapeados}, IGNORADO=${ignorados}, SUGERIDO=${sugeridos}, SEM_MAP=${semMap})`,
    );
  }

  if (todosAlertas.length > 0) {
    detalhes.push(
      `alertas bloqueiam auto-aprovação atual: ${todosAlertas.join(', ')}`,
    );
  }

  // Motivo principal (regra atual do pipeline)
  let motivo: string;
  if (!autoAprovar && prontosUi === total && todosAlertas.length === 0) {
    motivo = 'autoAprovar desligado (itens 100% prontos, sem alertas)';
  } else if (!autoAprovar && prontosUi === total && todosAlertas.length > 0) {
    motivo = `autoAprovar desligado + alertas: ${todosAlertas.join(', ')}`;
  } else if (autoAprovar && prontosUi === total && todosAlertas.length > 0) {
    motivo = `bloqueada por alertas: ${todosAlertas.join(', ')}`;
  } else if (prontosUi < total) {
    motivo = `itens não prontos (${prontosUi}/${total})`;
  } else {
    motivo = 'EM_REVISAO por outro motivo (ver detalhes)';
  }

  // Diff UI vs regra proposta
  const falhaProposta = itens.filter((i) => itemProntoUi(i) && !itemProntoProposto(i));
  if (falhaProposta.length > 0) {
    detalhes.push(
      `${falhaProposta.length} item(ns) "pronto" na UI mas sem produto/fator/qtd válido (regra proposta)`,
    );
  }

  return { motivo, detalhes };
}

async function main() {
  const nfeConfig = await prisma.nfeConfig.findUnique({ where: { userId: OWNER } });
  const autoAprovar = nfeConfig?.autoAprovar ?? false;

  console.log('=== DIAGNÓSTICO EM_REVISAO (somente leitura) ===');
  console.log(`tenant: ${OWNER}`);
  console.log(`autoAprovar: ${autoAprovar}`);
  console.log(
    `tolerancias: totalR$=${nfeConfig?.toleranciaTotalReais} total%=${nfeConfig?.toleranciaTotalPercent} custo%=${nfeConfig?.limiteVariacaoCustoPercent}`,
  );
  console.log('');

  const notas = await prisma.nfeNota.findMany({
    where: {
      userId: OWNER,
      status: 'EM_REVISAO',
      storeSlug: { in: [...STORES] },
    },
    include: {
      fornecedor: {
        select: { razaoSocial: true, nomeFantasia: true, ignorarCmv: true },
      },
      itens: {
        select: {
          status: true,
          estoqueInsumoId: true,
          fatorConversao: true,
          quantidadeConvertida: true,
          alertas: true,
          descricao: true,
        },
      },
    },
    orderBy: [{ storeSlug: 'asc' }, { numero: 'asc' }],
  });

  type Row = {
    storeSlug: string;
    numero: string;
    fornecedor: string;
    ignorarCmv: boolean;
    prontosUi: number;
    prontosProp: number;
    total: number;
    alertasNota: string[];
    alertasItens: string[];
    motivo: string;
    detalhes: string[];
    competencia: string;
  };

  const rows: Row[] = notas.map((n) => {
    const alertasNota = Array.isArray(n.alertas) ? (n.alertas as string[]) : [];
    const alertasItens = [
      ...new Set(
        n.itens.flatMap((i) => (Array.isArray(i.alertas) ? (i.alertas as string[]) : [])),
      ),
    ];
    const { motivo, detalhes } = motivoNaoAprovada({
      autoAprovar,
      itens: n.itens,
      alertasNota,
      fornecedorIgnorarCmv: n.fornecedor.ignorarCmv,
    });
    return {
      storeSlug: n.storeSlug,
      numero: n.numero,
      fornecedor: n.fornecedor.nomeFantasia || n.fornecedor.razaoSocial,
      ignorarCmv: n.fornecedor.ignorarCmv,
      prontosUi: n.itens.filter(itemProntoUi).length,
      prontosProp: n.itens.filter(itemProntoProposto).length,
      total: n.itens.length,
      alertasNota,
      alertasItens,
      motivo,
      detalhes,
      competencia: n.competencia,
    };
  });

  // Resumo por loja
  for (const slug of STORES) {
    const loja = rows.filter((r) => r.storeSlug === slug);
    const xDeX = loja.filter((r) => r.prontosUi === r.total && r.total > 0);
    console.log(
      `## ${slug}: ${loja.length} EM_REVISAO | ${xDeX.length} com X/X prontos (UI)`,
    );
  }
  console.log(`TOTAL: ${rows.length} notas EM_REVISAO\n`);

  // Foco Ahú — lista do usuário
  console.log('=== AHÚ — 13 NFs citadas ===');
  for (const nf of AHU_FOCUS) {
    const r = rows.find((x) => x.storeSlug === 'ahu' && x.numero === nf);
    if (!r) {
      console.log(`NF ${nf}: NÃO ENCONTRADA em EM_REVISAO (ahu)`);
      continue;
    }
    console.log(
      `NF ${r.numero} | ${r.fornecedor} | ${r.prontosUi}/${r.total} prontos(UI) prop=${r.prontosProp}/${r.total} | comp=${r.competencia} | ignorarCmv=${r.ignorarCmv}`,
    );
    console.log(`  motivo: ${r.motivo}`);
    const alertas = [...r.alertasNota, ...r.alertasItens];
    if (alertas.length) console.log(`  alertas: ${alertas.join(', ')}`);
    for (const d of r.detalhes) console.log(`  · ${d}`);
  }

  const missing = [...AHU_FOCUS].filter(
    (nf) => !rows.some((r) => r.storeSlug === 'ahu' && r.numero === nf),
  );
  if (missing.length) {
    // checar outros status
    const outros = await prisma.nfeNota.findMany({
      where: { userId: OWNER, storeSlug: 'ahu', numero: { in: missing } },
      select: { numero: true, status: true },
    });
    console.log('\nNFs Ahú fora de EM_REVISAO:');
    for (const o of outros) console.log(`  ${o.numero} → ${o.status}`);
    for (const nf of missing.filter((n) => !outros.some((o) => o.numero === n))) {
      console.log(`  ${nf} → inexistente no tenant`);
    }
  }

  // Tabela completa
  console.log('\n=== TODAS EM_REVISAO (4 lojas) ===');
  console.log(
    [
      'loja',
      'nf',
      'fornecedor',
      'prontos',
      'autoAprovar',
      'alertas',
      'motivo',
    ].join('\t'),
  );
  for (const r of rows) {
    const alertas = [...new Set([...r.alertasNota, ...r.alertasItens])].join('|') || '-';
    console.log(
      [
        r.storeSlug,
        r.numero,
        r.fornecedor.replace(/\t/g, ' '),
        `${r.prontosUi}/${r.total}`,
        String(autoAprovar),
        alertas,
        r.motivo,
      ].join('\t'),
    );
  }

  // Motivos agregados
  console.log('\n=== MOTIVOS AGREGADOS ===');
  const agg = new Map<string, number>();
  for (const r of rows) agg.set(r.motivo, (agg.get(r.motivo) ?? 0) + 1);
  for (const [m, c] of [...agg.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`${c}\t${m}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
