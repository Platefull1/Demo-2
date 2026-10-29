import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SystemTool } from '@/types/admin';
import { stackServerApp } from '@/stack';
import { toolsQualifyForContextAccess } from '@/lib/auth/tool-access';

/**
 * Verifica se o usuário atual (StackUser) tem permissão para acessar uma ferramenta específica
 * @param stackUserId - ID do StackUser
 * @param tool - Ferramenta que precisa ser verificada
 * @returns true se tem permissão, false caso contrário
 */
export async function checkToolPermission(
  stackUserId: string,
  tool: SystemTool
): Promise<boolean> {
  try {
    if (!stackUserId) {
      return false;
    }

    // Buscar StackUser com permissões
    const stackUser = await prisma.stackUser.findUnique({
      where: { id: stackUserId },
      include: {
        toolPermissions: true,
      },
    });

    if (!stackUser) {
      return false;
    }

    // Verificar se o usuário está ativo
    if (!stackUser.isActive) {
      return false;
    }

    // Verificar se a ferramenta está habilitada para este usuário
    const permission = stackUser.toolPermissions.find(
      (p) => p.tool === tool && p.isEnabled === true
    );

    if (permission) return true;

    // Admin da empresa tem as duas permissões de ocorrências por padrão
    if (
      tool === SystemTool.REGISTRAR_OCORRENCIAS ||
      tool === SystemTool.VER_OCORRENCIAS
    ) {
      const { isOcorrenciasTenantAdmin } = await import('@/lib/ocorrencias-auth');
      return isOcorrenciasTenantAdmin(stackUserId);
    }

    return false;
  } catch (error) {
    console.error('Erro ao verificar permissão de ferramenta:', error);
    return false;
  }
}

/**
 * Middleware para proteger rotas de ferramentas usando Stack Auth
 * @param tool - Ferramenta que precisa ser verificada
 * @returns NextResponse com erro 403 se não tiver permissão, ou null se tiver
 */
export async function requireToolPermission(
  tool: SystemTool
): Promise<NextResponse | null> {
  try {
    // Obter usuário do Stack Auth
    const stackUser = await stackServerApp.getUser({ or: 'return-null' });
    
    if (!stackUser) {
      return NextResponse.json(
        {
          error: 'Não autenticado',
          message: 'Você precisa estar logado para acessar esta ferramenta',
        },
        { status: 401 }
      );
    }

    // Verificar permissão
    const hasPermission = await checkToolPermission(stackUser.id, tool);

    if (!hasPermission) {
      return NextResponse.json(
        {
          error: 'Acesso negado',
          message: `Você não tem permissão para acessar a ferramenta: ${tool}. Entre em contato com o administrador.`,
        },
        { status: 403 }
      );
    }

    return null;
  } catch (error) {
    console.error('Erro ao verificar permissão de ferramenta:', error);
    return NextResponse.json(
      {
        error: 'Erro ao verificar permissão',
        message: 'Ocorreu um erro ao verificar suas permissões',
      },
      { status: 500 }
    );
  }
}

/** True se o StackUser tem ferramenta de contexto (não só registrar_ocorrencias). */
export async function hasAnyEnabledTool(stackUserId: string): Promise<boolean> {
  if (!stackUserId) return false;
  const rows = await prisma.userToolPermission.findMany({
    where: { stackUserId, isEnabled: true },
    select: { tool: true },
  });
  const tools = rows.map((r) => r.tool);
  if (toolsQualifyForContextAccess(tools)) return true;
  if (tools.length > 0) return false;
  const { isOcorrenciasTenantAdmin } = await import('@/lib/ocorrencias-auth');
  return isOcorrenciasTenantAdmin(stackUserId);
}

/**
 * Autenticado e com pelo menos uma ferramenta.
 * Usado em leituras de contexto (ex.: lista de lojas/APIs sem secrets).
 */
export async function requireAnyToolPermission(): Promise<NextResponse | null> {
  try {
    const stackUser = await stackServerApp.getUser({ or: 'return-null' });
    if (!stackUser) {
      return NextResponse.json(
        {
          error: 'Não autenticado',
          message: 'Você precisa estar logado para acessar esta ferramenta',
        },
        { status: 401 },
      );
    }
    const ok = await hasAnyEnabledTool(stackUser.id);
    if (!ok) {
      return NextResponse.json(
        { error: 'Acesso negado', message: 'Nenhuma ferramenta habilitada.' },
        { status: 403 },
      );
    }
    return null;
  } catch (error) {
    console.error('Erro ao verificar permissão de ferramenta:', error);
    return NextResponse.json(
      {
        error: 'Erro ao verificar permissão',
        message: 'Ocorreu um erro ao verificar suas permissões',
      },
      { status: 500 },
    );
  }
}

/**
 * Verifica permissão de ferramenta para um StackUser específico
 * @param stackUserId - ID do StackUser
 * @param tool - Ferramenta a verificar
 * @returns true se tem permissão, false caso contrário
 */
export async function checkUserToolPermission(
  stackUserId: string,
  tool: SystemTool
): Promise<boolean> {
  try {
    const permission = await prisma.userToolPermission.findUnique({
      where: {
        stackUserId_tool: {
          stackUserId,
          tool,
        },
      },
    });

    return permission?.isEnabled === true;
  } catch (error) {
    console.error('Erro ao verificar permissão de ferramenta do usuário:', error);
    return false;
  }
}
