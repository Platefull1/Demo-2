/**
 * Descobre se este worker (stackUserId + slot) é a sessão configurada
 * para transferências WhatsApp, e qual o tenant CMV dono.
 */

import prisma from '../../db/index.js';
import { cacheGet, cacheSet } from './cache.js';

/**
 * @param {string} stackUserId — userId do WhatsAppBot (stack_users.id)
 * @param {number} slot
 * @returns {Promise<{ botId: string, tenantUserId: string }|null>}
 */
export async function resolverTenantTransferencias(stackUserId, slot) {
  const cacheKey = `cfg:${stackUserId}:${slot}`;
  const cached = cacheGet(cacheKey);
  if (cached !== undefined) return cached;

  const bot = await prisma.whatsAppBot.findUnique({
    where: { userId_slot: { userId: stackUserId, slot: Number(slot) } },
    select: { id: true },
  });
  if (!bot) {
    return cacheSet(cacheKey, null);
  }

  const user = await prisma.user.findFirst({
    where: { transferenciasWhatsappBotId: bot.id },
    select: { id: true },
  });
  if (!user) {
    return cacheSet(cacheKey, null);
  }

  return cacheSet(cacheKey, { botId: bot.id, tenantUserId: user.id });
}
