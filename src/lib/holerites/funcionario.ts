import { prisma } from '@/lib/prisma';
import { limparCpfDigits } from '@/lib/shared/holerites/schemas';

export type PortalFuncionario = {
  id: string;
  userId: string;
  nome: string;
  cpf: string | null;
  telefone: string | null;
  whatsappLid: string | null;
  ativo: boolean;
  dataDemissao: Date | null;
  lojaId: string | null;
  portalStatus: string;
  portalTokenVersion: number;
};

/**
 * Único ponto da regra de acesso ao portal.
 * Hoje: ativo + portal habilitado.
 * Futuro: janela de 90 dias pós-demissão entra aqui.
 */
export function podeAcessarPortal(func: {
  ativo: boolean;
  portalStatus: string;
}): boolean {
  return func.ativo === true && func.portalStatus === 'enabled';
}

function maskCpf(cpf: string): string {
  const d = limparCpfDigits(cpf);
  if (d.length < 4) return '***';
  return `***${d.slice(-4)}`;
}

/** Primeiro dia civil da competência YYYY-MM em UTC date-only. */
export function inicioCompetencia(competencia: string): Date {
  const [y, m] = competencia.split('-').map((x) => parseInt(x, 10));
  return new Date(Date.UTC(y!, m! - 1, 1));
}

/**
 * Escolhe entre candidatos já carregados (testável sem DB).
 * Retorna null se nenhum ou ambíguo.
 */
export function escolherFuncionarioPorCpf(
  candidatos: PortalFuncionario[],
  contexto: 'login' | 'vinculo',
  competencia?: string,
): PortalFuncionario | null {
  if (contexto === 'login') {
    const elegiveis = candidatos.filter((f) => podeAcessarPortal(f));
    if (elegiveis.length === 0) return null;
    if (elegiveis.length > 1) {
      const sample = elegiveis[0]!;
      console.warn(
        `[holerites] CPF ambíguo no login (tenant=${sample.userId}, cpf=${maskCpf(sample.cpf ?? '')}, n=${elegiveis.length}). RH precisa revisar cadastros.`,
      );
      return null;
    }
    return elegiveis[0]!;
  }

  // vínculo de holerite
  const ativos = candidatos.filter((f) => f.ativo);
  if (ativos.length === 1) return ativos[0]!;
  if (ativos.length > 1) return null;

  if (!competencia) return null;
  const inicio = inicioCompetencia(competencia);
  const desligadosNaCompetencia = candidatos.filter((f) => {
    if (f.ativo || !f.dataDemissao) return false;
    // dataDemissao é @db.Date — comparar pelo dia civil
    const dem = new Date(f.dataDemissao);
    const demUtc = Date.UTC(dem.getUTCFullYear(), dem.getUTCMonth(), dem.getUTCDate());
    return demUtc >= inicio.getTime();
  });

  if (desligadosNaCompetencia.length === 1) return desligadosNaCompetencia[0]!;
  return null;
}

export async function resolverFuncionarioPorCpf(
  userId: string,
  cpf: string,
  contexto: 'login' | 'vinculo',
  competencia?: string,
): Promise<PortalFuncionario | null> {
  const digits = limparCpfDigits(cpf);
  if (digits.length !== 11) return null;

  const rows = await prisma.rhFuncionario.findMany({
    where: { userId, cpf: digits },
    select: {
      id: true,
      userId: true,
      nome: true,
      cpf: true,
      telefone: true,
      whatsappLid: true,
      ativo: true,
      dataDemissao: true,
      lojaId: true,
      portalStatus: true,
      portalTokenVersion: true,
    },
  });

  return escolherFuncionarioPorCpf(rows, contexto, competencia);
}
