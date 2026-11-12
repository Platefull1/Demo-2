import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { describe, it } from 'node:test';
import { exportarFechamentoXlsx } from './exportar-fechamento';
import type { LinhaFechamento } from './fechamento';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx-js-style') as typeof import('xlsx-js-style');

function linha(partial: Partial<LinhaFechamento> & Pick<LinhaFechamento, 'nome' | 'secao'>): LinhaFechamento {
  return {
    estoqueInsumoId: partial.estoqueInsumoId || 'id',
    nome: partial.nome,
    secao: partial.secao,
    unidade: partial.unidade || 'KG',
    ordem: partial.ordem ?? 0,
    estoqueInicial: partial.estoqueInicial ?? 0,
    custoMedioInicial: partial.custoMedioInicial ?? 10,
    custoOrigemInicial: partial.custoOrigemInicial ?? 'NF',
    custoOrigemDetalheInicial: partial.custoOrigemDetalheInicial ?? null,
    comprasQtd: partial.comprasQtd ?? 0,
    comprasValor: partial.comprasValor ?? 0,
    comprasPorSemana: partial.comprasPorSemana ?? {
      1: { qtd: 0, valor: 0 },
      2: { qtd: 0, valor: 0 },
      3: { qtd: 0, valor: 0 },
      4: { qtd: 0, valor: 0 },
      5: { qtd: 0, valor: 0 },
    },
    transfEnviadaQtd: partial.transfEnviadaQtd ?? 0,
    transfEnviadaValor: partial.transfEnviadaValor ?? 0,
    transfRecebidaQtd: partial.transfRecebidaQtd ?? 0,
    transfRecebidaValor: partial.transfRecebidaValor ?? 0,
    desperdicioQtd: partial.desperdicioQtd ?? 0,
    desperdicioValor: partial.desperdicioValor ?? 0,
    estoqueFinal: partial.estoqueFinal ?? 0,
    custoMedioFinal: partial.custoMedioFinal ?? 10,
    custoOrigemFinal: partial.custoOrigemFinal ?? 'NF',
    custoOrigemDetalheFinal: partial.custoOrigemDetalheFinal ?? null,
    consumoQtd: partial.consumoQtd ?? 0,
    consumoValor: partial.consumoValor ?? 0,
  };
}

describe('exportarFechamentoXlsx', () => {
  it('gera Resumo + Consumo; Atenção só com itens; Transferências só se houver', () => {
    const buf = exportarFechamentoXlsx({
      storeSlug: 'ahu',
      competencia: '2026-10',
      status: 'ABERTO',
      linhas: [
        linha({
          nome: 'Filé',
          secao: 'MATERIA_PRIMA',
          consumoQtd: 10,
          consumoValor: 900,
        }),
        linha({
          nome: 'Zerado',
          secao: 'MATERIA_PRIMA',
          consumoQtd: 0,
          consumoValor: 0,
        }),
      ],
      vendaMes: 10000,
      vendaMesDetalhe: {
        vendaBruta: 12000,
        taxaEntregaExcluida: 1000,
        consumoInterno: 500,
        creditosExcluidos: 500,
        vendaLiquida: 10000,
        calculadoEm: '2026-11-01T12:00:00.000Z',
        limiteTaxa: 6.99,
        taxasAcimaLimiteDistintas: [],
        jantasComValor: [],
        formasDesconhecidas: [],
        ajusteVenda: null,
      },
      ajustes: [{ secao: 'MATERIA_PRIMA', descricao: 'Correção', valor: -50 }],
      cmvMp: { valor: 900, pct: 0.09 },
      cmvEmbalagens: { valor: 0, pct: 0 },
      cmvBebidas: { valor: 0, pct: 0 },
      cmvTotal: { valor: 900, pct: 0.09 },
      semEstoqueFinal: true,
      pendencias: [{ tipo: 'ESTOQUE_FINAL', mensagem: 'Sem estoque final' }],
      transferencias: [],
    });

    const wb = XLSX.read(buf, { type: 'buffer' });
    assert.deepEqual(wb.SheetNames, ['Resumo', 'Consumo']);
    const resumo = XLSX.utils.sheet_to_json<string[]>(wb.Sheets.Resumo, {
      header: 1,
    });
    const flat = resumo.flat().map(String);
    assert.ok(flat.some((c) => c.includes('CMV PARCIAL')));
    assert.ok(flat.some((c) => c.includes('Pontos de atenção: nenhum')));
    assert.ok(flat.some((c) => c.includes('Total dos ajustes')));
    assert.ok(flat.some((c) => c === 'Venda bruta'));
    assert.ok(flat.some((c) => String(c).includes('Taxas entrega')));
    assert.ok(flat.some((c) => String(c).includes('Consumo interno')));
    assert.ok(flat.some((c) => String(c).includes('Créditos')));
    assert.ok(flat.some((c) => String(c).includes('Venda líquida')));
  });

  it('inclui aba Atenção para consumo negativo / custo pendente', () => {
    const buf = exportarFechamentoXlsx({
      storeSlug: 'ahu',
      competencia: '2026-10',
      linhas: [
        linha({
          nome: 'Negativo',
          secao: 'BEBIDA',
          consumoQtd: -2,
          consumoValor: -40,
        }),
        linha({
          nome: 'Sem custo',
          secao: 'EMBALAGEM',
          estoqueInicial: 5,
          custoOrigemInicial: 'PENDENTE',
          consumoQtd: 1,
          consumoValor: 0,
        }),
      ],
      vendaMes: null,
      ajustes: [],
    });
    const wb = XLSX.read(buf, { type: 'buffer' });
    assert.ok(wb.SheetNames.includes('Atenção'));
    const aten = XLSX.utils.sheet_to_json<string[]>(wb.Sheets['Atenção'], {
      header: 1,
    });
    const tipos = aten.map((row) => row[0]).filter(Boolean);
    assert.ok(tipos.some((t) => String(t).includes('Consumo negativo')));
    assert.ok(tipos.some((t) => String(t).includes('Custo pendente')));
  });
});
