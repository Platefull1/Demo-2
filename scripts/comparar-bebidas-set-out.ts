/**
 * Setembro × outubro — bebidas (só leitura).
 * npx tsx --env-file=.env scripts/comparar-bebidas-set-out.ts
 */
import { PrismaClient } from '@prisma/client';
import {
  fetchSalesForCompetencia,
  type SaiposStoreSlug,
} from '../src/lib/saipos/dataApi';
import {
  parseRefeicaoRegras,
  parseVendaMesConfig,
  valorVendaParaMes,
  type SaiposSaleLike,
} from '../src/lib/cmv-real/refeicoes';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const LOJAS = ['ahu', 'pilarzinho', 'portao', 'uberaba'] as const;
const prisma = new PrismaClient();

const ALVOS: Record<string, { nomes: string[]; desc: RegExp }> = {
  'COCA 2L': {
    nomes: ['COCA 2 LITROS'],
    desc: /COCA[- ]?COLA ORIGINAL PET 2L|COCA-COLA ORIGINAL PET 2L|COCA COLA ORIGINAL.*2L/i,
  },
  'COCA 2L ZERO': {
    nomes: ['COCA 2 LITROS ZERO'],
    desc: /COCA[- ]?COLA ZERO PET 2L|COCA COLA ZERO.*2L/i,
  },
  'SPRITE 2L': {
    nomes: ['SPRITE 2 LITROS'],
    desc: /SPRITE ORIGINAL 2L|SPRITE(?!.*ZERO).*2L/i,
  },
  'SPRITE 2L ZERO': {
    nomes: ['SPRITE 2 LITROS ZERO', 'SPRITE ZERO 2 LITROS', 'SPRITE ZERO 2L'],
    desc: /SPRITE.*ZERO.*2L/i,
  },
};

function n(v: unknown) {
  return Number(v ?? 0);
}

function isCoca2lNome(nome: string) {
  const u = nome.toUpperCase();
  return u.includes('COCA 2 LITROS') && !u.includes('ZERO');
}

function classificarAlvo(produto: string | null, desc: string): string | null {
  const p = (produto || '').toUpperCase();
  if (p.includes('COCA 2 LITROS ZERO')) return 'COCA 2L ZERO';
  if (isCoca2lNome(p)) return 'COCA 2L';
  if (p.includes('SPRITE') && p.includes('ZERO')) return 'SPRITE 2L ZERO';
  if (p === 'SPRITE 2 LITROS' || (p.includes('SPRITE 2') && !p.includes('ZERO'))) {
    return 'SPRITE 2L';
  }
  for (const [k, spec] of Object.entries(ALVOS)) {
    if (spec.desc.test(desc)) {
      if (k === 'SPRITE 2L' && /ZERO/i.test(desc)) continue;
      if (k === 'COCA 2L' && /ZERO/i.test(desc)) continue;
      return k;
    }
  }
  return null;
}

async function vendaSaipos(loja: SaiposStoreSlug, competencia: string) {
  const config = await prisma.nfeConfig.findUnique({ where: { userId: OWNER } });
  const regras = parseRefeicaoRegras(config?.refeicaoRegras);
  const vendaCfg = parseVendaMesConfig(config?.vendaMesConfig);
  const sales = (await fetchSalesForCompetencia({
    storeSlug: loja,
    competencia,
  })) as SaiposSaleLike[];
  let total = 0;
  let ate21 = 0;
  for (const s of sales) {
    const v = valorVendaParaMes(s, { regras, config: vendaCfg });
    total += v;
    const d = String(s.shift_date || s.created_at || '').slice(0, 10);
    if (competencia === '2026-10' && d && d <= '2026-10-21') ate21 += v;
    if (competencia !== '2026-10') ate21 += v;
  }
  return {
    n: sales.length,
    venda: Math.round(total * 100) / 100,
    vendaAte21: Math.round(ate21 * 100) / 100,
  };
}

async function vendaFechamento(loja: string, competencia: string) {
  const f = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: OWNER,
        storeSlug: loja,
        competencia,
      },
    },
    select: { vendaMes: true, vendaMesOrigem: true },
  });
  return {
    venda: f?.vendaMes != null ? n(f.vendaMes) : null,
    origem: f?.vendaMesOrigem ?? null,
  };
}

type AccAlvo = { qtd: number; valor: number; itens: number };

async function main() {
  const cfgs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER },
    include: { estoqueInsumo: { select: { id: true, nome: true } } },
  });
  const secao = new Map(cfgs.map((c) => [c.estoqueInsumoId, c.secao]));
  const nome = new Map(cfgs.map((c) => [c.estoqueInsumoId, c.estoqueInsumo.nome]));

  const notasSet = await prisma.nfeNota.findMany({
    where: { userId: OWNER, competencia: '2026-09' },
    select: { id: true, storeSlug: true, status: true, numero: true },
  });
  console.log(
    'notas set',
    notasSet.length,
    'por status',
    notasSet.reduce<Record<string, number>>((a, n0) => {
      a[n0.status] = (a[n0.status] ?? 0) + 1;
      return a;
    }, {}),
  );

  const itensSet = await prisma.nfeItem.findMany({
    where: { nota: { userId: OWNER, competencia: '2026-09' } },
    include: {
      nota: { select: { storeSlug: true, numero: true, status: true, dataEntrada: true } },
    },
  });

  const setLoja: Record<
    string,
    { bebida: number; todos: number; semMapBebida: number; alvos: Record<string, AccAlvo> }
  > = {};
  for (const loja of LOJAS) {
    setLoja[loja] = {
      bebida: 0,
      todos: 0,
      semMapBebida: 0,
      alvos: {
        'COCA 2L': { qtd: 0, valor: 0, itens: 0 },
        'COCA 2L ZERO': { qtd: 0, valor: 0, itens: 0 },
        'SPRITE 2L': { qtd: 0, valor: 0, itens: 0 },
        'SPRITE 2L ZERO': { qtd: 0, valor: 0, itens: 0 },
      },
    };
  }

  for (const it of itensSet) {
    const loja = it.nota.storeSlug;
    if (!setLoja[loja]) continue;
    const valor = it.valorLiquido != null ? n(it.valorLiquido) : n(it.valorBruto);
    const sec = it.estoqueInsumoId ? secao.get(it.estoqueInsumoId) : null;
    const prod = it.estoqueInsumoId ? nome.get(it.estoqueInsumoId) || null : null;
    if (sec === 'BEBIDA') setLoja[loja].bebida += valor;
    setLoja[loja].todos += valor;
    if (sec !== 'BEBIDA' && classificarAlvo(prod, it.descricao)) {
      setLoja[loja].semMapBebida += valor;
    }
    const alvo = classificarAlvo(prod, it.descricao);
    if (alvo) {
      const qtd = it.quantidadeConvertida != null ? n(it.quantidadeConvertida) : n(it.quantidade);
      setLoja[loja].alvos[alvo].qtd += qtd;
      setLoja[loja].alvos[alvo].valor += valor;
      setLoja[loja].alvos[alvo].itens += 1;
    }
  }

  const lancOut = await prisma.cmvLancamento.findMany({
    where: {
      userId: OWNER,
      competencia: '2026-10',
      tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
      data: { lte: new Date('2026-10-21T23:59:59.999Z') },
    },
    select: {
      storeSlug: true,
      valorTotal: true,
      quantidade: true,
      estoqueInsumoId: true,
      nfeItemId: true,
    },
  });

  const outLoja: Record<
    string,
    { bebida: number; alvos: Record<string, AccAlvo> }
  > = {};
  for (const loja of LOJAS) {
    outLoja[loja] = {
      bebida: 0,
      alvos: {
        'COCA 2L': { qtd: 0, valor: 0, itens: 0 },
        'COCA 2L ZERO': { qtd: 0, valor: 0, itens: 0 },
        'SPRITE 2L': { qtd: 0, valor: 0, itens: 0 },
        'SPRITE 2L ZERO': { qtd: 0, valor: 0, itens: 0 },
      },
    };
  }

  const itemIds = lancOut.map((l) => l.nfeItemId).filter((x): x is string => !!x);
  const itensOut = await prisma.nfeItem.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, descricao: true },
  });
  const descBy = new Map(itensOut.map((i) => [i.id, i.descricao]));

  for (const l of lancOut) {
    const loja = l.storeSlug;
    if (!outLoja[loja]) continue;
    const sec = secao.get(l.estoqueInsumoId);
    const prod = nome.get(l.estoqueInsumoId) || null;
    const desc = l.nfeItemId ? descBy.get(l.nfeItemId) || '' : '';
    if (sec === 'BEBIDA') outLoja[loja].bebida += n(l.valorTotal);
    const alvo = classificarAlvo(prod, desc);
    if (alvo) {
      outLoja[loja].alvos[alvo].qtd += n(l.quantidade);
      outLoja[loja].alvos[alvo].valor += n(l.valorTotal);
      outLoja[loja].alvos[alvo].itens += 1;
    }
  }

  console.log('=== COMPRAS BEBIDA R$ ===');
  console.log(JSON.stringify({ set: setLoja, out: outLoja }, null, 2));

  const fechSet: Record<string, Awaited<ReturnType<typeof vendaFechamento>>> = {};
  const fechOut: Record<string, Awaited<ReturnType<typeof vendaFechamento>>> = {};
  for (const loja of LOJAS) {
    fechSet[loja] = await vendaFechamento(loja, '2026-09');
    fechOut[loja] = await vendaFechamento(loja, '2026-10');
  }
  console.log('=== FECHAMENTO venda ===', { set: fechSet, out: fechOut });

  const saiposSet: Record<string, unknown> = {};
  const saiposOut: Record<string, unknown> = {};
  for (const loja of LOJAS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        saiposSet[loja] = await vendaSaipos(loja, '2026-09');
        break;
      } catch (e) {
        console.log('saipos set', loja, attempt, e instanceof Error ? e.message : e);
        if (attempt === 3) saiposSet[loja] = { error: String(e) };
        else await new Promise((r) => setTimeout(r, 6000 * attempt));
      }
    }
    if (fechOut[loja].origem === 'SAIPOS' && fechOut[loja].venda != null) {
      saiposOut[loja] = {
        n: null,
        venda: fechOut[loja].venda,
        vendaAte21: fechOut[loja].venda,
        via: 'fechamento',
      };
    } else {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          saiposOut[loja] = { ...(await vendaSaipos(loja, '2026-10')), via: 'api' };
          break;
        } catch (e) {
          console.log('saipos out', loja, attempt, e instanceof Error ? e.message : e);
          if (attempt === 3) saiposOut[loja] = { error: String(e) };
          else await new Promise((r) => setTimeout(r, 6000 * attempt));
        }
      }
    }
  }
  console.log('=== SAIPOS venda ===', JSON.stringify({ set: saiposSet, out: saiposOut }, null, 2));

  const DIAS_SET = 30;
  const DIAS_OUT = 21;
  console.log('=== RATIO e UN/DIA ===');
  for (const loja of LOJAS) {
    const vs = (saiposSet[loja] as { venda?: number } | undefined)?.venda ?? fechSet[loja].venda;
    const vo = (saiposOut[loja] as { vendaAte21?: number; venda?: number } | undefined)?.vendaAte21
      ?? (saiposOut[loja] as { venda?: number } | undefined)?.venda
      ?? fechOut[loja].venda;
    const cs = setLoja[loja].bebida;
    const co = outLoja[loja].bebida;
    const pctS = vs && vs > 0 ? cs / vs : null;
    const pctO = vo && vo > 0 ? co / vo : null;
    console.log(loja, {
      setCompra: Number(cs.toFixed(2)),
      setVenda: vs,
      setPct: pctS != null ? Number((pctS * 100).toFixed(2)) : null,
      outCompra: Number(co.toFixed(2)),
      outVenda: vo,
      outPct: pctO != null ? Number((pctO * 100).toFixed(2)) : null,
    });
    for (const k of Object.keys(ALVOS)) {
      const a = setLoja[loja].alvos[k];
      const b = outLoja[loja].alvos[k];
      console.log(' ', k, {
        setUn: Number(a.qtd.toFixed(2)),
        setR: Number(a.valor.toFixed(2)),
        setCusto: a.qtd > 0 ? Number((a.valor / a.qtd).toFixed(4)) : null,
        setUnDia: Number((a.qtd / DIAS_SET).toFixed(2)),
        outUn: Number(b.qtd.toFixed(2)),
        outR: Number(b.valor.toFixed(2)),
        outCusto: b.qtd > 0 ? Number((b.valor / b.qtd).toFixed(4)) : null,
        outUnDia: Number((b.qtd / DIAS_OUT).toFixed(2)),
      });
    }
  }

  console.log('=== AHU set vs planilha 24954.72 ===');
  console.log({
    comprasBebidaMapeada: Number(setLoja.ahu.bebida.toFixed(2)),
    itensBebidaSemSecao: Number(setLoja.ahu.semMapBebida.toFixed(2)),
    todasNotasSet: Number(setLoja.ahu.todos.toFixed(2)),
    planilha: 24954.72,
    deltaBebida: Number((setLoja.ahu.bebida - 24954.72).toFixed(2)),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
