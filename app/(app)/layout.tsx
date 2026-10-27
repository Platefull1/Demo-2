import { redirect } from 'next/navigation';
import { isOcorrenciasOnlyUser } from '@/lib/ocorrencias-auth';
import AppGroupLayout from './AppGroupLayout';

/**
 * Quem tem só REGISTRAR_OCORRENCIAS não entra no AppShell.
 * O cookie de isolamento é definido em POST /api/ocorrencias/set-mode.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (await isOcorrenciasOnlyUser()) {
    redirect('/ocorrencias/nova');
  }

  return <AppGroupLayout>{children}</AppGroupLayout>;
}
