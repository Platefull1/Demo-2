/**
 * Período de fechamento de ponto usado pelo RH:
 * do dia 28 do mês anterior até o dia 27 do mês da competência.
 *
 * Ex.: competência outubro/2025 → 28/09/2025 a 27/10/2025
 */
export function periodoFechamentoPonto(
  mes: number,
  ano: number,
): { dataInicial: string; dataFinal: string } {
  let mesAnterior = mes - 1;
  let anoAnterior = ano;
  if (mesAnterior < 1) {
    mesAnterior = 12;
    anoAnterior = ano - 1;
  }

  const dataInicial = `${anoAnterior}-${String(mesAnterior).padStart(2, '0')}-28`;
  const dataFinal = `${ano}-${String(mes).padStart(2, '0')}-27`;
  return { dataInicial, dataFinal };
}

/** Formata YYYY-MM-DD → DD/MM/YYYY */
export function formatarDataBR(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

/** Rótulo legível do período, ex.: "28/09/2025 a 27/10/2025" */
export function labelPeriodoFechamentoPonto(mes: number, ano: number): string {
  const { dataInicial, dataFinal } = periodoFechamentoPonto(mes, ano);
  return `${formatarDataBR(dataInicial)} a ${formatarDataBR(dataFinal)}`;
}
