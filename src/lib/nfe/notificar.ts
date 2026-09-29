/**
 * Notificações WhatsApp do ingest NF-e.
 * Erros de envio são logados e NUNCA derrubam o ingest.
 * Implementação completa (destinos por loja, resumo diário) na Fase 4.
 */

import { prisma } from '@/lib/prisma';
import { findWhatsAppBotForTenant } from '@/lib/whatsapp-sessions';
import { callWhatsAppVps, callWhatsAppVpsSession } from '@/lib/whatsapp-vps';
import type { PipelineProblema } from './pipeline';

export async function notificarProblemasIngest(params: {
  userId: string;
  problemasNovos: Array<PipelineProblema & { storeSlug?: string; numero?: string }>;
}): Promise<void> {
  if (params.problemasNovos.length === 0) return;

  try {
    const config = await prisma.nfeConfig.findUnique({
      where: { userId: params.userId },
    });
    if (!config?.sessionSlot || !config.destinoPadrao) {
      console.info(
        '[nfe.notificar] Sem NfeConfig (sessionSlot/destino) — pulando WhatsApp',
        { qtd: params.problemasNovos.length },
      );
      return;
    }

    const porTipo = new Map<string, number>();
    for (const p of params.problemasNovos) {
      porTipo.set(p.tipo, (porTipo.get(p.tipo) ?? 0) + 1);
    }
    const resumo = [...porTipo.entries()]
      .map(([t, n]) => `${t}: ${n}`)
      .join(', ');

    const message =
      `⚠️ NF-e CMV Real — ${params.problemasNovos.length} problema(s) novo(s)\n` +
      `${resumo}\n` +
      `https://platefull.com.br/cmv-real/notas?status=EM_REVISAO`;

    const bot = await findWhatsAppBotForTenant(params.userId, config.sessionSlot);
    if (!bot) {
      console.warn('[nfe.notificar] Sessão WhatsApp não encontrada', {
        slot: config.sessionSlot,
      });
      return;
    }

    const result = await callWhatsAppVpsSession(
      bot.userId,
      config.sessionSlot,
      'send',
      {
        body: {
          to: config.destinoPadrao,
          message,
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
              message,
              slot: config.sessionSlot,
            },
            timeoutMs: 60_000,
          })
        : result;

    if (!vpsResult.ok || vpsResult.data.success === false) {
      console.warn('[nfe.notificar] Falha no envio WhatsApp', vpsResult.data);
    }
  } catch (err) {
    console.error('[nfe.notificar] Erro (ignorado pelo ingest):', err);
  }
}
