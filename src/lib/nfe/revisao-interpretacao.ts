/**
 * Interpretação legível + opções de peso na revisão do CMV Real.
 * Reutiliza pack (N×P) e sufixo já extraídos em fator-sugerido.
 */

import {
  CUSTO_KG_MAX,
  CUSTO_KG_MIN,
  extrairCaixaComInternas,
  extrairPackNP,
  extrairQtdDeclaradaNaDescricao,
  internasEsperadas,
  parseSufixoCx,
  separarSufixoFornecedor,
  type SufixoCx,
} from './fator-sugerido';
import {
  formatNumBr,
  formatQuantidadeBr,
  perguntaFator,
  unidadeNotaNome,
} from './ui-labels';

/** Unidades comerciais que frequentemente mentem (peso na unidade, qtd em peças). */
const UNIDADES_PESO_NAO_CONFIAVEIS = new Set([
  'KG',
  'KGS',
  'TON',
  'G',
  'GR',
  'GRAMAS',
]);

/** Unidade da nota = embalagem (caixa etc.), não a peça interna. */
const UNIDADES_EMBALAGEM = new Set([
  'CX',
  'CXS',
  'FD',
  'DP',
  'PCT',
  'PC',
  'CJ',
  'KIT',
]);

export type ContagemNota = 'internas' | 'caixas' | 'desconhecida';
export type OpcaoPesoId = 'pacote' | 'caixa' | 'outro';

export interface OpcaoPeso {
  id: OpcaoPesoId;
  /** Texto principal do card */
  label: string;
  /** Fator de conversão (kg ou un por unidade da nota); null em "outro" */
  fator: number | null;
  totalKg: number | null;
  custoPorKg: number | null;
  precoImprovavel: boolean;
}

export interface InterpretacaoRevisao {
  /** KG/TON/G etc. + pack/sufixo na descrição */
  unidadeNaoConfiavel: boolean;
  /** qtd bateu ao mesmo tempo com c e k do sufixo */
  empateCaixaInternas: boolean;
  contagem: ContagemNota;
  qtdExibicao: string;
  unidadeOriginalParen: string | null;
  pergunta: string;
  sufixo: 'kg' | 'un';
  nPack: number | null;
  pPack: number | null;
  /**
   * Descrição tem N por caixa (ex.: CAIXA 10 BISNAGAS) sem peso:
   * o campo pede peso da unidade interna; fator efetivo = N × peso.
   */
  pesoPorInterna: boolean;
  /** Rótulo singular da unidade interna (bisnaga, unidade…). */
  labelInterna: string | null;
  /** Cards de opção; vazio → campo livre legado */
  opcoes: OpcaoPeso[];
  /** Pré-seleção sugerida */
  opcaoPadrao: OpcaoPesoId | null;
}

/** Fator gravado na nota: kg (ou un) por unidade comercial da NF. */
export function fatorEfetivoDaEntrada(
  pesoOuFatorDigitado: number,
  interp: Pick<InterpretacaoRevisao, 'pesoPorInterna' | 'nPack'>,
): number {
  if (
    interp.pesoPorInterna &&
    interp.nPack != null &&
    interp.nPack > 1
  ) {
    return round4(pesoOuFatorDigitado * interp.nPack);
  }
  return pesoOuFatorDigitado;
}

function almostEq(a: number, b: number, tol = 0.01): boolean {
  return Math.abs(a - b) <= tol;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function formatQtd(n: number): string {
  return formatQuantidadeBr(n);
}

function formatPesoKg(n: number): string {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

function normalizarUnd(und: string | null | undefined): string {
  return (und || 'UN').toUpperCase().replace(/[^A-Z0-9]/g, '') || 'UN';
}

/** Nome do produto sem pack NxP, peso solto e sufixo do fornecedor. */
export function nomeProdutoParaInterpretacao(descricao: string): string {
  const { corpo } = separarSufixoFornecedor(descricao);
  const { corpo: semQtd } = extrairQtdDeclaradaNaDescricao(corpo);
  const nome = semQtd
    .replace(
      /(\d+)\s*[xX×]\s*(\d+(?:[.,]\d+)?)\s*(kg|kgs|g|gr|gramas|ml|l)\b/gi,
      ' ',
    )
    .replace(
      /\b(?:PCT|BAG|BD|BALDE)\s+(\d+(?:[.,]\d+)?)\s*(kg|kgs|g|gr|gramas)\b/gi,
      ' ',
    )
    .replace(/\b(\d+(?:[.,]\d+)?)\s*(kg|kgs|g|gr|gramas)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return nome || corpo.trim() || String(descricao || '').trim();
}

function resolverN(
  packN: number | null,
  suf: SufixoCx | null,
): number | null {
  if (packN != null) return packN;
  if (suf?.comInternas != null) return suf.comInternas;
  return null;
}

function calcularInternas(
  suf: SufixoCx,
  n: number | null,
): number | null {
  if (suf.comInternas != null) {
    return suf.caixas === 1
      ? suf.comInternas
      : n != null
        ? suf.caixas * n + suf.undExtras
        : suf.comInternas;
  }
  if (n != null) return suf.caixas * n + suf.undExtras;
  return internasEsperadas(suf, n).internas;
}

/**
 * Parse de fator com formato brasileiro.
 * "1,005" e "1.005" → 1.005 quando há 3 casas após o separador e valor < 100.
 */
export function parseFatorBr(raw: string): number | null {
  const s = String(raw || '').trim().replace(/\s/g, '');
  if (!s) return null;

  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  let n: number;
  if (hasComma && hasDot) {
    const lastComma = s.lastIndexOf(',');
    const lastDot = s.lastIndexOf('.');
    if (lastComma > lastDot) {
      n = Number(s.replace(/\./g, '').replace(',', '.'));
    } else {
      n = Number(s.replace(/,/g, ''));
    }
  } else if (hasComma) {
    const parts = s.split(',');
    if (parts.length === 2 && parts[1].length === 3) {
      const asDec = Number(`${parts[0]}.${parts[1]}`);
      if (Number.isFinite(asDec) && asDec > 0 && asDec < 100) return asDec;
    }
    n = Number(s.replace(',', '.'));
  } else if (hasDot) {
    const parts = s.split('.');
    if (parts.length === 2 && parts[1].length === 3) {
      const asDec = Number(s);
      if (Number.isFinite(asDec) && asDec > 0 && asDec < 100) return asDec;
    }
    n = Number(s);
  } else {
    n = Number(s);
  }

  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/** Formata fator para exibição/digitação em pt-BR. */
export function formatFatorBr(n: number): string {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

function custoForaFaixa(custo: number, secaoMateriaPrima: boolean): boolean {
  if (!secaoMateriaPrima) return false;
  return custo < CUSTO_KG_MIN || custo > CUSTO_KG_MAX;
}

function montarOpcoes(params: {
  qtd: number;
  n: number;
  p: number;
  suf: SufixoCx | null;
  valorItem: number;
  secaoMateriaPrima: boolean;
}): OpcaoPeso[] {
  const { qtd, n, p, suf, valorItem, secaoMateriaPrima } = params;
  const fatorPacote = p;
  const totalPacote = round4(qtd * fatorPacote);
  const custoPacote = totalPacote > 0 ? valorItem / totalPacote : 0;

  const numCx = suf?.caixas ?? 1;
  const fatorCaixa = round4((numCx * n * p) / qtd);
  const totalCaixa = round4(qtd * fatorCaixa);
  const custoCaixa = totalCaixa > 0 ? valorItem / totalCaixa : 0;

  const labelPacote =
    qtd === 1
      ? `Veio 1 pacote de ${formatPesoKg(p)} kg`
      : `Veio ${formatQtd(qtd)} pacotes de ${formatPesoKg(p)} kg`;

  const labelCaixa =
    numCx === 1
      ? `Veio 1 caixa fechada (${n} × ${formatPesoKg(p)} kg)`
      : `Veio ${formatQtd(numCx)} caixas fechadas (${n} × ${formatPesoKg(p)} kg)`;

  const opcoes: OpcaoPeso[] = [
    {
      id: 'pacote',
      label: labelPacote,
      fator: fatorPacote,
      totalKg: totalPacote,
      custoPorKg: custoPacote,
      precoImprovavel: custoForaFaixa(custoPacote, secaoMateriaPrima),
    },
  ];

  // Só inclui caixa se o fator for distinto (senão é a mesma leitura)
  if (!almostEq(fatorPacote, fatorCaixa)) {
    opcoes.push({
      id: 'caixa',
      label: labelCaixa,
      fator: fatorCaixa,
      totalKg: totalCaixa,
      custoPorKg: custoCaixa,
      precoImprovavel: custoForaFaixa(custoCaixa, secaoMateriaPrima),
    });
  }

  opcoes.push({
    id: 'outro',
    label: 'Outro peso',
    fator: null,
    totalKg: null,
    custoPorKg: null,
    precoImprovavel: false,
  });

  return opcoes;
}

function escolherPadrao(params: {
  opcoes: OpcaoPeso[];
  empateCaixaInternas: boolean;
  contagem: ContagemNota;
  custoMedio: number | undefined;
}): OpcaoPesoId | null {
  const { opcoes, empateCaixaInternas, contagem, custoMedio } = params;
  const comFator = opcoes.filter((o) => o.id !== 'outro' && o.fator != null);
  if (comFator.length === 0) return null;

  // Empate c=k: pré-selecionar caixa; não usar R$/kg
  if (empateCaixaInternas && comFator.some((o) => o.id === 'caixa')) {
    return 'caixa';
  }

  if (custoMedio != null && custoMedio > 0) {
    let best: OpcaoPeso | null = null;
    let bestDist = Infinity;
    for (const o of comFator) {
      if (o.custoPorKg == null) continue;
      const dist = Math.abs(o.custoPorKg - custoMedio);
      if (dist < bestDist) {
        bestDist = dist;
        best = o;
      }
    }
    if (best) return best.id;
  }

  // Sem histórico: preferir dentro da faixa plausível
  const naFaixa = comFator.filter((o) => !o.precoImprovavel);
  const pool = naFaixa.length > 0 ? naFaixa : comFator;

  if (contagem === 'caixas') {
    return pool.find((o) => o.id === 'caixa')?.id ?? pool[0].id;
  }
  if (contagem === 'internas') {
    return pool.find((o) => o.id === 'pacote')?.id ?? pool[0].id;
  }
  return pool[0].id;
}

/**
 * Monta labels, opções e pré-seleção a partir da descrição + qtd da nota.
 */
export function interpretarRevisaoItem(params: {
  descricao: string;
  quantidade: number;
  unidadeComercial: string;
  unidadeCmv: 'KG' | 'UN' | string;
  valorItem?: number;
  secao?: string | null;
  custoMedio?: number;
}): InterpretacaoRevisao {
  const und = normalizarUnd(params.unidadeComercial);
  const qtd = params.quantidade;
  const valorItem = params.valorItem ?? 0;
  const secaoMateriaPrima =
    !params.secao || params.secao === 'MATERIA_PRIMA';

  const { corpo, sufixo: sufixoRaw } = separarSufixoFornecedor(params.descricao);
  const { corpo: corpoSemQtd } = extrairQtdDeclaradaNaDescricao(corpo);
  const pack = extrairPackNP(corpoSemQtd);
  const suf = sufixoRaw ? parseSufixoCx(sufixoRaw) : null;
  const caixaInfo = extrairCaixaComInternas(corpoSemQtd);
  const n = resolverN(pack.n, suf);
  const p = pack.p;

  const temPackOuSufixo = Boolean(
    (n != null && p != null) ||
      p != null ||
      n != null ||
      suf ||
      caixaInfo ||
      /\d+\s*[xX×]\s*\d+/.test(params.descricao),
  );
  const pesoNaoConfiavel = UNIDADES_PESO_NAO_CONFIAVEIS.has(und);
  const unidadeNaoConfiavel = pesoNaoConfiavel && temPackOuSufixo;

  const internas = suf ? calcularInternas(suf, n) : null;
  const matchInternas =
    internas != null && Number.isFinite(qtd) && almostEq(qtd, internas);
  const matchCaixas =
    suf != null && Number.isFinite(qtd) && almostEq(qtd, suf.caixas);
  const empateCaixaInternas =
    Boolean(matchInternas && matchCaixas && n != null && p != null);

  let contagem: ContagemNota = 'desconhecida';
  if (empateCaixaInternas) contagem = 'caixas';
  else if (matchInternas) contagem = 'internas';
  else if (matchCaixas) contagem = 'caixas';
  else if (suf?.comInternas != null) contagem = 'internas';
  else if (UNIDADES_EMBALAGEM.has(und) && n != null) contagem = 'caixas';

  const base = perguntaFator(params.unidadeComercial, params.unidadeCmv);

  const qtdExibicao = !unidadeNaoConfiavel
    ? `${formatQtd(qtd)} ${und}`
    : contagem === 'caixas'
      ? `${formatQtd(qtd)} cx.`
      : `${formatQtd(qtd)} un.`;

  let pergunta = base.pergunta;
  let sufixo = base.sufixo;
  if (unidadeNaoConfiavel && params.unidadeCmv !== 'UN') {
    pergunta = 'O que veio na nota?';
    sufixo = 'kg';
  }

  let opcoes: OpcaoPeso[] = [];
  let opcaoPadrao: OpcaoPesoId | null = null;

  if (
    unidadeNaoConfiavel &&
    params.unidadeCmv !== 'UN' &&
    n != null &&
    p != null &&
    n > 0 &&
    p > 0 &&
    qtd > 0
  ) {
    opcoes = montarOpcoes({
      qtd,
      n,
      p,
      suf,
      valorItem,
      secaoMateriaPrima,
    });
    opcaoPadrao = escolherPadrao({
      opcoes,
      empateCaixaInternas,
      contagem,
      custoMedio: params.custoMedio,
    });
  }

  // CAIXA 10 BISNAGAS + qtd em CX: pedir peso da bisnaga (fator = N × peso)
  const pesoPorInterna =
    opcoes.length === 0 &&
    params.unidadeCmv !== 'UN' &&
    n != null &&
    n > 1 &&
    p == null &&
    (UNIDADES_EMBALAGEM.has(und) || contagem === 'caixas');

  const labelInterna = pesoPorInterna
    ? caixaInfo?.label || 'unidade'
    : null;

  if (pesoPorInterna && labelInterna) {
    pergunta = `Quanto pesa 1 ${labelInterna}?`;
    sufixo = 'kg';
  }

  return {
    unidadeNaoConfiavel,
    empateCaixaInternas,
    contagem,
    qtdExibicao,
    unidadeOriginalParen: unidadeNaoConfiavel ? und : null,
    pergunta,
    sufixo,
    nPack: n,
    pPack: p,
    pesoPorInterna,
    labelInterna,
    opcoes,
    opcaoPadrao,
  };
}

/** Etiqueta "provável" só quando a pré-seleção veio de histórico/faixa (não empate). */
export function opcaoEProvavel(
  opcaoId: OpcaoPesoId,
  interp: InterpretacaoRevisao,
): boolean {
  if (interp.empateCaixaInternas) return false;
  return interp.opcaoPadrao === opcaoId && opcaoId !== 'outro';
}

export function textoAlertaAmbiguoRevisao(
  unidadeNota: string,
  unidadeNaoConfiavel: boolean,
): string {
  if (unidadeNaoConfiavel) {
    return 'Confira o peso: a unidade da nota não é confiável (pode estar contando peças)';
  }
  const und = normalizarUnd(unidadeNota);
  const nome = unidadeNotaNome(und);
  return `Confira o peso: a nota veio em ${und} (${nome})`;
}
