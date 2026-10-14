(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Demo-2/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "span";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "badge",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/badge.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/src/lib/ponto-periodo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Período de fechamento de ponto usado pelo RH:
 * do dia 28 do mês anterior até o dia 27 do mês da competência.
 *
 * Ex.: competência outubro/2025 → 28/09/2025 a 27/10/2025
 */ __turbopack_context__.s([
    "formatarDataBR",
    ()=>formatarDataBR,
    "labelPeriodoFechamentoPonto",
    ()=>labelPeriodoFechamentoPonto,
    "periodoFechamentoPonto",
    ()=>periodoFechamentoPonto
]);
function periodoFechamentoPonto(mes, ano) {
    let mesAnterior = mes - 1;
    let anoAnterior = ano;
    if (mesAnterior < 1) {
        mesAnterior = 12;
        anoAnterior = ano - 1;
    }
    const dataInicial = `${anoAnterior}-${String(mesAnterior).padStart(2, '0')}-28`;
    const dataFinal = `${ano}-${String(mes).padStart(2, '0')}-27`;
    return {
        dataInicial,
        dataFinal
    };
}
function formatarDataBR(isoDate) {
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
}
function labelPeriodoFechamentoPonto(mes, ano) {
    const { dataInicial, dataFinal } = periodoFechamentoPonto(mes, ano);
    return `${formatarDataBR(dataInicial)} a ${formatarDataBR(dataFinal)}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/app/(app)/pontos/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PontosPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$contexts$2f$LojaContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/contexts/LojaContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/components/ui/tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ponto$2d$periodo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/ponto-periodo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
'use client';
;
// ─── Hook: arrastar para rolar horizontalmente (sem scrollbar visível) ────────
function useDragScroll() {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dragging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const startX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const startScrollLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const onMouseDown = (e)=>{
        const el = ref.current;
        if (!el) return;
        dragging.current = true;
        startX.current = e.clientX;
        startScrollLeft.current = el.scrollLeft;
        el.style.cursor = 'grabbing';
        el.style.userSelect = 'none';
    };
    const onMouseMove = (e)=>{
        if (!dragging.current || !ref.current) return;
        e.preventDefault();
        const dx = e.clientX - startX.current;
        ref.current.scrollLeft = startScrollLeft.current - dx;
    };
    const stopDrag = ()=>{
        dragging.current = false;
        if (ref.current) {
            ref.current.style.cursor = 'grab';
            ref.current.style.userSelect = '';
        }
    };
    return {
        ref,
        handlers: {
            onMouseDown,
            onMouseMove,
            onMouseUp: stopDrag,
            onMouseLeave: stopDrag
        }
    };
}
_s(useDragScroll, "75LPfzlqgzRW2C/Gv7kQto6tO6s=");
;
;
;
;
;
;
// ─── Helpers ────────────────────────────────────────────────────────────────
const inputCls = 'bg-[#0a0a0a] border border-[#2a2a2e] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors';
const cellCls = 'px-3 py-2.5 text-sm text-gray-200 whitespace-nowrap';
const headCls = 'px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide text-left whitespace-nowrap';
const STALE_SYNC_MS = 60 * 60 * 1000;
const PUNCH_COLUMNS = [
    {
        key: 'entrada1',
        short: 'E1',
        full: 'Entrada 1'
    },
    {
        key: 'saida1',
        short: 'S1',
        full: 'Saída 1'
    },
    {
        key: 'entrada2',
        short: 'E2',
        full: 'Entrada 2'
    },
    {
        key: 'saida2',
        short: 'S2',
        full: 'Saída 2'
    },
    {
        key: 'entrada3',
        short: 'E3',
        full: 'Entrada 3'
    },
    {
        key: 'saida3',
        short: 'S3',
        full: 'Saída 3'
    }
];
function shiftIsoDate(iso, days) {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
    dt.setDate(dt.getDate() + days);
    const yy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
}
function Horario({ value }) {
    if (!value) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-muted-foreground",
        children: "–"
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
        lineNumber: 170,
        columnNumber: 22
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "tabular-nums text-foreground",
        children: value
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
        lineNumber: 171,
        columnNumber: 10
    }, this);
}
_c = Horario;
function PunchHeader({ short, full }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "hidden lg:inline",
                children: full
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "lg:hidden cursor-default",
                            children: short
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                        children: full
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c1 = PunchHeader;
function StatusRegistro({ registro }) {
    const flags = [
        registro.folga ? 'Folga' : null,
        registro.compensado ? 'Compensado' : null,
        registro.neutro ? 'Neutro' : null
    ].filter((label)=>Boolean(label));
    if (flags.length === 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-muted-foreground",
        children: "–"
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
        lineNumber: 195,
        columnNumber: 34
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap gap-1",
        children: flags.map((label)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                variant: "outline",
                className: "font-normal text-muted-foreground",
                children: label
            }, label, false, {
                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                lineNumber: 200,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
        lineNumber: 198,
        columnNumber: 5
    }, this);
}
_c2 = StatusRegistro;
function SyncStatus({ ultimaSincronizacao, dataSelecionada, hoje }) {
    if (!ultimaSincronizacao) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center gap-1.5 text-xs text-warning",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "size-2 shrink-0 rounded-full bg-warning"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 220,
                    columnNumber: 9
                }, this),
                "Nenhuma batida recebida hoje"
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
            lineNumber: 219,
            columnNumber: 7
        }, this);
    }
    const at = new Date(ultimaSincronizacao);
    const hhmm = at.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const stale = dataSelecionada === hoje && Date.now() - at.getTime() > STALE_SYNC_MS;
    if (stale) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                    asChild: true,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1.5 text-xs text-warning cursor-default",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "size-2 shrink-0 rounded-full bg-warning"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 235,
                                columnNumber: 13
                            }, this),
                            "Batidas podem estar atrasadas"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 234,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 233,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                    className: "max-w-xs",
                    children: "O Secullum envia as batidas quando o computador do escritório está ligado."
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 239,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
            lineNumber: 232,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "size-2 shrink-0 rounded-full bg-primary"
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this),
            "Secullum · última batida recebida às ",
            hhmm
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
        lineNumber: 247,
        columnNumber: 5
    }, this);
}
_c3 = SyncStatus;
function groupRegistros(registros) {
    const map = new Map();
    for (const registro of registros){
        const id = registro.funcionario.loja?.id ?? 'sem-loja';
        const nome = registro.funcionario.loja?.nome ?? 'Sem loja';
        const group = map.get(id);
        if (group) group.rows.push(registro);
        else map.set(id, {
            id,
            nome,
            rows: [
                registro
            ]
        });
    }
    return [
        ...map.values()
    ].sort((a, b)=>a.nome.localeCompare(b.nome, 'pt-BR'));
}
function registroColumns(showLoja) {
    const punches = PUNCH_COLUMNS.map((col)=>({
            id: col.key,
            accessorFn: (row)=>row[col.key] ?? '',
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PunchHeader, {
                    short: col.short,
                    full: col.full
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 270,
                    columnNumber: 19
                }, this),
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Horario, {
                    value: row.original[col.key]
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 271,
                    columnNumber: 24
                }, this),
            meta: {
                headerClassName: 'whitespace-nowrap',
                cellClassName: 'whitespace-nowrap'
            }
        }));
    return [
        {
            id: 'funcionario',
            accessorFn: (row)=>row.funcionario.nome,
            header: 'Funcionário',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-medium text-foreground",
                    children: row.original.funcionario.nome
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 281,
                    columnNumber: 9
                }, this)
        },
        ...showLoja ? [
            {
                id: 'loja',
                accessorFn: (row)=>row.funcionario.loja?.nome ?? '',
                header: 'Loja',
                cell: ({ row })=>row.original.funcionario.loja?.nome ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-foreground",
                        children: row.original.funcionario.loja.nome
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 292,
                        columnNumber: 17
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground",
                        children: "–"
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 294,
                        columnNumber: 17
                    }, this)
            }
        ] : [],
        ...punches,
        {
            id: 'status',
            header: 'Status',
            enableSorting: false,
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusRegistro, {
                    registro: row.original
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 304,
                    columnNumber: 26
                }, this)
        }
    ];
}
function mesLabel(mes, ano) {
    return new Date(ano, mes - 1, 1).toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric'
    });
}
// ─── Tabela de Registros (Fase 6) ───────────────────────────────────────────
function TabelaRegistros({ registros }) {
    _s1();
    const drag = useDragScroll();
    if (registros.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center py-16 text-center px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Clock, {
                    className: "w-10 h-10 text-gray-700 mb-3"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 321,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-400 font-medium",
                    children: "Nenhum registro de ponto"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 322,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-600 mt-1",
                    children: "Nenhum dado recebido do Secullum para esta seleção."
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 323,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
            lineNumber: 320,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: drag.ref,
        ...drag.handlers,
        className: "overflow-x-auto [&::-webkit-scrollbar]:hidden",
        style: {
            scrollbarWidth: 'none',
            cursor: 'grab'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            className: "w-full text-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                    className: "border-b border-[#2a2a2e] bg-[#111113]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Funcionário"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 340,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Loja"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 341,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "E1"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 342,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "S1"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 343,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "E2"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 344,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "S2"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 345,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "E3"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 346,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "S3"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 347,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Status"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 348,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 339,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 338,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                    children: registros.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            className: `border-b border-[#2a2a2e] last:border-0 ${i % 2 === 0 ? '' : 'bg-[#111113]/60'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: `${cellCls} font-medium text-white`,
                                    children: r.funcionario.nome
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 359,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: `${cellCls} text-gray-400`,
                                    children: r.funcionario.loja?.nome ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-600 text-xs",
                                        children: "—"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 361,
                                        columnNumber: 46
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 360,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: cellCls,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Horario, {
                                        value: r.entrada1
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 363,
                                        columnNumber: 39
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 363,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: cellCls,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Horario, {
                                        value: r.saida1
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 364,
                                        columnNumber: 39
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 364,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: cellCls,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Horario, {
                                        value: r.entrada2
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 365,
                                        columnNumber: 39
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 365,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: cellCls,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Horario, {
                                        value: r.saida2
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 366,
                                        columnNumber: 39
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 366,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: cellCls,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Horario, {
                                        value: r.entrada3
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 367,
                                        columnNumber: 39
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 367,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: cellCls,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Horario, {
                                        value: r.saida3
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 368,
                                        columnNumber: 39
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 368,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: `${cellCls}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-1",
                                        children: [
                                            r.folga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                label: "Folga",
                                                color: "green"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                lineNumber: 371,
                                                columnNumber: 31
                                            }, this),
                                            r.compensado && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                label: "Compensado",
                                                color: "blue"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                lineNumber: 372,
                                                columnNumber: 36
                                            }, this),
                                            r.neutro && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                label: "Neutro",
                                                color: "amber"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                lineNumber: 373,
                                                columnNumber: 32
                                            }, this),
                                            !r.folga && !r.compensado && !r.neutro && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-600 text-xs",
                                                children: "—"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                lineNumber: 375,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 370,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 369,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, r.id, true, {
                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                            lineNumber: 353,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 351,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
            lineNumber: 337,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
        lineNumber: 331,
        columnNumber: 5
    }, this);
}
_s1(TabelaRegistros, "RQtXEwc8E0SKPOzEbnGj+4ZDJS8=", false, function() {
    return [
        useDragScroll
    ];
});
_c4 = TabelaRegistros;
function initEdits(linha) {
    return {
        ex60: linha.ex60 ?? '',
        ex100: linha.ex100 ?? '',
        en60: linha.en60 ?? '',
        en100: linha.en100 ?? '',
        atraso: linha.atraso ?? '',
        faltas: linha.faltas ?? '',
        faltaDsr: linha.faltaDsr ?? '',
        valeTransporte: linha.valeTransporte ?? '',
        descDiversos: linha.descDiversos ?? '',
        descRefeicao: linha.descRefeicao ?? '',
        descCompras: linha.descCompras ?? ''
    };
}
function FechamentoLinhaRow({ linha, fechamentoId, onUpdated }) {
    _s2();
    const [edits, setEdits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FechamentoLinhaRow.useState": ()=>initEdits(linha)
    }["FechamentoLinhaRow.useState"]);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rejeitandoObs, setRejeitandoObs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [obsText, setObsText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const debounceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const setField = (field, value)=>{
        const next = {
            ...edits,
            [field]: value
        };
        setEdits(next);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(()=>patchLinha(next, undefined), 800);
    };
    const patchLinha = async (data, statusOverride, obs)=>{
        setSaving(true);
        try {
            const res = await fetch(`/api/pontos/fechamento/${fechamentoId}/linhas/${linha.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    ...statusOverride !== undefined ? {
                        status: statusOverride
                    } : {},
                    ...obs !== undefined ? {
                        observacao: obs
                    } : {}
                })
            });
            if (res.ok) {
                const updated = await res.json();
                onUpdated(updated);
            }
        } finally{
            setSaving(false);
        }
    };
    const handleAprovar = ()=>patchLinha(edits, 'aprovado');
    const handleRejeitar = ()=>{
        if (!obsText.trim()) return;
        patchLinha(edits, 'rejeitado', obsText.trim());
        setRejeitandoObs(false);
        setObsText('');
    };
    const fieldInput = (field, placeholder = '')=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            className: "w-[72px] bg-[#0a0a0a] border border-[#2a2a2e] rounded-lg px-2 py-1 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/50",
            value: edits[field],
            placeholder: placeholder,
            onChange: (e)=>setField(field, e.target.value)
        }, void 0, false, {
            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
            lineNumber: 471,
            columnNumber: 5
        }, this);
    const statusIcon = ()=>{
        if (linha.status === 'aprovado') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
            className: "w-4 h-4 text-green-400"
        }, void 0, false, {
            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
            lineNumber: 480,
            columnNumber: 45
        }, this);
        if (linha.status === 'rejeitado') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
            className: "w-4 h-4 text-red-400"
        }, void 0, false, {
            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
            lineNumber: 481,
            columnNumber: 46
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
            className: "w-4 h-4 text-amber-400"
        }, void 0, false, {
            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
            lineNumber: 482,
            columnNumber: 12
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: `border-b border-[#2a2a2e] last:border-0 ${linha.origemErro ? 'bg-red-500/5' : ''}`,
                title: linha.origemErro ?? undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: `${cellCls} font-medium text-white sticky left-0 bg-[#111113]`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: linha.funcionario.nome
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 495,
                                    columnNumber: 13
                                }, this),
                                linha.funcionario.loja && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] text-gray-500",
                                    children: linha.funcionario.loja.nome
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 497,
                                    columnNumber: 15
                                }, this),
                                linha.origemErro && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] text-red-400 mt-0.5 truncate max-w-[140px]",
                                    title: linha.origemErro,
                                    children: [
                                        "⚠ ",
                                        linha.origemErro
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 500,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                            lineNumber: 494,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 493,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: fieldInput('ex60', '00:00')
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 506,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: fieldInput('ex100', '00:00')
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 507,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: fieldInput('en60', '00:00')
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 508,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: fieldInput('en100', '00:00')
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 509,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: fieldInput('atraso', '00:00')
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 510,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: fieldInput('faltas', '00:00')
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 511,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: fieldInput('faltaDsr', '00:00')
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 512,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: fieldInput('valeTransporte', '0,00')
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 513,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: fieldInput('descDiversos', '0,00')
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 514,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: fieldInput('descRefeicao', '0,00')
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 515,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: fieldInput('descCompras', '0,00')
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 516,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1",
                                children: [
                                    statusIcon(),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs capitalize text-gray-400",
                                        children: linha.status
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 520,
                                        columnNumber: 13
                                    }, this),
                                    saving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-3 h-3 text-gray-600 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 521,
                                        columnNumber: 24
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 518,
                                columnNumber: 11
                            }, this),
                            linha.observacao && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-gray-500 mt-0.5 max-w-[120px] truncate",
                                title: linha.observacao,
                                children: linha.observacao
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 524,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 517,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: cellCls,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleAprovar,
                                    disabled: linha.status === 'aprovado' || saving,
                                    className: "px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium hover:bg-green-500/20 disabled:opacity-40 disabled:cursor-not-allowed",
                                    children: "Aprovar"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 531,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setRejeitandoObs(true),
                                    disabled: linha.status === 'rejeitado' || saving,
                                    className: "px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed",
                                    children: "Rejeitar"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 539,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                            lineNumber: 530,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 529,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                lineNumber: 487,
                columnNumber: 7
            }, this),
            rejeitandoObs && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: "bg-[#1a1a1e]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                    colSpan: 14,
                    className: "px-4 py-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-400",
                                children: "Motivo da rejeição (obrigatório):"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 554,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "flex-1 bg-[#0a0a0a] border border-red-500/40 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-red-500",
                                placeholder: "Ex.: PIS inválido, erro no cálculo...",
                                value: obsText,
                                onChange: (e)=>setObsText(e.target.value),
                                autoFocus: true
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 555,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleRejeitar,
                                disabled: !obsText.trim(),
                                className: "px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold disabled:opacity-40",
                                children: "Confirmar"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 562,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setRejeitandoObs(false),
                                className: "p-1.5 rounded-lg text-gray-500 hover:text-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 575,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 570,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 553,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 552,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                lineNumber: 551,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s2(FechamentoLinhaRow, "lVpw1m/8d9h2M2w5ZOe68kyg+yk=");
_c5 = FechamentoLinhaRow;
// ─── Tabela do Relatório com drag-to-scroll horizontal ───────────────────────
function TabelaRelatorioScroll({ linhas, fechamentoId, onLinhaUpdated }) {
    _s3();
    const drag = useDragScroll();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: drag.ref,
        ...drag.handlers,
        className: "overflow-x-auto [&::-webkit-scrollbar]:hidden",
        style: {
            scrollbarWidth: 'none',
            cursor: 'grab'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            className: "w-full text-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                    className: "border-b border-[#2a2a2e] bg-[#111113]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: `${headCls} sticky left-0 bg-[#111113]`,
                                children: "Funcionário"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 608,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Ex 60%"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 609,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Ex 100%"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 610,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "EN 60%"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 611,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "EN 100%"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 612,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Atraso"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 613,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Faltas"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 614,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Falta DSR"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 615,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "VT (R$)"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 616,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Desc. Div."
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 617,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Desc. Ref."
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 618,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Desc. Comp."
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 619,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Status"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 620,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: headCls,
                                children: "Ações"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 621,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 607,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 606,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                    children: linhas.map((linha)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FechamentoLinhaRow, {
                            linha: linha,
                            fechamentoId: fechamentoId,
                            onUpdated: onLinhaUpdated
                        }, linha.id, false, {
                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                            lineNumber: 626,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 624,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
            lineNumber: 605,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
        lineNumber: 599,
        columnNumber: 5
    }, this);
}
_s3(TabelaRelatorioScroll, "RQtXEwc8E0SKPOzEbnGj+4ZDJS8=", false, function() {
    return [
        useDragScroll
    ];
});
_c6 = TabelaRelatorioScroll;
// ─── Aba Relatório (Fase 9) ──────────────────────────────────────────────────
function AbaRelatorio() {
    _s4();
    const anoAtual = new Date().getFullYear();
    const mesAtual = new Date().getMonth() + 1;
    const [mes, setMes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(mesAtual);
    const [ano, setAno] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(anoAtual);
    const [gerando, setGerando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [exportando, setExportando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fechamento, setFechamento] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loadingFechamento, setLoadingFechamento] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [erroGerar, setErroGerar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchFechamento = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AbaRelatorio.useCallback[fetchFechamento]": async (m, a)=>{
            setLoadingFechamento(true);
            setErroGerar(null);
            try {
                const res = await fetch(`/api/pontos/fechamento?mes=${m}&ano=${a}`);
                if (res.ok) {
                    const data = await res.json();
                    setFechamento(data.fechamento ?? null);
                } else {
                    setFechamento(null);
                }
            } finally{
                setLoadingFechamento(false);
            }
        }
    }["AbaRelatorio.useCallback[fetchFechamento]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AbaRelatorio.useEffect": ()=>{
            fetchFechamento(mes, ano);
        }
    }["AbaRelatorio.useEffect"], [
        mes,
        ano,
        fetchFechamento
    ]);
    const handleGerar = async ()=>{
        setGerando(true);
        setErroGerar(null);
        try {
            const res = await fetch('/api/pontos/fechamento/gerar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mes,
                    ano
                })
            });
            const data = await res.json().catch(()=>({}));
            if (!res.ok) {
                setErroGerar(data.error ?? 'Erro ao gerar fechamento.');
                return;
            }
            await fetchFechamento(mes, ano);
        } finally{
            setGerando(false);
        }
    };
    const handleExportar = async ()=>{
        if (!fechamento) return;
        const pendentes = fechamento.linhas.filter((l)=>l.status === 'pendente').length;
        if (pendentes > 0) {
            const ok = window.confirm(`${pendentes} de ${fechamento.linhas.length} funcionário(s) ainda não foram revisados.\nDeseja continuar e gerar a planilha mesmo assim?`);
            if (!ok) return;
        }
        setExportando(true);
        try {
            const res = await fetch(`/api/pontos/fechamento/${fechamento.id}/exportar`, {
                method: 'POST'
            });
            if (!res.ok) {
                const err = await res.json().catch(()=>({}));
                alert(err.error ?? 'Erro ao exportar planilha.');
                return;
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fechamento-${String(mes).padStart(2, '0')}-${ano}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            // Recarrega para atualizar status concluido
            await fetchFechamento(mes, ano);
        } finally{
            setExportando(false);
        }
    };
    const onLinhaUpdated = (updated)=>{
        setFechamento((prev)=>prev ? {
                ...prev,
                linhas: prev.linhas.map((l)=>l.id === updated.id ? updated : l)
            } : prev);
    };
    const semPis = fechamento ? fechamento.funcionariosSemPis ?? [] : [];
    const meses = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ];
    const anos = Array.from({
        length: 4
    }, (_, i)=>anoAtual - 1 + i);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-4 flex flex-wrap items-end gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs font-medium text-gray-400 mb-1.5",
                                children: "Mês"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 749,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: mes,
                                onChange: (e)=>setMes(Number(e.target.value)),
                                className: inputCls,
                                children: meses.map((m, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: i + 1,
                                        children: m
                                    }, i + 1, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 756,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 750,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 748,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs font-medium text-gray-400 mb-1.5",
                                children: "Ano"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 761,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: ano,
                                onChange: (e)=>setAno(Number(e.target.value)),
                                className: inputCls,
                                children: anos.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: a,
                                        children: a
                                    }, a, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 768,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 762,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 760,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleGerar,
                        disabled: gerando || loadingFechamento,
                        className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors",
                        children: [
                            gerando ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "w-4 h-4 animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 778,
                                columnNumber: 22
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 778,
                                columnNumber: 69
                            }, this),
                            fechamento ? 'Regerar Fechamento' : 'Gerar Fechamento'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 772,
                        columnNumber: 9
                    }, this),
                    fechamento && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleExportar,
                        disabled: exportando,
                        className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold hover:bg-green-500/30 disabled:opacity-50 transition-colors",
                        children: [
                            exportando ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "w-4 h-4 animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 788,
                                columnNumber: 27
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 788,
                                columnNumber: 74
                            }, this),
                            "Gerar Planilha (.xlsx)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 782,
                        columnNumber: 11
                    }, this),
                    fechamento && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `text-xs px-2 py-1 rounded-lg border font-medium ${fechamento.status === 'concluido' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`,
                            children: fechamento.status
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                            lineNumber: 794,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 793,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "w-full text-xs text-gray-500",
                        children: [
                            "Período do ponto: ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ponto$2d$periodo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["labelPeriodoFechamentoPonto"])(mes, ano)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 805,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                lineNumber: 747,
                columnNumber: 7
            }, this),
            erroGerar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400",
                children: erroGerar
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                lineNumber: 811,
                columnNumber: 9
            }, this),
            semPis.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        className: "w-4 h-4 text-amber-500 mt-0.5 shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 819,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-amber-400 font-medium",
                                children: [
                                    semPis.length,
                                    " funcionário(s) sem PIS do Secullum — não aparecem neste fechamento:"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 821,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500 mt-1",
                                children: semPis.map((f)=>f.nome).join(', ')
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 824,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-600 mt-1",
                                children: "Eles aparecerão automaticamente após registrarem o primeiro ponto."
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 827,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 820,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                lineNumber: 818,
                columnNumber: 9
            }, this),
            loadingFechamento && !fechamento && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "w-6 h-6 text-amber-500 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 836,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                lineNumber: 835,
                columnNumber: 9
            }, this),
            !loadingFechamento && !fechamento && !gerando && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl flex flex-col items-center justify-center py-16 text-center px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                        className: "w-10 h-10 text-gray-700 mb-3"
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 842,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 font-medium",
                        children: [
                            "Nenhum fechamento para ",
                            mesLabel(mes, ano)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 843,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 mt-1",
                        children: [
                            "Período: ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ponto$2d$periodo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["labelPeriodoFechamentoPonto"])(mes, ano),
                            '. Clique em "Gerar Fechamento" para consultar o Secullum.'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 844,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                lineNumber: 841,
                columnNumber: 9
            }, this),
            fechamento && fechamento.linhas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-3 border-b border-[#2a2a2e] flex flex-wrap items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-semibold text-white",
                                children: mesLabel(mes, ano)
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 854,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ponto$2d$periodo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["labelPeriodoFechamentoPonto"])(mes, ano)
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 855,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500",
                                children: [
                                    fechamento.linhas.length,
                                    " funcionário(s)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 858,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-green-400",
                                children: [
                                    fechamento.linhas.filter((l)=>l.status === 'aprovado').length,
                                    " aprovados"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 861,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-amber-400",
                                children: [
                                    fechamento.linhas.filter((l)=>l.status === 'pendente').length,
                                    " pendentes"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 864,
                                columnNumber: 13
                            }, this),
                            fechamento.linhas.filter((l)=>l.status === 'rejeitado').length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-red-400",
                                children: [
                                    fechamento.linhas.filter((l)=>l.status === 'rejeitado').length,
                                    " rejeitados"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 868,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 853,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabelaRelatorioScroll, {
                        linhas: fechamento.linhas,
                        fechamentoId: fechamento.id,
                        onLinhaUpdated: onLinhaUpdated
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 875,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                lineNumber: 851,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
        lineNumber: 745,
        columnNumber: 5
    }, this);
}
_s4(AbaRelatorio, "4K5UEEHJZ3zqnI9OeFhVMS6C85o=");
_c7 = AbaRelatorio;
function PontosPage() {
    _s5();
    const { lojas, lojaSelecionada } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$contexts$2f$LojaContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLoja"])();
    const [aba, setAba] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('registros');
    const [lojaId, setLojaId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "PontosPage.useState": ()=>new Date().toISOString().split('T')[0]
    }["PontosPage.useState"]);
    const [registros, setRegistros] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pendencias, setPendencias] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchPontos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PontosPage.useCallback[fetchPontos]": async (silent = false)=>{
            if (!silent) setLoading(true);
            try {
                const params = new URLSearchParams({
                    data
                });
                if (lojaId) params.set('loja', lojaId);
                const res = await fetch(`/api/pontos?${params}`);
                if (res.ok) {
                    const d = await res.json();
                    setRegistros(d.registros ?? []);
                    setPendencias(d.pendencias ?? []);
                    setLastUpdated(new Date());
                }
            } catch  {
            /* silently fail */ } finally{
                if (!silent) setLoading(false);
            }
        }
    }["PontosPage.useCallback[fetchPontos]"], [
        data,
        lojaId
    ]);
    // Carga inicial
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PontosPage.useEffect": ()=>{
            fetchPontos();
        }
    }["PontosPage.useEffect"], [
        fetchPontos
    ]);
    // Poll a cada 60 segundos (aba registros ou pendências)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PontosPage.useEffect": ()=>{
            if (aba === 'relatorio') return;
            const id = setInterval({
                "PontosPage.useEffect.id": ()=>fetchPontos(true)
            }["PontosPage.useEffect.id"], 60_000);
            return ({
                "PontosPage.useEffect": ()=>clearInterval(id)
            })["PontosPage.useEffect"];
        }
    }["PontosPage.useEffect"], [
        aba,
        fetchPontos
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PontosPage.useEffect": ()=>{
            if (lojaSelecionada && !lojaId) setLojaId(lojaSelecionada.id);
        }
    }["PontosPage.useEffect"], [
        lojaSelecionada,
        lojaId
    ]);
    const hoje = new Date().toISOString().split('T')[0];
    const dataFormatada = new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] text-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 py-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-6 flex-wrap gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold text-white flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Clock, {
                                            className: "w-6 h-6 text-amber-500"
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                            lineNumber: 948,
                                            columnNumber: 15
                                        }, this),
                                        "Pontos"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 947,
                                    columnNumber: 13
                                }, this),
                                aba !== 'relatorio' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-400 capitalize mt-0.5",
                                    children: dataFormatada
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 952,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                            lineNumber: 946,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                lastUpdated && aba !== 'relatorio' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-gray-600",
                                    children: [
                                        "Atualizado ",
                                        lastUpdated.toLocaleTimeString('pt-BR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 957,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>fetchPontos(),
                                    disabled: loading || aba === 'relatorio',
                                    className: "flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#2a2a2e] text-sm text-gray-300 hover:bg-[#2a2a2e] disabled:opacity-50 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                            className: `w-4 h-4 ${loading ? 'animate-spin' : ''}`
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                            lineNumber: 966,
                                            columnNumber: 15
                                        }, this),
                                        "Atualizar"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 961,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                            lineNumber: 955,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 945,
                    columnNumber: 9
                }, this),
                aba !== 'relatorio' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-4 mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-[160px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-medium text-gray-400 mb-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapPin, {
                                                className: "w-3 h-3 inline mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                lineNumber: 978,
                                                columnNumber: 19
                                            }, this),
                                            "Loja"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 977,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: lojaId,
                                        onChange: (e)=>setLojaId(e.target.value),
                                        className: inputCls,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Todas as lojas"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                lineNumber: 986,
                                                columnNumber: 19
                                            }, this),
                                            lojas.map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: l.id,
                                                    children: l.nome
                                                }, l.id, false, {
                                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                    lineNumber: 988,
                                                    columnNumber: 21
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 981,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 976,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-[160px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-medium text-gray-400 mb-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Calendar, {
                                                className: "w-3 h-3 inline mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                lineNumber: 994,
                                                columnNumber: 19
                                            }, this),
                                            "Data"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 993,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: data,
                                                onChange: (e)=>setData(e.target.value),
                                                className: `${inputCls} flex-1`
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                lineNumber: 998,
                                                columnNumber: 19
                                            }, this),
                                            data !== hoje && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setData(hoje),
                                                className: "px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors whitespace-nowrap",
                                                children: "Hoje"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                lineNumber: 1005,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 997,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 992,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 975,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 974,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-1 mb-4 bg-[#1c1c1e] border border-[#2a2a2e] rounded-xl p-1",
                    children: [
                        'registros',
                        'pendencias',
                        'relatorio'
                    ].map((a)=>{
                        const active = aba === a;
                        const label = a === 'registros' ? 'Registros' : a === 'pendencias' ? 'Pendências' : 'Relatório';
                        const Icon = a === 'registros' ? Clock : a === 'pendencias' ? __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"] : __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"];
                        const count = a === 'registros' ? registros.length : a === 'pendencias' ? pendencias.length : null;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setAba(a),
                            className: `flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: "w-4 h-4 inline mr-1.5"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 1033,
                                    columnNumber: 17
                                }, this),
                                label,
                                count !== null && count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold ${active ? 'bg-black/20 text-black' : a === 'pendencias' ? 'bg-red-500/20 text-red-400' : 'bg-[#2a2a2e] text-gray-400'}`,
                                    children: count
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 1036,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, a, true, {
                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                            lineNumber: 1026,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 1019,
                    columnNumber: 9
                }, this),
                aba === 'relatorio' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AbaRelatorio, {}, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 1055,
                    columnNumber: 11
                }, this) : loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center py-20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 1058,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 1057,
                    columnNumber: 11
                }, this) : aba === 'registros' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl overflow-hidden",
                    children: [
                        registros.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-3 border-b border-[#2a2a2e]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500",
                                children: [
                                    registros.length,
                                    " funcionário",
                                    registros.length !== 1 ? 's' : '',
                                    ' · ',
                                    "poll automático a cada 60s"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 1064,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                            lineNumber: 1063,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabelaRegistros, {
                            registros: registros
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                            lineNumber: 1070,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 1061,
                    columnNumber: 11
                }, this) : /* Aba Pendências */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: pendencias.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl flex flex-col items-center justify-center py-16 text-center px-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                className: "w-10 h-10 text-gray-700 mb-3"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 1077,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 font-medium",
                                children: "Sem pendências"
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 1078,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600 mt-1",
                                children: "Todas as matrículas recebidas estão vinculadas a funcionários."
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 1079,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                        lineNumber: 1076,
                        columnNumber: 15
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        className: "w-4 h-4 text-amber-500 mt-0.5 shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 1086,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-amber-400",
                                        children: "As matrículas abaixo foram recebidas do Secullum mas não correspondem a nenhum funcionário cadastrado. Acesse o mapeamento para vinculá-las."
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                        lineNumber: 1087,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                lineNumber: 1085,
                                columnNumber: 17
                            }, this),
                            pendencias.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-4 flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                                            className: "w-4 h-4 text-amber-500 shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                            lineNumber: 1099,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-semibold text-white",
                                                            children: [
                                                                "Folha #",
                                                                p.numeroFolhaOrigem
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                            lineNumber: 1100,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-500 bg-[#2a2a2e] px-2 py-0.5 rounded-full",
                                                            children: [
                                                                p.count,
                                                                " registro",
                                                                p.count !== 1 ? 's' : ''
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                            lineNumber: 1103,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                    lineNumber: 1098,
                                                    columnNumber: 23
                                                }, this),
                                                p.nomeSugerido && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-400 mt-1 ml-6",
                                                    children: [
                                                        "Nome: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-amber-400",
                                                            children: p.nomeSugerido
                                                        }, void 0, false, {
                                                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                            lineNumber: 1109,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                                    lineNumber: 1108,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                            lineNumber: 1097,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/rh/mapeamento-ponto",
                                            className: "px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors whitespace-nowrap",
                                            children: "Mapear →"
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                            lineNumber: 1113,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, p.numeroFolhaOrigem, true, {
                                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                                    lineNumber: 1093,
                                    columnNumber: 19
                                }, this))
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
                    lineNumber: 1074,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
            lineNumber: 943,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/(app)/pontos/page.tsx",
        lineNumber: 942,
        columnNumber: 5
    }, this);
}
_s5(PontosPage, "HqmUp35btFI0LIYsqOVop4Hyp/0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$contexts$2f$LojaContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLoja"]
    ];
});
_c8 = PontosPage;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "Horario");
__turbopack_context__.k.register(_c1, "PunchHeader");
__turbopack_context__.k.register(_c2, "StatusRegistro");
__turbopack_context__.k.register(_c3, "SyncStatus");
__turbopack_context__.k.register(_c4, "TabelaRegistros");
__turbopack_context__.k.register(_c5, "FechamentoLinhaRow");
__turbopack_context__.k.register(_c6, "TabelaRelatorioScroll");
__turbopack_context__.k.register(_c7, "AbaRelatorio");
__turbopack_context__.k.register(_c8, "PontosPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Demo-2_de884de6._.js.map