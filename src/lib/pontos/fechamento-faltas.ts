import {
  classificarDia,
  type BatidasDia,
  type EscalaVigenteInput,
  type OcorrenciaDia,
  type StatusDiaPonto,
} from '@/lib/pontos/classificarDia';
import {
  addDaysYmd,
  jornadaMinutos,
  minutosParaHhMm,
  ymdToUtcDate,
} from '@/lib/pontos/escala-dia';
import { vigenciasParaData } from '@/lib/pontos/escala-vigencia';

export type VigenciaRow = {
  vigenciaInicio: Date;
  vigenciaFim: Date | null;
  diasFolga: unknown;
  domingoFolga: string | null;
  horarioEntrada: string;
  horarioSaida: string;
  escala: string;
};

export type RegistroDiaRow = {
  data: Date;
} & BatidasDia;

/**
 * Agrega faltas injustificadas e perda de DSR (CLT: semana com FALTA perde o DSR).
 * DSR = domingo da semana (dom–sáb) coberta pela falta; horas = jornada da vigência naquele domingo.
 */
export function calcularFaltasEDsrPeriodo(opts: {
  dataInicialYmd: string;
  dataFinalYmd: string;
  dataAdmissao?: Date | string | null;
  dataGozoFerias?: Date | string | null;
  diasFeriasGozados?: number | null;
  statusFerias?: string | null;
  vigencias: VigenciaRow[];
  ocorrencias: OcorrenciaDia[];
  registros: RegistroDiaRow[];
}): {
  faltasMinutos: number;
  faltasDias: number;
  faltaDsrMinutos: number;
  faltaDsrDias: number;
  faltasHhMm: string;
  faltaDsrHhMm: string;
  dias: Array<{ ymd: string; status: StatusDiaPonto }>;
} {
  const registrosPorDia = new Map<string, RegistroDiaRow>();
  for (const r of opts.registros) {
    const ymd = r.data.toISOString().slice(0, 10);
    registrosPorDia.set(ymd, r);
  }

  const dias: Array<{ ymd: string; status: StatusDiaPonto }> = [];
  let faltasMinutos = 0;
  let faltasDias = 0;
  /** chave = ymd do domingo da semana */
  const domingosComFalta = new Set<string>();

  let cur = opts.dataInicialYmd;
  while (cur <= opts.dataFinalYmd) {
    const vig = vigenciasParaData(opts.vigencias, cur);
    const escala: EscalaVigenteInput | null = vig
      ? {
          diasFolga: vig.diasFolga,
          domingoFolga: vig.domingoFolga,
          horarioEntrada: vig.horarioEntrada,
          horarioSaida: vig.horarioSaida,
          escala: vig.escala,
        }
      : null;

    const batidas = registrosPorDia.get(cur) ?? null;
    const result = classificarDia({
      data: ymdToUtcDate(cur),
      dataAdmissao: opts.dataAdmissao,
      batidas,
      escalaVigente: escala,
      ocorrencias: opts.ocorrencias,
      dataGozoFerias: opts.dataGozoFerias,
      diasFeriasGozados: opts.diasFeriasGozados,
      statusFerias: opts.statusFerias,
      // Fora do "hoje" para não gerar AGUARDANDO em fechamento histórico
      agora: ymdToUtcDate(addDaysYmd(opts.dataFinalYmd, 1)),
    });

    if (result.status !== 'FORA_VINCULO') {
      dias.push({ ymd: cur, status: result.status });
    }

    if (result.status === 'FALTA' && vig) {
      const jm = jornadaMinutos(vig.horarioEntrada, vig.horarioSaida);
      faltasMinutos += jm;
      faltasDias += 1;
      domingosComFalta.add(domingoDaSemana(cur));
    }

    cur = addDaysYmd(cur, 1);
  }

  let faltaDsrMinutos = 0;
  let faltaDsrDias = 0;
  for (const domingoYmd of domingosComFalta) {
    // Só conta DSR se o domingo cair no período (ou sempre? CLT: perde o DSR da semana)
    // Contamos mesmo se domingo fora do período de fechamento, desde que a falta esteja no período.
    const vig = vigenciasParaData(opts.vigencias, domingoYmd);
    if (!vig) continue;
    faltaDsrMinutos += jornadaMinutos(vig.horarioEntrada, vig.horarioSaida);
    faltaDsrDias += 1;
  }

  return {
    faltasMinutos,
    faltasDias,
    faltaDsrMinutos,
    faltaDsrDias,
    faltasHhMm: minutosParaHhMm(faltasMinutos),
    faltaDsrHhMm: minutosParaHhMm(faltaDsrMinutos),
    dias,
  };
}

/** Domingo (início da semana BR) que contém o ymd. */
export function domingoDaSemana(ymd: string): string {
  const weekday = new Date(`${ymd}T12:00:00-03:00`).getUTCDay(); // 0=Dom
  return addDaysYmd(ymd, -weekday);
}
