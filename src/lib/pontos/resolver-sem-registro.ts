/**
 * Resolve dias SEM_REGISTRO via Secullum Calcular.
 *
 * Estratégia de otimização (conforme ajuste solicitado):
 *  1. Se o total de faltas do Secullum no período completo for 00:00, todos os dias
 *     SEM_REGISTRO são mantidos como SEM_REGISTRO — zero chamadas adicionais.
 *  2. Se houver faltas > 0 no período, chama Calcular individualmente por dia para
 *     confirmar quais são falta real e quais são ausência de webhook.
 *  3. SEM_REGISTRO confirmados como tal NÃO geram desconto de DSR.
 */
import { hhmmToMinutos } from '@/lib/pontos/escala-dia';

export type DiaSemRegistro = {
  ymd: string;
  /** Minutos de jornada da vigência nesse dia (para somar se virar FALTA). */
  jornadaMinutos: number;
};

/**
 * Callback que chama POST /Calcular do Secullum para o intervalo [dataInicial, dataFinal].
 * Retorna a string HH:MM do campo "Faltas" (ou "" / "00:00" se nenhuma).
 * Deve lançar erro apenas em falha de rede irrecuperável.
 */
export type CalcularFaltasFn = (dataInicial: string, dataFinal: string) => Promise<string>;

export type ResultadoResolucao = {
  /** Mapa ymd → status resolvido. */
  statusPorDia: Map<string, 'FALTA' | 'SEM_REGISTRO'>;
  /** Minutos extras de falta confirmada (a acrescentar ao total já calculado). */
  faltasExtrasMinutos: number;
  /** ymds de domingos das semanas com nova falta (para cálculo de DSR externo). */
  domingosDasNovasFaltas: string[];
};

/** Domingo da semana BR (Dom–Sáb) que contém o ymd dado. */
function domingoDaSemana(ymd: string): string {
  const weekday = new Date(`${ymd}T12:00:00-03:00`).getUTCDay(); // 0=Dom
  const d = new Date(`${ymd}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - weekday);
  return d.toISOString().slice(0, 10);
}

/**
 * Resolve os dias SEM_REGISTRO usando o total de faltas já obtido do Secullum
 * para o período completo como gate de otimização.
 *
 * @param diasSemRegistro  Lista de dias sem ponto_registros (dia de trabalho)
 * @param faltasPeriodoHhMm  Total de faltas do Secullum no período completo ("08:00", "00:00", "")
 * @param calcularDia  Callback que chama Calcular dia a dia (só acionado se necessário)
 */
export async function resolverSemRegistroDias(opts: {
  diasSemRegistro: DiaSemRegistro[];
  faltasPeriodoHhMm: string;
  calcularDia: CalcularFaltasFn;
}): Promise<ResultadoResolucao> {
  const statusPorDia = new Map<string, 'FALTA' | 'SEM_REGISTRO'>();
  let faltasExtrasMinutos = 0;
  const domingosDasNovasFaltas: string[] = [];
  const domingoSet = new Set<string>();

  if (opts.diasSemRegistro.length === 0) {
    return { statusPorDia, faltasExtrasMinutos, domingosDasNovasFaltas };
  }

  const totalFaltasMin = hhmmToMinutos(opts.faltasPeriodoHhMm);

  // ── Caminho rápido: Secullum não registra nenhuma falta no período ──────────
  if (totalFaltasMin === 0) {
    for (const d of opts.diasSemRegistro) {
      statusPorDia.set(d.ymd, 'SEM_REGISTRO');
    }
    return { statusPorDia, faltasExtrasMinutos, domingosDasNovasFaltas };
  }

  // ── Caminho detalhado: há faltas → chamar Calcular por dia ─────────────────
  for (const d of opts.diasSemRegistro) {
    let ehFalta = false;
    try {
      const faltaHhMm = await opts.calcularDia(d.ymd, d.ymd);
      ehFalta = hhmmToMinutos(faltaHhMm) > 0;
    } catch {
      // Em caso de erro na API, não classificar como FALTA — manter incerteza
      ehFalta = false;
    }

    if (ehFalta) {
      statusPorDia.set(d.ymd, 'FALTA');
      faltasExtrasMinutos += d.jornadaMinutos;
      const dom = domingoDaSemana(d.ymd);
      if (!domingoSet.has(dom)) {
        domingoSet.add(dom);
        domingosDasNovasFaltas.push(dom);
      }
    } else {
      statusPorDia.set(d.ymd, 'SEM_REGISTRO');
    }
  }

  return { statusPorDia, faltasExtrasMinutos, domingosDasNovasFaltas };
}
