import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  compararUltimaCompra,
  custoSaldoEntraNoRecalculo,
  variacaoCustoBloqueada,
} from './importar-saldo-custo-resolve';

describe('custo do saldo final', () => {
  it('fechamento recalculado refaz custo positivo que não é manual', () => {
    assert.equal(
      custoSaldoEntraNoRecalculo({
        fechamentoFechado: false,
        qtd: 124.55,
        custoOrigem: 'CMV_TEORICO',
        custoMedio: 9.8,
        recalcularExistentes: true,
      }),
      true,
    );
  });

  it('nota aprovada ou fator alterado usa o mesmo recálculo', () => {
    assert.equal(
      custoSaldoEntraNoRecalculo({
        fechamentoFechado: false,
        qtd: 10.1,
        custoOrigem: 'ULTIMA_COMPRA_LOJA',
        custoMedio: 23.87,
        recalcularExistentes: true,
      }),
      true,
    );
  });

  it('contagem aplicada recálcula o custo, inclusive o que estava pendente', () => {
    assert.equal(
      custoSaldoEntraNoRecalculo({
        fechamentoFechado: false,
        qtd: 52.8,
        custoOrigem: 'PENDENTE',
        custoMedio: null,
        recalcularExistentes: true,
      }),
      true,
    );
  });

  it('custo manual não é sobrescrito', () => {
    assert.equal(
      custoSaldoEntraNoRecalculo({
        fechamentoFechado: false,
        qtd: 10,
        custoOrigem: 'MANUAL',
        custoMedio: 12,
        recalcularExistentes: true,
      }),
      false,
    );
  });

  it('mês fechado não recalcula, nem o custo pendente', () => {
    assert.equal(
      custoSaldoEntraNoRecalculo({
        fechamentoFechado: true,
        qtd: 10,
        custoOrigem: 'PENDENTE',
        custoMedio: null,
        recalcularExistentes: true,
      }),
      false,
    );
  });

  it('variação acima de 50% não grava sozinha', () => {
    assert.equal(variacaoCustoBloqueada(17.9, 1.6975), true);
    assert.equal(variacaoCustoBloqueada(9.8, 13.3791), false);
    assert.equal(variacaoCustoBloqueada(6.7, 6.5), false);
    assert.equal(variacaoCustoBloqueada(null, 13), false);
  });

  it('desempate: criação mais recente e, depois, o maior número da nota', () => {
    const dia = new Date('2026-10-26T03:00:00.000Z');
    const antiga = {
      dataEntrada: dia,
      createdAt: new Date('2026-10-26T12:00:00.000Z'),
      numero: '6735',
    };
    const recente = {
      dataEntrada: dia,
      createdAt: new Date('2026-10-27T12:00:00.000Z'),
      numero: '111764',
    };
    const mesmoInstante = {
      dataEntrada: dia,
      createdAt: recente.createdAt,
      numero: '6735',
    };
    const ordenadas = [antiga, recente].sort(compararUltimaCompra);
    assert.equal(ordenadas[0].numero, '111764');
    const porNumero = [mesmoInstante, recente].sort(compararUltimaCompra);
    assert.equal(porNumero[0].numero, '111764');
    const diaSeguinte = {
      dataEntrada: new Date('2026-10-27T03:00:00.000Z'),
      createdAt: new Date('2026-10-20T12:00:00.000Z'),
      numero: '1',
    };
    const porEntrada = [recente, diaSeguinte].sort(compararUltimaCompra);
    assert.equal(porEntrada[0].numero, '1');
  });

  it('sem o gatilho, custo positivo antigo permanece', () => {
    assert.equal(
      custoSaldoEntraNoRecalculo({
        fechamentoFechado: false,
        qtd: 10,
        custoOrigem: 'ULTIMA_COMPRA_LOJA',
        custoMedio: 1.32,
        recalcularExistentes: false,
      }),
      false,
    );
  });
});
