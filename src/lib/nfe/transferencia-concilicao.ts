/**
 * Conciliação pura de transferências entre lojas (sem Prisma).
 * Custo, status do documento e detecção de NF de transferência.
 */

import {
  CALENZANO_CNPJ_RAIZ,
  STORE_CNPJ_BY_SLUG,
  storeSlugFromCnpj,
  type CmvStoreSlug,
} from './lojas';

export const CFOPS_TRANSFERENCIA = [
  '5151',
  '5152',
  '5153',
  '5408',
  '5409',
  '5557',
  '6152',
  '6408',
  '6409',
  '6557',
] as const;

export type CmvTransferenciaCustoOrigem =
  | 'ULTIMO_CUSTO_ORIGEM'
  | 'ESTOQUE_INICIAL_ORIGEM'
  | 'ULTIMO_CUSTO_QUALQUER_LOJA'
  | 'CUSTO_MANUAL';

export type CmvTransferenciaStatus =
  | 'AGUARDANDO_ENTRADA'
  | 'AGUARDANDO_SAIDA'
  | 'CONCILIADA'
  | 'DIVERGENTE';

export type ItemLado = {
  estoqueInsumoId: string;
  quantidade: number;
};

export type DiffItem = {
  estoqueInsumoId: string;
  qtdSaida: number;
  qtdEntrada: number;
};

const EPS = 0.0001;

export function normalizarCnpjDigits(cnpj: string | null | undefined): string {
  return String(cnpj || '').replace(/\D/g, '');
}

export function cnpjRaiz(cnpj: string | null | undefined): string {
  return normalizarCnpjDigits(cnpj).slice(0, 8);
}

export function ehCfopTransferencia(cfop: string | null | undefined): boolean {
  const d = String(cfop || '').replace(/\D/g, '');
  return (CFOPS_TRANSFERENCIA as readonly string[]).includes(d);
}

export function emitenteEhLojaCalenzano(
  cnpj: string | null | undefined,
  storeCnpjBySlug: Partial<Record<CmvStoreSlug, string>> = STORE_CNPJ_BY_SLUG,
): boolean {
  const digits = normalizarCnpjDigits(cnpj);
  if (digits.length < 8) return false;
  if (cnpjRaiz(digits) === CALENZANO_CNPJ_RAIZ) return true;
  if (storeSlugFromCnpj(digits)) return true;
  const raiz = cnpjRaiz(digits);
  for (const c of Object.values(storeCnpjBySlug)) {
    if (c && cnpjRaiz(c) === raiz) return true;
  }
  return false;
}

export function classificarNfTransferencia(input: {
  emitenteCnpj?: string | null;
  destStoreSlug: string;
  cfops: Array<string | null | undefined>;
  saiposTransferenciaId?: number | null;
  storeCnpjBySlug?: Partial<Record<CmvStoreSlug, string>>;
}): {
  isTransfer: boolean;
  origemSlug: CmvStoreSlug | null;
  emitenteCalenzano: boolean;
  hasCfopTransfer: boolean;
  motivo: string;
} {
  const map = input.storeCnpjBySlug ?? STORE_CNPJ_BY_SLUG;
  const origemSlug = storeSlugFromCnpj(input.emitenteCnpj, map);
  const emitenteCalenzano = emitenteEhLojaCalenzano(input.emitenteCnpj, map);
  const hasCfopTransfer = input.cfops.some((c) => ehCfopTransferencia(c));
  const saipos =
    input.saiposTransferenciaId != null && input.saiposTransferenciaId > 0;

  if (saipos) {
    return {
      isTransfer: true,
      origemSlug:
        origemSlug && origemSlug !== input.destStoreSlug ? origemSlug : origemSlug,
      emitenteCalenzano,
      hasCfopTransfer,
      motivo: `Saipos id_store_stock_transfer=${input.saiposTransferenciaId}`,
    };
  }

  if (emitenteCalenzano && hasCfopTransfer) {
    const mesmaLoja = origemSlug != null && origemSlug === input.destStoreSlug;
    return {
      isTransfer: !mesmaLoja,
      origemSlug: mesmaLoja ? null : origemSlug,
      emitenteCalenzano,
      hasCfopTransfer,
      motivo: mesmaLoja
        ? 'Emitente é a própria loja destino'
        : `NF loja Calenzano CFOP ${input.cfops.filter((c) => ehCfopTransferencia(c)).join(',')}`,
    };
  }

  return {
    isTransfer: false,
    origemSlug,
    emitenteCalenzano,
    hasCfopTransfer,
    motivo: emitenteCalenzano
      ? 'Emitente Calenzano sem CFOP de transferência'
      : hasCfopTransfer
        ? 'CFOP de transferência sem emitente de loja'
        : 'Não é transferência entre lojas',
  };
}

export function resolverCustoUnitario(input: {
  ultimoCustoOrigem?: number | null;
  custoEstoqueInicialOrigem?: number | null;
  ultimoCustoQualquerLoja?: number | null;
  custoInformado?: number | null;
  forcarManual?: boolean;
}): {
  custo: number | null;
  origem: CmvTransferenciaCustoOrigem;
  exigePreenchimento: boolean;
} {
  const info = input.custoInformado;
  if (input.forcarManual) {
    if (info != null && info > 0) {
      return { custo: info, origem: 'CUSTO_MANUAL', exigePreenchimento: false };
    }
    return { custo: null, origem: 'CUSTO_MANUAL', exigePreenchimento: true };
  }

  if (input.ultimoCustoOrigem != null && input.ultimoCustoOrigem > 0) {
    return {
      custo: input.ultimoCustoOrigem,
      origem: 'ULTIMO_CUSTO_ORIGEM',
      exigePreenchimento: false,
    };
  }
  if (
    input.custoEstoqueInicialOrigem != null &&
    input.custoEstoqueInicialOrigem > 0
  ) {
    return {
      custo: input.custoEstoqueInicialOrigem,
      origem: 'ESTOQUE_INICIAL_ORIGEM',
      exigePreenchimento: false,
    };
  }
  if (
    input.ultimoCustoQualquerLoja != null &&
    input.ultimoCustoQualquerLoja > 0
  ) {
    return {
      custo: input.ultimoCustoQualquerLoja,
      origem: 'ULTIMO_CUSTO_QUALQUER_LOJA',
      exigePreenchimento: false,
    };
  }
  if (info != null && info > 0) {
    return { custo: info, origem: 'CUSTO_MANUAL', exigePreenchimento: false };
  }
  return { custo: null, origem: 'CUSTO_MANUAL', exigePreenchimento: true };
}

function somarPorInsumo(itens: ItemLado[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const it of itens) {
    if (!it.estoqueInsumoId) continue;
    m.set(it.estoqueInsumoId, (m.get(it.estoqueInsumoId) ?? 0) + Number(it.quantidade));
  }
  return m;
}

export function diffItens(
  saida: ItemLado[],
  entrada: ItemLado[],
  toleranciaQtd = EPS,
): DiffItem[] {
  const a = somarPorInsumo(saida);
  const b = somarPorInsumo(entrada);
  const ids = new Set([...a.keys(), ...b.keys()]);
  const diffs: DiffItem[] = [];
  for (const id of ids) {
    const qtdSaida = a.get(id) ?? 0;
    const qtdEntrada = b.get(id) ?? 0;
    if (Math.abs(qtdSaida - qtdEntrada) > toleranciaQtd) {
      diffs.push({ estoqueInsumoId: id, qtdSaida, qtdEntrada });
    }
  }
  return diffs.sort((x, y) => x.estoqueInsumoId.localeCompare(y.estoqueInsumoId));
}

export function montarEspelhoSaida(itensEntrada: ItemLado[]): ItemLado[] {
  return itensEntrada.map((it) => ({
    estoqueInsumoId: it.estoqueInsumoId,
    quantidade: it.quantidade,
  }));
}

/**
 * Status do documento.
 * Saída espelho (rascunho) não conta como confirmada.
 */
export function statusDocumento(input: {
  entradaRegistrada: boolean;
  saidaConfirmada: boolean;
  itensSaida?: ItemLado[];
  itensEntrada?: ItemLado[];
  toleranciaQtd?: number;
}): { status: CmvTransferenciaStatus; diffs: DiffItem[] } {
  const saida = input.itensSaida ?? [];
  const entrada = input.itensEntrada ?? [];

  if (input.entradaRegistrada && !input.saidaConfirmada) {
    return { status: 'AGUARDANDO_SAIDA', diffs: [] };
  }
  if (input.saidaConfirmada && !input.entradaRegistrada) {
    return { status: 'AGUARDANDO_ENTRADA', diffs: [] };
  }
  if (!input.entradaRegistrada && !input.saidaConfirmada) {
    return { status: 'AGUARDANDO_ENTRADA', diffs: [] };
  }

  const diffs = diffItens(saida, entrada, input.toleranciaQtd);
  return {
    status: diffs.length === 0 ? 'CONCILIADA' : 'DIVERGENTE',
    diffs,
  };
}

/** Lado rascunho (espelho Saipos/NF) não gera CmvLancamento até confirmar. */
export function ladoGeraLancamento(lado: {
  rascunho?: boolean;
  congelado?: boolean;
}): boolean {
  return !lado.rascunho;
}
