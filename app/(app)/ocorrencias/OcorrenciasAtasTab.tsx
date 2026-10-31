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
import { formatOcorrenciaDateTime, monthYearLabelSP, saoPauloYmd } from '@/lib/ocorrencias-period';
import { categoriaLabel, TODAS_CATEGORIAS } from '@/lib/ocorrencias-categorias';
import { ESCOPO_REDE, ESCOPO_TODAS_LOJAS } from '@/lib/ocorrencias-ata-data';
import { Download } from 'lucide-react';

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
  return v === null ? 'não informado' : String(v);
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
}: {
  onEditarAtrasos: (ano: number, mes: number) => void;
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

  const resumoFoco: ResumoCat[] =
    lojaEscopo === ESCOPO_REDE || lojaEscopo === ESCOPO_TODAS_LOJAS
      ? (previa?.rede.resumo ?? [])
      : (previa?.lojas.find((l) => l.lojaId === lojaEscopo)?.resumo ?? []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Mês da ata"
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {new Date(2026, m - 1, 1).toLocaleString('pt-BR', { month: 'long' })}
            </option>
          ))}
        </select>
        <select
          aria-label="Ano da ata"
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
        >
          {Array.from({ length: 6 }, (_, i) => hoje.year - 2 + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          aria-label="Escopo da ata"
          value={lojaEscopo}
          onChange={(e) => setLojaEscopo(e.target.value)}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm min-w-[160px]"
        >
          <option value={ESCOPO_REDE}>Rede</option>
          {(previa?.lojasOpcoes ?? []).map((l) => (
            <option key={l.id} value={l.id}>
              {l.nome}
            </option>
          ))}
        </select>
        <p className="text-sm text-muted-foreground">
          {monthYearLabelSP(ano, mes)}
        </p>
      </div>

      {previa?.lojasSemAtraso.length ? (
        <div className="rounded-lg border border-border bg-card px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-foreground">
            Atrasos não informados: {previa.lojasSemAtraso.join(', ')}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditarAtrasos(ano, mes)}
          >
            Informar atrasos
          </Button>
        </div>
      ) : null}

      {previa?.avisoFotos && (
        <p className="text-sm text-warning">{previa.avisoFotos}</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="sm"
          disabled={gerando}
          onClick={() => void gerar(lojaEscopo, { baixar: 'pdf' })}
        >
          Gerar ata (PDF)
        </Button>
        <button
          type="button"
          disabled={gerando}
          onClick={() => void baixarDocxEscopo()}
          className="text-xs text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50"
        >
          Baixar .docx editável
        </button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={gerando}
          onClick={() => void gerar(ESCOPO_TODAS_LOJAS, { baixar: 'zip' })}
        >
          Gerar atas por loja (zip)
        </Button>
      </div>

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
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-base font-semibold">Prévia — {previa.periodo}</h2>
              <p className="text-sm text-muted-foreground">
                {previa.destaquesCount} ocorrência(s) em destaque
              </p>
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
                {resumoFoco.map((r) => (
                  <TableRow key={r.categoria} className="hover:bg-transparent">
                    <TableCell className="text-sm py-2">{r.label}</TableCell>
                    <TableCell className="text-sm tabular-nums text-right py-2">
                      {r.quantidadeLabel}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground text-right py-2">
                      {r.variacao}
                    </TableCell>
                  </TableRow>
                ))}
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
                <TableHeader>
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
                <TableHead className="text-xs">Escopo</TableHead>
                <TableHead className="text-xs">Gerada por</TableHead>
                <TableHead className="text-xs">Data/hora</TableHead>
                <TableHead className="text-xs text-right">Arquivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historico.map((h) => (
                <TableRow key={h.id} className="hover:bg-transparent">
                  <TableCell className="text-sm py-2">{h.escopoLabel}</TableCell>
                  <TableCell className="text-sm py-2">{h.geradaPorNome}</TableCell>
                  <TableCell className="text-xs text-muted-foreground tabular-nums py-2">
                    {formatOcorrenciaDateTime(h.geradaEm)}
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => void baixarPorId(h.id, 'pdf')}
                      >
                        <Download className="size-3.5" />
                        Baixar ata (PDF)
                      </Button>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                        onClick={() => void baixarPorId(h.id, 'docx')}
                      >
                        .docx
                      </button>
                    </div>
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
