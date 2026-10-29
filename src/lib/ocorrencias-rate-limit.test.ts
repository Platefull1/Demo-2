import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { rateLimitAllow, rateLimitReset } from './ocorrencias-rate-limit';

describe('rateLimitAllow', () => {
  it('bloqueia após o teto na janela', () => {
    rateLimitReset();
    for (let i = 0; i < 30; i++) {
      assert.equal(rateLimitAllow('u1', 30, 60_000, 1_000), true);
    }
    assert.equal(rateLimitAllow('u1', 30, 60_000, 1_000), false);
    assert.equal(rateLimitAllow('u2', 30, 60_000, 1_000), true);
    assert.equal(rateLimitAllow('u1', 30, 60_000, 1_000 + 60_001), true);
  });
});
