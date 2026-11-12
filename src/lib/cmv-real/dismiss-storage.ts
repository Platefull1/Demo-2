/**
 * Lembra caixas de aviso fechadas por loja + competência (localStorage).
 * Se o fingerprint do conteúdo mudar, a caixa reabre.
 */

function storageKey(kind: string, storeSlug: string, competencia: string) {
  return `cmv-real:dismiss:${kind}:${storeSlug}:${competencia}`;
}

export function readDismissedFingerprint(
  kind: string,
  storeSlug: string,
  competencia: string
): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(storageKey(kind, storeSlug, competencia));
  } catch {
    return null;
  }
}

export function writeDismissedFingerprint(
  kind: string,
  storeSlug: string,
  competencia: string,
  fingerprint: string
): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      storageKey(kind, storeSlug, competencia),
      fingerprint
    );
  } catch {
    // ignore quota / private mode
  }
}

export function clearDismissedFingerprint(
  kind: string,
  storeSlug: string,
  competencia: string
): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(storageKey(kind, storeSlug, competencia));
  } catch {
    // ignore
  }
}

/** Fingerprint estável a partir de mensagens (ordem importa). */
export function fingerprintMessages(messages: string[]): string {
  return messages.join('\n');
}
