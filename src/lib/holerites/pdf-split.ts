import { PDFDocument } from 'pdf-lib';

/** Extrai um subconjunto de páginas (índices 0-based) para um novo PDF. */
export async function extrairPaginasPdf(
  sourcePdf: Buffer | Uint8Array,
  pageIndexes: number[],
): Promise<Uint8Array> {
  if (pageIndexes.length === 0) {
    throw new Error('Nenhuma página para extrair');
  }
  const src = await PDFDocument.load(sourcePdf);
  const total = src.getPageCount();
  for (const idx of pageIndexes) {
    if (idx < 0 || idx >= total) {
      throw new Error(`Índice de página inválido: ${idx} (total ${total})`);
    }
  }
  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, pageIndexes);
  for (const page of copied) out.addPage(page);
  return out.save();
}
