import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireTool tool={SystemTool.CHAT} toolName="Chat">
      {children}
    </RequireTool>
  );
}
