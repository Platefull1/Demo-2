/**
 * Ata da Central de Ocorrências em PDF (Modelo 3 — painel compacto).
 * Não altera a ata de Reclamações.
 */

import { createElement } from 'react';
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from '@react-pdf/renderer';
import path from 'node:path';
import sharp from 'sharp';
import { downloadOcorrenciaFotoBytes } from '@/lib/ocorrencias-storage';
import { categoriaLabel } from '@/lib/ocorrencias-categorias';
import {
  formatDateSP,
  formatOcorrenciaDateTimeLong,
  monthNameSP,
  monthYearLabelSP,
  previousMonth,
} from '@/lib/ocorrencias-period';
import {
  avisoPainelAta,
  buildLojaResumo,
  buildRedeResumo,
  canalAtaLabel,
  destaquesDaAta,
  formatNomePessoa,
  motoboysPainel,
  nomeEmpresaAta,
  ordenarCategoriasPainel,
  quebraCategoriaDetalhe,
  variacaoPainel,
  type AtrasoInformado,
  type LojaAtaRef,
  type MotoboyAtaRow,
  type OcorrenciaAtaRow,
  type RedeResumoAta,
  type ResumoCategoria,
  type TomVariacao,
} from '@/lib/ocorrencias-ata-data';

const PHOTO_CONCURRENCY = 5;
const PHOTO_MAX_W = 900;
const CARD_FOTO_H = 120;

const C = {
  verde: '#22C55E',
  verdeEsc: '#15803D',
  verdeSuave: '#ECFDF3',
  tinta: '#0F172A',
  cinza: '#64748B',
  linha: '#E2E8F0',
  trilho: '#F1F5F9',
  cartao: '#F8FAFC',
  up: '#B42318',
} as const;

const CAT_HEAD: Record<string, string> = {
  PEDIDO_ATRASADO: 'ATRASADO',
  PEDIDO_REVIRADO: 'REVIRADO',
  FALTOU_BEBIDA: 'BEBIDA',
  PEDIDO_ERRADO: 'ERRADO',
  PEDIDO_TROCADO: 'TROCADO',
  QUALIDADE: 'QUALIDADE',
  PROBLEMAS_COM_BORDA: 'BORDA',
  OUTROS: 'OUTROS',
};

export type AtaFotoBytesByPath = ReadonlyMap<string, Buffer>;

let fontsReady = false;

function ensureFonts() {
  if (fontsReady) return;
  const dir = path.join(process.cwd(), 'src', 'assets', 'fonts');
  Font.register({
    family: 'Inter',
    fonts: [
      { src: path.join(dir, 'Inter-Regular.ttf'), fontWeight: 400 },
      { src: path.join(dir, 'Inter-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
      { src: path.join(dir, 'Inter-SemiBold.ttf'), fontWeight: 600 },
      { src: path.join(dir, 'Inter-Bold.ttf'), fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: C.tinta,
    paddingTop: 56.7,
    paddingBottom: 72,
    paddingHorizontal: 56.7,
  },
  eyebrow: {
    fontSize: 7.5,
    fontWeight: 700,
    color: C.cinza,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  kicker: { fontSize: 9, color: C.cinza, marginBottom: 2 },
  lojaNome: { fontSize: 26, fontWeight: 700, color: C.tinta },
  periodo: { fontSize: 14, color: C.cinza },
  totalNum: { fontSize: 32, fontWeight: 700, color: C.verde, textAlign: 'right' },
  totalLabel: { fontSize: 8.5, color: C.cinza, textAlign: 'right' },
  regra: {
    marginTop: 14,
    marginBottom: 14,
    height: 1.5,
    backgroundColor: C.tinta,
  },
  cols: { flexDirection: 'row' },
  col: { width: '48%' },
  gutter: { width: '4%' },
  section: {
    fontSize: 7.5,
    fontWeight: 700,
    color: C.verdeEsc,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: C.linha,
  },
  catNome: { width: '50%', fontSize: 9, color: C.tinta },
  catBarWrap: { width: '38%', paddingRight: 6 },
  catTrack: {
    height: 7,
    backgroundColor: C.trilho,
    borderRadius: 3.5,
    overflow: 'hidden',
  },
  catFill: { height: 7, backgroundColor: C.verde, borderRadius: 3.5 },
  catNaoInf: { fontSize: 7.5, fontStyle: 'italic', color: C.cinza },
  catQtd: { width: '12%', fontSize: 9, fontWeight: 700, textAlign: 'right' },
  catVar: { fontSize: 7, marginLeft: 3 },
  motoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: C.linha,
  },
  motoNome: { fontSize: 9, fontWeight: 700, color: C.tinta },
  motoDetalhe: { fontSize: 7.5, color: C.cinza, marginTop: 1 },
  motoQtd: { fontSize: 13, fontWeight: 700, textAlign: 'right' },
  motoResto: { fontSize: 7.5, fontStyle: 'italic', color: C.cinza, marginTop: 6 },
  aviso: {
    marginTop: 12,
    backgroundColor: C.verdeSuave,
    borderRadius: 4,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
  },
  avisoTxt: { fontSize: 8.5, color: C.tinta },
  avisoBold: { fontSize: 8.5, fontWeight: 700, color: C.verdeEsc },
  miniRow: { flexDirection: 'row', marginBottom: 14 },
  mini: { flex: 1, paddingRight: 8 },
  miniNome: { fontSize: 8, color: C.cinza },
  miniTotal: { fontSize: 18, fontWeight: 700, color: C.tinta, marginTop: 1 },
  miniTrack: {
    height: 3,
    backgroundColor: C.trilho,
    borderRadius: 1.5,
    marginTop: 4,
    overflow: 'hidden',
  },
  miniFill: { height: 3, backgroundColor: C.verde, borderRadius: 1.5 },
  tableHead: {
    flexDirection: 'row',
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: C.linha,
    marginTop: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: C.linha,
  },
  tableFoot: {
    flexDirection: 'row',
    paddingVertical: 4,
    backgroundColor: C.trilho,
  },
  th: { fontSize: 7, fontWeight: 700, color: C.cinza, textTransform: 'uppercase' },
  td: { fontSize: 8.5, color: C.tinta },
  tdBold: { fontSize: 8.5, fontWeight: 700, color: C.tinta },
  card: {
    width: '48%',
    backgroundColor: C.cartao,
    borderRadius: 6,
    padding: 10,
  },
  cardGap: { width: '4%' },
  cardFoto: {
    width: '100%',
    height: CARD_FOTO_H,
    objectFit: 'cover',
    borderRadius: 4,
    marginBottom: 8,
  },
  cardCats: {
    fontSize: 7,
    fontWeight: 700,
    color: C.verdeEsc,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  cardPedido: { fontSize: 13, fontWeight: 700, color: C.tinta, marginBottom: 2 },
  cardMeta: { fontSize: 7.5, color: C.cinza, marginBottom: 3 },
  cardMoto: { fontSize: 8.5, color: C.tinta, marginBottom: 3 },
  cardDesc: { fontSize: 8.5, color: C.tinta },
  cardDescVazia: { fontSize: 8.5, fontStyle: 'italic', color: C.cinza },
  destTitle: {
    fontSize: 7.5,
    fontWeight: 700,
    color: C.verdeEsc,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
  },
  destLoja: { fontSize: 10, fontWeight: 700, color: C.tinta, marginBottom: 8 },
  cardsRow: { flexDirection: 'row', marginBottom: 10 },
  footer: {
    position: 'absolute',
    bottom: 36,
    left: 56.7,
    right: 56.7,
    fontSize: 7.5,
    color: C.cinza,
    textAlign: 'center',
  },
});

function tomCor(tom: TomVariacao): string {
  if (tom === 'up') return C.up;
  if (tom === 'down') return C.verdeEsc;
  return C.cinza;
}

function linhaCanal(item: OcorrenciaAtaRow): string {
  const when = formatOcorrenciaDateTimeLong(item.createdAt);
  const canal = canalAtaLabel(item.canalExterno);
  const ext = item.numeroPedidoExterno?.trim();
  if (canal && ext) return `${canal} ${ext} · ${when}`;
  if (canal) return `${canal} · ${when}`;
  if (ext) return `${ext} · ${when}`;
  return when;
}

function catsDestaque(item: OcorrenciaAtaRow): string {
  return item.categorias
    .map((c) => categoriaLabel(c).toLocaleUpperCase('pt-BR'))
    .join(' · ');
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]!);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );
  return out;
}

async function fotoParaPdf(raw: Buffer): Promise<Buffer | null> {
  try {
    return await sharp(raw)
      .resize({ width: PHOTO_MAX_W, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch {
    return null;
  }
}

async function carregarFotos(
  items: OcorrenciaAtaRow[],
  fotoBytesByPath?: AtaFotoBytesByPath,
): Promise<Map<string, string>> {
  const paths = [...new Set(items.flatMap((i) => i.fotoPaths).filter(Boolean))];
  const map = new Map<string, string>();
  if (paths.length === 0) return map;
  const results = await mapPool(paths, PHOTO_CONCURRENCY, async (p) => {
    const raw = fotoBytesByPath
      ? (fotoBytesByPath.get(p) ?? null)
      : await downloadOcorrenciaFotoBytes(p);
    const jpeg = raw ? await fotoParaPdf(raw) : null;
    return { path: p, uri: jpeg ? `data:image/jpeg;base64,${jpeg.toString('base64')}` : null };
  });
  for (const r of results) {
    if (r.uri) map.set(r.path, r.uri);
  }
  return map;
}

function Barra({ pct }: { pct: number }) {
  return (
    <View style={styles.catTrack}>
      {pct > 0 ? <View style={[styles.catFill, { width: `${pct}%` }]} /> : null}
    </View>
  );
}

function ColCategorias({
  rows,
  temDadosAnterior,
  mesAnterior,
}: {
  rows: ResumoCategoria[];
  temDadosAnterior: boolean;
  mesAnterior: string;
}) {
  const max = Math.max(0, ...rows.map((r) => r.quantidade ?? 0));
  const ordered = ordenarCategoriasPainel(rows);
  return (
    <View style={styles.col}>
      <Text style={styles.section}>Por categoria</Text>
      {ordered.map((r) => {
        const naoInf = r.categoria === 'PEDIDO_ATRASADO' && r.quantidade === null;
        const pct = !naoInf && max > 0 ? Math.round(((r.quantidade ?? 0) / max) * 100) : 0;
        const v = variacaoPainel(r.quantidade, r.anterior, temDadosAnterior, mesAnterior);
        return (
          <View key={r.categoria} style={styles.catRow} wrap={false}>
            <Text style={styles.catNome}>{r.label}</Text>
            <View style={styles.catBarWrap}>
              {naoInf ? <Text style={styles.catNaoInf}>não informado</Text> : <Barra pct={pct} />}
            </View>
            <Text style={styles.catQtd}>{naoInf ? '—' : String(r.quantidade ?? 0)}</Text>
            {v.tom !== 'none' ? (
              <Text style={[styles.catVar, { color: tomCor(v.tom) }]}>{v.indicador}</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function ColMotoboys({
  motoboys,
  detalheLoja,
}: {
  motoboys: MotoboyAtaRow[];
  detalheLoja?: boolean;
}) {
  const { visiveis, restoLabel, vazio } = motoboysPainel(motoboys);
  return (
    <View style={styles.col}>
      <Text style={styles.section}>Motoboys mais citados</Text>
      {vazio ? (
        <Text style={styles.motoResto}>Nenhum motoboy citado no período.</Text>
      ) : (
        visiveis.map((m) => {
          const detalhe = [
            quebraCategoriaDetalhe(m.porCategoria),
            detalheLoja ? m.lojaNome : '',
          ]
            .filter(Boolean)
            .join(' · ');
          return (
            <View key={`${m.motoboyId}|${m.lojaId}`} style={styles.motoRow} wrap={false}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.motoNome}>{m.nome}</Text>
                {detalhe ? <Text style={styles.motoDetalhe}>{detalhe}</Text> : null}
              </View>
              <Text
                style={[
                  styles.motoQtd,
                  { color: m.total > 1 ? C.verde : C.tinta },
                ]}
              >
                {m.total}
              </Text>
            </View>
          );
        })
      )}
      {restoLabel ? <Text style={styles.motoResto}>{restoLabel}</Text> : null}
    </View>
  );
}

function Aviso({ texto }: { texto: string }) {
  return (
    <View style={styles.aviso} wrap={false}>
      <Text style={styles.avisoTxt}>
        <Text style={styles.avisoBold}>Atenção: </Text>
        {texto}
      </Text>
    </View>
  );
}

function CardDestaque({
  item,
  fotos,
}: {
  item: OcorrenciaAtaRow;
  fotos: Map<string, string>;
}) {
  const foto = item.fotoPaths.map((p) => fotos.get(p)).find(Boolean);
  const desc = item.descricao.trim();
  const moto = item.motoboyNome ? formatNomePessoa(item.motoboyNome) : '';
  return (
    <View style={styles.card} wrap={false}>
      {foto ? <Image src={foto} style={styles.cardFoto} /> : null}
      <Text style={styles.cardCats}>{catsDestaque(item)}</Text>
      <Text style={styles.cardPedido}>Pedido {item.numeroPedidoSaipos}</Text>
      <Text style={styles.cardMeta}>{linhaCanal(item)}</Text>
      {moto ? <Text style={styles.cardMoto}>{moto}</Text> : null}
      {desc ? (
        <Text style={styles.cardDesc}>{desc}</Text>
      ) : (
        <Text style={styles.cardDescVazia}>Sem descrição</Text>
      )}
    </View>
  );
}

function GradeDestaques({
  items,
  fotos,
  titulo,
  subtitulo,
}: {
  items: OcorrenciaAtaRow[];
  fotos: Map<string, string>;
  titulo: string;
  subtitulo?: string;
}) {
  if (items.length === 0) return null;
  const rows: OcorrenciaAtaRow[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return (
    <View>
      {rows.map((pair, idx) => (
        <View key={pair[0]!.id} wrap={false}>
          {idx === 0 && subtitulo ? (
            <Text style={styles.destLoja}>{subtitulo}</Text>
          ) : null}
          <Text style={styles.destTitle}>
            {idx === 0 ? titulo : `${titulo} (cont.)`}
          </Text>
          <View style={styles.cardsRow}>
            <CardDestaque item={pair[0]!} fotos={fotos} />
            <View style={styles.cardGap} />
            {pair[1] ? (
              <CardDestaque item={pair[1]} fotos={fotos} />
            ) : (
              <View style={{ width: '48%' }} />
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

function MatrizRede({ rede }: { rede: RedeResumoAta }) {
  const cats = ordenarCategoriasPainel(rede.resumo);
  const lojaW = '18%';
  const totalW = '10%';
  const catW = `${(72 / cats.length).toFixed(2)}%`;
  return (
    <View>
      <View style={styles.tableHead} wrap={false}>
        <Text style={[styles.th, { width: lojaW }]}>Loja</Text>
        {cats.map((c) => (
          <Text key={c.categoria} style={[styles.th, { width: catW, textAlign: 'right' }]}>
            {CAT_HEAD[c.categoria] ?? c.label}
          </Text>
        ))}
        <Text style={[styles.th, { width: totalW, textAlign: 'right' }]}>Total</Text>
      </View>
      {rede.matriz.lojas.map((l) => (
        <View key={l.lojaId} style={styles.tableRow} wrap={false}>
          <Text style={[styles.td, { width: lojaW }]}>{l.lojaNome}</Text>
          {cats.map((c) => {
            const v = l.valores[c.categoria];
            return (
              <Text key={c.categoria} style={[styles.td, { width: catW, textAlign: 'right' }]}>
                {v === null ? '—' : String(v)}
              </Text>
            );
          })}
          <Text style={[styles.tdBold, { width: totalW, textAlign: 'right' }]}>{l.total}</Text>
        </View>
      ))}
      <View style={styles.tableFoot} wrap={false}>
        <Text style={[styles.tdBold, { width: lojaW }]}>Total</Text>
        {cats.map((c) => {
          const v = rede.matriz.totaisColuna[c.categoria];
          return (
            <Text key={c.categoria} style={[styles.tdBold, { width: catW, textAlign: 'right' }]}>
              {v === null ? '—' : String(v)}
            </Text>
          );
        })}
        <Text style={[styles.tdBold, { width: totalW, textAlign: 'right' }]}>
          {rede.matriz.totalGeral}
        </Text>
      </View>
    </View>
  );
}

function Rodape({ empresa, geradaEm }: { empresa: string; geradaEm: string }) {
  return (
    <Text
      fixed
      style={styles.footer}
      render={({ pageNumber, totalPages }) =>
        [empresa, `gerada em ${geradaEm}`, `página ${pageNumber} de ${totalPages}`]
          .filter(Boolean)
          .join(' · ')
      }
    />
  );
}

function Cabecalho({
  empresa,
  titulo,
  periodo,
  total,
  ocorrenciasLabel,
  variacao,
}: {
  empresa: string;
  titulo: string;
  periodo: string;
  total: number;
  ocorrenciasLabel: string;
  variacao: ReturnType<typeof variacaoPainel>;
}) {
  const eyebrow = empresa
    ? `${empresa.toLocaleUpperCase('pt-BR')} · ATA DE REUNIÃO`
    : 'ATA DE REUNIÃO';
  return (
    <View>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.kicker}>Ocorrências do mês</Text>
          <Text>
            <Text style={styles.lojaNome}>{titulo}  </Text>
            <Text style={styles.periodo}>{periodo}</Text>
          </Text>
        </View>
        <View>
          <Text style={styles.totalNum}>{total}</Text>
          <Text style={styles.totalLabel}>{ocorrenciasLabel}</Text>
          {variacao.tom !== 'none' ? (
            <Text style={{ fontSize: 8, color: tomCor(variacao.tom), textAlign: 'right', marginTop: 2 }}>
              {variacao.cabecalho}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.regra} />
    </View>
  );
}

function MiniLojas({
  ranking,
}: {
  ranking: RedeResumoAta['rankingLojas'];
}) {
  const max = Math.max(0, ...ranking.map((r) => r.total));
  return (
    <View style={styles.miniRow} wrap={false}>
      {ranking.map((l) => {
        const pct = max > 0 ? Math.round((l.total / max) * 100) : 0;
        return (
          <View key={l.lojaId} style={styles.mini}>
            <Text style={styles.miniNome}>{l.lojaNome}</Text>
            <Text style={styles.miniTotal}>{l.total}</Text>
            <View style={styles.miniTrack}>
              {pct > 0 ? <View style={[styles.miniFill, { width: `${pct}%` }]} /> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function AtaLojaPage(props: {
  empresa: string;
  geradaEm: string;
  titulo: string;
  periodo: string;
  mesNome: string;
  mesAnterior: string;
  total: number;
  atraso: number | null;
  temDadosAnterior: boolean;
  totalAnterior: number | null;
  resumo: ResumoCategoria[];
  motoboys: MotoboyAtaRow[];
  destaques: OcorrenciaAtaRow[];
  fotos: Map<string, string>;
}) {
  const variacao = variacaoPainel(
    props.total,
    props.totalAnterior,
    props.temDadosAnterior,
    props.mesAnterior,
  );
  const aviso = avisoPainelAta({
    mesNome: props.mesNome,
    atrasosNaoInformados: props.atraso === null,
    temDadosAnterior: props.temDadosAnterior,
  });
  return (
    <Page size="A4" style={styles.page}>
      <View wrap={false}>
        <Cabecalho
          empresa={props.empresa}
          titulo={props.titulo}
          periodo={props.periodo}
          total={props.total}
          ocorrenciasLabel="ocorrências registradas"
          variacao={variacao}
        />
        <View style={styles.cols}>
          <ColCategorias
            rows={props.resumo}
            temDadosAnterior={props.temDadosAnterior}
            mesAnterior={props.mesAnterior}
          />
          <View style={styles.gutter} />
          <ColMotoboys motoboys={props.motoboys} />
        </View>
        {aviso ? <Aviso texto={aviso} /> : null}
      </View>
      <GradeDestaques
        items={props.destaques}
        fotos={props.fotos}
        titulo="Ocorrências em destaque"
      />
      <Rodape empresa={props.empresa} geradaEm={props.geradaEm} />
    </Page>
  );
}

function AtaRedePage(props: {
  empresa: string;
  geradaEm: string;
  periodo: string;
  mesNome: string;
  mesAnterior: string;
  temDadosAnterior: boolean;
  totalAnterior: number | null;
  rede: RedeResumoAta;
  fotos: Map<string, string>;
}) {
  const variacao = variacaoPainel(
    props.rede.matriz.totalGeral,
    props.totalAnterior,
    props.temDadosAnterior,
    props.mesAnterior,
  );
  const aviso = avisoPainelAta({
    mesNome: props.mesNome,
    atrasosNaoInformados: props.rede.lojasSemAtraso.length > 0,
    temDadosAnterior: props.temDadosAnterior,
    lojasSemAtraso: props.rede.lojasSemAtraso,
  });
  return (
    <Page size="A4" style={styles.page}>
      <View wrap={false}>
        <Cabecalho
          empresa={props.empresa}
          titulo="Rede"
          periodo={props.periodo}
          total={props.rede.matriz.totalGeral}
          ocorrenciasLabel="ocorrências registradas"
          variacao={variacao}
        />
        <MiniLojas ranking={props.rede.rankingLojas} />
        <View style={styles.cols}>
          <ColCategorias
            rows={props.rede.resumo}
            temDadosAnterior={props.temDadosAnterior}
            mesAnterior={props.mesAnterior}
          />
          <View style={styles.gutter} />
          <ColMotoboys motoboys={props.rede.motoboys} detalheLoja />
        </View>
      </View>
      <MatrizRede rede={props.rede} />
      {aviso ? <Aviso texto={aviso} /> : null}
      {props.rede.destaquesPorLoja.map((g) => (
        <GradeDestaques
          key={g.lojaId}
          items={g.items}
          fotos={props.fotos}
          titulo="Ocorrências em destaque"
          subtitulo={g.lojaNome}
        />
      ))}
      <Rodape empresa={props.empresa} geradaEm={props.geradaEm} />
    </Page>
  );
}

function totalAnteriorLoja(
  prevItems: OcorrenciaAtaRow[] | null,
  prevAtraso: number | null,
  temDadosAnterior: boolean,
): number | null {
  if (!temDadosAnterior || !prevItems) return null;
  return prevItems.length + (prevAtraso ?? 0);
}

export async function generateOcorrenciaAtaLojaPdf(opts: {
  empresa: string;
  ano: number;
  mes: number;
  loja: LojaAtaRef;
  items: OcorrenciaAtaRow[];
  atraso: number | null;
  prevItems: OcorrenciaAtaRow[] | null;
  prevAtraso: number | null;
  temDadosAnterior: boolean;
  fotoBytesByPath?: AtaFotoBytesByPath;
  geradoEm?: Date;
}): Promise<Buffer> {
  ensureFonts();
  const empresa = nomeEmpresaAta({ name: opts.empresa });
  const resumo = buildLojaResumo({
    loja: opts.loja,
    items: opts.items,
    atraso: opts.atraso,
    prevItems: opts.prevItems,
    prevAtraso: opts.prevAtraso,
    temDadosAnterior: opts.temDadosAnterior,
  });
  const destaques = destaquesDaAta(opts.items);
  const fotos = await carregarFotos(destaques, opts.fotoBytesByPath);
  const prev = previousMonth(opts.ano, opts.mes);
  const buf = await renderToBuffer(
    createElement(
      Document,
      null,
      createElement(AtaLojaPage, {
        empresa,
        geradaEm: formatDateSP(opts.geradoEm ?? new Date()),
        titulo: resumo.lojaNome,
        periodo: monthYearLabelSP(opts.ano, opts.mes),
        mesNome: monthNameSP(opts.ano, opts.mes),
        mesAnterior: monthNameSP(prev.ano, prev.mes).toLocaleLowerCase('pt-BR'),
        total: resumo.total,
        atraso: opts.atraso,
        temDadosAnterior: opts.temDadosAnterior,
        totalAnterior: totalAnteriorLoja(
          opts.prevItems,
          opts.prevAtraso,
          opts.temDadosAnterior,
        ),
        resumo: resumo.resumo,
        motoboys: resumo.motoboys,
        destaques,
        fotos,
      }),
    ),
  );
  return Buffer.from(buf);
}

export async function generateOcorrenciaAtaRedePdf(opts: {
  empresa: string;
  ano: number;
  mes: number;
  lojas: LojaAtaRef[];
  items: OcorrenciaAtaRow[];
  atrasos: AtrasoInformado[];
  prevItems: OcorrenciaAtaRow[] | null;
  prevAtrasos: AtrasoInformado[] | null;
  temDadosAnterior: boolean;
  fotoBytesByPath?: AtaFotoBytesByPath;
  geradoEm?: Date;
}): Promise<Buffer> {
  ensureFonts();
  const empresa = nomeEmpresaAta({ name: opts.empresa });
  const rede = buildRedeResumo({
    lojas: opts.lojas,
    items: opts.items,
    atrasos: opts.atrasos,
    prevItems: opts.prevItems,
    prevAtrasos: opts.prevAtrasos,
    temDadosAnterior: opts.temDadosAnterior,
  });
  const destaques = destaquesDaAta(opts.items);
  const fotos = await carregarFotos(destaques, opts.fotoBytesByPath);
  const prev = previousMonth(opts.ano, opts.mes);
  const totalAnt =
    opts.temDadosAnterior && opts.prevItems
      ? opts.prevItems.length +
        (opts.prevAtrasos
          ? opts.lojas.reduce((acc, l) => {
              const q = opts.prevAtrasos!.find((a) => a.lojaId === l.id)?.quantidade;
              return acc + (q ?? 0);
            }, 0)
          : 0)
      : null;
  const buf = await renderToBuffer(
    createElement(
      Document,
      null,
      createElement(AtaRedePage, {
        empresa,
        geradaEm: formatDateSP(opts.geradoEm ?? new Date()),
        periodo: monthYearLabelSP(opts.ano, opts.mes),
        mesNome: monthNameSP(opts.ano, opts.mes),
        mesAnterior: monthNameSP(prev.ano, prev.mes).toLocaleLowerCase('pt-BR'),
        temDadosAnterior: opts.temDadosAnterior,
        totalAnterior: totalAnt,
        rede,
        fotos,
      }),
    ),
  );
  return Buffer.from(buf);
}
