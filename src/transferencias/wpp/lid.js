/**
 * Resolução LID → PN via Baileys signalRepository.lidMapping.
 */

import { getBaileysSession } from '../../baileys/adapter.js';
import logger from '../../utils/logger.js';
import prisma from '../../db/index.js';
import { canonicalizarTelefone } from './telefone.js';

/**
 * @param {string} userId — stack user do worker
 * @param {number} slot
 * @param {string} lidDigits — só dígitos, sem @lid
 * @returns {Promise<string|null>} telefone (dígitos do PN) ou null
 */
export async function resolverPnDeLid(userId, slot, lidDigits) {
  if (!lidDigits) return null;
  const lidJid = String(lidDigits).includes('@')
    ? String(lidDigits)
    : `${String(lidDigits).replace(/\D/g, '')}@lid`;

  try {
    const session = getBaileysSession(userId, slot);
    const mapping = session?.sock?.signalRepository?.lidMapping;
    if (!mapping || typeof mapping.getPNForLID !== 'function') {
      logger.warn(`[transf/lid] lidMapping indisponível [${userId}:${slot}]`);
      return null;
    }
    const pn = await mapping.getPNForLID(lidJid);
    if (!pn) return null;
    const digits = String(pn).split('@')[0].replace(/\D/g, '');
    return digits || null;
  } catch (err) {
    logger.warn(`[transf/lid] getPNForLID falhou: ${err?.message}`);
    return null;
  }
}

/**
 * Persiste whatsappLid no RhFuncionario quando temos LID + telefone.
 * @param {string} tenantUserId
 * @param {string} telefone
 * @param {string} lidDigits
 */
export async function salvarWhatsappLidSeFuncionario(tenantUserId, telefone, lidDigits) {
  if (!tenantUserId || !telefone || !lidDigits) return;
  const canon = canonicalizarTelefone(telefone);
  const lid = String(lidDigits).replace(/\D/g, '');
  if (!canon || !lid) return;

  try {
    const candidatos = await prisma.rhFuncionario.findMany({
      where: {
        userId: tenantUserId,
        ativo: true,
        telefone: { not: null },
      },
      select: { id: true, telefone: true, whatsappLid: true },
    });
    const match = candidatos.find(
      (f) => f.telefone && canonicalizarTelefone(f.telefone) === canon,
    );
    if (!match) return;
    if (match.whatsappLid === lid) return;
    await prisma.rhFuncionario.update({
      where: { id: match.id },
      data: { whatsappLid: lid },
    });
    logger.info(`[transf/lid] whatsappLid=${lid} salvo em funcionario=${match.id}`);
  } catch (err) {
    logger.warn(`[transf/lid] falha ao salvar whatsappLid: ${err?.message}`);
  }
}
