import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

export default function TarefasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireTool tool={SystemTool.TAREFAS} toolName="Tarefas">
      {children}
    </RequireTool>
  );
}
