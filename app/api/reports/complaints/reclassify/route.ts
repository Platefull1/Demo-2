export const dynamic = 'force-dynamic';
export const maxDuration = 300;

import { NextResponse } from 'next/server';
import { ComplaintCategoria } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getReportsTenantUserIds } from '@/lib/reports-tenant-auth';
import {
  callComplaintsOpenRouter,
  extractJsonObject,
} from '@/lib/complaints/openrouter';
import {
  matchLojaFromText,
  pickOperationalLojas,
  type LojaRef,
} from '@/lib/complaints/loja-match';

// ---------------------------------------------------------------------------
// POST /api/reports/complaints/reclassify
//
// Reclassifica reclamações sem categoria E/OU sem loja:
//   • lojaId  : iFood via lojaGrupo; cliente via conversa completa + resumo
//   • categoria: IA leve a partir do resumo
//
// Seguro chamar múltiplas vezes — só atualiza o que faltar.
// ---------------------------------------------------------------------------

const CATEGORIAS_VALIDAS = Object.values(ComplaintCategoria) as string[];

const SYSTEM_PROMPT = `Você é um classificador de reclamações de delivery (pizzaria/fast-food).
Dado o resumo de uma reclamação, classifique em EXATAMENTE uma das categorias abaixo:

QUALIDADE       — problemas com a comida: sabor, temperatura, borda errada/crua/vazando, pouco recheio, produto diferente do esperado
PIZZA_VIRADA    — pizza chegou virada, tombada ou amassada na caixa
ESQUECEU_BEBIDA — faltou item na entrega (bebida, acompanhamento, brinde)
PEDIDO_ERRADO   — pedido entregue no endereço errado OU item completamente trocado
PEDIDO_ATRASADO — entrega muito além do prazo, reclamação de demora
OUTROS          — qualquer coisa que não se encaixe claramente nas 5 categorias acima

Responda APENAS JSON válido, sem markdown:
{"categoria":"QUALIDADE"|"PIZZA_VIRADA"|"ESQUECEU_BEBIDA"|"PEDIDO_ERRADO"|"PEDIDO_ATRASADO"|"OUTROS"}`;

async function classificarCategoria(resumo: string): Promise<ComplaintCategoria> {
  try {
    const content = await callComplaintsOpenRouter({
      system: SYSTEM_PROMPT,
      user: `Resumo da reclamação: "${resumo.slice(0, 400)}"`,
      maxTokens: 60,
      temperature: 0.1,
    });
    const parsed = extractJsonObject(content) as { categoria?: unknown };
    const cat = String(parsed.categoria ?? '').toUpperCase().trim();
    return CATEGORIAS_VALIDAS.includes(cat)
      ? (cat as ComplaintCategoria)
      : ComplaintCategoria.OUTROS;
  } catch {
    return ComplaintCategoria.OUTROS;
  }
}

/** IA leve: extrai nome da loja a partir do texto da conversa + lista de lojas. */
async function extrairLojaComIa(
  texto: string,
  lojas: LojaRef[],
): Promise<string | null> {
  if (!texto.trim() || lojas.length === 0) return null;
  const nomes = lojas.map((l) => l.nome).join(', ');
  try {
    const content = await callComplaintsOpenRouter({
      system: `Você identifica qual loja de uma pizzaria aparece citada em uma conversa WhatsApp.
Lojas possíveis: ${nomes}
Responda APENAS JSON: {"loja":"<nome exato de uma das lojas>"|null}
Use null se a loja não estiver clara. Não invente.`,
      user: `Conversa:\n${texto.slice(0, 3500)}`,
      maxTokens: 80,
      temperature: 0.1,
    });
    const parsed = extractJsonObject(content) as { loja?: unknown };
    if (typeof parsed.loja !== 'string' || !parsed.loja.trim()) return null;
    const matched = matchLojaFromText(parsed.loja, lojas);
    return matched?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST() {
  const userIds = await getReportsTenantUserIds();
  if (!userIds) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  // Sem categoria OU sem loja (histórico já reclassificado por categoria ainda precisa de loja)
  const pendentes = await prisma.complaint.findMany({
    where: {
      userId: { in: userIds },
      OR: [{ categoria: null }, { lojaId: null }, { lojaIdentificada: false }],
    },
    select: {
      id: true,
      userId: true,
      contactId: true,
      resumo: true,
      origem: true,
      lojaGrupo: true,
      categoria: true,
      lojaId: true,
      lojaIdentificada: true,
      reviewRunId: true,
    },
  });

  if (pendentes.length === 0) {
    return NextResponse.json({
      ok: true,
      processados: 0,
      mensagem: 'Nenhuma reclamação pendente de reclassificação.',
    });
  }

  const runIds = [...new Set(pendentes.map((c) => c.reviewRunId))];
  const runs = await prisma.complaintReviewRun.findMany({
    where: { id: { in: runIds } },
    select: { id: true, periodStart: true, periodEnd: true },
  });
  const runById = new Map(runs.map((r) => [r.id, r]));

  const ifoodGroups = await prisma.iFoodComplaintGroup.findMany({
    where: { userId: { in: userIds }, ativo: true },
    select: { lojaNome: true },
  });
  const ifoodNomes = ifoodGroups.map((g) => g.lojaNome);

  const allRhLojas = await prisma.rhLoja.findMany({
    where: { userId: { in: userIds }, ativo: true },
    select: { id: true, nome: true },
  });
  const riders = await prisma.deliveryRider.findMany({
    where: { userId: { in: userIds }, status: { not: 'inactive' } },
    select: { lojaId: true },
  });
  const riderCounts = new Map<string, number>();
  for (const r of riders) {
    riderCounts.set(r.lojaId, (riderCounts.get(r.lojaId) ?? 0) + 1);
  }
  const operationalLojas = pickOperationalLojas({
    rhLojas: allRhLojas,
    ifoodLojaNomes: ifoodNomes,
    riderCounts,
  });

  let processados = 0;
  let lojasPreenchidas = 0;
  let erros = 0;

  for (const c of pendentes) {
    try {
      const data: {
        categoria?: ComplaintCategoria;
        lojaId?: string | null;
        lojaIdentificada?: boolean;
      } = {};

      // Categoria
      if (!c.categoria) {
        data.categoria = await classificarCategoria(c.resumo);
      }

      // Loja
      if (!c.lojaId || c.lojaIdentificada === false) {
        let lojaId: string | null = null;

        if (c.origem === 'GRUPO_IFOOD' && c.lojaGrupo) {
          lojaId = matchLojaFromText(c.lojaGrupo, operationalLojas)?.id ?? null;
          if (!lojaId) {
            lojaId = matchLojaFromText(c.lojaGrupo, allRhLojas)?.id ?? null;
          }
        } else {
          // 1) resumo
          lojaId = matchLojaFromText(c.resumo, operationalLojas)?.id ?? null;

          // 2) mensagens da conversa
          if (!lojaId) {
            const run = runById.get(c.reviewRunId);
            const msgs = await prisma.whatsAppMessage.findMany({
              where: {
                userId: c.userId,
                contactId: c.contactId,
                ...(run
                  ? { timestamp: { gte: run.periodStart, lte: run.periodEnd } }
                  : {}),
              },
              select: { textContent: true, direction: true },
              orderBy: { timestamp: 'asc' },
              take: 80,
            });
            const transcript = msgs
              .map((m) => m.textContent?.trim())
              .filter(Boolean)
              .join('\n');

            lojaId = matchLojaFromText(transcript, operationalLojas)?.id ?? null;

            // 3) IA na conversa se ainda não achou
            if (!lojaId && transcript.length > 20) {
              lojaId = await extrairLojaComIa(transcript, operationalLojas);
            }
          }
        }

        if (lojaId) {
          data.lojaId = lojaId;
          data.lojaIdentificada = true;
          lojasPreenchidas++;
        }
      }

      if (Object.keys(data).length === 0) {
        processados++;
        continue;
      }

      await prisma.complaint.update({
        where: { id: c.id },
        data,
      });
      processados++;
    } catch {
      erros++;
    }
  }

  return NextResponse.json({
    ok: true,
    total: pendentes.length,
    processados,
    lojasPreenchidas,
    erros,
    mensagem: `${processados} processadas; ${lojasPreenchidas} lojas preenchidas automaticamente${erros ? ` (${erros} com erro)` : ''}.`,
  });
}
