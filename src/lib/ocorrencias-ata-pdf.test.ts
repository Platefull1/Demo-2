import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {
  generateOcorrenciaAtaLojaPdf,
  generateOcorrenciaAtaRedePdf,
} from './ocorrencias-ata-pdf';
import type { OcorrenciaAtaRow } from './ocorrencias-ata-data';

function row(over: Partial<OcorrenciaAtaRow> = {}): OcorrenciaAtaRow {
  return {
    id: over.id ?? '1',
    lojaId: over.lojaId ?? 'ahu',
    lojaNome: over.lojaNome ?? 'CALENZANO AHÚ',
    categorias: over.categorias ?? ['QUALIDADE'],
    motoboyId: over.motoboyId ?? 'm1',
    motoboyNome: over.motoboyNome ?? 'JOÃO DA SILVA',
    destaqueAta: over.destaqueAta ?? false,
    createdAt: over.createdAt ?? '2026-10-10T12:00:00.000-03:00',
    numeroPedidoSaipos: over.numeroPedidoSaipos ?? '136',
    numeroPedidoExterno: over.numeroPedidoExterno ?? '74301599',
    canalExterno: over.canalExterno ?? 'DELIVERY_DIRETO',
    descricao: over.descricao ?? 'borda queimada na foto',
    fotoPaths: over.fotoPaths ?? [],
  };
}

async function jpegAmostra(cor: string): Promise<Buffer> {
  return sharp({
    create: { width: 1200, height: 800, channels: 3, background: cor },
  })
    .jpeg({ quality: 90 })
    .toBuffer();
}

describe('PDF da ata de ocorrências', () => {
  it('loja com 2 destaques com foto fica abaixo de 2 MB e começa com %PDF', async () => {
    const fotoA = await jpegAmostra('#22C55E');
    const fotoB = await jpegAmostra('#15803D');
    const buf = await generateOcorrenciaAtaLojaPdf({
      empresa: 'Calenzano Pizzarias',
      ano: 2026,
      mes: 10,
      loja: { id: 'ahu', nome: 'CALENZANO AHÚ' },
      items: [
        row({
          id: 'd1',
          destaqueAta: true,
          fotoPaths: ['fotos/a.jpg'],
          createdAt: '2026-10-10T21:39:00.000-03:00',
        }),
        row({
          id: 'd2',
          destaqueAta: true,
          fotoPaths: ['fotos/b.jpg'],
          numeroPedidoSaipos: '200',
          createdAt: '2026-10-12T18:00:00.000-03:00',
        }),
        row({ id: 'comum', destaqueAta: false, motoboyId: 'm2', motoboyNome: 'maria santos' }),
      ],
      atraso: null,
      prevItems: null,
      prevAtraso: null,
      temDadosAnterior: false,
      fotoBytesByPath: new Map([
        ['fotos/a.jpg', fotoA],
        ['fotos/b.jpg', fotoB],
      ]),
      geradoEm: new Date('2026-10-31T12:00:00.000-03:00'),
    });
    assert.equal(buf.subarray(0, 4).toString('ascii'), '%PDF');
    assert.ok(buf.length < 2 * 1024 * 1024, `PDF com ${buf.length} bytes`);
  });

  it('rede: loja sem destaque + atrasos não informados em uma loja', async () => {
    const buf = await generateOcorrenciaAtaRedePdf({
      empresa: 'Calenzano Pizzarias',
      ano: 2026,
      mes: 10,
      lojas: [
        { id: 'ahu', nome: 'CALENZANO AHÚ' },
        { id: 'portao', nome: 'CALENZANO PORTÃO' },
      ],
      items: [
        row({ id: 'd1', destaqueAta: true, fotoPaths: [] }),
        row({ id: 'p1', lojaId: 'portao', lojaNome: 'CALENZANO PORTÃO', destaqueAta: false }),
      ],
      atrasos: [
        { lojaId: 'ahu', quantidade: 4 },
        { lojaId: 'portao', quantidade: null },
      ],
      prevItems: null,
      prevAtrasos: null,
      temDadosAnterior: false,
      geradoEm: new Date('2026-10-31T12:00:00.000-03:00'),
    });
    assert.equal(buf.subarray(0, 4).toString('ascii'), '%PDF');
    assert.ok(buf.length > 1000);
  });
});
