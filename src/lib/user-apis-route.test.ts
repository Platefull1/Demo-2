/**
 * Testes de segurança das rotas /api/user-apis (PUT, DELETE, GET)
 * e /api/user-apis/test (POST).
 *
 * Cenários cobertos:
 *  - Sem CONEXOES: todos os métodos retornam 403
 *  - Usuário A tenta PUT / DELETE / POST /test na API do usuário B → 404
 *  - Usuário B consegue PUT / DELETE / POST /test nas próprias APIs → 200
 *  - GET nunca inclui campo 'apiKey' (nem em campos aninhados)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// Mocks (devem vir antes do import dos handlers)
// ---------------------------------------------------------------------------

vi.mock('@/lib/auth/toolPermissions', () => ({
  requireToolPermission: vi.fn(),
}))

vi.mock('@/stack', () => ({
  stackServerApp: { getUser: vi.fn() },
}))

vi.mock('@/lib/stack-auth-sync', () => ({
  syncStackAuthUser: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    userAPI: { findFirst: vi.fn() },
  },
}))

vi.mock('@/lib/user-api-service', async () => {
  const mask = await vi.importActual<typeof import('@/lib/user-api-mask')>('@/lib/user-api-mask')
  return {
    toPublic: mask.toPublic,
    maskApiKey: mask.maskApiKey,
    UserAPIService: {
      getUserAPIs: vi.fn(),
      updateAPI: vi.fn(),
      deleteAPI: vi.fn(),
      createAPI: vi.fn(),
    },
  }
})

// ---------------------------------------------------------------------------
// Imports dos handlers (depois dos mocks)
// ---------------------------------------------------------------------------

import { GET, PUT, DELETE } from '../../app/api/user-apis/route'
import { POST as TEST_POST } from '../../app/api/user-apis/test/route'

import { requireToolPermission } from '@/lib/auth/toolPermissions'
import { stackServerApp } from '@/stack'
import { syncStackAuthUser } from '@/lib/stack-auth-sync'
import { prisma } from '@/lib/prisma'
import { UserAPIService } from '@/lib/user-api-service'

// Helpers para tipagem dos mocks
const mockRequireTP = vi.mocked(requireToolPermission)
const mockGetUser    = vi.mocked(stackServerApp.getUser as ReturnType<typeof vi.fn>)
const mockSync       = vi.mocked(syncStackAuthUser)
const mockFindFirst  = vi.mocked(prisma.userAPI.findFirst as ReturnType<typeof vi.fn>)
const mockGetAPIs    = vi.mocked(UserAPIService.getUserAPIs as ReturnType<typeof vi.fn>)
const mockUpdateAPI  = vi.mocked(UserAPIService.updateAPI as ReturnType<typeof vi.fn>)
const mockDeleteAPI  = vi.mocked(UserAPIService.deleteAPI as ReturnType<typeof vi.fn>)

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const STACK_A = { id: 'stack-a', primaryEmail: 'a@test.com', displayName: 'User A', profileImageUrl: null, primaryEmailVerified: true }
const STACK_B = { id: 'stack-b', primaryEmail: 'b@test.com', displayName: 'User B', profileImageUrl: null, primaryEmailVerified: true }
const DB_A    = { id: 'db-a' }
const DB_B    = { id: 'db-b' }

const API_A = { id: 'api-a', userId: 'db-a', name: 'API de A', type: 'saipos', storeId: 'store_api-a', apiKey: 'Bearer eyJAAAAAAAAAAAAAAAAAAbcd', baseUrl: 'https://data.saipos.io/v1', status: 'connected', createdAt: new Date(), updatedAt: new Date() }
const API_B = { id: 'api-b', userId: 'db-b', name: 'API de B', type: 'saipos', storeId: 'store_api-b', apiKey: 'Bearer eyJBBBBBBBBBBBBBBBBBBBBxyz', baseUrl: 'https://data.saipos.io/v1', status: 'connected', createdAt: new Date(), updatedAt: new Date() }

function makeReq(method: string, url: string, body?: unknown): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })
}

/** Configura "usuário X com CONEXOES=true" */
function asUser(stackUser: typeof STACK_A, dbUser: { id: string }) {
  mockRequireTP.mockResolvedValue(null)               // CONEXOES OK
  mockGetUser.mockResolvedValue(stackUser as never)
  mockSync.mockResolvedValue(dbUser as never)
}

/** Configura "sem permissão CONEXOES" */
function withoutConexoes() {
  mockRequireTP.mockResolvedValue(
    NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  )
}

// ---------------------------------------------------------------------------
// Testes
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Sem permissão CONEXOES → 403 em todos os métodos', () => {
  beforeEach(withoutConexoes)

  it('GET retorna 403', async () => {
    const res = await GET()
    expect(res.status).toBe(403)
  })

  it('PUT retorna 403', async () => {
    const req = makeReq('PUT', 'http://localhost/api/user-apis?id=api-b', { name: 'hack' })
    const res = await PUT(req)
    expect(res.status).toBe(403)
  })

  it('DELETE retorna 403', async () => {
    const req = makeReq('DELETE', 'http://localhost/api/user-apis?id=api-b')
    const res = await DELETE(req)
    expect(res.status).toBe(403)
  })

  it('POST /test retorna 403', async () => {
    const req = makeReq('POST', 'http://localhost/api/user-apis/test?id=api-b')
    const res = await TEST_POST(req)
    expect(res.status).toBe(403)
  })
})

describe('Usuário A tenta agir nas APIs de B → 404', () => {
  beforeEach(() => {
    asUser(STACK_A, DB_A)
    // findFirst retorna null → API não pertence ao usuário A
    mockFindFirst.mockResolvedValue(null)
  })

  it('PUT na api-b → 404', async () => {
    const req = makeReq('PUT', 'http://localhost/api/user-apis?id=api-b', { name: 'hack' })
    const res = await PUT(req)
    expect(res.status).toBe(404)
    // Garantir que updateAPI nunca foi chamada
    expect(mockUpdateAPI).not.toHaveBeenCalled()
  })

  it('DELETE na api-b → 404', async () => {
    const req = makeReq('DELETE', 'http://localhost/api/user-apis?id=api-b')
    const res = await DELETE(req)
    expect(res.status).toBe(404)
    expect(mockDeleteAPI).not.toHaveBeenCalled()
  })

  it('POST /test na api-b → 404', async () => {
    const req = makeReq('POST', 'http://localhost/api/user-apis/test?id=api-b')
    const res = await TEST_POST(req)
    expect(res.status).toBe(404)
  })
})

describe('Usuário B age nas próprias APIs → 200', () => {
  beforeEach(() => {
    asUser(STACK_B, DB_B)
    // findFirst retorna a api-b (pertence ao B)
    mockFindFirst.mockResolvedValue(API_B as never)
  })

  it('PUT na api-b → 200', async () => {
    mockUpdateAPI.mockResolvedValue(API_B as never)
    const req = makeReq('PUT', 'http://localhost/api/user-apis?id=api-b', { name: 'Novo nome' })
    const res = await PUT(req)
    expect(res.status).toBe(200)
    expect(mockUpdateAPI).toHaveBeenCalledWith('api-b', expect.any(Object))
  })

  it('DELETE na api-b → 200', async () => {
    mockDeleteAPI.mockResolvedValue(undefined)
    const req = makeReq('DELETE', 'http://localhost/api/user-apis?id=api-b')
    const res = await DELETE(req)
    expect(res.status).toBe(200)
    expect(mockDeleteAPI).toHaveBeenCalledWith('api-b')
  })
})

describe('GET: resposta nunca contém apiKey', () => {
  it('campo apiKey ausente mesmo quando DB tem a chave', async () => {
    asUser(STACK_A, DB_A)
    // Simula retorno do banco com apiKey presente
    mockGetAPIs.mockResolvedValue([API_A, API_B] as never)

    const res = await GET()
    expect(res.status).toBe(200)

    const body = await res.json()
    const bodyStr = JSON.stringify(body)

    // 1. Nenhum objeto deve ter campo "apiKey"
    for (const api of body.apis) {
      expect(api).not.toHaveProperty('apiKey')
    }

    // 2. Os valores reais das chaves não podem aparecer em nenhum lugar da resposta
    expect(bodyStr).not.toContain('eyJAAAAAAAAAAAAAAAAAAbcd')
    expect(bodyStr).not.toContain('eyJBBBBBBBBBBBBBBBBBBBBxyz')

    // 3. keyPreview e hasKey devem estar presentes
    for (const api of body.apis) {
      expect(api).toHaveProperty('keyPreview')
      expect(api).toHaveProperty('hasKey')
    }
  })
})

describe('Isolamento: findFirst usa where { id, userId } — nunca busca só por id', () => {
  it('PUT passa where com id E userId do usuário logado', async () => {
    asUser(STACK_B, DB_B)
    mockFindFirst.mockResolvedValue(API_B as never)
    mockUpdateAPI.mockResolvedValue(API_B as never)

    const req = makeReq('PUT', 'http://localhost/api/user-apis?id=api-b', { name: 'ok' })
    await PUT(req)

    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 'api-b', userId: 'db-b' }),
      })
    )
  })

  it('DELETE passa where com id E userId do usuário logado', async () => {
    asUser(STACK_B, DB_B)
    mockFindFirst.mockResolvedValue(API_B as never)
    mockDeleteAPI.mockResolvedValue(undefined)

    const req = makeReq('DELETE', 'http://localhost/api/user-apis?id=api-b')
    await DELETE(req)

    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 'api-b', userId: 'db-b' }),
      })
    )
  })
})
