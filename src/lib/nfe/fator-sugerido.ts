/**
 * Sugestão de fator de conversão a partir da descrição da NF.
 * Nunca aplicar sem confirmação — só pré-preenche a revisão.
 */

export type FatorSugeridoOrigem = 'DESCRICAO' | 'ESTOQUE_KG_POR_UNIDADE';

export interface FatorSugerido {
  fator: number;
  origem: FatorSugeridoOrigem;
  detalhe: string;
}

function parseDecimalBr(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Extrai o último padrão número + unidade de peso (kg/g) da descrição.
 * Ex.: "REQUEIJAO CREMOSO SOFFICE 1,535 kg" → 1.535
 * Ex.: "500g", "500 G", "1.5KG", "5kg"
 */
export function extrairPesoKgDaDescricao(descricao: string): number | null {
  const text = String(descricao || '');
  const re = /(\d+(?:[.,]\d+)?)\s*(kg|kgs|g|gr|gramas)\b/gi;
  let match: RegExpExecArray | null;
  let last: { valor: number; unidade: string } | null = null;
  while ((match = re.exec(text)) !== null) {
    const valor = parseDecimalBr(match[1]);
    if (valor === null) continue;
    last = { valor, unidade: match[2].toLowerCase() };
  }
  if (!last) return null;
  if (last.unidade === 'kg' || last.unidade === 'kgs') return last.valor;
  // gramas → kg
  return last.valor / 1000;
}

/**
 * Multipack: 6U, 6 Pack, C/6, CX C/12 → fator em unidades.
 * Ex.: "CC Pet 600ml 6 Pack FL" → 6
 */
export function extrairMultipackDaDescricao(descricao: string): number | null {
  const text = String(descricao || '');
  const patterns = [
    /(\d+)\s*pack\b/i,
    /\bc\s*\/\s*(\d+)\b/i,
    /\bcx\s*c\s*\/\s*(\d+)\b/i,
    /\b(\d+)\s*u(?:n(?:id)?)?\b/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const n = Number(m[1]);
      if (Number.isFinite(n) && n > 1 && n <= 100) return n;
    }
  }
  return null;
}

/**
 * Sugere fator: peso em KG na descrição, ou multipack para bebidas/UN.
 */
export function sugerirFatorDaDescricao(
  descricao: string,
  opts?: { secao?: 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA' | null },
): FatorSugerido | null {
  const peso = extrairPesoKgDaDescricao(descricao);
  if (peso !== null) {
    return {
      fator: peso,
      origem: 'DESCRICAO',
      detalhe: `peso na descrição → ${peso} KG`,
    };
  }

  const pack = extrairMultipackDaDescricao(descricao);
  if (pack !== null && (opts?.secao === 'BEBIDA' || opts?.secao == null)) {
    return {
      fator: pack,
      origem: 'DESCRICAO',
      detalhe: `multipack na descrição → ${pack} UN`,
    };
  }

  return null;
}
