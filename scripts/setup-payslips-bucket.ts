/**
 * Cria uma vez o bucket privado `payslips` no Supabase.
 * Não chamar em runtime/upload.
 *
 *   npx tsx scripts/setup-payslips-bucket.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';

const BUCKET = process.env.SUPABASE_PAYSLIPS_BUCKET?.trim() || 'payslips';

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausente');
  }
  const fullUrl = url.startsWith('http') ? url : `https://${url}.supabase.co`;
  const supabase = createClient(fullUrl, key);

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  if (buckets?.some((b) => b.name === BUCKET)) {
    console.log(`Bucket ${BUCKET} já existe.`);
    return;
  }

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: false,
    fileSizeLimit: '30MB',
    allowedMimeTypes: ['application/pdf'],
  });
  if (error) throw error;
  console.log(`Bucket privado ${BUCKET} criado.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
