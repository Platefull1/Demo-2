'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PayslipRowActions } from '@/components/rh/holerites/PayslipRowActions';
import {
  labelCompetencia,
  labelPayslipStatusRh,
  labelPayslipType,
} from '@/lib/shared/holerites/labels';
import { formatDateTimeSp } from '@/lib/holerites/ui-labels';
import type { PayslipType } from '@/lib/shared/holerites/types';

type PortalInfo = {
  status: string;
  lastLoginAt: string | null;
  temWhatsapp: boolean;
};

type Item = {
  id: string;
  competencia: string;
  type: PayslipType;
  status: string;
  isRetificacao: boolean;
  publishedAt: string | null;
  firstViewedAt: string | null;
  acknowledgedAt: string | null;
  funcionario: { id: string; nome: string; temWhatsapp: boolean };
};

export function FuncionarioHoleritesTab({
  funcionarioId,
}: {
  funcionarioId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [portal, setPortal] = useState<PortalInfo | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<
    null | 'revoke_sessions' | 'disable' | 'enable'
  >(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/rh/holerites/funcionarios/${funcionarioId}`);
      if (!res.ok) throw new Error('fail');
      const body = (await res.json()) as {
        portal: PortalInfo;
        items: Item[];
      };
      setPortal(body.portal);
      setItems(body.items);
    } catch {
      setError('Não foi possível carregar os holerites.');
    } finally {
      setLoading(false);
    }
  }, [funcionarioId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function runPortalAction(
    action: 'revoke_sessions' | 'disable' | 'enable',
  ) {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/rh/holerites/funcionarios/${funcionarioId}/portal`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action }),
        },
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error || 'Falha na ação do portal');
        return;
      }
      setConfirm(null);
      await load();
    } catch {
      setError('Falha de conexão');
    } finally {
      setBusy(false);
    }
  }

  if (loading && !portal) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {portal && (
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              Acesso ao portal
            </h3>
            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="text-foreground">
                  {portal.status === 'enabled' ? 'Habilitado' : 'Desabilitado'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Último login</p>
                <p className="text-foreground">
                  {portal.lastLoginAt
                    ? formatDateTimeSp(new Date(portal.lastLoginAt))
                    : 'Nunca acessou'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">WhatsApp válido</p>
                <p className="text-foreground">
                  {portal.temWhatsapp ? 'Sim' : 'Não'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirm('revoke_sessions')}
              >
                Encerrar sessões
              </Button>
              {portal.status === 'enabled' ? (
                <Button
                  variant="destructive"
                  onClick={() => setConfirm('disable')}
                >
                  Desabilitar portal
                </Button>
              ) : (
                <Button onClick={() => setConfirm('enable')}>
                  Habilitar portal
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competência</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Publicado</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-sm text-muted-foreground"
                  >
                    Nenhum holerite para este funcionário.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm text-foreground">
                    {labelCompetencia(item.competencia)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {labelPayslipType(item.type)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary">
                        {labelPayslipStatusRh(item.status as never)}
                      </Badge>
                      {item.isRetificacao && (
                        <Badge variant="outline">Retificação</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.publishedAt
                      ? formatDateTimeSp(new Date(item.publishedAt))
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <PayslipRowActions
                      row={{
                        id: item.id,
                        status: item.status,
                        temWhatsapp: item.funcionario.temWhatsapp,
                      }}
                      onChanged={load}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirm === 'revoke_sessions' && 'Encerrar sessões'}
              {confirm === 'disable' && 'Desabilitar portal'}
              {confirm === 'enable' && 'Habilitar portal'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {confirm === 'revoke_sessions' &&
              'O funcionário vai precisar entrar de novo com o código do WhatsApp.'}
            {confirm === 'disable' &&
              'O funcionário não conseguirá receber código nem usar o portal até ser habilitado de novo.'}
            {confirm === 'enable' &&
              'O funcionário poderá solicitar código e acessar o portal novamente.'}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant={confirm === 'disable' ? 'destructive' : 'default'}
              loading={busy}
              onClick={() => confirm && void runPortalAction(confirm)}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
