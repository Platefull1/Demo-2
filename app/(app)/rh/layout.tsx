import { LojaProvider } from '@/contexts/LojaContext';
import { RhClientWrapper } from '@/components/rh/RhClientWrapper';
import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';

export default function RhLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireTool tool={SystemTool.RH} toolName="RH">
      <LojaProvider>
        <RhClientWrapper>{children}</RhClientWrapper>
      </LojaProvider>
    </RequireTool>
  );
}
