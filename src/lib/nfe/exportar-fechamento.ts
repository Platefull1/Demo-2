/**
 * Exporta fechamento CMV Real para XLSX (análise do mês).
 * Estilos alinhados à identidade Platefull (verde / tinta / muted).
 */

import * as XLSXImport from 'xlsx-js-style';
import type { VendaMesDetalhe } from '@/lib/cmv-real/venda-liquida';
import type { LinhaFechamento, PendenciaFechamento } from './fechamento';
import { storeLabel } from './lojas';
import type { TransferenciaResumo } from './transferencia-documento';

/** Interop CJS/ESM do xlsx-js-style (tsx --test vs Next). */
const XLSX =
  (XLSXImport as { utils?: unknown }).utils != null
    ? XLSXImport
    : ((XLSXImport as { default: typeof XLSXImport }).default ?? XLSXImport);

const STATUS_XLSX: Record<string, string> = {
  AGUARDANDO_ENTRADA: 'Aguardando entrada',
  AGUARDANDO_SAIDA: 'Aguardando saída',
  CONCILIADA: 'Conciliada',
  DIVERGENTE: 'Divergente',
};

const SECAO_LABEL: Record<string, string> = {
  MATERIA_PRIMA: 'Matéria-prima',
  EMBALAGEM: 'Embalagens',
  BEBIDA: 'Bebidas',
  GERAL: 'Geral',
};

const SECAO_ORDER = ['MATERIA_PRIMA', 'EMBALAGEM', 'BEBIDA', 'GERAL'] as const;

/** Cores da ata / design system Platefull */
const C = {
  green: '22C55E',
  greenSoft: 'ECFDF3',
  ink: '0A0A0A',
  muted: '71717A',
  line: 'E4E4E7',
  track: 'F4F4F5',
  white: 'FFFFFF',
  alert: 'FEF3C7',
};

type BorderSide = { style: string; color: { rgb: string } };
type BorderAll = {
  top: BorderSide;
  bottom: BorderSide;
  left: BorderSide;
  right: BorderSide;
};

function borderAll(rgb = C.line): BorderAll {
  const side: BorderSide = { style: 'thin', color: { rgb } };
  return { top: side, bottom: side, left: side, right: side };
}

const TITLE_STYLE = {
  font: { name: 'Calibri', sz: 14, bold: true, color: { rgb: C.ink } },
  alignment: { horizontal: 'left' as const, vertical: 'center' as const },
};

const SUBTITLE_STYLE = {
  font: { name: 'Calibri', sz: 10, color: { rgb: C.muted } },
  alignment: { horizontal: 'left' as const, vertical: 'center' as const },
};

const ALERT_STYLE = {
  font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: C.ink } },
  fill: { patternType: 'solid' as const, fgColor: { rgb: C.alert } },
  alignment: { horizontal: 'left' as const, vertical: 'center' as const, wrapText: true },
};

const TH_STYLE = {
  font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: C.white } },
  fill: { patternType: 'solid' as const, fgColor: { rgb: C.green } },
  alignment: {
    horizontal: 'center' as const,
    vertical: 'center' as const,
    wrapText: true,
  },
  border: borderAll(C.green),
};

const SECTION_STYLE = {
  font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: C.ink } },
  fill: { patternType: 'solid' as const, fgColor: { rgb: C.track } },
  alignment: { horizontal: 'left' as const, vertical: 'center' as const },
  border: borderAll(C.line),
};

const SUBTOTAL_STYLE = {
  font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: C.ink } },
  fill: { patternType: 'solid' as const, fgColor: { rgb: C.greenSoft } },
  alignment: { horizontal: 'left' as const, vertical: 'center' as const },
  border: borderAll(C.line),
};

const LABEL_STYLE = {
  font: { name: 'Calibri', sz: 10, color: { rgb: C.ink } },
  alignment: { horizontal: 'left' as const, vertical: 'center' as const },
  border: borderAll(C.line),
};

const VALUE_STYLE = {
  font: { name: 'Calibri', sz: 10, color: { rgb: C.ink } },
  alignment: { horizontal: 'left' as const, vertical: 'center' as const },
  border: borderAll(C.line),
};

const MONEY_STYLE = {
  font: { name: 'Calibri', sz: 10, color: { rgb: C.ink } },
  alignment: { horizontal: 'right' as const, vertical: 'center' as const },
  border: borderAll(C.line),
  numFmt: '"R$" #,##0.00',
};

const QTY_STYLE = {
  font: { name: 'Calibri', sz: 10, color: { rgb: C.ink } },
  alignment: { horizontal: 'right' as const, vertical: 'center' as const },
  border: borderAll(C.line),
  numFmt: '#,##0.###',
};

const PCT_STYLE = {
  font: { name: 'Calibri', sz: 10, color: { rgb: C.ink } },
  alignment: { horizontal: 'right' as const, vertical: 'center' as const },
  border: borderAll(C.line),
  numFmt: '0.0%',
};

type Cell = string | number | null | undefined;

function secaoLabel(secao: string) {
  return SECAO_LABEL[secao] || secao;
}

function competenciaPorExtenso(competencia: string): string {
  const [y, m] = competencia.split('-').map(Number);
  if (!y || !m) return competencia;
  const nome = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, 1)));
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

function geradoEmSp(): string {
  return new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function setCell(
  ws: XLSX.WorkSheet,
  r: number,
  c: number,
  value: Cell,
  style?: Record<string, unknown>
) {
  const ref = XLSX.utils.encode_cell({ r, c });
  const isNum = typeof value === 'number' && Number.isFinite(value);
  const cell: XLSX.CellObject = {
    v: value == null ? '' : value,
    t: isNum ? 'n' : 's',
  };
  if (style) cell.s = style;
  ws[ref] = cell;
}

function applyPrint(ws: XLSX.WorkSheet, repeatRowsUntil: number) {
  (ws as XLSX.WorkSheet & { '!pageSetup'?: object; '!printHeader'?: number[] })[
    '!pageSetup'
  ] = {
    orientation: 'landscape',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
  };
  // Título / cabeçalho repetido no topo ao imprimir
  (ws as XLSX.WorkSheet & { '!printHeader'?: number[] })['!printHeader'] = [
    1,
    Math.max(1, repeatRowsUntil),
  ];
}

type AtencaoRow = {
  tipo: string;
  produto: string;
  secao: string;
  qtd: number | null;
  impacto: number;
  motivo: string;
};

function buildAtencaoRows(linhas: LinhaFechamento[]): AtencaoRow[] {
  const rows: AtencaoRow[] = [];
  for (const l of linhas) {
    if (l.consumoQtd < 0) {
      rows.push({
        tipo: 'Consumo negativo',
        produto: l.nome,
        secao: secaoLabel(l.secao),
        qtd: l.consumoQtd,
        impacto: l.consumoValor,
        motivo: 'Consumo qtd < 0 (estoque final maior que entradas − saídas)',
      });
    }
    const iniPend =
      l.estoqueInicial > 0 && l.custoOrigemInicial === 'PENDENTE';
    const fimPend = l.estoqueFinal > 0 && l.custoOrigemFinal === 'PENDENTE';
    if (iniPend || fimPend) {
      const partes: string[] = [];
      if (iniPend) {
        partes.push(
          l.custoOrigemDetalheInicial || 'Custo do estoque inicial pendente',
        );
      }
      if (fimPend) {
        partes.push(
          l.custoOrigemDetalheFinal || 'Custo do estoque final pendente',
        );
      }
      rows.push({
        tipo: 'Custo pendente',
        produto: l.nome,
        secao: secaoLabel(l.secao),
        qtd: iniPend ? l.estoqueInicial : l.estoqueFinal,
        impacto: l.consumoValor,
        motivo: partes.join('; '),
      });
    }
  }
  rows.sort((a, b) => Math.abs(b.impacto) - Math.abs(a.impacto));
  return rows;
}

function buildResumoSheet(params: {
  storeSlug: string;
  competencia: string;
  status: string;
  vendaMes: number | null;
  vendaMesDetalhe: VendaMesDetalhe | null;
  ajustes: Array<{ secao: string; descricao: string; valor: number }>;
  cmvMp?: { valor: number; pct: number | null };
  cmvEmbalagens?: { valor: number; pct: number | null };
  cmvBebidas?: { valor: number; pct: number | null };
  cmvTotal?: { valor: number; pct: number | null };
  semEstoqueFinal: boolean;
  pendencias: PendenciaFechamento[];
  atencaoCount: number;
}): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const loja = storeLabel(params.storeSlug);
  const compLabel = competenciaPorExtenso(params.competencia);
  const statusLabel = params.status === 'FECHADO' ? 'Fechado' : 'Aberto';

  let r = 0;
  setCell(ws, r++, 0, 'CMV Real — Fechamento', TITLE_STYLE);
  setCell(
    ws,
    r++,
    0,
    `Loja: ${loja}    Competência: ${compLabel}    Status: ${statusLabel}`,
    SUBTITLE_STYLE,
  );
  setCell(ws, r++, 0, `Gerado em: ${geradoEmSp()}`, SUBTITLE_STYLE);

  if (params.semEstoqueFinal) {
    r += 1;
    setCell(
      ws,
      r++,
      0,
      'CMV PARCIAL — sem estoque final, não comparável com meses fechados',
      ALERT_STYLE,
    );
    setCell(
      ws,
      r++,
      0,
      'O valor inclui o estoque inicial como se tivesse sido consumido. Use o ritmo (compras ÷ venda) para comparar com a planilha.',
      SUBTITLE_STYLE,
    );
  }

  r += 1;
  const det = params.vendaMesDetalhe;
  setCell(ws, r++, 0, 'Venda do mês', SECTION_STYLE);
  setCell(ws, r, 0, 'Venda bruta', LABEL_STYLE);
  setCell(
    ws,
    r++,
    1,
    det?.vendaBruta ?? params.vendaMes,
    MONEY_STYLE,
  );
  if (det) {
    setCell(
      ws,
      r,
      0,
      `(−) Taxas entrega > ${det.limiteTaxa.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}`,
      LABEL_STYLE,
    );
    setCell(ws, r++, 1, det.taxaEntregaExcluida, MONEY_STYLE);
    setCell(ws, r, 0, '(−) Consumo interno', LABEL_STYLE);
    setCell(ws, r++, 1, det.consumoInterno, MONEY_STYLE);
    setCell(ws, r, 0, '(−) Créditos / trocas / reentrega', LABEL_STYLE);
    setCell(ws, r++, 1, det.creditosExcluidos, MONEY_STYLE);
    setCell(ws, r, 0, '(=) Venda líquida', LABEL_STYLE);
    setCell(ws, r++, 1, det.vendaLiquida, MONEY_STYLE);
    if (det.ajusteVenda) {
      setCell(
        ws,
        r,
        0,
        `(±) Ajuste — ${det.ajusteVenda.motivo}`,
        LABEL_STYLE,
      );
      setCell(ws, r++, 1, det.ajusteVenda.valor, MONEY_STYLE);
    }
  } else {
    setCell(ws, r, 0, 'Venda líquida / informada', LABEL_STYLE);
    setCell(ws, r++, 1, params.vendaMes, MONEY_STYLE);
  }

  r += 1;
  setCell(ws, r, 0, 'CMV por seção', TH_STYLE);
  setCell(ws, r, 1, 'Valor', TH_STYLE);
  setCell(ws, r++, 2, '% da venda', TH_STYLE);

  const secoesCmv = [
    { label: 'Matéria-prima', r: params.cmvMp },
    { label: 'Embalagens', r: params.cmvEmbalagens },
    { label: 'Bebidas', r: params.cmvBebidas },
    { label: 'TOTAL', r: params.cmvTotal },
  ] as const;
  for (const s of secoesCmv) {
    const style = s.label === 'TOTAL' ? SUBTOTAL_STYLE : LABEL_STYLE;
    setCell(ws, r, 0, s.label, style);
    setCell(ws, r, 1, s.r?.valor ?? null, {
      ...MONEY_STYLE,
      ...(s.label === 'TOTAL'
        ? { fill: SUBTOTAL_STYLE.fill, font: SUBTOTAL_STYLE.font }
        : {}),
    });
    setCell(ws, r++, 2, s.r?.pct ?? null, {
      ...PCT_STYLE,
      ...(s.label === 'TOTAL'
        ? { fill: SUBTOTAL_STYLE.fill, font: SUBTOTAL_STYLE.font }
        : {}),
    });
  }

  r += 1;
  setCell(ws, r++, 0, 'Ajustes manuais', SECTION_STYLE);
  if (params.ajustes.length === 0) {
    setCell(ws, r++, 0, 'Nenhum ajuste manual', SUBTITLE_STYLE);
  } else {
    for (const a of params.ajustes) {
      setCell(
        ws,
        r,
        0,
        `${secaoLabel(a.secao)} — ${a.descricao}`,
        LABEL_STYLE,
      );
      setCell(ws, r++, 1, a.valor, MONEY_STYLE);
    }
    const totalAj = params.ajustes.reduce((s, a) => s + a.valor, 0);
    setCell(ws, r, 0, 'Total dos ajustes', SUBTOTAL_STYLE);
    setCell(ws, r++, 1, totalAj, {
      ...MONEY_STYLE,
      fill: SUBTOTAL_STYLE.fill,
      font: SUBTOTAL_STYLE.font,
    });
  }

  r += 1;
  setCell(ws, r++, 0, 'Pendências do mês', SECTION_STYLE);
  if (params.pendencias.length === 0) {
    setCell(ws, r++, 0, 'Nenhuma pendência', SUBTITLE_STYLE);
  } else {
    for (const p of params.pendencias) {
      setCell(ws, r++, 0, `• ${p.mensagem}`, LABEL_STYLE);
    }
  }

  r += 1;
  setCell(
    ws,
    r++,
    0,
    params.atencaoCount === 0
      ? 'Pontos de atenção: nenhum'
      : `Pontos de atenção: ${params.atencaoCount} (ver aba Atenção)`,
    LABEL_STYLE,
  );

  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: Math.max(r - 1, 0), c: 2 },
  });
  ws['!cols'] = [{ wch: 48 }, { wch: 16 }, { wch: 14 }];
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
  ];
  applyPrint(ws, 3);
  ws['!freeze'] = { xSplit: 0, ySplit: 3 };

  return ws;
}

function buildConsumoSheet(linhas: LinhaFechamento[]): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  let r = 0;
  setCell(ws, r++, 0, 'CMV Real — Consumo', TITLE_STYLE);
  setCell(
    ws,
    r++,
    0,
    'Ordenado por Consumo R$ (maior primeiro); linhas zeradas omitidas',
    SUBTITLE_STYLE,
  );

  const headerRow = r;
  const headers = [
    'Seção',
    'Produto',
    'Unidade',
    'Consumo (qtd)',
    'Custo médio',
    'Consumo (R$)',
    '% do CMV da seção',
  ];
  headers.forEach((h, c) => setCell(ws, r, c, h, TH_STYLE));
  r += 1;

  const bySecao = new Map<string, LinhaFechamento[]>();
  for (const l of linhas) {
    if (l.consumoQtd === 0 && l.consumoValor === 0) continue;
    const arr = bySecao.get(l.secao) || [];
    arr.push(l);
    bySecao.set(l.secao, arr);
  }

  const secoes = [
    ...SECAO_ORDER.filter((s) => bySecao.has(s)),
    ...[...bySecao.keys()].filter(
      (s) => !(SECAO_ORDER as readonly string[]).includes(s),
    ),
  ];

  for (const secao of secoes) {
    const items = (bySecao.get(secao) || []).slice().sort(
      (a, b) => b.consumoValor - a.consumoValor,
    );
    const totalSecao = items.reduce((s, l) => s + l.consumoValor, 0);

    setCell(ws, r, 0, secaoLabel(secao), SECTION_STYLE);
    for (let c = 1; c < 7; c++) setCell(ws, r, c, '', SECTION_STYLE);
    r += 1;

    for (const l of items) {
      const custo =
        l.consumoQtd !== 0 && l.consumoValor !== 0
          ? l.consumoValor / l.consumoQtd
          : l.custoMedioFinal ?? l.custoMedioInicial;
      const pct = totalSecao !== 0 ? l.consumoValor / totalSecao : null;
      setCell(ws, r, 0, secaoLabel(l.secao), LABEL_STYLE);
      setCell(ws, r, 1, l.nome, LABEL_STYLE);
      setCell(ws, r, 2, l.unidade, LABEL_STYLE);
      setCell(ws, r, 3, l.consumoQtd, QTY_STYLE);
      setCell(ws, r, 4, custo, MONEY_STYLE);
      setCell(ws, r, 5, l.consumoValor, MONEY_STYLE);
      setCell(ws, r, 6, pct, PCT_STYLE);
      r += 1;
    }

    setCell(ws, r, 0, `Subtotal ${secaoLabel(secao)}`, SUBTOTAL_STYLE);
    for (let c = 1; c < 5; c++) setCell(ws, r, c, '', SUBTOTAL_STYLE);
    setCell(ws, r, 5, totalSecao, {
      ...MONEY_STYLE,
      fill: SUBTOTAL_STYLE.fill,
      font: SUBTOTAL_STYLE.font,
    });
    setCell(ws, r, 6, totalSecao !== 0 ? 1 : null, {
      ...PCT_STYLE,
      fill: SUBTOTAL_STYLE.fill,
      font: SUBTOTAL_STYLE.font,
    });
    r += 1;
  }

  const lastCol = 6;
  const lastRow = Math.max(r - 1, headerRow);
  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: lastRow, c: lastCol },
  });
  ws['!cols'] = [
    { wch: 16 },
    { wch: 36 },
    { wch: 10 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
  ];
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: lastCol } },
  ];
  ws['!autofilter'] = {
    ref: XLSX.utils.encode_range({
      s: { r: headerRow, c: 0 },
      e: { r: lastRow, c: lastCol },
    }),
  };
  ws['!freeze'] = { xSplit: 0, ySplit: headerRow + 1 };
  applyPrint(ws, headerRow + 1);

  return ws;
}

function buildAtencaoSheet(rows: AtencaoRow[]): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  let r = 0;
  setCell(ws, r++, 0, 'CMV Real — Atenção', TITLE_STYLE);
  setCell(
    ws,
    r++,
    0,
    'Produtos com consumo negativo ou custo pendente',
    SUBTITLE_STYLE,
  );

  const headerRow = r;
  const headers = [
    'Tipo',
    'Produto',
    'Seção',
    'Qtd',
    'Impacto R$',
    'Motivo',
  ];
  headers.forEach((h, c) => setCell(ws, r, c, h, TH_STYLE));
  r += 1;

  for (const row of rows) {
    setCell(ws, r, 0, row.tipo, LABEL_STYLE);
    setCell(ws, r, 1, row.produto, LABEL_STYLE);
    setCell(ws, r, 2, row.secao, LABEL_STYLE);
    setCell(ws, r, 3, row.qtd, QTY_STYLE);
    setCell(ws, r, 4, row.impacto, MONEY_STYLE);
    setCell(ws, r, 5, row.motivo, LABEL_STYLE);
    r += 1;
  }

  const lastCol = 5;
  const lastRow = Math.max(r - 1, headerRow);
  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: lastRow, c: lastCol },
  });
  ws['!cols'] = [
    { wch: 18 },
    { wch: 32 },
    { wch: 14 },
    { wch: 12 },
    { wch: 14 },
    { wch: 48 },
  ];
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: lastCol } },
  ];
  ws['!freeze'] = { xSplit: 0, ySplit: headerRow + 1 };
  applyPrint(ws, headerRow + 1);
  return ws;
}

function buildTransferenciasSheet(
  transferencias: TransferenciaResumo[],
): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  let r = 0;
  setCell(ws, r++, 0, 'CMV Real — Transferências', TITLE_STYLE);
  setCell(ws, r++, 0, 'Movimentos entre lojas no mês', SUBTITLE_STYLE);

  const headerRow = r;
  const headers = [
    'Documento',
    'Data',
    'Origem',
    'Destino',
    'Status',
    'Produto',
    'Qtd',
    'Unidade',
    'Valor',
  ];
  headers.forEach((h, c) => setCell(ws, r, c, h, TH_STYLE));
  r += 1;

  for (const d of transferencias) {
    const lados = d.lados.length ? d.lados : [null];
    for (const lado of lados) {
      const itens = lado?.itens?.length ? lado.itens : [null];
      for (const it of itens) {
        setCell(ws, r, 0, d.numeroDocumento, LABEL_STYLE);
        setCell(ws, r, 1, d.data.slice(0, 10), LABEL_STYLE);
        setCell(ws, r, 2, storeLabel(d.lojaOrigem), LABEL_STYLE);
        setCell(ws, r, 3, storeLabel(d.lojaDestino), LABEL_STYLE);
        setCell(ws, r, 4, STATUS_XLSX[d.status] || d.status, LABEL_STYLE);
        setCell(ws, r, 5, it?.nome || '', LABEL_STYLE);
        setCell(ws, r, 6, it?.quantidade ?? null, QTY_STYLE);
        setCell(ws, r, 7, it?.unidade || '', LABEL_STYLE);
        setCell(ws, r, 8, it?.valorTotal ?? null, MONEY_STYLE);
        r += 1;
      }
    }
  }

  const lastCol = 8;
  const lastRow = Math.max(r - 1, headerRow);
  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: lastRow, c: lastCol },
  });
  ws['!cols'] = [
    { wch: 14 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 28 },
    { wch: 10 },
    { wch: 10 },
    { wch: 14 },
  ];
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: lastCol } },
  ];
  ws['!freeze'] = { xSplit: 0, ySplit: headerRow + 1 };
  applyPrint(ws, headerRow + 1);
  return ws;
}

export function exportarFechamentoXlsx(params: {
  storeSlug: string;
  competencia: string;
  status?: string;
  linhas: LinhaFechamento[];
  vendaMes: number | null;
  vendaMesDetalhe?: VendaMesDetalhe | null;
  ajustes: Array<{ secao: string; descricao: string; valor: number }>;
  cmvMp?: { valor: number; pct: number | null };
  cmvEmbalagens?: { valor: number; pct: number | null };
  cmvBebidas?: { valor: number; pct: number | null };
  cmvTotal?: { valor: number; pct: number | null };
  semEstoqueFinal?: boolean;
  pendencias?: PendenciaFechamento[];
  transferencias?: TransferenciaResumo[];
}): Buffer {
  const atencao = buildAtencaoRows(params.linhas);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    buildResumoSheet({
      storeSlug: params.storeSlug,
      competencia: params.competencia,
      status: params.status || 'ABERTO',
      vendaMes: params.vendaMes,
      vendaMesDetalhe: params.vendaMesDetalhe ?? null,
      ajustes: params.ajustes,
      cmvMp: params.cmvMp,
      cmvEmbalagens: params.cmvEmbalagens,
      cmvBebidas: params.cmvBebidas,
      cmvTotal: params.cmvTotal,
      semEstoqueFinal: Boolean(params.semEstoqueFinal),
      pendencias: params.pendencias ?? [],
      atencaoCount: atencao.length,
    }),
    'Resumo',
  );

  XLSX.utils.book_append_sheet(wb, buildConsumoSheet(params.linhas), 'Consumo');

  if (atencao.length > 0) {
    XLSX.utils.book_append_sheet(wb, buildAtencaoSheet(atencao), 'Atenção');
  }

  if ((params.transferencias?.length ?? 0) > 0) {
    XLSX.utils.book_append_sheet(
      wb,
      buildTransferenciasSheet(params.transferencias || []),
      'Transferências',
    );
  }

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}
