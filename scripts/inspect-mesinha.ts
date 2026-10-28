import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const itens = await prisma.nfeItem.findMany({
    where: {
      nota: { userId: 'cmk5ykusf0001jz04iwmf8xa8', numero: { in: ['646', '648'] } },
      descricao: { contains: 'Mesinha', mode: 'insensitive' },
    },
    include: { nota: { select: { numero: true, storeSlug: true, status: true } } },
  });
  console.log(
    itens.map((it) => ({
      nf: it.nota.numero,
      loja: it.nota.storeSlug,
      qtd: Number(it.quantidade),
      uCom: it.unidadeComercial,
      fator: it.fatorConversao != null ? Number(it.fatorConversao) : null,
      qtdConv: it.quantidadeConvertida != null ? Number(it.quantidadeConvertida) : null,
      desc: it.descricao,
    })),
  );
}
main().finally(() => prisma.$disconnect());
