import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { normalizeSupabaseUrl } from '@/lib/whatsapp-evidence-storage';

export const ATAS_OCORRENCIAS_BUCKET = 'atas-ocorrencias';
const DEFAULT_SIGNED_TTL_SECONDS = 3600;

let supabaseAdmin: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!supabaseAdmin) supabaseAdmin = createClient(url, key);
  return supabaseAdmin;
}

export function ataOcorrenciaPath(
  companyId: string,
  ano: number,
  mes: number,
  slug: string,
): string {
  const ym = `${ano}-${String(mes).padStart(2, '0')}`;
  return `${companyId}/${ym}/${slug}.docx`;
}

export function ataOcorrenciaZipPath(
  companyId: string,
  ano: number,
  mes: number,
): string {
  const ym = `${ano}-${String(mes).padStart(2, '0')}`;
  return `${companyId}/${ym}/lojas.zip`;
}

export function ataOcorrenciaFilename(
  slug: string,
  ano: number,
  mes: number,
): string {
  const ym = `${ano}-${String(mes).padStart(2, '0')}`;
  return `ata-ocorrencias-${slug}-${ym}.docx`;
}

export async function uploadAtaOcorrenciaDocx(
  path: string,
  bytes: Buffer | Uint8Array,
): Promise<{ path: string } | { error: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      error:
        'Supabase não configurado (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).',
    };
  }

  const { error } = await supabase.storage
    .from(ATAS_OCORRENCIAS_BUCKET)
    .upload(path, bytes, {
      contentType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      upsert: true,
    });

  if (error) {
    return { error: mensagemBucket(error.message) };
  }
  return { path };
}

export async function uploadAtaOcorrenciaZip(
  path: string,
  bytes: Buffer | Uint8Array,
): Promise<{ path: string } | { error: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      error:
        'Supabase não configurado (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).',
    };
  }
  const { error } = await supabase.storage.from(ATAS_OCORRENCIAS_BUCKET).upload(path, bytes, {
    contentType: 'application/zip',
    upsert: true,
  });
  if (error) {
    return { error: mensagemBucket(error.message) };
  }
  return { path };
}

export async function createAtaOcorrenciaSignedUrl(
  path: string | null | undefined,
  expiresInSeconds = DEFAULT_SIGNED_TTL_SECONDS,
): Promise<string | null> {
  if (!path?.trim()) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(ATAS_OCORRENCIAS_BUCKET)
    .createSignedUrl(path.trim(), expiresInSeconds);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

function mensagemBucket(raw: string): string {
  const lower = raw.toLowerCase();
  if (
    lower.includes('not found') ||
    lower.includes('does not exist') ||
    lower.includes('bucket') && (lower.includes('404') || lower.includes('not exist'))
  ) {
    return 'Bucket atas-ocorrencias não existe. Crie com: npx tsx scripts/create-atas-ocorrencias-bucket.ts';
  }
  return raw;
}
