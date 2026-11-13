/**
 * Feature flags do fluxo WhatsApp de transferências.
 *
 * TRANSFERENCIAS_WPP_ENABLED=true|1|yes
 * TRANSFERENCIAS_WPP_ALLOWLIST=41999999999,41888888888  (canônicos; vazio = todos gerentes)
 */

import { canonicalizarTelefone } from './telefone.js';

export function transferenciasWppEnabled() {
  const v = String(process.env.TRANSFERENCIAS_WPP_ENABLED || '')
    .trim()
    .toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

/** @returns {string[]|null} null = sem allowlist (todos gerentes); [] = ninguém */
export function transferenciasWppAllowlist() {
  const raw = String(process.env.TRANSFERENCIAS_WPP_ALLOWLIST || '').trim();
  if (!raw) return null;
  return raw
    .split(/[,;\s]+/)
    .map((p) => canonicalizarTelefone(p))
    .filter(Boolean);
}

/**
 * @param {string|null|undefined} telefone
 * @returns {boolean}
 */
export function telefoneNaAllowlist(telefone) {
  const list = transferenciasWppAllowlist();
  if (list === null) return true;
  if (!list.length) return false;
  const canon = canonicalizarTelefone(telefone);
  if (!canon) return false;
  return list.includes(canon);
}
