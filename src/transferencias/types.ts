import type { SessaoTransferenciaEstado } from '@prisma/client';

export type ItemSessaoTransferencia = {
  estoqueInsumoId: string;
  textoOriginal: string;
  quantidade: number;
  unidade: 'KG' | 'UN';
  quantidadeRecebida?: number | null;
  custoUnitario?: number | null;
  custoOrigem?: string | null;
  valorTotal?: number | null;
};

export type GerenteIdentificado = {
  funcionarioId: string;
  nome: string;
  telefone: string | null;
  whatsappLid: string | null;
  lojaId: string;
  lojaNome: string;
  storeSlug: string;
  cargoNome: string;
};

export type CriarSessaoInput = {
  tenantUserId: string;
  gerenteOrigemId: string;
  lojaOrigem: string;
  lojaDestino: string;
  telefoneOrigem: string;
  lidOrigem?: string | null;
  itens: ItemSessaoTransferencia[];
  mensagemOriginal?: string | null;
};

export type SessaoTransferenciaResumo = {
  id: string;
  codigo: string;
  tenantUserId: string;
  lojaOrigem: string;
  lojaDestino: string;
  gerenteOrigemId: string;
  gerenteOrigemNome: string | null;
  gerenteDestinoId: string | null;
  gerenteDestinoNome: string | null;
  telefoneOrigem: string;
  lidOrigem: string | null;
  estado: SessaoTransferenciaEstado;
  itens: ItemSessaoTransferencia[];
  mensagemOriginal: string | null;
  cmvTransferenciaId: string | null;
  lembreteEnviadoEm: string | null;
  criadaEm: string;
  confirmacaoOrigemEm: string | null;
  esclarecimentoEm: string | null;
  recebimentoEm: string | null;
  concluidaEm: string | null;
  divergenteEm: string | null;
  canceladaEm: string | null;
  expiradaEm: string | null;
  atualizadaEm: string;
};

export const ESTADOS_ABERTOS: SessaoTransferenciaEstado[] = [
  'AGUARDANDO_CONFIRMACAO_ORIGEM',
  'AGUARDANDO_ESCLARECIMENTO',
  'AGUARDANDO_RECEBIMENTO',
];

export const ESTADOS_VISIVEIS_TELA: SessaoTransferenciaEstado[] = [
  'AGUARDANDO_CONFIRMACAO_ORIGEM',
  'AGUARDANDO_ESCLARECIMENTO',
  'AGUARDANDO_RECEBIMENTO',
  'DIVERGENTE',
];
