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

// ---------------------------------------------------------------------------
// POST /api/reports/complaints/reclassify
//
// Reclassifica reclamações existentes sem `categoria` preenchida:
//   • lojaId  : resolve direto pelo lojaGrupo (iFood) ou por regex no resumo (cliente)
//   • categoria: IA leve a partir do resumo (não re-processa a conversa inteira)
//
// Seguro chamar múltiplas vezes — pula quem já tem categoria.
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

/** Tenta resolver lojaId via substring no nome das RhLojas do tenant. */
async function resolveLojaId(userId: string, hint: string | null): Promise<string | null> {
  if (!hint) return null;
  const lojas = await prisma.rhLoja.findMany({
    where: { userId },
    select: { id: true, nome: true },
  });
  const h = hint.toLowerCase().trim();
  const found = lojas.find(
    (l) =>
      l.nome.toLowerCase().includes(h) ||
      h.includes(l.nome.toLowerCase().replace(/\s+/g, '')),
  );
  return found?.id ?? null;
}

export async function POST() {
  const userIds = await getReportsTenantUserIds();
  if (!userIds) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  // Busca complaints sem categoria (todos os runs do tenant)
  const sem = await prisma.complaint.findMany({
    where: { userId: { in: userIds }, categoria: null },
    select: {
      id: true,
      userId: true,
      resumo: true,
      origem: true,
      lojaGrupo: true,
    },
  });

  if (sem.length === 0) {
    return NextResponse.json({ ok: true, processados: 0, mensagem: 'Nenhuma reclamação pendente.' });
  }

  let processados = 0;
  let erros = 0;

  // Cache de lojas por userId para evitar queries repetidas
  const lojaCache = new Map<string, { id: string; nome: string }[]>();
  async function lojasDoTenant(userId: string) {
    if (!lojaCache.has(userId)) {
      const lojas = await prisma.rhLoja.findMany({
        where: { userId },
        select: { id: true, nome: true },
      });
      lojaCache.set(userId, lojas);
    }
    return lojaCache.get(userId)!;
  }

  function matchLoja(
    lojas: { id: string; nome: string }[],
    hint: string,
  ): string | null {
    const h = hint.toLowerCase().trim();
    const found = lojas.find(
      (l) =>
        l.nome.toLowerCase().includes(h) ||
        h.includes(l.nome.toLowerCase().replace(/\s+/g, '')),
    );
    return found?.id ?? null;
  }

  for (const c of sem) {
    try {
      // 1. Resolver lojaId
      let lojaId: string | null = null;
      let lojaIdentificada = false;

      if (c.origem === 'GRUPO_IFOOD' && c.lojaGrupo) {
        // iFood: lojaGrupo já tem o nome da loja — só fazer o match
        const lojas = await lojasDoTenant(c.userId);
        lojaId = matchLoja(lojas, c.lojaGrupo);
        lojaIdentificada = Boolean(lojaId);
      } else {
        // Canal cliente: tenta extrair do resumo padrões como "loja AHU", "Ahú", etc.
        const lojas = await lojasDoTenant(c.userId);
        const lojaMatch = lojas.find((l) =>
          c.resumo.toLowerCase().includes(l.nome.toLowerCase().replace(/\s+/g, ' ').trim()),
        );
        if (lojaMatch) {
          lojaId = lojaMatch.id;
          lojaIdentificada = true;
        }
      }

      // 2. Classificar categoria via IA
      const categoria = await classificarCategoria(c.resumo);

      // 3. Atualizar complaint
      await prisma.complaint.update({
        where: { id: c.id },
        data: { categoria, lojaId, lojaIdentificada },
      });

      processados++;
    } catch {
      erros++;
    }
  }

  return NextResponse.json({
    ok: true,
    total: sem.length,
    processados,
    erros,
    mensagem: `${processados} de ${sem.length} reclamações reclassificadas${erros ? ` (${erros} com erro)` : ''}.`,
  });
}
