/**
 * Integração: escopo por loja nas rotas de contagem + CMV Real access.
 *
 * Mocka getRhContext com membros reais da branch Neon.
 * Rodar (DATABASE_URL da branch polished-grass):
 *   node --experimental-test-module-mocks --import tsx --test src/lib/estoque/contagens-store-scope.test.ts
 */
import { after, before, describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import type { RhContext } from '@/lib/rh-auth';

const host = process.env.DATABASE_URL?.match(/@([^/?]+)/)?.[1] ?? '(unset)';
console.log(`[contagens-store-scope] DATABASE_URL host: ${host}`);
if (!host.includes('ep-polished-grass')) {
  throw new Error(
    `Recusando rodar: host deve ser ep-polished-grass-..., obtido: ${host}`,
  );
}

type ActorEmail =
  | 'calenzano.ahu@gmail.com'
  | 'estoquecalenzano@gmail.com'
  | 'calenzano.pilarzinho@gmail.com'
  | 'calenzano.portao@gmail.com'
  | 'calenzano.escritorio@gmail.com'
  | 'platefull.app@gmail.com';

let activeCtx: RhContext | null = null;

mock.module('@/lib/rh-auth', {
  namedExports: {
    getRhContext: async () => activeCtx,
  },
});

const { prisma } = await import('@/lib/prisma');
const { storeSlugFromLojaNome } = await import('@/lib/store-access');
const { GET, POST } = await import('../../../app/api/estoque/contagens/route');
const { PATCH, DELETE } = await import(
  '../../../app/api/estoque/contagens/[id]/route'
);
const { GET: getCmvAccess } = await import(
  '../../../app/api/cmv-real/access/route'
);

const EMAILS: ActorEmail[] = [
  'calenzano.ahu@gmail.com',
  'estoquecalenzano@gmail.com',
  'calenzano.pilarzinho@gmail.com',
  'calenzano.portao@gmail.com',
  'calenzano.escritorio@gmail.com',
  'platefull.app@gmail.com',
];

type Actor = {
  email: ActorEmail;
  userId: string;
  stackUserId: string;
  ctx: RhContext;
};

const actors = new Map<ActorEmail, Actor>();
let ids = {
  ahu: '' as string,
  pilarzinho: '' as string,
  portao: '' as string,
};
let createdTestId: string | null = null;

function asActor(email: ActorEmail) {
  const a = actors.get(email);
  assert.ok(a, `ator não carregado: ${email}`);
  activeCtx = a.ctx;
  return a;
}

async function jsonOf(res: Response) {
  const body = await res.json();
  return { status: res.status, body };
}

function isAhu(loja: string | null | undefined) {
  return storeSlugFromLojaNome(loja) === 'ahu';
}

function monthOf(iso: string) {
  return new Date(iso).getUTCMonth() + 1;
}

before(async () => {
  const users = await prisma.user.findMany({
    where: { email: { in: EMAILS } },
    select: { id: true, email: true, stackUserId: true },
  });
  const byEmail = new Map(users.map((u) => [u.email!, u]));

  for (const email of EMAILS) {
    const user = byEmail.get(email);
    assert.ok(user?.stackUserId, `User ausente na branch: ${email}`);

    if (email === 'platefull.app@gmail.com') {
      actors.set(email, {
        email,
        userId: user.id,
        stackUserId: user.stackUserId,
        ctx: {
          userId: user.id,
          stackUserId: user.stackUserId,
          isAdmin: true,
          memberId: null,
          hasPermission: () => true,
        },
      });
      continue;
    }

    const member = await prisma.rhTeamMember.findFirst({
      where: { email, isActive: true },
      include: { permissions: true },
    });
    assert.ok(member, `RhTeamMember ausente: ${email}`);
    const perms = new Set(member.permissions.map((p) => p.permission));
    actors.set(email, {
      email,
      userId: user.id,
      stackUserId: user.stackUserId,
      ctx: {
        userId: member.tenantUserId,
        stackUserId: user.stackUserId,
        isAdmin: false,
        memberId: member.id,
        hasPermission: (p: string) => perms.has(p),
      },
    });
  }

  asActor('platefull.app@gmail.com');
  const allRes = await GET();
  const all = (await allRes.json()) as Array<{
    id: string;
    lojaNome: string | null;
  }>;
  assert.equal(allRes.status, 200);

  const findSlug = (slug: string) =>
    all.find((c) => storeSlugFromLojaNome(c.lojaNome) === slug);
  ids.ahu = findSlug('ahu')?.id ?? '';
  ids.pilarzinho = findSlug('pilarzinho')?.id ?? '';
  ids.portao = findSlug('portao')?.id ?? '';
  assert.ok(ids.ahu, 'contagem Ahú necessária na branch');
  assert.ok(ids.pilarzinho, 'contagem Pilarzinho necessária na branch');
  assert.ok(ids.portao, 'contagem Portão necessária na branch');
});

after(async () => {
  if (createdTestId) {
    try {
      await prisma.estoqueContagem.delete({ where: { id: createdTestId } });
    } catch {
      /* já apagada */
    }
    createdTestId = null;
  }
  await prisma.$disconnect();
});

describe('GET /api/estoque/contagens — escopo por loja', () => {
  it('Ahú e estoquecalenzano: só Ahú, mesma lista (incl. 6 abr–jul)', async () => {
    asActor('calenzano.ahu@gmail.com');
    const ahu = await jsonOf(await GET());
    asActor('estoquecalenzano@gmail.com');
    const est = await jsonOf(await GET());

    assert.equal(ahu.status, 200);
    assert.equal(est.status, 200);
    assert.ok(Array.isArray(ahu.body));
    assert.ok(ahu.body.length >= 6);

    for (const row of ahu.body) {
      assert.equal(storeSlugFromLojaNome(row.lojaNome), 'ahu');
    }
    for (const row of est.body) {
      assert.equal(storeSlugFromLojaNome(row.lojaNome), 'ahu');
    }

    const idsAhu = ahu.body.map((r: { id: string }) => r.id).sort();
    const idsEst = est.body.map((r: { id: string }) => r.id).sort();
    assert.deepEqual(idsAhu, idsEst);

    const abrJul = ahu.body.filter((r: { dataCriacao: string }) => {
      const m = monthOf(r.dataCriacao);
      return m >= 4 && m <= 7;
    });
    assert.ok(
      abrJul.length >= 6,
      `esperado ≥6 contagens Ahú abr–jul, obtido ${abrJul.length}`,
    );
  });

  it('Pilarzinho: só Pilarzinho', async () => {
    asActor('calenzano.pilarzinho@gmail.com');
    const { status, body } = await jsonOf(await GET());
    assert.equal(status, 200);
    assert.ok(body.length >= 1);
    for (const row of body) {
      assert.equal(storeSlugFromLojaNome(row.lojaNome), 'pilarzinho');
    }
  });

  it('escritório e platefull.app: todas (inclui sem loja se existirem)', async () => {
    asActor('platefull.app@gmail.com');
    const full = await jsonOf(await GET());
    asActor('calenzano.escritorio@gmail.com');
    const esc = await jsonOf(await GET());

    assert.equal(full.status, 200);
    assert.equal(esc.status, 200);

    const fullIds = full.body.map((r: { id: string }) => r.id).sort();
    const escIds = esc.body.map((r: { id: string }) => r.id).sort();
    assert.deepEqual(escIds, fullIds);

    const slugs = new Set(
      full.body.map((r: { lojaNome: string | null }) =>
        storeSlugFromLojaNome(r.lojaNome),
      ),
    );
    assert.ok(slugs.has('ahu'));
    assert.ok(slugs.has('pilarzinho'));
    assert.ok(slugs.has('portao'));

    const semLoja = full.body.filter(
      (r: { lojaNome: string | null }) => !r.lojaNome,
    );
    // Contagens sem loja (se houver na branch) entram no escopo total
    for (const row of semLoja) {
      assert.equal(row.lojaNome, null);
    }
  });
});

describe('PATCH/DELETE contagem de outra loja → 403/404', () => {
  const cases: Array<{
    actor: ActorEmail;
    target: keyof typeof ids;
  }> = [
    { actor: 'calenzano.ahu@gmail.com', target: 'pilarzinho' },
    { actor: 'calenzano.ahu@gmail.com', target: 'portao' },
    { actor: 'calenzano.pilarzinho@gmail.com', target: 'ahu' },
    { actor: 'calenzano.pilarzinho@gmail.com', target: 'portao' },
  ];

  for (const { actor, target } of cases) {
    it(`PATCH {} ${actor} → ${target}`, async () => {
      asActor(actor);
      const req = new NextRequest(
        `http://localhost/api/estoque/contagens/${ids[target]}`,
        {
          method: 'PATCH',
          body: JSON.stringify({}),
          headers: { 'content-type': 'application/json' },
        },
      );
      const res = await PATCH(req, {
        params: Promise.resolve({ id: ids[target] }),
      });
      assert.ok(
        res.status === 403 || res.status === 404,
        `esperado 403/404, obtido ${res.status}`,
      );
    });

    it(`DELETE ${actor} → ${target}`, async () => {
      asActor(actor);
      const req = new NextRequest(
        `http://localhost/api/estoque/contagens/${ids[target]}`,
        { method: 'DELETE' },
      );
      const res = await DELETE(req, {
        params: Promise.resolve({ id: ids[target] }),
      });
      assert.ok(
        res.status === 403 || res.status === 404,
        `esperado 403/404, obtido ${res.status}`,
      );
    });
  }
});

describe('POST — loja obrigatória e escopo', () => {
  const postActors: ActorEmail[] = [
    'calenzano.ahu@gmail.com',
    'calenzano.escritorio@gmail.com',
    'platefull.app@gmail.com',
  ];

  for (const email of postActors) {
    it(`POST sem loja → 403 LOJA_OBRIGATORIA (${email})`, async () => {
      asActor(email);
      const req = new NextRequest('http://localhost/api/estoque/contagens', {
        method: 'POST',
        body: JSON.stringify({ sessoes: [], criadoPor: 'teste-scope' }),
        headers: { 'content-type': 'application/json' },
      });
      const { status, body } = await jsonOf(await POST(req));
      assert.equal(status, 403);
      assert.equal(body.code, 'LOJA_OBRIGATORIA');
    });
  }

  it('POST gerente Ahú com loja Portão → bloqueado', async () => {
    asActor('calenzano.ahu@gmail.com');
    const req = new NextRequest('http://localhost/api/estoque/contagens', {
      method: 'POST',
      body: JSON.stringify({
        sessoes: [],
        criadoPor: 'teste-scope',
        lojaNome: 'CALENZANO PORTÃO',
      }),
      headers: { 'content-type': 'application/json' },
    });
    const { status, body } = await jsonOf(await POST(req));
    assert.equal(status, 403);
    assert.equal(body.code, 'LOJA_FORBIDDEN');
  });
});

describe('Controles positivos', () => {
  it('gerente Ahú PATCH na própria loja (contagem de teste + cleanup)', async () => {
    asActor('calenzano.ahu@gmail.com');
    const createReq = new NextRequest('http://localhost/api/estoque/contagens', {
      method: 'POST',
      body: JSON.stringify({
        sessoes: [],
        criadoPor: 'teste-scope-positivo',
        lojaNome: 'CALENZANO AHÚ',
      }),
      headers: { 'content-type': 'application/json' },
    });
    const created = await jsonOf(await POST(createReq));
    assert.equal(created.status, 201, JSON.stringify(created.body));
    createdTestId = created.body.id;
    assert.ok(createdTestId);
    assert.ok(isAhu(created.body.lojaNome));

    const patchReq = new NextRequest(
      `http://localhost/api/estoque/contagens/${createdTestId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({}),
        headers: { 'content-type': 'application/json' },
      },
    );
    const patched = await jsonOf(
      await PATCH(patchReq, {
        params: Promise.resolve({ id: createdTestId! }),
      }),
    );
    assert.equal(patched.status, 200);
    assert.equal(patched.body.id, createdTestId);

    const delReq = new NextRequest(
      `http://localhost/api/estoque/contagens/${createdTestId}`,
      { method: 'DELETE' },
    );
    const deleted = await jsonOf(
      await DELETE(delReq, {
        params: Promise.resolve({ id: createdTestId! }),
      }),
    );
    assert.equal(deleted.status, 200);
    createdTestId = null;
  });

  it('escritório PATCH em contagem de qualquer loja (Portão)', async () => {
    asActor('calenzano.escritorio@gmail.com');
    const req = new NextRequest(
      `http://localhost/api/estoque/contagens/${ids.portao}`,
      {
        method: 'PATCH',
        body: JSON.stringify({}),
        headers: { 'content-type': 'application/json' },
      },
    );
    const { status, body } = await jsonOf(
      await PATCH(req, { params: Promise.resolve({ id: ids.portao }) }),
    );
    assert.equal(status, 200);
    assert.equal(body.id, ids.portao);
    assert.equal(storeSlugFromLojaNome(body.lojaNome), 'portao');
  });
});

describe('CMV Real — access + escopo', () => {
  it('estoquecalenzano: canView e escopo só Ahú', async () => {
    asActor('estoquecalenzano@gmail.com');
    const { status, body } = await jsonOf(await getCmvAccess());
    assert.equal(status, 200);
    assert.equal(body.canView, true);
    assert.deepEqual(body.allowedStoreSlugs, ['ahu']);
    assert.equal(body.lojaNaoConfigurada, false);
  });

  it('calenzano.ahu: canView e escopo só Ahú (igual)', async () => {
    asActor('calenzano.ahu@gmail.com');
    const { status, body } = await jsonOf(await getCmvAccess());
    assert.equal(status, 200);
    assert.equal(body.canView, true);
    assert.deepEqual(body.allowedStoreSlugs, ['ahu']);
    assert.equal(body.lojaNaoConfigurada, false);
  });
});
