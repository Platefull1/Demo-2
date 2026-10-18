import { DIAS_SEMANA_PT } from '@/lib/tarefas-dias';
import {
  escalaEhFolgaNoDia,
  normalizeDiasFolga,
} from '@/lib/pontos/escala-dia';

export type FolgaFuncionario = {
  diasFolga?: unknown;
  domingoFolga?: string | null;
  ativo?: boolean;
  statusFerias?: string | null;
};

export { normalizeDiasFolga };

/**
 * Folga segundo a ficha do RH (tarefas / bot).
 * Mantém regras legadas de ativo/férias; classificação de ponto usa classificarDia.
 */
export function funcionarioEstaDeFolga(func: FolgaFuncionario, date: Date): boolean {
  if (func.ativo === false) return true;
  if (func.statusFerias === 'gozando') return true;
  return escalaEhFolgaNoDia(func, date);
}

export function labelFolga(func: FolgaFuncionario): string {
  const dias = [...normalizeDiasFolga(func.diasFolga)]
    .sort((a, b) => a - b)
    .map((d) => DIAS_SEMANA_PT[d]);
  const dsr = func.domingoFolga
    ? func.domingoFolga === 'ultimo'
      ? 'último domingo'
      : `${func.domingoFolga}º domingo`
    : null;
  const parts: string[] = [...dias];
  if (dsr && !dias.includes('Dom')) parts.push(`DSR ${dsr}`);
  return parts.join(', ') || '—';
}
