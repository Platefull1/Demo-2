import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import {
  parseSaldoDaAba,
  totaisCmvPorSecao,
  competenciaFromAbaNome,
} from './importar-saldo-parse';

function setCell(
  ws: XLSX.WorkSheet,
  r: number,
  c: number,
  cell: XLSX.CellObject,
) {
  ws[XLSX.utils.encode_cell({ r, c })] = cell;
}

function setAnchor(ws: XLSX.WorkSheet, r: number, nomeSecao: string) {
  setCell(ws, r, 1, { t: 's', v: nomeSecao });
  setCell(ws, r, 3, { t: 's', v: 'ESTOQUE INICIAL' });
}

describe('parseSaldoDaAba — mês completo', () => {
  it('lê inicial, compras, final e CMV da linha', () => {
    const ws: XLSX.WorkSheet = {};
    setAnchor(ws, 0, 'MATÉRIA PRIMA');
    setCell(ws, 1, 1, { t: 's', v: 'TOMATE' });
    setCell(ws, 1, 4, { t: 's', v: 'KG' });
    setCell(ws, 1, 3, { t: 'n', v: 10 }); // ini qtd
    setCell(ws, 1, 5, { t: 'n', v: 5 }); // custo ini
    setCell(ws, 1, 6, { t: 'n', v: 50 }); // valor ini
    setCell(ws, 1, 8, { t: 'n', v: 2 }); // compra s1 qtd
    setCell(ws, 1, 10, { t: 'n', v: 12 }); // compra s1 val
    setCell(ws, 1, 26, { t: 'n', v: 1 }); // desp qtd
    setCell(ws, 1, 28, { t: 'n', v: 5 }); // desp val
    setCell(ws, 1, 30, { t: 'n', v: 8 }); // final qtd
    setCell(ws, 1, 32, { t: 'n', v: 6 }); // custo final
    setCell(ws, 1, 33, { t: 'n', v: 48 }); // valor final
    setCell(ws, 1, 35, { t: 'n', v: 3 }); // consumo qtd
    setCell(ws, 1, 38, { t: 'n', v: 18 }); // consumo val
    ws['!ref'] = 'A1:AM5';

    const linhas = parseSaldoDaAba(ws);
    assert.equal(linhas.length, 1);
    const t = linhas[0]!;
    assert.equal(t.nome, 'TOMATE');
    assert.equal(t.qtdInicial, 10);
    assert.equal(t.custoInicial, 5);
    assert.equal(t.valorInicial, 50);
    assert.equal(t.comprasQtd, 2);
    assert.equal(t.comprasValor, 12);
    assert.equal(t.desperdicioQtd, 1);
    assert.equal(t.desperdicioValor, 5);
    assert.equal(t.qtdFinal, 8);
    assert.equal(t.custoMedio, 6);
    assert.equal(t.consumoValor, 18);

    const tot = totaisCmvPorSecao(linhas);
    assert.equal(tot.cmvMp, 18);
    assert.equal(tot.estoqueInicial, 50);
    assert.equal(tot.estoqueFinal, 48);
  });

  it('custo inicial cai para G/D quando F inválido', () => {
    const ws: XLSX.WorkSheet = {};
    setAnchor(ws, 0, 'BEBIDAS');
    setCell(ws, 1, 1, { t: 's', v: 'COCA' });
    setCell(ws, 1, 4, { t: 's', v: 'UN' });
    setCell(ws, 1, 3, { t: 'n', v: 4 });
    setCell(ws, 1, 6, { t: 'n', v: 20 });
    setCell(ws, 1, 30, { t: 'n', v: 1 });
    setCell(ws, 1, 32, { t: 'n', v: 5 });
    ws['!ref'] = 'A1:AG3';
    const l = parseSaldoDaAba(ws)[0]!;
    assert.equal(l.custoInicial, 5);
  });
});

describe('planilha Uberaba real (se existir)', () => {
  it('OUTUBRO tem as 3 seções e totais > 0', () => {
    const dir = String.raw`d:\mods\mds sa\mods the sims`;
    if (!fs.existsSync(dir)) {
      console.log('skip: pasta da planilha ausente');
      return;
    }
    const name = fs
      .readdirSync(dir)
      .find((f) => /UBERABA/i.test(f) && f.endsWith('.xlsx'));
    if (!name) {
      console.log('skip: planilha Uberaba ausente');
      return;
    }
    const buf = fs.readFileSync(path.join(dir, name));
    const wb = XLSX.read(buf, { type: 'buffer' });
    const aba =
      wb.SheetNames.find((n) => /outubro/i.test(n)) || wb.SheetNames[0]!;
    // Abas Uberaba são só o mês ("OUTUBRO "); competência vem do seletor na UI.
    assert.equal(competenciaFromAbaNome('OUTUBRO 2026'), '2026-10');
    const linhas = parseSaldoDaAba(wb.Sheets[aba]!);
    assert.ok(linhas.length > 50, `poucas linhas: ${linhas.length}`);
    assert.ok(linhas.some((l) => l.secao === 'MATERIA_PRIMA'));
    assert.ok(linhas.some((l) => l.secao === 'EMBALAGEM'));
    assert.ok(linhas.some((l) => l.secao === 'BEBIDA'));
    assert.ok(linhas.some((l) => l.qtdInicial > 0));
    assert.ok(linhas.some((l) => l.qtdFinal > 0));
    assert.ok(linhas.some((l) => l.comprasQtd > 0));
    assert.ok(linhas.some((l) => l.consumoValor > 0));
    const tot = totaisCmvPorSecao(linhas);
    assert.ok(tot.cmvMp > 0, `cmvMp=${tot.cmvMp}`);
    assert.ok(tot.cmvEmbalagens > 0, `cmvEmb=${tot.cmvEmbalagens}`);
    assert.ok(tot.cmvBebidas > 0, `cmvBeb=${tot.cmvBebidas}`);
    assert.ok(tot.estoqueInicial > 0);
    assert.ok(tot.estoqueFinal > 0);
    console.log('Uberaba OUTUBRO', {
      linhas: linhas.length,
      ...tot,
    });
  });
});
