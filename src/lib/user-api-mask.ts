/**
 * Funções puras para mascaramento de chaves de API.
 * Sem dependências de banco de dados ou serviços externos —
 * podem ser importadas em testes unitários sem mock.
 */

// Tipo público retornado ao cliente (sem apiKey)
export interface UserAPIPublic {
  id: string
  userId: string
  name: string
  storeId: string
  type: 'saipos' | 'custom' | 'whatsapp'
  /** Ex.: "••••a1b2" */
  keyPreview: string
  hasKey: boolean
  baseUrl?: string
  status: 'connected' | 'disconnected' | 'error'
  lastTest?: Date
  createdAt: Date
  updatedAt: Date
}

/** Mascara a chave para exibição ao cliente. Nunca devolve mais de 4 chars originais. */
export function maskApiKey(key: string | null | undefined): string {
  if (!key || key.length < 8) return '••••••••'
  return '••••' + key.slice(-4)
}

/** Converte um registro interno em resposta segura para o cliente. */
export function toPublic<T extends { apiKey?: string | null }>(
  api: T
): Omit<T, 'apiKey'> & { keyPreview: string; hasKey: boolean } {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { apiKey, ...rest } = api as T & Record<string, unknown>
  return {
    ...(rest as Omit<T, 'apiKey'>),
    keyPreview: maskApiKey(apiKey as string | null | undefined),
    hasKey: Boolean(apiKey),
  }
}

/** Lista de contexto (seletor de loja): sem chave, preview ou URL. */
export type UserAPIListItem = {
  id: string
  name: string
  status: 'connected' | 'disconnected' | 'error'
  type: 'saipos' | 'custom' | 'whatsapp'
  storeId: string
  hasKey: boolean
}

export function toListPublic(api: {
  id: string
  name: string
  status: 'connected' | 'disconnected' | 'error'
  type: 'saipos' | 'custom' | 'whatsapp'
  storeId: string
  apiKey?: string | null
}): UserAPIListItem {
  return {
    id: api.id,
    name: api.name,
    status: api.status,
    type: api.type,
    storeId: api.storeId,
    hasKey: Boolean(api.apiKey),
  }
}
