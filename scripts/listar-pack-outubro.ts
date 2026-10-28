/**
 * Lista ABACAXI / CREME DE LEITE / PÊSSEGO / SÊMOLA em outubro (só leitura).
 * npx tsx --env-file=.env scripts/listar-pack-outubro.ts
 */
import { PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const COMP = '2026-10';
const prisma = new PrismaClient();

function n(v: unknown) {
  return Number(v ?? 0);
}

function matchProduto(nome: string, desc: string) {
  const t = `${nome} ${desc}`.toUpperCase();
  if (t.includes('ABACAXI')) return 'ABACAXI';
  if (t.includes('CREME DE LEITE') || t.includes('CREME LEITE')) return 'CREME DE LEITE';
  if (t.includes('PESSEGO') || t.includes('PÊSSEGO')) return 'PÊSSEGO EM CALDA';
  if (t.includes('SEMOLA') || t.includes('SÊMOLA') || t.includes('SEMOL')) return 'SÊMOLA';
  return null;
}

async function main() {
  const itens = await prisma.nfeItem.findMany({
    where: {
      nota: { userId: OWNER, competencia: COMP },
      status: { in: ['MAPEADO', 'SUGERIDO'] },
    },
    include: {
      nota: { select: { numero: true, storeSlug: true } },
    },
  });
  const insumos = await prisma.estoqueInsumo.findMany({
    where: { userId: OWNER },
    select: { id: true, nome: true },
  });
  const nomeById = new Map(insumos.map((i) => [i.id, i.nome]));

  const rows = [];
  for (const it of itens) {
    const prod = matchProduto(nomeById.get(it.estoqueInsumoId || '') || '', it.descricao);
    if (!prod) continue;
    const qtd = n(it.quantidade);
    const valor = it.valorLiquido != null ? n(it.valorLiquido) : n(it.valorBruto);
    const vu = qtd > 0 ? valor / qtd : null;
    const kg = it.quantidadeConvertida != null ? n(it.quantidadeConvertida) : null;
    const custoKg = it.custoUnitario != null ? n(it.custoUnitario) : kg && kg > 0 ? valor / kg : null;
    rows.push({
      produto: prod,
      loja: it.nota.storeSlug,
      nf: it.nota.numero,
      uCom: it.unidadeComercial,
      qtd,
      vuNf: vu,
      fator: it.fatorConversao != null ? n(it.fatorConversao) : null,
      kg,
      custoKg,
      desc: it.descricao,
    });
  }
  rows.sort((a, b) => a.produto.localeCompare(b.produto) || a.loja.localeCompare(b.loja) || a.nf.localeCompare(b.nf));
  console.log(JSON.stringify(rows, null, 2));
  console.log('total', rows.length);
}

main().finally(() => prisma.$disconnect());
