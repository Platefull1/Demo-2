/**
 * Id opaco = basename do path de staging (uuid.pdf).
 * O path completo fica só no servidor / banco.
 */
export function toOpaqueSourceId(fullPath: string | null | undefined): string | null {
  if (!fullPath) return null;
  const normalized = fullPath.replace(/\\/g, '/');
  const base = normalized.split('/').pop() ?? '';
  return base || null;
}

/**
 * Aceita path completo (legado) ou id opaco (basename) e devolve path canônico
 * `${userId}/_staging/${batchId}/…`.
 */
export function resolveStagingSourcePath(
  userId: string,
  batchId: string,
  opaqueOrFull: string,
): string {
  const prefix = `${userId}/_staging/${batchId}/`;
  if (opaqueOrFull.startsWith(prefix)) {
    return opaqueOrFull;
  }
  if (
    !opaqueOrFull ||
    opaqueOrFull.includes('/') ||
    opaqueOrFull.includes('\\') ||
    opaqueOrFull.includes('..')
  ) {
    throw Object.assign(new Error('Arquivo inválido'), { status: 400 });
  }
  return `${prefix}${opaqueOrFull}`;
}
