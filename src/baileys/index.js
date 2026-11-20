/**
 * Módulo Baileys (paralelo ao WPPConnect).
 */
export {
  startClient,
  sendMessage,
  startTyping,
  stopTyping,
  onMessage,
  getQr,
  getSessionStatus,
  getBaileysSession,
  baileysAuthDir,
  listGroups,
  checkNumberStatus,
  normalizeBrPhoneDigits,
  isAlreadyWhatsAppJid,
  phoneLookupVariants,
  passthroughJid,
  digitsToLegacyJid,
  resolveDestinationWithCheck,
  clearJidResolveCache,
  CACHE_TTL_POSITIVE_MS,
  CACHE_TTL_NEGATIVE_MS,
  pickExistingOnWhatsAppResult,
  simulateIncoming,
  BAILEYS_TEST_USER_ID,
  BAILEYS_TEST_SLOT,
} from './adapter.js';

export {
  normalizeBaileysMessage,
  messageArchiveExpectedFields,
} from './normalizeMessage.js';

export { createBaileysWppClient } from './wppClientShim.js';
export { setupBaileysMessagePipeline } from './messagePipeline.js';
