'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Settings,
  User,
  Moon,
  Sun,
  LogOut,
  Link2,
  FileBarChart2,
  MessageSquare,
  ClipboardCheck,
  Tag,
  Package,
  BarChart2,
  Warehouse,
  ShoppingBag,
  Users,
  ListChecks,
  Bot,
  Clock,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { AppProvider } from '@/contexts/app-context';
import { useToolPermissions } from '@/hooks/useToolPermissions';
import { useCmvRealAccess } from '@/hooks/useCmvRealAccess';
import { SystemTool } from '@/types/admin';
import { AppShell, type AppShellNavItem } from '@/components/layout/AppShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const pathname = usePathname();

  const user = useUser({ or: 'redirect' });
  const { permissions, loading: permissionsLoading } = useToolPermissions();
  const { canView: canViewCmvReal, loading: cmvRealLoading } = useCmvRealAccess();

  const router = useRouter();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    if (user?.signOut) {
      await user.signOut();
    }
    router.push('/');
  };

  const navItems = useMemo<AppShellNavItem[]>(() => {
    if (permissionsLoading) return [];

    const items: AppShellNavItem[] = [];

    items.push({
      id: 'produtos',
      label: 'Produtos',
      href: '/produtos',
      icon: Package,
      locked: !permissions[SystemTool.PRODUTOS],
      active: pathname === '/produtos',
    });

    items.push({
      id: 'conexoes',
      label: 'Conexões',
      href: '/connections',
      icon: Link2,
      locked: !permissions[SystemTool.CONEXOES],
      active: pathname === '/connections',
    });

    items.push({
      id: 'relatorios',
      label: 'Central de Relatórios',
      href: '/relatorios',
      icon: FileBarChart2,
      locked: !permissions[SystemTool.AGENDAMENTO_RELATORIOS],
      active: pathname === '/relatorios' || Boolean(pathname?.startsWith('/relatorios/')),
    });

    items.push({
      id: 'whatsapp',
      label: 'WhatsApp Chat',
      href: '/whatsapp-tools',
      icon: MessageSquare,
      locked: !permissions[SystemTool.WHATSAPP_CHAT],
      active: pathname === '/whatsapp-tools',
    });

    items.push({
      id: 'checklist',
      label: 'Checklist',
      href: '/checklist',
      icon: ClipboardCheck,
      locked: !permissions[SystemTool.CHECKLIST],
      active: Boolean(pathname?.startsWith('/checklist')),
    });

    items.push({
      id: 'etiquetagem',
      label: 'Etiquetagem',
      href: '/etiquetagem',
      icon: Tag,
      locked: !permissions[SystemTool.ETIQUETAGEM],
      active: Boolean(pathname?.startsWith('/etiquetagem')),
    });

    items.push({
      id: 'cmv',
      label: 'CMV',
      href: '/cmv',
      icon: BarChart2,
      locked: !permissions[SystemTool.CMV],
      active: pathname === '/cmv' || Boolean(pathname?.startsWith('/cmv/')),
    });

    if (!cmvRealLoading && canViewCmvReal) {
      items.push({
        id: 'cmv-real',
        label: 'CMV Real',
        href: '/cmv-real/notas',
        icon: BarChart2,
        active: Boolean(pathname?.startsWith('/cmv-real')),
      });
    }

    items.push({
      id: 'estoque',
      label: 'Estoque',
      href: '/estoque',
      icon: Warehouse,
      locked: !permissions[SystemTool.ESTOQUE],
      active: Boolean(pathname?.startsWith('/estoque')),
    });

    items.push({
      id: 'rh',
      label: 'RH',
      href: '/rh',
      icon: Users,
      locked: !permissions[SystemTool.RH],
      active:
        Boolean(pathname?.startsWith('/rh')) ||
        Boolean(pathname?.startsWith('/bonificacao')),
    });

    items.push({
      id: 'pontos',
      label: 'Pontos',
      href: '/pontos',
      icon: Clock,
      locked: !permissions[SystemTool.PONTOS],
      active: Boolean(pathname?.startsWith('/pontos')),
    });

    items.push({
      id: 'tarefas',
      label: 'Tarefas',
      href: '/tarefas',
      icon: ListChecks,
      locked: !permissions[SystemTool.TAREFAS],
      active: Boolean(pathname?.startsWith('/tarefas')),
    });

    items.push({
      id: 'chat',
      label: 'Chat',
      href: '/chat',
      icon: Bot,
      locked: !permissions[SystemTool.CHAT],
      active: Boolean(pathname?.startsWith('/chat')),
    });

    items.push({
      id: 'ifood',
      label: 'iFood',
      icon: ShoppingBag,
      locked: !permissions[SystemTool.IFOOD],
      active: Boolean(pathname?.startsWith('/ifood')),
      children: permissions[SystemTool.IFOOD]
        ? [
            {
              id: 'ifood-config',
              label: 'Configurações',
              href: '/ifood/configuracoes',
              active: pathname === '/ifood/configuracoes',
            },
            {
              id: 'ifood-operacional',
              label: 'Operacional',
              href: '/ifood/operacional',
              active: pathname === '/ifood/operacional',
            },
            {
              id: 'ifood-financeiro',
              label: 'Financeiro',
              href: '/ifood/financeiro',
              active: pathname === '/ifood/financeiro',
            },
            {
              id: 'ifood-cardapio',
              label: 'Cardápio',
              href: '/ifood/cardapio',
              active: pathname === '/ifood/cardapio',
            },
          ]
        : undefined,
    });

    return items;
  }, [
    permissions,
    permissionsLoading,
    pathname,
    canViewCmvReal,
    cmvRealLoading,
  ]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-foreground text-sm">Carregando...</div>
      </div>
    );
  }

  const footer = ({ collapsed }: { collapsed: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={
            collapsed
              ? 'relative h-9 w-9 p-0 text-foreground hover:bg-muted'
              : 'relative h-9 w-full justify-start gap-2 px-2 text-foreground hover:bg-muted'
          }
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.profileImageUrl || '/avatars/01.png'}
              alt={user.displayName || 'User'}
            />
            <AvatarFallback className="bg-accent text-accent-foreground text-xs">
              {user.displayName?.charAt(0)?.toUpperCase() ||
                user.primaryEmail?.charAt(0)?.toUpperCase() ||
                'U'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <span className="truncate text-sm font-medium">
              {user.displayName || 'Usuário'}
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
          {user.displayName || 'Usuário'}
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-muted text-xs text-muted-foreground">
          {user.primaryEmail}
        </DropdownMenuItem>
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
          navItems={navItems}
          navLoading={permissionsLoading}
          footer={footer}
        >
          {children}
        </AppShell>
      </div>
    </AppProvider>
  );
}
