import { redirect } from 'next/navigation';
import { isOcorrenciasOnlyUser } from '@/lib/ocorrencias-auth';
import { getNavigationForUser } from '@/lib/navigation';
import AppGroupLayout from './AppGroupLayout';

export const dynamic = 'force-dynamic';

/**
 * Quem tem só REGISTRAR_OCORRENCIAS não entra no AppShell.
 * O cookie de isolamento é definido em POST /api/ocorrencias/set-mode.
 * Menu: itens permitidos calculados no servidor (sem cadeado, sem fetch no cliente).
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (await isOcorrenciasOnlyUser()) {
    redirect('/ocorrencias/nova');
  }

  const navSections = await getNavigationForUser();
  return <AppGroupLayout navSections={navSections}>{children}</AppGroupLayout>;
}
