/**
 * Remapeia "Mesinhas para Pizza - 500 und" → MESINHA (EMBALAGEM, fator 500).
 * npx tsx --env-file=.env scripts/remap-mesinha.ts
 */
import { Prisma, PrismaClient } from '@prisma/client';
import { ensureCmvRealInsumoConfig } from '../src/lib/nfe/cmv-catalogo';
import {
  chaveMapeamentoDesc,
  chaveMapeamentoEan,
  normalizarUnidade,
} from '../src/lib/nfe/normalize';

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

async function main() {
  const itens = await prisma.nfeItem.findMany({
    where: {
      nota: { userId: OWNER, numero: { in: ['646', '648'] } },
      descricao: { contains: 'Mesinha', mode: 'insensitive' },
    },
    include: { nota: { select: { id: true, numero: true, storeSlug: true, status: true, fornecedorId: true } } },
  });
  const ids = itens.map((i) => i.estoqueInsumoId).filter((x): x is string => !!x);
  const [insumos, cfgs] = await Promise.all([
    prisma.estoqueInsumo.findMany({
      where: { id: { in: ids } },
      select: { id: true, nome: true },
    }),
    prisma.cmvRealInsumoConfig.findMany({
      where: { estoqueInsumoId: { in: ids } },
      select: { estoqueInsumoId: true, secao: true },
    }),
  ]);
  const nome = new Map(insumos.map((i) => [i.id, i.nome]));
  const secao = new Map(cfgs.map((c) => [c.estoqueInsumoId, c.secao]));

  console.log('=== ITENS ANTES ===');
  for (const it of itens) {
    console.log({
      id: it.id,
      nf: it.nota.numero,
      loja: it.nota.storeSlug,
      notaStatus: it.nota.status,
      desc: it.descricao,
      qtd: Number(it.quantidade),
      uCom: it.unidadeComercial,
      produto: it.estoqueInsumoId ? nome.get(it.estoqueInsumoId) : null,
      secao: it.estoqueInsumoId ? secao.get(it.estoqueInsumoId) : null,
      fator: it.fatorConversao != null ? Number(it.fatorConversao) : null,
      qtdConv: it.quantidadeConvertida != null ? Number(it.quantidadeConvertida) : null,
      valor: it.valorLiquido != null ? Number(it.valorLiquido) : Number(it.valorBruto),
    });
  }

  const mesinha =
    (await prisma.estoqueInsumo.findFirst({
      where: { userId: OWNER, insumoId: 'mesinha' },
    })) ||
    (await prisma.estoqueInsumo.findFirst({
      where: { userId: OWNER, nome: { equals: 'MESINHA', mode: 'insensitive' } },
    }));
  if (!mesinha) throw new Error('Produto MESINHA não encontrado no catálogo');
  await ensureCmvRealInsumoConfig({
    tenantUserId: OWNER,
    estoqueInsumoId: mesinha.id,
    secao: 'EMBALAGEM',
    unidade: 'UN',
  });
  console.log('MESINHA', mesinha.id, mesinha.nome);

  const antes = await comprasPorLojaSecao();
  console.log('=== ANTES compras R$ ===', JSON.stringify(antes, null, 2));

  const fator = 500;
  for (const it of itens) {
    const und = normalizarUnidade(it.unidadeComercial);
    const chave = it.ean
      ? chaveMapeamentoEan(it.ean, und)
      : chaveMapeamentoDesc(it.descricaoNormalizada, und);
    const qtdConv = Number(it.quantidade) * fator;
    const liq = it.valorLiquido != null ? Number(it.valorLiquido) : Number(it.valorBruto);

    const map = await prisma.nfeMapeamento.upsert({
      where: {
        userId_fornecedorId_chave: {
          userId: OWNER,
          fornecedorId: it.nota.fornecedorId,
          chave,
        },
      },
      create: {
        userId: OWNER,
        fornecedorId: it.nota.fornecedorId,
        chave,
        ean: it.ean,
        descricaoNormalizada: it.descricaoNormalizada,
        unidadeComercial: und,
        estoqueInsumoId: mesinha.id,
        fatorConversao: decimal(fator),
        usos: 1,
        ultimoUsoEm: new Date(),
        criadoPorId: OWNER,
      },
      update: {
        estoqueInsumoId: mesinha.id,
        fatorConversao: decimal(fator),
        unidadeComercial: und,
        usos: { increment: 1 },
        ultimoUsoEm: new Date(),
      },
    });

    await prisma.nfeItem.update({
      where: { id: it.id },
      data: {
        status: 'MAPEADO',
        estoqueInsumoId: mesinha.id,
        mapeamentoId: map.id,
        fatorConversao: decimal(fator),
        quantidadeConvertida: decimal(qtdConv),
        unidadeConvertida: 'UN',
        custoUnitario: qtdConv > 0 ? decimal(liq / qtdConv) : null,
        alertas: [],
      },
    });

    const lanc = await prisma.cmvLancamento.findUnique({
      where: { nfeItemId: it.id },
    });
    if (lanc) {
      await prisma.cmvLancamento.update({
        where: { id: lanc.id },
        data: {
          estoqueInsumoId: mesinha.id,
          quantidade: decimal(qtdConv),
          unidade: 'UN',
          valorTotal: decimal(liq),
        },
      });
    }
    console.log('ok', it.nota.numero, it.nota.storeSlug, 'qtd', Number(it.quantidade), '→', qtdConv, 'un');
  }

  const depois = await comprasPorLojaSecao();
  console.log('=== DEPOIS compras R$ ===', JSON.stringify(depois, null, 2));
  console.log('=== DIFF ===');
  for (const loja of new Set([...Object.keys(antes), ...Object.keys(depois)])) {
    for (const s of ['MATERIA_PRIMA', 'EMBALAGEM', 'BEBIDA', 'SEM_SECAO']) {
      const a = antes[loja]?.[s] ?? 0;
      const b = depois[loja]?.[s] ?? 0;
      if (Math.abs(a - b) > 0.009) {
        console.log(loja, s, a.toFixed(2), '→', b.toFixed(2), 'Δ', (b - a).toFixed(2));
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
