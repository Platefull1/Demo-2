/**
 * Ajustes de DADOS — Estoque / CMV Real (Ahú).
 *
 * NÃO destrutivo:
 * - UPDATE de 6 contagens sem loja → lojaNome Ahú
 * - UPDATE estoquecalenzano: lojas=['ahu'], perfil='gerente_loja'
 * - INSERT das 4 permissões cmv_real.* (skipDuplicates)
 *
 * NÃO altera UserToolPermission (menor privilégio).
 *
 * Uso (branch Neon primeiro):
 *   $env:DATABASE_URL = "<url-da-branch>"
 *   npx tsx scripts/estoque-lojas-data-fix.ts --dry-run
 *   npx tsx scripts/estoque-lojas-data-fix.ts
 *
 * Produção (só depois da branch conferida):
 *   npx tsx scripts/estoque-lojas-data-fix.ts --confirm-prod
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
const CONFIRM_PROD = process.argv.includes('--confirm-prod');

/** Hosts do banco principal (produção / pooler). Branches Neon usam outro ep-*. */
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

const CMV_PERMS_AHU = [
  'cmv_real.visualizar',
  'cmv_real.revisar_aprovar',
  'cmv_real.lancamentos',
  'cmv_real.mapeamento_criar',
] as const;

function cmvPermsOf(member: { permissions: { permission: string }[] }) {
  return member.permissions
    .map((p) => p.permission)
    .filter((p) => p.startsWith('cmv_real'))
    .sort();
}

async function main() {
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

  // ── Contagens ─────────────────────────────────────────────────────────────
  const antesContagens = await prisma.estoqueContagem.findMany({
    where: { id: { in: [...CONTAGEM_IDS_SEM_LOJA] } },
    select: { id: true, lojaNome: true, userId: true, status: true },
    orderBy: { dataCriacao: 'desc' },
  });

  const foraDoEscopo = antesContagens.filter((c) => c.lojaNome != null);
  if (foraDoEscopo.length > 0) {
    throw new Error(
      `Abortado: algum id já tem lojaNome preenchido: ${foraDoEscopo
        .map((c) => `${c.id}=${c.lojaNome}`)
        .join(', ')}`,
    );
  }
  if (antesContagens.length !== CONTAGEM_IDS_SEM_LOJA.length) {
    const found = new Set(antesContagens.map((c) => c.id));
    const missing = CONTAGEM_IDS_SEM_LOJA.filter((id) => !found.has(id));
    throw new Error(`Abortado: ids não encontrados: ${missing.join(', ')}`);
  }

  // ── Membro estoquecalenzano ───────────────────────────────────────────────
  const est = await prisma.rhTeamMember.findFirst({
    where: { email: { equals: ESTOQUE_EMAIL, mode: 'insensitive' } },
    include: { permissions: true },
  });
  if (!est) throw new Error(`${ESTOQUE_EMAIL} não encontrado em rh_team_members`);

  const permsAntes = cmvPermsOf(est);
  const permsDepois = [...new Set([...permsAntes, ...CMV_PERMS_AHU])].sort();
  const permsAInserir = CMV_PERMS_AHU.filter((p) => !permsAntes.includes(p));

  // ── Relatório antes/depois (sempre; dry-run para aqui) ────────────────────
  console.log('\n=== Contagens (6 ids) — lojaNome ===');
  console.table(
    antesContagens.map((c) => ({
      id: c.id,
      lojaNome_antes: c.lojaNome,
      lojaNome_depois: LOJA_NOME_AHU,
      status: c.status,
    })),
  );

  console.log('\n=== estoquecalenzano — antes / depois ===');
  console.log({
    email: ESTOQUE_EMAIL,
    memberId: est.id,
    lojas: { antes: est.lojas, depois: ['ahu'] },
    perfil: { antes: est.perfil, depois: 'gerente_loja' },
    cmv_real_permissions: {
      antes: permsAntes,
      depois: permsDepois,
      a_inserir: permsAInserir,
    },
    userToolPermission: 'NÃO ALTERADO (menor privilégio)',
  });

  if (DRY) {
    console.log('\n[DRY-RUN] Nenhuma escrita. Remova --dry-run para aplicar.');
    return;
  }

  await prisma.$transaction(async (tx) => {
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

    await tx.rhTeamMember.update({
      where: { id: est.id },
      data: {
        lojas: ['ahu'],
        perfil: 'gerente_loja',
      },
    });

    await tx.rhPermission.createMany({
      data: CMV_PERMS_AHU.map((permission) => ({
        memberId: est.id,
        permission,
        grantedBy: 'script:estoque-lojas-data-fix',
      })),
      skipDuplicates: true,
    });
  });

  const depoisContagens = await prisma.estoqueContagem.findMany({
    where: { id: { in: [...CONTAGEM_IDS_SEM_LOJA] } },
    select: { id: true, lojaNome: true },
  });
  const estDepois = await prisma.rhTeamMember.findFirst({
    where: { id: est.id },
    include: { permissions: true },
  });

  console.log('\n=== Contagens depois (confirmado) ===');
  console.table(depoisContagens);
  console.log('\n=== estoquecalenzano depois (confirmado) ===');
  console.log({
    lojas: estDepois?.lojas,
    perfil: estDepois?.perfil,
    cmvPerms: estDepois ? cmvPermsOf(estDepois) : [],
  });
  console.log('\nOK — dados aplicados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
