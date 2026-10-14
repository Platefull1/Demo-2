/**
 * Ajustes de DADOS — Estoque / CMV Real (Ahú).
 *
 * NÃO destrutivo: só UPDATE de 6 contagens sem loja + UPDATE de membro
 * estoquecalenzano + INSERT de permissões CMV (skipDuplicates) +
 * alinhamento de UserToolPermission ao Ahú.
 *
 * Uso (branch Neon primeiro):
 *   set DATABASE_URL=<url-da-branch>
 *   npx tsx scripts/estoque-lojas-data-fix.ts
 *
 * Dry-run (não grava):
 *   npx tsx scripts/estoque-lojas-data-fix.ts --dry-run
 *
 * Lê DATABASE_URL do ambiente (obrigatório).
 */

import { PrismaClient } from '@prisma/client';
import { storeSlugFromLojaNome } from '../src/lib/nfe/lojas';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Defina DATABASE_URL (ex.: branch Neon) antes de rodar.');
  process.exit(1);
}

const DRY = process.argv.includes('--dry-run');

const prisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
});

const CONTAGEM_IDS_SEM_LOJA = [
  'cmr20mco7000jjo046n7dzqw1',
  'cmqyhh8ar0001la048hw5regv',
  'cmqojmm7d0001k004x9il5kum',
  'cmqmu0ted0001ic04cgxwm5j4',
  'cmpbshls80001ii04rsf81jsh',
  'cmo977zh00001ky04iw6t5a5y',
] as const;

/** Texto canônico das contagens Ahú já existentes (storeSlugFromLojaNome → ahu). */
const LOJA_NOME_AHU = 'CALENZANO AHÚ';

const ESTOQUE_EMAIL = 'estoquecalenzano@gmail.com';
const AHU_EMAIL = 'calenzano.ahu@gmail.com';

const CMV_PERMS_AHU = [
  'cmv_real.visualizar',
  'cmv_real.revisar_aprovar',
  'cmv_real.lancamentos',
  'cmv_real.mapeamento_criar',
] as const;

async function main() {
  // ── Sanity: lojaNome canônico ─────────────────────────────────────────────
  const slugCheck = storeSlugFromLojaNome(LOJA_NOME_AHU);
  if (slugCheck !== 'ahu') {
    throw new Error(
      `LOJA_NOME_AHU="${LOJA_NOME_AHU}" não resolve para ahu (got ${slugCheck})`,
    );
  }

  const existingAhu = await prisma.estoqueContagem.findFirst({
    where: { lojaNome: LOJA_NOME_AHU },
    select: { id: true, lojaNome: true },
  });
  if (!existingAhu) {
    console.warn(
      `Aviso: nenhuma contagem com lojaNome exato "${LOJA_NOME_AHU}" encontrada. ` +
        'Confira encoding no banco antes de aplicar.',
    );
  }

  // ── 1) Contagens sem loja → Ahú ───────────────────────────────────────────
  const antesContagens = await prisma.estoqueContagem.findMany({
    where: { id: { in: [...CONTAGEM_IDS_SEM_LOJA] } },
    select: { id: true, lojaNome: true, userId: true, status: true },
  });

  console.log('\n=== Contagens alvo ===');
  console.table(antesContagens);

  const foraDoEscopo = antesContagens.filter((c) => c.lojaNome != null);
  if (foraDoEscopo.length > 0) {
    throw new Error(
      `Abortado: algum id já tem lojaNome preenchido: ${foraDoEscopo
        .map((c) => c.id)
        .join(', ')}`,
    );
  }
  if (antesContagens.length !== CONTAGEM_IDS_SEM_LOJA.length) {
    const found = new Set(antesContagens.map((c) => c.id));
    const missing = CONTAGEM_IDS_SEM_LOJA.filter((id) => !found.has(id));
    throw new Error(`Abortado: ids não encontrados: ${missing.join(', ')}`);
  }

  // ── 2) Membro estoquecalenzano ────────────────────────────────────────────
  const est = await prisma.rhTeamMember.findFirst({
    where: { email: { equals: ESTOQUE_EMAIL, mode: 'insensitive' } },
    include: { permissions: true },
  });
  if (!est) throw new Error(`${ESTOQUE_EMAIL} não encontrado em rh_team_members`);

  const ahu = await prisma.rhTeamMember.findFirst({
    where: { email: { equals: AHU_EMAIL, mode: 'insensitive' } },
    include: { permissions: true },
  });
  if (!ahu?.stackUserId) {
    throw new Error(`${AHU_EMAIL} sem stackUserId — não dá para espelhar tools`);
  }

  const ahuTools = await prisma.userToolPermission.findMany({
    where: { stackUserId: ahu.stackUserId },
  });
  const estTools = est.stackUserId
    ? await prisma.userToolPermission.findMany({
        where: { stackUserId: est.stackUserId },
      })
    : [];

  console.log('\n=== estoquecalenzano (antes) ===');
  console.log({
    id: est.id,
    lojas: est.lojas,
    perfil: est.perfil,
    cmvPerms: est.permissions
      .map((p) => p.permission)
      .filter((p) => p.startsWith('cmv_real'))
      .sort(),
    toolsOn: estTools.filter((t) => t.isEnabled).map((t) => t.tool),
  });
  console.log('\n=== calenzano.ahu (referência) ===');
  console.log({
    id: ahu.id,
    lojas: ahu.lojas,
    perfil: ahu.perfil,
    cmvPerms: ahu.permissions
      .map((p) => p.permission)
      .filter((p) => p.startsWith('cmv_real'))
      .sort(),
    toolsOn: ahuTools.filter((t) => t.isEnabled).map((t) => t.tool),
  });

  if (DRY) {
    console.log('\n[DRY-RUN] Nenhuma escrita. Remova --dry-run para aplicar.');
    return;
  }

  await prisma.$transaction(async (tx) => {
    // 1) Só os 6 ids, só onde lojaNome IS NULL
    const updContagens = await tx.estoqueContagem.updateMany({
      where: {
        id: { in: [...CONTAGEM_IDS_SEM_LOJA] },
        lojaNome: null,
      },
      data: { lojaNome: LOJA_NOME_AHU },
    });
    if (updContagens.count !== CONTAGEM_IDS_SEM_LOJA.length) {
      throw new Error(
        `Esperado atualizar ${CONTAGEM_IDS_SEM_LOJA.length} contagens, got ${updContagens.count}`,
      );
    }

    // 2) Membro → Ahú (perfil + lojas)
    await tx.rhTeamMember.update({
      where: { id: est.id },
      data: {
        lojas: ['ahu'],
        perfil: 'gerente_loja',
      },
    });

    // 3) Permissões CMV iguais ao Ahú (ids via @default(cuid()) do Prisma)
    await tx.rhPermission.createMany({
      data: CMV_PERMS_AHU.map((permission) => ({
        memberId: est.id,
        permission,
        grantedBy: 'script:estoque-lojas-data-fix',
      })),
      skipDuplicates: true,
    });

    // 4) UserToolPermission: espelhar tools habilitadas do Ahú
    if (!est.stackUserId) {
      throw new Error(`${ESTOQUE_EMAIL} sem stackUserId — não dá para alinhar tools`);
    }
    for (const t of ahuTools) {
      await tx.userToolPermission.upsert({
        where: {
          stackUserId_tool: {
            stackUserId: est.stackUserId,
            tool: t.tool,
          },
        },
        create: {
          stackUserId: est.stackUserId,
          tool: t.tool,
          isEnabled: t.isEnabled,
        },
        update: { isEnabled: t.isEnabled },
      });
    }
  });

  // ── Verificação ───────────────────────────────────────────────────────────
  const depoisContagens = await prisma.estoqueContagem.findMany({
    where: { id: { in: [...CONTAGEM_IDS_SEM_LOJA] } },
    select: { id: true, lojaNome: true },
  });
  const estDepois = await prisma.rhTeamMember.findFirst({
    where: { id: est.id },
    include: { permissions: true },
  });
  const toolsDepois = await prisma.userToolPermission.findMany({
    where: { stackUserId: est.stackUserId! },
  });

  console.log('\n=== Contagens depois ===');
  console.table(depoisContagens);
  console.log('\n=== estoquecalenzano depois ===');
  console.log({
    lojas: estDepois?.lojas,
    perfil: estDepois?.perfil,
    cmvPerms: estDepois?.permissions
      .map((p) => p.permission)
      .filter((p) => p.startsWith('cmv_real'))
      .sort(),
    toolsOn: toolsDepois.filter((t) => t.isEnabled).map((t) => t.tool).sort(),
  });
  console.log('\nOK — dados aplicados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
