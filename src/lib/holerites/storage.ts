import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Sempre via env — nunca hardcodar "payslips". */
export const PAYSLIPS_BUCKET =
  process.env.SUPABASE_PAYSLIPS_BUCKET?.trim() || 'payslips';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      'Supabase não configurado (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)',
    );
  }
  const fullUrl = url.startsWith('http') ? url : `https://${url}.supabase.co`;
  _client = createClient(fullUrl, key);
  return _client;
}

export async function createPayslipSignedUploadUrl(path: string): Promise<{
  signedUrl: string;
  token: string;
  path: string;
}> {
  const supabase = getClient();
  const { data, error } = await supabase.storage
    .from(PAYSLIPS_BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) {
    throw new Error(error?.message ?? 'Falha ao gerar URL de upload');
  }
  return { signedUrl: data.signedUrl, token: data.token, path: data.path };
}

export async function downloadPayslipObject(path: string): Promise<Buffer> {
  const supabase = getClient();
  const { data, error } = await supabase.storage.from(PAYSLIPS_BUCKET).download(path);
  if (error || !data) {
    throw new Error(error?.message ?? `Falha ao baixar ${path}`);
  }
  const ab = await data.arrayBuffer();
  return Buffer.from(ab);
}

export async function uploadPayslipObject(
  path: string,
  bytes: Buffer | Uint8Array,
): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.storage.from(PAYSLIPS_BUCKET).upload(path, bytes, {
    contentType: 'application/pdf',
    upsert: false,
  });
  if (error) throw new Error(error.message);
}

export async function movePayslipObject(from: string, to: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.storage.from(PAYSLIPS_BUCKET).move(from, to);
  if (error) throw new Error(error.message);
}

export async function removePayslipObjects(paths: string[]): Promise<void> {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return;
  const supabase = getClient();
  const { error } = await supabase.storage.from(PAYSLIPS_BUCKET).remove(unique);
  if (error) throw new Error(error.message);
}

export async function createPayslipSignedReadUrl(
  path: string,
  expiresInSeconds = 300,
): Promise<string> {
  const supabase = getClient();
  const { data, error } = await supabase.storage
    .from(PAYSLIPS_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? 'Falha ao gerar URL assinada');
  }
  return data.signedUrl;
}

/** Lista recursiva de paths no prefixo (auditoria de órfãos). */
export async function listPayslipPathsUnder(prefix: string): Promise<string[]> {
  const supabase = getClient();
  const out: string[] = [];

  async function walk(path: string) {
    const { data, error } = await supabase.storage.from(PAYSLIPS_BUCKET).list(path, {
      limit: 1000,
    });
    if (error) throw new Error(error.message);
    for (const item of data ?? []) {
      const full = path ? `${path}/${item.name}` : item.name;
      if (item.id) out.push(full);
      else await walk(full);
    }
  }

  await walk(prefix.replace(/\/$/, ''));
  return out;
}
