/**
 * Chave de acesso NF-e (44 dígitos) — barcode do DANFE.
 * Layout (1-indexed): UF(1-2) AAMM(3-6) CNPJ(7-20) mod(21-22)
 * série(23-25) nNF(26-34) tpEmis(35) cNF(36-43) DV(44).
 */

export type ChaveAcessoParsed = {
  chave: string;
  /** Número da NF sem zeros à esquerda (posições 26–34). */
  numero: string;
  /** nNF com 9 dígitos (zero-padded). */
  numeroPadded: string;
};

/** Só dígitos. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Interpreta leitura de pistola / chave colada.
 * Aceita 44 dígitos com ou sem máscara; rejeita outros comprimentos.
 */
export function parseChaveAcesso(raw: string): ChaveAcessoParsed | null {
  const chave = digitsOnly(raw.trim());
  if (chave.length !== 44) return null;
  const numeroPadded = chave.slice(25, 34);
  const numero = numeroPadded.replace(/^0+/, '') || '0';
  return { chave, numero, numeroPadded };
}

/** True se a string (após limpar) parece chave completa de NF-e. */
export function isChaveAcesso(raw: string): boolean {
  return parseChaveAcesso(raw) != null;
}

/** Compara número da NF ignorando zeros à esquerda. */
export function sameNfNumero(a: string, b: string): boolean {
  const na = digitsOnly(a).replace(/^0+/, '') || '0';
  const nb = digitsOnly(b).replace(/^0+/, '') || '0';
  return na === nb;
}
