'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCmvRealAccess } from '@/hooks/useCmvRealAccess';

const TABS = [
  { href: '/cmv-real/notas', label: 'Revisão', match: '/cmv-real/notas' },
  { href: '/cmv-real/produtos', label: 'Produtos', match: '/cmv-real/produtos' },
  { href: '/cmv-real/importar', label: 'Importar', match: '/cmv-real/importar' },
];

export default function CmvRealLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { canView, lojaNaoConfigurada, loading } = useCmvRealAccess();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-gray-400 flex items-center justify-center text-sm">
        Carregando…
      </div>
    );
  }

  if (lojaNaoConfigurada) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-6">
        <div className="max-w-sm text-center space-y-2">
          <p className="font-semibold text-amber-400">Loja não configurada</p>
          <p className="text-sm text-gray-400">
            Peça ao administrador para definir a loja deste usuário em RH → Usuários.
          </p>
        </div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-6">
        <p className="text-sm text-gray-400">Sem permissão para o CMV Real.</p>
      </div>
    );
  }

  const wide = pathname?.startsWith('/cmv-real/importar');

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 pb-20">
      <header className="sticky top-0 z-20 border-b border-[#2a2a2e] bg-[#0a0a0c]/90 backdrop-blur">
        <div
          className={`mx-auto px-3 pt-3 pb-2 ${wide ? 'max-w-5xl' : 'max-w-lg'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base font-semibold text-white">CMV Real</h1>
            <Link href="/dashboard" className="text-xs text-gray-500 hover:text-gray-300">
              Voltar
            </Link>
          </div>
          <nav className="flex gap-1">
            {TABS.map((t) => {
              const active = pathname?.startsWith(t.match);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`flex-1 text-center text-xs font-medium py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1e]'
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className={`mx-auto px-3 py-4 ${wide ? 'max-w-5xl' : 'max-w-lg'}`}>
        {children}
      </main>
    </div>
  );
}
