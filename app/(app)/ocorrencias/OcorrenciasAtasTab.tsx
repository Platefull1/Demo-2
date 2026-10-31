'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MonthPicker } from '@/components/ui/month-picker';
import { formatOcorrenciaDateTime, saoPauloYmd } from '@/lib/ocorrencias-period';
import { categoriaLabel, TODAS_CATEGORIAS } from '@/lib/ocorrencias-categorias';
import { ESCOPO_REDE, ESCOPO_TODAS_LOJAS } from '@/lib/ocorrencias-ata-data';
import { AlertTriangle, ChevronDown, Download, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type ResumoCat = {
  categoria: string;
  label: string;
  quantidadeLabel: string;
  variacao: string;
};

type LojaResumo = {
  lojaId: string;
  lojaNome: string;
  ocorrencias: number;
  atrasos: number | null;
  total: number;
  resumo: ResumoCat[];
};

type RedeResumo = {
  resumo: ResumoCat[];
  matriz: {
    lojas: { lojaId: string; lojaNome: string; valores: Record<string, number | null>; total: number }[];
    totaisColuna: Record<string, number | null>;
    totalGeral: number;
  };
  rankingLojas: { lojaId: string; lojaNome: string; total: number; ocorrencias: number; atrasos: number | null }[];
  lojasSemAtraso: string[];
};

type HistoricoItem = {
  id: string;
  escopo: string;
  escopoLabel: string;
  geradaPorNome: string;
  geradaEm: string;
};

function qtdCell(v: number | null) {
  return v === null ? '—' : String(v);
}

function variacaoVisual(v: string): { text: string; className: string } {
  if (!v || v === '—') return { text: '—', className: 'text-muted-foreground' };
  if (v === 'estável') return { text: '=', className: 'text-muted-foreground' };
  if (v.startsWith('+') || v === '(novo)') {
    return { text: `▲ ${v}`, className: 'text-destructive' };
  }
  if (v.startsWith('-') || v === '(resolvido)') {
    return { text: `▼ ${v}`, className: 'text-success' };
  }
  return { text: v, className: 'text-muted-foreground' };
}

async function baixarPorId(id: string, formato?: 'pdf' | 'docx') {
  const qs = formato ? `?formato=${formato}` : '';
  const res = await fetch(`/api/ocorrencias/atas/${id}/download${qs}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.url) throw new Error(json.error || 'Falha no download');
  window.location.href = json.url;
  return json.url as string;
}

export function OcorrenciasAtasTab({
  onEditarAtrasos,
  onIrParaOcorrencias,
}: {
  onEditarAtrasos: (ano: number, mes: number) => void;
  onIrParaOcorrencias?: () => void;
}) {
  const hoje = saoPauloYmd();
  const [ano, setAno] = useState(hoje.year);
  const [mes, setMes] = useState(hoje.month);
  const [lojaEscopo, setLojaEscopo] = useState<string>(ESCOPO_REDE);
  const [previa, setPrevia] = useState<{
    periodo: string;
    lojasSemAtraso: string[];
    avisoFotos: string | null;
    destaquesCount: number;
    lojasOpcoes: { id: string; nome: string }[];
    rede: RedeResumo;
    lojas: LojaResumo[];
  } | null>(null);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [pRes, hRes] = await Promise.all([
        fetch(`/api/ocorrencias/atas/previa?ano=${ano}&mes=${mes}&escopo=${lojaEscopo}`),
        fetch(`/api/ocorrencias/atas?ano=${ano}&mes=${mes}`),
      ]);
      const pJson = await pRes.json();
      const hJson = await hRes.json();
      if (!pRes.ok) throw new Error(pJson.error || 'Erro na prévia');
      if (!hRes.ok) throw new Error(hJson.error || 'Erro no histórico');
      setPrevia(pJson);
      setHistorico(hJson.atas ?? []);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível carregar as atas.');
    } finally {
      setCarregando(false);
    }
  }, [ano, mes, lojaEscopo]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  async function gerar(escopo: string, opts?: { baixar?: 'pdf' | 'docx' | 'zip' }) {
    setGerando(true);
    setErro(null);
    try {
      const res = await fetch('/api/ocorrencias/atas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ano, mes, escopo }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Não foi possível gerar a ata');
      if (json.zipUrl && opts?.baixar === 'zip') {
        window.location.href = json.zipUrl;
      } else if (json.ids?.[0]) {
        if (json.previewUrl) setPreviewUrl(json.previewUrl);
        if (opts?.baixar === 'docx') {
          await baixarPorId(json.ids[0], 'docx');
        } else if (opts?.baixar === 'pdf') {
          await baixarPorId(json.ids[0], 'pdf');
        }
      }
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível gerar a ata');
    } finally {
      setGerando(false);
    }
  }

  async function baixarDocxEscopo() {
    const existente = historico.find((h) => h.escopo === lojaEscopo);
    if (existente) {
      setErro(null);
      try {
        await baixarPorId(existente.id, 'docx');
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Não foi possível baixar o .docx');
      }
      return;
    }
    await gerar(lojaEscopo, { baixar: 'docx' });
  }

  function gerarPrincipal() {
    if (lojaEscopo === ESCOPO_TODAS_LOJAS) {
      void gerar(ESCOPO_TODAS_LOJAS, { baixar: 'zip' });
      return;
    }
    void gerar(lojaEscopo, { baixar: 'pdf' });
  }

  const resumoFoco: ResumoCat[] =
    lojaEscopo === ESCOPO_REDE || lojaEscopo === ESCOPO_TODAS_LOJAS
      ? (previa?.rede.resumo ?? [])
      : (previa?.lojas.find((l) => l.lojaId === lojaEscopo)?.resumo ?? []);

  const totalMes =
    lojaEscopo === ESCOPO_REDE || lojaEscopo === ESCOPO_TODAS_LOJAS
      ? (previa?.rede.matriz.totalGeral ?? 0)
      : (previa?.lojas.find((l) => l.lojaId === lojaEscopo)?.total ?? 0);

  const lojasCount = previa?.lojasOpcoes.length ?? 0;
  const atrasosInformados = lojasCount - (previa?.lojasSemAtraso.length ?? 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <MonthPicker
          aria-label="Mês da ata"
          value={`${ano}-${String(mes).padStart(2, '0')}`}
          onChange={(ym) => {
            const [y, m] = ym.split('-').map(Number);
            setAno(y || hoje.year);
            setMes(m || hoje.month);
          }}
        />
        <Select value={lojaEscopo} onValueChange={setLojaEscopo}>
          <SelectTrigger className="h-9 w-48" aria-label="Escopo da ata">
            <SelectValue placeholder="Escopo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ESCOPO_REDE}>Rede</SelectItem>
            {(previa?.lojasOpcoes ?? []).map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.nome}
              </SelectItem>
            ))}
            <SelectSeparator />
            <SelectItem value={ESCOPO_TODAS_LOJAS}>Todas as lojas (.zip)</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto inline-flex">
          <Button
            type="button"
            className="rounded-r-none"
            disabled={gerando}
            loading={gerando}
            onClick={gerarPrincipal}
          >
            <FileDown className="size-4" />
            {lojaEscopo === ESCOPO_TODAS_LOJAS ? 'Gerar atas (.zip)' : 'Gerar ata'}
          </Button>
          {lojaEscopo !== ESCOPO_TODAS_LOJAS && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  className="rounded-l-none border-l border-primary-foreground/20 px-2"
                  disabled={gerando}
                  aria-label="Mais opções de ata"
                >
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={gerarPrincipal}>
                  Baixar PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void baixarDocxEscopo()}>
                  Baixar .docx editável
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {previa?.lojasSemAtraso.length ? (
        <Alert variant="warning" className="flex flex-wrap items-center justify-between gap-3 [&>svg]:static">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-4 shrink-0 text-warning" />
            <AlertDescription className="text-foreground">
              Atrasos não informados: {previa.lojasSemAtraso.join(', ')}
            </AlertDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditarAtrasos(ano, mes)}
          >
            Informar atrasos
          </Button>
        </Alert>
      ) : null}

      {previa?.avisoFotos && (
        <p className="text-sm text-warning">{previa.avisoFotos}</p>
      )}

      {erro && (
        <p className="text-sm text-destructive" role="alert">
          {erro}
        </p>
      )}

      {previewUrl && (
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-base font-semibold">Prévia da ata</h2>
            <p className="text-sm text-muted-foreground">PDF gerado neste mês</p>
          </div>
          <iframe
            title="Prévia da ata em PDF"
            src={previewUrl}
            className="w-full h-[640px] bg-background"
          />
        </div>
      )}

      {carregando ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded" />
          ))}
        </div>
      ) : previa ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-0 rounded-xl border border-border overflow-hidden bg-card">
            {[
              { label: 'Total do mês', value: String(totalMes) },
              { label: 'Destaques', value: String(previa.destaquesCount) },
              {
                label: 'Atrasos informados',
                value: lojasCount ? `${atrasosInformados}/${lojasCount}` : '—',
              },
            ].map((k, i) => (
              <div
                key={k.label}
                className={cn('p-4', i < 2 && 'border-r border-border')}
              >
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-3xl font-semibold tabular-nums text-foreground mt-1">
                  {k.value}
                </p>
              </div>
            ))}
          </div>

          {previa.destaquesCount === 0 && (
            <p className="text-xs text-muted-foreground">
              Nenhuma ocorrência em destaque — marque com ☆ na aba{' '}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-xs"
                onClick={() => onIrParaOcorrencias?.()}
              >
                Ocorrências
              </Button>
              .
            </p>
          )}

          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-base font-semibold">Prévia — {previa.periodo}</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Categoria</TableHead>
                  <TableHead className="text-xs text-right">Quantidade</TableHead>
                  <TableHead className="text-xs text-right">Variação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumoFoco.map((r) => {
                  const v = variacaoVisual(r.variacao);
                  return (
                    <TableRow key={r.categoria} className="hover:bg-transparent">
                      <TableCell className="text-sm py-2">{r.label}</TableCell>
                      <TableCell className="text-sm tabular-nums text-right py-2">
                        {r.quantidadeLabel === 'não informado' ? '—' : r.quantidadeLabel}
                      </TableCell>
                      <TableCell className={cn('text-xs text-right py-2 tabular-nums', v.className)}>
                        {v.text}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {(lojaEscopo === ESCOPO_REDE || lojaEscopo === ESCOPO_TODAS_LOJAS) &&
            previa.rede.matriz.lojas.length > 0 && (
            <div className="rounded-xl border border-border overflow-x-auto bg-card">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-base font-semibold">Loja × categoria</h2>
              </div>
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Loja</TableHead>
                    {TODAS_CATEGORIAS.map((c) => (
                      <TableHead key={c} className="text-xs text-right whitespace-nowrap">
                        {categoriaLabel(c)}
                      </TableHead>
                    ))}
                    <TableHead className="text-xs text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previa.rede.matriz.lojas.map((l) => (
                    <TableRow key={l.lojaId} className="hover:bg-transparent">
                      <TableCell className="text-sm py-2">{l.lojaNome}</TableCell>
                      {TODAS_CATEGORIAS.map((c) => (
                        <TableCell key={c} className="text-sm tabular-nums text-right py-2">
                          {qtdCell(l.valores[c] ?? null)}
                        </TableCell>
                      ))}
                      <TableCell className="text-sm tabular-nums text-right py-2">
                        {l.total}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="hover:bg-transparent bg-muted/40">
                    <TableCell className="text-sm font-semibold py-2">Total</TableCell>
                    {TODAS_CATEGORIAS.map((c) => (
                      <TableCell key={c} className="text-sm font-semibold tabular-nums text-right py-2">
                        {qtdCell(previa.rede.matriz.totaisColuna[c] ?? null)}
                      </TableCell>
                    ))}
                    <TableCell className="text-sm font-semibold tabular-nums text-right py-2">
                      {previa.rede.matriz.totalGeral}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      ) : null}

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-base font-semibold">Histórico</h2>
          <p className="text-sm text-muted-foreground">
            Regenerar substitui a ata do mesmo mês e escopo
          </p>
        </div>
        {historico.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4">
            Nenhuma ata gerada neste mês
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Mês</TableHead>
                <TableHead className="text-xs">Escopo</TableHead>
                <TableHead className="text-xs">Gerada por</TableHead>
                <TableHead className="text-xs">Data/hora</TableHead>
                <TableHead className="text-xs text-right">Arquivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historico.map((h) => (
                <TableRow key={h.id} className="hover:bg-transparent">
                  <TableCell className="text-sm py-2 tabular-nums">
                    {String(mes).padStart(2, '0')}/{ano}
                  </TableCell>
                  <TableCell className="text-sm py-2">{h.escopoLabel}</TableCell>
                  <TableCell className="text-sm py-2">{h.geradaPorNome}</TableCell>
                  <TableCell className="text-xs text-muted-foreground tabular-nums py-2">
                    {formatOcorrenciaDateTime(h.geradaEm)}
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="Baixar ata (PDF)"
                      onClick={() => void baixarPorId(h.id, 'pdf')}
                    >
                      <Download className="size-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
