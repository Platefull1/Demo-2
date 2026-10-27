/** Fuso fixo America/Sao_Paulo (UTC−3; Brasil sem horário de verão desde 2019). */
const SP_OFFSET = '-03:00';

export function saoPauloYmd(date = new Date()): {
  year: number;
  month: number;
  day: number;
} {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

export function currentMonthBoundsSP(now = new Date()): { start: Date; end: Date } {
  const { year, month } = saoPauloYmd(now);
  const mm = String(month).padStart(2, '0');
  const start = new Date(`${year}-${mm}-01T00:00:00.000${SP_OFFSET}`);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const nm = String(nextMonth).padStart(2, '0');
  const end = new Date(
    new Date(`${nextYear}-${nm}-01T00:00:00.000${SP_OFFSET}`).getTime() - 1,
  );
  return { start, end };
}

/** Interpreta YYYY-MM-DD como início do dia em São Paulo. */
export function spDayStart(ymd: string): Date {
  return new Date(`${ymd}T00:00:00.000${SP_OFFSET}`);
}

/** Interpreta YYYY-MM-DD como fim do dia em São Paulo. */
export function spDayEnd(ymd: string): Date {
  return new Date(`${ymd}T23:59:59.999${SP_OFFSET}`);
}
