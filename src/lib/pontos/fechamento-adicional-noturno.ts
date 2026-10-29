import { analisarBatidas, classificarDia } from '@/lib/pontos/classificarDia';
import { calcularAdicionalNoturnoDia } from '@/lib/pontos/adicional-noturno';
import {
  addDaysYmd,
  escalaEhFolgaNoDia,
  hhmmToMinutos,
  minutosParaHhMm,
  ymdToUtcDate,
} from '@/lib/pontos/escala-dia';
import { vigenciasParaData } from '@/lib/pontos/escala-vigencia';
import type { RegistroDiaRow, VigenciaRow } from '@/lib/pontos/fechamento-faltas';
import type { OcorrenciaDia } from '@/lib/pontos/classificarDia';

export type DiaAdicionalNoturno = {
  ymd: string;
  minutosPlatefull: number;
  notTotSecullumMinutos: number | null;
};

export type ResultadoAdicionalNoturnoPeriodo = {
  adicionalNoturnoMinutos: number;
  adicionalNoturnoHhMm: string;
  diasPendencia: string[];
  /** Batidas completas antes da admissão ou sem vigência — não somadas. */
  diasForaVinculo: string[];
  dias: DiaAdicionalNoturno[];
};

/**
 * Soma o adicional noturno (minutos de relógio) de cada dia do período.
 * Ignora FERIAS / AFASTADO. FORA_VINCULO e sem vigência não somam, mas
 * batidas completas nesses dias entram em diasForaVinculo.
 * Folga trabalhada entra. Batida ímpar → 0 e ymd em diasPendencia.
 */
export function calcularAdicionalNoturnoPeriodo(opts: {
  dataInicialYmd: string;
  dataFinalYmd: string;
  dataAdmissao?: Date | string | null;
  dataGozoFerias?: Date | string | null;
  diasFeriasGozados?: number | null;
  statusFerias?: string | null;
  vigencias: VigenciaRow[];
  ocorrencias: OcorrenciaDia[];
  registros: RegistroDiaRow[];
  /** Not.Tot. do Calcular por YYYY-MM-DD (minutos). Opcional, só para conferência. */
  notTotPorDia?: Map<string, number>;
}): ResultadoAdicionalNoturnoPeriodo {
  const registrosPorDia = new Map<string, RegistroDiaRow>();
  for (const r of opts.registros) {
    registrosPorDia.set(r.data.toISOString().slice(0, 10), r);
  }

  let adicionalNoturnoMinutos = 0;
  const diasPendencia: string[] = [];
  const diasForaVinculo: string[] = [];
  const dias: DiaAdicionalNoturno[] = [];

  let cur = opts.dataInicialYmd;
  while (cur <= opts.dataFinalYmd) {
    const data = ymdToUtcDate(cur);
    const vig = vigenciasParaData(opts.vigencias, cur);
    const batidas = registrosPorDia.get(cur) ?? null;
    const notTotSecullumMinutos = opts.notTotPorDia?.has(cur)
      ? (opts.notTotPorDia.get(cur) ?? 0)
      : null;

    const classif = classificarDia({
      data,
      dataAdmissao: opts.dataAdmissao,
      batidas,
      escalaVigente: vig
        ? {
            diasFolga: vig.diasFolga,
            domingoFolga: vig.domingoFolga,
            horarioEntrada: vig.horarioEntrada,
            horarioSaida: vig.horarioSaida,
            escala: vig.escala,
          }
        : null,
      ocorrencias: opts.ocorrencias,
      dataGozoFerias: opts.dataGozoFerias,
      diasFeriasGozados: opts.diasFeriasGozados,
      statusFerias: opts.statusFerias,
      agora: (() => {
        const fimPeriodo = ymdToUtcDate(addDaysYmd(opts.dataFinalYmd, 1));
        const now = new Date();
        return now < fimPeriodo ? now : fimPeriodo;
      })(),
    });

    const { completo } = analisarBatidas(batidas);
    const foraVinculo = classif.status === 'FORA_VINCULO' || !vig;

    if (foraVinculo) {
      if (completo) diasForaVinculo.push(cur);
      dias.push({ ymd: cur, minutosPlatefull: 0, notTotSecullumMinutos });
      cur = addDaysYmd(cur, 1);
      continue;
    }

    if (classif.status === 'FERIAS' || classif.status === 'AFASTADO') {
      dias.push({ ymd: cur, minutosPlatefull: 0, notTotSecullumMinutos });
      cur = addDaysYmd(cur, 1);
      continue;
    }

    const dia = calcularAdicionalNoturnoDia({
      batidas: batidas ?? {},
      horarioEntrada: vig.horarioEntrada,
      horarioSaida: vig.horarioSaida,
      ehFolga: escalaEhFolgaNoDia(vig, data),
    });

    let minutosPlatefull = 0;
    if (dia.status === 'PENDENCIA') {
      diasPendencia.push(cur);
    } else {
      minutosPlatefull = dia.minutosConsiderados;
      adicionalNoturnoMinutos += minutosPlatefull;
    }

    dias.push({ ymd: cur, minutosPlatefull, notTotSecullumMinutos });
    cur = addDaysYmd(cur, 1);
  }

  return {
    adicionalNoturnoMinutos,
    adicionalNoturnoHhMm: minutosParaHhMm(adicionalNoturnoMinutos),
    diasPendencia,
    diasForaVinculo,
    dias,
  };
}

export function diasDivergentesNoturno(
  dias: DiaAdicionalNoturno[],
): Array<{ ymd: string; minutosPlatefull: number; notTotSecullumMinutos: number }> {
  const out: Array<{ ymd: string; minutosPlatefull: number; notTotSecullumMinutos: number }> = [];
  for (const d of dias) {
    if (d.notTotSecullumMinutos == null) continue;
    if (d.minutosPlatefull !== d.notTotSecullumMinutos) {
      out.push({
        ymd: d.ymd,
        minutosPlatefull: d.minutosPlatefull,
        notTotSecullumMinutos: d.notTotSecullumMinutos,
      });
    }
  }
  return out;
}

export function formatarDiferencaHhMm(platefull: string | null, secullum: string | null): string {
  const diff = hhmmToMinutos(platefull) - hhmmToMinutos(secullum);
  const sign = diff > 0 ? '+' : diff < 0 ? '-' : '';
  return `${sign}${minutosParaHhMm(Math.abs(diff))}`;
}
