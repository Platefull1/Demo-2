/**
 * Gera PDFs sintéticos para testes de ingestão de holerites.
 *
 *   npx tsx tests/helpers/gerar-pdf-sintetico.ts [outPath]
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { TEST_EMPLOYEE_CPF } from '../../src/lib/holerites/test-employee';
import { validarCpfDigits } from '../../src/lib/shared/holerites/schemas';

/** CPF válido que não deve existir no cadastro de teste. */
export const CPF_INEXISTENTE_VALIDO = '52998224725';

function formatCpf(digits: string): string {
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

async function withFont() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const addTextPage = (lines: string[]) => {
    const page = doc.addPage([595, 842]);
    let y = 780;
    for (const line of lines) {
      page.drawText(line, { x: 50, y, size: 12, font, color: rgb(0, 0, 0) });
      y -= 18;
    }
  };
  const addBlankPage = () => {
    doc.addPage([595, 842]);
  };
  return { doc, addTextPage, addBlankPage };
}

/**
 * 4 páginas:
 * 1) CPF teste + líquido
 * 2) continuação SEM CPF (mesmo holerite — só funciona se o “próximo” for o mesmo CPF ou EOF;
 *    aqui a pág.2 repete o CPF do teste para formar o grupo de 2 págs. sem conflitar com a pág.3)
 * 3) CPF válido inexistente
 * 4) em branco (sem texto)
 *
 * Nota: a regra de agrupamento trata [A, null, B] como página do meio sem vínculo.
 * Por isso a pág.2 inclui o CPF do teste (desvio documentado no relatório).
 */
export async function gerarPdfSinteticoHolerites(): Promise<Uint8Array> {
  if (!validarCpfDigits(TEST_EMPLOYEE_CPF)) {
    throw new Error('TEST_EMPLOYEE_CPF inválido');
  }
  if (!validarCpfDigits(CPF_INEXISTENTE_VALIDO)) {
    throw new Error('CPF_INEXISTENTE_VALIDO inválido');
  }

  const { doc, addTextPage, addBlankPage } = await withFont();

  addTextPage([
    'HOLERITE SINTETICO - PAGINA 1',
    `CPF do empregado: ${formatCpf(TEST_EMPLOYEE_CPF)}`,
    'Empresa CNPJ: 11.222.333/0001-81',
    'Liquido a receber 1.234,56',
  ]);

  addTextPage([
    'HOLERITE SINTETICO - PAGINA 2 (continuacao)',
    `CPF: ${formatCpf(TEST_EMPLOYEE_CPF)}`,
    'Proventos e descontos detalhados',
    'Base FGTS 2.000,00',
  ]);

  addTextPage([
    'HOLERITE SINTETICO - PAGINA 3',
    `CPF: ${formatCpf(CPF_INEXISTENTE_VALIDO)}`,
    'Valor liquido 500,00',
  ]);

  addBlankPage();

  return doc.save();
}

/** 2 páginas: CPF só na 1ª — cobre absorção até EOF. */
export async function gerarPdfDuasPaginasCpfSoNaPrimeira(): Promise<Uint8Array> {
  const { doc, addTextPage } = await withFont();
  addTextPage([
    'HOLERITE 2P - PAGINA 1',
    `CPF do empregado: ${formatCpf(TEST_EMPLOYEE_CPF)}`,
    'Liquido a receber 100,00',
  ]);
  addTextPage([
    'HOLERITE 2P - PAGINA 2 (sem CPF)',
    'Continuacao do demonstrativo',
  ]);
  return doc.save();
}

async function main() {
  const out =
    process.argv[2] ??
    resolve('tests/fixtures/holerites-sintetico/lote-4paginas.pdf');
  await mkdir(dirname(out), { recursive: true });
  const bytes = await gerarPdfSinteticoHolerites();
  await writeFile(out, bytes);
  console.log(`PDF sintético escrito em ${out} (${bytes.byteLength} bytes)`);
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith('gerar-pdf-sintetico.ts') ||
    process.argv[1].endsWith('gerar-pdf-sintetico.js'));

if (isDirect) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
