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
"[project]/Demo-2/app/estoque/components/HomeScreen.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HomeScreen",
    ()=>HomeScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function formatarData(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function HomeScreen({ sessions, onIniciar, onRetomar, onExcluir }) {
    _s();
    const [confirmandoId, setConfirmandoId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const emAndamento = sessions.filter((s)=>s.status === 'em_andamento');
    const concluidas = sessions.filter((s)=>s.status === 'concluida');
    const temAtiva = emAndamento.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-5 pt-12 pb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                className: "w-5 h-5 text-amber-400"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                lineNumber: 37,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-xl font-bold text-white",
                                    children: "Plateful Estoque"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500",
                                    children: "Contagem semanal de insumos"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                    lineNumber: 41,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 px-4 py-6 space-y-5 max-w-lg mx-auto w-full",
                children: [
                    emAndamento.map((s)=>{
                        const total = s.sessoes.length;
                        const concluidas = s.sessoes.filter((c)=>c.status === 'concluida').length;
                        const pct = total > 0 ? Math.round(concluidas / total * 100) : 0;
                        const confirmando = confirmandoId === s.id;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-semibold text-amber-400 uppercase tracking-wider",
                                                    children: "Em andamento"
                                                }, void 0, false, {
                                                    fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                    lineNumber: 60,
                                                    columnNumber: 19
                                                }, this),
                                                s.lojaNome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-amber-300/70 mt-0.5",
                                                    children: s.lojaNome
                                                }, void 0, false, {
                                                    fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                    lineNumber: 64,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                            lineNumber: 59,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-gray-500",
                                            children: formatarData(s.dataCriacao)
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                    lineNumber: 58,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "my-3 h-2 bg-[#2a2a2e] rounded-full overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-full bg-amber-500 rounded-full transition-all",
                                        style: {
                                            width: `${pct}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                        lineNumber: 72,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-amber-300",
                                            children: [
                                                concluidas,
                                                "/",
                                                total,
                                                " sessões concluídas"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                            lineNumber: 79,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                confirmando ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setConfirmandoId(null),
                                                            className: "text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-[#3a3a3e] transition-colors",
                                                            children: "Cancelar"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                            lineNumber: 85,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                onExcluir(s.id);
                                                                setConfirmandoId(null);
                                                            },
                                                            className: "flex items-center gap-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold px-3 py-1.5 rounded-lg border border-red-500/30 transition-colors",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    className: "w-3.5 h-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                                    lineNumber: 95,
                                                                    columnNumber: 25
                                                                }, this),
                                                                "Apagar"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                            lineNumber: 91,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setConfirmandoId(s.id),
                                                    className: "p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors",
                                                    title: "Apagar contagem",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                        lineNumber: 105,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                    lineNumber: 100,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>onRetomar(s.id),
                                                    className: "flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black font-semibold text-sm rounded-xl px-4 py-2 transition-colors",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                            lineNumber: 112,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Continuar"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                            lineNumber: 82,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                    lineNumber: 78,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, s.id, true, {
                            fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, this);
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onIniciar,
                        className: "w-full bg-[#1c1c1e] border-2 border-dashed border-amber-500/40 hover:border-amber-500/80 hover:bg-amber-500/5 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all active:scale-[0.98]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "w-7 h-7 text-amber-400"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-white text-base",
                                        children: temAtiva ? 'Iniciar contagem para outra loja' : 'Iniciar nova contagem'
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                        lineNumber: 130,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: new Date().toLocaleDateString('pt-BR', {
                                            weekday: 'long',
                                            day: '2-digit',
                                            month: 'long'
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    concluidas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3",
                                children: "Últimas contagens"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: concluidas.slice(0, 3).map((s)=>{
                                    const alertas = s.sessoes.flatMap((cat)=>cat.itens.filter((i)=>i.quantidadeContada !== null && i.estoqueMinimo !== undefined && i.quantidadeContada < i.estoqueMinimo)).length;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-xl px-4 py-3 flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "w-4 h-4 text-green-400 shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                lineNumber: 158,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-white font-medium",
                                                        children: [
                                                            new Date(s.dataCriacao).toLocaleDateString('pt-BR', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            }),
                                                            s.lojaNome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-xs font-normal text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md",
                                                                children: s.lojaNome
                                                            }, void 0, false, {
                                                                fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                                lineNumber: 165,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                        lineNumber: 160,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-500 mt-0.5",
                                                        children: [
                                                            s.sessoes.length,
                                                            " sessões",
                                                            alertas > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-amber-500",
                                                                children: [
                                                                    "⚠ ",
                                                                    alertas,
                                                                    " alerta",
                                                                    alertas !== 1 ? 's' : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                                lineNumber: 173,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                                lineNumber: 159,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, s.id, true, {
                                        fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                        lineNumber: 154,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-700 text-center pb-4",
                        children: "Dados salvos no banco de dados"
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/estoque/components/HomeScreen.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_s(HomeScreen, "9g9Lmn4d88Y76szdMchPc9sQnUg=");
_c = HomeScreen;
var _c;
__turbopack_context__.k.register(_c, "HomeScreen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/app/(app)/estoque/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EstoqueVisaoGeralPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/hooks/useStockSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/hooks/useProdutosEstoque.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useEstoqueConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/hooks/useEstoqueConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$components$2f$HomeScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/components/HomeScreen.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function EstoqueVisaoGeralPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [showLojaModal, setShowLojaModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lojas, setLojas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingLojas, setLoadingLojas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { config, productOrder, hydrated: configHydrated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useEstoqueConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEstoqueConfig"])();
    const { sessions, hydrated, iniciarContagem, retomarContagem, excluirContagem, flushPendingSavesAsync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStockSession"])();
    const { produtos, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProdutosEstoque"])(config, productOrder);
    if (!hydrated || !configHydrated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center py-20 gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-muted-foreground",
                    children: "Carregando…"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this);
    }
    const abrirSelecaoLoja = async ()=>{
        setLoadingLojas(true);
        setShowLojaModal(true);
        try {
            const res = await fetch('/api/rh/lojas');
            if (res.ok) setLojas(await res.json());
        } catch  {
        /* silencia */ } finally{
            setLoadingLojas(false);
        }
    };
    const handleIniciarComLoja = async (lojaNome)=>{
        setShowLojaModal(false);
        const insumosAtualizados = await refetch();
        const sessoesIniciais = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["construirSessoes"])(insumosAtualizados ?? produtos, config, productOrder);
        const session = await iniciarContagem(sessoesIniciais, 'Gerente', false, lojaNome);
        await flushPendingSavesAsync();
        router.push(`/estoque/contagem/${session.id}`);
    };
    const handleRetomar = async (sessionId)=>{
        const insumosAtualizados = await refetch();
        const catalogo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["construirSessoes"])(insumosAtualizados ?? produtos, config, productOrder);
        retomarContagem(sessionId, catalogo);
        await flushPendingSavesAsync();
        router.push(`/estoque/contagem/${sessionId}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            showLojaModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl w-full max-w-sm shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-5 pt-5 pb-3 border-b border-[#2a2a2e]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-base font-semibold text-white",
                                    children: "Qual loja está sendo contada?"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                                    lineNumber: 90,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500 mt-0.5",
                                    children: "Selecione para identificar o histórico"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                                    lineNumber: 93,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                            lineNumber: 89,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 space-y-1.5 max-h-72 overflow-y-auto",
                            children: loadingLojas ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center py-6 gap-2 text-gray-500 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                                        lineNumber: 100,
                                        columnNumber: 19
                                    }, this),
                                    "Carregando lojas…"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                                lineNumber: 99,
                                columnNumber: 17
                            }, this) : lojas.length > 0 ? lojas.map((loja)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleIniciarComLoja(loja.nome),
                                    className: "w-full text-left px-4 py-3 rounded-xl bg-[#2a2a2e] hover:bg-amber-500/10 hover:border-amber-500/30 border border-transparent text-white text-sm font-medium transition-all",
                                    children: loja.nome
                                }, loja.id, false, {
                                    fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                                    lineNumber: 105,
                                    columnNumber: 19
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 text-center py-4",
                                children: "Nenhuma loja cadastrada no RH"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                                lineNumber: 115,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                            lineNumber: 97,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-3 pb-3 pt-1 border-t border-[#2a2a2e]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleIniciarComLoja(undefined),
                                className: "w-full py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-[#2a2a2e] transition-colors",
                                children: "Continuar sem selecionar loja"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                                lineNumber: 121,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                            lineNumber: 120,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                    lineNumber: 88,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$components$2f$HomeScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HomeScreen"], {
                sessions: sessions,
                onIniciar: abrirSelecaoLoja,
                onRetomar: handleRetomar,
                onExcluir: excluirContagem
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/(app)/estoque/page.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_s(EstoqueVisaoGeralPage, "dcb0fkMWBweDpvjYEgbMbVg0gOQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useEstoqueConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEstoqueConfig"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStockSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProdutosEstoque"]
    ];
});
_c = EstoqueVisaoGeralPage;
var _c;
__turbopack_context__.k.register(_c, "EstoqueVisaoGeralPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>ClipboardList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "8",
            height: "4",
            x: "8",
            y: "2",
            rx: "1",
            ry: "1",
            key: "tgr4d6"
        }
    ],
    [
        "path",
        {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
            key: "116196"
        }
    ],
    [
        "path",
        {
            d: "M12 11h4",
            key: "1jrz19"
        }
    ],
    [
        "path",
        {
            d: "M12 16h4",
            key: "n85exb"
        }
    ],
    [
        "path",
        {
            d: "M8 11h.01",
            key: "1dfujw"
        }
    ],
    [
        "path",
        {
            d: "M8 16h.01",
            key: "18s6g9"
        }
    ]
];
const ClipboardList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("clipboard-list", __iconNode);
;
 //# sourceMappingURL=clipboard-list.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClipboardList",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>RotateCcw
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
            key: "1357e3"
        }
    ],
    [
        "path",
        {
            d: "M3 3v5h5",
            key: "1xhq8a"
        }
    ]
];
const RotateCcw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("rotate-ccw", __iconNode);
;
 //# sourceMappingURL=rotate-ccw.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RotateCcw",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>Plus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M5 12h14",
            key: "1ays0h"
        }
    ],
    [
        "path",
        {
            d: "M12 5v14",
            key: "s699le"
        }
    ]
];
const Plus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("plus", __iconNode);
;
 //# sourceMappingURL=plus.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Plus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript)");
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
]);

//# sourceMappingURL=Demo-2_6bbeb76c._.js.map