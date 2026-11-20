/**
 * Normalização e resolução de JID WhatsApp (variantes do 9º dígito BR).
 * Funções puras + resolve via checkNumberStatus (sem duplicar onWhatsApp/USync).
 */

export const CACHE_TTL_POSITIVE_MS = 24 * 60 * 60 * 1000;
export const CACHE_TTL_NEGATIVE_MS = 10 * 60 * 1000;

/** @type {Map<string, { jid: string|null, expiresAt: number }>} */
const jidResolveCache = new Map();

const JID_SUFFIX_RE = /@(s\.whatsapp\.net|c\.us|lid|g\.us)$/i;

/**
 * Destino já é JID (não mexer no número).
 * @param {unknown} to
 */
export function isAlreadyWhatsAppJid(to) {
  const s = String(to || '').trim();
  return JID_SUFFIX_RE.test(s);
}

/**
 * Converte @c.us → @s.whatsapp.net quando preferBaileys (default).
 * @param {string} to
 * @param {{ preferBaileys?: boolean }} [opts]
 */
export function passthroughJid(to, opts = {}) {
  let dest = String(to || '').trim();
  if (!dest) return '';
  const preferBaileys = opts.preferBaileys !== false;
  if (preferBaileys && dest.toLowerCase().endsWith('@c.us')) {
    dest = dest.replace(/@c\.us$/i, '@s.whatsapp.net');
  }
  return dest;
}

/**
 * Monta JID na variante original (comportamento antigo, sem consultar WA).
 * @param {string} digits
 * @param {{ preferBaileys?: boolean }} [opts]
 */
export function digitsToLegacyJid(digits, opts = {}) {
  const d = String(digits || '').replace(/\D/g, '');
  if (!d) return '';
  const preferBaileys = opts.preferBaileys !== false;
  return preferBaileys ? `${d}@s.whatsapp.net` : `${d}@c.us`;
}

/**
 * Normaliza telefone BR para dígitos com DDI 55.
 * Aceita "41996420791", "5541996420791", "5541996420791@c.us", etc.
 * @param {unknown} input
 * @returns {string|null} só dígitos (12–13) ou null
 */
export function normalizeBrPhoneDigits(input) {
  const raw = String(input || '').replace(/\D/g, '');
  if (!raw) return null;
  if (raw.length === 10 || raw.length === 11) return `55${raw}`;
  if ((raw.length === 12 || raw.length === 13) && raw.startsWith('55')) return raw;
  return null;
}

/**
 * Variantes a consultar no WhatsApp (com/sem 9º dígito).
 * - 13 dígitos (55+DDD+9+8, nono = 9): tenta com e sem o 9
 * - 12 dígitos (55+DDD+8): tenta como está e com o 9 inserido
 * @param {string} digits
 * @returns {string[]}
 */
export function phoneLookupVariants(digits) {
  const d = String(digits || '');
  if (!d) return [];

  /** @type {string[]} */
  const variants = [d];

  if (d.length === 13 && d.startsWith('55') && d[4] === '9') {
    const without9 = d.slice(0, 4) + d.slice(5);
    if (!variants.includes(without9)) variants.push(without9);
  } else if (d.length === 12 && d.startsWith('55')) {
    const with9 = d.slice(0, 4) + '9' + d.slice(4);
    if (!variants.includes(with9)) variants.push(with9);
  }

  return variants;
}

/**
 * @param {string} digits
 * @returns {string|null|undefined} jid, null (não existe), undefined (miss)
 */
export function getCachedResolvedJid(digits) {
  const entry = jidResolveCache.get(String(digits || ''));
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    jidResolveCache.delete(String(digits || ''));
    return undefined;
  }
  return entry.jid;
}

/**
 * Peek da entrada de cache (testes / debug).
 * @param {string} digits
 * @returns {{ jid: string|null, expiresAt: number }|undefined}
 */
export function peekJidResolveCache(digits) {
  const entry = jidResolveCache.get(String(digits || ''));
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    jidResolveCache.delete(String(digits || ''));
    return undefined;
  }
  return { jid: entry.jid, expiresAt: entry.expiresAt };
}

/**
 * @param {string[]} keys
 * @param {string|null} jid — string = positivo (24h); null = não existe (10 min)
 */
export function setCachedResolvedJid(keys, jid) {
  const ttl = jid ? CACHE_TTL_POSITIVE_MS : CACHE_TTL_NEGATIVE_MS;
  const entry = { jid, expiresAt: Date.now() + ttl };
  for (const k of keys) {
    if (k) jidResolveCache.set(String(k), entry);
  }
}

/** Limpa cache (testes). */
export function clearJidResolveCache() {
  jidResolveCache.clear();
}

/**
 * Resolve destino para envio reutilizando checkNumberStatus (exists === true).
 *
 * - Consulta OK e nenhuma variante existe → not_on_whatsapp (422)
 * - Exceção/timeout na consulta → fallback na variante original + warn (não 422)
 *
 * @param {(idOrPhone: string) => Promise<{
 *   numberExists?: boolean,
 *   canReceiveMessage?: boolean,
 *   id?: { _serialized?: string } | null
 * }>} checkFn
 * @param {unknown} to
 * @param {{ preferBaileys?: boolean, useCache?: boolean }} [opts]
 * @returns {Promise<
 *   | { ok: true, jid: string, fallback?: boolean }
 *   | { ok: false, error: 'not_on_whatsapp' | 'invalid_destination' }
 * >}
 */
export async function resolveDestinationWithCheck(checkFn, to, opts = {}) {
  const raw = String(to || '').trim();
  if (!raw) return { ok: false, error: 'invalid_destination' };

  if (isAlreadyWhatsAppJid(raw)) {
    const jid = passthroughJid(raw, opts);
    if (!jid) return { ok: false, error: 'invalid_destination' };
    return { ok: true, jid };
  }

  const digits = normalizeBrPhoneDigits(raw);
  if (!digits) return { ok: false, error: 'invalid_destination' };

  const variants = phoneLookupVariants(digits);
  const useCache = opts.useCache !== false;

  if (useCache) {
    for (const v of variants) {
      const cached = getCachedResolvedJid(v);
      if (cached !== undefined) {
        if (cached) return { ok: true, jid: passthroughJid(cached, opts) };
        return { ok: false, error: 'not_on_whatsapp' };
      }
    }
  }

  let anyQueryOk = false;
  let anyQueryError = false;
  /** @type {string[]} */
  const queryErrors = [];

  for (const v of variants) {
    try {
      const result = await checkFn(v);
      anyQueryOk = true;
      // Estrito: só numberExists === true (checkNumberStatus já exige exists === true)
      if (result?.numberExists === true && result?.id?._serialized) {
        const jid = passthroughJid(result.id._serialized, opts);
        if (useCache) setCachedResolvedJid(variants, jid);
        return { ok: true, jid };
      }
    } catch (err) {
      anyQueryError = true;
      queryErrors.push(`${v}: ${err?.message || String(err)}`);
    }
  }

  // Consulta falhou (socket, timeout, etc.) → não afirmar "não existe"
  if (anyQueryError) {
    const legacy = digitsToLegacyJid(digits, opts);
    // eslint-disable-next-line no-console
    console.warn(
      `[phoneJid] consulta onWhatsApp/USync falhou — enviando variante original ${legacy}. ` +
        `erros=[${queryErrors.join('; ')}]`,
    );
    return { ok: true, jid: legacy, fallback: true };
  }

  // Consulta respondeu e nenhuma variante existe
  if (anyQueryOk) {
    if (useCache) setCachedResolvedJid(variants, null);
    return { ok: false, error: 'not_on_whatsapp' };
  }

  // Sem variantes / sem chamada — fallback seguro
  const legacy = digitsToLegacyJid(digits, opts);
  return { ok: true, jid: legacy, fallback: true };
}
