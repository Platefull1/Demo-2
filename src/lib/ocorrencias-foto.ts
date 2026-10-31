import sharp from 'sharp';
import { FOTO_FORMATO_NAO_SUPORTADO } from './ocorrencias-clipboard';

export const MAX_FOTO_BYTES = 8 * 1024 * 1024;
export const MAX_OCORRENCIA_FOTOS = 5;
export const MAX_FOTO_PIXELS = 40_000_000;
/** Overhead do multipart além dos arquivos. */
export const MAX_MULTIPART_BYTES = MAX_FOTO_BYTES * MAX_OCORRENCIA_FOTOS + 512_000;

const HEIC_BRANDS = new Set([
  'heic',
  'heix',
  'hevc',
  'hevx',
  'mif1',
  'msf1',
  'heif',
]);

export type ImageKind = 'jpeg' | 'png' | 'webp';

function isHeicBuffer(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  if (buf.toString('ascii', 4, 8) !== 'ftyp') return false;
  return HEIC_BRANDS.has(buf.toString('ascii', 8, 12).toLowerCase());
}

export function detectImageKind(buf: Buffer): ImageKind | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return 'png';
  }
  if (
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'webp';
  }
  return null;
}

export async function processarFotoOcorrencia(
  buf: Buffer,
): Promise<{ ok: true; jpeg: Buffer } | { ok: false; error: string }> {
  if (buf.length > MAX_FOTO_BYTES) {
    return { ok: false, error: 'Foto muito grande. Máximo: 8 MB.' };
  }
  if (isHeicBuffer(buf) || !detectImageKind(buf)) {
    return { ok: false, error: FOTO_FORMATO_NAO_SUPORTADO };
  }
  try {
    const img = sharp(buf, {
      limitInputPixels: MAX_FOTO_PIXELS,
      failOn: 'truncated',
    });
    const meta = await img.metadata();
    const pixels = (meta.width ?? 0) * (meta.height ?? 0);
    if (pixels > MAX_FOTO_PIXELS) {
      return { ok: false, error: 'Imagem grande demais.' };
    }
    const jpeg = await img
      .rotate()
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    return { ok: true, jpeg };
  } catch {
    return {
      ok: false,
      error: 'Não foi possível processar a imagem. Envie JPEG, PNG ou WEBP.',
    };
  }
}

export function fotoPathFor(
  tenantUserId: string,
  ocorrenciaId: string,
  yyyymm: string,
  index = 0,
) {
  const safeTenant = tenantUserId.replace(/[^a-zA-Z0-9_-]/g, '');
  const safeId = ocorrenciaId.replace(/[^a-zA-Z0-9_-]/g, '');
  const safeIndex = Math.max(0, Math.floor(Number(index) || 0));
  return `${safeTenant}/${yyyymm}/${safeId}/${safeIndex}.jpg`;
}

/** Paths de foto, compatível com registros antigos (só fotoPath). */
export function ocorrenciaFotoPaths(
  fotoPath?: string | null,
  fotoPaths?: string[] | null,
): string[] {
  if (fotoPaths && fotoPaths.length > 0) return fotoPaths;
  return fotoPath ? [fotoPath] : [];
}

/** Fotos do destaque: só as escolhidas, se ainda existirem na ocorrência. */
export function fotosDoDestaque(
  todas: string[],
  selecionadas?: string[] | null,
): string[] {
  if (!selecionadas || selecionadas.length === 0) return todas;
  const permitidas = new Set(todas);
  return selecionadas.filter((p) => permitidas.has(p));
}
