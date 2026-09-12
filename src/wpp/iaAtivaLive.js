/**
 * Fonte de verdade da IA = WhatsAppBot.iaAtiva no banco (toggle na plataforma).
 * Sincroniza a memória do worker para o gate cedo não ficar preso no --mode do start.
 */

import { WhatsAppBotModel } from '../db/models.js';
import sessionManager from './sessionManager.js';
import logger from '../utils/logger.js';

const CACHE_MS = 3000;
/** @type {Map<string, { on: boolean, at: number }>} */
const cache = new Map();

function cacheKey(userId, slot) {
  return `${String(userId).trim()}:${Number(slot)}`;
}

export function invalidateIaAtivaCache(userId, slot) {
  cache.delete(cacheKey(userId, slot));
}

/**
 * @param {string} userId
 * @param {number} slot
 * @param {boolean} iaAtiva
 */
export function applyIaAtivaInMemory(userId, slot, iaAtiva) {
  const on = iaAtiva === true;
  sessionManager.setIaAtiva(userId, slot, on);
  cache.set(cacheKey(userId, slot), { on, at: Date.now() });
  return on;
}

/**
 * Lê iaAtiva do banco (cache curto), alinha a memória e devolve se a IA deve atender.
 * @param {string} userId
 * @param {number} slot
 * @returns {Promise<boolean>}
 */
export async function isIaAtivaLive(userId, slot) {
  const key = cacheKey(userId, slot);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return cached.on;
  }

  let on = false;
  try {
    const durable = await WhatsAppBotModel.getDurableConfig(userId, slot);
    on = durable?.iaAtiva === true;
  } catch (err) {
    logger.warn(
      `[iaAtivaLive] falha ao ler banco [${key}] — usando memória: ${err?.message || err}`,
    );
    return sessionManager.getIaAtiva(userId, slot);
  }

  const mem = sessionManager.getIaAtiva(userId, slot);
  if (mem !== on) {
    sessionManager.setIaAtiva(userId, slot, on);
    logger.info(`[iaAtivaLive] sync ${key}: memória ${mem} → banco ${on}`);
  }

  cache.set(key, { on, at: Date.now() });
  return on;
}
