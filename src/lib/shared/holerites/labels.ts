import type { PayslipStatus, PayslipType } from './types';

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const;

/** "2026-10" → "Outubro/2026" */
export function labelCompetencia(competencia: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(competencia);
  if (!m) return competencia;
  const year = m[1]!;
  const monthIdx = parseInt(m[2]!, 10) - 1;
  if (monthIdx < 0 || monthIdx > 11) return competencia;
  return `${MESES[monthIdx]}/${year}`;
}

const TYPE_LABELS: Record<PayslipType, string> = {
  MENSAL: 'Mensal',
  ADIANTAMENTO: 'Adiantamento',
  DECIMO_TERCEIRO_1: '13º salário – 1ª parcela',
  DECIMO_TERCEIRO_2: '13º salário – 2ª parcela',
  FERIAS: 'Férias',
  RESCISAO: 'Rescisão',
};

export function labelPayslipType(type: PayslipType): string {
  return TYPE_LABELS[type] ?? type;
}

/** Labels para o painel do RH */
export function labelPayslipStatusRh(status: PayslipStatus): string {
  switch (status) {
    case 'DRAFT':
      return 'Rascunho';
    case 'PUBLISHED':
      return 'Publicado';
    case 'VIEWED':
      return 'Aberto';
    case 'ACKNOWLEDGED':
      return 'Com ciência';
    case 'REVOKED':
      return 'Revogado';
    default:
      return status;
  }
}

/** Labels curtos para o portal do colaborador */
export function labelPayslipStatusColaborador(status: PayslipStatus): string {
  switch (status) {
    case 'PUBLISHED':
      return 'Novo';
    case 'VIEWED':
      return 'Visto';
    case 'ACKNOWLEDGED':
      return 'Confirmado';
    case 'REVOKED':
      return 'Retificado';
    case 'DRAFT':
      return 'Rascunho';
    default:
      return status;
  }
}
