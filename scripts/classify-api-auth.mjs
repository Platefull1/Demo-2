import fs from 'fs';
import path from 'path';

const root = 'app/api';

const RULES = [
  ['ocorrencias-perm', /requireOcorrenciasContext|isOcorrenciasOnlyUser/],
  ['rh-perm', /requireRhPermission|rhRequireModuleUser|memberHasCoreRhPermission/],
  ['tool-perm', /requireToolPermission|checkToolPermission/],
  ['admin-calenza', /requireAdminAuth/],
  ['cron-secret', /CRON_SECRET|cronSecret|CRON_SECRET/],
  ['rider', /rider_token|getRiderSession|RIDER_COOKIE/],
  ['rh-tenant-only', /rhGetUser\(|getRhContext\(/],
  ['session-tenant', /syncStackAuthUser|getSessionDbUser|getRhDbUser|stackServerApp\.getUser|getEffectiveDbUser|getEstoqueTenant|getReportsTenant/],
];

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (e.name === 'route.ts') acc.push(full);
  }
  return acc;
}

const files = walk(root);
const groups = {};

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const route = '/' + file.replace(/\\/g, '/').replace(/\/route\.ts$/, '').replace(/^app/, '');
  let kind = 'unknown / public / other';
  for (const [name, re] of RULES) {
    if (re.test(src)) {
      kind = name;
      break;
    }
  }
  (groups[kind] ??= []).push(route);
}

for (const [kind, routes] of Object.entries(groups).sort()) {
  console.log(`\n## ${kind} (${routes.length})`);
  for (const r of routes.sort()) console.log(r);
}
