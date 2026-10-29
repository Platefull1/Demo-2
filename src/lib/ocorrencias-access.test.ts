import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  PROFILES,
  pageAccess,
  apiAccess,
  otherModuleApiAccess,
  CALENZANO_TENANT,
  OTHER_TENANT,
  type OcorrenciasProfileId,
} from './ocorrencias-access';

const OTHER_APIS = [
  '/api/dashboard/metrics',
  '/api/ifood/merchants',
  '/api/cmv-real/notas',
  '/api/estoque/produtos',
  '/api/tarefas',
];

describe('matriz de permissões — páginas', () => {
  it('P1 só acessa /ocorrencias/nova', () => {
    const p = PROFILES.P1;
    assert.equal(pageAccess(p, '/ocorrencias/nova'), 'ok');
    assert.equal(pageAccess(p, '/ocorrencias'), 'redirect-nova');
    assert.equal(pageAccess(p, '/dashboard'), 'redirect-nova');
    assert.equal(pageAccess(p, '/rh'), 'redirect-nova');
  });

  it('P2 lê a lista e não cria', () => {
    const p = PROFILES.P2;
    assert.equal(pageAccess(p, '/ocorrencias'), 'ok');
    assert.equal(pageAccess(p, '/ocorrencias/nova'), 'redirect-ocorrencias');
    assert.equal(pageAccess(p, '/dashboard'), 'ok');
  });

  it('P3 e P4 acessam lista e registro', () => {
    for (const id of ['P3', 'P4'] as OcorrenciasProfileId[]) {
      const p = PROFILES[id];
      assert.equal(pageAccess(p, '/ocorrencias'), 'ok');
      assert.equal(pageAccess(p, '/ocorrencias/nova'), 'ok');
      assert.equal(pageAccess(p, '/dashboard'), 'ok');
    }
  });

  it('P6 redireciona para login', () => {
    const p = PROFILES.P6;
    assert.equal(pageAccess(p, '/ocorrencias'), 'redirect-login');
    assert.equal(pageAccess(p, '/ocorrencias/nova'), 'redirect-login');
    assert.equal(pageAccess(p, '/dashboard'), 'redirect-login');
    assert.equal(pageAccess(p, '/rh'), 'redirect-login');
  });
});

describe('matriz de permissões — APIs ocorrências', () => {
  it('P1: POST e opcoes ok; lista/id/foto 403; RH 403', () => {
    const p = PROFILES.P1;
    assert.equal(apiAccess(p, 'POST', '/api/ocorrencias'), 201);
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias/opcoes'), 200);
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias/isolation'), 200);
    assert.equal(apiAccess(p, 'POST', '/api/ocorrencias/set-mode'), 200);
    assert.equal(apiAccess(p, 'DELETE', '/api/ocorrencias/set-mode'), 200);
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias'), 403);
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias/abc'), 403);
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias/abc/foto'), 403);
    assert.equal(apiAccess(p, 'GET', '/api/rh/funcionarios'), 403);
    assert.equal(apiAccess(p, 'GET', '/api/rh/motoboys'), 403);
  });

  it('P2: lê, não cria', () => {
    const p = PROFILES.P2;
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias'), 200);
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias/abc'), 200);
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias/abc/foto'), 200);
    assert.equal(apiAccess(p, 'POST', '/api/ocorrencias'), 403);
    assert.equal(apiAccess(p, 'GET', '/api/rh/funcionarios'), 403);
  });

  it('P5 nunca vê tenant Calenzano (404 no GET, 400 no POST)', () => {
    const p = PROFILES.P5;
    assert.equal(
      apiAccess(p, 'GET', '/api/ocorrencias/id-calenzano', {
        resourceTenantId: CALENZANO_TENANT,
      }),
      404,
    );
    assert.equal(
      apiAccess(p, 'GET', '/api/ocorrencias/id-calenzano/foto', {
        resourceTenantId: CALENZANO_TENANT,
      }),
      404,
    );
    assert.equal(
      apiAccess(p, 'POST', '/api/ocorrencias', {
        resourceTenantId: CALENZANO_TENANT,
      }),
      400,
    );
    assert.equal(
      apiAccess(p, 'GET', '/api/ocorrencias/id-proprio', {
        resourceTenantId: OTHER_TENANT,
      }),
      200,
    );
  });

  it('P6: 401 em APIs autenticadas; isolation público; set-mode DELETE 401', () => {
    const p = PROFILES.P6;
    assert.equal(apiAccess(p, 'POST', '/api/ocorrencias'), 401);
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias'), 401);
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias/abc'), 401);
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias/abc/foto'), 401);
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias/opcoes'), 401);
    assert.equal(apiAccess(p, 'GET', '/api/ocorrencias/isolation'), 200);
    assert.equal(apiAccess(p, 'POST', '/api/ocorrencias/set-mode'), 401);
    assert.equal(apiAccess(p, 'DELETE', '/api/ocorrencias/set-mode'), 401);
    assert.equal(apiAccess(p, 'GET', '/api/rh/funcionarios'), 401);
  });

  it('P1 bloqueado em amostra de outros módulos', () => {
    for (const path of OTHER_APIS) {
      assert.equal(otherModuleApiAccess(PROFILES.P1, path), 403, path);
    }
  });

  it('P3/P4 não são isolados nos outros módulos (auth própria)', () => {
    for (const path of OTHER_APIS) {
      assert.equal(otherModuleApiAccess(PROFILES.P3, path), 200, path);
      assert.equal(otherModuleApiAccess(PROFILES.P4, path), 200, path);
      assert.equal(otherModuleApiAccess(PROFILES.P6, path), 401, path);
    }
  });
});
