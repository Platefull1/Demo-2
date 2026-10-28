/**
 * Testes do menu: item sem permissão não entra; seção vazia some.
 * Rodar: npx tsx --test src/lib/navigation.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SystemTool } from '../types/admin';
import { buildNavSections, navItemIsActive } from './navigation-menu';

function hasTools(...tools: SystemTool[]) {
  const set = new Set(tools);
  return (tool: SystemTool) => set.has(tool);
}

function itemIds(sections: ReturnType<typeof buildNavSections>) {
  return sections.flatMap((s) => s.items.map((i) => i.id));
}

function sectionIds(sections: ReturnType<typeof buildNavSections>) {
  return sections.map((s) => s.id);
}

describe('buildNavSections', () => {
  it('sempre inclui Visão geral', () => {
    const nav = buildNavSections({ hasTool: () => false, canViewCmvReal: false });
    assert.deepEqual(itemIds(nav), ['visao-geral']);
    assert.deepEqual(sectionIds(nav), ['geral']);
  });

  it('não renderiza Tarefas quando TAREFAS está desligado (marketing01)', () => {
    const nav = buildNavSections({
      hasTool: hasTools(
        SystemTool.IFOOD,
        SystemTool.CHECKLIST,
        SystemTool.CMV,
        SystemTool.RH,
      ),
      canViewCmvReal: false,
    });
    assert.equal(itemIds(nav).includes('tarefas'), false);
  });

  it('renderiza Tarefas quando TAREFAS está ligado', () => {
    const nav = buildNavSections({
      hasTool: hasTools(SystemTool.TAREFAS),
      canViewCmvReal: false,
    });
    assert.equal(itemIds(nav).includes('tarefas'), true);
  });

  it('omite iFood inteiro (sem subitens) se IFOOD estiver desligado', () => {
    const nav = buildNavSections({
      hasTool: hasTools(SystemTool.TAREFAS),
      canViewCmvReal: false,
    });
    assert.equal(itemIds(nav).includes('ifood'), false);
  });

  it('iFood entra com os 4 subitens quando IFOOD está ligado', () => {
    const nav = buildNavSections({
      hasTool: hasTools(SystemTool.IFOOD),
      canViewCmvReal: false,
    });
    const ifood = nav.flatMap((s) => s.items).find((i) => i.id === 'ifood');
    assert.ok(ifood);
    assert.deepEqual(
      ifood?.children?.map((c) => c.id),
      ['ifood-config', 'ifood-operacional', 'ifood-financeiro', 'ifood-cardapio'],
    );
  });

  it('seção vazia some (Pessoas some sem RH nem Pontos)', () => {
    const nav = buildNavSections({
      hasTool: hasTools(SystemTool.TAREFAS),
      canViewCmvReal: false,
    });
    assert.equal(sectionIds(nav).includes('pessoas'), false);
    assert.equal(sectionIds(nav).includes('operacao'), true);
  });

  it('CMV Real só aparece com canViewCmvReal, independente de CMV', () => {
    const sem = buildNavSections({
      hasTool: hasTools(SystemTool.CMV),
      canViewCmvReal: false,
    });
    assert.equal(itemIds(sem).includes('cmv-real'), false);
    assert.equal(itemIds(sem).includes('cmv'), true);

    const com = buildNavSections({
      hasTool: () => false,
      canViewCmvReal: true,
    });
    assert.equal(itemIds(com).includes('cmv-real'), true);
    assert.equal(itemIds(com).includes('cmv'), false);
  });

  it('ocorrências: link de lista se VER; senão /ocorrencias/nova', () => {
    const ver = buildNavSections({
      hasTool: hasTools(SystemTool.VER_OCORRENCIAS),
      canViewCmvReal: false,
    });
    assert.equal(
      ver.flatMap((s) => s.items).find((i) => i.id === 'ocorrencias')?.href,
      '/ocorrencias',
    );

    const registrar = buildNavSections({
      hasTool: hasTools(SystemTool.REGISTRAR_OCORRENCIAS),
      canViewCmvReal: false,
    });
    assert.equal(
      registrar.flatMap((s) => s.items).find((i) => i.id === 'ocorrencias')?.href,
      '/ocorrencias/nova',
    );
  });

  it('admin do tenant (todas as tools) vê o menu completo', () => {
    const nav = buildNavSections({
      hasTool: () => true,
      canViewCmvReal: true,
    });
    const ids = itemIds(nav);
    for (const id of [
      'visao-geral',
      'ifood',
      'tarefas',
      'checklist',
      'ocorrencias',
      'cmv',
      'cmv-real',
      'estoque',
      'rh',
      'pontos',
      'whatsapp',
      'chat',
      'conexoes',
      'produtos',
      'etiquetagem',
      'relatorios',
    ]) {
      assert.equal(ids.includes(id), true, `faltou ${id}`);
    }
  });
});

describe('navItemIsActive', () => {
  it('não marca CMV Real como CMV', () => {
    assert.equal(
      navItemIsActive('/cmv-real/notas', { exact: ['/cmv'], prefix: ['/cmv/'] }),
      false,
    );
    assert.equal(
      navItemIsActive('/cmv-real/notas', { prefix: ['/cmv-real'] }),
      true,
    );
  });
});
