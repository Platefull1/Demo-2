/**
 * Envio com resolução de JID (variantes do 9º dígito) — espelho do scheduler de tarefas.
 */

import logger from '../../utils/logger.js';
import { resolveDestinationWithCheck } from '../../baileys/phoneJid.js';

/**
 * @param {object} client — shim Baileys com checkNumberStatus + sendText
 * @param {string|null|undefined} telefone
 * @returns {Promise<string|null>}
 */
export async function resolverDestino(client, telefone) {
  if (!telefone || typeof client?.checkNumberStatus !== 'function') return null;
  const resolved = await resolveDestinationWithCheck(
    (idOrPhone) => client.checkNumberStatus(idOrPhone),
    telefone,
    { preferBaileys: client.__provider === 'baileys' },
  );
  return resolved.ok ? resolved.jid : null;
}

/**
 * @param {object} client
 * @param {string} telefone
 * @param {string} texto
 * @param {string} [codigo]
 */
export async function enviarParaTelefone(client, telefone, texto, codigo) {
  const dest = await resolverDestino(client, telefone);
  if (!dest) {
    logger.warn(
      `[transf/${codigo || '?'}] destino não resolvido tel=${telefone}`,
    );
    return false;
  }
  await client.sendText(dest, texto);
  logger.info(`[transf/${codigo || '?'}] enviado → ${dest}`);
  return true;
}
