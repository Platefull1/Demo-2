module.exports = [
"[project]/Demo-2/src/components/layout/ModuleTabs.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModuleTabs",
    ()=>ModuleTabs,
    "moduleTabClass",
    ()=>moduleTabClass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
function ModuleTabs({ children, className, borderless }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-1 overflow-x-auto overflow-y-hidden -mx-1 px-1 scrollbar-none', !borderless && 'border-b border-border', className),
        children: children
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/layout/ModuleTabs.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
const moduleTabClass = (active)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('shrink-0 inline-flex items-center gap-1 text-sm font-medium px-3 py-2 -mb-px border-b-2 transition-colors', 'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm', active ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground');
}),
"[project]/Demo-2/src/lib/estoque-nome.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Demo-2/app/estoque/hooks/useStockSession.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mesclarCatalogoNasSessoes",
    ()=>mesclarCatalogoNasSessoes,
    "useStockSession",
    ()=>useStockSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/estoque-nome.ts [app-ssr] (ecmascript)");
'use client';
;
;
/** Colapsa itens com o mesmo nome na sessão (ex.: triplicados por loja). */ function dedupeItensPorNome(itens) {
    const byNome = new Map();
    for (const item of itens){
        const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(item.nome);
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
    const catalogNomes = new Set(catalogo.flatMap((c)=>c.itens.map((i)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(i.nome))));
    // 2) Remove da contagem o que não está mais no catálogo (delete / desativado)
    result = result.map((cat)=>{
        const itens = cat.itens.filter((i)=>catalogIds.has(i.insumoId) || catalogNomes.has((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(i.nome)));
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
    const presentesNomes = new Set(result.flatMap((c)=>c.itens.map((i)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(i.nome))));
    for (const catCatalogo of catalogo){
        const novos = catCatalogo.itens.filter((i)=>!presentesIds.has(i.insumoId) && !presentesNomes.has((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(i.nome))).map((i)=>({
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
            presentesNomes.add((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizarNomeInsumo"])(i.nome));
        }
        changed = true;
    }
    return {
        sessoes: result,
        changed
    };
}
function useStockSession() {
    const [sessions, setSessions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeSessionId, setActiveSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hydrated, setHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saveStatus, setSaveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    // Fila de salvamento: armazena apenas o estado mais recente por sessão.
    // Descarta estados intermediários — só o último importa.
    const pendingSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    // Conjunto de sessões com loop de drain em execução
    const savingIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    // Timer para resetar o status "salvo" para "idle"
    const savedTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ── Fila sequencial de saves ────────────────────────────────────────────────
    const scheduleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((sessionId, patch)=>{
        // Sobrescreve qualquer estado pendente — apenas o mais recente é enviado
        pendingSave.current.set(sessionId, patch);
        // Se já há um drain em andamento para esta sessão, ele vai pegar o novo estado
        if (savingIds.current.has(sessionId)) return;
        const drain = async ()=>{
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
                        savedTimerRef.current = setTimeout(()=>setSaveStatus('idle'), 2500);
                    }
                } catch  {
                    setSaveStatus('error');
                    // Uma tentativa de retry após 2 segundos
                    await new Promise((r)=>setTimeout(r, 2000));
                    try {
                        await apiPatch(sessionId, next);
                        if (!pendingSave.current.has(sessionId)) {
                            setSaveStatus('saved');
                            savedTimerRef.current = setTimeout(()=>setSaveStatus('idle'), 2500);
                        }
                    } catch (err) {
                        console.error('[Estoque] Falha definitiva ao salvar contagem:', err);
                        setSaveStatus('error');
                    }
                }
            }
            savingIds.current.delete(sessionId);
        };
        drain();
    }, []);
    // Flush keepalive (unload / visibility / unmount) — browser tenta enviar mesmo ao sair
    const flushPendingSaves = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        for (const [id, patch] of pendingSave.current.entries()){
            fetch(`/api/estoque/contagens/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patch),
                keepalive: true
            }).catch(()=>{});
        }
        pendingSave.current.clear();
    }, []);
    // Flush aguardável antes de navegar (Continuar / Salvar e sair / trocar de rota)
    const flushPendingSavesAsync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const entries = Array.from(pendingSave.current.entries());
        pendingSave.current.clear();
        for (const [id, patch] of entries){
            try {
                await apiPatch(id, patch, true);
            } catch (err) {
                console.error('[Estoque] Falha ao flush da fila de salvamento:', err);
            }
        }
    }, []);
    // ── Flush garantido ao sair/minimizar / desmontar ──────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onVisibility = ()=>{
            if (document.visibilityState === 'hidden') flushPendingSaves();
        };
        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('beforeunload', flushPendingSaves);
        return ()=>{
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('beforeunload', flushPendingSaves);
            flushPendingSaves();
            if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        };
    }, [
        flushPendingSaves
    ]);
    // Carrega sessões do banco ao montar (activeSessionId fica a cargo da rota de contagem)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        apiGet().then((data)=>{
            setSessions(data);
        }).catch((err)=>console.error('[Estoque] Falha ao carregar contagens:', err)).finally(()=>setHydrated(true));
    }, []);
    const activeSession = sessions.find((s)=>s.id === activeSessionId) ?? null;
    // ── Criar nova contagem ────────────────────────────────────────────────────
    const iniciarContagem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (sessoesIniciais, gerente = 'Gerente', forceNew = false, lojaNome)=>{
        const existente = sessions.find((s)=>s.status === 'em_andamento' && s.lojaNome === (lojaNome ?? null));
        if (existente && !forceNew) {
            // Contagem em andamento: sincroniza catálogo (adds + deletes) no snapshot
            const { sessoes, changed } = mesclarCatalogoNasSessoes(existente.sessoes, sessoesIniciais ?? []);
            if (changed) {
                const updated = {
                    ...existente,
                    sessoes
                };
                setSessions((prev)=>prev.map((s)=>s.id === existente.id ? updated : s));
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
            setSessions((prev)=>prev.filter((s)=>s.id !== existente.id));
        }
        const nova = await apiPost(sessoesIniciais ?? [], gerente, lojaNome);
        setSessions((prev)=>[
                nova,
                ...prev
            ]);
        setActiveSessionId(nova.id);
        return nova;
    }, [
        sessions,
        scheduleSave
    ]);
    // ── Retomar contagem existente ─────────────────────────────────────────────
    const retomarContagem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((sessionId, catalogo)=>{
        // catalogo definido (mesmo vazio) = sincronizar com a lista atual de produtos
        if (catalogo) {
            setSessions((prev)=>{
                const session = prev.find((s)=>s.id === sessionId);
                if (!session || session.status !== 'em_andamento') return prev;
                const { sessoes, changed } = mesclarCatalogoNasSessoes(session.sessoes, catalogo);
                if (!changed) return prev;
                scheduleSave(sessionId, {
                    sessoes
                });
                return prev.map((s)=>s.id === sessionId ? {
                        ...s,
                        sessoes
                    } : s);
            });
        }
        setActiveSessionId(sessionId);
    }, [
        scheduleSave
    ]);
    // ── Fechar sessão ativa (sem concluir) ────────────────────────────────────
    const fecharContagem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setActiveSessionId(null);
    }, []);
    // ── Mutação + agendamento na fila ─────────────────────────────────────────
    const mutarSessaoAtiva = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((mutate)=>{
        setSessions((prev)=>{
            const session = prev.find((s)=>s.id === activeSessionId);
            if (!session) return prev;
            const updated = mutate(session);
            scheduleSave(updated.id, {
                sessoes: updated.sessoes,
                status: updated.status
            });
            return prev.map((s)=>s.id === activeSessionId ? updated : s);
        });
    }, [
        activeSessionId,
        scheduleSave
    ]);
    // ── Atualizar quantidade de um item ───────────────────────────────────────
    const atualizarQuantidade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((categoriaId, insumoId, quantidade)=>{
        mutarSessaoAtiva((s)=>({
                ...s,
                sessoes: s.sessoes.map((cat)=>cat.id !== categoriaId ? cat : {
                        ...cat,
                        itens: cat.itens.map((item)=>item.insumoId !== insumoId ? item : {
                                ...item,
                                quantidadeContada: quantidade
                            })
                    })
            }));
    }, [
        mutarSessaoAtiva
    ]);
    // ── Atualizar observação de um item ──────────────────────────────────────
    const atualizarObservacao = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((categoriaId, insumoId, observacao)=>{
        mutarSessaoAtiva((s)=>({
                ...s,
                sessoes: s.sessoes.map((cat)=>cat.id !== categoriaId ? cat : {
                        ...cat,
                        itens: cat.itens.map((item)=>item.insumoId !== insumoId ? item : {
                                ...item,
                                observacao
                            })
                    })
            }));
    }, [
        mutarSessaoAtiva
    ]);
    // ── Concluir categoria ────────────────────────────────────────────────────
    const concluirCategoria = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((categoriaId)=>{
        mutarSessaoAtiva((s)=>({
                ...s,
                sessoes: s.sessoes.map((cat)=>cat.id !== categoriaId ? cat : {
                        ...cat,
                        status: 'concluida'
                    })
            }));
    }, [
        mutarSessaoAtiva
    ]);
    // ── Reabrir categoria ─────────────────────────────────────────────────────
    const reabrirCategoria = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((categoriaId)=>{
        mutarSessaoAtiva((s)=>({
                ...s,
                sessoes: s.sessoes.map((cat)=>cat.id !== categoriaId ? cat : {
                        ...cat,
                        status: 'pendente'
                    })
            }));
    }, [
        mutarSessaoAtiva
    ]);
    // ── Finalizar toda a contagem ─────────────────────────────────────────────
    // Inclui sessoes completas no patch para garantir que o estado mais recente
    // seja persistido mesmo que haja saves pendentes na fila
    const finalizarContagem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!activeSessionId) return;
        setSessions((prev)=>{
            const session = prev.find((s)=>s.id === activeSessionId);
            if (!session) return prev;
            const updated = {
                ...session,
                status: 'concluida'
            };
            scheduleSave(updated.id, {
                sessoes: updated.sessoes,
                status: 'concluida'
            });
            return prev.map((s)=>s.id === activeSessionId ? updated : s);
        });
        setActiveSessionId(null);
    }, [
        activeSessionId,
        scheduleSave
    ]);
    // ── Excluir contagem ──────────────────────────────────────────────────────
    const excluirContagem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((sessionId)=>{
        pendingSave.current.delete(sessionId); // cancela save pendente
        setSessions((prev)=>prev.filter((s)=>s.id !== sessionId));
        if (activeSessionId === sessionId) setActiveSessionId(null);
        apiDelete(sessionId).catch(console.error);
    }, [
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
        calcularAlertasReposicao,
        flushPendingSaves,
        flushPendingSavesAsync
    };
}
}),
"[project]/Demo-2/app/estoque/components/AlertBadge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertBadge",
    ()=>AlertBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
'use client';
;
function AlertBadge({ count, className = '' }) {
    if (count === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold bg-red-500 text-white ${className}`,
        children: count > 99 ? '99+' : count
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/estoque/components/AlertBadge.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/Demo-2/app/(app)/estoque/components/EstoqueMobileNav.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EstoqueMobileNav",
    ()=>EstoqueMobileNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/history.js [app-ssr] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/hooks/useStockSession.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$components$2f$AlertBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/components/AlertBadge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const ITEMS = [
    {
        href: '/estoque/historico',
        label: 'Histórico',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"]
    },
    {
        href: '/estoque/produtos',
        label: 'Produtos',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
    },
    {
        href: '/estoque/alertas',
        label: 'Alertas',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"]
    }
];
function EstoqueMobileNav() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { sessions, hydrated, calcularAlertasReposicao } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockSession"])();
    const totalAlertas = hydrated ? sessions.filter((s)=>s.status === 'concluida').flatMap((s)=>calcularAlertasReposicao(s)).length : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex",
        children: ITEMS.map(({ href, label, icon: Icon })=>{
            const active = pathname?.startsWith(href);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors', active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: "w-5 h-5 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/estoque/components/EstoqueMobileNav.tsx",
                                lineNumber: 41,
                                columnNumber: 15
                            }, this),
                            label === 'Alertas' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$components$2f$AlertBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertBadge"], {
                                count: totalAlertas,
                                className: "absolute -top-2 -right-2 scale-75"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/estoque/components/EstoqueMobileNav.tsx",
                                lineNumber: 43,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/estoque/components/EstoqueMobileNav.tsx",
                        lineNumber: 40,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/estoque/components/EstoqueMobileNav.tsx",
                        lineNumber: 49,
                        columnNumber: 13
                    }, this)
                ]
            }, href, true, {
                fileName: "[project]/Demo-2/app/(app)/estoque/components/EstoqueMobileNav.tsx",
                lineNumber: 32,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/(app)/estoque/components/EstoqueMobileNav.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}),
"[project]/Demo-2/app/(app)/estoque/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EstoqueAdminLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$layout$2f$ModuleTabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/components/layout/ModuleTabs.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f28$app$292f$estoque$2f$components$2f$EstoqueMobileNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/(app)/estoque/components/EstoqueMobileNav.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const TABS = [
    {
        href: '/estoque',
        label: 'Visão geral',
        matchExact: true
    },
    {
        href: '/estoque/historico',
        label: 'Histórico'
    },
    {
        href: '/estoque/produtos',
        label: 'Produtos'
    },
    {
        href: '/estoque/alertas',
        label: 'Alertas'
    }
];
function tabActive(pathname, href, matchExact) {
    if (!pathname) return false;
    if (matchExact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
}
function EstoqueAdminLayout({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    // Resultado fica no AppShell mas sem sub-nav (foco na leitura)
    const hideChrome = Boolean(pathname?.startsWith('/estoque/resultado'));
    if (hideChrome) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full",
            children: children
        }, void 0, false, {
            fileName: "[project]/Demo-2/app/(app)/estoque/layout.tsx",
            lineNumber: 32,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full px-6 py-6 md:px-8 space-y-6 pb-24 md:pb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden md:block",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$layout$2f$ModuleTabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ModuleTabs"], {
                    children: TABS.map((t)=>{
                        const active = tabActive(pathname, t.href, 'matchExact' in t ? t.matchExact : false);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: t.href,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$layout$2f$ModuleTabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["moduleTabClass"])(active),
                            children: t.label
                        }, t.href, false, {
                            fileName: "[project]/Demo-2/app/(app)/estoque/layout.tsx",
                            lineNumber: 46,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/estoque/layout.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/estoque/layout.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: children
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/estoque/layout.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f28$app$292f$estoque$2f$components$2f$EstoqueMobileNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EstoqueMobileNav"], {}, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/estoque/layout.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/(app)/estoque/layout.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/history.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>History
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
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
    ],
    [
        "path",
        {
            d: "M12 7v5l4 2",
            key: "1fdv2h"
        }
    ]
];
const History = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("history", __iconNode);
;
 //# sourceMappingURL=history.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/history.js [app-ssr] (ecmascript) <export default as History>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "History",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/history.js [app-ssr] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>TriangleAlert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
            key: "wmoenq"
        }
    ],
    [
        "path",
        {
            d: "M12 9v4",
            key: "juzpu7"
        }
    ],
    [
        "path",
        {
            d: "M12 17h.01",
            key: "p32p05"
        }
    ]
];
const TriangleAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("triangle-alert", __iconNode);
;
 //# sourceMappingURL=triangle-alert.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertTriangle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=Demo-2_5388f599._.js.map