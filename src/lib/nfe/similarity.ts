/**
 * Matching NF-e ↔ catálogo por tokens (substitui Levenshtein na frase inteira).
 *
 * Score = fração ponderada dos tokens do NOME DO CATÁLOGO presentes na descrição
 * da NF, com match tolerante (ratio ≥ 0,8). Mantém volumesConflitam.
 */

import { distance } from 'fastest-levenshtein';
import { stripAccents } from './normalize';
import { aplicarSinonimos } from './sinonimos-catalogo';
import { volumesConflitam } from './volume';

export type CmvRealSecao = 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA';

export interface CatalogoItem {
  id: string;
  nome: string;
  /** Seção CMV Real — usada no filtro por NCM */
  secao?: CmvRealSecao | null;
}

export interface SugestaoCatalogo {
  id: string;
  nome: string;
  score: number;
  matchedTokens?: number;
  /** Soma dos comprimentos dos tokens casados (desempate) */
  specificity?: number;
}

/** Limiar padrão de SUGERIDO (ajustável). */
export const SUGESTAO_MIN_SCORE = 0.5;

/** ratio mínimo token a token (Levenshtein normalizado). */
const TOKEN_MATCH_RATIO = 0.8;

const STOPWORDS = new Set([
  'KG',
  'G',
  'GR',
  'GRS',
  'GRAMAS',
  'UN',
  'UND',
  'UNID',
  'U',
  'PCT',
  'CX',
  'CXS',
  'CXA',
  'BAG',
  'BALDE',
  'PET',
  'FL',
  'INT',
  'TIPO',
  'COM',
  'DE',
  'DA',
  'DO',
  'DOS',
  'DAS',
  'S',
  'C',
  'FATIADO',
  'CUBOS',
  'PACK',
  'CAIXA',
  'RET',
  'RETA',
  'COZ',
  'EM',
  'E',
  'OU',
  'PARA',
  'THE',
  'AND',
  'ML',
  'L',
  'LITRO',
  'LITROS',
  'GORDURA',
  'VERDE',
  'PRIMEIRA',
  'BOVINA',
  'COZIDA',
  'DESFIADA',
  'SABOR',
  'OSSO',
  'PEQUENA',
  'CANADENSE',
]);

/** Genéricas: sozinhas não decidem; peso menor no score. */
const GENERICAS = new Set(['QUEIJO', 'CREME', 'MOLHO', 'CARNE']);
const PESO_GENERICA = 0.25;
const PESO_NORMAL = 1;

export interface TokenizedName {
  /** Tokens obrigatórios (fora de parênteses), já com sinônimos */
  required: string[];
  /** Tokens entre parênteses — opcionais */
  optional: string[];
}

function prepareBase(raw: string): string {
  return stripAccents(String(raw || ''))
    .toUpperCase()
    .replace(/,/g, '.')
    .replace(/[^A-Z0-9().\s/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove padrões de peso/multipack/anotações de caixa. */
function stripPackagingNoise(text: string): string {
  let t = text;
  // 6X1KG, 30X1KG, 6X1.500KG
  t = t.replace(/\b\d+\s*X\s*\d+(?:\.\d+)?\s*(?:KG|G|GR|ML|L)?\b/gi, ' ');
  // 500G, 1.5KG, 14.5 KG, 300GR, 600ML, 2L
  t = t.replace(/\b\d+(?:\.\d+)?\s*(?:KG|KGS|G|GR|GRS|GRAMAS|ML|L)\b/gi, ' ');
  // 1 CX COM 10 / 6 CXS E 0 UND
  t = t.replace(
    /\b\d+\s*CXS?\s*(?:E\s*)?(?:\d+\s*)?(?:UND|UN|UNID)?\b/gi,
    ' ',
  );
  t = t.replace(/\b\d+\s*CXS?\s*COM\s*\d+\b/gi, ' ');
  // S/ C/ 
  t = t.replace(/\b[SC]\s*\/\s*/g, ' ');
  // números soltos restantes
  t = t.replace(/\b\d+(?:\.\d+)?\b/g, ' ');
  return t.replace(/\s+/g, ' ').trim();
}

function tokenizeWords(text: string, secao?: CmvRealSecao | null): string[] {
  let cleaned = prepareBase(text);
  // multi-palavra antes do split
  cleaned = cleaned.replace(/\bCOCA[\s-]*COLA\b/g, 'COCA');
  // LT / LT12 → LATA (volume já tratado em volumesConflitam)
  cleaned = cleaned.replace(/\bLT\d*\b/g, 'LATA');
  cleaned = stripPackagingNoise(cleaned);
  const raw = cleaned
    .replace(/[()./-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const stop = new Set(STOPWORDS);
  if (secao !== 'BEBIDA') stop.add('LATA');

  const filtered = raw.filter((t) => t.length > 1 && !stop.has(t));
  return aplicarSinonimos(filtered);
}

/**
 * Tokens do nome do catálogo: parênteses → opcionais.
 * Ex.: "BACON (CRU)" → required=[BACON], optional=[CRU]
 */
export function tokenizeCatalogName(
  nome: string,
  secao?: CmvRealSecao | null,
): TokenizedName {
  const base = prepareBase(nome);
  const optional: string[] = [];
  const withoutParens = base.replace(/\(([^)]*)\)/g, (_, inner: string) => {
    const toks = tokenizeWords(inner, secao);
    optional.push(...toks);
    return ' ';
  });
  const required = tokenizeWords(withoutParens, secao);
  return { required, optional };
}

export function tokenizeNfeDescricao(
  descricao: string,
  secao?: CmvRealSecao | null,
): string[] {
  return tokenizeWords(descricao, secao);
}

/** Similaridade 0–1 entre dois tokens. */
export function tokenRatio(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  // um contém o outro (ISCA / ISCAS já sinonimizados; MUSSARELA parcial)
  if (a.length >= 4 && b.length >= 4 && (a.includes(b) || b.includes(a))) {
    return Math.min(a.length, b.length) / Math.max(a.length, b.length);
  }
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 0;
  return Math.max(0, 1 - distance(a, b) / maxLen);
}

function tokenInHaystack(needle: string, hay: string[]): boolean {
  for (const h of hay) {
    if (tokenRatio(needle, h) >= TOKEN_MATCH_RATIO) return true;
  }
  return false;
}

export function secaoFromNcm(ncm: string | null | undefined): CmvRealSecao | null {
  if (!ncm) return null;
  const digits = String(ncm).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('22')) return 'BEBIDA';
  if (digits.startsWith('4819') || digits.startsWith('3923')) return 'EMBALAGEM';
  return 'MATERIA_PRIMA';
}

/**
 * Score de um item do catálogo vs descrição NF.
 * null = descartado (volume / sem token significativo).
 */
export function scoreCatalogMatch(
  descricaoNfe: string,
  catalogNome: string,
  opts?: { secao?: CmvRealSecao | null },
): { score: number; matchedTokens: number; specificity: number } | null {
  if (volumesConflitam(descricaoNfe, catalogNome)) return null;

  const secao = opts?.secao ?? null;
  const cat = tokenizeCatalogName(catalogNome, secao);
  const nfe = tokenizeNfeDescricao(descricaoNfe, secao);

  if (cat.required.length === 0 && cat.optional.length === 0) return null;

  const significant = cat.required.filter((t) => !GENERICAS.has(t));
  const matchedSignificant = significant.filter((t) => tokenInHaystack(t, nfe));

  if (significant.length > 0 && matchedSignificant.length === 0) {
    return null;
  }
  if (significant.length === 0) {
    const matchedAll = cat.required.filter((t) => tokenInHaystack(t, nfe));
    if (matchedAll.length === 0) return null;
  }

  let weightTotal = 0;
  let weightMatched = 0;
  let matchedTokens = 0;
  let specificity = 0;

  for (const t of cat.required) {
    const w = GENERICAS.has(t) ? PESO_GENERICA : PESO_NORMAL;
    weightTotal += w;
    if (tokenInHaystack(t, nfe)) {
      weightMatched += w;
      matchedTokens++;
      specificity += t.length;
    }
  }

  for (const t of cat.optional) {
    if (tokenInHaystack(t, nfe)) {
      const w = GENERICAS.has(t) ? PESO_GENERICA : PESO_NORMAL;
      weightTotal += w;
      weightMatched += w;
      matchedTokens++;
      specificity += t.length;
    }
  }

  if (weightTotal <= 0) return null;
  return { score: weightMatched / weightTotal, matchedTokens, specificity };
}

/**
 * Top sugestões do catálogo. Filtra por NCM→seção quando disponível.
 */
export function sugerirDoCatalogo(
  descricao: string,
  catalogo: CatalogoItem[],
  minScore = SUGESTAO_MIN_SCORE,
  opts?: { ncm?: string | null; top?: number },
): SugestaoCatalogo | null {
  const top = sugerirTopDoCatalogo(descricao, catalogo, minScore, opts);
  return top[0] ?? null;
}

export function sugerirTopDoCatalogo(
  descricao: string,
  catalogo: CatalogoItem[],
  minScore = SUGESTAO_MIN_SCORE,
  opts?: { ncm?: string | null; top?: number },
): SugestaoCatalogo[] {
  const secaoNcm = secaoFromNcm(opts?.ncm);
  const limit = opts?.top ?? 3;

  const ranked: SugestaoCatalogo[] = [];

  for (const item of catalogo) {
    if (secaoNcm && item.secao && item.secao !== secaoNcm) continue;
    const secao = item.secao ?? secaoNcm;
    const scored = scoreCatalogMatch(descricao, item.nome, { secao });
    if (!scored || scored.score < minScore) continue;
    ranked.push({
      id: item.id,
      nome: item.nome,
      score: scored.score,
      matchedTokens: scored.matchedTokens,
      specificity: scored.specificity,
    });
  }

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if ((b.matchedTokens ?? 0) !== (a.matchedTokens ?? 0)) {
      return (b.matchedTokens ?? 0) - (a.matchedTokens ?? 0);
    }
    return (b.specificity ?? 0) - (a.specificity ?? 0);
  });

  return ranked.slice(0, limit);
}

/** @deprecated use similaridadeTexto só se necessário; preferir tokens */
export function similaridadeTexto(a: string, b: string): number {
  const scored = scoreCatalogMatch(a, b);
  return scored?.score ?? 0;
}
