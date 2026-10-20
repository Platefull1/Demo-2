/**
 * B) Reabre Ahú 2026-10 + aplica reavaliação CMV Real.
 * npx tsx --env-file=.env scripts/apply-reavaliar-cmv.ts
 */
import { Prisma, PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { itemEstaPronto, motivoItemNaoPronto } from '../src/lib/nfe/item-pronto';
import { reavaliarNotasCmvReal } from '../src/lib/nfe/reavaliar';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const STORES = ['ahu', 'pilarzinho', 'portao', 'uberaba'] as const;
const COMP = '2026-10';
const MOTIVO =
  'Fechado antes do fim do mês — reaberto para aplicar aprovação automática';

const prisma = new PrismaClient();

async function comprasPorLojaSecao(): Promise<
  Record<string, Record<string, number>>
> {
  const lancs = await prisma.cmvLancamento.findMany({
    where: {
      userId: OWNER,
      competencia: COMP,
      tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
      storeSlug: { in: [...STORES] },
    },
    select: {
      storeSlug: true,
      valorTotal: true,
      estoqueInsumoId: true,
    },
  });
  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER },
    select: { estoqueInsumoId: true, secao: true },
  });
  const secaoBy = new Map(configs.map((c) => [c.estoqueInsumoId, c.secao]));

  const out: Record<string, Record<string, number>> = {};
  for (const s of STORES) {
    out[s] = { MATERIA_PRIMA: 0, EMBALAGEM: 0, BEBIDA: 0, SEM_SECAO: 0 };
  }
  for (const l of lancs) {
    const secao = secaoBy.get(l.estoqueInsumoId) || 'SEM_SECAO';
    if (!out[l.storeSlug]) {
      out[l.storeSlug] = { MATERIA_PRIMA: 0, EMBALAGEM: 0, BEBIDA: 0, SEM_SECAO: 0 };
    }
    out[l.storeSlug][secao] =
      (out[l.storeSlug][secao] ?? 0) + Number(l.valorTotal);
  }
  return out;
}

function fmtMoney(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function main() {
  // --- Log fechamento Ahú ---
  const fech = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: OWNER,
        storeSlug: 'ahu',
        competencia: COMP,
      },
    },
  });
  if (!fech) throw new Error('Fechamento Ahú 2026-10 não encontrado');

  let quem = fech.fechadoPorId ?? '(desconhecido)';
  if (fech.fechadoPorId) {
    const u = await prisma.user.findUnique({
      where: { id: fech.fechadoPorId },
      select: { email: true, name: true },
    });
    if (u) quem = `${u.email}${u.name ? ` (${u.name})` : ''} [${fech.fechadoPorId}]`;
  }
  const quando = fech.fechadoEm
    ? fech.fechadoEm.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    : '(sem data)';

  console.log('=== LOG FECHAMENTO Ahú 2026-10 ===');
  console.log(`status: ${fech.status}`);
  console.log(`fechadoPor: ${quem}`);
  console.log(`fechadoEm: ${quando} (America/Sao_Paulo)`);
  console.log(`snapshot presente: ${fech.snapshot != null}`);
  console.log('');

  // --- Compras ANTES ---
  const antes = await comprasPorLojaSecao();
  console.log('=== COMPRAS out/2026 ANTES ===');
  for (const s of STORES) {
    const a = antes[s];
    console.log(
      `${s}\tMP ${fmtMoney(a.MATERIA_PRIMA)}\tEmb ${fmtMoney(a.EMBALAGEM)}\tBeb ${fmtMoney(a.BEBIDA)}\tTotal ${fmtMoney(a.MATERIA_PRIMA + a.EMBALAGEM + a.BEBIDA + (a.SEM_SECAO || 0))}`,
    );
  }
  console.log('');

  // --- Reabrir Ahú ---
  const ajustesAtuais = Array.isArray(fech.ajustes) ? [...(fech.ajustes as object[])] : [];
  ajustesAtuais.push({
    id: randomUUID(),
    secao: 'GERAL',
    descricao: MOTIVO,
    valor: 0,
    criadoPorId: 'script-apply-reavaliar-cmv',
    criadoEm: new Date().toISOString(),
  });

  await prisma.cmvFechamento.update({
    where: { id: fech.id },
    data: {
      status: 'ABERTO',
      fechadoEm: null,
      fechadoPorId: null,
      snapshot: Prisma.DbNull,
      ajustes: ajustesAtuais,
    },
  });
  console.log('Ahú 2026-10 reaberto; snapshot apagado; motivo registrado em ajustes.');
  console.log('');

  // --- Apply ---
  const r = await reavaliarNotasCmvReal({
    userId: OWNER,
    dryRun: false,
  });

  console.log('=== RESULTADO APPLY ===');
  console.log(
    'loja|comp\taprovadas\tcom_alerta\tignoradas\tem_revisao\tanterior_cmv',
  );
  for (const key of Object.keys(r.porLojaComp).sort()) {
    const c = r.porLojaComp[key];
    console.log(
      [
        key,
        c.aprovadas,
        c.aprovadasComAlerta,
        c.ignoradas,
        c.emRevisao,
        c.anteriorCmv,
      ].join('\t'),
    );
  }
  console.log('TOTAIS', r.totais);
  console.log('');

  // Aceite Ahú 13
  const ahu13 = [
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
  ];
  console.log('=== Aceite Ahú 13 ===');
  for (const nf of ahu13) {
    const l = r.linhas.find((x) => x.storeSlug === 'ahu' && x.numero === nf);
    console.log(
      l
        ? `NF ${nf}: ${l.decisao}${l.alertas.length ? ` [${l.alertas.join(',')}]` : ''}`
        : `NF ${nf}: não na lista do apply`,
    );
  }
  // status real no banco
  const ahuDb = await prisma.nfeNota.findMany({
    where: { userId: OWNER, storeSlug: 'ahu', numero: { in: ahu13 } },
    select: {
      numero: true,
      status: true,
      aprovadaComAlerta: true,
      aprovacaoAutomatica: true,
    },
  });
  console.log('DB Ahú 13:');
  for (const n of ahuDb.sort((a, b) => a.numero.localeCompare(b.numero))) {
    console.log(
      `  ${n.numero}: ${n.status} auto=${n.aprovacaoAutomatica} alerta=${n.aprovadaComAlerta}`,
    );
  }
  console.log('');

  // Em revisão — detalhe itens faltando
  const emRev = await prisma.nfeNota.findMany({
    where: {
      userId: OWNER,
      status: 'EM_REVISAO',
      storeSlug: { in: [...STORES] },
      competencia: { gte: '2026-10' },
    },
    include: {
      fornecedor: { select: { razaoSocial: true, nomeFantasia: true } },
      itens: {
        select: {
          descricao: true,
          status: true,
          estoqueInsumoId: true,
          fatorConversao: true,
          quantidadeConvertida: true,
        },
      },
    },
    orderBy: [{ storeSlug: 'asc' }, { numero: 'asc' }],
  });

  console.log(`=== EM_REVISAO >= 2026-10 (${emRev.length}) ===`);
  for (const n of emRev) {
    const prontos = n.itens.filter((i) => itemEstaPronto(i)).length;
    const faltam = n.itens
      .filter((i) => !itemEstaPronto(i))
      .map((i) => {
        const m = motivoItemNaoPronto(i) || i.status;
        return `${i.descricao.slice(0, 50)} (${m})`;
      });
    const forn = n.fornecedor.nomeFantasia || n.fornecedor.razaoSocial;
    console.log(
      `${n.storeSlug}\tNF ${n.numero}\t${forn}\t${prontos}/${n.itens.length}`,
    );
    for (const f of faltam) console.log(`    - ${f}`);
  }
  console.log('');

  // Compras DEPOIS
  const depois = await comprasPorLojaSecao();
  console.log('=== COMPRAS out/2026 DEPOIS ===');
  for (const s of STORES) {
    const a = antes[s];
    const d = depois[s];
    console.log(`## ${s}`);
    for (const sec of ['MATERIA_PRIMA', 'EMBALAGEM', 'BEBIDA'] as const) {
      const delta = d[sec] - a[sec];
      console.log(
        `  ${sec}: antes ${fmtMoney(a[sec])} → depois ${fmtMoney(d[sec])} (Δ ${fmtMoney(delta)})`,
      );
    }
    const totA = a.MATERIA_PRIMA + a.EMBALAGEM + a.BEBIDA;
    const totD = d.MATERIA_PRIMA + d.EMBALAGEM + d.BEBIDA;
    console.log(
      `  TOTAL: antes ${fmtMoney(totA)} → depois ${fmtMoney(totD)} (Δ ${fmtMoney(totD - totA)})`,
    );
  }

  // Idempotência smoke: 2ª passada
  console.log('\n=== 2ª passagem (idempotência) ===');
  const r2 = await reavaliarNotasCmvReal({ userId: OWNER, dryRun: false });
  console.log('TOTAIS 2ª', r2.totais);
  const depois2 = await comprasPorLojaSecao();
  for (const s of STORES) {
    const d = depois[s];
    const d2 = depois2[s];
    const tot1 = d.MATERIA_PRIMA + d.EMBALAGEM + d.BEBIDA;
    const tot2 = d2.MATERIA_PRIMA + d2.EMBALAGEM + d2.BEBIDA;
    console.log(
      `${s}: total pass1 ${fmtMoney(tot1)} pass2 ${fmtMoney(tot2)} equal=${Math.abs(tot1 - tot2) < 0.01}`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
