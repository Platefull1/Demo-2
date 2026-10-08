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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/drin-platform/src/lib/ifood-token.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getValidIfoodToken",
    ()=>getValidIfoodToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/db.ts [app-route] (ecmascript)");
;
;
const ALGORITHM = 'aes-256-cbc';
const BUFFER_MS = 5 * 60 * 1000; // renova 5 min antes de expirar
function getDerivedKey() {
    const secret = process.env.ADMIN_JWT_SECRET ?? process.env.ADMIN_SECRET ?? 'ifood-fallback-key-change-in-prod';
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash('sha256').update(secret).digest();
}
function encrypt(text) {
    const iv = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(16);
    const cipher = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createCipheriv(ALGORITHM, getDerivedKey(), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}
function decrypt(encryptedText) {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createDecipheriv(ALGORITHM, getDerivedKey(), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
async function fetchNewToken() {
    const clientId = process.env.IFOOD_CLIENT_ID;
    const clientSecret = process.env.IFOOD_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        throw new Error('IFOOD_CLIENT_ID e IFOOD_CLIENT_SECRET não configurados');
    }
    const params = new URLSearchParams({
        grantType: 'client_credentials',
        clientId,
        clientSecret
    });
    const res = await fetch('https://merchant-api.ifood.com.br/authentication/v1.0/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Falha ao autenticar com iFood: ${res.status} — ${body}`);
    }
    const data = await res.json();
    return {
        token: data.accessToken,
        expiresAt: new Date(Date.now() + data.expiresIn * 1000)
    };
}
async function getValidIfoodToken(forceRefresh = false) {
    if (!forceRefresh) {
        const minExpiry = new Date(Date.now() + BUFFER_MS);
        const stored = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].ifoodToken.findFirst({
            where: {
                expiresAt: {
                    gt: minExpiry
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (stored) {
            return decrypt(stored.accessToken);
        }
    } else {
        // Invalida tokens em cache antes de renovar
        await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].ifoodToken.deleteMany({});
    }
    const { token, expiresAt } = await fetchNewToken();
    await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].ifoodToken.deleteMany({});
    await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].ifoodToken.create({
        data: {
            accessToken: encrypt(token),
            expiresAt
        }
    });
    return token;
}
}),
"[project]/drin-platform/app/api/ifood/merchants/status-all/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ifood$2d$token$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/ifood-token.ts [app-route] (ecmascript)");
const dynamic = 'force-dynamic';
;
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
async function GET() {
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
        const connections = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].ifoodConnection.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'asc'
            },
            select: {
                id: true,
                merchantId: true,
                merchantName: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (connections.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                connections: []
            });
        }
        // Fetch iFood status for all merchants in parallel (best-effort)
        let token = null;
        try {
            token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ifood$2d$token$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getValidIfoodToken"])();
        } catch  {
            // Return connections without live status if token unavailable
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                connections: connections.map((c)=>({
                        ...c,
                        ifoodStatus: null
                    }))
            });
        }
        const statuses = await Promise.allSettled(connections.map(async (conn)=>{
            const res = await fetch(`https://merchant-api.ifood.com.br/merchant/v1.0/merchants/${conn.merchantId}/status`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                signal: AbortSignal.timeout(6000)
            });
            if (!res.ok) return {
                id: conn.id,
                ifoodStatus: null
            };
            const data = await res.json();
            return {
                id: conn.id,
                ifoodStatus: data.value ?? null
            };
        }));
        const statusMap = {};
        for (const result of statuses){
            if (result.status === 'fulfilled') {
                statusMap[result.value.id] = result.value.ifoodStatus;
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            connections: connections.map((c)=>({
                    ...c,
                    ifoodStatus: statusMap[c.id] ?? null
                }))
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro interno';
        console.error('[GET ifood/merchants/status-all]', message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e59eeca6._.js.map