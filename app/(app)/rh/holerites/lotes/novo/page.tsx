'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUp, Loader2, RotateCcw, X } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MonthPicker } from '@/components/ui/month-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/app-context';
import { addMonthsYm, todayYmd, ymFromYmd } from '@/lib/date-ymd';
import { labelPayslipType } from '@/lib/shared/holerites/labels';
import type { PayslipType } from '@/lib/shared/holerites/types';
import { MAX_FILE_BYTES, MAX_FILES } from '@/lib/holerites/api-schemas';
import { cn } from '@/lib/utils';

const TYPES: PayslipType[] = [
  'MENSAL',
  'ADIANTAMENTO',
  'DECIMO_TERCEIRO_1',
  'DECIMO_TERCEIRO_2',
  'FERIAS',
  'RESCISAO',
];

type FileState = {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
  path?: string;
  signedUrl?: string;
  token?: string;
};

function defaultCompetencia(): string {
  return addMonthsYm(ymFromYmd(todayYmd()), -1);
}

async function uploadWithProgress(
  file: File,
  signedUrl: string,
  token: string,
  onProgress: (pct: number) => void,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedUrl);
    xhr.setRequestHeader('Content-Type', 'application/pdf');
    xhr.setRequestHeader('x-upsert', 'false');
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        onProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload HTTP ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error('Falha de rede no upload'));
    xhr.send(file);
  });
}

export default function NovoLoteHoleritesPage() {
  const router = useRouter();
  const { addToast } = useApp();
  const [competencia, setCompetencia] = useState(defaultCompetencia);
  const [type, setType] = useState<PayslipType>('MENSAL');
  const [files, setFiles] = useState<FileState[]>([]);
  const [phase, setPhase] = useState<'idle' | 'creating' | 'uploading' | 'processing'>(
    'idle',
  );
  const [dragOver, setDragOver] = useState(false);
  const busy = phase !== 'idle';

  const validateAndAdd = useCallback(
    (incoming: File[]) => {
      const errors: string[] = [];
      const accepted: File[] = [];
      const current = files.length;

      for (const f of incoming) {
        if (!f.name.toLowerCase().endsWith('.pdf')) {
          errors.push(`${f.name}: apenas .pdf`);
          continue;
        }
        if (f.size > MAX_FILE_BYTES) {
          errors.push(`${f.name}: máximo 30 MB`);
          continue;
        }
        if (f.size <= 0) {
          errors.push(`${f.name}: arquivo vazio`);
          continue;
        }
        accepted.push(f);
      }

      if (current + accepted.length > MAX_FILES) {
        errors.push(`Máximo de ${MAX_FILES} arquivos por lote`);
        const room = Math.max(0, MAX_FILES - current);
        accepted.splice(room);
      }

      if (errors.length) addToast(errors.join(' · '), 'error');
      if (accepted.length) {
        setFiles((prev) => [
          ...prev,
          ...accepted.map((file) => ({
            file,
            progress: 0,
            status: 'pending' as const,
          })),
        ]);
      }
    },
    [files.length, addToast],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (busy) return;
    validateAndAdd(Array.from(e.dataTransfer.files));
  };

  const removeFile = (idx: number) => {
    if (busy) return;
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const retryUpload = async (idx: number) => {
    const item = files[idx];
    if (!item?.signedUrl || !item.token) return;
    setFiles((prev) =>
      prev.map((f, i) =>
        i === idx ? { ...f, status: 'uploading', progress: 0, error: undefined } : f,
      ),
    );
    try {
      await uploadWithProgress(item.file, item.signedUrl, item.token, (pct) => {
        setFiles((prev) =>
          prev.map((f, i) => (i === idx ? { ...f, progress: pct } : f)),
        );
      });
      setFiles((prev) =>
        prev.map((f, i) =>
          i === idx ? { ...f, status: 'done', progress: 100 } : f,
        ),
      );
    } catch (err) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === idx
            ? {
                ...f,
                status: 'error',
                error: err instanceof Error ? err.message : 'Falha no upload',
              }
            : f,
        ),
      );
    }
  };

  const canSubmit = files.length > 0 && !busy;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setPhase('creating');
    try {
      const createRes = await fetch('/api/rh/holerites/lotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competencia,
          type,
          files: files.map((f) => ({
            name: f.file.name,
            sizeBytes: f.file.size,
          })),
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) {
        addToast(createData.error ?? 'Falha ao criar lote', 'error');
        setPhase('idle');
        return;
      }

      const { batchId, uploads } = createData as {
        batchId: string;
        uploads: Array<{ name: string; path: string; signedUrl: string; token: string }>;
      };

      setFiles((prev) =>
        prev.map((f) => {
          const u = uploads.find((x) => x.name === f.file.name);
          return {
            ...f,
            path: u?.path,
            signedUrl: u?.signedUrl,
            token: u?.token,
            status: 'uploading' as const,
            progress: 0,
          };
        }),
      );
      setPhase('uploading');

      const nextFiles = [...files];
      for (let i = 0; i < nextFiles.length; i++) {
        const u = uploads[i];
        if (!u) continue;
        nextFiles[i] = {
          ...nextFiles[i]!,
          path: u.path,
          signedUrl: u.signedUrl,
          token: u.token,
          status: 'uploading',
          progress: 0,
        };
        setFiles([...nextFiles]);
        try {
          await uploadWithProgress(nextFiles[i]!.file, u.signedUrl, u.token, (pct) => {
            setFiles((prev) =>
              prev.map((f, j) => (j === i ? { ...f, progress: pct } : f)),
            );
          });
          nextFiles[i] = { ...nextFiles[i]!, status: 'done', progress: 100 };
          setFiles([...nextFiles]);
        } catch (err) {
          nextFiles[i] = {
            ...nextFiles[i]!,
            status: 'error',
            error: err instanceof Error ? err.message : 'Falha no upload',
          };
          setFiles([...nextFiles]);
          addToast(`Falha no upload de ${nextFiles[i]!.file.name}. Tente de novo.`, 'error');
          setPhase('idle');
          return;
        }
      }

      setPhase('processing');
      const procRes = await fetch(`/api/rh/holerites/lotes/${batchId}/processar`, {
        method: 'POST',
      });
      const procData = await procRes.json().catch(() => ({}));
      if (!procRes.ok) {
        addToast(procData.error ?? 'Falha ao processar', 'error');
        setPhase('idle');
        router.push(`/rh/holerites/lotes/${batchId}`);
        return;
      }

      addToast('Holerites separados. Conferência pronta.', 'success');
      router.push(`/rh/holerites/lotes/${batchId}`);
    } catch {
      addToast('Erro de comunicação', 'error');
      setPhase('idle');
    }
  };

  const phaseLabel = useMemo(() => {
    if (phase === 'creating') return 'Criando lote…';
    if (phase === 'uploading') return 'Enviando PDFs…';
    if (phase === 'processing') return 'Separando holerites…';
    return null;
  }, [phase]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Novo lote de holerites"
        description="Envie os PDFs da contabilidade. O sistema separa por CPF e prepara a conferência."
      />

      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="competencia">Competência</Label>
              <MonthPicker
                id="competencia"
                value={competencia}
                onChange={setCompetencia}
                disabled={busy}
                aria-label="Competência"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as PayslipType)}
                disabled={busy}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {labelPayslipType(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={cn(
              'rounded-md border border-dashed border-border p-8 text-center transition-colors',
              dragOver && 'border-primary bg-accent/40',
              busy && 'opacity-60 pointer-events-none',
            )}
          >
            <FileUp className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-foreground">
              Arraste PDFs aqui ou{' '}
              <label className="text-primary underline cursor-pointer">
                escolha arquivos
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  multiple
                  className="sr-only"
                  disabled={busy}
                  onChange={(e) => {
                    validateAndAdd(Array.from(e.target.files ?? []));
                    e.target.value = '';
                  }}
                />
              </label>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Até {MAX_FILES} arquivos · máx. 30 MB cada · apenas PDF
            </p>
          </div>

          {files.length > 0 ? (
            <ul className="space-y-3">
              {files.map((f, idx) => (
                <li
                  key={`${f.file.name}-${idx}`}
                  className="rounded-md border border-border p-3 space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{f.file.name}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {(f.file.size / (1024 * 1024)).toFixed(2)} MB
                        {f.error ? ` · ${f.error}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {f.status === 'error' ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => retryUpload(idx)}
                        >
                          <RotateCcw className="size-4" />
                          Tentar de novo
                        </Button>
                      ) : null}
                      {!busy ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(idx)}
                          aria-label="Remover arquivo"
                        >
                          <X className="size-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  {(f.status === 'uploading' || f.status === 'done') && (
                    <Progress value={f.progress} className="h-1.5" />
                  )}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              disabled={!canSubmit}
              loading={busy}
              onClick={handleSubmit}
            >
              {busy ? phaseLabel : 'Enviar e processar'}
            </Button>
            {phase === 'processing' ? (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Separando holerites…
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
