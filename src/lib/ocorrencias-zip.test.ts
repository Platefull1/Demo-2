import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createZipStore } from './ocorrencias-zip';

describe('zip store', () => {
  it('empacota dois arquivos e começa com assinatura PK', () => {
    const zip = createZipStore([
      { name: 'a.docx', data: Buffer.from('hello') },
      { name: 'b.docx', data: Buffer.from('world') },
    ]);
    assert.equal(zip.subarray(0, 2).toString('utf8'), 'PK');
    assert.ok(zip.includes(Buffer.from('a.docx')));
    assert.ok(zip.includes(Buffer.from('b.docx')));
    assert.ok(zip.includes(Buffer.from('hello')));
  });
});
