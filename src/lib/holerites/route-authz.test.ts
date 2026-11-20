/**
 * Autorização das rotas /api/rh/holerites/** e /api/colaborador/**.
 * Mocka getRhContext + canAccessTool; handlers reais; Prisma no banco DEV.
 */
import { config } from 'dotenv';
config({ path: '.env', override: true });
config({ path: '.env.local', override: true });

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import { RIDER_JWT_ISSUER } from '@/lib/auth/jwt-config';
import {
  RH_HOLERITES_AUTHZ_ROUTES,
  type AuthzRoute,
} from '@/lib/holerites/route-authz-matrix';

const mocks = vi.hoisted(() => ({
  getRhContext: vi.fn(),
  canAccessTool: vi.fn(),
}));

vi.mock('@/lib/auth/toolPermissions', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/lib/auth/toolPermissions')>();
  return {
    ...actual,
    canAccessTool: mocks.canAccessTool,
  };
});

vi.mock('@/lib/rh-auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/rh-auth')>();

  async function requireRhPermission(
    permission?: string,
    moduleTool: SystemTool = SystemTool.RH,
  ) {
    const ctx = await mocks.getRhContext();
    if (!ctx) {
      return {
        ctx: null,
        error: NextResponse.json(
          {
            error: 'Sessão expirada. Por favor, faça login novamente.',
            code: 'UNAUTHENTICATED',
          },
          { status: 401 },
        ),
      };
    }
    if (!(await mocks.canAccessTool(ctx.stackUserId, moduleTool))) {
      return {
        ctx: null,
        error: NextResponse.json(
          {
            error: 'Acesso negado',
            message: `Você não tem permissão para acessar a ferramenta: ${moduleTool}.`,
          },
          { status: 403 },
        ),
      };
    }
    if (!actual.memberHasCoreRhPermission(ctx)) {
      return {
        ctx: null,
        error: NextResponse.json(
          { error: 'Sem permissão para esta ação' },
          { status: 403 },
        ),
      };
    }
    if (permission && !ctx.hasPermission(permission)) {
      return {
        ctx: null,
        error: NextResponse.json(
          { error: 'Sem permissão para esta ação' },
          { status: 403 },
        ),
      };
    }
    return { ctx, error: null };
  }

  return {
    ...actual,
    getRhContext: mocks.getRhContext,
    requireRhPermission,
  };
});

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({
    allowed: true,
    remaining: 99,
    retryAfterSeconds: 0,
  })),
}));

vi.mock('@/lib/holerites/storage', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/lib/holerites/storage')>();
  return {
    ...actual,
    downloadPayslipObject: vi.fn(async () =>
      Buffer.from('%PDF-1.4\n%%EOF\n'),
    ),
    createPayslipSignedUploadUrl: vi.fn(async (path: string) => ({
      signedUrl: `https://example.com/upload?p=${encodeURIComponent(path)}`,
      token: 'tok',
      path,
    })),
    createPayslipSignedReadUrl: vi.fn(async () => 'https://example.com/read'),
    removePayslipObjects: vi.fn(async () => undefined),
  };
});

vi.mock('@/lib/holerites/n8n', () => ({
  sendPayslipsPublishedWebhook: vi.fn(async () => true),
  sendEmployeeOtp: vi.fn(async () => true),
}));

type FakeCtx = {
  userId: string;
  stackUserId: string;
  isAdmin: boolean;
  memberId: string | null;
  perms: Set<string>;
};

function ctxFrom(fake: FakeCtx) {
  return {
    userId: fake.userId,
    stackUserId: fake.stackUserId,
    isAdmin: fake.isAdmin,
    memberId: fake.memberId,
    hasPermission: (p: string) => fake.isAdmin || fake.perms.has(p),
  };
}

function setSession(fake: FakeCtx | null, toolOn = true) {
  mocks.getRhContext.mockResolvedValue(fake ? ctxFrom(fake) : null);
  mocks.canAccessTool.mockImplementation(async (_id: string, tool: SystemTool) => {
    if (!toolOn) return false;
    return tool === SystemTool.HOLERITES || tool === SystemTool.RH;
  });
}

function makeReq(route: AuthzRoute, urlExtra = '') {
  const headers = new Headers();
  if (route.body !== undefined) headers.set('content-type', 'application/json');
  return new NextRequest(
    new URL(`${route.path.split('?')[0]}${urlExtra}`, 'http://localhost:3000'),
    {
      method: route.method,
      headers,
      body:
        route.body !== undefined ? JSON.stringify(route.body) : undefined,
    },
  );
}

const FAKE_ID = '00000000-0000-4000-8000-000000000099';

function wrongPermission(route: AuthzRoute): string {
  if (route.permission === P.PAYSLIPS_VIEW) return P.PAYSLIPS_UPLOAD;
  if (route.permission === P.PAYSLIPS_UPLOAD) return P.PAYSLIPS_VIEW;
  if (route.permission === P.PAYSLIPS_PUBLISH) return P.PAYSLIPS_UPLOAD;
  if (route.permission === P.PAYSLIPS_REVOKE) return P.PAYSLIPS_VIEW;
  if (route.permission === P.PAYSLIPS_PORTAL_MANAGE) return P.PAYSLIPS_VIEW;
  return P.PAYSLIPS_REVOKE;
}

describe('route-authz RH holerites', () => {
  let tenantA: string;
  let tenantB: string;
  let payslipId: string;
  let batchId: string;
  let funcionarioId: string;

  beforeAll(async () => {
    const host = (() => {
      try {
        return new URL(process.env.DATABASE_URL || '').hostname;
      } catch {
        return '';
      }
    })();
    if (!host || host.includes('odd-sunset')) {
      throw new Error(`route-authz abortado: host inválido (${host})`);
    }

    const { prisma } = await import('@/lib/prisma');
    const func = await prisma.rhFuncionario.findFirst({
      where: { nome: 'TESTE HOLERITE' },
      select: { id: true, userId: true },
    });
    if (!func) throw new Error('TESTE HOLERITE ausente');
    tenantA = func.userId;
    funcionarioId = func.id;
    tenantB = 'tenant-b-fake-for-authz';

    const slip = await prisma.payslip.findFirst({
      where: { userId: tenantA, status: { in: ['PUBLISHED', 'VIEWED'] } },
      select: { id: true, batchId: true },
    });
    const batch = await prisma.payslipBatch.findFirst({
      where: { userId: tenantA },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
    payslipId = slip?.id ?? 'missing-payslip';
    batchId = slip?.batchId ?? batch?.id ?? 'missing-batch';
  });

  beforeEach(() => {
    mocks.getRhContext.mockReset();
    mocks.canAccessTool.mockReset();
  });

  function paramsFor(route: AuthzRoute, mode: 'real' | 'fake' = 'real') {
    if (mode === 'fake' || !route.paramKind) {
      return { params: Promise.resolve({ id: FAKE_ID }) };
    }
    const id =
      route.paramKind === 'payslip'
        ? payslipId
        : route.paramKind === 'batch'
          ? batchId
          : route.paramKind === 'funcionario'
            ? funcionarioId
            : FAKE_ID;
    return { params: Promise.resolve({ id }) };
  }

  for (const route of RH_HOLERITES_AUTHZ_ROUTES) {
    describe(`${route.method} ${route.path}`, () => {
      it('a) sem sessão → 401', async () => {
        setSession(null);
        const handler = await route.load();
        const res = await handler(makeReq(route), paramsFor(route));
        expect(res.status).toBe(401);
      });

      it('b) sem a permissão exigida → 403', async () => {
        const wrong = wrongPermission(route);
        setSession({
          userId: tenantA,
          stackUserId: 'stack-a',
          isAdmin: false,
          memberId: 'm1',
          perms: new Set([wrong]),
        });
        // lote-get needs neither view nor upload
        if (route.permission === 'payslips.view|payslips.upload') {
          setSession({
            userId: tenantA,
            stackUserId: 'stack-a',
            isAdmin: false,
            memberId: 'm1',
            perms: new Set([P.PAYSLIPS_REVOKE]),
          });
        }
        const handler = await route.load();
        const res = await handler(makeReq(route), paramsFor(route));
        expect(res.status).toBe(403);
      });

      it('c) com permissão → ≠ 401/403', async () => {
        const perms = new Set<string>();
        if (route.permission === 'payslips.view|payslips.upload') {
          perms.add(P.PAYSLIPS_VIEW);
        } else {
          perms.add(route.permission);
        }
        perms.add(P.EMPLOYEES_VIEW);
        setSession({
          userId: tenantA,
          stackUserId: 'stack-a',
          isAdmin: false,
          memberId: 'm1',
          perms,
        });
        const handler = await route.load();
        // IDs fake em rotas com recurso → evita mutação; 404 após auth ok
        const mode = route.paramKind ? 'fake' : 'real';
        const extra =
          route.id === 'lote-preview' ? `?payslipId=${FAKE_ID}` : '';
        const res = await handler(makeReq(route, extra), paramsFor(route, mode));
        expect(res.status).not.toBe(401);
        expect(res.status).not.toBe(403);
      });

      it('d) outro tenant → 404 (ou ≠ vazamento 200 de recurso A)', async () => {
        const perms = new Set<string>([
          P.EMPLOYEES_VIEW,
          ...(route.permission === 'payslips.view|payslips.upload'
            ? [P.PAYSLIPS_VIEW]
            : [route.permission]),
        ]);
        setSession({
          userId: tenantB,
          stackUserId: 'stack-b',
          isAdmin: false,
          memberId: 'm2',
          perms,
        });
        const handler = await route.load();
        const extra =
          route.id === 'lote-preview' ? `?payslipId=${payslipId}` : '';
        const res = await handler(makeReq(route, extra), paramsFor(route, 'real'));
        if (!route.paramKind && route.id !== 'lotes-create') {
          expect([200, 404]).toContain(res.status);
        } else if (route.id === 'lotes-create') {
          // FK inexistente → 500; auth já passou
          expect(res.status).not.toBe(401);
          expect(res.status).not.toBe(403);
        } else {
          expect(res.status).toBe(404);
        }
      });

      it('e) tool HOLERITES desligada → 403', async () => {
        const perms = new Set<string>([
          P.EMPLOYEES_VIEW,
          P.PAYSLIPS_VIEW,
          P.PAYSLIPS_UPLOAD,
          P.PAYSLIPS_PUBLISH,
          P.PAYSLIPS_REVOKE,
          P.PAYSLIPS_PORTAL_MANAGE,
        ]);
        setSession(
          {
            userId: tenantA,
            stackUserId: 'stack-a',
            isAdmin: false,
            memberId: 'm1',
            perms,
          },
          false,
        );
        mocks.canAccessTool.mockResolvedValue(false);
        const handler = await route.load();
        const res = await handler(makeReq(route), paramsFor(route));
        expect(res.status).toBe(403);
      });
    });
  }

  it('publicar exige payslips.publish (upload não basta)', async () => {
    setSession({
      userId: tenantA,
      stackUserId: 'stack-a',
      isAdmin: false,
      memberId: 'm1',
      perms: new Set([P.EMPLOYEES_VIEW, P.PAYSLIPS_UPLOAD]),
    });
    const { POST } = await import(
      '../../../app/api/rh/holerites/lotes/[id]/publicar/route'
    );
    const res = await POST(
      makeReq({
        id: 'x',
        path: '/api/rh/holerites/lotes/[id]/publicar',
        method: 'POST',
        permission: P.PAYSLIPS_PUBLISH,
        tenantFilter: true,
        load: async () => POST,
      }),
      { params: Promise.resolve({ id: batchId }) },
    );
    expect(res.status).toBe(403);
  });

  it('revogar exige payslips.revoke', async () => {
    setSession({
      userId: tenantA,
      stackUserId: 'stack-a',
      isAdmin: false,
      memberId: 'm1',
      perms: new Set([P.EMPLOYEES_VIEW, P.PAYSLIPS_VIEW]),
    });
    const { POST } = await import(
      '../../../app/api/rh/holerites/[id]/revogar/route'
    );
    const res = await POST(
      new NextRequest('http://localhost:3000/api/rh/holerites/x/revogar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ motivo: 'Motivo longo o bastante' }),
      }),
      { params: Promise.resolve({ id: payslipId }) },
    );
    expect(res.status).toBe(403);
  });

  it('portal manage exige payslips.portal_manage', async () => {
    setSession({
      userId: tenantA,
      stackUserId: 'stack-a',
      isAdmin: false,
      memberId: 'm1',
      perms: new Set([P.EMPLOYEES_VIEW, P.PAYSLIPS_VIEW]),
    });
    const { POST } = await import(
      '../../../app/api/rh/holerites/funcionarios/[id]/portal/route'
    );
    const res = await POST(
      new NextRequest(
        'http://localhost:3000/api/rh/holerites/funcionarios/x/portal',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action: 'enable' }),
        },
      ),
      { params: Promise.resolve({ id: funcionarioId }) },
    );
    expect(res.status).toBe(403);
  });

  it('export.csv exige payslips.view', async () => {
    setSession({
      userId: tenantA,
      stackUserId: 'stack-a',
      isAdmin: false,
      memberId: 'm1',
      perms: new Set([P.EMPLOYEES_VIEW, P.PAYSLIPS_UPLOAD]),
    });
    const { GET } = await import(
      '../../../app/api/rh/holerites/export.csv/route'
    );
    const res = await GET(
      new NextRequest(
        'http://localhost:3000/api/rh/holerites/export.csv?competencia=2026-08',
      ),
    );
    expect(res.status).toBe(403);
  });
});

describe('route-authz colaborador', () => {
  it('sem sessão → 401 em /api/colaborador/inicio', async () => {
    const { GET } = await import('../../../app/api/colaborador/inicio/route');
    const res = await GET(
      new NextRequest('http://localhost:3000/api/colaborador/inicio'),
    );
    expect(res.status).toBe(401);
  });

  it('token de rider → 401', async () => {
    process.env.RIDER_JWT_SECRET ||=
      'rider-test-secret-32-chars-minimum!!!!';
    const riderToken = await new SignJWT({ riderId: 'r1' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(RIDER_JWT_ISSUER)
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(process.env.RIDER_JWT_SECRET));
    const { GET } = await import('../../../app/api/colaborador/inicio/route');
    const res = await GET(
      new NextRequest('http://localhost:3000/api/colaborador/inicio', {
        headers: { cookie: `rider_token=${riderToken}` },
      }),
    );
    expect(res.status).toBe(401);
  });

  it('cookie Stack (sem employee_token) → 401', async () => {
    const { GET } = await import('../../../app/api/colaborador/inicio/route');
    const res = await GET(
      new NextRequest('http://localhost:3000/api/colaborador/inicio', {
        headers: {
          cookie: 'stack-access=fake; stack-refresh=fake',
        },
      }),
    );
    expect(res.status).toBe(401);
  });
});
