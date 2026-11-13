/**
 * Registro CMV via API Plateful (mesmo auth do módulo de tarefas).
 */

const BASE_URL = (process.env.PLATEFUL_API_URL || '').replace(/\/$/, '');
const API_KEY = process.env.BOT_API_KEY || '';

async function fetchComRetry(url, options = {}, tentativas = 3) {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let i = 0; i < tentativas; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
          ...(options.headers || {}),
        },
      });
      if (!res.ok) {
        const corpo = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${corpo}`);
      }
      return res.json();
    } catch (err) {
      if (i === tentativas - 1) throw err;
      await delay(500 * 2 ** i);
    }
  }
}

/**
 * @param {'completa'|'divergente'} acao
 * @param {object} body
 */
export function postCmvTransferencia(acao, body) {
  if (!BASE_URL) throw new Error('PLATEFUL_API_URL não configurada');
  return fetchComRetry(`${BASE_URL}/api/bot/transferencias/cmv`, {
    method: 'POST',
    body: JSON.stringify({ acao, ...body }),
  });
}
