/**
 * Regras de documentos por tipo de quinzena (válido para todas as lojas):
 * - 1ª quinzena (dia 1–15): boleto obrigatório; NF opcional
 * - 2ª quinzena (dia 16–fim): boleto + NF obrigatórios
 *
 * Usa periodStart (dia do mês) em vez do periodLabel, que pode ser editado no RH.
 */

export type QuinzenaKind = 'first' | 'second';
export type RiderDocStatus = 'none' | 'pending' | 'partial' | 'received';

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

/** True se periodStart cair na mesma quinzena civil de `now` (mês/ano + 1ª/2ª). */
export function isCurrentCalendarQuinzena(
  periodStart: Date | string,
  now = new Date(),
): boolean {
  let pYear: number;
  let pMonth: number; // 0-11
  let pDay: number;

  if (typeof periodStart === 'string' && /^\d{4}-\d{2}-\d{2}/.test(periodStart)) {
    pYear = Number(periodStart.slice(0, 4));
    pMonth = Number(periodStart.slice(5, 7)) - 1;
    pDay = Number(periodStart.slice(8, 10));
  } else {
    const d = periodStart instanceof Date ? periodStart : new Date(periodStart);
    pYear = d.getUTCFullYear();
    pMonth = d.getUTCMonth();
    pDay = d.getUTCDate();
  }

  // "Agora" em America/Sao_Paulo
  const sp = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now); // YYYY-MM-DD
  const nYear = Number(sp.slice(0, 4));
  const nMonth = Number(sp.slice(5, 7)) - 1;
  const nDay = Number(sp.slice(8, 10));

  if (pYear !== nYear || pMonth !== nMonth) return false;
  const periodKind = pDay <= 15 ? 'first' : 'second';
  const nowKind = nDay <= 15 ? 'first' : 'second';
  return periodKind === nowKind;
}

/**
 * Status da etiqueta na listagem de motoboys.
 * - Só considera a quinzena civil atual (quinzenas antigas = none, sem badge).
 * - Respeita regra 1ª (só boleto) vs 2ª (NF+boleto).
 * - paid/approved não geram alerta de pendência.
 */
export function computeRiderDocStatus(
  period: {
    periodStart: Date | string;
    status: string;
    documents: { documentType: string }[];
  } | null,
): RiderDocStatus {
  if (!period) return 'none';
  if (period.status === 'paid' || period.status === 'approved') return 'none';
  if (!isCurrentCalendarQuinzena(period.periodStart)) return 'none';

  if (isDocumentsComplete(period.periodStart, period.documents)) return 'received';

  const hasNf = period.documents.some((d) => d.documentType === 'nf');
  const hasBoleto = period.documents.some((d) => d.documentType === 'boleto');
  if (hasNf || hasBoleto) return 'partial';

  // Sem docs ainda — só alerta se a quinzena ainda está aguardando envio
  if (period.status === 'pending_documents') return 'pending';
  return 'none';
}
