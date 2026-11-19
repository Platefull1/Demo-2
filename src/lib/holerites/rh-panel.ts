import type { PayslipStatus, PayslipType } from '@/lib/shared/holerites/types';

export const PAGE_SIZE = 25;

export type RhPayslipListStatus =
  | 'PUBLISHED'
  | 'VIEWED'
  | 'ACKNOWLEDGED'
  | 'REVOKED'
  | 'PENDENTES'
  | 'ABERTOS';

export type RhKpis = {
  publicados: number;
  abertos: number;
  confirmados: number;
  pendentes: number;
  pctAbertos: number;
  pctConfirmados: number;
  pctPendentes: number;
};

export function pctOf(n: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((n / total) * 1000) / 10;
}

export function buildRhKpis(counts: {
  publicados: number;
  abertos: number;
  confirmados: number;
  pendentes: number;
}): RhKpis {
  const pub = counts.publicados;
  return {
    ...counts,
    pctAbertos: pctOf(counts.abertos, pub),
    pctConfirmados: pctOf(counts.confirmados, pub),
    pctPendentes: pctOf(counts.pendentes, pub),
  };
}

/** Statuses incluídos na lista default (sem DRAFT; REVOKED só se pedido). */
export function statusesForFilter(
  status: string | null | undefined,
): PayslipStatus[] {
  switch (status) {
    case 'PUBLISHED':
      return ['PUBLISHED'];
    case 'VIEWED':
      return ['VIEWED'];
    case 'ACKNOWLEDGED':
      return ['ACKNOWLEDGED'];
    case 'REVOKED':
      return ['REVOKED'];
    case 'PENDENTES':
      return ['PUBLISHED', 'VIEWED'];
    case 'ABERTOS':
      return ['VIEWED', 'ACKNOWLEDGED'];
    default:
      return ['PUBLISHED', 'VIEWED', 'ACKNOWLEDGED'];
  }
}

export function maskIpLastOctet(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const v4 = /^(\d{1,3}\.\d{1,3}\.\d{1,3})\.(\d{1,3})$/.exec(ip.trim());
  if (v4) return `${v4[1]}.xxx`;
  // IPv6 simplificado: mascara o último grupo
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length > 1) {
      parts[parts.length - 1] = 'xxxx';
      return parts.join(':');
    }
  }
  return ip;
}

export function typeSlugForExport(type: PayslipType | string): string {
  const map: Record<string, string> = {
    MENSAL: 'mensal',
    ADIANTAMENTO: 'adiantamento',
    DECIMO_TERCEIRO_1: '13-1',
    DECIMO_TERCEIRO_2: '13-2',
    FERIAS: 'ferias',
    RESCISAO: 'rescisao',
  };
  return map[type] ?? 'holerite';
}

/** Competência civil do mês anterior em America/Sao_Paulo (yyyy-MM). */
export function competenciaMesAnterior(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(now);
  const y = Number(parts.find((p) => p.type === 'year')?.value);
  const m = Number(parts.find((p) => p.type === 'month')?.value);
  const d = new Date(Date.UTC(y, m - 2, 1));
  const yy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${yy}-${mm}`;
}
