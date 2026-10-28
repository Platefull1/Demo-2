import { SaiposAPIService } from '@/lib/saipos-api'
import { db } from '@/lib/db'

// Usar a mesma instância do PrismaClient para evitar vazamento de conexões
const prisma = db

// Verificar se DATABASE_URL está configurada
if (!process.env.DATABASE_URL) {
  console.error('⚠️ DATABASE_URL não está configurada! Configure-a nas variáveis de ambiente.');
}

// Re-exportar funções puras (sem deps pesadas) para uso nas rotas e em testes
export { maskApiKey, toPublic } from '@/lib/user-api-mask'
export type { UserAPIPublic } from '@/lib/user-api-mask'

export interface UserAPIConfig {
  id: string
  userId: string
  name: string
  storeId: string // Formato: store_${id}
  type: 'saipos' | 'custom' | 'whatsapp'
  apiKey: string
  baseUrl?: string
  status: 'connected' | 'disconnected' | 'error'
  lastTest?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserAPIRequest {
  userId: string
  name: string
  type: 'saipos' | 'custom' | 'whatsapp'
  apiKey: string
  baseUrl?: string
}

export interface UpdateUserAPIRequest {
  name?: string
  apiKey?: string
  baseUrl?: string
  status?: 'connected' | 'disconnected' | 'error'
  lastTest?: Date
}

export class UserAPIService {
  // Criar nova API para usuário
  static async createAPI(data: CreateUserAPIRequest): Promise<UserAPIConfig> {
    try {
      // Limitar a até 4 conexões Saipos por usuário
      if (data.type === 'saipos') {
        const count = await prisma.userAPI.count({ where: { userId: data.userId, type: 'saipos' } })
        if (count >= 4) {
          throw new Error('Limite de 4 conexões Saipos atingido')
        }
      }

      // Para APIs Saipos, sempre usar URL fixa
      const finalBaseUrl = data.type === 'saipos' 
        ? 'https://data.saipos.io/v1'
        : (data.baseUrl || 'https://data.saipos.io/v1')

      // Criar API primeiro
      const api = await prisma.userAPI.create({
        data: {
          userId: data.userId,
          name: data.name,
          type: data.type,
          apiKey: data.apiKey,
          baseUrl: finalBaseUrl,
          status: 'disconnected',
          storeId: `temp_${Date.now()}` // Temporário, será atualizado abaixo
        }
      })

      // Gerar storeId único baseado no id da API
      const storeId = `store_${api.id}`
      
      // Atualizar com o storeId real
      const updatedApi = await prisma.userAPI.update({
        where: { id: api.id },
        data: { storeId }
      })

      console.log(`✅ API ${data.name} criada para usuário ${data.userId} com storeId: ${storeId}`)
      return updatedApi as UserAPIConfig
    } catch (error) {
      console.error('❌ Erro ao criar API:', error)
      throw new Error('Erro ao criar configuração da API')
    }
  }

  // Obter todas as APIs de um usuário
  static async getUserAPIs(userId: string): Promise<UserAPIConfig[]> {
    try {
      const apis = await prisma.userAPI.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })

      console.log(`📱 ${apis.length} APIs encontradas para usuário ${userId}`)
      return apis as UserAPIConfig[]
    } catch (error) {
      console.error('❌ Erro ao buscar APIs:', error)
      throw new Error('Erro ao buscar configurações das APIs')
    }
  }

  // Atualizar API
  static async updateAPI(apiId: string, data: UpdateUserAPIRequest): Promise<UserAPIConfig> {
    try {
      // Buscar a API para verificar o tipo
      const existingAPI = await prisma.userAPI.findUnique({
        where: { id: apiId }
      })

      // Montar payload de atualização
      const updateData: Partial<UpdateUserAPIRequest> = { ...data }

      // Nunca sobrescrever a chave com string vazia — campo vazio = manter existente
      if (!updateData.apiKey?.trim()) {
        delete updateData.apiKey
      } else {
        updateData.apiKey = updateData.apiKey.trim()
      }

      // Se for API Saipos e baseUrl foi enviada, garantir que seja sempre a URL fixa
      if (existingAPI?.type === 'saipos' && data.baseUrl !== undefined) {
        updateData.baseUrl = 'https://data.saipos.io/v1'
      }

      const api = await prisma.userAPI.update({
        where: { id: apiId },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      })

      console.log(`✅ API ${apiId} atualizada`)
      return api as UserAPIConfig
    } catch (error) {
      console.error('❌ Erro ao atualizar API:', error)
      throw new Error('Erro ao atualizar configuração da API')
    }
  }

  // Deletar API
  static async deleteAPI(apiId: string): Promise<void> {
    try {
      await prisma.userAPI.delete({
        where: { id: apiId }
      })

      console.log(`✅ API ${apiId} removida`)
    } catch (error) {
      console.error('❌ Erro ao deletar API:', error)
      throw new Error('Erro ao remover configuração da API')
    }
  }

  // Obter API específica
  static async getAPI(apiId: string): Promise<UserAPIConfig | null> {
    try {
      const api = await prisma.userAPI.findUnique({
        where: { id: apiId }
      })

      return api as UserAPIConfig | null
    } catch (error) {
      console.error('❌ Erro ao buscar API:', error)
      throw new Error('Erro ao buscar configuração da API')
    }
  }

  // Testar conexão e atualizar status
  static async testAndUpdateAPI(apiId: string): Promise<UserAPIConfig> {
    try {
      const api = await this.getAPI(apiId)
      if (!api) {
        throw new Error('API não encontrada')
      }

      console.log(`🔗 Testando conexão com ${api.name}...`)
      console.log(`📍 URL: ${api.baseUrl}`)
      console.log(`🔑 API Key: ${api.apiKey.substring(0, 12)}...`)

      // Para APIs Saipos, sempre usar URL fixa
      const finalBaseUrl = api.type === 'saipos' 
        ? 'https://data.saipos.io/v1'
        : (api.baseUrl || 'https://data.saipos.io/v1')

      // Teste REAL: tentar buscar lojas com o token
      const client = new SaiposAPIService({ 
        apiKey: api.apiKey, 
        baseUrl: finalBaseUrl
      })
      let status: 'connected' | 'error' = 'error'
      let errorMessage: string | null = null
      
      try {
        const ok = await client.testConnection()
        if (ok) {
          // opcional: verificar se retorna ao menos uma loja
          try {
            await client.getStores().catch(() => {})
            status = 'connected'
          } catch {
            // Se getStores falhar mas testConnection passou, ainda consideramos conectado
            status = 'connected'
          }
        } else {
          // Se testConnection retornou false mas não lançou erro, é uma falha silenciosa
          status = 'error'
          errorMessage = 'Falha ao conectar com a API Saipos. Verifique o token e a URL.'
          throw new Error(errorMessage)
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        console.error('Falha no teste real:', msg)
        status = 'error'
        errorMessage = msg
        
        // Se o erro for "fetch failed", tentar fornecer mais contexto
        if (msg.includes('fetch failed') || msg.includes('Failed to fetch')) {
          throw new Error(`Não foi possível conectar com a API Saipos. Possíveis causas:\n1. URL incorreta: ${api.baseUrl}\n2. Token inválido\n3. API não acessível do servidor\n4. Problema de rede/firewall`)
        }
        
        // Re-throw para propagar mensagem de erro específica
        throw new Error(msg)
      }

      // Atualizar status no banco
      const updatedAPI = await this.updateAPI(apiId, {
        status,
        lastTest: new Date()
      })

      if (status === 'connected') {
        console.log(`✅ Teste concluído: ${status}`)
      } else {
        console.log(`⚠️ Teste concluído: ${status}`)
      }
      return updatedAPI
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('❌ Erro ao testar API:', errorMessage)
      
      // Marcar como erro no banco
      try {
        await this.updateAPI(apiId, {
          status: 'error',
          lastTest: new Date()
        })
      } catch (e) {
        console.error('Erro ao atualizar status no banco:', e)
      }

      // Re-throw com mensagem específica
      throw new Error(errorMessage)
    }
  }

  // Obter APIs conectadas de um usuário
  static async getConnectedAPIs(userId: string): Promise<UserAPIConfig[]> {
    try {
      const apis = await prisma.userAPI.findMany({
        where: { 
          userId,
          status: 'connected'
        },
        orderBy: { createdAt: 'desc' }
      })

      console.log(`🔗 ${apis.length} APIs conectadas para usuário ${userId}`)
      return apis as UserAPIConfig[]
    } catch (error) {
      console.error('❌ Erro ao buscar APIs conectadas:', error)
      throw new Error('Erro ao buscar APIs conectadas')
    }
  }
}

export default UserAPIService
