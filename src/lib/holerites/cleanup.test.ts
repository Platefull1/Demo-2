import { config } from 'dotenv';
config({ path: '.env', override: true });
config({ path: '.env.local', override: true });

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '@/lib/prisma';
import { runHoleritesCleanup } from '@/lib/holerites/cleanup';

describe('runHoleritesCleanup (dev)', () => {
  it('apaga OTP expirado / consumido>24h e rate buckets vencidos', async () => {
    const host = (() => {
      try {
        return new URL(process.env.DATABASE_URL || '').hostname;
      } catch {
        return '';
      }
    })();
    assert.ok(host && !host.includes('odd-sunset'), `host inválido: ${host}`);

    const func = await prisma.rhFuncionario.findFirst({
      where: { nome: 'TESTE HOLERITE' },
      select: { id: true },
    });
    assert.ok(func, 'TESTE HOLERITE ausente');

    const expiredCode = await prisma.employeeLoginCode.create({
      data: {
        funcionarioId: func.id,
        codeHash: 'a'.repeat(64),
        expiresAt: new Date(Date.now() - 60_000),
        requestIp: '127.0.0.1',
      },
    });

    const oldConsumed = await prisma.employeeLoginCode.create({
      data: {
        funcionarioId: func.id,
        codeHash: 'b'.repeat(64),
        expiresAt: new Date(Date.now() + 60_000),
        consumedAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
        requestIp: '127.0.0.1',
      },
    });

    const bucketKey = `test-cleanup-${Date.now()}`;
    await prisma.rateLimitBucket.create({
      data: {
        key: bucketKey,
        count: 1,
        windowStart: new Date(Date.now() - 60_000),
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    const result = await runHoleritesCleanup();

    assert.ok(result.loginCodesDeleted >= 2);
    assert.ok(result.rateBucketsDeleted >= 1);

    const stillExpired = await prisma.employeeLoginCode.findUnique({
      where: { id: expiredCode.id },
    });
    const stillConsumed = await prisma.employeeLoginCode.findUnique({
      where: { id: oldConsumed.id },
    });
    const stillBucket = await prisma.rateLimitBucket.findUnique({
      where: { key: bucketKey },
    });
    assert.equal(stillExpired, null);
    assert.equal(stillConsumed, null);
    assert.equal(stillBucket, null);
  });
});
