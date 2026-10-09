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
  LayoutDashboard,
  Receipt,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { AppProvider } from '@/contexts/app-context';
import { useToolPermissions } from '@/hooks/useToolPermissions';
import { useCmvRealAccess } from '@/hooks/useCmvRealAccess';
import { SystemTool } from '@/types/admin';
import {
  AppShell,
  type AppShellNavItem,
  type AppShellNavSection,
} from '@/components/layout/AppShell';

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
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

  const navSections = useMemo<AppShellNavSection[]>(() => {
    if (permissionsLoading) return [];

    const item = (partial: AppShellNavItem): AppShellNavItem => partial;

    const geral: AppShellNavItem[] = [
      item({
        id: 'visao-geral',
        label: 'Visão geral',
        href: '/dashboard',
        icon: LayoutDashboard,
        active: pathname === '/dashboard',
      }),
    ];

    const operacao: AppShellNavItem[] = [
      item({
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
      }),
      item({
        id: 'tarefas',
        label: 'Tarefas',
        href: '/tarefas',
        icon: ListChecks,
        locked: !permissions[SystemTool.TAREFAS],
        active: Boolean(pathname?.startsWith('/tarefas')),
      }),
      item({
        id: 'checklist',
        label: 'Checklist',
        href: '/checklist',
        icon: ClipboardCheck,
        locked: !permissions[SystemTool.CHECKLIST],
        active: Boolean(pathname?.startsWith('/checklist')),
      }),
    ];

    const financeiro: AppShellNavItem[] = [
      item({
        id: 'cmv',
        label: 'CMV',
        href: '/cmv',
        icon: BarChart2,
        locked: !permissions[SystemTool.CMV],
        active: pathname === '/cmv' || Boolean(pathname?.startsWith('/cmv/')),
      }),
    ];

    if (!cmvRealLoading && canViewCmvReal) {
      financeiro.push(
        item({
          id: 'cmv-real',
          label: 'CMV Real',
          href: '/cmv-real/notas',
          icon: Receipt,
          active: Boolean(pathname?.startsWith('/cmv-real')),
        })
      );
    }

    financeiro.push(
      item({
        id: 'estoque',
        label: 'Estoque',
        href: '/estoque',
        icon: Warehouse,
        locked: !permissions[SystemTool.ESTOQUE],
        active: Boolean(pathname?.startsWith('/estoque')),
      })
    );

    const pessoas: AppShellNavItem[] = [
      item({
        id: 'rh',
        label: 'RH',
        href: '/rh',
        icon: Users,
        locked: !permissions[SystemTool.RH],
        active:
          Boolean(pathname?.startsWith('/rh')) ||
          Boolean(pathname?.startsWith('/bonificacao')),
      }),
      item({
        id: 'pontos',
        label: 'Pontos',
        href: '/pontos',
        icon: Clock,
        locked: !permissions[SystemTool.PONTOS],
        active: Boolean(pathname?.startsWith('/pontos')),
      }),
    ];

    const comunicacao: AppShellNavItem[] = [
      item({
        id: 'whatsapp',
        label: 'WhatsApp Chat',
        href: '/whatsapp-tools',
        icon: MessageSquare,
        locked: !permissions[SystemTool.WHATSAPP_CHAT],
        active:
          pathname === '/whatsapp-tools' ||
          Boolean(pathname?.startsWith('/whatsapp-config')),
      }),
      item({
        id: 'chat',
        label: 'Chat',
        href: '/chat',
        icon: Bot,
        locked: !permissions[SystemTool.CHAT],
        active: Boolean(pathname?.startsWith('/chat')),
      }),
    ];

    const configuracoes: AppShellNavItem[] = [
      item({
        id: 'conexoes',
        label: 'Conexões',
        href: '/connections',
        icon: Link2,
        locked: !permissions[SystemTool.CONEXOES],
        active: pathname === '/connections',
      }),
      item({
        id: 'produtos',
        label: 'Produtos',
        href: '/produtos',
        icon: Package,
        locked: !permissions[SystemTool.PRODUTOS],
        active: pathname === '/produtos',
      }),
      item({
        id: 'etiquetagem',
        label: 'Etiquetagem',
        href: '/etiquetagem',
        icon: Tag,
        locked: !permissions[SystemTool.ETIQUETAGEM],
        active: Boolean(pathname?.startsWith('/etiquetagem')),
      }),
      item({
        id: 'relatorios',
        label: 'Central de Relatórios',
        href: '/relatorios',
        icon: FileBarChart2,
        locked: !permissions[SystemTool.AGENDAMENTO_RELATORIOS],
        active:
          pathname === '/relatorios' ||
          Boolean(pathname?.startsWith('/relatorios/')),
      }),
    ];

    return [
      { id: 'geral', label: 'Geral', items: geral },
      { id: 'operacao', label: 'Operação', items: operacao },
      { id: 'financeiro', label: 'Financeiro', items: financeiro },
      { id: 'pessoas', label: 'Pessoas', items: pessoas },
      { id: 'comunicacao', label: 'Comunicação', items: comunicacao },
      { id: 'configuracoes', label: 'Configurações', items: configuracoes },
    ];
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
          navLoading={permissionsLoading}
          footer={footer}
        >
          {children}
        </AppShell>
      </div>
    </AppProvider>
  );
}
