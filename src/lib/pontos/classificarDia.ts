import {
  calendarYmd,
  escalaEhFolgaNoDia,
  escalaSemFolgasCadastradas,
  ymdBrasilia,
} from '@/lib/pontos/escala-dia';

export const TIPOS_AFASTAMENTO = [
  'atestado_medico',
  'acidente_trabalho',
  'licenca_maternidade',
  'licenca_paternidade',
  'afastamento_inss',
] as const;

export type StatusDiaPonto =
  | 'FORA_VINCULO'
  | 'AFASTADO'
  | 'FERIAS'
  | 'SEM_ESCALA'
  | 'FOLGA'
  | 'TRABALHOU_NA_FOLGA'
  | 'AGUARDANDO'
  | 'SEM_REGISTRO'      // dia de trabalho sem ponto_registros; FALTA depende de confirmação Secullum
  | 'FALTA_JUSTIFICADA'
  | 'FALTA'             // confirmado pelo Secullum (via fechamento) ou ocorrência RH futura
  | 'NORMAL'
  | 'PENDENCIA';

export type EscalaVigenteInput = {
  diasFolga: unknown;
  domingoFolga?: string | null;
  horarioEntrada: string;
  horarioSaida: string;
  escala?: string;
};

export type BatidasDia = {
  entrada1?: string | null;
  saida1?: string | null;
  entrada2?: string | null;
  saida2?: string | null;
  entrada3?: string | null;
  saida3?: string | null;
};

export type OcorrenciaDia = {
  tipo: string;
  data?: Date | string | null;
  dataInicioAfastamento?: Date | string | null;
  dataFimAfastamento?: Date | string | null;
  ativo?: boolean;
};

export type ClassificarDiaInput = {
  data: Date;
  /** Admissão — dias anteriores não listam. */
  dataAdmissao?: Date | string | null;
  /** Desligamento opcional — dias posteriores não listam. */
  dataDesligamento?: Date | string | null;
  batidas?: BatidasDia | null;
  escalaVigente?: EscalaVigenteInput | null;
  ocorrencias?: OcorrenciaDia[];
  /** Férias na ficha. */
  dataGozoFerias?: Date | string | null;
  diasFeriasGozados?: number | null;
  statusFerias?: string | null;
  /** Relógio "agora" (testável). Default: new Date(). */
  agora?: Date;
};

export type ClassificarDiaResult = {
  status: StatusDiaPonto;
  motivo: string;
};

function toYmd(value: Date | string): string {
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
    return calendarYmd(new Date(value));
  }
  return calendarYmd(value);
}

function ymdInRange(ymd: string, inicio: string, fimInclusive: string): boolean {
  return ymd >= inicio && ymd <= fimInclusive;
}

function ocorrenciaCobreDia(oc: OcorrenciaDia, ymd: string): boolean {
  if (oc.ativo === false) return false;
  if (TIPOS_AFASTAMENTO.includes(oc.tipo as (typeof TIPOS_AFASTAMENTO)[number])) {
    const ini = oc.dataInicioAfastamento
      ? toYmd(oc.dataInicioAfastamento)
      : oc.data
        ? toYmd(oc.data)
        : null;
    if (!ini) return false;
    const fim = oc.dataFimAfastamento ? toYmd(oc.dataFimAfastamento) : ini;
    return ymdInRange(ymd, ini, fim);
  }
  if (oc.data) return toYmd(oc.data) === ymd;
  return false;
}

function emFerias(input: ClassificarDiaInput, ymd: string): { sim: boolean; motivo: string } | null {
  const gozo = input.dataGozoFerias;
  const dias = input.diasFeriasGozados ?? 0;
  if (gozo && dias > 0) {
    const ini = toYmd(gozo);
    const fimExcl = (() => {
      const d = new Date(`${ini}T00:00:00.000Z`);
      d.setUTCDate(d.getUTCDate() + dias);
      return d.toISOString().slice(0, 10);
    })();
    // [ini, ini+dias)
    if (ymd >= ini && ymd < fimExcl) {
      return { sim: true, motivo: `Férias ${ini} a ${addDaysIso(ini, dias - 1)}` };
    }
    return null;
  }
  if (input.statusFerias === 'gozando') {
    return { sim: true, motivo: 'férias sem datas cadastradas' };
  }
  return null;
}

function addDaysIso(ymd: string, days: number): string {
  const d = new Date(`${ymd}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Conta batidas preenchidas em ordem; ímpares = incompleto. */
export function analisarBatidas(batidas: BatidasDia | null | undefined): {
  temBatidas: boolean;
  completo: boolean;
} {
  if (!batidas) return { temBatidas: false, completo: false };
  const slots = [
    batidas.entrada1,
    batidas.saida1,
    batidas.entrada2,
    batidas.saida2,
    batidas.entrada3,
    batidas.saida3,
  ];
  const filled = slots.filter((s) => s != null && String(s).trim() !== '');
  if (filled.length === 0) return { temBatidas: false, completo: false };
  return { temBatidas: true, completo: filled.length % 2 === 0 };
}

function parseHhMmToMin(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

function minutosAgoraBrasilia(agora: Date): { ymd: string; minutos: number } {
  const ymd = ymdBrasilia(agora);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(agora);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return { ymd, minutos: hour * 60 + minute };
}

/**
 * Classifica um dia de ponto usando escala vigente do Platefull + ocorrências RH.
 * Não altera dados brutos do Secullum.
 */
export function classificarDia(input: ClassificarDiaInput): ClassificarDiaResult {
  const ymd = calendarYmd(input.data);
  const agora = input.agora ?? new Date();

  if (input.dataAdmissao) {
    const adm = toYmd(input.dataAdmissao);
    if (ymd < adm) {
      return { status: 'FORA_VINCULO', motivo: `Antes da admissão (${adm})` };
    }
  }
  if (input.dataDesligamento) {
    const desl = toYmd(input.dataDesligamento);
    if (ymd > desl) {
      return { status: 'FORA_VINCULO', motivo: `Após desligamento (${desl})` };
    }
  }

  const ocorrencias = (input.ocorrencias ?? []).filter((o) => o.ativo !== false);

  const afastamento = ocorrencias.find(
    (o) =>
      TIPOS_AFASTAMENTO.includes(o.tipo as (typeof TIPOS_AFASTAMENTO)[number]) &&
      ocorrenciaCobreDia(o, ymd),
  );
  if (afastamento) {
    return { status: 'AFASTADO', motivo: afastamento.tipo };
  }

  const ferias = emFerias(input, ymd);
  if (ferias?.sim) {
    return { status: 'FERIAS', motivo: ferias.motivo };
  }

  const escala = input.escalaVigente;
  if (!escala || escalaSemFolgasCadastradas(escala)) {
    return {
      status: 'SEM_ESCALA',
      motivo: !escala ? 'Sem vigência de escala na data' : 'diasFolga vazio e domingoFolga nulo',
    };
  }

  const { temBatidas, completo } = analisarBatidas(input.batidas);
  const ehFolga = escalaEhFolgaNoDia(escala, input.data);

  if (ehFolga) {
    if (!temBatidas) return { status: 'FOLGA', motivo: 'Folga na escala RH' };
    return { status: 'TRABALHOU_NA_FOLGA', motivo: 'Batidas em dia de folga' };
  }

  // Dia de trabalho
  if (!temBatidas) {
    const agoraBr = minutosAgoraBrasilia(agora);
    if (agoraBr.ymd === ymd) {
      const entradaMin = parseHhMmToMin(escala.horarioEntrada) ?? 8 * 60;
      if (agoraBr.minutos < entradaMin + 30) {
        return {
          status: 'AGUARDANDO',
          motivo: `Antes de ${escala.horarioEntrada} + 30 min`,
        };
      }
    }

    const faltaJust = ocorrencias.find(
      (o) => o.tipo === 'falta_justificada' && ocorrenciaCobreDia(o, ymd),
    );
    if (faltaJust) {
      return { status: 'FALTA_JUSTIFICADA', motivo: 'Ocorrência falta_justificada' };
    }

    return { status: 'SEM_REGISTRO', motivo: 'Dia de trabalho sem registro Secullum' };
  }

  if (completo) {
    return { status: 'NORMAL', motivo: 'Batidas completas' };
  }
  return { status: 'PENDENCIA', motivo: 'Batidas incompletas ou ímpares' };
}

/** Rótulo curto para badge na UI. */
export const STATUS_DIA_LABEL: Record<StatusDiaPonto, string> = {
  FORA_VINCULO: 'Fora do vínculo',
  AFASTADO: 'Afastado',
  FERIAS: 'Férias',
  SEM_REGISTRO: 'Sem registro',
  SEM_ESCALA: 'Sem escala',
  FOLGA: 'Folga',
  TRABALHOU_NA_FOLGA: 'Trabalhou na folga',
  AGUARDANDO: 'Aguardando',
  FALTA_JUSTIFICADA: 'Falta justificada',
  FALTA: 'Falta',
  NORMAL: 'Normal',
  PENDENCIA: 'Pendência',
};

/** Classificação implícita do Secullum a partir dos flags brutos. */
export function statusSecullumBruto(flags: {
  folga?: boolean;
  compensado?: boolean;
  neutro?: boolean;
}): string {
  if (flags.folga) return 'Folga';
  if (flags.compensado) return 'Compensado';
  if (flags.neutro) return 'Neutro';
  return 'Trabalho';
}

/**
 * Divergência só quando há registro bruto do Secullum no dia.
 * Compara folga Secullum vs classificação Platefull (folga / trabalho / falta).
 */
export function divergenciaSecullum(
  statusPlatefull: StatusDiaPonto,
  flags: { folga?: boolean; compensado?: boolean; neutro?: boolean } | null,
): boolean {
  if (!flags) return false;
  if (
    statusPlatefull === 'FORA_VINCULO' ||
    statusPlatefull === 'AGUARDANDO' ||
    statusPlatefull === 'SEM_ESCALA' ||
    statusPlatefull === 'FERIAS' ||
    statusPlatefull === 'AFASTADO'
  ) {
    return false;
  }

  const secFolga = Boolean(flags.folga);
  const pfFolga =
    statusPlatefull === 'FOLGA' || statusPlatefull === 'TRABALHOU_NA_FOLGA';

  return secFolga !== pfFolga;
}
