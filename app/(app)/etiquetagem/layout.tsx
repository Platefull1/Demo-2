import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

export default function EtiquetagemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireTool tool={SystemTool.ETIQUETAGEM} toolName="Etiquetagem">
      {children}
    </RequireTool>
  );
}
