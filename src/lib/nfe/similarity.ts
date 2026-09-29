import { distance } from 'fastest-levenshtein';
import { normalizarDescricao } from './normalize';

export interface CatalogoItem {
  id: string;
  nome: string;
}

export interface SugestaoCatalogo {
  id: string;
  nome: string;
  score: number; // 0–1 (1 = idêntico)
}

/**
 * Similaridade 0–1 via distância de Levenshtein na descrição normalizada.
 */
export function similaridadeTexto(a: string, b: string): number {
  const na = normalizarDescricao(a);
  const nb = normalizarDescricao(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen === 0) return 0;
  const d = distance(na, nb);
  return Math.max(0, 1 - d / maxLen);
}

/** Melhor match do catálogo; null se score < minScore. */
export function sugerirDoCatalogo(
  descricao: string,
  catalogo: CatalogoItem[],
  minScore = 0.6,
): SugestaoCatalogo | null {
  let best: SugestaoCatalogo | null = null;
  for (const item of catalogo) {
    const score = similaridadeTexto(descricao, item.nome);
    if (score < minScore) continue;
    if (!best || score > best.score) {
      best = { id: item.id, nome: item.nome, score };
    }
  }
  return best;
}
