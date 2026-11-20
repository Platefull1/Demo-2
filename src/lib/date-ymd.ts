/**
 * Datas civis em America/Sao_Paulo, trafegadas como "yyyy-MM-dd".
 * Evita Date em UTC (selecionar dia 20 e gravar 19).
 */

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SP = 'America/Sao_Paulo';

export function todayYmd(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SP,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function parseYmd(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1);
}

export function formatYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatYmdDisplay(ymd: string): string {
  return format(parseYmd(ymd), 'dd/MM/yyyy');
}

/** Aceita yyyy-MM (ou prefixo); vazio/inválido → null. */
export function parseYm(
  ym: string | null | undefined,
): { year: number; month: number } | null {
  if (!ym || typeof ym !== 'string') return null;
  const m = /^(\d{4})-(\d{2})/.exec(ym.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (!Number.isFinite(year) || year < 1) return null;
  if (!Number.isFinite(month) || month < 1 || month > 12) return null;
  return { year, month };
}

export function formatMonthLong(ym: string | null | undefined): string {
  const parts = parseYm(ym);
  if (!parts) return 'Selecionar mês';
  const s = format(
    new Date(parts.year, parts.month - 1, 1),
    "MMMM 'de' yyyy",
    { locale: ptBR },
  );
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function addDaysYmd(ymd: string, days: number): string {
  const d = parseYmd(ymd);
  d.setDate(d.getDate() + days);
  return formatYmd(d);
}

export function startOfMonthYmd(ymd: string): string {
  const d = parseYmd(ymd);
  d.setDate(1);
  return formatYmd(d);
}

export function endOfMonthYmd(ymd: string): string {
  const d = parseYmd(ymd);
  d.setMonth(d.getMonth() + 1, 0);
  return formatYmd(d);
}

export function addMonthsYm(ym: string, delta: number): string {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y || 1970, (m || 1) - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function ymFromYmd(ymd: string): string {
  return ymd.slice(0, 7);
}
