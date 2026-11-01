import { SystemTool } from '@/types/admin';

/**
 * Ferramentas que um membro "só registra ocorrência" pode ter sem sair
 * da tela isolada. `rh` entra porque o convite de equipe liga essa tag
 * por padrão — o membro novo precisa da mesma visão dos logins antigos.
 */
const OCORRENCIAS_ONLY_EXTRA = new Set<string>([SystemTool.RH]);

/**
 * Só REGISTRAR_OCORRENCIAS (sem VER). RH extra não tira do modo isolado.
 */
export function isOcorrenciasOnlyTools(tools: string[]): boolean {
  const enabled = tools.filter(Boolean);
  if (!enabled.includes(SystemTool.REGISTRAR_OCORRENCIAS)) return false;
  if (enabled.includes(SystemTool.VER_OCORRENCIAS)) return false;
  return enabled.every(
    (t) => t === SystemTool.REGISTRAR_OCORRENCIAS || OCORRENCIAS_ONLY_EXTRA.has(t),
  );
}

/**
 * Acesso de contexto (lista de lojas/APIs sem secrets).
 * Quem só registra ocorrência fica de fora — inclusive com a tag RH do convite.
 */
export function toolsQualifyForContextAccess(tools: string[]): boolean {
  const enabled = tools.filter(Boolean);
  if (enabled.length === 0) return false;
  return !isOcorrenciasOnlyTools(enabled);
}
