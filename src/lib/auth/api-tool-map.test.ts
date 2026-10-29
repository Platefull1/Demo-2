import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SystemTool } from '../../types/admin';
import { matchApiTool } from './api-tool-map';
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
