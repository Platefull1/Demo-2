/** Escritório / central não entram no lançamento mobile. */
export function isLojaEscritorio(nome: string): boolean {
  const n = nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
  return n.includes('escritorio') || n.includes('central');
}
