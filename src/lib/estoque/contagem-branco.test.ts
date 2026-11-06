import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  quantidadeDaEscolha,
  somarQuantidadeContada,
} from './contagem-branco';

describe('contagem em branco', () => {
  it('campo vazio não vira zero, nem no somar', () => {
    assert.equal(somarQuantidadeContada(null, ''), null);
    assert.equal(somarQuantidadeContada(null, '   '), null);
    assert.equal(somarQuantidadeContada(4, ''), null);
  });

  it('a primeira quantidade digitada grava o valor, sem partir de zero gravado', () => {
    assert.equal(somarQuantidadeContada(null, '2,5'), 2.5);
    assert.equal(somarQuantidadeContada(2.5, '1'), 3.5);
  });

  it('zero e não contado são escolhas diferentes', () => {
    assert.equal(quantidadeDaEscolha('zero'), 0);
    assert.equal(quantidadeDaEscolha('nao_contado'), null);
  });
});
