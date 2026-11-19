import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { SignJWT } from 'jose';
import jwt from 'jsonwebtoken';
import { createRiderToken, verifyRiderJwt } from '../rider-auth';
import { verifyAdminJwt } from './adminAuth';
import {
  ADMIN_JWT_ISSUER,
  EMPLOYEE_JWT_AUDIENCE,
  EMPLOYEE_JWT_ISSUER,
  RIDER_JWT_ISSUER,
} from './jwt-config';
import {
  signEmployeeToken,
  verifyEmployeeTokenEdge,
} from '../employee-auth';

const ADMIN_SECRET = 'admin-secret-32-characters-min!!!!';
const RIDER_SECRET = 'rider-secret-32-characters-min!!!!';
const EMPLOYEE_SECRET = 'employee-secret-32-characters-min!!';

describe('JWT employee vs rider vs calenza-adm', { concurrency: false }, () => {
  before(() => {
    process.env.ADMIN_JWT_SECRET = ADMIN_SECRET;
    process.env.RIDER_JWT_SECRET = RIDER_SECRET;
    process.env.EMPLOYEE_JWT_SECRET = EMPLOYEE_SECRET;
  });

  it('token employee NÃO passa no verify do rider nem do admin', async () => {
    const token = await signEmployeeToken({
      funcionarioId: 'func-1',
      userId: 'tenant-1',
      lojaId: 'loja-1',
      name: 'Teste',
      tv: 0,
    });
    const edge = await verifyEmployeeTokenEdge(token);
    assert.equal(edge.funcionarioId, 'func-1');
    assert.throws(() => verifyRiderJwt(token));
    assert.throws(() => verifyAdminJwt(token));
  });

  it('token rider NÃO passa no verifyEmployeeTokenEdge', async () => {
    const riderToken = createRiderToken({
      riderId: 'rider-1',
      userId: 'tenant-1',
      email: 'r@example.com',
      name: 'Rider',
      lojaId: 'loja-1',
    });
    assert.equal(verifyRiderJwt(riderToken).riderId, 'rider-1');
    await assert.rejects(() => verifyEmployeeTokenEdge(riderToken));
  });

  it('issuer ou audience trocado → rejeitado', async () => {
    const key = new TextEncoder().encode(EMPLOYEE_SECRET);
    const wrongIssuer = await new SignJWT({
      funcionarioId: 'f',
      userId: 'u',
      lojaId: null,
      name: 'X',
      tv: 0,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(RIDER_JWT_ISSUER)
      .setAudience(EMPLOYEE_JWT_AUDIENCE)
      .setExpirationTime('1h')
      .sign(key);

    const wrongAud = await new SignJWT({
      funcionarioId: 'f',
      userId: 'u',
      lojaId: null,
      name: 'X',
      tv: 0,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(EMPLOYEE_JWT_ISSUER)
      .setAudience('rider')
      .setExpirationTime('1h')
      .sign(key);

    await assert.rejects(() => verifyEmployeeTokenEdge(wrongIssuer));
    await assert.rejects(() => verifyEmployeeTokenEdge(wrongAud));
  });

  it('token expirado → rejeitado', async () => {
    const key = new TextEncoder().encode(EMPLOYEE_SECRET);
    const expired = await new SignJWT({
      funcionarioId: 'f',
      userId: 'u',
      lojaId: null,
      name: 'X',
      tv: 0,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(EMPLOYEE_JWT_ISSUER)
      .setAudience(EMPLOYEE_JWT_AUDIENCE)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 10)
      .sign(key);

    await assert.rejects(() => verifyEmployeeTokenEdge(expired));
  });

  it('admin token não autentica employee', async () => {
    const adminToken = jwt.sign(
      { adminId: 'a1', userId: 'a1', email: 'a@x.com', role: 'admin', permissions: [] },
      ADMIN_SECRET,
      { algorithm: 'HS256', issuer: ADMIN_JWT_ISSUER, expiresIn: 60 },
    );
    await assert.rejects(() => verifyEmployeeTokenEdge(adminToken));
  });
});
