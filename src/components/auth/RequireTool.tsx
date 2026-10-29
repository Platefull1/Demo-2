import { stackServerApp } from '@/stack';
import { canAccessTool } from '@/lib/auth/toolPermissions';
import { SystemTool } from '@/types/admin';
import { SemAcesso } from '@/components/auth/SemAcesso';

export async function RequireTool({
  tool,
  toolName,
  children,
}: {
  tool: SystemTool;
  toolName: string;
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser({ or: 'redirect' });
  const ok = await canAccessTool(user.id, tool);
  if (!ok) return <SemAcesso toolName={toolName} />;
  return <>{children}</>;
}
