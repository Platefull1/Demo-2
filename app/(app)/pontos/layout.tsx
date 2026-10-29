import { LojaProvider } from '@/contexts/LojaContext';
import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

export default function PontosLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireTool tool={SystemTool.PONTOS} toolName="Pontos">
      <LojaProvider>{children}</LojaProvider>
    </RequireTool>
  );
}
