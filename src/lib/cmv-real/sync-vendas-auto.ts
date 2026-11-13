/**
 * Sync automático diário (n8n) de vendas/refeições CMV Real.
 * Reutiliza syncRefeicoesSaipos — mesma regra de venda líquida + preservação de ajuste.
 */

import { prisma } from '@/lib/prisma';
import {
  CMV_STORE_SLUGS,
  competenciaAnterior,
  type CmvStoreSlug,
} from '@/lib/nfe/lojas';
import { storeLabel } from '@/lib/nfe/ui-labels';
import { getCmvRealTenantFromUserId } from '@/lib/nfe/tenant';
import { syncRefeicoesSaipos } from '@/lib/cmv-real/sync-refeicoes';
import { partsInSaoPaulo } from '@/lib/nfe/dates';

const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isYmd(s: string): boolean {
  if (!YMD_RE.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

/** YYYY-MM-DD civil em America/Sao_Paulo. */
export function civilTodaySp(now: Date = new Date()): string {
  const { year, month, day } = partsInSaoPaulo(now);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Aritmética de dia civil (sem DST no Brasil). */
export function addDaysYmd(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + delta));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
}

export function competenciaFromYmd(ymd: string): string {
  return ymd.slice(0, 7);
}

/** Competências YYYY-MM que intersectam [de, ate] inclusive. */
export function competenciasNoIntervalo(de: string, ate: string): string[] {
  if (de > ate) return [];
  const out: string[] = [];
  let cur = competenciaFromYmd(de);
  const last = competenciaFromYmd(ate);
  while (cur <= last) {
    out.push(cur);
    const [y, m] = cur.split('-').map(Number);
    if (m === 12) cur = `${y + 1}-01`;
    else cur = `${y}-${String(m + 1).padStart(2, '0')}`;
  }
  return out;
}

/**
 * Janela padrão: dia 1 do mês corrente → ontem (SP).
 * Dias 1–3: inclui também o mês anterior inteiro (atraso/cancelamentos Saipos).
 * Dia 1: só o mês anterior (ontem já é o mês passado).
 */
export function janelaPadraoSyncAuto(now: Date = new Date()): {
  de: string;
  ate: string;
  competencias: string[];
} {
  const hoje = civilTodaySp(now);
  const { day } = partsInSaoPaulo(now);
  const mesAtual = competenciaFromYmd(hoje);
  const ontem = addDaysYmd(hoje, -1);
  const ant = competenciaAnterior(mesAtual);
  const [ay, am] = ant.split('-').map(Number);
  const lastDayAnt = new Date(Date.UTC(ay, am, 0)).getUTCDate();
  const fimAnt = `${ant}-${String(lastDayAnt).padStart(2, '0')}`;

  if (day === 1) {
    return { de: `${ant}-01`, ate: fimAnt, competencias: [ant] };
  }

  const competencias = new Set<string>([mesAtual]);
  let de = `${mesAtual}-01`;
  const ate = ontem;
  if (day <= 3) {
    competencias.add(ant);
    de = `${ant}-01`;
  }
  return { de, ate, competencias: [...competencias].sort() };
}

export type LojaSyncItem = {
  lojaId: string;
  storeSlug: string;
  nome: string;
};

/**
 * Lojas CMV do tenant (slug = lojaId para o n8n).
 *
 * Fonte: constante `CMV_STORE_SLUGS` (ahu, pilarzinho, portao, uberaba) —
 * mesma lista do CMV Real / fechamento. Não deriva de Store/RhLoja
 * (abrevições tipo PLRZ/PRT/UBE não mapeiam e cortariam lojas).
 * Respeita `allowedStoreSlugs` do tenant (gerente com escopo).
 */
export async function listarLojasSyncDoTenant(
  serviceUserId: string,
): Promise<LojaSyncItem[]> {
  const tenant = await getCmvRealTenantFromUserId(serviceUserId);
  if (!tenant) return [];

  const allowed = tenant.allowedStoreSlugs;
  const slugs = (
    allowed == null
      ? [...CMV_STORE_SLUGS]
      : allowed.filter((s) =>
          (CMV_STORE_SLUGS as readonly string[]).includes(s),
        )
  ) as CmvStoreSlug[];

  return slugs.map((slug) => ({
    lojaId: slug,
    storeSlug: slug,
    nome: storeLabel(slug),
  }));
}

export async function assertLojaDoTenant(
  serviceUserId: string,
  lojaId: string,
): Promise<
  | { ok: true; tenantUserId: string; storeSlug: CmvStoreSlug }
  | { ok: false; status: number; error: string }
> {
  if (!(CMV_STORE_SLUGS as readonly string[]).includes(lojaId)) {
    return { ok: false, status: 400, error: 'lojaId inválido' };
  }
  const tenant = await getCmvRealTenantFromUserId(serviceUserId);
  if (!tenant) {
    return { ok: false, status: 401, error: 'Tenant não encontrado' };
  }
  if (
    tenant.allowedStoreSlugs != null &&
    !tenant.allowedStoreSlugs.includes(lojaId)
  ) {
    return { ok: false, status: 403, error: 'Tenant sem acesso a esta loja' };
  }

  const lojas = await listarLojasSyncDoTenant(serviceUserId);
  if (!lojas.some((l) => l.lojaId === lojaId)) {
    return { ok: false, status: 403, error: 'Loja não pertence ao tenant da key' };
  }

  return {
    ok: true,
    tenantUserId: tenant.tenantUserId,
    storeSlug: lojaId as CmvStoreSlug,
  };
}

const COMPETENCIA_RE = /^\d{4}-\d{2}$/;

export function resolveJanelaSyncAuto(params: {
  de?: string;
  ate?: string;
}): { de: string; ate: string; competencias: string[] } {
  if (params.de != null || params.ate != null) {
    if (!params.de || !params.ate) {
      throw Object.assign(new Error('Informe de e ate juntos (YYYY-MM-DD)'), {
        status: 400,
      });
    }
    if (!isYmd(params.de) || !isYmd(params.ate)) {
      throw Object.assign(new Error('de/ate devem ser YYYY-MM-DD válidos'), {
        status: 400,
      });
    }
    if (params.de > params.ate) {
      throw Object.assign(new Error('de não pode ser maior que ate'), {
        status: 400,
      });
    }
    return {
      de: params.de,
      ate: params.ate,
      competencias: competenciasNoIntervalo(params.de, params.ate),
    };
  }
  return janelaPadraoSyncAuto();
}

export type SyncAutoPlanResult = {
  ok: true;
  mode: 'plan';
  storeSlug: string;
  lojaId: string;
  de: string;
  ate: string;
  competencias: string[];
};

export type SyncAutoSyncResult = {
  ok: boolean;
  mode: 'sync';
  storeSlug: string;
  lojaId: string;
  de: string;
  ate: string;
  competencia: string;
  competencias: string[];
  status: 'SUCESSO' | 'FALHA';
  erro: string | null;
  duracaoMs: number;
  upserted?: number;
  removedOrIgnored?: number;
  vendaMesSaipos?: number;
  totalSalesFetched?: number;
  timings?: Record<string, number>;
  logId: string;
};

export type SyncAutoResult = SyncAutoPlanResult | SyncAutoSyncResult;

/**
 * Sem `competencia`: só planeja (lista competências da janela) — n8n itera loja × competência.
 * Com `competencia`: sync de UMA competência (mesma lógica do botão manual).
 */
export async function runSyncVendasAuto(params: {
  serviceUserId: string;
  lojaId: string;
  competencia?: string;
  de?: string;
  ate?: string;
}): Promise<SyncAutoResult> {
  const ownership = await assertLojaDoTenant(params.serviceUserId, params.lojaId);
  if (ownership.ok === false) {
    throw Object.assign(new Error(ownership.error), { status: ownership.status });
  }

  const janela = resolveJanelaSyncAuto({ de: params.de, ate: params.ate });
  if (janela.competencias.length === 0) {
    throw Object.assign(new Error('Nenhuma competência na janela'), {
      status: 400,
    });
  }

  // --- Modo plan: n8n descobre o que iterar ---
  if (!params.competencia) {
    return {
      ok: true,
      mode: 'plan',
      storeSlug: ownership.storeSlug,
      lojaId: ownership.storeSlug,
      de: janela.de,
      ate: janela.ate,
      competencias: janela.competencias,
    };
  }

  if (!COMPETENCIA_RE.test(params.competencia)) {
    throw Object.assign(new Error('competencia deve ser YYYY-MM'), {
      status: 400,
    });
  }

  const competencia = params.competencia;
  const started = Date.now();

  // de/ate do log = abrangência da competência pedida (mês civil)
  const [y, m] = competencia.split('-').map(Number);
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const de = `${competencia}-01`;
  const ate = `${competencia}-${String(lastDay).padStart(2, '0')}`;

  const fechamento = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: ownership.tenantUserId,
        storeSlug: ownership.storeSlug,
        competencia,
      },
    },
    select: { status: true },
  });

  if (fechamento?.status === 'FECHADO') {
    const duracaoMs = Date.now() - started;
    const log = await prisma.cmvSyncLog.create({
      data: {
        userId: ownership.tenantUserId,
        storeSlug: ownership.storeSlug,
        de,
        ate,
        competencias: [competencia],
        status: 'SUCESSO',
        erro: 'Competência fechada',
        duracaoMs,
        detalhe: { skipped: true, reason: 'Competência fechada' },
      },
    });
    return {
      ok: true,
      mode: 'sync',
      storeSlug: ownership.storeSlug,
      lojaId: ownership.storeSlug,
      de,
      ate,
      competencia,
      competencias: [competencia],
      status: 'SUCESSO',
      erro: 'Competência fechada',
      duracaoMs,
      logId: log.id,
    };
  }

  try {
    const r = await syncRefeicoesSaipos({
      tenantUserId: ownership.tenantUserId,
      storeSlug: ownership.storeSlug,
      competencia,
      actorUserId: params.serviceUserId,
    });
    const duracaoMs = Date.now() - started;
    const log = await prisma.cmvSyncLog.create({
      data: {
        userId: ownership.tenantUserId,
        storeSlug: ownership.storeSlug,
        de,
        ate,
        competencias: [competencia],
        status: 'SUCESSO',
        erro: null,
        duracaoMs,
        detalhe: {
          upserted: r.upserted,
          removedOrIgnored: r.removedOrIgnored,
          vendaMesSaipos: r.vendaMesSaipos,
          totalSalesFetched: r.totalSalesFetched,
          timings: r.timings,
        },
      },
    });
    return {
      ok: true,
      mode: 'sync',
      storeSlug: ownership.storeSlug,
      lojaId: ownership.storeSlug,
      de,
      ate,
      competencia,
      competencias: [competencia],
      status: 'SUCESSO',
      erro: null,
      duracaoMs,
      upserted: r.upserted,
      removedOrIgnored: r.removedOrIgnored,
      vendaMesSaipos: r.vendaMesSaipos,
      totalSalesFetched: r.totalSalesFetched,
      timings: r.timings,
      logId: log.id,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Falha no sync';
    const duracaoMs = Date.now() - started;
    const log = await prisma.cmvSyncLog.create({
      data: {
        userId: ownership.tenantUserId,
        storeSlug: ownership.storeSlug,
        de,
        ate,
        competencias: [competencia],
        status: 'FALHA',
        erro: msg,
        duracaoMs,
        detalhe: { error: msg },
      },
    });
    return {
      ok: false,
      mode: 'sync',
      storeSlug: ownership.storeSlug,
      lojaId: ownership.storeSlug,
      de,
      ate,
      competencia,
      competencias: [competencia],
      status: 'FALHA',
      erro: msg,
      duracaoMs,
      logId: log.id,
    };
  }
}

export async function ultimaSyncAutoPorLoja(params: {
  tenantUserId: string;
  storeSlug: string;
}): Promise<{
  createdAt: string;
  status: 'SUCESSO' | 'FALHA';
  erro: string | null;
  de: string;
  ate: string;
} | null> {
  const row = await prisma.cmvSyncLog.findFirst({
    where: {
      userId: params.tenantUserId,
      storeSlug: params.storeSlug,
    },
    orderBy: { createdAt: 'desc' },
    select: {
      createdAt: true,
      status: true,
      erro: true,
      de: true,
      ate: true,
    },
  });
  if (!row) return null;
  return {
    createdAt: row.createdAt.toISOString(),
    status: row.status,
    erro: row.erro,
    de: row.de,
    ate: row.ate,
  };
}
