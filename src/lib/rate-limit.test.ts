import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from './rate-limit';

const PREFIX = `test:rl:${Date.now()}:`;

describe('checkRateLimit (Neon)', { concurrency: false }, () => {
  after(async () => {
    await prisma.rateLimitBucket.deleteMany({
      where: { key: { startsWith: PREFIX } },
    });
    await prisma.$disconnect();
  });

  it('permite até o limite e bloqueia depois', async () => {
    const key = `${PREFIX}basic`;
    const r1 = await checkRateLimit({ key, limit: 2, windowSeconds: 60 });
    assert.equal(r1.allowed, true);
    assert.equal(r1.remaining, 1);

    const r2 = await checkRateLimit({ key, limit: 2, windowSeconds: 60 });
    assert.equal(r2.allowed, true);
    assert.equal(r2.remaining, 0);

    const r3 = await checkRateLimit({ key, limit: 2, windowSeconds: 60 });
    assert.equal(r3.allowed, false);
    assert.equal(r3.remaining, 0);
    assert.ok(r3.retryAfterSeconds >= 1);
  });

  it('janela expirada reinicia a contagem', async () => {
    const key = `${PREFIX}expire`;
    await prisma.rateLimitBucket.create({
      data: {
        key,
        count: 99,
        windowStart: new Date(Date.now() - 120_000),
        expiresAt: new Date(Date.now() - 1_000),
      },
    });

    const r = await checkRateLimit({ key, limit: 3, windowSeconds: 60 });
    assert.equal(r.allowed, true);
    assert.equal(r.remaining, 2);
  });
});
