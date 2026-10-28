module.exports = [
"[project]/Demo-2/src/lib/nfe/cmv-catalogo.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Catálogo CMV Real (CmvRealInsumoConfig): ensure, órfãos e marcação na importação.
 */ __turbopack_context__.s([
    "ensureCmvRealInsumoConfig",
    ()=>ensureCmvRealInsumoConfig,
    "idsNoCatalogoCmv",
    ()=>idsNoCatalogoCmv,
    "incluirOrfaosNoCatalogoCmv",
    ()=>incluirOrfaosNoCatalogoCmv,
    "listarOrfaosCmvCatalogo",
    ()=>listarOrfaosCmvCatalogo,
    "secaoFromCategoriaId",
    ()=>secaoFromCategoriaId,
    "secaoFromNomeProduto",
    ()=>secaoFromNomeProduto,
    "unidadeFromEstoque",
    ()=>unidadeFromEstoque
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
;
function secaoFromCategoriaId(categoriaId) {
    const id = String(categoriaId || '').toLowerCase();
    if (id.includes('embalag')) return 'EMBALAGEM';
    if (id.includes('bebid')) return 'BEBIDA';
    return 'MATERIA_PRIMA';
}
function secaoFromNomeProduto(nome) {
    const n = String(nome || '').toUpperCase();
    if (/EMBALAGEM|MESINHA|SEPARADOR|SACOLA|POTE|COPO|TAMPA|PAPEL|FILME/.test(n)) {
        return 'EMBALAGEM';
    }
    if (/COCA|PEPSI|GUARAN|SPRITE|SUCO|AGUA|REFRIG|CERVEJ|HEINEKEN|SPATEN|BEBIDA|SCHIN|FANTA/.test(n)) {
        return 'BEBIDA';
    }
    return 'MATERIA_PRIMA';
}
function unidadeFromEstoque(unidade) {
    return String(unidade || '').toLowerCase() === 'un' ? 'UN' : 'KG';
}
async function ensureCmvRealInsumoConfig(params) {
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.findUnique({
        where: {
            userId_estoqueInsumoId: {
                userId: params.tenantUserId,
                estoqueInsumoId: params.estoqueInsumoId
            }
        }
    });
    if (existing) {
        if (!existing.ativo) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.update({
                where: {
                    id: existing.id
                },
                data: {
                    ativo: true,
                    secao: params.secao,
                    unidade: params.unidade,
                    ...params.ordem != null ? {
                        ordem: params.ordem
                    } : {}
                }
            });
            return {
                created: true
            };
        }
        return {
            created: false
        };
    }
    let ordem = params.ordem;
    if (ordem == null) {
        const max = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.aggregate({
            where: {
                userId: params.tenantUserId,
                secao: params.secao
            },
            _max: {
                ordem: true
            }
        });
        ordem = (max._max.ordem ?? 0) + 1;
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.create({
        data: {
            userId: params.tenantUserId,
            estoqueInsumoId: params.estoqueInsumoId,
            secao: params.secao,
            unidade: params.unidade,
            ordem,
            ativo: true
        }
    });
    return {
        created: true
    };
}
async function idsNoCatalogoCmv(tenantUserId) {
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.findMany({
        where: {
            userId: tenantUserId,
            ativo: true
        },
        select: {
            estoqueInsumoId: true
        }
    });
    return new Set(rows.map((r)=>r.estoqueInsumoId));
}
async function listarOrfaosCmvCatalogo(params) {
    const competenciaSaldo = params.competenciaSaldo || '2026-09';
    const competenciasCompras = params.competenciasCompras || [
        competenciaSaldo
    ];
    const inCfg = await idsNoCatalogoCmv(params.tenantUserId);
    const [saldos, lancs] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.findMany({
            where: {
                userId: params.tenantUserId,
                competencia: competenciaSaldo
            },
            select: {
                estoqueInsumoId: true,
                storeSlug: true,
                qtdFinal: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvLancamento.findMany({
            where: {
                userId: params.tenantUserId,
                competencia: {
                    in: competenciasCompras
                },
                tipo: {
                    in: [
                        'COMPRA_NFE',
                        'COMPRA_MANUAL'
                    ]
                }
            },
            select: {
                estoqueInsumoId: true,
                storeSlug: true,
                valorTotal: true
            }
        })
    ]);
    const orphanIds = new Set();
    for (const s of saldos){
        if (!inCfg.has(s.estoqueInsumoId)) orphanIds.add(s.estoqueInsumoId);
    }
    for (const l of lancs){
        if (!inCfg.has(l.estoqueInsumoId)) orphanIds.add(l.estoqueInsumoId);
    }
    if (orphanIds.size === 0) return [];
    const insumos = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findMany({
        where: {
            id: {
                in: [
                    ...orphanIds
                ]
            }
        },
        select: {
            id: true,
            nome: true,
            unidade: true,
            categoriaId: true
        }
    });
    const byId = new Map(insumos.map((i)=>[
            i.id,
            i
        ]));
    const out = [];
    for (const id of orphanIds){
        const ins = byId.get(id);
        const saldosI = saldos.filter((s)=>s.estoqueInsumoId === id);
        const lancsI = lancs.filter((l)=>l.estoqueInsumoId === id);
        const lojas = [
            ...new Set([
                ...saldosI.map((s)=>s.storeSlug),
                ...lancsI.map((l)=>l.storeSlug)
            ])
        ].sort();
        const qtdSaldoPorLoja = {};
        for (const s of saldosI){
            qtdSaldoPorLoja[s.storeSlug] = Number(s.qtdFinal);
        }
        const comprasValorPorLoja = {};
        for (const l of lancsI){
            comprasValorPorLoja[l.storeSlug] = (comprasValorPorLoja[l.storeSlug] ?? 0) + Number(l.valorTotal);
        }
        const secaoPorNome = secaoFromNomeProduto(ins?.nome || '');
        const secaoFinal = secaoPorNome !== 'MATERIA_PRIMA' ? secaoPorNome : secaoFromCategoriaId(ins?.categoriaId);
        out.push({
            estoqueInsumoId: id,
            nome: ins?.nome || id,
            unidade: unidadeFromEstoque(ins?.unidade),
            secaoSugerida: secaoFinal,
            lojas,
            qtdSaldoPorLoja,
            comprasValorPorLoja,
            comprasValor: lancsI.reduce((a, l)=>a + Number(l.valorTotal), 0)
        });
    }
    out.sort((a, b)=>{
        if (a.secaoSugerida !== b.secaoSugerida) {
            return a.secaoSugerida.localeCompare(b.secaoSugerida);
        }
        return a.nome.localeCompare(b.nome, 'pt-BR');
    });
    return out;
}
async function incluirOrfaosNoCatalogoCmv(params) {
    let incluidos = 0;
    for (const it of params.itens){
        const insumo = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findUnique({
            where: {
                id: it.estoqueInsumoId
            },
            select: {
                unidade: true
            }
        });
        const { created } = await ensureCmvRealInsumoConfig({
            tenantUserId: params.tenantUserId,
            estoqueInsumoId: it.estoqueInsumoId,
            secao: it.secao,
            unidade: it.unidade ?? unidadeFromEstoque(insumo?.unidade)
        });
        if (created) incluidos += 1;
    }
    return {
        incluidos
    };
}
}),
];

//# sourceMappingURL=Demo-2_src_lib_nfe_cmv-catalogo_ts_6ebca337._.js.map