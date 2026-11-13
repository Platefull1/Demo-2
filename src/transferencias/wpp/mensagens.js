import { formatQtd, storeLabel } from './labels.js';

function itemLabel(it) {
  const nome = it.textoOriginal || 'item';
  const qtd = it.qtdInformada ?? it.quantidade;
  const und = it.unidadeInformada || it.unidade || '';
  let s = `${formatQtd(qtd)} ${und ? und.toLowerCase() + ' de ' : ''}${nome}`.replace(
    /\s+/g,
    ' ',
  );
  if (
    it.unidadeInformada === 'UN' &&
    it.unidade === 'KG' &&
    it.quantidade != null &&
    it.qtdInformada != null &&
    it.qtdInformada !== it.quantidade
  ) {
    s += ` (≈${formatQtd(it.quantidade)} kg)`;
  }
  return s.trim();
}

export function listaItensTexto(itens) {
  if (!itens?.length) return '';
  if (itens.length === 1) return itemLabel(itens[0]);
  const partes = itens.map(itemLabel);
  const ultimo = partes.pop();
  return `${partes.join(', ')} e ${ultimo}`;
}

export function msgConfirmacaoOrigem(sessao) {
  return (
    `Transferência #${sessao.codigo}: ${listaItensTexto(sessao.itens)} ` +
    `do ${storeLabel(sessao.lojaOrigem)} para o ${storeLabel(sessao.lojaDestino)}. ` +
    `Confirma? (sim/não)`
  );
}

export function msgPedidoDestino(sessao) {
  return (
    `Oi! O ${storeLabel(sessao.lojaOrigem)} está te enviando ` +
    `${listaItensTexto(sessao.itens)} (#${sessao.codigo}). ` +
    `Chegou tudo certinho? Responda sim, ou me diga o que chegou diferente.`
  );
}

export function msgConcluida(codigo) {
  return `#${codigo} concluída ✅`;
}

export function msgJaConfirmada(codigo, nomeGerente) {
  return `#${codigo} já foi confirmada por ${nomeGerente}.`;
}

export function msgDivergente(codigo) {
  return (
    `#${codigo} ficou divergente e foi para revisão da contabilidade. ` +
    `Eles vão ajustar pela tela de Transferências.`
  );
}

export function msgCancelada(codigo) {
  return `#${codigo} cancelada.`;
}

export function msgEsclarecimento(duvidas, codigo) {
  const head = codigo ? `#${codigo} — ` : '';
  return `${head}${duvidas.join(' ')}`;
}

export function msgQualCodigo(codigos) {
  return (
    `Você tem mais de uma transferência pendente (${codigos.map((c) => '#' + c).join(', ')}). ` +
    `Responda com o código, tipo #${codigos[0]}.`
  );
}
