/**
 * Gera a ata de reunião (.docx) a partir de ComplaintReviewRun + Comparisons.
 * Estrutura:
 *   1. Cabeçalho (ATA, empresa, período, gerado em)
 *   2. Seção "1. Resumo por Loja" — contagem por categoria + variação vs mês anterior
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

function body(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    spacing: { after: 120 },
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

  // ─── Seção 1: Resumo por Loja (comparação mês a mês) ──────────────────────

  children.push(heading('1. Resumo por Loja (comparação mês a mês)'));

  if (run.comparisons.length === 0) {
    children.push(
      muted(
        'Comparação com o mês anterior ainda não disponível. Execute a comparação antes de gerar a ata.',
      ),
    );
  } else {
    // Agrupar comparisons por loja
    const byLoja = new Map<string, typeof run.comparisons>();
    for (const comp of run.comparisons) {
      const list = byLoja.get(comp.lojaId) ?? [];
      list.push(comp);
      byLoja.set(comp.lojaId, list);
    }

    // Ordenar lojas por nome
    const sortedLojas = [...byLoja.entries()].sort(([, a], [, b]) =>
      (a[0]?.lojaNome ?? '').localeCompare(b[0]?.lojaNome ?? '', 'pt-BR'),
    );

    for (const [, comps] of sortedLojas) {
      const lojaNome = comps[0]?.lojaNome ?? '—';
      children.push(subheading(`Loja: ${lojaNome}`));

      // Ordenar por CATEGORIA_ORDER
      const sortedComps = [...comps].sort((a, b) => {
        const ia = CATEGORIA_ORDER.indexOf(a.categoria as string);
        const ib = CATEGORIA_ORDER.indexOf(b.categoria as string);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      });

      for (const comp of sortedComps) {
        const label = CATEGORIA_LABEL[comp.categoria as string] ?? comp.categoria;
        const variacao = formatVariacao(
          comp.contagemMesAtual,
          comp.contagemMesAnterior,
          comp.variacaoPercentual,
        );
        children.push(bullet(`${label}: ${comp.contagemMesAtual} ${variacao}`));
      }
    }
  }

  // ─── Seção 2: Total de Reclamações ────────────────────────────────────────

  children.push(divider());
  children.push(heading('2. Total de Reclamações'));

  const confirmedComplaints = run.complaints;

  if (confirmedComplaints.length === 0) {
    children.push(
      muted(
        'Nenhuma reclamação confirmada para inclusão nesta ata. Revise as reclamações detectadas e marque "Incluir na ata" antes de gerar.',
      ),
    );
  } else {
    children.push(
      muted(
        `Total confirmado: ${confirmedComplaints.length} reclamação(ões) · ${run.totalConversas ?? '—'} conversa(s) analisada(s).`,
      ),
    );

    // Agrupar por loja
    const totalByLoja = new Map<string, { lojaNome: string; count: number }>();
    for (const c of confirmedComplaints) {
      const lojaKey = c.lojaId ?? c.lojaGrupo ?? 'Sem loja identificada';
      const lojaNome = c.lojaGrupo ?? c.lojaId ?? 'Sem loja identificada';
      const entry = totalByLoja.get(lojaKey) ?? { lojaNome, count: 0 };
      entry.count += 1;
      totalByLoja.set(lojaKey, entry);
    }

    const sortedTotals = [...totalByLoja.values()].sort((a, b) =>
      a.lojaNome.localeCompare(b.lojaNome, 'pt-BR'),
    );

    for (const { lojaNome, count } of sortedTotals) {
      children.push(bullet(`${lojaNome}: ${count} reclamação(ões)`));
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
