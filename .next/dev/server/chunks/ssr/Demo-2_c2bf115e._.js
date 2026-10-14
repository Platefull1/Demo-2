module.exports = [
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
"[project]/Demo-2/app/estoque/components/ProgressBar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProgressBar",
    ()=>ProgressBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
'use client';
;
function ProgressBar({ concluidas, total }) {
    const pct = total > 0 ? Math.round(concluidas / total * 100) : 0;
    const todas = concluidas === total && total > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 h-2 bg-[#2a2a2e] rounded-full overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `h-full rounded-full transition-all duration-500 ${todas ? 'bg-green-500' : 'bg-amber-500'}`,
                    style: {
                        width: `${pct}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/estoque/components/ProgressBar.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/estoque/components/ProgressBar.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `text-xs font-semibold tabular-nums shrink-0 ${todas ? 'text-green-400' : 'text-amber-400'}`,
                children: [
                    concluidas,
                    "/",
                    total
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/estoque/components/ProgressBar.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/estoque/components/ProgressBar.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/Demo-2/app/estoque/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Demo-2/app/estoque/components/StockItemRow.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StockItemRow",
    ()=>StockItemRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/pencil.js [app-ssr] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/utils.ts [app-ssr] (ecmascript)");
'use client';
;
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
    // ── Todos os hooks no topo ─────────────────────────────────────────────────
    const [showObs, setShowObs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(!!item.observacao);
    const [obsLocal, setObsLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(item.observacao ?? '');
    const [addValue, setAddValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [editMode, setEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contarEmKgLocal, setContarEmKgLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fardoIdx, setFardoIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-2xl transition-colors ${abaixoMinimo ? 'bg-amber-500/8 border border-amber-500/30' : contado ? 'bg-[#1c1c1e] border border-green-500/20' : 'bg-[#141416] border border-[#2a2a2e]'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 px-3 pt-3 pb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `w-2.5 h-2.5 rounded-full shrink-0 ${abaixoMinimo ? 'bg-amber-400' : contado ? 'bg-green-500' : 'bg-[#374151]'}`
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-white leading-tight",
                                children: item.nome
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 mt-0.5 flex-wrap",
                                children: [
                                    hasKgConversion ? // Toggle clicável: alterna entre contar em un ou kg direto (embalagem aberta)
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            setContarEmKgLocal((v)=>!v);
                                            setAddValue('');
                                        },
                                        className: `cursor-pointer inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all active:scale-95 ${contarEmKg ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30'}`,
                                        children: [
                                            contarEmKg ? '⚖ kg' : '# un',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] opacity-60 ml-0.5",
                                                children: "trocar"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                                lineNumber: 167,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, this) : hasFardoToggle ? // Toggle clicável: cicla entre unidade e fardos (bebidas / embalagens)
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            cycleFardo();
                                        },
                                        className: `cursor-pointer inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all active:scale-95 ${contarEmFardo ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30'}`,
                                        children: [
                                            "# ",
                                            fardoLabel,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] opacity-60 ml-0.5",
                                                children: "trocar"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                                lineNumber: 181,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 171,
                                        columnNumber: 15
                                    }, this) : !isItemUnidade && (// Badge estático (sem conversão)
                                    modoUnidade ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/20",
                                        children: "contar em unidade"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 186,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20",
                                        children: "contar em kg"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 190,
                                        columnNumber: 17
                                    }, this)),
                                    modoUnidade && item.kgPorUnidade && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-600",
                                        children: [
                                            "1 un = ",
                                            item.kgPorUnidade,
                                            " kg"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 197,
                                        columnNumber: 15
                                    }, this),
                                    contarEmFardo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-600",
                                        children: [
                                            "1 fardo = ",
                                            fardoSize,
                                            " un"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 203,
                                        columnNumber: 15
                                    }, this),
                                    item.estoqueMinimo !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-600",
                                        children: [
                                            "mín: ",
                                            item.estoqueMinimo,
                                            " ",
                                            unidadeDisplay
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 209,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    abaixoMinimo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        className: "w-4 h-4 text-amber-400 shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 215,
                        columnNumber: 26
                    }, this),
                    contado && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-right shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-baseline gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-xl font-bold ${abaixoMinimo ? 'text-amber-300' : 'text-green-300'}`,
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatQtd"])(item.quantidadeContada)
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-500",
                                        children: unidadeDisplay
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this),
                            modoUnidade && item.kgPorUnidade && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-600 leading-tight",
                                children: [
                                    "≈ ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatQtd"])(item.quantidadeContada / kgPorUn),
                                    " un"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 231,
                                columnNumber: 15
                            }, this),
                            contarEmFardo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-600 leading-tight",
                                children: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatQtd"])(item.quantidadeContada / fardoSize),
                                    " fardo",
                                    item.quantidadeContada / fardoSize !== 1 ? 's' : '',
                                    " de ",
                                    fardoSize
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 236,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 219,
                        columnNumber: 11
                    }, this),
                    contado && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleEditarTotal,
                        title: "Editar valor",
                        className: `w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${editMode ? 'bg-amber-500/20 text-amber-400' : 'bg-[#2a2a2e] text-gray-500 hover:bg-amber-500/10 hover:text-amber-400'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                            className: "w-3.5 h-3.5"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                            lineNumber: 254,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 245,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowObs((v)=>!v),
                        className: `w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${item.observacao ? 'text-amber-400 bg-amber-500/10' : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                            className: "w-3.5 h-3.5"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                            lineNumber: 267,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            editMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pb-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-amber-400 flex items-center gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                            className: "w-3 h-3"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                            lineNumber: 275,
                            columnNumber: 13
                        }, this),
                        "Editando — digite o valor correto e confirme"
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                    lineNumber: 274,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                lineNumber: 273,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 px-3 pb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 281,
                        columnNumber: 9
                    }, this),
                    editMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleCancelarEdicao,
                                className: "w-10 flex items-center justify-center rounded-xl bg-[#2a2a2e] text-gray-400 hover:text-white transition-colors shrink-0",
                                title: "Cancelar edição",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                    lineNumber: 310,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 305,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSalvarEdicao,
                                disabled: addValue === '',
                                className: `flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0 ${addValue !== '' ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black' : 'bg-[#2a2a2e] text-gray-600 cursor-not-allowed'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                        lineNumber: 321,
                                        columnNumber: 15
                                    }, this),
                                    "Salvar"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 312,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleAdicionar,
                        disabled: addValue === '',
                        className: `flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0 ${addValue !== '' ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black' : 'bg-[#2a2a2e] text-gray-600 cursor-not-allowed'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 335,
                                columnNumber: 13
                            }, this),
                            contado ? 'Somar' : 'Add',
                            " ",
                            inputUnidade
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                        lineNumber: 326,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                lineNumber: 280,
                columnNumber: 7
            }, this),
            showObs && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pb-3 pt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: obsLocal,
                            onChange: (e)=>setObsLocal(e.target.value),
                            onBlur: handleObsBlur,
                            placeholder: "Observação…",
                            className: "flex-1 bg-[#2a2a2e] border border-[#374151] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/60"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                            lineNumber: 345,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                handleObsBlur();
                                setShowObs(false);
                            },
                            className: "p-2 text-gray-500 hover:text-white transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                                lineNumber: 357,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                            lineNumber: 353,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                    lineNumber: 344,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                lineNumber: 343,
                columnNumber: 9
            }, this),
            abaixoMinimo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pb-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-amber-400 flex items-center gap-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: "w-3 h-3"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                            lineNumber: 367,
                            columnNumber: 13
                        }, this),
                        "Abaixo do mínimo (",
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatQtd"])(item.estoqueMinimo ?? null),
                        " ",
                        unidadeDisplay,
                        ")"
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                    lineNumber: 366,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
                lineNumber: 365,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/estoque/components/StockItemRow.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
}),
"[project]/Demo-2/app/estoque/components/SessionAccordion.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SessionAccordion",
    ()=>SessionAccordion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle.js [app-ssr] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$components$2f$StockItemRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/components/StockItemRow.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function SessionAccordion({ categoria, isActive, onToggle, onQuantidade, onObservacao, onConcluir, onReabrir, onProxima }) {
    const [showCelebration, setShowCelebration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [itensFaltando, setItensFaltando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            itensFaltando.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-6 max-w-sm w-full shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                className: "w-5 h-5 text-amber-400"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                                lineNumber: 67,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                            lineNumber: 66,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-base font-semibold text-white",
                                                    children: "Itens não preenchidos"
                                                }, void 0, false, {
                                                    fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                                    lineNumber: 70,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-0.5",
                                                    children: "Preencha todos antes de concluir"
                                                }, void 0, false, {
                                                    fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                                    lineNumber: 71,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                            lineNumber: 69,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setItensFaltando([]),
                                    className: "text-gray-600 hover:text-white transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-1.5 max-h-60 overflow-y-auto mb-5",
                            children: itensFaltando.map((nome)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex items-center gap-2 text-sm text-gray-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                            lineNumber: 81,
                                            columnNumber: 17
                                        }, this),
                                        nome
                                    ]
                                }, nome, true, {
                                    fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setItensFaltando([]),
                            className: "w-full py-2.5 rounded-xl bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors",
                            children: "Entendido, vou preencher"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `rounded-2xl border transition-all duration-200 overflow-hidden ${concluida ? 'border-green-500/30 bg-green-500/5' : isActive ? 'border-amber-500/40 bg-[#1c1c1e]' : 'border-[#2a2a2e] bg-[#1c1c1e]'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onToggle,
                        className: "w-full flex items-center gap-3 p-4 text-left",
                        children: [
                            concluida ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                className: "w-5 h-5 text-green-400 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 112,
                                columnNumber: 11
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                                className: `w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'text-gray-600'}`
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xl shrink-0",
                                children: categoria.icone
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 118,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `font-semibold text-sm ${concluida ? 'text-green-400' : 'text-white'}`,
                                        children: categoria.nome
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 122,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-0.5",
                                        children: [
                                            concluida ? `${totalItens} itens contados` : `${contados}/${totalItens} contados`,
                                            alertas > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-2 text-amber-400",
                                                children: [
                                                    "⚠ ",
                                                    alertas,
                                                    " alerta",
                                                    alertas > 1 ? 's' : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                                lineNumber: 130,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 125,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 121,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 shrink-0",
                                children: [
                                    !concluida && contados > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs bg-amber-500/20 text-amber-400 rounded-full px-2 py-0.5 font-medium",
                                        children: [
                                            contados,
                                            "/",
                                            totalItens
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 138,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: `w-4 h-4 text-gray-500 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 142,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 136,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                        lineNumber: 106,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `px-4 pb-4 space-y-2 ${isActive ? '' : 'hidden'}`,
                        children: [
                            showCelebration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-500/15 border border-green-500/30 rounded-xl p-3 text-center animate-pulse",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-green-400 font-semibold text-sm",
                                    children: "✅ Sessão concluída!"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                    lineNumber: 155,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this),
                            categoria.itens.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$components$2f$StockItemRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StockItemRow"], {
                                    item: item,
                                    categoriaId: categoria.id,
                                    onQuantidade: onQuantidade,
                                    onObservacao: onObservacao
                                }, item.insumoId, false, {
                                    fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-2 flex gap-2",
                                children: [
                                    concluida ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onReabrir,
                                        className: "flex-1 py-3 rounded-xl border border-[#374151] text-sm text-gray-400 hover:text-white hover:border-[#4a4a50] transition-colors font-medium",
                                        children: "Reabrir sessão"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 173,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleConcluir,
                                        className: "flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold transition-colors",
                                        children: "✓ Concluir sessão"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, this),
                                    onProxima && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onProxima,
                                        className: "flex items-center gap-2 px-4 py-3 rounded-xl border border-[#374151] text-sm text-gray-400 hover:text-white hover:border-amber-500/50 transition-colors font-medium shrink-0",
                                        children: [
                                            "Próxima",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                                lineNumber: 193,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                        lineNumber: 151,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/estoque/components/SessionAccordion.tsx",
                lineNumber: 96,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/Demo-2/app/estoque/pages/Contagem.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Contagem",
    ()=>Contagem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/wifi-off.js [app-ssr] (ecmascript) <export default as WifiOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$components$2f$ProgressBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/components/ProgressBar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$components$2f$SessionAccordion$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/components/SessionAccordion.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$components$2f$StockItemRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/components/StockItemRow.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function SaveIndicator({ status }) {
    if (status === 'idle') return null;
    if (status === 'saving') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "flex items-center gap-1 text-[11px] text-gray-500",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "w-3 h-3 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                "Salvando…"
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this);
    }
    if (status === 'saved') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "flex items-center gap-1 text-[11px] text-green-500",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                    className: "w-3 h-3"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this),
                "Salvo"
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this);
    }
    // error
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "flex items-center gap-1 text-[11px] text-amber-400",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                className: "w-3 h-3"
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            "Erro ao salvar"
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
function Contagem({ session, saveStatus, onFechar, onQuantidade, onObservacao, onConcluirCategoria, onReabrirCategoria, onFinalizar }) {
    const [activeCatId, setActiveCatId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(session.sessoes.find((s)=>s.status === 'pendente')?.id ?? null);
    const [showRevisao, setShowRevisao] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [itensFaltandoGlobal, setItensFaltandoGlobal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#0a0a0a] flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-4 pt-12 pb-4 flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowRevisao(false),
                            className: "p-2 -ml-2 text-gray-400 hover:text-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-bold text-white",
                                    children: "Revisão"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500",
                                    children: dataFormatada
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 136,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                    lineNumber: 130,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-lg mx-auto w-full",
                    children: [
                        alertas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-amber-400 font-semibold text-sm mb-2 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 144,
                                            columnNumber: 17
                                        }, this),
                                        alertas.length,
                                        " item",
                                        alertas.length !== 1 ? 'ns' : '',
                                        " abaixo do mínimo"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 143,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1",
                                    children: alertas.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-400",
                                            children: [
                                                "• ",
                                                a.nome,
                                                ": ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatQtd"])(a.quantidadeContada),
                                                " ",
                                                a.unidade,
                                                " (mín: ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatQtd"])(a.estoqueMinimo ?? null),
                                                ")"
                                            ]
                                        }, a.insumoId, true, {
                                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 149,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 147,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                            lineNumber: 142,
                            columnNumber: 13
                        }, this),
                        session.sessoes.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: cat.icone
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white text-sm",
                                                children: cat.nome
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                lineNumber: 161,
                                                columnNumber: 17
                                            }, this),
                                            cat.status === 'concluida' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "w-4 h-4 text-green-400 ml-auto"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                lineNumber: 163,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1.5",
                                        children: cat.itens.map((item)=>{
                                            const abaixo = item.quantidadeContada !== null && item.estoqueMinimo !== undefined && item.quantidadeContada < item.estoqueMinimo;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-0.5 text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400",
                                                                children: item.nome
                                                            }, void 0, false, {
                                                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                                lineNumber: 175,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `font-semibold ${item.quantidadeContada === null ? 'text-gray-600' : abaixo ? 'text-amber-400' : 'text-white'}`,
                                                                children: [
                                                                    item.quantidadeContada === null ? '—' : `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatQtd"])(item.quantidadeContada)} ${item.unidade}`,
                                                                    abaixo && ' ⚠'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                                lineNumber: 176,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                        lineNumber: 174,
                                                        columnNumber: 23
                                                    }, this),
                                                    item.observacao && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-amber-400/70 italic pl-1",
                                                        children: [
                                                            "💬 ",
                                                            item.observacao
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, item.insumoId, true, {
                                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                lineNumber: 173,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, cat.id, true, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onFinalizar,
                            className: "w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-base transition-colors",
                            children: "✓ Confirmar e finalizar contagem"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-6"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
            lineNumber: 129,
            columnNumber: 7
        }, this);
    }
    // ── Tela principal de contagem ────────────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] flex flex-col",
        children: [
            itensFaltandoGlobal.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-6 max-w-sm w-full shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                className: "w-5 h-5 text-red-400"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                lineNumber: 223,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 222,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-base font-semibold text-white",
                                                    children: [
                                                        itensFaltandoGlobal.length,
                                                        " ",
                                                        itensFaltandoGlobal.length === 1 ? 'item não preenchido' : 'itens não preenchidos'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                    lineNumber: 226,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-0.5",
                                                    children: "Todos os itens precisam ser preenchidos"
                                                }, void 0, false, {
                                                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 225,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 221,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setItensFaltandoGlobal([]),
                                    className: "text-gray-600 hover:text-white transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 233,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 232,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                            lineNumber: 220,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-1.5 max-h-64 overflow-y-auto mb-5",
                            children: itensFaltandoGlobal.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex items-start gap-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5"
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 239,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-500 text-xs",
                                                    children: [
                                                        item.categoria,
                                                        " · "
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-300",
                                                    children: item.nome
                                                }, void 0, false, {
                                                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                    lineNumber: 242,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 240,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 238,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                            lineNumber: 236,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setItensFaltandoGlobal([]),
                            className: "w-full py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-colors",
                            children: "Voltar e preencher"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                            lineNumber: 247,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                    lineNumber: 219,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                lineNumber: 218,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1c1c1e] border-b border-[#2a2a2e] px-4 pt-12 pb-3 sticky top-0 z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "font-bold text-white text-base",
                                        children: "Contagem de Estoque"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: dataFormatada
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 261,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                lineNumber: 259,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-end gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onFechar,
                                        className: "flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors border border-[#374151] rounded-xl px-3 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                                lineNumber: 268,
                                                columnNumber: 15
                                            }, this),
                                            "Salvar e sair"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 264,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SaveIndicator, {
                                        status: saveStatus
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 271,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                lineNumber: 263,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                        lineNumber: 258,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative mt-2 mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Buscar produto...",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value),
                                className: "w-full bg-[#2a2a2e] text-white text-sm rounded-xl pl-9 pr-9 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this),
                            searchTerm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSearchTerm(''),
                                className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                    lineNumber: 290,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                        lineNumber: 276,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$components$2f$ProgressBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProgressBar"], {
                        concluidas: concluidas,
                        total: total
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-600 mt-1",
                        children: [
                            concluidas,
                            " de ",
                            total,
                            " sessões concluídas",
                            alertas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-2 text-amber-500",
                                children: [
                                    "· ⚠ ",
                                    alertas.length,
                                    " alerta",
                                    alertas.length !== 1 ? 's' : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                lineNumber: 300,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                lineNumber: 257,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-lg mx-auto w-full",
                children: [
                    isSearching ? searchResults.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center py-16 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "w-10 h-10 text-gray-700 mb-3"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                lineNumber: 310,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 text-sm",
                                children: "Nenhum produto encontrado"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                lineNumber: 311,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 text-xs mt-1",
                                children: [
                                    '"',
                                    searchTerm,
                                    '"'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                lineNumber: 312,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                        lineNumber: 309,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: searchResults.map(({ item, categoriaId, categoriaNome, icone })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "px-4 pt-3 pb-1 text-xs text-gray-500 font-medium",
                                        children: [
                                            icone,
                                            " ",
                                            categoriaNome
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 321,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 pb-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$components$2f$StockItemRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StockItemRow"], {
                                            item: item,
                                            categoriaId: categoriaId,
                                            onQuantidade: onQuantidade,
                                            onObservacao: onObservacao
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                            lineNumber: 325,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                        lineNumber: 324,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, `${categoriaId}-${item.insumoId}`, true, {
                                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                                lineNumber: 317,
                                columnNumber: 17
                            }, this))
                    }, void 0, false) : session.sessoes.map((cat, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$components$2f$SessionAccordion$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SessionAccordion"], {
                            categoria: cat,
                            isActive: activeCatId === cat.id,
                            onToggle: ()=>toggleCategoria(cat.id),
                            onQuantidade: onQuantidade,
                            onObservacao: onObservacao,
                            onConcluir: ()=>handleConcluirCategoria(cat.id),
                            onReabrir: ()=>onReabrirCategoria(cat.id),
                            onProxima: idx < session.sessoes.length - 1 ? ()=>handleProxima(cat.id) : undefined
                        }, cat.id, false, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                            lineNumber: 338,
                            columnNumber: 13
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-2 pb-8",
                        children: todasConcluidas ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleAbrirRevisao,
                            className: "w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-base transition-colors",
                            children: "✓ Revisar e finalizar"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                            lineNumber: 359,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            disabled: true,
                            className: "w-full py-4 rounded-2xl bg-[#1c1c1e] border border-[#2a2a2e] text-gray-600 font-medium text-sm cursor-not-allowed",
                            children: "Conclua todas as sessões para finalizar"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                            lineNumber: 366,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                        lineNumber: 357,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
                lineNumber: 306,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/estoque/pages/Contagem.tsx",
        lineNumber: 215,
        columnNumber: 5
    }, this);
}
}),
"[project]/Demo-2/app/estoque/contagem/[id]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EstoqueContagemPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/hooks/useStockSession.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$pages$2f$Contagem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/estoque/pages/Contagem.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function EstoqueContagemPage({ params }) {
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(params);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const activated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [exiting, setExiting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Mantém o último snapshot enquanto flush/navega (finalizar zera activeSessionId)
    const sessionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { sessions, activeSession, hydrated, saveStatus, retomarContagem, fecharContagem, atualizarQuantidade, atualizarObservacao, concluirCategoria, reabrirCategoria, finalizarContagem, flushPendingSavesAsync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$hooks$2f$useStockSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockSession"])();
    if (activeSession?.id === id) {
        sessionRef.current = activeSession;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hydrated || activated.current || exiting) return;
        const session = sessions.find((s)=>s.id === id);
        if (!session) {
            router.replace('/estoque');
            return;
        }
        if (session.status !== 'em_andamento') {
            router.replace(`/estoque/resultado/${id}`);
            return;
        }
        activated.current = true;
        // Refresh / deep-link: reabre a mesma contagem sem re-sincronizar catálogo
        retomarContagem(id);
    }, [
        hydrated,
        sessions,
        id,
        retomarContagem,
        router,
        exiting
    ]);
    const sairParaHome = async ()=>{
        setExiting(true);
        await flushPendingSavesAsync();
        fecharContagem();
        router.push('/estoque');
    };
    const session = activeSession?.id === id ? activeSession : sessionRef.current;
    if (!hydrated || !session || session.id !== id) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/estoque/contagem/[id]/page.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500",
                    children: exiting ? 'Salvando…' : 'Carregando contagem…'
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/estoque/contagem/[id]/page.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/estoque/contagem/[id]/page.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f$estoque$2f$pages$2f$Contagem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Contagem"], {
        session: session,
        saveStatus: saveStatus,
        onFechar: ()=>{
            void sairParaHome();
        },
        onQuantidade: atualizarQuantidade,
        onObservacao: atualizarObservacao,
        onConcluirCategoria: concluirCategoria,
        onReabrirCategoria: reabrirCategoria,
        onFinalizar: ()=>{
            void (async ()=>{
                setExiting(true);
                finalizarContagem();
                await flushPendingSavesAsync();
                router.push(`/estoque/resultado/${id}`);
            })();
        }
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/estoque/contagem/[id]/page.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Demo-2_c2bf115e._.js.map