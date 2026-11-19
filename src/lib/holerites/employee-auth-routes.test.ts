import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { config } from 'dotenv';
config({ path: '.env', override: true });
config({ path: '.env.local', override: true });

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getEmployeeSession,
  signEmployeeToken,
  EMPLOYEE_COOKIE,
} from '@/lib/employee-auth';
import { hashOtpCode, generateOtpCode } from '@/lib/holerites/otp';
import { TEST_EMPLOYEE_CPF } from '@/lib/holerites/test-employee';
import { POST as requestCode } from '../../../app/api/colaborador/auth/request-code/route';
import { POST as verifyCode } from '../../../app/api/colaborador/auth/verify-code/route';

const HOST = (() => {
  try {
    return new URL(process.env.DATABASE_URL || '').hostname;
  } catch {
    return '';
  }
})();

function req(
  url: string,
  init: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    cookie?: string;
  } = {},
) {
  const headers = new Headers(init.headers);
  if (init.body !== undefined) {
    headers.set('content-type', 'application/json');
  }
  if (init.cookie) headers.set('cookie', init.cookie);
  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    method: init.method ?? 'POST',
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
}

describe('employee session + auth routes (dev DB)', { concurrency: false }, () => {
  let funcionarioId: string;
  let userId: string;
  let originalFetch: typeof fetch;
  const logs: string[] = [];
  let warnOrig: typeof console.warn;
  let logOrig: typeof console.log;

  before(async () => {
    // HOST foi capturado no load do módulo; relê após dotenv (.env.local por último)
    const hostNow = (() => {
      try {
        return new URL(process.env.DATABASE_URL || '').hostname;
      } catch {
        return '';
      }
    })();
    if (!hostNow || hostNow.includes('odd-sunset')) {
      throw new Error(`Testes abortados: host inválido (${hostNow})`);
    }
    process.env.EMPLOYEE_JWT_SECRET ||=
      'employee-test-secret-32-chars-minimum!!';
    process.env.EMPLOYEE_OTP_PEPPER ||= 'pepper-test-16chars';
    process.env.N8N_EMPLOYEE_OTP_WEBHOOK ||= 'https://example.com/otp';
    process.env.N8N_WEBHOOK_SECRET ||= 'test-webhook-secret';

    await prisma.$executeRaw`
      DELETE FROM rate_limit_buckets
      WHERE key LIKE ${'otp:%'} OR key LIKE ${'verify:%'}
    `;

    const func = await prisma.rhFuncionario.findFirst({
      where: { cpf: TEST_EMPLOYEE_CPF, nome: 'TESTE HOLERITE' },
      select: { id: true, userId: true, portalTokenVersion: true },
    });
    if (!func) {
      throw new Error(
        'Funcionário de teste ausente. Rode: npx tsx scripts/seed-funcionario-teste.ts',
      );
    }
    funcionarioId = func.id;
    userId = func.userId;

    await prisma.rhFuncionario.update({
      where: { id: funcionarioId },
      data: { ativo: true, portalStatus: 'enabled' },
    });

    originalFetch = global.fetch;
    global.fetch = (async () =>
      new Response('ok', { status: 200 })) as typeof fetch;

    warnOrig = console.warn;
    logOrig = console.log;
    console.warn = (...args: unknown[]) => {
      logs.push(args.map(String).join(' '));
      warnOrig(...args);
    };
    console.log = (...args: unknown[]) => {
      logs.push(args.map(String).join(' '));
      logOrig(...args);
    };
  });

  after(async () => {
    global.fetch = originalFetch;
    console.warn = warnOrig;
    console.log = logOrig;
    await prisma.rhFuncionario.update({
      where: { id: funcionarioId },
      data: { ativo: true, portalStatus: 'enabled' },
    });
    await prisma.$disconnect();
  });

  it('tv antigo após incrementar portalTokenVersion → sessão null', async () => {
    const before = await prisma.rhFuncionario.findUniqueOrThrow({
      where: { id: funcionarioId },
      select: { portalTokenVersion: true, lojaId: true, nome: true },
    });
    const token = await signEmployeeToken({
      funcionarioId,
      userId,
      lojaId: before.lojaId,
      name: before.nome,
      tv: before.portalTokenVersion,
    });
    await prisma.rhFuncionario.update({
      where: { id: funcionarioId },
      data: { portalTokenVersion: { increment: 1 } },
    });
    const session = await getEmployeeSession(
      req('/api/colaborador/me', {
        method: 'GET',
        cookie: `${EMPLOYEE_COOKIE}=${token}`,
      }),
    );
    assert.equal(session, null);
    await prisma.rhFuncionario.update({
      where: { id: funcionarioId },
      data: { portalTokenVersion: before.portalTokenVersion },
    });
  });

  it('portalStatus disabled → null; ativo false → null', async () => {
    const row = await prisma.rhFuncionario.findUniqueOrThrow({
      where: { id: funcionarioId },
      select: { portalTokenVersion: true, lojaId: true, nome: true },
    });
    const token = await signEmployeeToken({
      funcionarioId,
      userId,
      lojaId: row.lojaId,
      name: row.nome,
      tv: row.portalTokenVersion,
    });

    await prisma.rhFuncionario.update({
      where: { id: funcionarioId },
      data: { portalStatus: 'disabled' },
    });
    assert.equal(
      await getEmployeeSession(
        req('/api/colaborador/me', {
          method: 'GET',
          cookie: `${EMPLOYEE_COOKIE}=${token}`,
        }),
      ),
      null,
    );

    await prisma.rhFuncionario.update({
      where: { id: funcionarioId },
      data: { portalStatus: 'enabled', ativo: false },
    });
    assert.equal(
      await getEmployeeSession(
        req('/api/colaborador/me', {
          method: 'GET',
          cookie: `${EMPLOYEE_COOKIE}=${token}`,
        }),
      ),
      null,
    );

    await prisma.rhFuncionario.update({
      where: { id: funcionarioId },
      data: { portalStatus: 'enabled', ativo: true },
    });
  });

  it('request-code: inexistente e teste → mesmo status/message', async () => {
    const a = await requestCode(
      req('/api/colaborador/auth/request-code', {
        body: { cpf: '00000000000' },
        headers: { 'x-forwarded-for': '203.0.113.10' },
      }),
    );
    // CPF inválido formato → 400
    assert.equal(a.status, 400);

    const fakeValid = '11144477735';
    const b = await requestCode(
      req('/api/colaborador/auth/request-code', {
        body: { cpf: fakeValid },
        headers: { 'x-forwarded-for': '203.0.113.11' },
      }),
    );
    const c = await requestCode(
      req('/api/colaborador/auth/request-code', {
        body: { cpf: TEST_EMPLOYEE_CPF },
        headers: { 'x-forwarded-for': '203.0.113.12' },
      }),
    );
    assert.equal(b.status, 200);
    assert.equal(c.status, 200);
    const jb = (await b.json()) as { message: string; phoneHint: string | null };
    const jc = (await c.json()) as { message: string; phoneHint: string | null };
    assert.equal(jb.message, jc.message);
    assert.equal(jb.phoneHint, null);
    assert.ok(jc.phoneHint === null || /^\u2022{2}\d{2}$/.test(jc.phoneHint) || /^••\d{2}$/.test(jc.phoneHint));
  });

  it('request-code: 4º pedido em 15 min → 429', async () => {
    const ip = `203.0.113.${50 + Math.floor(Math.random() * 50)}`;
    // Usa CPF de teste com chave de rate limit — limpa bucket antes
    await prisma.rateLimitBucket.deleteMany({
      where: { key: { startsWith: `otp:cpf:${TEST_EMPLOYEE_CPF}` } },
    });
    for (let i = 0; i < 3; i++) {
      const r = await requestCode(
        req('/api/colaborador/auth/request-code', {
          body: { cpf: TEST_EMPLOYEE_CPF },
          headers: { 'x-forwarded-for': `${ip}.${i}` },
        }),
      );
      assert.equal(r.status, 200);
    }
    const fourth = await requestCode(
      req('/api/colaborador/auth/request-code', {
        body: { cpf: TEST_EMPLOYEE_CPF },
        headers: { 'x-forwarded-for': `${ip}.9` },
      }),
    );
    assert.equal(fourth.status, 429);
  });

  it('verify-code: 5 erros invalidam; 6ª com código certo falha', async () => {
    await prisma.rateLimitBucket.deleteMany({
      where: { key: { startsWith: `otp:cpf:${TEST_EMPLOYEE_CPF}` } },
    });
    // cria código conhecido direto no banco
    const code = '123456';
    await prisma.employeeLoginCode.updateMany({
      where: { funcionarioId, consumedAt: null },
      data: { consumedAt: new Date() },
    });
    await prisma.employeeLoginCode.create({
      data: {
        funcionarioId,
        codeHash: hashOtpCode(code),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    for (let i = 0; i < 5; i++) {
      const r = await verifyCode(
        req('/api/colaborador/auth/verify-code', {
          body: { cpf: TEST_EMPLOYEE_CPF, code: '000000' },
          headers: { 'x-forwarded-for': `198.51.100.${i}` },
        }),
      );
      assert.equal(r.status, 400);
    }

    const sixth = await verifyCode(
      req('/api/colaborador/auth/verify-code', {
        body: { cpf: TEST_EMPLOYEE_CPF, code },
        headers: { 'x-forwarded-for': '198.51.100.99' },
      }),
    );
    assert.equal(sixth.status, 400);
  });

  it('verify-code: expirado e reutilizado falham', async () => {
    const code = generateOtpCode();
    await prisma.employeeLoginCode.updateMany({
      where: { funcionarioId, consumedAt: null },
      data: { consumedAt: new Date() },
    });
    await prisma.employeeLoginCode.create({
      data: {
        funcionarioId,
        codeHash: hashOtpCode(code),
        expiresAt: new Date(Date.now() - 1000),
      },
    });
    const expired = await verifyCode(
      req('/api/colaborador/auth/verify-code', {
        body: { cpf: TEST_EMPLOYEE_CPF, code },
        headers: { 'x-forwarded-for': '198.51.100.200' },
      }),
    );
    assert.equal(expired.status, 400);

    const fresh = generateOtpCode();
    await prisma.employeeLoginCode.create({
      data: {
        funcionarioId,
        codeHash: hashOtpCode(fresh),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    const ok = await verifyCode(
      req('/api/colaborador/auth/verify-code', {
        body: { cpf: TEST_EMPLOYEE_CPF, code: fresh },
        headers: { 'x-forwarded-for': '198.51.100.201', 'x-client': 'mobile' },
      }),
    );
    assert.equal(ok.status, 200);
    const j = (await ok.json()) as { token?: string };
    assert.ok(typeof j.token === 'string' && j.token.length > 20);

    const reuse = await verifyCode(
      req('/api/colaborador/auth/verify-code', {
        body: { cpf: TEST_EMPLOYEE_CPF, code: fresh },
        headers: { 'x-forwarded-for': '198.51.100.202' },
      }),
    );
    assert.equal(reuse.status, 400);
  });

  it('verify-code sem X-Client: mobile não devolve token', async () => {
    const code = generateOtpCode();
    await prisma.employeeLoginCode.updateMany({
      where: { funcionarioId, consumedAt: null },
      data: { consumedAt: new Date() },
    });
    await prisma.employeeLoginCode.create({
      data: {
        funcionarioId,
        codeHash: hashOtpCode(code),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    const r = await verifyCode(
      req('/api/colaborador/auth/verify-code', {
        body: { cpf: TEST_EMPLOYEE_CPF, code },
        headers: { 'x-forwarded-for': '198.51.100.210' },
      }),
    );
    assert.equal(r.status, 200);
    const j = (await r.json()) as { token?: string; ok: boolean };
    assert.equal(j.ok, true);
    assert.equal(j.token, undefined);
    assert.ok(r.headers.get('set-cookie')?.includes(EMPLOYEE_COOKIE));
  });

  it('logs não contêm CPF completo nem código OTP', () => {
    const joined = logs.join('\n');
    assert.equal(joined.includes(TEST_EMPLOYEE_CPF), false);
    assert.equal(/\b\d{6}\b/.test(joined) && joined.includes('code='), false);
  });
});
