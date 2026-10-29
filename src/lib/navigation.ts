/**
 * Menu da sidebar: calculado no servidor a partir das permissões do usuário.
 * Itens sem permissão não entram — não existe estado "locked".
 * Camada 1 = só UserToolPermission (sem bypass de isAdmin).
 */

import { prisma } from '@/lib/prisma';
import { getRhContext } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import {
  buildNavSections,
  resolveNavigationInput,
  visaoGeralOnlyNav,
} from '@/lib/navigation-menu';

export type {
  NavChildDTO,
  NavIconName,
  NavItemDTO,
  NavMatch,
  NavSectionDTO,
} from '@/lib/navigation-menu';
export {
  buildNavSections,
  navItemIsActive,
  resolveNavigationInput,
  visaoGeralOnlyNav,
} from '@/lib/navigation-menu';

/**
 * Monta o menu permitido para o usuário da sessão.
 * UserToolPermission em lote + getRhContext só para Camada 2 do CMV Real.
 * Erro de cálculo → só "Visão geral" (fail-closed).
 */
export async function getNavigationForUser() {
  try {
    const ctx = await getRhContext();
    if (!ctx) return visaoGeralOnlyNav();

    const [perms, stackUser] = await Promise.all([
      prisma.userToolPermission.findMany({
        where: { stackUserId: ctx.stackUserId },
        select: { tool: true, isEnabled: true },
      }),
      prisma.stackUser.findUnique({
        where: { id: ctx.stackUserId },
        select: { isActive: true },
      }),
    ]);

    const enabledTools = perms.filter((p) => p.isEnabled).map((p) => p.tool);

    let lojaNaoConfigurada = false;
    if (!ctx.isAdmin && ctx.memberId) {
      const member = await prisma.rhTeamMember.findUnique({
        where: { id: ctx.memberId },
        select: { lojas: true, perfil: true },
      });
      if (member?.perfil === 'gerente_loja' && member.lojas.length === 0) {
        lojaNaoConfigurada = true;
      }
    }

    return buildNavSections(
      resolveNavigationInput({
        isActive: stackUser?.isActive === true,
        isAdmin: ctx.isAdmin,
        enabledTools,
        hasCmvRealVisualizar: ctx.hasPermission(P.CMV_REAL_VISUALIZAR),
        lojaNaoConfigurada,
      }),
    );
  } catch (error) {
    console.error('[navigation] getNavigationForUser fail-closed:', error);
    return visaoGeralOnlyNav();
  }
}
