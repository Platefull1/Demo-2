import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { toolsQualifyForContextAccess } from './tool-access';

describe('toolsQualifyForContextAccess', () => {
  it('rejeita lista vazia', () => {
    assert.equal(toolsQualifyForContextAccess([]), false);
  });

  it('rejeita só registrar_ocorrencias', () => {
    assert.equal(toolsQualifyForContextAccess(['registrar_ocorrencias']), false);
  });

  it('aceita ver_ocorrencias, RH, ou registrar junto com outra ferramenta', () => {
    assert.equal(toolsQualifyForContextAccess(['ver_ocorrencias']), true);
    assert.equal(toolsQualifyForContextAccess(['rh']), true);
    assert.equal(
      toolsQualifyForContextAccess(['registrar_ocorrencias', 'rh']),
      true,
    );
  });
});
