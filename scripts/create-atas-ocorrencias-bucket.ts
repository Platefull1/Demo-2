/**
 * Cria o bucket privado atas-ocorrencias no Supabase.
 *
 *   npx tsx scripts/create-atas-ocorrencias-bucket.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';
import { ATAS_OCORRENCIAS_BUCKET } from '../src/lib/ocorrencias-ata-storage';

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

  if (buckets?.some((b) => b.name === ATAS_OCORRENCIAS_BUCKET)) {
    console.log(`Bucket ${ATAS_OCORRENCIAS_BUCKET} já existe.`);
    return;
  }

  const { error } = await supabase.storage.createBucket(ATAS_OCORRENCIAS_BUCKET, {
    public: false,
    fileSizeLimit: 50 * 1024 * 1024,
  });
  if (error) throw error;
  console.log(`Bucket privado ${ATAS_OCORRENCIAS_BUCKET} criado.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
