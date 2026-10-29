export const CATEGORIA_CHIP_VALUES = [
  'PEDIDO_ATRASADO',
  'PEDIDO_REVIRADO',
  'FALTOU_BEBIDA',
  'PEDIDO_ERRADO',
  'PEDIDO_TROCADO',
  'QUALIDADE',
  'PROBLEMAS_COM_BORDA',
] as const;

export type CategoriaChip = (typeof CATEGORIA_CHIP_VALUES)[number];
export type CategoriaOcorrenciaValor = CategoriaChip | 'OUTROS';

export const CATEGORIA_LABELS: Record<CategoriaOcorrenciaValor, string> = {
  PEDIDO_ATRASADO: 'Pedido atrasado',
  PEDIDO_REVIRADO: 'Pedido revirado',
  FALTOU_BEBIDA: 'Faltou bebida',
  PEDIDO_ERRADO: 'Pedido errado',
  PEDIDO_TROCADO: 'Pedido trocado',
  QUALIDADE: 'Problema com qualidade',
  PROBLEMAS_COM_BORDA: 'Problemas com borda',
  OUTROS: 'Outros',
};

export const TODAS_CATEGORIAS: CategoriaOcorrenciaValor[] = [
  ...CATEGORIA_CHIP_VALUES,
  'OUTROS',
];

function isChip(value: string): value is CategoriaChip {
  return (CATEGORIA_CHIP_VALUES as readonly string[]).includes(value);
}

export function categoriaLabel(value: string): string {
  return CATEGORIA_LABELS[value as CategoriaOcorrenciaValor] ?? value;
}

export function resolverCategorias(
  enviadas: string[],
  descricao: string,
):
  | { ok: true; categorias: CategoriaOcorrenciaValor[] }
  | { ok: false; error: string } {
  const unique = [...new Set(enviadas)];
  const unknown = unique.filter((c) => c !== 'OUTROS' && !isChip(c));
  if (unknown.length > 0) {
    return { ok: false, error: 'Categoria inválida' };
  }

  const chips = unique.filter(isChip);
  const hasOutros = unique.includes('OUTROS');

  if (chips.length > 0 && hasOutros) {
    return {
      ok: false,
      error: 'OUTROS não pode ser enviado junto com outras categorias',
    };
  }

  if (chips.length === 0) {
    if (descricao.trim().length < 10) {
      return {
        ok: false,
        error: 'Descrição deve ter pelo menos 10 caracteres',
      };
    }
    return { ok: true, categorias: ['OUTROS'] };
  }

  return { ok: true, categorias: chips };
}
