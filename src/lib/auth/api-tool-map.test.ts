import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SystemTool } from '../../types/admin';
import { isCronApiRequest, matchApiTool } from './api-tool-map';
import { canAccessToolFromState } from './can-access-tool';

describe('matchApiTool', () => {
  it('/api/cmv-real não cai no CMV', () => {
    assert.deepEqual(matchApiTool('/api/cmv-real/notas'), {
      type: 'all',
      tool: SystemTool.CMV_REAL,
    });
    assert.deepEqual(matchApiTool('/api/cmv/abc'), {
      type: 'all',
      tool: SystemTool.CMV,
    });
  });

  it('chat, iFood e nfe exigem a tool certa', () => {
    assert.deepEqual(matchApiTool('/api/chat/conversas'), {
      type: 'all',
      tool: SystemTool.CHAT,
    });
    assert.deepEqual(matchApiTool('/api/ifood/merchants'), {
      type: 'all',
      tool: SystemTool.IFOOD,
    });
    assert.deepEqual(matchApiTool('/api/nfe/resumo-diario'), {
      type: 'all',
      tool: SystemTool.CMV_REAL,
    });
  });

  it('auth/cron/ocorrências/ingest não passam pelo mapa', () => {
    assert.equal(matchApiTool('/api/auth/check-tool-permission')?.type, 'skip');
    assert.equal(matchApiTool('/api/cron/ifood-polling')?.type, 'skip');
    assert.equal(matchApiTool('/api/ocorrencias')?.type, 'skip');
    assert.equal(matchApiTool('/api/nfe/ingest')?.type, 'skip');
  });

  it('leitura Saipos fica só login (sem tool); sync exige CONEXOES', () => {
    assert.equal(matchApiTool('/api/saipos/sales'), null);
    assert.equal(matchApiTool('/api/saipos/daily'), null);
    assert.equal(matchApiTool('/api/saipos/aggregate'), null);
    assert.equal(matchApiTool('/api/saipos/vendas'), null);
    assert.deepEqual(matchApiTool('/api/saipos/sync'), {
      type: 'all',
      tool: SystemTool.CONEXOES,
    });
    assert.deepEqual(matchApiTool('/api/saipos/sync-all'), {
      type: 'all',
      tool: SystemTool.CONEXOES,
    });
    assert.deepEqual(matchApiTool('/api/saipos/full-resync'), {
      type: 'all',
      tool: SystemTool.CONEXOES,
    });
    assert.deepEqual(matchApiTool('/api/saipos/sync-manual'), {
      type: 'all',
      tool: SystemTool.CONEXOES,
    });
  });

  it('whatsapp-messages, tipos-avaliacao, client e admin/reports', () => {
    assert.deepEqual(matchApiTool('/api/whatsapp-messages/abc/media'), {
      type: 'all',
      tool: SystemTool.AGENDAMENTO_RELATORIOS,
    });
    assert.deepEqual(matchApiTool('/api/tipos-avaliacao'), {
      type: 'any',
      tools: [SystemTool.RH, SystemTool.BONIFICACAO],
    });
    assert.deepEqual(matchApiTool('/api/client'), {
      type: 'all',
      tool: SystemTool.WHATSAPP_CHAT,
    });
    assert.deepEqual(matchApiTool('/api/client/xyz/config'), {
      type: 'all',
      tool: SystemTool.WHATSAPP_CHAT,
    });
    assert.deepEqual(matchApiTool('/api/admin/reports'), {
      type: 'all',
      tool: SystemTool.AGENDAMENTO_RELATORIOS,
    });
    assert.deepEqual(matchApiTool('/api/admin/reports/abc/toggle'), {
      type: 'all',
      tool: SystemTool.AGENDAMENTO_RELATORIOS,
    });
  });

  it('debug e sync-database não têm skip privilegiado', () => {
    assert.equal(matchApiTool('/api/debug/sales'), null);
    assert.equal(matchApiTool('/api/debug/fix-null-userid'), null);
    assert.equal(matchApiTool('/api/saipos/debug'), null);
    assert.equal(matchApiTool('/api/saipos/raw-debug'), null);
    assert.notEqual(matchApiTool('/api/debug/sales')?.type, 'skip');
    assert.notEqual(matchApiTool('/api/admin/sync-database')?.type, 'skip');
    assert.equal(matchApiTool('/api/admin/sync-database'), null);
    assert.equal(matchApiTool('/api/admin/sync-whatsapp-connections'), null);
  });
});

describe('isCronApiRequest', () => {
  it('aceita x-cron-secret e Bearer iguais a CRON_SECRET', () => {
    const prev = process.env.CRON_SECRET;
    process.env.CRON_SECRET = 'test-cron-secret';
    try {
      assert.equal(
        isCronApiRequest({ get: (n) => (n === 'x-cron-secret' ? 'test-cron-secret' : null) }),
        true,
      );
      assert.equal(
        isCronApiRequest({
          get: (n) => (n === 'authorization' ? 'Bearer test-cron-secret' : null),
        }),
        true,
      );
      assert.equal(
        isCronApiRequest({ get: (n) => (n === 'x-cron-secret' ? 'errado' : null) }),
        false,
      );
    } finally {
      if (prev === undefined) delete process.env.CRON_SECRET;
      else process.env.CRON_SECRET = prev;
    }
  });
});

describe('Camada 1 nas APIs — tool desligada ⇒ 403', () => {
  it('platefull.app com iFood desligado não passa em /api/ifood', () => {
    const gate = matchApiTool('/api/ifood/merchants');
    assert.equal(gate?.type, 'all');
    if (gate?.type !== 'all') return;
    const allowed = canAccessToolFromState({
      stackUserExists: true,
      isActive: true,
      enabledTools: [SystemTool.CMV_REAL, SystemTool.ESTOQUE, SystemTool.RH],
      tool: gate.tool,
    });
    assert.equal(allowed, false);
  });

  it('impressao.portao não passa em /api/chat', () => {
    const gate = matchApiTool('/api/chat/consulta');
    assert.equal(gate?.type, 'all');
    if (gate?.type !== 'all') return;
    const allowed = canAccessToolFromState({
      stackUserExists: true,
      isActive: true,
      enabledTools: [SystemTool.ETIQUETAGEM],
      tool: gate.tool,
    });
    assert.equal(allowed, false);
  });
});
