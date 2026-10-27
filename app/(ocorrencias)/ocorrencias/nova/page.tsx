import { redirect } from 'next/navigation';
import { getOcorrenciasContext } from '@/lib/ocorrencias-auth';
import NovaOcorrenciaClient from './NovaOcorrenciaClient';

export default async function NovaOcorrenciaPage() {
  const ctx = await getOcorrenciasContext();

  if (!ctx) redirect('/auth/login');
  if (!ctx.canRegister) {
    if (ctx.canView) redirect('/ocorrencias');
    redirect('/dashboard');
  }

  return <NovaOcorrenciaClient />;
}
