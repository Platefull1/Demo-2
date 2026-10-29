import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

export default function ProdutosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireTool tool={SystemTool.PRODUTOS} toolName="Produtos">
      {children}
    </RequireTool>
  );
}
