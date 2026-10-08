module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/drin-platform/src/stack.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stackServerApp",
    ()=>stackServerApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2f$apps$2f$interfaces$2f$server$2d$app$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/@stackframe/stack/dist/esm/lib/stack-app/apps/interfaces/server-app.js [app-route] (ecmascript)");
;
const stackServerApp = new __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2f$apps$2f$interfaces$2f$server$2d$app$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StackServerApp"]({
    tokenStore: 'nextjs-cookie',
    projectId: ("TURBOPACK compile-time value", "26dbad35-bdd4-497b-b94c-142f01758197"),
    publishableClientKey: ("TURBOPACK compile-time value", "pck_1cazbav6n1k56a1q2fxre50xe5508qaneev49hzpcf390"),
    secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
    urls: {
        signIn: '/auth/login',
        signUp: '/auth/register',
        afterSignIn: '/dashboard',
        afterSignUp: '/dashboard',
        afterSignOut: '/',
        handler: '/handler'
    }
});
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/drin-platform/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db,
    "ensureConnection",
    ()=>ensureConnection
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const db = global.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'error',
        'warn'
    ] : "TURBOPACK unreachable",
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});
// Garantir que apenas uma instância do Prisma existe
if ("TURBOPACK compile-time truthy", 1) global.prisma = db;
async function ensureConnection() {
    try {
        await db.$connect();
    } catch (error) {
        // Se a conexão já estiver ativa, ignorar o erro
        if (error instanceof Error && !error.message.includes('already connected')) {
            console.warn('⚠️ Aviso ao verificar conexão:', error.message);
        }
    }
}
// Graceful shutdown - desconectar quando o processo terminar
if ("TURBOPACK compile-time truthy", 1) {
    process.on('beforeExit', async ()=>{
        await db.$disconnect();
    });
}
}),
"[project]/drin-platform/app/api/ifood/dashboard/summary/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/stack.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/db.ts [app-route] (ecmascript)");
const dynamic = 'force-dynamic';
;
;
;
async function getPrismaUser(stackUserId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findFirst({
        where: {
            stackUserId
        }
    });
}
async function GET(req) {
    try {
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser();
        if (!stackUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autenticado'
            }, {
                status: 401
            });
        }
        const user = await getPrismaUser(stackUser.id);
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Usuário não encontrado'
            }, {
                status: 404
            });
        }
        const { searchParams } = new URL(req.url);
        const merchantId = searchParams.get('merchantId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        if (!startDate || !endDate) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'startDate e endDate são obrigatórios'
            }, {
                status: 400
            });
        }
        const start = new Date(`${startDate}T00:00:00.000Z`);
        const end = new Date(`${endDate}T23:59:59.999Z`);
        // Resolve which merchantIds to query
        let merchantIds = null; // null = specific merchantId
        if (!merchantId || merchantId === 'all') {
            const connections = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].ifoodConnection.findMany({
                where: {
                    userId: user.id,
                    status: 'active'
                },
                select: {
                    merchantId: true
                }
            });
            merchantIds = connections.map((c)=>c.merchantId);
            if (merchantIds.length === 0) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(buildEmptySummary());
            }
        } else {
            // Verify ownership
            const connection = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].ifoodConnection.findFirst({
                where: {
                    userId: user.id,
                    merchantId
                }
            });
            if (!connection) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Loja não encontrada'
                }, {
                    status: 404
                });
            }
        }
        const merchantFilter = merchantIds !== null ? {
            in: merchantIds
        } : merchantId;
        // Current period orders
        const allOrders = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].ifoodOrder.findMany({
            where: {
                userId: user.id,
                merchantId: merchantFilter,
                isTest: false,
                createdAt: {
                    gte: start,
                    lte: end
                }
            },
            select: {
                status: true,
                totalAmount: true,
                customerPhone: true,
                items: true,
                createdAt: true
            }
        });
        const nonCancelled = allOrders.filter((o)=>o.status !== 'CANCELLED');
        const cancelled = allOrders.filter((o)=>o.status === 'CANCELLED');
        const totalSales = nonCancelled.reduce((s, o)=>s + o.totalAmount, 0);
        const totalOrders = nonCancelled.length;
        const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;
        const uniqueCustomers = new Set(nonCancelled.map((o)=>o.customerPhone).filter(Boolean)).size;
        // Top items
        const itemCounts = {};
        for (const order of nonCancelled){
            const items = order.items;
            if (Array.isArray(items)) {
                for (const item of items){
                    if (item.name) {
                        itemCounts[item.name] = (itemCounts[item.name] ?? 0) + (item.quantity ?? 1);
                    }
                }
            }
        }
        const topItems = Object.entries(itemCounts).map(([name, quantity])=>({
                name,
                quantity
            })).sort((a, b)=>b.quantity - a.quantity).slice(0, 10);
        // Sales by hour
        const byHour = {};
        for (const order of nonCancelled){
            const h = new Date(order.createdAt).getHours();
            if (!byHour[h]) byHour[h] = {
                orders: 0,
                revenue: 0
            };
            byHour[h].orders += 1;
            byHour[h].revenue += order.totalAmount;
        }
        const salesByHour = Array.from({
            length: 24
        }, (_, hour)=>({
                hour,
                orders: byHour[hour]?.orders ?? 0,
                revenue: byHour[hour]?.revenue ?? 0
            }));
        // Sales by day
        const byDay = {};
        for (const order of nonCancelled){
            const d = order.createdAt.toISOString().split('T')[0];
            if (!byDay[d]) byDay[d] = {
                orders: 0,
                revenue: 0
            };
            byDay[d].orders += 1;
            byDay[d].revenue += order.totalAmount;
        }
        const salesByDay = Object.entries(byDay).map(([date, data])=>({
                date,
                ...data
            })).sort((a, b)=>a.date.localeCompare(b.date));
        // Previous period (same duration)
        const periodMs = end.getTime() - start.getTime() + 1;
        const prevEnd = new Date(start.getTime() - 1);
        const prevStart = new Date(start.getTime() - periodMs);
        const prevOrders = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].ifoodOrder.findMany({
            where: {
                userId: user.id,
                merchantId: merchantFilter,
                isTest: false,
                status: {
                    not: 'CANCELLED'
                },
                createdAt: {
                    gte: prevStart,
                    lte: prevEnd
                }
            },
            select: {
                totalAmount: true,
                customerPhone: true
            }
        });
        const prevTotalSales = prevOrders.reduce((s, o)=>s + o.totalAmount, 0);
        const prevTotalOrders = prevOrders.length;
        const prevAverageTicket = prevTotalOrders > 0 ? prevTotalSales / prevTotalOrders : 0;
        const prevUniqueCustomers = new Set(prevOrders.map((o)=>o.customerPhone).filter(Boolean)).size;
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            totalSales,
            totalOrders,
            averageTicket,
            uniqueCustomers,
            cancelledOrders: cancelled.length,
            topItems,
            salesByHour,
            salesByDay,
            prevTotalSales,
            prevTotalOrders,
            prevAverageTicket,
            prevUniqueCustomers
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro interno';
        console.error('[GET ifood/dashboard/summary]', message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
function buildEmptySummary() {
    return {
        totalSales: 0,
        totalOrders: 0,
        averageTicket: 0,
        uniqueCustomers: 0,
        cancelledOrders: 0,
        topItems: [],
        salesByHour: Array.from({
            length: 24
        }, (_, hour)=>({
                hour,
                orders: 0,
                revenue: 0
            })),
        salesByDay: [],
        prevTotalSales: 0,
        prevTotalOrders: 0,
        prevAverageTicket: 0,
        prevUniqueCustomers: 0
    };
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__13fd61fa._.js.map