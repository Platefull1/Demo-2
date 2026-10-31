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

export function monthBoundsSP(ano: number, mes: number): { start: Date; end: Date } {
  const mm = String(mes).padStart(2, '0');
  const start = new Date(`${ano}-${mm}-01T00:00:00.000${SP_OFFSET}`);
  const nextMonth = mes === 12 ? 1 : mes + 1;
  const nextYear = mes === 12 ? ano + 1 : ano;
  const nm = String(nextMonth).padStart(2, '0');
  const end = new Date(
    new Date(`${nextYear}-${nm}-01T00:00:00.000${SP_OFFSET}`).getTime() - 1,
  );
  return { start, end };
}

export function currentMonthBoundsSP(now = new Date()): { start: Date; end: Date } {
  const { year, month } = saoPauloYmd(now);
  return monthBoundsSP(year, month);
}

export function previousMonth(ano: number, mes: number): { ano: number; mes: number } {
  if (mes <= 1) return { ano: ano - 1, mes: 12 };
  return { ano, mes: mes - 1 };
}

export function monthYearLabelSP(ano: number, mes: number): string {
  const d = new Date(`${ano}-${String(mes).padStart(2, '0')}-01T12:00:00.000${SP_OFFSET}`);
  const name = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    timeZone: 'America/Sao_Paulo',
  }).format(d);
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}/${ano}`;
}

export function monthNameSP(ano: number, mes: number): string {
  return monthYearLabelSP(ano, mes).replace(/\/\d+$/, '');
}

export function formatDateSP(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('day')}/${get('month')}/${get('year')}`;
}

/** Data/hora com ano de 4 dígitos (atas em PDF). */
export function formatOcorrenciaDateTimeLong(iso: string | Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`;
}

/** Meses civis SP que intersectam o intervalo [inicio, fim]. */
export function monthsOverlappingRange(
  inicio: Date,
  fim: Date,
): { ano: number; mes: number }[] {
  const start = saoPauloYmd(inicio);
  const end = saoPauloYmd(fim);
  const out: { ano: number; mes: number }[] = [];
  let y = start.year;
  let m = start.month;
  while (y < end.year || (y === end.year && m <= end.month)) {
    out.push({ ano: y, mes: m });
    if (m === 12) {
      m = 1;
      y += 1;
    } else {
      m += 1;
    }
    if (out.length > 24) break;
  }
  return out;
}

/** Interpreta YYYY-MM-DD como início do dia em São Paulo. */
export function spDayStart(ymd: string): Date {
  return new Date(`${ymd}T00:00:00.000${SP_OFFSET}`);
}

/** Interpreta YYYY-MM-DD como fim do dia em São Paulo. */
export function spDayEnd(ymd: string): Date {
  return new Date(`${ymd}T23:59:59.999${SP_OFFSET}`);
}

/** Data/hora da ocorrência sempre em America/Sao_Paulo. */
export function formatOcorrenciaDateTime(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`;
}
