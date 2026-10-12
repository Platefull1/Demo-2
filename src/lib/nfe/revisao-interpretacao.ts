/**
 * Interpretação legível da quantidade da nota na revisão do CMV Real.
 * Reutiliza pack (N×P) e sufixo já extraídos em fator-sugerido.
 */

import {
  extrairPackNP,
  extrairQtdDeclaradaNaDescricao,
  internasEsperadas,
  parseSufixoCx,
  separarSufixoFornecedor,
  type SufixoCx,
} from './fator-sugerido';
import { formatNumBr, perguntaFator, unidadeNotaNome } from './ui-labels';

/** Unidades comerciais que frequentemente mentem (peso na unidade, qtd em peças). */
const UNIDADES_PESO_NAO_CONFIAVEIS = new Set([
  'KG',
  'KGS',
  'TON',
  'G',
  'GR',
  'GRAMAS',
]);

export type ContagemNota = 'internas' | 'caixas' | 'desconhecida';

export interface InterpretacaoRevisao {
  /** KG/TON/G etc. + pack/sufixo na descrição */
  unidadeNaoConfiavel: boolean;
  /** Nota conta unidades internas, caixas, ou não deu para cravar */
  contagem: ContagemNota;
  /** Ex.: "1 un." */
  qtdExibicao: string;
  /** Ex.: "KG" — mostrar entre parênteses no canto quando reinterpretamos */
  unidadeOriginalParen: string | null;
  /** Linha antes do campo; null se não há o que explicar */
  linhaInterpretacao: string | null;
  pergunta: string;
  sufixo: 'kg' | 'un';
  /** N do pack (unidades internas / caixa), para conferência */
  nPack: number | null;
  pPack: number | null;
}

function almostEq(a: number, b: number, tol = 0.01): boolean {
  return Math.abs(a - b) <= tol;
}

function formatQtd(n: number): string {
  return formatNumBr(n, n % 1 === 0 ? 0 : 2);
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

function rotuloPack(n: number | null, p: number | null): string | null {
  if (n != null && p != null) {
    return `caixa de ${n} × ${formatPesoKg(p)} kg`;
  }
  if (n != null) return `caixa de ${n} un.`;
  if (p != null) return `unidade de ${formatPesoKg(p)} kg`;
  return null;
}

function resolverN(
  packN: number | null,
  suf: SufixoCx | null,
): number | null {
  if (packN != null) return packN;
  if (suf?.comInternas != null) return suf.comInternas;
  return null;
}

function inferirContagem(
  qtd: number,
  suf: SufixoCx | null,
  n: number | null,
  pesoNaoConfiavel: boolean,
): ContagemNota {
  if (!suf || !Number.isFinite(qtd) || qtd <= 0) return 'desconhecida';

  let internas: number | null = null;
  if (suf.comInternas != null) {
    internas =
      suf.caixas === 1
        ? suf.comInternas
        : n != null
          ? suf.caixas * n + suf.undExtras
          : suf.comInternas;
  } else if (n != null) {
    internas = suf.caixas * n + suf.undExtras;
  } else {
    internas = internasEsperadas(suf, n).internas;
  }

  if (internas != null && almostEq(qtd, internas)) return 'internas';

  // KG/TON + "1 CX COM 8" com qtd=1: quase nunca é caixa fechada —
  // costuma ser 1 peça. Preferir unidades quando qtd < internas do COM.
  if (
    pesoNaoConfiavel &&
    suf.comInternas != null &&
    qtd < suf.comInternas
  ) {
    return 'internas';
  }

  if (almostEq(qtd, suf.caixas)) return 'caixas';
  // "CX COM k" sem match de qtd: unidade em peso costuma contar peças
  if (suf.comInternas != null) return 'internas';
  return 'desconhecida';
}

/**
 * Monta labels e pergunta da revisão a partir da descrição + qtd da nota.
 */
export function interpretarRevisaoItem(params: {
  descricao: string;
  quantidade: number;
  unidadeComercial: string;
  unidadeCmv: 'KG' | 'UN' | string;
}): InterpretacaoRevisao {
  const und = normalizarUnd(params.unidadeComercial);
  const qtd = params.quantidade;
  const { corpo, sufixo: sufixoRaw } = separarSufixoFornecedor(params.descricao);
  const { corpo: corpoSemQtd } = extrairQtdDeclaradaNaDescricao(corpo);
  const pack = extrairPackNP(corpoSemQtd);
  const suf = sufixoRaw ? parseSufixoCx(sufixoRaw) : null;
  const n = resolverN(pack.n, suf);
  const p = pack.p;
  const temPackOuSufixo = Boolean(
    (n != null && p != null) ||
      p != null ||
      n != null ||
      suf ||
      /\d+\s*[xX×]\s*\d+/.test(params.descricao),
  );
  const pesoNaoConfiavel = UNIDADES_PESO_NAO_CONFIAVEIS.has(und);
  const unidadeNaoConfiavel = pesoNaoConfiavel && temPackOuSufixo;
  const contagem = inferirContagem(qtd, suf, n, pesoNaoConfiavel);

  const base = perguntaFator(params.unidadeComercial, params.unidadeCmv);

  if (!unidadeNaoConfiavel) {
    return {
      unidadeNaoConfiavel: false,
      contagem: 'desconhecida',
      qtdExibicao: `${formatQtd(qtd)} ${und}`,
      unidadeOriginalParen: null,
      linhaInterpretacao: null,
      pergunta: base.pergunta,
      sufixo: base.sufixo,
      nPack: n,
      pPack: p,
    };
  }

  // CMV em UN: mantém pergunta de unidades; ainda assim reinterpreta o canto
  const contaUnidades =
    contagem === 'internas' ||
    (contagem === 'desconhecida' && suf?.comInternas != null) ||
    (contagem === 'desconhecida' && n != null);

  const qtdExibicao = contaUnidades
    ? `${formatQtd(qtd)} un.`
    : contagem === 'caixas'
      ? `${formatQtd(qtd)} cx.`
      : `${formatQtd(qtd)} un.`;

  const unidadeOriginalParen = und;

  const nome = nomeProdutoParaInterpretacao(params.descricao);
  const packLabel = rotuloPack(n, p);
  const linhaInterpretacao = packLabel
    ? `A nota diz ${qtdExibicao} de ${nome} (${packLabel}, vieram ${formatQtd(qtd)})`
    : `A nota diz ${qtdExibicao} de ${nome} (vieram ${formatQtd(qtd)})`;

  let pergunta = base.pergunta;
  let sufixo = base.sufixo;
  if (params.unidadeCmv === 'UN') {
    // já ok
  } else if (contagem === 'caixas') {
    pergunta = 'Quanto pesa a caixa?';
    sufixo = 'kg';
  } else {
    pergunta = 'Quanto pesa cada unidade (pacote/lata/garrafa)?';
    sufixo = 'kg';
  }

  return {
    unidadeNaoConfiavel: true,
    contagem,
    qtdExibicao,
    unidadeOriginalParen,
    linhaInterpretacao,
    pergunta,
    sufixo,
    nPack: n,
    pPack: p,
  };
}

/** Linha de conferência com a leitura alternativa (caixa fechada). */
export function linhaConferenciaCaixaFechada(params: {
  nPack: number | null;
  fator: number;
  valorItem: number;
  sufixo: 'kg' | 'un';
  /** Só faz sentido quando a pergunta é por unidade interna */
  mostrar: boolean;
}): string | null {
  if (!params.mostrar) return null;
  const n = params.nPack;
  if (n == null || n <= 1) return null;
  const qtdConv = n * params.fator;
  if (!(qtdConv > 0)) return null;
  const custo = params.valorItem / qtdConv;
  return `Se fossem ${formatQtd(n)} un. (caixa fechada): ${formatNumBr(qtdConv)} ${params.sufixo} · R$ ${formatNumBr(custo)}/${params.sufixo}`;
}

/** Alerta curto quando a unidade comercial não é confiável. */
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
