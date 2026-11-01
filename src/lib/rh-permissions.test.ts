import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_MEMBER_PERMISSIONS,
  P,
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
