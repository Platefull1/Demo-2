/**
 * Regras de match de nomes planilha ↔ catálogo (saldo / catálogo CMV).
 * Tokens numéricos e distintivos são checados ANTES do score.
 */

import { normalizarDescricao, stripAccents } from './normalize';
import { volumesConflitam } from './volume';

const STOP = new Set(['DE', 'DA', 'DO', 'DOS', 'DAS', 'E', 'A', 'O', 'AS', 'OS', 'COM']);

/** Prepara texto: maiúsculo, sem acento, vírgula→ponto, espaços colapsados. */
export function prepararNomeMatch(raw: string): string {
  return stripAccents(String(raw || ''))
    .toUpperCase()
    .replace(/,/g, '.')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normaliza unidades no texto: 2 LITROS → 2L, 900 ML → 900ML, LONG NECK → LONGNECK.
 */
export function normalizarUnidadesNoNome(raw: string): string {
  let t = prepararNomeMatch(raw);
  t = t.replace(/\bLONG\s+NECK\b/g, 'LONGNECK');
  t = t.replace(/\b(\d+(?:\.\d+)?)\s*LITROS?\b/g, '$1L');
  t = t.replace(/\b(\d+(?:\.\d+)?)\s*ML\b/g, '$1ML');
  return t;
}

/** Conjunto de tokens numéricos canônicos (20, 25, 600, 1.5, 2L, 900ML…). */
export function extrairTokensNumericos(nome: string): Set<string> {
  let t = normalizarUnidadesNoNome(nome);
  const set = new Set<string>();

  for (const m of t.matchAll(/\b(\d+(?:\.\d+)?)ML\b/g)) {
    set.add(`${m[1]}ML`);
  }
  t = t.replace(/\b\d+(?:\.\d+)?ML\b/g, ' ');

  for (const m of t.matchAll(/\b(\d+(?:\.\d+)?)L\b/g)) {
    set.add(`${m[1]}L`);
  }
  t = t.replace(/\b\d+(?:\.\d+)?L\b/g, ' ');

  for (const m of t.matchAll(/\b(\d+(?:\.\d+)?)\b/g)) {
    set.add(m[1]);
  }
  return set;
}

/** true = conjuntos numéricos diferentes → descartar candidato. */
export function tokensNumericosConflitam(a: string, b: string): boolean {
  const sa = extrairTokensNumericos(a);
  const sb = extrairTokensNumericos(b);
  if (sa.size !== sb.size) return true;
  for (const x of sa) {
    if (!sb.has(x)) return true;
  }
  return false;
}

/**
 * Tokens de texto (marca/sabor/variante), sem números/unidades, deduplicados.
 * Ex.: "CERVEJA SPATEN LATA LATA" → ["CERVEJA","SPATEN","LATA"]
 */
export function tokensTextoDistintivos(nome: string): string[] {
  let t = normalizarUnidadesNoNome(nome);
  t = t.replace(/\b\d+(?:\.\d+)?ML\b/g, ' ');
  t = t.replace(/\b\d+(?:\.\d+)?L\b/g, ' ');
  t = t.replace(/\b\d+(?:\.\d+)?\b/g, ' ');
  t = t.replace(/[^A-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  const seen = new Set<string>();
  const out: string[] = [];
  for (const tok of t.split(' ').filter(Boolean)) {
    if (STOP.has(tok)) continue;
    if (seen.has(tok)) continue;
    seen.add(tok);
    out.push(tok);
  }
  return out;
}

/** true = token distintivo de um lado não existe no outro → descartar. */
export function tokensDistintivosConflitam(a: string, b: string): boolean {
  const sa = new Set(tokensTextoDistintivos(a));
  const sb = new Set(tokensTextoDistintivos(b));
  for (const t of sa) {
    if (!sb.has(t)) return true;
  }
  for (const t of sb) {
    if (!sa.has(t)) return true;
  }
  return false;
}

/**
 * Candidato é incompatível se volume, números ou tokens distintivos divergem.
 */
export function nomesProdutoConflitam(a: string, b: string): boolean {
  if (volumesConflitam(a, b)) return true;
  if (tokensNumericosConflitam(a, b)) return true;
  if (tokensDistintivosConflitam(a, b)) return true;
  return false;
}

/** Score 0–1 após passar pelos filtros de conflito (chamador deve filtrar antes). */
export function scoreNomeProdutoStrict(a: string, b: string): number {
  const ta = tokensTextoDistintivos(a);
  const tb = tokensTextoDistintivos(b);
  if (ta.length === 0 || tb.length === 0) {
    // só números (ex. embalagens) — se numéricos iguais, score alto
    if (!tokensNumericosConflitam(a, b) && extrairTokensNumericos(a).size > 0) return 1;
    return 0;
  }
  const sa = new Set(ta);
  const sb = new Set(tb);
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter++;
  return inter / Math.max(sa.size, sb.size);
}

export type MatchNomeResultado<T> = {
  status: 'casado' | 'sugerido' | 'nao_encontrado';
  item?: T;
  score: number;
};

/**
 * Match puro (sem Prisma): filtra conflitos → score.
 */
export function matchNomeProdutoLista<T extends { nome: string; nomeNormalizado: string }>(
  nomePlanilha: string,
  catalogo: T[],
  opts?: { minCasado?: number; minSugerido?: number },
): MatchNomeResultado<T> {
  const minCasado = opts?.minCasado ?? 0.95;
  const minSugerido = opts?.minSugerido ?? 0.55;
  const alvoNorm = normalizarDescricao(nomePlanilha);

  let best: { item: T; score: number } | null = null;
  for (const c of catalogo) {
    if (nomesProdutoConflitam(nomePlanilha, c.nome)) continue;
    let score =
      c.nomeNormalizado === alvoNorm ? 1 : scoreNomeProdutoStrict(nomePlanilha, c.nome);
    if (score < minSugerido) continue;
    if (!best || score > best.score) best = { item: c, score };
  }

  if (!best) return { status: 'nao_encontrado', score: 0 };
  if (best.score >= minCasado) {
    return { status: 'casado', item: best.item, score: best.score };
  }
  return { status: 'sugerido', item: best.item, score: best.score };
}
