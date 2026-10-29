import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

export default function IfoodLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireTool tool={SystemTool.IFOOD} toolName="iFood">
      {children}
    </RequireTool>
  );
}
