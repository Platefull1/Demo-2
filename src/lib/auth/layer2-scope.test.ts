/**
 * Prova de que a Camada 2 (tenant + loja) não mudou com a Camada 1.
 *
 * - calenzano.ahu (membro) lê notas CMV Real e contagens Estoque do tenant
 *   platefull.app, só da loja Ahú.
 * - escritorio lê todas as lojas do mesmo tenant.
 * - Outra conta (outro tenant / solta) não compartilha tenantUserId, mesmo
 *   com a ferramenta ligada no painel.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  canAccessLojaNome,
  filterByLojaAccess,
  getLojasDoUsuario,
  type CmvRealTenant,
} from '../store-access';
import { canAccessToolFromState } from './can-access-tool';
import { SystemTool } from '../../types/admin';

const PLATEFULL_TENANT = 'user-platefull-app';

function tenant(partial: Partial<CmvRealTenant>): CmvRealTenant {
  return {
    tenantUserId: PLATEFULL_TENANT,
    actorUserId: 'a',
    isAdmin: false,
    userIds: [PLATEFULL_TENANT],
    allowedStoreSlugs: null,
    lojaNaoConfigurada: false,
    perfil: null,
    memberId: null,
    ...partial,
  };
}

const ahu = tenant({
  actorUserId: 'user-calenzano-ahu',
  allowedStoreSlugs: ['ahu'],
  perfil: 'gerente_loja',
  memberId: 'm-ahu',
});

const escritorio = tenant({
  actorUserId: 'user-escritorio',
  allowedStoreSlugs: null,
  perfil: 'escritorio',
});

const outroTenant = tenant({
  tenantUserId: 'user-outro-tenant',
  actorUserId: 'user-outro-tenant',
  isAdmin: true,
  userIds: ['user-outro-tenant'],
  allowedStoreSlugs: null,
  perfil: null,
  memberId: null,
});

const notas = [
  { id: 'n-ahu', storeSlug: 'ahu', userId: PLATEFULL_TENANT },
  { id: 'n-portao', storeSlug: 'portao', userId: PLATEFULL_TENANT },
  { id: 'n-pilar', storeSlug: 'pilarzinho', userId: PLATEFULL_TENANT },
];

const contagens = [
  { id: 'c-ahu', lojaNome: 'CALENZANO AHÚ', userId: PLATEFULL_TENANT },
  { id: 'c-portao', lojaNome: 'CALENZANO PORTÃO', userId: PLATEFULL_TENANT },
  { id: 'c-pilar', lojaNome: 'CALENZANO PILARZINHO', userId: PLATEFULL_TENANT },
];

/** Mesma regra de resolveCmvRealStoreFilter sem override de slug. */
function notasNoEscopo(t: CmvRealTenant) {
  const filter = getLojasDoUsuario(t);
  return notas.filter((n) => {
    if (n.userId !== t.tenantUserId) return false;
    if (filter === null) return true;
    return filter.includes(n.storeSlug);
  });
}

describe('Camada 2 intacta — CMV Real (notas) e Estoque (contagens)', () => {
  it('calenzano.ahu lê só Ahú, no tenant da platefull.app', () => {
    assert.equal(ahu.tenantUserId, PLATEFULL_TENANT);
    assert.deepEqual(getLojasDoUsuario(ahu), ['ahu']);


    assert.equal(canAccessLojaNome(ahu, 'CALENZANO AHÚ'), true);
    assert.equal(canAccessLojaNome(ahu, 'CALENZANO PORTÃO'), false);
    assert.equal(canAccessLojaNome(ahu, 'CALENZANO PILARZINHO'), false);

    assert.deepEqual(
      notasNoEscopo(ahu).map((n) => n.id),
      ['n-ahu'],
    );
    assert.deepEqual(
      filterByLojaAccess(contagens, ahu).map((c) => c.id),
      ['c-ahu'],
    );
  });

  it('escritorio lê todas as lojas do tenant platefull.app', () => {
    assert.equal(escritorio.tenantUserId, PLATEFULL_TENANT);
    assert.equal(getLojasDoUsuario(escritorio), null);

    assert.equal(canAccessLojaNome(escritorio, 'CALENZANO AHÚ'), true);
    assert.equal(canAccessLojaNome(escritorio, 'CALENZANO PORTÃO'), true);
    assert.equal(canAccessLojaNome(escritorio, 'CALENZANO PILARZINHO'), true);

    assert.deepEqual(
      notasNoEscopo(escritorio).map((n) => n.id),
      ['n-ahu', 'n-portao', 'n-pilar'],
    );
    assert.deepEqual(
      filterByLojaAccess(contagens, escritorio).map((c) => c.id),
      ['c-ahu', 'c-portao', 'c-pilar'],
    );
  });

  it('outra conta, mesmo com a ferramenta ligada, não lê o tenant platefull.app', () => {
    const toolOn = canAccessToolFromState({
      stackUserExists: true,
      isActive: true,
      enabledTools: [SystemTool.CMV_REAL, SystemTool.ESTOQUE],
      tool: SystemTool.CMV_REAL,
    });
    assert.equal(toolOn, true);

    assert.notEqual(outroTenant.tenantUserId, PLATEFULL_TENANT);
    assert.equal(notasNoEscopo(outroTenant).length, 0);
    assert.equal(
      filterByLojaAccess(
        contagens.filter((c) => c.userId === outroTenant.tenantUserId),
        outroTenant,
      ).length,
      0,
    );
  });
});
