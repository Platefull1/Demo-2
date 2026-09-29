/**
 * Sugestão de fator de conversão a partir da descrição da NF.
 * Nunca aplicar sem confirmação — só pré-preenche a revisão.
 *
 * Padrões reais observados:
 * - "SAL ... PCT 30X1KG"              → 30 × 1 = 30 kg
 * - "MILHO ... 6X1,500KG"             → 6 × 1,5 = 9 kg
 * - "CARNE ... 6X1KG"                 → 6 kg
 * - "LOMBO ... PCT 25X1KG - 1 CX COM 10" → 25 kg + FATOR_AMBIGUO
 * - "PEPERONI ... PCT 500G - 1 CX COM 6" → 0,5 kg (PCT) / 3 kg (CX)
 * - "MOLHO ... BAG 3,1KG - 6 CXS E 0 UND" → 3,1 kg (ignora sufixo se und ≠ CX)
 * - "LINGUICA ... PCT 3 Kg" / "BALDE 14,5 KG" → peso simples
 */

export type FatorSugeridoOrigem = 'DESCRICAO' | 'ESTOQUE_KG_POR_UNIDADE';

export interface FatorSugerido {
  fator: number;
  origem: FatorSugeridoOrigem;
  detalhe: string;
  /** true quando há mais de uma interpretação plausível */
  ambiguo?: boolean;
  alertas?: string[];
}

function parseDecimalBr(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function toKg(valor: number, unidade: string): number {
  const u = unidade.toLowerCase();
  if (u === 'kg' || u === 'kgs') return valor;
  // g / gr / gramas
  return valor / 1000;
}

/** Separar corpo e sufixo de anotação do fornecedor (" - 1 CX COM 10"). */
export function separarSufixoFornecedor(descricao: string): {
  corpo: string;
  sufixo: string | null;
} {
  const text = String(descricao || '');
  const m = text.match(/\s+[-–—]\s+(.+)$/);
  if (!m) return { corpo: text, sufixo: null };
  const sufixo = m[1].trim();
  // Só trata como anotação se parecer CX / UND / CXS
  if (!/\b(cx|cxs|und|unid|un)\b/i.test(sufixo)) {
    return { corpo: text, sufixo: null };
  }
  return { corpo: text.slice(0, m.index).trim(), sufixo };
}

/**
 * Extrai "N CX COM M" / "N CXS E 0 UND" do sufixo.
 * Retorna multiplicador de caixas (N) se encontrado.
 */
export function extrairMultiplicadorCxDoSufixo(sufixo: string): number | null {
  const m =
    sufixo.match(/(\d+)\s*cxs?\b/i) ||
    sufixo.match(/(\d+)\s*cx\s*com\s*(\d+)/i);
  if (!m) return null;
  // "1 CX COM 10" → preferir o COM N (conteúdo) quando unidade for CX?
  // Regra: se "CX COM N", N é unidades por caixa; se só "N CXS", N é qtd de caixas.
  const com = sufixo.match(/(\d+)\s*cxs?\s*com\s*(\d+)/i);
  if (com) {
    const porCx = Number(com[2]);
    return Number.isFinite(porCx) && porCx > 0 ? porCx : null;
  }
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export interface PadraoNxP {
  n: number;
  pesoUnitKg: number;
  totalKg: number;
  raw: string;
}

/**
 * Padrão NxP: 30X1KG, 6X1,500KG, 25X1KG, 6X1KG
 */
export function extrairPadraoNxP(texto: string): PadraoNxP | null {
  const re =
    /(\d+)\s*[xX×]\s*(\d+(?:[.,]\d+)?)\s*(kg|kgs|g|gr|gramas)\b/gi;
  let match: RegExpExecArray | null;
  let last: PadraoNxP | null = null;
  while ((match = re.exec(texto)) !== null) {
    const n = Number(match[1]);
    const peso = parseDecimalBr(match[2]);
    if (!Number.isFinite(n) || n <= 0 || peso === null) continue;
    const pesoUnitKg = toKg(peso, match[3]);
    last = {
      n,
      pesoUnitKg,
      totalKg: Math.round(n * pesoUnitKg * 10000) / 10000,
      raw: match[0],
    };
  }
  return last;
}

/**
 * Peso simples (sem NxP): "3 Kg", "14,5 KG", "500G", "3,1KG"
 * Prefere o último match no texto.
 */
export function extrairPesoKgDaDescricao(descricao: string): number | null {
  // Evitar capturar o "1" de "30X1KG" como peso solto — rodar só fora de NxP
  // Estratégia: remover trechos NxP e então buscar peso.
  const semNxP = String(descricao || '').replace(
    /(\d+)\s*[xX×]\s*(\d+(?:[.,]\d+)?)\s*(kg|kgs|g|gr|gramas)\b/gi,
    ' ',
  );
  const re = /(\d+(?:[.,]\d+)?)\s*(kg|kgs|g|gr|gramas)\b/gi;
  let match: RegExpExecArray | null;
  let last: { valor: number; unidade: string } | null = null;
  while ((match = re.exec(semNxP)) !== null) {
    const valor = parseDecimalBr(match[1]);
    if (valor === null) continue;
    last = { valor, unidade: match[2].toLowerCase() };
  }
  if (!last) return null;
  return toKg(last.valor, last.unidade);
}

/**
 * Multipack em unidades (bebidas): 6U, 6 Pack, C/6, CX C/12
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

export interface SugerirFatorOpts {
  secao?: 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA' | null;
  /** Unidade comercial normalizada da NF (UN, CX, PCT, BAG…) */
  unidadeComercial?: string | null;
}

/**
 * Sugere fator em unidades de CMV (KG para matéria-prima; UN para pack de bebida).
 */
export function sugerirFatorDaDescricao(
  descricao: string,
  opts?: SugerirFatorOpts,
): FatorSugerido | null {
  const und = (opts?.unidadeComercial || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const { corpo, sufixo } = separarSufixoFornecedor(descricao);

  const nxP = extrairPadraoNxP(corpo);
  const pesoSimples = extrairPesoKgDaDescricao(corpo);
  const cxMult = sufixo ? extrairMultiplicadorCxDoSufixo(sufixo) : null;
  const undEhCx = und === 'CX' || und === 'CXA' || und === 'CXS';

  // Interpretações candidatas (kg)
  const candidatos: Array<{ fator: number; detalhe: string }> = [];

  if (nxP) {
    candidatos.push({
      fator: nxP.totalKg,
      detalhe: `NxP ${nxP.raw} → ${nxP.n}×${nxP.pesoUnitKg} = ${nxP.totalKg} KG`,
    });
  } else if (pesoSimples !== null) {
    candidatos.push({
      fator: pesoSimples,
      detalhe: `peso na descrição → ${pesoSimples} KG`,
    });
  }

  // Sufixo CX: só entra se unidade comercial for CX
  if (undEhCx && cxMult != null) {
    const base =
      nxP?.totalKg ??
      (pesoSimples !== null ? pesoSimples : null);
    if (base != null) {
      const total = Math.round(base * cxMult * 10000) / 10000;
      candidatos.push({
        fator: total,
        detalhe: `unidade CX × sufixo (${cxMult}) → ${base}×${cxMult} = ${total} KG`,
      });
    } else if (cxMult > 1) {
      candidatos.push({
        fator: cxMult,
        detalhe: `sufixo CX COM ${cxMult} (sem peso base)`,
      });
    }
  }

  // Ambiguidade: há sufixo CX relevante mas unidade NÃO é CX → marcar ambíguo
  // (ex.: PCT 25X1KG - 1 CX COM 10) — usamos NxP/peso, mas alertamos
  const sufixoRelevante = Boolean(sufixo && cxMult != null);
  const ambiguoPorSufixo = sufixoRelevante && !undEhCx && candidatos.length >= 1;
  // Ou duas interpretações numéricas diferentes
  const fatoresUnicos = [...new Set(candidatos.map((c) => c.fator))];
  const ambiguoPorMultiplos = fatoresUnicos.length > 1;

  if (candidatos.length > 0) {
    // Preferência: se und=CX e existe interpretação CX, usa ela; senão a primeira (NxP/peso)
    let escolhido = candidatos[0];
    if (undEhCx) {
      const cxCand = candidatos.find((c) => /unidade CX/i.test(c.detalhe));
      if (cxCand) escolhido = cxCand;
    }

    const ambiguo = ambiguoPorSufixo || ambiguoPorMultiplos;
    return {
      fator: escolhido.fator,
      origem: 'DESCRICAO',
      detalhe: escolhido.detalhe,
      ambiguo,
      alertas: ambiguo ? ['FATOR_AMBIGUO'] : undefined,
    };
  }

  // Bebidas / multipack em UN
  const pack = extrairMultipackDaDescricao(corpo);
  if (pack !== null && (opts?.secao === 'BEBIDA' || opts?.secao == null)) {
    return {
      fator: pack,
      origem: 'DESCRICAO',
      detalhe: `multipack na descrição → ${pack} UN`,
    };
  }

  return null;
}
