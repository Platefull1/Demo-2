import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGroupedList,
  organizeReviewComplaints,
  type ComplaintReviewItem,
} from './complaints-review';

function item(partial: Partial<ComplaintReviewItem>): ComplaintReviewItem {
  return {
    id: partial.id ?? '1',
    contactId: 'c1',
    contactName: 'Ana',
    contactPhone: '41',
    clientLabel: 'Ana',
    numeroPedido: null,
    resumo: 'atrasou',
    dataOcorrencia: '2026-10-01',
    confirmadoPorHumano: false,
    evidencias: [],
    origem: 'CLIENTE',
    lojaIdentificada: true,
    ...partial,
  };
}

describe('filtro de loja na revisão', () => {
  it('Pilarzinho não lista o grupo Ahú', () => {
    const lojas = [
      { id: 'loja-ahu', nome: 'CALENZANO AHÚ' },
      { id: 'loja-pilar', nome: 'CALENZANO PILARZINHO' },
    ];
    const organized = organizeReviewComplaints(
      [
        item({ id: 'a', lojaId: 'loja-ahu', categoria: 'PEDIDO_ATRASADO' }),
        item({ id: 'p', lojaId: 'loja-pilar', categoria: 'OUTROS' }),
      ],
      lojas,
    );

    assert.deepEqual(
      organized.conversasPorLoja.map((g) => g.lojaKey).sort(),
      ['Ahú', 'Pilarzinho'],
    );

    const filtrado = buildGroupedList(
      organized,
      'todas',
      'Pilarzinho',
      null,
      'todas',
      '',
    );
    assert.equal(filtrado.length, 1);
    assert.equal(filtrado[0].lojaKey, 'Pilarzinho');
    assert.equal(filtrado[0].items[0].id, 'p');
  });

  it('etiqueta QUALIDADE não lista Pedido atrasado', () => {
    const lojas = [{ id: 'loja-ahu', nome: 'Ahú' }];
    const organized = organizeReviewComplaints(
      [
        item({ id: 'a', lojaId: 'loja-ahu', categoria: 'PEDIDO_ATRASADO' }),
        item({ id: 'q', lojaId: 'loja-ahu', categoria: 'QUALIDADE' }),
      ],
      lojas,
    );
    const filtrado = buildGroupedList(
      organized,
      'todas',
      null,
      'QUALIDADE',
      'todas',
      '',
    );
    assert.equal(filtrado[0].items.length, 1);
    assert.equal(filtrado[0].items[0].id, 'q');
  });
});
