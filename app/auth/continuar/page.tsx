import { redirect } from 'next/navigation';
import { stackServerApp } from '@/stack';
import { isOcorrenciasOnlyUser } from '@/lib/ocorrencias-auth';

/**
 * Pós-login: quem só registra ocorrência não passa pelo dashboard
 * (o AppShell e o isolamento mandariam de volta e geravam loop).
 */
export default async function AuthContinuarPage() {
  const user = await stackServerApp.getUser({ or: 'return-null' });
  if (!user) redirect('/auth/login');
  if (await isOcorrenciasOnlyUser()) redirect('/ocorrencias/nova');
  redirect('/dashboard');
}
