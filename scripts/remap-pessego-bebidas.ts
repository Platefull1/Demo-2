/**
 * Cria CHÁ PÊSSEGO ZERO 1,5, mapeia Ice Zero fator 6, confirma NF 9628373.
 * DV e Ice Tea comum já estão em BEBIDA — só relata.
 * npx tsx --env-file=.env scripts/remap-pessego-bebidas.ts
 */
import { Prisma, PrismaClient } from '@prisma/client';
import { gerarLancamentosAprovacao } from '../src/lib/nfe/approve';
import { ensureCmvRealInsumoConfig } from '../src/lib/nfe/cmv-catalogo';
import { chaveMapeamentoEan, normalizarUnidade } from '../src/lib/nfe/normalize';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const COMP = '2026-10';
const prisma = new PrismaClient();

function decimal(n: number) {
  return new Prisma.Decimal(n);
}

async function comprasPorLojaSecao() {
  const lancs = await prisma.cmvLancamento.findMany({
    where: {
      userId: OWNER,
      competencia: COMP,
      tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
    },
    select: { storeSlug: true, valorTotal: true, estoqueInsumoId: true },
  });
  const cfgs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER },
    select: { estoqueInsumoId: true, secao: true },
  });
  const secao = new Map(cfgs.map((c) => [c.estoqueInsumoId, c.secao]));
  const out: Record<string, Record<string, number>> = {};
  for (const l of lancs) {
    const s = secao.get(l.estoqueInsumoId) || 'SEM_SECAO';
    out[l.storeSlug] ??= { MATERIA_PRIMA: 0, EMBALAGEM: 0, BEBIDA: 0, SEM_SECAO: 0 };
    out[l.storeSlug][s] = (out[l.storeSlug][s] ?? 0) + Number(l.valorTotal);
  }
  return out;
}

async function ensureProduto(nome: string, slug: string) {
  const existing = await prisma.estoqueInsumo.findFirst({
    where: { userId: OWNER, insumoId: slug },
  });
  if (existing) {
    await ensureCmvRealInsumoConfig({
      tenantUserId: OWNER,
      estoqueInsumoId: existing.id,
      secao: 'BEBIDA',
      unidade: 'UN',
    });
    return existing;
  }
  const created = await prisma.estoqueInsumo.create({
    data: {
      userId: OWNER,
      insumoId: slug,
      nome,
      unidade: 'un',
      categoriaId: 'bebidas',
      categoriaNome: 'Bebidas',
      categoriaIcone: 'cup-soda',
    },
  });
  await ensureCmvRealInsumoConfig({
    tenantUserId: OWNER,
    estoqueInsumoId: created.id,
    secao: 'BEBIDA',
    unidade: 'UN',
  });
  return created;
}

async function main() {
  const alvos = await prisma.nfeItem.findMany({
    where: {
      nota: { userId: OWNER, competencia: COMP },
      OR: [
        { descricao: { contains: 'ICE', mode: 'insensitive' } },
        { descricao: { contains: 'DV PESSEGO', mode: 'insensitive' } },
        { descricao: { contains: 'DV PÊSSEGO', mode: 'insensitive' } },
        { id: 'cmv9odzuh00hyl906dsqgcxeo' },
      ],
    },
    include: {
      nota: { select: { numero: true, storeSlug: true, status: true } },
    },
  });
  const cfgIds = alvos.map((i) => i.estoqueInsumoId).filter((x): x is string => !!x);
  const [cfgs, insumos] = await Promise.all([
    prisma.cmvRealInsumoConfig.findMany({
      where: { userId: OWNER, estoqueInsumoId: { in: cfgIds } },
      select: { estoqueInsumoId: true, secao: true },
    }),
    prisma.estoqueInsumo.findMany({
      where: { id: { in: cfgIds } },
      select: { id: true, nome: true },
    }),
  ]);
  const secao = new Map(cfgs.map((c) => [c.estoqueInsumoId, c.secao]));
  const nomes = new Map(insumos.map((i) => [i.id, i.nome]));
  console.log('=== ITENS DV/ICE ===');
  for (const it of alvos) {
    console.log(
      JSON.stringify({
        id: it.id,
        nf: it.nota.numero,
        loja: it.nota.storeSlug,
        notaStatus: it.nota.status,
        desc: it.descricao,
        uCom: it.unidadeComercial,
        status: it.status,
        produto: it.estoqueInsumoId ? nomes.get(it.estoqueInsumoId) || null : null,
        secao: it.estoqueInsumoId ? secao.get(it.estoqueInsumoId) || null : null,
        fator: it.fatorConversao != null ? Number(it.fatorConversao) : null,
        valor: it.valorLiquido != null ? Number(it.valorLiquido) : Number(it.valorBruto),
      }),
    );
  }

  const antes = await comprasPorLojaSecao();
  console.log('=== ANTES compras R$ ===');
  console.log(JSON.stringify(antes, null, 2));

  const zero = await ensureProduto('CHÁ PÊSSEGO ZERO 1,5', 'cha-pessego-zero-15');
  console.log('produto Ice Zero', zero.id, zero.nome);

  const item = await prisma.nfeItem.findFirst({
    where: {
      id: 'cmv9odzuh00hyl906dsqgcxeo',
      nota: { userId: OWNER },
    },
    include: { nota: true },
  });
  if (!item) throw new Error('item Ice Zero não encontrado');

  const und = normalizarUnidade(item.unidadeComercial);
  const fator = 6;
  const qtdConv = Number(item.quantidade) * fator;
  const liq = item.valorLiquido != null ? Number(item.valorLiquido) : Number(item.valorBruto);
  const chave = item.ean
    ? chaveMapeamentoEan(item.ean, und)
    : `desc:${item.descricaoNormalizada}|${und}`;

  const map = await prisma.nfeMapeamento.upsert({
    where: {
      userId_fornecedorId_chave: {
        userId: OWNER,
        fornecedorId: item.nota.fornecedorId,
        chave,
      },
    },
    create: {
      userId: OWNER,
      fornecedorId: item.nota.fornecedorId,
      chave,
      ean: item.ean,
      descricaoNormalizada: item.descricaoNormalizada,
      unidadeComercial: und,
      estoqueInsumoId: zero.id,
      fatorConversao: decimal(fator),
      usos: 1,
      ultimoUsoEm: new Date(),
      criadoPorId: OWNER,
    },
    update: {
      estoqueInsumoId: zero.id,
      fatorConversao: decimal(fator),
      unidadeComercial: und,
      usos: { increment: 1 },
      ultimoUsoEm: new Date(),
    },
  });

  await prisma.nfeItem.update({
    where: { id: item.id },
    data: {
      status: 'MAPEADO',
      estoqueInsumoId: zero.id,
      mapeamentoId: map.id,
      fatorConversao: decimal(fator),
      quantidadeConvertida: decimal(qtdConv),
      unidadeConvertida: 'UN',
      custoUnitario: qtdConv > 0 ? decimal(liq / qtdConv) : null,
      alertas: [],
    },
  });

  const pend = await prisma.nfeItem.count({
    where: {
      notaId: item.notaId,
      status: { in: ['SUGERIDO', 'SEM_MAPEAMENTO'] },
    },
  });
  if (pend === 0 && item.nota.status !== 'APROVADA') {
    await prisma.nfeNota.update({
      where: { id: item.notaId },
      data: {
        status: 'APROVADA',
        aprovadaEm: new Date(),
        aprovadaPorId: OWNER,
      },
    });
    const n = await gerarLancamentosAprovacao({
      userId: OWNER,
      notaId: item.notaId,
      storeSlug: item.nota.storeSlug,
      competencia: item.nota.competencia,
      dataEntrada: item.nota.dataEntrada,
    });
    console.log('NF 9628373 aprovada; lançamentos', n);
  } else {
    console.log('pendentes restantes', pend, 'status nota', item.nota.status);
  }

  const depois = await comprasPorLojaSecao();
  console.log('=== DEPOIS compras R$ ===');
  console.log(JSON.stringify(depois, null, 2));
  console.log('=== DIFF ===');
  for (const loja of new Set([...Object.keys(antes), ...Object.keys(depois)])) {
    for (const secao of ['MATERIA_PRIMA', 'EMBALAGEM', 'BEBIDA', 'SEM_SECAO']) {
      const a = antes[loja]?.[secao] ?? 0;
      const b = depois[loja]?.[secao] ?? 0;
      if (Math.abs(a - b) > 0.009) {
        console.log(loja, secao, a.toFixed(2), '→', b.toFixed(2), 'Δ', (b - a).toFixed(2));
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
