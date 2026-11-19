import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { ColaboradorHeader } from '@/components/colaborador/ColaboradorHeader';

export const metadata: Metadata = {
  title: 'Portal do Colaborador · Calenzano',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function ColaboradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const loggedIn = Boolean(jar.get('employee_token')?.value);

  return (
    <div
      className="min-h-dvh bg-background text-foreground font-sans antialiased"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4">
        <ColaboradorHeader loggedIn={loggedIn} />
        <div className="flex flex-1 flex-col pb-8">{children}</div>
      </div>
    </div>
  );
}
