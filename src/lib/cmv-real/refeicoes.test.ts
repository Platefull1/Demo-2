import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  classificarRefeicao,
  calcularCustoRefeicoes,
  valorVendaParaMes,
  normalizeText,
} from './refeicoes';

/** Caso real: janta segurança Ahú pedido 217 — 08/10/2026 */
const JANTA_217 = {
  id_sale: 9996471,
  sale_number: 217,
  shift_date: '2026-10-08',
  canceled: 'N',
  id_sale_type: 2,
  total_amount_items: 55.92,
  total_discount: 55.92,
  total_amount: 0,
  customer: { name: 'JANTAR SEGURANÇA' },
  discount_coupon: { coupon: 'JANTA SEGURANÇA', type: '2', discount: 100 },
  delivery: { delivery_fee: 0 },
  payments: [{ desc_store_payment_type: 'Janta Segurança', payment_amount: 0 }],
};

/** Caso real: sócio pedido 13 — 04/10/2026 */
const SOCIO_13 = {
  id_sale: 9996872,
  sale_number: 13,
  shift_date: '2026-10-04',
  canceled: 'N',
  id_sale_type: 1,
  total_amount_items: 173.3,
  total_discount: 173.3,
  total_amount: 8,
  customer: { name: 'Bruna (Valdir)' },
  discount_coupon: null,
  delivery: { delivery_fee: 8 },
  payments: [{ desc_store_payment_type: 'Sócio Calenzano', payment_amount: 8 }],
};

const NORMAL = {
  id_sale: 1,
  sale_number: 1,
  shift_date: '2026-10-04',
  canceled: 'N',
  total_amount_items: 81.9,
  total_discount: 13,
  total_amount: 75.89,
  customer: { name: 'Cliente Normal' },
  discount_coupon: null,
  delivery: { delivery_fee: 6.99 },
  payments: [
    { desc_store_payment_type: 'Pago Online', payment_amount: 68.9 },
    { desc_store_payment_type: 'Voucher (Ifood)', payment_amount: 6.99 },
  ],
  partner_sale: { partner_status: 'CONCLUDED' },
};

describe('normalizeText', () => {
  it('remove acentos e colapsa espaços', () => {
    assert.equal(normalizeText('  Sócio  Calenzano '), 'SOCIO CALENZANO');
    assert.equal(normalizeText('JANTA SEGURANÇA'), 'JANTA SEGURANCA');
  });
});

describe('classificarRefeicao', () => {
  it('janta 217 → SEGURANCA com valor dos itens 55,92', () => {
    const c = classificarRefeicao(JANTA_217);
    assert.ok(c);
    assert.equal(c!.categoria, 'SEGURANCA');
    assert.equal(c!.valorItens, 55.92);
    assert.equal(c!.saiposSaleId, '9996471');
    assert.equal(c!.data, '2026-10-08');
  });

  it('sócio 13 → SOCIO com valor dos itens 173,30 (entrega fora)', () => {
    const c = classificarRefeicao(SOCIO_13);
    assert.ok(c);
    assert.equal(c!.categoria, 'SOCIO');
    assert.equal(c!.valorItens, 173.3);
    assert.equal(c!.saiposSaleId, '9996872');
  });

  it('venda normal → null', () => {
    assert.equal(classificarRefeicao(NORMAL), null);
  });

  it('cancelada → null', () => {
    assert.equal(classificarRefeicao({ ...JANTA_217, canceled: 'Y' }), null);
  });

  it('janta motoboys → BOYS', () => {
    const c = classificarRefeicao({
      id_sale: 2,
      canceled: 'N',
      total_amount_items: 40,
      payments: [{ desc_store_payment_type: 'Janta Motoboys' }],
      customer: { name: 'JANTA MOTOBOYS' },
    });
    assert.equal(c?.categoria, 'BOYS');
  });

  it('janta sem regra → OUTROS', () => {
    const c = classificarRefeicao({
      id_sale: 3,
      canceled: 'N',
      total_amount_items: 10,
      payments: [{ desc_store_payment_type: 'Janta Extra' }],
    });
    assert.equal(c?.categoria, 'OUTROS');
  });
});

describe('valorVendaParaMes', () => {
  it('exclui janta e sócio; inclui normal', () => {
    assert.equal(valorVendaParaMes(JANTA_217), 0);
    assert.equal(valorVendaParaMes(SOCIO_13), 0);
    assert.equal(valorVendaParaMes(NORMAL), 75.89);
  });

  it('pode excluir taxa de entrega', () => {
    // total_amount 75.89 − delivery_fee 6.99 = 68.90
    assert.equal(
      valorVendaParaMes(NORMAL, {
        config: {
          incluirTaxaEntrega: false,
          usarTotalLiquido: true,
          incluirIfood: true,
        },
      }),
      68.9
    );
  });
});

describe('calcularCustoRefeicoes', () => {
  it('abate com %CMV bruto (sem circularidade)', () => {
    const r = calcularCustoRefeicoes({
      consumoMp: 100_000,
      vendaMes: 500_000,
      refeicoes: [
        { categoria: 'SEGURANCA', valorItens: 55.92 },
        { categoria: 'SOCIO', valorItens: 173.3 },
      ],
    });
    assert.equal(r.pctCmvMpBruto, 0.2);
    const custoSeg = Math.round(55.92 * 0.2 * 100) / 100;
    const custoSoc = Math.round(173.3 * 0.2 * 100) / 100;
    assert.equal(
      r.porCategoria.find((x) => x.categoria === 'SEGURANCA')?.custo,
      custoSeg
    );
    assert.equal(r.custoTotal, Math.round((custoSeg + custoSoc) * 100) / 100);
    assert.equal(
      r.consumoMpLiquido,
      Math.round((100_000 - r.custoTotal) * 100) / 100
    );
  });
});
