import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  agruparHistoricoCustoPorInsumo,
  avaliarAlertaPrecoRevisao,
  descricoesCompativeisParaPreco,
  deveAlertarPreco,
  mediana,
} from './alerta-preco-revisao';

describe('alerta-preco-revisao', () => {
  it('mediana ímpar e par', () => {
    assert.equal(mediana([10, 20, 30]), 20);
    assert.equal(mediana([10, 20, 30, 40]), 25);
    assert.equal(mediana([]), null);
  });

  it('alerta quando atual ≥ R$ 3 acima da mediana (com ≥2 amostras)', () => {
    const r = deveAlertarPreco({
      custoAtual: 24,
      historico: [20, 20.5, 19.8, 21, 20.2],
    });
    assert.equal(r.ativo, true);
    assert.ok((r.referencia ?? 0) >= 19 && (r.referencia ?? 0) <= 21);
    assert.ok(r.delta >= 3);
  });

  it('não alerta com 1 amostra só', () => {
    const r = deveAlertarPreco({
      custoAtual: 90,
      historico: [23.87],
    });
    assert.equal(r.ativo, false);
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

  it('Negresco atual compatível com histórico Negresco; KitKat ≠ morango', () => {
    assert.equal(
      descricoesCompativeisParaPreco(
        'BISC.TRITURADO NEGRESCO 1KG 1KG',
        'NP BISC TOPPING NEGRESCO MOIDO 1 KG',
      ),
      true,
    );
    assert.equal(
      descricoesCompativeisParaPreco(
        'RECHEIO E COB. KITKAT 1,01KG 1,01KG',
        'RECHEIO DOCEIRO MORANGO 8X1,005KG - 1 CX COM 5',
      ),
      false,
    );
  });

  it('filtra histórico incompatível e não alerta KitKat×morango', () => {
    const a = avaliarAlertaPrecoRevisao({
      custoAtual: 91.44,
      descricaoAtual: 'RECHEIO E COB. KITKAT 1,01KG 1,01KG',
      historico: [
        {
          custo: 23.87,
          descricao: 'RECHEIO DOCEIRO MORANGO 8X1,005KG - 1 CX COM 5',
          notaId: 'n1',
        },
      ],
      sufixo: 'kg',
    });
    assert.equal(a, null);
  });

  it('Negresco com histórico compatível alerta e mensagem mostra os dois preços', () => {
    const a = avaliarAlertaPrecoRevisao({
      custoAtual: 50.11,
      descricaoAtual: 'BISC.TRITURADO NEGRESCO 1KG 1KG',
      historico: [
        { custo: 40.95, descricao: 'NP BISC TOPPING NEGRESCO MOIDO 1 KG', notaId: 'n1' },
        { custo: 41.36, descricao: 'NP BISC TOPPING NEGRESCO MOIDO 1 KG', notaId: 'n2' },
        { custo: 40.95, descricao: 'NP BISC TOPPING NEGRESCO MOIDO 1 KG', notaId: 'n3' },
        { custo: 40.95, descricao: 'NP BISC TOPPING NEGRESCO MOIDO 1 KG', notaId: 'n4' },
      ],
      sufixo: 'kg',
    });
    assert.ok(a);
    assert.match(a!.mensagem, /^Confira o preço:/);
    assert.match(a!.mensagem, /50,11/);
    assert.match(a!.mensagem, /40,95/);
    assert.match(a!.mensagem, /↑/);
  });

  it('agrupa últimas notas distintas por insumo com descrição', () => {
    const rows = [
      { estoqueInsumoId: 'a', custoUnitario: 10, notaId: 'n1', descricao: 'FOO' },
      { estoqueInsumoId: 'a', custoUnitario: 11, notaId: 'n1', descricao: 'FOO' },
      { estoqueInsumoId: 'a', custoUnitario: 12, notaId: 'n2', descricao: 'FOO' },
      { estoqueInsumoId: 'b', custoUnitario: 5, notaId: 'n9', descricao: 'BAR' },
    ];
    const g = agruparHistoricoCustoPorInsumo(rows);
    assert.equal(g.a?.length, 2);
    assert.equal(g.a?.[0]?.custo, 10);
    assert.equal(g.b?.[0]?.custo, 5);
  });
});
