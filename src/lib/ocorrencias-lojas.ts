/** Escritório / central não entram no lançamento mobile. */
export function isLojaEscritorio(nome: string): boolean {
  const n = nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
  return n.includes('escritorio') || n.includes('central');
}

/** Remove prefixo de marca/tipo para o card da loja (Ahú, Portão…). */
export function nomeCurtoLoja(nome: string): string {
  return nome
    .replace(/^\s*calenzano\s+/i, '')
    .replace(/^\s*loja\s+/i, '')
    .trim() || nome;
}
