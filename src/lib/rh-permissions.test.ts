import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_MEMBER_PERMISSIONS,
  P,
  PERMISSION_DESCRIPTIONS,
  PERMISSION_GROUPS,
  PERMISSION_LABELS,
} from './rh-permissions';

describe('tag Registrar ocorrência', () => {
  it('não entra no default do convite', () => {
    assert.equal(
      DEFAULT_MEMBER_PERMISSIONS.includes(P.OCORRENCIAS_REGISTRAR),
      false,
    );
  });

  it('aparece no grupo Ocorrências das permissões do membro', () => {
    const grupo = PERMISSION_GROUPS.find((g) => g.label === 'Ocorrências');
    assert.ok(grupo);
    assert.deepEqual(grupo?.permissions, [P.OCORRENCIAS_REGISTRAR]);
    assert.equal(PERMISSION_LABELS[P.OCORRENCIAS_REGISTRAR], 'Registrar ocorrência');
  });
});

describe('Holerites — permissões', () => {
  it('grupo Holerites com as 5 payslips.* e labels/descrições', () => {
    const grupo = PERMISSION_GROUPS.find((g) => g.label === 'Holerites');
    assert.ok(grupo);
    assert.deepEqual(grupo?.permissions, [
      P.PAYSLIPS_VIEW,
      P.PAYSLIPS_UPLOAD,
      P.PAYSLIPS_PUBLISH,
      P.PAYSLIPS_REVOKE,
      P.PAYSLIPS_PORTAL_MANAGE,
    ]);
    for (const perm of grupo!.permissions) {
      assert.ok(PERMISSION_LABELS[perm], `label ausente: ${perm}`);
      assert.ok(PERMISSION_DESCRIPTIONS[perm], `descrição ausente: ${perm}`);
    }
  });
});
