import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ocorrenciaBodySchema,
  parsePage,
  parsePageSize,
  clampBusca,
  ocorrenciaByIdWhere,
} from './ocorrencias-validation';

function base(over: Record<string, unknown> = {}) {
  return {
    lojaId: 'loja-1',
    numeroPedidoSaipos: '12345',
    descricao: 'Pedido chegou frio e atrasou',
    categorias: [],
    ...over,
  };
}

describe('ocorrenciaBodySchema', () => {
  it('aceita Saipos só dígitos e categorias vazias com descrição', () => {
    const r = ocorrenciaBodySchema.safeParse(base());
    assert.equal(r.success, true);
  });

  it('rejeita Saipos com letras ou tamanho demais', () => {
    assert.equal(ocorrenciaBodySchema.safeParse(base({ numeroPedidoSaipos: '12a' })).success, false);
    assert.equal(
      ocorrenciaBodySchema.safeParse(base({ numeroPedidoSaipos: '1'.repeat(21) })).success,
      false,
    );
  });

  it('exige canal quando há pedido externo; descarta canal se externo vazio', () => {
    const semCanal = ocorrenciaBodySchema.safeParse(
      base({ numeroPedidoExterno: 'AB12', canalExterno: undefined }),
    );
    assert.equal(semCanal.success, false);

    const ok = ocorrenciaBodySchema.safeParse(
      base({ numeroPedidoExterno: 'AB12', canalExterno: 'IFOOD' }),
    );
    assert.equal(ok.success, true);

    const vazio = ocorrenciaBodySchema.safeParse(
      base({ numeroPedidoExterno: '', canalExterno: 'IFOOD' }),
    );
    assert.equal(vazio.success, true);
    if (vazio.success) {
      assert.equal(vazio.data.numeroPedidoExterno, undefined);
    }
  });

  it('rejeita externo com símbolos', () => {
    const r = ocorrenciaBodySchema.safeParse(
      base({ numeroPedidoExterno: '12-34', canalExterno: 'IFOOD' }),
    );
    assert.equal(r.success, false);
  });

  it('chips tornam descrição opcional; OUTROS misturado falha', () => {
    const ok = ocorrenciaBodySchema.safeParse(
      base({ categorias: ['PEDIDO_ERRADO'], descricao: '' }),
    );
    assert.equal(ok.success, true);

    const fail = ocorrenciaBodySchema.safeParse(
      base({ categorias: ['PEDIDO_ERRADO', 'OUTROS'], descricao: 'ok demais' }),
    );
    assert.equal(fail.success, false);
  });

  it('descrição só espaços conta como vazia', () => {
    const r = ocorrenciaBodySchema.safeParse(base({ descricao: '          ' }));
    assert.equal(r.success, false);
  });

  it('rejeita PEDIDO_ATRASADO no POST', () => {
    const r = ocorrenciaBodySchema.safeParse(
      base({ categorias: ['PEDIDO_ATRASADO'], descricao: 'atrasou bastante' }),
    );
    assert.equal(r.success, false);
  });

  it('rejeita descrição acima de 2000', () => {
    const r = ocorrenciaBodySchema.safeParse(base({ descricao: 'a'.repeat(2001) }));
    assert.equal(r.success, false);
  });

  it('ignora mass assignment: campos extras não entram no parse', () => {
    const r = ocorrenciaBodySchema.safeParse({
      ...base(),
      userId: 'hack',
      companyId: 'hack',
      criadoPorUserId: 'hack',
      fotoPath: '../etc/passwd',
      id: 'forced-id',
      createdAt: '2000-01-01',
    });
    assert.equal(r.success, true);
    if (r.success) {
      assert.equal('userId' in r.data, false);
      assert.equal('fotoPath' in r.data, false);
      assert.equal('id' in r.data, false);
    }
  });
});

describe('paginação e busca', () => {
  it('page inválida vira 1; absurda é limitada', () => {
    assert.equal(parsePage(null), 1);
    assert.equal(parsePage('0'), 1);
    assert.equal(parsePage('-3'), 1);
    assert.equal(parsePage('abc'), 1);
    assert.equal(parsePage('9999999'), 1_000_000);
  });

  it('pageSize tem teto 100', () => {
    assert.equal(parsePageSize(null), 25);
    assert.equal(parsePageSize('500'), 100);
    assert.equal(parsePageSize('0'), 25);
  });

  it('busca é cortada em 50 chars', () => {
    assert.equal(clampBusca('  '), undefined);
    assert.equal(clampBusca('a'.repeat(80))?.length, 50);
  });
});

describe('IDOR where', () => {
  it('sempre inclui userId do tenant', () => {
    assert.deepEqual(ocorrenciaByIdWhere('tenant-a', 'oc-1'), {
      id: 'oc-1',
      userId: 'tenant-a',
    });
  });
});
