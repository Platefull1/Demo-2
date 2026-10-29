import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { arquivosImagemDaClipboard, isHeicFile, isImageFile } from './ocorrencias-clipboard';

describe('arquivosImagemDaClipboard', () => {
  it('não intercepta clipboard só de texto', () => {
    const r = arquivosImagemDaClipboard({
      clipboardData: {
        items: [{ type: 'text/plain', getAsFile: () => null }],
      },
    });
    assert.equal(r.imageCount, 0);
    assert.equal(r.files.length, 0);
  });

  it('conta várias imagens e devolve a primeira', () => {
    const img = new File([Buffer.from('x')], 'a.png', { type: 'image/png' });
    const r = arquivosImagemDaClipboard({
      clipboardData: {
        items: [
          { type: 'image/png', getAsFile: () => img },
          { type: 'image/jpeg', getAsFile: () => img },
        ],
      },
    });
    assert.equal(r.imageCount, 2);
    assert.equal(r.files.length, 2);
  });
});

describe('isHeicFile / isImageFile', () => {
  it('não aceita HEIC como imagem suportada', () => {
    assert.equal(isHeicFile({ type: 'image/heic', name: 'a.jpg' }), true);
    assert.equal(isHeicFile({ type: '', name: 'foto.HEIC' }), true);
    assert.equal(isImageFile({ type: 'image/heic', name: 'a.heic' }), false);
    assert.equal(isImageFile({ type: '', name: 'foto.HEIC' }), false);
    assert.equal(isImageFile({ type: 'application/pdf', name: 'a.pdf' }), false);
    assert.equal(isImageFile({ type: '', name: 'a.webp' }), true);
  });
});
