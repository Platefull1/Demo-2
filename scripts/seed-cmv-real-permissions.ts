/**
 * Configuração inicial CMV Real nos membros RH (tenant platefull.app).
 *
 * Identifica por email (unique [tenantUserId, email]).
 *
 * Uso:
 *   npx tsx scripts/seed-cmv-real-permissions.ts          # diff only
 *   npx tsx scripts/seed-cmv-real-permissions.ts --execute
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const OWNER_EMAIL = 'platefull.app@gmail.com';
const OWNER_ID_FALLBACK = 'cmk5ykusf0001jz04iwmf8xa8';

const CMV = {
  visualizar: 'cmv_real.visualizar',
  revisar_aprovar: 'cmv_real.revisar_aprovar',
  lancamentos: 'cmv_real.lancamentos',
  mapeamento_criar: 'cmv_real.mapeamento_criar',
  mapeamento_editar: 'cmv_real.mapeamento_editar',
  fechamento: 'cmv_real.fechamento',
  reabrir: 'cmv_real.reabrir',
  config: 'cmv_real.config',
} as const;

const ALL_CMV = Object.values(CMV);

const ESCRITORIO = [
  CMV.visualizar,
  CMV.revisar_aprovar,
  CMV.lancamentos,
  CMV.mapeamento_criar,
  CMV.mapeamento_editar,
  CMV.fechamento,
];

const GERENTE = [
  CMV.visualizar,
  CMV.revisar_aprovar,
  CMV.lancamentos,
  CMV.mapeamento_criar,
];

type Target = {
  email: string;
  perfil: 'escritorio' | 'gerente_loja' | null;
  lojas: string[];
  cmvPermissions: string[];
};

const TARGETS: Target[] = [
  {
    email: 'calenzano.escritorio@gmail.com',
    perfil: 'escritorio',
    lojas: [],
    cmvPermissions: ESCRITORIO,
  },
  {
    email: 'calenzano.escritorio1@gmail.com',
    perfil: 'escritorio',
    lojas: [],
    cmvPermissions: ESCRITORIO,
  },
  {
    email: 'calenzano.marketing01@gmail.com',
    perfil: 'escritorio',
    lojas: [],
    cmvPermissions: ESCRITORIO,
  },
  {
    email: 'calenzano.ahu@gmail.com',
    perfil: 'gerente_loja',
    lojas: ['ahu'],
    cmvPermissions: GERENTE,
  },
  {
    email: 'calenzano.pilarzinho@gmail.com',
    perfil: 'gerente_loja',
    lojas: ['pilarzinho'],
    cmvPermissions: GERENTE,
  },
  {
    email: 'calenzano.portao@gmail.com',
    perfil: 'gerente_loja',
    lojas: ['portao'],
    cmvPermissions: GERENTE,
  },
  {
    email: 'calenzano.uberaba@gmail.com',
    perfil: 'gerente_loja',
    lojas: ['uberaba'],
    cmvPermissions: GERENTE,
  },
  {
    email: 'calenzano.central@gmail.com',
    perfil: null,
    lojas: [],
    cmvPermissions: [],
  },
];

function sameArr(a: string[], b: string[]) {
  const sa = [...a].sort().join(',');
  const sb = [...b].sort().join(',');
  return sa === sb;
}

async function main() {
  const execute = process.argv.includes('--execute');

  const owner =
    (await prisma.user.findFirst({
      where: { email: OWNER_EMAIL },
      select: { id: true, email: true },
    })) ??
    (await prisma.user.findUnique({
      where: { id: OWNER_ID_FALLBACK },
      select: { id: true, email: true },
    }));

  if (!owner) {
    console.error('Dono do grupo não encontrado');
    process.exit(1);
  }
  console.log('Tenant:', owner);

  const diffs: Array<{
    email: string;
    found: boolean;
    memberId?: string;
    before?: { perfil: string | null; lojas: string[]; cmv: string[] };
    after?: { perfil: string | null; lojas: string[]; cmv: string[] };
    changes?: string[];
  }> = [];

  for (const t of TARGETS) {
    const member = await prisma.rhTeamMember.findUnique({
      where: {
        tenantUserId_email: { tenantUserId: owner.id, email: t.email },
      },
      include: {
        permissions: { select: { permission: true } },
      },
    });

    if (!member) {
      diffs.push({ email: t.email, found: false });
      continue;
    }

    const currentCmv = member.permissions
      .map((p) => p.permission)
      .filter((p) => ALL_CMV.includes(p as (typeof ALL_CMV)[number]))
      .sort();
    const targetCmv = [...t.cmvPermissions].sort();
    const changes: string[] = [];

    if (member.perfil !== t.perfil) {
      changes.push(`perfil: ${member.perfil ?? 'null'} → ${t.perfil ?? 'null'}`);
    }
    if (!sameArr(member.lojas ?? [], t.lojas)) {
      changes.push(
        `lojas: [${(member.lojas ?? []).join(',')}] → [${t.lojas.join(',')}]`,
      );
    }
    if (!sameArr(currentCmv, targetCmv)) {
      const add = targetCmv.filter((p) => !currentCmv.includes(p));
      const del = currentCmv.filter((p) => !targetCmv.includes(p));
      if (add.length) changes.push(`+cmv: ${add.join(', ')}`);
      if (del.length) changes.push(`-cmv: ${del.join(', ')}`);
    }

    diffs.push({
      email: t.email,
      found: true,
      memberId: member.id,
      before: { perfil: member.perfil, lojas: member.lojas, cmv: currentCmv },
      after: { perfil: t.perfil, lojas: t.lojas, cmv: targetCmv },
      changes,
    });
  }

  console.log('\n=== DIFF ===\n');
  for (const d of diffs) {
    if (!d.found) {
      console.log(`❌ ${d.email} — membro NÃO encontrado no tenant`);
      continue;
    }
    if (!d.changes?.length) {
      console.log(`✓  ${d.email} — já ok (perfil=${d.after?.perfil}, lojas=[${d.after?.lojas.join(',')}])`);
      continue;
    }
    console.log(`Δ  ${d.email}`);
    for (const c of d.changes) console.log(`     ${c}`);
  }

  if (!execute) {
    console.log('\nDry-run. Passe --execute para aplicar.');
    return;
  }

  console.log('\n=== APLICANDO ===\n');
  for (const t of TARGETS) {
    const member = await prisma.rhTeamMember.findUnique({
      where: {
        tenantUserId_email: { tenantUserId: owner.id, email: t.email },
      },
    });
    if (!member) {
      console.log(`skip ${t.email} (não encontrado)`);
      continue;
    }

    await prisma.$transaction(async (tx) => {
      await tx.rhPermission.deleteMany({
        where: {
          memberId: member.id,
          permission: { in: [...ALL_CMV] },
        },
      });
      if (t.cmvPermissions.length > 0) {
        await tx.rhPermission.createMany({
          data: t.cmvPermissions.map((permission) => ({
            memberId: member.id,
            permission,
            grantedBy: 'seed-cmv-real-permissions',
          })),
          skipDuplicates: true,
        });
      }
      await tx.rhTeamMember.update({
        where: { id: member.id },
        data: {
          perfil: t.perfil,
          lojas: t.lojas,
        },
      });
    });
    console.log(`ok ${t.email} → perfil=${t.perfil} lojas=[${t.lojas.join(',')}] cmv=${t.cmvPermissions.length}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
