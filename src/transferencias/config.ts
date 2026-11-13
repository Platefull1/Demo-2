import { prisma } from '@/lib/prisma';
import { mapBotToDto, resolveStackUserIdsForTenant } from '@/lib/whatsapp-sessions';

export type SessaoWhatsappOpcao = {
  botId: string;
  slot: number;
  label: string;
  isConnected: boolean;
  connectedNumber: string | null;
  stackUserId: string;
};

/**
 * Lista sessões WhatsApp do tenant (dono + equipe RhTeamMember) com botId.
 * Não colapsa por slot: contas diferentes podem ter o mesmo número de slot
 * (ex.: slot 2 em calenzano.ahu vs outra conta).
 */
export async function listarSessoesWhatsappParaConfig(
  tenantUserId: string,
): Promise<SessaoWhatsappOpcao[]> {
  const stackIds = await resolveStackUserIdsForTenant(tenantUserId);
  if (stackIds.length === 0) return [];

  const [bots, stacks] = await Promise.all([
    prisma.whatsAppBot.findMany({
      where: { userId: { in: stackIds } },
      orderBy: [{ slot: 'asc' }, { userId: 'asc' }],
    }),
    prisma.stackUser.findMany({
      where: { id: { in: stackIds } },
      select: { id: true, primaryEmail: true, displayName: true },
    }),
  ]);

  const emailByStack = new Map(
    stacks.map((s) => [
      s.id,
      (s.primaryEmail || s.displayName || s.id.slice(0, 8)).trim(),
    ]),
  );

  return bots.map((bot) => {
    const dto = mapBotToDto(bot);
    const conta = emailByStack.get(bot.userId) || bot.userId.slice(0, 8);
    return {
      botId: bot.id,
      slot: bot.slot,
      label: `Slot ${bot.slot} — ${dto.label} (${conta})`,
      isConnected: dto.isConnected,
      connectedNumber: dto.connectedNumber,
      stackUserId: bot.userId,
    };
  });
}

export async function obterConfigTransferenciasWhatsapp(tenantUserId: string) {
  const user = await prisma.user.findUnique({
    where: { id: tenantUserId },
    select: {
      transferenciasWhatsappBotId: true,
      transferenciasWhatsappBot: {
        select: {
          id: true,
          slot: true,
          label: true,
          isConnected: true,
          connectedNumber: true,
          userId: true,
        },
      },
    },
  });

  const sessoes = await listarSessoesWhatsappParaConfig(tenantUserId);

  return {
    transferenciasWhatsappBotId: user?.transferenciasWhatsappBotId ?? null,
    bot: user?.transferenciasWhatsappBot
      ? {
          botId: user.transferenciasWhatsappBot.id,
          slot: user.transferenciasWhatsappBot.slot,
          label:
            (user.transferenciasWhatsappBot.label || '').trim() ||
            `Sessão ${user.transferenciasWhatsappBot.slot}`,
          isConnected: user.transferenciasWhatsappBot.isConnected,
          connectedNumber: user.transferenciasWhatsappBot.connectedNumber,
          stackUserId: user.transferenciasWhatsappBot.userId,
        }
      : null,
    sessoes,
  };
}

export async function salvarConfigTransferenciasWhatsapp(params: {
  tenantUserId: string;
  botId: string | null;
}) {
  if (params.botId) {
    const stackIds = await resolveStackUserIdsForTenant(params.tenantUserId);
    const bot = await prisma.whatsAppBot.findFirst({
      where: { id: params.botId, userId: { in: stackIds } },
      select: { id: true },
    });
    if (!bot) {
      throw new Error('Sessão WhatsApp não pertence a este tenant');
    }
  }

  await prisma.user.update({
    where: { id: params.tenantUserId },
    data: { transferenciasWhatsappBotId: params.botId },
  });

  return obterConfigTransferenciasWhatsapp(params.tenantUserId);
}
