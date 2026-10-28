/**
 * Wrapper de `prisma db push --accept-data-loss`.
 * Recusa rodar quando DATABASE_URL aponta para o Neon de produção.
 */
import { execSync } from 'child_process';

const url = process.env.DATABASE_URL || '';
if (!url) {
  console.error('ABORTADO: DATABASE_URL não definida.');
  process.exit(1);
}

function hostOf(raw: string): string {
  try {
    return new URL(raw).hostname;
  } catch {
    return '';
  }
}

const host = hostOf(url);
const isProd =
  /ep-odd-sunset/i.test(url) || /ep-odd-sunset/i.test(host);

if (process.argv.includes('--check')) {
  console.log(isProd ? 'PROD' : `ok ${host}`);
  process.exit(isProd ? 2 : 0);
}

if (isProd) {
  console.error(
    '\nABORTADO: db:push:force recusado no banco de PRODUÇÃO.\n' +
      `Host: ${host || '(não parseado)'}\n` +
      'ep-odd-sunset… é o Neon de produção. `prisma db push --accept-data-loss` pode apagar dados.\n' +
      'Use uma branch Neon (outro ep-*) e aponte DATABASE_URL para ela.\n',
  );
  process.exit(1);
}

console.log(`db:push:force — host ${host} (não é produção). Seguindo com --accept-data-loss.`);
execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
