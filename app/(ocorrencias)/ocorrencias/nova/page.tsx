import { redirect } from 'next/navigation';
import { stackServerApp } from '@/stack';
import { getOcorrenciasContext, isOcorrenciasOnlyUser } from '@/lib/ocorrencias-auth';
import NovaOcorrenciaClient from './NovaOcorrenciaClient';

export default async function NovaOcorrenciaPage() {
  const ctx = await getOcorrenciasContext();

  if (!ctx) {
    const user = await stackServerApp.getUser({ or: 'return-null' });
    // Já autenticado: não mandar ao login (loop com isolamento).
    if (user) redirect('/auth/continuar');
    redirect('/auth/login');
  }
  if (!ctx.canRegister) {
    if (ctx.canView) redirect('/ocorrencias');
    redirect('/auth/continuar');
  }

  const isOcorrenciasOnly = await isOcorrenciasOnlyUser();

  return (
    <NovaOcorrenciaClient
      isOcorrenciasOnly={isOcorrenciasOnly}
      canView={ctx.canView}
    />
  );
}
