import { stackServerApp } from '@/stack';
import { syncStackAuthUser } from '@/lib/stack-auth-sync';

/**
 * User.id da sessão Stack Auth atual (conta realmente logada).
 *
 * Não remapeia para RhTeamMember.tenantUserId. Use para recursos isolados
 * por conta pessoal (ex.: /connections). Para relatórios compartilhados no
 * tenant, use getReportsTenantUserId() de @/lib/reports-tenant-auth.
 */
export async function getSessionDbUser() {
  const stackUser = await stackServerApp.getUser({ or: 'return-null' });
  if (!stackUser) return null;
  return syncStackAuthUser({
    id: stackUser.id,
    primaryEmail: stackUser.primaryEmail || undefined,
    displayName: stackUser.displayName || undefined,
    profileImageUrl: stackUser.profileImageUrl || undefined,
    primaryEmailVerified: stackUser.primaryEmailVerified ? new Date() : null,
  });
}

/**
 * User com escopo de dados do RH (tenant), se o caller tiver acesso ao módulo
 * (admin ou pelo menos uma permissão RH). Membro com zero permissões → null.
 *
 * Para membros de equipe, `id` é o tenantUserId (dono dos dados compartilhados),
 * enquanto fullName/email continuam da sessão — para auditoria (registradoPor).
 * Recursos isolados por conta pessoal devem usar getSessionDbUser().
 */
export async function getRhDbUser() {
  const { rhRequireModuleUser } = await import('@/lib/rh-auth');
  const gate = await rhRequireModuleUser();
  if (!gate) return null;
  const session = await getSessionDbUser();
  if (!session) return null;
  if (session.id === gate.userId) return session;
  return { ...session, id: gate.userId };
}
