import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calcularVendaLiquida,
  DEFAULT_LIMITE_TAXA_ENTREGA,
  vendaMesEfetiva,
  type SaiposSaleVendaLike,
} from './venda-liquida';

function sale(
  over: Partial<SaiposSaleVendaLike> & { payments?: SaiposSaleVendaLike['payments'] },
): SaiposSaleVendaLike {
  return {
    canceled: 'N',
    total_amount: 100,
    delivery: { delivery_fee: 0 },
    payments: [],
    id_sale: 1,
    sale_number: 10,
    shift_date: '2026-10-15',
    ...over,
  };
}

describe('calcularVendaLiquida', () => {
  it('ignora cancelados', () => {
    const r = calcularVendaLiquida([
      sale({ canceled: 'Y', total_amount: 999, delivery: { delivery_fee: 9.9 } }),
      sale({ total_amount: 50 }),
    ]);
    assert.equal(r.vendaBruta, 50);
    assert.equal(r.vendaLiquida, 50);
  });

  it('exclui só taxa > LIMITE; 6,99 fica na líquida', () => {
    const r = calcularVendaLiquida([
      sale({ total_amount: 100, delivery: { delivery_fee: 6.99 } }),
      sale({ total_amount: 80, delivery: { delivery_fee: 9.9 } }),
      sale({ total_amount: 40, delivery: { delivery_fee: 5 } }),
    ]);
    assert.equal(r.vendaBruta, 220);
    assert.equal(r.taxaEntregaExcluida, 9.9); // só > 6.99
    assert.deepEqual(r.taxasAcimaLimiteDistintas, [9.9]);
    assert.equal(r.vendaLiquida, 220 - 9.9);
  });

  it('consumo interno e créditos pelo payment_amount', () => {
    const r = calcularVendaLiquida([
      sale({
        total_amount: 100,
        payments: [
          { desc_store_payment_type: 'Pago Online', payment_amount: 70 },
          { desc_store_payment_type: 'Crédito Clientes', payment_amount: 30 },
        ],
      }),
      sale({
        total_amount: 55,
        payments: [{ desc_store_payment_type: 'Janta Segurança', payment_amount: 55 }],
      }),
      sale({
        total_amount: 8,
        payments: [{ desc_store_payment_type: 'Sócio Calenzano', payment_amount: 8 }],
      }),
    ]);
    assert.equal(r.vendaBruta, 163);
    assert.equal(r.creditosExcluidos, 30);
    assert.equal(r.consumoInterno, 63); // 55 janta + 8 sócio
    assert.equal(r.vendaLiquida, 163 - 30 - 63);
    assert.equal(r.jantasComValor.length, 1);
    assert.equal(r.jantasComValor[0].valor, 55);
  });

  it('Reentrega entra nos créditos/abatimentos', () => {
    const r = calcularVendaLiquida([
      sale({
        total_amount: 34,
        payments: [
          { desc_store_payment_type: 'Reentrega', payment_amount: 10 },
          { desc_store_payment_type: 'Reentrega', payment_amount: 8 },
          { desc_store_payment_type: 'Reentrega', payment_amount: 8 },
          { desc_store_payment_type: 'Reentrega', payment_amount: 8 },
        ],
      }),
    ]);
    assert.equal(r.creditosExcluidos, 34);
    assert.equal(r.vendaLiquida, 0);
  });

  it('FIADO / MARKETING / PAGAMENTO NAO CADASTRADO não alertam', () => {
    const r = calcularVendaLiquida([
      sale({
        total_amount: 10,
        payments: [{ desc_store_payment_type: 'Fiado', payment_amount: 10 }],
      }),
      sale({
        total_amount: 20,
        payments: [{ desc_store_payment_type: 'Marketing', payment_amount: 20 }],
      }),
      sale({
        total_amount: 5,
        payments: [{ desc_store_payment_type: 'Pagamento não cadastrado', payment_amount: 5 }],
      }),
      sale({
        total_amount: 7,
        payments: [{ desc_store_payment_type: 'Bitcoin Lightning XYZ', payment_amount: 7 }],
      }),
    ]);
    assert.ok(!r.formasDesconhecidas.some((f) => f.includes('FIADO')));
    assert.ok(!r.formasDesconhecidas.some((f) => f.includes('MARKETING')));
    assert.ok(!r.formasDesconhecidas.some((f) => f.includes('PAGAMENTO NAO')));
    assert.ok(r.formasDesconhecidas.some((f) => f.includes('BITCOIN')));
  });

  it('LIMITE configurável — exclui só acima', () => {
    const r = calcularVendaLiquida(
      [
        sale({ total_amount: 50, delivery: { delivery_fee: 7 } }),
        sale({ total_amount: 40, delivery: { delivery_fee: 7.01 } }),
      ],
      {
        limiteTaxaEntrega: 7,
        formasConsumoInterno: [],
        formasCreditos: [],
        formasConhecidasExtras: [],
      },
    );
    assert.equal(r.taxaEntregaExcluida, 7.01);
    assert.equal(DEFAULT_LIMITE_TAXA_ENTREGA, 6.99);
  });

  it('vendaMesEfetiva soma ajuste', () => {
    assert.equal(
      vendaMesEfetiva({
        vendaBruta: 100,
        taxaEntregaExcluida: 0,
        consumoInterno: 0,
        creditosExcluidos: 0,
        vendaLiquida: 100,
        calculadoEm: '',
        limiteTaxa: 6.99,
        taxasAcimaLimiteDistintas: [],
        jantasComValor: [],
        formasDesconhecidas: [],
        ajusteVenda: {
          valor: -10,
          motivo: 'teste',
          criadoPorId: 'u',
          criadoEm: '',
        },
      }),
      90,
    );
  });
});
