import { redirect } from 'next/navigation';

/** Provisório até a etapa 6 (painel por competência). */
export default function HoleritesIndexPage() {
  redirect('/rh/holerites/lotes/novo');
}
