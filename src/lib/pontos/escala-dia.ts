/**
 * Lógica pura de "é folga nesta data?" a partir de diasFolga + domingoFolga.
 * Reutilizada por classificarDia e por funcionarioEstaDeFolga (RH/tarefas).
 */

const ABREV_TO_DOW: Record<string, number> = {
  Dom: 0,
  Seg: 1,
  Ter: 2,
  Qua: 3,
  Qui: 4,
  Sex: 5,
  Sáb: 6,
  Sab: 6,
};

/** Converte diasFolga do RH (["Seg","Dom"] ou [0,1]) para set 0–6. */
export function normalizeDiasFolga(raw: unknown): Set<number> {
  const out = new Set<number>();
  if (!Array.isArray(raw)) return out;
  for (const item of raw) {
    if (typeof item === 'number' && Number.isInteger(item) && item >= 0 && item <= 6) {
      out.add(item);
      continue;
    }
    if (typeof item === 'string') {
      const t = item.trim();
      if (t in ABREV_TO_DOW) {
        out.add(ABREV_TO_DOW[t]);
        continue;
      }
      const n = Number.parseInt(t, 10);
      if (Number.isInteger(n) && n >= 0 && n <= 6) out.add(n);
    }
  }
  return out;
}

/** YYYY-MM-DD no fuso America/Sao_Paulo (relógio "agora"). */
export function ymdBrasilia(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(date);
}

/**
 * Dia civil gravado no banco (Date em 00:00 UTC = YYYY-MM-DD da competência).
 * Não usar Brasilia aqui — meia-noite UTC vira véspera em BRT.
 */
export function calendarYmd(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Weekday 0=Dom … 6=Sáb a partir de YYYY-MM-DD (meio-dia BRT). */
export function weekdayFromYmd(ymd: string): number {
  return new Date(`${ymd}T12:00:00-03:00`).getUTCDay();
}

export function sundaySlotInMonth(ymd: string): { nth: number; isLast: boolean } {
  const [y, m, day] = ymd.split('-').map(Number);
  const nth = Math.ceil(day / 7);
  const lastDay = new Date(y, m, 0).getDate();
  return { nth, isLast: day + 7 > lastDay };
}

export type EscalaFolgaSnapshot = {
  diasFolga?: unknown;
  domingoFolga?: string | null;
};

/**
 * Folga por dia da semana fixo + DSR (N-ésimo/último domingo do mês).
 * Não considera férias, ativo nem ocorrências.
 */
export function escalaEhFolgaNoDia(escala: EscalaFolgaSnapshot, date: Date): boolean {
  const ymd = calendarYmd(date);
  const weekday = weekdayFromYmd(ymd);
  const folgas = normalizeDiasFolga(escala.diasFolga);

  if (folgas.has(weekday)) return true;

  if (weekday === 0 && escala.domingoFolga && !folgas.has(0)) {
    const { nth, isLast } = sundaySlotInMonth(ymd);
    const slot = String(escala.domingoFolga);
    if (slot === 'ultimo' && isLast) return true;
    if (slot === String(nth) && nth >= 1 && nth <= 4) return true;
  }

  return false;
}

/** Escala sem nenhum dia de folga cadastrado. */
export function escalaSemFolgasCadastradas(escala: EscalaFolgaSnapshot): boolean {
  const folgas = normalizeDiasFolga(escala.diasFolga);
  return folgas.size === 0 && (escala.domingoFolga == null || escala.domingoFolga === '');
}

/** Minutos de jornada a partir de HH:mm (cruza meia-noite se saída < entrada). */
export function jornadaMinutos(horarioEntrada: string, horarioSaida: string): number {
  const parse = (v: string): number | null => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(v.trim());
    if (!m) return null;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (h > 23 || min > 59) return null;
    return h * 60 + min;
  };
  const e = parse(horarioEntrada);
  const s = parse(horarioSaida);
  if (e === null || s === null) return 8 * 60;
  if (s >= e) return s - e;
  return s + 24 * 60 - e;
}

export function minutosParaHhMm(total: number): string {
  const safe = Math.max(0, Math.round(total));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Converte "HH:MM" ou "H:MM" → minutos totais. Retorna 0 para vazio/inválido. */
export function hhmmToMinutos(value: string | null | undefined): number {
  if (!value) return 0;
  const m = /^(\d{1,3}):(\d{2})$/.exec(value.trim());
  if (!m) return 0;
  return Number(m[1]) * 60 + Number(m[2]);
}

/** Date UTC meia-noite a partir de YYYY-MM-DD. */
export function ymdToUtcDate(ymd: string): Date {
  return new Date(`${ymd}T00:00:00.000Z`);
}

export function addDaysYmd(ymd: string, days: number): string {
  const d = ymdToUtcDate(ymd);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function sameYmd(a: Date, b: Date): boolean {
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}
