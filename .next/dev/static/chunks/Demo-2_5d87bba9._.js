(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Demo-2/app/estoque/hooks/useProdutosEstoque.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "construirSessoes",
    ()=>construirSessoes,
    "useProdutosEstoque",
    ()=>useProdutosEstoque
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/estoque-nome.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
async function fetchInsumos() {
    const res = await fetch('/api/estoque/insumos', {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
function mapInsumos(data) {
    return data.map((p)=>({
            id: p.id,
            insumoId: p.insumoId,
            nome: p.nome,
            unidade: p.unidade,
            sessaoId: p.categoriaId,
            sessaoNome: p.categoriaNome,
            sessaoIcone: p.categoriaIcone
        }));
}
function construirSessoes(insumos, config = {}, productOrder = []) {
    // Um produto por nome (catálogo compartilhado — evita triplicar por loja)
    const porNome = new Map();
    for (const p of insumos){
        const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(p.nome);
        if (!porNome.has(key)) porNome.set(key, p);
    }
    const unicos = Array.from(porNome.values());
    // Agrupa por categoria
    const categorias = new Map();
    for (const p of unicos){
        if (!categorias.has(p.sessaoId)) {
            categorias.set(p.sessaoId, {
                nome: p.sessaoNome,
                icone: p.sessaoIcone,
                itens: []
            });
        }
        categorias.get(p.sessaoId).itens.push(p);
    }
    return Array.from(categorias.entries()).map(([categoriaId, cat])=>{
        const itens = cat.itens.filter((p)=>{
            const cfg = config[p.insumoId];
            return cfg === undefined || cfg.ativo !== false;
        }).map((p)=>{
            const cfg = config[p.insumoId];
            return {
                insumoId: p.insumoId,
                nome: p.nome,
                unidade: p.unidade,
                quantidadeContada: null,
                estoqueMinimo: cfg?.estoqueMinimo,
                modoContagem: cfg?.modoContagem ?? (p.unidade === 'un' ? 'unidade' : 'kg'),
                kgPorUnidade: cfg?.kgPorUnidade,
                observacao: undefined
            };
        }).sort((a, b)=>{
            if (productOrder.length === 0) return 0;
            const ia = productOrder.indexOf(a.insumoId);
            const ib = productOrder.indexOf(b.insumoId);
            if (ia === -1 && ib === -1) return 0;
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });
        return {
            id: categoriaId,
            nome: cat.nome,
            icone: cat.icone,
            status: 'pendente',
            itens
        };
    }).filter((s)=>s.itens.length > 0);
}
function useProdutosEstoque(config = {}, productOrder = []) {
    _s();
    const [insumos, setInsumos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const requestIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProdutosEstoque.useCallback[load]": async ()=>{
            const reqId = ++requestIdRef.current;
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchInsumos();
                const mapped = mapInsumos(data);
                // Ignora respostas antigas (evita sobrescrever lista após deletes sequenciais)
                if (reqId !== requestIdRef.current) return mapped;
                setInsumos(mapped);
                return mapped;
            } catch (err) {
                if (reqId !== requestIdRef.current) return undefined;
                console.error('[useProdutosEstoque]', err);
                setError('Não foi possível carregar os produtos.');
                return undefined;
            } finally{
                if (reqId === requestIdRef.current) setIsLoading(false);
            }
        }
    }["useProdutosEstoque.useCallback[load]"], []);
    /** Remove da lista local por cuid e/ou slug (evita o item "voltar" no merge). */ const removeLocal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProdutosEstoque.useCallback[removeLocal]": (id, insumoId)=>{
            setInsumos({
                "useProdutosEstoque.useCallback[removeLocal]": (prev)=>prev.filter({
                        "useProdutosEstoque.useCallback[removeLocal]": (p)=>p.id !== id && (!insumoId || p.insumoId !== insumoId)
                    }["useProdutosEstoque.useCallback[removeLocal]"])
            }["useProdutosEstoque.useCallback[removeLocal]"]);
        }
    }["useProdutosEstoque.useCallback[removeLocal]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProdutosEstoque.useEffect": ()=>{
            load();
        }
    }["useProdutosEstoque.useEffect"], [
        load
    ]);
    const sessoes = construirSessoes(insumos, config, productOrder);
    return {
        produtos: insumos,
        sessoes,
        isLoading,
        error,
        refetch: load,
        removeLocal
    };
}
_s(useProdutosEstoque, "/W9U1uBCG72K44vEOOC5nCc5iE0=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/app/estoque/hooks/useEstoqueConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEstoqueConfig",
    ()=>useEstoqueConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
// ── Helpers de persistência ────────────────────────────────────────────────────
async function fetchConfig() {
    const res = await fetch('/api/estoque/config');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
async function patchProduto(produtoId, cfg) {
    await fetch('/api/estoque/config', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'produto',
            produtoId,
            ...cfg
        })
    });
}
async function patchOrdem(order) {
    await fetch('/api/estoque/config', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'ordem',
            order
        })
    });
}
function useEstoqueConfig() {
    _s();
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [productOrder, setProductOrderState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [hydrated, setHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Ref sempre atualizado com o config mais recente — evita closure stale no debounce
    const configRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "useEstoqueConfig.useLayoutEffect": ()=>{
            configRef.current = config;
        }
    }["useEstoqueConfig.useLayoutEffect"]);
    // Debounce refs — evitam request por keystroke
    const debounceMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    // Carrega do banco na montagem
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useEstoqueConfig.useEffect": ()=>{
            fetchConfig().then({
                "useEstoqueConfig.useEffect": ({ configs, order })=>{
                    setConfig(configs);
                    setProductOrderState(order);
                }
            }["useEstoqueConfig.useEffect"]).catch({
                "useEstoqueConfig.useEffect": (err)=>{
                    console.warn('[useEstoqueConfig] Falha ao carregar config:', err.message);
                }
            }["useEstoqueConfig.useEffect"]).finally({
                "useEstoqueConfig.useEffect": ()=>setHydrated(true)
            }["useEstoqueConfig.useEffect"]);
        }
    }["useEstoqueConfig.useEffect"], []);
    // ── Config de produto ────────────────────────────────────────────────────────
    const getConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[getConfig]": (insumoId)=>config[insumoId] ?? {
                ativo: true,
                estoqueMinimo: undefined
            }
    }["useEstoqueConfig.useCallback[getConfig]"], [
        config
    ]);
    /** Atualiza campo(s) de um produto localmente e persiste no banco (debounced) */ const updateProduto = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[updateProduto]": (insumoId, partial, debounceMs = 600)=>{
            setConfig({
                "useEstoqueConfig.useCallback[updateProduto]": (prev)=>({
                        ...prev,
                        [insumoId]: {
                            ...prev[insumoId] ?? {
                                ativo: true
                            },
                            ...partial
                        }
                    })
            }["useEstoqueConfig.useCallback[updateProduto]"]);
            // Usa chave por produto+campo para evitar que uma mudança de campo cancele outra
            const fieldKey = `${insumoId}::${Object.keys(partial).join(',')}`;
            if (debounceMap.current[fieldKey]) {
                clearTimeout(debounceMap.current[fieldKey]);
            }
            debounceMap.current[fieldKey] = setTimeout({
                "useEstoqueConfig.useCallback[updateProduto]": ()=>{
                    // Lê configRef.current no momento do disparo para sempre usar o estado mais recente,
                    // evitando closure stale e perda de campos salvos em paralelo
                    const current = configRef.current[insumoId] ?? {
                        ativo: true
                    };
                    patchProduto(insumoId, {
                        ...current,
                        ...partial
                    }).catch({
                        "useEstoqueConfig.useCallback[updateProduto]": (err)=>console.warn('[useEstoqueConfig] Falha ao salvar config:', err.message)
                    }["useEstoqueConfig.useCallback[updateProduto]"]);
                }
            }["useEstoqueConfig.useCallback[updateProduto]"], debounceMs);
        }
    }["useEstoqueConfig.useCallback[updateProduto]"], // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    const setAtivo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[setAtivo]": (insumoId, ativo)=>updateProduto(insumoId, {
                ativo
            }, 0)
    }["useEstoqueConfig.useCallback[setAtivo]"], [
        updateProduto
    ]);
    const setMinimo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[setMinimo]": (insumoId, estoqueMinimo)=>updateProduto(insumoId, {
                estoqueMinimo
            })
    }["useEstoqueConfig.useCallback[setMinimo]"], [
        updateProduto
    ]);
    const setModoContagem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[setModoContagem]": (insumoId, modoContagem)=>updateProduto(insumoId, {
                modoContagem
            }, 0)
    }["useEstoqueConfig.useCallback[setModoContagem]"], [
        updateProduto
    ]);
    const setKgPorUnidade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[setKgPorUnidade]": (insumoId, kgPorUnidade)=>updateProduto(insumoId, {
                kgPorUnidade
            })
    }["useEstoqueConfig.useCallback[setKgPorUnidade]"], [
        updateProduto
    ]);
    // ── Ordem de produtos ────────────────────────────────────────────────────────
    const setProductOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[setProductOrder]": (order)=>{
            setProductOrderState(order);
            patchOrdem(order).catch({
                "useEstoqueConfig.useCallback[setProductOrder]": (err)=>console.warn('[useEstoqueConfig] Falha ao salvar ordem:', err.message)
            }["useEstoqueConfig.useCallback[setProductOrder]"]);
        }
    }["useEstoqueConfig.useCallback[setProductOrder]"], []);
    const moverProdutoAcima = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[moverProdutoAcima]": (produtoId, allIds)=>{
            setProductOrderState({
                "useEstoqueConfig.useCallback[moverProdutoAcima]": (prev)=>{
                    const ordem = buildOrdem(prev, allIds);
                    const pos = ordem.indexOf(produtoId);
                    if (pos <= 0) return prev;
                    const nova = [
                        ...ordem
                    ];
                    [nova[pos - 1], nova[pos]] = [
                        nova[pos],
                        nova[pos - 1]
                    ];
                    patchOrdem(nova).catch({
                        "useEstoqueConfig.useCallback[moverProdutoAcima]": ()=>{}
                    }["useEstoqueConfig.useCallback[moverProdutoAcima]"]);
                    return nova;
                }
            }["useEstoqueConfig.useCallback[moverProdutoAcima]"]);
        }
    }["useEstoqueConfig.useCallback[moverProdutoAcima]"], []);
    const moverProdutoAbaixo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[moverProdutoAbaixo]": (produtoId, allIds)=>{
            setProductOrderState({
                "useEstoqueConfig.useCallback[moverProdutoAbaixo]": (prev)=>{
                    const ordem = buildOrdem(prev, allIds);
                    const pos = ordem.indexOf(produtoId);
                    if (pos === -1 || pos >= ordem.length - 1) return prev;
                    const nova = [
                        ...ordem
                    ];
                    [nova[pos], nova[pos + 1]] = [
                        nova[pos + 1],
                        nova[pos]
                    ];
                    patchOrdem(nova).catch({
                        "useEstoqueConfig.useCallback[moverProdutoAbaixo]": ()=>{}
                    }["useEstoqueConfig.useCallback[moverProdutoAbaixo]"]);
                    return nova;
                }
            }["useEstoqueConfig.useCallback[moverProdutoAbaixo]"]);
        }
    }["useEstoqueConfig.useCallback[moverProdutoAbaixo]"], []);
    return {
        config,
        productOrder,
        hydrated,
        getConfig,
        setAtivo,
        setMinimo,
        setModoContagem,
        setKgPorUnidade,
        setProductOrder,
        moverProdutoAcima,
        moverProdutoAbaixo
    };
}
_s(useEstoqueConfig, "a1MA8REJZAfKg7HaJGWKto8/mGs=");
// ── Util: garante que todos os IDs aparecem na ordem ────────────────────────────
function buildOrdem(prev, allIds) {
    const seen = new Set(prev);
    const extra = allIds.filter((id)=>!seen.has(id));
    return [
        ...prev.filter((id)=>allIds.includes(id)),
        ...extra
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/app/estoque/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Formata uma quantidade numérica removendo casas decimais desnecessárias.
 * Limita a 3 casas decimais e elimina zeros à direita.
 * Ex: 3.3333333 → "3.333" | 2.5 → "2.5" | 4.0 → "4"
 */ __turbopack_context__.s([
    "formatQtd",
    ()=>formatQtd
]);
function formatQtd(value, casas = 3) {
    if (value === null) return '—';
    return parseFloat(value.toFixed(casas)).toString().replace('.', ',');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/app/estoque/pages/Historico.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Historico",
    ()=>Historico
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function formatarDataCurta(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}
function formatarDataLonga(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}
function formatarHora(iso) {
    return new Date(iso).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
function EtiquetaLoja({ nome }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center gap-1 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                className: "w-3 h-3"
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            nome
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c = EtiquetaLoja;
function EtiquetaData({ iso }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center gap-1 text-xs font-medium text-gray-300 bg-[#2a2a2e] border border-[#3a3a3e] px-2 py-0.5 rounded-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                className: "w-3 h-3 text-gray-500"
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            formatarDataCurta(iso)
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_c1 = EtiquetaData;
function Historico({ sessions, onVoltar, onRetomar, onExcluir, onVerResultado }) {
    _s();
    const [detalheId, setDetalheId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const ordenadas = [
        ...sessions
    ].sort((a, b)=>new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
    const detalhe = sessions.find((s)=>s.id === detalheId);
    // ── Tela de detalhe ────────────────────────────────────────────────────────
    if (detalhe) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#0a0a0a] flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-4 pt-12 pb-4 flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setDetalheId(null),
                            className: "p-2 -ml-2 text-gray-400 hover:text-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-bold text-white",
                                    children: formatarDataLonga(detalhe.dataCriacao)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-2 mt-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EtiquetaData, {
                                            iso: detalhe.dataCriacao
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this),
                                        detalhe.lojaNome ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EtiquetaLoja, {
                                            nome: detalhe.lojaNome
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                            lineNumber: 78,
                                            columnNumber: 35
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500 mt-1",
                                    children: [
                                        formatarHora(detalhe.dataCriacao),
                                        ' · ',
                                        detalhe.sessoes.length,
                                        " sessões"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        detalhe.status === 'em_andamento' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                onRetomar(detalhe.id);
                                setDetalheId(null);
                            },
                            className: "text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl px-3 py-1.5",
                            children: "Continuar"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                            lineNumber: 87,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-lg mx-auto w-full",
                    children: [
                        detalhe.sessoes.map((cat)=>{
                            const alertas = cat.itens.filter((i)=>i.quantidadeContada !== null && i.estoqueMinimo !== undefined && i.quantidadeContada < i.estoqueMinimo).length;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `rounded-2xl border p-4 ${cat.status === 'concluida' ? 'bg-green-500/5 border-green-500/20' : 'bg-[#1c1c1e] border-[#2a2a2e]'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: cat.icone
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                lineNumber: 104,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white text-sm flex-1",
                                                children: cat.nome
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                lineNumber: 105,
                                                columnNumber: 19
                                            }, this),
                                            cat.status === 'concluida' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "w-4 h-4 text-green-400"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                lineNumber: 106,
                                                columnNumber: 50
                                            }, this),
                                            alertas > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-amber-400",
                                                children: [
                                                    "⚠ ",
                                                    alertas
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                lineNumber: 107,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                        lineNumber: 103,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-1.5",
                                        children: cat.itens.map((item)=>{
                                            const abaixo = item.quantidadeContada !== null && item.estoqueMinimo !== undefined && item.quantidadeContada < item.estoqueMinimo;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-xs gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500 truncate",
                                                                children: item.nome
                                                            }, void 0, false, {
                                                                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                                lineNumber: 115,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `font-medium shrink-0 ${item.quantidadeContada === null ? 'text-gray-700' : abaixo ? 'text-amber-400' : 'text-white'}`,
                                                                children: [
                                                                    item.quantidadeContada === null ? '—' : `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatQtd"])(item.quantidadeContada)} ${item.unidade}`,
                                                                    abaixo && ' ⚠'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                                lineNumber: 116,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                        lineNumber: 114,
                                                        columnNumber: 25
                                                    }, this),
                                                    item.observacao && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-amber-400/70 italic pl-1",
                                                        children: [
                                                            "💬 ",
                                                            item.observacao
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                        lineNumber: 122,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, item.insumoId, true, {
                                                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                lineNumber: 113,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                        lineNumber: 109,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, cat.id, true, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                lineNumber: 102,
                                columnNumber: 15
                            }, this);
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-6"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this);
    }
    // ── Lista de contagens ─────────────────────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-4 pt-12 pb-4 flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onVoltar,
                        className: "p-2 -ml-2 text-gray-400 hover:text-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-bold text-white text-lg",
                        children: "Histórico"
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto px-4 py-4 space-y-2 max-w-lg mx-auto w-full",
                children: [
                    ordenadas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center py-20 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-4xl mb-3",
                                children: "📋"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-white font-semibold",
                                children: "Nenhuma contagem ainda"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 mt-1",
                                children: "Inicie uma nova contagem na tela principal"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                        lineNumber: 149,
                        columnNumber: 11
                    }, this) : ordenadas.map((s)=>{
                        const concluidas = s.sessoes.filter((c)=>c.status === 'concluida').length;
                        const alertas = s.sessoes.flatMap((cat)=>cat.itens.filter((i)=>i.quantidadeContada !== null && i.estoqueMinimo !== undefined && i.quantidadeContada < i.estoqueMinimo)).length;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-4 flex items-center gap-3",
                            children: [
                                s.status === 'concluida' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                    className: "w-5 h-5 text-green-400 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                    lineNumber: 164,
                                    columnNumber: 21
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                    className: "w-5 h-5 text-amber-400 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                    lineNumber: 165,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        if (s.status === 'concluida') {
                                            onVerResultado(s);
                                        } else {
                                            setDetalheId(s.id);
                                        }
                                    },
                                    className: "flex-1 text-left min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap items-center gap-1.5 mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EtiquetaData, {
                                                    iso: s.dataCriacao
                                                }, void 0, false, {
                                                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 21
                                                }, this),
                                                s.lojaNome ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EtiquetaLoja, {
                                                    nome: s.lojaNome
                                                }, void 0, false, {
                                                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 35
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                            lineNumber: 174,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500",
                                            children: [
                                                s.status === 'em_andamento' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-amber-400",
                                                    children: "Em andamento · "
                                                }, void 0, false, {
                                                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 23
                                                }, this) : null,
                                                formatarHora(s.dataCriacao),
                                                ' · ',
                                                concluidas,
                                                "/",
                                                s.sessoes.length,
                                                " sessões",
                                                alertas > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 text-amber-400",
                                                    children: [
                                                        "⚠ ",
                                                        alertas
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                                    lineNumber: 185,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                            lineNumber: 178,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                    lineNumber: 167,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "w-4 h-4 text-gray-600 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                    lineNumber: 189,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        onExcluir(s.id);
                                    },
                                    className: "p-2 text-gray-600 hover:text-red-400 transition-colors shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                        lineNumber: 195,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                                    lineNumber: 191,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, s.id, true, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                            lineNumber: 162,
                            columnNumber: 15
                        }, this);
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-6"
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/estoque/pages/Historico.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
}
_s(Historico, "3YchRoFoIVAt39WZNrs49q6V0Kc=");
_c2 = Historico;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "EtiquetaLoja");
__turbopack_context__.k.register(_c1, "EtiquetaData");
__turbopack_context__.k.register(_c2, "Historico");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/app/(app)/estoque/historico/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EstoqueHistoricoPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/hooks/useStockSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/hooks/useProdutosEstoque.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useEstoqueConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/hooks/useEstoqueConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$pages$2f$Historico$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/pages/Historico.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function EstoqueHistoricoPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { config, productOrder, hydrated: configHydrated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useEstoqueConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEstoqueConfig"])();
    const { sessions, hydrated, retomarContagem, excluirContagem, flushPendingSavesAsync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStockSession"])();
    const { produtos, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProdutosEstoque"])(config, productOrder);
    if (!hydrated || !configHydrated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center py-20 gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/estoque/historico/page.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-muted-foreground",
                    children: "Carregando…"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/estoque/historico/page.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/(app)/estoque/historico/page.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    const handleRetomar = async (sessionId)=>{
        const insumosAtualizados = await refetch();
        const catalogo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["construirSessoes"])(insumosAtualizados ?? produtos, config, productOrder);
        retomarContagem(sessionId, catalogo);
        await flushPendingSavesAsync();
        router.push(`/estoque/contagem/${sessionId}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$pages$2f$Historico$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Historico"], {
        sessions: sessions,
        onVoltar: ()=>router.push('/estoque'),
        onRetomar: handleRetomar,
        onExcluir: excluirContagem,
        onVerResultado: (s)=>router.push(`/estoque/resultado/${s.id}`)
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/(app)/estoque/historico/page.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(EstoqueHistoricoPage, "9b1BqVPZ7t27OICI37fWH/48Bmc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useEstoqueConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEstoqueConfig"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStockSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProdutosEstoque"]
    ];
});
_c = EstoqueHistoricoPage;
var _c;
__turbopack_context__.k.register(_c, "EstoqueHistoricoPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>CircleCheck
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "path",
        {
            d: "m9 12 2 2 4-4",
            key: "dzmm74"
        }
    ]
];
const CircleCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("circle-check", __iconNode);
;
 //# sourceMappingURL=circle-check.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CheckCircle2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Trash2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M10 11v6",
            key: "nco0om"
        }
    ],
    [
        "path",
        {
            d: "M14 11v6",
            key: "outv1u"
        }
    ],
    [
        "path",
        {
            d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
            key: "miytrc"
        }
    ],
    [
        "path",
        {
            d: "M3 6h18",
            key: "d0wm0j"
        }
    ],
    [
        "path",
        {
            d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
            key: "e791ji"
        }
    ]
];
const Trash2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("trash-2", __iconNode);
;
 //# sourceMappingURL=trash-2.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Trash2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Store
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5",
            key: "slp6dd"
        }
    ],
    [
        "path",
        {
            d: "M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244",
            key: "o0xfot"
        }
    ],
    [
        "path",
        {
            d: "M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05",
            key: "wn3emo"
        }
    ]
];
const Store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("store", __iconNode);
;
 //# sourceMappingURL=store.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Store",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>CalendarDays
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M8 2v4",
            key: "1cmpym"
        }
    ],
    [
        "path",
        {
            d: "M16 2v4",
            key: "4m81vk"
        }
    ],
    [
        "rect",
        {
            width: "18",
            height: "18",
            x: "3",
            y: "4",
            rx: "2",
            key: "1hopcy"
        }
    ],
    [
        "path",
        {
            d: "M3 10h18",
            key: "8toen8"
        }
    ],
    [
        "path",
        {
            d: "M8 14h.01",
            key: "6423bh"
        }
    ],
    [
        "path",
        {
            d: "M12 14h.01",
            key: "1etili"
        }
    ],
    [
        "path",
        {
            d: "M16 14h.01",
            key: "1gbofw"
        }
    ],
    [
        "path",
        {
            d: "M8 18h.01",
            key: "lrp35t"
        }
    ],
    [
        "path",
        {
            d: "M12 18h.01",
            key: "mhygvu"
        }
    ],
    [
        "path",
        {
            d: "M16 18h.01",
            key: "kzsmim"
        }
    ]
];
const CalendarDays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("calendar-days", __iconNode);
;
 //# sourceMappingURL=calendar-days.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CalendarDays",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=Demo-2_5d87bba9._.js.map