import { stackServerApp } from '@/stack';

/** Layout mínimo para o fluxo de contagem (fora do AppShell). */
export default async function EstoqueContagemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await stackServerApp.getUser({ or: 'redirect' });
  return <div className="min-h-screen bg-background">{children}</div>;
}
