/**
 * Envio com resolução de JID (variantes do 9º dígito) — espelho do scheduler de tarefas.
 */

import logger from '../../utils/logger.js';

/**
 * @param {object} client — shim Baileys com checkNumberStatus + sendText
 * @param {string|null|undefined} telefone
 * @returns {Promise<string|null>}
 */
export async function resolverDestino(client, telefone) {
  if (!telefone) return null;
  const raw = String(telefone).replace(/\D/g, '');
  if (!raw) return null;

  let digits;
  if (raw.length === 10 || raw.length === 11) {
    digits = `55${raw}`;
  } else if ((raw.length === 12 || raw.length === 13) && raw.startsWith('55')) {
    digits = raw;
  } else {
    return null;
  }

  try {
    const result = await client.checkNumberStatus(`${digits}@c.us`);
    if ((result?.numberExists || result?.canReceiveMessage) && result?.id?._serialized) {
      return result.id._serialized;
    }
  } catch {
    /* fallback */
  }

  if (digits.length === 13 && digits.startsWith('55') && digits[4] === '9') {
    const semNono = digits.slice(0, 4) + digits.slice(5);
    try {
      const result = await client.checkNumberStatus(`${semNono}@c.us`);
      if ((result?.numberExists || result?.canReceiveMessage) && result?.id?._serialized) {
        return result.id._serialized;
      }
    } catch {
      /* ignore */
    }
  }

  return null;
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
