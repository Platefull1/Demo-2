import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

/** Layout mínimo para o fluxo de contagem (fora do AppShell). */
export default function EstoqueContagemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireTool tool={SystemTool.ESTOQUE} toolName="Estoque">
      <div className="min-h-screen bg-background">{children}</div>
    </RequireTool>
  );
}
