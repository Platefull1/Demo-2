/**
 * Gera PDFs de exemplo da ata e tenta exportar as páginas em PNG.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import sharp from 'sharp';
import {
  generateOcorrenciaAtaLojaPdf,
  generateOcorrenciaAtaRedePdf,
} from '../src/lib/ocorrencias-ata-pdf';
import type { OcorrenciaAtaRow } from '../src/lib/ocorrencias-ata-data';

const exec = promisify(execFile);
const OUT = path.join(process.cwd(), 'tmp', 'ata-preview');

function row(over: Partial<OcorrenciaAtaRow> = {}): OcorrenciaAtaRow {
  return {
    id: over.id ?? '1',
    lojaId: over.lojaId ?? 'ahu',
    lojaNome: over.lojaNome ?? 'CALENZANO AHÚ',
    categorias: over.categorias ?? ['QUALIDADE'],
    motoboyId: over.motoboyId ?? 'm1',
    motoboyNome: over.motoboyNome ?? 'JOÃO DA SILVA',
    destaqueAta: over.destaqueAta ?? false,
    createdAt: over.createdAt ?? '2026-10-10T21:39:00.000-03:00',
    numeroPedidoSaipos: over.numeroPedidoSaipos ?? '136',
    numeroPedidoExterno: over.numeroPedidoExterno ?? '74301599',
    canalExterno: over.canalExterno ?? 'DELIVERY_DIRETO',
    descricao: over.descricao ?? 'borda queimada na foto',
    fotoPaths: over.fotoPaths ?? [],
  };
}

async function jpeg(cor: string) {
  return sharp({
    create: { width: 1200, height: 800, channels: 3, background: cor },
  })
    .jpeg({ quality: 85 })
    .toBuffer();
}

async function toPng(pdfPath: string, prefix: string) {
  try {
    await exec('pdftoppm', ['-png', '-r', '140', pdfPath, path.join(OUT, prefix)]);
    return;
  } catch {
    /* tenta mutool */
  }
  try {
    await exec('mutool', ['draw', '-o', path.join(OUT, `${prefix}-%d.png`), '-r', '140', pdfPath]);
  } catch {
    console.warn(`Sem pdftoppm/mutool: PNG de ${prefix} não gerado.`);
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const fotoA = await jpeg('#22C55E');
  const fotoB = await jpeg('#15803D');

  const loja = await generateOcorrenciaAtaLojaPdf({
    empresa: 'Calenzano Pizzarias',
    ano: 2026,
    mes: 10,
    loja: { id: 'ahu', nome: 'CALENZANO AHÚ' },
    items: [
      row({
        id: 'd1',
        destaqueAta: true,
        fotoPaths: ['fotos/a.jpg'],
        categorias: ['PROBLEMAS_COM_BORDA'],
      }),
      row({
        id: 'd2',
        destaqueAta: true,
        fotoPaths: ['fotos/b.jpg'],
        numeroPedidoSaipos: '200',
        createdAt: '2026-10-12T18:10:00.000-03:00',
        categorias: ['QUALIDADE'],
        motoboyNome: 'maria santos',
        motoboyId: 'm2',
      }),
      row({ id: 'c1', categorias: ['FALTOU_BEBIDA'], motoboyId: 'm3', motoboyNome: 'PEDRO DE SOUZA' }),
      row({ id: 'c2', categorias: ['PEDIDO_ERRADO'] }),
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

  const rede = await generateOcorrenciaAtaRedePdf({
    empresa: 'Calenzano Pizzarias',
    ano: 2026,
    mes: 10,
    lojas: [
      { id: 'ahu', nome: 'CALENZANO AHÚ' },
      { id: 'portao', nome: 'CALENZANO PORTÃO' },
    ],
    items: [
      row({ id: 'd1', destaqueAta: true, fotoPaths: ['fotos/a.jpg'] }),
      row({
        id: 'p1',
        lojaId: 'portao',
        lojaNome: 'CALENZANO PORTÃO',
        destaqueAta: false,
        motoboyId: 'm9',
        motoboyNome: 'ANA COSTA',
      }),
    ],
    atrasos: [
      { lojaId: 'ahu', quantidade: 4 },
      { lojaId: 'portao', quantidade: null },
    ],
    prevItems: null,
    prevAtrasos: null,
    temDadosAnterior: false,
    fotoBytesByPath: new Map([['fotos/a.jpg', fotoA]]),
    geradoEm: new Date('2026-10-31T12:00:00.000-03:00'),
  });

  const lojaPath = path.join(OUT, 'ata-loja-ahu.pdf');
  const redePath = path.join(OUT, 'ata-rede.pdf');
  await writeFile(lojaPath, loja);
  await writeFile(redePath, rede);
  console.log(`loja ${loja.length} bytes`);
  console.log(`rede ${rede.length} bytes`);
  await toPng(lojaPath, 'loja');
  await toPng(redePath, 'rede');
}

void main();
