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
    const ok = resolverCategorias(['PEDIDO_ERRADO', 'FALTOU_BEBIDA'], '');
    assert.deepEqual(ok, {
      ok: true,
      categorias: ['PEDIDO_ERRADO', 'FALTOU_BEBIDA'],
    });
  });

  it('rejeita PEDIDO_ATRASADO no registro', () => {
    const fail = resolverCategorias(['PEDIDO_ATRASADO'], 'descrição longa suficiente');
    assert.equal(fail.ok, false);
  });

  it('rejeita OUTROS misturado com chips', () => {
    const fail = resolverCategorias(['PEDIDO_ERRADO', 'OUTROS'], 'ok');
    assert.equal(fail.ok, false);
  });

  it('rejeita categoria desconhecida', () => {
    const fail = resolverCategorias(['XYZ'], 'descrição longa suficiente');
    assert.equal(fail.ok, false);
  });

  it('remove duplicatas dos chips', () => {
    const ok = resolverCategorias(['PEDIDO_ERRADO', 'PEDIDO_ERRADO'], '');
    assert.deepEqual(ok, { ok: true, categorias: ['PEDIDO_ERRADO'] });
  });

  it('espaços na descrição não bastam para OUTROS', () => {
    const fail = resolverCategorias([], '          ');
    assert.equal(fail.ok, false);
  });
});
