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
  PageOrientation,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
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
  formatNomePessoa,
  nomeEmpresaAta,
  quebraCategoriaLabel,
  totalOcorrenciasTexto,
  type LojaAtaRef,
  type OcorrenciaAtaRow,
  type AtrasoInformado,
  type MotoboyAtaRow,
} from '@/lib/ocorrencias-ata-data';

const MAX_FOTO_WIDTH_PX = 454;
const PHOTO_CONCURRENCY = 5;

/** A4 portrait 210mm × 297mm em DXA (twips). */
export const ATA_A4_WIDTH_DXA = 11906;
export const ATA_A4_HEIGHT_DXA = 16838;
export const ATA_PAGE_MARGIN_DXA = 720;
export const ATA_CONTENT_PORTRAIT_DXA = ATA_A4_WIDTH_DXA - 2 * ATA_PAGE_MARGIN_DXA; // 10466
export const ATA_CONTENT_LANDSCAPE_DXA = ATA_A4_HEIGHT_DXA - 2 * ATA_PAGE_MARGIN_DXA; // 15398
export const ATA_MIN_GRID_COL_DXA = 500;

/** Resumo por categoria: Categoria / Quantidade / Variação. */
export const ATA_RESUMO_COL_WIDTHS = [5466, 2500, 2500] as const;

/** Motoboy / Total / Detalhe por categoria. */
export const ATA_MOTOBOY_COL_WIDTHS = [3466, 1500, 5500] as const;

/** Abaixo disso a coluna restante da matriz não cabe em retrato. */
const ATA_MATRIZ_MIN_REST_PORTRAIT_DXA = 1000;

export function divideRestanteIgual(total: number, count: number): number[] {
  if (count <= 0) return [];
  const base = Math.floor(total / count);
  const extra = total - base * count;
  return Array.from({ length: count }, (_, i) => base + (i < extra ? 1 : 0));
}

/** Primeira coluna maior; as demais iguais. Soma === contentWidth. */
export function matrizLojaCategoriaWidths(
  colCount: number,
  contentWidth: number,
): number[] {
  if (colCount <= 1) return [contentWidth];
  const restCount = colCount - 1;
  const idealFirst = Math.floor((contentWidth * 2) / (2 + restCount));
  const maxFirst = contentWidth - restCount * ATA_MIN_GRID_COL_DXA;
  const first = Math.min(maxFirst, Math.max(ATA_MIN_GRID_COL_DXA, idealFirst));
  return [first, ...divideRestanteIgual(contentWidth - first, restCount)];
}

export function matrizUsaPaisagem(colCount: number): boolean {
  const portrait = matrizLojaCategoriaWidths(colCount, ATA_CONTENT_PORTRAIT_DXA);
  return portrait.slice(1).some((w) => w < ATA_MATRIZ_MIN_REST_PORTRAIT_DXA);
}

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

function cell(text: string, width: number, opts?: { bold?: boolean }) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
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

function ataTable(columnWidths: readonly number[], rows: TableRow[]) {
  const size = columnWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size, type: WidthType.DXA },
    columnWidths: [...columnWidths],
    layout: TableLayoutType.FIXED,
    rows,
  });
}

function pageProperties(landscape: boolean) {
  return {
    page: {
      size: {
        width: ATA_A4_WIDTH_DXA,
        height: ATA_A4_HEIGHT_DXA,
        orientation: landscape
          ? PageOrientation.LANDSCAPE
          : PageOrientation.PORTRAIT,
      },
      margin: {
        top: ATA_PAGE_MARGIN_DXA,
        right: ATA_PAGE_MARGIN_DXA,
        bottom: ATA_PAGE_MARGIN_DXA,
        left: ATA_PAGE_MARGIN_DXA,
      },
    },
  };
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

async function fotoParaAtaFromBytes(
  raw: Buffer,
): Promise<{ data: Buffer; w: number; h: number } | null> {
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

export type AtaFotoBytesByPath = ReadonlyMap<string, Buffer>;

async function carregarFotos(
  items: OcorrenciaAtaRow[],
  fotoBytesByPath?: AtaFotoBytesByPath,
): Promise<FotoMap> {
  const paths = [...new Set(items.flatMap((i) => i.fotoPaths).filter(Boolean))];
  const map: FotoMap = new Map();
  if (paths.length === 0) return map;
  const results = await mapPool(paths, PHOTO_CONCURRENCY, async (path) => {
    const raw = fotoBytesByPath
      ? (fotoBytesByPath.get(path) ?? null)
      : await downloadOcorrenciaFotoBytes(path);
    return { path, foto: raw ? await fotoParaAtaFromBytes(raw) : null };
  });
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
  const empresa = nomeEmpresaAta({ name: opts.empresa });
  const out: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'ATA DE REUNIÃO — OCORRÊNCIAS', bold: true, size: 32 }),
      ],
      spacing: { after: 120 },
    }),
  ];
  if (empresa) {
    out.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: empresa, size: 26, bold: true })],
        spacing: { after: 60 },
      }),
    );
  }
  out.push(
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
  );
  return out;
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
    if (d.motoboyNome) {
      out.push(bullet(`Motoboy: ${formatNomePessoa(d.motoboyNome)}`));
    }
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

function tabelaResumo(
  rows: { label: string; quantidadeLabel: string; variacao: string }[],
) {
  const w = ATA_RESUMO_COL_WIDTHS;
  return ataTable(w, [
    new TableRow({
      children: [
        cell('Categoria', w[0], { bold: true }),
        cell('Quantidade', w[1], { bold: true }),
        cell('Variação', w[2], { bold: true }),
      ],
    }),
    ...rows.map(
      (r) =>
        new TableRow({
          children: [
            cell(r.label, w[0]),
            cell(r.quantidadeLabel, w[1]),
            cell(r.variacao, w[2]),
          ],
        }),
    ),
  ]);
}

function motoboyLabel(m: MotoboyAtaRow, comLoja: boolean): string {
  return comLoja ? `${m.nome} (${m.lojaNome})` : m.nome;
}

function tabelaMotoboys(motoboys: MotoboyAtaRow[], comLoja: boolean) {
  const w = ATA_MOTOBOY_COL_WIDTHS;
  return ataTable(w, [
    new TableRow({
      children: [
        cell('Motoboy', w[0], { bold: true }),
        cell('Total', w[1], { bold: true }),
        cell('Detalhe por categoria', w[2], { bold: true }),
      ],
    }),
    ...motoboys.map(
      (m) =>
        new TableRow({
          children: [
            cell(motoboyLabel(m, comLoja), w[0]),
            cell(String(m.total), w[1]),
            cell(quebraCategoriaLabel(m.porCategoria) || '—', w[2]),
          ],
        }),
    ),
  ]);
}

function secaoMotoboys(
  motoboys: MotoboyAtaRow[],
  titulo: string,
  comLoja: boolean,
): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [divider(), heading(titulo)];
  if (motoboys.length === 0) {
    out.push(muted('Nenhum motoboy citado nas ocorrências do período.'));
    return out;
  }
  out.push(muted('Pedidos atrasados não entram nesta contagem.'));
  out.push(tabelaMotoboys(motoboys, comLoja));
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
  fotoBytesByPath?: AtaFotoBytesByPath;
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
  const fotos = await carregarFotos(destaques, opts.fotoBytesByPath);

  const children: (Paragraph | Table)[] = [
    ...cabecalho({
      empresa: opts.empresa,
      escopoLabel: `Loja: ${resumo.lojaNome}`,
      periodo,
      geradoEm,
    }),
    heading('1. Resumo por categoria'),
    tabelaResumo(resumo.resumo),
    divider(),
    heading('2. Total de ocorrências'),
    muted(totalOcorrenciasTexto(resumo.ocorrencias, resumo.atrasos)),
    ...secaoMotoboys(resumo.motoboys, '3. Motoboys citados', false),
    ...blocosDestaque(destaques, fotos, '4. Ocorrências em destaque'),
  ];

  const doc = new Document({
    sections: [{ properties: pageProperties(false), children }],
  });
  return Buffer.from(await Packer.toBuffer(doc));
}

function tabelaMatrizRede(
  rede: ReturnType<typeof buildRedeResumo>,
  widths: number[],
) {
  const headerCells = [
    cell('Loja', widths[0]!, { bold: true }),
    ...TODAS_CATEGORIAS.map((c, i) =>
      cell(categoriaLabel(c), widths[i + 1]!, { bold: true }),
    ),
    cell('Total', widths[widths.length - 1]!, { bold: true }),
  ];
  const bodyRows = rede.matriz.lojas.map(
    (l) =>
      new TableRow({
        children: [
          cell(l.lojaNome, widths[0]!),
          ...TODAS_CATEGORIAS.map((c, i) =>
            cell(
              c === 'PEDIDO_ATRASADO' && l.valores[c] === null
                ? ATRASO_NAO_INFORMADO
                : String(l.valores[c] ?? 0),
              widths[i + 1]!,
            ),
          ),
          cell(String(l.total), widths[widths.length - 1]!, { bold: true }),
        ],
      }),
  );
  const footer = new TableRow({
    children: [
      cell('Total', widths[0]!, { bold: true }),
      ...TODAS_CATEGORIAS.map((c, i) =>
        cell(
          rede.matriz.totaisColuna[c] === null
            ? ATRASO_NAO_INFORMADO
            : String(rede.matriz.totaisColuna[c] ?? 0),
          widths[i + 1]!,
          { bold: true },
        ),
      ),
      cell(String(rede.matriz.totalGeral), widths[widths.length - 1]!, {
        bold: true,
      }),
    ],
  });
  return ataTable(widths, [new TableRow({ children: headerCells }), ...bodyRows, footer]);
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
  fotoBytesByPath?: AtaFotoBytesByPath;
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
  const fotos = await carregarFotos(destaques, opts.fotoBytesByPath);

  const colCount = 1 + TODAS_CATEGORIAS.length + 1;
  const landscape = matrizUsaPaisagem(colCount);
  const contentW = landscape
    ? ATA_CONTENT_LANDSCAPE_DXA
    : ATA_CONTENT_PORTRAIT_DXA;
  const matrizWidths = matrizLojaCategoriaWidths(colCount, contentW);

  const before: (Paragraph | Table)[] = [
    ...cabecalho({
      empresa: opts.empresa,
      escopoLabel: 'Rede',
      periodo,
      geradoEm,
    }),
    heading('1. Resumo consolidado por categoria'),
    tabelaResumo(rede.resumo),
  ];

  const matrixBlocks: (Paragraph | Table)[] = [
    heading('2. Loja × categoria'),
    tabelaMatrizRede(rede, matrizWidths),
  ];

  const after: (Paragraph | Table)[] = [
    divider(),
    heading('3. Total por loja'),
    ...rede.rankingLojas.map((r) => {
      const atrasosTxt =
        r.atrasos === null ? ATRASO_NAO_INFORMADO : String(r.atrasos);
      return bullet(
        `${r.lojaNome}: ${r.total} (ocorrências ${r.ocorrencias} + atrasos ${atrasosTxt})`,
      );
    }),
    ...secaoMotoboys(rede.motoboys, '4. Motoboys citados na rede', true),
  ];

  if (rede.destaquesPorLoja.length > 0) {
    after.push(divider(), heading('5. Ocorrências em destaque'));
    for (const grupo of rede.destaquesPorLoja) {
      after.push(subheading(grupo.lojaNome));
      after.push(...blocosDestaque(grupo.items, fotos));
    }
  }

  const sections = landscape
    ? [
        { properties: pageProperties(false), children: [...before, divider()] },
        { properties: pageProperties(true), children: matrixBlocks },
        { properties: pageProperties(false), children: after },
      ]
    : [
        {
          properties: pageProperties(false),
          children: [...before, divider(), ...matrixBlocks, ...after],
        },
      ];

  const doc = new Document({ sections });
  return Buffer.from(await Packer.toBuffer(doc));
}

export { displayLojaAta };
