/**
 * Menu da sidebar: calculado no servidor a partir das permissões do usuário.
 * Itens sem permissão não entram — não existe estado "locked".
 */

import { prisma } from '@/lib/prisma';
import { getRhContext } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import { buildNavSections } from '@/lib/navigation-menu';

export type {
  NavChildDTO,
  NavIconName,
  NavItemDTO,
  NavMatch,
  NavSectionDTO,
} from '@/lib/navigation-menu';
export { buildNavSections, navItemIsActive } from '@/lib/navigation-menu';

function hasToolFromSet(enabled: Set<string>) {
  return (tool: SystemTool) => enabled.has(tool);
}

/**
 * Monta o menu permitido para o usuário da sessão.
 * Uma consulta em lote a UserToolPermission + getRhContext (CMV Real / admin).
 * Admin do tenant (getRhContext.isAdmin) vê todas as ferramentas.
 */
export async function getNavigationForUser() {
  const ctx = await getRhContext();
  if (!ctx) return [];

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

  if (!stackUser?.isActive) {
    return buildNavSections({ hasTool: () => false, canViewCmvReal: false });
  }

  const enabled = new Set<string>();
  if (ctx.isAdmin) {
    for (const tool of Object.values(SystemTool)) enabled.add(tool);
  } else {
    for (const p of perms) {
      if (p.isEnabled) enabled.add(p.tool);
    }
  }

  let canViewCmvReal = ctx.isAdmin || ctx.hasPermission(P.CMV_REAL_VISUALIZAR);
  if (canViewCmvReal && !ctx.isAdmin && ctx.memberId) {
    const member = await prisma.rhTeamMember.findUnique({
      where: { id: ctx.memberId },
      select: { lojas: true, perfil: true },
    });
    if (member?.perfil === 'gerente_loja' && member.lojas.length === 0) {
      canViewCmvReal = false;
    }
  }

  return buildNavSections({
    hasTool: hasToolFromSet(enabled),
    canViewCmvReal,
  });
}
