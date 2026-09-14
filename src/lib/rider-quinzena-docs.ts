/**
 * Regras de documentos por tipo de quinzena (válido para todas as lojas):
 * - 1ª quinzena (dia 1–15): boleto obrigatório; NF opcional
 * - 2ª quinzena (dia 16–fim): boleto + NF obrigatórios
 *
 * Usa periodStart (dia do mês) em vez do periodLabel, que pode ser editado no RH.
 */

export type QuinzenaKind = 'first' | 'second';

export function getQuinzenaKind(periodStart: Date | string): QuinzenaKind {
  // Preferência: extrair o dia do ISO "YYYY-MM-DD" (como o RH envia ao criar)
  if (typeof periodStart === 'string' && /^\d{4}-\d{2}-\d{2}/.test(periodStart)) {
    const day = Number(periodStart.slice(8, 10));
    return day <= 15 ? 'first' : 'second';
  }
  const d = periodStart instanceof Date ? periodStart : new Date(periodStart);
  // Datas salvas via `new Date("YYYY-MM-DD")` ficam em meia-noite UTC
  const day = d.getUTCDate();
  return day <= 15 ? 'first' : 'second';
}

export function isDocumentsComplete(
  periodStart: Date | string,
  docs: { documentType: string }[],
): boolean {
  const hasBoleto = docs.some((d) => d.documentType === 'boleto');
  if (!hasBoleto) return false;

  if (getQuinzenaKind(periodStart) === 'first') return true;

  return docs.some((d) => d.documentType === 'nf');
}
