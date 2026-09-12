/**
 * Helpers para casar nomes de loja (RH / iFood / texto de conversa)
 * às lojas operacionais de reclamação (Ahú, Pilarzinho, Portão, Uberaba).
 */

export type LojaRef = { id: string; nome: string };

/** Chaves canônicas das lojas de operação (exclui escritório/central). */
const LOJA_KEYS = [
  { key: 'ahu', patterns: ['ahu', 'ahú', 'ahu '] },
  { key: 'pilarzinho', patterns: ['pilarzinho', 'pilar'] },
  { key: 'portao', patterns: ['portao', 'portão', 'portao '] },
  { key: 'uberaba', patterns: ['uberaba'] },
] as const;

export type LojaKey = (typeof LOJA_KEYS)[number]['key'];

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/** Retorna null se for escritório/central ou loja não operacional. */
export function normalizeLojaKey(nome: string): LojaKey | null {
  const n = stripAccents(nome.trim());
  if (!n) return null;
  if (/escritorio|central/.test(n) && !/ahu|pilar|portao|uberaba/.test(n)) {
    return null;
  }
  for (const { key, patterns } of LOJA_KEYS) {
    if (patterns.some((p) => n.includes(stripAccents(p)))) return key;
  }
  return null;
}

/**
 * Dado um texto (resumo ou conversa) e a lista de lojas, tenta achar a loja
 * citada. Prefere match por chave canônica (ahu, pilarzinho…).
 */
export function matchLojaFromText(
  text: string,
  lojas: LojaRef[],
): LojaRef | null {
  if (!text.trim() || lojas.length === 0) return null;
  const t = stripAccents(text);

  // Padrão "pedido N loja X"
  const pedidoLoja = t.match(/pedido\s*#?\s*\d+\s+loja\s+([a-z0-9áéíóúâêôãõç\s/-]+)/i);
  const hintFromPedido = pedidoLoja?.[1]?.trim() ?? null;

  // Padrão "loja X"
  const lojaExplicit = t.match(/\bloja\s+([a-z0-9áéíóúâêôãõç/-]+)/i);
  const hintExplicit = lojaExplicit?.[1]?.trim() ?? null;

  const hints = [hintFromPedido, hintExplicit].filter(Boolean) as string[];

  for (const hint of hints) {
    const key = normalizeLojaKey(hint);
    if (key) {
      const byKey = lojas.find((l) => normalizeLojaKey(l.nome) === key);
      if (byKey) return byKey;
    }
  }

  // Varre chaves canônicas no texto inteiro
  for (const { key, patterns } of LOJA_KEYS) {
    const hit = patterns.some((p) => {
      const pp = stripAccents(p).trim();
      if (pp.length <= 3) {
        // token curto (ahu): word-ish boundary
        return new RegExp(`(?:^|[^a-z])${pp}(?:[^a-z]|$)`).test(t);
      }
      return t.includes(pp);
    });
    if (!hit) continue;
    const found = lojas.find((l) => normalizeLojaKey(l.nome) === key);
    if (found) return found;
  }

  // Fallback: nome completo da loja no texto
  for (const l of lojas) {
    const nome = stripAccents(l.nome);
    if (nome.length >= 4 && t.includes(nome)) return l;
  }

  return null;
}

/**
 * Escolhe UMA loja por chave operacional (Ahú, Pilarzinho, Portão, Uberaba).
 * Preferência: loja que tem riders > match com nome do grupo iFood > nome mais curto.
 */
export function pickOperationalLojas(params: {
  rhLojas: LojaRef[];
  ifoodLojaNomes?: string[];
  riderCounts?: Map<string, number>;
}): LojaRef[] {
  const { rhLojas, ifoodLojaNomes = [], riderCounts = new Map() } = params;
  const byKey = new Map<LojaKey, LojaRef[]>();

  for (const l of rhLojas) {
    const key = normalizeLojaKey(l.nome);
    if (!key) continue;
    const list = byKey.get(key) ?? [];
    list.push(l);
    byKey.set(key, list);
  }

  // Se houver grupos iFood, garante que só mostremos lojas dessas chaves
  const ifoodKeys = new Set<LojaKey>();
  for (const nome of ifoodLojaNomes) {
    const k = normalizeLojaKey(nome);
    if (k) ifoodKeys.add(k);
  }

  const keysToShow =
    ifoodKeys.size > 0
      ? LOJA_KEYS.map((x) => x.key).filter((k) => ifoodKeys.has(k) || byKey.has(k))
      : LOJA_KEYS.map((x) => x.key).filter((k) => byKey.has(k));

  const result: LojaRef[] = [];
  for (const key of keysToShow) {
    const candidates = byKey.get(key);
    if (!candidates?.length) continue;

    const scored = [...candidates].sort((a, b) => {
      const ra = riderCounts.get(a.id) ?? 0;
      const rb = riderCounts.get(b.id) ?? 0;
      if (rb !== ra) return rb - ra;
      // Prefer nome que case com iFood
      const aIfood = ifoodLojaNomes.some(
        (n) => normalizeLojaKey(n) === key && stripAccents(a.nome).includes(stripAccents(n)),
      )
        ? 1
        : 0;
      const bIfood = ifoodLojaNomes.some(
        (n) => normalizeLojaKey(n) === key && stripAccents(b.nome).includes(stripAccents(n)),
      )
        ? 1
        : 0;
      if (bIfood !== aIfood) return bIfood - aIfood;
      // Prefer nome mais curto (ex: "Loja Ahú" vs "CALENZANO AHÚ")
      return a.nome.length - b.nome.length;
    });

    const best = scored[0]!;
    // Label amigável: usa nome do grupo iFood se existir
    const ifoodLabel = ifoodLojaNomes.find((n) => normalizeLojaKey(n) === key);
    result.push({
      id: best.id,
      nome: ifoodLabel?.trim() || best.nome.replace(/^calenzano\s+/i, '').trim() || best.nome,
    });
  }

  return result.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

/**
 * Agrega riders de todas as RhLoja da mesma chave canônica
 * sob o id da loja "escolhida" para o dropdown.
 */
export function mergeRidersByCanonicalLoja(params: {
  operationalLojas: LojaRef[];
  allRhLojas: LojaRef[];
  riders: { id: string; name: string; lojaId: string }[];
}): Record<string, { id: string; name: string }[]> {
  const { operationalLojas, allRhLojas, riders } = params;
  const keyToOpId = new Map<LojaKey, string>();
  for (const l of operationalLojas) {
    const k = normalizeLojaKey(l.nome);
    if (k) keyToOpId.set(k, l.id);
  }

  // Também mapeia pelo id real das RhLojas originais → chave
  const rhIdToKey = new Map<string, LojaKey>();
  for (const l of allRhLojas) {
    const k = normalizeLojaKey(l.nome);
    if (k) rhIdToKey.set(l.id, k);
  }

  const out: Record<string, { id: string; name: string }[]> = {};
  for (const op of operationalLojas) {
    out[op.id] = [];
  }

  const seen = new Set<string>();
  for (const r of riders) {
    const key = rhIdToKey.get(r.lojaId);
    if (!key) continue;
    const opId = keyToOpId.get(key);
    if (!opId) continue;
    const dedupe = `${opId}:${r.id}`;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    out[opId]!.push({ id: r.id, name: r.name });
  }

  for (const id of Object.keys(out)) {
    out[id]!.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }

  return out;
}

/** Mapeia qualquer id de RhLoja para o id da loja operacional do dropdown. */
export function resolveToOperationalLojaId(
  lojaId: string | null | undefined,
  allRhLojas: LojaRef[],
  operationalLojas: LojaRef[],
): string | null {
  if (!lojaId) return null;
  if (operationalLojas.some((l) => l.id === lojaId)) return lojaId;
  const src = allRhLojas.find((l) => l.id === lojaId);
  if (!src) return lojaId;
  const key = normalizeLojaKey(src.nome);
  if (!key) return lojaId;
  return operationalLojas.find((l) => normalizeLojaKey(l.nome) === key)?.id ?? lojaId;
}
