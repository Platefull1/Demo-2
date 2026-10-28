(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Demo-2/src/components/ui/alert.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Alert",
    ()=>Alert,
    "AlertDescription",
    ()=>AlertDescription,
    "AlertTitle",
    ()=>AlertTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const alertVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("relative w-full rounded-lg border p-4", {
    variants: {
        variant: {
            default: "bg-card border-border text-foreground",
            destructive: "text-foreground border-destructive/40 bg-destructive/10 [&>svg]:text-destructive",
            success: "text-foreground border-success/40 bg-success/10 [&>svg]:text-success",
            warning: "text-foreground border-warning/40 bg-warning/10 [&>svg]:text-warning",
            info: "text-foreground border-border bg-muted [&>svg]:text-muted-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Alert = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        role: "alert",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(alertVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/alert.tsx",
        lineNumber: 34,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Alert;
Alert.displayName = "Alert";
const AlertTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mb-1 font-medium leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/alert.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = AlertTitle;
AlertTitle.displayName = "AlertTitle";
const AlertDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/alert.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = AlertDescription;
AlertDescription.displayName = "AlertDescription";
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Alert$React.forwardRef");
__turbopack_context__.k.register(_c1, "Alert");
__turbopack_context__.k.register(_c2, "AlertTitle$React.forwardRef");
__turbopack_context__.k.register(_c3, "AlertTitle");
__turbopack_context__.k.register(_c4, "AlertDescription$React.forwardRef");
__turbopack_context__.k.register(_c5, "AlertDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/Demo-2/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/src/components/ui/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Skeleton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "skeleton",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("animate-pulse rounded-md bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/skeleton.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Skeleton;
;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/src/lib/nfe/ui-labels.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Labels e helpers de UI do CMV Real (revisão de notas). */ /** Faixa absurda de custo/kg (espelha fator-sugerido). */ __turbopack_context__.s([
    "CMV_STORE_LABELS",
    ()=>CMV_STORE_LABELS,
    "CUSTO_KG_MAX",
    ()=>CUSTO_KG_MAX,
    "CUSTO_KG_MIN",
    ()=>CUSTO_KG_MIN,
    "NOTA_STATUS_LABELS",
    ()=>NOTA_STATUS_LABELS,
    "UNIDADE_NOTA_NOMES",
    ()=>UNIDADE_NOTA_NOMES,
    "formatCustoMedioBr",
    ()=>formatCustoMedioBr,
    "formatNumBr",
    ()=>formatNumBr,
    "formatQuantidadeBr",
    ()=>formatQuantidadeBr,
    "notaStatusLabel",
    ()=>notaStatusLabel,
    "perguntaFator",
    ()=>perguntaFator,
    "storeLabel",
    ()=>storeLabel,
    "textoAlertaAmbiguo",
    ()=>textoAlertaAmbiguo,
    "unidadeNotaNome",
    ()=>unidadeNotaNome
]);
const CUSTO_KG_MIN = 0.5;
const CUSTO_KG_MAX = 500;
const CMV_STORE_LABELS = {
    ahu: 'Ahú',
    pilarzinho: 'Pilarzinho',
    portao: 'Portão',
    uberaba: 'Uberaba'
};
function storeLabel(slug) {
    if (!slug) return '—';
    return CMV_STORE_LABELS[slug] ?? slug;
}
const NOTA_STATUS_LABELS = {
    EM_REVISAO: 'Para revisar',
    APROVADA: 'Aprovada',
    IGNORADA: 'Fora do CMV',
    ANTERIOR_CMV_REAL: 'Anterior ao CMV Real'
};
function notaStatusLabel(status) {
    return NOTA_STATUS_LABELS[status] ?? status;
}
const UNIDADE_NOTA_NOMES = {
    BIS: 'bisnaga',
    FD: 'fardo',
    CX: 'caixa',
    PCT: 'pacote',
    LAT: 'lata',
    G: 'fardo/pack',
    TON: 'unidade do fornecedor',
    UN: 'unidade',
    KG: 'quilo'
};
function unidadeNotaNome(und) {
    const u = (und || 'UN').toUpperCase().trim();
    return UNIDADE_NOTA_NOMES[u] ?? u.toLowerCase();
}
function perguntaFator(unidadeNota, unidadeCmv) {
    const und = (unidadeNota || 'UN').toUpperCase().trim() || 'UN';
    if (unidadeCmv === 'UN') {
        return {
            pergunta: `Quantas unidades vêm em 1 ${und}?`,
            sufixo: 'un'
        };
    }
    return {
        pergunta: `Quanto pesa 1 ${und}?`,
        sufixo: 'kg'
    };
}
function textoAlertaAmbiguo(unidadeNota) {
    const und = (unidadeNota || 'UN').toUpperCase().trim() || 'UN';
    const nome = unidadeNotaNome(und);
    return `Confira o peso: a nota veio em ${und} (${nome})`;
}
function formatNumBr(n, decimals = 2) {
    return n.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}
function formatQuantidadeBr(n) {
    return n.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3
    });
}
function formatCustoMedioBr(n) {
    return n.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/src/lib/nfe/lojas.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Slugs e nomes de loja do CMV Real + normalização de lojaNome (contagem).
 */ __turbopack_context__.s([
    "CALENZANO_CNPJ_RAIZ",
    ()=>CALENZANO_CNPJ_RAIZ,
    "CMV_STORE_SLUGS",
    ()=>CMV_STORE_SLUGS,
    "STORE_CNPJ_BY_SLUG",
    ()=>STORE_CNPJ_BY_SLUG,
    "competenciaAnterior",
    ()=>competenciaAnterior,
    "normalizarCnpjLoja",
    ()=>normalizarCnpjLoja,
    "normalizarLojaNome",
    ()=>normalizarLojaNome,
    "storeSlugFromCnpj",
    ()=>storeSlugFromCnpj,
    "storeSlugFromLojaNome",
    ()=>storeSlugFromLojaNome
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/ui-labels.ts [app-client] (ecmascript)");
;
const CMV_STORE_SLUGS = [
    'ahu',
    'pilarzinho',
    'portao',
    'uberaba'
];
;
/** Aliases normalizados → storeSlug */ const LOJA_NOME_ALIASES = {
    ahu: 'ahu',
    ahuu: 'ahu',
    ahú: 'ahu',
    'calenzano ahu': 'ahu',
    'calenzano ahú': 'ahu',
    pilarzinho: 'pilarzinho',
    'calenzano pilarzinho': 'pilarzinho',
    portao: 'portao',
    portão: 'portao',
    'calenzano portao': 'portao',
    'calenzano portão': 'portao',
    uberaba: 'uberaba',
    'calenzano uberaba': 'uberaba'
};
function normalizarLojaNome(raw) {
    return String(raw || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}
function storeSlugFromLojaNome(lojaNome) {
    if (!lojaNome) return null;
    const n = normalizarLojaNome(lojaNome);
    if (!n) return null;
    if (LOJA_NOME_ALIASES[n]) return LOJA_NOME_ALIASES[n];
    // Contém o slug
    for (const slug of CMV_STORE_SLUGS){
        const slugNorm = normalizarLojaNome(slug === 'portao' ? 'portao' : slug);
        if (n === slugNorm || n.includes(slugNorm)) return slug;
    }
    if (n.includes('ahu')) return 'ahu';
    if (n.includes('pilar')) return 'pilarzinho';
    if (n.includes('porta')) return 'portao';
    if (n.includes('uber')) return 'uberaba';
    return null;
}
const STORE_CNPJ_BY_SLUG = {};
const CALENZANO_CNPJ_RAIZ = '08821071';
function storeSlugFromCnpj(cnpj, map = STORE_CNPJ_BY_SLUG) {
    const digits = String(cnpj || '').replace(/\D/g, '');
    if (digits.length < 11) return null;
    for (const [slug, c] of Object.entries(map)){
        if (c && c.replace(/\D/g, '') === digits) return slug;
    }
    return null;
}
function normalizarCnpjLoja(raw) {
    const d = String(raw || '').replace(/\D/g, '');
    return d.length === 14 ? d : d.length === 0 ? null : d;
}
function competenciaAnterior(competencia) {
    const [y, m] = competencia.split('-').map(Number);
    if (!y || !m) throw new Error(`competência inválida: ${competencia}`);
    if (m === 1) return `${y - 1}-12`;
    return `${y}-${String(m - 1).padStart(2, '0')}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/src/lib/nfe/transferencia-concilicao.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Conciliação pura de transferências entre lojas (sem Prisma).
 * Custo, status do documento e detecção de NF de transferência.
 */ __turbopack_context__.s([
    "CFOPS_TRANSFERENCIA",
    ()=>CFOPS_TRANSFERENCIA,
    "classificarNfTransferencia",
    ()=>classificarNfTransferencia,
    "cnpjRaiz",
    ()=>cnpjRaiz,
    "diffItens",
    ()=>diffItens,
    "ehCfopTransferencia",
    ()=>ehCfopTransferencia,
    "emitenteEhLojaCalenzano",
    ()=>emitenteEhLojaCalenzano,
    "ladoGeraLancamento",
    ()=>ladoGeraLancamento,
    "linhasEspelho",
    ()=>linhasEspelho,
    "montarEspelhoSaida",
    ()=>montarEspelhoSaida,
    "normalizarCnpjDigits",
    ()=>normalizarCnpjDigits,
    "pendenciasDocumentoTransferencia",
    ()=>pendenciasDocumentoTransferencia,
    "resolverCustoUnitario",
    ()=>resolverCustoUnitario,
    "statusDocumento",
    ()=>statusDocumento
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/lojas.ts [app-client] (ecmascript) <locals>");
;
const CFOPS_TRANSFERENCIA = [
    '5151',
    '5152',
    '5153',
    '5408',
    '5409',
    '5557',
    '6152',
    '6408',
    '6409',
    '6557'
];
const EPS = 0.0001;
function normalizarCnpjDigits(cnpj) {
    return String(cnpj || '').replace(/\D/g, '');
}
function cnpjRaiz(cnpj) {
    return normalizarCnpjDigits(cnpj).slice(0, 8);
}
function ehCfopTransferencia(cfop) {
    const d = String(cfop || '').replace(/\D/g, '');
    return CFOPS_TRANSFERENCIA.includes(d);
}
function emitenteEhLojaCalenzano(cnpj, storeCnpjBySlug = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["STORE_CNPJ_BY_SLUG"]) {
    const digits = normalizarCnpjDigits(cnpj);
    if (digits.length < 8) return false;
    if (cnpjRaiz(digits) === __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CALENZANO_CNPJ_RAIZ"]) return true;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["storeSlugFromCnpj"])(digits)) return true;
    const raiz = cnpjRaiz(digits);
    for (const c of Object.values(storeCnpjBySlug)){
        if (c && cnpjRaiz(c) === raiz) return true;
    }
    return false;
}
function classificarNfTransferencia(input) {
    const map = input.storeCnpjBySlug ?? __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["STORE_CNPJ_BY_SLUG"];
    const origemSlug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["storeSlugFromCnpj"])(input.emitenteCnpj, map);
    const emitenteCalenzano = emitenteEhLojaCalenzano(input.emitenteCnpj, map);
    const hasCfopTransfer = input.cfops.some((c)=>ehCfopTransferencia(c));
    const saipos = input.saiposTransferenciaId != null && input.saiposTransferenciaId > 0;
    if (saipos) {
        return {
            isTransfer: true,
            origemSlug: origemSlug && origemSlug !== input.destStoreSlug ? origemSlug : origemSlug,
            emitenteCalenzano,
            hasCfopTransfer,
            motivo: `Saipos id_store_stock_transfer=${input.saiposTransferenciaId}`
        };
    }
    if (emitenteCalenzano && hasCfopTransfer) {
        const mesmaLoja = origemSlug != null && origemSlug === input.destStoreSlug;
        return {
            isTransfer: !mesmaLoja,
            origemSlug: mesmaLoja ? null : origemSlug,
            emitenteCalenzano,
            hasCfopTransfer,
            motivo: mesmaLoja ? 'Emitente é a própria loja destino' : `NF loja Calenzano CFOP ${input.cfops.filter((c)=>ehCfopTransferencia(c)).join(',')}`
        };
    }
    return {
        isTransfer: false,
        origemSlug,
        emitenteCalenzano,
        hasCfopTransfer,
        motivo: emitenteCalenzano ? 'Emitente Calenzano sem CFOP de transferência' : hasCfopTransfer ? 'CFOP de transferência sem emitente de loja' : 'Não é transferência entre lojas'
    };
}
function resolverCustoUnitario(input) {
    const info = input.custoInformado;
    if (input.forcarManual) {
        if (info != null && info > 0) {
            return {
                custo: info,
                origem: 'CUSTO_MANUAL',
                exigePreenchimento: false
            };
        }
        return {
            custo: null,
            origem: 'CUSTO_MANUAL',
            exigePreenchimento: true
        };
    }
    if (input.ultimoCustoOrigem != null && input.ultimoCustoOrigem > 0) {
        return {
            custo: input.ultimoCustoOrigem,
            origem: 'ULTIMO_CUSTO_ORIGEM',
            exigePreenchimento: false
        };
    }
    if (input.custoEstoqueInicialOrigem != null && input.custoEstoqueInicialOrigem > 0) {
        return {
            custo: input.custoEstoqueInicialOrigem,
            origem: 'ESTOQUE_INICIAL_ORIGEM',
            exigePreenchimento: false
        };
    }
    if (input.ultimoCustoQualquerLoja != null && input.ultimoCustoQualquerLoja > 0) {
        return {
            custo: input.ultimoCustoQualquerLoja,
            origem: 'ULTIMO_CUSTO_QUALQUER_LOJA',
            exigePreenchimento: false
        };
    }
    if (info != null && info > 0) {
        return {
            custo: info,
            origem: 'CUSTO_MANUAL',
            exigePreenchimento: false
        };
    }
    return {
        custo: null,
        origem: 'CUSTO_MANUAL',
        exigePreenchimento: true
    };
}
function somarPorInsumo(itens) {
    const m = new Map();
    for (const it of itens){
        if (!it.estoqueInsumoId) continue;
        m.set(it.estoqueInsumoId, (m.get(it.estoqueInsumoId) ?? 0) + Number(it.quantidade));
    }
    return m;
}
function diffItens(saida, entrada, toleranciaQtd = EPS) {
    const a = somarPorInsumo(saida);
    const b = somarPorInsumo(entrada);
    const ids = new Set([
        ...a.keys(),
        ...b.keys()
    ]);
    const diffs = [];
    for (const id of ids){
        const qtdSaida = a.get(id) ?? 0;
        const qtdEntrada = b.get(id) ?? 0;
        if (Math.abs(qtdSaida - qtdEntrada) > toleranciaQtd) {
            diffs.push({
                estoqueInsumoId: id,
                qtdSaida,
                qtdEntrada
            });
        }
    }
    return diffs.sort((x, y)=>x.estoqueInsumoId.localeCompare(y.estoqueInsumoId));
}
function montarEspelhoSaida(itensEntrada) {
    return itensEntrada.map((it)=>({
            estoqueInsumoId: it.estoqueInsumoId,
            quantidade: it.quantidade
        }));
}
function somarDetalhe(itens) {
    const m = new Map();
    for (const it of itens){
        if (!it.estoqueInsumoId) continue;
        const prev = m.get(it.estoqueInsumoId);
        const qtd = (prev?.qtd ?? 0) + Number(it.quantidade);
        const valorItem = it.valorTotal ?? null;
        const valor = prev?.valor == null && valorItem == null ? null : (prev?.valor ?? 0) + (valorItem ?? 0);
        const custo = it.custoUnitario != null ? it.custoUnitario : prev?.custo ?? null;
        m.set(it.estoqueInsumoId, {
            qtd,
            valor,
            custo
        });
    }
    return m;
}
function linhasEspelho(saida, entrada, toleranciaQtd = EPS) {
    const a = somarDetalhe(saida);
    const b = somarDetalhe(entrada);
    const ids = [
        ...new Set([
            ...a.keys(),
            ...b.keys()
        ])
    ].sort();
    return ids.map((id)=>{
        const s = a.get(id);
        const e = b.get(id);
        const qtdSaida = s?.qtd ?? 0;
        const qtdEntrada = e?.qtd ?? 0;
        return {
            estoqueInsumoId: id,
            qtdSaida,
            qtdEntrada,
            custoSaida: s?.custo ?? null,
            custoEntrada: e?.custo ?? null,
            valorSaida: s?.valor ?? null,
            valorEntrada: e?.valor ?? null,
            divergente: Math.abs(qtdSaida - qtdEntrada) > toleranciaQtd
        };
    });
}
function statusDocumento(input) {
    const saida = input.itensSaida ?? [];
    const entrada = input.itensEntrada ?? [];
    if (input.entradaRegistrada && !input.saidaConfirmada) {
        return {
            status: 'AGUARDANDO_SAIDA',
            diffs: []
        };
    }
    if (input.saidaConfirmada && !input.entradaRegistrada) {
        return {
            status: 'AGUARDANDO_ENTRADA',
            diffs: []
        };
    }
    if (!input.entradaRegistrada && !input.saidaConfirmada) {
        return {
            status: 'AGUARDANDO_ENTRADA',
            diffs: []
        };
    }
    const diffs = diffItens(saida, entrada, input.toleranciaQtd);
    return {
        status: diffs.length === 0 ? 'CONCILIADA' : 'DIVERGENTE',
        diffs
    };
}
function ladoGeraLancamento(lado) {
    return !lado.rascunho;
}
function pendenciasDocumentoTransferencia(doc) {
    const rota = `${doc.lojaOrigemLabel} → ${doc.lojaDestinoLabel}`;
    const saida = doc.lados.find((l)=>l.tipo === 'SAIDA');
    const entrada = doc.lados.find((l)=>l.tipo === 'ENTRADA');
    const out = [];
    if (saida?.rascunho) {
        out.push({
            tipo: 'TRANSFERENCIA_ESPELHO',
            mensagem: `Transferência ${doc.numeroDocumento} (${rota}): saída ainda é espelho — não entra no CMV`
        });
    }
    if (entrada?.rascunho) {
        out.push({
            tipo: 'TRANSFERENCIA_ESPELHO',
            mensagem: `Transferência ${doc.numeroDocumento} (${rota}): entrada ainda é espelho — não entra no CMV`
        });
    }
    if (doc.status === 'DIVERGENTE') {
        out.push({
            tipo: 'TRANSFERENCIA_DIVERGENTE',
            mensagem: `Transferência ${doc.numeroDocumento} (${rota}) divergente`
        });
        return out;
    }
    if (doc.status === 'CONCILIADA') return out;
    const saidaPendente = !saida || saida.rascunho;
    const entradaPendente = !entrada || entrada.rascunho;
    if (saidaPendente && !saida?.rascunho) {
        out.push({
            tipo: 'TRANSFERENCIA_AGUARDANDO',
            mensagem: `Transferência ${doc.numeroDocumento} (${rota}) aguardando saída`
        });
    }
    if (entradaPendente && !entrada?.rascunho) {
        out.push({
            tipo: 'TRANSFERENCIA_AGUARDANDO',
            mensagem: `Transferência ${doc.numeroDocumento} (${rota}) aguardando entrada`
        });
    }
    return out;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/src/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Demo-2/src/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Label;
;
var _c;
__turbopack_context__.k.register(_c, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransferenciaForm",
    ()=>TransferenciaForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/components/ui/sheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/ui-labels.ts [app-client] (ecmascript)");
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
function TransferenciaForm({ open, onOpenChange, produtos, lojasOpts, lojaPadrao, onSaved, prefill }) {
    _s();
    const [tipoLado, setTipoLado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('SAIDA');
    const [lojaA, setLojaA] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(lojaPadrao);
    const [lojaB, setLojaB] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "TransferenciaForm.useState": ()=>new Date().toISOString().slice(0, 10)
    }["TransferenciaForm.useState"]);
    const [numero, setNumero] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [observacao, setObservacao] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [itens, setItens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [busca, setBusca] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [msg, setMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransferenciaForm.useEffect": ()=>{
            if (!open) return;
            setMsg(null);
            setBusca('');
            if (prefill) {
                setTipoLado(prefill.tipoLado);
                setLojaA(prefill.tipoLado === 'SAIDA' ? prefill.lojaOrigem : prefill.lojaDestino);
                setLojaB(prefill.tipoLado === 'SAIDA' ? prefill.lojaDestino : prefill.lojaOrigem);
                setData(prefill.data);
                setNumero(prefill.numero);
                setObservacao(prefill.observacao || '');
                setItens((prefill.itens || []).map({
                    "TransferenciaForm.useEffect": (it)=>({
                            key: `${it.estoqueInsumoId}-${prefill.tipoLado}`,
                            estoqueInsumoId: it.estoqueInsumoId,
                            nome: it.nome,
                            unidade: it.unidade,
                            quantidade: it.quantidade ? String(it.quantidade).replace('.', ',') : '',
                            custoUnitario: it.custoUnitario != null ? String(it.custoUnitario).replace('.', ',') : '',
                            custoOrigem: null
                        })
                }["TransferenciaForm.useEffect"]));
                return;
            }
            setTipoLado('SAIDA');
            setLojaA(lojaPadrao);
            setLojaB('');
            setNumero('');
            setObservacao('');
            setItens([]);
        }
    }["TransferenciaForm.useEffect"], [
        open,
        lojaPadrao,
        prefill
    ]);
    const lojaOrigem = tipoLado === 'SAIDA' ? lojaA : lojaB;
    const lojaDestino = tipoLado === 'SAIDA' ? lojaB : lojaA;
    const outras = lojasOpts.filter((s)=>s !== lojaA);
    const sugestoes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TransferenciaForm.useMemo[sugestoes]": ()=>{
            const q = busca.trim().toLowerCase();
            if (q.length < 1) return [];
            const ja = new Set(itens.map({
                "TransferenciaForm.useMemo[sugestoes]": (i)=>i.estoqueInsumoId
            }["TransferenciaForm.useMemo[sugestoes]"]));
            return produtos.filter({
                "TransferenciaForm.useMemo[sugestoes]": (p)=>!ja.has(p.estoqueInsumoId) && p.nome.toLowerCase().includes(q)
            }["TransferenciaForm.useMemo[sugestoes]"]).slice(0, 8);
        }
    }["TransferenciaForm.useMemo[sugestoes]"], [
        busca,
        produtos,
        itens
    ]);
    const addProduto = async (p)=>{
        setBusca('');
        let custo = '';
        let origem = null;
        if (lojaOrigem) {
            const comp = data.slice(0, 7);
            const res = await fetch(`/api/cmv-real/transferencias?acao=custo&lojaOrigem=${lojaOrigem}&estoqueInsumoId=${p.estoqueInsumoId}&competencia=${comp}`);
            const d = await res.json();
            if (res.ok && d.custo != null) {
                custo = String(d.custo).replace('.', ',');
                origem = d.origem;
            }
        }
        setItens((prev)=>[
                ...prev,
                {
                    key: `${p.estoqueInsumoId}-${Date.now()}`,
                    estoqueInsumoId: p.estoqueInsumoId,
                    nome: p.nome,
                    unidade: p.unidade,
                    quantidade: '',
                    custoUnitario: custo,
                    custoOrigem: origem
                }
            ]);
    };
    const salvar = async ()=>{
        setSaving(true);
        setMsg(null);
        try {
            if (!lojaB) throw new Error('Escolha a outra loja');
            const payloadItens = itens.map((it)=>({
                    estoqueInsumoId: it.estoqueInsumoId,
                    quantidade: Number(it.quantidade.replace(',', '.')),
                    custoUnitario: it.custoUnitario ? Number(it.custoUnitario.replace(',', '.')) : null
                }));
            if (payloadItens.some((i)=>!(i.quantidade > 0))) {
                throw new Error('Informe a quantidade de cada item');
            }
            const res = await fetch('/api/cmv-real/transferencias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tipoLado,
                    lojaOrigem,
                    lojaDestino,
                    data,
                    numeroDocumento: numero,
                    observacao: observacao || undefined,
                    itens: payloadItens
                })
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error || 'Falha');
            setItens([]);
            setNumero('');
            setObservacao('');
            onOpenChange(false);
            await onSaved();
        } catch (e) {
            setMsg(e instanceof Error ? e.message : 'Erro');
        } finally{
            setSaving(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sheet"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetContent"], {
            side: "right",
            className: "!inset-0 !h-full !w-full !max-w-none overflow-y-auto bg-card border-border p-4 sm:!inset-y-0 sm:!right-0 sm:!left-auto sm:!h-full sm:!w-full sm:!max-w-md sm:p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetHeader"], {
                    className: "text-left pr-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTitle"], {
                            className: "text-base font-semibold",
                            children: prefill ? 'Registrar outro lado' : 'Nova transferência'
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetDescription"], {
                            className: "text-sm text-muted-foreground",
                            children: prefill ? 'Confira quantidades e confirme o lado que faltava.' : 'Lance na hora que a mercadoria sai ou chega.'
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                    lineNumber: 197,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    size: "lg",
                                    variant: tipoLado === 'SAIDA' ? 'default' : 'outline',
                                    className: "h-12 text-sm",
                                    disabled: Boolean(prefill),
                                    onClick: ()=>setTipoLado('SAIDA'),
                                    children: "Saiu da loja"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    size: "lg",
                                    variant: tipoLado === 'ENTRADA' ? 'default' : 'outline',
                                    className: "h-12 text-sm",
                                    disabled: Boolean(prefill),
                                    onClick: ()=>setTipoLado('ENTRADA'),
                                    children: "Chegou na loja"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 220,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    className: "text-sm",
                                    children: "Sua loja"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 233,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "h-12 w-full rounded-md border border-input bg-background px-3 text-sm",
                                    value: lojaA,
                                    disabled: Boolean(prefill),
                                    onChange: (e)=>{
                                        setLojaA(e.target.value);
                                        if (e.target.value === lojaB) setLojaB('');
                                    },
                                    children: lojasOpts.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: s,
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CMV_STORE_LABELS"][s] || s
                                        }, s, false, {
                                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                            lineNumber: 244,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 234,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                            lineNumber: 232,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    className: "text-sm",
                                    children: tipoLado === 'SAIDA' ? 'Destino' : 'Origem'
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 252,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "h-12 w-full rounded-md border border-input bg-background px-3 text-sm",
                                    value: lojaB,
                                    disabled: Boolean(prefill),
                                    onChange: (e)=>setLojaB(e.target.value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Escolher loja…"
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                            lineNumber: 261,
                                            columnNumber: 15
                                        }, this),
                                        outras.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: s,
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CMV_STORE_LABELS"][s] || s
                                            }, s, false, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                lineNumber: 263,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 255,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                            lineNumber: 251,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            className: "text-sm",
                                            children: "Data"
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                            lineNumber: 272,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            type: "date",
                                            value: data,
                                            disabled: Boolean(prefill),
                                            onChange: (e)=>setData(e.target.value),
                                            className: "h-12"
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                            lineNumber: 273,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 271,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            className: "text-sm",
                                            children: "Nº documento"
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                            lineNumber: 282,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            value: numero,
                                            disabled: Boolean(prefill),
                                            onChange: (e)=>setNumero(e.target.value),
                                            placeholder: "Ex.: 12",
                                            className: "h-12"
                                        }, void 0, false, {
                                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                            lineNumber: 283,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 281,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                            lineNumber: 270,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    className: "text-sm",
                                    children: "Adicionar produto"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 294,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    value: busca,
                                    onChange: (e)=>setBusca(e.target.value),
                                    placeholder: "Buscar no catálogo…",
                                    className: "h-12",
                                    autoComplete: "off"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 295,
                                    columnNumber: 13
                                }, this),
                                sugestoes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "rounded-md border border-border bg-popover divide-y divide-border",
                                    children: sugestoes.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "w-full text-left px-3 py-3 text-sm hover:bg-muted",
                                                onClick: ()=>void addProduto(p),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-foreground",
                                                        children: p.nome
                                                    }, void 0, false, {
                                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                        lineNumber: 311,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "ml-2 text-xs text-muted-foreground",
                                                        children: p.unidade
                                                    }, void 0, false, {
                                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                        lineNumber: 312,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                lineNumber: 306,
                                                columnNumber: 21
                                            }, this)
                                        }, p.estoqueInsumoId, false, {
                                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                            lineNumber: 305,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 303,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                            lineNumber: 293,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                itens.map((it)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-md border border-border p-3 space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-medium text-foreground",
                                                        children: it.nome
                                                    }, void 0, false, {
                                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                        lineNumber: 329,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "text-muted-foreground p-1",
                                                        onClick: ()=>setItens((prev)=>prev.filter((x)=>x.key !== it.key)),
                                                        "aria-label": "Remover item",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                            className: "size-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                            lineNumber: 338,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                lineNumber: 328,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted-foreground mb-1",
                                                                children: [
                                                                    "Qtd (",
                                                                    it.unidade,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                                lineNumber: 343,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                inputMode: "decimal",
                                                                value: it.quantidade,
                                                                onChange: (e)=>setItens((prev)=>prev.map((x)=>x.key === it.key ? {
                                                                                ...x,
                                                                                quantidade: e.target.value
                                                                            } : x)),
                                                                className: "h-12 tabular-nums"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                                lineNumber: 346,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                        lineNumber: 342,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted-foreground mb-1",
                                                                children: [
                                                                    "Custo / ",
                                                                    it.unidade
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                                lineNumber: 362,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                inputMode: "decimal",
                                                                value: it.custoUnitario,
                                                                onChange: (e)=>setItens((prev)=>prev.map((x)=>x.key === it.key ? {
                                                                                ...x,
                                                                                custoUnitario: e.target.value,
                                                                                custoOrigem: 'CUSTO_MANUAL'
                                                                            } : x)),
                                                                className: "h-12 tabular-nums"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                                lineNumber: 365,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                        lineNumber: 361,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                lineNumber: 341,
                                                columnNumber: 17
                                            }, this),
                                            it.custoOrigem && it.custoOrigem !== 'CUSTO_MANUAL' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Custo sugerido da origem"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                lineNumber: 382,
                                                columnNumber: 19
                                            }, this) : it.custoOrigem === 'CUSTO_MANUAL' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Custo manual"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                lineNumber: 384,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-warning",
                                                children: "Preencha o custo — sem histórico"
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                                lineNumber: 386,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, it.key, true, {
                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                        lineNumber: 324,
                                        columnNumber: 15
                                    }, this)),
                                itens.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: "Nenhum item. Busque e toque para adicionar."
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 391,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                            lineNumber: 322,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            value: observacao,
                            onChange: (e)=>setObservacao(e.target.value),
                            placeholder: "Observação (opcional)",
                            className: "h-12"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                            lineNumber: 397,
                            columnNumber: 11
                        }, this),
                        msg ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-warning",
                            role: "alert",
                            children: msg
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                            lineNumber: 405,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            size: "lg",
                            className: "w-full h-12",
                            disabled: saving || itens.length === 0 || !numero.trim(),
                            onClick: ()=>void salvar(),
                            children: [
                                saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "size-4 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 417,
                                    columnNumber: 23
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "size-4"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                                    lineNumber: 417,
                                    columnNumber: 69
                                }, this),
                                "Registrar ",
                                tipoLado === 'SAIDA' ? 'saída' : 'entrada'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                            lineNumber: 410,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
                    lineNumber: 208,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
            lineNumber: 193,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx",
        lineNumber: 192,
        columnNumber: 5
    }, this);
}
_s(TransferenciaForm, "JB2hLQzUglPK83DZUyWFw2RPyMU=");
_c = TransferenciaForm;
var _c;
__turbopack_context__.k.register(_c, "TransferenciaForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TransferenciaDetalhePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/components/ui/alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$concilicao$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/transferencia-concilicao.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/ui-labels.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f28$app$292f$cmv$2d$real$2f$transferencias$2f$TransferenciaForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/(app)/cmv-real/transferencias/TransferenciaForm.tsx [app-client] (ecmascript)");
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
const STATUS_LABEL = {
    AGUARDANDO_ENTRADA: 'Aguardando entrada',
    AGUARDANDO_SAIDA: 'Aguardando saída',
    CONCILIADA: 'Conciliada',
    DIVERGENTE: 'Divergente'
};
const CUSTO_LABEL = {
    ULTIMO_CUSTO_ORIGEM: 'Último custo da origem',
    ESTOQUE_INICIAL_ORIGEM: 'Estoque inicial da origem',
    ULTIMO_CUSTO_QUALQUER_LOJA: 'Último custo de outra loja',
    CUSTO_MANUAL: 'Custo manual'
};
function brl(n) {
    if (n == null) return '—';
    return n.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
function qtd(n) {
    return n.toLocaleString('pt-BR', {
        maximumFractionDigits: 3
    });
}
function TransferenciaDetalhePage() {
    _s();
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [doc, setDoc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [produtos, setProdutos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [lojasOpts, setLojasOpts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [msg, setMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [deleting, setDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formOpen, setFormOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [competenciaFechada, setCompetenciaFechada] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TransferenciaDetalhePage.useCallback[load]": async ()=>{
            setLoading(true);
            try {
                const [resD, resP] = await Promise.all([
                    fetch(`/api/cmv-real/transferencias/${id}`, {
                        cache: 'no-store'
                    }),
                    fetch('/api/cmv-real/produtos', {
                        cache: 'no-store'
                    })
                ]);
                const dd = await resD.json();
                if (!resD.ok) throw new Error(dd.error || 'Não encontrada');
                setDoc(dd.transferencia);
                setCompetenciaFechada(dd.competenciaFechada === true);
                setLojasOpts(Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CMV_STORE_LABELS"]));
                if (resP.ok) {
                    const dp = await resP.json();
                    setProdutos((dp.itens || []).filter({
                        "TransferenciaDetalhePage.useCallback[load]": (p)=>p.ativo !== false
                    }["TransferenciaDetalhePage.useCallback[load]"]).map({
                        "TransferenciaDetalhePage.useCallback[load]": (p)=>({
                                estoqueInsumoId: p.estoqueInsumoId,
                                nome: p.nome,
                                unidade: p.unidade
                            })
                    }["TransferenciaDetalhePage.useCallback[load]"]));
                }
            } catch (e) {
                setMsg(e instanceof Error ? e.message : 'Erro');
                setDoc(null);
            } finally{
                setLoading(false);
            }
        }
    }["TransferenciaDetalhePage.useCallback[load]"], [
        id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransferenciaDetalhePage.useEffect": ()=>{
            void load();
        }
    }["TransferenciaDetalhePage.useEffect"], [
        load
    ]);
    const saida = doc?.lados.find((l)=>l.tipo === 'SAIDA');
    const entrada = doc?.lados.find((l)=>l.tipo === 'ENTRADA');
    const nomes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TransferenciaDetalhePage.useMemo[nomes]": ()=>{
            const m = new Map();
            for (const l of doc?.lados ?? []){
                for (const it of l.itens){
                    m.set(it.estoqueInsumoId, {
                        nome: it.nome,
                        unidade: it.unidade
                    });
                }
            }
            return m;
        }
    }["TransferenciaDetalhePage.useMemo[nomes]"], [
        doc
    ]);
    const linhas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TransferenciaDetalhePage.useMemo[linhas]": ()=>{
            if (!doc) return [];
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$concilicao$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linhasEspelho"])((saida?.itens ?? []).map({
                "TransferenciaDetalhePage.useMemo[linhas]": (i)=>({
                        estoqueInsumoId: i.estoqueInsumoId,
                        quantidade: i.quantidade,
                        custoUnitario: i.custoUnitario,
                        valorTotal: i.valorTotal
                    })
            }["TransferenciaDetalhePage.useMemo[linhas]"]), (entrada?.itens ?? []).map({
                "TransferenciaDetalhePage.useMemo[linhas]": (i)=>({
                        estoqueInsumoId: i.estoqueInsumoId,
                        quantidade: i.quantidade,
                        custoUnitario: i.custoUnitario,
                        valorTotal: i.valorTotal
                    })
            }["TransferenciaDetalhePage.useMemo[linhas]"]));
        }
    }["TransferenciaDetalhePage.useMemo[linhas]"], [
        doc,
        saida,
        entrada
    ]);
    const ladoFaltando = !doc ? null : !saida || saida.rascunho ? 'SAIDA' : !entrada || entrada.rascunho ? 'ENTRADA' : null;
    const prefill = doc && ladoFaltando ? {
        tipoLado: ladoFaltando,
        lojaOrigem: doc.lojaOrigem,
        lojaDestino: doc.lojaDestino,
        data: doc.data.slice(0, 10),
        numero: doc.numeroDocumento,
        observacao: doc.observacao,
        itens: (ladoFaltando === 'ENTRADA' ? saida?.itens : entrada?.itens)?.map((it)=>({
                estoqueInsumoId: it.estoqueInsumoId,
                nome: it.nome,
                unidade: it.unidade,
                quantidade: it.quantidade,
                custoUnitario: it.custoUnitario
            }))
    } : null;
    const excluir = async ()=>{
        if (!doc) return;
        if (!window.confirm(`Excluir o documento ${doc.numeroDocumento}?`)) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/cmv-real/transferencias/${doc.id}`, {
                method: 'DELETE'
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error || 'Falha ao excluir');
            router.push('/cmv-real/transferencias');
        } catch (e) {
            setMsg(e instanceof Error ? e.message : 'Erro');
        } finally{
            setDeleting(false);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                    className: "h-8 w-48"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                    lineNumber: 204,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                    className: "h-40 w-full"
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                    lineNumber: 205,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
            lineNumber: 203,
            columnNumber: 7
        }, this);
    }
    if (!doc) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/cmv-real/transferencias",
                    className: "inline-flex items-center gap-2 text-sm text-muted-foreground",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            className: "size-4"
                        }, void 0, false, {
                            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                            lineNumber: 217,
                            columnNumber: 11
                        }, this),
                        "Transferências"
                    ]
                }, void 0, true, {
                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                    lineNumber: 213,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-muted-foreground",
                    children: msg || 'Não encontrada'
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                    lineNumber: 220,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
            lineNumber: 212,
            columnNumber: 7
        }, this);
    }
    const totalSaida = (saida?.itens ?? []).reduce((s, i)=>s + (i.valorTotal ?? 0), 0);
    const totalEntrada = (entrada?.itens ?? []).reduce((s, i)=>s + (i.valorTotal ?? 0), 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/cmv-real/transferencias",
                                className: "inline-flex items-center gap-2 text-sm text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                        lineNumber: 239,
                                        columnNumber: 13
                                    }, this),
                                    "Transferências"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-base font-semibold text-foreground",
                                children: [
                                    "Documento ",
                                    doc.numeroDocumento
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: [
                                    new Date(doc.data).toLocaleDateString('pt-BR'),
                                    ' · ',
                                    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CMV_STORE_LABELS"][doc.lojaOrigem] || doc.lojaOrigem,
                                    ' → ',
                                    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CMV_STORE_LABELS"][doc.lojaDestino] || doc.lojaDestino
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 245,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "outline",
                                className: "text-xs font-normal",
                                children: STATUS_LABEL[doc.status] || doc.status
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this),
                            ladoFaltando ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                size: "sm",
                                disabled: competenciaFechada,
                                onClick: ()=>setFormOpen(true),
                                children: ladoFaltando === 'ENTRADA' ? 'Registrar entrada' : 'Registrar saída'
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 258,
                                columnNumber: 13
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                size: "sm",
                                variant: "outline",
                                disabled: deleting || competenciaFechada,
                                onClick: ()=>void excluir(),
                                children: deleting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "size-4 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                    lineNumber: 274,
                                    columnNumber: 25
                                }, this) : 'Excluir'
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                        lineNumber: 253,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, this),
            competenciaFechada ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-muted-foreground",
                children: "Competência fechada — reabra o mês para registrar o outro lado ou excluir."
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                lineNumber: 280,
                columnNumber: 9
            }, this) : null,
            msg ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-warning",
                role: "alert",
                children: msg
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                lineNumber: 286,
                columnNumber: 9
            }, this) : null,
            doc.status === 'DIVERGENTE' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                variant: "warning",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                    className: "text-sm",
                    children: "Quantidades diferentes entre saída e entrada. Confira o lado a lado."
                }, void 0, false, {
                    fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                    lineNumber: 293,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                lineNumber: 292,
                columnNumber: 9
            }, this) : null,
            doc.observacao ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-muted-foreground",
                children: doc.observacao
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                lineNumber: 300,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 border-b border-border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 border-r border-border",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-base font-semibold text-foreground",
                                        children: "Saída"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                        lineNumber: 306,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground mt-1",
                                        children: [
                                            __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CMV_STORE_LABELS"][doc.lojaOrigem] || doc.lojaOrigem,
                                            saida?.rascunho ? ' · rascunho' : '',
                                            !saida ? ' · sem registro' : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                        lineNumber: 307,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 305,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-base font-semibold text-foreground",
                                        children: "Entrada"
                                    }, void 0, false, {
                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                        lineNumber: 314,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground mt-1",
                                        children: [
                                            __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CMV_STORE_LABELS"][doc.lojaDestino] || doc.lojaDestino,
                                            entrada?.rascunho ? ' · rascunho' : '',
                                            !entrada ? ' · sem registro' : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                        lineNumber: 315,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 313,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                        lineNumber: 304,
                        columnNumber: 9
                    }, this),
                    linhas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "p-6 text-sm text-muted-foreground",
                        children: "Nenhum item neste documento"
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                        lineNumber: 324,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        children: linhas.map((ln)=>{
                            const meta = nomes.get(ln.estoqueInsumoId);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "grid grid-cols-2 border-b border-border last:border-b-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-4 border-r border-border ${ln.divergente ? 'bg-warning/10' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-foreground",
                                                children: meta?.nome || ln.estoqueInsumoId
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                                lineNumber: 337,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm tabular-nums text-foreground mt-1",
                                                children: ln.qtdSaida > 0 ? `${qtd(ln.qtdSaida)} ${meta?.unidade || ''}` : '—'
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                                lineNumber: 340,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground mt-1",
                                                children: ln.qtdSaida > 0 ? brl(ln.valorSaida) : ''
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                                lineNumber: 345,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                        lineNumber: 334,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-4 ${ln.divergente ? 'bg-warning/10' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-foreground",
                                                children: meta?.nome || ln.estoqueInsumoId
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                                lineNumber: 350,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm tabular-nums text-foreground mt-1",
                                                children: ln.qtdEntrada > 0 ? `${qtd(ln.qtdEntrada)} ${meta?.unidade || ''}` : '—'
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                                lineNumber: 353,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground mt-1",
                                                children: ln.qtdEntrada > 0 ? brl(ln.valorEntrada) : ''
                                            }, void 0, false, {
                                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                                lineNumber: 358,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                        lineNumber: 349,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, ln.estoqueInsumoId, true, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 330,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                        lineNumber: 326,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 border-t border-border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "p-4 text-sm tabular-nums text-foreground border-r border-border",
                                children: brl(totalSaida)
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 369,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "p-4 text-sm tabular-nums text-foreground",
                                children: brl(totalEntrada)
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                        lineNumber: 368,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                lineNumber: 303,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 md:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LadoDetalhe, {
                        titulo: "Origem do custo — saída",
                        itens: saida?.itens ?? []
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                        lineNumber: 377,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LadoDetalhe, {
                        titulo: "Origem do custo — entrada",
                        itens: entrada?.itens ?? []
                    }, void 0, false, {
                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                        lineNumber: 378,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                lineNumber: 376,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f28$app$292f$cmv$2d$real$2f$transferencias$2f$TransferenciaForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransferenciaForm"], {
                open: formOpen,
                onOpenChange: setFormOpen,
                produtos: produtos,
                lojasOpts: lojasOpts.length ? lojasOpts : Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CMV_STORE_LABELS"]),
                lojaPadrao: doc.lojaOrigem,
                prefill: prefill,
                onSaved: load
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                lineNumber: 381,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
        lineNumber: 232,
        columnNumber: 5
    }, this);
}
_s(TransferenciaDetalhePage, "oHBjKblgz7EqPJRCD83pEhtqoE8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TransferenciaDetalhePage;
function LadoDetalhe({ titulo, itens }) {
    if (itens.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-base font-semibold text-foreground",
                children: titulo
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                lineNumber: 398,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-2",
                children: itens.map((it)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-foreground",
                                children: it.nome
                            }, void 0, false, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 402,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-2 text-xs text-muted-foreground",
                                children: [
                                    it.custoOrigem ? CUSTO_LABEL[it.custoOrigem] || it.custoOrigem : '—',
                                    it.custoUnitario != null ? ` · ${brl(it.custoUnitario)}/${it.unidade}` : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                                lineNumber: 403,
                                columnNumber: 13
                            }, this)
                        ]
                    }, it.id, true, {
                        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                        lineNumber: 401,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
                lineNumber: 399,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Demo-2/app/(app)/cmv-real/transferencias/[id]/page.tsx",
        lineNumber: 397,
        columnNumber: 5
    }, this);
}
_c1 = LadoDetalhe;
var _c, _c1;
__turbopack_context__.k.register(_c, "TransferenciaDetalhePage");
__turbopack_context__.k.register(_c1, "LadoDetalhe");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Demo-2_e50e9098._.js.map