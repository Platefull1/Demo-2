/**
 * Cache TTL para lookups de config/gerente (evita hit no banco a cada mensagem).
 */

const DEFAULT_TTL_MS = 3 * 60 * 1000;

/** @type {Map<string, { expires: number, value: any }>} */
const store = new Map();

export function cacheGet(key) {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (Date.now() > hit.expires) {
    store.delete(key);
    return undefined;
  }
  return hit.value;
}

export function cacheSet(key, value, ttlMs = DEFAULT_TTL_MS) {
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}

export function cacheDel(prefixOrKey) {
  if (!prefixOrKey) {
    store.clear();
    return;
  }
  for (const k of store.keys()) {
    if (k === prefixOrKey || k.startsWith(prefixOrKey)) store.delete(k);
  }
}
