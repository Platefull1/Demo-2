const FALLBACK = '/colaborador/inicio';

/**
 * Valida `next` do deep link pós-login (anti open-redirect).
 * Só paths relativos sob `/colaborador/`.
 */
export function safeNext(raw: string | null | undefined): string {
  if (raw == null || typeof raw !== 'string') return FALLBACK;
  const next = raw.trim();
  if (!next) return FALLBACK;
  if (!next.startsWith('/colaborador/')) return FALLBACK;
  if (next.includes('//') || next.includes('\\')) return FALLBACK;
  // Esquema (javascript:, https:, etc.) mesmo em path relativo malicioso
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(next)) return FALLBACK;
  return next;
}
