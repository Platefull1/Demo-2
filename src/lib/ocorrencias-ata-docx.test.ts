import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { inflateRawSync } from 'node:zlib';
import {
  ATA_CONTENT_PORTRAIT_DXA,
  ATA_MIN_GRID_COL_DXA,
  generateOcorrenciaAtaLojaDocx,
  generateOcorrenciaAtaRedeDocx,
} from './ocorrencias-ata-docx';
import type { OcorrenciaAtaRow } from './ocorrencias-ata-data';

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

function zipRead(buf: Buffer, name: string): Buffer {
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('docx inválido: EOCD não encontrado');
  const cdOff = buf.readUInt32LE(eocd + 16);
  const cdCount = buf.readUInt16LE(eocd + 10);
  let off = cdOff;
  for (let i = 0; i < cdCount; i++) {
    if (buf.readUInt32LE(off) !== 0x02014b50) throw new Error('docx inválido: CD');
    const method = buf.readUInt16LE(off + 10);
    const compSize = buf.readUInt32LE(off + 20);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const localOff = buf.readUInt32LE(off + 42);
    const entryName = buf.toString('utf8', off + 46, off + 46 + nameLen);
    if (entryName === name) {
      const localNameLen = buf.readUInt16LE(localOff + 26);
      const localExtraLen = buf.readUInt16LE(localOff + 28);
      const dataStart = localOff + 30 + localNameLen + localExtraLen;
      const data = buf.subarray(dataStart, dataStart + compSize);
      if (method === 0) return Buffer.from(data);
      if (method === 8) return inflateRawSync(data);
      throw new Error(`método zip ${method} não suportado`);
    }
    off += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error(`entrada zip ausente: ${name}`);
}

function documentXml(docx: Buffer): string {
  return zipRead(docx, 'word/document.xml').toString('utf8');
}

function gridColWidths(xml: string): number[] {
  const out: number[] = [];
  const re = /<w:gridCol\b([^>]*)\/?>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const w = /w:w="(\d+)"/.exec(m[1] ?? '');
    if (!w) throw new Error(`gridCol sem w:w: ${m[0]}`);
    out.push(Number(w[1]));
  }
  return out;
}

function row(over: Partial<OcorrenciaAtaRow> = {}): OcorrenciaAtaRow {
  return {
    id: over.id ?? '1',
    lojaId: over.lojaId ?? 'ahu',
    lojaNome: over.lojaNome ?? 'CALENZANO AHÚ',
    categorias: over.categorias ?? ['QUALIDADE'],
    motoboyId: over.motoboyId ?? null,
    motoboyNome: over.motoboyNome ?? null,
    destaqueAta: over.destaqueAta ?? false,
    createdAt: over.createdAt ?? '2026-10-10T12:00:00.000-03:00',
    numeroPedidoSaipos: over.numeroPedidoSaipos ?? '100',
    numeroPedidoExterno: over.numeroPedidoExterno ?? null,
    canalExterno: over.canalExterno ?? null,
    descricao: over.descricao ?? '',
    fotoPaths: over.fotoPaths ?? [],
  };
}

const lojaBase = {
  ano: 2026,
  mes: 10,
  loja: { id: 'ahu', nome: 'CALENZANO AHÚ' },
  prevItems: null as OcorrenciaAtaRow[] | null,
  prevAtraso: null as number | null,
  temDadosAnterior: false,
};

describe('larguras da ata de ocorrências', () => {
  it('largura útil do painel compacto é 9638 DXA', () => {
    assert.equal(ATA_CONTENT_PORTRAIT_DXA, 9638);
  });

  it('falha se alguma tabela sair com gridCol menor que 80 DXA (bug do w=100)', async () => {
    const lojaDoc = await generateOcorrenciaAtaLojaDocx({
      ...lojaBase,
      empresa: 'Calenzano Pizzarias',
      items: [
        row({
          motoboyId: 'm1',
          motoboyNome: 'JOÃO DA SILVA',
          categorias: ['QUALIDADE', 'FALTOU_BEBIDA'],
        }),
      ],
      atraso: 6,
    });
    const redeDoc = await generateOcorrenciaAtaRedeDocx({
      empresa: 'Calenzano Pizzarias',
      ano: 2026,
      mes: 10,
      lojas: [
        { id: 'ahu', nome: 'CALENZANO AHÚ' },
        { id: 'portao', nome: 'CALENZANO PORTÃO' },
      ],
      items: [
        row({ motoboyId: 'm1', motoboyNome: 'maria santos' }),
        row({ id: '2', lojaId: 'portao', lojaNome: 'CALENZANO PORTÃO' }),
      ],
      atrasos: [
        { lojaId: 'ahu', quantidade: 6 },
        { lojaId: 'portao', quantidade: null },
      ],
      prevItems: null,
      prevAtrasos: null,
      temDadosAnterior: false,
    });

    for (const [label, buf] of [
      ['loja', lojaDoc],
      ['rede', redeDoc],
    ] as const) {
      const xml = documentXml(buf);
      const widths = gridColWidths(xml);
      assert.ok(widths.length > 0, `${label}: nenhuma gridCol`);
      const estreitas = widths.filter((w) => w < ATA_MIN_GRID_COL_DXA);
      assert.deepEqual(
        estreitas,
        [],
        `${label}: gridCol < ${ATA_MIN_GRID_COL_DXA} DXA: ${widths.join(', ')}`,
      );
      assert.equal(
        xml.includes('w:type="pct"') || xml.includes("w:type='pct'"),
        false,
        `${label}: WidthType.PERCENTAGE`,
      );
      assert.equal(
        /w:type="auto"|w:type='auto'/.test(xml),
        false,
        `${label}: WidthType.AUTO`,
      );
    }
  });
});

describe('conteúdo da ata de ocorrências', () => {
  it('cabeçalho usa nome da empresa e nunca e-mail', async () => {
    const comNome = await generateOcorrenciaAtaLojaDocx({
      ...lojaBase,
      empresa: 'Calenzano Pizzarias',
      items: [row()],
      atraso: 0,
    });
    assert.match(documentXml(comNome), /CALENZANO PIZZARIAS/);

    const soEmail = await generateOcorrenciaAtaLojaDocx({
      ...lojaBase,
      empresa: 'admin@calenzano.com',
      items: [row()],
      atraso: 0,
    });
    const xmlEmail = documentXml(soEmail);
    assert.equal(xmlEmail.includes('@'), false);
    assert.equal(xmlEmail.includes('admin@calenzano.com'), false);

    const semNome = await generateOcorrenciaAtaLojaDocx({
      ...lojaBase,
      empresa: '',
      items: [row()],
      atraso: 0,
    });
    const xmlVazio = documentXml(semNome);
    assert.equal(xmlVazio.includes('@'), false);
    assert.equal(xmlVazio.includes('>Empresa<'), false);
  });

  it('hero e banner: singular/plural e atrasos', async () => {
    const comAtraso = await generateOcorrenciaAtaLojaDocx({
      ...lojaBase,
      empresa: 'Calenzano Pizzarias',
      items: Array.from({ length: 25 }, (_, i) => row({ id: String(i) })),
      atraso: 6,
    });
    const xmlAtraso = documentXml(comAtraso);
    assert.match(xmlAtraso, />25</);
    assert.match(xmlAtraso, /ocorrências registradas/);
    assert.match(xmlAtraso, /\+ 6 pedidos atrasados/);

    const semAtraso = await generateOcorrenciaAtaLojaDocx({
      ...lojaBase,
      empresa: 'Calenzano Pizzarias',
      items: [row()],
      atraso: null,
    });
    const xmlSem = documentXml(semAtraso);
    assert.match(xmlSem, /ocorrência registrada/);
    assert.match(xmlSem, /pedidos atrasados de outubro ainda não foi informado/);
  });

  it('motoboys no painel com Nome Sobrenome, ordenados pelo total', async () => {
    const buf = await generateOcorrenciaAtaLojaDocx({
      ...lojaBase,
      empresa: 'Calenzano Pizzarias',
      items: [
        row({ id: '1', motoboyId: 'm2', motoboyNome: 'maria santos' }),
        row({ id: '2', motoboyId: 'm1', motoboyNome: 'JOÃO DA SILVA' }),
        row({ id: '3', motoboyId: 'm1', motoboyNome: 'JOÃO DA SILVA' }),
      ],
      atraso: 0,
    });
    const xml = documentXml(buf);
    assert.match(xml, /MOTOBOYS MAIS CITADOS/);
    assert.match(xml, /João da Silva/);
    assert.match(xml, /Maria Santos/);
    assert.equal(xml.includes('JOÃO DA SILVA'), false);
    const joao = xml.indexOf('João da Silva');
    const maria = xml.indexOf('Maria Santos');
    assert.ok(joao >= 0 && maria >= 0 && joao < maria);
  });

  it('seção de destaques só com destaqueAta; foto vira w:drawing', async () => {
    const comDestaque = await generateOcorrenciaAtaLojaDocx({
      ...lojaBase,
      empresa: 'Calenzano Pizzarias',
      items: [
        row({
          id: 'dest',
          destaqueAta: true,
          descricao: 'borda queimada na foto',
          fotoPaths: ['fotos/dest.jpg'],
        }),
        row({ id: 'comum', destaqueAta: false, descricao: 'sem destaque' }),
      ],
      atraso: 0,
      fotoBytesByPath: new Map([['fotos/dest.jpg', PNG_1X1]]),
    });
    const xmlDest = documentXml(comDestaque);
    assert.match(xmlDest, /OCORRÊNCIAS EM DESTAQUE/);
    assert.match(xmlDest, /borda queimada na foto/);
    assert.match(xmlDest, /<w:drawing[\s>]/);
    assert.equal(xmlDest.includes('sem destaque'), false);

    const semDestaque = await generateOcorrenciaAtaLojaDocx({
      ...lojaBase,
      empresa: 'Calenzano Pizzarias',
      items: [
        row({
          destaqueAta: false,
          descricao: 'borda queimada na foto',
          fotoPaths: ['fotos/dest.jpg'],
        }),
      ],
      atraso: 0,
      fotoBytesByPath: new Map([['fotos/dest.jpg', PNG_1X1]]),
    });
    const xmlSem = documentXml(semDestaque);
    assert.equal(xmlSem.includes('OCORRÊNCIAS EM DESTAQUE'), false);
    assert.equal(/<w:drawing[\s>]/.test(xmlSem), false);
  });

  it('ata da rede usa o painel compacto (categorias + lojas + motoboys)', async () => {
    const buf = await generateOcorrenciaAtaRedeDocx({
      empresa: 'Calenzano Pizzarias',
      ano: 2026,
      mes: 10,
      lojas: [
        { id: 'ahu', nome: 'CALENZANO AHÚ' },
        { id: 'portao', nome: 'CALENZANO PORTÃO' },
      ],
      items: [row({ destaqueAta: true, descricao: 'destaque rede' })],
      atrasos: [
        { lojaId: 'ahu', quantidade: 2 },
        { lojaId: 'portao', quantidade: 1 },
      ],
      prevItems: null,
      prevAtrasos: null,
      temDadosAnterior: false,
    });
    const xml = documentXml(buf);
    assert.match(xml, /POR CATEGORIA/);
    assert.match(xml, /POR LOJA/);
    assert.match(xml, /MOTOBOYS MAIS CITADOS/);
    assert.match(xml, /OCORRÊNCIAS EM DESTAQUE/);
    assert.match(xml, /destaque rede/);
    assert.match(xml, /22C55E/);
  });
});
