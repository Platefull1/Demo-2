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

export function apiConfirmarOrigem(sessaoId, body) {
  return fetchComRetry(
    `${BASE_URL}/api/bot/transferencias/sessoes/${sessaoId}/confirmar-origem`,
    { method: 'POST', body: JSON.stringify(body) },
  );
}

export function apiConfirmarRecebimento(sessaoId, body) {
  return fetchComRetry(
    `${BASE_URL}/api/bot/transferencias/sessoes/${sessaoId}/confirmar-recebimento`,
    { method: 'POST', body: JSON.stringify(body) },
  );
}

export function apiCancelarSessao(sessaoId, body = {}) {
  return fetchComRetry(
    `${BASE_URL}/api/bot/transferencias/sessoes/${sessaoId}/cancelar`,
    { method: 'POST', body: JSON.stringify(body) },
  );
}
