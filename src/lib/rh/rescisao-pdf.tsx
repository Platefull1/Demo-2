/**
 * PDF da Solicitação de Rescisão — layout planilha (duas colunas).
 * Padrão: @react-pdf/renderer (igual ocorrencias-ata-pdf).
 */

import { createElement } from 'react';
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from '@react-pdf/renderer';
import path from 'node:path';
import {
  EMPRESA_CONTRATANTE,
  LEMBRETE_INDENIZACAO_ADICIONAL,
  LEMBRETE_RH_CONTATO,
  TIPO_AVISO_LABELS,
  TIPO_RESCISAO_LABELS,
} from '@/lib/rh/rescisao-config';
import { formatYmdBr, type RescisaoItemValor } from '@/lib/rh/rescisao';

export type RescisaoPdfInput = {
  empresa: string;
  codigo: string | null;
  colaborador: string;
  dataAdmissao: string | null;
  salario: number;
  dataDesligamento: string;
  loja?: string | null;
  cargo?: string | null;
  tempoCasa?: string | null;
  cumpreAviso: boolean | null;
  descontaAviso: boolean | null;
  inicioAviso: string | null;
  terminoAviso: string | null;
  possuiEstabilidade: boolean | null;
  tipoEstabilidade: string | null;
  foiTransferido: boolean | null;
  empresaOrigem: string | null;
  tipoRescisao: string | null;
  tipoAviso: string | null;
  motivo: string | null;
  vencimentos: RescisaoItemValor[];
  descontos: RescisaoItemValor[];
  /** Marca d'água diagonal no PDF (não enviar à contabilidade). */
  isRascunho?: boolean;
};

let fontsReady = false;

function ensureFonts() {
  if (fontsReady) return;
  const dir = path.join(process.cwd(), 'src', 'assets', 'fonts');
  Font.register({
    family: 'Inter',
    fonts: [
      { src: path.join(dir, 'Inter-Regular.ttf'), fontWeight: 400 },
      { src: path.join(dir, 'Inter-SemiBold.ttf'), fontWeight: 600 },
      { src: path.join(dir, 'Inter-Bold.ttf'), fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

const C = {
  tinta: '#0F172A',
  cinza: '#64748B',
  linha: '#CBD5E1',
  fundo: '#F8FAFC',
  marca: '#166534',
} as const;

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: C.tinta,
    paddingTop: 22,
    paddingBottom: 20,
    paddingHorizontal: 22,
  },
  titulo: {
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 3,
    color: C.marca,
  },
  subtitulo: {
    fontSize: 7.5,
    textAlign: 'center',
    color: C.cinza,
    marginBottom: 8,
  },
  secao: {
    marginTop: 7,
    marginBottom: 3,
    fontSize: 8.5,
    fontWeight: 700,
    borderBottomWidth: 0.5,
    borderBottomColor: C.linha,
    paddingBottom: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
  },
  cell: {
    width: '33.33%',
    paddingVertical: 2,
    paddingRight: 5,
  },
  label: {
    fontSize: 6.5,
    color: C.cinza,
    marginBottom: 1,
  },
  valor: {
    fontSize: 8,
    fontWeight: 600,
  },
  linhaPergunta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
    gap: 8,
  },
  pergunta: {
    flex: 1,
    fontSize: 8,
  },
  marcas: {
    flexDirection: 'row',
    gap: 10,
    width: 110,
  },
  marcaItem: {
    fontSize: 8,
  },
  tiposRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tipoCol: {
    flex: 1,
  },
  opcao: {
    flexDirection: 'row',
    marginBottom: 1.5,
  },
  opcaoTxt: {
    fontSize: 7.5,
  },
  motivoBox: {
    borderWidth: 0.5,
    borderColor: C.linha,
    borderRadius: 2,
    padding: 5,
    minHeight: 28,
    backgroundColor: C.fundo,
    fontSize: 8,
  },
  colunas: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 3,
  },
  coluna: {
    flex: 1,
  },
  colTitulo: {
    fontSize: 8,
    fontWeight: 700,
    marginBottom: 3,
  },
  tabelaHeader: {
    flexDirection: 'row',
    backgroundColor: C.fundo,
    borderBottomWidth: 0.5,
    borderBottomColor: C.linha,
    paddingVertical: 2,
    paddingHorizontal: 3,
  },
  tabelaRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.4,
    borderBottomColor: C.linha,
    paddingVertical: 1.5,
    paddingHorizontal: 3,
  },
  colCod: { width: '12%', fontSize: 7 },
  colDesc: { flex: 1, fontSize: 7 },
  colValor: { width: '26%', fontSize: 7, textAlign: 'right' },
  lembrete: {
    marginTop: 8,
    padding: 6,
    borderWidth: 0.5,
    borderColor: C.linha,
    backgroundColor: C.fundo,
    fontSize: 6.5,
    color: C.cinza,
    lineHeight: 1.35,
  },
  lembreteTitulo: {
    fontWeight: 700,
    color: C.tinta,
    marginBottom: 2,
    fontSize: 7.5,
  },
  watermark: {
    position: 'absolute',
    top: 300,
    left: 40,
    fontSize: 56,
    fontWeight: 700,
    color: '#CBD5E1',
    opacity: 0.35,
    transform: 'rotate(-32deg)',
  },
});

function moneyFmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function mark(sim: boolean | null, alvo: boolean) {
  return sim === alvo ? '( X )' : '(   )';
}

function markTipo(atual: string | null, valor: string) {
  return atual === valor ? '( X )' : '(   )';
}

function valorItem(item: RescisaoItemValor): string {
  if (item.valor == null || item.valor === '') return '—';
  return String(item.valor);
}

function RescisaoDocument({ data }: { data: RescisaoPdfInput }) {
  const tiposRescisao = Object.entries(TIPO_RESCISAO_LABELS);
  const tiposAviso = Object.entries(TIPO_AVISO_LABELS);

  return createElement(
    Document,
    null,
    createElement(
      Page,
      { size: 'A4', style: styles.page },
      data.isRascunho
        ? createElement(Text, { fixed: true, style: styles.watermark }, 'RASCUNHO')
        : null,
      createElement(Text, { style: styles.titulo }, 'SOLICITAÇÃO RESCISÃO CONTRATO DE TRABALHO'),
      createElement(
        Text,
        { style: styles.subtitulo },
        `${data.empresa || EMPRESA_CONTRATANTE} · Documento para contabilidade${
          data.isRascunho ? ' · RASCUNHO' : ''
        }`,
      ),

      createElement(Text, { style: styles.secao }, '1. Dados do colaborador'),
      createElement(
        View,
        { style: styles.grid },
        createElement(
          View,
          { style: styles.cell },
          createElement(Text, { style: styles.label }, 'Empresa'),
          createElement(Text, { style: styles.valor }, data.empresa || EMPRESA_CONTRATANTE),
        ),
        createElement(
          View,
          { style: styles.cell },
          createElement(Text, { style: styles.label }, 'Código'),
          createElement(Text, { style: styles.valor }, data.codigo?.trim() || '—'),
        ),
        createElement(
          View,
          { style: styles.cell },
          createElement(Text, { style: styles.label }, 'Colaborador'),
          createElement(Text, { style: styles.valor }, data.colaborador),
        ),
        createElement(
          View,
          { style: styles.cell },
          createElement(Text, { style: styles.label }, 'Admissão'),
          createElement(Text, { style: styles.valor }, formatYmdBr(data.dataAdmissao)),
        ),
        createElement(
          View,
          { style: styles.cell },
          createElement(Text, { style: styles.label }, 'Salário'),
          createElement(Text, { style: styles.valor }, moneyFmt(data.salario)),
        ),
        createElement(
          View,
          { style: styles.cell },
          createElement(Text, { style: styles.label }, 'Data de desligamento'),
          createElement(Text, { style: styles.valor }, formatYmdBr(data.dataDesligamento)),
        ),
        createElement(
          View,
          { style: styles.cell },
          createElement(Text, { style: styles.label }, 'Loja'),
          createElement(Text, { style: styles.valor }, data.loja || '—'),
        ),
        createElement(
          View,
          { style: styles.cell },
          createElement(Text, { style: styles.label }, 'Cargo'),
          createElement(Text, { style: styles.valor }, data.cargo || '—'),
        ),
        createElement(
          View,
          { style: styles.cell },
          createElement(Text, { style: styles.label }, 'Tempo de casa'),
          createElement(Text, { style: styles.valor }, data.tempoCasa || '—'),
        ),
      ),

      createElement(Text, { style: styles.secao }, '2. Perguntas'),
      createElement(
        View,
        { style: styles.linhaPergunta },
        createElement(Text, { style: styles.pergunta }, 'Vai cumprir aviso prévio?'),
        createElement(
          View,
          { style: styles.marcas },
          createElement(Text, { style: styles.marcaItem }, `Sim ${mark(data.cumpreAviso, true)}`),
          createElement(Text, { style: styles.marcaItem }, `Não ${mark(data.cumpreAviso, false)}`),
        ),
      ),
      createElement(
        View,
        { style: styles.linhaPergunta },
        createElement(Text, { style: styles.pergunta }, 'Será descontado aviso prévio?'),
        createElement(
          View,
          { style: styles.marcas },
          createElement(Text, { style: styles.marcaItem }, `Sim ${mark(data.descontaAviso, true)}`),
          createElement(Text, { style: styles.marcaItem }, `Não ${mark(data.descontaAviso, false)}`),
        ),
      ),
      data.cumpreAviso || data.descontaAviso
        ? createElement(
            View,
            { style: styles.grid },
            createElement(
              View,
              { style: styles.cell },
              createElement(Text, { style: styles.label }, 'Início do aviso'),
              createElement(Text, { style: styles.valor }, formatYmdBr(data.inicioAviso)),
            ),
            createElement(
              View,
              { style: styles.cell },
              createElement(Text, { style: styles.label }, 'Término do aviso'),
              createElement(Text, { style: styles.valor }, formatYmdBr(data.terminoAviso)),
            ),
          )
        : null,
      createElement(
        View,
        { style: styles.linhaPergunta },
        createElement(
          Text,
          { style: styles.pergunta },
          'Empregado possui algum tipo de estabilidade no emprego?',
        ),
        createElement(
          View,
          { style: styles.marcas },
          createElement(
            Text,
            { style: styles.marcaItem },
            `Sim ${mark(data.possuiEstabilidade, true)}`,
          ),
          createElement(
            Text,
            { style: styles.marcaItem },
            `Não ${mark(data.possuiEstabilidade, false)}`,
          ),
        ),
      ),
      data.possuiEstabilidade
        ? createElement(
            View,
            { style: { marginBottom: 4 } },
            createElement(Text, { style: styles.label }, 'Tipo de estabilidade'),
            createElement(Text, { style: styles.valor }, data.tipoEstabilidade || '—'),
          )
        : null,
      createElement(
        View,
        { style: styles.linhaPergunta },
        createElement(
          Text,
          { style: styles.pergunta },
          'Foi transferido de empresa ou grupo econômico?',
        ),
        createElement(
          View,
          { style: styles.marcas },
          createElement(
            Text,
            { style: styles.marcaItem },
            `Sim ${mark(data.foiTransferido, true)}`,
          ),
          createElement(
            Text,
            { style: styles.marcaItem },
            `Não ${mark(data.foiTransferido, false)}`,
          ),
        ),
      ),
      data.foiTransferido
        ? createElement(
            View,
            { style: { marginBottom: 4 } },
            createElement(Text, { style: styles.label }, 'Empresa de origem'),
            createElement(Text, { style: styles.valor }, data.empresaOrigem || '—'),
          )
        : null,

      createElement(
        View,
        { style: styles.tiposRow },
        createElement(
          View,
          { style: styles.tipoCol },
          createElement(Text, { style: styles.secao }, '3. Tipo de rescisão'),
          ...tiposRescisao.map(([key, label]) =>
            createElement(
              View,
              { key, style: styles.opcao },
              createElement(
                Text,
                { style: styles.opcaoTxt },
                `${markTipo(data.tipoRescisao, key)}  ${label}`,
              ),
            ),
          ),
        ),
        createElement(
          View,
          { style: styles.tipoCol },
          createElement(Text, { style: styles.secao }, '4. Tipo de aviso'),
          ...tiposAviso.map(([key, label]) =>
            createElement(
              View,
              { key, style: styles.opcao },
              createElement(
                Text,
                { style: styles.opcaoTxt },
                `${markTipo(data.tipoAviso, key)}  ${label}`,
              ),
            ),
          ),
        ),
      ),

      createElement(Text, { style: styles.secao }, '5. Motivo da rescisão'),
      createElement(
        View,
        { style: styles.motivoBox },
        createElement(Text, null, data.motivo?.trim() || '—'),
      ),

      createElement(Text, { style: styles.secao }, '6. Vencimentos e Descontos'),
      createElement(
        View,
        { style: styles.colunas },
        createElement(
          View,
          { style: styles.coluna },
          createElement(Text, { style: styles.colTitulo }, 'Vencimentos'),
          createElement(
            View,
            { style: styles.tabelaHeader },
            createElement(Text, { style: styles.colDesc }, 'Descrição'),
            createElement(Text, { style: styles.colValor }, 'Valor'),
          ),
          ...data.vencimentos.map((item) =>
            createElement(
              View,
              { key: item.chave, style: styles.tabelaRow },
              createElement(Text, { style: styles.colDesc }, item.descricao || '—'),
              createElement(Text, { style: styles.colValor }, valorItem(item)),
            ),
          ),
        ),
        createElement(
          View,
          { style: styles.coluna },
          createElement(Text, { style: styles.colTitulo }, 'Descontos'),
          createElement(
            View,
            { style: styles.tabelaHeader },
            createElement(Text, { style: styles.colCod }, 'Cód.'),
            createElement(Text, { style: styles.colDesc }, 'Descrição'),
            createElement(Text, { style: styles.colValor }, 'Valor'),
          ),
          ...data.descontos.map((item) =>
            createElement(
              View,
              { key: item.chave, style: styles.tabelaRow },
              createElement(Text, { style: styles.colCod }, item.codigo || '—'),
              createElement(Text, { style: styles.colDesc }, item.descricao || '—'),
              createElement(Text, { style: styles.colValor }, valorItem(item)),
            ),
          ),
        ),
      ),

      createElement(
        View,
        { style: styles.lembrete },
        createElement(Text, { style: styles.lembreteTitulo }, 'LEMBRETE'),
        createElement(Text, null, LEMBRETE_INDENIZACAO_ADICIONAL),
        createElement(Text, { style: { marginTop: 2 } }, LEMBRETE_RH_CONTATO),
      ),
    ),
  );
}

export async function generateRescisaoPdf(data: RescisaoPdfInput): Promise<Buffer> {
  ensureFonts();
  const buffer = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createElement(RescisaoDocument, { data }) as any,
  );
  return Buffer.from(buffer);
}

/** recisão_<nome do funcionario>_<loja do funcionario>.pdf */
export function rescisaoPdfFilename(opts: {
  colaborador: string;
  loja?: string | null;
}): string {
  const safePart = (s: string) =>
    s
      .normalize('NFC')
      .replace(/[\\/:*?"<>|]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80) || '—';
  const nome = safePart(opts.colaborador);
  const loja = safePart(opts.loja || 'sem loja');
  return `recisão_${nome}_${loja}.pdf`;
}

/** Header Content-Disposition com UTF-8 (ç/ã no nome). */
export function rescisaoPdfContentDisposition(filename: string): string {
  const asciiFallback = filename.replace(/[^\x20-\x7E]/g, '_');
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}
