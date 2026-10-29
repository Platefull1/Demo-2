import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

export default function RelatoriosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireTool tool={SystemTool.AGENDAMENTO_RELATORIOS} toolName="Central de Relatórios">
      {children}
    </RequireTool>
  );
}
