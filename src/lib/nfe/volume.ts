/**
 * Extração de volume para comparar bebidas (NF-e / catálogo / planilha).
 * Se ambos os lados tiverem volume e divergirem → descartar candidato.
 *
 * Exemplos: 600ML, 2L, 1,5L, 350ML, LATA; também "PEPSI 600 ZERO" (nº solto).
 * Não confunde com peso (500G, 1KG).
 */

import { stripAccents } from './normalize';

export type VolumeInfo =
  | { kind: 'ml'; ml: number }
  | { kind: 'lata' };

/** Prepara texto mantendo decimais (1,5L → 1.5L). */
export function prepareVolumeText(raw: string): string {
  return stripAccents(String(raw || ''))
    .toUpperCase()
    .replace(/,/g, '.')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extrai o primeiro volume relevante da descrição.
 * Prioridade: LATA → N ML → N L → número solto 3–4 dígitos (provável ML).
 */
export function extractVolume(raw: string): VolumeInfo | null {
  let text = prepareVolumeText(raw);
  if (!text) return null;

  // Remover pesos para não pegar "500" de "500G"
  text = text.replace(/\b\d+(?:\.\d+)?\s*(?:KG|KGS|KILO|KILOS|G|GR|GRAMAS)\b/g, ' ');

  if (/\bLATA\b/.test(text)) return { kind: 'lata' };

  const ml = text.match(/\b(\d+(?:\.\d+)?)\s*ML\b/);
  if (ml) {
    const n = Number(ml[1]);
    if (Number.isFinite(n) && n > 0) return { kind: 'ml', ml: Math.round(n) };
  }

  // 2L, 1.5L — não LATA (já tratado)
  const lit = text.match(/\b(\d+(?:\.\d+)?)\s*L\b/);
  if (lit) {
    const n = Number(lit[1]);
    if (Number.isFinite(n) && n > 0) return { kind: 'ml', ml: Math.round(n * 1000) };
  }

  // Nº solto típico de embalagem (200–9999): "PEPSI 600 ZERO"
  const bare = text.match(/\b(\d{3,4})\b/);
  if (bare) {
    const n = Number(bare[1]);
    if (Number.isFinite(n) && n >= 190 && n <= 9999) return { kind: 'ml', ml: n };
  }

  return null;
}

/** true = ambos têm volume e não combinam → descartar match. */
export function volumesConflitam(a: string, b: string): boolean {
  const va = extractVolume(a);
  const vb = extractVolume(b);
  if (!va || !vb) return false;
  if (va.kind === 'lata' && vb.kind === 'lata') return false;
  if (va.kind === 'lata' || vb.kind === 'lata') return true;
  return va.ml !== vb.ml;
}
