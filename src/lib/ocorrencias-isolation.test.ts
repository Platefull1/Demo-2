import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { SignJWT } from 'jose';
import {
  isOcorrenciasAllowedPath,
  isIsolationApiPath,
  isIsolationSecretConfigured,
  signIsolationCookie,
  readIsolationCookie,
  ISOLATION_JWT_ISSUER,
} from './ocorrencias-isolation';
import { isSameOriginMutation } from './ocorrencias-csrf';
import { NextRequest } from 'next/server';

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
    assert.equal(isOcorrenciasAllowedPath('/api/ifood/merchants'), false);
    assert.equal(isOcorrenciasAllowedPath('/api/ocorrencias-hack'), false);
  });
});

describe('isIsolationApiPath', () => {
  it('reconhece a rota de decisão', () => {
    assert.equal(isIsolationApiPath('/api/ocorrencias/isolation'), true);
    assert.equal(isIsolationApiPath('/api/rh/lojas'), false);
  });
});

const ISOLATION_TEST_SECRET = 'test-isolation-secret-32chars-min!!';

describe('JWT de isolamento', { concurrency: false }, () => {
  before(() => {
    process.env.OCORRENCIAS_ISOLATION_SECRET = ISOLATION_TEST_SECRET;
  });

  it('HS256 + fingerprint: cookie do usuário A não vale para B', async () => {
    const token = await signIsolationCookie(true, 'fp-user-a');
    assert.ok(token);
    assert.equal(await readIsolationCookie(token!, 'fp-user-a'), true);
    assert.equal(await readIsolationCookie(token!, 'fp-user-b'), null);
  });

  it('rejeita alg none e issuer errado', async () => {
    const none = [
      Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url'),
      Buffer.from(JSON.stringify({ only: false, fp: 'fp-user-a', iss: ISOLATION_JWT_ISSUER })).toString('base64url'),
      '',
    ].join('.');
    assert.equal(await readIsolationCookie(none, 'fp-user-a'), null);

    const secret = new TextEncoder().encode(ISOLATION_TEST_SECRET);
    const otherIss = await new SignJWT({ only: true, fp: 'fp-user-a' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('rider')
      .setExpirationTime('5m')
      .sign(secret);
    assert.equal(await readIsolationCookie(otherIss, 'fp-user-a'), null);
  });

  it('não aceita token assinado com ADMIN_JWT_SECRET', async () => {
    const adminSecret = new TextEncoder().encode('admin-jwt-secret-32chars-min!!!!');
    const forged = await new SignJWT({ only: false, fp: 'fp-user-a' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(ISOLATION_JWT_ISSUER)
      .setExpirationTime('5m')
      .sign(adminSecret);
    assert.equal(await readIsolationCookie(forged, 'fp-user-a'), null);
  });

  it('expira: token vencido não vale', async () => {
    const secret = new TextEncoder().encode(ISOLATION_TEST_SECRET);
    const expired = await new SignJWT({ only: true, fp: 'fp-user-a' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(ISOLATION_JWT_ISSUER)
      .setExpirationTime('0s')
      .sign(secret);
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(await readIsolationCookie(expired, 'fp-user-a'), null);
  });

  it('sem OCORRENCIAS_ISOLATION_SECRET: não assina nem lê', async () => {
    const saved = process.env.OCORRENCIAS_ISOLATION_SECRET;
    delete process.env.OCORRENCIAS_ISOLATION_SECRET;
    try {
      assert.equal(isIsolationSecretConfigured(), false);
      assert.equal(await signIsolationCookie(false, 'fp-user-a'), null);
      assert.equal(await readIsolationCookie('x.y.z', 'fp-user-a'), null);
    } finally {
      process.env.OCORRENCIAS_ISOLATION_SECRET = saved;
    }
  });
});

describe('CSRF set-mode', () => {
  it('aceita Origin do mesmo host e rejeita outro', () => {
    const ok = new NextRequest('http://localhost:3000/api/ocorrencias/set-mode', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    });
    assert.equal(isSameOriginMutation(ok), true);

    const evil = new NextRequest('http://localhost:3000/api/ocorrencias/set-mode', {
      method: 'POST',
      headers: { origin: 'https://evil.example' },
    });
    assert.equal(isSameOriginMutation(evil), false);

    const missing = new NextRequest('http://localhost:3000/api/ocorrencias/set-mode', {
      method: 'POST',
    });
    assert.equal(isSameOriginMutation(missing), false);
  });
});
