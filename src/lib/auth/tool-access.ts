import { SystemTool } from '@/types/admin';

/**
 * Acesso de contexto (lista de lojas/APIs sem secrets).
 * registrar_ocorrencias sozinho não conta — usuário só-ocorrências fica de fora.
 */
export function toolsQualifyForContextAccess(tools: string[]): boolean {
  const enabled = tools.filter(Boolean);
  if (enabled.length === 0) return false;
  const onlyRegistrar =
    enabled.includes(SystemTool.REGISTRAR_OCORRENCIAS) &&
    !enabled.includes(SystemTool.VER_OCORRENCIAS) &&
    enabled.every((t) => t === SystemTool.REGISTRAR_OCORRENCIAS);
  return !onlyRegistrar;
}
