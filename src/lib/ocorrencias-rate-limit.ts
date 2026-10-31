const hits = new Map<string, number[]>();

export const POST_OCORRENCIA_LIMIT = 30;
export const POST_OCORRENCIA_WINDOW_MS = 60_000;
export const OPCOES_LIMIT = 60;
export const OPCOES_WINDOW_MS = 60_000;
export const ATA_GEN_LIMIT = 10;
export const ATA_GEN_WINDOW_MS = 60_000;

/** Best-effort in-memory. Em serverless o limite é por instância. */
export function rateLimitAllow(
  key: string,
  max: number,
  windowMs: number,
  now = Date.now(),
): boolean {
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  return true;
}

/** Só para testes. */
export function rateLimitReset() {
  hits.clear();
}
