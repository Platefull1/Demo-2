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
import type { DiaSemRegistro } from '@/lib/pontos/resolver-sem-registro';

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
  /** Dias de trabalho sem ponto_registros — aguardam resolução via Secullum. */
  diasSemRegistro: DiaSemRegistro[];
} {
  const registrosPorDia = new Map<string, RegistroDiaRow>();
  for (const r of opts.registros) {
    const ymd = r.data.toISOString().slice(0, 10);
    registrosPorDia.set(ymd, r);
  }

  const dias: Array<{ ymd: string; status: StatusDiaPonto }> = [];
  const diasSemRegistro: DiaSemRegistro[] = [];
  // Faltas confirmadas (FALTA_JUSTIFICADA não gera DSR; FALTA não vem mais de classificarDia
  // diretamente — são resolvidas pelo route após Secullum. Mantemos acumuladores zerados
  // aqui; o route os incrementa após resolução.)
  const faltasMinutos = 0;
  const faltasDias = 0;

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
      // Período histórico → projeta "agora" após o fim para nunca gerar AGUARDANDO.
      // Período em aberto → usa now real; dias futuros viram AGUARDANDO, não FALTA.
      agora: (() => {
        const fimPeriodo = ymdToUtcDate(addDaysYmd(opts.dataFinalYmd, 1));
        const now = new Date();
        return now < fimPeriodo ? now : fimPeriodo;
      })(),
    });

    if (result.status !== 'FORA_VINCULO') {
      dias.push({ ymd: cur, status: result.status });
    }

    // SEM_REGISTRO: dia de trabalho sem batidas → aguarda confirmação Secullum.
    // Não acumula falta nem DSR aqui — o route faz isso após resolução.
    if (result.status === 'SEM_REGISTRO' && vig) {
      diasSemRegistro.push({
        ymd: cur,
        jornadaMinutos: jornadaMinutos(vig.horarioEntrada, vig.horarioSaida),
      });
    }

    cur = addDaysYmd(cur, 1);
  }

  // DSR e minutos serão calculados pelo route após resolução do Secullum.
  // Para períodos sem Secullum (ex.: testes unitários), retorna zerado.
  return {
    faltasMinutos,
    faltasDias,
    faltaDsrMinutos: 0,
    faltaDsrDias: 0,
    faltasHhMm: minutosParaHhMm(faltasMinutos),
    faltaDsrHhMm: minutosParaHhMm(0),
    dias,
    diasSemRegistro,
  };
}

/** Domingo (início da semana BR) que contém o ymd. */
export function domingoDaSemana(ymd: string): string {
  const weekday = new Date(`${ymd}T12:00:00-03:00`).getUTCDay(); // 0=Dom
  return addDaysYmd(ymd, -weekday);
}
