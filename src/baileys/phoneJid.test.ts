import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeBrPhoneDigits,
  phoneLookupVariants,
  isAlreadyWhatsAppJid,
  passthroughJid,
  digitsToLegacyJid,
  resolveDestinationWithCheck,
  clearJidResolveCache,
  setCachedResolvedJid,
  peekJidResolveCache,
  CACHE_TTL_POSITIVE_MS,
  CACHE_TTL_NEGATIVE_MS,
} from './phoneJid.js';

describe('phoneJid — normalização e variantes', () => {
  beforeEach(() => {
    clearJidResolveCache();
  });

  it('13 dígitos com 9: normaliza e gera variante sem o 9', () => {
    const digits = normalizeBrPhoneDigits('5541996420791');
    assert.equal(digits, '5541996420791');
    assert.deepEqual(phoneLookupVariants(digits!), [
      '5541996420791',
      '554196420791',
    ]);
  });

  it('12 dígitos sem 9: normaliza e gera variante com o 9', () => {
    const digits = normalizeBrPhoneDigits('554196420791');
    assert.equal(digits, '554196420791');
    assert.deepEqual(phoneLookupVariants(digits!), [
      '554196420791',
      '5541996420791',
    ]);
  });

  it('fixo (12 dígitos, não começa com 9 no local): ainda oferece variante com 9', () => {
    // 41 3333-4444 → 554133334444
    const digits = normalizeBrPhoneDigits('554133334444');
    assert.equal(digits, '554133334444');
    assert.deepEqual(phoneLookupVariants(digits!), [
      '554133334444',
      '5541933334444',
    ]);
  });

  it('número já com @lid: isAlreadyWhatsAppJid e passthrough sem alterar', () => {
    const jid = '123456789012345@lid';
    assert.equal(isAlreadyWhatsAppJid(jid), true);
    assert.equal(passthroughJid(jid), jid);
  });

  it('grupo @g.us: passa direto', () => {
    const jid = '120363025@g.us';
    assert.equal(isAlreadyWhatsAppJid(jid), true);
    assert.equal(passthroughJid(jid), jid);
  });

  it('número inválido: normalize retorna null e resolve → invalid_destination', async () => {
    assert.equal(normalizeBrPhoneDigits('12345'), null);
    assert.equal(normalizeBrPhoneDigits(''), null);
    assert.equal(isAlreadyWhatsAppJid('12345'), false);

    const resolved = await resolveDestinationWithCheck(async () => {
      throw new Error('não deve chamar check');
    }, '12345');
    assert.equal(resolved.ok, false);
    if (!resolved.ok) assert.equal(resolved.error, 'invalid_destination');
  });

  it('resolveDestinationWithCheck: JID @s.whatsapp.net não consulta check', async () => {
    let calls = 0;
    const resolved = await resolveDestinationWithCheck(async () => {
      calls += 1;
      return { numberExists: false };
    }, '5541996420791@s.whatsapp.net');
    assert.equal(calls, 0);
    assert.equal(resolved.ok, true);
    if (resolved.ok) {
      assert.equal(resolved.jid, '5541996420791@s.whatsapp.net');
    }
  });

  it('resolveDestinationWithCheck: usa variante sem 9 quando só ela existe', async () => {
    const resolved = await resolveDestinationWithCheck(async (id) => {
      const digits = String(id).replace(/\D/g, '');
      if (digits === '554196420791') {
        return {
          numberExists: true,
          id: { _serialized: '554196420791@s.whatsapp.net' },
        };
      }
      return { numberExists: false, id: null };
    }, '5541996420791');

    assert.equal(resolved.ok, true);
    if (resolved.ok) {
      assert.equal(resolved.jid, '554196420791@s.whatsapp.net');
      assert.equal(resolved.fallback, undefined);
    }
  });

  it('consulta respondeu e nenhuma variante existe → not_on_whatsapp', async () => {
    const resolved = await resolveDestinationWithCheck(async () => {
      return { numberExists: false, id: null };
    }, '5541996420791');
    assert.equal(resolved.ok, false);
    if (!resolved.ok) assert.equal(resolved.error, 'not_on_whatsapp');
  });

  it('exists deve ser estrito: numberExists true como string não conta', async () => {
    const resolved = await resolveDestinationWithCheck(async () => {
      return {
        numberExists: 'true' as unknown as boolean,
        id: { _serialized: '554196420791@s.whatsapp.net' },
      };
    }, '554196420791');
    assert.equal(resolved.ok, false);
    if (!resolved.ok) assert.equal(resolved.error, 'not_on_whatsapp');
  });

  it('exceção/timeout na consulta → fallback na variante original (não not_on_whatsapp)', async () => {
    const resolved = await resolveDestinationWithCheck(async () => {
      throw new Error('timeout / socket reconnecting');
    }, '5541996420791');

    assert.equal(resolved.ok, true);
    if (resolved.ok) {
      assert.equal(resolved.jid, '5541996420791@s.whatsapp.net');
      assert.equal(resolved.fallback, true);
    }
    // Não cacheia falha de consulta
    assert.equal(peekJidResolveCache('5541996420791'), undefined);
  });

  it('consulta mista (uma ok false + uma exceção) → fallback, não 422', async () => {
    const resolved = await resolveDestinationWithCheck(async (id) => {
      const digits = String(id).replace(/\D/g, '');
      if (digits === '5541996420791') {
        return { numberExists: false, id: null };
      }
      throw new Error('USync unavailable');
    }, '5541996420791');

    assert.equal(resolved.ok, true);
    if (resolved.ok) {
      assert.equal(resolved.jid, digitsToLegacyJid('5541996420791'));
      assert.equal(resolved.fallback, true);
    }
  });

  it('cache positivo TTL 24h; negativo TTL 10 min', () => {
    const now = Date.now();
    setCachedResolvedJid(['5541996420791'], '554196420791@s.whatsapp.net');
    const pos = peekJidResolveCache('5541996420791');
    assert.ok(pos);
    assert.equal(pos!.jid, '554196420791@s.whatsapp.net');
    assert.ok(
      Math.abs(pos!.expiresAt - (now + CACHE_TTL_POSITIVE_MS)) < 5_000,
      `positivo deve expirar ~24h (got ${pos!.expiresAt - now}ms)`,
    );

    clearJidResolveCache();
    const now2 = Date.now();
    setCachedResolvedJid(['5541996420791'], null);
    const neg = peekJidResolveCache('5541996420791');
    assert.ok(neg);
    assert.equal(neg!.jid, null);
    assert.ok(
      Math.abs(neg!.expiresAt - (now2 + CACHE_TTL_NEGATIVE_MS)) < 5_000,
      `negativo deve expirar ~10min (got ${neg!.expiresAt - now2}ms)`,
    );
  });

  it('cache negativo: segunda chamada não reconsulta e devolve not_on_whatsapp', async () => {
    let calls = 0;
    const check = async () => {
      calls += 1;
      return { numberExists: false, id: null };
    };

    const first = await resolveDestinationWithCheck(check, '554196420791');
    assert.equal(first.ok, false);
    assert.ok(calls >= 1);

    const callsAfter = calls;
    const second = await resolveDestinationWithCheck(check, '554196420791');
    assert.equal(second.ok, false);
    if (!second.ok) assert.equal(second.error, 'not_on_whatsapp');
    assert.equal(calls, callsAfter, 'não deve reconsultar enquanto cache negativo válido');
  });
});
