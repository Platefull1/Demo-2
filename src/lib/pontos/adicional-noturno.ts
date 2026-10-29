/**
 * Adicional noturno (horas noturnas DENTRO da jornada prevista).
 * 100% local: batidas PontoRegistro × escala RhEscalaVigencia.
 * Não usa Secullum Calcular. EN 60%/100% (HE noturna extra) é outro campo.
 */

export const JANELA_NOTURNA_INICIO = '22:00';
export const JANELA_NOTURNA_FIM = '05:00';
export const APLICAR_HORA_REDUZIDA = true;

/** Fator CLT da hora noturna reduzida: 52min30s de relógio = 60min considerados. */
const FATOR_HORA_REDUZIDA = 60 / 52.5;

export type IntervaloMinutos = { ini: number; fim: number };

export type BatidasAdicional = {
  entrada1?: string | null;
  saida1?: string | null;
  entrada2?: string | null;
  saida2?: string | null;
  entrada3?: string | null;
  saida3?: string | null;
};

export type StatusAdicionalNoturno = 'OK' | 'FOLGA' | 'SEM_BATIDAS' | 'PENDENCIA';

export type ResultadoAdicionalNoturnoDia = {
  minutosRelogio: number;
  minutosConsiderados: number;
  status: StatusAdicionalNoturno;
};

const PARES = [
  ['entrada1', 'saida1'],
  ['entrada2', 'saida2'],
  ['entrada3', 'saida3'],
] as const;

function parseHhMmToMin(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

function slotPreenchido(v: string | null | undefined): boolean {
  return v != null && String(v).trim() !== '';
}

/** Interseção de intervalos meio-abertos [ini, fim). Null se vazia ou degenerada. */
export function intersecaoIntervalos(
  a: IntervaloMinutos,
  b: IntervaloMinutos,
): IntervaloMinutos | null {
  const ini = Math.max(a.ini, b.ini);
  const fim = Math.min(a.fim, b.fim);
  if (fim <= ini) return null;
  return { ini, fim };
}

export function minutosIntersecao(a: IntervaloMinutos, b: IntervaloMinutos): number {
  const x = intersecaoIntervalos(a, b);
  return x ? x.fim - x.ini : 0;
}

/** Soma das interseções de cada intervalo de `as` com cada um de `bs`. */
export function somaIntersecoes(as: IntervaloMinutos[], bs: IntervaloMinutos[]): number {
  let total = 0;
  for (const a of as) {
    for (const b of bs) {
      total += minutosIntersecao(a, b);
    }
  }
  return total;
}

function recortar(intervalos: IntervaloMinutos[], clip: IntervaloMinutos): IntervaloMinutos[] {
  const out: IntervaloMinutos[] = [];
  for (const i of intervalos) {
    const x = intersecaoIntervalos(i, clip);
    if (x) out.push(x);
  }
  return out;
}

/**
 * Converte HH:mm numa linha do tempo contínua.
 * Qualquer horário menor que o anterior preenchido recebe +1440 (virada da meia-noite).
 */
export function horariosParaTimeline(valores: Array<string | null | undefined>): Array<number | null> {
  let prev = Number.NEGATIVE_INFINITY;
  return valores.map((v) => {
    if (!slotPreenchido(v)) return null;
    const base = parseHhMmToMin(String(v));
    if (base === null) return null;
    let t = base;
    while (t < prev) t += 1440;
    prev = t;
    return t;
  });
}

function janelasNoturnas(): IntervaloMinutos[] {
  const ini = parseHhMmToMin(JANELA_NOTURNA_INICIO) ?? 22 * 60;
  const fim = parseHhMmToMin(JANELA_NOTURNA_FIM) ?? 5 * 60;
  return [
    { ini, fim: fim + 1440 },
    { ini: ini - 1440, fim },
  ];
}

function jornadaPrevista(horarioEntrada: string, horarioSaida: string): IntervaloMinutos | null {
  const e = parseHhMmToMin(horarioEntrada);
  const s = parseHhMmToMin(horarioSaida);
  if (e === null || s === null) return null;
  const fim = s <= e ? s + 1440 : s;
  if (fim <= e) return null;
  return { ini: e, fim };
}

function zero(status: StatusAdicionalNoturno): ResultadoAdicionalNoturnoDia {
  return { minutosRelogio: 0, minutosConsiderados: 0, status };
}

function aplicarHoraReduzida(minutosRelogio: number): number {
  if (!APLICAR_HORA_REDUZIDA) return minutosRelogio;
  return Math.round(minutosRelogio * FATOR_HORA_REDUZIDA);
}

export function calcularAdicionalNoturnoDia(opts: {
  batidas: BatidasAdicional;
  horarioEntrada: string;
  horarioSaida: string;
  ehFolga: boolean;
}): ResultadoAdicionalNoturnoDia {
  if (opts.ehFolga) return zero('FOLGA');

  const b = opts.batidas;
  const slots: Array<string | null | undefined> = [
    b.entrada1, b.saida1,
    b.entrada2, b.saida2,
    b.entrada3, b.saida3,
  ];
  const preenchidos = slots.filter(slotPreenchido);
  if (preenchidos.length === 0) return zero('SEM_BATIDAS');

  let parIncompleto = false;
  for (const [ek, sk] of PARES) {
    const temE = slotPreenchido(b[ek]);
    const temS = slotPreenchido(b[sk]);
    if (temE !== temS) parIncompleto = true;
  }
  if (preenchidos.length % 2 !== 0 || parIncompleto) return zero('PENDENCIA');

  const timeline = horariosParaTimeline(slots);
  const trabalhados: IntervaloMinutos[] = [];
  for (let i = 0; i < 3; i++) {
    const ini = timeline[i * 2];
    const fim = timeline[i * 2 + 1];
    if (ini == null && fim == null) continue;
    if (ini == null || fim == null || fim <= ini) return zero('PENDENCIA');
    trabalhados.push({ ini, fim });
  }
  if (trabalhados.length === 0) return zero('SEM_BATIDAS');

  const prevista = jornadaPrevista(opts.horarioEntrada, opts.horarioSaida);
  if (!prevista) return zero('OK');

  const naJornada = recortar(trabalhados, prevista);
  const minutosRelogio = somaIntersecoes(naJornada, janelasNoturnas());
  return {
    minutosRelogio,
    minutosConsiderados: aplicarHoraReduzida(minutosRelogio),
    status: 'OK',
  };
}
