import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeBrPhoneDigits,
  phoneLookupVariants,
  isAlreadyWhatsAppJid,
  passthroughJid,
  resolveDestinationWithCheck,
  clearJidResolveCache,
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
    }
  });

  it('resolveDestinationWithCheck: nenhuma variante → not_on_whatsapp', async () => {
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
});
