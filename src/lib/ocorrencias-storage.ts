import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const OCORRENCIAS_BUCKET = 'ocorrencias-fotos';
const SIGNED_URL_TTL = 3600; // 1 hora

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  const fullUrl =
    url.startsWith('http') ? url : `https://${url}.supabase.co`;
  if (!_client) _client = createClient(fullUrl, key);
  return _client;
}

/**
 * Faz upload de um Buffer para o bucket ocorrencias-fotos.
 * Retorna o path interno (sem URL pública) ou lança erro.
 */
export async function uploadOcorrenciaFoto(
  path: string,
  data: Buffer,
  contentType: string,
): Promise<string> {
  const supabase = getClient();
  if (!supabase) throw new Error('Supabase não configurado');

  const { error } = await supabase.storage
    .from(OCORRENCIAS_BUCKET)
    .upload(path, data, { contentType, upsert: false });

  if (error) throw new Error(`Upload falhou: ${error.message}`);
  return path;
}

/**
 * Remove um arquivo do bucket (usado em rollback quando o prisma.create falha).
 */
export async function deleteOcorrenciaFoto(path: string): Promise<boolean> {
  return deleteOcorrenciaFotos([path]);
}

export async function deleteOcorrenciaFotos(paths: string[]): Promise<boolean> {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return true;
  const supabase = getClient();
  if (!supabase) return false;
  const { error } = await supabase.storage.from(OCORRENCIAS_BUCKET).remove(unique);
  return !error;
}

/**
 * Gera uma URL assinada de curta duração (1h) para visualizar a foto.
 */
export async function createOcorrenciaFotoSignedUrl(
  path: string,
): Promise<string | null> {
  const supabase = getClient();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(OCORRENCIAS_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/** Bytes da foto no bucket (para embutir na ata). */
export async function downloadOcorrenciaFotoBytes(
  path: string,
): Promise<Buffer | null> {
  if (!path) return null;
  const supabase = getClient();
  if (!supabase) return null;
  const { data, error } = await supabase.storage.from(OCORRENCIAS_BUCKET).download(path);
  if (error || !data) return null;
  return Buffer.from(await data.arrayBuffer());
}

/** URLs assinadas em lote para a lista (miniaturas). */
export async function createOcorrenciaFotoSignedUrls(
  paths: string[],
): Promise<Record<string, string>> {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return {};

  const supabase = getClient();
  if (!supabase) return {};

  const { data, error } = await supabase.storage
    .from(OCORRENCIAS_BUCKET)
    .createSignedUrls(unique, SIGNED_URL_TTL);

  if (error || !data) return {};

  const map: Record<string, string> = {};
  data.forEach((item, i) => {
    const path = item.path || unique[i];
    if (path && item.signedUrl) map[path] = item.signedUrl;
  });
  return map;
}
