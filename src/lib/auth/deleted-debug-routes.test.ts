import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

describe('rotas de debug e manutenção HTTP removidas', () => {
  const gone = [
    'app/api/debug/check-sales/route.ts',
    'app/api/debug/db-sales/route.ts',
    'app/api/debug/sales/route.ts',
    'app/api/debug/storeIds/route.ts',
    'app/api/debug/fix-null-userid/route.ts',
    'app/api/debug/fix-store-ownership/route.ts',
    'app/api/saipos/debug/route.ts',
    'app/api/saipos/raw-debug/route.ts',
    'app/raw-debug/page.tsx',
    'app/api/checklist/drafts/clean/route.ts',
    'app/api/checklist/drafts/migrate/route.ts',
    'src/lib/debug-guard.ts',
    'app/api/admin/sync-database/route.ts',
    'app/api/admin/sync-whatsapp-connections/route.ts',
  ];

  for (const rel of gone) {
    it(`não existe ${rel}`, () => {
      assert.equal(existsSync(join(root, rel)), false);
    });
  }
});
