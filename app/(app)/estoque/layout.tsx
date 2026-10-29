import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';
import { EstoqueAdminChrome } from './EstoqueAdminChrome';

export default function EstoqueAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireTool tool={SystemTool.ESTOQUE} toolName="Estoque">
      <EstoqueAdminChrome>{children}</EstoqueAdminChrome>
    </RequireTool>
  );
}
