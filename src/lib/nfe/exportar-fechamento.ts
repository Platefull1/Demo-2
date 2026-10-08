/**
 * Exporta fechamento CMV Real para XLSX.
 */

import * as XLSX from 'xlsx';
import type { LinhaFechamento } from './fechamento';
import { storeLabel } from './lojas';

export function exportarFechamentoXlsx(params: {
  storeSlug: string;
  competencia: string;
  linhas: LinhaFechamento[];
  vendaMes: number | null;
  ajustes: Array<{ secao: string; descricao: string; valor: number }>;
}): Buffer {
  const rows = params.linhas.map((l) => ({
    Seção: l.secao,
    Produto: l.nome,
    Unidade: l.unidade,
    'Estoque inicial': l.estoqueInicial,
    'Compras qtd': l.comprasQtd,
    'Compras R$': l.comprasValor,
    'Sem 1 qtd': l.comprasPorSemana[1].qtd,
    'Sem 2 qtd': l.comprasPorSemana[2].qtd,
    'Sem 3 qtd': l.comprasPorSemana[3].qtd,
    'Sem 4 qtd': l.comprasPorSemana[4].qtd,
    'Sem 5 qtd': l.comprasPorSemana[5].qtd,
    'Transf. enviada qtd': l.transfEnviadaQtd,
    'Transf. enviada R$': l.transfEnviadaValor,
    'Transf. recebida qtd': l.transfRecebidaQtd,
    'Transf. recebida R$': l.transfRecebidaValor,
    'Desperdício qtd': l.desperdicioQtd,
    'Estoque final': l.estoqueFinal,
    'Consumo qtd': l.consumoQtd,
    'Consumo R$': l.consumoValor,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Fechamento');

  const resumo = [
    { Campo: 'Loja', Valor: storeLabel(params.storeSlug) },
    { Campo: 'Competência', Valor: params.competencia },
    {
      Campo: 'Venda/mês',
      Valor: params.vendaMes != null ? params.vendaMes : '',
    },
    ...params.ajustes.map((a, i) => ({
      Campo: `Ajuste ${i + 1} (${a.secao})`,
      Valor: `${a.descricao}: ${a.valor}`,
    })),
  ];
  const ws2 = XLSX.utils.json_to_sheet(resumo);
  XLSX.utils.book_append_sheet(wb, ws2, 'Resumo');

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}
