import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const n = await prisma.sale.count();
  const sample = await prisma.sale.findFirst({
    orderBy: { saleDateUtc: 'desc' },
    select: { storeId: true, saleDateUtc: true, totalAmount: true, rawJson: true },
  });
  const min = await prisma.sale.aggregate({ _min: { saleDateUtc: true }, _max: { saleDateUtc: true } });
  console.log({ n, min: min._min.saleDateUtc, max: min._max.saleDateUtc, store: sample?.storeId });
  const raw = sample?.rawJson;
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    console.log('rawKeys', Object.keys(o).slice(0, 30));
    console.log('hasItems', Array.isArray(o.items));
  }
  const pages = await prisma.salesRawPage.count();
  console.log('rawPages', pages);
}

main().finally(() => prisma.$disconnect());
