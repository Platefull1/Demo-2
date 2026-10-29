import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

export default function CmvLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireTool tool={SystemTool.CMV} toolName="CMV">
      {children}
    </RequireTool>
  );
}
