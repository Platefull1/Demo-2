import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  displayLojaNome,
  lojasEquivalentes,
  normalizeLojaKey,
} from './loja-match';

describe('displayLojaNome / lojasEquivalentes', () => {
  it('unifica variantes de Ahú e Pilarzinho', () => {
    assert.equal(displayLojaNome('CALENZANO AHÚ'), 'Ahú');
    assert.equal(displayLojaNome('AHÚ'), 'Ahú');
    assert.equal(displayLojaNome('Loja Ahú'), 'Ahú');
    assert.equal(displayLojaNome('Calenzano Pilarzinho'), 'Pilarzinho');
    assert.equal(displayLojaNome('Pilarzinho'), 'Pilarzinho');
  });

  it('Pilarzinho não casa com Ahú', () => {
    assert.equal(lojasEquivalentes('Pilarzinho', 'AHÚ'), false);
    assert.equal(lojasEquivalentes('CALENZANO PILARZINHO', 'Pilarzinho'), true);
    assert.equal(lojasEquivalentes('CALENZANO AHÚ', 'Ahú'), true);
    assert.equal(normalizeLojaKey('Pilarzinho'), 'pilarzinho');
    assert.equal(normalizeLojaKey('AHÚ'), 'ahu');
  });
});
