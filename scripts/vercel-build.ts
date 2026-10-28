#!/usr/bin/env tsx
/**
 * Script de build para Vercel
 * Executa prisma generate, db push (se DATABASE_URL estiver configurado) e build
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

function runCommand(command: string, description: string) {
  console.log(`\n📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} concluído!`);
  } catch (error) {
    console.error(`❌ Erro ao executar: ${description}`);
    throw error;
  }
}

async function main() {
  console.log('🚀 Iniciando build para Vercel...\n');

  // 1. Gerar Prisma Client
  runCommand('npm run db:generate', 'Gerando Prisma Client');

  // 2. Generate basta para o build. Schema sobe por migrate deploy, nunca por db push.
  console.log('\n✅ Prisma Client gerado. Pulando qualquer alteração de schema.');

  // 3. Build do Next.js
  runCommand('npm run build', 'Fazendo build do Next.js');

  console.log('\n✅ Build concluído com sucesso!');
}

main().catch((error) => {
  console.error('\n❌ Erro fatal no build:', error);
  process.exit(1);
});

