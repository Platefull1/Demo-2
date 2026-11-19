import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const PAYSLIPS_BUCKET =
  process.env.SUPABASE_PAYSLIPS_BUCKET?.trim() || 'payslips';

let _client: SupabaseClient | null = null;

function resolveUrl(raw: string): string {
  return raw.startsWith('http') ? raw : `https://${raw}.supabase.co`;
}

/** Client Supabase com service role — só no server. */
export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error('Supabase não configurado (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  }
  _client = createClient(resolveUrl(url), key);
  return _client;
}
