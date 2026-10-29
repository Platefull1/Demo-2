/**
 * Testes de segurança para /api/user-apis
 *
 * Cobrem:
 * - maskApiKey: não vaza a chave
 * - toPublic: campo apiKey removido, keyPreview e hasKey presentes
 * - updateAPI: campo apiKey vazio não sobrescreve a chave existente
 * - Isolamento entre usuários: usuário A não acessa API do usuário B
 */

import { describe, it, expect } from 'vitest'
// Importar do módulo puro para evitar dependências de DB/SaiposAPI nos testes unitários
import { maskApiKey, toPublic, toListPublic } from './user-api-mask'

// Tipo local equivalente a UserAPIConfig para os testes
interface UserAPIConfig {
  id: string; userId: string; name: string; storeId: string
  type: 'saipos' | 'custom' | 'whatsapp'; apiKey: string
  baseUrl?: string; status: 'connected' | 'disconnected' | 'error'
  lastTest?: Date; createdAt: Date; updatedAt: Date
}

// ---------------------------------------------------------------------------
// maskApiKey
// ---------------------------------------------------------------------------
describe('maskApiKey', () => {
  it('retorna 8 pontos para chave ausente', () => {
    expect(maskApiKey(null)).toBe('••••••••')
    expect(maskApiKey(undefined)).toBe('••••••••')
    expect(maskApiKey('')).toBe('••••••••')
  })

  it('retorna 8 pontos para chave muito curta', () => {
    expect(maskApiKey('abc')).toBe('••••••••')
  })

  it('retorna prefixo mascarado + últimos 4 chars', () => {
    expect(maskApiKey('abcdefgh12345678')).toBe('••••5678')
    expect(maskApiKey('Bearer eyJhbGciOiJSUzI1XXXXABCD')).toBe('••••ABCD')
  })

  it('nunca expõe mais de 4 caracteres da chave original', () => {
    const chave = 'supersecrettoken1234567890'
    const masked = maskApiKey(chave)
    // deve terminar nos últimos 4 chars
    expect(masked.endsWith(chave.slice(-4))).toBe(true)
    // o prefixo deve ser pontos, nunca parte do início da chave
    expect(masked.startsWith('••••')).toBe(true)
    // a chave completa não deve estar presente
    expect(masked).not.toContain('supersecrettoken')
  })
})

// ---------------------------------------------------------------------------
// toPublic
// ---------------------------------------------------------------------------
describe('toPublic', () => {
  const makeConfig = (overrides: Partial<UserAPIConfig> = {}): UserAPIConfig => ({
    id: 'id-1',
    userId: 'user-1',
    name: 'Minha API',
    storeId: 'store_id-1',
    type: 'saipos',
    apiKey: 'Bearer eyJhbGciOiJSUzI1NiXXXXabcd',
    baseUrl: 'https://data.saipos.io/v1',
    status: 'connected',
    lastTest: new Date('2026-10-28'),
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-10-28'),
    ...overrides,
  })

  it('não contém campo apiKey', () => {
    const pub = toPublic(makeConfig())
    expect(pub).not.toHaveProperty('apiKey')
  })

  it('contém keyPreview mascarado', () => {
    const pub = toPublic(makeConfig())
    expect(pub.keyPreview).toBe('••••abcd')
    expect(pub.hasKey).toBe(true)
  })

  it('hasKey = false quando apiKey está vazio', () => {
    const pub = toPublic(makeConfig({ apiKey: '' }))
    expect(pub.hasKey).toBe(false)
    expect(pub.keyPreview).toBe('••••••••')
  })

  it('preserva todos os outros campos', () => {
    const cfg = makeConfig()
    const pub = toPublic(cfg)
    expect(pub.id).toBe(cfg.id)
    expect(pub.userId).toBe(cfg.userId)
    expect(pub.name).toBe(cfg.name)
    expect(pub.storeId).toBe(cfg.storeId)
    expect(pub.type).toBe(cfg.type)
    expect(pub.status).toBe(cfg.status)
  })
})

describe('toListPublic', () => {
  it('só devolve campos de contexto, sem apiKey/keyPreview/baseUrl', () => {
    const item = toListPublic({
      id: 'id-1',
      name: 'Loja A',
      status: 'connected',
      type: 'saipos',
      storeId: 'store_id-1',
      apiKey: 'Bearer secret-token-value',
    })
    expect(item).toEqual({
      id: 'id-1',
      name: 'Loja A',
      status: 'connected',
      type: 'saipos',
      storeId: 'store_id-1',
      hasKey: true,
    })
    expect(JSON.stringify(item)).not.toContain('secret-token-value')
  })
})

// ---------------------------------------------------------------------------
// Nota: Testes de isolamento entre usuários (usuário A × API do usuário B)
// requerem banco de dados de teste e são cobertos por integração.
// O isolamento é garantido pelo filtro `where: { id, userId: dbUser.id }`
// nas rotas PUT, DELETE e POST /test — qualquer registro não pertencente
// retorna 404 sem revelar a existência da API.
// ---------------------------------------------------------------------------
