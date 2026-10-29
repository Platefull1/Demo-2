import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { createRiderToken, verifyRiderJwt } from '../rider-auth';
import { verifyAdminJwt } from './adminAuth';
import { ADMIN_JWT_ISSUER, RIDER_JWT_ISSUER } from './jwt-config';

const ADMIN_SECRET = 'admin-secret-32-characters-min!!!!';
const RIDER_SECRET = 'rider-secret-32-characters-min!!!!';

describe('JWT rider vs Calenza-adm', { concurrency: false }, () => {
  before(() => {
    process.env.ADMIN_JWT_SECRET = ADMIN_SECRET;
    process.env.RIDER_JWT_SECRET = RIDER_SECRET;
  });

  it('token de rider não passa no verify do admin', () => {
    const riderToken = createRiderToken({
      riderId: 'rider-abc',
      userId: 'rh-user-xyz',
      email: 'motoboy@example.com',
      name: 'Motoboy Teste',
      lojaId: 'loja-1',
    });
    assert.equal(verifyRiderJwt(riderToken).riderId, 'rider-abc');
    assert.throws(() => verifyAdminJwt(riderToken));
  });

  it('token admin não passa no verify do rider', () => {
    const adminToken = jwt.sign(
      {
        adminId: 'adm-1',
        userId: 'adm-1',
        email: 'admin@example.com',
        role: 'admin',
        permissions: [],
      },
      ADMIN_SECRET,
      { algorithm: 'HS256', issuer: ADMIN_JWT_ISSUER, expiresIn: 60 },
    );
    assert.throws(() => verifyRiderJwt(adminToken));
    const decoded = jwt.verify(adminToken, ADMIN_SECRET, {
      algorithms: ['HS256'],
      issuer: ADMIN_JWT_ISSUER,
    }) as { adminId: string };
    assert.equal(decoded.adminId, 'adm-1');
  });

  it('mesmo secret não basta: issuer diferente é rejeitado', () => {
    const forgedRiderAsAdmin = jwt.sign(
      { adminId: 'adm-1', riderId: 'rider-abc', userId: 'x' },
      ADMIN_SECRET,
      { algorithm: 'HS256', issuer: RIDER_JWT_ISSUER, expiresIn: 60 },
    );
    assert.throws(() => verifyAdminJwt(forgedRiderAsAdmin));
  });
});
