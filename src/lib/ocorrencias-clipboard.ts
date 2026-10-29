export const FOTO_FORMATO_NAO_SUPORTADO =
  'Formato não suportado. Envie em JPG, PNG ou WEBP.';

export interface ClipboardLike {
  clipboardData?: {
    items?: ArrayLike<{ type: string; getAsFile: () => File | null }>;
  } | null;
}

export function arquivosImagemDaClipboard(e: ClipboardLike): {
  files: File[];
  imageCount: number;
} {
  const items = e.clipboardData?.items;
  if (!items) return { files: [], imageCount: 0 };
  const files: File[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.type.startsWith('image/')) continue;
    const blob = item.getAsFile();
    if (!blob) continue;
    const ext = item.type.split('/')[1] || 'png';
    files.push(new File([blob], `clipboard.${ext}`, { type: blob.type || item.type }));
  }
  return { files, imageCount: files.length };
}

export function isHeicFile(file: { type: string; name: string }): boolean {
  const t = file.type.toLowerCase();
  const n = file.name.toLowerCase();
  return t.includes('heic') || t.includes('heif') || n.endsWith('.heic') || n.endsWith('.heif');
}

export function isImageFile(file: { type: string; name: string }): boolean {
  if (isHeicFile(file)) return false;
  if (file.type.startsWith('image/')) return true;
  return /\.(jpe?g|png|webp)$/i.test(file.name);
}
