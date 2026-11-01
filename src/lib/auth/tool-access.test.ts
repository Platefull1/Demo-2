import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isOcorrenciasOnlyTools, toolsQualifyForContextAccess } from './tool-access';

describe('isOcorrenciasOnlyTools', () => {
  it('só registrar (membros antigos)', () => {
    assert.equal(isOcorrenciasOnlyTools(['registrar_ocorrencias']), true);
  });

  it('membro novo: registrar + rh do convite continua isolado', () => {
    assert.equal(
      isOcorrenciasOnlyTools(['registrar_ocorrencias', 'rh']),
      true,
    );
  });

  it('com ver ou outra ferramenta operacional não isola', () => {
    assert.equal(
      isOcorrenciasOnlyTools(['registrar_ocorrencias', 'ver_ocorrencias']),
      false,
    );
    assert.equal(
      isOcorrenciasOnlyTools(['registrar_ocorrencias', 'cmv_real']),
      false,
    );
    assert.equal(isOcorrenciasOnlyTools(['rh']), false);
    assert.equal(isOcorrenciasOnlyTools([]), false);
  });
});

describe('toolsQualifyForContextAccess', () => {
  it('rejeita lista vazia', () => {
    assert.equal(toolsQualifyForContextAccess([]), false);
  });

  it('rejeita só registrar_ocorrencias', () => {
    assert.equal(toolsQualifyForContextAccess(['registrar_ocorrencias']), false);
  });

  it('rejeita registrar + rh (mesmo isolamento dos membros novos)', () => {
    assert.equal(
      toolsQualifyForContextAccess(['registrar_ocorrencias', 'rh']),
      false,
    );
  });

  it('aceita ver_ocorrencias, RH sozinho, ou registrar com outra ferramenta', () => {
    assert.equal(toolsQualifyForContextAccess(['ver_ocorrencias']), true);
    assert.equal(toolsQualifyForContextAccess(['rh']), true);
    assert.equal(
      toolsQualifyForContextAccess(['registrar_ocorrencias', 'cmv_real']),
      true,
    );
  });
});
