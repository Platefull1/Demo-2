import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

export default function ChecklistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireTool tool={SystemTool.CHECKLIST} toolName="Checklist">
      {children}
    </RequireTool>
  );
}
