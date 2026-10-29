import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

export default function WhatsappConfigLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireTool tool={SystemTool.WHATSAPP_CHAT} toolName="WhatsApp Chat">
      {children}
    </RequireTool>
  );
}
