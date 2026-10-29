import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { canRhDeleteQuinzena } from './rider-quinzena-docs';

describe('canRhDeleteQuinzena', () => {
  it('permite excluir quinzena aguardando documentos e sem envio', () => {
    assert.equal(
      canRhDeleteQuinzena({ status: 'pending_documents', documents: [] }),
      true,
    );
  });

  it('bloqueia se já houver documento enviado', () => {
    assert.equal(
      canRhDeleteQuinzena({
        status: 'pending_documents',
        documents: [{ documentType: 'boleto' }],
      }),
      false,
    );
  });

  it('bloqueia após documentos recebidos, aprovados ou pagos', () => {
    assert.equal(canRhDeleteQuinzena({ status: 'documents_received', documents: [] }), false);
    assert.equal(canRhDeleteQuinzena({ status: 'approved', documents: [] }), false);
    assert.equal(canRhDeleteQuinzena({ status: 'paid', documents: [] }), false);
  });
});
