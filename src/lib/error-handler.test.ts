import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { shouldShowPermissionToast } from './error-handler';

describe('shouldShowPermissionToast', () => {
  it('GET 403 de fundo não toasta', () => {
    assert.equal(shouldShowPermissionToast('GET', 403, '/api/user-apis'), false);
  });

  it('POST/PUT/DELETE 403 toasta', () => {
    assert.equal(shouldShowPermissionToast('POST', 403, '/api/user-apis'), true);
    assert.equal(shouldShowPermissionToast('PUT', 403, '/api/user-apis?id=1'), true);
    assert.equal(shouldShowPermissionToast('DELETE', 403, '/api/user-apis?id=1'), true);
  });

  it('403 em rotas que já tratam o erro (RH) não toasta no interceptor', () => {
    assert.equal(shouldShowPermissionToast('POST', 403, '/api/rh/funcionarios'), false);
  });

  it('outros status não toasta permissão', () => {
    assert.equal(shouldShowPermissionToast('POST', 500, '/api/user-apis'), false);
    assert.equal(shouldShowPermissionToast('POST', 401, '/api/user-apis'), false);
  });
});
