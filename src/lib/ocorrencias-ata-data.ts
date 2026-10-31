/**
 * Contagens e prévia da ata de ocorrências.
 * Funções puras — sem Prisma, sem I/O.
 */

import { displayLojaNome } from '@/lib/complaints/loja-match';
import {
  CATEGORIA_LABELS,
  TODAS_CATEGORIAS,
  categoriaLabel,
  type CategoriaOcorrenciaValor,
} from '@/lib/ocorrencias-categorias';
import { nomeCurtoLoja } from '@/lib/ocorrencias-lojas';

export const ESCOPO_REDE = 'REDE';
export const ESCOPO_TODAS_LOJAS = 'TODAS_LOJAS';
export const ATRASO_NAO_INFORMADO = 'não informado';

export type AtrasoInformado = {
  lojaId: string;
  quantidade: number | null;
};

export type OcorrenciaAtaRow = {
  id: string;
  lojaId: string;
  lojaNome: string;
  categorias: string[];
  motoboyId: string | null;
  motoboyNome: string | null;
  destaqueAta: boolean;
  createdAt: Date | string;
  numeroPedidoSaipos: string;
  numeroPedidoExterno: string | null;
  canalExterno: string | null;
  descricao: string;
  fotoPaths: string[];
};

export type LojaAtaRef = { id: string; nome: string };

export function displayLojaAta(nome: string): string {
  return displayLojaNome(nome) || nomeCurtoLoja(nome);
}

export function lojaSlugAta(nome: string): string {
  const short = displayLojaAta(nome)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return short || 'loja';
}

export function countByCategoria(
  items: { categorias: string[] }[],
): Record<CategoriaOcorrenciaValor, number> {
  const out = Object.fromEntries(TODAS_CATEGORIAS.map((c) => [c, 0])) as Record<
    CategoriaOcorrenciaValor,
    number
  >;
  for (const item of items) {
    for (const raw of item.categorias) {
      if (raw === 'PEDIDO_ATRASADO') continue;
      if (raw in out) {
        out[raw as CategoriaOcorrenciaValor] += 1;
      }
    }
  }
  return out;
}

export function somaAtrasos(atrasos: AtrasoInformado[]): {
  soma: number;
  informados: number;
  lojasSemNumero: string[];
} {
  let soma = 0;
  let informados = 0;
  const lojasSemNumero: string[] = [];
  for (const a of atrasos) {
    if (a.quantidade === null) {
      lojasSemNumero.push(a.lojaId);
    } else {
      soma += a.quantidade;
      informados += 1;
    }
  }
  return { soma, informados, lojasSemNumero };
}

/**
 * Variação vs mês anterior.
 * sem dados do anterior → "—"; 0→N → (novo); N→0 → (resolvido); igual → estável; senão ±X%.
 */
export function variacaoLabel(
  atual: number | null,
  anterior: number | null,
): string {
  if (anterior === null) return '—';
  const a = atual ?? 0;
  if (anterior === 0 && a === 0) return '—';
  if (anterior === 0 && a > 0) return '(novo)';
  if (a === 0 && anterior > 0) return '(resolvido)';
  const pct = Math.round(((a - anterior) / anterior) * 100);
  if (pct === 0) return 'estável';
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}

export function quantidadeLabel(qtd: number | null, isAtraso: boolean): string {
  if (isAtraso && qtd === null) return ATRASO_NAO_INFORMADO;
  return String(qtd ?? 0);
}

export type ResumoCategoria = {
  categoria: CategoriaOcorrenciaValor;
  label: string;
  quantidade: number | null;
  quantidadeLabel: string;
  variacao: string;
};

export function resumoCategorias(opts: {
  counts: Record<string, number>;
  atraso: number | null;
  prevCounts: Record<string, number> | null;
  prevAtraso: number | null;
  temDadosAnterior: boolean;
}): ResumoCategoria[] {
  return TODAS_CATEGORIAS.map((categoria) => {
    const isAtraso = categoria === 'PEDIDO_ATRASADO';
    const quantidade = isAtraso ? opts.atraso : (opts.counts[categoria] ?? 0);
    const anterior = !opts.temDadosAnterior
      ? null
      : isAtraso
        ? opts.prevAtraso
        : (opts.prevCounts?.[categoria] ?? 0);
    return {
      categoria,
      label: CATEGORIA_LABELS[categoria] ?? categoriaLabel(categoria),
      quantidade,
      quantidadeLabel: quantidadeLabel(quantidade, isAtraso),
      variacao: variacaoLabel(quantidade, anterior),
    };
  });
}

export type MotoboyAtaRow = {
  motoboyId: string;
  nome: string;
  lojaId: string;
  lojaNome: string;
  total: number;
  porCategoria: Record<string, number>;
};

export function rankMotoboys(items: OcorrenciaAtaRow[]): MotoboyAtaRow[] {
  const map = new Map<string, MotoboyAtaRow>();
  for (const item of items) {
    if (!item.motoboyId) continue;
    const key = `${item.motoboyId}|${item.lojaId}`;
    const row = map.get(key) ?? {
      motoboyId: item.motoboyId,
      nome: item.motoboyNome || 'Motoboy sem cadastro',
      lojaId: item.lojaId,
      lojaNome: displayLojaAta(item.lojaNome),
      total: 0,
      porCategoria: {},
    };
    row.total += 1;
    for (const c of item.categorias) {
      if (c === 'PEDIDO_ATRASADO') continue;
      row.porCategoria[c] = (row.porCategoria[c] ?? 0) + 1;
    }
    map.set(key, row);
  }
  return [...map.values()].sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return a.nome.localeCompare(b.nome, 'pt-BR');
  });
}

export function destaquesDaAta(items: OcorrenciaAtaRow[]): OcorrenciaAtaRow[] {
  return items
    .filter((i) => i.destaqueAta)
    .sort((a, b) => {
      const loja = displayLojaAta(a.lojaNome).localeCompare(
        displayLojaAta(b.lojaNome),
        'pt-BR',
      );
      if (loja !== 0) return loja;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
}

export type LojaResumoAta = {
  lojaId: string;
  lojaNome: string;
  ocorrencias: number;
  atrasos: number | null;
  total: number;
  resumo: ResumoCategoria[];
  motoboys: MotoboyAtaRow[];
  destaques: OcorrenciaAtaRow[];
};

export type RedeResumoAta = {
  resumo: ResumoCategoria[];
  matriz: {
    lojas: { lojaId: string; lojaNome: string; valores: Record<string, number | null>; total: number }[];
    totaisColuna: Record<string, number | null>;
    totalGeral: number;
  };
  rankingLojas: { lojaId: string; lojaNome: string; total: number; ocorrencias: number; atrasos: number | null }[];
  motoboys: MotoboyAtaRow[];
  destaquesPorLoja: { lojaId: string; lojaNome: string; items: OcorrenciaAtaRow[] }[];
  lojasSemAtraso: string[];
};

export function buildLojaResumo(opts: {
  loja: LojaAtaRef;
  items: OcorrenciaAtaRow[];
  atraso: number | null;
  prevItems: OcorrenciaAtaRow[] | null;
  prevAtraso: number | null;
  temDadosAnterior: boolean;
}): LojaResumoAta {
  const counts = countByCategoria(opts.items);
  const prevCounts = opts.prevItems ? countByCategoria(opts.prevItems) : null;
  return {
    lojaId: opts.loja.id,
    lojaNome: displayLojaAta(opts.loja.nome),
    ocorrencias: opts.items.length,
    atrasos: opts.atraso,
    total: opts.items.length + (opts.atraso ?? 0),
    resumo: resumoCategorias({
      counts,
      atraso: opts.atraso,
      prevCounts,
      prevAtraso: opts.prevAtraso,
      temDadosAnterior: opts.temDadosAnterior,
    }),
    motoboys: rankMotoboys(opts.items),
    destaques: destaquesDaAta(opts.items),
  };
}

export function buildRedeResumo(opts: {
  lojas: LojaAtaRef[];
  items: OcorrenciaAtaRow[];
  atrasos: AtrasoInformado[];
  prevItems: OcorrenciaAtaRow[] | null;
  prevAtrasos: AtrasoInformado[] | null;
  temDadosAnterior: boolean;
}): RedeResumoAta {
  const atrasoByLoja = new Map(opts.atrasos.map((a) => [a.lojaId, a.quantidade]));
  const prevAtrasoByLoja = new Map(
    (opts.prevAtrasos ?? []).map((a) => [a.lojaId, a.quantidade]),
  );
  const itemsByLoja = new Map<string, OcorrenciaAtaRow[]>();
  const prevByLoja = new Map<string, OcorrenciaAtaRow[]>();
  for (const loja of opts.lojas) {
    itemsByLoja.set(loja.id, []);
    prevByLoja.set(loja.id, []);
  }
  for (const item of opts.items) {
    (itemsByLoja.get(item.lojaId) ?? []).push(item);
  }
  for (const item of opts.prevItems ?? []) {
    (prevByLoja.get(item.lojaId) ?? []).push(item);
  }

  const lojaResumos = opts.lojas.map((loja) =>
    buildLojaResumo({
      loja,
      items: itemsByLoja.get(loja.id) ?? [],
      atraso: atrasoByLoja.has(loja.id) ? (atrasoByLoja.get(loja.id) ?? null) : null,
      prevItems: opts.prevItems ? (prevByLoja.get(loja.id) ?? []) : null,
      prevAtraso: prevAtrasoByLoja.has(loja.id)
        ? (prevAtrasoByLoja.get(loja.id) ?? null)
        : null,
      temDadosAnterior: opts.temDadosAnterior,
    }),
  );

  const redeCounts = countByCategoria(opts.items);
  const redePrevCounts = opts.prevItems ? countByCategoria(opts.prevItems) : null;
  const { soma: redeAtrasoSoma, lojasSemNumero } = somaAtrasos(
    opts.lojas.map((l) => ({
      lojaId: l.id,
      quantidade: atrasoByLoja.has(l.id) ? (atrasoByLoja.get(l.id) ?? null) : null,
    })),
  );
  const redeAtraso =
    lojasSemNumero.length === opts.lojas.length && opts.lojas.length > 0
      ? null
      : redeAtrasoSoma;
  const prevSoma = opts.prevAtrasos
    ? somaAtrasos(
        opts.lojas.map((l) => ({
          lojaId: l.id,
          quantidade: prevAtrasoByLoja.has(l.id)
            ? (prevAtrasoByLoja.get(l.id) ?? null)
            : null,
        })),
      )
    : null;
  const redePrevAtraso = !opts.temDadosAnterior
    ? null
    : prevSoma && prevSoma.lojasSemNumero.length === opts.lojas.length
      ? null
      : (prevSoma?.soma ?? 0);

  const totaisColuna: Record<string, number | null> = {};
  for (const cat of TODAS_CATEGORIAS) {
    if (cat === 'PEDIDO_ATRASADO') {
      totaisColuna[cat] = redeAtraso;
    } else {
      totaisColuna[cat] = redeCounts[cat] ?? 0;
    }
  }

  const matrizLojas = lojaResumos.map((r) => {
    const valores: Record<string, number | null> = {};
    for (const row of r.resumo) {
      valores[row.categoria] = row.quantidade;
    }
    return {
      lojaId: r.lojaId,
      lojaNome: r.lojaNome,
      valores,
      total: r.total,
    };
  });

  const rankingLojas = [...lojaResumos]
    .map((r) => ({
      lojaId: r.lojaId,
      lojaNome: r.lojaNome,
      total: r.total,
      ocorrencias: r.ocorrencias,
      atrasos: r.atrasos,
    }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return a.lojaNome.localeCompare(b.lojaNome, 'pt-BR');
    });

  const destaques = destaquesDaAta(opts.items);
  const destaquesPorLoja: RedeResumoAta['destaquesPorLoja'] = [];
  for (const loja of opts.lojas) {
    const items = destaques.filter((d) => d.lojaId === loja.id);
    if (items.length) {
      destaquesPorLoja.push({
        lojaId: loja.id,
        lojaNome: displayLojaAta(loja.nome),
        items,
      });
    }
  }

  return {
    resumo: resumoCategorias({
      counts: redeCounts,
      atraso: redeAtraso,
      prevCounts: redePrevCounts,
      prevAtraso: redePrevAtraso,
      temDadosAnterior: opts.temDadosAnterior,
    }),
    matriz: {
      lojas: matrizLojas,
      totaisColuna,
      totalGeral: opts.items.length + (redeAtraso ?? 0),
    },
    rankingLojas,
    motoboys: rankMotoboys(opts.items),
    destaquesPorLoja,
    lojasSemAtraso: lojasSemNumero.map((id) => {
      const loja = opts.lojas.find((l) => l.id === id);
      return loja ? displayLojaAta(loja.nome) : id;
    }),
  };
}

export function quebraCategoriaLabel(porCategoria: Record<string, number>): string {
  return Object.entries(porCategoria)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([c, n]) => `${categoriaLabel(c)} ${n}`)
    .join(', ');
}

export function canalAtaLabel(canal: string | null): string {
  if (canal === 'IFOOD') return 'iFood';
  if (canal === 'DELIVERY_DIRETO') return 'Delivery Direto';
  return '';
}
