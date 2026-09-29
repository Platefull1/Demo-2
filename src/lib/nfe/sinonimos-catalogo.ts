/**
 * Dicionário editável de sinônimos/abreviações para matching NF-e ↔ catálogo.
 *
 * Formato:
 * - chave → valor canônico (1+ tokens separados por espaço)
 * - chave → null = remover o token (stopword contextual)
 *
 * Aplicado após normalização (maiúsculas, sem acento).
 */

export type SinonimoValor = string | null;

/** Token (já normalizado) → substituição canônica ou remoção */
export const SINONIMOS_CATALOGO: Record<string, SinonimoValor> = {
  // Queijos / frios
  MUCARELA: 'MUSSARELA',
  MOZARELA: 'MUSSARELA',
  MOZZARELLA: 'MUSSARELA',
  MUÇARELA: 'MUSSARELA',
  PEPERONI: 'PEPPERONI',
  PEPERONNI: 'PEPPERONI',
  LINGUICA: 'LINGUICA', // já normalizado sem ç
  CALABRESA: 'CALABRESA',

  // Refrigerantes
  CC: 'COCA',
  'COCA-COLA': 'COCA',
  COCACOLA: 'COCA',
  COCA_COLA: 'COCA',

  // Remoções
  CHP: null,

  // Carnes
  PATINHO: 'CARNE ISCA',
  ISCAS: 'ISCA',

  // Volume textual (volume numérico tratado em volumesConflitam)
  LITROS: null,
  LITRO: null,
};

/**
 * Expande/substitui tokens conforme o dicionário.
 * Um valor com espaços vira vários tokens.
 */
export function aplicarSinonimos(tokens: string[]): string[] {
  const out: string[] = [];
  for (const t of tokens) {
    if (Object.prototype.hasOwnProperty.call(SINONIMOS_CATALOGO, t)) {
      const v = SINONIMOS_CATALOGO[t];
      if (v == null) continue;
      for (const p of v.split(/\s+/).filter(Boolean)) out.push(p);
    } else {
      out.push(t);
    }
  }
  return out;
}
