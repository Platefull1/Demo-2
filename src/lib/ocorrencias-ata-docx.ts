/**
 * Gerador .docx da ata de ocorrências.
 * Copia o visual da ata de Reclamações (títulos, bullets, divisor)
 * sem importar nem alterar generate-ata.ts.
 */

import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import sharp from 'sharp';
import { formatOcorrenciaDateTime, monthYearLabelSP } from '@/lib/ocorrencias-period';
import { downloadOcorrenciaFotoBytes } from '@/lib/ocorrencias-storage';
import { categoriaLabel } from '@/lib/ocorrencias-categorias';
import { TODAS_CATEGORIAS } from '@/lib/ocorrencias-categorias';
import {
  ATRASO_NAO_INFORMADO,
  buildLojaResumo,
  buildRedeResumo,
  canalAtaLabel,
  destaquesDaAta,
  displayLojaAta,
  quebraCategoriaLabel,
  type LojaAtaRef,
  type OcorrenciaAtaRow,
  type AtrasoInformado,
} from '@/lib/ocorrencias-ata-data';

const MAX_FOTO_WIDTH_PX = 454;
const PHOTO_CONCURRENCY = 5;

function heading(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
  });
}

function subheading(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
  });
}

function muted(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, italics: true, color: '666666' })],
    spacing: { after: 80 },
  });
}

function bullet(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });
}

function body(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    spacing: { after: 80 },
  });
}

function divider() {
  return new Paragraph({
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC', space: 8 },
    },
    spacing: { before: 80, after: 160 },
  });
}

function thinBorder() {
  return { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' };
}

function cell(text: string, opts?: { bold?: boolean; width?: number }) {
  return new TableCell({
    width: opts?.width
      ? { size: opts.width, type: WidthType.DXA }
      : undefined,
    borders: {
      top: thinBorder(),
      bottom: thinBorder(),
      left: thinBorder(),
      right: thinBorder(),
    },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        children: [new TextRun({ text, size: 18, bold: opts?.bold })],
      }),
    ],
  });
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]!);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );
  return out;
}

async function fotoParaAta(path: string): Promise<{ data: Buffer; w: number; h: number } | null> {
  const raw = await downloadOcorrenciaFotoBytes(path);
  if (!raw) return null;
  try {
    const img = sharp(raw);
    const meta = await img.metadata();
    const srcW = meta.width || MAX_FOTO_WIDTH_PX;
    const srcH = meta.height || MAX_FOTO_WIDTH_PX;
    const scale = Math.min(1, MAX_FOTO_WIDTH_PX / srcW);
    const w = Math.max(1, Math.round(srcW * scale));
    const h = Math.max(1, Math.round(srcH * scale));
    const data = await img
      .resize(w, h, { fit: 'inside' })
      .jpeg({ quality: 72 })
      .toBuffer();
    return { data, w, h };
  } catch {
    return null;
  }
}

type FotoMap = Map<string, { data: Buffer; w: number; h: number }>;

async function carregarFotos(items: OcorrenciaAtaRow[]): Promise<FotoMap> {
  const paths = [...new Set(items.flatMap((i) => i.fotoPaths).filter(Boolean))];
  const map: FotoMap = new Map();
  if (paths.length === 0) return map;
  const results = await mapPool(paths, PHOTO_CONCURRENCY, async (path) => ({
    path,
    foto: await fotoParaAta(path),
  }));
  for (const r of results) {
    if (r.foto) map.set(r.path, r.foto);
  }
  return map;
}

function cabecalho(opts: {
  empresa: string;
  escopoLabel: string;
  periodo: string;
  geradoEm: string;
}): Paragraph[] {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'ATA DE REUNIÃO — OCORRÊNCIAS', bold: true, size: 32 }),
      ],
      spacing: { after: 120 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: opts.empresa, size: 26, bold: true })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: opts.escopoLabel, size: 24 })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Período: ${opts.periodo}  ·  Gerado em: ${opts.geradoEm}`,
          size: 20,
          color: '555555',
        }),
      ],
      spacing: { after: 200 },
    }),
    divider(),
  ];
}

function blocosDestaque(
  items: OcorrenciaAtaRow[],
  fotos: FotoMap,
  titulo?: string,
): (Paragraph | Table)[] {
  if (items.length === 0) return [];
  const out: (Paragraph | Table)[] = [];
  if (titulo) {
    out.push(divider(), heading(titulo));
  }
  for (const d of items) {
    const quando = formatOcorrenciaDateTime(
      typeof d.createdAt === 'string' ? d.createdAt : d.createdAt.toISOString(),
    );
    const cats = d.categorias.map((c) => categoriaLabel(c)).join(', ') || '—';
    const ext = d.numeroPedidoExterno
      ? `${d.numeroPedidoExterno}${d.canalExterno ? ` (${canalAtaLabel(d.canalExterno)})` : ''}`
      : '—';
    out.push(subheading(`Pedido Saipos ${d.numeroPedidoSaipos}`));
    out.push(bullet(`Data/hora: ${quando}`));
    out.push(bullet(`Pedido externo: ${ext}`));
    out.push(bullet(`Categorias: ${cats}`));
    if (d.motoboyNome) out.push(bullet(`Motoboy: ${d.motoboyNome}`));
    if (d.descricao.trim()) out.push(body(d.descricao.trim()));
    for (const path of d.fotoPaths) {
      const foto = fotos.get(path);
      if (!foto) continue;
      out.push(
        new Paragraph({
          children: [
            new ImageRun({
              type: 'jpg',
              data: foto.data,
              transformation: { width: foto.w, height: foto.h },
            }),
          ],
          spacing: { after: 160 },
        }),
      );
    }
  }
  return out;
}

export async function generateOcorrenciaAtaLojaDocx(opts: {
  empresa: string;
  ano: number;
  mes: number;
  loja: LojaAtaRef;
  items: OcorrenciaAtaRow[];
  atraso: number | null;
  prevItems: OcorrenciaAtaRow[] | null;
  prevAtraso: number | null;
  temDadosAnterior: boolean;
}): Promise<Buffer> {
  const periodo = monthYearLabelSP(opts.ano, opts.mes);
  const geradoEm = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date());

  const resumo = buildLojaResumo({
    loja: opts.loja,
    items: opts.items,
    atraso: opts.atraso,
    prevItems: opts.prevItems,
    prevAtraso: opts.prevAtraso,
    temDadosAnterior: opts.temDadosAnterior,
  });

  const destaques = destaquesDaAta(opts.items);
  const fotos = await carregarFotos(destaques);

  const children: (Paragraph | Table)[] = [
    ...cabecalho({
      empresa: opts.empresa,
      escopoLabel: `Loja: ${resumo.lojaNome}`,
      periodo,
      geradoEm,
    }),
    heading('1. Resumo por categoria'),
  ];

  children.push(
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        new TableRow({
          children: [
            cell('Categoria', { bold: true }),
            cell('Quantidade', { bold: true }),
            cell('Variação', { bold: true }),
          ],
        }),
        ...resumo.resumo.map(
          (r) =>
            new TableRow({
              children: [
                cell(r.label),
                cell(r.quantidadeLabel),
                cell(r.variacao),
              ],
            }),
        ),
      ],
    }),
  );

  children.push(divider());
  children.push(heading('2. Total de ocorrências'));
  const atrasoTxt =
    resumo.atrasos === null
      ? ATRASO_NAO_INFORMADO
      : String(resumo.atrasos);
  children.push(
    muted(
      `${resumo.ocorrencias} ocorrência(s) registradas + ${atrasoTxt} pedido(s) atrasado(s) = ${resumo.atrasos === null ? `${resumo.ocorrencias} + não informado` : String(resumo.total)}.`,
    ),
  );

  children.push(divider());
  children.push(heading('3. Motoboys citados'));
  if (resumo.motoboys.length === 0) {
    children.push(muted('Nenhum motoboy citado nas ocorrências do período.'));
  } else {
    children.push(muted(`${resumo.motoboys.length} motoboy(s) citado(s). Pedidos atrasados não entram.`));
    for (const m of resumo.motoboys) {
      const quebra = quebraCategoriaLabel(m.porCategoria);
      children.push(bullet(`${m.nome}: ${m.total}${quebra ? ` — ${quebra}` : ''}`));
    }
  }

  children.push(...blocosDestaque(destaques, fotos, '4. Ocorrências em destaque'));

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
        children,
      },
    ],
  });
  return Buffer.from(await Packer.toBuffer(doc));
}

export async function generateOcorrenciaAtaRedeDocx(opts: {
  empresa: string;
  ano: number;
  mes: number;
  lojas: LojaAtaRef[];
  items: OcorrenciaAtaRow[];
  atrasos: AtrasoInformado[];
  prevItems: OcorrenciaAtaRow[] | null;
  prevAtrasos: AtrasoInformado[] | null;
  temDadosAnterior: boolean;
}): Promise<Buffer> {
  const periodo = monthYearLabelSP(opts.ano, opts.mes);
  const geradoEm = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date());

  const rede = buildRedeResumo(opts);
  const destaques = rede.destaquesPorLoja.flatMap((g) => g.items);
  const fotos = await carregarFotos(destaques);

  const children: (Paragraph | Table)[] = [
    ...cabecalho({
      empresa: opts.empresa,
      escopoLabel: 'Rede',
      periodo,
      geradoEm,
    }),
    heading('1. Resumo consolidado por categoria'),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        new TableRow({
          children: [
            cell('Categoria', { bold: true }),
            cell('Quantidade', { bold: true }),
            cell('Variação', { bold: true }),
          ],
        }),
        ...rede.resumo.map(
          (r) =>
            new TableRow({
              children: [
                cell(r.label),
                cell(r.quantidadeLabel),
                cell(r.variacao),
              ],
            }),
        ),
      ],
    }),
    divider(),
    heading('2. Loja × categoria'),
  ];

  const headerCells = [
    cell('Loja', { bold: true }),
    ...TODAS_CATEGORIAS.map((c) => cell(categoriaLabel(c), { bold: true })),
    cell('Total', { bold: true }),
  ];
  const bodyRows = rede.matriz.lojas.map(
    (l) =>
      new TableRow({
        children: [
          cell(l.lojaNome),
          ...TODAS_CATEGORIAS.map((c) =>
            cell(
              c === 'PEDIDO_ATRASADO' && l.valores[c] === null
                ? ATRASO_NAO_INFORMADO
                : String(l.valores[c] ?? 0),
            ),
          ),
          cell(String(l.total), { bold: true }),
        ],
      }),
  );
  const footer = new TableRow({
    children: [
      cell('Total', { bold: true }),
      ...TODAS_CATEGORIAS.map((c) =>
        cell(
          rede.matriz.totaisColuna[c] === null
            ? ATRASO_NAO_INFORMADO
            : String(rede.matriz.totaisColuna[c] ?? 0),
          { bold: true },
        ),
      ),
      cell(String(rede.matriz.totalGeral), { bold: true }),
    ],
  });
  children.push(
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [new TableRow({ children: headerCells }), ...bodyRows, footer],
    }),
  );

  children.push(divider());
  children.push(heading('3. Total por loja'));
  for (const r of rede.rankingLojas) {
    const atrasosTxt =
      r.atrasos === null ? ATRASO_NAO_INFORMADO : String(r.atrasos);
    children.push(
      bullet(
        `${r.lojaNome}: ${r.total} (ocorrências ${r.ocorrencias} + atrasos ${atrasosTxt})`,
      ),
    );
  }

  children.push(divider());
  children.push(heading('4. Motoboys citados na rede'));
  if (rede.motoboys.length === 0) {
    children.push(muted('Nenhum motoboy citado nas ocorrências do período.'));
  } else {
    children.push(muted('Pedidos atrasados não entram nesta contagem.'));
    for (const m of rede.motoboys) {
      const quebra = quebraCategoriaLabel(m.porCategoria);
      children.push(
        bullet(
          `${m.nome} · ${m.lojaNome}: ${m.total}${quebra ? ` — ${quebra}` : ''}`,
        ),
      );
    }
  }

  if (rede.destaquesPorLoja.length > 0) {
    children.push(divider());
    children.push(heading('5. Ocorrências em destaque'));
    for (const grupo of rede.destaquesPorLoja) {
      children.push(subheading(grupo.lojaNome));
      children.push(...blocosDestaque(grupo.items, fotos));
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
        children,
      },
    ],
  });
  return Buffer.from(await Packer.toBuffer(doc));
}

export { displayLojaAta };
