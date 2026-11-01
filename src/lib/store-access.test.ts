import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  canAccessLojaNome,
  filterByLojaAccess,
  getLojasDoUsuario,
  lojasParaSelecao,
  singleStoreSlug,
  storeSlugFromLojaNome,
  type CmvRealTenant,
} from './store-access';

function tenant(partial: Partial<CmvRealTenant>): CmvRealTenant {
  return {
    tenantUserId: 't',
    actorUserId: 'a',
    isAdmin: false,
    userIds: ['t'],
    allowedStoreSlugs: null,
    lojaNaoConfigurada: false,
    perfil: null,
    memberId: null,
    ...partial,
  };
}

describe('storeSlugFromLojaNome — Ahú canônico', () => {
  it('CALENZANO AHÚ → ahu', () => {
    assert.equal(storeSlugFromLojaNome('CALENZANO AHÚ'), 'ahu');
  });
});

describe('getLojasDoUsuario / canAccessLojaNome', () => {
  it('admin vê todas, inclusive sem loja', () => {
    const t = tenant({ isAdmin: true, allowedStoreSlugs: null });
    assert.equal(getLojasDoUsuario(t), null);
    assert.equal(canAccessLojaNome(t, null), true);
    assert.equal(canAccessLojaNome(t, 'CALENZANO PORTÃO'), true);
  });

  it('escritório (lojas=[]) vê todas', () => {
    const t = tenant({
      isAdmin: false,
      allowedStoreSlugs: null,
      perfil: 'escritorio',
    });
    assert.equal(canAccessLojaNome(t, null), true);
  });

  it('gerente Ahú só vê Ahú; não vê sem loja nem Portão', () => {
    const t = tenant({
      allowedStoreSlugs: ['ahu'],
      perfil: 'gerente_loja',
      memberId: 'm',
    });
    assert.deepEqual(getLojasDoUsuario(t), ['ahu']);
    assert.equal(canAccessLojaNome(t, 'CALENZANO AHÚ'), true);
    assert.equal(canAccessLojaNome(t, null), false);
    assert.equal(canAccessLojaNome(t, 'CALENZANO PORTÃO'), false);
    assert.equal(singleStoreSlug(t), 'ahu');
  });

  it('gerente sem loja configurada não acessa nada', () => {
    const t = tenant({
      allowedStoreSlugs: [],
      lojaNaoConfigurada: true,
      perfil: 'gerente_loja',
    });
    assert.deepEqual(getLojasDoUsuario(t), []);
    assert.equal(canAccessLojaNome(t, 'CALENZANO AHÚ'), false);
  });

  it('filterByLojaAccess remove lojas fora do escopo', () => {
    const t = tenant({
      allowedStoreSlugs: ['pilarzinho'],
      perfil: 'gerente_loja',
      memberId: 'm',
    });
    const rows = [
      { id: '1', lojaNome: 'CALENZANO PILARZINHO' },
      { id: '2', lojaNome: 'CALENZANO PORTÃO' },
      { id: '3', lojaNome: null },
    ];
    assert.deepEqual(
      filterByLojaAccess(rows, t).map((r) => r.id),
      ['1'],
    );
  });
});

describe('lojasParaSelecao — contagem sem /api/rh/lojas', () => {
  it('gerente Ahú: uma opção mesmo sem cadastro RH', () => {
    assert.deepEqual(
      lojasParaSelecao({ allowedStoreSlugs: ['ahu'] }),
      [{ slug: 'ahu', nome: 'Ahú' }],
    );
  });

  it('usa o nome do cadastro RH quando o slug bate', () => {
    assert.deepEqual(
      lojasParaSelecao({
        allowedStoreSlugs: ['ahu'],
        rhLojas: [{ nome: 'CALENZANO AHÚ' }, { nome: 'CALENZANO PORTÃO' }],
      }),
      [{ slug: 'ahu', nome: 'CALENZANO AHÚ' }],
    );
  });

  it('gerente sem loja: lista vazia', () => {
    assert.deepEqual(
      lojasParaSelecao({
        allowedStoreSlugs: [],
        lojaNaoConfigurada: true,
      }),
      [],
    );
  });

  it('escritório / admin: as quatro lojas canônicas', () => {
    const lojas = lojasParaSelecao({ allowedStoreSlugs: null });
    assert.deepEqual(
      lojas.map((l) => l.slug),
      ['ahu', 'pilarzinho', 'portao', 'uberaba'],
    );
  });
});
