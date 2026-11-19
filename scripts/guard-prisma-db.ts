/**
 * Aborta migrate / db push local se DATABASE_URL ou DIRECT_URL apontarem
 * para o host de produção. Reusa a lista de migrate-layer1-tools.ts.
 *
 * Uso:
 *   npx tsx scripts/guard-prisma-db.ts
 *   (package.json: db:migrate / db:push / db:migrate:deploy chamam isto antes)
 */
import { config } from 'dotenv';
// override: true — evita que um DATABASE_URL de produção herdado no shell
// mascare o .env/.env.local da branch dev.
config({ path: '.env', override: true });
config({ path: '.env.local', override: true });

const PRODUCTION_DATABASE_HOSTS = [
  'ep-odd-sunset-ac2loti5-pooler.sa-east-1.aws.neon.tech',
  'ep-odd-sunset-ac2loti5.sa-east-1.aws.neon.tech',
  process.env.PRODUCTION_DATABASE_HOST,
].filter(Boolean) as string[];

function hostOf(url: string | undefined, label: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    console.error(`ABORTADO: ${label} inválida.`);
    process.exit(1);
  }
  return null;
}

const dbHost = hostOf(process.env.DATABASE_URL, 'DATABASE_URL');
const directHost = hostOf(process.env.DIRECT_URL, 'DIRECT_URL');

for (const [label, host] of [
  ['DATABASE_URL', dbHost],
  ['DIRECT_URL', directHost],
] as const) {
  if (host && PRODUCTION_DATABASE_HOSTS.includes(host)) {
    console.error(
      `\nABORTADO: ${label} aponta para PRODUÇÃO (${host}).\n` +
        'Use a branch Neon "dev" (ep-rough-firefly-…). Nunca rode migrate/db push em produção por aqui.\n',
    );
    process.exit(1);
  }
}

if (!dbHost) {
  console.error('ABORTADO: DATABASE_URL não definida.');
  process.exit(1);
}

console.log(`[guard-prisma-db] ok — DATABASE_URL host: ${dbHost}${directHost ? `; DIRECT_URL host: ${directHost}` : ''}`);
