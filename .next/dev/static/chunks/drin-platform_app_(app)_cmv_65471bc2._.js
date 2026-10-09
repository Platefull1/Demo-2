(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/drin-platform/app/(app)/cmv/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CMV_COLORS",
    ()=>CMV_COLORS,
    "CMV_META",
    ()=>CMV_META,
    "CMV_THRESHOLDS",
    ()=>CMV_THRESHOLDS,
    "STORES",
    ()=>STORES,
    "STORE_COLORS",
    ()=>STORE_COLORS,
    "STORE_IDS",
    ()=>STORE_IDS,
    "getBarColor",
    ()=>getBarColor,
    "getCMVColor",
    ()=>getCMVColor,
    "getCMVStatus",
    ()=>getCMVStatus,
    "getStatusLabel",
    ()=>getStatusLabel,
    "getStorageKey",
    ()=>getStorageKey
]);
const STORES = {
    ahu: 'AHU',
    pilarzinho: 'Pilarzinho',
    portao: 'Portão',
    uberaba: 'Uberaba'
};
const STORE_COLORS = {
    ahu: '#3b82f6',
    pilarzinho: '#8b5cf6',
    portao: '#f97316',
    uberaba: '#22c55e'
};
const STORE_IDS = [
    'ahu',
    'pilarzinho',
    'portao',
    'uberaba'
];
const CMV_META = 33; // meta de CMV em %
const CMV_THRESHOLDS = {
    otimo: 33,
    atencao: 36
};
const CMV_COLORS = {
    otimo: '#16a34a',
    atencao: '#ca8a04',
    critico: '#dc2626'
};
const getCMVStatus = (cmv)=>{
    if (cmv < CMV_THRESHOLDS.otimo) return 'otimo';
    if (cmv < CMV_THRESHOLDS.atencao) return 'atencao';
    return 'critico';
};
const getCMVColor = (cmv)=>{
    const status = getCMVStatus(cmv);
    return CMV_COLORS[status];
};
const getStatusLabel = (status)=>{
    switch(status){
        case 'otimo':
            return 'Ótimo';
        case 'atencao':
            return 'Atenção';
        case 'critico':
            return 'Acima da meta';
    }
};
const getStorageKey = (storeId)=>{
    return `calenzano_cmv_v2_${storeId}`;
};
const getBarColor = (status)=>{
    switch(status){
        case 'otimo':
            return CMV_COLORS.otimo;
        case 'atencao':
            return CMV_COLORS.atencao;
        default:
            return CMV_COLORS.critico;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/(app)/cmv/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TAMANHOS",
    ()=>TAMANHOS,
    "TAMANHOS_PIZZA",
    ()=>TAMANHOS_PIZZA,
    "TAMANHO_LABELS",
    ()=>TAMANHO_LABELS,
    "isCategoriaPrecoPizza",
    ()=>isCategoriaPrecoPizza
]);
const TAMANHOS = [
    'broto',
    'pequena',
    'media',
    'grande',
    'gigante',
    'calzone',
    'bebidas',
    'entradas'
];
const TAMANHOS_PIZZA = [
    'broto',
    'pequena',
    'media',
    'grande',
    'gigante',
    'calzone'
];
const TAMANHO_LABELS = {
    broto: 'Broto',
    pequena: 'Pequena',
    media: 'Média',
    grande: 'Grande',
    gigante: 'Gigante',
    calzone: 'Calzone',
    bebidas: 'Bebidas',
    entradas: 'Entradas'
};
const isCategoriaPrecoPizza = (c)=>(c.tipoPrecificacao ?? 'pizza') === 'pizza';
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/(app)/cmv/utils.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "agruparPorSabor",
    ()=>agruparPorSabor,
    "calcularCMVSabor",
    ()=>calcularCMVSabor,
    "calcularComboCMV",
    ()=>calcularComboCMV,
    "calcularCustoItem",
    ()=>calcularCustoItem,
    "calcularCustoPorKgReceita",
    ()=>calcularCustoPorKgReceita,
    "calcularCustoSabor",
    ()=>calcularCustoSabor,
    "calcularMetricasCombos",
    ()=>calcularMetricasCombos,
    "calcularMetricasLoja",
    ()=>calcularMetricasLoja,
    "calcularTodosCMV",
    ()=>calcularTodosCMV,
    "calcularTodosCombos",
    ()=>calcularTodosCombos,
    "detectarTamanho",
    ()=>detectarTamanho,
    "formatCurrency",
    ()=>formatCurrency,
    "formatPercent",
    ()=>formatPercent,
    "getFlavorGroupName",
    ()=>getFlavorGroupName,
    "getSugestaoPreco",
    ()=>getSugestaoPreco,
    "getSugestoesPreco",
    ()=>getSugestoesPreco,
    "migrarSaborItens",
    ()=>migrarSaborItens,
    "migrarStoreData",
    ()=>migrarStoreData,
    "parseCSVReceitas",
    ()=>parseCSVReceitas,
    "resolverPrecoVendaCategoria",
    ()=>resolverPrecoVendaCategoria
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/(app)/cmv/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/(app)/cmv/constants.ts [app-client] (ecmascript)");
;
;
const migrarSaborItens = (sabor)=>{
    if (sabor.itens && sabor.itens.length > 0) return sabor.itens;
    // Backward compat: ingredientes antigos viram itens do tipo 'ingrediente'
    if (sabor.ingredientes && sabor.ingredientes.length > 0) {
        return sabor.ingredientes.map((ing, idx)=>({
                id: `legacy-${sabor.id}-${idx}`,
                tipo: 'ingrediente',
                referenciaId: ing.ingredienteId,
                quantidade: ing.quantidade
            }));
    }
    return [];
};
/**
 * Migra uma CategoriaPreco do formato antigo (precoVenda único) para o novo (precos por tamanho).
 */ const migrarCategoria = (cat)=>{
    const precos = cat.precos && typeof cat.precos === 'object' ? cat.precos : {};
    return {
        ...cat,
        precos,
        tipoPrecificacao: cat.tipoPrecificacao ?? 'pizza'
    };
};
const migrarStoreData = (data)=>({
        ingredientes: data.ingredientes ?? [],
        receitas: data.receitas ?? [],
        categorias: (data.categorias ?? []).map(migrarCategoria),
        sabores: (data.sabores ?? []).map((s)=>({
                ...s,
                itens: migrarSaborItens(s)
            })),
        combos: data.combos ?? []
    });
const calcularCustoPorKgReceita = (receita, ingredientes)=>{
    if (receita.rendimento <= 0) return 0;
    const custoTotal = receita.itens.reduce((total, item)=>{
        const ing = ingredientes.find((i)=>i.id === item.ingredienteId);
        if (!ing || ing.precoPorKg <= 0) return total;
        const custo = ing.unidade === 'un' ? ing.precoPorKg * item.quantidade : ing.precoPorKg / 1000 * item.quantidade;
        return total + custo;
    }, 0);
    // custoPorKg = custoTotal / (rendimento em kg); para 'un' = custo por unidade
    if (receita.unidade === 'un') {
        return custoTotal / receita.rendimento;
    }
    return custoTotal / (receita.rendimento / 1000);
};
const calcularCustoItem = (item, ingredientes, receitas)=>{
    if (item.tipo === 'ingrediente') {
        const ing = ingredientes.find((i)=>i.id === item.referenciaId);
        if (!ing || ing.precoPorKg <= 0) return 0;
        return ing.unidade === 'un' ? ing.precoPorKg * item.quantidade : ing.precoPorKg / 1000 * item.quantidade;
    } else {
        // receita
        const receita = receitas.find((r)=>r.id === item.referenciaId);
        if (!receita) return 0;
        const custoPorKg = calcularCustoPorKgReceita(receita, ingredientes);
        return receita.unidade === 'un' ? custoPorKg * item.quantidade : custoPorKg / 1000 * item.quantidade;
    }
};
const calcularCustoSabor = (sabor, ingredientes, receitas = [])=>{
    const itens = migrarSaborItens(sabor);
    return itens.reduce((total, item)=>total + calcularCustoItem(item, ingredientes, receitas), 0);
};
// ── Detecção de tamanho a partir do nome do produto ───────────────────────────
/** Mapa de palavras (sem acento, maiúsculas) → Tamanho */ const TAMANHO_MAP = {
    // Nomes completos
    BROTO: 'broto',
    BROTA: 'broto',
    PEQUENA: 'pequena',
    PEQUENO: 'pequena',
    MEDIA: 'media',
    MEDIO: 'media',
    MEDIAS: 'media',
    MEIO: 'media',
    GRANDE: 'grande',
    GIGANTE: 'gigante',
    GG: 'gigante',
    CALZONE: 'calzone',
    // Abreviações comuns
    B: 'broto',
    P: 'pequena',
    M: 'media',
    G: 'grande'
};
const detectarTamanho = (nome)=>{
    const parts = nome.trim().split(/\s+/);
    if (parts.length === 0) return null;
    const lastWord = parts[parts.length - 1].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove acentos
    return TAMANHO_MAP[lastWord] ?? null;
};
const resolverPrecoVendaCategoria = (categoria, nomeProduto)=>{
    const tipo = categoria.tipoPrecificacao ?? 'pizza';
    if (tipo === 'bebidas') {
        if (categoria.precos.bebidas != null) return categoria.precos.bebidas;
        if (categoria.precoVenda) return categoria.precoVenda;
        return 0;
    }
    if (tipo === 'entradas') {
        if (categoria.precos.entradas != null) return categoria.precos.entradas;
        if (categoria.precoVenda) return categoria.precoVenda;
        return 0;
    }
    const tamanho = detectarTamanho(nomeProduto);
    if (tamanho && categoria.precos[tamanho] != null) {
        return categoria.precos[tamanho];
    }
    if (!tamanho && categoria.precos.bebidas != null) {
        return categoria.precos.bebidas;
    }
    if (categoria.precoVenda) return categoria.precoVenda;
    return 0;
};
const calcularCMVSabor = (sabor, ingredientes, receitas = [], categorias = [])=>{
    const custo = calcularCustoSabor(sabor, ingredientes, receitas);
    const tamanhoNome = detectarTamanho(sabor.nome);
    const categoria = categorias.find((c)=>c.id === sabor.categoriaId);
    let precoVenda = 0;
    if (categoria) {
        precoVenda = resolverPrecoVendaCategoria(categoria, sabor.nome);
    } else {
        precoVenda = sabor.precoVenda ?? 0;
    }
    const cmvPercent = precoVenda > 0 ? custo / precoVenda * 100 : 0;
    const margem = 100 - cmvPercent;
    const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCMVStatus"])(cmvPercent);
    const numIngredientes = migrarSaborItens(sabor).length;
    const tamanhoExibir = categoria?.tipoPrecificacao === 'bebidas' || categoria?.tipoPrecificacao === 'entradas' ? undefined : tamanhoNome ?? undefined;
    return {
        id: sabor.id,
        nome: sabor.nome,
        categoria: categoria?.nome || sabor.categoria || 'Sem Categoria',
        categoriaGrupo: categoria?.grupo,
        tipoPrecificacao: categoria?.tipoPrecificacao ?? 'pizza',
        tamanho: tamanhoExibir,
        custo,
        precoVenda,
        cmvPercent,
        margem,
        status,
        numIngredientes,
        fotoUrl: sabor.fotoUrl,
        fotos: sabor.fotos ?? (sabor.fotoUrl ? [
            sabor.fotoUrl
        ] : undefined),
        descricao: sabor.descricao
    };
};
const calcularTodosCMV = (data)=>data.sabores.map((sabor)=>calcularCMVSabor(sabor, data.ingredientes, data.receitas, data.categorias));
const calcularMetricasLoja = (data)=>{
    const products = calcularTodosCMV(data);
    if (products.length === 0) {
        return {
            cmvMedio: 0,
            melhorSabor: {
                nome: '-',
                cmv: 0
            },
            piorSabor: {
                nome: '-',
                cmv: 0
            },
            totalProdutos: 0,
            totalCategorias: 0
        };
    }
    const cmvMedio = products.reduce((sum, p)=>sum + p.cmvPercent, 0) / products.length;
    const grupos = agruparPorSabor(products);
    // Melhor/pior margem só considera grupos que NÃO são de bebidas nem entradas
    const gruposPizza = grupos.filter((g)=>g.produtos.some((p)=>p.tipoPrecificacao !== 'bebidas' && p.tipoPrecificacao !== 'entradas'));
    const gruposParaMelhorPior = gruposPizza.length > 0 ? gruposPizza : grupos;
    const melhorGrupo = gruposParaMelhorPior.reduce((best, g)=>g.cmvMedio < best.cmvMedio ? g : best);
    const piorGrupo = gruposParaMelhorPior.reduce((worst, g)=>g.cmvMedio > worst.cmvMedio ? g : worst);
    const categorias = new Set(data.sabores.map((s)=>s.categoria)).size;
    return {
        cmvMedio,
        melhorSabor: {
            nome: melhorGrupo.nome,
            cmv: melhorGrupo.cmvMedio
        },
        piorSabor: {
            nome: piorGrupo.nome,
            cmv: piorGrupo.cmvMedio
        },
        totalProdutos: products.length,
        totalCategorias: categorias
    };
};
const formatCurrency = (value)=>new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
const formatPercent = (value)=>`${value.toFixed(1)}%`;
// ── Sugestão de preço de venda ─────────────────────────────────────────────────
/**
 * Targets de CMV por tipo de produto:
 * - Pizzas: [28%, 31%]  — dois cenários: meta ideal e meta conservadora
 * - Bebidas / Entradas: [50%]
 */ const CMV_ALVO_TARGETS = {
    pizza: [
        28,
        31
    ],
    bebidas: [
        50
    ],
    entradas: [
        50
    ]
};
const getSugestoesPreco = (product)=>{
    if (product.custo <= 0) return [];
    const tipo = product.tipoPrecificacao ?? 'pizza';
    const targets = CMV_ALVO_TARGETS[tipo] ?? [
        28
    ];
    return targets.filter((targetCMV)=>product.cmvPercent > targetCMV).map((targetCMV)=>({
            precoSugerido: product.custo / (targetCMV / 100),
            targetCMV
        })).filter((s)=>s.precoSugerido > product.precoVenda);
};
const getSugestaoPreco = (product)=>{
    const sugestoes = getSugestoesPreco(product);
    return sugestoes.length > 0 ? sugestoes[0] : null;
};
// ── Agrupamento de produtos por sabor ─────────────────────────────────────────
/**
 * Palavras que indicam tamanho/variação de produto.
 * Se o produto terminar com uma dessas palavras, ela é removida para obter o nome do grupo.
 */ const SIZE_WORDS = new Set([
    'BROTO',
    'BROTA',
    'PEQUENA',
    'PEQUENO',
    'P',
    'MEDIA',
    'MÉDIO',
    'MÉDIA',
    'MEDIO',
    'GRANDE',
    'G',
    'GIGANTE',
    'GG',
    'CALZONE',
    'EXTRA',
    'XL',
    'XXL',
    'FAMILIA',
    'FAMÍLIA',
    'FAM',
    'INDIVIDUAL',
    'IND',
    'KIDS'
]);
const getFlavorGroupName = (productName)=>{
    const parts = productName.trim().split(/\s+/);
    if (parts.length <= 1) return productName;
    const lastWord = parts[parts.length - 1].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove acentos para comparar
    if (SIZE_WORDS.has(lastWord)) {
        return parts.slice(0, -1).join(' ');
    }
    return productName;
};
const agruparPorSabor = (products)=>{
    const map = new Map();
    products.forEach((p)=>{
        const group = getFlavorGroupName(p.nome);
        if (!map.has(group)) map.set(group, []);
        map.get(group).push(p);
    });
    // Ordenação por tamanho padrão
    const SIZE_ORDER = [
        'BROTO',
        'BROTA',
        'PEQUENA',
        'PEQUENO',
        'P',
        'MEDIA',
        'MÉDIO',
        'MÉDIAS',
        'MÉDIO',
        'MEIO',
        'M',
        'GRANDE',
        'G',
        'GIGANTE',
        'GG',
        'CALZONE',
        'EXTRA',
        'XL',
        'XXL',
        'FAMILIA',
        'FAMÍLIA',
        'FAM'
    ];
    const sizeRank = (name)=>{
        const last = name.trim().split(/\s+/).pop()?.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') ?? '';
        const idx = SIZE_ORDER.indexOf(last);
        return idx >= 0 ? idx : 999;
    };
    return Array.from(map.entries()).map(([nome, produtos])=>{
        const sorted = [
            ...produtos
        ].sort((a, b)=>sizeRank(a.nome) - sizeRank(b.nome));
        const cmvValues = sorted.map((p)=>p.cmvPercent);
        const cmvMedio = cmvValues.reduce((s, v)=>s + v, 0) / cmvValues.length;
        const cmvMin = Math.min(...cmvValues);
        const cmvMax = Math.max(...cmvValues);
        const custoMedio = sorted.reduce((s, p)=>s + p.custo, 0) / sorted.length;
        const statusGeral = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCMVStatus"])(cmvMax); // pior caso do grupo
        return {
            nome,
            produtos: sorted,
            cmvMedio,
            cmvMin,
            cmvMax,
            custoMedio,
            statusGeral
        };
    }).sort((a, b)=>a.nome.localeCompare(b.nome, 'pt-BR'));
};
const parseCSVReceitas = (content)=>{
    const lines = content.trim().split('\n');
    const results = [];
    const sep = lines[0]?.includes(';') ? ';' : ',';
    for(let i = 1; i < lines.length; i++){
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(sep).map((c)=>c.trim().replace(/^"|"$/g, ''));
        if (cols.length < 6) continue;
        const unidadeRaw = cols[5].toLowerCase();
        const unidade = unidadeRaw === 'g' ? 'g' : unidadeRaw === 'ml' ? 'ml' : 'un';
        results.push({
            nome: cols[0],
            categoria: cols[1].toLowerCase().includes('especial') ? 'especial' : 'tradicional',
            precoVenda: parseFloat(cols[2].replace(',', '.')) || 0,
            ingrediente: cols[3],
            quantidade: parseFloat(cols[4].replace(',', '.')) || 0,
            unidade
        });
    }
    return results;
};
const calcularComboCMV = (combo, data)=>{
    const todasCategorias = data.categorias ?? [];
    const itens = combo.itens.map((item)=>{
        // Slot de ingrediente (bebida, sobremesa, etc.)
        if (item.tipo === 'ingrediente') {
            const referenciaId = item.produtoId ?? item.ingredienteId;
            const produto = (data.sabores ?? []).find((s)=>s.id === referenciaId);
            // Novo fluxo: busca bebida/outro em produtos (sabores), com custo e venda calculados.
            if (produto) {
                const cmvProduto = calcularCMVSabor(produto, data.ingredientes, data.receitas, data.categorias);
                const resultadoProduto = {
                    id: item.id,
                    tipo: 'ingrediente',
                    ingredienteId: referenciaId,
                    nomeIngrediente: produto.nome,
                    quantidade: item.quantidade,
                    precoUnitario: cmvProduto.precoVenda,
                    custoUnitario: cmvProduto.custo,
                    precoItem: cmvProduto.precoVenda * item.quantidade,
                    custoItem: cmvProduto.custo * item.quantidade
                };
                return resultadoProduto;
            }
            // Fallback legado: item antigo que ainda aponta para ingrediente.
            const ing = (data.ingredientes ?? []).find((i)=>i.id === referenciaId);
            const custoUnitario = ing ? ing.precoPorKg : 0;
            const resultado = {
                id: item.id,
                tipo: 'ingrediente',
                ingredienteId: referenciaId,
                nomeIngrediente: ing?.nome ?? '—',
                quantidade: item.quantidade,
                precoUnitario: item.precoVenda,
                custoUnitario,
                precoItem: item.precoVenda * item.quantidade,
                custoItem: custoUnitario * item.quantidade
            };
            return resultado;
        }
        // Slot de pizza (tipo === 'pizza' ou undefined — compat com dados antigos)
        const pizzaItem = item;
        const categoriasPizza = todasCategorias.filter(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCategoriaPrecoPizza"]);
        // Resolve quais categorias participam deste slot (apenas categorias de pizza)
        const categoriasItem = (pizzaItem.categoriaIds ?? []).length > 0 ? todasCategorias.filter((c)=>(pizzaItem.categoriaIds ?? []).includes(c.id) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCategoriaPrecoPizza"])(c)) : categoriasPizza;
        // Categorias que têm preço definido para este tamanho
        const categoriasComPreco = categoriasItem.filter((c)=>c.precos[pizzaItem.tamanho] != null);
        // Média dos preços de venda entre as categorias elegíveis
        const precoMedioUnitario = categoriasComPreco.length > 0 ? categoriasComPreco.reduce((sum, c)=>sum + (c.precos[pizzaItem.tamanho] ?? 0), 0) / categoriasComPreco.length : 0;
        // Para cada categoria elegível, calcula o custo médio dos produtos naquela categoria+tamanho
        // Depois tira a média entre as categorias
        let somaCustosCategorias = 0;
        let numCategoriasCusto = 0;
        let numProdutosTotal = 0;
        for (const cat of categoriasItem){
            const produtosCat = data.sabores.filter((s)=>s.categoriaId === cat.id && detectarTamanho(s.nome) === pizzaItem.tamanho);
            numProdutosTotal += produtosCat.length;
            if (produtosCat.length > 0) {
                const custoCat = produtosCat.reduce((sum, s)=>sum + calcularCustoSabor(s, data.ingredientes, data.receitas), 0) / produtosCat.length;
                somaCustosCategorias += custoCat;
                numCategoriasCusto++;
            }
        }
        const custoMedioUnitario = numCategoriasCusto > 0 ? somaCustosCategorias / numCategoriasCusto : 0;
        const resultado = {
            id: pizzaItem.id,
            tipo: 'pizza',
            tamanho: pizzaItem.tamanho,
            quantidade: pizzaItem.quantidade,
            categorias: categoriasItem,
            precoMedioUnitario,
            custoMedioUnitario,
            precoItem: precoMedioUnitario * pizzaItem.quantidade,
            custoItem: custoMedioUnitario * pizzaItem.quantidade,
            numProdutos: numProdutosTotal
        };
        return resultado;
    });
    const custoTotal = itens.reduce((sum, i)=>sum + i.custoItem, 0);
    const precoRegular = itens.reduce((sum, i)=>sum + i.precoItem, 0);
    const cmvPercent = combo.precoVenda > 0 ? custoTotal / combo.precoVenda * 100 : 0;
    const margem = 100 - cmvPercent;
    const economia = precoRegular - combo.precoVenda;
    return {
        id: combo.id,
        nome: combo.nome,
        descricao: combo.descricao,
        fotoUrl: combo.fotoUrl,
        fotos: combo.fotos ?? (combo.fotoUrl ? [
            combo.fotoUrl
        ] : undefined),
        custoTotal,
        precoRegular,
        precoVenda: combo.precoVenda,
        economia,
        cmvPercent,
        margem,
        status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCMVStatus"])(cmvPercent),
        itens
    };
};
const calcularTodosCombos = (data)=>(data.combos ?? []).map((combo)=>calcularComboCMV(combo, data));
const calcularMetricasCombos = (data)=>{
    const combos = calcularTodosCombos(data);
    if (combos.length === 0) {
        return {
            cmvMedio: 0,
            melhorSabor: {
                nome: '-',
                cmv: 0
            },
            piorSabor: {
                nome: '-',
                cmv: 0
            },
            totalProdutos: 0,
            totalCategorias: 0
        };
    }
    const cmvMedio = combos.reduce((sum, c)=>sum + c.cmvPercent, 0) / combos.length;
    const melhorCombo = combos.reduce((best, cur)=>cur.cmvPercent < best.cmvPercent ? cur : best);
    const piorCombo = combos.reduce((worst, cur)=>cur.cmvPercent > worst.cmvPercent ? cur : worst);
    return {
        cmvMedio,
        melhorSabor: {
            nome: melhorCombo.nome,
            cmv: melhorCombo.cmvPercent
        },
        piorSabor: {
            nome: piorCombo.nome,
            cmv: piorCombo.cmvPercent
        },
        totalProdutos: combos.length,
        totalCategorias: 0
    };
};
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/drin-platform/app/(app)/cmv/hooks/useStoreData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStoreData",
    ()=>useStoreData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/app/(app)/cmv/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/drin-platform/app/(app)/cmv/utils.ts [app-client] (ecmascript) <locals>");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const INITIAL_DATA = {
    ingredientes: [],
    receitas: [],
    sabores: [],
    categorias: [],
    combos: []
};
const API_BASE = '/api/cmv';
// ─── helpers ──────────────────────────────────────────────────────────────────
function loadFromLocalStorage(storeId) {
    try {
        const raw = localStorage.getItem((0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStorageKey"])(storeId));
        if (!raw) return null;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["migrarStoreData"])(JSON.parse(raw));
    } catch  {
        return null;
    }
}
function saveToLocalStorage(storeId, data) {
    try {
        localStorage.setItem((0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStorageKey"])(storeId), JSON.stringify(data));
    } catch  {
    // quota exceeded — ignora
    }
}
const useStoreData = (storeId)=>{
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(INITIAL_DATA);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saveError, setSaveError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ── Carregamento inicial ───────────────────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useStoreData.useEffect": ()=>{
            let cancelled = false;
            setIsLoading(true);
            setSaveError(null);
            // 1. Exibe cache local instantaneamente
            const cached = loadFromLocalStorage(storeId);
            if (cached) setData(cached);
            // 2. Busca dados autoritativos do banco
            fetch(`${API_BASE}/${storeId}`).then({
                "useStoreData.useEffect": async (res)=>{
                    if (!res.ok) {
                        const err = await res.json().catch({
                            "useStoreData.useEffect": ()=>({})
                        }["useStoreData.useEffect"]);
                        throw new Error(err.error || `HTTP ${res.status}`);
                    }
                    return res.json();
                }
            }["useStoreData.useEffect"]).then({
                "useStoreData.useEffect": (raw)=>{
                    if (cancelled) return;
                    // Migra dados antigos para o novo formato (cascata automática)
                    const serverData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$app$2f28$app$292f$cmv$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["migrarStoreData"])(raw);
                    setData(serverData);
                    saveToLocalStorage(storeId, serverData);
                }
            }["useStoreData.useEffect"]).catch({
                "useStoreData.useEffect": (err)=>{
                    if (cancelled) return;
                    console.warn('[CMV] Não foi possível carregar dados do servidor, usando cache local:', err.message);
                }
            }["useStoreData.useEffect"]).finally({
                "useStoreData.useEffect": ()=>{
                    if (!cancelled) setIsLoading(false);
                }
            }["useStoreData.useEffect"]);
            return ({
                "useStoreData.useEffect": ()=>{
                    cancelled = true;
                }
            })["useStoreData.useEffect"];
        }
    }["useStoreData.useEffect"], [
        storeId
    ]);
    // ── Persistência ──────────────────────────────────────────────────────────
    const persistToServer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStoreData.useCallback[persistToServer]": async (newData)=>{
            try {
                setIsSaving(true);
                setSaveError(null);
                const res = await fetch(`${API_BASE}/${storeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newData)
                });
                if (!res.ok) {
                    const err = await res.json().catch({
                        "useStoreData.useCallback[persistToServer]": ()=>({})
                    }["useStoreData.useCallback[persistToServer]"]);
                    throw new Error(err.error || `HTTP ${res.status}`);
                }
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Erro ao salvar';
                setSaveError(msg);
                console.error('[CMV] Erro ao salvar no banco:', msg);
            } finally{
                setIsSaving(false);
            }
        }
    }["useStoreData.useCallback[persistToServer]"], [
        storeId
    ]);
    // ── updateData: atualiza estado + cache local + banco (debounced) ─────────
    const updateData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStoreData.useCallback[updateData]": (newData)=>{
            setData(newData);
            saveToLocalStorage(storeId, newData);
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout({
                "useStoreData.useCallback[updateData]": ()=>{
                    persistToServer(newData);
                }
            }["useStoreData.useCallback[updateData]"], 400);
        }
    }["useStoreData.useCallback[updateData]"], [
        storeId,
        persistToServer
    ]);
    return {
        data,
        updateData,
        isLoading,
        isSaving,
        saveError
    };
};
_s(useStoreData, "Lkox6Kz4WuTPUBQWApfz7ZNMQkU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=drin-platform_app_%28app%29_cmv_65471bc2._.js.map