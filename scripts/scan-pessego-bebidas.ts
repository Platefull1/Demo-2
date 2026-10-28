/**
 * Catálogo + itens pêssego/ice de outubro (leitura).
 * npx tsx --env-file=.env scripts/scan-pessego-bebidas.ts
 */
import { PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const prisma = new PrismaClient();

async function main() {
  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER, ativo: true },
    include: { estoqueInsumo: { select: { id: true, nome: true, insumoId: true, unidade: true, categoriaId: true } } },
  });
  const bebs = configs.filter((c) => {
    const n = `${c.estoqueInsumo.nome} ${c.estoqueInsumo.insumoId}`.toUpperCase();
    return (
      n.includes('PESSEG') ||
      n.includes('PÊSSEG') ||
      n.includes('ICE') ||
      n.includes('CHA') ||
      n.includes('CHÁ') ||
      n.includes('SUCO') ||
      n.includes('DV ') ||
      c.secao === 'BEBIDA'
    );
  });
  console.log('=== catálogo relevante ===');
  for (const c of bebs) {
    console.log(
      JSON.stringify({
        secao: c.secao,
        unidade: c.unidade,
        nome: c.estoqueInsumo.nome,
        slug: c.estoqueInsumo.insumoId,
        id: c.estoqueInsumoId,
      }),
    );
  }

  const itens = await prisma.nfeItem.findMany({
    where: {
      nota: { userId: OWNER, competencia: '2026-10' },
      OR: [
        { descricao: { contains: 'PESSEGO', mode: 'insensitive' } },
        { descricao: { contains: 'PÊSSEGO', mode: 'insensitive' } },
        { descricao: { contains: 'ICE', mode: 'insensitive' } },
      ],
    },
    include: {
      nota: { select: { numero: true, storeSlug: true, status: true, competencia: true } },
    },
  });
  const nomeBy = new Map(configs.map((c) => [c.estoqueInsumoId, c]));
  console.log('=== itens outubro pêssego/ice ===');
  for (const it of itens) {
    const cfg = it.estoqueInsumoId ? nomeBy.get(it.estoqueInsumoId) : null;
    console.log(
      JSON.stringify({
        nf: it.nota.numero,
        loja: it.nota.storeSlug,
        notaStatus: it.nota.status,
        desc: it.descricao,
        uCom: it.unidadeComercial,
        qtd: Number(it.quantidade),
        fator: it.fatorConversao != null ? Number(it.fatorConversao) : null,
        kg: it.quantidadeConvertida != null ? Number(it.quantidadeConvertida) : null,
        valor: it.valorLiquido != null ? Number(it.valorLiquido) : Number(it.valorBruto),
        secao: cfg?.secao ?? null,
        produto: cfg?.estoqueInsumo.nome ?? it.estoqueInsumoId,
        itemId: it.id,
        notaId: it.notaId,
        ean: it.ean,
        status: it.status,
      }),
    );
  }
}

main().finally(() => prisma.$disconnect());
