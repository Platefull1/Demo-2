"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart2,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileBarChart2,
  LayoutDashboard,
  Link2,
  ListChecks,
  Menu,
  MessageSquare,
  Package,
  Receipt,
  ShoppingBag,
  Tag,
  Users,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  navItemIsActive,
  type NavIconName,
  type NavItemDTO,
  type NavSectionDTO,
} from "@/lib/navigation-menu";

const STORAGE_KEY_COLLAPSED = "platefull_sidebar_collapsed";

const NAV_ICONS: Record<NavIconName, LucideIcon> = {
  LayoutDashboard,
  ShoppingBag,
  ListChecks,
  ClipboardCheck,
  AlertTriangle,
  BarChart2,
  Receipt,
  Warehouse,
  Users,
  Clock,
  MessageSquare,
  Bot,
  Link2,
  Package,
  Tag,
  FileBarChart2,
};

export type AppShellFooterContext = {
  collapsed: boolean;
};

export type AppShellProps = {
  children: ReactNode;
  logo: ReactNode;
  logoCollapsed?: ReactNode;
  navSections: NavSectionDTO[];
  footer: ReactNode | ((ctx: AppShellFooterContext) => ReactNode);
};

function readCollapsed(): boolean {
  try {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY_COLLAPSED) === "true";
  } catch {
    return false;
  }
}

function writeCollapsed(value: boolean) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY_COLLAPSED, String(value));
  } catch {
    // ignore quota / private mode
  }
}

const navFocusClass =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function activeItemClass(active?: boolean) {
  return active
    ? "bg-accent text-foreground border-l-2 border-l-primary"
    : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-2 border-l-transparent";
}

function NavItemContent({
  item,
  collapsed,
  pathname,
  onNavigate,
}: {
  item: NavItemDTO;
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = navItemIsActive(pathname, item.match);
  const [open, setOpen] = useState(active);
  const Icon = NAV_ICONS[item.icon];
  const hasChildren = Boolean(item.children?.length);

  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  if (hasChildren) {
    const button = (
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          navFocusClass,
          activeItemClass(active),
          collapsed && "justify-center px-2"
        )}
      >
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left font-medium">{item.label}</span>
            {open ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </>
        )}
      </button>
    );

    return (
      <div>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ) : (
          button
        )}
        {open && !collapsed && item.children && (
          <div className="mt-1 ml-4 space-y-0.5 border-l border-border pl-3">
            {item.children.map((child) => (
              <Link
                key={child.id}
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center rounded-md px-2 py-1.5 text-sm transition-colors",
                  navFocusClass,
                  activeItemClass(pathname === child.href)
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  const link = (
    <Link
      href={item.href ?? "#"}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        navFocusClass,
        activeItemClass(active),
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      {!collapsed && <span className="font-medium">{item.label}</span>}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarNav({
  navSections,
  collapsed,
  pathname,
  onNavigate,
}: {
  navSections: NavSectionDTO[];
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-4">
      {navSections.map((section) => {
        if (section.items.length === 0) return null;
        return (
          <div key={section.id} className="flex flex-col gap-0.5">
            {!collapsed && (
              <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {section.label}
              </p>
            )}
            {section.items.map((item) => (
              <NavItemContent
                key={item.id}
                item={item}
                collapsed={collapsed}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        );
      })}
    </nav>
  );
}

function SidebarChrome({
  logo,
  logoCollapsed,
  navSections,
  footer,
  collapsed,
  pathname,
  onToggleCollapsed,
  onNavigate,
  showCollapseToggle,
}: {
  logo: ReactNode;
  logoCollapsed?: ReactNode;
  navSections: NavSectionDTO[];
  footer: ReactNode | ((ctx: AppShellFooterContext) => ReactNode);
  collapsed: boolean;
  pathname: string;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
  showCollapseToggle?: boolean;
}) {
  const footerNode =
    typeof footer === "function" ? footer({ collapsed }) : footer;

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      <div
        className={cn(
          "shrink-0 border-b border-border px-3",
          collapsed
            ? "flex flex-col items-center gap-1 py-2"
            : "flex h-14 items-center justify-between gap-2"
        )}
      >
        <div className={cn("min-w-0", collapsed && "flex justify-center")}>
          {collapsed ? logoCollapsed ?? logo : logo}
        </div>
        {showCollapseToggle && onToggleCollapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapsed}
            className="text-muted-foreground"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
        <SidebarNav
          navSections={navSections}
          collapsed={collapsed}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </div>

      <div
        className={cn(
          "shrink-0 border-t border-border p-3",
          collapsed && "flex justify-center"
        )}
      >
        {footerNode}
      </div>
    </div>
  );
}

export function AppShell({
  children,
  logo,
  logoCollapsed,
  navSections,
  footer,
}: AppShellProps) {
  const pathname = usePathname() ?? "";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCollapsed(readCollapsed());
    setHydrated(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      writeCollapsed(next);
      return next;
    });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background text-foreground dark">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden md:flex transition-[width] duration-200",
            hydrated && collapsed ? "w-16" : "w-60"
          )}
        >
          <div className="w-full">
            <SidebarChrome
              logo={logo}
              logoCollapsed={logoCollapsed}
              navSections={navSections}
              footer={footer}
              collapsed={hydrated ? collapsed : false}
              pathname={pathname}
              onToggleCollapsed={toggleCollapsed}
              showCollapseToggle
            />
          </div>
        </aside>

        <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-60 p-0 bg-card border-border text-foreground"
            >
              <SidebarChrome
                logo={logo}
                navSections={navSections}
                footer={footer}
                collapsed={false}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex justify-center">{logo}</div>
          <div className="w-8" />
        </div>

        <div
          className={cn(
            "min-h-screen transition-[padding] duration-200",
            hydrated && collapsed ? "md:pl-16" : "md:pl-60"
          )}
        >
          <main className="min-h-screen">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
