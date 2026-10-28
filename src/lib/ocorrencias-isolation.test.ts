import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isOcorrenciasAllowedPath, isIsolationApiPath } from './ocorrencias-isolation';

describe('isOcorrenciasAllowedPath', () => {
  it('libera só o fluxo de registro e auth', () => {
    assert.equal(isOcorrenciasAllowedPath('/ocorrencias/nova'), true);
    assert.equal(isOcorrenciasAllowedPath('/api/ocorrencias'), true);
    assert.equal(isOcorrenciasAllowedPath('/api/ocorrencias/opcoes'), true);
    assert.equal(isOcorrenciasAllowedPath('/api/ocorrencias/isolation'), true);
    assert.equal(isOcorrenciasAllowedPath('/auth/login'), true);
    assert.equal(isOcorrenciasAllowedPath('/auth/continuar'), true);
    assert.equal(isOcorrenciasAllowedPath('/handler/sign-in'), true);
    assert.equal(isOcorrenciasAllowedPath('/api/auth/stack-sync'), true);
    assert.equal(isOcorrenciasAllowedPath('/api/auth/refresh'), true);
    assert.equal(isOcorrenciasAllowedPath('/_next/data/build/ocorrencias/nova.json'), true);
    assert.equal(isOcorrenciasAllowedPath('/'), true);
  });

  it('bloqueia páginas e APIs de outros módulos', () => {
    assert.equal(isOcorrenciasAllowedPath('/ocorrencias'), false);
    assert.equal(isOcorrenciasAllowedPath('/dashboard'), false);
    assert.equal(isOcorrenciasAllowedPath('/api/rh/lojas'), false);
    assert.equal(isOcorrenciasAllowedPath('/api/rh/funcionarios'), false);
    assert.equal(isOcorrenciasAllowedPath('/api/rh/motoboys'), false);
    assert.equal(isOcorrenciasAllowedPath('/api/dashboard/metrics'), false);
  });
});

describe('isIsolationApiPath', () => {
  it('reconhece a rota de decisão', () => {
    assert.equal(isIsolationApiPath('/api/ocorrencias/isolation'), true);
    assert.equal(isIsolationApiPath('/api/rh/lojas'), false);
  });
});
