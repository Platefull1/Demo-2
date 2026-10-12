/**
 * Testes da interpretação de revisão (UI CMV Real).
 * Rodar: npx tsx --test src/lib/nfe/revisao-interpretacao.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  interpretarRevisaoItem,
  linhaConferenciaCaixaFechada,
  nomeProdutoParaInterpretacao,
} from './revisao-interpretacao';

describe('nomeProdutoParaInterpretacao', () => {
  it('remove NxP e sufixo', () => {
    assert.equal(
      nomeProdutoParaInterpretacao(
        'RECHEIO DOCEIRO MORANGO 8X1,005KG - 1 CX COM 8',
      ),
      'RECHEIO DOCEIRO MORANGO',
    );
  });
});

describe('interpretarRevisaoItem', () => {
  it('KG + pack + CX COM: canto em un., pergunta por unidade', () => {
    const r = interpretarRevisaoItem({
      descricao: 'RECHEIO DOCEIRO MORANGO 8X1,005KG - 1 CX COM 8',
      quantidade: 1,
      unidadeComercial: 'KG',
      unidadeCmv: 'KG',
    });
    assert.equal(r.unidadeNaoConfiavel, true);
    assert.equal(r.contagem, 'internas');
    assert.equal(r.qtdExibicao, '1 un.');
    assert.equal(r.unidadeOriginalParen, 'KG');
    assert.equal(
      r.pergunta,
      'Quanto pesa cada unidade (pacote/lata/garrafa)?',
    );
    assert.match(r.linhaInterpretacao || '', /A nota diz 1 un\. de RECHEIO DOCEIRO MORANGO/);
    assert.match(r.linhaInterpretacao || '', /caixa de 8 × 1,005 kg/);
    assert.match(r.linhaInterpretacao || '', /vieram 1/);
    assert.equal(r.nPack, 8);
    assert.equal(r.pPack, 1.005);
  });

  it('qtd = internas → pergunta por unidade', () => {
    const r = interpretarRevisaoItem({
      descricao: 'MILHO VERDE LATA 6X1,500KG - 5 CXS E 0 UND',
      quantidade: 30,
      unidadeComercial: 'KG',
      unidadeCmv: 'KG',
    });
    assert.equal(r.contagem, 'internas');
    assert.equal(r.qtdExibicao, '30 un.');
    assert.equal(
      r.pergunta,
      'Quanto pesa cada unidade (pacote/lata/garrafa)?',
    );
  });

  it('qtd = caixas (sem COM parcial) → pergunta pela caixa', () => {
    const r = interpretarRevisaoItem({
      descricao: 'MILHO VERDE LATA 6X1,500KG - 5 CXS E 0 UND',
      quantidade: 5,
      unidadeComercial: 'KG',
      unidadeCmv: 'KG',
    });
    assert.equal(r.contagem, 'caixas');
    assert.equal(r.qtdExibicao, '5 cx.');
    assert.equal(r.pergunta, 'Quanto pesa a caixa?');
  });

  it('unidade confiável (CX) mantém pergunta legada', () => {
    const r = interpretarRevisaoItem({
      descricao: 'ACUCAR PCT 5KG - 1 CX COM 6',
      quantidade: 6,
      unidadeComercial: 'CX',
      unidadeCmv: 'KG',
    });
    assert.equal(r.unidadeNaoConfiavel, false);
    assert.equal(r.linhaInterpretacao, null);
    assert.equal(r.pergunta, 'Quanto pesa 1 CX?');
    assert.equal(r.qtdExibicao, '6 CX');
  });

  it('conferência caixa fechada', () => {
    const line = linhaConferenciaCaixaFechada({
      nPack: 8,
      fator: 1.005,
      valorItem: 23.92,
      sufixo: 'kg',
      mostrar: true,
    });
    assert.ok(line);
    assert.match(line!, /Se fossem 8 un\. \(caixa fechada\):/);
    assert.match(line!, /8,04 kg/);
  });
});
