import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  agruparHistoricoCustoPorInsumo,
  avaliarAlertaPrecoRevisao,
  deveAlertarPreco,
  mediana,
} from './alerta-preco-revisao';

describe('alerta-preco-revisao', () => {
  it('mediana ímpar e par', () => {
    assert.equal(mediana([10, 20, 30]), 20);
    assert.equal(mediana([10, 20, 30, 40]), 25);
    assert.equal(mediana([]), null);
  });

  it('alerta quando atual ≥ R$ 3 acima da mediana', () => {
    const r = deveAlertarPreco({
      custoAtual: 24,
      historico: [20, 20.5, 19.8, 21, 20.2],
    });
    assert.equal(r.ativo, true);
    assert.ok((r.referencia ?? 0) >= 19 && (r.referencia ?? 0) <= 21);
    assert.ok(r.delta >= 3);
  });

  it('não alerta com aumento menor que R$ 3', () => {
    const r = deveAlertarPreco({
      custoAtual: 21.5,
      historico: [20, 20, 20, 20, 20],
    });
    assert.equal(r.ativo, false);
  });

  it('pega aumento absoluto em item barato (ex.: 1,50 → 4,80)', () => {
    const r = deveAlertarPreco({
      custoAtual: 4.8,
      historico: [1.4, 1.5, 1.6, 1.5, 1.55],
    });
    assert.equal(r.ativo, true);
    assert.ok(r.delta >= 3);
  });

  it('sem histórico não alerta', () => {
    assert.equal(
      avaliarAlertaPrecoRevisao({ custoAtual: 30, historico: [] }),
      null,
    );
  });

  it('monta mensagem no tom do Confira o peso', () => {
    const a = avaliarAlertaPrecoRevisao({
      custoAtual: 24,
      historico: [20, 20, 20],
      sufixo: 'kg',
    });
    assert.ok(a);
    assert.match(a!.mensagem, /^Confira o preço:/);
    assert.match(a!.mensagem, /kg/);
  });

  it('agrupa últimas 5 notas distintas por insumo', () => {
    const rows = [
      { estoqueInsumoId: 'a', custoUnitario: 10, notaId: 'n1' },
      { estoqueInsumoId: 'a', custoUnitario: 11, notaId: 'n1' }, // mesma nota
      { estoqueInsumoId: 'a', custoUnitario: 12, notaId: 'n2' },
      { estoqueInsumoId: 'a', custoUnitario: 13, notaId: 'n3' },
      { estoqueInsumoId: 'a', custoUnitario: 14, notaId: 'n4' },
      { estoqueInsumoId: 'a', custoUnitario: 15, notaId: 'n5' },
      { estoqueInsumoId: 'a', custoUnitario: 16, notaId: 'n6' },
      { estoqueInsumoId: 'b', custoUnitario: 5, notaId: 'n9' },
    ];
    const g = agruparHistoricoCustoPorInsumo(rows);
    assert.deepEqual(g.a, [10, 12, 13, 14, 15]);
    assert.deepEqual(g.b, [5]);
  });
});
