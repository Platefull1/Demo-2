import { Prisma, type RhRescisao, type RhFuncionario } from '@prisma/client';
import {
  AVISO_DIAS_CORRIDOS,
  DATA_BASE_CATEGORIA,
  EMPRESA_CONTRATANTE,
  TIPO_RESCISAO_LABELS,
  type RescisaoCatalogItem,
} from '@/lib/rh/rescisao-config';
import { addDaysYmd, todayYmd } from '@/lib/date-ymd';
import type { RescisaoPatchInput, RescisaoFinalizarInput } from '@/lib/rh/rescisao-validation';

/** DATE civil → Date UTC meia-noite (Prisma @db.Date). */
export function ymdToDate(ymd: string): Date {
  return new Date(`${ymd}T00:00:00.000Z`);
}

/** Prisma Date/@db.Date → yyyy-MM-dd (ou null). */
export function dateToYmd(d: Date | null | undefined): string | null {
  if (!d) return null;
  return d.toISOString().slice(0, 10);
}

export function formatYmdBr(ymd: string | null | undefined): string {
  if (!ymd) return '—';
  const [y, m, d] = ymd.split('-');
  if (!y || !m || !d) return '—';
  return `${d}/${m}/${y}`;
}

export type RescisaoItemValor = {
  chave: string;
  descricao: string;
  unidade: RescisaoCatalogItem['unidade'];
  codigo?: string | null;
  valor?: string | number | null;
};

export type FuncionarioSnapshotSource = Pick<
  RhFuncionario,
  'nome' | 'numeroFolha' | 'dataAdmissao' | 'salarioBase'
>;

export function buildSnapshotFromFuncionario(f: FuncionarioSnapshotSource) {
  return {
    empresa: EMPRESA_CONTRATANTE,
    codigoSnapshot: f.numeroFolha?.trim() || null,
    nomeSnapshot: f.nome.trim(),
    dataAdmissaoSnapshot: f.dataAdmissao ? ymdToDate(dateToYmd(f.dataAdmissao)!) : null,
    salarioSnapshot: new Prisma.Decimal(Number(f.salarioBase ?? 0).toFixed(2)),
  };
}

/** Compara snapshot do rascunho com o cadastro atual. */
export function snapshotNeedsRefresh(
  rescisao: Pick<
    RhRescisao,
    'codigoSnapshot' | 'nomeSnapshot' | 'dataAdmissaoSnapshot' | 'salarioSnapshot' | 'empresa'
  >,
  f: FuncionarioSnapshotSource,
): boolean {
  const next = buildSnapshotFromFuncionario(f);
  const admAtual = dateToYmd(rescisao.dataAdmissaoSnapshot);
  const admNovo = dateToYmd(next.dataAdmissaoSnapshot);
  return (
    rescisao.empresa !== next.empresa ||
    (rescisao.codigoSnapshot ?? null) !== next.codigoSnapshot ||
    rescisao.nomeSnapshot !== next.nomeSnapshot ||
    admAtual !== admNovo ||
    Number(rescisao.salarioSnapshot) !== Number(next.salarioSnapshot)
  );
}

export function serializeRescisao(r: RhRescisao) {
  return {
    id: r.id,
    funcionarioId: r.funcionarioId,
    status: r.status,
    empresa: r.empresa,
    codigoSnapshot: r.codigoSnapshot,
    nomeSnapshot: r.nomeSnapshot,
    dataAdmissaoSnapshot: dateToYmd(r.dataAdmissaoSnapshot),
    salarioSnapshot: Number(r.salarioSnapshot),
    dataDesligamento: dateToYmd(r.dataDesligamento)!,
    cumpreAviso: r.cumpreAviso,
    descontaAviso: r.descontaAviso,
    inicioAviso: dateToYmd(r.inicioAviso),
    terminoAviso: dateToYmd(r.terminoAviso),
    possuiEstabilidade: r.possuiEstabilidade,
    tipoEstabilidade: r.tipoEstabilidade,
    foiTransferido: r.foiTransferido,
    empresaOrigem: r.empresaOrigem,
    tipoRescisao: r.tipoRescisao,
    tipoAviso: r.tipoAviso,
    motivo: r.motivo,
    vencimentos: (r.vencimentos as RescisaoItemValor[] | null) ?? [],
    descontos: (r.descontos as RescisaoItemValor[] | null) ?? [],
    criadoPorId: r.criadoPorId,
    finalizadoPorId: r.finalizadoPorId,
    finalizadoEm: r.finalizadoEm?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export function patchDataToPrisma(data: RescisaoPatchInput): Prisma.RhRescisaoUpdateInput {
  const out: Prisma.RhRescisaoUpdateInput = {};

  if (data.dataDesligamento !== undefined) {
    out.dataDesligamento = ymdToDate(data.dataDesligamento);
  }
  if (data.cumpreAviso !== undefined) out.cumpreAviso = data.cumpreAviso;
  if (data.descontaAviso !== undefined) out.descontaAviso = data.descontaAviso;
  if (data.inicioAviso !== undefined) {
    out.inicioAviso = data.inicioAviso ? ymdToDate(data.inicioAviso) : null;
  }
  if (data.terminoAviso !== undefined) {
    out.terminoAviso = data.terminoAviso ? ymdToDate(data.terminoAviso) : null;
  }
  if (data.possuiEstabilidade !== undefined) out.possuiEstabilidade = data.possuiEstabilidade;
  if (data.tipoEstabilidade !== undefined) {
    out.tipoEstabilidade = data.tipoEstabilidade?.trim() || null;
  }
  if (data.foiTransferido !== undefined) out.foiTransferido = data.foiTransferido;
  if (data.empresaOrigem !== undefined) {
    out.empresaOrigem = data.empresaOrigem?.trim() || null;
  }
  if (data.tipoRescisao !== undefined) out.tipoRescisao = data.tipoRescisao;
  if (data.tipoAviso !== undefined) out.tipoAviso = data.tipoAviso;
  if (data.motivo !== undefined) out.motivo = data.motivo?.trim() || null;
  if (data.vencimentos !== undefined) {
    out.vencimentos = data.vencimentos as unknown as Prisma.InputJsonValue;
  }
  if (data.descontos !== undefined) {
    out.descontos = data.descontos as unknown as Prisma.InputJsonValue;
  }

  return out;
}

export function finalizarBodyToPrisma(data: RescisaoFinalizarInput): Prisma.RhRescisaoUpdateInput {
  return {
    dataDesligamento: ymdToDate(data.dataDesligamento),
    cumpreAviso: data.cumpreAviso,
    descontaAviso: data.descontaAviso,
    inicioAviso: data.inicioAviso ? ymdToDate(data.inicioAviso) : null,
    terminoAviso: data.terminoAviso ? ymdToDate(data.terminoAviso) : null,
    possuiEstabilidade: data.possuiEstabilidade,
    tipoEstabilidade: data.possuiEstabilidade
      ? data.tipoEstabilidade?.trim() || null
      : null,
    foiTransferido: data.foiTransferido,
    empresaOrigem: data.foiTransferido ? data.empresaOrigem?.trim() || null : null,
    tipoRescisao: data.tipoRescisao,
    tipoAviso: data.tipoAviso,
    motivo: data.motivo.trim(),
    ...(data.vencimentos !== undefined
      ? { vencimentos: data.vencimentos as unknown as Prisma.InputJsonValue }
      : {}),
    ...(data.descontos !== undefined
      ? { descontos: data.descontos as unknown as Prisma.InputJsonValue }
      : {}),
  };
}

export function tipoRescisaoLabel(
  tipo: keyof typeof TIPO_RESCISAO_LABELS | string | null | undefined,
): string {
  if (!tipo) return '—';
  return TIPO_RESCISAO_LABELS[tipo as keyof typeof TIPO_RESCISAO_LABELS] ?? tipo;
}

export function defaultDataDesligamentoYmd(): string {
  return todayYmd();
}

/** Sugestão: início = desligamento; término = início + 29 dias (30 corridos). */
export function sugerirDatasAviso(dataDesligamentoYmd: string): {
  inicioAviso: string;
  terminoAviso: string;
} {
  const inicioAviso = dataDesligamentoYmd;
  return {
    inicioAviso,
    terminoAviso: addDaysYmd(inicioAviso, AVISO_DIAS_CORRIDOS - 1),
  };
}

/** Tempo de casa em anos/meses/dias até a data de referência (yyyy-MM-dd). */
export function calcTempoDeCasa(
  admissaoYmd: string | null | undefined,
  refYmd: string,
): string {
  if (!admissaoYmd) return '—';
  const [ay, am, ad] = admissaoYmd.split('-').map(Number);
  const [ry, rm, rd] = refYmd.split('-').map(Number);
  if (!ay || !am || !ad || !ry || !rm || !rd) return '—';

  let years = ry - ay;
  let months = rm - am;
  let days = rd - ad;

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(Date.UTC(ry, rm - 1, 0)).getUTCDate();
    days += prevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) return '—';

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
  if (days > 0 || parts.length === 0) {
    parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);
  }
  return parts.join(', ');
}

/** Dias corridos entre admissão e referência (para sugestão de experiência). */
export function diasDeCasa(
  admissaoYmd: string | null | undefined,
  refYmd: string,
): number | null {
  if (!admissaoYmd) return null;
  const a = new Date(`${admissaoYmd}T00:00:00.000Z`).getTime();
  const b = new Date(`${refYmd}T00:00:00.000Z`).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return null;
  return Math.floor((b - a) / 86_400_000);
}

/**
 * Destaca lembrete de indenização adicional quando:
 * tipo = dispensa sem justa causa E data-base configurada E
 * desligamento nos 30 dias anteriores à data-base do ano do desligamento.
 */
export function deveDestacarIndenizacaoAdicional(
  tipoRescisao: string | null | undefined,
  dataDesligamentoYmd: string | null | undefined,
): boolean {
  if (tipoRescisao !== 'DISPENSA_SEM_JUSTA_CAUSA') return false;
  if (!DATA_BASE_CATEGORIA || !dataDesligamentoYmd) return false;

  const [y, m, d] = dataDesligamentoYmd.split('-').map(Number);
  if (!y || !m || !d) return false;

  const deslig = new Date(Date.UTC(y, m - 1, d));
  let base = new Date(Date.UTC(y, DATA_BASE_CATEGORIA.mes - 1, DATA_BASE_CATEGORIA.dia));
  // Se a data-base do ano já passou antes do desligamento... na verdade
  // "30 dias antes da data-base" usa a próxima data-base do ano do desligamento
  // (ou do ano seguinte se desligamento for após a data-base).
  if (deslig > base) {
    base = new Date(Date.UTC(y + 1, DATA_BASE_CATEGORIA.mes - 1, DATA_BASE_CATEGORIA.dia));
  }
  const diffDays = Math.floor((base.getTime() - deslig.getTime()) / 86_400_000);
  return diffDays >= 0 && diffDays <= 30;
}
