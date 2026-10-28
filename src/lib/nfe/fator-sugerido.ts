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
 * 4) "QTD. X CX/DP" na descrição (fornecedores bagunçados): mesma regra 2/3
 *    — só ativa se o texto tiver esse padrão; notas limpas não mudam
 * 5) sem sufixo / não bate → FATOR_AMBIGUO (comportamento legado)
 * 6) Bebidas: "(6)", 6 Pack, LT12, C/6 → fator multipack
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

/**
 * Fornecedores que colocam caixas na descrição: "… 6X400G QTD. 4.00 CX".
 * Só casa com QTD/QTDE explícito — não afeta notas sem esse texto.
 */
export interface QtdDeclarada {
  quantidade: number;
  unidade: string;
  raw: string;
}

export function extrairQtdDeclaradaNaDescricao(descricao: string): {
  corpo: string;
  qtdDeclarada: QtdDeclarada | null;
} {
  const text = String(descricao || '');
  const re =
    /\bqt(?:d|de)\.?\s*:?\s*(\d+(?:[.,]\d+)?)\s*(cxs?|dp|fd|pct|unid|und|un)\b/i;
  const m = text.match(re);
  if (!m || m.index == null) {
    return { corpo: text, qtdDeclarada: null };
  }
  const quantidade = parseDecimalBr(m[1]);
  if (quantidade == null) {
    return { corpo: text, qtdDeclarada: null };
  }
  let unidade = m[2].toUpperCase();
  if (unidade === 'CXS') unidade = 'CX';
  if (unidade === 'UND' || unidade === 'UNID') unidade = 'UN';

  const corpo = `${text.slice(0, m.index)} ${text.slice(m.index + m[0].length)}`
    .replace(/\s+/g, ' ')
    .trim();

  return {
    corpo,
    qtdDeclarada: { quantidade, unidade, raw: m[0].trim() },
  };
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
  if (extrairCaixaComInternas(text)) return true;
  if (/\b\d+\s*cxs?\b/i.test(text)) return true;
  if (/\b\d+\s*[xX×]\s*\d+/i.test(text)) return true;
  if (/\(\s*\d+\s*\)/.test(text)) return true;
  if (extrairQtdDeclaradaNaDescricao(text).qtdDeclarada) return true;
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

/**
 * "CAIXA 10 BISNAGAS", "CAIXA C/10", "CX COM 10", "CX 10 UN".
 * N = unidades internas por caixa (sem peso).
 */
export function extrairCaixaComInternas(corpo: string): {
  n: number;
  label: string | null;
  raw: string;
} | null {
  const re =
    /\b(?:CAIXA|CXS?)\s+(?:C\s*\/\s*|COM\s+)?(\d+)\s*(BISNAGAS?|BIS|UNIDADES?|UNIDS?|UNDS?|UN|PCT|PE[CÇ]AS?|SACH[EÊ]S?|LATAS?|POTES?)?\b/i;
  const m = String(corpo || '').match(re);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n <= 1 || n > 100) return null;

  let label: string | null = null;
  const rawLabel = (m[2] || '').toLowerCase();
  if (rawLabel.startsWith('bisnaga') || rawLabel === 'bis') label = 'bisnaga';
  else if (rawLabel.startsWith('un')) label = 'unidade';
  else if (rawLabel === 'pct') label = 'pacote';
  else if (rawLabel.startsWith('pe')) label = 'peça';
  else if (rawLabel.startsWith('sach')) label = 'sachê';
  else if (rawLabel.startsWith('lata')) label = 'lata';
  else if (rawLabel.startsWith('pote')) label = 'pote';

  return { n, label, raw: m[0].trim() };
}

/** N solto: CAIXA N…, C/N no corpo, ou (N). */
function extrairNAlternativo(corpo: string): number | null {
  const caixa = extrairCaixaComInternas(corpo);
  if (caixa) return caixa.n;

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
    const caixa = extrairCaixaComInternas(corpo);
    if (caixa) {
      n = caixa.n;
      detalheN = `N=${n} (${caixa.raw})`;
    } else {
      const alt = extrairNAlternativo(corpo);
      if (alt != null) {
        n = alt;
        detalheN = `N=${n} (C/N ou parênteses)`;
      }
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
 * Sugere fator. "CAIXA N BISNAGAS" respeita a uCom (CX → N×P, UN/BIS → P).
 * Nos demais casos, a unidade comercial é ignorada quando qtd↔sufixo confirma.
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

  // ── CAIXA N BISNAGAS: uCom decide N×P (caixa) vs P (uma interna) ────────
  {
    const caixa = extrairCaixaComInternas(corpo);
    const pPack = extrairPackNP(corpo, opts?.kgPorUnidade).p;
    const p =
      opts?.kgPorUnidade != null && opts.kgPorUnidade > 0
        ? opts.kgPorUnidade
        : pPack;
    const isCx = und === 'CX' || und === 'CAIXA' || und === 'FD';
    const isUn = und === 'UN' || und === 'BIS' || und === 'UND';
    if (caixa && p != null && p > 0 && (isCx || isUn)) {
      const fator = isCx ? round4(caixa.n * p) : p;
      return anexarSanidade(
        {
          fator,
          origem: 'DESCRICAO',
          detalhe: isCx
            ? `uCom ${und} + ${caixa.raw} → N×P=${caixa.n}×${p}=${fator} KG${qtdInfo}`
            : `uCom ${und} + ${caixa.raw} → P=${p} KG (uma interna)${qtdInfo}`,
        },
        opts,
      );
    }
  }

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

  const { corpo: corpoSemQtd, qtdDeclarada } = extrairQtdDeclaradaNaDescricao(corpo);
  const pack = extrairPackNP(corpoSemQtd, opts?.kgPorUnidade);
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

    const matchInternas = internas != null && almostEq(qtd, internas);
    const matchCaixas = almostEq(qtd, suf.caixas);

    // Empate c = k = qtd (ex.: "1 CX COM 1", qtd 1): o sufixo declara caixas.
    // Caso real: RECHEIO 8X1,005KG - 1 CX COM 1 → caixa fechada N×P, não 1 pacote.
    if (matchInternas && matchCaixas && n != null) {
      const fator = round4(n * pack.p);
      return anexarSanidade(
        {
          fator,
          origem: 'DESCRICAO',
          detalhe: `qtd=${qtd} empate c=k → caixa N×P=${n}×${pack.p}=${fator} KG (${suf.raw})${qtdInfo}`,
          ambiguo: true,
          alertas: ['FATOR_AMBIGUO'],
        },
        opts,
      );
    }

    // Regra 2: qtd == internas → fator = P
    if (matchInternas) {
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
    if (internas == null && !matchCaixas) {
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
    if (n != null && matchCaixas) {
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

  // ── "QTD. X CX/DP" na descrição (só se o texto tiver esse padrão) ─────────
  // Ex.: 6X400G QTD. 4.00 CX com quantidade 24 → 24 = 4×6 → fator = P (0,4 kg)
  if (
    qtdDeclarada &&
    pack.n != null &&
    pack.p != null &&
    qtd != null &&
    Number.isFinite(qtd) &&
    qtd > 0
  ) {
    const caixas = qtdDeclarada.quantidade;
    const internas = round4(caixas * pack.n);

    if (almostEq(qtd, internas)) {
      return anexarSanidade(
        {
          fator: pack.p,
          origem: 'DESCRICAO',
          detalhe: `qtd=${qtd} = QTD×N (${caixas}×${pack.n}) → fator=P=${pack.p} KG (${qtdDeclarada.raw})${qtdInfo}`,
        },
        opts,
      );
    }

    if (almostEq(qtd, caixas)) {
      const fator = round4(pack.n * pack.p);
      return anexarSanidade(
        {
          fator,
          origem: 'DESCRICAO',
          detalhe: `qtd=${qtd} = QTD caixas → fator=N×P=${pack.n}×${pack.p}=${fator} KG (${qtdDeclarada.raw})${qtdInfo}`,
        },
        opts,
      );
    }

    // QTD presente mas números não fecham → P (menos risco de inflar) + ambíguo
    return anexarSanidade(
      {
        fator: pack.p,
        origem: 'DESCRICAO',
        detalhe: `QTD ${qtdDeclarada.raw} + NxP; qtd=${qtd} ≠ ${caixas} nem ${internas} → P=${pack.p} KG${qtdInfo}`,
        ambiguo: true,
        alertas: ['FATOR_AMBIGUO'],
      },
      opts,
    );
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
export const CUSTO_KG_MIN = 0.5;
export const CUSTO_KG_MAX = 500;

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
