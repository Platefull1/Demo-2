import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolverUmCusto } from './importar-saldo-custo-resolve';
import {
  ignorarNoCustoDoSaldo,
  naturezaDoItem,
  naturezaPorCfop,
  quantidadeEValorDeCompra,
  valoresLancamentoCompra,
} from './bonificacao';

describe('bonificação e troca no custo do saldo', () => {
  it('CFOP 5.910 e 6.910 são bonificação', () => {
    assert.equal(naturezaPorCfop('5.910'), 'BONIFICACAO');
    assert.equal(naturezaPorCfop('6910'), 'BONIFICACAO');
    assert.equal(naturezaPorCfop('5102'), null);
  });

  it('marca manual vira bonificação ou troca mesmo sem o CFOP', () => {
    assert.equal(
      naturezaDoItem({ cfop: '5102', alertas: ['BONIFICACAO_MANUAL'] }),
      'BONIFICACAO',
    );
    assert.equal(naturezaDoItem({ cfop: '5102', alertas: ['TROCA_MANUAL'] }), 'TROCA');
    assert.equal(ignorarNoCustoDoSaldo({ cfop: '5910' }), true);
    assert.equal(ignorarNoCustoDoSaldo({ cfop: '5102' }), false);
  });

  it('CFOP de entrada é devolução e vira compra negativa', () => {
    for (const cfop of ['1.410', '1410', '1.949', '1202', '2.202', '1102']) {
      assert.equal(naturezaPorCfop(cfop), 'DEVOLUCAO');
      assert.equal(ignorarNoCustoDoSaldo({ cfop }), true);
    }
    assert.equal(naturezaPorCfop('5102'), null);
    assert.equal(naturezaPorCfop('5.152'), null);
    const linha = quantidadeEValorDeCompra({
      quantidade: 6,
      valor: 168.69,
      cfop: '2202',
    });
    assert.deepEqual(linha, { quantidade: -6, valor: -168.69 });
    const jaNegativa = quantidadeEValorDeCompra({
      quantidade: -6,
      valor: -168.69,
      cfop: '1.410',
    });
    assert.deepEqual(jaNegativa, { quantidade: -6, valor: -168.69 });
    const normal = quantidadeEValorDeCompra({
      quantidade: 6,
      valor: 50,
      cfop: '5102',
    });
    assert.deepEqual(normal, { quantidade: 6, valor: 50 });
    const lanc = valoresLancamentoCompra({
      quantidade: 6,
      valor: 51.35,
      cfop: '1410',
    });
    assert.equal(lanc.observacao, 'Devolução/Troca');
    assert.equal(lanc.quantidade, -6);
    assert.equal(lanc.valor, -51.35);
    assert.equal(
      naturezaDoItem({ cfop: '2202', alertas: ['BONIFICACAO_MANUAL'] }),
      'DEVOLUCAO',
    );
  });

  it('última nota bonificada não entra; usa a compra normal anterior', () => {
    const compras = [
      { nf: 'bonif', ignorar: true, custo: 1.02 },
      { nf: 'normal', ignorar: false, custo: 3.39 },
    ];
    const escolhida = compras.find((c) => !c.ignorar);
    assert.equal(escolhida?.nf, 'normal');
    assert.equal(escolhida?.custo, 3.39);
  });

  it('sem compra normal, o saldo cai para o grupo e depois o teórico', () => {
    const semLoja = resolverUmCusto({
      nomeProduto: 'COCA LATA',
      estoqueInsumoId: 'coca',
      competencia: '2026-10',
      comprasGrupo: new Map([
        [
          'coca',
          {
            custo: 3.1,
            storeSlug: 'portao',
            numero: '1',
            dataEntrada: new Date('2026-10-02T00:00:00Z'),
          },
        ],
      ]),
      cmvTeorico: new Map([['coca', { custo: 2, nomeIng: 'COCA' }]]),
    });
    assert.equal(semLoja.custoOrigem, 'ULTIMA_COMPRA_GRUPO');
    assert.equal(semLoja.custoMedio, 3.1);

    const soTeorico = resolverUmCusto({
      nomeProduto: 'COCA LATA',
      estoqueInsumoId: 'coca',
      competencia: '2026-10',
      cmvTeorico: new Map([['coca', { custo: 2, nomeIng: 'COCA' }]]),
    });
    assert.equal(soTeorico.custoOrigem, 'CMV_TEORICO');
    assert.equal(soTeorico.custoMedio, 2);
  });
});
