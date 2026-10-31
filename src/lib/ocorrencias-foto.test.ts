import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fotosDoDestaque, ocorrenciaFotoPaths } from './ocorrencias-foto';

describe('ocorrenciaFotoPaths', () => {
  it('usa fotoPaths quando existe', () => {
    assert.deepEqual(
      ocorrenciaFotoPaths('antiga.jpg', ['a.jpg', 'b.jpg']),
      ['a.jpg', 'b.jpg'],
    );
  });

  it('cai no fotoPath legado', () => {
    assert.deepEqual(ocorrenciaFotoPaths('antiga.jpg', []), ['antiga.jpg']);
  });
});

describe('fotosDoDestaque', () => {
  it('sem seleção devolve todas (ata antiga)', () => {
    assert.deepEqual(fotosDoDestaque(['a.jpg', 'b.jpg'], []), ['a.jpg', 'b.jpg']);
    assert.deepEqual(fotosDoDestaque(['a.jpg'], null), ['a.jpg']);
  });

  it('mantém só paths que ainda existem, na ordem escolhida', () => {
    assert.deepEqual(
      fotosDoDestaque(['a.jpg', 'b.jpg', 'c.jpg'], ['c.jpg', 'sumiu.jpg', 'a.jpg']),
      ['c.jpg', 'a.jpg'],
    );
  });
});
