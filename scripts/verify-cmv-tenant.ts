import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const AHU = 'cmjhty6hu0001jy04sstknpdo';
const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';

async function main() {
  const ahu = await prisma.user.findUnique({
    where: { id: AHU },
    select: { id: true, email: true, stackUserId: true },
  });
  console.log('ahu', ahu);

  const membership = ahu?.stackUserId
    ? await prisma.rhTeamMember.findFirst({
        where: { stackUserId: ahu.stackUserId, isActive: true },
        select: { tenantUserId: true, email: true },
      })
    : null;
  console.log('membership → tenant', membership);

  const owner = await prisma.user.findUnique({
    where: { id: OWNER },
    select: { id: true, email: true },
  });
  console.log('owner', owner);

  const bots = ahu?.stackUserId
    ? await prisma.whatsAppBot.findMany({
        where: { userId: ahu.stackUserId },
        select: { slot: true, isConnected: true, label: true },
      })
    : [];
  console.log('whatsapp bots ahu', bots);

  const remaining = await prisma.nfeNota.count({ where: { userId: AHU } });
  console.log('notas restantes ahu', remaining);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
