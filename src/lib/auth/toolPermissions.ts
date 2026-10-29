import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SystemTool } from '@/types/admin';
import { stackServerApp } from '@/stack';
import { toolsQualifyForContextAccess } from '@/lib/auth/tool-access';
import { canAccessToolFromState } from '@/lib/auth/can-access-tool';

export { canAccessToolFromState, canSeeCmvReal } from '@/lib/auth/can-access-tool';

/**
 * Camada 1: só UserToolPermission. Sem bypass de dono/admin/ocorrências.
 * Erro de consulta → false (fail-closed).
 */
export async function canAccessTool(
  stackUserId: string,
  tool: SystemTool,
): Promise<boolean> {
  try {
    if (!stackUserId) return false;

    const stackUser = await prisma.stackUser.findUnique({
      where: { id: stackUserId },
      select: {
        isActive: true,
        toolPermissions: {
          where: { tool, isEnabled: true },
          select: { id: true },
        },
      },
    });

    return canAccessToolFromState({
      stackUserExists: Boolean(stackUser),
      isActive: stackUser?.isActive === true,
      enabledTools: stackUser?.toolPermissions.length ? [tool] : [],
      tool,
    });
  } catch (error) {
    console.error('[canAccessTool] fail-closed:', error);
    return false;
  }
}

/** Alias de canAccessTool — mesma regra, mesmo fail-closed. */
export async function checkToolPermission(
  stackUserId: string,
  tool: SystemTool,
): Promise<boolean> {
  return canAccessTool(stackUserId, tool);
}

/**
 * Middleware para proteger rotas de ferramentas usando Stack Auth
 * @param tool - Ferramenta que precisa ser verificada
 * @returns NextResponse com erro 403 se não tiver permissão, ou null se tiver
 */
export async function requireToolPermission(
  tool: SystemTool,
): Promise<NextResponse | null> {
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

    const hasPermission = await canAccessTool(stackUser.id, tool);

    if (!hasPermission) {
      return NextResponse.json(
        {
          error: 'Acesso negado',
          message: `Você não tem permissão para acessar a ferramenta: ${tool}. Entre em contato com o administrador.`,
        },
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

/** True se o StackUser tem ferramenta de contexto (não só registrar_ocorrencias). */
export async function hasAnyEnabledTool(stackUserId: string): Promise<boolean> {
  try {
    if (!stackUserId) return false;
    const rows = await prisma.userToolPermission.findMany({
      where: { stackUserId, isEnabled: true },
      select: { tool: true },
    });
    return toolsQualifyForContextAccess(rows.map((r) => r.tool));
  } catch (error) {
    console.error('[hasAnyEnabledTool] fail-closed:', error);
    return false;
  }
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
  tool: SystemTool,
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
