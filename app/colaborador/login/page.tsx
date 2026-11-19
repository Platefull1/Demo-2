import { Suspense } from 'react';
import { ColaboradorLoginForm } from './LoginForm';

export default function ColaboradorLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">Carregando…</p>
        </main>
      }
    >
      <ColaboradorLoginForm />
    </Suspense>
  );
}
