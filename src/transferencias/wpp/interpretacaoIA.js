/**
 * Interpretação de pedido de transferência via OpenRouter (gpt-4o-mini).
 * Mesmo padrão de src/tarefas/validacaoIA.js: prompt + JSON + tentarParseJSON.
 */

import logger from '../../utils/logger.js';
import prisma from '../../db/index.js';
import { CMV_STORE_LABELS, CMV_STORE_SLUGS } from './labels.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';
const MAX_TOKENS = 800;

function tentarParseJSON(texto) {
  try {
    const limpo = String(texto || '')
      .replace(/```json?\s*|\s*```/g, '')
      .trim();
    return JSON.parse(limpo);
  } catch {
    return null;
  }
}

/**
 * Catálogo ativo do CMV Real para o prompt.
 * @param {string} tenantUserId
 */
export async function carregarCatalogoInsumos(tenantUserId) {
  const cfgs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: tenantUserId, ativo: true },
    include: { estoqueInsumo: { select: { id: true, nome: true, insumoId: true } } },
    orderBy: { ordem: 'asc' },
    take: 400,
  });

  const produtoIds = cfgs.map((c) => c.estoqueInsumo.insumoId).filter(Boolean);
  const prodCfgs = await prisma.estoqueProdutoConfig.findMany({
    where: { userId: tenantUserId, produtoId: { in: produtoIds } },
    select: { produtoId: true, kgPorUnidade: true, modoContagem: true },
  });
  const kgBy = new Map(prodCfgs.map((p) => [p.produtoId, p]));

  return cfgs.map((c) => {
    const kg = kgBy.get(c.estoqueInsumo.insumoId);
    return {
      estoqueInsumoId: c.estoqueInsumoId,
      nome: c.estoqueInsumo.nome,
      unidade: c.unidade,
      kgPorUnidade: kg?.kgPorUnidade ?? null,
    };
  });
}

function buildSystemPrompt(lojas, catalogo) {
  const lojasTxt = lojas
    .map((s) => `${s}=${CMV_STORE_LABELS[s] || s}`)
    .join(', ');
  const catTxt = catalogo
    .slice(0, 350)
    .map(
      (c) =>
        `- id=${c.estoqueInsumoId} | ${c.nome} | unidadeCMV=${c.unidade}` +
        (c.kgPorUnidade ? ` | kgPorUnidade=${c.kgPorUnidade}` : ''),
    )
    .join('\n');

  return (
    'Você classifica mensagens de gerentes de pizzaria sobre transferência de insumos entre lojas. ' +
    'Responda APENAS com JSON válido, sem markdown, no formato: ' +
    '{"ehTransferencia": boolean, "lojaDestino": string|null, ' +
    '"itens": [{"estoqueInsumoId": string|null, "textoOriginal": string, "quantidade": number|null, "unidade": "KG"|"UN"|null}], ' +
    '"duvidas": [string]}. ' +
    'Regras: (1) ehTransferencia=true só se for claramente pedido de envio/transferência de produtos entre lojas. ' +
    '(2) lojaDestino deve ser um slug válido. (3) estoqueInsumoId só se for ID da lista; senão null e coloque dúvida. ' +
    '(4) Nunca chute produto ou quantidade. (5) Se ambíguo (ex cebola roxa/branca), deixe id null e explique em duvidas. ' +
    `Lojas válidas (slug=nome): ${lojasTxt}. ` +
    `Catálogo (use só estes IDs):\n${catTxt}`
  );
}

async function chamarOpenRouter(system, userText) {
  const inicio = Date.now();
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY?.trim()}`,
      'HTTP-Referer': 'https://platefull.com.br',
      'X-Title': 'Platefull Transferencias WhatsApp',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: 0.1,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userText },
      ],
    }),
  });
  if (!res.ok) {
    const corpo = await res.text().catch(() => '');
    throw new Error(`OpenRouter HTTP ${res.status}: ${corpo}`);
  }
  const data = await res.json();
  const texto = data.choices?.[0]?.message?.content ?? '';
  return { texto, latMs: Date.now() - inicio, tokens: data.usage?.total_tokens ?? 0 };
}

/**
 * Interpreta mensagem do gerente.
 * @param {object} params
 * @param {string} params.tenantUserId
 * @param {string} params.mensagem
 * @param {string} params.lojaOrigemSlug
 * @param {string} [params.contextoExtra]
 */
export async function interpretarPedidoTransferencia(params) {
  const catalogo = await carregarCatalogoInsumos(params.tenantUserId);
  const idsOk = new Set(catalogo.map((c) => c.estoqueInsumoId));
  const byId = new Map(catalogo.map((c) => [c.estoqueInsumoId, c]));
  const lojas = CMV_STORE_SLUGS.filter((s) => s !== params.lojaOrigemSlug);

  const system = buildSystemPrompt(CMV_STORE_SLUGS, catalogo);
  const userText =
    `Loja de origem do gerente: ${params.lojaOrigemSlug} (${CMV_STORE_LABELS[params.lojaOrigemSlug] || ''}).\n` +
    `Mensagem: """${params.mensagem}"""\n` +
    (params.contextoExtra ? `Contexto: ${params.contextoExtra}\n` : '') +
    'Classifique.';

  let parsed = null;
  try {
    const r1 = await chamarOpenRouter(system, userText);
    logger.info(
      `[transf/ia] interpretacao lat=${r1.latMs}ms tokens=${r1.tokens}`,
    );
    parsed = tentarParseJSON(r1.texto);
    if (!parsed) {
      const r2 = await chamarOpenRouter(
        system,
        userText + '\n\nATENÇÃO: responda APENAS o JSON válido, sem markdown.',
      );
      parsed = tentarParseJSON(r2.texto);
    }
  } catch (err) {
    logger.error(`[transf/ia] falha: ${err?.message}`);
    return {
      ehTransferencia: false,
      lojaDestino: null,
      itens: [],
      duvidas: ['Não consegui interpretar agora. Tenta de novo em instantes.'],
      erro: true,
    };
  }

  if (!parsed || typeof parsed !== 'object') {
    return {
      ehTransferencia: false,
      lojaDestino: null,
      itens: [],
      duvidas: ['Não entendi o pedido. Pode reformular?'],
    };
  }

  const ehTransferencia = Boolean(parsed.ehTransferencia);
  let lojaDestino = parsed.lojaDestino ? String(parsed.lojaDestino).toLowerCase() : null;
  if (lojaDestino && !CMV_STORE_SLUGS.includes(lojaDestino)) {
    lojaDestino = null;
  }
  if (lojaDestino === params.lojaOrigemSlug) {
    lojaDestino = null;
  }

  const duvidas = Array.isArray(parsed.duvidas)
    ? parsed.duvidas.map((d) => String(d)).filter(Boolean)
    : [];
  const itensRaw = Array.isArray(parsed.itens) ? parsed.itens : [];
  const itens = [];

  for (const it of itensRaw) {
    const textoOriginal = String(it.textoOriginal || '').trim();
    let estoqueInsumoId = it.estoqueInsumoId ? String(it.estoqueInsumoId) : null;
    if (estoqueInsumoId && !idsOk.has(estoqueInsumoId)) {
      estoqueInsumoId = null;
      duvidas.push(`Não achei "${textoOriginal || 'item'}" no catálogo.`);
    }
    let quantidade =
      it.quantidade == null || it.quantidade === ''
        ? null
        : Number(it.quantidade);
    if (quantidade != null && !(quantidade > 0)) quantidade = null;
    let unidade =
      it.unidade === 'UN' || it.unidade === 'KG' ? it.unidade : null;

    if (!estoqueInsumoId && textoOriginal) {
      duvidas.push(`Qual produto é "${textoOriginal}"?`);
    }
    if (estoqueInsumoId && quantidade == null) {
      duvidas.push(`Qual a quantidade de ${textoOriginal || 'item'}?`);
    }

    const cat = estoqueInsumoId ? byId.get(estoqueInsumoId) : null;
    let qtdCmv = quantidade;
    let unidadeCmv = cat?.unidade || unidade || 'KG';
    let kgPorUnidade = cat?.kgPorUnidade ?? null;

    // Conversão: se CMV é KG e veio em UN (ou caixa), aplica kgPorUnidade
    if (
      cat &&
      cat.unidade === 'KG' &&
      quantidade != null &&
      (unidade === 'UN' || (!unidade && kgPorUnidade))
    ) {
      if (kgPorUnidade && kgPorUnidade > 0) {
        qtdCmv = quantidade * kgPorUnidade;
        unidadeCmv = 'KG';
      }
    } else if (cat) {
      unidadeCmv = cat.unidade;
      qtdCmv = quantidade;
    }

    itens.push({
      estoqueInsumoId,
      textoOriginal,
      quantidade: qtdCmv,
      unidade: unidadeCmv,
      qtdInformada: quantidade,
      unidadeInformada: unidade,
      kgPorUnidade,
    });
  }

  if (ehTransferencia && !lojaDestino) {
    duvidas.push('Para qual loja você quer enviar? (Ahú, Pilarzinho, Portão ou Uberaba)');
  }

  const lojasDestinoValidas = new Set(lojas);
  if (lojaDestino && !lojasDestinoValidas.has(lojaDestino) && lojaDestino === params.lojaOrigemSlug) {
    duvidas.push('Origem e destino precisam ser lojas diferentes.');
  }

  return {
    ehTransferencia,
    lojaDestino,
    itens,
    duvidas: [...new Set(duvidas)],
  };
}

/**
 * Interpreta resposta do destino (sim / diferença com qtds).
 */
export async function interpretarRespostaDestino(params) {
  const system =
    'Você interpreta a resposta do gerente da loja destino sobre uma transferência. ' +
    'Responda APENAS JSON: {"confirmado": boolean, "divergente": boolean, ' +
    '"itens": [{"estoqueInsumoId": string, "quantidadeRecebida": number}], "duvidas": [string]}. ' +
    'confirmado=true só se aceitou tudo. divergente=true se informou quantidades diferentes. ' +
    'Nunca chute quantidades.';

  const itensTxt = params.itens
    .map(
      (i) =>
        `- ${i.estoqueInsumoId} | ${i.textoOriginal} | enviado=${i.quantidade} ${i.unidade}`,
    )
    .join('\n');

  const userText =
    `Transferência ${params.codigo}. Itens enviados:\n${itensTxt}\n` +
    `Resposta do gerente: """${params.mensagem}"""`;

  try {
    const r = await chamarOpenRouter(system, userText);
    const parsed = tentarParseJSON(r.texto);
    if (!parsed) {
      return { confirmado: false, divergente: false, itens: [], duvidas: ['Não entendi.'] };
    }
    return {
      confirmado: Boolean(parsed.confirmado) && !parsed.divergente,
      divergente: Boolean(parsed.divergente),
      itens: Array.isArray(parsed.itens) ? parsed.itens : [],
      duvidas: Array.isArray(parsed.duvidas) ? parsed.duvidas.map(String) : [],
    };
  } catch (err) {
    logger.error(`[transf/ia] resposta destino: ${err?.message}`);
    return {
      confirmado: false,
      divergente: false,
      itens: [],
      duvidas: ['Falha ao interpretar. Responda sim ou diga o que chegou.'],
    };
  }
}
