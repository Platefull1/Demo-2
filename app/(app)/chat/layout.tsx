'use client';

import ToolProtection from '@/components/auth/ToolProtection';
import { SystemTool } from '@/types/admin';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToolProtection tool={SystemTool.CHAT} toolName="Chat">
      {children}
    </ToolProtection>
  );
}
