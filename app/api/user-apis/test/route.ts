export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { UserAPIService, toPublic } from '@/lib/user-api-service'
import { stackServerApp } from '@/stack'
import { syncStackAuthUser } from '@/lib/stack-auth-sync'
import { requireToolPermission } from '@/lib/auth/toolPermissions'
import { SystemTool } from '@/types/admin'
import { prisma } from '@/lib/prisma'

// POST /api/user-apis/test?id=<apiId> — Testar conexão (ownership obrigatório)
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar permissão de ferramenta
    const permErr = await requireToolPermission(SystemTool.CONEXOES)
    if (permErr) return permErr

    // 2. Autenticar e sincronizar usuário
    const stackUser = await stackServerApp.getUser({ or: 'return-null' })
    if (!stackUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }
    let dbUser
    try {
      dbUser = await syncStackAuthUser({
        id: stackUser.id,
        primaryEmail: stackUser.primaryEmail,
        displayName: stackUser.displayName,
        profileImageUrl: stackUser.profileImageUrl,
        primaryEmailVerified: stackUser.primaryEmailVerified ? new Date() : null,
      })
    } catch {
      return NextResponse.json({ error: 'Falha ao sincronizar usuário' }, { status: 500 })
    }

    // 3. Validar parâmetro
    const { searchParams } = new URL(request.url)
    const apiId = searchParams.get('id')
    if (!apiId) {
      return NextResponse.json({ error: 'ID da API é obrigatório' }, { status: 400 })
    }

    // 4. Verificar posse: busca filtrada por id E userId
    const existing = await prisma.userAPI.findFirst({
      where: { id: apiId, userId: dbUser.id },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }

    // 5. Executar teste
    const api = await UserAPIService.testAndUpdateAPI(apiId)

    // 6. Se Saipos conectou pela primeira vez, disparar carregamento inicial em background
    if (api.status === 'connected' && api.type === 'saipos') {
      const { db } = await import('@/lib/db')
      const storeId = api.storeId

      const today = new Date()
      today.setHours(23, 59, 59, 999)
      const fifteenDaysAgo = new Date(today)
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 14)
      fifteenDaysAgo.setHours(0, 0, 0, 0)

      const existingData = await db.salesDaily.findFirst({
        where: {
          apiId: api.id,
          storeId,
          date: { gte: fifteenDaysAgo, lte: today },
        },
      })

      if (!existingData) {
        console.log(`🔄 Iniciando carregamento inicial de 15 dias para ${storeId}...`)
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://platefull.com.br'
        fetch(`${baseUrl}/api/saipos/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiId: api.id, days: 15 }),
        }).catch(err => console.error('Erro ao iniciar carregamento inicial:', err))
      }
    }

    // 7. Retornar resultado SEM expor apiKey
    return NextResponse.json({ api: toPublic(api) })
  } catch (error: unknown) {
    console.error('POST /api/user-apis/test:', error)
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    const status =
      message.includes('Token inválido') || message.includes('401') || message.includes('403')
        ? 401
        : 500
    return NextResponse.json({ error: message }, { status })
  }
}
