/**
 * Sugestão de fator de conversão a partir da descrição + quantidade da NF.
 * Nunca aplicar sem confirmação — só pré-preenche a revisão.
 *
 * Padrão real: QUANTIDADE conta unidades internas (garrafa/pct/lata);
 * o sufixo confirma. Unidade comercial (KG, TON…) é ignorada nesses casos.
 *
 * 1) Extrair N (internas/caixa), P (peso/vol da interna), sufixo (caixas/internas)
 * 2) qtd == internas → fator = P (sem alerta)
 * 3) qtd == caixas → fator = N×P (sem alerta)
 * 4) sem sufixo / não bate → FATOR_AMBIGUO (comportamento legado)
 * 5) Bebidas: "(6)", 6 Pack, LT12, C/6 → fator multipack
 */

export type FatorSugeridoOrigem =
  | 'DESCRICAO'
  | 'ESTOQUE_KG_POR_UNIDADE'
  | 'MAPEAMENTO';

export interface FatorSugerido {
  fator: number;
  origem: FatorSugeridoOrigem;
  detalhe: string;
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
  return valor / 1000;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function almostEq(a: number, b: number, tol = 0.01): boolean {
  return Math.abs(a - b) <= tol;
}

/** Separar corpo e sufixo (" - 1 CX COM 10"). */
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

export interface SufixoCx {
  /** Número de caixas (c) */
  caixas: number;
  /** Unidades internas declaradas no "COM k", se houver */
  comInternas: number | null;
  /** UND extras em "c CXS E u UND" */
  undExtras: number;
  raw: string;
}

/** Parseia "1 CX COM 20", "2 CXS E 0 UND", "5 CXS E 0 UND". */
export function parseSufixoCx(sufixo: string): SufixoCx | null {
  const text = sufixo.trim();
  const com = text.match(/^(\d+)\s*cxs?\s*com\s*(\d+)\b/i);
  if (com) {
    return {
      caixas: Number(com[1]),
      comInternas: Number(com[2]),
      undExtras: 0,
      raw: text,
    };
  }
  const cxs = text.match(/^(\d+)\s*cxs?\s*(?:e\s*(\d+)\s*(?:und|unid|un)\b)?/i);
  if (cxs) {
    return {
      caixas: Number(cxs[1]),
      comInternas: null,
      undExtras: cxs[2] != null ? Number(cxs[2]) : 0,
      raw: text,
    };
  }
  return null;
}

/** @deprecated use parseSufixoCx */
export function extrairMultiplicadorCxDoSufixo(sufixo: string): number | null {
  const p = parseSufixoCx(sufixo);
  if (!p) return null;
  return p.comInternas ?? p.caixas;
}

export interface PadraoNxP {
  n: number;
  unidadePack: 'kg' | 'g' | 'ml' | 'l';
  pesoUnitKg: number | null;
  volumeUnitMl: number | null;
  raw: string;
}

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
      last = {
        n,
        unidadePack: u.startsWith('k') ? 'kg' : 'g',
        pesoUnitKg: toKg(valor, u),
        volumeUnitMl: null,
        raw: match[0],
      };
    }
  }
  return last;
}

export function descricaoTemPack(descricao: string): boolean {
  const text = String(descricao || '');
  if (extrairPadraoNxP(text)) return true;
  if (/\b\d+\s*cxs?\b/i.test(text)) return true;
  if (/\b\d+\s*[xX×]\s*\d+/i.test(text)) return true;
  if (/\(\s*\d+\s*\)/.test(text)) return true;
  const { sufixo } = separarSufixoFornecedor(text);
  if (sufixo && parseSufixoCx(sufixo)) return true;
  return false;
}

export function extrairPesoKgDaDescricao(descricao: string): number | null {
  const semNxP = String(descricao || '').replace(
    /(\d+)\s*[xX×]\s*(\d+(?:[.,]\d+)?)\s*(kg|kgs|g|gr|gramas|ml|l)\b/gi,
    ' ',
  );
  // PCT 5KG / BAG 3,1KG — peso da unidade interna
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
 * Multipack bebidas: (6), 6 Pack, C/6, LT12, 6U
 */
export function extrairMultipackDaDescricao(descricao: string): number | null {
  const text = String(descricao || '');
  const patterns = [
    /\(\s*(\d+)\s*\)/, // (6)
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

/** N solto: C/N no corpo, ou (N) já coberto no multipack. */
function extrairNAlternativo(corpo: string): number | null {
  const cBarra = corpo.match(/\bc\s*\/\s*(\d+)\b/i);
  if (cBarra) {
    const n = Number(cBarra[1]);
    if (n > 1 && n <= 100) return n;
  }
  const paren = corpo.match(/\(\s*(\d+)\s*\)/);
  if (paren) {
    const n = Number(paren[1]);
    if (n > 1 && n <= 100) return n;
  }
  return null;
}

export interface PackExtraido {
  /** Unidades internas por caixa */
  n: number | null;
  /** Peso/volume da unidade interna em KG (CMV) */
  p: number | null;
  detalheN: string;
  detalheP: string;
}

/**
 * Extrai N e P do corpo da descrição.
 */
export function extrairPackNP(
  corpo: string,
  kgPorUnidade?: number | null,
): PackExtraido {
  const nxP = extrairPadraoNxP(corpo);
  let n: number | null = null;
  let p: number | null = null;
  let detalheN = '';
  let detalheP = '';

  if (nxP) {
    n = nxP.n;
    detalheN = `N=${n} (${nxP.raw})`;
    if (nxP.pesoUnitKg != null) {
      p = nxP.pesoUnitKg;
      detalheP = `P=${p} KG`;
    } else if (nxP.volumeUnitMl != null) {
      if (kgPorUnidade != null && kgPorUnidade > 0) {
        p = kgPorUnidade;
        detalheP = `P=${p} kgPorUnidade`;
      } else {
        p = round4(nxP.volumeUnitMl / 1000);
        detalheP = `P≈${p} KG (ml/1000)`;
      }
    }
  }

  if (p == null) {
    const peso = extrairPesoKgDaDescricao(corpo);
    if (peso != null) {
      p = peso;
      detalheP = `P=${p} KG (peso na descrição)`;
    }
  }

  if (n == null) {
    const alt = extrairNAlternativo(corpo);
    if (alt != null) {
      n = alt;
      detalheN = `N=${n} (C/N ou parênteses)`;
    }
  }

  return { n, p, detalheN, detalheP };
}

/**
 * Internas esperadas a partir do sufixo + N.
 * - "1 CX COM k" → k
 * - "c CXS E u UND" → c×N + u (se N conhecido); senão null (qtd≠c implica internas)
 */
export function internasEsperadas(
  suf: SufixoCx,
  n: number | null,
): { internas: number | null; caixas: number; modo: 'com' | 'cxs' | 'cxs_sem_n' } {
  if (suf.comInternas != null) {
    return { internas: suf.comInternas, caixas: suf.caixas, modo: 'com' };
  }
  if (n != null) {
    return {
      internas: suf.caixas * n + suf.undExtras,
      caixas: suf.caixas,
      modo: 'cxs',
    };
  }
  return { internas: null, caixas: suf.caixas, modo: 'cxs_sem_n' };
}

export interface SugerirFatorOpts {
  secao?: 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA' | null;
  unidadeComercial?: string | null;
  kgPorUnidade?: number | null;
  quantidadeNota?: number | null;
  /** Valor líquido do item (R$) — para FATOR_SUSPEITO */
  valorLiquido?: number | null;
}

/**
 * Sugere fator. Unidade comercial é IGNORADA quando o padrão qtd↔sufixo confirma.
 */
export function sugerirFatorDaDescricao(
  descricao: string,
  opts?: SugerirFatorOpts,
): FatorSugerido | null {
  const und = (opts?.unidadeComercial || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const qtd = opts?.quantidadeNota;
  const { corpo, sufixo } = separarSufixoFornecedor(descricao);
  const qtdInfo =
    qtd != null && Number.isFinite(qtd) ? ` | qtd nota: ${qtd}` : '';

  // ── Bebidas: multipack ───────────────────────────────────────────────────
  if (opts?.secao === 'BEBIDA') {
    const packBebida = extrairMultipackDaDescricao(corpo);
    if (packBebida != null) {
      return anexarSanidade(
        {
          fator: packBebida,
          origem: 'DESCRICAO',
          detalhe: `multipack → ${packBebida} UN${qtdInfo}`,
        },
        opts,
      );
    }
  }
  // "(6)" em refrigerante mesmo sem secao ainda
  {
    const paren = corpo.match(/\(\s*(\d+)\s*\)/);
    if (paren && /\b(coca|pepsi|guarana|refriger|sprite|fanta)\b/i.test(corpo)) {
      const n = Number(paren[1]);
      if (n > 1 && n <= 100) {
        return anexarSanidade(
          {
            fator: n,
            origem: 'DESCRICAO',
            detalhe: `multipack (${n}) → ${n} UN${qtdInfo}`,
          },
          opts,
        );
      }
    }
  }

  const pack = extrairPackNP(corpo, opts?.kgPorUnidade);
  const suf = sufixo ? parseSufixoCx(sufixo) : null;

  // ── Padrão confirmado por quantidade + sufixo ────────────────────────────
  if (suf && pack.p != null && qtd != null && Number.isFinite(qtd) && qtd > 0) {
    // Se "CX COM k" e N ainda null, N = k (unidades por caixa)
    let n = pack.n;
    if (n == null && suf.comInternas != null && suf.caixas === 1) {
      n = suf.comInternas;
    }
    // Também: COM k com caixas>1 → N = k (por caixa)
    if (n == null && suf.comInternas != null) {
      n = suf.comInternas;
    }

    const esp = internasEsperadas(
      suf,
      n ?? (suf.comInternas != null ? suf.comInternas : null),
    );

    // Recalcular internas com N resolvido
    const internas =
      suf.comInternas != null
        ? suf.caixas === 1
          ? suf.comInternas
          : // "2 CX COM 20" raro; preferir caixas*N se N conhecido
            n != null
            ? suf.caixas * n + suf.undExtras
            : suf.comInternas
        : n != null
          ? suf.caixas * n + suf.undExtras
          : null;

    // Regra 2: qtd == internas → fator = P
    if (internas != null && almostEq(qtd, internas)) {
      return anexarSanidade(
        {
          fator: pack.p,
          origem: 'DESCRICAO',
          detalhe: `qtd=${qtd} = internas → fator=P=${pack.p} KG (${pack.detalheP}; ${suf.raw})${qtdInfo}`,
        },
        opts,
      );
    }

    // Regra 2b: N desconhecido + "c CXS" + qtd ≠ c → tratar qtd como internas → P
    if (internas == null && !almostEq(qtd, suf.caixas)) {
      return anexarSanidade(
        {
          fator: pack.p,
          origem: 'DESCRICAO',
          detalhe: `qtd=${qtd} ≠ caixas(${suf.caixas}) → fator=P=${pack.p} KG (${suf.raw})${qtdInfo}`,
        },
        opts,
      );
    }

    // Regra 3: qtd == caixas → fator = N×P
    if (n != null && almostEq(qtd, suf.caixas)) {
      const fator = round4(n * pack.p);
      return anexarSanidade(
        {
          fator,
          origem: 'DESCRICAO',
          detalhe: `qtd=${qtd} = caixas → fator=N×P=${n}×${pack.p}=${fator} KG (${suf.raw})${qtdInfo}`,
        },
        opts,
      );
    }
  }

  // ── Sem confirmação por qtd: legado + FATOR_AMBIGUO ───────────────────────
  // Unidade KG sem sufixo confirmado: qtd já em kg → fator 1
  if (und === 'KG') {
    const temPack = descricaoTemPack(descricao);
    return anexarSanidade(
      {
        fator: 1,
        origem: 'DESCRICAO',
        detalhe: temPack
          ? `unidade KG → fator 1 (pack sem confirmação por qtd)${qtdInfo}`
          : `unidade KG → fator 1${qtdInfo}`,
        ambiguo: temPack || Boolean(suf),
        alertas: temPack || suf ? ['FATOR_AMBIGUO'] : undefined,
      },
      opts,
    );
  }

  // Sem sufixo: NxP → N×P (interpretação clássica)
  if (!suf && pack.n != null && pack.p != null) {
    const fator = round4(pack.n * pack.p);
    return anexarSanidade(
      {
        fator,
        origem: 'DESCRICAO',
        detalhe: `NxP sem sufixo → N×P=${pack.n}×${pack.p}=${fator} KG${qtdInfo}`,
        ambiguo: true,
        alertas: ['FATOR_AMBIGUO'],
      },
      opts,
    );
  }

  // Com sufixo mas qtd não confirmou → P (menos risco de inflar) + ambiguo
  if (pack.p != null && pack.n != null) {
    const alt = round4(pack.n * pack.p);
    return anexarSanidade(
      {
        fator: pack.p,
        origem: 'DESCRICAO',
        detalhe: `pack ${pack.detalheN}, ${pack.detalheP}; qtd não confirmou (alt N×P=${alt}) → P=${pack.p}${qtdInfo}`,
        ambiguo: true,
        alertas: ['FATOR_AMBIGUO'],
      },
      opts,
    );
  }

  if (pack.p != null) {
    return anexarSanidade(
      {
        fator: pack.p,
        origem: 'DESCRICAO',
        detalhe: `${pack.detalheP} (sem N/sufixo confirmado)${qtdInfo}`,
        ambiguo: true,
        alertas: ['FATOR_AMBIGUO'],
      },
      opts,
    );
  }

  // Multipack genérico (não bebida explícita)
  const packGen = extrairMultipackDaDescricao(corpo);
  if (packGen != null) {
    return anexarSanidade(
      {
        fator: packGen,
        origem: 'DESCRICAO',
        detalhe: `multipack → ${packGen} UN${qtdInfo}`,
        ambiguo: und !== 'UN' && und !== '',
        alertas: und !== 'UN' && und !== '' ? ['FATOR_AMBIGUO'] : undefined,
      },
      opts,
    );
  }

  return null;
}

/** Faixa absurda de custo/kg para matéria-prima. */
const CUSTO_KG_MIN = 0.5;
const CUSTO_KG_MAX = 500;

function anexarSanidade(
  result: FatorSugerido,
  opts?: SugerirFatorOpts,
): FatorSugerido {
  if (opts?.secao === 'BEBIDA' || opts?.secao === 'EMBALAGEM') return result;
  const valor = opts?.valorLiquido;
  const qtd = opts?.quantidadeNota;
  if (
    valor == null ||
    qtd == null ||
    !Number.isFinite(valor) ||
    !Number.isFinite(qtd) ||
    qtd <= 0 ||
    result.fator <= 0
  ) {
    return result;
  }
  const qtdConvertida = qtd * result.fator;
  if (qtdConvertida <= 0) return result;
  const custo = valor / qtdConvertida;
  if (custo < CUSTO_KG_MIN || custo > CUSTO_KG_MAX) {
    const alertas = [...(result.alertas ?? [])];
    if (!alertas.includes('FATOR_SUSPEITO')) alertas.push('FATOR_SUSPEITO');
    return {
      ...result,
      alertas,
      detalhe: `${result.detalhe} | custo≈R$${custo.toFixed(2)}/kg (suspeito)`,
    };
  }
  return result;
}
