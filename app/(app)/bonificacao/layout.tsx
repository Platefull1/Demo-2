import { stackServerApp } from '@/stack';
import { LojaProvider } from '@/contexts/LojaContext';
import { RhClientWrapper } from '@/components/rh/RhClientWrapper';

export default async function BonificacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await stackServerApp.getUser({ or: 'redirect' });

  return (
    <LojaProvider>
      <RhClientWrapper>{children}</RhClientWrapper>
    </LojaProvider>
  );
}
