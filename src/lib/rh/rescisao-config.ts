/**
 * Constantes e catálogos da Solicitação de Rescisão (RH).
 * Editar aqui em vez de hardcodar na tela / PDF / API.
 */

export const EMPRESA_CONTRATANTE = 'BRULUVAS' as const;

/**
 * Data-base da categoria (mês/dia). Vazia = lembrete legal normal,
 * sem destaque de indenização adicional nos 30 dias anteriores.
 * Ex.: { mes: 5, dia: 1 } = 1º de maio.
 */
export const DATA_BASE_CATEGORIA: { mes: number; dia: number } | null = null;

export type UnidadeRescisaoItem = 'horas' | 'reais' | 'percentual' | 'dias';

export type RescisaoCatalogItem = {
  chave: string;
  descricao: string;
  unidade: UnidadeRescisaoItem;
  /** Código do evento na contabilidade (descontos). */
  codigo?: string;
};

export const TIPO_RESCISAO_LABELS = {
  DISPENSA_SEM_JUSTA_CAUSA: 'Dispensa sem justa causa',
  DISPENSA_COM_JUSTA_CAUSA: 'Dispensa com justa causa',
  PEDIDO_DE_DISPENSA: 'Pedido de dispensa',
  ANTECIPADA_EMPREGADOR: 'Antecipada por parte do empregador',
  ANTECIPADA_EMPREGADO: 'Antecipada por parte do empregado',
} as const;

export const TIPO_AVISO_LABELS = {
  INDENIZADO_IMEDIATO: 'Indenizado (imediato)',
  TRABALHADO_REDUCAO_7_DIAS: 'Trabalhado com redução de 7 dias corridos',
  TRABALHADO_REDUCAO_2_HORAS: 'Trabalhado com redução de duas horas diárias',
  TERMINO_EXPERIENCIA: 'Término de contrato de experiência',
  ANTECIPADA_EMPREGADOR: 'Antecipada por parte do empregador',
  RESCISAO_POR_MORTE: 'Rescisão por morte',
  AVISO_TRABALHADO_30_DIAS: 'Aviso trabalhado 30 dias',
  AVISO_MEIO_INDENIZADO: 'Aviso 1/2 indenizado',
  DISPENSADO: 'Dispensado',
} as const;

export const RESCISAO_STATUS_LABELS = {
  RASCUNHO: 'Rascunho',
  FINALIZADA: 'Finalizada',
} as const;

/** Dias corridos sugeridos de aviso (início + 29 = 30 dias). */
export const AVISO_DIAS_CORRIDOS = 30;

/** Abaixo disso, sugerir "Término de contrato de experiência" (não marcar sozinho). */
export const DIAS_SUGESTAO_EXPERIENCIA = 90;

export const VENCIMENTOS_RESCISAO: RescisaoCatalogItem[] = [
  { chave: 'adicional_noturno', descricao: 'Adicional Noturno', unidade: 'horas' },
  { chave: 'he_dias_uteis', descricao: 'Horas Extras Dias Úteis', unidade: 'horas' },
  { chave: 'he_domingo', descricao: 'Horas Extras Domingo', unidade: 'horas' },
  { chave: 'he_feriado', descricao: 'Horas Extras Feriado', unidade: 'horas' },
  { chave: 'saldo_banco_horas', descricao: 'Saldo Banco de Horas', unidade: 'horas' },
  { chave: 'comissao', descricao: 'Comissão', unidade: 'reais' },
  { chave: 'ajuda_custo', descricao: 'Ajuda de Custo', unidade: 'reais' },
  { chave: 'gratificacao_funcao', descricao: 'Gratificação de Função', unidade: 'reais' },
  { chave: 'bonificacao', descricao: 'Bonificação', unidade: 'reais' },
  { chave: 'insalubridade', descricao: 'Insalubridade', unidade: 'percentual' },
  { chave: 'periculosidade', descricao: 'Periculosidade', unidade: 'percentual' },
  { chave: 'quebra_caixa', descricao: 'Quebra de Caixa', unidade: 'percentual' },
  { chave: 'gorjetas', descricao: 'Gorjetas/Gratificação', unidade: 'reais' },
  { chave: 'plr', descricao: 'PLR (Participação nos Lucros)', unidade: 'reais' },
  { chave: 'he_60_noturna', descricao: 'Hora Extra 60% Noturna', unidade: 'horas' },
  { chave: 'he_100_noturna', descricao: 'Hora Extra 100% Noturna', unidade: 'horas' },
  { chave: 'he_100', descricao: 'Hora Extra 100%', unidade: 'horas' },
  { chave: 'he_60', descricao: 'Hora Extra 60%', unidade: 'horas' },
];

export const DESCONTOS_RESCISAO: RescisaoCatalogItem[] = [
  { chave: 'adiantamento_vale', codigo: '354', descricao: 'Adiantamento Vale', unidade: 'reais' },
  { chave: 'cesta_basica', codigo: '371', descricao: 'Cesta Básica', unidade: 'reais' },
  { chave: 'desc_quebra_caixa', codigo: '231', descricao: 'Desconto Quebra de Caixa', unidade: 'reais' },
  { chave: 'emprestimo', codigo: '894', descricao: 'Empréstimo', unidade: 'reais' },
  { chave: 'conveniencia', codigo: '373', descricao: 'Conveniência', unidade: 'reais' },
  { chave: 'farmacia', codigo: '259', descricao: 'Farmácia', unidade: 'reais' },
  { chave: 'plano_saude', codigo: '248', descricao: 'Plano de Saúde', unidade: 'reais' },
  { chave: 'coparticipacao_medica', codigo: '801', descricao: 'Co-participação Médica', unidade: 'reais' },
  { chave: 'seguro_vida', codigo: '234', descricao: 'Seguro de Vida', unidade: 'reais' },
  { chave: 'refeicao', codigo: '62', descricao: 'Refeição', unidade: 'reais' },
  { chave: 'va_nao_utilizado', codigo: '264', descricao: 'Vale Alimentação Não Utilizado', unidade: 'reais' },
  { chave: 'vr_nao_utilizado', codigo: '257', descricao: 'Vale Refeição Não Utilizado', unidade: 'reais' },
  { chave: 'vale_transporte', codigo: '75', descricao: 'Vale Transporte', unidade: 'percentual' },
  { chave: 'vt_nao_utilizado', codigo: '280', descricao: 'Vale Transporte Não Utilizado', unidade: 'reais' },
  { chave: 'atrasos', codigo: '76', descricao: 'Atrasos', unidade: 'horas' },
  { chave: 'faltas_meio_periodo', codigo: '77', descricao: 'Faltas 1/2 Período', unidade: 'horas' },
  { chave: 'faltas_injustificadas', codigo: '78', descricao: 'Faltas Injustificadas', unidade: 'horas' },
  { chave: 'dsr', codigo: '79', descricao: 'DSR', unidade: 'horas' },
  { chave: 'faltas_dsr_mes_anterior', codigo: '297', descricao: 'Faltas/DSR Mês Anterior', unidade: 'horas' },
  { chave: 'falta_em_dias', codigo: '332', descricao: 'Falta em Dias', unidade: 'dias' },
  { chave: 'falta_em_dias_mes_anterior', codigo: '333', descricao: 'Falta em Dias Mês Anterior', unidade: 'dias' },
  { chave: 'compra', descricao: 'Compra', unidade: 'reais' },
];

export const LEMBRETE_INDENIZACAO_ADICIONAL =
  'Indenização adicional devida na despedida antes da data-base. A Lei 6.708/79 e a Lei 7.238/84, ambas no artigo 9º, determinam uma indenização adicional, equivalente a um salário mensal, no caso de dispensa sem justa causa.';

export const LEMBRETE_RH_CONTATO = 'Dúvidas, consultar nosso setor de RH.';
