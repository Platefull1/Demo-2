import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { saiposApiBelongsToUser } from './saipos-tenant';

describe('saiposApiBelongsToUser', () => {
  it('aceita só API Saipos da conta logada', () => {
    assert.equal(
      saiposApiBelongsToUser({ userId: 'u1', type: 'saipos' }, 'u1'),
      true,
    );
  });

  it('rejeita outra conta, outro tipo ou ausência', () => {
    assert.equal(
      saiposApiBelongsToUser({ userId: 'u2', type: 'saipos' }, 'u1'),
      false,
    );
    assert.equal(
      saiposApiBelongsToUser({ userId: 'u1', type: 'ifood' }, 'u1'),
      false,
    );
    assert.equal(saiposApiBelongsToUser(null, 'u1'), false);
    assert.equal(saiposApiBelongsToUser(undefined, 'u1'), false);
  });
});
