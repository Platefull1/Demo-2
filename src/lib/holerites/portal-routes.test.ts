import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'crypto';
import { config } from 'dotenv';
config({ path: '.env', override: true });
config({ path: '.env.local', override: true });

import { NextRequest } from 'next/server';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';
import {
  signEmployeeToken,
  EMPLOYEE_COOKIE,
} from '@/lib/employee-auth';
import { RIDER_JWT_ISSUER } from '@/lib/auth/jwt-config';
import { TEST_EMPLOYEE_CPF } from '@/lib/holerites/test-employee';
import { uploadPayslipObject, removePayslipObjects } from '@/lib/holerites/storage';
import { GET as getInicio } from '../../../app/api/colaborador/inicio/route';
import { GET as getHolerites } from '../../../app/api/colaborador/holerites/route';
import { GET as getHolerite } from '../../../app/api/colaborador/holerites/[id]/route';
import { GET as getArquivo } from '../../../app/api/colaborador/holerites/[id]/arquivo/route';
import { POST as postCiencia } from '../../../app/api/colaborador/holerites/[id]/ciencia/route';

const CPF2 = '52998224725'; // válido, sem telefone

function req(
  url: string,
  init: {
    method?: string;
    body?: unknown;
    cookie?: string;
    headers?: Record<string, string>;
  } = {},
) {
  const headers = new Headers(init.headers);
  if (init.body !== undefined) headers.set('content-type', 'application/json');
  if (init.cookie) headers.set('cookie', init.cookie);
  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    method: init.method ?? 'GET',
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
}

const miniPdf = Buffer.from(
  '%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n',
  'utf8',
);

describe('portal colaborador APIs (dev DB)', { concurrency: false }, () => {
  let userId: string;
  let lojaId: string;
  let func1Id: string;
  let func2Id: string;
  let cookie1: string;
  let publishedId: string;
  let draftId: string;
  let revokedId: string;
  let otherPublishedId: string;
  let viewAckId: string;
  let integrityId: string;
  const storagePaths: string[] = [];
  let batchId: string;

  before(async () => {
    const host = new URL(process.env.DATABASE_URL || '').hostname;
    if (!host || host.includes('odd-sunset')) {
      throw new Error(`Testes abortados: host inválido (${host})`);
    }
    process.env.EMPLOYEE_JWT_SECRET ||=
      'employee-test-secret-32-chars-minimum!!';
    process.env.RIDER_JWT_SECRET ||=
      'rider-test-secret-32-chars-minimum!!!!';

    const func1 = await prisma.rhFuncionario.findFirst({
      where: { cpf: TEST_EMPLOYEE_CPF, nome: 'TESTE HOLERITE' },
      select: {
        id: true,
        userId: true,
        lojaId: true,
        nome: true,
        portalTokenVersion: true,
      },
    });
    if (!func1?.lojaId) {
      throw new Error('TESTE HOLERITE ausente — rode seed-funcionario-teste');
    }
    func1Id = func1.id;
    userId = func1.userId;
    lojaId = func1.lojaId;

    let func2 = await prisma.rhFuncionario.findFirst({
      where: { userId, cpf: CPF2 },
      select: { id: true, portalTokenVersion: true, nome: true },
    });
    if (!func2) {
      func2 = await prisma.rhFuncionario.create({
        data: {
          userId,
          nome: 'TESTE HOLERITE 2',
          cpf: CPF2,
          telefone: null,
          lojaId,
          ativo: true,
          portalStatus: 'enabled',
          portalTokenVersion: 0,
          escala: '6x1',
          turno: 'comercial',
          salarioBase: 0,
        },
        select: { id: true, portalTokenVersion: true, nome: true },
      });
    } else {
      await prisma.rhFuncionario.update({
        where: { id: func2.id },
        data: {
          nome: 'TESTE HOLERITE 2',
          telefone: null,
          ativo: true,
          portalStatus: 'enabled',
        },
      });
    }
    func2Id = func2.id;

    // Limpa resíduos de runs anteriores deste suite
    const stale = await prisma.payslip.findMany({
      where: {
        OR: [
          { funcionarioId: func1Id, competencia: { in: ['2025-01', '2025-02', '2025-03', '2025-04'] } },
          { funcionarioId: func2Id, competencia: '2025-03' },
        ],
        storagePath: { contains: '/TEST-' },
      },
      select: { id: true, storagePath: true, batchId: true },
    });
    if (stale.length) {
      await prisma.payslipAccessLog.deleteMany({
        where: { payslipId: { in: stale.map((s) => s.id) } },
      });
      await prisma.payslip.deleteMany({
        where: { id: { in: stale.map((s) => s.id) } },
      });
      try {
        await removePayslipObjects(stale.map((s) => s.storagePath));
      } catch {
        /* ignore */
      }
    }

    const token1 = await signEmployeeToken({
      funcionarioId: func1Id,
      userId,
      lojaId,
      name: func1.nome,
      tv: func1.portalTokenVersion,
    });
    cookie1 = `${EMPLOYEE_COOKIE}=${token1}`;

    const sha = createHash('sha256').update(miniPdf).digest('hex');
    const stamp = randomBytes(4).toString('hex');

    const batch = await prisma.payslipBatch.create({
      data: {
        id: `portal-test-${stamp}`,
        userId,
        competencia: '2026-01',
        type: 'MENSAL',
        status: 'PUBLISHED',
        sourceFiles: [],
        createdBy: 'portal-test',
        publishedAt: new Date(),
      },
    });
    batchId = batch.id;

    async function makeSlip(
      funcionarioId: string,
      status: 'DRAFT' | 'PUBLISHED' | 'REVOKED',
      suffix: string,
      competencia: string,
    ) {
      const path = `${userId}/${funcionarioId}/${competencia}/TEST-${suffix}-${stamp}.pdf`;
      await uploadPayslipObject(path, miniPdf);
      storagePaths.push(path);
      return prisma.payslip.create({
        data: {
          userId,
          batchId,
          funcionarioId,
          lojaId,
          competencia,
          type: 'MENSAL',
          status,
          storagePath: path,
          fileSha256: sha,
          fileSizeBytes: miniPdf.length,
          pageCount: 1,
          publishedAt: status === 'DRAFT' ? null : new Date(),
        },
        select: { id: true },
      });
    }

    // competências distintas — índice único (funcionarioId, competencia, type)
    draftId = (await makeSlip(func1Id, 'DRAFT', 'draft', '2025-01')).id;
    revokedId = (await makeSlip(func1Id, 'REVOKED', 'rev', '2025-02')).id;
    viewAckId = (await makeSlip(func1Id, 'PUBLISHED', 'viewack', '2025-03')).id;
    integrityId = (await makeSlip(func1Id, 'PUBLISHED', 'integ', '2025-04')).id;
    otherPublishedId = (await makeSlip(func2Id, 'PUBLISHED', 'other', '2025-03')).id;

    const existing = await prisma.payslip.findFirst({
      where: { funcionarioId: func1Id, status: 'PUBLISHED' },
      select: { id: true },
    });
    publishedId = existing?.id ?? viewAckId;
  });

  after(async () => {
    const ids = [
      draftId,
      revokedId,
      viewAckId,
      integrityId,
      otherPublishedId,
    ].filter(Boolean);
    await prisma.payslipAccessLog.deleteMany({
      where: { payslipId: { in: ids } },
    });
    await prisma.payslip.deleteMany({ where: { id: { in: ids } } });
    if (batchId) {
      await prisma.payslipBatch.deleteMany({ where: { id: batchId } });
    }
    try {
      await removePayslipObjects(storagePaths);
    } catch {
      /* best effort */
    }
    await prisma.rhFuncionario.deleteMany({
      where: { id: func2Id, nome: 'TESTE HOLERITE 2' },
    });
    await prisma.$disconnect();
  });

  it('rider JWT → 401 em todas as rotas /api/colaborador/**', async () => {
    const riderToken = await new SignJWT({ riderId: 'fake-rider' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(RIDER_JWT_ISSUER)
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(process.env.RIDER_JWT_SECRET!));

    const cookie = `rider_token=${riderToken}; ${EMPLOYEE_COOKIE}=${riderToken}`;
    const r1 = await getInicio(req('/api/colaborador/inicio', { cookie }));
    assert.equal(r1.status, 401);
    const r2 = await getHolerites(req('/api/colaborador/holerites', { cookie }));
    assert.equal(r2.status, 401);
    const r3 = await getHolerite(
      req(`/api/colaborador/holerites/${publishedId}`, { cookie }),
      { params: Promise.resolve({ id: publishedId }) },
    );
    assert.equal(r3.status, 401);
  });

  it('IDOR: funcionário 1 recebe 404 no holerite do 2', async () => {
    const r1 = await getHolerite(
      req(`/api/colaborador/holerites/${otherPublishedId}`, {
        cookie: cookie1,
      }),
      { params: Promise.resolve({ id: otherPublishedId }) },
    );
    assert.equal(r1.status, 404);

    const r2 = await getArquivo(
      req(`/api/colaborador/holerites/${otherPublishedId}/arquivo`, {
        cookie: cookie1,
      }),
      { params: Promise.resolve({ id: otherPublishedId }) },
    );
    assert.equal(r2.status, 404);

    const r3 = await postCiencia(
      req(`/api/colaborador/holerites/${otherPublishedId}/ciencia`, {
        method: 'POST',
        cookie: cookie1,
        body: { aceite: true },
      }),
      { params: Promise.resolve({ id: otherPublishedId }) },
    );
    assert.equal(r3.status, 404);
  });

  it('DRAFT e REVOKED → 404 nos três endpoints', async () => {
    for (const id of [draftId, revokedId]) {
      assert.equal(
        (
          await getHolerite(
            req(`/api/colaborador/holerites/${id}`, { cookie: cookie1 }),
            { params: Promise.resolve({ id }) },
          )
        ).status,
        404,
      );
      assert.equal(
        (
          await getArquivo(
            req(`/api/colaborador/holerites/${id}/arquivo`, {
              cookie: cookie1,
            }),
            { params: Promise.resolve({ id }) },
          )
        ).status,
        404,
      );
      assert.equal(
        (
          await postCiencia(
            req(`/api/colaborador/holerites/${id}/ciencia`, {
              method: 'POST',
              cookie: cookie1,
              body: { aceite: true },
            }),
            { params: Promise.resolve({ id }) },
          )
        ).status,
        404,
      );
    }
  });

  it('ciência sem ter visto → 400; duas vezes → acknowledgedAt estável', async () => {
    await prisma.payslip.update({
      where: { id: viewAckId },
      data: {
        status: 'PUBLISHED',
        firstViewedAt: null,
        acknowledgedAt: null,
        ackIp: null,
        ackUserAgent: null,
        ackFileSha256: null,
      },
    });

    const beforeView = await postCiencia(
      req(`/api/colaborador/holerites/${viewAckId}/ciencia`, {
        method: 'POST',
        cookie: cookie1,
        body: { aceite: true },
      }),
      { params: Promise.resolve({ id: viewAckId }) },
    );
    assert.equal(beforeView.status, 400);
    const errBody = (await beforeView.json()) as { error: string };
    assert.match(errBody.error, /Abra o holerite/i);

    const fileRes = await getArquivo(
      req(`/api/colaborador/holerites/${viewAckId}/arquivo`, {
        cookie: cookie1,
      }),
      { params: Promise.resolve({ id: viewAckId }) },
    );
    assert.equal(fileRes.status, 200);
    assert.equal(fileRes.headers.get('content-type'), 'application/pdf');

    const afterView = await prisma.payslip.findUniqueOrThrow({
      where: { id: viewAckId },
      select: { status: true, firstViewedAt: true },
    });
    assert.equal(afterView.status, 'VIEWED');
    assert.ok(afterView.firstViewedAt);

    const ack1 = await postCiencia(
      req(`/api/colaborador/holerites/${viewAckId}/ciencia`, {
        method: 'POST',
        cookie: cookie1,
        body: { aceite: true },
      }),
      { params: Promise.resolve({ id: viewAckId }) },
    );
    assert.equal(ack1.status, 200);
    const body1 = (await ack1.json()) as { acknowledgedAt: string };
    assert.ok(body1.acknowledgedAt);

    const ack2 = await postCiencia(
      req(`/api/colaborador/holerites/${viewAckId}/ciencia`, {
        method: 'POST',
        cookie: cookie1,
        body: { aceite: true },
      }),
      { params: Promise.resolve({ id: viewAckId }) },
    );
    assert.equal(ack2.status, 200);
    const body2 = (await ack2.json()) as { acknowledgedAt: string };
    assert.equal(body2.acknowledgedAt, body1.acknowledgedAt);

    const again = await getArquivo(
      req(`/api/colaborador/holerites/${viewAckId}/arquivo`, {
        cookie: cookie1,
      }),
      { params: Promise.resolve({ id: viewAckId }) },
    );
    assert.equal(again.status, 200);
    const afterAck = await prisma.payslip.findUniqueOrThrow({
      where: { id: viewAckId },
      select: { status: true, acknowledgedAt: true },
    });
    assert.equal(afterAck.status, 'ACKNOWLEDGED');
    assert.equal(afterAck.acknowledgedAt?.toISOString(), body1.acknowledgedAt);
  });

  it('/arquivo com sha256 adulterado → 500', async () => {
    const original = await prisma.payslip.findUniqueOrThrow({
      where: { id: integrityId },
      select: { fileSha256: true },
    });
    await prisma.payslip.update({
      where: { id: integrityId },
      data: { fileSha256: '0'.repeat(64) },
    });
    try {
      const res = await getArquivo(
        req(`/api/colaborador/holerites/${integrityId}/arquivo`, {
          cookie: cookie1,
        }),
        { params: Promise.resolve({ id: integrityId }) },
      );
      assert.equal(res.status, 500);
    } finally {
      await prisma.payslip.update({
        where: { id: integrityId },
        data: { fileSha256: original.fileSha256 },
      });
    }
  });

  it('GET /inicio e lista retornam dados do funcionário 1', async () => {
    const inicio = await getInicio(
      req('/api/colaborador/inicio', { cookie: cookie1 }),
    );
    assert.equal(inicio.status, 200);
    const body = (await inicio.json()) as {
      nome: string;
      ultimo: { id: string } | null;
    };
    assert.ok(body.nome);

    const list = await getHolerites(
      req('/api/colaborador/holerites', { cookie: cookie1 }),
    );
    assert.equal(list.status, 200);
    const listBody = (await list.json()) as {
      items: Array<{ id: string; storagePath?: string }>;
    };
    assert.ok(listBody.items.length >= 1);
    assert.equal(listBody.items[0]!.storagePath, undefined);
    assert.ok(!listBody.items.some((i) => i.id === otherPublishedId));
  });
});
