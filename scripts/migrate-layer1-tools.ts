/**
 * Camada 1 — habilita UserToolPermission que o painel passa a exigir:
 * - cmv_real: membros com cmv_real.visualizar + contas com NF-e no tenant
 * - registrar_ocorrencias + ver_ocorrencias: donos de equipe / contas com lojas
 *   (membros NÃO entram — ahu não ganha ocorrências)
 *
 * NÃO destrutivo: só cria linha se não existir. Não religa quem já tem isEnabled=false.
 *
 * Uso (branch Neon primeiro):
 *   $env:DATABASE_URL = "<url-da-branch>"
 *   npx tsx scripts/migrate-layer1-tools.ts --dry-run
 *   npx tsx scripts/migrate-layer1-tools.ts
 *
 * Produção (só depois da branch conferida):
 *   npx tsx scripts/migrate-layer1-tools.ts --confirm-prod
 *
 * Lê DATABASE_URL do ambiente (obrigatório).
 */

import { PrismaClient } from '@prisma/client';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Defina DATABASE_URL (ex.: branch Neon) antes de rodar.');
  process.exit(1);
}

const DRY = process.argv.includes('--dry-run');
const CONFIRM_PROD = process.argv.includes('--confirm-prod');

const PRODUCTION_DATABASE_HOSTS = [
  'ep-odd-sunset-ac2loti5-pooler.sa-east-1.aws.neon.tech',
  'ep-odd-sunset-ac2loti5.sa-east-1.aws.neon.tech',
  process.env.PRODUCTION_DATABASE_HOST,
].filter(Boolean) as string[];

function databaseHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    throw new Error('DATABASE_URL inválida (não é URL).');
  }
}

const HOST = databaseHost(DATABASE_URL);
console.log(`DATABASE_URL host: ${HOST}`);

if (PRODUCTION_DATABASE_HOSTS.includes(HOST) && !CONFIRM_PROD) {
  console.error(
    '\nABORTADO: este host é o banco de PRODUÇÃO.\n' +
      'Use a URL da branch Neon, ou passe --confirm-prod somente após validar a branch.\n' +
      `(hosts de produção conhecidos: ${PRODUCTION_DATABASE_HOSTS.join(', ')})`,
  );
  process.exit(1);
}
if (PRODUCTION_DATABASE_HOSTS.includes(HOST) && CONFIRM_PROD) {
  console.warn('AVISO: --confirm-prod ativo — escrevendo no banco de PRODUÇÃO.');
}

const prisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
});

const TOOL_CMV_REAL = 'cmv_real';
const TOOL_REG = 'registrar_ocorrencias';
const TOOL_VER = 'ver_ocorrencias';

type Candidate = {
  stackUserId: string;
  email: string | null;
  reason: string;
};

function keyOf(c: Candidate) {
  return c.stackUserId;
}

async function existingTool(stackUserId: string, tool: string) {
  return prisma.userToolPermission.findUnique({
    where: { stackUserId_tool: { stackUserId, tool } },
    select: { isEnabled: true },
  });
}

async function enableIfMissing(c: Candidate, tool: string) {
  const existing = await existingTool(c.stackUserId, tool);
  if (existing?.isEnabled) {
    return 'já ligada';
  }
  if (existing && !existing.isEnabled) {
    return 'já existe desligada (não altera)';
  }
  if (DRY) return 'criaria';
  await prisma.userToolPermission.create({
    data: { stackUserId: c.stackUserId, tool, isEnabled: true },
  });
  return 'criada';
}

async function cmvRealCandidates(): Promise<Candidate[]> {
  const byId = new Map<string, Candidate>();

  const membersWithVisualizar = await prisma.rhPermission.findMany({
    where: { permission: 'cmv_real.visualizar' },
    select: {
      member: {
        select: {
          isActive: true,
          stackUserId: true,
          email: true,
        },
      },
    },
  });
  for (const row of membersWithVisualizar) {
    const m = row.member;
    if (!m.isActive || !m.stackUserId) continue;
    byId.set(m.stackUserId, {
      stackUserId: m.stackUserId,
      email: m.email,
      reason: 'membro com cmv_real.visualizar',
    });
  }

  const noteOwners = await prisma.nfeNota.groupBy({
    by: ['userId'],
    _count: { id: true },
  });
  const ownerUsers = await prisma.user.findMany({
    where: { id: { in: noteOwners.map((n) => n.userId) } },
    select: {
      id: true,
      email: true,
      stackUserId: true,
      stackUser: { select: { id: true, primaryEmail: true } },
    },
  });
  for (const u of ownerUsers) {
    const stackUserId = u.stackUserId ?? u.stackUser?.id;
    if (!stackUserId) continue;
    const count = noteOwners.find((n) => n.userId === u.id)?._count.id ?? 0;
    const prev = byId.get(stackUserId);
    byId.set(stackUserId, {
      stackUserId,
      email: u.stackUser?.primaryEmail ?? u.email ?? prev?.email ?? null,
      reason: prev
        ? `${prev.reason} + ${count} NF-e no tenant`
        : `${count} NF-e no tenant`,
    });
  }

  return [...byId.values()].sort((a, b) =>
    (a.email ?? '').localeCompare(b.email ?? ''),
  );
}

async function ocorrenciasOwnerCandidates(): Promise<Candidate[]> {
  const byId = new Map<string, Candidate>();

  const teamOwnerIds = await prisma.rhTeamMember.findMany({
    where: { isActive: true },
    distinct: ['tenantUserId'],
    select: { tenantUserId: true },
  });
  const teamOwners = await prisma.user.findMany({
    where: { id: { in: teamOwnerIds.map((t) => t.tenantUserId) } },
    select: {
      id: true,
      email: true,
      stackUserId: true,
      stackUser: { select: { id: true, primaryEmail: true } },
    },
  });
  for (const u of teamOwners) {
    const stackUserId = u.stackUserId ?? u.stackUser?.id;
    if (!stackUserId) continue;
    byId.set(stackUserId, {
      stackUserId,
      email: u.stackUser?.primaryEmail ?? u.email ?? null,
      reason: 'dono de equipe RH',
    });
  }

  const memberStackIds = new Set(
    (
      await prisma.rhTeamMember.findMany({
        where: { isActive: true, stackUserId: { not: null } },
        select: { stackUserId: true, tenantUserId: true },
      })
    )
      .filter((m) => {
        const owner = teamOwners.find((u) => u.id === m.tenantUserId);
        const ownerStack = owner?.stackUserId ?? owner?.stackUser?.id;
        return m.stackUserId && m.stackUserId !== ownerStack;
      })
      .map((m) => m.stackUserId!),
  );

  const lojaUserIds = await prisma.rhLoja.findMany({
    distinct: ['userId'],
    select: { userId: true },
  });
  const lojaUsers = await prisma.user.findMany({
    where: { id: { in: lojaUserIds.map((l) => l.userId) } },
    select: {
      id: true,
      email: true,
      stackUserId: true,
      stackUser: { select: { id: true, primaryEmail: true } },
    },
  });
  for (const u of lojaUsers) {
    const stackUserId = u.stackUserId ?? u.stackUser?.id;
    if (!stackUserId) continue;
    if (memberStackIds.has(stackUserId) && !byId.has(stackUserId)) continue;
    if (byId.has(stackUserId)) continue;
    byId.set(stackUserId, {
      stackUserId,
      email: u.stackUser?.primaryEmail ?? u.email ?? null,
      reason: 'conta com lojas (não é membro de outro tenant)',
    });
  }

  return [...byId.values()].sort((a, b) =>
    (a.email ?? '').localeCompare(b.email ?? ''),
  );
}

async function main() {
  console.log(DRY ? '\n=== DRY-RUN (não grava) ===\n' : '\n=== APLICANDO ===\n');

  const cmv = await cmvRealCandidates();
  console.log(`CMV_REAL — ${cmv.length} candidato(s):`);
  for (const c of cmv) {
    const status = await enableIfMissing(c, TOOL_CMV_REAL);
    console.log(`  ${c.email ?? c.stackUserId}  [${c.reason}]  → ${status}`);
  }

  const occ = await ocorrenciasOwnerCandidates();
  console.log(`\nOCORRÊNCIAS (registrar + ver) — ${occ.length} dono(s):`);
  for (const c of occ) {
    const reg = await enableIfMissing(c, TOOL_REG);
    const ver = await enableIfMissing(c, TOOL_VER);
    console.log(
      `  ${c.email ?? c.stackUserId}  [${c.reason}]  → registrar=${reg}; ver=${ver}`,
    );
  }

  const skippedMembers = await prisma.rhTeamMember.findMany({
    where: { isActive: true, stackUserId: { not: null } },
    select: { email: true, stackUserId: true, tenantUserId: true },
  });
  const ownerStacks = new Set(occ.map(keyOf));
  const memberEmails = skippedMembers
    .filter((m) => m.stackUserId && !ownerStacks.has(m.stackUserId))
    .map((m) => m.email);
  if (memberEmails.length) {
    console.log(
      `\nMembros NÃO recebem ocorrências (${memberEmails.length}): ${memberEmails.join(', ')}`,
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
