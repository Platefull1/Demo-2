import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { safeNext } from './safe-next';

describe('safeNext', () => {
  it('aceita path válido sob /colaborador/', () => {
    assert.equal(safeNext('/colaborador/holerites/abc'), '/colaborador/holerites/abc');
    assert.equal(safeNext('/colaborador/inicio'), '/colaborador/inicio');
  });

  it('rejeita open redirects e esquemas', () => {
    assert.equal(safeNext('https://x.com'), '/colaborador/inicio');
    assert.equal(safeNext('//x.com'), '/colaborador/inicio');
    assert.equal(safeNext('/\\x.com'), '/colaborador/inicio');
    assert.equal(safeNext('/rh/holerites'), '/colaborador/inicio');
    assert.equal(safeNext('javascript:alert(1)'), '/colaborador/inicio');
    assert.equal(safeNext('/colaborador'), '/colaborador/inicio');
    assert.equal(safeNext(null), '/colaborador/inicio');
    assert.equal(safeNext(''), '/colaborador/inicio');
  });
});
