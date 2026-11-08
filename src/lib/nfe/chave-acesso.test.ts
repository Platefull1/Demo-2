import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  digitsOnly,
  isChaveAcesso,
  parseChaveAcesso,
  sameNfNumero,
} from './chave-acesso';

const CHAVE = '41261161186888014305550050096968391070965571';

describe('chave-acesso', () => {
  it('parseia chave de 44 dígitos e extrai o número da NF', () => {
    const parsed = parseChaveAcesso(CHAVE);
    assert.ok(parsed);
    assert.equal(parsed!.chave, CHAVE);
    assert.equal(parsed!.numeroPadded, '009696839');
    assert.equal(parsed!.numero, '9696839');
  });

  it('aceita máscara / espaços e ainda reconhece a chave', () => {
    const masked =
      '4126 1161 1868 8801 4305 5500 5009 6968 3910 7096 5571';
    assert.equal(isChaveAcesso(masked), true);
    assert.equal(parseChaveAcesso(masked)?.numero, '9696839');
    assert.equal(digitsOnly(masked), CHAVE);
  });

  it('rejeita comprimentos diferentes de 44', () => {
    assert.equal(parseChaveAcesso('123'), null);
    assert.equal(parseChaveAcesso(CHAVE.slice(0, 43)), null);
    assert.equal(isChaveAcesso('9696839'), false);
  });

  it('compara número da NF ignorando zeros à esquerda', () => {
    assert.equal(sameNfNumero('9696839', '009696839'), true);
    assert.equal(sameNfNumero('740826', '000740826'), true);
    assert.equal(sameNfNumero('1', '2'), false);
  });
});
