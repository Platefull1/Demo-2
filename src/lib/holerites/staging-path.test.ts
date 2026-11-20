import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveStagingSourcePath,
  toOpaqueSourceId,
} from './staging-path';

describe('staging-path', () => {
  it('toOpaqueSourceId devolve basename', () => {
    assert.equal(
      toOpaqueSourceId('tenant/_staging/batch/abc.pdf'),
      'abc.pdf',
    );
    assert.equal(toOpaqueSourceId(null), null);
  });

  it('resolveStagingSourcePath aceita opaco e path completo', () => {
    assert.equal(
      resolveStagingSourcePath('u1', 'b1', 'abc.pdf'),
      'u1/_staging/b1/abc.pdf',
    );
    assert.equal(
      resolveStagingSourcePath('u1', 'b1', 'u1/_staging/b1/abc.pdf'),
      'u1/_staging/b1/abc.pdf',
    );
  });

  it('rejeita path traversal', () => {
    assert.throws(() => resolveStagingSourcePath('u1', 'b1', '../x.pdf'));
    assert.throws(() => resolveStagingSourcePath('u1', 'b1', 'a/b.pdf'));
  });
});
