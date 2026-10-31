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
  anterior: number | null;
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
      anterior,
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
      nome: formatNomePessoa(item.motoboyNome || 'Motoboy sem cadastro'),
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

const PARTICULAS_NOME = new Set(['da', 'das', 'de', 'do', 'dos', 'e']);

/** Padroniza "JOÃO DA SILVA" / "joão da silva" → "João da Silva". */
export function formatNomePessoa(nome: string): string {
  return nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part, i) => {
      const lower = part.toLocaleLowerCase('pt-BR');
      if (i > 0 && PARTICULAS_NOME.has(lower)) return lower;
      return lower.charAt(0).toLocaleUpperCase('pt-BR') + lower.slice(1);
    })
    .join(' ');
}

function pareceEmail(valor: string): boolean {
  return /\S+@\S+\.\S+/.test(valor);
}

/** Nome da empresa do tenant/RH. Nunca e-mail; vazio se não houver cadastro. */
export function nomeEmpresaAta(user: {
  name?: string | null;
  fullName?: string | null;
  email?: string | null;
} | null): string {
  for (const raw of [user?.name, user?.fullName]) {
    const v = raw?.trim() ?? '';
    if (v && !pareceEmail(v)) return v;
  }
  return '';
}

function rotuloContagem(n: number, singular: string, plural: string): string {
  return n === 1 ? singular : plural;
}

/** Texto da seção "Total de ocorrências" (sem "(s)"). */
export function totalOcorrenciasTexto(
  ocorrencias: number,
  atrasos: number | null,
): string {
  const oc = rotuloContagem(
    ocorrencias,
    'ocorrência registrada',
    'ocorrências registradas',
  );
  if (atrasos === null) {
    return `Total: ${ocorrencias} ${oc}. Pedidos atrasados: não informado.`;
  }
  const at = rotuloContagem(atrasos, 'pedido atrasado', 'pedidos atrasados');
  return `Total: ${ocorrencias + atrasos} — ${ocorrencias} ${oc} + ${atrasos} ${at}.`;
}

export const TOP_MOTOBOYS_ATA = 6;

/** Pedido atrasado primeiro; demais por quantidade DESC; Outros sempre por último. */
export function ordenarCategoriasPainel(resumo: ResumoCategoria[]): ResumoCategoria[] {
  const atrasado = resumo.filter((r) => r.categoria === 'PEDIDO_ATRASADO');
  const outros = resumo.filter((r) => r.categoria === 'OUTROS');
  const meio = resumo
    .filter((r) => r.categoria !== 'PEDIDO_ATRASADO' && r.categoria !== 'OUTROS')
    .sort((a, b) => {
      const qa = a.quantidade ?? 0;
      const qb = b.quantidade ?? 0;
      if (qb !== qa) return qb - qa;
      return a.label.localeCompare(b.label, 'pt-BR');
    });
  return [...atrasado, ...meio, ...outros];
}

export function motoboysPainel(motoboys: MotoboyAtaRow[]): {
  visiveis: MotoboyAtaRow[];
  restoLabel: string | null;
  vazio: boolean;
} {
  const visiveis = motoboys.slice(0, TOP_MOTOBOYS_ATA);
  const resto = motoboys.slice(TOP_MOTOBOYS_ATA);
  let restoLabel: string | null = null;
  if (resto.length > 0) {
    const todosUm = resto.every((m) => m.total === 1);
    const n = resto.length;
    const moto = n === 1 ? 'motoboy' : 'motoboys';
    restoLabel = todosUm ? `+ ${n} ${moto} com 1 ocorrência` : `+ ${n} ${moto}`;
  }
  return { visiveis, restoLabel, vazio: motoboys.length === 0 };
}

export function quebraCategoriaDetalhe(porCategoria: Record<string, number>): string {
  return Object.entries(porCategoria)
    .filter(([, n]) => n > 0)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return categoriaLabel(a[0]).localeCompare(categoriaLabel(b[0]), 'pt-BR');
    })
    .map(([c, n]) => `${categoriaLabel(c)} ${n}`)
    .join(' · ');
}

export type TomVariacao = 'up' | 'down' | 'flat' | 'none';

export function variacaoPainel(
  atual: number | null,
  anterior: number | null,
  temDadosAnterior: boolean,
  mesAnteriorNome?: string,
): {
  tom: TomVariacao;
  delta: number | null;
  cabecalho: string;
  indicador: string;
} {
  if (!temDadosAnterior || anterior === null || atual === null) {
    return { tom: 'none', delta: null, cabecalho: '', indicador: '' };
  }
  const delta = atual - anterior;
  const mes = mesAnteriorNome ?? 'mês anterior';
  if (delta === 0) {
    return { tom: 'flat', delta: 0, cabecalho: 'estável', indicador: '=' };
  }
  if (delta > 0) {
    return {
      tom: 'up',
      delta,
      cabecalho: `▲ ${delta} vs. ${mes}`,
      indicador: `+${delta}`,
    };
  }
  return {
    tom: 'down',
    delta,
    cabecalho: `▼ ${Math.abs(delta)} vs. ${mes}`,
    indicador: `−${Math.abs(delta)}`,
  };
}

export function avisoPainelAta(opts: {
  mesNome: string;
  atrasosNaoInformados: boolean;
  temDadosAnterior: boolean;
  lojasSemAtraso?: string[];
}): string | null {
  const parts: string[] = [];
  if (opts.atrasosNaoInformados) {
    if (opts.lojasSemAtraso?.length) {
      parts.push(
        `o número de pedidos atrasados de ${opts.mesNome} ainda não foi informado em ${opts.lojasSemAtraso.join(', ')}.`,
      );
    } else {
      parts.push(
        `o número de pedidos atrasados de ${opts.mesNome} ainda não foi informado.`,
      );
    }
  }
  if (!opts.temDadosAnterior) {
    parts.push(
      'comparação com o mês anterior disponível a partir do próximo mês.',
    );
  }
  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0]!;
  return `${parts[0]!.replace(/\.$/, '')} e a comparação com o mês anterior estará disponível a partir do próximo mês.`;
}
