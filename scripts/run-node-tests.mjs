import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';

function run(args) {
  const r = spawnSync('npx', ['tsx', '--test', ...args], {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  return r.status ?? 1;
}

const base = [
  'src/lib/ocorrencias-*.test.ts',
  'src/lib/auth/*.test.ts',
  'src/lib/user-api-mask.test.ts',
  'src/lib/error-handler.test.ts',
  'src/lib/navigation.test.ts',
  'src/lib/store-access.test.ts',
  'src/lib/nfe/*.test.ts',
  'src/lib/cmv-real/*.test.ts',
  'src/lib/pontos/*.test.ts',
  'src/lib/rider-quinzena-docs.test.ts',
  'src/lib/rate-limit.test.ts',
  'src/lib/rh-permissions.test.ts',
  'src/lib/shared/holerites/*.test.ts',
  'src/baileys/phoneJid.test.ts',
];

const code1 = run(base);
// route-authz.test.ts é Vitest (vi.mock); não roda no harness node:test
const holeritesNodeTests = readdirSync('src/lib/holerites')
  .filter((f) => f.endsWith('.test.ts') && f !== 'route-authz.test.ts')
  .map((f) => `src/lib/holerites/${f}`);
const code2 = run(['--test-concurrency=1', ...holeritesNodeTests]);
process.exit(code1 !== 0 || code2 !== 0 ? 1 : 0);
