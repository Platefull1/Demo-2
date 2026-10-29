/**
 * Cria uma vez o bucket privado ocorrencias-fotos no Supabase.
 * Não é chamado no upload.
 *
 *   npx tsx scripts/create-ocorrencias-bucket.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';
import { OCORRENCIAS_BUCKET } from '../src/lib/ocorrencias-storage';

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

  if (buckets?.some((b) => b.name === OCORRENCIAS_BUCKET)) {
    console.log(`Bucket ${OCORRENCIAS_BUCKET} já existe.`);
    return;
  }

  const { error } = await supabase.storage.createBucket(OCORRENCIAS_BUCKET, {
    public: false,
    fileSizeLimit: '8MB',
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  });
  if (error) throw error;
  console.log(`Bucket privado ${OCORRENCIAS_BUCKET} criado.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
