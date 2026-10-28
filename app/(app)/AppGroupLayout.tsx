'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, User, Moon, Sun, LogOut } from 'lucide-react';
import { Logo } from '@/components/logo';
import { AppProvider } from '@/contexts/app-context';
import { AppShell } from '@/components/layout/AppShell';
import type { NavSectionDTO } from '@/lib/navigation-menu';

export default function AppGroupLayout({
  children,
  navSections,
}: {
  children: React.ReactNode;
  navSections: NavSectionDTO[];
}) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const user = useUser({ or: 'redirect' });
  const router = useRouter();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/ocorrencias/set-mode', { method: 'DELETE' });
    } catch {
      // cookie some no próximo login de um usuário normal
    }
    if (user?.signOut) {
      await user.signOut();
    }
    router.push('/');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-foreground text-sm">Carregando...</div>
      </div>
    );
  }

  const displayName = user.displayName?.trim() || null;
  const email = user.primaryEmail || null;
  const primaryLabel = displayName || email || 'Usuário';
  const initial =
    displayName?.charAt(0)?.toUpperCase() ||
    email?.charAt(0)?.toUpperCase() ||
    'U';

  const footer = ({ collapsed }: { collapsed: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={
            collapsed
              ? 'relative h-9 w-9 p-0 text-foreground hover:bg-muted'
              : 'relative h-auto min-h-9 w-full justify-start gap-2 px-2 py-1.5 text-foreground hover:bg-muted'
          }
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage
              src={user.profileImageUrl || '/avatars/01.png'}
              alt={primaryLabel}
            />
            <AvatarFallback className="bg-accent text-accent-foreground text-xs">
              {initial}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium text-foreground">
                {primaryLabel}
              </span>
              {displayName && email ? (
                <span className="block truncate text-xs text-muted-foreground">
                  {email}
                </span>
              ) : null}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        className="bg-popover border-border text-popover-foreground w-56"
      >
        <DropdownMenuItem className="focus:bg-muted">
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          {primaryLabel}
        </DropdownMenuItem>
        {email ? (
          <DropdownMenuItem className="focus:bg-muted text-xs text-muted-foreground">
            {email}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem className="focus:bg-muted" onClick={toggleDarkMode}>
          {isDarkMode ? (
            <>
              <Sun className="mr-2 h-4 w-4 text-muted-foreground" />
              Modo claro
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4 text-muted-foreground" />
              Modo escuro
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-muted">
          <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuItem
          className="focus:bg-muted text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const logo = (
    <Link href="/dashboard" className="hover:opacity-80 transition-opacity block">
      <Logo />
    </Link>
  );

  const logoCollapsed = (
    <Link href="/dashboard" className="hover:opacity-80 transition-opacity block">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground text-xs font-semibold">
        P
      </div>
    </Link>
  );

  return (
    <AppProvider>
      <div className={isDarkMode ? 'dark' : ''}>
        <AppShell
          logo={logo}
          logoCollapsed={logoCollapsed}
          navSections={navSections}
          footer={footer}
        >
          {children}
        </AppShell>
      </div>
    </AppProvider>
  );
}
