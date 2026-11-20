import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { csvEscapeCell } from './csv-escape';

describe('csvEscapeCell', () => {
  it('prefixa aspas simples em fórmulas (= + - @)', () => {
    // com aspas internas → também envolve em aspas CSV
    assert.equal(
      csvEscapeCell('=HYPERLINK("http://evil","x")'),
      '"\'=HYPERLINK(""http://evil"",""x"")"',
    );
    assert.equal(csvEscapeCell('+1234'), "'+1234");
    assert.equal(csvEscapeCell('-1234'), "'-1234");
    assert.equal(csvEscapeCell('@SUM(A1)'), "'@SUM(A1)");
    assert.equal(csvEscapeCell('\tcmd'), "'\tcmd");
    assert.equal(csvEscapeCell('\rcmd'), '"\'\rcmd"');
  });

  it('não altera nomes normais', () => {
    assert.equal(csvEscapeCell('Maria Silva'), 'Maria Silva');
    assert.equal(csvEscapeCell('AHÚ'), 'AHÚ');
  });

  it('escapa aspas e separadores', () => {
    assert.equal(csvEscapeCell('a;b'), '"a;b"');
    assert.equal(csvEscapeCell('diz "oi"'), '"diz ""oi"""');
  });
});
