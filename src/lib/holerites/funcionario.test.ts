import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  escolherFuncionarioPorCpf,
  podeAcessarPortal,
  type PortalFuncionario,
} from './funcionario';

function base(over: Partial<PortalFuncionario> & { id: string }): PortalFuncionario {
  return {
    userId: 'tenant-1',
    nome: 'Fulano',
    cpf: '52998224725',
    telefone: '41999998888',
    whatsappLid: null,
    ativo: true,
    dataDemissao: null,
    lojaId: 'loja-1',
    portalStatus: 'enabled',
    portalTokenVersion: 0,
    ...over,
  };
}

describe('podeAcessarPortal', () => {
  it('exige ativo e portal enabled', () => {
    assert.equal(podeAcessarPortal({ ativo: true, portalStatus: 'enabled' }), true);
    assert.equal(podeAcessarPortal({ ativo: false, portalStatus: 'enabled' }), false);
    assert.equal(podeAcessarPortal({ ativo: true, portalStatus: 'disabled' }), false);
  });
});

describe('escolherFuncionarioPorCpf — login', () => {
  it('recontratação: 1 inativo + 1 ativo → login no ativo', () => {
    const escolhido = escolherFuncionarioPorCpf(
      [
        base({ id: 'old', ativo: false, dataDemissao: new Date('2025-01-15'), portalStatus: 'enabled' }),
        base({ id: 'new', ativo: true, portalStatus: 'enabled' }),
      ],
      'login',
    );
    assert.equal(escolhido?.id, 'new');
  });

  it('dois ativos com o mesmo CPF → null (ambíguo)', () => {
    const escolhido = escolherFuncionarioPorCpf(
      [base({ id: 'a' }), base({ id: 'b' })],
      'login',
    );
    assert.equal(escolhido, null);
  });

  it('ativo com portal disabled → null', () => {
    const escolhido = escolherFuncionarioPorCpf(
      [base({ id: 'a', portalStatus: 'disabled' })],
      'login',
    );
    assert.equal(escolhido, null);
  });
});

describe('escolherFuncionarioPorCpf — vinculo', () => {
  it('prioriza ativo quando há recontratação', () => {
    const escolhido = escolherFuncionarioPorCpf(
      [
        base({ id: 'old', ativo: false, dataDemissao: new Date('2026-09-30') }),
        base({ id: 'new', ativo: true }),
      ],
      'vinculo',
      '2026-10',
    );
    assert.equal(escolhido?.id, 'new');
  });

  it('rescisão: desligado com dataDemissao na competência → vincula', () => {
    const escolhido = escolherFuncionarioPorCpf(
      [
        base({
          id: 'res',
          ativo: false,
          dataDemissao: new Date(Date.UTC(2026, 9, 15)),
        }),
      ],
      'vinculo',
      '2026-10',
    );
    assert.equal(escolhido?.id, 'res');
  });

  it('desligado antes da competência → sem vínculo', () => {
    const escolhido = escolherFuncionarioPorCpf(
      [
        base({
          id: 'old',
          ativo: false,
          dataDemissao: new Date(Date.UTC(2026, 8, 30)),
        }),
      ],
      'vinculo',
      '2026-10',
    );
    assert.equal(escolhido, null);
  });

  it('dois ativos → ambíguo (null)', () => {
    const escolhido = escolherFuncionarioPorCpf(
      [base({ id: 'a' }), base({ id: 'b' })],
      'vinculo',
      '2026-10',
    );
    assert.equal(escolhido, null);
  });
});
