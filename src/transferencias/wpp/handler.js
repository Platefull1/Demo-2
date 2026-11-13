/**
 * Handler WhatsApp de transferências — chamado pelo messagePipeline Baileys.
 */

import logger from '../../utils/logger.js';
import {
  transferenciasWppEnabled,
  telefoneNaAllowlist,
} from './flags.js';
import { resolverTenantTransferencias } from './configLookup.js';
import { identificarGerente, gerentesDaLoja } from './gerentes.js';
import {
  criarSessaoDb,
  getSessoesAtivas,
  getSessaoPorCodigo,
  atualizarSessao,
} from './sessoesDb.js';
import {
  interpretarPedidoTransferencia,
  interpretarRespostaDestino,
} from './interpretacaoIA.js';
import {
  apiConfirmarOrigem,
  apiConfirmarRecebimento,
  apiCancelarSessao,
} from './platefulSessoesApi.js';
import { enviarParaTelefone } from './envio.js';
import {
  isConfirmacaoEstrita,
  isNegacaoEstrita,
  extrairCodigo,
} from './confirmacao.js';
import {
  msgConfirmacaoOrigem,
  msgPedidoDestino,
  msgConcluida,
  msgJaConfirmada,
  msgDivergente,
  msgCancelada,
  msgEsclarecimento,
  msgQualCodigo,
} from './mensagens.js';
import { canonicalizarTelefone } from './telefone.js';
import {
  resolverPnDeLid,
  salvarWhatsappLidSeFuncionario,
} from './lid.js';
import { CMV_STORE_SLUGS } from './labels.js';

/**
 * Bypass do gate iaAtiva: bot configurado + (sessão ativa OU gerente).
 * @returns {Promise<{ bypass: boolean, tenantUserId?: string, gerente?: object|null, telefone?: string|null, lid?: string|null }>}
 */
export async function avaliarBypassTransferencias(params) {
  if (!transferenciasWppEnabled()) {
    return { bypass: false };
  }

  const cfg = await resolverTenantTransferencias(params.stackUserId, params.slot);
  if (!cfg) return { bypass: false };

  let telefone = params.telefone || null;
  let lid = params.lidDigits || null;

  if (!telefone && lid) {
    telefone = await resolverPnDeLid(params.stackUserId, params.slot, lid);
  }

  if (telefone && lid) {
    await salvarWhatsappLidSeFuncionario(cfg.tenantUserId, telefone, lid);
  }

  if (telefone && !telefoneNaAllowlist(telefone)) {
    return { bypass: false, tenantUserId: cfg.tenantUserId, telefone, lid };
  }

  const sessoes = await getSessoesAtivas(cfg.tenantUserId, telefone, lid);
  // Filtra sessões relevantes ao remetente (origem ou destino)
  const gerente = await identificarGerente(cfg.tenantUserId, telefone, lid).catch(
    () => null,
  );

  const sessoesRelevantes = [];
  for (const s of sessoes) {
    if (
      (telefone && canonicalizarTelefone(s.telefoneOrigem) === canonicalizarTelefone(telefone)) ||
      (lid && s.lidOrigem && s.lidOrigem === lid)
    ) {
      sessoesRelevantes.push(s);
      continue;
    }
    if (gerente && s.estado === 'AGUARDANDO_RECEBIMENTO') {
      const dests = await gerentesDaLoja(cfg.tenantUserId, s.lojaDestino);
      if (dests.some((g) => g.funcionarioId === gerente.funcionarioId)) {
        sessoesRelevantes.push(s);
      }
    }
  }

  if (sessoesRelevantes.length > 0 || gerente) {
    return {
      bypass: true,
      tenantUserId: cfg.tenantUserId,
      gerente,
      telefone,
      lid,
      sessoes: sessoesRelevantes,
    };
  }

  return { bypass: false, tenantUserId: cfg.tenantUserId, telefone, lid };
}

/**
 * Processa mensagem no fluxo de transferências.
 * @returns {Promise<boolean>} true se consumiu a mensagem (não seguir GPT/vagas)
 */
export async function processarMensagemTransferencia(params) {
  const {
    client,
    stackUserId,
    slot,
    message,
    tenantUserId,
    gerente: gerenteIn,
    telefone: telefoneIn,
    lid: lidIn,
    sessoes: sessoesIn,
  } = params;

  if (!transferenciasWppEnabled()) return false;

  const texto = String(message.body || message.text || '').trim();
  if (!texto) return false;

  let telefone = telefoneIn;
  let lid = lidIn;
  if (!telefone && lid) {
    telefone = await resolverPnDeLid(stackUserId, slot, lid);
  }
  if (telefone && lid) {
    await salvarWhatsappLidSeFuncionario(tenantUserId, telefone, lid);
  }
  if (telefone && !telefoneNaAllowlist(telefone)) {
    return false;
  }

  const gerente =
    gerenteIn ||
    (await identificarGerente(tenantUserId, telefone, lid).catch(() => null));

  let sessoes =
    sessoesIn ||
    (await getSessoesAtivas(tenantUserId, telefone, lid));

  // Refina sessões destino
  const sessoesRelevantes = [];
  for (const s of sessoes) {
    const isOrigem =
      (telefone &&
        canonicalizarTelefone(s.telefoneOrigem) ===
          canonicalizarTelefone(telefone)) ||
      (lid && s.lidOrigem && s.lidOrigem === lid);
    if (isOrigem) {
      sessoesRelevantes.push({ ...s, papel: 'origem' });
      continue;
    }
    if (gerente && s.estado === 'AGUARDANDO_RECEBIMENTO') {
      const dests = await gerentesDaLoja(tenantUserId, s.lojaDestino);
      if (dests.some((g) => g.funcionarioId === gerente.funcionarioId)) {
        sessoesRelevantes.push({ ...s, papel: 'destino' });
      }
    }
  }

  const codigoMsg = extrairCodigo(texto);
  let sessao = null;
  if (codigoMsg) {
    const byCode = await getSessaoPorCodigo(tenantUserId, codigoMsg);
    if (byCode) {
      const hit = sessoesRelevantes.find((s) => s.id === byCode.id);
      sessao = hit || { ...byCode, papel: gerente && byCode.lojaDestino === gerente.storeSlug ? 'destino' : 'origem' };
    }
  } else if (sessoesRelevantes.length === 1) {
    sessao = sessoesRelevantes[0];
  } else if (sessoesRelevantes.length > 1) {
    await client.sendText(
      message.from,
      msgQualCodigo(sessoesRelevantes.map((s) => s.codigo)),
    );
    logger.info(
      `[transf] múltiplas sessões — pediu código tel=${telefone}`,
    );
    return true;
  }

  // ─── Resposta a sessão ativa ─────────────────────────────────────────────
  if (sessao) {
    logger.info(
      `[transf/${sessao.codigo}] resposta estado=${sessao.estado} papel=${sessao.papel || '?'}`,
    );
    if (sessao.papel === 'destino' || sessao.estado === 'AGUARDANDO_RECEBIMENTO') {
      if (gerente) {
        await tratarRespostaDestino({
          client,
          message,
          sessao,
          gerente,
          tenantUserId,
          texto,
        });
        return true;
      }
    }

    if (
      sessao.estado === 'AGUARDANDO_CONFIRMACAO_ORIGEM' ||
      sessao.estado === 'AGUARDANDO_ESCLARECIMENTO'
    ) {
      await tratarRespostaOrigem({
        client,
        message,
        sessao,
        gerente,
        tenantUserId,
        texto,
        telefone,
        lid,
      });
      return true;
    }

    if (sessao.estado === 'CONCLUIDA' || sessao.estado === 'DIVERGENTE') {
      if (sessao.gerenteDestinoNome) {
        await client.sendText(
          message.from,
          msgJaConfirmada(sessao.codigo, sessao.gerenteDestinoNome),
        );
      }
      return true;
    }
  }

  // ─── Novo pedido (só gerente) ─────────────────────────────────────────────
  if (!gerente) return false;

  logger.info(
    `[transf] gerente=${gerente.nome} loja=${gerente.storeSlug} interpretando…`,
  );

  const interp = await interpretarPedidoTransferencia({
    tenantUserId,
    mensagem: texto,
    lojaOrigemSlug: gerente.storeSlug,
  });

  if (!interp.ehTransferencia) {
    logger.info(`[transf] não é transferência — segue fluxo normal`);
    return false;
  }

  const itensOk = (interp.itens || []).filter(
    (i) => i.estoqueInsumoId && i.quantidade > 0,
  );
  const precisaEsclarecer =
    (interp.duvidas && interp.duvidas.length > 0) ||
    !interp.lojaDestino ||
    itensOk.length === 0;

  if (precisaEsclarecer) {
    if (!interp.lojaDestino) {
      await client.sendText(
        message.from,
        msgEsclarecimento(
          interp.duvidas?.length
            ? interp.duvidas
            : ['Para qual loja você quer enviar?'],
        ),
      );
      return true;
    }
    // Cria sessão em esclarecimento com destino conhecido
    const sessaoNova = await criarSessaoDb({
      tenantUserId,
      gerenteOrigemId: gerente.funcionarioId,
      lojaOrigem: gerente.storeSlug,
      lojaDestino: interp.lojaDestino,
      telefoneOrigem: telefone || gerente.telefone,
      lidOrigem: lid,
      estado: 'AGUARDANDO_ESCLARECIMENTO',
      itens: interp.itens.filter((i) => i.textoOriginal),
      mensagemOriginal: texto,
    });
    logger.info(`[transf/${sessaoNova.codigo}] AGUARDANDO_ESCLARECIMENTO`);
    await client.sendText(
      message.from,
      msgEsclarecimento(interp.duvidas, sessaoNova.codigo),
    );
    return true;
  }

  if (!CMV_STORE_SLUGS.includes(interp.lojaDestino)) {
    await client.sendText(message.from, 'Loja de destino inválida.');
    return true;
  }

  const sessaoNova = await criarSessaoDb({
    tenantUserId,
    gerenteOrigemId: gerente.funcionarioId,
    lojaOrigem: gerente.storeSlug,
    lojaDestino: interp.lojaDestino,
    telefoneOrigem: telefone || gerente.telefone,
    lidOrigem: lid,
    estado: 'AGUARDANDO_CONFIRMACAO_ORIGEM',
    itens: itensOk,
    mensagemOriginal: texto,
  });

  logger.info(`[transf/${sessaoNova.codigo}] criada — pedindo confirmação origem`);
  await client.sendText(message.from, msgConfirmacaoOrigem(sessaoNova));
  return true;
}

async function tratarRespostaOrigem({
  client,
  message,
  sessao,
  gerente,
  tenantUserId,
  texto,
  telefone,
  lid,
}) {
  if (gerente && gerente.funcionarioId !== sessao.gerenteOrigemId) {
    await client.sendText(
      message.from,
      `Só o gerente de origem pode confirmar a #${sessao.codigo}.`,
    );
    return;
  }

  if (sessao.estado === 'AGUARDANDO_ESCLARECIMENTO') {
    const interp = await interpretarPedidoTransferencia({
      tenantUserId,
      mensagem: texto,
      lojaOrigemSlug: sessao.lojaOrigem,
      contextoExtra: `Esclarecimento da transferência #${sessao.codigo}. Mensagem original: ${sessao.mensagemOriginal || ''}`,
    });
    const itensOk = (interp.itens || []).filter(
      (i) => i.estoqueInsumoId && i.quantidade > 0,
    );
    const dest = interp.lojaDestino || sessao.lojaDestino;
    if (
      (interp.duvidas && interp.duvidas.length) ||
      !dest ||
      !itensOk.length ||
      dest === sessao.lojaOrigem
    ) {
      await client.sendText(
        message.from,
        msgEsclarecimento(
          interp.duvidas?.length ? interp.duvidas : ['Ainda faltam detalhes.'],
          sessao.codigo,
        ),
      );
      return;
    }
    const updated = await atualizarSessao(sessao.id, {
      lojaDestino: dest,
      itens: itensOk,
      estado: 'AGUARDANDO_CONFIRMACAO_ORIGEM',
    });
    logger.info(`[transf/${sessao.codigo}] esclarecido → confirmação`);
    await client.sendText(message.from, msgConfirmacaoOrigem(updated));
    return;
  }

  if (isNegacaoEstrita(texto)) {
    await apiCancelarSessao(sessao.id, {
      actorGerenteId: sessao.gerenteOrigemId,
    });
    logger.info(`[transf/${sessao.codigo}] CANCELADA pela origem`);
    await client.sendText(message.from, msgCancelada(sessao.codigo));
    return;
  }

  if (!isConfirmacaoEstrita(texto)) {
    await client.sendText(
      message.from,
      `#${sessao.codigo}: confirma o envio? Responda sim ou não.`,
    );
    return;
  }

  const conf = await apiConfirmarOrigem(sessao.id, {
    gerenteId: sessao.gerenteOrigemId,
  });
  const sessaoConf = conf.sessao || conf;
  logger.info(`[transf/${sessao.codigo}] origem confirmou → avisando destino`);

  await client.sendText(
    message.from,
    `#${sessao.codigo}: envio confirmado. Já avisei a loja destino.`,
  );

  const destGerentes = await gerentesDaLoja(tenantUserId, sessao.lojaDestino);
  const textoDest = msgPedidoDestino(sessaoConf);
  for (const g of destGerentes) {
    if (!g.telefone) continue;
    try {
      await enviarParaTelefone(client, g.telefone, textoDest, sessao.codigo);
    } catch (err) {
      logger.warn(
        `[transf/${sessao.codigo}] falha envio destino ${g.nome}: ${err?.message}`,
      );
    }
  }
}

async function tratarRespostaDestino({
  client,
  message,
  sessao,
  gerente,
  tenantUserId,
  texto,
}) {
  // Já concluída/divergente
  if (sessao.estado === 'CONCLUIDA' || sessao.estado === 'DIVERGENTE') {
    await client.sendText(
      message.from,
      msgJaConfirmada(
        sessao.codigo,
        sessao.gerenteDestinoNome || 'outro gerente',
      ),
    );
    return;
  }

  if (sessao.estado !== 'AGUARDANDO_RECEBIMENTO') {
    await client.sendText(
      message.from,
      `#${sessao.codigo} ainda não está aguardando recebimento.`,
    );
    return;
  }

  if (isConfirmacaoEstrita(texto)) {
    const res = await apiConfirmarRecebimento(sessao.id, {
      gerenteId: gerente.funcionarioId,
      actorUserId: tenantUserId,
    });
    const final = res.sessao || res;
    logger.info(`[transf/${sessao.codigo}] CONCLUIDA por ${gerente.nome}`);
    await avisarOrigemEDestino(
      client,
      sessao,
      tenantUserId,
      msgConcluida(sessao.codigo),
      gerente,
    );
    await client.sendText(message.from, msgConcluida(sessao.codigo));
    void final;
    return;
  }

  if (isNegacaoEstrita(texto)) {
    await client.sendText(
      message.from,
      `#${sessao.codigo}: o que chegou diferente? Me diga as quantidades.`,
    );
    return;
  }

  const interp = await interpretarRespostaDestino({
    codigo: sessao.codigo,
    itens: sessao.itens,
    mensagem: texto,
  });

  if (interp.duvidas?.length && !interp.divergente && !interp.confirmado) {
    await client.sendText(
      message.from,
      `#${sessao.codigo}: ${interp.duvidas.join(' ')} Responda sim ou diga o que chegou.`,
    );
    return;
  }

  if (interp.confirmado) {
    await apiConfirmarRecebimento(sessao.id, {
      gerenteId: gerente.funcionarioId,
      actorUserId: tenantUserId,
    });
    logger.info(`[transf/${sessao.codigo}] CONCLUIDA (ia) por ${gerente.nome}`);
    await avisarOrigemEDestino(
      client,
      sessao,
      tenantUserId,
      msgConcluida(sessao.codigo),
      gerente,
    );
    await client.sendText(message.from, msgConcluida(sessao.codigo));
    return;
  }

  if (interp.divergente) {
    const quantidadesRecebidas = {};
    for (const it of sessao.itens) {
      const hit = (interp.itens || []).find(
        (x) => x.estoqueInsumoId === it.estoqueInsumoId,
      );
      quantidadesRecebidas[it.estoqueInsumoId] =
        hit?.quantidadeRecebida != null
          ? Number(hit.quantidadeRecebida)
          : it.quantidade;
    }
    await apiConfirmarRecebimento(sessao.id, {
      gerenteId: gerente.funcionarioId,
      quantidadesRecebidas,
      actorUserId: tenantUserId,
    });
    logger.info(`[transf/${sessao.codigo}] DIVERGENTE por ${gerente.nome}`);
    const aviso = msgDivergente(sessao.codigo);
    await avisarOrigemEDestino(client, sessao, tenantUserId, aviso, gerente);
    await client.sendText(message.from, aviso);
    return;
  }

  await client.sendText(
    message.from,
    `#${sessao.codigo}: não entendi. Responda sim se chegou tudo, ou diga as quantidades.`,
  );
}

async function avisarOrigemEDestino(client, sessao, tenantUserId, texto, gerenteDest) {
  if (sessao.gerenteOrigemTelefone || sessao.telefoneOrigem) {
    try {
      await enviarParaTelefone(
        client,
        sessao.gerenteOrigemTelefone || sessao.telefoneOrigem,
        texto,
        sessao.codigo,
      );
    } catch (err) {
      logger.warn(`[transf/${sessao.codigo}] aviso origem: ${err?.message}`);
    }
  }
  const dests = await gerentesDaLoja(tenantUserId, sessao.lojaDestino);
  for (const g of dests) {
    if (gerenteDest && g.funcionarioId === gerenteDest.funcionarioId) continue;
    if (!g.telefone) continue;
    try {
      await enviarParaTelefone(client, g.telefone, texto, sessao.codigo);
    } catch {
      /* ignore */
    }
  }
}
