import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SystemTool } from '../../types/admin';
import { canAccessToolFromState, canSeeCmvReal } from './can-access-tool';

describe('canAccessToolFromState — Camada 1 só UserToolPermission', () => {
  it('impressao.portao: etiquetagem ligada, o resto negado mesmo se “admin”', () => {
    const enabled = [SystemTool.ETIQUETAGEM];
    const state = {
      stackUserExists: true,
      isActive: true,
      enabledTools: enabled,
    };
    assert.equal(
      canAccessToolFromState({ ...state, tool: SystemTool.ETIQUETAGEM }),
      true,
    );
    assert.equal(canAccessToolFromState({ ...state, tool: SystemTool.CHAT }), false);
    assert.equal(canAccessToolFromState({ ...state, tool: SystemTool.IFOOD }), false);
    assert.equal(canAccessToolFromState({ ...state, tool: SystemTool.RH }), false);
  });

  it('platefull.app com iFood desligado → IFOOD false; CMV_REAL ligada → true', () => {
    const enabled = [SystemTool.CMV_REAL, SystemTool.ESTOQUE, SystemTool.RH];
    const state = {
      stackUserExists: true,
      isActive: true,
      enabledTools: enabled,
    };
    assert.equal(canAccessToolFromState({ ...state, tool: SystemTool.IFOOD }), false);
    assert.equal(canAccessToolFromState({ ...state, tool: SystemTool.CHAT }), false);
    assert.equal(
      canAccessToolFromState({ ...state, tool: SystemTool.CMV_REAL }),
      true,
    );
  });

  it('inativo ou inexistente → false', () => {
    assert.equal(
      canAccessToolFromState({
        stackUserExists: false,
        isActive: true,
        enabledTools: [SystemTool.CHAT],
        tool: SystemTool.CHAT,
      }),
      false,
    );
    assert.equal(
      canAccessToolFromState({
        stackUserExists: true,
        isActive: false,
        enabledTools: [SystemTool.CHAT],
        tool: SystemTool.CHAT,
      }),
      false,
    );
  });

  it('ocorrências não entram sem a tool no painel', () => {
    assert.equal(
      canAccessToolFromState({
        stackUserExists: true,
        isActive: true,
        enabledTools: [SystemTool.RH],
        tool: SystemTool.VER_OCORRENCIAS,
      }),
      false,
    );
  });
});

describe('canSeeCmvReal — Camada 1 AND Camada 2', () => {
  it('dono do tenant precisa da tool mesmo sendo isAdmin', () => {
    assert.equal(
      canSeeCmvReal({
        hasCmvRealTool: false,
        isAdmin: true,
        hasCmvRealVisualizar: true,
        lojaNaoConfigurada: false,
      }),
      false,
    );
    assert.equal(
      canSeeCmvReal({
        hasCmvRealTool: true,
        isAdmin: true,
        hasCmvRealVisualizar: false,
        lojaNaoConfigurada: false,
      }),
      true,
    );
  });

  it('membro com tool e sem granular = sem acesso', () => {
    assert.equal(
      canSeeCmvReal({
        hasCmvRealTool: true,
        isAdmin: false,
        hasCmvRealVisualizar: false,
        lojaNaoConfigurada: false,
      }),
      false,
    );
  });

  it('membro com tool e visualizar = acesso (escopo de loja é outro passo)', () => {
    assert.equal(
      canSeeCmvReal({
        hasCmvRealTool: true,
        isAdmin: false,
        hasCmvRealVisualizar: true,
        lojaNaoConfigurada: false,
      }),
      true,
    );
  });

  it('gerente sem loja configurada não vê', () => {
    assert.equal(
      canSeeCmvReal({
        hasCmvRealTool: true,
        isAdmin: false,
        hasCmvRealVisualizar: true,
        lojaNaoConfigurada: true,
      }),
      false,
    );
  });
});
