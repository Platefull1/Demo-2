import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { toListPublic, toPublic, maskApiKey } from './user-api-mask';

describe('toListPublic', () => {
  it('não inclui apiKey, keyPreview nem baseUrl', () => {
    const item = toListPublic({
      id: 'id-1',
      name: 'Loja A',
      status: 'connected',
      type: 'saipos',
      storeId: 'store_id-1',
      apiKey: 'Bearer secret-token-value',
    });
    assert.deepEqual(item, {
      id: 'id-1',
      name: 'Loja A',
      status: 'connected',
      type: 'saipos',
      storeId: 'store_id-1',
      hasKey: true,
    });
    assert.equal(JSON.stringify(item).includes('secret-token-value'), false);
  });
});

describe('toPublic', () => {
  it('remove apiKey e mascara preview', () => {
    const pub = toPublic({
      id: 'id-1',
      apiKey: 'abcdefgh12345678',
      name: 'X',
    });
    assert.equal('apiKey' in pub, false);
    assert.equal(pub.keyPreview, maskApiKey('abcdefgh12345678'));
    assert.equal(pub.hasKey, true);
  });
});
