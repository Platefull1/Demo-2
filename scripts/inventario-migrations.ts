/**
 * Inventário _prisma_migrations × pasta prisma/migrations/. Só leitura.
 * npx tsx --env-file=.env scripts/inventario-migrations.ts
 */
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dir = join(process.cwd(), 'prisma', 'migrations');
  const pastas = existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name !== 'node_modules')
        .map((d) => d.name)
        .sort()
    : [];

  const rows = await prisma.$queryRaw<
    Array<{
      id: string;
      checksum: string;
      finished_at: Date | null;
      migration_name: string;
      logs: string | null;
      rolled_back_at: Date | null;
      started_at: Date | null;
      applied_steps_count: number;
    }>
  >`
    SELECT id, checksum, finished_at, migration_name, logs,
           rolled_back_at, started_at, applied_steps_count
    FROM _prisma_migrations
    ORDER BY started_at ASC NULLS LAST, migration_name ASC
  `;

  const noBanco = new Set(rows.map((r) => r.migration_name));
  const naPasta = new Set(pastas);

  console.log('=== PASTA prisma/migrations/ ===');
  console.log(pastas);
  console.log('=== _prisma_migrations ===');
  console.log(
    rows.map((r) => ({
      name: r.migration_name,
      finished: r.finished_at,
      rolledBack: r.rolled_back_at,
      steps: r.applied_steps_count,
    })),
  );
  console.log(
    '=== só no banco ===',
    rows.filter((r) => !naPasta.has(r.migration_name)).map((r) => r.migration_name),
  );
  console.log(
    '=== só na pasta ===',
    pastas.filter((n) => !noBanco.has(n)),
  );
  console.log(
    '=== nos dois ===',
    pastas.filter((n) => noBanco.has(n)),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
