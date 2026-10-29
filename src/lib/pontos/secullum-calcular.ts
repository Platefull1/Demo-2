import type { BatidasAdicional } from '@/lib/pontos/adicional-noturno';
import { hhmmToMinutos } from '@/lib/pontos/escala-dia';

export type SecullumCalcularBody = {
  Colunas?: string[];
  Linhas?: Array<{ Key?: string; Value?: unknown[] }>;
  Totais?: unknown[];
};

export type SecullumTotais = {
  ex60: string;
  ex100: string;
  en60: string;
  en100: string;
  atraso: string;
  faltas: string;
  faltaDsr: string;
  notTot: string;
};

export type BatidasTratadasDia = BatidasAdicional & {
  ymd: string;
  notTot: string | null;
};

const COLUNA_TOTAIS: Record<Exclude<keyof SecullumTotais, 'notTot'>, string[]> = {
  ex60: ['ex 60', 'ex60', 'he 60% diurna', 'he60% diurna', 'he 60'],
  ex100: ['ex 100', 'ex100', 'he 100% diurna', 'he100% diurna', 'he 100'],
  en60: ['en 60', 'en60', 'he 60% noturna', 'he60% noturna', 'en60% noturna'],
  en100: ['en 100', 'en100', 'he 100% noturna', 'he100% noturna', 'en100% noturna'],
  atraso: ['atras', 'atraso'],
  faltas: ['faltas', 'horas faltas', 'falta hora'],
  faltaDsr: ['dsr', 'falta dsr', 'horas falta dsr'],
};

const PARES_BATIDA: Array<{
  entrada: keyof BatidasAdicional;
  saida: keyof BatidasAdicional;
  aliasesE: string[];
  aliasesS: string[];
}> = [
  { entrada: 'entrada1', saida: 'saida1', aliasesE: ['entrada 1', 'entrada1'], aliasesS: ['saida 1', 'saida1'] },
  { entrada: 'entrada2', saida: 'saida2', aliasesE: ['entrada 2', 'entrada2'], aliasesS: ['saida 2', 'saida2'] },
  { entrada: 'entrada3', saida: 'saida3', aliasesE: ['entrada 3', 'entrada3'], aliasesS: ['saida 3', 'saida3'] },
  { entrada: 'entrada4', saida: 'saida4', aliasesE: ['entrada 4', 'entrada4'], aliasesS: ['saida 4', 'saida4'] },
  { entrada: 'entrada5', saida: 'saida5', aliasesE: ['entrada 5', 'entrada5'], aliasesS: ['saida 5', 'saida5'] },
];

function stripDiacritics(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '');
}

function normCol(s: string): string {
  return stripDiacritics(s).toLowerCase().trim();
}

function normCompact(s: string): string {
  return normCol(s).replace(/\s+/g, '');
}

/** Match por includes (totais Ex/EN/Faltas) — mesma ideia de encontrarIndice do gerar. */
export function encontrarIndice(colunas: string[], termos: string[]): number {
  for (let i = 0; i < colunas.length; i++) {
    const col = normCol(colunas[i]);
    for (const t of termos) {
      if (col.includes(normCol(t))) return i;
    }
  }
  return -1;
}

/**
 * Match exato (sem acento, sem espaço) para não confundir "Not." com "Not.Tot."
 * nem "Entrada 1" com "Entrada 11".
 */
export function indiceColunaExata(colunas: string[], aliases: string[]): number {
  const compactAliases = aliases.map(normCompact);
  for (let i = 0; i < colunas.length; i++) {
    const c = normCompact(colunas[i]);
    if (compactAliases.includes(c)) return i;
  }
  return -1;
}

/** HH:mm de relógio (00:00–23:59). FOLGA / FALTA D / FERIADO / vazio → null. */
export function parseHorarioHhMm(raw: unknown): string | null {
  if (raw == null) return null;
  const t = String(raw).trim();
  if (t === '') return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, '0')}:${m[2]}`;
}

/** Duração HH:mm (horas podem passar de 24, ex.: 50:22). */
export function parseDuracaoHhMm(raw: unknown): string | null {
  if (raw == null) return null;
  const t = String(raw).trim();
  if (t === '') return null;
  const m = /^(\d{1,3}):(\d{2})$/.exec(t);
  if (!m) return null;
  if (Number(m[2]) > 59) return null;
  return `${String(Number(m[1])).padStart(2, '0')}:${m[2]}`;
}

function cell(values: unknown[] | undefined, idx: number): unknown {
  if (!values || idx < 0 || idx >= values.length) return null;
  return values[idx];
}

function linhaYmd(key: unknown): string | null {
  const s = String(key ?? '');
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(s);
  return m ? m[1] : null;
}

export function parsearTotaisCalcular(data: SecullumCalcularBody): SecullumTotais {
  const colunas = data.Colunas ?? [];
  const totais = data.Totais ?? [];
  const get = (campo: Exclude<keyof SecullumTotais, 'notTot'>): string => {
    const idx = encontrarIndice(colunas, COLUNA_TOTAIS[campo]);
    if (idx === -1) return '';
    return (totais[idx] ?? '').toString().trim();
  };
  const idxNotTot = indiceColunaExata(colunas, ['not.tot.', 'not.tot', 'not tot']);
  const notTot = idxNotTot === -1 ? '' : String(totais[idxNotTot] ?? '').trim();
  return {
    ex60: get('ex60'),
    ex100: get('ex100'),
    en60: get('en60'),
    en100: get('en100'),
    atraso: get('atraso'),
    faltas: get('faltas'),
    faltaDsr: get('faltaDsr'),
    notTot,
  };
}

export function parsearLinhasCalcular(data: SecullumCalcularBody): BatidasTratadasDia[] {
  const colunas = data.Colunas ?? [];
  const idxs = PARES_BATIDA.map((p) => ({
    e: indiceColunaExata(colunas, p.aliasesE),
    s: indiceColunaExata(colunas, p.aliasesS),
    entrada: p.entrada,
    saida: p.saida,
  }));
  const idxNotTot = indiceColunaExata(colunas, ['not.tot.', 'not.tot', 'not tot']);

  const out: BatidasTratadasDia[] = [];
  for (const linha of data.Linhas ?? []) {
    const ymd = linhaYmd(linha.Key);
    if (!ymd) continue;
    const values = linha.Value ?? [];
    const batidas: BatidasAdicional = {};
    for (const p of idxs) {
      batidas[p.entrada] = p.e === -1 ? null : parseHorarioHhMm(cell(values, p.e));
      batidas[p.saida] = p.s === -1 ? null : parseHorarioHhMm(cell(values, p.s));
    }
    out.push({
      ymd,
      ...batidas,
      notTot: idxNotTot === -1 ? null : parseDuracaoHhMm(cell(values, idxNotTot)),
    });
  }
  return out;
}

export function notTotPorDiaMap(linhas: BatidasTratadasDia[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const l of linhas) {
    m.set(l.ymd, l.notTot ? hhmmToMinutos(l.notTot) : 0);
  }
  return m;
}
