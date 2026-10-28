import { redirect } from 'next/navigation';
import { getOcorrenciasContext } from '@/lib/ocorrencias-auth';
import OcorrenciasClient from './OcorrenciasClient';

export const metadata = { title: 'Central de Ocorrências — Platefull' };

export default async function OcorrenciasPage() {
  const ctx = await getOcorrenciasContext();
  if (!ctx) {
    redirect('/auth/continuar');
  }
  if (!ctx.canView) {
    // Só pode registrar → manda para a tela mobile
    if (ctx.canRegister) redirect('/ocorrencias/nova');
    redirect('/dashboard');
  }

  return <OcorrenciasClient />;
}
