"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Lock,
  Menu,
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

const STORAGE_KEY_COLLAPSED = "platefull_sidebar_collapsed";

export type AppShellNavChild = {
  id: string;
  label: string;
  href: string;
  active?: boolean;
};

export type AppShellNavItem = {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  locked?: boolean;
  active?: boolean;
  children?: AppShellNavChild[];
};

export type AppShellNavSection = {
  id: string;
  label: string;
  items: AppShellNavItem[];
};

export type AppShellFooterContext = {
  collapsed: boolean;
};

export type AppShellProps = {
  children: ReactNode;
  logo: ReactNode;
  logoCollapsed?: ReactNode;
  navSections: AppShellNavSection[];
  footer: ReactNode | ((ctx: AppShellFooterContext) => ReactNode);
  navLoading?: boolean;
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
  onNavigate,
}: {
  item: AppShellNavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(Boolean(item.active));
  const Icon = item.icon;
  const hasChildren = Boolean(item.children?.length);

  useEffect(() => {
    if (item.active) setOpen(true);
  }, [item.active]);

  if (item.locked) {
    const locked = (
      <div
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed border-l-2 border-l-transparent",
          collapsed && "justify-center px-2"
        )}
      >
        <Lock className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        {!collapsed && <span>{item.label}</span>}
      </div>
    );
    if (!collapsed) return locked;
    return (
      <Tooltip>
        <TooltipTrigger asChild>{locked}</TooltipTrigger>
        <TooltipContent side="right">{item.label} (bloqueado)</TooltipContent>
      </Tooltip>
    );
  }

  if (hasChildren) {
    const button = (
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          navFocusClass,
          activeItemClass(item.active),
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
                  activeItemClass(child.active)
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
        activeItemClass(item.active),
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
  navLoading,
  collapsed,
  onNavigate,
}: {
  navSections: AppShellNavSection[];
  navLoading?: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  if (navLoading) {
    return (
      <div className="px-3 py-2 text-sm text-muted-foreground">
        Carregando permissões...
      </div>
    );
  }

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
  navLoading,
  footer,
  collapsed,
  onToggleCollapsed,
  onNavigate,
  showCollapseToggle,
}: {
  logo: ReactNode;
  logoCollapsed?: ReactNode;
  navSections: AppShellNavSection[];
  navLoading?: boolean;
  footer: ReactNode | ((ctx: AppShellFooterContext) => ReactNode);
  collapsed: boolean;
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
          "flex h-14 shrink-0 items-center border-b border-border px-3",
          collapsed ? "justify-center" : "justify-between gap-2"
        )}
      >
        <div className={cn("min-w-0", collapsed && "flex justify-center")}>
          {collapsed ? logoCollapsed ?? logo : logo}
        </div>
        {showCollapseToggle && onToggleCollapsed && !collapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapsed}
            className="text-muted-foreground"
            aria-label="Recolher menu"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
        <SidebarNav
          navSections={navSections}
          navLoading={navLoading}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      </div>

      {showCollapseToggle && onToggleCollapsed && collapsed && (
        <div className="px-2 pb-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapsed}
            className="w-full text-muted-foreground"
            aria-label="Expandir menu"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

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
  navLoading,
}: AppShellProps) {
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
              navLoading={navLoading}
              footer={footer}
              collapsed={hydrated ? collapsed : false}
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
                navLoading={navLoading}
                footer={footer}
                collapsed={false}
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
