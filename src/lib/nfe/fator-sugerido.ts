/**
 * Sugestão de fator de conversão a partir da descrição da NF.
 * Nunca aplicar sem confirmação — só pré-preenche a revisão.
 *
 * Regras:
 * - Unidade KG → fator 1 (qtd já em kg); pack na descrição → FATOR_AMBIGUO
 * - TON/DP/BIS/CJ… → fator pelo pack, sempre FATOR_AMBIGUO
 * - NxP com KG/G → n×peso; NxP com ML/L → n×kgPorUnidade do Estoque
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

/** Unidades com significado conhecido no CMV. */
const UNIDADES_CONHECIDAS = new Set([
  'KG',
  'G',
  'UN',
  'CX',
  'PCT',
  'BAG',
  'FD',
  'LAT',
  'LATA',
  'PC',
  'UNID',
  'UND',
  'PET',
]);

function parseDecimalBr(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function toKg(valor: number, unidade: string): number {
  const u = unidade.toLowerCase();
  if (u === 'kg' || u === 'kgs') return valor;
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
  if (!/\b(cx|cxs|und|unid|un)\b/i.test(sufixo)) {
    return { corpo: text, sufixo: null };
  }
  return { corpo: text.slice(0, m.index).trim(), sufixo };
}

/**
 * Extrai "N CX COM M" / "N CXS E 0 UND" do sufixo.
 */
export function extrairMultiplicadorCxDoSufixo(sufixo: string): number | null {
  const m =
    sufixo.match(/(\d+)\s*cxs?\b/i) ||
    sufixo.match(/(\d+)\s*cx\s*com\s*(\d+)/i);
  if (!m) return null;
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
  /** Unidade do pack: kg | g | ml | l */
  unidadePack: 'kg' | 'g' | 'ml' | 'l';
  /** Peso unitário em kg quando pack é KG/G; null se ML/L */
  pesoUnitKg: number | null;
  /** Volume unitário em ml quando pack é ML/L; null se KG/G */
  volumeUnitMl: number | null;
  raw: string;
}

/**
 * Padrão NxP: 30X1KG, 6X1,500KG, 20X900ML, 12X500GR
 */
export function extrairPadraoNxP(texto: string): PadraoNxP | null {
  const re =
    /(\d+)\s*[xX×]\s*(\d+(?:[.,]\d+)?)\s*(kg|kgs|g|gr|gramas|ml|l)\b/gi;
  let match: RegExpExecArray | null;
  let last: PadraoNxP | null = null;
  while ((match = re.exec(texto)) !== null) {
    const n = Number(match[1]);
    const valor = parseDecimalBr(match[2]);
    if (!Number.isFinite(n) || n <= 0 || valor === null) continue;
    const u = match[3].toLowerCase();
    if (u === 'ml') {
      last = {
        n,
        unidadePack: 'ml',
        pesoUnitKg: null,
        volumeUnitMl: valor,
        raw: match[0],
      };
    } else if (u === 'l') {
      last = {
        n,
        unidadePack: 'l',
        pesoUnitKg: null,
        volumeUnitMl: valor * 1000,
        raw: match[0],
      };
    } else {
      const pesoUnitKg = toKg(valor, u);
      last = {
        n,
        unidadePack: u.startsWith('k') ? 'kg' : 'g',
        pesoUnitKg,
        volumeUnitMl: null,
        raw: match[0],
      };
    }
  }
  return last;
}

/** Há indício de pack/caixa na descrição (além da qtd já em KG). */
export function descricaoTemPack(descricao: string): boolean {
  const text = String(descricao || '');
  if (extrairPadraoNxP(text)) return true;
  if (/\b\d+\s*cxs?\b/i.test(text)) return true;
  if (/\b\d+\s*[xX×]\s*\d+/i.test(text)) return true;
  const { sufixo } = separarSufixoFornecedor(text);
  if (sufixo && extrairMultiplicadorCxDoSufixo(sufixo) != null) return true;
  return false;
}

/**
 * Peso simples (sem NxP): "3 Kg", "14,5 KG", "500G", "3,1KG"
 */
export function extrairPesoKgDaDescricao(descricao: string): number | null {
  const semNxP = String(descricao || '').replace(
    /(\d+)\s*[xX×]\s*(\d+(?:[.,]\d+)?)\s*(kg|kgs|g|gr|gramas|ml|l)\b/gi,
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
 * Multipack em unidades (bebidas): 6U, 6 Pack, C/6, LT12, 12X
 */
export function extrairMultipackDaDescricao(descricao: string): number | null {
  const text = String(descricao || '');
  const patterns = [
    /\bLT(\d+)\b/i,
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
  /** Unidade comercial normalizada da NF (UN, CX, PCT, BAG, KG, TON…) */
  unidadeComercial?: string | null;
  /** kgPorUnidade do EstoqueProdutoConfig (ex.: óleo 900ml → 0,9) */
  kgPorUnidade?: number | null;
  /** Quantidade da linha na nota (para revisão / detalhe) */
  quantidadeNota?: number | null;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function fatorFromNxP(
  nxP: PadraoNxP,
  kgPorUnidade?: number | null,
): { fator: number; detalhe: string; ambiguo?: boolean } | null {
  if (nxP.pesoUnitKg != null) {
    const total = round4(nxP.n * nxP.pesoUnitKg);
    return {
      fator: total,
      detalhe: `NxP ${nxP.raw} → ${nxP.n}×${nxP.pesoUnitKg} = ${total} KG`,
    };
  }
  // ML/L: usar kgPorUnidade do Estoque
  if (nxP.volumeUnitMl != null) {
    if (kgPorUnidade != null && kgPorUnidade > 0) {
      const total = round4(nxP.n * kgPorUnidade);
      return {
        fator: total,
        detalhe: `NxP ${nxP.raw} → ${nxP.n}×kgPorUnidade(${kgPorUnidade}) = ${total} KG`,
      };
    }
    // fallback ml→kg aproximado
    const approx = round4(nxP.n * (nxP.volumeUnitMl / 1000));
    return {
      fator: approx,
      detalhe: `NxP ${nxP.raw} → ${nxP.n}×${nxP.volumeUnitMl}ml≈${approx} KG (sem kgPorUnidade)`,
      ambiguo: true,
    };
  }
  return null;
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
  const qtdInfo =
    opts?.quantidadeNota != null && Number.isFinite(opts.quantidadeNota)
      ? ` | qtd nota: ${opts.quantidadeNota}`
      : '';

  // ── 1) Unidade KG: quantidade já está em kg ──────────────────────────────
  if (und === 'KG') {
    const pack = descricaoTemPack(descricao);
    return {
      fator: 1,
      origem: 'DESCRICAO',
      detalhe: pack
        ? `unidade KG → fator 1 (qtd já em kg; pack na descrição — conferir)${qtdInfo}`
        : `unidade KG → fator 1 (qtd já em kg)${qtdInfo}`,
      ambiguo: pack,
      alertas: pack ? ['FATOR_AMBIGUO'] : undefined,
    };
  }

  const nxP = extrairPadraoNxP(corpo);
  const pesoSimples = extrairPesoKgDaDescricao(corpo);
  const cxMult = sufixo ? extrairMultiplicadorCxDoSufixo(sufixo) : null;
  const undEhCx = und === 'CX' || und === 'CXA' || und === 'CXS';
  const undDesconhecida = Boolean(und) && !UNIDADES_CONHECIDAS.has(und);

  // ── 2) Unidades não padronizadas (TON, DP, BIS, CJ…) ─────────────────────
  if (undDesconhecida) {
    const fromNxP = nxP ? fatorFromNxP(nxP, opts?.kgPorUnidade) : null;
    if (fromNxP) {
      return {
        fator: fromNxP.fator,
        origem: 'DESCRICAO',
        detalhe: `unidade ${und} (não padronizada) | ${fromNxP.detalhe}${qtdInfo}`,
        ambiguo: true,
        alertas: ['FATOR_AMBIGUO'],
      };
    }
    if (pesoSimples != null) {
      let fator = pesoSimples;
      let detalhe = `unidade ${und} (não padronizada) | peso → ${pesoSimples} KG`;
      if (cxMult != null && cxMult > 1) {
        fator = round4(pesoSimples * cxMult);
        detalhe = `unidade ${und} (não padronizada) | peso×CX(${cxMult}) → ${fator} KG`;
      }
      return {
        fator,
        origem: 'DESCRICAO',
        detalhe: detalhe + qtdInfo,
        ambiguo: true,
        alertas: ['FATOR_AMBIGUO'],
      };
    }
    if (cxMult != null && cxMult > 1) {
      return {
        fator: cxMult,
        origem: 'DESCRICAO',
        detalhe: `unidade ${und} (não padronizada) | sufixo CX → ${cxMult}${qtdInfo}`,
        ambiguo: true,
        alertas: ['FATOR_AMBIGUO'],
      };
    }
    return {
      fator: 1,
      origem: 'DESCRICAO',
      detalhe: `unidade ${und} (não padronizada) — sem pack claro; fator 1${qtdInfo}`,
      ambiguo: true,
      alertas: ['FATOR_AMBIGUO'],
    };
  }

  // ── 3) Fluxo normal (KG/G pack, CX, PCT…) ────────────────────────────────
  const candidatos: Array<{ fator: number; detalhe: string; ambiguo?: boolean }> =
    [];

  if (nxP) {
    const fromNxP = fatorFromNxP(nxP, opts?.kgPorUnidade);
    if (fromNxP) candidatos.push(fromNxP);
  } else if (pesoSimples !== null) {
    candidatos.push({
      fator: pesoSimples,
      detalhe: `peso na descrição → ${pesoSimples} KG`,
    });
  }

  if (undEhCx && cxMult != null) {
    const baseNxP = nxP ? fatorFromNxP(nxP, opts?.kgPorUnidade) : null;
    const base = baseNxP?.fator ?? (pesoSimples !== null ? pesoSimples : null);
    if (base != null) {
      const total = round4(base * cxMult);
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

  const sufixoRelevante = Boolean(sufixo && cxMult != null);
  const ambiguoPorSufixo = sufixoRelevante && !undEhCx && candidatos.length >= 1;
  const fatoresUnicos = [...new Set(candidatos.map((c) => c.fator))];
  const ambiguoPorMultiplos = fatoresUnicos.length > 1;

  if (candidatos.length > 0) {
    let escolhido = candidatos[0];
    if (undEhCx) {
      const cxCand = candidatos.find((c) => /unidade CX/i.test(c.detalhe));
      if (cxCand) escolhido = cxCand;
    }

    const ambiguo =
      ambiguoPorSufixo || ambiguoPorMultiplos || Boolean(escolhido.ambiguo);
    return {
      fator: escolhido.fator,
      origem: 'DESCRICAO',
      detalhe: escolhido.detalhe + qtdInfo,
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
      detalhe: `multipack na descrição → ${pack} UN${qtdInfo}`,
    };
  }

  return null;
}
