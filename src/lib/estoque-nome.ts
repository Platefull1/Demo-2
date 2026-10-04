/** Normaliza nome para comparar duplicatas (ex.: "Creme de Morango" ≈ "CREME DE MORANGO"). */
export function normalizarNomeInsumo(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/** Slug estável a partir do nome (sem timestamp). */
export function slugifyInsumoNome(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Deduplica por nome normalizado (catálogo é compartilhado entre lojas).
 * Preferência: registro do tenant; em empate, o mais antigo.
 */
export function dedupeInsumosByNome<
  T extends { nome: string; userId: string; createdAt?: Date | string },
>(items: T[], tenantUserId: string): T[] {
  const byNome = new Map<string, T>();

  const prefer = (a: T, b: T): T => {
    if (a.userId === tenantUserId && b.userId !== tenantUserId) return a;
    if (b.userId === tenantUserId && a.userId !== tenantUserId) return b;
    if (a.createdAt && b.createdAt) {
      return new Date(a.createdAt) <= new Date(b.createdAt) ? a : b;
    }
    return a;
  };

  for (const item of items) {
    const key = normalizarNomeInsumo(item.nome);
    const prev = byNome.get(key);
    byNome.set(key, prev ? prefer(prev, item) : item);
  }
  return Array.from(byNome.values());
}
