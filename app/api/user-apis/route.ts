export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { UserAPIService, CreateUserAPIRequest, UpdateUserAPIRequest, toPublic, toListPublic } from '@/lib/user-api-service'
import { stackServerApp } from '@/stack'
import { syncStackAuthUser } from '@/lib/stack-auth-sync'
import { requireAnyToolPermission, requireToolPermission } from '@/lib/auth/toolPermissions'
import { SystemTool } from '@/types/admin'
import { prisma } from '@/lib/prisma'
import { rhGetUser } from '@/lib/rh-auth'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Autentica + sincroniza o usuário; retorna { dbUser } ou { error: NextResponse } */
async function resolveDbUser() {
  const stackUser = await stackServerApp.getUser({ or: 'return-null' })
  if (!stackUser) {
    return { error: NextResponse.json({ error: 'Não autenticado' }, { status: 401 }) }
  }
  try {
    const dbUser = await syncStackAuthUser({
      id: stackUser.id,
      primaryEmail: stackUser.primaryEmail,
      displayName: stackUser.displayName,
      profileImageUrl: stackUser.profileImageUrl,
      primaryEmailVerified: stackUser.primaryEmailVerified ? new Date() : null,
    })
    return { dbUser }
  } catch (e: unknown) {
    const message = (e as Error)?.message || 'Falha ao sincronizar usuário'
    return { error: NextResponse.json({ error: message }, { status: 500 }) }
  }
}

// ---------------------------------------------------------------------------
// GET /api/user-apis — Lista de contexto (id/nome/status). Sem secrets.
// Qualquer usuário do tenant com pelo menos uma ferramenta.
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const permErr = await requireAnyToolPermission()
    if (permErr) return permErr

    const { dbUser, error } = await resolveDbUser()
    if (error) return error

    const rh = await rhGetUser()
    const tenantUserId = rh?.userId ?? dbUser!.id
    const apis = await UserAPIService.getUserAPIs(tenantUserId)
    return NextResponse.json({ apis: apis.map(toListPublic) })
  } catch (err) {
    console.error('GET /api/user-apis:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// POST /api/user-apis — Criar nova conexão
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const permErr = await requireToolPermission(SystemTool.CONEXOES)
    if (permErr) return permErr

    const { dbUser, error } = await resolveDbUser()
    if (error) return error

    const body = (await request.json()) as Omit<CreateUserAPIRequest, 'userId'>
    if (!body.name || !body.apiKey) {
      return NextResponse.json({ error: 'Campos obrigatórios: name, apiKey' }, { status: 400 })
    }

    try {
      const api = await UserAPIService.createAPI({ ...body, userId: dbUser!.id })
      return NextResponse.json({ api: toPublic(api) }, { status: 201 })
    } catch (e: unknown) {
      const message = (e as Error)?.message || 'Falha ao salvar API'
      console.error('POST /api/user-apis createAPI:', e)
      const status = message.includes('Limite de 4 conexões Saipos') ? 400 : 500
      return NextResponse.json({ error: message }, { status })
    }
  } catch (err: unknown) {
    const message = (err as Error)?.message || 'Erro interno do servidor'
    console.error('POST /api/user-apis:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// PUT /api/user-apis?id=<apiId> — Atualizar conexão (ownership obrigatório)
// ---------------------------------------------------------------------------
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apiId = searchParams.get('id')
    if (!apiId) {
      return NextResponse.json({ error: 'ID da API é obrigatório' }, { status: 400 })
    }

    const permErr = await requireToolPermission(SystemTool.CONEXOES)
    if (permErr) return permErr

    const { dbUser, error } = await resolveDbUser()
    if (error) return error

    // Verificar posse: busca já filtrada por userId
    const existing = await prisma.userAPI.findFirst({
      where: { id: apiId, userId: dbUser!.id },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }

    const body: UpdateUserAPIRequest = await request.json()

    // Campo apiKey vazio = manter existente (já tratado em UserAPIService.updateAPI)
    const api = await UserAPIService.updateAPI(apiId, body)
    return NextResponse.json({ api: toPublic(api) })
  } catch (err: unknown) {
    const message = (err as Error)?.message || 'Erro interno do servidor'
    console.error('PUT /api/user-apis:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/user-apis?id=<apiId> — Remover conexão (ownership obrigatório)
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apiId = searchParams.get('id')
    if (!apiId) {
      return NextResponse.json({ error: 'ID da API é obrigatório' }, { status: 400 })
    }

    const permErr = await requireToolPermission(SystemTool.CONEXOES)
    if (permErr) return permErr

    const { dbUser, error } = await resolveDbUser()
    if (error) return error

    // Verificar posse: busca já filtrada por userId
    const existing = await prisma.userAPI.findFirst({
      where: { id: apiId, userId: dbUser!.id },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }

    await UserAPIService.deleteAPI(apiId)
    return NextResponse.json({ message: 'API removida com sucesso' })
  } catch (err: unknown) {
    const message = (err as Error)?.message || 'Erro interno do servidor'
    console.error('DELETE /api/user-apis:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
