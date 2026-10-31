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

export function formatMonthLong(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  const s = format(new Date(y || 1970, (m || 1) - 1, 1), "MMMM 'de' yyyy", {
    locale: ptBR,
  });
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
