import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { detectImageKind, processarFotoOcorrencia, fotoPathFor } from './ocorrencias-foto';
import { FOTO_FORMATO_NAO_SUPORTADO } from './ocorrencias-clipboard';

function heicBuffer() {
  const heic = Buffer.alloc(12);
  heic.writeUInt32BE(0, 0);
  heic.write('ftyp', 4);
  heic.write('heic', 8);
  return heic;
}

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

describe('detectImageKind', () => {
  it('reconhece JPEG/PNG/WEBP pelos magic bytes', () => {
    assert.equal(detectImageKind(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0])), 'jpeg');
    assert.equal(detectImageKind(PNG_1X1), 'png');
    const webp = Buffer.alloc(12);
    webp.write('RIFF', 0);
    webp.writeUInt32LE(4, 4);
    webp.write('WEBP', 8);
    assert.equal(detectImageKind(webp), 'webp');
  });

  it('rejeita HEIC', () => {
    assert.equal(detectImageKind(heicBuffer()), null);
  });

  it('rejeita SVG, GIF, PDF e HTML', () => {
    assert.equal(detectImageKind(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')), null);
    assert.equal(detectImageKind(Buffer.from('GIF89a............')), null);
    assert.equal(detectImageKind(Buffer.from('%PDF-1.4............')), null);
    assert.equal(detectImageKind(Buffer.from('<!DOCTYPE html><html>')), null);
  });
});

describe('processarFotoOcorrencia', () => {
  it('re-encoda PNG para JPEG e remove metadados extras', async () => {
    const r = await processarFotoOcorrencia(PNG_1X1);
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(detectImageKind(r.jpeg), 'jpeg');
    }
  });

  it('rejeita HTML disfarçado', async () => {
    const r = await processarFotoOcorrencia(Buffer.from('<!DOCTYPE html><html>ok</html>'));
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error, FOTO_FORMATO_NAO_SUPORTADO);
  });

  it('rejeita HEIC com mensagem de formato', async () => {
    const r = await processarFotoOcorrencia(heicBuffer());
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error, FOTO_FORMATO_NAO_SUPORTADO);
  });
});

describe('fotoPathFor', () => {
  it('não aceita path traversal do cliente — path só com ids sanitizados', () => {
    const p = fotoPathFor('../etc', 'id;rm', '2026-10');
    assert.equal(p.includes('..'), false);
    assert.equal(p.endsWith('.jpg'), true);
    assert.match(p, /^[a-zA-Z0-9_-]+\/2026-10\/[a-zA-Z0-9_-]+\/0\.jpg$/);
  });
});
