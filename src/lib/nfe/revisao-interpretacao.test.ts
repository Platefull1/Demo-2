/**
 * Testes da interpretação de revisão (UI CMV Real).
 * Rodar: npx tsx --test src/lib/nfe/revisao-interpretacao.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatFatorBr,
  interpretarRevisaoItem,
  nomeProdutoParaInterpretacao,
  opcaoEProvavel,
  parseFatorBr,
} from './revisao-interpretacao';
import {
  catalogoPareceGenericoDemais,
  scoreCatalogMatch,
} from './similarity';

describe('nomeProdutoParaInterpretacao', () => {
  it('remove NxP e sufixo', () => {
    assert.equal(
      nomeProdutoParaInterpretacao(
        'RECHEIO DOCEIRO MORANGO 8X1,005KG - 1 CX COM 1',
      ),
      'RECHEIO DOCEIRO MORANGO',
    );
  });
});

describe('parseFatorBr', () => {
  it('aceita 1,005 e 1.005 como 1.005', () => {
    assert.equal(parseFatorBr('1,005'), 1.005);
    assert.equal(parseFatorBr('1.005'), 1.005);
  });

  it('formata de volta em pt-BR', () => {
    assert.equal(formatFatorBr(1.005), '1,005');
    assert.equal(formatFatorBr(8.04), '8,04');
  });
});

describe('interpretarRevisaoItem — cards', () => {
  it('empate COM 1 + qtd 1 → pré-seleciona caixa, mostra pacote', () => {
    const r = interpretarRevisaoItem({
      descricao: 'RECHEIO DOCEIRO MORANGO 8X1,005KG - 1 CX COM 1',
      quantidade: 1,
      unidadeComercial: 'KG',
      unidadeCmv: 'KG',
      valorItem: 23.99,
      secao: 'MATERIA_PRIMA',
    });
    assert.equal(r.empateCaixaInternas, true);
    assert.equal(r.contagem, 'caixas');
    assert.equal(r.opcaoPadrao, 'caixa');
    assert.equal(opcaoEProvavel('caixa', r), false);

    const pacote = r.opcoes.find((o) => o.id === 'pacote');
    const caixa = r.opcoes.find((o) => o.id === 'caixa');
    assert.ok(pacote);
    assert.ok(caixa);
    assert.match(pacote!.label, /1 pacote de 1,005 kg/);
    assert.match(caixa!.label, /1 caixa fechada \(8 × 1,005 kg\)/);
    assert.equal(caixa!.fator, 8.04);
    assert.ok(Math.abs((pacote!.totalKg ?? 0) - 1.005) < 0.001);
    assert.ok(Math.abs((caixa!.custoPorKg ?? 0) - 23.99 / 8.04) < 0.02);
  });

  it('sem histórico: prefer faixa; com histórico: mais perto', () => {
    const comHist = interpretarRevisaoItem({
      descricao: 'RECHEIO DOCEIRO MORANGO 8X1,005KG - 1 CX COM 8',
      quantidade: 1,
      unidadeComercial: 'KG',
      unidadeCmv: 'KG',
      valorItem: 23.99,
      secao: 'MATERIA_PRIMA',
      custoMedio: 3.0,
    });
    // qtd=1, COM 8 → caixas (não empate) → padrao caixa; histórico ~3 perto de 2,98
    assert.equal(comHist.opcaoPadrao, 'caixa');
  });
});

describe('score / catálogo genérico', () => {
  it('MORANGO vs RECHEIO… não é 100%', () => {
    const s = scoreCatalogMatch(
      'RECHEIO DOCEIRO MORANGO 8X1,005KG - 1 CX COM 1',
      'MORANGO',
    );
    assert.ok(s);
    assert.ok(s!.score < 1);
    assert.ok(s!.matchedTokens <= 1);
    assert.equal(
      catalogoPareceGenericoDemais(
        'RECHEIO DOCEIRO MORANGO 8X1,005KG - 1 CX COM 1',
        'MORANGO',
      ),
      true,
    );
  });
});
