/**
 * Conta quantos insumos do catálogo mesclado (tenant platefull) existem
 * SOMENTE na conta estoquecalenzano (não no dono nem em outros membros ativos).
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const ESTOQUE_EMAIL = 'estoquecalenzano@gmail.com';

async function main() {
  const members = await prisma.rhTeamMember.findMany({
    where: { tenantUserId: OWNER },
    select: {
      id: true,
      email: true,
      isActive: true,
      stackUserId: true,
    },
  });
  console.log('membros do grupo:', members.map((m) => ({
    email: m.email,
    isActive: m.isActive,
    linked: !!m.stackUserId,
  })));

  const estoqueMember = members.find((m) => m.email.toLowerCase() === ESTOQUE_EMAIL);
  if (!estoqueMember?.stackUserId) {
    console.log('estoquecalenzano sem stackUserId — buscando User por email');
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { id: OWNER },
        {
          stackUserId: {
            in: members.map((m) => m.stackUserId!).filter(Boolean),
          },
        },
        { email: ESTOQUE_EMAIL },
      ],
    },
    select: { id: true, email: true, stackUserId: true },
  });
  console.log('users:', users);

  const estoqueUser = users.find((u) => u.email?.toLowerCase() === ESTOQUE_EMAIL);
  const otherUserIds = users.filter((u) => u.id !== estoqueUser?.id).map((u) => u.id);
  const allUserIds = users.map((u) => u.id);

  if (!estoqueUser) {
    console.log('Conta estoquecalenzano não encontrada como User');
    return;
  }

  const [soDela, delaOuOutros, totalMergedSlugs, insumosDela, insumosOutros] =
    await Promise.all([
      prisma.$queryRawUnsafe<{ cnt: bigint }[]>(
        `
        SELECT COUNT(*)::bigint AS cnt FROM (
          SELECT i."insumo_id" AS slug
          FROM estoque_insumos i
          WHERE i.user_id = $1
          AND NOT EXISTS (
            SELECT 1 FROM estoque_insumos o
            WHERE o.user_id = ANY($2::text[])
              AND o."insumo_id" = i."insumo_id"
          )
        ) t
        `,
        estoqueUser.id,
        otherUserIds,
      ),
      prisma.estoqueInsumo.count({ where: { userId: estoqueUser.id } }),
      prisma.$queryRawUnsafe<{ cnt: bigint }[]>(
        `
        SELECT COUNT(DISTINCT "insumo_id")::bigint AS cnt
        FROM estoque_insumos
        WHERE user_id = ANY($1::text[])
        `,
        allUserIds,
      ),
      prisma.estoqueInsumo.findMany({
        where: { userId: estoqueUser.id },
        select: { insumoId: true, nome: true },
      }),
      prisma.estoqueInsumo.findMany({
        where: { userId: { in: otherUserIds } },
        select: { userId: true, insumoId: true },
      }),
    ]);

  const outrosSlugs = new Set(insumosOutros.map((i) => i.insumoId));
  const soDelaList = insumosDela.filter((i) => !outrosSlugs.has(i.insumoId));

  console.log(JSON.stringify({
    estoqueUserId: estoqueUser.id,
    insumosNaContaEstoque: delaOuOutros,
    slugsUnicosNoGrupoMesclado: Number(totalMergedSlugs[0]?.cnt ?? 0),
    soDelaCount: soDelaList.length,
    soDelaRaw: Number(soDela[0]?.cnt ?? 0),
    soDelaExemplos: soDelaList.slice(0, 20).map((i) => ({ slug: i.insumoId, nome: i.nome })),
  }, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
