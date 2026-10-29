import { RequireTool } from '@/components/auth/RequireTool';
import { SystemTool } from '@/types/admin';
import { CmvRealChrome } from './CmvRealChrome';

export default function CmvRealLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireTool tool={SystemTool.CMV_REAL} toolName="CMV Real">
      <CmvRealChrome>{children}</CmvRealChrome>
    </RequireTool>
  );
}
