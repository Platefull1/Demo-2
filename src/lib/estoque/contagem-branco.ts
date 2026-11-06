/** Campo vazio não vira zero. A primeira quantidade digitada grava o valor, sem somar em 0 implícito. */
export function somarQuantidadeContada(
  atual: number | null,
  digitado: string,
  convertido: (n: number) => number = (n) => n,
): number | null {
  const bruto = digitado.trim().replace(',', '.');
  if (!bruto) return null;
  const num = Number(bruto);
  if (!Number.isFinite(num) || num < 0) return null;
  const valor = convertido(num);
  if (!Number.isFinite(valor) || valor < 0) return null;
  if (atual == null) return Math.round(valor * 1000) / 1000;
  return Math.round((atual + valor) * 1000) / 1000;
}

export function quantidadeDaEscolha(escolha: 'zero' | 'nao_contado'): number | null {
  return escolha === 'zero' ? 0 : null;
}
