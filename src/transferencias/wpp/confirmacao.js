/** Confirmação estrita de sim/não. */

const SIM = /^(sim+|s+|ok+|okay|confirmo|confirmado|confirmada|recebi|recebido|pode|isso|certo|blz|beleza|fechado|manda|pode mandar)[\s!.]*$/i;
const NAO = /^(n[aã]o+|cancelar|cancela|desistir|desisto)[\s!.]*$/i;

export function isConfirmacaoEstrita(texto) {
  const t = String(texto || '').trim();
  if (!t || t.length > 40) return false;
  return SIM.test(t);
}

export function isNegacaoEstrita(texto) {
  const t = String(texto || '').trim();
  if (!t || t.length > 40) return false;
  return NAO.test(t);
}

/** Extrai #T12 ou T12 da mensagem. */
export function extrairCodigo(texto) {
  const m = String(texto || '').match(/#?\s*(T\d+)\b/i);
  return m ? m[1].toUpperCase() : null;
}
