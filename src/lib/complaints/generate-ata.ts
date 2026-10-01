/**
 * Gera a ata de reunião (.docx) a partir de ComplaintReviewRun + Comparisons.
 * Estrutura:
 *   1. Cabeçalho (ATA, empresa, período, gerado em)
 *   2. Seção "1. Resumo por Loja" — contagem por categoria (+ variação vs mês anterior, se houver)
 *   3. Seção "2. Total de Reclamações" — totais confirmados por loja
 */

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  BorderStyle,
} from 'docx';
import { prisma } from '@/lib/prisma';
import { saoPauloYmd } from '@/lib/complaints/period';
import {
  normalizeLojaKey,
  pickOperationalLojas,
  resolveLojaFromGrupoNome,
  resolveToOperationalLojaId,
  type LojaRef,
} from '@/lib/complaints/loja-match';

// ─── Labels e ordem canônica de categorias ────────────────────────────────────

const CATEGORIA_LABEL: Record<string, string> = {
  QUALIDADE: 'Reclamação de qualidade',
  PIZZA_VIRADA: 'Pizzas viradas',
  ESQUECEU_BEBIDA: 'Esquecer bebida/item',
  PEDIDO_ERRADO: 'Pedido entregue errado',
  PEDIDO_ATRASADO: 'Pedido atrasado',
  OUTROS: 'Outros',
};

const CATEGORIA_ORDER = [
  'QUALIDADE',
  'PIZZA_VIRADA',
  'ESQUECEU_BEBIDA',
  'PEDIDO_ERRADO',
  'PEDIDO_ATRASADO',
  'OUTROS',
];

// ─── Utilitários de formatação ────────────────────────────────────────────────

function monthYearLabel(d: Date): string {
  const { year } = saoPauloYmd(d);
  const name = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    timeZone: 'America/Sao_Paulo',
  }).format(d);
  const capped = name.charAt(0).toUpperCase() + name.slice(1);
  return `${capped}/${year}`;
}

function formatDatePt(d: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(d);
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

function divider() {
  return new Paragraph({
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC', space: 8 },
    },
    spacing: { before: 80, after: 160 },
  });
}

// ─── Formatação de variação ────────────────────────────────────────────────────

function formatVariacao(
  contagemMesAtual: number,
  contagemMesAnterior: number,
  variacaoPercentual: number | null,
): string {
  if (contagemMesAnterior === 0) return '(novo)';
  if (contagemMesAtual === 0) return '(resolvido)';
  if (variacaoPercentual === null) return `(mês anterior: ${contagemMesAnterior})`;
  if (variacaoPercentual > 0)
    return `(mês anterior: ${contagemMesAnterior}, +${variacaoPercentual}%)`;
  if (variacaoPercentual < 0)
    return `(mês anterior: ${contagemMesAnterior}, ${variacaoPercentual}%)`;
  return `(mês anterior: ${contagemMesAnterior}, estável)`;
}

function friendlyLojaNome(nome: string): string {
  return nome.replace(/^calenzano\s+/i, '').trim() || nome;
}

/**
 * Resolve nome canônico da loja (une "CALENZANO AHÚ", "Loja Ahú", "Ahu", etc.).
 */
function resolveComplaintLojaNome(
  c: { lojaId: string | null; lojaGrupo: string | null },
  allRhLojas: LojaRef[],
  operational: LojaRef[],
  lojaNomeById: Map<string, string>,
): string {
  if (c.lojaId) {
    const opId = resolveToOperationalLojaId(c.lojaId, allRhLojas, operational);
    const op = opId ? operational.find((l) => l.id === opId) : undefined;
    if (op) return op.nome;

    const raw = lojaNomeById.get(c.lojaId);
    if (raw) {
      const key = normalizeLojaKey(raw);
      const byKey = key
        ? operational.find((l) => normalizeLojaKey(l.nome) === key)
        : undefined;
      return byKey?.nome ?? friendlyLojaNome(raw);
    }
  }

  if (c.lojaGrupo?.trim()) {
    const fromGrupo = resolveLojaFromGrupoNome(c.lojaGrupo, allRhLojas, operational);
    if (fromGrupo) return fromGrupo.nome;
    return friendlyLojaNome(c.lojaGrupo.trim());
  }

  return 'Sem loja identificada';
}

type LojaCategoriaRow = {
  lojaNome: string;
  total: number;
  byCategoria: Map<string, number>;
};

function buildResumoPorLoja(
  complaints: { lojaId: string | null; lojaGrupo: string | null; categoria: string | null }[],
  allRhLojas: LojaRef[],
  operational: LojaRef[],
  lojaNomeById: Map<string, string>,
): LojaCategoriaRow[] {
  const byLoja = new Map<string, LojaCategoriaRow>();

  for (const c of complaints) {
    const lojaNome = resolveComplaintLojaNome(c, allRhLojas, operational, lojaNomeById);
    const cat = c.categoria && CATEGORIA_LABEL[c.categoria] ? c.categoria : 'OUTROS';
    const row = byLoja.get(lojaNome) ?? {
      lojaNome,
      total: 0,
      byCategoria: new Map<string, number>(),
    };
    row.total += 1;
    row.byCategoria.set(cat, (row.byCategoria.get(cat) ?? 0) + 1);
    byLoja.set(lojaNome, row);
  }

  return [...byLoja.values()].sort((a, b) =>
    a.lojaNome.localeCompare(b.lojaNome, 'pt-BR'),
  );
}

// ─── Função principal ──────────────────────────────────────────────────────────

/**
 * Monta o .docx da ata para um ComplaintReviewRun.
 */
export async function generateComplaintAtaDocx(reviewRunId: string): Promise<Buffer> {
  const run = await prisma.complaintReviewRun.findUnique({
    where: { id: reviewRunId },
    include: {
      user: { select: { name: true, fullName: true, email: true } },
      comparisons: {
        orderBy: [{ lojaNome: 'asc' }, { categoria: 'asc' }],
      },
      complaints: {
        where: { confirmadoPorHumano: true },
        select: { lojaId: true, lojaGrupo: true, categoria: true },
      },
    },
  });

  if (!run) throw new Error('Review run não encontrado.');

  const confirmedComplaints = run.complaints;

  const allRhLojas = await prisma.rhLoja.findMany({
    where: { userId: run.userId, ativo: true },
    select: { id: true, nome: true },
  });
  const lojaNomeById = new Map(allRhLojas.map((l) => [l.id, l.nome]));
  const ifoodNomes = [
    ...new Set(
      confirmedComplaints
        .map((c) => c.lojaGrupo?.trim())
        .filter((n): n is string => Boolean(n)),
    ),
  ];
  const operational = pickOperationalLojas({
    rhLojas: allRhLojas,
    ifoodLojaNomes: ifoodNomes,
  });

  const resumoPorLoja = buildResumoPorLoja(
    confirmedComplaints,
    allRhLojas,
    operational,
    lojaNomeById,
  );

  // Índice de comparação: lojaKey|categoria → comparison
  const comparisonByKey = new Map<
    string,
    {
      contagemMesAtual: number;
      contagemMesAnterior: number;
      variacaoPercentual: number | null;
    }
  >();
  for (const comp of run.comparisons) {
    const keyNome =
      resolveComplaintLojaNome(
        { lojaId: comp.lojaId, lojaGrupo: comp.lojaNome },
        allRhLojas,
        operational,
        lojaNomeById,
      ) || comp.lojaNome;
    comparisonByKey.set(`${keyNome}|${comp.categoria}`, {
      contagemMesAtual: comp.contagemMesAtual,
      contagemMesAnterior: comp.contagemMesAnterior,
      variacaoPercentual: comp.variacaoPercentual,
    });
  }
  const hasComparison = run.comparisons.length > 0;

  const empresa =
    run.user.name?.trim() ||
    run.user.fullName?.trim() ||
    run.user.email?.trim() ||
    'Empresa';
  const periodo = monthYearLabel(run.periodStart);
  const geradoEm = formatDatePt(new Date());

  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'ATA DE REUNIÃO — RECLAMAÇÕES', bold: true, size: 32 }),
      ],
      spacing: { after: 120 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: empresa, size: 26, bold: true })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Período: ${periodo}  ·  Gerado em: ${geradoEm}`,
          size: 20,
          color: '555555',
        }),
      ],
      spacing: { after: 200 },
    }),
    divider(),
  ];

  // ─── Seção 1: Resumo por Loja ───────────────────────────────────────────────

  children.push(
    heading(
      hasComparison
        ? '1. Resumo por Loja (comparação mês a mês)'
        : '1. Resumo por Loja',
    ),
  );

  if (confirmedComplaints.length === 0) {
    children.push(
      muted(
        'Nenhuma reclamação confirmada para inclusão nesta ata. Revise as reclamações detectadas e marque "Incluir na ata" antes de gerar.',
      ),
    );
  } else {
    if (!hasComparison) {
      children.push(
        muted(
          'Comparação com o mês anterior ainda não disponível. Contagens abaixo referem-se apenas ao período atual.',
        ),
      );
    }

    for (const row of resumoPorLoja) {
      children.push(subheading(`Loja: ${row.lojaNome}`));
      children.push(muted(`Total: ${row.total} reclamação(ões)`));

      const cats = CATEGORIA_ORDER.filter((cat) => (row.byCategoria.get(cat) ?? 0) > 0);
      // Inclui categorias só no mês anterior (resolvidas) quando há comparação
      if (hasComparison) {
        for (const cat of CATEGORIA_ORDER) {
          if (cats.includes(cat)) continue;
          if (comparisonByKey.has(`${row.lojaNome}|${cat}`)) cats.push(cat);
        }
      }

      for (const cat of cats) {
        const count = row.byCategoria.get(cat) ?? 0;
        const label = CATEGORIA_LABEL[cat] ?? cat;
        const comp = comparisonByKey.get(`${row.lojaNome}|${cat}`);
        if (comp) {
          const variacao = formatVariacao(
            count,
            comp.contagemMesAnterior,
            comp.variacaoPercentual,
          );
          children.push(bullet(`${label}: ${count} ${variacao}`));
        } else {
          children.push(bullet(`${label}: ${count}`));
        }
      }
    }
  }

  // ─── Seção 2: Total de Reclamações ────────────────────────────────────────

  children.push(divider());
  children.push(heading('2. Total de Reclamações'));

  if (confirmedComplaints.length === 0) {
    children.push(
      muted(
        'Nenhuma reclamação confirmada para inclusão nesta ata.',
      ),
    );
  } else {
    children.push(
      muted(
        `Total confirmado: ${confirmedComplaints.length} reclamação(ões) · ${run.totalConversas ?? '—'} conversa(s) analisada(s).`,
      ),
    );

    for (const row of resumoPorLoja) {
      children.push(bullet(`${row.lojaNome}: ${row.total} reclamação(ões)`));
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
