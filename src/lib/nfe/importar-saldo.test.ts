import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';
import { parseCatalogoDaAba } from './importar-catalogo-parse';
import {
  detectarAncoraSecao,
  lerLinhaProduto,
} from './importar-planilha-secoes';
import {
  fimCompetenciaUtc,
  isCustoPlanilhaValido,
  parseSaldoDaAba,
} from './importar-saldo-parse';

function setCell(
  ws: XLSX.WorkSheet,
  r: number,
  c: number,
  cell: XLSX.CellObject,
) {
  ws[XLSX.utils.encode_cell({ r, c })] = cell;
}

function setAnchor(
  ws: XLSX.WorkSheet,
  r: number,
  nomeSecao: string,
) {
  setCell(ws, r, 1, { t: 's', v: nomeSecao }); // B
  setCell(ws, r, 3, { t: 's', v: 'ESTOQUE INICIAL' }); // D
}

function setProduto(
  ws: XLSX.WorkSheet,
  r: number,
  nome: string,
  und: string,
  qtd?: number,
  custo?: number | 'div0',
) {
  setCell(ws, r, 1, { t: 's', v: nome });
  setCell(ws, r, 4, { t: 's', v: und }); // E
  if (qtd != null) setCell(ws, r, 30, { t: 'n', v: qtd });
  if (custo === 'div0') {
    setCell(ws, r, 32, { t: 'e', v: 0x07, w: '#DIV/0!' });
  } else if (custo != null) {
    setCell(ws, r, 32, { t: 'n', v: custo });
  }
}

/** Monta aba mínima com as 3 seções; COCA em BEBIDAS após a linha 186. */
function buildAbaCocaDiv0(): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  setAnchor(ws, 4, 'MATÉRIA PRIMA');
  setProduto(ws, 5, 'ALFACE', 'KG', 2, 3.5);
  setCell(ws, 6, 1, { t: 's', v: 'TOTAL MP' });

  setAnchor(ws, 10, 'EMBALAGENS');
  setProduto(ws, 11, 'COPO 300', 'UN', 10, 0);

  setAnchor(ws, 100, 'BEBIDAS');
  setProduto(ws, 190, 'COCA 600 ZERO', 'UN', 58, 'div0');
  setProduto(ws, 191, 'SPRITE LATA', 'UN', 12);

  setCell(ws, 200, 1, { t: 's', v: 'CMV' });
  setProduto(ws, 201, 'PRODUTO FANTASMA', 'UN', 99);

  ws['!ref'] = 'A1:AG210';
  return ws;
}

/**
 * Espelha SETEMBRO 2026 — seção Embalagens com 9 produtos,
 * incluindo 7 que começam com "EMBALAGEM" (não podem virar âncora).
 */
function buildAbaEmbalagensSetembro(): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  setAnchor(ws, 4, 'MATÉRIA PRIMA');
  setProduto(ws, 5, 'LINGUIÇA BLUMENAU', 'KG', 1, 28);

  setAnchor(ws, 102, 'EMBALAGENS');
  const emb = [
    'MESINHA',
    'SEPARADOR',
    'EMBALAGEM 20',
    'EMBALAGEM 25',
    'EMBALAGEM 30',
    'EMBALAGEM 35',
    'EMBALAGEM 40',
    'EMBALAGEM CALZONE',
    'EMBALAGEM ENTRADAS',
  ];
  emb.forEach((nome, i) => {
    setProduto(ws, 103 + i, nome, 'UN', 10 + i, i === 0 ? 0.5 : undefined);
  });

  setAnchor(ws, 120, 'BEBIDAS');
  setProduto(ws, 121, 'COCA 600 ZERO', 'UN', 58, 'div0');

  ws['!ref'] = 'A1:AG130';
  return ws;
}

describe('isCustoPlanilhaValido', () => {
  it('rejeita null, 0 e negativo', () => {
    assert.equal(isCustoPlanilhaValido(null), false);
    assert.equal(isCustoPlanilhaValido(0), false);
    assert.equal(isCustoPlanilhaValido(-1), false);
    assert.equal(isCustoPlanilhaValido(1.2), true);
  });
});

describe('fimCompetenciaUtc', () => {
  it('é o início do mês seguinte (limite exclusivo)', () => {
    const d = fimCompetenciaUtc('2026-09');
    assert.equal(d.toISOString(), '2026-10-01T00:00:00.000Z');
    assert.equal(fimCompetenciaUtc('2026-12').toISOString(), '2027-01-01T00:00:00.000Z');
  });
});

describe('âncora de seção (exata + ESTOQUE INICIAL)', () => {
  it('EMBALAGEM 20 não é âncora; EMBALAGENS + D é', () => {
    const ws: XLSX.WorkSheet = {};
    setCell(ws, 0, 1, { t: 's', v: 'EMBALAGEM 20' });
    setCell(ws, 0, 3, { t: 's', v: 'ESTOQUE INICIAL' });
    setCell(ws, 0, 4, { t: 's', v: 'UN' });
    assert.equal(detectarAncoraSecao(ws, 0), null);
    assert.ok(lerLinhaProduto(ws, 0));

    setAnchor(ws, 1, 'EMBALAGENS');
    assert.equal(detectarAncoraSecao(ws, 1), 'EMBALAGEM');

    // EMBALAGENS sem cabeçalho D → não é âncora
    setCell(ws, 2, 1, { t: 's', v: 'EMBALAGENS' });
    setCell(ws, 2, 3, { t: 's', v: '' });
    assert.equal(detectarAncoraSecao(ws, 2), null);
  });
});

describe('parseSaldoDaAba — seções e #DIV/0!', () => {
  it('lê as 3 seções e mantém qtd da COCA com AG #DIV/0!', () => {
    const linhas = parseSaldoDaAba(buildAbaCocaDiv0());
    assert.ok(linhas.some((l) => l.secao === 'MATERIA_PRIMA'));
    assert.ok(linhas.some((l) => l.secao === 'EMBALAGEM'));
    assert.ok(linhas.some((l) => l.secao === 'BEBIDA'));

    const coca = linhas.find((l) => l.nome === 'COCA 600 ZERO');
    assert.ok(coca, 'COCA 600 ZERO deve aparecer (após linha 186)');
    assert.equal(coca!.secao, 'BEBIDA');
    assert.equal(coca!.qtdFinal, 58);
    assert.equal(coca!.custoPlanilha, null);

    assert.equal(
      linhas.find((l) => l.nome === 'PRODUTO FANTASMA'),
      undefined,
      'não deve ler após CMV',
    );
  });

  it('seção Embalagens tem 9 produtos (inclui EMBALAGEM 20…)', () => {
    const linhas = parseSaldoDaAba(buildAbaEmbalagensSetembro());
    const emb = linhas.filter((l) => l.secao === 'EMBALAGEM');
    assert.equal(emb.length, 9, `esperado 9 embalagens, veio ${emb.length}: ${emb.map((e) => e.nome).join(', ')}`);
    assert.ok(emb.some((l) => l.nome === 'EMBALAGEM 20'));
    assert.ok(emb.some((l) => l.nome === 'EMBALAGEM CALZONE'));
    assert.ok(emb.some((l) => l.nome === 'MESINHA'));
    assert.ok(emb.some((l) => l.nome === 'SEPARADOR'));
  });

  it('não corta seção por linha TOTAL', () => {
    const linhas = parseSaldoDaAba(buildAbaCocaDiv0());
    assert.ok(linhas.find((l) => l.nome === 'ALFACE'));
    assert.equal(
      linhas.find((l) => /^TOTAL/i.test(l.nome)),
      undefined,
    );
  });
});

describe('parseCatalogoDaAba — Embalagens', () => {
  it('também retorna 9 embalagens', () => {
    const linhas = parseCatalogoDaAba(buildAbaEmbalagensSetembro());
    const emb = linhas.filter((l) => l.secao === 'EMBALAGEM');
    assert.equal(emb.length, 9);
    assert.ok(emb.every((l) => l.unidade === 'UN'));
  });
});
