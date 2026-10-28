/**
 * Documento demo sem lançamento CMV (não chama reconciliar).
 * npx tsx --env-file=.env scripts/seed-transferencia-demo.ts
 */
import { Prisma, PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const prisma = new PrismaClient();

async function main() {
  const existente = await prisma.cmvTransferencia.findFirst({
    where: {
      userId: OWNER,
      numeroDocumento: 'DEMO-ESPELHO',
      excluidoEm: null,
    },
    select: { id: true },
  });
  if (existente) {
    console.log(existente.id);
    return;
  }

  const cfg = await prisma.cmvRealInsumoConfig.findFirst({
    where: { userId: OWNER, ativo: true, secao: 'BEBIDA' },
    include: { estoqueInsumo: { select: { nome: true } } },
    orderBy: { ordem: 'asc' },
  });
  if (!cfg) throw new Error('sem produto BEBIDA');

  const doc = await prisma.cmvTransferencia.create({
    data: {
      userId: OWNER,
      numeroDocumento: 'DEMO-ESPELHO',
      data: new Date('2026-10-21T15:00:00.000Z'),
      competencia: '2026-10',
      lojaOrigem: 'portao',
      lojaDestino: 'uberaba',
      status: 'DIVERGENTE',
      origem: 'MANUAL',
      observacao: 'Documento de conferência visual — sem lançamento CMV',
      criadoPorId: OWNER,
      lados: {
        create: [
          {
            tipo: 'SAIDA',
            storeSlug: 'portao',
            rascunho: false,
            registradoEm: new Date(),
            registradoPorId: OWNER,
            itens: {
              create: {
                estoqueInsumoId: cfg.estoqueInsumoId,
                quantidade: new Prisma.Decimal(6),
                unidade: cfg.unidade,
                custoUnitario: new Prisma.Decimal(2.5),
                valorTotal: new Prisma.Decimal(15),
                custoOrigem: 'CUSTO_MANUAL',
              },
            },
          },
          {
            tipo: 'ENTRADA',
            storeSlug: 'uberaba',
            rascunho: false,
            registradoEm: new Date(),
            registradoPorId: OWNER,
            itens: {
              create: {
                estoqueInsumoId: cfg.estoqueInsumoId,
                quantidade: new Prisma.Decimal(4),
                unidade: cfg.unidade,
                custoUnitario: new Prisma.Decimal(2.5),
                valorTotal: new Prisma.Decimal(10),
                custoOrigem: 'CUSTO_MANUAL',
              },
            },
          },
        ],
      },
    },
  });
  console.log(doc.id, cfg.estoqueInsumo.nome);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
