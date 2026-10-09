"use client";

import * as React from "react";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ColumnMeta = {
  headerClassName?: string;
  cellClassName?: string;
};

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  getRowHref?: (row: TData) => string;
  /** Colunas acima do Link da linha (ex.: menu de ações). */
  interactiveColumnIds?: string[];
  emptyState?: React.ReactNode;
  loading?: boolean;
  pageSize?: number;
  initialSorting?: SortingState;
  /** Lista compacta abaixo de md. */
  renderMobileRow?: (row: TData) => React.ReactNode;
  className?: string;
};

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <ArrowUp className="size-3.5" />;
  if (sorted === "desc") return <ArrowDown className="size-3.5" />;
  return <ArrowUpDown className="size-3.5 opacity-50" />;
}

function metaOf(def: { meta?: unknown }): ColumnMeta {
  return (def.meta as ColumnMeta) ?? {};
}

export function DataTable<TData>({
  columns,
  data,
  getRowHref,
  interactiveColumnIds = ["actions"],
  emptyState,
  loading = false,
  pageSize = 50,
  initialSorting = [],
  renderMobileRow,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  });

  React.useEffect(() => {
    table.setPageIndex(0);
    // Reset só quando os dados mudam (filtro/busca/reload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const rows = table.getRowModel().rows;
  const total = data.length;

  if (loading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="hidden md:block rounded-md border border-border overflow-hidden">
          <div className="border-b border-border px-3 py-2.5 flex gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-16" />
            ))}
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 border-b border-border last:border-0 px-3 py-3"
            >
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-4 flex-1 max-w-[200px]" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24 ml-auto" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
        <div className="md:hidden space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md border border-border px-3 py-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className={cn("py-12", className)}>
        {emptyState ?? (
          <p className="text-sm text-muted-foreground">Nenhum registro.</p>
        )}
      </div>
    );
  }

  const pagination =
    pageCount > 1 ? (
      <div className="flex items-center justify-between gap-3 pt-3">
        <p className="text-xs text-muted-foreground tabular-nums">
          {pageIndex * pageSize + 1}–
          {Math.min((pageIndex + 1) * pageSize, total)} de {total}
        </p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums px-2">
            {pageIndex + 1} / {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            aria-label="Próxima página"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    ) : null;

  return (
    <div className={cn("space-y-0", className)}>
      <div
        className={cn(
          "rounded-md border border-border overflow-hidden",
          renderMobileRow && "hidden md:block"
        )}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const meta = metaOf(header.column.columnDef);
                  return (
                    <TableHead key={header.id} className={meta.headerClassName}>
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <SortIcon sorted={header.column.getIsSorted()} />
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const href = getRowHref?.(row.original);
              return (
                <TableRow key={row.id} className={cn(href && "group/row")}>
                  {row.getVisibleCells().map((cell, cellIndex) => {
                    const interactive = interactiveColumnIds.includes(
                      cell.column.id
                    );
                    const meta = metaOf(cell.column.columnDef);
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "relative",
                          interactive && "z-10",
                          meta.cellClassName
                        )}
                      >
                        {!interactive && href ? (
                          <Link
                            href={href}
                            className="absolute inset-0 z-0"
                            aria-label={
                              cellIndex === 0 ? "Abrir registro" : undefined
                            }
                            tabIndex={cellIndex === 0 ? undefined : -1}
                            aria-hidden={cellIndex === 0 ? undefined : true}
                          />
                        ) : null}
                        <div
                          className={cn(
                            "relative",
                            !interactive && href && "z-[1] pointer-events-none"
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {renderMobileRow ? (
        <ul className="md:hidden divide-y divide-border rounded-md border border-border overflow-hidden">
          {rows.map((row) => {
            const href = getRowHref?.(row.original);
            const content = renderMobileRow(row.original);
            return (
              <li key={row.id} className="relative bg-card">
                {href ? (
                  <Link
                    href={href}
                    className="block px-3 py-3 hover:bg-muted/50 transition-colors pr-12"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="px-3 py-3 pr-12">{content}</div>
                )}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10">
                  {row
                    .getVisibleCells()
                    .filter((c) => interactiveColumnIds.includes(c.column.id))
                    .map((cell) => (
                      <React.Fragment key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {pagination}
    </div>
  );
}
