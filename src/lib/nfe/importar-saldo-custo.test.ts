import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';
import { matchNomeProdutoLista } from './match-nome-produto';
import { normalizarDescricao } from './normalize';
import { resolverUmCusto } from './importar-saldo-custo-resolve';
import {
  buscarCustoAgAbasAnteriores,
  parseSaldoDaAba,
  recalcularCustoLinha,
} from './importar-saldo-parse';
import { lerLinhaProduto } from './importar-planilha-secoes';

function setCell(
  ws: XLSX.WorkSheet,
  r: number,
  c: number,
  cell: XLSX.CellObject,
) {
  ws[XLSX.utils.encode_cell({ r, c })] = cell;
}

function setAnchor(ws: XLSX.WorkSheet, r: number, nome: string) {
  setCell(ws, r, 1, { t: 's', v: nome });
  setCell(ws, r, 3, { t: 's', v: 'ESTOQUE INICIAL' });
}

describe('Bug 4 — E vazia não descarta', () => {
  it('CAMARÃO com E vazio e AE=0 entra', () => {
    const ws: XLSX.WorkSheet = {};
    setAnchor(ws, 4, 'MATÉRIA PRIMA');
    setCell(ws, 26, 1, { t: 's', v: 'CAMARÃO' }); // B, sem E
    setCell(ws, 26, 30, { t: 'n', v: 0 }); // AE=0
    setCell(ws, 27, 1, { t: 's', v: 'BERINJELA' });
    setCell(ws, 27, 4, { t: 's', v: 'KG' });
    setCell(ws, 27, 30, { t: 'n', v: 0 });
    ws['!ref'] = 'A1:AG40';

    assert.ok(lerLinhaProduto(ws, 26), 'lerLinhaProduto deve aceitar E vazia');
    const linhas = parseSaldoDaAba(ws);
    const cam = linhas.find((l) => l.nome === 'CAMARÃO');
    assert.ok(cam, 'CAMARÃO deve aparecer na prévia');
    assert.equal(cam!.qtdFinal, 0);
  });
});

describe('Bug 3 — recalcular e ordem de fallback', () => {
  it('recalcula (G+compras)/(D+qtds) = 34,32', () => {
    // 700,04 / 20,4 = 34,315... → 34,32
    const ws: XLSX.WorkSheet = {};
    setCell(ws, 94, 3, { t: 'n', v: 20.4 }); // D
    setCell(ws, 94, 6, { t: 'n', v: 700.04 }); // G
    // sem compras
    const c = recalcularCustoLinha(ws, 94);
    assert.equal(c, 34.32);
  });

  it('recalcula recheio 503,79/21,25 = 23,71', () => {
    const ws: XLSX.WorkSheet = {};
    setCell(ws, 96, 3, { t: 'n', v: 21.25 });
    setCell(ws, 96, 6, { t: 'n', v: 503.79 });
    assert.equal(recalcularCustoLinha(ws, 96), 23.71);
  });

  it('ordem: recalculado antes de outra loja', () => {
    const r = resolverUmCusto({
      nomeProduto: 'LINGUIÇA BLUMENAU',
      custoRecalculado: 34.32,
      estoqueInsumoId: 'x',
      competencia: '2026-09',
      outraLoja: new Map([['x', { custo: 33.9, storeSlug: 'uberaba' }]]),
    });
    assert.equal(r.custoOrigem, 'PLANILHA_RECALCULADO');
    assert.equal(r.custoMedio, 34.32);
    assert.equal(r.custoOrigemDetalhe, 'Planilha (recalculado)');
  });

  it('mês anterior por NOME (não por linha) + aviso >3 meses', () => {
    const wb = XLSX.utils.book_new();

    // FEVEREIRO 2026 — EMBALAGEM ENTRADAS na linha 50
    const fev: XLSX.WorkSheet = {};
    setAnchor(fev, 10, 'EMBALAGENS');
    setCell(fev, 49, 1, { t: 's', v: 'EMBALAGEM ENTRADAS' });
    setCell(fev, 49, 4, { t: 's', v: 'UN' });
    setCell(fev, 49, 30, { t: 'n', v: 10 });
    setCell(fev, 49, 32, { t: 'n', v: 0.18 }); // AG
    fev['!ref'] = 'A1:AG60';
    XLSX.utils.book_append_sheet(wb, fev, 'FEVEREIRO 2026');

    // SETEMBRO 2026 — mesmo produto em outra linha
    const set: XLSX.WorkSheet = {};
    setAnchor(set, 10, 'EMBALAGENS');
    setCell(set, 112, 1, { t: 's', v: 'EMBALAGEM ENTRADAS' });
    setCell(set, 112, 4, { t: 's', v: 'UN' });
    setCell(set, 112, 30, { t: 'n', v: 60 });
    // AG inválido / 0
    setCell(set, 112, 32, { t: 'n', v: 0 });
    set['!ref'] = 'A1:AG120';
    XLSX.utils.book_append_sheet(wb, set, 'SETEMBRO 2026');

    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
    const map = buscarCustoAgAbasAnteriores(buf, '2026-09', [
      'EMBALAGEM ENTRADAS',
    ]);
    const hit = map.get('EMBALAGEM ENTRADAS');
    assert.ok(hit);
    assert.equal(hit!.custo, 0.18);
    assert.equal(hit!.aba, 'FEVEREIRO 2026');
    assert.equal(hit!.custoAntigo, true); // 7 meses

    const r = resolverUmCusto({
      nomeProduto: 'EMBALAGEM ENTRADAS',
      custoRecalculado: null,
      competencia: '2026-09',
      agAnterior: map,
    });
    assert.equal(r.custoOrigem, 'PLANILHA_MES_ANTERIOR');
    assert.equal(r.custoAntigo, true);
    assert.match(r.custoOrigemDetalhe || '', /custo antigo/i);
  });
});

describe('Prévia sintética SETEMBRO/AHU — critérios de aceite', () => {
  it('linhas-chave com match e custo esperados', () => {
    const ws: XLSX.WorkSheet = {};
    setAnchor(ws, 4, 'MATÉRIA PRIMA');

    // 27 CAMARÃO — E vazia, AE=0
    setCell(ws, 26, 1, { t: 's', v: 'CAMARÃO' });
    setCell(ws, 26, 30, { t: 'n', v: 0 });

    // 95 LINGUIÇA — AG=#DIV/0!, D/G para recalcular
    setCell(ws, 94, 1, { t: 's', v: 'LINGUIÇA BLUMENAU' });
    setCell(ws, 94, 4, { t: 's', v: 'KG' });
    setCell(ws, 94, 3, { t: 'n', v: 20.4 });
    setCell(ws, 94, 6, { t: 'n', v: 700.04 });
    setCell(ws, 94, 30, { t: 'n', v: 4 });
    setCell(ws, 94, 32, { t: 'e', v: 0x07, w: '#DIV/0!' });

    // 97 RECHEIO DE MORANGO
    setCell(ws, 96, 1, { t: 's', v: 'RECHEIO DE MORANGO' });
    setCell(ws, 96, 4, { t: 's', v: 'KG' });
    setCell(ws, 96, 3, { t: 'n', v: 21.25 });
    setCell(ws, 96, 6, { t: 'n', v: 503.79 });
    setCell(ws, 96, 30, { t: 'n', v: 17.66 });
    setCell(ws, 96, 32, { t: 'e', v: 0x07, w: '#DIV/0!' });

    setAnchor(ws, 102, 'EMBALAGENS');
    const emb = [
      ['EMBALAGEM 20', 890, 1.27],
      ['EMBALAGEM 25', 560, 1.49],
      ['EMBALAGEM 30', 202, 1.59],
      ['EMBALAGEM 35', 1596, 2.15],
      ['EMBALAGEM 40', 770, 2.85],
      ['MESINHA', 10, 0.5],
      ['EMBALAGEM ENTRADAS', 60, 0], // AG=0 → fallback
    ] as const;
    emb.forEach(([nome, qtd, ag], i) => {
      const r = 106 + i;
      setCell(ws, r, 1, { t: 's', v: nome });
      setCell(ws, r, 4, { t: 's', v: 'UN' });
      setCell(ws, r, 30, { t: 'n', v: qtd });
      setCell(ws, r, 32, { t: 'n', v: ag });
    });

    setAnchor(ws, 120, 'BEBIDAS');
    setCell(ws, 140, 1, { t: 's', v: 'FANTA GUARANA 2 LITROS' });
    setCell(ws, 140, 4, { t: 's', v: 'UN' });
    setCell(ws, 140, 30, { t: 'n', v: 0 });
    setCell(ws, 140, 32, { t: 'n', v: 0 });

    setCell(ws, 160, 1, { t: 's', v: 'CERVEJA SPATEN LATA LATA' });
    setCell(ws, 160, 4, { t: 's', v: 'UN' });
    setCell(ws, 160, 30, { t: 'n', v: 47 });
    setCell(ws, 160, 32, { t: 'n', v: 3.78 });

    setCell(ws, 179, 1, { t: 's', v: 'PEPSI 600 ZERO' });
    setCell(ws, 179, 4, { t: 's', v: 'UN' });
    setCell(ws, 179, 30, { t: 'n', v: 0 });
    setCell(ws, 179, 32, { t: 'n', v: 3.54 });

    // controles
    setCell(ws, 133, 1, { t: 's', v: 'COCA 600 ZERO' });
    setCell(ws, 133, 4, { t: 's', v: 'UN' });
    setCell(ws, 133, 30, { t: 'n', v: 58 });
    setCell(ws, 133, 32, { t: 'n', v: 4.02 });

    ws['!ref'] = 'A1:AG200';

    const linhas = parseSaldoDaAba(ws);
    const byNome = (n: string) => linhas.find((l) => l.nome === n);

    assert.ok(byNome('CAMARÃO'));
    assert.equal(byNome('CAMARÃO')!.qtdFinal, 0);

    const ling = byNome('LINGUIÇA BLUMENAU')!;
    assert.equal(ling.qtdFinal, 4);
    assert.equal(ling.custoPlanilha, null);
    assert.equal(ling.custoRecalculado, 34.32);

    const rec = byNome('RECHEIO DE MORANGO')!;
    assert.equal(rec.custoRecalculado, 23.71);

    assert.equal(byNome('EMBALAGEM 25')!.custoPlanilha, 1.49);
    assert.equal(byNome('EMBALAGEM 20')!.qtdFinal, 890);

    const catalogo = [
      'EMBALAGEM 20',
      'EMBALAGEM 25',
      'EMBALAGEM 30',
      'EMBALAGEM 35',
      'EMBALAGEM 40',
      'EMBALAGEM ENTRADAS',
      'LINGUIÇA BLUMENAU',
      'CERVEJA SPATEN LATA',
      'COCA 600 ZERO',
      'PEPSI 600 ZERO',
      'FANTA LARANJA 2 LITROS',
    ].map((nome) => ({
      nome,
      nomeNormalizado: normalizarDescricao(nome),
    }));

    const m25 = matchNomeProdutoLista('EMBALAGEM 25', catalogo);
    assert.equal(m25.item?.nome, 'EMBALAGEM 25');

    const mPepsi = matchNomeProdutoLista('PEPSI 600 ZERO', [
      { nome: 'COCA 600 ZERO', nomeNormalizado: normalizarDescricao('COCA 600 ZERO') },
    ]);
    assert.equal(mPepsi.status, 'nao_encontrado');

    const mFanta = matchNomeProdutoLista('FANTA GUARANA 2 LITROS', [
      {
        nome: 'FANTA LARANJA 2 LITROS',
        nomeNormalizado: normalizarDescricao('FANTA LARANJA 2 LITROS'),
      },
    ]);
    assert.equal(mFanta.status, 'nao_encontrado');

    const mSpaten = matchNomeProdutoLista('CERVEJA SPATEN LATA LATA', catalogo);
    assert.equal(mSpaten.item?.nome, 'CERVEJA SPATEN LATA');

    // Custos AG>0 intactos
    assert.equal(byNome('COCA 600 ZERO')!.custoPlanilha, 4.02);
    assert.equal(byNome('COCA 600 ZERO')!.qtdFinal, 58);

    // Imprime prévia sintética para revisão
    const rows = [
      'CAMARÃO',
      'LINGUIÇA BLUMENAU',
      'RECHEIO DE MORANGO',
      'EMBALAGEM 20',
      'EMBALAGEM 25',
      'EMBALAGEM 30',
      'EMBALAGEM 35',
      'EMBALAGEM 40',
      'EMBALAGEM ENTRADAS',
      'FANTA GUARANA 2 LITROS',
      'CERVEJA SPATEN LATA LATA',
      'PEPSI 600 ZERO',
      'COCA 600 ZERO',
    ];
    console.log('\n--- Prévia sintética SETEMBRO/AHU (aceitação) ---');
    for (const nome of rows) {
      const l = byNome(nome);
      if (!l) {
        console.log(`FALTA: ${nome}`);
        continue;
      }
      const match = matchNomeProdutoLista(nome, catalogo);
      const custo =
        l.custoPlanilha ??
        resolverUmCusto({
          nomeProduto: nome,
          custoRecalculado: l.custoRecalculado,
          competencia: '2026-09',
        }).custoMedio;
      const origem = l.custoPlanilha
        ? 'PLANILHA'
        : resolverUmCusto({
            nomeProduto: nome,
            custoRecalculado: l.custoRecalculado,
            competencia: '2026-09',
          }).custoOrigem;
      console.log(
        `${l.linha}\t${nome}\tq=${l.qtdFinal}\tc=${custo ?? '–'}\to=${origem}\tm=${match.status}${match.item ? '→' + match.item.nome : ''}`,
      );
    }
  });
});
