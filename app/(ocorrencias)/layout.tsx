import { stackServerApp } from '@/stack';
import { redirect } from 'next/navigation';

/**
 * Layout mínimo para o fluxo mobile de ocorrências (fora do AppShell).
 * Exige autenticação Stack Auth — a verificação de permissão
 * REGISTRAR_OCORRENCIAS é feita no server component da página.
 */
export default async function OcorrenciasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser({ or: 'return-null' });
  if (!user) redirect('/auth/login');

  return (
    <div className="dark min-h-screen bg-background font-sans antialiased">
      {children}
    </div>
  );
}
