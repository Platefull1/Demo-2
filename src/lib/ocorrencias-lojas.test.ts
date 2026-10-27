import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isLojaEscritorio } from './ocorrencias-lojas';

describe('isLojaEscritorio', () => {
  it('exclui escritório com e sem acento', () => {
    assert.equal(isLojaEscritorio('Escritório'), true);
    assert.equal(isLojaEscritorio('Escritorio Central'), true);
    assert.equal(isLojaEscritorio('Central'), true);
  });

  it('mantém lojas operacionais', () => {
    assert.equal(isLojaEscritorio('Ahú'), false);
    assert.equal(isLojaEscritorio('Pilarzinho'), false);
    assert.equal(isLojaEscritorio('Portão'), false);
    assert.equal(isLojaEscritorio('Uberaba'), false);
  });
});
