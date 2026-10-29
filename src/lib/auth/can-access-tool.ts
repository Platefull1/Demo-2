import { SystemTool } from '@/types/admin';

/**
 * Camada 1: a ferramenta está ligada no painel (UserToolPermission).
 * Sem exceção para dono de equipe, conta solta ou isAdmin.
 */
export function canAccessToolFromState(input: {
  stackUserExists: boolean;
  isActive: boolean;
  enabledTools: Iterable<string>;
  tool: SystemTool;
}): boolean {
  if (!input.stackUserExists || !input.isActive) return false;
  const enabled =
    input.enabledTools instanceof Set
      ? input.enabledTools
      : new Set(input.enabledTools);
  return enabled.has(input.tool);
}

/**
 * CMV Real no menu/página: Camada 1 (tool) AND Camada 2 (RH / loja).
 * Dono do tenant (isAdmin) não precisa de cmv_real.visualizar, mas precisa da tool.
 */
export function canSeeCmvReal(input: {
  hasCmvRealTool: boolean;
  isAdmin: boolean;
  hasCmvRealVisualizar: boolean;
  lojaNaoConfigurada: boolean;
}): boolean {
  if (!input.hasCmvRealTool) return false;
  if (input.lojaNaoConfigurada) return false;
  if (input.isAdmin) return true;
  return input.hasCmvRealVisualizar;
}
