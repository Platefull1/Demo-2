import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolverCategorias } from './ocorrencias-categorias';

describe('resolverCategorias', () => {
  it('vazio vira OUTROS e exige descrição', () => {
    const fail = resolverCategorias([], 'curta');
    assert.equal(fail.ok, false);
    const ok = resolverCategorias([], 'Pedido chegou frio e atrasou');
    assert.deepEqual(ok, { ok: true, categorias: ['OUTROS'] });
  });

  it('chips sem OUTROS e descrição opcional', () => {
    const ok = resolverCategorias(['PEDIDO_ATRASADO', 'FALTOU_BEBIDA'], '');
    assert.deepEqual(ok, {
      ok: true,
      categorias: ['PEDIDO_ATRASADO', 'FALTOU_BEBIDA'],
    });
  });

  it('rejeita OUTROS misturado com chips', () => {
    const fail = resolverCategorias(['PEDIDO_ERRADO', 'OUTROS'], 'ok');
    assert.equal(fail.ok, false);
  });

  it('rejeita categoria desconhecida', () => {
    const fail = resolverCategorias(['XYZ'], 'descrição longa suficiente');
    assert.equal(fail.ok, false);
  });
});
