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
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const prisma = global.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
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
if ("TURBOPACK compile-time truthy", 1) {
    global.prisma = prisma;
}
// Graceful shutdown - desconectar quando o processo terminar
if ("TURBOPACK compile-time truthy", 1) {
    process.on('beforeExit', async ()=>{
        await prisma.$disconnect();
    });
}
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
"[project]/Demo-2/src/stack.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stackServerApp",
    ()=>stackServerApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2f$apps$2f$interfaces$2f$server$2d$app$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@stackframe/stack/dist/esm/lib/stack-app/apps/interfaces/server-app.js [app-route] (ecmascript)");
;
const stackServerApp = new __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2f$apps$2f$interfaces$2f$server$2d$app$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StackServerApp"]({
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
"[project]/Demo-2/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Demo-2/src/lib/stack-auth-sync.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUserByStackId",
    ()=>getUserByStackId,
    "syncStackAuthUser",
    ()=>syncStackAuthUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/db.ts [app-route] (ecmascript)");
;
// ---------------------------------------------------------------------------
// Cache em memória para syncStackAuthUser
// Evita 4-6 queries por requisição em rotas autenticadas (>60 rotas)
// ---------------------------------------------------------------------------
const _syncCache = new Map();
const _SYNC_CACHE_TTL_MS = 60_000; // 60 segundos
/**
 * Sincroniza usuário do Stack Auth com o banco de dados local
 * Cria o usuário se não existir, atualiza se já existir
 */ async function _syncStackAuthUserImpl(stackUser) {
    try {
        console.log('🔄 Sincronizando usuário Stack Auth:', {
            id: stackUser.id,
            email: stackUser.primaryEmail
        });
        if (!stackUser.primaryEmail) {
            throw new Error('Email do usuário não está disponível');
        }
        // Verificar se o StackUser já existe
        console.log('📊 Buscando StackUser no banco...');
        // Garantir que a conexão está ativa
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureConnection"])();
        let dbStackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.findUnique({
            where: {
                id: stackUser.id
            },
            include: {
                user: true
            }
        }).catch((error)=>{
            console.error('❌ Erro ao buscar StackUser:', error);
            const errorMsg = error instanceof Error ? error.message : String(error);
            // Detectar erros específicos
            if (errorMsg.includes('closed the connection') || errorMsg.includes('connection closed')) {
                throw new Error(`Erro ao acessar banco de dados: Conexão foi fechada. Possível causa: tabelas não criadas ou conexão perdida. Execute: GET /api/admin/sync-database?secret=YOUR_ADMIN_SECRET`);
            }
            if (errorMsg.includes('does not exist') || errorMsg.includes('relation') || errorMsg.includes('table')) {
                throw new Error(`Erro ao acessar banco de dados: Tabelas não foram criadas. Execute: GET /api/admin/sync-database?secret=YOUR_ADMIN_SECRET`);
            }
            throw new Error(`Erro ao acessar banco de dados: ${errorMsg}. Possível causa: tabelas não criadas. Execute: GET /api/admin/sync-database?secret=YOUR_ADMIN_SECRET`);
        });
        // Se não existe, criar novo
        if (!dbStackUser) {
            console.log('➕ Criando novo StackUser...');
            dbStackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.create({
                data: {
                    id: stackUser.id,
                    primaryEmail: stackUser.primaryEmail,
                    displayName: stackUser.displayName || '',
                    profileImageUrl: stackUser.profileImageUrl,
                    primaryEmailVerified: stackUser.primaryEmailVerified,
                    lastActiveAt: new Date()
                },
                include: {
                    user: true
                }
            }).catch((error)=>{
                console.error('❌ Erro ao criar StackUser:', error);
                throw new Error(`Erro ao criar usuário: ${error.message}`);
            });
            console.log('✅ StackUser criado:', dbStackUser.id);
        } else {
            console.log('✅ StackUser encontrado:', dbStackUser.id);
            // Atualizar dados do StackUser
            dbStackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.update({
                where: {
                    id: stackUser.id
                },
                data: {
                    primaryEmail: stackUser.primaryEmail,
                    displayName: stackUser.displayName || dbStackUser.displayName,
                    profileImageUrl: stackUser.profileImageUrl || dbStackUser.profileImageUrl,
                    primaryEmailVerified: stackUser.primaryEmailVerified || dbStackUser.primaryEmailVerified,
                    lastActiveAt: new Date()
                },
                include: {
                    user: true
                }
            });
        }
        // Se o StackUser já tem um User associado, retornar
        if (dbStackUser.user) {
            return dbStackUser.user;
        }
        // Buscar se já existe um User com esse email
        const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
            where: {
                email: stackUser.primaryEmail
            }
        });
        if (existingUser) {
            // Associar StackUser existente ao User existente
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    stackUserId: dbStackUser.id,
                    fullName: stackUser.displayName || existingUser.fullName
                }
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.update({
                where: {
                    id: dbStackUser.id
                },
                data: {
                    userId: existingUser.id
                }
            });
            return existingUser;
        }
        // Criar novo User baseado nos dados do Stack Auth
        const newUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.create({
            data: {
                email: stackUser.primaryEmail,
                username: generateUsernameFromEmail(stackUser.primaryEmail),
                fullName: stackUser.displayName || '',
                password: null,
                isAdmin: false,
                stackUserId: dbStackUser.id
            }
        });
        // Atualizar StackUser com referência ao User
        await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.update({
            where: {
                id: dbStackUser.id
            },
            data: {
                userId: newUser.id
            }
        });
        return newUser;
    } catch (error) {
        console.error('Erro ao sincronizar usuário do Stack Auth:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        // Re-throw se já for um erro tratado
        if (errorMessage.includes('Erro ao acessar banco de dados') || errorMessage.includes('Erro ao conectar ao banco')) {
            throw error;
        }
        if (errorMessage.includes('DATABASE_URL') || errorMessage.includes('Environment variable not found')) {
            throw new Error('Variável de ambiente DATABASE_URL não configurada. Configure-a nas variáveis de ambiente da Vercel.');
        }
        if (errorMessage.includes('does not exist') || errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
            throw new Error('Tabelas do banco de dados não foram criadas. Execute: GET /api/admin/sync-database?secret=YOUR_ADMIN_SECRET');
        }
        if (errorMessage.includes('closed the connection') || errorMessage.includes('connection closed')) {
            throw new Error('Conexão com o banco de dados foi fechada. Possível causa: tabelas não criadas ou conexão perdida. Execute: GET /api/admin/sync-database?secret=YOUR_ADMIN_SECRET');
        }
        throw error;
    }
}
async function syncStackAuthUser(stackUser) {
    const now = Date.now();
    const hit = _syncCache.get(stackUser.id);
    if (hit && now - hit.cachedAt < _SYNC_CACHE_TTL_MS && hit.primaryEmail === stackUser.primaryEmail && (hit.displayName ?? null) === (stackUser.displayName ?? null) && (hit.profileImageUrl ?? null) === (stackUser.profileImageUrl ?? null)) {
        return hit.result;
    }
    const result = await _syncStackAuthUserImpl(stackUser);
    _syncCache.set(stackUser.id, {
        result,
        cachedAt: Date.now(),
        primaryEmail: stackUser.primaryEmail,
        displayName: stackUser.displayName,
        profileImageUrl: stackUser.profileImageUrl
    });
    return result;
}
/**
 * Gera um username único a partir do email
 */ function generateUsernameFromEmail(email) {
    const baseUsername = email.split('@')[0].toLowerCase();
    const timestamp = Date.now().toString(36);
    return `${baseUsername}_${timestamp}`;
}
async function getUserByStackId(stackUserId) {
    try {
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.findUnique({
            where: {
                id: stackUserId
            },
            include: {
                user: true
            }
        });
        return stackUser?.user || null;
    } catch (error) {
        console.error('Erro ao buscar usuário por Stack ID:', error);
        return null;
    }
}
}),
"[project]/Demo-2/src/lib/rh-auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRhContext",
    ()=>getRhContext,
    "requireRhPermission",
    ()=>requireRhPermission,
    "rhGetUser",
    ()=>rhGetUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/stack.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/stack-auth-sync.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
;
async function rhGetUser() {
    const ctx = await getRhContext();
    if (!ctx) return null;
    return {
        userId: ctx.userId,
        isAdmin: ctx.isAdmin
    };
}
async function getRhContext() {
    const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
        or: 'return-null'
    });
    if (!stackUser) return null;
    const dbUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["syncStackAuthUser"])({
        id: stackUser.id,
        primaryEmail: stackUser.primaryEmail || undefined,
        displayName: stackUser.displayName || undefined,
        profileImageUrl: stackUser.profileImageUrl || undefined,
        primaryEmailVerified: stackUser.primaryEmailVerified ? new Date() : null
    });
    if (!dbUser) return null;
    // Dono de equipe RH: prioriza os próprios dados (evita sumir relatórios/grupos
    // quando o admin também está cadastrado como membro ou tem convite cruzado).
    const ownsTeam = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.count({
        where: {
            tenantUserId: dbUser.id,
            isActive: true
        }
    }) > 0;
    if (ownsTeam) {
        return {
            userId: dbUser.id,
            stackUserId: stackUser.id,
            isAdmin: true,
            memberId: null,
            hasPermission: ()=>true
        };
    }
    // Membro ativo de outro tenant (não o próprio dono)
    const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
        where: {
            stackUserId: stackUser.id,
            isActive: true
        },
        include: {
            permissions: true
        }
    });
    if (membership && membership.tenantUserId !== dbUser.id) {
        const permsSet = new Set(membership.permissions.map((p)=>p.permission));
        return {
            userId: membership.tenantUserId,
            stackUserId: stackUser.id,
            isAdmin: false,
            memberId: membership.id,
            hasPermission: (p)=>permsSet.has(p)
        };
    }
    // Convite pendente por e-mail — só vincula a outro tenant
    if (stackUser.primaryEmail) {
        const pendingMembership = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
            where: {
                email: stackUser.primaryEmail.toLowerCase(),
                stackUserId: null,
                isActive: true,
                NOT: {
                    tenantUserId: dbUser.id
                }
            },
            include: {
                permissions: true
            }
        });
        if (pendingMembership) {
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.update({
                where: {
                    id: pendingMembership.id
                },
                data: {
                    stackUserId: stackUser.id,
                    displayName: stackUser.displayName ?? undefined
                },
                include: {
                    permissions: true
                }
            });
            const permsSet = new Set(updated.permissions.map((p)=>p.permission));
            return {
                userId: updated.tenantUserId,
                stackUserId: stackUser.id,
                isAdmin: false,
                memberId: updated.id,
                hasPermission: (p)=>permsSet.has(p)
            };
        }
    }
    return {
        userId: dbUser.id,
        stackUserId: stackUser.id,
        isAdmin: true,
        memberId: null,
        hasPermission: ()=>true
    };
}
async function requireRhPermission(permission) {
    let ctx;
    try {
        ctx = await getRhContext();
    } catch (err) {
        console.error('[rh-auth] getRhContext error:', err);
        return {
            ctx: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Erro interno ao verificar autenticação',
                details: String(err)
            }, {
                status: 500
            })
        };
    }
    if (!ctx) {
        return {
            ctx: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sessão expirada. Por favor, faça login novamente.',
                code: 'UNAUTHENTICATED'
            }, {
                status: 401
            })
        };
    }
    if (permission && !ctx.hasPermission(permission)) {
        return {
            ctx: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sem permissão para esta ação'
            }, {
                status: 403
            })
        };
    }
    return {
        ctx,
        error: null
    };
}
}),
"[project]/Demo-2/src/lib/auth/toolPermissions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkToolPermission",
    ()=>checkToolPermission,
    "checkUserToolPermission",
    ()=>checkUserToolPermission,
    "requireToolPermission",
    ()=>requireToolPermission
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/stack.ts [app-route] (ecmascript)");
;
;
;
async function checkToolPermission(stackUserId, tool) {
    try {
        if (!stackUserId) {
            return false;
        }
        // Buscar StackUser com permissões
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stackUser.findUnique({
            where: {
                id: stackUserId
            },
            include: {
                toolPermissions: true
            }
        });
        if (!stackUser) {
            return false;
        }
        // Verificar se o usuário está ativo
        if (!stackUser.isActive) {
            return false;
        }
        // Verificar se a ferramenta está habilitada para este usuário
        const permission = stackUser.toolPermissions.find((p)=>p.tool === tool && p.isEnabled === true);
        return !!permission;
    } catch (error) {
        console.error('Erro ao verificar permissão de ferramenta:', error);
        return false;
    }
}
async function requireToolPermission(tool) {
    try {
        // Obter usuário do Stack Auth
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
            or: 'return-null'
        });
        if (!stackUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autenticado',
                message: 'Você precisa estar logado para acessar esta ferramenta'
            }, {
                status: 401
            });
        }
        // Verificar permissão
        const hasPermission = await checkToolPermission(stackUser.id, tool);
        if (!hasPermission) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Acesso negado',
                message: `Você não tem permissão para acessar a ferramenta: ${tool}. Entre em contato com o administrador.`
            }, {
                status: 403
            });
        }
        return null;
    } catch (error) {
        console.error('Erro ao verificar permissão de ferramenta:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro ao verificar permissão',
            message: 'Ocorreu um erro ao verificar suas permissões'
        }, {
            status: 500
        });
    }
}
async function checkUserToolPermission(stackUserId, tool) {
    try {
        const permission = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userToolPermission.findUnique({
            where: {
                stackUserId_tool: {
                    stackUserId,
                    tool
                }
            }
        });
        return permission?.isEnabled === true;
    } catch (error) {
        console.error('Erro ao verificar permissão de ferramenta do usuário:', error);
        return false;
    }
}
}),
"[project]/Demo-2/src/types/admin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Permission",
    ()=>Permission,
    "SystemTool",
    ()=>SystemTool,
    "UserRole",
    ()=>UserRole
]);
var UserRole = /*#__PURE__*/ function(UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
    return UserRole;
}({});
var Permission = /*#__PURE__*/ function(Permission) {
    // Usuários
    Permission["VIEW_USERS"] = "view_users";
    Permission["CREATE_USERS"] = "create_users";
    Permission["EDIT_USERS"] = "edit_users";
    Permission["DELETE_USERS"] = "delete_users";
    Permission["RESET_PASSWORDS"] = "reset_passwords";
    // Ferramentas/Módulos
    Permission["ACCESS_LABEL"] = "access_label";
    Permission["ACCESS_CMV"] = "access_cmv";
    Permission["ACCESS_ANALYTICS"] = "access_analytics";
    // Admin
    Permission["VIEW_LOGS"] = "view_logs";
    Permission["MANAGE_CLIENTS"] = "manage_clients";
    Permission["SYSTEM_SETTINGS"] = "system_settings";
    return Permission;
}({});
var SystemTool = /*#__PURE__*/ function(SystemTool) {
    SystemTool["PRODUTOS"] = "produtos";
    SystemTool["ETIQUETAGEM"] = "etiquetagem";
    SystemTool["CHECKLIST"] = "checklist";
    SystemTool["WHATSAPP_CHAT"] = "whatsapp_chat";
    SystemTool["CONEXOES"] = "conexoes";
    SystemTool["AGENDAMENTO_RELATORIOS"] = "agendamento_relatorios";
    SystemTool["CMV"] = "cmv";
    SystemTool["ANALYTICS"] = "analytics";
    SystemTool["ESTOQUE"] = "estoque";
    SystemTool["IFOOD"] = "ifood";
    SystemTool["RH"] = "rh";
    SystemTool["TAREFAS"] = "tarefas";
    SystemTool["BONIFICACAO"] = "bonificacao";
    SystemTool["CHAT"] = "chat";
    SystemTool["PONTOS"] = "pontos";
    return SystemTool;
}({});
}),
"[project]/Demo-2/src/lib/bonificacao-auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getBonificacaoAuth",
    ()=>getBonificacaoAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$auth$2f$toolPermissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/auth/toolPermissions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/types/admin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/stack.ts [app-route] (ecmascript)");
;
;
;
;
async function getBonificacaoAuth() {
    const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
        or: 'return-null'
    });
    if (!stackUser) return null;
    const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRhContext"])();
    if (!ctx) return null;
    const [hasRh, hasLegacyBonif] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$auth$2f$toolPermissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkToolPermission"])(stackUser.id, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"].RH),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$auth$2f$toolPermissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkToolPermission"])(stackUser.id, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"].BONIFICACAO)
    ]);
    // Membro ativo de equipe RH (mesmo sem flag SystemTool.RH no admin)
    const isRhTeamMember = ctx.memberId != null;
    if (!hasRh && !hasLegacyBonif && !isRhTeamMember) return null;
    return ctx;
}
}),
"[project]/Demo-2/src/lib/bonificacao-defaults.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_DESCONTOS",
    ()=>DEFAULT_DESCONTOS,
    "DEFAULT_FAIXAS",
    ()=>DEFAULT_FAIXAS,
    "DEFAULT_METRICAS",
    ()=>DEFAULT_METRICAS,
    "FAIXA_PONTOS_RATIOS",
    ()=>FAIXA_PONTOS_RATIOS,
    "defaultTipoPayload",
    ()=>defaultTipoPayload,
    "getFaixaFromDados",
    ()=>getFaixaFromDados,
    "isTipoCoordenador",
    ()=>isTipoCoordenador,
    "maxPontosTrimestre",
    ()=>maxPontosTrimestre,
    "normalizeFaixas",
    ()=>normalizeFaixas,
    "resolveFaixasFromDados",
    ()=>resolveFaixasFromDados,
    "resolveModoCalculo",
    ()=>resolveModoCalculo,
    "snapshotFromTipo",
    ()=>snapshotFromTipo,
    "suggestFaixas",
    ()=>suggestFaixas,
    "suggestFaixasPontos",
    ()=>suggestFaixasPontos,
    "sumMetricasMaxPontos",
    ()=>sumMetricasMaxPontos,
    "valorBonificacaoCoordenador",
    ()=>valorBonificacaoCoordenador
]);
const FAIXA_PONTOS_RATIOS = [
    200 / 870,
    400 / 870,
    600 / 870,
    750 / 870,
    1
];
const DEFAULT_FAIXAS = [
    {
        faixa: 1,
        pontosMin: 200,
        valorGerente: 450,
        valorFuncionario: 100
    },
    {
        faixa: 2,
        pontosMin: 400,
        valorGerente: 750,
        valorFuncionario: 200
    },
    {
        faixa: 3,
        pontosMin: 600,
        valorGerente: 1050,
        valorFuncionario: 300
    },
    {
        faixa: 4,
        pontosMin: 750,
        valorGerente: 1350,
        valorFuncionario: 400
    },
    {
        faixa: 5,
        pontosMin: 870,
        valorGerente: 1600,
        valorFuncionario: 500
    }
];
const DEFAULT_METRICAS = [
    {
        id: 'meta',
        nome: 'Meta',
        maxPontos: 40
    },
    {
        id: 'cmv',
        nome: 'CMV (30%, 5%)',
        maxPontos: 40
    },
    {
        id: 'ifood',
        nome: 'iFood (+4.8)',
        maxPontos: 30
    },
    {
        id: 'cancelamentos',
        nome: 'Cancelamentos (<0,5%)',
        maxPontos: 30
    },
    {
        id: 'chargeback',
        nome: 'Chargeback (<0,1%)',
        maxPontos: 30
    },
    {
        id: 'motoristas',
        nome: 'Motoristas (1p a 1%)',
        maxPontos: 30
    },
    {
        id: 'mao_de_obra',
        nome: 'Mão de Obra (<5%)',
        maxPontos: 30
    },
    {
        id: 'google_nota',
        nome: 'Google Nota 1 (Max 4)',
        maxPontos: 30
    },
    {
        id: 'turnover',
        nome: 'Turnover',
        maxPontos: 30
    }
];
const DEFAULT_DESCONTOS = [
    {
        id: 'lancamento_bnus',
        nome: 'Lançamentos de boys',
        valor: 20
    },
    {
        id: 'escala',
        nome: 'Escala',
        valor: 20
    },
    {
        id: 'transferencias',
        nome: 'Transferências',
        valor: 20
    },
    {
        id: 'contagem',
        nome: 'Contagem',
        valor: 20
    },
    {
        id: 'caixa_atrasado',
        nome: 'Caixa atrasado',
        valor: 20
    }
];
function sumMetricasMaxPontos(metricas) {
    return metricas.reduce((sum, m)=>sum + (Number(m.maxPontos) || 0), 0);
}
function maxPontosTrimestre(metricas) {
    return sumMetricasMaxPontos(metricas) * 3;
}
function isTipoCoordenador(nome) {
    return nome.trim().toLowerCase().includes('coordenador');
}
function suggestFaixasPontos(totalTrimestre) {
    if (totalTrimestre <= 0) return [
        0,
        0,
        0,
        0,
        0
    ];
    return FAIXA_PONTOS_RATIOS.map((ratio, index)=>index === FAIXA_PONTOS_RATIOS.length - 1 ? totalTrimestre : Math.round(totalTrimestre * ratio));
}
function suggestFaixas(metricas, isCoordenador, existingFaixas) {
    const pontosSugeridos = suggestFaixasPontos(maxPontosTrimestre(metricas));
    return pontosSugeridos.map((pontosMin, index)=>{
        const existing = existingFaixas?.[index];
        const fallback = DEFAULT_FAIXAS[index];
        if (isCoordenador) {
            return {
                faixa: index + 1,
                pontosMin,
                valorGerente: 0,
                valorFuncionario: 0,
                valorCoordenador: existing?.valorCoordenador ?? existing?.valorGerente ?? fallback?.valorGerente ?? 0
            };
        }
        return {
            faixa: index + 1,
            pontosMin,
            valorGerente: existing?.valorGerente ?? fallback?.valorGerente ?? 0,
            valorFuncionario: existing?.valorFuncionario ?? fallback?.valorFuncionario ?? 0
        };
    });
}
function valorBonificacaoCoordenador(faixa) {
    return faixa.valorCoordenador ?? faixa.valorGerente ?? 0;
}
function defaultTipoPayload(modoCalculo = 'PADRAO') {
    return {
        modoCalculo,
        metricas: DEFAULT_METRICAS,
        descontos: DEFAULT_DESCONTOS,
        faixas: suggestFaixas(DEFAULT_METRICAS, false)
    };
}
function snapshotFromTipo(tipo, existing) {
    const existingMetricas = existing?.metricas ?? [];
    const existingDescontos = existing?.descontos ?? [];
    const metricasRaw = Array.isArray(tipo.metricas) ? tipo.metricas : [];
    const descontosRaw = Array.isArray(tipo.descontos) ? tipo.descontos : [];
    const metricas = metricasRaw.map((m)=>{
        const prev = existingMetricas.find((e)=>e.id === m.id);
        const pontos = {
            ...prev?.pontos ?? {}
        };
        // Se maxPontos mudou, remapeia células "Feito" (valor = max antigo) para o novo max
        if (prev && prev.maxPontos !== m.maxPontos) {
            for (const [k, v] of Object.entries(pontos)){
                if (v === prev.maxPontos) pontos[k] = m.maxPontos;
            }
        }
        return {
            id: m.id,
            nome: m.nome,
            maxPontos: m.maxPontos,
            pontos
        };
    });
    const descontos = descontosRaw.map((d)=>{
        const prev = existingDescontos.find((e)=>e.id === d.id);
        return {
            id: d.id,
            nome: d.nome,
            valor: prev?.valor ?? 0,
            pontos: d.valor
        };
    });
    const faixas = normalizeFaixas(tipo.faixas);
    return {
        modoCalculo: tipo.modoCalculo === 'MEDIA' ? 'MEDIA' : 'PADRAO',
        metricas,
        descontos,
        descontoReais: existing?.descontoReais ?? {
            valor: 0,
            observacao: ''
        },
        fechado: existing?.fechado ?? false,
        faixas
    };
}
function normalizeFaixas(faixas) {
    if (!Array.isArray(faixas) || faixas.length === 0) return DEFAULT_FAIXAS;
    return faixas.map((f, i)=>{
        const row = f;
        return {
            faixa: Number(row.faixa ?? i + 1),
            pontosMin: Number(row.pontosMin ?? row.pontos ?? 0),
            valorGerente: Number(row.valorGerente ?? row.gerente ?? 0),
            valorFuncionario: Number(row.valorFuncionario ?? row.funcionario ?? 0),
            valorCoordenador: row.valorCoordenador != null ? Number(row.valorCoordenador) : undefined
        };
    });
}
function getFaixaFromDados(totalLiquido, faixas) {
    const sorted = [
        ...faixas
    ].sort((a, b)=>a.pontosMin - b.pontosMin);
    let current = null;
    for (const f of sorted){
        if (totalLiquido >= f.pontosMin) current = f;
    }
    return current;
}
function resolveModoCalculo(dados) {
    const d = dados;
    return d?.modoCalculo === 'MEDIA' ? 'MEDIA' : 'PADRAO';
}
function resolveFaixasFromDados(dados) {
    const d = dados;
    return normalizeFaixas(d?.faixas);
}
}),
"[project]/Demo-2/app/api/bonificacao/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$bonificacao$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/bonificacao-auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$bonificacao$2d$defaults$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/bonificacao-defaults.ts [app-route] (ecmascript)");
const dynamic = 'force-dynamic';
;
;
;
;
async function GET(req) {
    const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$bonificacao$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBonificacaoAuth"])();
    if (!ctx) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Não autorizado'
    }, {
        status: 401
    });
    const { searchParams } = req.nextUrl;
    const ano = searchParams.get('ano') ? Number(searchParams.get('ano')) : undefined;
    const trimestre = searchParams.get('trimestre') ? Number(searchParams.get('trimestre')) : undefined;
    const lojaId = searchParams.get('lojaId') ?? undefined;
    const tipoAvaliacaoId = searchParams.get('tipoAvaliacaoId') ?? undefined;
    const items = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].bonificacaoTrimestre.findMany({
        where: {
            userId: ctx.userId,
            ...ano ? {
                ano
            } : {},
            ...trimestre ? {
                trimestre
            } : {},
            ...lojaId ? {
                lojaId
            } : {},
            ...tipoAvaliacaoId ? {
                tipoAvaliacaoId
            } : {}
        },
        include: {
            tipoAvaliacao: {
                select: {
                    nome: true,
                    modoCalculo: true,
                    lojaId: true,
                    entraNaMedia: true
                }
            }
        },
        orderBy: [
            {
                ano: 'desc'
            },
            {
                trimestre: 'desc'
            },
            {
                lojaNome: 'asc'
            }
        ]
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(items);
}
async function POST(req) {
    const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$bonificacao$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBonificacaoAuth"])();
    if (!ctx) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Não autorizado'
    }, {
        status: 401
    });
    const body = await req.json().catch(()=>({}));
    const { lojaId, lojaNome, ano, trimestre, tipoAvaliacaoId } = body;
    if (!lojaNome?.trim()) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'lojaNome obrigatório'
    }, {
        status: 400
    });
    if (!ano || !trimestre) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'ano e trimestre obrigatórios'
    }, {
        status: 400
    });
    if (trimestre < 1 || trimestre > 4) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'trimestre inválido (1-4)'
    }, {
        status: 400
    });
    if (!tipoAvaliacaoId) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'tipoAvaliacaoId obrigatório'
    }, {
        status: 400
    });
    const tipo = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].tipoAvaliacao.findFirst({
        where: {
            id: tipoAvaliacaoId,
            userId: ctx.userId
        }
    });
    if (!tipo) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Tipo de avaliação não encontrado'
    }, {
        status: 404
    });
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].bonificacaoTrimestre.findUnique({
        where: {
            userId_lojaNome_ano_trimestre_tipoAvaliacaoId: {
                userId: ctx.userId,
                lojaNome: lojaNome.trim(),
                ano,
                trimestre,
                tipoAvaliacaoId
            }
        }
    });
    if (existing) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(existing);
    const item = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].bonificacaoTrimestre.create({
        data: {
            userId: ctx.userId,
            lojaId: lojaId ?? null,
            lojaNome: lojaNome.trim(),
            tipoAvaliacaoId,
            ano,
            trimestre,
            dados: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$bonificacao$2d$defaults$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["snapshotFromTipo"])(tipo)
        }
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(item, {
        status: 201
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__313abccf._.js.map