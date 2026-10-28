import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const u = process.env.DATABASE_URL || '';
  const host = (u.match(/@([^/?]+)/) || [])[1] || '';
  console.log('host', host);
  console.log('db', (u.split('/').pop() || '').split('?')[0]);
  console.log('neonBranchParam', /branch=/.test(u));
  const tables = await prisma.$queryRawUnsafe<Array<{ tablename: string }>>(
    `select tablename from pg_tables where schemaname='public' and tablename like 'cmv_transfer%'`,
  );
  console.log('tables', tables);
  try {
    const mig = await prisma.$queryRawUnsafe<Array<{ migration_name: string }>>(
      `select migration_name from _prisma_migrations order by finished_at desc nulls last limit 8`,
    );
    console.log('prisma_migrations', mig);
  } catch {
    console.log('prisma_migrations', 'tabela inexistente (repo usa db push)');
  }
}

main().finally(() => prisma.$disconnect());
