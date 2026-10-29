import { classificarDia } from '@/lib/pontos/classificarDia';
import { calcularAdicionalNoturnoDia } from '@/lib/pontos/adicional-noturno';
import {
  addDaysYmd,
  escalaEhFolgaNoDia,
  minutosParaHhMm,
  ymdToUtcDate,
} from '@/lib/pontos/escala-dia';
import { vigenciasParaData } from '@/lib/pontos/escala-vigencia';
import type { RegistroDiaRow, VigenciaRow } from '@/lib/pontos/fechamento-faltas';
import type { OcorrenciaDia } from '@/lib/pontos/classificarDia';

export type ResultadoAdicionalNoturnoPeriodo = {
  adicionalNoturnoMinutos: number;
  adicionalNoturnoHhMm: string;
  diasPendencia: string[];
};

/**
 * Soma o adicional noturno (hora reduzida) de cada dia do período.
 * Ignora FORA_VINCULO / FERIAS / AFASTADO (mesma classificação do ponto).
 * Folga → 0 no dia. Batida ímpar → 0 e ymd em diasPendencia.
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
}): ResultadoAdicionalNoturnoPeriodo {
  const registrosPorDia = new Map<string, RegistroDiaRow>();
  for (const r of opts.registros) {
    registrosPorDia.set(r.data.toISOString().slice(0, 10), r);
  }

  let adicionalNoturnoMinutos = 0;
  const diasPendencia: string[] = [];

  let cur = opts.dataInicialYmd;
  while (cur <= opts.dataFinalYmd) {
    const data = ymdToUtcDate(cur);
    const vig = vigenciasParaData(opts.vigencias, cur);
    const batidas = registrosPorDia.get(cur) ?? null;

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

    if (
      classif.status === 'FORA_VINCULO' ||
      classif.status === 'FERIAS' ||
      classif.status === 'AFASTADO'
    ) {
      cur = addDaysYmd(cur, 1);
      continue;
    }

    if (!vig) {
      cur = addDaysYmd(cur, 1);
      continue;
    }

    const dia = calcularAdicionalNoturnoDia({
      batidas: batidas ?? {},
      horarioEntrada: vig.horarioEntrada,
      horarioSaida: vig.horarioSaida,
      ehFolga: escalaEhFolgaNoDia(vig, data),
    });

    if (dia.status === 'PENDENCIA') {
      diasPendencia.push(cur);
    } else {
      adicionalNoturnoMinutos += dia.minutosConsiderados;
    }

    cur = addDaysYmd(cur, 1);
  }

  return {
    adicionalNoturnoMinutos,
    adicionalNoturnoHhMm: minutosParaHhMm(adicionalNoturnoMinutos),
    diasPendencia,
  };
}
