import { stackServerApp } from '@/stack';
import { LojaProvider } from '@/contexts/LojaContext';

export default async function PontosLayout({ children }: { children: React.ReactNode }) {
  await stackServerApp.getUser({ or: 'redirect' });

  return <LojaProvider>{children}</LojaProvider>;
}
