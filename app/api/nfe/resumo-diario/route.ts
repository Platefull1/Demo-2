export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCmvRealAccess, findCmvRealWhatsAppBot } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import { montarResumoDiario } from '@/lib/nfe/resumo-diario';
import { callWhatsAppVps, callWhatsAppVpsSession } from '@/lib/whatsapp-vps';

/**
 * POST /api/nfe/resumo-diario
 * body opcional: { send?: boolean, competencia?: string, storeSlugs?: string[] }
 * Monta pendências; se send=true e houver pendência, envia WhatsApp.
 * Permissão: cmv_real.visualizar (leitura); envio usa NfeConfig do tenant.
 */
export async function POST(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  let body: {
    send?: boolean;
    competencia?: string;
    storeSlugs?: string[];
  } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* empty body ok */
  }

  const storeSlugs =
    !tenant.isAdmin && tenant.allowedStoreSlugs
      ? tenant.allowedStoreSlugs
      : body.storeSlugs ?? null;

  const resumo = await montarResumoDiario({
    tenantUserId: tenant.tenantUserId,
    storeSlugs,
    competencia: body.competencia ?? null,
  });

  if (!resumo.temPendencia || !resumo.mensagem) {
    return NextResponse.json({
      ok: true,
      enviado: false,
      temPendencia: false,
      motivo: 'Sem pendências — nada a enviar',
      lojas: [],
    });
  }

  if (!body.send) {
    return NextResponse.json({
      ok: true,
      enviado: false,
      temPendencia: true,
      mensagem: resumo.mensagem,
      lojas: resumo.lojas,
    });
  }

  const config = await prisma.nfeConfig.findUnique({
    where: { userId: tenant.tenantUserId },
  });
  if (!config?.sessionSlot || !config.destinoPadrao) {
    return NextResponse.json(
      {
        ok: false,
        error: 'NfeConfig sem sessionSlot/destinoPadrao',
        mensagem: resumo.mensagem,
      },
      { status: 400 },
    );
  }

  const bot = await findCmvRealWhatsAppBot(tenant, config.sessionSlot);
  if (!bot) {
    return NextResponse.json(
      { ok: false, error: 'Sessão WhatsApp não encontrada', mensagem: resumo.mensagem },
      { status: 400 },
    );
  }

  const result = await callWhatsAppVpsSession(
    bot.userId,
    config.sessionSlot,
    'send',
    {
      body: {
        to: config.destinoPadrao,
        message: resumo.mensagem,
        slot: config.sessionSlot,
      },
      timeoutMs: 60_000,
    },
  );

  const vpsResult =
    !result.ok && result.status === 404
      ? await callWhatsAppVps('relatorios', 'send', bot.userId, {
          search: `slot=${config.sessionSlot}`,
          body: {
            to: config.destinoPadrao,
            message: resumo.mensagem,
            slot: config.sessionSlot,
          },
          timeoutMs: 60_000,
        })
      : result;

  return NextResponse.json({
    ok: vpsResult.ok && vpsResult.data.success !== false,
    enviado: vpsResult.ok && vpsResult.data.success !== false,
    temPendencia: true,
    mensagem: resumo.mensagem,
    lojas: resumo.lojas,
  });
}

/** GET também monta o preview (sem enviar) */
export async function GET(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const competencia = req.nextUrl.searchParams.get('competencia');
  const resumo = await montarResumoDiario({
    tenantUserId: tenant.tenantUserId,
    storeSlugs:
      !tenant.isAdmin && tenant.allowedStoreSlugs
        ? tenant.allowedStoreSlugs
        : null,
    competencia,
  });

  return NextResponse.json({
    ok: true,
    temPendencia: resumo.temPendencia,
    mensagem: resumo.mensagem,
    lojas: resumo.lojas,
  });
}
