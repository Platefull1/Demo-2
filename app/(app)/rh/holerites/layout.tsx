import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

export default function HoleritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireTool tool={SystemTool.HOLERITES} toolName="Holerites">
      {children}
    </RequireTool>
  );
}
