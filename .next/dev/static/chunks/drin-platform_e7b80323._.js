(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/drin-platform/src/lib/estoque-nome.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Normaliza nome para comparar duplicatas (ex.: "Creme de Morango" ≈ "CREME DE MORANGO"). */ __turbopack_context__.s([
    "dedupeInsumosByNome",
    ()=>dedupeInsumosByNome,
    "normalizarNomeInsumo",
    ()=>normalizarNomeInsumo,
    "slugifyInsumoNome",
    ()=>slugifyInsumoNome
]);
function normalizarNomeInsumo(nome) {
    return nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}
function slugifyInsumoNome(nome) {
    return nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function dedupeInsumosByNome(items, tenantUserId) {
    const byNome = new Map();
    const prefer = (a, b)=>{
        if (a.userId === tenantUserId && b.userId !== tenantUserId) return a;
        if (b.userId === tenantUserId && a.userId !== tenantUserId) return b;
        if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt) <= new Date(b.createdAt) ? a : b;
        }
        return a;
    };
    for (const item of items){
        const key = normalizarNomeInsumo(item.nome);
        const prev = byNome.get(key);
        byNome.set(key, prev ? prefer(prev, item) : item);
    }
    return Array.from(byNome.values());
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/estoque/hooks/useStockSession.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mesclarCatalogoNasSessoes",
    ()=>mesclarCatalogoNasSessoes,
    "useStockSession",
    ()=>useStockSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/estoque-nome.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
/** Colapsa itens com o mesmo nome na sessão (ex.: triplicados por loja). */ function dedupeItensPorNome(itens) {
    const byNome = new Map();
    for (const item of itens){
        const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(item.nome);
        const prev = byNome.get(key);
        if (!prev) {
            byNome.set(key, item);
            continue;
        }
        // Prefere o que já tem quantidade contada
        if (prev.quantidadeContada === null && item.quantidadeContada !== null) {
            byNome.set(key, item);
        }
    }
    return Array.from(byNome.values());
}
// ── Helpers de API ─────────────────────────────────────────────────────────────
async function apiGet() {
    const res = await fetch('/api/estoque/contagens');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
async function apiPost(sessoes, criadoPor, lojaNome) {
    const res = await fetch('/api/estoque/contagens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sessoes,
            criadoPor,
            lojaNome
        })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
async function apiPatch(id, patch, keepalive = false) {
    const res = await fetch(`/api/estoque/contagens/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patch),
        keepalive
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
async function apiDelete(id) {
    await fetch(`/api/estoque/contagens/${id}`, {
        method: 'DELETE'
    });
}
function mesclarCatalogoNasSessoes(atuais, catalogo) {
    let changed = false;
    // 1) Colapsa triplicatas de nome já gravadas no snapshot
    let result = atuais.map((c)=>{
        const itens = dedupeItensPorNome(c.itens);
        if (itens.length !== c.itens.length) changed = true;
        return {
            ...c,
            itens
        };
    });
    const catalogIds = new Set(catalogo.flatMap((c)=>c.itens.map((i)=>i.insumoId)));
    const catalogNomes = new Set(catalogo.flatMap((c)=>c.itens.map((i)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(i.nome))));
    // 2) Remove da contagem o que não está mais no catálogo (delete / desativado)
    result = result.map((cat)=>{
        const itens = cat.itens.filter((i)=>catalogIds.has(i.insumoId) || catalogNomes.has((0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(i.nome)));
        if (itens.length !== cat.itens.length) changed = true;
        return {
            ...cat,
            itens
        };
    }).filter((cat)=>{
        if (cat.itens.length === 0) {
            changed = true;
            return false;
        }
        return true;
    });
    // 3) Inclui produtos novos do catálogo
    const presentesIds = new Set(result.flatMap((c)=>c.itens.map((i)=>i.insumoId)));
    const presentesNomes = new Set(result.flatMap((c)=>c.itens.map((i)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(i.nome))));
    for (const catCatalogo of catalogo){
        const novos = catCatalogo.itens.filter((i)=>!presentesIds.has(i.insumoId) && !presentesNomes.has((0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(i.nome))).map((i)=>({
                ...i,
                quantidadeContada: null
            }));
        if (novos.length === 0) continue;
        const idx = result.findIndex((c)=>c.id === catCatalogo.id);
        if (idx === -1) {
            result.push({
                ...catCatalogo,
                status: 'pendente',
                itens: novos
            });
        } else {
            const cat = result[idx];
            result[idx] = {
                ...cat,
                itens: [
                    ...cat.itens,
                    ...novos
                ],
                status: cat.status === 'concluida' ? 'pendente' : cat.status
            };
        }
        for (const i of novos){
            presentesIds.add(i.insumoId);
            presentesNomes.add((0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(i.nome));
        }
        changed = true;
    }
    return {
        sessoes: result,
        changed
    };
}
function useStockSession() {
    _s();
    const [sessions, setSessions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeSessionId, setActiveSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hydrated, setHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saveStatus, setSaveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    // Fila de salvamento: armazena apenas o estado mais recente por sessão.
    // Descarta estados intermediários — só o último importa.
    const pendingSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    // Conjunto de sessões com loop de drain em execução
    const savingIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    // Timer para resetar o status "salvo" para "idle"
    const savedTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ── Fila sequencial de saves ────────────────────────────────────────────────
    const scheduleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStockSession.useCallback[scheduleSave]": (sessionId, patch)=>{
            // Sobrescreve qualquer estado pendente — apenas o mais recente é enviado
            pendingSave.current.set(sessionId, patch);
            // Se já há um drain em andamento para esta sessão, ele vai pegar o novo estado
            if (savingIds.current.has(sessionId)) return;
            const drain = {
                "useStockSession.useCallback[scheduleSave].drain": async ()=>{
                    savingIds.current.add(sessionId);
                    // Cancela timer de "salvo" para não sobrepor o status "salvando"
                    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
                    setSaveStatus('saving');
                    while(pendingSave.current.has(sessionId)){
                        const next = pendingSave.current.get(sessionId);
                        pendingSave.current.delete(sessionId);
                        try {
                            await apiPatch(sessionId, next);
                            // Só mostra "salvo" se não há mais nada na fila
                            if (!pendingSave.current.has(sessionId)) {
                                setSaveStatus('saved');
                                savedTimerRef.current = setTimeout({
                                    "useStockSession.useCallback[scheduleSave].drain": ()=>setSaveStatus('idle')
                                }["useStockSession.useCallback[scheduleSave].drain"], 2500);
                            }
                        } catch  {
                            setSaveStatus('error');
                            // Uma tentativa de retry após 2 segundos
                            await new Promise({
                                "useStockSession.useCallback[scheduleSave].drain": (r)=>setTimeout(r, 2000)
                            }["useStockSession.useCallback[scheduleSave].drain"]);
                            try {
                                await apiPatch(sessionId, next);
                                if (!pendingSave.current.has(sessionId)) {
                                    setSaveStatus('saved');
                                    savedTimerRef.current = setTimeout({
                                        "useStockSession.useCallback[scheduleSave].drain": ()=>setSaveStatus('idle')
                                    }["useStockSession.useCallback[scheduleSave].drain"], 2500);
                                }
                            } catch (err) {
                                console.error('[Estoque] Falha definitiva ao salvar contagem:', err);
                                setSaveStatus('error');
                            }
                        }
                    }
                    savingIds.current.delete(sessionId);
                }
            }["useStockSession.useCallback[scheduleSave].drain"];
            drain();
        }
    }["useStockSession.useCallback[scheduleSave]"], []);
    // ── Flush garantido ao sair/minimizar ──────────────────────────────────────
    // Usa fetch com keepalive:true — o browser garante o envio mesmo durante unload
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useStockSession.useEffect": ()=>{
            const flushAll = {
                "useStockSession.useEffect.flushAll": ()=>{
                    for (const [id, patch] of pendingSave.current.entries()){
                        fetch(`/api/estoque/contagens/${id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(patch),
                            keepalive: true
                        }).catch({
                            "useStockSession.useEffect.flushAll": ()=>{}
                        }["useStockSession.useEffect.flushAll"]);
                    }
                    pendingSave.current.clear();
                }
            }["useStockSession.useEffect.flushAll"];
            const onVisibility = {
                "useStockSession.useEffect.onVisibility": ()=>{
                    if (document.visibilityState === 'hidden') flushAll();
                }
            }["useStockSession.useEffect.onVisibility"];
            document.addEventListener('visibilitychange', onVisibility);
            window.addEventListener('beforeunload', flushAll);
            return ({
                "useStockSession.useEffect": ()=>{
                    document.removeEventListener('visibilitychange', onVisibility);
                    window.removeEventListener('beforeunload', flushAll);
                    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
                }
            })["useStockSession.useEffect"];
        }
    }["useStockSession.useEffect"], []);
    // Carrega sessões do banco ao montar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useStockSession.useEffect": ()=>{
            apiGet().then({
                "useStockSession.useEffect": (data)=>{
                    setSessions(data);
                    const emAndamento = data.find({
                        "useStockSession.useEffect.emAndamento": (s)=>s.status === 'em_andamento'
                    }["useStockSession.useEffect.emAndamento"]);
                    if (emAndamento) setActiveSessionId(emAndamento.id);
                }
            }["useStockSession.useEffect"]).catch({
                "useStockSession.useEffect": (err)=>console.error('[Estoque] Falha ao carregar contagens:', err)
            }["useStockSession.useEffect"]).finally({
                "useStockSession.useEffect": ()=>setHydrated(true)
            }["useStockSession.useEffect"]);
        }
    }["useStockSession.useEffect"], []);
    const activeSession = sessions.find((s)=>s.id === activeSessionId) ?? null;
    // ── Criar nova contagem ────────────────────────────────────────────────────
    const iniciarContagem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStockSession.useCallback[iniciarContagem]": async (sessoesIniciais, gerente = 'Gerente', forceNew = false, lojaNome)=>{
            const existente = sessions.find({
                "useStockSession.useCallback[iniciarContagem].existente": (s)=>s.status === 'em_andamento' && s.lojaNome === (lojaNome ?? null)
            }["useStockSession.useCallback[iniciarContagem].existente"]);
            if (existente && !forceNew) {
                // Contagem em andamento: sincroniza catálogo (adds + deletes) no snapshot
                const { sessoes, changed } = mesclarCatalogoNasSessoes(existente.sessoes, sessoesIniciais ?? []);
                if (changed) {
                    const updated = {
                        ...existente,
                        sessoes
                    };
                    setSessions({
                        "useStockSession.useCallback[iniciarContagem]": (prev)=>prev.map({
                                "useStockSession.useCallback[iniciarContagem]": (s)=>s.id === existente.id ? updated : s
                            }["useStockSession.useCallback[iniciarContagem]"])
                    }["useStockSession.useCallback[iniciarContagem]"]);
                    scheduleSave(existente.id, {
                        sessoes
                    });
                    setActiveSessionId(existente.id);
                    return updated;
                }
                setActiveSessionId(existente.id);
                return existente;
            }
            if (existente && forceNew) {
                await apiDelete(existente.id);
                setSessions({
                    "useStockSession.useCallback[iniciarContagem]": (prev)=>prev.filter({
                            "useStockSession.useCallback[iniciarContagem]": (s)=>s.id !== existente.id
                        }["useStockSession.useCallback[iniciarContagem]"])
                }["useStockSession.useCallback[iniciarContagem]"]);
            }
            const nova = await apiPost(sessoesIniciais ?? [], gerente, lojaNome);
            setSessions({
                "useStockSession.useCallback[iniciarContagem]": (prev)=>[
                        nova,
                        ...prev
                    ]
            }["useStockSession.useCallback[iniciarContagem]"]);
            setActiveSessionId(nova.id);
            return nova;
        }
    }["useStockSession.useCallback[iniciarContagem]"], [
        sessions,
        scheduleSave
    ]);
    // ── Retomar contagem existente ─────────────────────────────────────────────
    const retomarContagem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStockSession.useCallback[retomarContagem]": (sessionId, catalogo)=>{
            // catalogo definido (mesmo vazio) = sincronizar com a lista atual de produtos
            if (catalogo) {
                setSessions({
                    "useStockSession.useCallback[retomarContagem]": (prev)=>{
                        const session = prev.find({
                            "useStockSession.useCallback[retomarContagem].session": (s)=>s.id === sessionId
                        }["useStockSession.useCallback[retomarContagem].session"]);
                        if (!session || session.status !== 'em_andamento') return prev;
                        const { sessoes, changed } = mesclarCatalogoNasSessoes(session.sessoes, catalogo);
                        if (!changed) return prev;
                        scheduleSave(sessionId, {
                            sessoes
                        });
                        return prev.map({
                            "useStockSession.useCallback[retomarContagem]": (s)=>s.id === sessionId ? {
                                    ...s,
                                    sessoes
                                } : s
                        }["useStockSession.useCallback[retomarContagem]"]);
                    }
                }["useStockSession.useCallback[retomarContagem]"]);
            }
            setActiveSessionId(sessionId);
        }
    }["useStockSession.useCallback[retomarContagem]"], [
        scheduleSave
    ]);
    // ── Fechar sessão ativa (sem concluir) ────────────────────────────────────
    const fecharContagem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStockSession.useCallback[fecharContagem]": ()=>{
            setActiveSessionId(null);
        }
    }["useStockSession.useCallback[fecharContagem]"], []);
    // ── Mutação + agendamento na fila ─────────────────────────────────────────
    const mutarSessaoAtiva = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStockSession.useCallback[mutarSessaoAtiva]": (mutate)=>{
            setSessions({
                "useStockSession.useCallback[mutarSessaoAtiva]": (prev)=>{
                    const session = prev.find({
                        "useStockSession.useCallback[mutarSessaoAtiva].session": (s)=>s.id === activeSessionId
                    }["useStockSession.useCallback[mutarSessaoAtiva].session"]);
                    if (!session) return prev;
                    const updated = mutate(session);
                    scheduleSave(updated.id, {
                        sessoes: updated.sessoes,
                        status: updated.status
                    });
                    return prev.map({
                        "useStockSession.useCallback[mutarSessaoAtiva]": (s)=>s.id === activeSessionId ? updated : s
                    }["useStockSession.useCallback[mutarSessaoAtiva]"]);
                }
            }["useStockSession.useCallback[mutarSessaoAtiva]"]);
        }
    }["useStockSession.useCallback[mutarSessaoAtiva]"], [
        activeSessionId,
        scheduleSave
    ]);
    // ── Atualizar quantidade de um item ───────────────────────────────────────
    const atualizarQuantidade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStockSession.useCallback[atualizarQuantidade]": (categoriaId, insumoId, quantidade)=>{
            mutarSessaoAtiva({
                "useStockSession.useCallback[atualizarQuantidade]": (s)=>({
                        ...s,
                        sessoes: s.sessoes.map({
                            "useStockSession.useCallback[atualizarQuantidade]": (cat)=>cat.id !== categoriaId ? cat : {
                                    ...cat,
                                    itens: cat.itens.map({
                                        "useStockSession.useCallback[atualizarQuantidade]": (item)=>item.insumoId !== insumoId ? item : {
                                                ...item,
                                                quantidadeContada: quantidade
                                            }
                                    }["useStockSession.useCallback[atualizarQuantidade]"])
                                }
                        }["useStockSession.useCallback[atualizarQuantidade]"])
                    })
            }["useStockSession.useCallback[atualizarQuantidade]"]);
        }
    }["useStockSession.useCallback[atualizarQuantidade]"], [
        mutarSessaoAtiva
    ]);
    // ── Atualizar observação de um item ──────────────────────────────────────
    const atualizarObservacao = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStockSession.useCallback[atualizarObservacao]": (categoriaId, insumoId, observacao)=>{
            mutarSessaoAtiva({
                "useStockSession.useCallback[atualizarObservacao]": (s)=>({
                        ...s,
                        sessoes: s.sessoes.map({
                            "useStockSession.useCallback[atualizarObservacao]": (cat)=>cat.id !== categoriaId ? cat : {
                                    ...cat,
                                    itens: cat.itens.map({
                                        "useStockSession.useCallback[atualizarObservacao]": (item)=>item.insumoId !== insumoId ? item : {
                                                ...item,
                                                observacao
                                            }
                                    }["useStockSession.useCallback[atualizarObservacao]"])
                                }
                        }["useStockSession.useCallback[atualizarObservacao]"])
                    })
            }["useStockSession.useCallback[atualizarObservacao]"]);
        }
    }["useStockSession.useCallback[atualizarObservacao]"], [
        mutarSessaoAtiva
    ]);
    // ── Concluir categoria ────────────────────────────────────────────────────
    const concluirCategoria = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStockSession.useCallback[concluirCategoria]": (categoriaId)=>{
            mutarSessaoAtiva({
                "useStockSession.useCallback[concluirCategoria]": (s)=>({
                        ...s,
                        sessoes: s.sessoes.map({
                            "useStockSession.useCallback[concluirCategoria]": (cat)=>cat.id !== categoriaId ? cat : {
                                    ...cat,
                                    status: 'concluida'
                                }
                        }["useStockSession.useCallback[concluirCategoria]"])
                    })
            }["useStockSession.useCallback[concluirCategoria]"]);
        }
    }["useStockSession.useCallback[concluirCategoria]"], [
        mutarSessaoAtiva
    ]);
    // ── Reabrir categoria ─────────────────────────────────────────────────────
    const reabrirCategoria = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStockSession.useCallback[reabrirCategoria]": (categoriaId)=>{
            mutarSessaoAtiva({
                "useStockSession.useCallback[reabrirCategoria]": (s)=>({
                        ...s,
                        sessoes: s.sessoes.map({
                            "useStockSession.useCallback[reabrirCategoria]": (cat)=>cat.id !== categoriaId ? cat : {
                                    ...cat,
                                    status: 'pendente'
                                }
                        }["useStockSession.useCallback[reabrirCategoria]"])
                    })
            }["useStockSession.useCallback[reabrirCategoria]"]);
        }
    }["useStockSession.useCallback[reabrirCategoria]"], [
        mutarSessaoAtiva
    ]);
    // ── Finalizar toda a contagem ─────────────────────────────────────────────
    // Inclui sessoes completas no patch para garantir que o estado mais recente
    // seja persistido mesmo que haja saves pendentes na fila
    const finalizarContagem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStockSession.useCallback[finalizarContagem]": ()=>{
            if (!activeSessionId) return;
            setSessions({
                "useStockSession.useCallback[finalizarContagem]": (prev)=>{
                    const session = prev.find({
                        "useStockSession.useCallback[finalizarContagem].session": (s)=>s.id === activeSessionId
                    }["useStockSession.useCallback[finalizarContagem].session"]);
                    if (!session) return prev;
                    const updated = {
                        ...session,
                        status: 'concluida'
                    };
                    scheduleSave(updated.id, {
                        sessoes: updated.sessoes,
                        status: 'concluida'
                    });
                    return prev.map({
                        "useStockSession.useCallback[finalizarContagem]": (s)=>s.id === activeSessionId ? updated : s
                    }["useStockSession.useCallback[finalizarContagem]"]);
                }
            }["useStockSession.useCallback[finalizarContagem]"]);
            setActiveSessionId(null);
        }
    }["useStockSession.useCallback[finalizarContagem]"], [
        activeSessionId,
        scheduleSave
    ]);
    // ── Excluir contagem ──────────────────────────────────────────────────────
    const excluirContagem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStockSession.useCallback[excluirContagem]": (sessionId)=>{
            pendingSave.current.delete(sessionId); // cancela save pendente
            setSessions({
                "useStockSession.useCallback[excluirContagem]": (prev)=>prev.filter({
                        "useStockSession.useCallback[excluirContagem]": (s)=>s.id !== sessionId
                    }["useStockSession.useCallback[excluirContagem]"])
            }["useStockSession.useCallback[excluirContagem]"]);
            if (activeSessionId === sessionId) setActiveSessionId(null);
            apiDelete(sessionId).catch(console.error);
        }
    }["useStockSession.useCallback[excluirContagem]"], [
        activeSessionId
    ]);
    // ── Estatísticas ──────────────────────────────────────────────────────────
    const calcularProgresso = (session)=>{
        const total = session.sessoes.length;
        const concluidas = session.sessoes.filter((s)=>s.status === 'concluida').length;
        return {
            total,
            concluidas,
            percentual: total > 0 ? concluidas / total * 100 : 0
        };
    };
    const calcularAlertasReposicao = (session)=>session.sessoes.flatMap((cat)=>cat.itens.filter((item)=>item.quantidadeContada !== null && item.estoqueMinimo !== undefined && item.quantidadeContada < item.estoqueMinimo).map((item)=>({
                    ...item,
                    categoriaNome: cat.nome,
                    categoriaIcone: cat.icone
                })));
    return {
        sessions,
        activeSession,
        activeSessionId,
        hydrated,
        saveStatus,
        iniciarContagem,
        retomarContagem,
        fecharContagem,
        atualizarQuantidade,
        atualizarObservacao,
        concluirCategoria,
        reabrirCategoria,
        finalizarContagem,
        excluirContagem,
        calcularProgresso,
        calcularAlertasReposicao
    };
}
_s(useStockSession, "Jj7Dsr76PMQHosYtMmXZft2pupQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/estoque/hooks/useProdutosEstoque.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "construirSessoes",
    ()=>construirSessoes,
    "useProdutosEstoque",
    ()=>useProdutosEstoque
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/estoque-nome.ts [app-client] (ecmascript)");
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
        const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(p.nome);
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
    const [insumos, setInsumos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const requestIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
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
    /** Remove da lista local por cuid e/ou slug (evita o item "voltar" no merge). */ const removeLocal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProdutosEstoque.useCallback[removeLocal]": (id, insumoId)=>{
            setInsumos({
                "useProdutosEstoque.useCallback[removeLocal]": (prev)=>prev.filter({
                        "useProdutosEstoque.useCallback[removeLocal]": (p)=>p.id !== id && (!insumoId || p.insumoId !== insumoId)
                    }["useProdutosEstoque.useCallback[removeLocal]"])
            }["useProdutosEstoque.useCallback[removeLocal]"]);
        }
    }["useProdutosEstoque.useCallback[removeLocal]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
"[project]/drin-platform/app/estoque/hooks/useEstoqueConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEstoqueConfig",
    ()=>useEstoqueConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
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
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [productOrder, setProductOrderState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [hydrated, setHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Ref sempre atualizado com o config mais recente — evita closure stale no debounce
    const configRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "useEstoqueConfig.useLayoutEffect": ()=>{
            configRef.current = config;
        }
    }["useEstoqueConfig.useLayoutEffect"]);
    // Debounce refs — evitam request por keystroke
    const debounceMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    // Carrega do banco na montagem
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    const getConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[getConfig]": (insumoId)=>config[insumoId] ?? {
                ativo: true,
                estoqueMinimo: undefined
            }
    }["useEstoqueConfig.useCallback[getConfig]"], [
        config
    ]);
    /** Atualiza campo(s) de um produto localmente e persiste no banco (debounced) */ const updateProduto = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
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
    const setAtivo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[setAtivo]": (insumoId, ativo)=>updateProduto(insumoId, {
                ativo
            }, 0)
    }["useEstoqueConfig.useCallback[setAtivo]"], [
        updateProduto
    ]);
    const setMinimo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[setMinimo]": (insumoId, estoqueMinimo)=>updateProduto(insumoId, {
                estoqueMinimo
            })
    }["useEstoqueConfig.useCallback[setMinimo]"], [
        updateProduto
    ]);
    const setModoContagem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[setModoContagem]": (insumoId, modoContagem)=>updateProduto(insumoId, {
                modoContagem
            }, 0)
    }["useEstoqueConfig.useCallback[setModoContagem]"], [
        updateProduto
    ]);
    const setKgPorUnidade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[setKgPorUnidade]": (insumoId, kgPorUnidade)=>updateProduto(insumoId, {
                kgPorUnidade
            })
    }["useEstoqueConfig.useCallback[setKgPorUnidade]"], [
        updateProduto
    ]);
    // ── Ordem de produtos ────────────────────────────────────────────────────────
    const setProductOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEstoqueConfig.useCallback[setProductOrder]": (order)=>{
            setProductOrderState(order);
            patchOrdem(order).catch({
                "useEstoqueConfig.useCallback[setProductOrder]": (err)=>console.warn('[useEstoqueConfig] Falha ao salvar ordem:', err.message)
            }["useEstoqueConfig.useCallback[setProductOrder]"]);
        }
    }["useEstoqueConfig.useCallback[setProductOrder]"], []);
    const moverProdutoAcima = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
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
    const moverProdutoAbaixo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
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
"[project]/drin-platform/app/estoque/components/HomeScreen.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HomeScreen",
    ()=>HomeScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
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
    const [confirmandoId, setConfirmandoId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const emAndamento = sessions.filter((s)=>s.status === 'em_andamento');
    const concluidas = sessions.filter((s)=>s.status === 'concluida');
    const temAtiva = emAndamento.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-5 pt-12 pb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                className: "w-5 h-5 text-amber-400"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                lineNumber: 37,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-xl font-bold text-white",
                                    children: "Plateful Estoque"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500",
                                    children: "Contagem semanal de insumos"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                    lineNumber: 41,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 px-4 py-6 space-y-5 max-w-lg mx-auto w-full",
                children: [
                    emAndamento.map((s)=>{
                        const total = s.sessoes.length;
                        const concluidas = s.sessoes.filter((c)=>c.status === 'concluida').length;
                        const pct = total > 0 ? Math.round(concluidas / total * 100) : 0;
                        const confirmando = confirmandoId === s.id;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-semibold text-amber-400 uppercase tracking-wider",
                                                    children: "Em andamento"
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                    lineNumber: 60,
                                                    columnNumber: 19
                                                }, this),
                                                s.lojaNome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-amber-300/70 mt-0.5",
                                                    children: s.lojaNome
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                    lineNumber: 64,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                            lineNumber: 59,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-gray-500",
                                            children: formatarData(s.dataCriacao)
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                    lineNumber: 58,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "my-3 h-2 bg-[#2a2a2e] rounded-full overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-full bg-amber-500 rounded-full transition-all",
                                        style: {
                                            width: `${pct}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                        lineNumber: 72,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-amber-300",
                                            children: [
                                                concluidas,
                                                "/",
                                                total,
                                                " sessões concluídas"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                            lineNumber: 79,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                confirmando ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setConfirmandoId(null),
                                                            className: "text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-[#3a3a3e] transition-colors",
                                                            children: "Cancelar"
                                                        }, void 0, false, {
                                                            fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                            lineNumber: 85,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                onExcluir(s.id);
                                                                setConfirmandoId(null);
                                                            },
                                                            className: "flex items-center gap-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold px-3 py-1.5 rounded-lg border border-red-500/30 transition-colors",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    className: "w-3.5 h-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                                    lineNumber: 95,
                                                                    columnNumber: 25
                                                                }, this),
                                                                "Apagar"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                            lineNumber: 91,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setConfirmandoId(s.id),
                                                    className: "p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors",
                                                    title: "Apagar contagem",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                        lineNumber: 105,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                    lineNumber: 100,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>onRetomar(s.id),
                                                    className: "flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black font-semibold text-sm rounded-xl px-4 py-2 transition-colors",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                            lineNumber: 112,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Continuar"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                            lineNumber: 82,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                    lineNumber: 78,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, s.id, true, {
                            fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, this);
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onIniciar,
                        className: "w-full bg-[#1c1c1e] border-2 border-dashed border-amber-500/40 hover:border-amber-500/80 hover:bg-amber-500/5 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all active:scale-[0.98]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "w-7 h-7 text-amber-400"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-white text-base",
                                        children: temAtiva ? 'Iniciar contagem para outra loja' : 'Iniciar nova contagem'
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                        lineNumber: 130,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: new Date().toLocaleDateString('pt-BR', {
                                            weekday: 'long',
                                            day: '2-digit',
                                            month: 'long'
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    concluidas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3",
                                children: "Últimas contagens"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: concluidas.slice(0, 3).map((s)=>{
                                    const alertas = s.sessoes.flatMap((cat)=>cat.itens.filter((i)=>i.quantidadeContada !== null && i.estoqueMinimo !== undefined && i.quantidadeContada < i.estoqueMinimo)).length;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-xl px-4 py-3 flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "w-4 h-4 text-green-400 shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                lineNumber: 158,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-white font-medium",
                                                        children: [
                                                            new Date(s.dataCriacao).toLocaleDateString('pt-BR', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            }),
                                                            s.lojaNome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-xs font-normal text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md",
                                                                children: s.lojaNome
                                                            }, void 0, false, {
                                                                fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                                lineNumber: 165,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                        lineNumber: 160,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-500 mt-0.5",
                                                        children: [
                                                            s.sessoes.length,
                                                            " sessões",
                                                            alertas > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-amber-500",
                                                                children: [
                                                                    "⚠ ",
                                                                    alertas,
                                                                    " alerta",
                                                                    alertas !== 1 ? 's' : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                                lineNumber: 173,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                                lineNumber: 159,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, s.id, true, {
                                        fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                        lineNumber: 154,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-700 text-center pb-4",
                        children: "Dados salvos no banco de dados"
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/components/HomeScreen.tsx",
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
"[project]/drin-platform/app/estoque/components/AlertBadge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertBadge",
    ()=>AlertBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function AlertBadge({ count, className = '' }) {
    if (count === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold bg-red-500 text-white ${className}`,
        children: count > 99 ? '99+' : count
    }, void 0, false, {
        fileName: "[project]/drin-platform/app/estoque/components/AlertBadge.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = AlertBadge;
var _c;
__turbopack_context__.k.register(_c, "AlertBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/estoque/components/ProgressBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProgressBar",
    ()=>ProgressBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function ProgressBar({ concluidas, total }) {
    const pct = total > 0 ? Math.round(concluidas / total * 100) : 0;
    const todas = concluidas === total && total > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 h-2 bg-[#2a2a2e] rounded-full overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `h-full rounded-full transition-all duration-500 ${todas ? 'bg-green-500' : 'bg-amber-500'}`,
                    style: {
                        width: `${pct}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/drin-platform/app/estoque/components/ProgressBar.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/ProgressBar.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `text-xs font-semibold tabular-nums shrink-0 ${todas ? 'text-green-400' : 'text-amber-400'}`,
                children: [
                    concluidas,
                    "/",
                    total
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/components/ProgressBar.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/components/ProgressBar.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = ProgressBar;
var _c;
__turbopack_context__.k.register(_c, "ProgressBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/estoque/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/drin-platform/app/estoque/components/StockItemRow.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StockItemRow",
    ()=>StockItemRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const FARDO_OPCOES_BEBIDAS = [
    {
        size: 1,
        label: 'un'
    },
    {
        size: 6,
        label: 'fardo 6'
    },
    {
        size: 8,
        label: 'fardo 8'
    },
    {
        size: 12,
        label: 'fardo 12'
    }
];
const FARDO_OPCOES_EMBALAGENS = [
    {
        size: 1,
        label: 'un'
    },
    {
        size: 50,
        label: 'fardo 50'
    }
];
function getFardoOpcoes(categoriaId) {
    if (categoriaId === 'bebidas') return FARDO_OPCOES_BEBIDAS;
    if (categoriaId === 'embalagens') return FARDO_OPCOES_EMBALAGENS;
    return null;
}
function StockItemRow({ item, categoriaId, onQuantidade, onObservacao }) {
    _s();
    // ── Todos os hooks no topo ─────────────────────────────────────────────────
    const [showObs, setShowObs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!!item.observacao);
    const [obsLocal, setObsLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(item.observacao ?? '');
    const [addValue, setAddValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [editMode, setEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contarEmKgLocal, setContarEmKgLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fardoIdx, setFardoIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ── Derivações ─────────────────────────────────────────────────────────────
    const contado = item.quantidadeContada !== null;
    const abaixoMinimo = contado && item.estoqueMinimo !== undefined && item.quantidadeContada < item.estoqueMinimo;
    const modoUnidade = item.modoContagem === 'unidade';
    const kgPorUn = item.kgPorUnidade ?? 1;
    const puroUnidade = modoUnidade && !item.kgPorUnidade;
    const isItemUnidade = item.unidade === 'un';
    // Toggle kg/un: disponível para itens configurados como "unidade" com fator de conversão
    const hasKgConversion = modoUnidade && !!item.kgPorUnidade;
    const contarEmKg = hasKgConversion && contarEmKgLocal;
    const fardoOpcoes = getFardoOpcoes(categoriaId);
    const hasFardoToggle = !!fardoOpcoes && !hasKgConversion;
    const fardoSize = hasFardoToggle ? fardoOpcoes[fardoIdx % fardoOpcoes.length].size : 1;
    const fardoLabel = hasFardoToggle ? fardoOpcoes[fardoIdx % fardoOpcoes.length].label : 'un';
    const contarEmFardo = hasFardoToggle && fardoSize > 1;
    const unidadeDisplay = modoUnidade && item.kgPorUnidade ? 'kg' : item.unidade;
    const inputUnidade = contarEmKg ? 'kg' : contarEmFardo ? fardoLabel : modoUnidade || isItemUnidade ? 'un' : item.unidade;
    const cycleFardo = ()=>{
        if (!fardoOpcoes) return;
        setFardoIdx((i)=>(i + 1) % fardoOpcoes.length);
        setAddValue('');
    };
    const handleAdicionar = ()=>{
        const num = parseFloat(addValue.replace(',', '.'));
        if (isNaN(num) || num < 0) return;
        // Fardo: multiplica diretamente em unidades
        if (contarEmFardo) {
            const novoTotal = (item.quantidadeContada ?? 0) + num * fardoSize;
            onQuantidade(categoriaId, item.insumoId, novoTotal);
        } else if (contarEmKg) {
            // Embalagem aberta: digita diretamente em kg
            const novoTotal = parseFloat(((item.quantidadeContada ?? 0) + num).toFixed(3));
            onQuantidade(categoriaId, item.insumoId, novoTotal);
        } else {
            const qtdBase = modoUnidade ? num * kgPorUn : num;
            const qtdAdicionada = puroUnidade ? num : qtdBase;
            const novoTotal = parseFloat(((item.quantidadeContada ?? 0) + qtdAdicionada).toFixed(3));
            onQuantidade(categoriaId, item.insumoId, novoTotal);
        }
        setAddValue('');
        setTimeout(()=>inputRef.current?.focus(), 50);
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter') editMode ? handleSalvarEdicao() : handleAdicionar();
        if (e.key === 'Escape' && editMode) handleCancelarEdicao();
    };
    const handleObsBlur = ()=>{
        onObservacao(categoriaId, item.insumoId, obsLocal);
    };
    const handleEditarTotal = ()=>{
        // Preenche o input com o valor atual armazenado e entra no modo edição
        setAddValue(item.quantidadeContada !== null ? String(item.quantidadeContada) : '');
        setEditMode(true);
        setTimeout(()=>{
            inputRef.current?.focus();
            inputRef.current?.select();
        }, 50);
    };
    const handleSalvarEdicao = ()=>{
        const num = parseFloat(addValue.replace(',', '.'));
        if (isNaN(num) || num < 0) return;
        // Substitui o valor diretamente (sem somar)
        onQuantidade(categoriaId, item.insumoId, parseFloat(num.toFixed(3)));
        setAddValue('');
        setEditMode(false);
        setTimeout(()=>inputRef.current?.focus(), 50);
    };
    const handleCancelarEdicao = ()=>{
        setAddValue('');
        setEditMode(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-2xl transition-colors ${abaixoMinimo ? 'bg-amber-500/8 border border-amber-500/30' : contado ? 'bg-[#1c1c1e] border border-green-500/20' : 'bg-[#141416] border border-[#2a2a2e]'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 px-3 pt-3 pb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `w-2.5 h-2.5 rounded-full shrink-0 ${abaixoMinimo ? 'bg-amber-400' : contado ? 'bg-green-500' : 'bg-[#374151]'}`
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-white leading-tight",
                                children: item.nome
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 mt-0.5 flex-wrap",
                                children: [
                                    hasKgConversion ? // Toggle clicável: alterna entre contar em un ou kg direto (embalagem aberta)
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            setContarEmKgLocal((v)=>!v);
                                            setAddValue('');
                                        },
                                        className: `cursor-pointer inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all active:scale-95 ${contarEmKg ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30'}`,
                                        children: [
                                            contarEmKg ? '⚖ kg' : '# un',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] opacity-60 ml-0.5",
                                                children: "trocar"
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                                lineNumber: 167,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, this) : hasFardoToggle ? // Toggle clicável: cicla entre unidade e fardos (bebidas / embalagens)
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            cycleFardo();
                                        },
                                        className: `cursor-pointer inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all active:scale-95 ${contarEmFardo ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30'}`,
                                        children: [
                                            "# ",
                                            fardoLabel,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] opacity-60 ml-0.5",
                                                children: "trocar"
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                                lineNumber: 181,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 171,
                                        columnNumber: 15
                                    }, this) : !isItemUnidade && (// Badge estático (sem conversão)
                                    modoUnidade ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/20",
                                        children: "contar em unidade"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 186,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20",
                                        children: "contar em kg"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 190,
                                        columnNumber: 17
                                    }, this)),
                                    modoUnidade && item.kgPorUnidade && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-600",
                                        children: [
                                            "1 un = ",
                                            item.kgPorUnidade,
                                            " kg"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 197,
                                        columnNumber: 15
                                    }, this),
                                    contarEmFardo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-600",
                                        children: [
                                            "1 fardo = ",
                                            fardoSize,
                                            " un"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 203,
                                        columnNumber: 15
                                    }, this),
                                    item.estoqueMinimo !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-600",
                                        children: [
                                            "mín: ",
                                            item.estoqueMinimo,
                                            " ",
                                            unidadeDisplay
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 209,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    abaixoMinimo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        className: "w-4 h-4 text-amber-400 shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 215,
                        columnNumber: 26
                    }, this),
                    contado && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-right shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-baseline gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-xl font-bold ${abaixoMinimo ? 'text-amber-300' : 'text-green-300'}`,
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatQtd"])(item.quantidadeContada)
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-500",
                                        children: unidadeDisplay
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this),
                            modoUnidade && item.kgPorUnidade && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-600 leading-tight",
                                children: [
                                    "≈ ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatQtd"])(item.quantidadeContada / kgPorUn),
                                    " un"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 231,
                                columnNumber: 15
                            }, this),
                            contarEmFardo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-600 leading-tight",
                                children: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatQtd"])(item.quantidadeContada / fardoSize),
                                    " fardo",
                                    item.quantidadeContada / fardoSize !== 1 ? 's' : '',
                                    " de ",
                                    fardoSize
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 236,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 219,
                        columnNumber: 11
                    }, this),
                    contado && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleEditarTotal,
                        title: "Editar valor",
                        className: `w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${editMode ? 'bg-amber-500/20 text-amber-400' : 'bg-[#2a2a2e] text-gray-500 hover:bg-amber-500/10 hover:text-amber-400'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                            className: "w-3.5 h-3.5"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                            lineNumber: 254,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 245,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowObs((v)=>!v),
                        className: `w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${item.observacao ? 'text-amber-400 bg-amber-500/10' : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                            className: "w-3.5 h-3.5"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                            lineNumber: 267,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            editMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pb-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-amber-400 flex items-center gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                            className: "w-3 h-3"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                            lineNumber: 275,
                            columnNumber: 13
                        }, this),
                        "Editando — digite o valor correto e confirme"
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                    lineNumber: 274,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                lineNumber: 273,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 px-3 pb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: inputRef,
                        type: "number",
                        inputMode: "decimal",
                        min: "0",
                        step: puroUnidade || hasFardoToggle ? '1' : '0.1',
                        value: addValue || '',
                        onChange: (e)=>setAddValue(e.target.value),
                        onKeyDown: handleKeyDown,
                        placeholder: editMode ? `novo valor em ${unidadeDisplay}` : contado ? `+ adicionar ${inputUnidade}` : `quantidade em ${inputUnidade}`,
                        className: `flex-1 bg-[#2a2a2e] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${editMode ? 'border-2 border-amber-500/60 focus:border-amber-500' : 'border border-[#374151] focus:border-amber-500/60'}`
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 281,
                        columnNumber: 9
                    }, this),
                    editMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleCancelarEdicao,
                                className: "w-10 flex items-center justify-center rounded-xl bg-[#2a2a2e] text-gray-400 hover:text-white transition-colors shrink-0",
                                title: "Cancelar edição",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                    lineNumber: 310,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 305,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSalvarEdicao,
                                disabled: addValue === '',
                                className: `flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0 ${addValue !== '' ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black' : 'bg-[#2a2a2e] text-gray-600 cursor-not-allowed'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 321,
                                        columnNumber: 15
                                    }, this),
                                    "Salvar"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 312,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleAdicionar,
                        disabled: addValue === '',
                        className: `flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0 ${addValue !== '' ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black' : 'bg-[#2a2a2e] text-gray-600 cursor-not-allowed'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 335,
                                columnNumber: 13
                            }, this),
                            contado ? 'Somar' : 'Add',
                            " ",
                            inputUnidade
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 326,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                lineNumber: 280,
                columnNumber: 7
            }, this),
            showObs && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pb-3 pt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: obsLocal,
                            onChange: (e)=>setObsLocal(e.target.value),
                            onBlur: handleObsBlur,
                            placeholder: "Observação…",
                            className: "flex-1 bg-[#2a2a2e] border border-[#374151] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/60"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                            lineNumber: 345,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                handleObsBlur();
                                setShowObs(false);
                            },
                            className: "p-2 text-gray-500 hover:text-white transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 357,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                            lineNumber: 353,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                    lineNumber: 344,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                lineNumber: 343,
                columnNumber: 9
            }, this),
            abaixoMinimo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pb-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-amber-400 flex items-center gap-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: "w-3 h-3"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                            lineNumber: 367,
                            columnNumber: 13
                        }, this),
                        "Abaixo do mínimo (",
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatQtd"])(item.estoqueMinimo ?? null),
                        " ",
                        unidadeDisplay,
                        ")"
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                    lineNumber: 366,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
                lineNumber: 365,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/components/StockItemRow.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
_s(StockItemRow, "DchUr6nNiNxvql43V+mMSLszN/Y=");
_c = StockItemRow;
var _c;
__turbopack_context__.k.register(_c, "StockItemRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/estoque/components/SessionAccordion.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SessionAccordion",
    ()=>SessionAccordion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$StockItemRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/components/StockItemRow.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function SessionAccordion({ categoria, isActive, onToggle, onQuantidade, onObservacao, onConcluir, onReabrir, onProxima }) {
    _s();
    const [showCelebration, setShowCelebration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [itensFaltando, setItensFaltando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const concluida = categoria.status === 'concluida';
    const totalItens = categoria.itens.length;
    const contados = categoria.itens.filter((i)=>i.quantidadeContada !== null).length;
    const alertas = categoria.itens.filter((i)=>i.quantidadeContada !== null && i.estoqueMinimo !== undefined && i.quantidadeContada < i.estoqueMinimo).length;
    const handleConcluir = ()=>{
        const naoPreenchidos = categoria.itens.filter((i)=>i.quantidadeContada === null).map((i)=>i.nome);
        if (naoPreenchidos.length > 0) {
            setItensFaltando(naoPreenchidos);
            return;
        }
        onConcluir();
        setShowCelebration(true);
        setTimeout(()=>setShowCelebration(false), 2000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            itensFaltando.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-6 max-w-sm w-full shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                className: "w-5 h-5 text-amber-400"
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                                lineNumber: 67,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                            lineNumber: 66,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-base font-semibold text-white",
                                                    children: "Itens não preenchidos"
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                                    lineNumber: 70,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-0.5",
                                                    children: "Preencha todos antes de concluir"
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                                    lineNumber: 71,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                            lineNumber: 69,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setItensFaltando([]),
                                    className: "text-gray-600 hover:text-white transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-1.5 max-h-60 overflow-y-auto mb-5",
                            children: itensFaltando.map((nome)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex items-center gap-2 text-sm text-gray-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                            lineNumber: 81,
                                            columnNumber: 17
                                        }, this),
                                        nome
                                    ]
                                }, nome, true, {
                                    fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setItensFaltando([]),
                            className: "w-full py-2.5 rounded-xl bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors",
                            children: "Entendido, vou preencher"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `rounded-2xl border transition-all duration-200 overflow-hidden ${concluida ? 'border-green-500/30 bg-green-500/5' : isActive ? 'border-amber-500/40 bg-[#1c1c1e]' : 'border-[#2a2a2e] bg-[#1c1c1e]'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onToggle,
                        className: "w-full flex items-center gap-3 p-4 text-left",
                        children: [
                            concluida ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                className: "w-5 h-5 text-green-400 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 112,
                                columnNumber: 11
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                                className: `w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'text-gray-600'}`
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xl shrink-0",
                                children: categoria.icone
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 118,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `font-semibold text-sm ${concluida ? 'text-green-400' : 'text-white'}`,
                                        children: categoria.nome
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 122,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-0.5",
                                        children: [
                                            concluida ? `${totalItens} itens contados` : `${contados}/${totalItens} contados`,
                                            alertas > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-2 text-amber-400",
                                                children: [
                                                    "⚠ ",
                                                    alertas,
                                                    " alerta",
                                                    alertas > 1 ? 's' : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                                lineNumber: 130,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 125,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 121,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 shrink-0",
                                children: [
                                    !concluida && contados > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs bg-amber-500/20 text-amber-400 rounded-full px-2 py-0.5 font-medium",
                                        children: [
                                            contados,
                                            "/",
                                            totalItens
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 138,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: `w-4 h-4 text-gray-500 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 142,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 136,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                        lineNumber: 106,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `px-4 pb-4 space-y-2 ${isActive ? '' : 'hidden'}`,
                        children: [
                            showCelebration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-500/15 border border-green-500/30 rounded-xl p-3 text-center animate-pulse",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-green-400 font-semibold text-sm",
                                    children: "✅ Sessão concluída!"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                    lineNumber: 155,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this),
                            categoria.itens.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$StockItemRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StockItemRow"], {
                                    item: item,
                                    categoriaId: categoria.id,
                                    onQuantidade: onQuantidade,
                                    onObservacao: onObservacao
                                }, item.insumoId, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-2 flex gap-2",
                                children: [
                                    concluida ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onReabrir,
                                        className: "flex-1 py-3 rounded-xl border border-[#374151] text-sm text-gray-400 hover:text-white hover:border-[#4a4a50] transition-colors font-medium",
                                        children: "Reabrir sessão"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 173,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleConcluir,
                                        className: "flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold transition-colors",
                                        children: "✓ Concluir sessão"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, this),
                                    onProxima && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onProxima,
                                        className: "flex items-center gap-2 px-4 py-3 rounded-xl border border-[#374151] text-sm text-gray-400 hover:text-white hover:border-amber-500/50 transition-colors font-medium shrink-0",
                                        children: [
                                            "Próxima",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                                lineNumber: 193,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                        lineNumber: 151,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/components/SessionAccordion.tsx",
                lineNumber: 96,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true);
}
_s(SessionAccordion, "mQ9ixCqsj9efJ0LndmEjiI19DQ0=");
_c = SessionAccordion;
var _c;
__turbopack_context__.k.register(_c, "SessionAccordion");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/estoque/pages/Contagem.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Contagem",
    ()=>Contagem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/wifi-off.js [app-client] (ecmascript) <export default as WifiOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$ProgressBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/components/ProgressBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$SessionAccordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/components/SessionAccordion.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$StockItemRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/components/StockItemRow.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function SaveIndicator({ status }) {
    if (status === 'idle') return null;
    if (status === 'saving') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "flex items-center gap-1 text-[11px] text-gray-500",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "w-3 h-3 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                "Salvando…"
            ]
        }, void 0, true, {
            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this);
    }
    if (status === 'saved') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "flex items-center gap-1 text-[11px] text-green-500",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                    className: "w-3 h-3"
                }, void 0, false, {
                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this),
                "Salvo"
            ]
        }, void 0, true, {
            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this);
    }
    // error
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "flex items-center gap-1 text-[11px] text-amber-400",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                className: "w-3 h-3"
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            "Erro ao salvar"
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c = SaveIndicator;
function Contagem({ session, saveStatus, onFechar, onQuantidade, onObservacao, onConcluirCategoria, onReabrirCategoria, onFinalizar }) {
    _s();
    const [activeCatId, setActiveCatId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(session.sessoes.find({
        "Contagem.useState": (s)=>s.status === 'pendente'
    }["Contagem.useState"])?.id ?? null);
    const [showRevisao, setShowRevisao] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [itensFaltandoGlobal, setItensFaltandoGlobal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const isSearching = searchTerm.trim().length > 0;
    const searchResults = isSearching ? session.sessoes.flatMap((cat)=>cat.itens.filter((i)=>i.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((i)=>({
                item: i,
                categoriaId: cat.id,
                categoriaNome: cat.nome,
                icone: cat.icone
            }))) : [];
    const concluidas = session.sessoes.filter((s)=>s.status === 'concluida').length;
    const total = session.sessoes.length;
    const todasConcluidas = concluidas === total;
    const alertas = session.sessoes.flatMap((cat)=>cat.itens.filter((i)=>i.quantidadeContada !== null && i.estoqueMinimo !== undefined && i.quantidadeContada < i.estoqueMinimo));
    const dataFormatada = new Date(session.dataCriacao).toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    const toggleCategoria = (id)=>{
        setActiveCatId((prev)=>prev === id ? null : id);
    };
    const handleConcluirCategoria = (catId)=>{
        onConcluirCategoria(catId);
        const idx = session.sessoes.findIndex((s)=>s.id === catId);
        const proxima = session.sessoes[idx + 1];
        if (proxima) setActiveCatId(proxima.id);
        else setActiveCatId(null);
    };
    const handleProxima = (catId)=>{
        const idx = session.sessoes.findIndex((s)=>s.id === catId);
        const proxima = session.sessoes[idx + 1];
        if (proxima) setActiveCatId(proxima.id);
    };
    const handleAbrirRevisao = ()=>{
        const faltando = session.sessoes.flatMap((cat)=>cat.itens.filter((i)=>i.quantidadeContada === null).map((i)=>({
                    categoria: cat.nome,
                    nome: i.nome
                })));
        if (faltando.length > 0) {
            setItensFaltandoGlobal(faltando);
            return;
        }
        setShowRevisao(true);
    };
    // ── Tela de revisão ───────────────────────────────────────────────────────
    if (showRevisao) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#0a0a0a] flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-4 pt-12 pb-4 flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowRevisao(false),
                            className: "p-2 -ml-2 text-gray-400 hover:text-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-bold text-white",
                                    children: "Revisão"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500",
                                    children: dataFormatada
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 136,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                    lineNumber: 130,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-lg mx-auto w-full",
                    children: [
                        alertas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-amber-400 font-semibold text-sm mb-2 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 144,
                                            columnNumber: 17
                                        }, this),
                                        alertas.length,
                                        " item",
                                        alertas.length !== 1 ? 'ns' : '',
                                        " abaixo do mínimo"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 143,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1",
                                    children: alertas.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-400",
                                            children: [
                                                "• ",
                                                a.nome,
                                                ": ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatQtd"])(a.quantidadeContada),
                                                " ",
                                                a.unidade,
                                                " (mín: ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatQtd"])(a.estoqueMinimo ?? null),
                                                ")"
                                            ]
                                        }, a.insumoId, true, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 149,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 147,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                            lineNumber: 142,
                            columnNumber: 13
                        }, this),
                        session.sessoes.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: cat.icone
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white text-sm",
                                                children: cat.nome
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                lineNumber: 161,
                                                columnNumber: 17
                                            }, this),
                                            cat.status === 'concluida' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "w-4 h-4 text-green-400 ml-auto"
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                lineNumber: 163,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1.5",
                                        children: cat.itens.map((item)=>{
                                            const abaixo = item.quantidadeContada !== null && item.estoqueMinimo !== undefined && item.quantidadeContada < item.estoqueMinimo;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-0.5 text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400",
                                                                children: item.nome
                                                            }, void 0, false, {
                                                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                                lineNumber: 175,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `font-semibold ${item.quantidadeContada === null ? 'text-gray-600' : abaixo ? 'text-amber-400' : 'text-white'}`,
                                                                children: [
                                                                    item.quantidadeContada === null ? '—' : `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatQtd"])(item.quantidadeContada)} ${item.unidade}`,
                                                                    abaixo && ' ⚠'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                                lineNumber: 176,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                        lineNumber: 174,
                                                        columnNumber: 23
                                                    }, this),
                                                    item.observacao && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-amber-400/70 italic pl-1",
                                                        children: [
                                                            "💬 ",
                                                            item.observacao
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, item.insumoId, true, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                lineNumber: 173,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, cat.id, true, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onFinalizar,
                            className: "w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-base transition-colors",
                            children: "✓ Confirmar e finalizar contagem"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-6"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
            lineNumber: 129,
            columnNumber: 7
        }, this);
    }
    // ── Tela principal de contagem ────────────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] flex flex-col",
        children: [
            itensFaltandoGlobal.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-6 max-w-sm w-full shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                className: "w-5 h-5 text-red-400"
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                lineNumber: 223,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 222,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-base font-semibold text-white",
                                                    children: [
                                                        itensFaltandoGlobal.length,
                                                        " ",
                                                        itensFaltandoGlobal.length === 1 ? 'item não preenchido' : 'itens não preenchidos'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                    lineNumber: 226,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-0.5",
                                                    children: "Todos os itens precisam ser preenchidos"
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 225,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 221,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setItensFaltandoGlobal([]),
                                    className: "text-gray-600 hover:text-white transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 233,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 232,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                            lineNumber: 220,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-1.5 max-h-64 overflow-y-auto mb-5",
                            children: itensFaltandoGlobal.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex items-start gap-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5"
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 239,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-500 text-xs",
                                                    children: [
                                                        item.categoria,
                                                        " · "
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-300",
                                                    children: item.nome
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                    lineNumber: 242,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 240,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 238,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                            lineNumber: 236,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setItensFaltandoGlobal([]),
                            className: "w-full py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-colors",
                            children: "Voltar e preencher"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                            lineNumber: 247,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                    lineNumber: 219,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                lineNumber: 218,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-4 pt-12 pb-3 sticky top-0 z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "font-bold text-white text-base",
                                        children: "Contagem de Estoque"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: dataFormatada
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 261,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                lineNumber: 259,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-end gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onFechar,
                                        className: "flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors border border-[#374151] rounded-xl px-3 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                                lineNumber: 268,
                                                columnNumber: 15
                                            }, this),
                                            "Salvar e sair"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 264,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SaveIndicator, {
                                        status: saveStatus
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 271,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                lineNumber: 263,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                        lineNumber: 258,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative mt-2 mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Buscar produto...",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value),
                                className: "w-full bg-[#2a2a2e] text-white text-sm rounded-xl pl-9 pr-9 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this),
                            searchTerm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSearchTerm(''),
                                className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 290,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                        lineNumber: 276,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$ProgressBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProgressBar"], {
                        concluidas: concluidas,
                        total: total
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-600 mt-1",
                        children: [
                            concluidas,
                            " de ",
                            total,
                            " sessões concluídas",
                            alertas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-2 text-amber-500",
                                children: [
                                    "· ⚠ ",
                                    alertas.length,
                                    " alerta",
                                    alertas.length !== 1 ? 's' : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                lineNumber: 300,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                lineNumber: 257,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-lg mx-auto w-full",
                children: [
                    isSearching ? searchResults.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center py-16 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "w-10 h-10 text-gray-700 mb-3"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                lineNumber: 310,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 text-sm",
                                children: "Nenhum produto encontrado"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                lineNumber: 311,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 text-xs mt-1",
                                children: [
                                    '"',
                                    searchTerm,
                                    '"'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                lineNumber: 312,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                        lineNumber: 309,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: searchResults.map(({ item, categoriaId, categoriaNome, icone })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "px-4 pt-3 pb-1 text-xs text-gray-500 font-medium",
                                        children: [
                                            icone,
                                            " ",
                                            categoriaNome
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 321,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 pb-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$StockItemRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StockItemRow"], {
                                            item: item,
                                            categoriaId: categoriaId,
                                            onQuantidade: onQuantidade,
                                            onObservacao: onObservacao
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 325,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 324,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, `${categoriaId}-${item.insumoId}`, true, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                                lineNumber: 317,
                                columnNumber: 17
                            }, this))
                    }, void 0, false) : session.sessoes.map((cat, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$SessionAccordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SessionAccordion"], {
                            categoria: cat,
                            isActive: activeCatId === cat.id,
                            onToggle: ()=>toggleCategoria(cat.id),
                            onQuantidade: onQuantidade,
                            onObservacao: onObservacao,
                            onConcluir: ()=>handleConcluirCategoria(cat.id),
                            onReabrir: ()=>onReabrirCategoria(cat.id),
                            onProxima: idx < session.sessoes.length - 1 ? ()=>handleProxima(cat.id) : undefined
                        }, cat.id, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                            lineNumber: 338,
                            columnNumber: 13
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-2 pb-8",
                        children: todasConcluidas ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleAbrirRevisao,
                            className: "w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-base transition-colors",
                            children: "✓ Revisar e finalizar"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                            lineNumber: 359,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            disabled: true,
                            className: "w-full py-4 rounded-2xl bg-[#1c1c1e] border border-[#2a2a2e] text-gray-600 font-medium text-sm cursor-not-allowed",
                            children: "Conclua todas as sessões para finalizar"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                            lineNumber: 366,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                        lineNumber: 357,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
                lineNumber: 306,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/pages/Contagem.tsx",
        lineNumber: 215,
        columnNumber: 5
    }, this);
}
_s(Contagem, "aPQlGhG1CBgCXj5/Gw6J1jQCTOg=");
_c1 = Contagem;
var _c, _c1;
__turbopack_context__.k.register(_c, "SaveIndicator");
__turbopack_context__.k.register(_c1, "Contagem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/estoque/pages/Historico.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Historico",
    ()=>Historico
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/utils.ts [app-client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center gap-1 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                className: "w-3 h-3"
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            nome
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c = EtiquetaLoja;
function EtiquetaData({ iso }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center gap-1 text-xs font-medium text-gray-300 bg-[#2a2a2e] border border-[#3a3a3e] px-2 py-0.5 rounded-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                className: "w-3 h-3 text-gray-500"
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            formatarDataCurta(iso)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_c1 = EtiquetaData;
function Historico({ sessions, onVoltar, onRetomar, onExcluir, onVerResultado }) {
    _s();
    const [detalheId, setDetalheId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const ordenadas = [
        ...sessions
    ].sort((a, b)=>new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
    const detalhe = sessions.find((s)=>s.id === detalheId);
    // ── Tela de detalhe ────────────────────────────────────────────────────────
    if (detalhe) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#0a0a0a] flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-4 pt-12 pb-4 flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setDetalheId(null),
                            className: "p-2 -ml-2 text-gray-400 hover:text-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-bold text-white",
                                    children: formatarDataLonga(detalhe.dataCriacao)
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-2 mt-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EtiquetaData, {
                                            iso: detalhe.dataCriacao
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this),
                                        detalhe.lojaNome ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EtiquetaLoja, {
                                            nome: detalhe.lojaNome
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                            lineNumber: 78,
                                            columnNumber: 35
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500 mt-1",
                                    children: [
                                        formatarHora(detalhe.dataCriacao),
                                        ' · ',
                                        detalhe.sessoes.length,
                                        " sessões"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        detalhe.status === 'em_andamento' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                onRetomar(detalhe.id);
                                setDetalheId(null);
                            },
                            className: "text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl px-3 py-1.5",
                            children: "Continuar"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                            lineNumber: 87,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-lg mx-auto w-full",
                    children: [
                        detalhe.sessoes.map((cat)=>{
                            const alertas = cat.itens.filter((i)=>i.quantidadeContada !== null && i.estoqueMinimo !== undefined && i.quantidadeContada < i.estoqueMinimo).length;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `rounded-2xl border p-4 ${cat.status === 'concluida' ? 'bg-green-500/5 border-green-500/20' : 'bg-[#1c1c1e] border-[#2a2a2e]'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: cat.icone
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                lineNumber: 104,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white text-sm flex-1",
                                                children: cat.nome
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                lineNumber: 105,
                                                columnNumber: 19
                                            }, this),
                                            cat.status === 'concluida' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "w-4 h-4 text-green-400"
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                lineNumber: 106,
                                                columnNumber: 50
                                            }, this),
                                            alertas > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-amber-400",
                                                children: [
                                                    "⚠ ",
                                                    alertas
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                lineNumber: 107,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                        lineNumber: 103,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-1.5",
                                        children: cat.itens.map((item)=>{
                                            const abaixo = item.quantidadeContada !== null && item.estoqueMinimo !== undefined && item.quantidadeContada < item.estoqueMinimo;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-xs gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500 truncate",
                                                                children: item.nome
                                                            }, void 0, false, {
                                                                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                                lineNumber: 115,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `font-medium shrink-0 ${item.quantidadeContada === null ? 'text-gray-700' : abaixo ? 'text-amber-400' : 'text-white'}`,
                                                                children: [
                                                                    item.quantidadeContada === null ? '—' : `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatQtd"])(item.quantidadeContada)} ${item.unidade}`,
                                                                    abaixo && ' ⚠'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                                lineNumber: 116,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                        lineNumber: 114,
                                                        columnNumber: 25
                                                    }, this),
                                                    item.observacao && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-amber-400/70 italic pl-1",
                                                        children: [
                                                            "💬 ",
                                                            item.observacao
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                        lineNumber: 122,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, item.insumoId, true, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                lineNumber: 113,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                        lineNumber: 109,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, cat.id, true, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                lineNumber: 102,
                                columnNumber: 15
                            }, this);
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-6"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this);
    }
    // ── Lista de contagens ─────────────────────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-4 pt-12 pb-4 flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onVoltar,
                        className: "p-2 -ml-2 text-gray-400 hover:text-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-bold text-white text-lg",
                        children: "Histórico"
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto px-4 py-4 space-y-2 max-w-lg mx-auto w-full",
                children: [
                    ordenadas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center py-20 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-4xl mb-3",
                                children: "📋"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-white font-semibold",
                                children: "Nenhuma contagem ainda"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 mt-1",
                                children: "Inicie uma nova contagem na tela principal"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                        lineNumber: 149,
                        columnNumber: 11
                    }, this) : ordenadas.map((s)=>{
                        const concluidas = s.sessoes.filter((c)=>c.status === 'concluida').length;
                        const alertas = s.sessoes.flatMap((cat)=>cat.itens.filter((i)=>i.quantidadeContada !== null && i.estoqueMinimo !== undefined && i.quantidadeContada < i.estoqueMinimo)).length;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-4 flex items-center gap-3",
                            children: [
                                s.status === 'concluida' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                    className: "w-5 h-5 text-green-400 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                    lineNumber: 164,
                                    columnNumber: 21
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                    className: "w-5 h-5 text-amber-400 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                    lineNumber: 165,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        if (s.status === 'concluida') {
                                            onVerResultado(s);
                                        } else {
                                            setDetalheId(s.id);
                                        }
                                    },
                                    className: "flex-1 text-left min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap items-center gap-1.5 mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EtiquetaData, {
                                                    iso: s.dataCriacao
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 21
                                                }, this),
                                                s.lojaNome ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EtiquetaLoja, {
                                                    nome: s.lojaNome
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 35
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                            lineNumber: 174,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500",
                                            children: [
                                                s.status === 'em_andamento' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-amber-400",
                                                    children: "Em andamento · "
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 23
                                                }, this) : null,
                                                formatarHora(s.dataCriacao),
                                                ' · ',
                                                concluidas,
                                                "/",
                                                s.sessoes.length,
                                                " sessões",
                                                alertas > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 text-amber-400",
                                                    children: [
                                                        "⚠ ",
                                                        alertas
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                                    lineNumber: 185,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                            lineNumber: 178,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                    lineNumber: 167,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "w-4 h-4 text-gray-600 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                    lineNumber: 189,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        onExcluir(s.id);
                                    },
                                    className: "p-2 text-gray-600 hover:text-red-400 transition-colors shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                        lineNumber: 195,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                                    lineNumber: 191,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, s.id, true, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                            lineNumber: 162,
                            columnNumber: 15
                        }, this);
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-6"
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/pages/Historico.tsx",
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
"[project]/drin-platform/app/estoque/pages/Alertas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Alertas",
    ()=>Alertas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Alertas({ sessions, onVoltar }) {
    const alertas = sessions.filter((s)=>s.sessoes.some((c)=>c.status === 'concluida' || c.itens.some((i)=>i.quantidadeContada !== null))).flatMap((s)=>s.sessoes.flatMap((cat)=>cat.itens.filter((i)=>i.quantidadeContada !== null && i.estoqueMinimo !== undefined && i.quantidadeContada < i.estoqueMinimo).map((i)=>({
                    categoriaIcone: cat.icone,
                    categoriaNome: cat.nome,
                    insumoNome: i.nome,
                    unidade: i.unidade,
                    quantidadeContada: i.quantidadeContada,
                    estoqueMinimo: i.estoqueMinimo,
                    falta: i.estoqueMinimo - i.quantidadeContada,
                    dataContagem: s.dataCriacao
                })))).sort((a, b)=>b.falta - a.falta);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-4 pt-12 pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onVoltar,
                            className: "p-2 -ml-2 text-gray-400 hover:text-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-bold text-white text-lg flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            className: "w-5 h-5 text-amber-400"
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                            lineNumber: 58,
                                            columnNumber: 15
                                        }, this),
                                        "Alertas de Reposição"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500 mt-0.5",
                                    children: alertas.length === 0 ? 'Nenhum alerta no momento' : `${alertas.length} item${alertas.length !== 1 ? 'ns' : ''} abaixo do mínimo`
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto px-4 py-4 space-y-5 max-w-lg mx-auto w-full",
                children: [
                    alertas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center py-20 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                className: "w-16 h-16 text-green-500/40 mb-4"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-white font-semibold",
                                children: "Tudo em ordem!"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 mt-1",
                                children: "Nenhum insumo abaixo do estoque mínimo"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: alertas.map((a, idx)=>{
                                const pct = Math.min(100, a.quantidadeContada / a.estoqueMinimo * 100);
                                const gravidade = pct < 30 ? 'critico' : pct < 60 ? 'atencao' : 'baixo';
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `rounded-2xl border p-4 ${gravidade === 'critico' ? 'bg-red-500/8 border-red-500/30' : gravidade === 'atencao' ? 'bg-amber-500/8 border-amber-500/30' : 'bg-[#1c1c1e] border-[#2a2a2e]'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between gap-2 mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold text-white text-sm",
                                                            children: a.insumoNome
                                                        }, void 0, false, {
                                                            fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                                            lineNumber: 98,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500",
                                                            children: [
                                                                a.categoriaIcone,
                                                                " ",
                                                                a.categoriaNome
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                                            lineNumber: 99,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-right shrink-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: `text-lg font-bold ${gravidade === 'critico' ? 'text-red-400' : 'text-amber-400'}`,
                                                            children: [
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatQtd"])(a.quantidadeContada),
                                                                " ",
                                                                a.unidade
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                                            lineNumber: 104,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500",
                                                            children: [
                                                                "de ",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatQtd"])(a.estoqueMinimo),
                                                                " ",
                                                                a.unidade
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                                            lineNumber: 107,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                            lineNumber: 96,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-2 bg-[#2a2a2e] rounded-full overflow-hidden mb-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `h-full rounded-full transition-all ${gravidade === 'critico' ? 'bg-red-500' : 'bg-amber-500'}`,
                                                style: {
                                                    width: `${pct}%`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                                lineNumber: 113,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                            lineNumber: 112,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between text-xs text-gray-600",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Falta: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white font-medium",
                                                            children: [
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatQtd"])(a.falta),
                                                                " ",
                                                                a.unidade
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                                            lineNumber: 123,
                                                            columnNumber: 34
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Contado em ",
                                                        new Date(a.dataContagem).toLocaleDateString('pt-BR', {
                                                            day: '2-digit',
                                                            month: 'short'
                                                        })
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                            lineNumber: 121,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, idx, true, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                                    lineNumber: 86,
                                    columnNumber: 21
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                            lineNumber: 79,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-6"
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/pages/Alertas.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_c = Alertas;
var _c;
__turbopack_context__.k.register(_c, "Alertas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/src/lib/estoque-insumos-padrao.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Lista padrão de insumos usada como seed inicial para novos usuários.
// Pode ser importada tanto pelo servidor (API) quanto pelo cliente.
__turbopack_context__.s([
    "CATEGORIAS_PADRAO",
    ()=>CATEGORIAS_PADRAO,
    "INSUMOS_PADRAO",
    ()=>INSUMOS_PADRAO
]);
const MATERIAS_PRIMAS = [
    {
        insumoId: 'abacaxi',
        nome: 'ABACAXI',
        unidade: 'un'
    },
    {
        insumoId: 'acucar',
        nome: 'AÇÚCAR',
        unidade: 'kg'
    },
    {
        insumoId: 'alho-moido',
        nome: 'ALHO MOÍDO',
        unidade: 'kg'
    },
    {
        insumoId: 'alho-crocante',
        nome: 'ALHO CROCANTE',
        unidade: 'kg'
    },
    {
        insumoId: 'amaciante-carne',
        nome: 'AMACIANTE DE CARNE',
        unidade: 'kg'
    },
    {
        insumoId: 'aneis-cebola',
        nome: 'ANÉIS DE CEBOLA',
        unidade: 'kg'
    },
    {
        insumoId: 'amendoim-granulado',
        nome: 'AMENDOIM GRANULADO',
        unidade: 'kg'
    },
    {
        insumoId: 'ameixa',
        nome: 'AMEIXA',
        unidade: 'kg'
    },
    {
        insumoId: 'atum-lata',
        nome: 'ATUM LATA',
        unidade: 'un'
    },
    {
        insumoId: 'azeite-oliva',
        nome: 'AZEITE DE OLIVA',
        unidade: 'L'
    },
    {
        insumoId: 'azeitona-preta',
        nome: 'AZEITONA PRETA',
        unidade: 'kg'
    },
    {
        insumoId: 'azeitona-verde',
        nome: 'AZEITONA VERDE',
        unidade: 'kg'
    },
    {
        insumoId: 'bacon-cru',
        nome: 'BACON (CRU)',
        unidade: 'kg'
    },
    {
        insumoId: 'banana',
        nome: 'BANANA',
        unidade: 'kg'
    },
    {
        insumoId: 'barbecue',
        nome: 'BARBECUE',
        unidade: 'kg'
    },
    {
        insumoId: 'batata-palha',
        nome: 'BATATA PALHA',
        unidade: 'kg'
    },
    {
        insumoId: 'batata-sorriso',
        nome: 'BATATA SORRISO',
        unidade: 'kg'
    },
    {
        insumoId: 'berinjela-crua',
        nome: 'BERINJELA (CRUA)',
        unidade: 'kg'
    },
    {
        insumoId: 'bolacha-negresco',
        nome: 'BOLACHA NEGRESCO',
        unidade: 'un'
    },
    {
        insumoId: 'biscoito-kitkat',
        nome: 'BISCOITO KIT KAT',
        unidade: 'un'
    },
    {
        insumoId: 'brocolis',
        nome: 'BRÓCOLIS',
        unidade: 'kg'
    },
    {
        insumoId: 'camarao',
        nome: 'CAMARÃO',
        unidade: 'kg'
    },
    {
        insumoId: 'canela',
        nome: 'CANELA',
        unidade: 'kg'
    },
    {
        insumoId: 'carne-isca-strogonoff',
        nome: 'CARNE EM ISCA (STROGONOFF)',
        unidade: 'kg'
    },
    {
        insumoId: 'carne-moida-bolonhesa',
        nome: 'CARNE MOÍDA (BOLONHESA)',
        unidade: 'kg'
    },
    {
        insumoId: 'catchup-galao',
        nome: 'CATCHUP GALÃO',
        unidade: 'un'
    },
    {
        insumoId: 'catchup-sache',
        nome: 'CATCHUP SACHE',
        unidade: 'un'
    },
    {
        insumoId: 'cebola',
        nome: 'CEBOLA',
        unidade: 'kg'
    },
    {
        insumoId: 'cebola-crocante',
        nome: 'CEBOLA CROCANTE',
        unidade: 'kg'
    },
    {
        insumoId: 'cereja',
        nome: 'CEREJA',
        unidade: 'kg'
    },
    {
        insumoId: 'champignon',
        nome: 'CHAMPIGNON',
        unidade: 'kg'
    },
    {
        insumoId: 'chocolate-branco',
        nome: 'CHOCOLATE BRANCO',
        unidade: 'kg'
    },
    {
        insumoId: 'chocolate-preto',
        nome: 'CHOCOLATE PRETO',
        unidade: 'kg'
    },
    {
        insumoId: 'coco-ralado',
        nome: 'COCO RALADO',
        unidade: 'kg'
    },
    {
        insumoId: 'confete',
        nome: 'CONFETE',
        unidade: 'un'
    },
    {
        insumoId: 'creme-leite',
        nome: 'CREME DE LEITE',
        unidade: 'un'
    },
    {
        insumoId: 'creme-beijinho',
        nome: 'CREME BEIJINHO',
        unidade: 'kg'
    },
    {
        insumoId: 'creme-pistache',
        nome: 'CREME PISTACHE',
        unidade: 'kg'
    },
    {
        insumoId: 'creme-culinario',
        nome: 'CREME CULINÁRIO',
        unidade: 'kg'
    },
    {
        insumoId: 'creme-galak',
        nome: 'CREME GALAK',
        unidade: 'kg'
    },
    {
        insumoId: 'creme-kitkat',
        nome: 'CREME KIT KAT',
        unidade: 'kg'
    },
    {
        insumoId: 'costela',
        nome: 'COSTELA',
        unidade: 'kg'
    },
    {
        insumoId: 'doce-leite',
        nome: 'DOCE DE LEITE',
        unidade: 'kg'
    },
    {
        insumoId: 'ervilha',
        nome: 'ERVILHA',
        unidade: 'kg'
    },
    {
        insumoId: 'escarola-crua',
        nome: 'ESCAROLA (CRUA)',
        unidade: 'kg'
    },
    {
        insumoId: 'doritos',
        nome: 'DORITOS',
        unidade: 'un'
    },
    {
        insumoId: 'farinha-trigo',
        nome: 'FARINHA DE TRIGO',
        unidade: 'kg'
    },
    {
        insumoId: 'fermento-biologico',
        nome: 'FERMENTO BIOLÓGICO',
        unidade: 'kg'
    },
    {
        insumoId: 'figo-calda',
        nome: 'FIGO EM CALDA',
        unidade: 'kg'
    },
    {
        insumoId: 'file-peito-sem-osso',
        nome: 'FILÉ DE PEITO SEM OSSO',
        unidade: 'kg'
    },
    {
        insumoId: 'lemon-pepper',
        nome: 'LEMON PEPPER',
        unidade: 'kg'
    },
    {
        insumoId: 'linguica-calabresa',
        nome: 'LINGUIÇA CALABRESA',
        unidade: 'kg'
    },
    {
        insumoId: 'lombo',
        nome: 'LOMBO',
        unidade: 'kg'
    },
    {
        insumoId: 'maionese-sache',
        nome: 'MAIONESE SACHE',
        unidade: 'un'
    },
    {
        insumoId: 'manjericao-italiano',
        nome: 'MANJERICÃO ITALIANO',
        unidade: 'kg'
    },
    {
        insumoId: 'margarina',
        nome: 'MARGARINA',
        unidade: 'kg'
    },
    {
        insumoId: 'milho',
        nome: 'MILHO',
        unidade: 'kg'
    },
    {
        insumoId: 'molho-pizza',
        nome: 'MOLHO PIZZA',
        unidade: 'kg'
    },
    {
        insumoId: 'molho-tomodoro',
        nome: 'MOLHO TOMODORO',
        unidade: 'kg'
    },
    {
        insumoId: 'morango',
        nome: 'MORANGO',
        unidade: 'kg'
    },
    {
        insumoId: 'mostarda-galao',
        nome: 'MOSTARDA GALÃO',
        unidade: 'un'
    },
    {
        insumoId: 'mostarda-sache',
        nome: 'MOSTARDA SACHE',
        unidade: 'un'
    },
    {
        insumoId: 'molho-pimenta-sache',
        nome: 'MOLHO PIMENTA SACHE',
        unidade: 'un'
    },
    {
        insumoId: 'oleo',
        nome: 'ÓLEO',
        unidade: 'L'
    },
    {
        insumoId: 'oregano',
        nome: 'ORÉGANO',
        unidade: 'kg'
    },
    {
        insumoId: 'ovos',
        nome: 'OVOS',
        unidade: 'un'
    },
    {
        insumoId: 'palmito',
        nome: 'PALMITO',
        unidade: 'kg'
    },
    {
        insumoId: 'pepperoni',
        nome: 'PEPPERONI',
        unidade: 'kg'
    },
    {
        insumoId: 'pessego-calda',
        nome: 'PÊSSEGO EM CALDA',
        unidade: 'kg'
    },
    {
        insumoId: 'pimenta-calabresa',
        nome: 'PIMENTA CALABRESA',
        unidade: 'kg'
    },
    {
        insumoId: 'pimentao-verde',
        nome: 'PIMENTÃO VERDE',
        unidade: 'kg'
    },
    {
        insumoId: 'pasta-alho',
        nome: 'PASTA DE ALHO',
        unidade: 'kg'
    },
    {
        insumoId: 'presunto',
        nome: 'PRESUNTO',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-catupiry',
        nome: 'QUEIJO CATUPIRY',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-cheddar',
        nome: 'QUEIJO CHEDDAR',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-gorgonzola',
        nome: 'QUEIJO GORGONZOLA',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-mussarela',
        nome: 'QUEIJO MUSSARELA',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-cream-cheese',
        nome: 'QUEIJO CREAM CHEESE',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-parmesao',
        nome: 'QUEIJO PARMESÃO',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-provolone',
        nome: 'QUEIJO PROVOLONE',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-ricota',
        nome: 'QUEIJO RICOTA',
        unidade: 'kg'
    },
    {
        insumoId: 'rucula',
        nome: 'RÚCULA',
        unidade: 'kg'
    },
    {
        insumoId: 'sal',
        nome: 'SAL',
        unidade: 'kg'
    },
    {
        insumoId: 'salame-italiano',
        nome: 'SALAME ITALIANO',
        unidade: 'kg'
    },
    {
        insumoId: 'semola',
        nome: 'SÊMOLA',
        unidade: 'kg'
    },
    {
        insumoId: 'tempero-completo',
        nome: 'TEMPERO COMPLETO',
        unidade: 'kg'
    },
    {
        insumoId: 'tomate',
        nome: 'TOMATE',
        unidade: 'kg'
    },
    {
        insumoId: 'tomate-seco',
        nome: 'TOMATE SECO',
        unidade: 'kg'
    },
    {
        insumoId: 'tomate-cereja',
        nome: 'TOMATE CEREJA',
        unidade: 'kg'
    },
    {
        insumoId: 'uva-passas',
        nome: 'UVA PASSAS',
        unidade: 'kg'
    },
    {
        insumoId: 'vinagre',
        nome: 'VINAGRE',
        unidade: 'L'
    }
];
const EMBALAGENS = [
    {
        insumoId: 'embalagem-20',
        nome: 'EMBALAGEM 20',
        unidade: 'un'
    },
    {
        insumoId: 'embalagem-25',
        nome: 'EMBALAGEM 25',
        unidade: 'un'
    },
    {
        insumoId: 'embalagem-30',
        nome: 'EMBALAGEM 30',
        unidade: 'un'
    },
    {
        insumoId: 'embalagem-35',
        nome: 'EMBALAGEM 35',
        unidade: 'un'
    },
    {
        insumoId: 'embalagem-40',
        nome: 'EMBALAGEM 40',
        unidade: 'un'
    },
    {
        insumoId: 'embalagem-calzone',
        nome: 'EMBALAGEM CALZONE',
        unidade: 'un'
    },
    {
        insumoId: 'embalagem-entradas',
        nome: 'EMBALAGEM ENTRADAS',
        unidade: 'un'
    },
    {
        insumoId: 'mesinha',
        nome: 'MESINHA',
        unidade: 'un'
    },
    {
        insumoId: 'separador',
        nome: 'SEPARADOR',
        unidade: 'un'
    }
];
const BEBIDAS = [
    {
        insumoId: 'agua-com-gas',
        nome: 'ÁGUA COM GÁS',
        unidade: 'un'
    },
    {
        insumoId: 'agua-sem-gas',
        nome: 'ÁGUA SEM GÁS',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-sol',
        nome: 'CERVEJA SOL',
        unidade: 'un'
    },
    {
        insumoId: 'energetico',
        nome: 'ENERGÉTICO',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-heineken-long-neck',
        nome: 'CERVEJA HEINEKEN LONG NECK',
        unidade: 'un'
    },
    {
        insumoId: 'cha-limao-15',
        nome: 'CHÁ LIMÃO 1,5',
        unidade: 'un'
    },
    {
        insumoId: 'cha-pessego-15',
        nome: 'CHÁ PÊSSEGO 1,5',
        unidade: 'un'
    },
    {
        insumoId: 'coca-lata',
        nome: 'COCA LATA',
        unidade: 'un'
    },
    {
        insumoId: 'coca-lata-zero',
        nome: 'COCA LATA ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'coca-600',
        nome: 'COCA 600',
        unidade: 'un'
    },
    {
        insumoId: 'coca-600-zero',
        nome: 'COCA 600 ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'coca-1litro',
        nome: 'COCA 1 LITRO',
        unidade: 'un'
    },
    {
        insumoId: 'coca-1litro-zero',
        nome: 'COCA 1 LITRO ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'coca-2litros',
        nome: 'COCA 2 LITROS',
        unidade: 'un'
    },
    {
        insumoId: 'coca-2litros-zero',
        nome: 'COCA 2 LITROS ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'fanta-guarana-lata',
        nome: 'FANTA GUARANÁ LATA',
        unidade: 'un'
    },
    {
        insumoId: 'fanta-guarana-2l',
        nome: 'FANTA GUARANÁ 2 LITROS',
        unidade: 'un'
    },
    {
        insumoId: 'fanta-guarana-zero-2l',
        nome: 'FANTA GUARANÁ ZERO 2 LITROS',
        unidade: 'un'
    },
    {
        insumoId: 'fanta-laranja-lata',
        nome: 'FANTA LARANJA LATA',
        unidade: 'un'
    },
    {
        insumoId: 'fanta-laranja-2l',
        nome: 'FANTA LARANJA 2 LITROS',
        unidade: 'un'
    },
    {
        insumoId: 'kuat-lata',
        nome: 'KUAT LATA',
        unidade: 'un'
    },
    {
        insumoId: 'kuat-2l',
        nome: 'KUAT 2 LITROS',
        unidade: 'un'
    },
    {
        insumoId: 'kuat-2l-zero',
        nome: 'KUAT 2 LITROS ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'sprite-2l',
        nome: 'SPRITE 2 LITROS',
        unidade: 'un'
    },
    {
        insumoId: 'suco-maracuja',
        nome: 'SUCO MARACUJÁ',
        unidade: 'un'
    },
    {
        insumoId: 'suco-manga',
        nome: 'SUCO DE MANGA',
        unidade: 'un'
    },
    {
        insumoId: 'suco-pessego',
        nome: 'SUCO PÊSSEGO',
        unidade: 'un'
    },
    {
        insumoId: 'suco-uva',
        nome: 'SUCO UVA',
        unidade: 'un'
    },
    {
        insumoId: 'suco-integral-uva-15',
        nome: 'SUCO INTEGRAL UVA 1,5',
        unidade: 'un'
    },
    {
        insumoId: 'tonica',
        nome: 'TÔNICA',
        unidade: 'un'
    },
    {
        insumoId: 'suco-laranja-900ml',
        nome: 'SUCO DE LARANJA 900 ML',
        unidade: 'un'
    },
    {
        insumoId: 'suco-abacaxi-900ml',
        nome: 'SUCO DE ABACAXI 900 ML',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-becks-lata',
        nome: 'CERVEJA BECKS LATA',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-becks-long-neck',
        nome: 'CERVEJA BECKS LONG NECK',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-budweiser-lata',
        nome: 'CERVEJA BUDWEISER LATA',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-spaten-long-neck',
        nome: 'CERVEJA SPATEN LONG NECK',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-spaten-lata',
        nome: 'CERVEJA SPATEN LATA',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-budweiser-long-neck',
        nome: 'CERVEJA BUDWEISER LONG NECK',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-original-lata',
        nome: 'CERVEJA ORIGINAL LATA',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-original-long-neck',
        nome: 'CERVEJA ORIGINAL LONG NECK',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-stella-lata',
        nome: 'CERVEJA STELLA ARTOIS LATA',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-stella-long-neck',
        nome: 'CERVEJA STELLA ARTOIS LONG NECK',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-lata',
        nome: 'GUARANÁ ANTÁRCTICA LATA',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-lata-zero',
        nome: 'GUARANÁ ANTÁRCTICA LATA ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-600',
        nome: 'GUARANÁ ANTÁRCTICA 600',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-200',
        nome: 'GUARANÁ ANTÁRCTICA 200',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-2l',
        nome: 'GUARANÁ ANTÁRCTICA 2L',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-2l-zero',
        nome: 'GUARANÁ ANTÁRCTICA 2L ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'pepsi-lata',
        nome: 'PEPSI LATA',
        unidade: 'un'
    },
    {
        insumoId: 'pepsi-lata-zero',
        nome: 'PEPSI LATA ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'pepsi-600',
        nome: 'PEPSI 600',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-600-zero',
        nome: 'GUARANÁ ANTÁRCTICA 600 ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'pepsi-2l',
        nome: 'PEPSI 2L',
        unidade: 'un'
    },
    {
        insumoId: 'pepsi-2l-zero',
        nome: 'PEPSI 2L ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'soda',
        nome: 'SODA',
        unidade: 'un'
    },
    {
        insumoId: 'powerade',
        nome: 'POWERADE',
        unidade: 'un'
    }
];
const CATEGORIAS_PADRAO = [
    {
        id: 'materias-primas',
        nome: 'Matéria Prima',
        icone: '🧂'
    },
    {
        id: 'embalagens',
        nome: 'Embalagens',
        icone: '📦'
    },
    {
        id: 'bebidas',
        nome: 'Bebidas',
        icone: '🥤'
    },
    {
        id: 'receitas',
        nome: 'Receitas',
        icone: '📋'
    }
];
const INSUMOS_PADRAO = [
    ...MATERIAS_PRIMAS.map((p)=>({
            ...p,
            categoriaId: 'materias-primas',
            categoriaNome: 'Matéria Prima',
            categoriaIcone: '🧂'
        })),
    ...EMBALAGENS.map((p)=>({
            ...p,
            categoriaId: 'embalagens',
            categoriaNome: 'Embalagens',
            categoriaIcone: '📦'
        })),
    ...BEBIDAS.map((p)=>({
            ...p,
            categoriaId: 'bebidas',
            categoriaNome: 'Bebidas',
            categoriaIcone: '🥤'
        }))
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GerenciarProdutos",
    ()=>GerenciarProdutos
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$a$2d$z$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownAZ$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/arrow-down-a-z.js [app-client] (ecmascript) <export default as ArrowDownAZ>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$insumos$2d$padrao$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/estoque-insumos-padrao.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
function Toggle({ ativo, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: ()=>onChange(!ativo),
        className: `relative w-11 h-6 rounded-full transition-colors shrink-0 ${ativo ? 'bg-amber-500' : 'bg-[#374151]'}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${ativo ? 'translate-x-5' : 'translate-x-0'}`
        }, void 0, false, {
            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = Toggle;
function AddModal({ onClose, onSaved }) {
    _s();
    const [nome, setNome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [unidade, setUnidade] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('kg');
    const [categoriaId, setCategoriaId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$insumos$2d$padrao$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORIAS_PADRAO"][0].id);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [erro, setErro] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const categoria = __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$insumos$2d$padrao$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORIAS_PADRAO"].find((c)=>c.id === categoriaId);
    const handleSalvar = async ()=>{
        if (!nome.trim()) {
            setErro('Informe o nome do produto.');
            return;
        }
        setSaving(true);
        setErro('');
        try {
            const res = await fetch('/api/estoque/insumos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    unidade,
                    categoriaId: categoria.id,
                    categoriaNome: categoria.nome,
                    categoriaIcone: categoria.icone
                })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao salvar');
            }
            onSaved();
            onClose();
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Erro ao salvar');
        } finally{
            setSaving(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl w-full max-w-sm p-5 space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-base font-semibold text-white",
                            children: "Novo produto"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-500 hover:text-white transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-xs text-gray-400 block mb-1",
                                    children: "Nome"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    autoFocus: true,
                                    value: nome,
                                    onChange: (e)=>setNome(e.target.value),
                                    placeholder: "Ex: MOZZARELA EXTRA",
                                    className: "w-full bg-[#141416] border border-[#374151] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/60"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                    lineNumber: 100,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs text-gray-400 block mb-1",
                                            children: "Unidade"
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                            lineNumber: 111,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: unidade,
                                            onChange: (e)=>setUnidade(e.target.value),
                                            className: "w-full bg-[#141416] border border-[#374151] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "kg",
                                                    children: "kg"
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                                    lineNumber: 117,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "un",
                                                    children: "un"
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "L",
                                                    children: "L"
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                                    lineNumber: 119,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "g",
                                                    children: "g"
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "ml",
                                                    children: "ml"
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                                    lineNumber: 121,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                            lineNumber: 112,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs text-gray-400 block mb-1",
                                            children: "Categoria"
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                            lineNumber: 126,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: categoriaId,
                                            onChange: (e)=>setCategoriaId(e.target.value),
                                            className: "w-full bg-[#141416] border border-[#374151] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$insumos$2d$padrao$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORIAS_PADRAO"].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: c.id,
                                                    children: [
                                                        c.icone,
                                                        " ",
                                                        c.nome
                                                    ]
                                                }, c.id, true, {
                                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                            lineNumber: 127,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this),
                erro && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-red-400",
                    children: erro
                }, void 0, false, {
                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                    lineNumber: 142,
                    columnNumber: 18
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 pt-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "flex-1 px-4 py-2.5 rounded-xl border border-[#374151] text-sm text-gray-400 hover:text-white transition-colors",
                            children: "Cancelar"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                            lineNumber: 145,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSalvar,
                            disabled: saving,
                            className: "flex-1 px-4 py-2.5 rounded-xl bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50",
                            children: saving ? 'Salvando…' : 'Salvar'
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                    lineNumber: 144,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
            lineNumber: 89,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(AddModal, "QYxSaFFWTPZ3GIHBrv9L14OqVZ4=");
_c1 = AddModal;
function GerenciarProdutos({ produtos, config, productOrder, onVoltar, onSetAtivo, onSetMinimo, onSetModoContagem, onSetKgPorUnidade, onMoverAcima, onMoverAbaixo, onSetProductOrder, onRefetch, onRemoveLocal }) {
    _s1();
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [reordenando, setReordenando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAdd, setShowAdd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deletingId, setDeletingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleOrdenarAlfabetico = ()=>{
        const ordenados = [
            ...produtos
        ].sort((a, b)=>a.nome.localeCompare(b.nome, 'pt-BR', {
                sensitivity: 'base'
            }));
        onSetProductOrder(ordenados.map((p)=>p.insumoId));
    };
    const allIds = produtos.map((p)=>p.insumoId);
    const produtosOrdenados = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GerenciarProdutos.useMemo[produtosOrdenados]": ()=>{
            if (productOrder.length === 0) return produtos;
            return [
                ...produtos
            ].sort({
                "GerenciarProdutos.useMemo[produtosOrdenados]": (a, b)=>{
                    const ia = productOrder.indexOf(a.insumoId);
                    const ib = productOrder.indexOf(b.insumoId);
                    if (ia === -1 && ib === -1) return 0;
                    if (ia === -1) return 1;
                    if (ib === -1) return -1;
                    return ia - ib;
                }
            }["GerenciarProdutos.useMemo[produtosOrdenados]"]);
        }
    }["GerenciarProdutos.useMemo[produtosOrdenados]"], [
        produtos,
        productOrder
    ]);
    const grupos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GerenciarProdutos.useMemo[grupos]": ()=>{
            const map = new Map();
            for (const p of produtosOrdenados){
                if (!map.has(p.sessaoId)) {
                    map.set(p.sessaoId, {
                        id: p.sessaoId,
                        nome: p.sessaoNome,
                        icone: p.sessaoIcone,
                        itens: []
                    });
                }
                map.get(p.sessaoId).itens.push(p);
            }
            return Array.from(map.values());
        }
    }["GerenciarProdutos.useMemo[grupos]"], [
        produtosOrdenados
    ]);
    const filtrados = search.trim() ? produtosOrdenados.filter((p)=>p.nome.toLowerCase().includes(search.toLowerCase())) : null;
    const totalAtivos = produtos.filter((p)=>{
        const cfg = config[p.insumoId];
        return cfg === undefined || cfg.ativo !== false;
    }).length;
    const handleDelete = async (produto)=>{
        if (deletingId) return;
        if (!confirm(`Remover "${produto.nome}" da lista?`)) return;
        setDeletingId(produto.id);
        try {
            const res = await fetch(`/api/estoque/insumos/${produto.id}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                const data = await res.json().catch(()=>({}));
                throw new Error(data.error || `HTTP ${res.status}`);
            }
            // Some na hora (por cuid + slug); o refetch só confirma o servidor
            onRemoveLocal(produto.id, produto.insumoId);
            await onRefetch();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Erro ao remover produto.');
            await onRefetch();
        } finally{
            setDeletingId(null);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] flex flex-col",
        children: [
            showAdd && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AddModal, {
                onClose: ()=>setShowAdd(false),
                onSaved: onRefetch
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                lineNumber: 251,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-4 pt-12 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onVoltar,
                                className: "p-2 -ml-2 text-gray-400 hover:text-white transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                    lineNumber: 261,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 260,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-bold text-white text-lg",
                                        children: "Produtos da Contagem"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                        lineNumber: 264,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-0.5",
                                        children: [
                                            totalAtivos,
                                            " de ",
                                            produtos.length,
                                            " produto",
                                            produtos.length !== 1 ? 's' : '',
                                            " habilitado",
                                            totalAtivos !== 1 ? 's' : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                        lineNumber: 265,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 263,
                                columnNumber: 11
                            }, this),
                            !reordenando && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleOrdenarAlfabetico,
                                title: "Ordenar A-Z",
                                className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#374151] text-gray-400 hover:text-white transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$a$2d$z$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownAZ$3e$__["ArrowDownAZ"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                        lineNumber: 275,
                                        columnNumber: 15
                                    }, this),
                                    "A-Z"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 270,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setReordenando((r)=>!r),
                                className: `text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${reordenando ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'border-[#374151] text-gray-400 hover:text-white'}`,
                                children: reordenando ? 'Concluir' : 'Reordenar'
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this),
                            !reordenando && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowAdd(true),
                                className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                        lineNumber: 294,
                                        columnNumber: 15
                                    }, this),
                                    "Novo"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 290,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this),
                    !reordenando && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 302,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: search,
                                onChange: (e)=>setSearch(e.target.value),
                                placeholder: "Buscar produto…",
                                className: "w-full bg-[#141416] border border-[#374151] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/60"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 303,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                        lineNumber: 301,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                lineNumber: 258,
                columnNumber: 7
            }, this),
            !reordenando && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-3 bg-[#141416] border-b border-[#2a2a2e]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500",
                    children: [
                        "Produtos ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white",
                            children: "desabilitados"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                            lineNumber: 317,
                            columnNumber: 22
                        }, this),
                        " não aparecem nas próximas contagens. O ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white",
                            children: "estoque mínimo"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                            lineNumber: 318,
                            columnNumber: 15
                        }, this),
                        " gera alerta quando a quantidade contada estiver abaixo."
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                    lineNumber: 316,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                lineNumber: 315,
                columnNumber: 9
            }, this),
            reordenando && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-3 bg-amber-500/10 border-b border-amber-500/20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-amber-400",
                    children: "Use as setas para definir a ordem de exibição dos produtos na contagem."
                }, void 0, false, {
                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                    lineNumber: 325,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                lineNumber: 324,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto pb-6",
                children: reordenando ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 pt-4 space-y-2",
                    children: produtosOrdenados.map((p, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl px-4 py-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-0.5 shrink-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onMoverAcima(p.insumoId, allIds),
                                            disabled: idx === 0,
                                            className: "p-1 text-gray-400 hover:text-amber-400 disabled:opacity-20 disabled:pointer-events-none transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                                lineNumber: 346,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                            lineNumber: 341,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onMoverAbaixo(p.insumoId, allIds),
                                            disabled: idx === produtosOrdenados.length - 1,
                                            className: "p-1 text-gray-400 hover:text-amber-400 disabled:opacity-20 disabled:pointer-events-none transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                                lineNumber: 353,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                            lineNumber: 348,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                    lineNumber: 340,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-white truncate",
                                            children: p.nome
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                            lineNumber: 357,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-600",
                                            children: p.unidade
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                            lineNumber: 358,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                    lineNumber: 356,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-gray-600 shrink-0",
                                    children: idx + 1
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                    lineNumber: 360,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, p.id, true, {
                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                            lineNumber: 336,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                    lineNumber: 334,
                    columnNumber: 11
                }, this) : filtrados ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 pt-4 space-y-2",
                    children: filtrados.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center text-gray-500 text-sm py-8",
                        children: "Nenhum produto encontrado"
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                        lineNumber: 367,
                        columnNumber: 15
                    }, this) : filtrados.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProdutoRow, {
                            produto: p,
                            config: config[p.insumoId],
                            deleting: deletingId === p.id,
                            onSetAtivo: onSetAtivo,
                            onSetMinimo: onSetMinimo,
                            onSetModoContagem: onSetModoContagem,
                            onSetKgPorUnidade: onSetKgPorUnidade,
                            onDelete: handleDelete
                        }, p.id, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                            lineNumber: 370,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                    lineNumber: 365,
                    columnNumber: 11
                }, this) : grupos.map((grupo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 px-4 pt-5 pb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-base",
                                        children: grupo.icone
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                        lineNumber: 388,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold text-gray-400 uppercase tracking-wider",
                                        children: grupo.nome
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                        lineNumber: 389,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-600 ml-auto",
                                        children: [
                                            grupo.itens.filter((p)=>{
                                                const cfg = config[p.insumoId];
                                                return cfg === undefined || cfg.ativo !== false;
                                            }).length,
                                            "/",
                                            grupo.itens.length
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                        lineNumber: 392,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 387,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-4 space-y-2",
                                children: grupo.itens.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProdutoRow, {
                                        produto: p,
                                        config: config[p.insumoId],
                                        deleting: deletingId === p.id,
                                        onSetAtivo: onSetAtivo,
                                        onSetMinimo: onSetMinimo,
                                        onSetModoContagem: onSetModoContagem,
                                        onSetKgPorUnidade: onSetKgPorUnidade,
                                        onDelete: handleDelete
                                    }, p.id, false, {
                                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                        lineNumber: 401,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 399,
                                columnNumber: 15
                            }, this)
                        ]
                    }, grupo.id, true, {
                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                        lineNumber: 386,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                lineNumber: 332,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
        lineNumber: 249,
        columnNumber: 5
    }, this);
}
_s1(GerenciarProdutos, "cLWsN+wpmL5gsO+XYR6fkgpEC5I=");
_c2 = GerenciarProdutos;
function ProdutoRow({ produto, config, deleting, onSetAtivo, onSetMinimo, onSetModoContagem, onSetKgPorUnidade, onDelete }) {
    const ativo = config?.ativo !== false;
    const minimo = config?.estoqueMinimo;
    // Padrão alinhado com construirSessoes: itens com unidade 'un' são contados por unidade por padrão
    const modo = config?.modoContagem ?? (produto.unidade === 'un' ? 'unidade' : 'kg');
    const kgPorUnidade = config?.kgPorUnidade;
    const handleMinimo = (raw)=>{
        if (raw === '') {
            onSetMinimo(produto.insumoId, undefined);
            return;
        }
        const n = parseFloat(raw.replace(',', '.'));
        if (!isNaN(n) && n >= 0) onSetMinimo(produto.insumoId, n);
    };
    const handleKgPorUnidade = (raw)=>{
        if (raw === '') {
            onSetKgPorUnidade(produto.insumoId, undefined);
            return;
        }
        const n = parseFloat(raw.replace(',', '.'));
        if (!isNaN(n) && n > 0) onSetKgPorUnidade(produto.insumoId, n);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-2xl border px-4 py-3 transition-colors ${ativo ? 'bg-[#1c1c1e] border-[#2a2a2e]' : 'bg-[#141416] border-[#2a2a2e] opacity-50'} ${deleting ? 'opacity-30 pointer-events-none' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Toggle, {
                        ativo: ativo,
                        onChange: (v)=>onSetAtivo(produto.insumoId, v)
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                        lineNumber: 470,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-sm font-medium truncate ${ativo ? 'text-white' : 'text-gray-500'}`,
                                children: produto.nome
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 473,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-600",
                                children: produto.unidade
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 476,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                        lineNumber: 472,
                        columnNumber: 9
                    }, this),
                    ativo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500",
                                children: "mín:"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 481,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                inputMode: "decimal",
                                min: "0",
                                step: "0.1",
                                value: minimo ?? '',
                                onChange: (e)=>handleMinimo(e.target.value),
                                placeholder: "—",
                                className: "w-16 text-right text-sm font-medium bg-[#2a2a2e] border border-[#374151] rounded-lg px-2 py-1 text-white focus:outline-none focus:border-amber-500/60 placeholder-gray-700"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 482,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-600",
                                children: produto.unidade
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 492,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                        lineNumber: 480,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onDelete(produto),
                        className: "ml-1 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0",
                        title: "Remover produto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                            className: "w-3.5 h-3.5"
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                            lineNumber: 501,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                        lineNumber: 496,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                lineNumber: 469,
                columnNumber: 7
            }, this),
            ativo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2.5 flex items-center gap-2 pl-14",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-gray-500 shrink-0",
                        children: "Contar por:"
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                        lineNumber: 507,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex rounded-lg overflow-hidden border border-[#374151] shrink-0",
                        children: [
                            'kg',
                            'unidade'
                        ].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onSetModoContagem(produto.insumoId, m),
                                className: `px-3 py-1 text-xs font-medium transition-colors ${modo === m ? 'bg-amber-500 text-black' : 'bg-[#2a2a2e] text-gray-400 hover:text-white'}`,
                                children: m === 'kg' ? produto.unidade : 'unidade'
                            }, m, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 511,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                        lineNumber: 509,
                        columnNumber: 11
                    }, this),
                    modo === 'unidade' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500 shrink-0",
                                children: "1 un ="
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 527,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                inputMode: "decimal",
                                min: "0.001",
                                step: "0.1",
                                value: kgPorUnidade ?? '',
                                onChange: (e)=>handleKgPorUnidade(e.target.value),
                                placeholder: "0,0",
                                className: "w-16 text-right text-sm font-medium bg-[#2a2a2e] border border-[#374151] rounded-lg px-2 py-1 text-white focus:outline-none focus:border-amber-500/60 placeholder-gray-700"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 528,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-600",
                                children: produto.unidade
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                                lineNumber: 538,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                        lineNumber: 526,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
                lineNumber: 506,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx",
        lineNumber: 464,
        columnNumber: 5
    }, this);
}
_c3 = ProdutoRow;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Toggle");
__turbopack_context__.k.register(_c1, "AddModal");
__turbopack_context__.k.register(_c2, "GerenciarProdutos");
__turbopack_context__.k.register(_c3, "ProdutoRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/estoque/components/ContagemResultado.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContagemResultado",
    ()=>ContagemResultado
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$xlsx$2d$js$2d$style$2f$dist$2f$xlsx$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/xlsx-js-style/dist/xlsx.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/recharts/es6/component/Cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$date$2d$fns$2f$locale$2f$pt$2d$BR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/date-fns/locale/pt-BR.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function borderAll(rgb) {
    const side = {
        style: 'thin',
        color: {
            rgb
        }
    };
    return {
        top: side,
        bottom: side,
        left: side,
        right: side
    };
}
function exportXLSX(contagens, storeName, storeSlug, data) {
    const headerStyle = {
        font: {
            bold: true,
            color: {
                rgb: 'FFFFFF'
            },
            sz: 12
        },
        fill: {
            fgColor: {
                rgb: '378ADD'
            }
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        border: borderAll('FFFFFF')
    };
    const labelCellStyle = {
        font: {
            sz: 11
        },
        alignment: {
            horizontal: 'left',
            vertical: 'center'
        },
        border: borderAll('D9D9D9')
    };
    const numberCellStyle = {
        font: {
            sz: 11
        },
        alignment: {
            horizontal: 'right',
            vertical: 'center'
        },
        numFmt: '#,##0.###',
        border: borderAll('D9D9D9')
    };
    const naoContadoStyle = {
        font: {
            sz: 11,
            italic: true,
            color: {
                rgb: '999999'
            }
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        border: borderAll('D9D9D9')
    };
    const zeradoFill = {
        fgColor: {
            rgb: 'FCEBEB'
        }
    };
    const titleRow = [
        `Contagem de estoque — ${storeName}`
    ];
    const subtitleRow = [
        `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })}`
    ];
    const colHeaders = [
        'Insumo',
        'Quantidade',
        'Unidade'
    ];
    const dataRows = contagens.map((c)=>[
            c.nome,
            c.quantidade,
            c.unidade
        ]);
    const aoa = [
        titleRow,
        subtitleRow,
        [],
        colHeaders,
        ...dataRows
    ];
    const ws = __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$xlsx$2d$js$2d$style$2f$dist$2f$xlsx$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].aoa_to_sheet(aoa);
    ws['!merges'] = [
        {
            s: {
                r: 0,
                c: 0
            },
            e: {
                r: 0,
                c: 2
            }
        },
        {
            s: {
                r: 1,
                c: 0
            },
            e: {
                r: 1,
                c: 2
            }
        }
    ];
    if (ws['A1']) {
        ws['A1'].s = {
            font: {
                bold: true,
                sz: 14,
                color: {
                    rgb: '1A1A1A'
                }
            },
            alignment: {
                horizontal: 'left'
            }
        };
    }
    if (ws['A2']) {
        ws['A2'].s = {
            font: {
                sz: 10,
                color: {
                    rgb: '666666'
                },
                italic: true
            },
            alignment: {
                horizontal: 'left'
            }
        };
    }
    const headerRowIdx = 3;
    [
        'A',
        'B',
        'C'
    ].forEach((col)=>{
        const ref = `${col}${headerRowIdx + 1}`;
        if (ws[ref]) ws[ref].s = headerStyle;
    });
    contagens.forEach((c, i)=>{
        const rowNum = headerRowIdx + 1 + i + 1; // 1-indexed Excel row
        const rA = `A${rowNum}`;
        const rB = `B${rowNum}`;
        const rC = `C${rowNum}`;
        const isZerado = c.quantidade === 0;
        const isNaoContado = c.quantidade === null;
        if (ws[rA]) {
            ws[rA].s = {
                ...labelCellStyle,
                fill: isZerado ? zeradoFill : undefined
            };
        }
        if (ws[rB]) {
            if (isNaoContado) {
                ws[rB].v = 'não contado';
                ws[rB].t = 's';
                ws[rB].s = naoContadoStyle;
            } else {
                ws[rB].s = {
                    ...numberCellStyle,
                    fill: isZerado ? zeradoFill : undefined
                };
            }
        }
        if (ws[rC]) {
            ws[rC].s = {
                ...labelCellStyle,
                fill: isZerado ? zeradoFill : undefined
            };
        }
    });
    const maxNomeLen = Math.max(...contagens.map((c)=>c.nome.length), 'Insumo'.length);
    ws['!cols'] = [
        {
            wch: Math.min(maxNomeLen + 2, 40)
        },
        {
            wch: 14
        },
        {
            wch: 10
        }
    ];
    ws['!freeze'] = {
        xSplit: 0,
        ySplit: headerRowIdx + 1
    };
    const wb = __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$xlsx$2d$js$2d$style$2f$dist$2f$xlsx$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
    __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$xlsx$2d$js$2d$style$2f$dist$2f$xlsx$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'Contagem');
    const fileName = `contagem_${storeSlug}_${data.toISOString().slice(0, 10)}.xlsx`;
    __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$xlsx$2d$js$2d$style$2f$dist$2f$xlsx$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, fileName);
}
// ── Sub-components ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#1c1c1e] border border-[#2a2a2e]/60 rounded-2xl p-4 flex flex-col gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-gray-500",
                children: label
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-2xl text-white tabular-nums",
                children: value
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            sub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-gray-600 truncate",
                children: sub
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                lineNumber: 168,
                columnNumber: 15
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
_c = MetricCard;
function ChartTooltip({ payload }) {
    if (!payload) return null;
    const d = payload;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-xl px-3 py-2 text-xs shadow-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-white font-medium mb-0.5",
                children: d.nome
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400",
                children: [
                    d.quantidade.toLocaleString('pt-BR'),
                    " ",
                    d.unidade
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
        lineNumber: 185,
        columnNumber: 5
    }, this);
}
_c1 = ChartTooltip;
function ContagemResultado({ storeId, storeName, contagens, sessoes, finalizadaEm, onVoltar }) {
    _s();
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // ── Métricas ─────────────────────────────────────────────────────────────────
    const contados = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ContagemResultado.useMemo[contados]": ()=>contagens.filter({
                "ContagemResultado.useMemo[contados]": (c)=>c.quantidade !== null
            }["ContagemResultado.useMemo[contados]"])
    }["ContagemResultado.useMemo[contados]"], [
        contagens
    ]);
    const zerados = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ContagemResultado.useMemo[zerados]": ()=>contagens.filter({
                "ContagemResultado.useMemo[zerados]": (c)=>c.quantidade === 0
            }["ContagemResultado.useMemo[zerados]"])
    }["ContagemResultado.useMemo[zerados]"], [
        contagens
    ]);
    const naoContados = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ContagemResultado.useMemo[naoContados]": ()=>contagens.filter({
                "ContagemResultado.useMemo[naoContados]": (c)=>c.quantidade === null
            }["ContagemResultado.useMemo[naoContados]"])
    }["ContagemResultado.useMemo[naoContados]"], [
        contagens
    ]);
    const maiorItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ContagemResultado.useMemo[maiorItem]": ()=>{
            return contagens.filter({
                "ContagemResultado.useMemo[maiorItem]": (c)=>c.quantidade !== null && c.quantidade > 0
            }["ContagemResultado.useMemo[maiorItem]"]).reduce({
                "ContagemResultado.useMemo[maiorItem]": (acc, c)=>acc === null || c.quantidade > acc.quantidade ? {
                        nome: c.nome,
                        quantidade: c.quantidade,
                        unidade: c.unidade
                    } : acc
            }["ContagemResultado.useMemo[maiorItem]"], null);
        }
    }["ContagemResultado.useMemo[maiorItem]"], [
        contagens
    ]);
    // ── Gráfico: top 15 ───────────────────────────────────────────────────────────
    const top15 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ContagemResultado.useMemo[top15]": ()=>{
            return contagens.filter({
                "ContagemResultado.useMemo[top15]": (c)=>c.quantidade !== null && c.quantidade > 0
            }["ContagemResultado.useMemo[top15]"]).sort({
                "ContagemResultado.useMemo[top15]": (a, b)=>b.quantidade - a.quantidade
            }["ContagemResultado.useMemo[top15]"]).slice(0, 15).map({
                "ContagemResultado.useMemo[top15]": (c)=>({
                        nome: c.nome,
                        nomeLabel: c.nome.length > 18 ? c.nome.slice(0, 17) + '…' : c.nome,
                        quantidade: c.quantidade,
                        unidade: c.unidade
                    })
            }["ContagemResultado.useMemo[top15]"]);
        }
    }["ContagemResultado.useMemo[top15]"], [
        contagens
    ]);
    const chartHeight = Math.max(top15.length * 44 + 80, 300);
    // ── Tabela com busca ─────────────────────────────────────────────────────────
    const tabelaOrdenada = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ContagemResultado.useMemo[tabelaOrdenada]": ()=>{
            return [
                ...contagens
            ].sort({
                "ContagemResultado.useMemo[tabelaOrdenada]": (a, b)=>{
                    if (a.quantidade === null && b.quantidade === null) return 0;
                    if (a.quantidade === null) return 1;
                    if (b.quantidade === null) return -1;
                    return b.quantidade - a.quantidade;
                }
            }["ContagemResultado.useMemo[tabelaOrdenada]"]);
        }
    }["ContagemResultado.useMemo[tabelaOrdenada]"], [
        contagens
    ]);
    const tabelaFiltrada = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ContagemResultado.useMemo[tabelaFiltrada]": ()=>{
            const term = search.trim().toLowerCase();
            if (!term) return tabelaOrdenada;
            return tabelaOrdenada.filter({
                "ContagemResultado.useMemo[tabelaFiltrada]": (c)=>c.nome.toLowerCase().includes(term)
            }["ContagemResultado.useMemo[tabelaFiltrada]"]);
        }
    }["ContagemResultado.useMemo[tabelaFiltrada]"], [
        tabelaOrdenada,
        search
    ]);
    const maxQtd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ContagemResultado.useMemo[maxQtd]": ()=>contagens.filter({
                "ContagemResultado.useMemo[maxQtd]": (c)=>c.quantidade !== null && c.quantidade > 0
            }["ContagemResultado.useMemo[maxQtd]"]).reduce({
                "ContagemResultado.useMemo[maxQtd]": (m, c)=>Math.max(m, c.quantidade)
            }["ContagemResultado.useMemo[maxQtd]"], 0)
    }["ContagemResultado.useMemo[maxQtd]"], [
        contagens
    ]);
    // ── Formatação ────────────────────────────────────────────────────────────────
    const dataFormatada = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(finalizadaEm, "dd/MM/yyyy 'às' HH:mm", {
        locale: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$date$2d$fns$2f$locale$2f$pt$2d$BR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ptBR"]
    });
    const sessaoLabel = sessoes === 1 ? '1 sessão' : `${sessoes} sessões`;
    const storeSlug = storeId.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    // ── Render ────────────────────────────────────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-4 pt-12 pb-5 sticky top-0 z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-2xl mx-auto flex items-start justify-between gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] text-gray-600 uppercase tracking-widest mb-0.5",
                                    children: "Plateful · Contagem de estoque"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                    lineNumber: 296,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-base text-white",
                                    children: "Resultado da contagem"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                    lineNumber: 299,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500 mt-0.5 truncate",
                                    children: [
                                        dataFormatada,
                                        " · ",
                                        storeName,
                                        " · ",
                                        sessaoLabel
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                    lineNumber: 300,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                            lineNumber: 295,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>exportXLSX(contagens, storeName, storeSlug, finalizadaEm),
                            className: "shrink-0 flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-[#374151] rounded-xl px-3 py-2 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "w-3.5 h-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                    lineNumber: 308,
                                    columnNumber: 13
                                }, this),
                                "Exportar planilha"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                            lineNumber: 304,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                    lineNumber: 294,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                lineNumber: 293,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto px-4 py-6 space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-px bg-[#2a2a2e]"
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                        lineNumber: 316,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                label: "Insumos contados",
                                value: contados.length,
                                sub: `de ${contagens.length} total`
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                lineNumber: 320,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                label: "Zerados",
                                value: zerados.length,
                                sub: zerados.length > 0 ? 'precisam de reposição' : 'nenhum item'
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                lineNumber: 325,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                label: "Não contados",
                                value: naoContados.length,
                                sub: naoContados.length > 0 ? 'sem registro' : 'todos registrados'
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                lineNumber: 330,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                label: "Maior estoque",
                                value: maiorItem ? maiorItem.quantidade.toLocaleString('pt-BR') : '—',
                                sub: maiorItem ? `${maiorItem.nome} (${maiorItem.unidade})` : undefined
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                lineNumber: 339,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                        lineNumber: 319,
                        columnNumber: 9
                    }, this),
                    top15.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#1c1c1e] border border-[#2a2a2e]/60 rounded-2xl p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500 mb-4",
                                children: [
                                    "Top ",
                                    top15.length,
                                    " insumos por quantidade"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: chartHeight
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                    width: "100%",
                                    height: "100%",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                                        data: top15,
                                        layout: "vertical",
                                        margin: {
                                            top: 0,
                                            right: 24,
                                            bottom: 0,
                                            left: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                                type: "number",
                                                tick: {
                                                    fill: '#6b7280',
                                                    fontSize: 10
                                                },
                                                tickLine: false,
                                                axisLine: false,
                                                tickFormatter: (v)=>v.toLocaleString('pt-BR')
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                lineNumber: 365,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                                type: "category",
                                                dataKey: "nomeLabel",
                                                width: 130,
                                                tick: {
                                                    fill: '#9ca3af',
                                                    fontSize: 11
                                                },
                                                tickLine: false,
                                                axisLine: false
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                lineNumber: 372,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                cursor: {
                                                    fill: 'rgba(255,255,255,0.04)'
                                                },
                                                content: ({ payload })=>payload?.[0] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChartTooltip, {
                                                        payload: payload[0].payload
                                                    }, void 0, false, {
                                                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                        lineNumber: 384,
                                                        columnNumber: 25
                                                    }, void 0) : null
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                lineNumber: 380,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                                dataKey: "quantidade",
                                                radius: [
                                                    0,
                                                    6,
                                                    6,
                                                    0
                                                ],
                                                maxBarSize: 24,
                                                children: top15.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                                        fill: "#378ADD",
                                                        fillOpacity: 0.85
                                                    }, i, false, {
                                                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                        lineNumber: 390,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                lineNumber: 388,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                        lineNumber: 360,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                    lineNumber: 359,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                lineNumber: 358,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                        lineNumber: 354,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#1c1c1e] border border-[#2a2a2e]/60 rounded-2xl overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-4 py-3 border-b border-[#2a2a2e]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none"
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                            lineNumber: 404,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: search,
                                            onChange: (e)=>setSearch(e.target.value),
                                            placeholder: "Buscar insumo…",
                                            className: "w-full bg-[#2a2a2e] text-white text-sm rounded-xl pl-8 pr-4 py-2 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#378ADD]/40"
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                            lineNumber: 405,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                    lineNumber: 403,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                lineNumber: 402,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 border-b border-[#2a2a2e] text-[10px] text-gray-600 uppercase tracking-wider",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Insumo"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                        lineNumber: 417,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-right",
                                        children: "Quantidade"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                        lineNumber: 418,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-16 text-right hidden sm:block",
                                        children: "Gráfico"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                        lineNumber: 419,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                lineNumber: 416,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "divide-y divide-[#2a2a2e]/60",
                                children: tabelaFiltrada.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center justify-center py-12 text-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                            className: "w-8 h-8 text-gray-700"
                                        }, void 0, false, {
                                            fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                            lineNumber: 426,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-600",
                                            children: [
                                                'Nenhum resultado para "',
                                                search,
                                                '"'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                            lineNumber: 427,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                    lineNumber: 425,
                                    columnNumber: 15
                                }, this) : tabelaFiltrada.map((c, i)=>{
                                    const pct = c.quantidade !== null && maxQtd > 0 ? c.quantidade / maxQtd * 100 : 0;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-[1fr_auto_auto] gap-3 items-center px-4 py-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-300 truncate",
                                                children: c.nome
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                lineNumber: 441,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5 justify-end",
                                                children: c.quantidade === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-gray-600 bg-[#2a2a2e] rounded-full px-2 py-0.5",
                                                    children: "não contado"
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                    lineNumber: 448,
                                                    columnNumber: 25
                                                }, this) : c.quantidade === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-red-400/80 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5",
                                                    children: "zerado"
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                    lineNumber: 452,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-white tabular-nums",
                                                            children: c.quantidade.toLocaleString('pt-BR')
                                                        }, void 0, false, {
                                                            fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                            lineNumber: 457,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] text-gray-600 bg-[#2a2a2e] rounded-full px-1.5 py-0.5",
                                                            children: c.unidade
                                                        }, void 0, false, {
                                                            fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                            lineNumber: 460,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                lineNumber: 446,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-16 hidden sm:block",
                                                children: c.quantidade !== null && c.quantidade > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-1.5 bg-[#2a2a2e] rounded-full overflow-hidden",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-full rounded-full bg-[#378ADD]/70",
                                                        style: {
                                                            width: `${pct}%`
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                        lineNumber: 471,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                    lineNumber: 470,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-1.5 bg-[#2a2a2e] rounded-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                    lineNumber: 477,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                                lineNumber: 468,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                        lineNumber: 436,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                                lineNumber: 423,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                        lineNumber: 400,
                        columnNumber: 9
                    }, this),
                    onVoltar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onVoltar,
                        className: "w-full py-3.5 rounded-2xl bg-[#1c1c1e] border border-[#2a2a2e] text-gray-400 hover:text-white text-sm transition-colors",
                        children: "Voltar ao início"
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                        lineNumber: 489,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-8"
                    }, void 0, false, {
                        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                        lineNumber: 497,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/components/ContagemResultado.tsx",
        lineNumber: 291,
        columnNumber: 5
    }, this);
}
_s(ContagemResultado, "mvQ2JnCYDRbnYeEJZQe8+UwBl60=");
_c2 = ContagemResultado;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "MetricCard");
__turbopack_context__.k.register(_c1, "ChartTooltip");
__turbopack_context__.k.register(_c2, "ContagemResultado");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EstoqueDashboard",
    ()=>EstoqueDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/history.js [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/hooks/useStockSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/hooks/useProdutosEstoque.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$hooks$2f$useEstoqueConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/hooks/useEstoqueConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$HomeScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/components/HomeScreen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$AlertBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/components/AlertBadge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$pages$2f$Contagem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/pages/Contagem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$pages$2f$Historico$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/pages/Historico.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$pages$2f$Alertas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/pages/Alertas.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$pages$2f$GerenciarProdutos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/pages/GerenciarProdutos.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$ContagemResultado$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/estoque/components/ContagemResultado.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
function EstoqueDashboard() {
    _s();
    const [screen, setScreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('home');
    const [sessaoFinalizada, setSessaoFinalizada] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sessaoHistorico, setSessaoHistorico] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showLojaModal, setShowLojaModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lojas, setLojas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingLojas, setLoadingLojas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { config, productOrder, hydrated: configHydrated, getConfig, setAtivo, setMinimo, setModoContagem, setKgPorUnidade, setProductOrder, moverProdutoAcima, moverProdutoAbaixo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$hooks$2f$useEstoqueConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEstoqueConfig"])();
    const { sessions, activeSession, hydrated, saveStatus, iniciarContagem, retomarContagem, fecharContagem, atualizarQuantidade, atualizarObservacao, concluirCategoria, reabrirCategoria, finalizarContagem, excluirContagem, calcularAlertasReposicao } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStockSession"])();
    const { produtos, sessoes: sessoesProdutos, isLoading: produtosLoading, error: produtosError, refetch, removeLocal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProdutosEstoque"])(config, productOrder);
    const totalAlertas = sessions.filter((s)=>s.status === 'concluida').flatMap((s)=>calcularAlertasReposicao(s)).length;
    // ── Loading (aguarda apenas config do banco) ──────────────────────────────
    if (!hydrated || !configHydrated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500",
                    children: "Carregando…"
                }, void 0, false, {
                    fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this);
    }
    const abrirSelecaoLoja = async ()=>{
        setLoadingLojas(true);
        setShowLojaModal(true);
        try {
            const res = await fetch('/api/rh/lojas');
            if (res.ok) setLojas(await res.json());
        } catch  {} finally{
            setLoadingLojas(false);
        }
    };
    const handleIniciarComLoja = async (lojaNome)=>{
        setShowLojaModal(false);
        // Catálogo fresco: produtos adicionados em "Produtos da Contagem" entram já na retomada
        const insumosAtualizados = await refetch();
        const sessoesIniciais = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["construirSessoes"])(insumosAtualizados ?? produtos, config, productOrder);
        // forceNew=false: retoma a contagem ativa desta loja se já existir;
        // ao retomar, o snapshot é sincronizado com o catálogo (inclui exclusões)
        await iniciarContagem(sessoesIniciais, 'Gerente', false, lojaNome);
        setScreen('counting');
    };
    const handleRetomar = async (sessionId)=>{
        const insumosAtualizados = await refetch();
        const catalogo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["construirSessoes"])(insumosAtualizados ?? produtos, config, productOrder);
        retomarContagem(sessionId, catalogo);
        setScreen('counting');
    };
    // ── Telas sem bottom nav ───────────────────────────────────────────────────
    if (screen === 'counting' && activeSession) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$pages$2f$Contagem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Contagem"], {
            session: activeSession,
            saveStatus: saveStatus,
            onFechar: ()=>{
                fecharContagem();
                setScreen('home');
            },
            onQuantidade: atualizarQuantidade,
            onObservacao: atualizarObservacao,
            onConcluirCategoria: concluirCategoria,
            onReabrirCategoria: reabrirCategoria,
            onFinalizar: ()=>{
                setSessaoFinalizada(activeSession);
                finalizarContagem();
                setScreen('resultado');
            }
        }, void 0, false, {
            fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
            lineNumber: 113,
            columnNumber: 7
        }, this);
    }
    if (screen === 'resultado' && sessaoFinalizada) {
        const contagens = sessaoFinalizada.sessoes.flatMap((cat)=>cat.itens.map((item)=>({
                    nome: item.nome,
                    quantidade: item.quantidadeContada,
                    unidade: item.unidade
                })));
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$ContagemResultado$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContagemResultado"], {
            storeId: "loja",
            storeName: sessaoFinalizada.lojaNome || 'Loja',
            contagens: contagens,
            sessoes: sessaoFinalizada.sessoes.length,
            finalizadaEm: new Date(sessaoFinalizada.dataCriacao),
            onVoltar: ()=>{
                setSessaoFinalizada(null);
                setScreen('home');
            }
        }, void 0, false, {
            fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
            lineNumber: 139,
            columnNumber: 7
        }, this);
    }
    if (screen === 'resultado-historico' && sessaoHistorico) {
        const contagens = sessaoHistorico.sessoes.flatMap((cat)=>cat.itens.map((item)=>({
                    nome: item.nome,
                    quantidade: item.quantidadeContada,
                    unidade: item.unidade
                })));
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$ContagemResultado$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContagemResultado"], {
            storeId: "loja",
            storeName: sessaoHistorico.lojaNome || 'Loja',
            contagens: contagens,
            sessoes: sessaoHistorico.sessoes.length,
            finalizadaEm: new Date(sessaoHistorico.dataCriacao),
            onVoltar: ()=>{
                setSessaoHistorico(null);
                setScreen('history');
            }
        }, void 0, false, {
            fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
            lineNumber: 159,
            columnNumber: 7
        }, this);
    }
    if (screen === 'history') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$pages$2f$Historico$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Historico"], {
            sessions: sessions,
            onVoltar: ()=>setScreen('home'),
            onRetomar: handleRetomar,
            onExcluir: excluirContagem,
            onVerResultado: (s)=>{
                setSessaoHistorico(s);
                setScreen('resultado-historico');
            }
        }, void 0, false, {
            fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
            lineNumber: 172,
            columnNumber: 7
        }, this);
    }
    if (screen === 'alerts') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$pages$2f$Alertas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alertas"], {
            sessions: sessions,
            onVoltar: ()=>setScreen('home')
        }, void 0, false, {
            fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
            lineNumber: 184,
            columnNumber: 7
        }, this);
    }
    if (screen === 'products') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$pages$2f$GerenciarProdutos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GerenciarProdutos"], {
            produtos: produtos,
            config: config,
            productOrder: productOrder,
            onVoltar: ()=>setScreen('home'),
            onSetAtivo: setAtivo,
            onSetMinimo: setMinimo,
            onSetModoContagem: setModoContagem,
            onSetKgPorUnidade: setKgPorUnidade,
            onMoverAcima: moverProdutoAcima,
            onMoverAbaixo: moverProdutoAbaixo,
            onSetProductOrder: setProductOrder,
            onRefetch: refetch,
            onRemoveLocal: removeLocal
        }, void 0, false, {
            fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
            lineNumber: 193,
            columnNumber: 7
        }, this);
    }
    // ── Home + bottom nav ──────────────────────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            showLojaModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl w-full max-w-sm shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-5 pt-5 pb-3 border-b border-[#2a2a2e]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-base font-semibold text-white",
                                    children: "Qual loja está sendo contada?"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                    lineNumber: 220,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500 mt-0.5",
                                    children: "Selecione para identificar o histórico"
                                }, void 0, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                    lineNumber: 221,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                            lineNumber: 219,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 space-y-1.5 max-h-72 overflow-y-auto",
                            children: loadingLojas ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center py-6 gap-2 text-gray-500 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                        lineNumber: 226,
                                        columnNumber: 19
                                    }, this),
                                    "Carregando lojas…"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                lineNumber: 225,
                                columnNumber: 17
                            }, this) : lojas.length > 0 ? lojas.map((loja)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleIniciarComLoja(loja.nome),
                                    className: "w-full text-left px-4 py-3 rounded-xl bg-[#2a2a2e] hover:bg-amber-500/10 hover:border-amber-500/30 border border-transparent text-white text-sm font-medium transition-all",
                                    children: loja.nome
                                }, loja.id, false, {
                                    fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                    lineNumber: 231,
                                    columnNumber: 19
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 text-center py-4",
                                children: "Nenhuma loja cadastrada no RH"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                lineNumber: 240,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                            lineNumber: 223,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-3 pb-3 pt-1 border-t border-[#2a2a2e]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleIniciarComLoja(undefined),
                                className: "w-full py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-[#2a2a2e] transition-colors",
                                children: "Continuar sem selecionar loja"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                lineNumber: 246,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                            lineNumber: 245,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                    lineNumber: 218,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                lineNumber: 217,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$HomeScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HomeScreen"], {
                sessions: sessions,
                onIniciar: abrirSelecaoLoja,
                onRetomar: handleRetomar,
                onExcluir: excluirContagem
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                lineNumber: 257,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-0 left-0 right-0 bg-[#1c1c1e] border-t border-[#2a2a2e] flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setScreen('history'),
                        className: "flex-1 flex flex-col items-center gap-1 py-3 text-gray-500 hover:text-white transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                children: "Histórico"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                lineNumber: 272,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setScreen('products'),
                        className: "flex-1 flex flex-col items-center gap-1 py-3 text-gray-500 hover:text-white transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                children: "Produtos"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setScreen('alerts'),
                        className: "flex-1 flex flex-col items-center gap-1 py-3 text-gray-500 hover:text-white transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                        lineNumber: 286,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$components$2f$AlertBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertBadge"], {
                                        count: totalAlertas,
                                        className: "absolute -top-2 -right-2 scale-75"
                                    }, void 0, false, {
                                        fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                        lineNumber: 287,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                lineNumber: 285,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                children: "Alertas"
                            }, void 0, false, {
                                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                                lineNumber: 289,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                        lineNumber: 281,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                lineNumber: 266,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-20"
            }, void 0, false, {
                fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
                lineNumber: 293,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/drin-platform/app/estoque/components/EstoqueDashboard.tsx",
        lineNumber: 213,
        columnNumber: 5
    }, this);
}
_s(EstoqueDashboard, "wbzeIWQNp/74YjklGscDM+RSUmo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$hooks$2f$useEstoqueConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEstoqueConfig"],
        __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStockSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f$estoque$2f$hooks$2f$useProdutosEstoque$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProdutosEstoque"]
    ];
});
_c = EstoqueDashboard;
var _c;
__turbopack_context__.k.register(_c, "EstoqueDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=drin-platform_e7b80323._.js.map