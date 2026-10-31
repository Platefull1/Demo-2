/**
 * Gerador .docx da ata de ocorrências — painel compacto
 * (modelo-3) nas cores Platefull. Não altera a ata de Reclamações.
 */

import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  ImageRun,
  Packer,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlignTable,
  WidthType,
} from 'docx';
import sharp from 'sharp';
import { formatOcorrenciaDateTime, monthYearLabelSP } from '@/lib/ocorrencias-period';
import { downloadOcorrenciaFotoBytes } from '@/lib/ocorrencias-storage';
import { categoriaLabel } from '@/lib/ocorrencias-categorias';
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
  type LojaAtaRef,
  type OcorrenciaAtaRow,
  type AtrasoInformado,
  type MotoboyAtaRow,
  type ResumoCategoria,
} from '@/lib/ocorrencias-ata-data';

const PHOTO_CONCURRENCY = 5;
const CARD_FOTO_W = 280;
const CARD_FOTO_H = 170;
const TOP_MOTOBOYS = 6;
const BAR_W = 1700;

/** A4 210×297 mm. Margem do modelo compacto: 1134 DXA. */
export const ATA_A4_WIDTH_DXA = 11906;
export const ATA_A4_HEIGHT_DXA = 16838;
export const ATA_PAGE_MARGIN_DXA = 1134;
export const ATA_CONTENT_PORTRAIT_DXA = ATA_A4_WIDTH_DXA - 2 * ATA_PAGE_MARGIN_DXA; // 9638
export const ATA_MIN_GRID_COL_DXA = 80;

const W = ATA_CONTENT_PORTRAIT_DXA;
const COL = 4600;
const GUTTER = 438;
const HERO_LEFT = 6638;
const HERO_RIGHT = 3000;
const CAT_LABEL = 2300;
const CAT_BAR = 1820;
const CAT_QTD = 480;
const MOTO_NOME = 3900;
const MOTO_QTD = 700;
const CARD = 4669;
const CARD_GAP = 300;

const C = {
  green: '22C55E',
  ink: '0A0A0A',
  muted: '71717A',
  line: 'E4E4E7',
  track: 'F4F4F5',
  banner: 'ECFDF3',
  card: 'FAFAFA',
} as const;

function noneBorder() {
  return { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
}

function hairBottom() {
  return {
    top: noneBorder(),
    left: noneBorder(),
    right: noneBorder(),
    bottom: { style: BorderStyle.SINGLE, size: 4, color: C.line },
  };
}

function noBorders() {
  return {
    top: noneBorder(),
    left: noneBorder(),
    right: noneBorder(),
    bottom: noneBorder(),
  };
}

function run(
  text: string,
  opts: {
    size: number;
    bold?: boolean;
    italics?: boolean;
    color?: string;
    spacing?: number;
  },
) {
  return new TextRun({
    text,
    font: 'Calibri',
    size: opts.size,
    bold: opts.bold,
    italics: opts.italics,
    color: opts.color ?? C.ink,
    characterSpacing: opts.spacing,
  });
}

function para(
  children: TextRun[],
  opts?: { after?: number; before?: number; align?: (typeof AlignmentType)[keyof typeof AlignmentType] },
) {
  return new Paragraph({
    children,
    spacing: { after: opts?.after ?? 0, before: opts?.before ?? 0 },
    alignment: opts?.align,
  });
}

function emptyPara() {
  return para([run('', { size: 20 })]);
}

function sectionLabel(text: string) {
  return para([run(text, { size: 15, bold: true, color: C.green, spacing: 30 })], {
    after: 100,
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

function tc(
  width: number,
  children: (Paragraph | Table)[],
  opts?: {
    borders?: ReturnType<typeof hairBottom>;
    fill?: string;
    align?: (typeof VerticalAlignTable)[keyof typeof VerticalAlignTable];
    pad?: { top?: number; bottom?: number; left?: number; right?: number };
  },
) {
  const pad = opts?.pad ?? { top: 80, bottom: 80, left: 0, right: 0 };
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: opts?.borders ?? noBorders(),
    shading: opts?.fill ? { fill: opts.fill, type: 'clear' as const } : undefined,
    verticalAlign: opts?.align ?? VerticalAlignTable.CENTER,
    margins: {
      top: pad.top ?? 80,
      bottom: pad.bottom ?? 80,
      left: pad.left ?? 0,
      right: pad.right ?? 0,
    },
    children: children.length ? children : [emptyPara()],
  });
}

function pageProperties() {
  return {
    page: {
      size: {
        width: ATA_A4_WIDTH_DXA,
        height: ATA_A4_HEIGHT_DXA,
      },
      margin: {
        top: ATA_PAGE_MARGIN_DXA,
        right: ATA_PAGE_MARGIN_DXA,
        bottom: ATA_PAGE_MARGIN_DXA,
        left: ATA_PAGE_MARGIN_DXA,
        header: 708,
        footer: 708,
      },
    },
  };
}

function rodape(empresa: string, geradoEm: string) {
  const prefix = empresa
    ? `${empresa} · gerada em ${geradoEm}   ·   página `
    : `gerada em ${geradoEm}   ·   página `;
  return new Footer({
    children: [
      para(
        [
          run(prefix, { size: 16, color: C.muted }),
          new TextRun({ children: [PageNumber.CURRENT], font: 'Calibri', size: 16, color: C.muted }),
        ],
        { align: AlignmentType.CENTER },
      ),
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

async function fotoParaCard(raw: Buffer): Promise<{ data: Buffer; w: number; h: number } | null> {
  try {
    const data = await sharp(raw)
      .resize(CARD_FOTO_W, CARD_FOTO_H, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 72 })
      .toBuffer();
    return { data, w: CARD_FOTO_W, h: CARD_FOTO_H };
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
    return { path, foto: raw ? await fotoParaCard(raw) : null };
  });
  for (const r of results) {
    if (r.foto) map.set(r.path, r.foto);
  }
  return map;
}

function eyebrow(empresa: string) {
  const text = empresa
    ? `${empresa.toUpperCase()}  ·  ATA DE REUNIÃO`
    : 'ATA DE REUNIÃO';
  return para([run(text, { size: 15, bold: true, color: C.muted, spacing: 40 })], {
    after: 120,
  });
}

function hero(opts: {
  titulo: string;
  periodo: string;
  ocorrencias: number;
  atrasos: number | null;
}) {
  const ocLabel =
    opts.ocorrencias === 1 ? 'ocorrência registrada' : 'ocorrências registradas';
  const extra =
    opts.atrasos !== null && opts.atrasos > 0
      ? `+ ${opts.atrasos} ${opts.atrasos === 1 ? 'pedido atrasado' : 'pedidos atrasados'}`
      : null;

  const right: Paragraph[] = [
    para([run(String(opts.ocorrencias), { size: 64, bold: true, color: C.green })], {
      align: AlignmentType.RIGHT,
    }),
    para([run(ocLabel, { size: 17, color: C.muted })], { align: AlignmentType.RIGHT }),
  ];
  if (extra) {
    right.push(
      para([run(extra, { size: 15, color: C.muted })], { align: AlignmentType.RIGHT }),
    );
  }

  return ataTable([HERO_LEFT, HERO_RIGHT], [
    new TableRow({
      children: [
        tc(
          HERO_LEFT,
          [
            para([run('Ocorrências do mês', { size: 18, color: C.muted })]),
            para([
              run(opts.titulo, { size: 52, bold: true, color: C.ink }),
              run(`  ${opts.periodo}`, { size: 28, color: C.muted }),
            ]),
          ],
          {
            align: VerticalAlignTable.BOTTOM,
            pad: { top: 80, bottom: 80, left: 0, right: 120 },
          },
        ),
        tc(HERO_RIGHT, right, {
          align: VerticalAlignTable.BOTTOM,
          pad: { top: 80, bottom: 80, left: 120, right: 0 },
        }),
      ],
    }),
  ]);
}

function regraHero() {
  return new Paragraph({
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 12, color: C.ink, space: 6 },
    },
    spacing: { after: 200, before: 0 },
    children: [run('', { size: 20 })],
  });
}

function sortResumo(rows: ResumoCategoria[]): ResumoCategoria[] {
  const atrasado = rows.filter((r) => r.categoria === 'PEDIDO_ATRASADO');
  const rest = rows
    .filter((r) => r.categoria !== 'PEDIDO_ATRASADO')
    .sort((a, b) => {
      const qa = a.quantidade ?? -1;
      const qb = b.quantidade ?? -1;
      if (qb !== qa) return qb - qa;
      return a.label.localeCompare(b.label, 'pt-BR');
    });
  return [...atrasado, ...rest];
}

function barra(value: number, max: number): Table {
  const fill =
    max <= 0 || value <= 0
      ? 0
      : Math.min(BAR_W, Math.max(80, Math.round((BAR_W * value) / max)));
  const rest = BAR_W - fill;
  const widths = rest > 0 && fill > 0 ? [fill, rest] : [BAR_W];
  const fills = rest > 0 && fill > 0 ? [C.green, C.track] : [fill > 0 ? C.green : C.track];
  return ataTable(
    widths,
    [
      new TableRow({
        children: widths.map((w, i) =>
          tc(w, [para([run(' ', { size: 4 })])], {
            fill: fills[i],
            pad: { top: 40, bottom: 40, left: 0, right: 0 },
          }),
        ),
      }),
    ],
  );
}

function painelCategorias(rows: ResumoCategoria[]): Table {
  const ordered = sortResumo(rows);
  const max = Math.max(
    0,
    ...ordered
      .filter((r) => r.quantidade !== null)
      .map((r) => r.quantidade ?? 0),
  );
  return ataTable(
    [CAT_LABEL, CAT_BAR, CAT_QTD],
    ordered.map((r) => {
      const semNumero = r.quantidade === null;
      const mid = semNumero
        ? [
            para([
              run(ATRASO_NAO_INFORMADO, { size: 15, italics: true, color: C.muted }),
            ]),
          ]
        : [barra(r.quantidade ?? 0, max), emptyPara()];
      return new TableRow({
        children: [
          tc(
            CAT_LABEL,
            [para([run(r.label, { size: 18, color: C.ink })])],
            { borders: hairBottom(), pad: { top: 80, bottom: 80, left: 0, right: 120 } },
          ),
          tc(CAT_BAR, mid, {
            borders: hairBottom(),
            pad: { top: 80, bottom: 80, left: 0, right: 120 },
          }),
          tc(
            CAT_QTD,
            [
              para(
                [
                  run(semNumero ? '—' : String(r.quantidade ?? 0), {
                    size: 18,
                    bold: true,
                    color: C.ink,
                  }),
                ],
                { align: AlignmentType.RIGHT },
              ),
            ],
            { borders: hairBottom(), pad: { top: 80, bottom: 80, left: 120, right: 0 } },
          ),
        ],
      });
    }),
  );
}

function detalheMotoboy(m: MotoboyAtaRow): string {
  const q = quebraCategoriaLabel(m.porCategoria);
  return q ? q.replace(/, /g, ' · ') : '—';
}

function painelLista(
  rows: { titulo: string; detalhe: string; total: number }[],
): Table {
  return ataTable(
    [MOTO_NOME, MOTO_QTD],
    rows.map((r) =>
      new TableRow({
        children: [
          tc(
            MOTO_NOME,
            [
              para([run(r.titulo, { size: 18, bold: true, color: C.ink })]),
              para([run(r.detalhe, { size: 15, color: C.muted })]),
            ],
            { borders: hairBottom(), pad: { top: 80, bottom: 80, left: 0, right: 120 } },
          ),
          tc(
            MOTO_QTD,
            [
              para(
                [
                  run(String(r.total), {
                    size: 26,
                    bold: true,
                    color: r.total > 1 ? C.green : C.ink,
                  }),
                ],
                { align: AlignmentType.RIGHT },
              ),
            ],
            { borders: hairBottom(), pad: { top: 80, bottom: 80, left: 120, right: 0 } },
          ),
        ],
      }),
    ),
  );
}

function restoMotoboys(ocultos: MotoboyAtaRow[]): Paragraph | null {
  if (ocultos.length === 0) return null;
  const allOne = ocultos.every((m) => m.total === 1);
  const n = ocultos.length;
  const text = allOne
    ? `+ ${n} ${n === 1 ? 'motoboy' : 'motoboys'} com 1 ocorrência`
    : `+ ${n} ${n === 1 ? 'motoboy' : 'motoboys'}`;
  return para([run(text, { size: 15, italics: true, color: C.muted })], { before: 80 });
}

function duasColunas(left: (Paragraph | Table)[], right: (Paragraph | Table)[]) {
  return ataTable([COL, GUTTER, COL], [
    new TableRow({
      children: [
        tc(COL, [...left, emptyPara()], {
          align: VerticalAlignTable.TOP,
          pad: { top: 80, bottom: 80, left: 0, right: 0 },
        }),
        tc(GUTTER, [emptyPara()], {
          pad: { top: 80, bottom: 80, left: 120, right: 120 },
        }),
        tc(COL, [...right, emptyPara()], {
          align: VerticalAlignTable.TOP,
          pad: { top: 80, bottom: 80, left: 0, right: 0 },
        }),
      ],
    }),
  ]);
}

function banner(text: string) {
  return ataTable([W], [
    new TableRow({
      children: [
        tc(
          W,
          [
            para([
              run('Atenção: ', { size: 17, bold: true, color: C.green }),
              run(text, { size: 17, color: C.ink }),
            ]),
          ],
          {
            fill: C.banner,
            pad: { top: 140, bottom: 140, left: 200, right: 120 },
          },
        ),
      ],
    }),
  ]);
}

function bannerText(opts: {
  mesNome: string;
  atrasosNull: boolean;
  temDadosAnterior: boolean;
  lojasSemAtraso: string[];
}): string | null {
  const bits: string[] = [];
  if (opts.atrasosNull && opts.lojasSemAtraso.length === 0) {
    bits.push(
      `o número de pedidos atrasados de ${opts.mesNome} ainda não foi informado.`,
    );
  } else if (opts.lojasSemAtraso.length > 0) {
    bits.push(
      `pedidos atrasados ainda sem número em ${opts.lojasSemAtraso.join(', ')}.`,
    );
  }
  if (!opts.temDadosAnterior) {
    bits.push('Variação vs. mês anterior disponível a partir do próximo mês.');
  }
  if (bits.length === 0) return null;
  return bits.join(' ');
}

function cardDestaque(
  d: OcorrenciaAtaRow,
  fotos: FotoMap,
  lojaNome?: string,
): (Paragraph | Table)[] {
  const quando = formatOcorrenciaDateTime(
    typeof d.createdAt === 'string' ? d.createdAt : d.createdAt.toISOString(),
  );
  const cat = (d.categorias[0] ? categoriaLabel(d.categorias[0]) : 'Ocorrência').toUpperCase();
  const canal = d.canalExterno ? canalAtaLabel(d.canalExterno) : '';
  const metaParts = [
    canal && d.numeroPedidoExterno ? `${canal} ${d.numeroPedidoExterno}` : d.numeroPedidoExterno,
    quando,
    lojaNome,
  ].filter(Boolean);
  const desc = d.descricao.trim();
  const out: (Paragraph | Table)[] = [];
  const foto = d.fotoPaths.map((p) => fotos.get(p)).find(Boolean);
  if (foto) {
    out.push(
      new Paragraph({
        spacing: { after: 0, before: 0 },
        children: [
          new ImageRun({
            type: 'jpg',
            data: foto.data,
            transformation: { width: foto.w, height: foto.h },
          }),
        ],
      }),
    );
  }
  out.push(
    para([run(cat, { size: 14, bold: true, color: C.green, spacing: 20 })], {
      before: 140,
    }),
    para([run(`Pedido ${d.numeroPedidoSaipos}`, { size: 26, bold: true, color: C.ink })], {
      before: 40,
    }),
    para([run(metaParts.join(' · ') || '—', { size: 16, color: C.muted })]),
  );
  if (d.motoboyNome) {
    out.push(
      para([run(formatNomePessoa(d.motoboyNome), { size: 17, color: C.ink })], {
        before: 80,
      }),
    );
  }
  out.push(
    para(
      [
        run(desc || 'Sem descrição', {
          size: 17,
          color: desc ? C.ink : C.muted,
          italics: !desc,
        }),
      ],
      { before: 80 },
    ),
  );
  return out;
}

function gradeDestaques(
  items: { row: OcorrenciaAtaRow; lojaNome?: string }[],
  fotos: FotoMap,
): Table[] {
  const tables: Table[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const a = items[i]!;
    const b = items[i + 1];
    const left = cardDestaque(a.row, fotos, a.lojaNome);
    const right = b ? cardDestaque(b.row, fotos, b.lojaNome) : [emptyPara()];
    tables.push(
      ataTable([CARD, CARD_GAP, CARD], [
        new TableRow({
          children: [
            tc(CARD, left, {
              fill: C.card,
              align: VerticalAlignTable.TOP,
              pad: { top: 180, bottom: 200, left: 180, right: 180 },
            }),
            tc(CARD_GAP, [emptyPara()], {
              pad: { top: 80, bottom: 80, left: 120, right: 120 },
            }),
            tc(CARD, right, {
              fill: b ? C.card : undefined,
              align: VerticalAlignTable.TOP,
              pad: { top: 180, bottom: 200, left: 180, right: 180 },
            }),
          ],
        }),
      ]),
    );
  }
  return tables;
}

function painelMotoboys(
  motoboys: MotoboyAtaRow[],
  comLoja: boolean,
): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [sectionLabel('MOTOBOYS MAIS CITADOS')];
  if (motoboys.length === 0) {
    out.push(
      para([
        run('Nenhum motoboy citado nas ocorrências do período.', {
          size: 17,
          italics: true,
          color: C.muted,
        }),
      ]),
    );
    return out;
  }
  const top = motoboys.slice(0, TOP_MOTOBOYS);
  const rest = motoboys.slice(TOP_MOTOBOYS);
  out.push(
    painelLista(
      top.map((m) => ({
        titulo: comLoja ? `${m.nome} (${m.lojaNome})` : m.nome,
        detalhe: detalheMotoboy(m),
        total: m.total,
      })),
    ),
  );
  const extra = restoMotoboys(rest);
  if (extra) out.push(extra);
  return out;
}

type DocBlock = Paragraph | Table;

function montarPainel(opts: {
  empresa: string;
  titulo: string;
  periodo: string;
  geradoEm: string;
  ocorrencias: number;
  atrasos: number | null;
  resumo: ResumoCategoria[];
  direita: DocBlock[];
  banner: string | null;
  destaques: { row: OcorrenciaAtaRow; lojaNome?: string }[];
  fotos: FotoMap;
}): DocBlock[] {
  const children: DocBlock[] = [
    eyebrow(opts.empresa),
    hero({
      titulo: opts.titulo,
      periodo: opts.periodo,
      ocorrencias: opts.ocorrencias,
      atrasos: opts.atrasos,
    }),
    regraHero(),
    emptyPara(),
    duasColunas(
      [sectionLabel('POR CATEGORIA'), painelCategorias(opts.resumo)],
      opts.direita,
    ),
  ];
  if (opts.banner) {
    children.push(para([run('', { size: 20 })], { after: 240 }));
    children.push(banner(opts.banner));
  }
  if (opts.destaques.length > 0) {
    children.push(para([run('', { size: 20 })], { after: 280 }));
    children.push(sectionLabel('OCORRÊNCIAS EM DESTAQUE'));
    children.push(...gradeDestaques(opts.destaques, opts.fotos));
  }
  return children;
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
  const empresa = nomeEmpresaAta({ name: opts.empresa });
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
  const mesNome = periodo.split('/')[0]!.toLocaleLowerCase('pt-BR');

  const children = montarPainel({
    empresa,
    titulo: resumo.lojaNome,
    periodo,
    geradoEm,
    ocorrencias: resumo.ocorrencias,
    atrasos: resumo.atrasos,
    resumo: resumo.resumo,
    direita: painelMotoboys(resumo.motoboys, false),
    banner: bannerText({
      mesNome,
      atrasosNull: resumo.atrasos === null,
      temDadosAnterior: opts.temDadosAnterior,
      lojasSemAtraso: [],
    }),
    destaques: destaques.map((row) => ({ row })),
    fotos,
  });

  const doc = new Document({
    sections: [
      {
        properties: pageProperties(),
        footers: { default: rodape(empresa, geradoEm) },
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
  fotoBytesByPath?: AtaFotoBytesByPath;
}): Promise<Buffer> {
  const periodo = monthYearLabelSP(opts.ano, opts.mes);
  const geradoEm = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date());
  const empresa = nomeEmpresaAta({ name: opts.empresa });
  const rede = buildRedeResumo(opts);
  const destaques = rede.destaquesPorLoja.flatMap((g) =>
    g.items.map((row) => ({ row, lojaNome: g.lojaNome })),
  );
  const fotos = await carregarFotos(
    rede.destaquesPorLoja.flatMap((g) => g.items),
    opts.fotoBytesByPath,
  );
  const mesNome = periodo.split('/')[0]!.toLocaleLowerCase('pt-BR');

  const porLoja: DocBlock[] = [
    sectionLabel('POR LOJA'),
    painelLista(
      rede.rankingLojas.map((r) => ({
        titulo: r.lojaNome,
        detalhe:
          r.atrasos === null
            ? `${r.ocorrencias} ocorrências · atrasos ${ATRASO_NAO_INFORMADO}`
            : `${r.ocorrencias} ocorrências · ${r.atrasos} atrasos`,
        total: r.total,
      })),
    ),
  ];

  const children = montarPainel({
    empresa,
    titulo: 'Rede',
    periodo,
    geradoEm,
    ocorrencias: opts.items.length,
    atrasos: rede.matriz.totaisColuna.PEDIDO_ATRASADO ?? null,
    resumo: rede.resumo,
    direita: porLoja,
    banner: bannerText({
      mesNome,
      atrasosNull: false,
      temDadosAnterior: opts.temDadosAnterior,
      lojasSemAtraso: rede.lojasSemAtraso,
    }),
    destaques,
    fotos,
  });

  children.push(para([run('', { size: 20 })], { after: 240 }));
  children.push(...painelMotoboys(rede.motoboys, true));

  const doc = new Document({
    sections: [
      {
        properties: pageProperties(),
        footers: { default: rodape(empresa, geradoEm) },
        children,
      },
    ],
  });
  return Buffer.from(await Packer.toBuffer(doc));
}

export { displayLojaAta };
