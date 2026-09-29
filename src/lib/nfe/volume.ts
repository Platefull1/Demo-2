/**
 * Extração de volume para comparar bebidas (NF-e / catálogo / planilha).
 * Se ambos os lados tiverem volume e divergirem → descartar candidato.
 *
 * - ML / L / LITRO(S)
 * - LATA / LT / LT12 (+ 350ML típico de lata)
 * - nº solto (PEPSI 600 ZERO)
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
 * Extrai volume relevante da descrição.
 * Prioridade: LATA/LT → N LITRO(S) → N ML → N L → número solto.
 */
export function extractVolume(raw: string): VolumeInfo | null {
  let text = prepareVolumeText(raw);
  if (!text) return null;

  // Remover pesos para não pegar "500" de "500G"
  text = text.replace(/\b\d+(?:\.\d+)?\s*(?:KG|KGS|KILO|KILOS|G|GR|GRAMAS)\b/g, ' ');

  // LATA / LT / LT12 — lata (LT12 350ML, LT 350ml, LATA)
  // Não confundir com LITRO (LT ≠ prefixo de LITRO via \bLT\d*\b)
  const temLata = /\bLATA\b/.test(text) || /\bLT\d*\b/.test(text);
  if (temLata) return { kind: 'lata' };

  // N LITRO / N LITROS / LITRO (1)
  const litros = text.match(/\b(\d+(?:\.\d+)?)\s*LITROS?\b/);
  if (litros) {
    const n = Number(litros[1]);
    if (Number.isFinite(n) && n > 0) return { kind: 'ml', ml: Math.round(n * 1000) };
  }
  if (/\bLITROS?\b/.test(text)) {
    return { kind: 'ml', ml: 1000 };
  }

  const ml = text.match(/\b(\d+(?:\.\d+)?)\s*ML\b/);
  if (ml) {
    const n = Number(ml[1]);
    if (Number.isFinite(n) && n > 0) return { kind: 'ml', ml: Math.round(n) };
  }

  // 2L, 1.5L — não LATA/LITRO (já tratados)
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

/**
 * Multipack de bebida na descrição.
 * LT12 / 12X → 12; 6U / 6 Pack / C/6 → 6.
 */
export function extrairMultipackBebida(descricao: string): number | null {
  const text = prepareVolumeText(descricao);
  const patterns: RegExp[] = [
    /\bLT(\d+)\b/, // LT12
    /\b(\d+)\s*PACK\b/,
    /\bC\s*\/\s*(\d+)\b/,
    /\bCX\s*C\s*\/\s*(\d+)\b/,
    /\b(\d+)\s*U(?:N(?:ID)?)?\b/,
    /\b(\d+)\s*X\b/, // 12X (sem unidade de peso — pack)
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (!m) continue;
    const n = Number(m[1]);
    if (Number.isFinite(n) && n > 1 && n <= 100) return n;
  }
  return null;
}
