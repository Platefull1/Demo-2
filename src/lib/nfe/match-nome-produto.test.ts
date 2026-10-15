import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  matchNomeProdutoLista,
  nomesProdutoConflitam,
  tokensDistintivosConflitam,
  tokensNumericosConflitam,
} from './match-nome-produto';
import { normalizarDescricao } from './normalize';

function item(nome: string) {
  return { id: nome, nome, nomeNormalizado: normalizarDescricao(nome) };
}

describe('tokensNumericosConflitam', () => {
  it('EMBALAGEM 25 vs 20 → conflito', () => {
    assert.equal(tokensNumericosConflitam('EMBALAGEM 25', 'EMBALAGEM 20'), true);
  });
  it('2L = 2 LITROS', () => {
    assert.equal(
      tokensNumericosConflitam('GUARANA 2L', 'GUARANA 2 LITROS'),
      false,
    );
  });
  it('1,5 = 1.5', () => {
    assert.equal(tokensNumericosConflitam('ITEM 1,5', 'ITEM 1.5'), false);
  });
  it('900 ML = 900ML', () => {
    assert.equal(tokensNumericosConflitam('X 900 ML', 'X 900ML'), false);
  });
});

describe('tokensDistintivosConflitam', () => {
  it('PEPSI vs COCA → conflito', () => {
    assert.equal(
      tokensDistintivosConflitam('PEPSI 600 ZERO', 'COCA 600 ZERO'),
      true,
    );
  });
  it('GUARANA vs LARANJA → conflito', () => {
    assert.equal(
      tokensDistintivosConflitam(
        'FANTA GUARANA 2 LITROS',
        'FANTA LARANJA 2 LITROS',
      ),
      true,
    );
  });
  it('ZERO de um lado bloqueia', () => {
    assert.equal(
      tokensDistintivosConflitam('COCA 600', 'COCA 600 ZERO'),
      true,
    );
  });
  it('acento não bloqueia GUARANA/GUARANÁ', () => {
    assert.equal(
      tokensDistintivosConflitam('FANTA GUARANA LATA', 'FANTA GUARANÁ LATA'),
      false,
    );
  });
  it('LATA dedupe', () => {
    assert.equal(
      tokensDistintivosConflitam(
        'CERVEJA SPATEN LATA LATA',
        'CERVEJA SPATEN LATA',
      ),
      false,
    );
  });
});

describe('matchNomeProdutoLista — critérios aceite', () => {
  const catalogo = [
    item('EMBALAGEM 20'),
    item('EMBALAGEM 25'),
    item('EMBALAGEM 30'),
    item('EMBALAGEM 35'),
    item('EMBALAGEM 40'),
    item('EMBALAGEM ENTRADAS'),
    item('COCA 600 ZERO'),
    item('PEPSI 600 ZERO'),
    item('FANTA LARANJA 2 LITROS'),
    item('FANTA GUARANA 2 LITROS'),
    item('FANTA GUARANÁ LATA'),
    item('CERVEJA SPATEN LATA'),
    item('GUARANA ANTARCTICA 2 LITROS'),
    item('COCA 600'),
    item('LINGUIÇA BLUMENAU'),
  ];

  it('EMBALAGEM 25 não casa com EMBALAGEM 20', () => {
    assert.equal(nomesProdutoConflitam('EMBALAGEM 25', 'EMBALAGEM 20'), true);
    const m = matchNomeProdutoLista('EMBALAGEM 25', catalogo);
    assert.equal(m.status, 'casado');
    assert.equal(m.item?.nome, 'EMBALAGEM 25');
  });

  it('PEPSI 600 ZERO vs COCA 600 ZERO → sem match', () => {
    const m = matchNomeProdutoLista('PEPSI 600 ZERO', [item('COCA 600 ZERO')]);
    assert.equal(m.status, 'nao_encontrado');
  });

  it('FANTA GUARANA 2 LITROS vs FANTA LARANJA → sem match', () => {
    const m = matchNomeProdutoLista('FANTA GUARANA 2 LITROS', [
      item('FANTA LARANJA 2 LITROS'),
    ]);
    assert.equal(m.status, 'nao_encontrado');
  });

  it('COCA 600 vs COCA 600 ZERO → sem match', () => {
    const m = matchNomeProdutoLista('COCA 600', [item('COCA 600 ZERO')]);
    assert.equal(m.status, 'nao_encontrado');
  });

  it('GUARANÁ ANTÁRCTICA 2L vs GUARANA ANTARCTICA 2 LITROS → match', () => {
    const m = matchNomeProdutoLista('GUARANÁ ANTÁRCTICA 2L', [
      item('GUARANA ANTARCTICA 2 LITROS'),
    ]);
    assert.notEqual(m.status, 'nao_encontrado');
    assert.equal(m.item?.nome, 'GUARANA ANTARCTICA 2 LITROS');
  });

  it('FANTA GUARANA LATA vs FANTA GUARANÁ LATA → match', () => {
    const m = matchNomeProdutoLista('FANTA GUARANA LATA', [
      item('FANTA GUARANÁ LATA'),
    ]);
    assert.notEqual(m.status, 'nao_encontrado');
  });

  it('CERVEJA SPATEN LATA LATA → SPATEN LATA', () => {
    const m = matchNomeProdutoLista('CERVEJA SPATEN LATA LATA', [
      item('CERVEJA SPATEN LATA'),
      item('CERVEJA HEINEKEN LATA'),
    ]);
    assert.notEqual(m.status, 'nao_encontrado');
    assert.equal(m.item?.nome, 'CERVEJA SPATEN LATA');
  });
});
