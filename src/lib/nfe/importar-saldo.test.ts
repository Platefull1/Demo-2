import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';
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

/** Monta aba mínima com as 3 seções; COCA em BEBIDAS após a linha 186. */
function buildAbaCocaDiv0(): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  setCell(ws, 4, 1, { t: 's', v: 'MATÉRIA PRIMA' });
  setCell(ws, 5, 1, { t: 's', v: 'ALFACE' });
  setCell(ws, 5, 30, { t: 'n', v: 2 });
  setCell(ws, 5, 32, { t: 'n', v: 3.5 });
  setCell(ws, 6, 1, { t: 's', v: 'TOTAL MP' });

  setCell(ws, 10, 1, { t: 's', v: 'EMBALAGENS' });
  setCell(ws, 11, 1, { t: 's', v: 'COPO 300' });
  setCell(ws, 11, 30, { t: 'n', v: 10 });
  setCell(ws, 11, 32, { t: 'n', v: 0 });

  setCell(ws, 100, 1, { t: 's', v: 'BEBIDAS' });
  setCell(ws, 190, 1, { t: 's', v: 'COCA 600 ZERO' });
  setCell(ws, 190, 30, { t: 'n', v: 58, w: '58' });
  setCell(ws, 190, 32, { t: 'e', v: 0x07, w: '#DIV/0!' });

  setCell(ws, 191, 1, { t: 's', v: 'SPRITE LATA' });
  setCell(ws, 191, 30, { t: 'n', v: 12 });

  setCell(ws, 200, 1, { t: 's', v: 'CMV' });
  setCell(ws, 201, 1, { t: 's', v: 'PRODUTO FANTASMA' });
  setCell(ws, 201, 30, { t: 'n', v: 99 });

  ws['!ref'] = 'A1:AG210';
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
    assert.equal(coca!.custoMedio, null);

    const sprite = linhas.find((l) => l.nome === 'SPRITE LATA');
    assert.ok(sprite);
    assert.equal(sprite!.qtdFinal, 12);
    assert.equal(sprite!.custoPlanilha, null);

    const copo = linhas.find((l) => l.nome === 'COPO 300');
    assert.ok(copo);
    assert.equal(copo!.custoPlanilha, null);

    assert.equal(
      linhas.find((l) => l.nome === 'PRODUTO FANTASMA'),
      undefined,
      'não deve ler após CMV',
    );
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
