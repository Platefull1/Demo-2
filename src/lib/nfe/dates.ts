/**
 * Datas NF-e: Saipos manda UTC; competência/semana em America/Sao_Paulo.
 */

const TZ = 'America/Sao_Paulo';

/** Converte ISO/Date UTC → partes calendário em Brasília. */
export function partsInSaoPaulo(input: Date | string): {
  year: number;
  month: number; // 1–12
  day: number;
  date: Date;
} {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) {
    throw new Error(`data inválida: ${input}`);
  }
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = fmt.formatToParts(d);
  const year = Number(parts.find((p) => p.type === 'year')?.value);
  const month = Number(parts.find((p) => p.type === 'month')?.value);
  const day = Number(parts.find((p) => p.type === 'day')?.value);
  return { year, month, day, date: d };
}

/** Competência YYYY-MM pela data de entrada (Brasília). */
export function competenciaFromDataEntrada(input: Date | string): string {
  const { year, month } = partsInSaoPaulo(input);
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Semana da competência (1–5) pelo dia do mês em Brasília.
 * 1ª=1–7, 2ª=8–14, 3ª=15–21, 4ª=22–28, 5ª=29–fim.
 */
export function semanaFromDataEntrada(input: Date | string): 1 | 2 | 3 | 4 | 5 {
  const { day } = partsInSaoPaulo(input);
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  if (day <= 28) return 4;
  return 5;
}
