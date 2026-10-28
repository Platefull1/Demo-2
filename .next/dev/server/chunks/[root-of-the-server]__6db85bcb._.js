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
"[project]/Demo-2/src/lib/whatsapp-sessions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "findWhatsAppBotForTenant",
    ()=>findWhatsAppBotForTenant,
    "getTenantStackUserId",
    ()=>getTenantStackUserId,
    "listSessionsForActor",
    ()=>listSessionsForActor,
    "listSessionsForStackUser",
    ()=>listSessionsForStackUser,
    "listSessionsForTenant",
    ()=>listSessionsForTenant,
    "mapBotToDto",
    ()=>mapBotToDto,
    "nextAvailableSlot",
    ()=>nextAvailableSlot,
    "realPhoneNumber",
    ()=>realPhoneNumber,
    "resolveStackUserIdsForTenant",
    ()=>resolveStackUserIdsForTenant
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
;
function realPhoneNumber(raw) {
    if (!raw) return null;
    const digits = String(raw).replace(/\D/g, '');
    return digits.length >= 8 ? digits : null;
}
function mapBotToDto(bot) {
    const qrCode = bot.qrCode ?? null;
    const isConnected = Boolean(bot.isConnected);
    let status = 'DISCONNECTED';
    if (isConnected) status = 'CONNECTED';
    else if (qrCode) status = 'QRCODE';
    else status = 'CONNECTING';
    return {
        slot: bot.slot,
        label: bot.label && bot.label.trim() || `Sessão ${bot.slot}`,
        status,
        isConnected,
        isActive: isConnected || Boolean(qrCode),
        connectedNumber: realPhoneNumber(bot.connectedNumber),
        qrCode,
        iaAtiva: bot.iaAtiva === true,
        iaPrompt: bot.iaPrompt ?? null,
        monitorarReclamacoes: bot.monitorarReclamacoes === true,
        updatedAt: bot.updatedAt.toISOString()
    };
}
async function listSessionsForStackUser(stackUserId) {
    const bots = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].whatsAppBot.findMany({
        where: {
            userId: stackUserId
        },
        orderBy: {
            slot: 'asc'
        }
    });
    return bots.map(mapBotToDto);
}
async function resolveStackUserIdsForTenant(tenantUserId) {
    const ids = new Set();
    if (!tenantUserId) return [];
    const asStack = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stackUser.findUnique({
        where: {
            id: tenantUserId
        },
        select: {
            id: true
        }
    });
    if (asStack) ids.add(asStack.id);
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            id: tenantUserId
        },
        select: {
            stackUserId: true,
            email: true
        }
    });
    if (user?.stackUserId) ids.add(user.stackUserId);
    const linked = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stackUser.findMany({
        where: {
            userId: tenantUserId
        },
        select: {
            id: true
        }
    });
    for (const row of linked)ids.add(row.id);
    if (user?.email) {
        const byEmail = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stackUser.findMany({
            where: {
                primaryEmail: {
                    equals: user.email,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true
            }
        });
        for (const row of byEmail)ids.add(row.id);
    }
    // Contas da equipe: WhatsApp pode estar conectado em qualquer membro
    const members = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findMany({
        where: {
            tenantUserId,
            isActive: true,
            stackUserId: {
                not: null
            }
        },
        select: {
            stackUserId: true
        }
    });
    for (const m of members){
        if (m.stackUserId) ids.add(m.stackUserId);
    }
    return [
        ...ids
    ];
}
async function getTenantStackUserId(tenantUserId) {
    const ids = await resolveStackUserIdsForTenant(tenantUserId);
    return ids[0] ?? null;
}
async function findWhatsAppBotForTenant(tenantUserId, slot) {
    const stackIds = await resolveStackUserIdsForTenant(tenantUserId);
    if (stackIds.length === 0) return null;
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].whatsAppBot.findFirst({
        where: {
            userId: {
                in: stackIds
            },
            slot
        },
        select: {
            userId: true,
            slot: true,
            isConnected: true,
            label: true
        }
    });
}
async function listSessionsForTenant(tenantUserId) {
    const ids = await resolveStackUserIdsForTenant(tenantUserId);
    const bySlot = new Map();
    for (const id of ids){
        const list = await listSessionsForStackUser(id);
        for (const session of list){
            // Prefere sessão já conectada se o mesmo slot existir em mais de uma conta
            const prev = bySlot.get(session.slot);
            if (!prev || !prev.isConnected && session.isConnected) {
                bySlot.set(session.slot, session);
            }
        }
    }
    return [
        ...bySlot.values()
    ].sort((a, b)=>a.slot - b.slot);
}
async function listSessionsForActor(params) {
    const ids = [
        ...new Set([
            params.stackUserId,
            ...await resolveStackUserIdsForTenant(params.tenantUserId)
        ].filter((id)=>Boolean(id)))
    ];
    const bySlot = new Map();
    for (const id of ids){
        const list = await listSessionsForStackUser(id);
        for (const session of list){
            const prev = bySlot.get(session.slot);
            if (!prev || !prev.isConnected && session.isConnected) {
                bySlot.set(session.slot, session);
            }
        }
    }
    return [
        ...bySlot.values()
    ].sort((a, b)=>a.slot - b.slot);
}
async function nextAvailableSlot(stackUserId) {
    const bots = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].whatsAppBot.findMany({
        where: {
            userId: stackUserId
        },
        select: {
            slot: true
        },
        orderBy: {
            slot: 'asc'
        }
    });
    const used = new Set(bots.map((b)=>b.slot));
    let slot = 1;
    while(used.has(slot))slot += 1;
    return slot;
}
}),
"[project]/Demo-2/src/lib/nfe/tenant.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Tenancy + acesso do CMV Real / NF-e.
 *
 * Dados: sempre no DONO do grupo (`tenantUserId`).
 * Acesso: permissões RH `cmv_real.*` + campo `lojas` do RhTeamMember.
 * Dono (isAdmin): todas as permissões e todas as lojas.
 * lojas=[] = todas — exceto perfil gerente_loja, que exige ao menos uma loja.
 *
 * WhatsApp: sessões na conta ahu; `findCmvRealWhatsAppBot` prefere o actor.
 *
 * Fase 4: EstoqueContagem de QUALQUER conta ativa do grupo, por lojaNome.
 */ __turbopack_context__.s([
    "findCmvRealWhatsAppBot",
    ()=>findCmvRealWhatsAppBot,
    "getCmvRealTenant",
    ()=>getCmvRealTenant,
    "getCmvRealTenantFromSession",
    ()=>getCmvRealTenantFromSession,
    "getCmvRealTenantFromUserId",
    ()=>getCmvRealTenantFromUserId,
    "requireCmvRealAccess",
    ()=>requireCmvRealAccess,
    "requireCmvRealTenantFromSession",
    ()=>requireCmvRealTenantFromSession,
    "resolveCmvRealStoreFilter",
    ()=>resolveCmvRealStoreFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$whatsapp$2d$sessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/whatsapp-sessions.ts [app-route] (ecmascript)");
;
;
;
;
async function memberUserIds(tenantUserId) {
    const members = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findMany({
        where: {
            tenantUserId,
            isActive: true,
            stackUserId: {
                not: null
            }
        },
        select: {
            stackUserId: true
        }
    });
    if (members.length === 0) return [
        tenantUserId
    ];
    const users = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findMany({
        where: {
            stackUserId: {
                in: members.map((m)=>m.stackUserId).filter(Boolean)
            }
        },
        select: {
            id: true
        }
    });
    return [
        ...new Set([
            tenantUserId,
            ...users.map((u)=>u.id)
        ])
    ];
}
function parsePerfil(raw) {
    if (raw === 'escritorio' || raw === 'gerente_loja') return raw;
    return null;
}
function storeScope(isAdmin, lojas, perfil) {
    if (isAdmin) return {
        allowedStoreSlugs: null,
        lojaNaoConfigurada: false
    };
    if (perfil === 'gerente_loja' && lojas.length === 0) {
        return {
            allowedStoreSlugs: [],
            lojaNaoConfigurada: true
        };
    }
    if (lojas.length === 0) return {
        allowedStoreSlugs: null,
        lojaNaoConfigurada: false
    };
    return {
        allowedStoreSlugs: lojas,
        lojaNaoConfigurada: false
    };
}
async function getCmvRealTenantFromUserId(actorUserId) {
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            id: actorUserId
        },
        select: {
            id: true,
            stackUserId: true
        }
    });
    if (!user) return null;
    const ownsTeam = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.count({
        where: {
            tenantUserId: user.id,
            isActive: true
        }
    }) > 0;
    let tenantUserId = user.id;
    let isAdmin = ownsTeam;
    let memberId = null;
    let lojas = [];
    let perfil = null;
    if (!ownsTeam && user.stackUserId) {
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
            where: {
                stackUserId: user.stackUserId,
                isActive: true
            },
            select: {
                id: true,
                tenantUserId: true,
                lojas: true,
                perfil: true
            }
        });
        if (membership) {
            tenantUserId = membership.tenantUserId;
            isAdmin = false;
            memberId = membership.id;
            lojas = membership.lojas ?? [];
            perfil = parsePerfil(membership.perfil);
        } else {
            isAdmin = true;
        }
    }
    const scope = storeScope(isAdmin, lojas, perfil);
    return {
        tenantUserId,
        actorUserId: user.id,
        isAdmin,
        userIds: await memberUserIds(tenantUserId),
        ...scope,
        perfil,
        memberId
    };
}
async function getCmvRealTenantFromSession() {
    const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRhContext"])();
    if (!ctx) return null;
    return buildTenantFromRhContext(ctx);
}
async function getCmvRealTenant() {
    return getCmvRealTenantFromSession();
}
async function buildTenantFromRhContext(ctx) {
    const actor = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findFirst({
        where: {
            stackUserId: ctx.stackUserId
        },
        select: {
            id: true
        }
    });
    let lojas = [];
    let perfil = null;
    const memberId = ctx.memberId;
    if (ctx.memberId) {
        const member = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findUnique({
            where: {
                id: ctx.memberId
            },
            select: {
                lojas: true,
                perfil: true
            }
        });
        lojas = member?.lojas ?? [];
        perfil = parsePerfil(member?.perfil);
    }
    const scope = storeScope(ctx.isAdmin, lojas, perfil);
    return {
        tenantUserId: ctx.userId,
        actorUserId: actor?.id ?? ctx.userId,
        isAdmin: ctx.isAdmin,
        userIds: await memberUserIds(ctx.userId),
        ...scope,
        perfil,
        memberId
    };
}
async function requireCmvRealTenantFromSession() {
    const t = await getCmvRealTenantFromSession();
    if (!t) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Não autenticado'
    }, {
        status: 401
    });
    return t;
}
async function requireCmvRealAccess(permission, storeSlug) {
    const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRhContext"])();
    if (!ctx) {
        return {
            ctx: null,
            tenant: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sessão expirada. Por favor, faça login novamente.',
                code: 'UNAUTHENTICATED'
            }, {
                status: 401
            })
        };
    }
    if (!ctx.isAdmin && !ctx.hasPermission(permission)) {
        return {
            ctx: null,
            tenant: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sem permissão para esta ação',
                code: 'FORBIDDEN',
                permission
            }, {
                status: 403
            })
        };
    }
    const tenant = await buildTenantFromRhContext(ctx);
    if (tenant.lojaNaoConfigurada) {
        return {
            ctx: null,
            tenant: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Loja não configurada. Peça ao administrador para definir a loja deste usuário.',
                code: 'LOJA_NAO_CONFIGURADA'
            }, {
                status: 403
            })
        };
    }
    if (storeSlug) {
        if (!tenant.isAdmin && tenant.allowedStoreSlugs !== null && !tenant.allowedStoreSlugs.includes(storeSlug)) {
            return {
                ctx: null,
                tenant: null,
                error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Sem acesso à loja "${storeSlug}"`,
                    code: 'LOJA_FORBIDDEN'
                }, {
                    status: 403
                })
            };
        }
    }
    return {
        ctx,
        tenant,
        error: null
    };
}
function resolveCmvRealStoreFilter(tenant, overrideSlug) {
    if (tenant.lojaNaoConfigurada) return [];
    if (overrideSlug) {
        if (tenant.isAdmin || tenant.allowedStoreSlugs === null) return [
            overrideSlug
        ];
        if (tenant.allowedStoreSlugs.includes(overrideSlug)) return [
            overrideSlug
        ];
        return [];
    }
    if (tenant.isAdmin || tenant.allowedStoreSlugs === null) return null;
    return tenant.allowedStoreSlugs;
}
async function findCmvRealWhatsAppBot(tenant, sessionSlot) {
    const actor = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            id: tenant.actorUserId
        },
        select: {
            stackUserId: true
        }
    });
    if (actor?.stackUserId) {
        const bot = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].whatsAppBot.findFirst({
            where: {
                userId: actor.stackUserId,
                slot: sessionSlot
            },
            select: {
                userId: true,
                slot: true,
                isConnected: true,
                label: true
            }
        });
        if (bot) return bot;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$whatsapp$2d$sessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findWhatsAppBotForTenant"])(tenant.tenantUserId, sessionSlot);
}
}),
"[project]/Demo-2/src/lib/rh-permissions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─── Strings de permissão (valores exatos salvos no banco) ───────────────────
__turbopack_context__.s([
    "ADMIN_ONLY_PERMISSIONS",
    ()=>ADMIN_ONLY_PERMISSIONS,
    "CMV_REAL_PERMISSIONS",
    ()=>CMV_REAL_PERMISSIONS,
    "CMV_REAL_PERMISSION_SET",
    ()=>CMV_REAL_PERMISSION_SET,
    "DEFAULT_MEMBER_PERMISSIONS",
    ()=>DEFAULT_MEMBER_PERMISSIONS,
    "P",
    ()=>P,
    "PERMISSION_GROUPS",
    ()=>PERMISSION_GROUPS,
    "PERMISSION_LABELS",
    ()=>PERMISSION_LABELS,
    "RH_PERFIL_LABELS",
    ()=>RH_PERFIL_LABELS,
    "RH_PERMISSION_PRESETS",
    ()=>RH_PERMISSION_PRESETS,
    "RH_STORE_LABELS",
    ()=>RH_STORE_LABELS,
    "RH_STORE_SLUGS",
    ()=>RH_STORE_SLUGS,
    "getPreset",
    ()=>getPreset,
    "isValidStoreSlug",
    ()=>isValidStoreSlug
]);
const P = {
    // Módulo Funcionários
    EMPLOYEES_VIEW: 'employees.view',
    EMPLOYEES_CREATE: 'employees.create',
    EMPLOYEES_EDIT: 'employees.edit',
    EMPLOYEES_DEACTIVATE: 'employees.deactivate',
    // Módulo Motoboys
    RIDERS_VIEW: 'riders.view',
    RIDERS_CREATE: 'riders.create',
    RIDERS_EDIT: 'riders.edit',
    RIDERS_DEACTIVATE: 'riders.deactivate',
    RIDERS_LAUNCH_PERIOD: 'riders.launch_period',
    RIDERS_APPROVE_DOCS: 'riders.approve_docs',
    // Módulo RH Geral
    RH_VIEW_SALARY: 'rh.view_salary',
    RH_EDIT_SALARY: 'rh.edit_salary',
    // CMV Real — NÃO entram no default de convite (só preset ou toggle manual)
    CMV_REAL_VISUALIZAR: 'cmv_real.visualizar',
    CMV_REAL_REVISAR_APROVAR: 'cmv_real.revisar_aprovar',
    CMV_REAL_LANCAMENTOS: 'cmv_real.lancamentos',
    CMV_REAL_MAPEAMENTO_CRIAR: 'cmv_real.mapeamento_criar',
    CMV_REAL_MAPEAMENTO_EDITAR: 'cmv_real.mapeamento_editar',
    CMV_REAL_FECHAMENTO: 'cmv_real.fechamento',
    CMV_REAL_REABRIR: 'cmv_real.reabrir',
    CMV_REAL_CONFIG: 'cmv_real.config',
    // Gestão de usuários — apenas Admin (nunca concedida a RH)
    USERS_MANAGE: 'users.manage'
};
const CMV_REAL_PERMISSIONS = [
    P.CMV_REAL_VISUALIZAR,
    P.CMV_REAL_REVISAR_APROVAR,
    P.CMV_REAL_LANCAMENTOS,
    P.CMV_REAL_MAPEAMENTO_CRIAR,
    P.CMV_REAL_MAPEAMENTO_EDITAR,
    P.CMV_REAL_FECHAMENTO,
    P.CMV_REAL_REABRIR,
    P.CMV_REAL_CONFIG
];
const CMV_REAL_PERMISSION_SET = new Set(CMV_REAL_PERMISSIONS);
const ADMIN_ONLY_PERMISSIONS = new Set([
    P.USERS_MANAGE
]);
const DEFAULT_MEMBER_PERMISSIONS = Object.values(P).filter((p)=>!ADMIN_ONLY_PERMISSIONS.has(p) && !CMV_REAL_PERMISSION_SET.has(p));
const PERMISSION_LABELS = {
    'employees.view': 'Visualizar funcionários',
    'employees.create': 'Cadastrar funcionários',
    'employees.edit': 'Editar funcionários',
    'employees.deactivate': 'Inativar funcionários',
    'riders.view': 'Visualizar motoboys',
    'riders.create': 'Cadastrar motoboys',
    'riders.edit': 'Editar motoboys',
    'riders.deactivate': 'Inativar motoboys',
    'riders.launch_period': 'Lançar quinzenas',
    'riders.approve_docs': 'Aprovar/rejeitar documentos',
    'rh.view_salary': 'Visualizar salários e valores',
    'rh.edit_salary': 'Editar salários e valores',
    'cmv_real.visualizar': 'Visualizar CMV Real',
    'cmv_real.revisar_aprovar': 'Revisar e aprovar NF-e',
    'cmv_real.lancamentos': 'Lançamentos manuais',
    'cmv_real.mapeamento_criar': 'Criar mapeamentos',
    'cmv_real.mapeamento_editar': 'Editar mapeamentos / fornecedor fora do CMV',
    'cmv_real.fechamento': 'Fechamento do mês',
    'cmv_real.reabrir': 'Reabrir mês fechado',
    'cmv_real.config': 'Configurações CMV Real',
    'users.manage': 'Gerenciar usuários de RH'
};
const PERMISSION_GROUPS = [
    {
        label: 'Funcionários',
        permissions: [
            P.EMPLOYEES_VIEW,
            P.EMPLOYEES_CREATE,
            P.EMPLOYEES_EDIT,
            P.EMPLOYEES_DEACTIVATE
        ]
    },
    {
        label: 'Motoboys',
        permissions: [
            P.RIDERS_VIEW,
            P.RIDERS_CREATE,
            P.RIDERS_EDIT,
            P.RIDERS_DEACTIVATE,
            P.RIDERS_LAUNCH_PERIOD,
            P.RIDERS_APPROVE_DOCS
        ]
    },
    {
        label: 'RH Geral',
        permissions: [
            P.RH_VIEW_SALARY,
            P.RH_EDIT_SALARY
        ]
    },
    {
        label: 'CMV Real',
        permissions: CMV_REAL_PERMISSIONS
    }
];
const RH_STORE_SLUGS = [
    'ahu',
    'pilarzinho',
    'portao',
    'uberaba'
];
const RH_STORE_LABELS = {
    ahu: 'Ahu',
    pilarzinho: 'Pilarzinho',
    portao: 'Portão',
    uberaba: 'Uberaba'
};
const RH_PERFIL_LABELS = {
    escritorio: 'Escritório',
    gerente_loja: 'Gerente de loja'
};
const RH_PERMISSION_PRESETS = [
    {
        id: 'escritorio',
        label: 'Escritório',
        cmvRealPermissions: CMV_REAL_PERMISSIONS.filter((p)=>p !== P.CMV_REAL_REABRIR && p !== P.CMV_REAL_CONFIG),
        lojasMode: 'todas'
    },
    {
        id: 'gerente_loja',
        label: 'Gerente de loja',
        cmvRealPermissions: [
            P.CMV_REAL_VISUALIZAR,
            P.CMV_REAL_REVISAR_APROVAR,
            P.CMV_REAL_LANCAMENTOS,
            P.CMV_REAL_MAPEAMENTO_CRIAR
        ],
        lojasMode: 'required'
    }
];
function getPreset(id) {
    return RH_PERMISSION_PRESETS.find((p)=>p.id === id);
}
function isValidStoreSlug(slug) {
    return RH_STORE_SLUGS.includes(slug);
}
}),
"[project]/Demo-2/src/lib/cmv-real/refeicoes.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Classificação de refeições internas (jantas / sócio) a partir de vendas Saipos.
 * Puro — sem I/O. Regras texto→categoria editáveis via NfeConfig.
 */ __turbopack_context__.s([
    "DEFAULT_REFEICAO_REGRAS",
    ()=>DEFAULT_REFEICAO_REGRAS,
    "DEFAULT_VENDA_MES_CONFIG",
    ()=>DEFAULT_VENDA_MES_CONFIG,
    "calcularCustoRefeicoes",
    ()=>calcularCustoRefeicoes,
    "classificarRefeicao",
    ()=>classificarRefeicao,
    "isCanceledSale",
    ()=>isCanceledSale,
    "normalizeText",
    ()=>normalizeText,
    "parseMoney",
    ()=>parseMoney,
    "parseRefeicaoRegras",
    ()=>parseRefeicaoRegras,
    "parseVendaMesConfig",
    ()=>parseVendaMesConfig,
    "resumirRefeicoesPorCategoria",
    ()=>resumirRefeicoesPorCategoria,
    "valorVendaParaMes",
    ()=>valorVendaParaMes
]);
const DEFAULT_REFEICAO_REGRAS = [
    {
        match: 'SOCIO CALENZANO',
        categoria: 'SOCIO'
    },
    {
        match: 'MOTOBOY',
        categoria: 'BOYS'
    },
    {
        match: 'SEGURANCA',
        categoria: 'SEGURANCA'
    },
    {
        match: 'CENTRAL',
        categoria: 'CENTRAL'
    },
    {
        match: 'LOJA',
        categoria: 'LOJA'
    },
    {
        match: 'BALCAO',
        categoria: 'LOJA'
    },
    {
        match: 'EXPEDICAO',
        categoria: 'LOJA'
    }
];
function normalizeText(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/\s+/g, ' ').trim();
}
function parseMoney(v) {
    if (v == null || v === '') return 0;
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
}
function isCanceledSale(sale) {
    return String(sale.canceled || '').toUpperCase() === 'Y';
}
function paymentLabels(sale) {
    const payments = Array.isArray(sale.payments) ? sale.payments : [];
    return payments.map((p)=>normalizeText(p?.desc_store_payment_type)).filter(Boolean);
}
function startsWithJanta(text) {
    return text.startsWith('JANTA') || text.startsWith('JANTAR');
}
function containsJanta(text) {
    return text.includes('JANTA') || text.includes('JANTAR');
}
function matchCategoria(paymentNorm, regras) {
    for (const r of regras){
        const m = normalizeText(r.match);
        if (!m) continue;
        if (paymentNorm.includes(m)) return r.categoria;
    }
    return null;
}
function classificarRefeicao(sale, regras = DEFAULT_REFEICAO_REGRAS) {
    if (isCanceledSale(sale)) return null;
    const pays = paymentLabels(sale);
    const customer = normalizeText(sale.customer?.name);
    const cupom = normalizeText(sale.discount_coupon?.coupon);
    const primaryPay = pays[0] || '';
    const isSocioPay = pays.some((p)=>p.includes('SOCIO CALENZANO'));
    const isJantaPay = pays.some((p)=>startsWithJanta(p));
    const jantaApoio = containsJanta(customer) || containsJanta(cupom);
    if (!isSocioPay && !isJantaPay && !jantaApoio) return null;
    let categoria;
    if (isSocioPay) {
        categoria = 'SOCIO';
    } else {
        // Usa a primeira forma de pagamento de janta para casar regras
        const jantaPay = pays.find((p)=>startsWithJanta(p)) || primaryPay || customer || cupom;
        categoria = matchCategoria(jantaPay, regras) ?? 'OUTROS';
        // SOCIO só via forma de pagamento; se caiu em OUTROS por engano com janta, ok
        if (categoria === 'SOCIO' && !isSocioPay) categoria = 'OUTROS';
    }
    const id = sale.id_sale != null ? String(sale.id_sale) : '';
    if (!id) return null;
    const shift = String(sale.shift_date || sale.created_at || '').slice(0, 10);
    const valorItens = Math.round(parseMoney(sale.total_amount_items) * 100) / 100;
    return {
        categoria,
        formaPagamento: pays[0] ? String(sale.payments?.[0]?.desc_store_payment_type || pays[0]) : null,
        consumidor: sale.customer?.name ? String(sale.customer.name) : null,
        cupom: sale.discount_coupon?.coupon ? String(sale.discount_coupon.coupon) : null,
        valorItens,
        saiposSaleId: id,
        data: /^\d{4}-\d{2}-\d{2}$/.test(shift) ? shift : new Date().toISOString().slice(0, 10)
    };
}
const DEFAULT_VENDA_MES_CONFIG = {
    incluirTaxaEntrega: true,
    usarTotalLiquido: true,
    incluirIfood: true
};
function parseVendaMesConfig(raw) {
    const o = raw && typeof raw === 'object' ? raw : {};
    return {
        incluirTaxaEntrega: o.incluirTaxaEntrega !== false,
        usarTotalLiquido: o.usarTotalLiquido !== false,
        incluirIfood: o.incluirIfood !== false
    };
}
function parseRefeicaoRegras(raw) {
    if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_REFEICAO_REGRAS;
    const out = [];
    for (const item of raw){
        const o = item;
        const match = String(o.match || '').trim();
        const categoria = String(o.categoria || '').toUpperCase();
        if (!match) continue;
        if (![
            'BOYS',
            'LOJA',
            'CENTRAL',
            'SEGURANCA',
            'SOCIO',
            'OUTROS'
        ].includes(categoria)) {
            continue;
        }
        out.push({
            match,
            categoria
        });
    }
    return out.length ? out : DEFAULT_REFEICAO_REGRAS;
}
function valorVendaParaMes(sale, opts = {}) {
    if (isCanceledSale(sale)) return 0;
    if (classificarRefeicao(sale, opts.regras)) return 0;
    const config = opts.config ?? DEFAULT_VENDA_MES_CONFIG;
    if (!config.incluirIfood && sale.partner_sale) return 0;
    let total = parseMoney(sale.total_amount);
    if (!config.incluirTaxaEntrega) {
        total -= parseMoney(sale.delivery?.delivery_fee);
    }
    return Math.round(total * 100) / 100;
}
function resumirRefeicoesPorCategoria(items) {
    const map = new Map();
    for (const it of items){
        if (it.ignorada) continue;
        const cur = map.get(it.categoria) || {
            quantidade: 0,
            valorItens: 0
        };
        cur.quantidade += 1;
        cur.valorItens += it.valorItens;
        map.set(it.categoria, cur);
    }
    return Array.from(map.entries()).map(([categoria, v])=>({
            categoria,
            quantidade: v.quantidade,
            valorItens: Math.round(v.valorItens * 100) / 100
        }));
}
function calcularCustoRefeicoes(params) {
    const pct = params.vendaMes > 0 ? params.consumoMp / params.vendaMes : 0;
    const ativos = params.refeicoes.filter((r)=>!r.ignorada);
    const resumo = resumirRefeicoesPorCategoria(ativos);
    const porCategoria = resumo.map((r)=>({
            ...r,
            custo: Math.round(r.valorItens * pct * 100) / 100
        }));
    const custoTotal = Math.round(porCategoria.reduce((a, x)=>a + x.custo, 0) * 100) / 100;
    return {
        pctCmvMpBruto: pct,
        porCategoria,
        custoTotal,
        consumoMpLiquido: Math.round((params.consumoMp - custoTotal) * 100) / 100
    };
}
}),
"[project]/Demo-2/src/lib/nfe/dates.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Datas NF-e: Saipos manda UTC; competência/semana em America/Sao_Paulo.
 */ __turbopack_context__.s([
    "competenciaFromDataEntrada",
    ()=>competenciaFromDataEntrada,
    "partsInSaoPaulo",
    ()=>partsInSaoPaulo,
    "semanaFromDataEntrada",
    ()=>semanaFromDataEntrada
]);
const TZ = 'America/Sao_Paulo';
function partsInSaoPaulo(input) {
    const d = typeof input === 'string' ? new Date(input) : input;
    if (Number.isNaN(d.getTime())) {
        throw new Error(`data inválida: ${input}`);
    }
    const fmt = new Intl.DateTimeFormat('en-CA', {
        timeZone: TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const parts = fmt.formatToParts(d);
    const year = Number(parts.find((p)=>p.type === 'year')?.value);
    const month = Number(parts.find((p)=>p.type === 'month')?.value);
    const day = Number(parts.find((p)=>p.type === 'day')?.value);
    return {
        year,
        month,
        day,
        date: d
    };
}
function competenciaFromDataEntrada(input) {
    const { year, month } = partsInSaoPaulo(input);
    return `${year}-${String(month).padStart(2, '0')}`;
}
function semanaFromDataEntrada(input) {
    const { day } = partsInSaoPaulo(input);
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    if (day <= 28) return 4;
    return 5;
}
}),
"[project]/Demo-2/src/lib/effective-user.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Resolução de usuário efetivo para acesso a dados compartilhados.
 *
 * Quando um usuário logado é membro de uma equipe RH (via RhTeamMember),
 * todas as queries de dados devem usar o userId do dono (tenantUserId),
 * garantindo compartilhamento total entre admin e membros de equipe.
 *
 * Ordem de resolução:
 * 1. Sem sessão → null
 * 2. É membro ativo de uma equipe RH → retorna tenantUser (dono dos dados)
 * 3. Caso contrário → retorna o próprio User
 */ __turbopack_context__.s([
    "getEffectiveDbUser",
    ()=>getEffectiveDbUser,
    "getEffectiveUserIds",
    ()=>getEffectiveUserIds
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
async function getEffectiveDbUser() {
    const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRhContext"])();
    if (!ctx) return null;
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            id: ctx.userId
        }
    });
}
async function getEffectiveUserIds(tenantUserId) {
    // Busca membros ativos que já fizeram login (têm stackUserId)
    const members = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findMany({
        where: {
            tenantUserId,
            isActive: true,
            stackUserId: {
                not: null
            }
        },
        select: {
            stackUserId: true
        }
    });
    if (members.length === 0) return [
        tenantUserId
    ];
    // Resolve os User.id de cada membro pelo seu stackUserId
    const memberUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findMany({
        where: {
            stackUserId: {
                in: members.map((m)=>m.stackUserId).filter(Boolean)
            }
        },
        select: {
            id: true
        }
    });
    return [
        tenantUserId,
        ...memberUsers.map((u)=>u.id)
    ];
}
}),
"[project]/Demo-2/src/lib/estoque-nome.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Demo-2/src/lib/estoque-tenant.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dedupeInsumosBySlug",
    ()=>dedupeInsumosBySlug,
    "getEstoqueTenantContext",
    ()=>getEstoqueTenantContext,
    "mergeProdutoConfigs",
    ()=>mergeProdutoConfigs,
    "mergeProdutoOrdem",
    ()=>mergeProdutoOrdem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$effective$2d$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/effective-user.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/tenant.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/estoque-nome.ts [app-route] (ecmascript)");
;
;
;
async function getEstoqueTenantContext() {
    const dbUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$effective$2d$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEffectiveDbUser"])();
    if (!dbUser) return null;
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCmvRealTenantFromSession"])();
    if (!store) return null;
    const userIds = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$effective$2d$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEffectiveUserIds"])(dbUser.id);
    return {
        tenantUserId: dbUser.id,
        userIds,
        store
    };
}
function dedupeInsumosBySlug(items, tenantUserId) {
    const bySlug = new Map();
    for (const item of items){
        if (item.userId !== tenantUserId) bySlug.set(item.insumoId, item);
    }
    for (const item of items){
        if (item.userId === tenantUserId) bySlug.set(item.insumoId, item);
    }
    return Array.from(bySlug.values());
}
function mergeProdutoConfigs(rows, tenantUserId) {
    const configMap = {};
    const toEntry = (c)=>({
            ativo: c.ativo,
            estoqueMinimo: c.estoqueMinimo ?? undefined,
            modoContagem: c.modoContagem ?? 'kg',
            kgPorUnidade: c.kgPorUnidade ?? undefined
        });
    for (const c of rows){
        if (c.userId !== tenantUserId) configMap[c.produtoId] = toEntry(c);
    }
    for (const c of rows){
        if (c.userId === tenantUserId) configMap[c.produtoId] = toEntry(c);
    }
    return configMap;
}
function mergeProdutoOrdem(rows, tenantUserId) {
    const tenantRow = rows.find((r)=>r.userId === tenantUserId);
    const tenantOrder = Array.isArray(tenantRow?.ordem) ? tenantRow.ordem : [];
    if (tenantOrder.length > 0) return tenantOrder;
    return rows.reduce((best, r)=>{
        const o = Array.isArray(r.ordem) ? r.ordem : [];
        return o.length > best.length ? o : best;
    }, []);
}
}),
"[project]/Demo-2/src/lib/nfe/normalize.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Normalização de texto/unidade para chave de mapeamento NF-e. */ __turbopack_context__.s([
    "chaveMapeamentoDesc",
    ()=>chaveMapeamentoDesc,
    "chaveMapeamentoEan",
    ()=>chaveMapeamentoEan,
    "chavesMapeamentoEan",
    ()=>chavesMapeamentoEan,
    "normalizarCnpj",
    ()=>normalizarCnpj,
    "normalizarDescricao",
    ()=>normalizarDescricao,
    "normalizarUnidade",
    ()=>normalizarUnidade,
    "stripAccents",
    ()=>stripAccents
]);
function stripAccents(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function normalizarDescricao(raw) {
    return stripAccents(String(raw || '')).toUpperCase().replace(/[^A-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}
const UNIDADE_SINONIMOS = {
    UN: 'UN',
    UNI: 'UN',
    UNID: 'UN',
    UND: 'UN',
    U: 'UN',
    PC: 'UN',
    PCS: 'UN',
    PÇ: 'UN',
    KG: 'KG',
    KGS: 'KG',
    KILO: 'KG',
    KILOS: 'KG',
    G: 'G',
    GR: 'G',
    GRAMAS: 'G',
    CX: 'CX',
    CXA: 'CX',
    FD: 'FD',
    FARDO: 'FD',
    DP: 'DP',
    LAT: 'LAT',
    LATA: 'LAT',
    TON: 'TON',
    BIS: 'BIS',
    CJ: 'CJ',
    PCT: 'PCT',
    PACOTE: 'PCT'
};
function normalizarUnidade(raw) {
    const u = stripAccents(String(raw || '')).toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
    if (!u) return 'UN';
    return UNIDADE_SINONIMOS[u] ?? u;
}
function chaveMapeamentoEan(ean, unidade) {
    const digits = String(ean || '').replace(/\D/g, '');
    const und = unidade ? normalizarUnidade(unidade) : '';
    return und ? `ean:${digits}|${und}` : `ean:${digits}`;
}
function chavesMapeamentoEan(ean, unidade) {
    const nova = chaveMapeamentoEan(ean, unidade);
    const legado = chaveMapeamentoEan(ean);
    return nova === legado ? [
        nova
    ] : [
        nova,
        legado
    ];
}
function chaveMapeamentoDesc(descricaoNormalizada, unidade) {
    return `desc:${descricaoNormalizada}|${normalizarUnidade(unidade)}`;
}
function normalizarCnpj(raw) {
    return String(raw || '').replace(/\D/g, '').padStart(14, '0').slice(-14);
}
}),
"[project]/Demo-2/src/lib/nfe/volume.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Extração de volume para comparar bebidas (NF-e / catálogo / planilha).
 * Se ambos os lados tiverem volume e divergirem → descartar candidato.
 *
 * - ML / L / LITRO(S)
 * - LATA / LT / LT12 (+ 350ML típico de lata)
 * - nº solto (PEPSI 600 ZERO)
 */ __turbopack_context__.s([
    "extractVolume",
    ()=>extractVolume,
    "extrairMultipackBebida",
    ()=>extrairMultipackBebida,
    "prepareVolumeText",
    ()=>prepareVolumeText,
    "volumesConflitam",
    ()=>volumesConflitam
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/normalize.ts [app-route] (ecmascript)");
;
function prepareVolumeText(raw) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stripAccents"])(String(raw || '')).toUpperCase().replace(/,/g, '.').replace(/\s+/g, ' ').trim();
}
function extractVolume(raw) {
    let text = prepareVolumeText(raw);
    if (!text) return null;
    // Remover pesos para não pegar "500" de "500G"
    text = text.replace(/\b\d+(?:\.\d+)?\s*(?:KG|KGS|KILO|KILOS|G|GR|GRAMAS)\b/g, ' ');
    // LATA / LT / LT12 — lata (LT12 350ML, LT 350ml, LATA)
    // Não confundir com LITRO (LT ≠ prefixo de LITRO via \bLT\d*\b)
    const temLata = /\bLATA\b/.test(text) || /\bLT\d*\b/.test(text);
    if (temLata) return {
        kind: 'lata'
    };
    // N LITRO / N LITROS / LITRO (1)
    const litros = text.match(/\b(\d+(?:\.\d+)?)\s*LITROS?\b/);
    if (litros) {
        const n = Number(litros[1]);
        if (Number.isFinite(n) && n > 0) return {
            kind: 'ml',
            ml: Math.round(n * 1000)
        };
    }
    if (/\bLITROS?\b/.test(text)) {
        return {
            kind: 'ml',
            ml: 1000
        };
    }
    const ml = text.match(/\b(\d+(?:\.\d+)?)\s*ML\b/);
    if (ml) {
        const n = Number(ml[1]);
        if (Number.isFinite(n) && n > 0) return {
            kind: 'ml',
            ml: Math.round(n)
        };
    }
    // 2L, 1.5L — não LATA/LITRO (já tratados)
    const lit = text.match(/\b(\d+(?:\.\d+)?)\s*L\b/);
    if (lit) {
        const n = Number(lit[1]);
        if (Number.isFinite(n) && n > 0) return {
            kind: 'ml',
            ml: Math.round(n * 1000)
        };
    }
    // Nº solto típico de embalagem (200–9999): "PEPSI 600 ZERO"
    const bare = text.match(/\b(\d{3,4})\b/);
    if (bare) {
        const n = Number(bare[1]);
        if (Number.isFinite(n) && n >= 190 && n <= 9999) return {
            kind: 'ml',
            ml: n
        };
    }
    return null;
}
function volumesConflitam(a, b) {
    const va = extractVolume(a);
    const vb = extractVolume(b);
    if (!va || !vb) return false;
    if (va.kind === 'lata' && vb.kind === 'lata') return false;
    if (va.kind === 'lata' || vb.kind === 'lata') return true;
    return va.ml !== vb.ml;
}
function extrairMultipackBebida(descricao) {
    const text = prepareVolumeText(descricao);
    const patterns = [
        /\bLT(\d+)\b/,
        /\b(\d+)\s*PACK\b/,
        /\bC\s*\/\s*(\d+)\b/,
        /\bCX\s*C\s*\/\s*(\d+)\b/,
        /\b(\d+)\s*U(?:N(?:ID)?)?\b/,
        /\b(\d+)\s*X\b/
    ];
    for (const re of patterns){
        const m = text.match(re);
        if (!m) continue;
        const n = Number(m[1]);
        if (Number.isFinite(n) && n > 1 && n <= 100) return n;
    }
    return null;
}
}),
"[project]/Demo-2/src/lib/nfe/match-nome-produto.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Regras de match de nomes planilha ↔ catálogo (saldo / catálogo CMV).
 * Tokens numéricos e distintivos são checados ANTES do score.
 */ __turbopack_context__.s([
    "extrairTokensNumericos",
    ()=>extrairTokensNumericos,
    "matchNomeProdutoLista",
    ()=>matchNomeProdutoLista,
    "nomesProdutoConflitam",
    ()=>nomesProdutoConflitam,
    "normalizarUnidadesNoNome",
    ()=>normalizarUnidadesNoNome,
    "prepararNomeMatch",
    ()=>prepararNomeMatch,
    "scoreNomeProdutoStrict",
    ()=>scoreNomeProdutoStrict,
    "tokensDistintivosConflitam",
    ()=>tokensDistintivosConflitam,
    "tokensNumericosConflitam",
    ()=>tokensNumericosConflitam,
    "tokensTextoDistintivos",
    ()=>tokensTextoDistintivos
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/normalize.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$volume$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/volume.ts [app-route] (ecmascript)");
;
;
const STOP = new Set([
    'DE',
    'DA',
    'DO',
    'DOS',
    'DAS',
    'E',
    'A',
    'O',
    'AS',
    'OS',
    'COM'
]);
function prepararNomeMatch(raw) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stripAccents"])(String(raw || '')).toUpperCase().replace(/,/g, '.').replace(/\s+/g, ' ').trim();
}
function normalizarUnidadesNoNome(raw) {
    let t = prepararNomeMatch(raw);
    t = t.replace(/\bLONG\s+NECK\b/g, 'LONGNECK');
    t = t.replace(/\b(\d+(?:\.\d+)?)\s*LITROS?\b/g, '$1L');
    t = t.replace(/\b(\d+(?:\.\d+)?)\s*ML\b/g, '$1ML');
    return t;
}
function extrairTokensNumericos(nome) {
    let t = normalizarUnidadesNoNome(nome);
    const set = new Set();
    for (const m of t.matchAll(/\b(\d+(?:\.\d+)?)ML\b/g)){
        set.add(`${m[1]}ML`);
    }
    t = t.replace(/\b\d+(?:\.\d+)?ML\b/g, ' ');
    for (const m of t.matchAll(/\b(\d+(?:\.\d+)?)L\b/g)){
        set.add(`${m[1]}L`);
    }
    t = t.replace(/\b\d+(?:\.\d+)?L\b/g, ' ');
    for (const m of t.matchAll(/\b(\d+(?:\.\d+)?)\b/g)){
        set.add(m[1]);
    }
    return set;
}
function tokensNumericosConflitam(a, b) {
    const sa = extrairTokensNumericos(a);
    const sb = extrairTokensNumericos(b);
    if (sa.size !== sb.size) return true;
    for (const x of sa){
        if (!sb.has(x)) return true;
    }
    return false;
}
function tokensTextoDistintivos(nome) {
    let t = normalizarUnidadesNoNome(nome);
    t = t.replace(/\b\d+(?:\.\d+)?ML\b/g, ' ');
    t = t.replace(/\b\d+(?:\.\d+)?L\b/g, ' ');
    t = t.replace(/\b\d+(?:\.\d+)?\b/g, ' ');
    t = t.replace(/[^A-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const seen = new Set();
    const out = [];
    for (const tok of t.split(' ').filter(Boolean)){
        if (STOP.has(tok)) continue;
        if (seen.has(tok)) continue;
        seen.add(tok);
        out.push(tok);
    }
    return out;
}
function tokensDistintivosConflitam(a, b) {
    const sa = new Set(tokensTextoDistintivos(a));
    const sb = new Set(tokensTextoDistintivos(b));
    for (const t of sa){
        if (!sb.has(t)) return true;
    }
    for (const t of sb){
        if (!sa.has(t)) return true;
    }
    return false;
}
function nomesProdutoConflitam(a, b) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$volume$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["volumesConflitam"])(a, b)) return true;
    if (tokensNumericosConflitam(a, b)) return true;
    if (tokensDistintivosConflitam(a, b)) return true;
    return false;
}
function scoreNomeProdutoStrict(a, b) {
    const ta = tokensTextoDistintivos(a);
    const tb = tokensTextoDistintivos(b);
    if (ta.length === 0 || tb.length === 0) {
        // só números (ex. embalagens) — se numéricos iguais, score alto
        if (!tokensNumericosConflitam(a, b) && extrairTokensNumericos(a).size > 0) return 1;
        return 0;
    }
    const sa = new Set(ta);
    const sb = new Set(tb);
    let inter = 0;
    for (const t of sa)if (sb.has(t)) inter++;
    return inter / Math.max(sa.size, sb.size);
}
function matchNomeProdutoLista(nomePlanilha, catalogo, opts) {
    const minCasado = opts?.minCasado ?? 0.95;
    const minSugerido = opts?.minSugerido ?? 0.55;
    const alvoNorm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizarDescricao"])(nomePlanilha);
    let best = null;
    for (const c of catalogo){
        if (nomesProdutoConflitam(nomePlanilha, c.nome)) continue;
        let score = c.nomeNormalizado === alvoNorm ? 1 : scoreNomeProdutoStrict(nomePlanilha, c.nome);
        if (score < minSugerido) continue;
        if (!best || score > best.score) best = {
            item: c,
            score
        };
    }
    if (!best) return {
        status: 'nao_encontrado',
        score: 0
    };
    if (best.score >= minCasado) {
        return {
            status: 'casado',
            item: best.item,
            score: best.score
        };
    }
    return {
        status: 'sugerido',
        item: best.item,
        score: best.score
    };
}
}),
"[project]/Demo-2/src/lib/estoque/catalogo.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Catálogo de produtos do Estoque — fonte única para:
 * - aba Produtos (/estoque → GET /api/estoque/insumos)
 * - importador CMV Real
 * - pipeline NF-e (sugestão por similaridade + kgPorUnidade)
 *
 * ## Como a aba Produtos monta a lista
 *
 * Rota: `GET /api/estoque/insumos`
 * UI: `useProdutosEstoque` → `GerenciarProdutos`
 *
 * Resolução de usuário (`getEstoqueTenantContext` → `getEffectiveDbUser` → `getRhContext`):
 * 1. Sessão Stack Auth → User da sessão
 * 2. Se o User **é dono** de equipe RH (tem RhTeamMember com tenantUserId=ele) →
 *    tenant = ele mesmo
 * 3. Senão, se é **membro** ativo de outro tenant → tenant = tenantUserId do dono
 * 4. Queries: `EstoqueInsumo` onde `userId IN (tenant + membros com login)`
 * 5. `dedupeInsumosBySlug`: um registro por `insumoId` (slug); preferência do tenant
 * 6. Se a lista vier vazia: seed de `INSUMOS_PADRAO` (~157 itens) no tenant
 *
 * Não é catálogo estático na UI — a lista vem do banco (com merge multi-conta).
 * `EstoqueProdutoConfig.produtoId` = slug `EstoqueInsumo.insumoId` (não o cuid).
 *
 * ## NF-e vs Produtos (observado em 2026-09-29)
 *
 * - ServiceApiKey `calenzano.ahu` → userId `cmjhty6hu0001jy04sstknpdo`
 * - NF-e ingeridas ficam com esse userId (42 notas)
 * - A mesma conta, na sessão web, **não** é dona do time: é membro do tenant
 *   `platefull.app@gmail.com` (`cmk5ykusf0001jz04iwmf8xa8`)
 * - Produtos na sessão: merge do tenant → **179** slugs únicos
 * - Contagens por conta isolada: 156–165 (por isso “nenhum userId tem 179”)
 *
 * Conclusão: o dono das NF-e (API key / loja) ≠ dono do catálogo Estoque (tenant RH).
 * Este módulo resolve o catálogo pelo **mesmo algoritmo do Estoque** a partir de
 * qualquer userId (sessão ou API key), sem mudar o userId gravado nas NF-e.
 */ __turbopack_context__.s([
    "loadCatalogoEstoqueForUserId",
    ()=>loadCatalogoEstoqueForUserId,
    "loadCatalogoEstoqueFromSession",
    ()=>loadCatalogoEstoqueFromSession,
    "matchCatalogoPorNome",
    ()=>matchCatalogoPorNome,
    "resolveEstoqueTenantForUserId",
    ()=>resolveEstoqueTenantForUserId,
    "scoreNomeProduto",
    ()=>scoreNomeProduto
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/estoque-tenant.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$match$2d$nome$2d$produto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/match-nome-produto.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/normalize.ts [app-route] (ecmascript)");
;
;
;
;
async function resolveEstoqueTenantForUserId(userId) {
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            stackUserId: true
        }
    });
    if (!user) return null;
    const ownsTeam = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.count({
        where: {
            tenantUserId: user.id,
            isActive: true
        }
    }) > 0;
    let tenantUserId = user.id;
    if (!ownsTeam && user.stackUserId) {
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
            where: {
                stackUserId: user.stackUserId,
                isActive: true
            },
            select: {
                tenantUserId: true
            }
        });
        if (membership) tenantUserId = membership.tenantUserId;
    }
    const members = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findMany({
        where: {
            tenantUserId,
            isActive: true,
            stackUserId: {
                not: null
            }
        },
        select: {
            stackUserId: true
        }
    });
    const memberUsers = members.length === 0 ? [] : await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findMany({
        where: {
            stackUserId: {
                in: members.map((m)=>m.stackUserId).filter(Boolean)
            }
        },
        select: {
            id: true
        }
    });
    const userIds = [
        tenantUserId,
        ...memberUsers.map((u)=>u.id)
    ];
    return {
        tenantUserId,
        userIds: [
            ...new Set(userIds)
        ]
    };
}
async function loadCatalogoEstoqueForUserId(userId) {
    const resolved = await resolveEstoqueTenantForUserId(userId);
    if (!resolved) return null;
    return loadCatalogoEstoqueForTenant(resolved.tenantUserId, resolved.userIds);
}
async function loadCatalogoEstoqueFromSession() {
    const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEstoqueTenantContext"])();
    if (!ctx) return null;
    return loadCatalogoEstoqueForTenant(ctx.tenantUserId, ctx.userIds);
}
async function loadCatalogoEstoqueForTenant(tenantUserId, userIds) {
    const [insumos, configs] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findMany({
            where: {
                userId: {
                    in: userIds
                }
            },
            orderBy: [
                {
                    categoriaId: 'asc'
                },
                {
                    createdAt: 'asc'
                }
            ]
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueProdutoConfig.findMany({
            where: {
                userId: {
                    in: userIds
                }
            }
        })
    ]);
    const deduped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["dedupeInsumosBySlug"])(insumos, tenantUserId);
    const configMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["mergeProdutoConfigs"])(configs, tenantUserId);
    const itens = deduped.map((p)=>{
        const cfg = configMap[p.insumoId];
        return {
            id: p.id,
            insumoId: p.insumoId,
            nome: p.nome,
            nomeNormalizado: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizarDescricao"])(p.nome),
            unidade: p.unidade,
            categoriaId: p.categoriaId,
            categoriaNome: p.categoriaNome,
            userId: p.userId,
            ativo: cfg?.ativo !== false,
            kgPorUnidade: cfg?.kgPorUnidade ?? null,
            modoContagem: cfg?.modoContagem ?? (p.unidade === 'un' ? 'unidade' : 'kg')
        };
    });
    return {
        tenantUserId,
        userIds,
        itens
    };
}
function scoreNomeProduto(a, b) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$match$2d$nome$2d$produto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scoreNomeProdutoStrict"])(a, b);
}
function matchCatalogoPorNome(nomePlanilha, catalogo, opts) {
    const lista = opts?.soAtivos === false ? catalogo : catalogo.filter((c)=>c.ativo);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$match$2d$nome$2d$produto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["matchNomeProdutoLista"])(nomePlanilha, lista, {
        minCasado: opts?.minCasado,
        minSugerido: opts?.minSugerido
    });
}
}),
"[project]/Demo-2/src/lib/nfe/importar-planilha-secoes.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Detecção compartilhada de seções/produtos na planilha CMV DESPERDÍCIO.
 * Usado por importar-catalogo e importar-saldo.
 *
 * Âncora: coluna B exatamente "MATERIA PRIMA" | "EMBALAGENS" | "BEBIDAS"
 * (normalizado) E coluna D = "ESTOQUE INICIAL" na mesma linha.
 * Produto: B preenchido; E (unidade) opcional — fallback AF.
 */ __turbopack_context__.s([
    "COL_ESTOQUE_INICIAL_HDR",
    ()=>COL_ESTOQUE_INICIAL_HDR,
    "COL_PRODUTO",
    ()=>COL_PRODUTO,
    "COL_UNIDADE",
    ()=>COL_UNIDADE,
    "COL_UNIDADE_AF",
    ()=>COL_UNIDADE_AF,
    "cellStr",
    ()=>cellStr,
    "detectarAncoraSecao",
    ()=>detectarAncoraSecao,
    "isCabecalhoEstoqueInicial",
    ()=>isCabecalhoEstoqueInicial,
    "isFimBlocoInventario",
    ()=>isFimBlocoInventario,
    "isLinhaTotal",
    ()=>isLinhaTotal,
    "lerLinhaProduto",
    ()=>lerLinhaProduto,
    "normalizarCelulaSecao",
    ()=>normalizarCelulaSecao,
    "secaoFromNomeExato",
    ()=>secaoFromNomeExato
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/xlsx/xlsx.mjs [app-route] (ecmascript)");
;
const COL_PRODUTO = 1; // B
const COL_ESTOQUE_INICIAL_HDR = 3; // D
const COL_UNIDADE = 4; // E
const COL_UNIDADE_AF = 31; // AF (fallback de unidade)
const ANCHOR_EXACT = {
    'MATERIA PRIMA': 'MATERIA_PRIMA',
    EMBALAGENS: 'EMBALAGEM',
    BEBIDAS: 'BEBIDA'
};
function normalizarCelulaSecao(raw) {
    return String(raw || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}
function cellStr(ws, r, c) {
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].encode_cell({
        r,
        c
    });
    const cell = ws[ref];
    if (!cell) return '';
    if (cell.w != null && String(cell.w).trim()) return String(cell.w).trim();
    if (cell.v != null) return String(cell.v).trim();
    return '';
}
function secaoFromNomeExato(nomeB) {
    return ANCHOR_EXACT[normalizarCelulaSecao(nomeB)] ?? null;
}
function isCabecalhoEstoqueInicial(colD) {
    return normalizarCelulaSecao(colD) === 'ESTOQUE INICIAL';
}
function detectarAncoraSecao(ws, r) {
    const nomeB = cellStr(ws, r, COL_PRODUTO);
    const secao = secaoFromNomeExato(nomeB);
    if (!secao) return null;
    const colD = cellStr(ws, r, COL_ESTOQUE_INICIAL_HDR);
    if (!isCabecalhoEstoqueInicial(colD)) return null;
    return secao;
}
function isFimBlocoInventario(nomeB) {
    return /^(cmv\b|venda\b|resumo)\b/i.test(nomeB.trim());
}
function isLinhaTotal(nomeB) {
    return /^(total|soma)\b/i.test(nomeB.trim());
}
function lerLinhaProduto(ws, r) {
    const nomeB = cellStr(ws, r, COL_PRODUTO);
    if (!nomeB || nomeB.length < 2) return null;
    if (isFimBlocoInventario(nomeB) || isLinhaTotal(nomeB)) return null;
    // Nome exato de seção sem ser âncora completa → não é produto
    if (secaoFromNomeExato(nomeB)) return null;
    let unidadeRaw = cellStr(ws, r, COL_UNIDADE);
    if (!unidadeRaw.trim()) {
        unidadeRaw = cellStr(ws, r, COL_UNIDADE_AF);
    }
    return {
        nome: nomeB,
        unidadeRaw: unidadeRaw.trim()
    };
}
}),
"[project]/Demo-2/src/lib/nfe/importar-catalogo-parse.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Parser puro do catálogo CMV (sem Prisma).
 * B=produto, E=unidade; âncoras via importar-planilha-secoes.
 */ __turbopack_context__.s([
    "lerCatalogoDoBuffer",
    ()=>lerCatalogoDoBuffer,
    "listarAbas",
    ()=>listarAbas,
    "parseCatalogoDaAba",
    ()=>parseCatalogoDaAba
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/xlsx/xlsx.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$planilha$2d$secoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/importar-planilha-secoes.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/normalize.ts [app-route] (ecmascript)");
;
;
;
function unidadeFromCol(raw, secao) {
    const u = raw.toUpperCase().replace(/[^A-Z]/g, '');
    if (u === 'KG' || u === 'KILO' || u === 'KILOS') return 'KG';
    if (u === 'UN' || u === 'UND' || u === 'UNID' || u === 'PC') return 'UN';
    return secao === 'MATERIA_PRIMA' ? 'KG' : 'UN';
}
function parseCatalogoDaAba(ws) {
    const ref = ws['!ref'];
    if (!ref) return [];
    const range = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].decode_range(ref);
    const out = [];
    let secaoAtual = null;
    let ordem = 0;
    for(let r = range.s.r; r <= range.e.r; r++){
        const ancora = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$planilha$2d$secoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectarAncoraSecao"])(ws, r);
        if (ancora) {
            secaoAtual = ancora;
            ordem = 0;
            continue;
        }
        const prod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$planilha$2d$secoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["lerLinhaProduto"])(ws, r);
        if (!prod) {
            const nomeB = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$planilha$2d$secoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cellStr"])(ws, r, 1);
            if (nomeB && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$planilha$2d$secoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isFimBlocoInventario"])(nomeB)) secaoAtual = null;
            continue;
        }
        if (!secaoAtual) continue;
        ordem += 1;
        out.push({
            linha: r + 1,
            nome: prod.nome,
            nomeNormalizado: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizarDescricao"])(prod.nome),
            secao: secaoAtual,
            unidade: unidadeFromCol(prod.unidadeRaw, secaoAtual),
            ordem
        });
    }
    return out;
}
function lerCatalogoDoBuffer(buffer, abaNome) {
    const wb = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["read"](buffer, {
        type: 'array',
        cellDates: true
    });
    const ws = wb.Sheets[abaNome];
    if (!ws) throw new Error(`Aba "${abaNome}" não encontrada`);
    return parseCatalogoDaAba(ws);
}
function listarAbas(buffer) {
    const wb = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["read"](buffer, {
        type: 'array',
        cellDates: true
    });
    return wb.SheetNames;
}
}),
"[project]/Demo-2/src/lib/nfe/importar-catalogo.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Importador do catálogo CMV Real a partir da planilha "CMV DESPERDÍCIO".
 * Parser puro: importar-catalogo-parse.ts
 */ __turbopack_context__.s([
    "confirmarCatalogo",
    ()=>confirmarCatalogo,
    "criarInsumoEConfig",
    ()=>criarInsumoEConfig,
    "previewCatalogo",
    ()=>previewCatalogo,
    "previewCatalogoComCatalogo",
    ()=>previewCatalogoComCatalogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2f$catalogo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/estoque/catalogo.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$catalogo$2d$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/importar-catalogo-parse.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/normalize.ts [app-route] (ecmascript)");
;
;
;
;
;
function previewCatalogoComCatalogo(linhas, catalogoItens) {
    return linhas.map((l)=>{
        const match = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2f$catalogo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["matchCatalogoPorNome"])(l.nome, catalogoItens);
        if (match.status === 'nao_encontrado' || !match.item) {
            return {
                linha: l.linha,
                nome: l.nome,
                secao: l.secao,
                unidade: l.unidade,
                ordem: l.ordem,
                status: 'nao_encontrado'
            };
        }
        return {
            linha: l.linha,
            nome: l.nome,
            secao: l.secao,
            unidade: l.unidade,
            ordem: l.ordem,
            status: match.status,
            estoqueInsumoId: match.item.id,
            estoqueNome: match.item.nome,
            score: match.score,
            kgPorUnidade: match.item.kgPorUnidade
        };
    });
}
async function previewCatalogo(_ignored, linhas) {
    const catalogo = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2f$catalogo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loadCatalogoEstoqueFromSession"])();
    if (!catalogo) throw new Error('Sessão sem contexto de Estoque (tenant RH).');
    return previewCatalogoComCatalogo(linhas, catalogo.itens);
}
async function confirmarCatalogo(tenantUserId, itens) {
    let upserted = 0;
    for (const it of itens){
        if (!it.estoqueInsumoId) continue;
        await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.upsert({
            where: {
                userId_estoqueInsumoId: {
                    userId: tenantUserId,
                    estoqueInsumoId: it.estoqueInsumoId
                }
            },
            create: {
                userId: tenantUserId,
                estoqueInsumoId: it.estoqueInsumoId,
                secao: it.secao,
                unidade: it.unidade,
                ordem: it.ordem,
                ativo: true
            },
            update: {
                secao: it.secao,
                unidade: it.unidade,
                ordem: it.ordem,
                ativo: true
            }
        });
        upserted++;
    }
    return {
        upserted,
        tenantUserId
    };
}
async function criarInsumoEConfig(tenantUserId, opts) {
    const slugBase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizarDescricao"])(opts.nome).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 60);
    let slug = slugBase || `insumo-${Date.now()}`;
    const exists = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findUnique({
        where: {
            userId_insumoId: {
                userId: tenantUserId,
                insumoId: slug
            }
        }
    });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;
    const cat = opts.secao === 'MATERIA_PRIMA' ? {
        id: 'materias-primas',
        nome: 'Matérias-primas',
        icone: '🌾'
    } : opts.secao === 'EMBALAGEM' ? {
        id: 'embalagens',
        nome: 'Embalagens',
        icone: '📦'
    } : {
        id: 'bebidas',
        nome: 'Bebidas',
        icone: '🥤'
    };
    const insumo = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.create({
        data: {
            userId: tenantUserId,
            insumoId: slug,
            nome: opts.nome.trim().toUpperCase(),
            unidade: opts.unidade === 'KG' ? 'kg' : 'un',
            categoriaId: cat.id,
            categoriaNome: cat.nome,
            categoriaIcone: cat.icone
        }
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.create({
        data: {
            userId: tenantUserId,
            estoqueInsumoId: insumo.id,
            secao: opts.secao,
            unidade: opts.unidade,
            ordem: opts.ordem,
            ativo: true
        }
    });
    return {
        estoqueInsumoId: insumo.id,
        tenantUserId
    };
}
}),
"[project]/Demo-2/src/lib/nfe/ui-labels.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Demo-2/src/lib/nfe/lojas.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/ui-labels.ts [app-route] (ecmascript)");
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
}),
"[project]/Demo-2/src/lib/nfe/importar-saldo-parse.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Parser puro do saldo da planilha CMV (sem Prisma).
 * Colunas: B=produto, E/AF=unidade, AE=qtd final, AG=custo médio.
 * Recálculo: (G+K+N+Q+T+W)/(D+I+L+O+R+U) quando AG inválido.
 */ __turbopack_context__.s([
    "buscarCustoAgAbasAnteriores",
    ()=>buscarCustoAgAbasAnteriores,
    "cellNum",
    ()=>cellNum,
    "competenciaFromAbaNome",
    ()=>competenciaFromAbaNome,
    "fimCompetenciaUtc",
    ()=>fimCompetenciaUtc,
    "isCustoPlanilhaValido",
    ()=>isCustoPlanilhaValido,
    "lerSaldoDoBuffer",
    ()=>lerSaldoDoBuffer,
    "mesesEntreCompetencias",
    ()=>mesesEntreCompetencias,
    "parseSaldoDaAba",
    ()=>parseSaldoDaAba,
    "recalcularCustoLinha",
    ()=>recalcularCustoLinha
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/xlsx/xlsx.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$planilha$2d$secoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/importar-planilha-secoes.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/normalize.ts [app-route] (ecmascript)");
;
;
;
/** Colunas 0-based */ const COL_QTD_INI = 3; // D
const COL_VAL_INI = 6; // G
const COL_COMPRAS_QTD = [
    8,
    11,
    14,
    17,
    20
]; // I L O R U
const COL_COMPRAS_VAL = [
    10,
    13,
    16,
    19,
    22
]; // K N Q T W
const COL_QTD = 30; // AE
const COL_CUSTO = 32; // AG
const MESES_PT = {
    janeiro: 1,
    fevereiro: 2,
    marco: 3,
    março: 3,
    abril: 4,
    maio: 5,
    junho: 6,
    julho: 7,
    agosto: 8,
    setembro: 9,
    outubro: 10,
    novembro: 11,
    dezembro: 12,
    jan: 1,
    fev: 2,
    mar: 3,
    abr: 4,
    mai: 5,
    jun: 6,
    jul: 7,
    ago: 8,
    set: 9,
    out: 10,
    nov: 11,
    dez: 12
};
function cellNum(ws, r, c) {
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].encode_cell({
        r,
        c
    });
    const cell = ws[ref];
    if (!cell) return null;
    if (cell.t === 'e') return null;
    const rawW = cell.w != null ? String(cell.w).trim() : '';
    if (/^#(DIV\/0!|N\/A|VALUE!|REF!|NAME\?|NUM!|NULL!)/i.test(rawW)) return null;
    if (typeof cell.v === 'number' && Number.isFinite(cell.v)) return cell.v;
    if (rawW) {
        const n = Number(rawW.replace(/\./g, '').replace(',', '.'));
        return Number.isFinite(n) ? n : null;
    }
    if (cell.v != null) {
        const n = Number(cell.v);
        return Number.isFinite(n) ? n : null;
    }
    return null;
}
function isCustoPlanilhaValido(custo) {
    return custo != null && Number.isFinite(custo) && custo > 0;
}
function recalcularCustoLinha(ws, r) {
    let num = 0;
    let den = 0;
    const g = cellNum(ws, r, COL_VAL_INI);
    if (g != null && g > 0) num += g;
    const d = cellNum(ws, r, COL_QTD_INI);
    if (d != null && d > 0) den += d;
    for(let i = 0; i < COL_COMPRAS_VAL.length; i++){
        const v = cellNum(ws, r, COL_COMPRAS_VAL[i]);
        const q = cellNum(ws, r, COL_COMPRAS_QTD[i]);
        if (v != null && v > 0) num += v;
        if (q != null && q > 0) den += q;
    }
    if (!(num > 0) || !(den > 0)) return null;
    const u = num / den;
    return Number.isFinite(u) && u > 0 ? Math.round(u * 100) / 100 : null;
}
function fimCompetenciaUtc(competencia) {
    const [y, m] = competencia.split('-').map(Number);
    if (!y || !m) throw new Error(`competência inválida: ${competencia}`);
    return new Date(Date.UTC(y, m, 1));
}
function competenciaFromAbaNome(nome) {
    const raw = String(nome || '').trim();
    if (!raw) return null;
    const iso = raw.match(/(20\d{2})\s*[-/]\s*(\d{1,2})/);
    if (iso) {
        const y = Number(iso[1]);
        const m = Number(iso[2]);
        if (m >= 1 && m <= 12) return `${y}-${String(m).padStart(2, '0')}`;
    }
    const norm = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const ym = norm.match(/(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\s*[\/\-\s]*?(20\d{2})/);
    if (ym) {
        const mes = MESES_PT[ym[1]];
        if (mes) return `${ym[2]}-${String(mes).padStart(2, '0')}`;
    }
    return null;
}
function mesesEntreCompetencias(de, ate) {
    const [y1, m1] = de.split('-').map(Number);
    const [y2, m2] = ate.split('-').map(Number);
    return (y2 - y1) * 12 + (m2 - m1);
}
function parseSaldoDaAba(ws) {
    const ref = ws['!ref'];
    if (!ref) return [];
    const range = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].decode_range(ref);
    const out = [];
    let secaoAtual = null;
    for(let r = range.s.r; r <= range.e.r; r++){
        const ancora = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$planilha$2d$secoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectarAncoraSecao"])(ws, r);
        if (ancora) {
            secaoAtual = ancora;
            continue;
        }
        const nomeB = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$planilha$2d$secoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cellStr"])(ws, r, 1);
        if (nomeB && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$planilha$2d$secoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isFimBlocoInventario"])(nomeB)) {
            secaoAtual = null;
            continue;
        }
        if (!secaoAtual) continue;
        const prod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$planilha$2d$secoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["lerLinhaProduto"])(ws, r);
        if (!prod) continue;
        // AE null → trata como 0 (mostra zerados); número 0 entra normalmente
        const qtdRaw = cellNum(ws, r, COL_QTD);
        const qtdFinal = qtdRaw == null ? 0 : qtdRaw;
        const custoRaw = cellNum(ws, r, COL_CUSTO);
        const custoPlanilha = isCustoPlanilhaValido(custoRaw) ? custoRaw : null;
        const custoRecalculado = custoPlanilha != null ? null : recalcularCustoLinha(ws, r);
        out.push({
            linha: r + 1,
            nome: prod.nome,
            secao: secaoAtual,
            unidadeRaw: prod.unidadeRaw,
            qtdFinal,
            custoPlanilha,
            custoRecalculado,
            custoMedio: custoPlanilha,
            custoOrigem: custoPlanilha != null ? 'PLANILHA' : null,
            custoOrigemDetalhe: null
        });
    }
    return out;
}
function lerSaldoDoBuffer(buffer, abaNome) {
    const wb = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["read"](buffer, {
        type: 'array',
        cellDates: true
    });
    const ws = wb.Sheets[abaNome];
    if (!ws) throw new Error(`Aba "${abaNome}" não encontrada`);
    return parseSaldoDaAba(ws);
}
function buscarCustoAgAbasAnteriores(buffer, competenciaAtual, nomesProduto) {
    const wb = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["read"](buffer, {
        type: 'array',
        cellDates: true
    });
    const alvos = new Map(nomesProduto.map((n)=>[
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizarDescricao"])(n),
            n
        ]));
    const abas = [];
    for (const nome of wb.SheetNames){
        const comp = competenciaFromAbaNome(nome);
        if (!comp || comp >= competenciaAtual) continue;
        abas.push({
            nome,
            competencia: comp
        });
    }
    abas.sort((a, b)=>b.competencia.localeCompare(a.competencia));
    const found = new Map();
    const pending = new Set(alvos.keys());
    for (const aba of abas){
        if (pending.size === 0) break;
        const ws = wb.Sheets[aba.nome];
        if (!ws) continue;
        const linhas = parseSaldoDaAba(ws);
        for (const l of linhas){
            const custo = isCustoPlanilhaValido(l.custoPlanilha) ? l.custoPlanilha : isCustoPlanilhaValido(l.custoRecalculado) ? l.custoRecalculado : null;
            if (custo == null) continue;
            const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizarDescricao"])(l.nome);
            if (!pending.has(key)) continue;
            const mesesAtraso = mesesEntreCompetencias(aba.competencia, competenciaAtual);
            found.set(key, {
                custo,
                aba: aba.nome,
                competencia: aba.competencia,
                mesesAtraso,
                custoAntigo: mesesAtraso > 3
            });
            pending.delete(key);
        }
    }
    const byOriginal = new Map();
    for (const [norm, original] of alvos){
        const hit = found.get(norm);
        if (hit) byOriginal.set(original, hit);
    }
    return byOriginal;
}
}),
"[project]/Demo-2/src/lib/nfe/importar-saldo-custo-resolve.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Resolução pura de custo do saldo (sem Prisma).
 */ __turbopack_context__.s([
    "resolverUmCusto",
    ()=>resolverUmCusto
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/lojas.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/ui-labels.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/importar-saldo-parse.ts [app-route] (ecmascript)");
;
;
function fmtDataBr(d) {
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = d.getUTCFullYear();
    return `${dd}/${mm}/${yyyy}`;
}
function detalheCompra(hit) {
    return `NF ${hit.numero} ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeLabel"])(hit.storeSlug)} ${fmtDataBr(hit.dataEntrada)}`;
}
function resolverUmCusto(params) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isCustoPlanilhaValido"])(params.custoRecalculado ?? null)) {
        return {
            custoMedio: params.custoRecalculado,
            custoOrigem: 'PLANILHA_RECALCULADO',
            custoOrigemDetalhe: 'Planilha (recalculado)'
        };
    }
    const id = params.estoqueInsumoId;
    if (id) {
        const loja = params.comprasLoja?.get(id);
        if (loja) {
            return {
                custoMedio: loja.custo,
                custoOrigem: 'ULTIMA_COMPRA_LOJA',
                custoOrigemDetalhe: detalheCompra(loja)
            };
        }
    }
    const ag = params.agAnterior?.get(params.nomeProduto);
    if (ag) {
        return {
            custoMedio: ag.custo,
            custoOrigem: 'PLANILHA_MES_ANTERIOR',
            custoOrigemDetalhe: ag.custoAntigo ? `${ag.aba} AG · custo antigo (>3 meses)` : `${ag.aba} AG`,
            custoAntigo: ag.custoAntigo
        };
    }
    if (id) {
        const grupo = params.comprasGrupo?.get(id);
        if (grupo) {
            return {
                custoMedio: grupo.custo,
                custoOrigem: 'ULTIMA_COMPRA_GRUPO',
                custoOrigemDetalhe: detalheCompra(grupo)
            };
        }
        const outra = params.outraLoja?.get(id);
        if (outra) {
            return {
                custoMedio: outra.custo,
                custoOrigem: 'OUTRA_LOJA',
                custoOrigemDetalhe: `Saldo ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeLabel"])(outra.storeSlug)} ${params.competencia}`
            };
        }
        const teo = params.cmvTeorico?.get(id);
        if (teo) {
            return {
                custoMedio: teo.custo,
                custoOrigem: 'CMV_TEORICO',
                custoOrigemDetalhe: `CMV teórico: ${teo.nomeIng}`
            };
        }
    }
    return {
        custoMedio: null,
        custoOrigem: 'PENDENTE',
        custoOrigemDetalhe: null
    };
}
}),
"[project]/Demo-2/src/lib/nfe/importar-saldo.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Importação de SALDO (estoque final + custo médio) da planilha CMV DESPERDÍCIO.
 * Parser puro em importar-saldo-parse.ts; aqui: match, fallbacks de custo e persistência.
 */ __turbopack_context__.s([
    "confirmarSaldo",
    ()=>confirmarSaldo,
    "contadoresPreviewSaldo",
    ()=>contadoresPreviewSaldo,
    "marcarForaDoCatalogoCmv",
    ()=>marcarForaDoCatalogoCmv,
    "preencherCustosPendentesFechamento",
    ()=>preencherCustosPendentesFechamento,
    "previewSaldoComCatalogo",
    ()=>previewSaldoComCatalogo,
    "resolverCustosSaldo",
    ()=>resolverCustosSaldo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2f$catalogo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/estoque/catalogo.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$catalogo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/importar-catalogo.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$catalogo$2d$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/importar-catalogo-parse.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$custo$2d$resolve$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/importar-saldo-custo-resolve.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/normalize.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/importar-saldo-parse.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
function previewSaldoComCatalogo(linhas, catalogo) {
    return linhas.map((l)=>{
        const match = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2f$catalogo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["matchCatalogoPorNome"])(l.nome, catalogo);
        if (match.status === 'nao_encontrado' || !match.item) {
            return {
                ...l,
                status: 'nao_encontrado',
                statusExibicao: 'nao_encontrado'
            };
        }
        return {
            ...l,
            status: match.status,
            statusExibicao: match.status,
            estoqueInsumoId: match.item.id,
            estoqueNome: match.item.nome,
            score: match.score
        };
    });
}
async function marcarForaDoCatalogoCmv(tenantUserId, itens) {
    const { idsNoCatalogoCmv } = await __turbopack_context__.A("[project]/Demo-2/src/lib/nfe/cmv-catalogo.ts [app-route] (ecmascript, async loader)");
    const inCfg = await idsNoCatalogoCmv(tenantUserId);
    return itens.map((i)=>{
        if (!i.estoqueInsumoId || i.status === 'nao_encontrado') return i;
        const fora = !inCfg.has(i.estoqueInsumoId);
        if (!fora) return {
            ...i,
            foraDoCatalogoCmv: false
        };
        return {
            ...i,
            foraDoCatalogoCmv: true,
            statusExibicao: i.statusExibicao === 'custo_pendente' ? 'custo_pendente' : 'fora_do_catalogo'
        };
    });
}
function statusExibicaoDe(item) {
    if (item.status === 'nao_encontrado') return 'nao_encontrado';
    if (item.custoOrigem === 'PENDENTE' || item.qtdFinal > 0 && item.custoMedio == null) {
        return 'custo_pendente';
    }
    if (item.foraDoCatalogoCmv) return 'fora_do_catalogo';
    return item.status;
}
async function buscarUltimasComprasAprovadas(params) {
    const mesmaLoja = new Map();
    const qualquerLoja = new Map();
    if (params.estoqueInsumoIds.length === 0) return {
        mesmaLoja,
        qualquerLoja
    };
    const itens = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].nfeItem.findMany({
        where: {
            estoqueInsumoId: {
                in: params.estoqueInsumoIds
            },
            status: 'MAPEADO',
            quantidadeConvertida: {
                gt: 0
            },
            valorLiquido: {
                gt: 0
            },
            nota: {
                userId: params.tenantUserId,
                status: 'APROVADA',
                dataEntrada: {
                    lt: params.fim
                }
            }
        },
        select: {
            estoqueInsumoId: true,
            valorLiquido: true,
            quantidadeConvertida: true,
            nota: {
                select: {
                    numero: true,
                    storeSlug: true,
                    dataEntrada: true
                }
            }
        },
        orderBy: {
            nota: {
                dataEntrada: 'desc'
            }
        }
    });
    for (const it of itens){
        if (!it.estoqueInsumoId) continue;
        const q = Number(it.quantidadeConvertida);
        const v = Number(it.valorLiquido);
        if (!(q > 0) || !(v > 0)) continue;
        const custo = v / q;
        if (!(custo > 0) || !Number.isFinite(custo)) continue;
        const hit = {
            custo,
            storeSlug: it.nota.storeSlug,
            numero: it.nota.numero,
            dataEntrada: it.nota.dataEntrada
        };
        if (!qualquerLoja.has(it.estoqueInsumoId)) {
            qualquerLoja.set(it.estoqueInsumoId, hit);
        }
        if (it.nota.storeSlug === params.storeSlug && !mesmaLoja.has(it.estoqueInsumoId)) {
            mesmaLoja.set(it.estoqueInsumoId, hit);
        }
    }
    return {
        mesmaLoja,
        qualquerLoja
    };
}
async function buscarCustoOutraLoja(params) {
    const out = new Map();
    if (!params.estoqueInsumoIds.length) return out;
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.findMany({
        where: {
            userId: params.tenantUserId,
            competencia: params.competencia,
            estoqueInsumoId: {
                in: params.estoqueInsumoIds
            },
            storeSlug: {
                not: params.storeSlug
            },
            custoMedio: {
                gt: 0
            }
        },
        select: {
            estoqueInsumoId: true,
            storeSlug: true,
            custoMedio: true,
            updatedAt: true
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
    for (const r of rows){
        if (out.has(r.estoqueInsumoId)) continue;
        const c = Number(r.custoMedio);
        if (c > 0) out.set(r.estoqueInsumoId, {
            custo: c,
            storeSlug: r.storeSlug
        });
    }
    return out;
}
function extrairIngredientesTeoricos(data) {
    if (!data || typeof data !== 'object') return [];
    const o = data;
    const list = Array.isArray(o.ingredientes) ? o.ingredientes : [];
    const out = [];
    for (const raw of list){
        if (!raw || typeof raw !== 'object') continue;
        const i = raw;
        const nome = String(i.nome || '').trim();
        const preco = Number(i.precoPorKg);
        if (!nome || !(preco > 0)) continue;
        out.push({
            id: String(i.id || nome),
            nome,
            precoPorKg: preco,
            unidade: i.unidade != null ? String(i.unidade) : undefined
        });
    }
    return out;
}
async function buscarCustoCmvTeorico(params) {
    const out = new Map();
    const record = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvStoreData.findFirst({
        where: {
            OR: [
                {
                    userId: params.tenantUserId,
                    storeSlug: params.storeSlug
                },
                {
                    storeSlug: params.storeSlug
                }
            ]
        },
        orderBy: {
            updatedAt: 'desc'
        },
        select: {
            data: true
        }
    });
    if (!record) return out;
    const ings = extrairIngredientesTeoricos(record.data);
    if (!ings.length) return out;
    for (const [insumoId, nome] of params.nomesPorInsumoId){
        const alvo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizarDescricao"])(nome);
        let best = null;
        for (const ing of ings){
            const n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizarDescricao"])(ing.nome);
            if (n === alvo) {
                best = {
                    score: 1,
                    ing
                };
                break;
            }
            if (n.includes(alvo) || alvo.includes(n)) {
                const score = Math.min(n.length, alvo.length) / Math.max(n.length, alvo.length);
                if (!best || score > best.score) best = {
                    score,
                    ing
                };
            }
        }
        if (best && best.score >= 0.7) {
            out.set(insumoId, {
                custo: best.ing.precoPorKg,
                nomeIng: best.ing.nome
            });
        }
    }
    return out;
}
async function resolverCustosSaldo(params) {
    const precisa = params.itens.filter((i)=>i.qtdFinal > 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isCustoPlanilhaValido"])(i.custoPlanilha));
    const base = params.itens.map((i)=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isCustoPlanilhaValido"])(i.custoPlanilha)) {
            const next = {
                ...i,
                custoMedio: i.custoPlanilha,
                custoOrigem: 'PLANILHA',
                custoOrigemDetalhe: null,
                custoAntigo: false
            };
            next.statusExibicao = statusExibicaoDe(next);
            return next;
        }
        if (!(i.qtdFinal > 0)) {
            const next = {
                ...i,
                custoMedio: null,
                custoOrigem: null,
                custoOrigemDetalhe: null,
                custoAntigo: false
            };
            next.statusExibicao = statusExibicaoDe(next);
            return next;
        }
        return {
            ...i
        };
    });
    const comId = precisa.filter((i)=>i.estoqueInsumoId);
    const ids = [
        ...new Set(comId.map((i)=>i.estoqueInsumoId))
    ];
    const fim = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fimCompetenciaUtc"])(params.competencia);
    const nomesSemCusto = precisa.map((i)=>i.nome);
    const agAnterior = params.planilhaBuffer ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buscarCustoAgAbasAnteriores"])(params.planilhaBuffer, params.competencia, nomesSemCusto) : new Map();
    const [compras, outraLoja, cmvTeorico] = await Promise.all([
        buscarUltimasComprasAprovadas({
            tenantUserId: params.tenantUserId,
            storeSlug: params.storeSlug,
            estoqueInsumoIds: ids,
            fim
        }),
        buscarCustoOutraLoja({
            tenantUserId: params.tenantUserId,
            storeSlug: params.storeSlug,
            competencia: params.competencia,
            estoqueInsumoIds: ids
        }),
        buscarCustoCmvTeorico({
            tenantUserId: params.tenantUserId,
            storeSlug: params.storeSlug,
            nomesPorInsumoId: new Map(comId.map((i)=>[
                    i.estoqueInsumoId,
                    i.estoqueNome || i.nome
                ]))
        })
    ]);
    return base.map((i)=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isCustoPlanilhaValido"])(i.custoPlanilha) || !(i.qtdFinal > 0)) {
            return i;
        }
        const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$custo$2d$resolve$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolverUmCusto"])({
            nomeProduto: i.nome,
            custoRecalculado: i.custoRecalculado,
            estoqueInsumoId: i.estoqueInsumoId,
            competencia: params.competencia,
            agAnterior,
            comprasLoja: compras.mesmaLoja,
            comprasGrupo: compras.qualquerLoja,
            outraLoja,
            cmvTeorico
        });
        const next = {
            ...i,
            ...resolved
        };
        next.statusExibicao = statusExibicaoDe(next);
        return next;
    });
}
async function preencherCustosPendentesFechamento(params) {
    const precisa = params.itens.filter((i)=>i.qtd > 0 && (i.custoOrigem === 'PENDENTE' || i.custoMedio == null || !(Number(i.custoMedio) > 0)));
    if (!precisa.length) return 0;
    const ids = precisa.map((i)=>i.estoqueInsumoId);
    const fim = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fimCompetenciaUtc"])(params.competenciaSaldo);
    const [compras, outraLoja, cmvTeorico] = await Promise.all([
        buscarUltimasComprasAprovadas({
            tenantUserId: params.tenantUserId,
            storeSlug: params.storeSlug,
            estoqueInsumoIds: ids,
            fim
        }),
        buscarCustoOutraLoja({
            tenantUserId: params.tenantUserId,
            storeSlug: params.storeSlug,
            competencia: params.competenciaSaldo,
            estoqueInsumoIds: ids
        }),
        buscarCustoCmvTeorico({
            tenantUserId: params.tenantUserId,
            storeSlug: params.storeSlug,
            nomesPorInsumoId: new Map(precisa.map((i)=>[
                    i.estoqueInsumoId,
                    i.nome
                ]))
        })
    ]);
    let updated = 0;
    for (const it of precisa){
        const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$custo$2d$resolve$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolverUmCusto"])({
            nomeProduto: it.nome,
            estoqueInsumoId: it.estoqueInsumoId,
            competencia: params.competenciaSaldo,
            comprasLoja: compras.mesmaLoja,
            comprasGrupo: compras.qualquerLoja,
            outraLoja,
            cmvTeorico
        });
        if (resolved.custoMedio == null || resolved.custoOrigem === 'PENDENTE') {
            // marca pendente se ainda sem custo
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.updateMany({
                where: {
                    userId: params.tenantUserId,
                    storeSlug: params.storeSlug,
                    competencia: params.competenciaSaldo,
                    estoqueInsumoId: it.estoqueInsumoId
                },
                data: {
                    custoOrigem: 'PENDENTE',
                    custoOrigemDetalhe: null
                }
            });
            continue;
        }
        const r = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.updateMany({
            where: {
                userId: params.tenantUserId,
                storeSlug: params.storeSlug,
                competencia: params.competenciaSaldo,
                estoqueInsumoId: it.estoqueInsumoId
            },
            data: {
                custoMedio: resolved.custoMedio,
                custoOrigem: resolved.custoOrigem,
                custoOrigemDetalhe: resolved.custoOrigemDetalhe
            }
        });
        updated += r.count;
    }
    return updated;
}
function contadoresPreviewSaldo(itens) {
    const porSecao = {
        MATERIA_PRIMA: {
            total: 0,
            casados: 0,
            sugeridos: 0,
            naoEncontrados: 0,
            custoPendente: 0,
            foraDoCatalogo: 0
        },
        EMBALAGEM: {
            total: 0,
            casados: 0,
            sugeridos: 0,
            naoEncontrados: 0,
            custoPendente: 0,
            foraDoCatalogo: 0
        },
        BEBIDA: {
            total: 0,
            casados: 0,
            sugeridos: 0,
            naoEncontrados: 0,
            custoPendente: 0,
            foraDoCatalogo: 0
        }
    };
    let casados = 0;
    let sugeridos = 0;
    let naoEncontrados = 0;
    let custoPendente = 0;
    let foraDoCatalogo = 0;
    let qtdSemCorrespondencia = 0;
    for (const i of itens){
        const bucket = porSecao[i.secao];
        bucket.total += 1;
        if (i.status === 'casado') {
            casados += 1;
            bucket.casados += 1;
        } else if (i.status === 'sugerido') {
            sugeridos += 1;
            bucket.sugeridos += 1;
        } else {
            naoEncontrados += 1;
            bucket.naoEncontrados += 1;
            if (i.qtdFinal > 0) qtdSemCorrespondencia += 1;
        }
        if (i.statusExibicao === 'custo_pendente' || i.custoOrigem === 'PENDENTE') {
            custoPendente += 1;
            bucket.custoPendente += 1;
        }
        if (i.foraDoCatalogoCmv) {
            foraDoCatalogo += 1;
            bucket.foraDoCatalogo += 1;
        }
    }
    return {
        total: itens.length,
        casados,
        sugeridos,
        naoEncontrados,
        custoPendente,
        foraDoCatalogo,
        qtdSemCorrespondencia,
        porSecao
    };
}
async function confirmarSaldo(params) {
    const { ensureCmvRealInsumoConfig, secaoFromCategoriaId, secaoFromNomeProduto, unidadeFromEstoque } = await __turbopack_context__.A("[project]/Demo-2/src/lib/nfe/cmv-catalogo.ts [app-route] (ecmascript, async loader)");
    let upserted = 0;
    let configsCriadas = 0;
    for (const it of params.itens){
        if (!it.estoqueInsumoId) continue;
        {
            const insumo = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findUnique({
                where: {
                    id: it.estoqueInsumoId
                },
                select: {
                    unidade: true,
                    nome: true,
                    categoriaId: true
                }
            });
            const secao = it.secao ?? (()=>{
                const byNome = secaoFromNomeProduto(insumo?.nome || '');
                return byNome !== 'MATERIA_PRIMA' ? byNome : secaoFromCategoriaId(insumo?.categoriaId);
            })();
            const { created } = await ensureCmvRealInsumoConfig({
                tenantUserId: params.tenantUserId,
                estoqueInsumoId: it.estoqueInsumoId,
                secao,
                unidade: it.unidade ?? unidadeFromEstoque(insumo?.unidade)
            });
            if (created) configsCriadas += 1;
        }
        const custoOrigem = it.custoOrigem ?? ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2d$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isCustoPlanilhaValido"])(it.custoMedio) ? 'PLANILHA' : 'PENDENTE');
        await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.upsert({
            where: {
                userId_storeSlug_competencia_estoqueInsumoId: {
                    userId: params.tenantUserId,
                    storeSlug: params.storeSlug,
                    competencia: params.competencia,
                    estoqueInsumoId: it.estoqueInsumoId
                }
            },
            create: {
                userId: params.tenantUserId,
                storeSlug: params.storeSlug,
                competencia: params.competencia,
                estoqueInsumoId: it.estoqueInsumoId,
                qtdFinal: it.qtdFinal,
                custoMedio: it.custoMedio,
                custoOrigem,
                custoOrigemDetalhe: it.custoOrigemDetalhe ?? null,
                origem: 'IMPORTACAO'
            },
            update: {
                qtdFinal: it.qtdFinal,
                custoMedio: it.custoMedio,
                custoOrigem,
                custoOrigemDetalhe: it.custoOrigemDetalhe ?? null,
                origem: 'IMPORTACAO'
            }
        });
        upserted++;
    }
    return {
        upserted,
        configsCriadas
    };
}
;
}),
"[project]/Demo-2/src/lib/nfe/notas-list-query.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Query string compartilhada entre lista e detalhe de notas CMV Real. */ __turbopack_context__.s([
    "buildNotasListQuery",
    ()=>buildNotasListQuery,
    "notasListHref",
    ()=>notasListHref,
    "parseNotasListFilters",
    ()=>parseNotasListFilters
]);
const STATUS_OK = new Set([
    'EM_REVISAO',
    'APROVADA',
    'IGNORADA'
]);
function parseNotasListFilters(params, defaults) {
    const agora = new Date();
    const statusRaw = params.get('status') || 'EM_REVISAO';
    const status = STATUS_OK.has(statusRaw) ? statusRaw : 'EM_REVISAO';
    const mesRaw = Number(params.get('mes'));
    const anoRaw = Number(params.get('ano'));
    const mes = Number.isInteger(mesRaw) && mesRaw >= 1 && mesRaw <= 12 ? mesRaw : defaults?.mes ?? agora.getMonth() + 1;
    const ano = Number.isInteger(anoRaw) && anoRaw >= 2000 && anoRaw <= 2100 ? anoRaw : defaults?.ano ?? agora.getFullYear();
    const storeSlug = params.get('storeSlug') || '';
    return {
        status,
        storeSlug,
        mes,
        ano
    };
}
function buildNotasListQuery(filters) {
    const q = new URLSearchParams();
    if (filters.status) q.set('status', filters.status);
    if (filters.storeSlug) q.set('storeSlug', filters.storeSlug);
    if (filters.mes != null) q.set('mes', String(filters.mes));
    if (filters.ano != null) q.set('ano', String(filters.ano));
    return q.toString();
}
function notasListHref(filters) {
    const qs = buildNotasListQuery(filters);
    return qs ? `/cmv-real/notas?${qs}` : '/cmv-real/notas';
}
}),
"[project]/Demo-2/src/lib/nfe/transferencia-concilicao.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/lojas.ts [app-route] (ecmascript) <locals>");
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
function emitenteEhLojaCalenzano(cnpj, storeCnpjBySlug = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["STORE_CNPJ_BY_SLUG"]) {
    const digits = normalizarCnpjDigits(cnpj);
    if (digits.length < 8) return false;
    if (cnpjRaiz(digits) === __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CALENZANO_CNPJ_RAIZ"]) return true;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["storeSlugFromCnpj"])(digits)) return true;
    const raiz = cnpjRaiz(digits);
    for (const c of Object.values(storeCnpjBySlug)){
        if (c && cnpjRaiz(c) === raiz) return true;
    }
    return false;
}
function classificarNfTransferencia(input) {
    const map = input.storeCnpjBySlug ?? __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["STORE_CNPJ_BY_SLUG"];
    const origemSlug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["storeSlugFromCnpj"])(input.emitenteCnpj, map);
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
}),
"[project]/Demo-2/src/lib/nfe/transferencia-documento.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Persistência de CmvTransferencia (formulário manual).
 * Import Saipos/NF fica para a etapa (f).
 */ __turbopack_context__.s([
    "buscarCustoTransferencia",
    ()=>buscarCustoTransferencia,
    "competenciaEstaFechada",
    ()=>competenciaEstaFechada,
    "excluirTransferencia",
    ()=>excluirTransferencia,
    "itensDoLado",
    ()=>itensDoLado,
    "listarTransferencias",
    ()=>listarTransferencias,
    "obterTransferencia",
    ()=>obterTransferencia,
    "registrarLadoManual",
    ()=>registrarLadoManual
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$dates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/dates.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/lojas.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$concilicao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/transferencia-concilicao.ts [app-route] (ecmascript)");
;
;
;
;
;
function decimal(n) {
    return new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["Prisma"].Decimal(n);
}
function n(v) {
    return Number(v ?? 0);
}
async function competenciaEstaFechada(userId, storeSlug, competencia) {
    const f = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvFechamento.findUnique({
        where: {
            userId_storeSlug_competencia: {
                userId,
                storeSlug,
                competencia
            }
        },
        select: {
            status: true
        }
    });
    return f?.status === 'FECHADO';
}
async function buscarCustoTransferencia(params) {
    const [ultimoOrigem, saldoIni, ultimoQualquer] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvLancamento.findFirst({
            where: {
                userId: params.userId,
                storeSlug: params.lojaOrigem,
                estoqueInsumoId: params.estoqueInsumoId,
                tipo: {
                    in: [
                        'COMPRA_NFE',
                        'COMPRA_MANUAL'
                    ]
                },
                quantidade: {
                    gt: 0
                },
                valorTotal: {
                    gt: 0
                }
            },
            orderBy: {
                data: 'desc'
            },
            select: {
                quantidade: true,
                valorTotal: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.findUnique({
            where: {
                userId_storeSlug_competencia_estoqueInsumoId: {
                    userId: params.userId,
                    storeSlug: params.lojaOrigem,
                    competencia: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["competenciaAnterior"])(params.competencia),
                    estoqueInsumoId: params.estoqueInsumoId
                }
            },
            select: {
                custoMedio: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvLancamento.findFirst({
            where: {
                userId: params.userId,
                estoqueInsumoId: params.estoqueInsumoId,
                tipo: {
                    in: [
                        'COMPRA_NFE',
                        'COMPRA_MANUAL'
                    ]
                },
                quantidade: {
                    gt: 0
                },
                valorTotal: {
                    gt: 0
                }
            },
            orderBy: {
                data: 'desc'
            },
            select: {
                quantidade: true,
                valorTotal: true
            }
        })
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$concilicao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolverCustoUnitario"])({
        ultimoCustoOrigem: ultimoOrigem && n(ultimoOrigem.quantidade) > 0 ? n(ultimoOrigem.valorTotal) / n(ultimoOrigem.quantidade) : null,
        custoEstoqueInicialOrigem: saldoIni?.custoMedio != null ? n(saldoIni.custoMedio) : null,
        ultimoCustoQualquerLoja: ultimoQualquer && n(ultimoQualquer.quantidade) > 0 ? n(ultimoQualquer.valorTotal) / n(ultimoQualquer.quantidade) : null,
        custoInformado: params.custoInformado
    });
}
function serializar(doc) {
    return {
        id: doc.id,
        numeroDocumento: doc.numeroDocumento,
        data: doc.data.toISOString(),
        competencia: doc.competencia,
        lojaOrigem: doc.lojaOrigem,
        lojaDestino: doc.lojaDestino,
        status: doc.status,
        origem: doc.origem,
        observacao: doc.observacao,
        lados: doc.lados.map((l)=>({
                tipo: l.tipo,
                storeSlug: l.storeSlug,
                rascunho: l.rascunho,
                registradoEm: l.registradoEm ? l.registradoEm.toISOString() : null,
                itens: l.itens.map((it)=>({
                        id: it.id,
                        estoqueInsumoId: it.estoqueInsumoId,
                        nome: '',
                        quantidade: n(it.quantidade),
                        unidade: it.unidade,
                        custoUnitario: it.custoUnitario != null ? n(it.custoUnitario) : null,
                        valorTotal: it.valorTotal != null ? n(it.valorTotal) : null,
                        custoOrigem: it.custoOrigem
                    }))
            }))
    };
}
const includeDoc = {
    lados: {
        include: {
            itens: true
        },
        orderBy: {
            tipo: 'asc'
        }
    }
};
async function reconciliarELancar(params) {
    const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferencia.findFirst({
        where: {
            id: params.transferenciaId,
            userId: params.userId,
            excluidoEm: null
        },
        include: includeDoc
    });
    if (!doc) return null;
    const saida = doc.lados.find((l)=>l.tipo === 'SAIDA');
    const entrada = doc.lados.find((l)=>l.tipo === 'ENTRADA');
    const st = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$concilicao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["statusDocumento"])({
        entradaRegistrada: Boolean(entrada && !entrada.rascunho),
        saidaConfirmada: Boolean(saida && !saida.rascunho),
        itensSaida: (saida?.itens ?? []).map((i)=>({
                estoqueInsumoId: i.estoqueInsumoId,
                quantidade: n(i.quantidade)
            })),
        itensEntrada: (entrada?.itens ?? []).map((i)=>({
                estoqueInsumoId: i.estoqueInsumoId,
                quantidade: n(i.quantidade)
            }))
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferencia.update({
        where: {
            id: doc.id
        },
        data: {
            status: st.status
        }
    });
    for (const lado of doc.lados){
        for (const item of lado.itens){
            if (lado.rascunho) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvLancamento.deleteMany({
                    where: {
                        transferenciaItemId: item.id
                    }
                });
                continue;
            }
            if (item.custoUnitario == null || item.valorTotal == null) continue;
            const tipo = lado.tipo === 'SAIDA' ? 'TRANSFERENCIA_SAIDA' : 'TRANSFERENCIA_ENTRADA';
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvLancamento.upsert({
                where: {
                    transferenciaItemId: item.id
                },
                create: {
                    userId: params.userId,
                    storeSlug: lado.storeSlug,
                    competencia: doc.competencia,
                    data: doc.data,
                    tipo,
                    estoqueInsumoId: item.estoqueInsumoId,
                    quantidade: item.quantidade,
                    unidade: item.unidade,
                    valorTotal: item.valorTotal,
                    transferenciaItemId: item.id,
                    lojaOrigem: doc.lojaOrigem,
                    lojaDestino: doc.lojaDestino,
                    observacao: `Transf. ${doc.numeroDocumento}`
                },
                update: {
                    quantidade: item.quantidade,
                    valorTotal: item.valorTotal,
                    data: doc.data,
                    competencia: doc.competencia
                }
            });
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferencia.findFirst({
        where: {
            id: doc.id
        },
        include: includeDoc
    });
}
async function listarTransferencias(params) {
    const where = {
        userId: params.userId,
        excluidoEm: null
    };
    if (params.competencia) where.competencia = params.competencia;
    if (params.status) {
        where.status = params.status;
    }
    if (params.storeSlugs && params.storeSlugs.length > 0) {
        where.OR = [
            {
                lojaOrigem: {
                    in: params.storeSlugs
                }
            },
            {
                lojaDestino: {
                    in: params.storeSlugs
                }
            }
        ];
    }
    const docs = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferencia.findMany({
        where,
        include: includeDoc,
        orderBy: {
            data: 'desc'
        },
        take: 200
    });
    return preencherNomesLista(docs.map(serializar));
}
function aplicarNomes(resumo, nomes) {
    return {
        ...resumo,
        lados: resumo.lados.map((l)=>({
                ...l,
                itens: l.itens.map((it)=>({
                        ...it,
                        nome: nomes.get(it.estoqueInsumoId) || it.nome || it.estoqueInsumoId
                    }))
            }))
    };
}
async function nomesDeItens(docs) {
    const ids = [
        ...new Set(docs.flatMap((d)=>d.lados.flatMap((l)=>l.itens.map((i)=>i.estoqueInsumoId))))
    ];
    if (ids.length === 0) return new Map();
    const insumos = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findMany({
        where: {
            id: {
                in: ids
            }
        },
        select: {
            id: true,
            nome: true
        }
    });
    return new Map(insumos.map((i)=>[
            i.id,
            i.nome
        ]));
}
async function preencherNomesLista(docs) {
    const nomes = await nomesDeItens(docs);
    return docs.map((d)=>aplicarNomes(d, nomes));
}
async function preencherNomes(resumo) {
    const nomes = await nomesDeItens([
        resumo
    ]);
    return aplicarNomes(resumo, nomes);
}
async function obterTransferencia(params) {
    const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferencia.findFirst({
        where: {
            id: params.id,
            userId: params.userId,
            excluidoEm: null
        },
        include: includeDoc
    });
    return doc ? preencherNomes(serializar(doc)) : null;
}
async function registrarLadoManual(params) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CMV_STORE_SLUGS"].includes(params.lojaOrigem)) {
        throw new Error('lojaOrigem inválida');
    }
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CMV_STORE_SLUGS"].includes(params.lojaDestino)) {
        throw new Error('lojaDestino inválida');
    }
    if (params.lojaOrigem === params.lojaDestino) {
        throw new Error('Origem e destino precisam ser lojas diferentes');
    }
    const numero = params.numeroDocumento.trim();
    if (!numero) throw new Error('Número do documento é obrigatório');
    if (!params.itens.length) throw new Error('Inclua ao menos um item');
    const competencia = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$dates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["competenciaFromDataEntrada"])(params.data);
    const storeDoLado = params.tipoLado === 'SAIDA' ? params.lojaOrigem : params.lojaDestino;
    if (await competenciaEstaFechada(params.userId, storeDoLado, competencia)) {
        throw new Error('Competência fechada — reabra para lançar');
    }
    const ids = [
        ...new Set(params.itens.map((i)=>i.estoqueInsumoId))
    ];
    const configs = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.findMany({
        where: {
            userId: params.userId,
            estoqueInsumoId: {
                in: ids
            },
            ativo: true
        }
    });
    const cfgBy = new Map(configs.map((c)=>[
            c.estoqueInsumoId,
            c
        ]));
    const resolvidos = [];
    for (const it of params.itens){
        const cfg = cfgBy.get(it.estoqueInsumoId);
        if (!cfg) throw new Error('Produto CMV não encontrado');
        if (!(it.quantidade > 0)) throw new Error('Quantidade inválida');
        const custo = await buscarCustoTransferencia({
            userId: params.userId,
            lojaOrigem: params.lojaOrigem,
            estoqueInsumoId: it.estoqueInsumoId,
            competencia,
            custoInformado: it.custoUnitario
        });
        if (custo.exigePreenchimento || custo.custo == null) {
            throw new Error('Custo manual obrigatório: sem histórico na origem nem em outra loja');
        }
        resolvidos.push({
            estoqueInsumoId: it.estoqueInsumoId,
            quantidade: it.quantidade,
            unidade: cfg.unidade,
            custo: custo.custo,
            valorTotal: Math.round(it.quantidade * custo.custo * 100) / 100,
            custoOrigem: custo.origem
        });
    }
    const existente = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferencia.findUnique({
        where: {
            userId_numeroDocumento_lojaOrigem_lojaDestino: {
                userId: params.userId,
                numeroDocumento: numero,
                lojaOrigem: params.lojaOrigem,
                lojaDestino: params.lojaDestino
            }
        },
        include: includeDoc
    });
    if (existente?.excluidoEm) {
        throw new Error('Já existe um documento excluído com este número');
    }
    let transferenciaId;
    if (!existente) {
        const created = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferencia.create({
            data: {
                userId: params.userId,
                numeroDocumento: numero,
                data: params.data,
                competencia,
                lojaOrigem: params.lojaOrigem,
                lojaDestino: params.lojaDestino,
                status: params.tipoLado === 'SAIDA' ? 'AGUARDANDO_ENTRADA' : 'AGUARDANDO_SAIDA',
                origem: 'MANUAL',
                observacao: params.observacao || null,
                criadoPorId: params.actorUserId,
                lados: {
                    create: {
                        tipo: params.tipoLado,
                        storeSlug: storeDoLado,
                        registradoPorId: params.actorUserId,
                        registradoEm: new Date(),
                        rascunho: false,
                        itens: {
                            create: resolvidos.map((it)=>({
                                    estoqueInsumoId: it.estoqueInsumoId,
                                    quantidade: decimal(it.quantidade),
                                    unidade: it.unidade,
                                    custoUnitario: decimal(it.custo),
                                    valorTotal: decimal(it.valorTotal),
                                    custoOrigem: it.custoOrigem
                                }))
                        }
                    }
                }
            }
        });
        transferenciaId = created.id;
    } else {
        const ja = existente.lados.find((l)=>l.tipo === params.tipoLado);
        if (ja && !ja.rascunho) {
            throw new Error('Este lado já foi registrado neste documento');
        }
        if (ja) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferenciaItem.deleteMany({
                where: {
                    ladoId: ja.id
                }
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferenciaLado.update({
                where: {
                    id: ja.id
                },
                data: {
                    rascunho: false,
                    registradoPorId: params.actorUserId,
                    registradoEm: new Date()
                }
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferenciaItem.createMany({
                data: resolvidos.map((it)=>({
                        ladoId: ja.id,
                        estoqueInsumoId: it.estoqueInsumoId,
                        quantidade: decimal(it.quantidade),
                        unidade: it.unidade,
                        custoUnitario: decimal(it.custo),
                        valorTotal: decimal(it.valorTotal),
                        custoOrigem: it.custoOrigem
                    }))
            });
        } else {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferenciaLado.create({
                data: {
                    transferenciaId: existente.id,
                    tipo: params.tipoLado,
                    storeSlug: storeDoLado,
                    registradoPorId: params.actorUserId,
                    registradoEm: new Date(),
                    rascunho: false,
                    itens: {
                        create: resolvidos.map((it)=>({
                                estoqueInsumoId: it.estoqueInsumoId,
                                quantidade: decimal(it.quantidade),
                                unidade: it.unidade,
                                custoUnitario: decimal(it.custo),
                                valorTotal: decimal(it.valorTotal),
                                custoOrigem: it.custoOrigem
                            }))
                    }
                }
            });
        }
        transferenciaId = existente.id;
    }
    const fresh = await reconciliarELancar({
        userId: params.userId,
        transferenciaId
    });
    if (!fresh) throw new Error('Falha ao gravar transferência');
    return serializar(fresh);
}
async function excluirTransferencia(params) {
    const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferencia.findFirst({
        where: {
            id: params.id,
            userId: params.userId,
            excluidoEm: null
        },
        include: includeDoc
    });
    if (!doc) throw new Error('Transferência não encontrada');
    if (doc.status === 'CONCILIADA') {
        throw new Error('Documento conciliado — não é possível excluir');
    }
    for (const lado of doc.lados){
        if (await competenciaEstaFechada(params.userId, lado.storeSlug, doc.competencia)) {
            throw new Error('Competência fechada — não é possível excluir');
        }
    }
    const itemIds = doc.lados.flatMap((l)=>l.itens.map((i)=>i.id));
    if (itemIds.length) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvLancamento.deleteMany({
            where: {
                transferenciaItemId: {
                    in: itemIds
                }
            }
        });
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvTransferencia.update({
        where: {
            id: doc.id
        },
        data: {
            excluidoEm: new Date(),
            excluidoPorId: params.actorUserId
        }
    });
}
function itensDoLado(doc, tipo) {
    const lado = doc.lados.find((l)=>l.tipo === tipo);
    return (lado?.itens ?? []).map((i)=>({
            estoqueInsumoId: i.estoqueInsumoId,
            quantidade: i.quantidade
        }));
}
}),
"[project]/Demo-2/src/lib/nfe/transferencias.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Transferências entre lojas: SAÍDA e ENTRADA são registros independentes.
 * Conciliação por (origem, destino, produto) em janela de 7 dias.
 */ __turbopack_context__.s([
    "conciliarTransferencias",
    ()=>conciliarTransferencias,
    "totaisTransferenciasLoja",
    ()=>totaisTransferenciasLoja,
    "transferenciaKey",
    ()=>key
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/lojas.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/ui-labels.ts [app-route] (ecmascript)");
;
;
const JANELA_MS = 7 * 24 * 60 * 60 * 1000;
const QTD_TOL = 0.05; // 5% ou absoluto pequeno
function num(d) {
    if (d == null) return 0;
    if (typeof d === 'number') return d;
    return Number(d);
}
function key(origem, destino, produto) {
    return `${origem}|${destino}|${produto}`;
}
async function conciliarTransferencias(params) {
    const lancs = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvLancamento.findMany({
        where: {
            userId: params.tenantUserId,
            competencia: params.competencia,
            tipo: {
                in: [
                    'TRANSFERENCIA_SAIDA',
                    'TRANSFERENCIA_ENTRADA'
                ]
            }
        },
        orderBy: {
            data: 'asc'
        }
    });
    const saidas = lancs.filter((l)=>l.tipo === 'TRANSFERENCIA_SAIDA');
    const entradas = lancs.filter((l)=>l.tipo === 'TRANSFERENCIA_ENTRADA');
    const matchedSaida = new Set();
    const matchedEntrada = new Set();
    const matches = [];
    for (const s of saidas){
        const destino = s.lojaDestino;
        if (!destino) continue;
        const origem = s.storeSlug;
        const candidatos = entradas.filter((e)=>{
            if (matchedEntrada.has(e.id)) return false;
            if (e.estoqueInsumoId !== s.estoqueInsumoId) return false;
            if (e.storeSlug !== destino) return false;
            const origE = e.lojaOrigem || '';
            if (origE && origE !== origem) return false;
            const dt = Math.abs(e.data.getTime() - s.data.getTime());
            return dt <= JANELA_MS;
        });
        if (candidatos.length === 0) continue;
        // melhor: menor diff de data, depois qtd
        candidatos.sort((a, b)=>{
            const da = Math.abs(a.data.getTime() - s.data.getTime());
            const db = Math.abs(b.data.getTime() - s.data.getTime());
            if (da !== db) return da - db;
            return Math.abs(num(a.quantidade) - num(s.quantidade)) - Math.abs(num(b.quantidade) - num(s.quantidade));
        });
        const best = candidatos[0];
        matchedSaida.add(s.id);
        matchedEntrada.add(best.id);
        matches.push({
            saidaId: s.id,
            entradaId: best.id,
            enviou: num(s.quantidade),
            recebeu: num(best.quantidade)
        });
    }
    const alertas = [];
    const slug = params.storeSlug;
    for (const s of saidas){
        if (s.storeSlug !== slug) continue;
        if (matchedSaida.has(s.id)) continue;
        const dest = s.lojaDestino || '?';
        alertas.push({
            tipo: 'SAIDA_SEM_ENTRADA',
            mensagem: `Transferência enviada sem entrada correspondente na loja ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeLabel"])(dest)}`,
            saidaId: s.id,
            lojaDestino: dest,
            estoqueInsumoId: s.estoqueInsumoId
        });
    }
    for (const e of entradas){
        if (e.storeSlug !== slug) continue;
        if (matchedEntrada.has(e.id)) continue;
        const orig = e.lojaOrigem || '?';
        alertas.push({
            tipo: 'ENTRADA_SEM_SAIDA',
            mensagem: `Entrada recebida sem saída correspondente na loja ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeLabel"])(orig)}`,
            entradaId: e.id,
            lojaOrigem: orig,
            estoqueInsumoId: e.estoqueInsumoId
        });
    }
    for (const m of matches){
        const s = saidas.find((x)=>x.id === m.saidaId);
        const e = entradas.find((x)=>x.id === m.entradaId);
        if (s.storeSlug !== slug && e.storeSlug !== slug) continue;
        const base = Math.max(m.enviou, m.recebeu, 0.0001);
        const diff = Math.abs(m.enviou - m.recebeu);
        if (diff > QTD_TOL && diff / base > 0.01) {
            alertas.push({
                tipo: 'QTD_DIVERGENTE',
                mensagem: `Quantidade divergente: enviou ${m.enviou}, recebeu ${m.recebeu}`,
                saidaId: m.saidaId,
                entradaId: m.entradaId,
                enviou: m.enviou,
                recebeu: m.recebeu
            });
        }
    }
    return alertas;
}
async function totaisTransferenciasLoja(params) {
    const whereBase = {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
        ...params.estoqueInsumoId ? {
            estoqueInsumoId: params.estoqueInsumoId
        } : {}
    };
    const [saidas, entradas] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvLancamento.findMany({
            where: {
                ...whereBase,
                tipo: 'TRANSFERENCIA_SAIDA'
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvLancamento.findMany({
            where: {
                ...whereBase,
                tipo: 'TRANSFERENCIA_ENTRADA'
            }
        })
    ]);
    return {
        enviadaQtd: saidas.reduce((a, l)=>a + num(l.quantidade), 0),
        enviadaValor: saidas.reduce((a, l)=>a + num(l.valorTotal), 0),
        recebidaQtd: entradas.reduce((a, l)=>a + num(l.quantidade), 0),
        recebidaValor: entradas.reduce((a, l)=>a + num(l.valorTotal), 0)
    };
}
;
}),
"[project]/Demo-2/src/lib/nfe/fechamento.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Cálculo do fechamento CMV Real por produto / semana.
 *
 * consumo = inicial + compras + transfRecebida - transfEnviada - desperdicio - final
 * (transf enviada abate do consumo da loja que envia, como na planilha)
 */ __turbopack_context__.s([
    "garantirFechamentoAberto",
    ()=>garantirFechamentoAberto,
    "montarFechamento",
    ()=>montarFechamento,
    "parseAjustes",
    ()=>parseAjustes,
    "parseRefeicoes",
    ()=>parseRefeicoes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$cmv$2d$real$2f$refeicoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/cmv-real/refeicoes.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$dates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/dates.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/importar-saldo.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/lojas.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/ui-labels.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$notas$2d$list$2d$query$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/notas-list-query.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$concilicao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/transferencia-concilicao.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$documento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/transferencia-documento.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencias$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/transferencias.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
function n(d) {
    if (d == null) return 0;
    if (typeof d === 'number') return d;
    return Number(d);
}
function emptySemanas() {
    return {
        1: {
            qtd: 0,
            valor: 0
        },
        2: {
            qtd: 0,
            valor: 0
        },
        3: {
            qtd: 0,
            valor: 0
        },
        4: {
            qtd: 0,
            valor: 0
        },
        5: {
            qtd: 0,
            valor: 0
        }
    };
}
async function garantirFechamentoAberto(params) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvFechamento.upsert({
        where: {
            userId_storeSlug_competencia: {
                userId: params.tenantUserId,
                storeSlug: params.storeSlug,
                competencia: params.competencia
            }
        },
        create: {
            userId: params.tenantUserId,
            storeSlug: params.storeSlug,
            competencia: params.competencia,
            status: 'ABERTO',
            ajustes: [],
            refeicoesFuncionarios: [],
            vendaMes: null,
            vendaMesOrigem: null
        },
        update: {}
    });
}
async function montarFechamento(params) {
    const fechamento = await garantirFechamentoAberto(params);
    const ant = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["competenciaAnterior"])(params.competencia);
    const configs = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.findMany({
        where: {
            userId: params.tenantUserId,
            ativo: true
        },
        include: {
            estoqueInsumo: {
                select: {
                    id: true,
                    nome: true,
                    insumoId: true
                }
            }
        },
        orderBy: [
            {
                secao: 'asc'
            },
            {
                ordem: 'asc'
            }
        ]
    });
    const nomeById = new Map(configs.map((c)=>[
            c.estoqueInsumoId,
            c.estoqueInsumo.nome
        ]));
    let [saldosIni, saldosFim, lancs] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.findMany({
            where: {
                userId: params.tenantUserId,
                storeSlug: params.storeSlug,
                competencia: ant
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.findMany({
            where: {
                userId: params.tenantUserId,
                storeSlug: params.storeSlug,
                competencia: params.competencia
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvLancamento.findMany({
            where: {
                userId: params.tenantUserId,
                storeSlug: params.storeSlug,
                competencia: params.competencia
            }
        })
    ]);
    // Auto-preenche custo quando há quantidade e custo vazio/inválido
    await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["preencherCustosPendentesFechamento"])({
            tenantUserId: params.tenantUserId,
            storeSlug: params.storeSlug,
            competenciaSaldo: ant,
            itens: saldosIni.map((s)=>({
                    estoqueInsumoId: s.estoqueInsumoId,
                    nome: nomeById.get(s.estoqueInsumoId) || s.estoqueInsumoId,
                    qtd: n(s.qtdFinal),
                    custoMedio: s.custoMedio != null ? n(s.custoMedio) : null,
                    custoOrigem: s.custoOrigem
                }))
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$importar$2d$saldo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["preencherCustosPendentesFechamento"])({
            tenantUserId: params.tenantUserId,
            storeSlug: params.storeSlug,
            competenciaSaldo: params.competencia,
            itens: saldosFim.map((s)=>({
                    estoqueInsumoId: s.estoqueInsumoId,
                    nome: nomeById.get(s.estoqueInsumoId) || s.estoqueInsumoId,
                    qtd: n(s.qtdFinal),
                    custoMedio: s.custoMedio != null ? n(s.custoMedio) : null,
                    custoOrigem: s.custoOrigem
                }))
        })
    ]);
    [saldosIni, saldosFim] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.findMany({
            where: {
                userId: params.tenantUserId,
                storeSlug: params.storeSlug,
                competencia: ant
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.findMany({
            where: {
                userId: params.tenantUserId,
                storeSlug: params.storeSlug,
                competencia: params.competencia
            }
        })
    ]);
    const iniMap = new Map(saldosIni.map((s)=>[
            s.estoqueInsumoId,
            s
        ]));
    const fimMap = new Map(saldosFim.map((s)=>[
            s.estoqueInsumoId,
            s
        ]));
    const linhas = configs.map((cfg)=>{
        const id = cfg.estoqueInsumoId;
        const ini = iniMap.get(id);
        const fim = fimMap.get(id);
        const itemLancs = lancs.filter((l)=>l.estoqueInsumoId === id);
        const comprasPorSemana = emptySemanas();
        let comprasQtd = 0;
        let comprasValor = 0;
        let transfEnviadaQtd = 0;
        let transfEnviadaValor = 0;
        let transfRecebidaQtd = 0;
        let transfRecebidaValor = 0;
        let desperdicioQtd = 0;
        let desperdicioValor = 0;
        for (const l of itemLancs){
            const q = n(l.quantidade);
            const v = n(l.valorTotal);
            if (l.tipo === 'COMPRA_NFE' || l.tipo === 'COMPRA_MANUAL') {
                comprasQtd += q;
                comprasValor += v;
                const sem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$dates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["semanaFromDataEntrada"])(l.data);
                comprasPorSemana[sem].qtd += q;
                comprasPorSemana[sem].valor += v;
            } else if (l.tipo === 'TRANSFERENCIA_SAIDA') {
                transfEnviadaQtd += q;
                transfEnviadaValor += v;
            } else if (l.tipo === 'TRANSFERENCIA_ENTRADA') {
                transfRecebidaQtd += q;
                transfRecebidaValor += v;
            } else if (l.tipo === 'DESPERDICIO') {
                desperdicioQtd += q;
                desperdicioValor += v;
            }
        }
        const estoqueInicial = n(ini?.qtdFinal);
        const estoqueFinal = n(fim?.qtdFinal);
        const custoMedioInicial = ini?.custoMedio != null ? n(ini.custoMedio) : null;
        const custoMedioFinal = fim?.custoMedio != null ? n(fim.custoMedio) : null;
        const custoOrigemInicial = ini?.custoOrigem ?? null;
        const custoOrigemFinal = fim?.custoOrigem ?? null;
        const custoOrigemDetalheInicial = ini?.custoOrigemDetalhe ?? null;
        const custoOrigemDetalheFinal = fim?.custoOrigemDetalhe ?? null;
        // consumo: inicial + compras + recebida − enviada − desperdício − final
        const consumoQtd = estoqueInicial + comprasQtd + transfRecebidaQtd - transfEnviadaQtd - desperdicioQtd - estoqueFinal;
        // valor: usa custo médio ponderado aproximado
        const entradasQtd = estoqueInicial + comprasQtd + transfRecebidaQtd;
        const entradasValor = estoqueInicial * (custoMedioInicial ?? 0) + comprasValor + transfRecebidaValor;
        const custoMedio = entradasQtd > 0 ? entradasValor / entradasQtd : custoMedioFinal ?? custoMedioInicial ?? 0;
        const consumoValor = Math.round(consumoQtd * custoMedio * 100) / 100;
        return {
            estoqueInsumoId: id,
            nome: cfg.estoqueInsumo.nome,
            secao: cfg.secao,
            unidade: cfg.unidade,
            ordem: cfg.ordem,
            estoqueInicial,
            custoMedioInicial,
            custoOrigemInicial,
            custoOrigemDetalheInicial,
            comprasQtd,
            comprasValor,
            comprasPorSemana,
            transfEnviadaQtd,
            transfEnviadaValor,
            transfRecebidaQtd,
            transfRecebidaValor,
            desperdicioQtd,
            desperdicioValor,
            estoqueFinal,
            custoMedioFinal,
            custoOrigemFinal,
            custoOrigemDetalheFinal,
            consumoQtd,
            consumoValor
        };
    });
    const alertasTransferencia = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencias$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["conciliarTransferencias"])(params);
    const pendencias = [];
    const notasRev = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].nfeNota.count({
        where: {
            userId: params.tenantUserId,
            storeSlug: params.storeSlug,
            competencia: params.competencia,
            status: 'EM_REVISAO'
        }
    });
    const [yStr, mStr] = params.competencia.split('-');
    const y = Number(yStr);
    const m = Number(mStr); // 1–12; Date.UTC month é 0-based → m = mês seguinte
    if (notasRev > 0) {
        pendencias.push({
            tipo: 'NOTA_REVISAO',
            mensagem: `${notasRev} nota(s) em revisão`,
            href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$notas$2d$list$2d$query$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["notasListHref"])({
                status: 'EM_REVISAO',
                storeSlug: params.storeSlug,
                mes: m,
                ano: y
            })
        });
    }
    for (const a of alertasTransferencia){
        pendencias.push({
            tipo: 'TRANSFERENCIA_LANC',
            mensagem: a.mensagem,
            href: `/cmv-real/transferencias?competencia=${params.competencia}&storeSlug=${params.storeSlug}`
        });
    }
    const docsTransf = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$documento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listarTransferencias"])({
        userId: params.tenantUserId,
        storeSlugs: [
            params.storeSlug
        ],
        competencia: params.competencia
    });
    for (const d of docsTransf){
        const msgs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$concilicao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pendenciasDocumentoTransferencia"])({
            numeroDocumento: d.numeroDocumento,
            status: d.status,
            lojaOrigemLabel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeLabel"])(d.lojaOrigem),
            lojaDestinoLabel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeLabel"])(d.lojaDestino),
            lados: d.lados.map((l)=>({
                    tipo: l.tipo,
                    rascunho: l.rascunho
                }))
        });
        for (const p of msgs){
            pendencias.push({
                ...p,
                href: `/cmv-real/transferencias/${d.id}`
            });
        }
    }
    if (!fimMap.size) {
        pendencias.push({
            tipo: 'ESTOQUE_FINAL',
            mensagem: 'Estoque final ainda não informado (contagem ou importação)'
        });
    }
    const custosPendentes = linhas.filter((l)=>l.estoqueInicial > 0 && l.custoOrigemInicial === 'PENDENTE' || l.estoqueFinal > 0 && l.custoOrigemFinal === 'PENDENTE');
    if (custosPendentes.length > 0) {
        pendencias.push({
            tipo: 'CUSTO',
            mensagem: `${custosPendentes.length} produto(s) com custo pendente (inicial ou final)`
        });
    }
    const { listarOrfaosCmvCatalogo } = await __turbopack_context__.A("[project]/Demo-2/src/lib/nfe/cmv-catalogo.ts [app-route] (ecmascript, async loader)");
    const orfaosCatalogo = (await listarOrfaosCmvCatalogo({
        tenantUserId: params.tenantUserId,
        competenciaSaldo: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["competenciaAnterior"])(params.competencia),
        competenciasCompras: [
            params.competencia
        ]
    })).filter((o)=>{
        const saldoLoja = o.qtdSaldoPorLoja[params.storeSlug] ?? 0;
        const comprasLoja = o.comprasValorPorLoja[params.storeSlug] ?? 0;
        return saldoLoja > 0 || comprasLoja > 0;
    });
    if (orfaosCatalogo.length > 0) {
        pendencias.push({
            tipo: 'ORFAO',
            mensagem: `${orfaosCatalogo.length} produto(s) com saldo ou compras fora do catálogo`,
            href: '/cmv-real/produtos?orfaos=1'
        });
    }
    const ajustes = parseAjustes(fechamento.ajustes);
    const ajustesValor = ajustes.reduce((a, x)=>a + x.valor, 0);
    // Aviso: API de Dados ~24h de atraso; sync definitivo a partir do dia 2 do mês seguinte
    // competencia 2026-10 → Date.UTC(2026, 10, 2) = 02/11/2026
    const syncDefinitivoApartir = new Date(Date.UTC(y, m, 2));
    const hoje = new Date();
    if (fechamento.status !== 'FECHADO') {
        pendencias.push({
            tipo: 'SAIPOS',
            mensagem: 'Dados da Saipos até ontem (API de Dados ~24h de atraso)'
        });
    }
    if (hoje < syncDefinitivoApartir) {
        const label = syncDefinitivoApartir.toLocaleDateString('pt-BR', {
            timeZone: 'UTC'
        });
        pendencias.push({
            tipo: 'REFEICOES_SYNC',
            mensagem: `Sync definitivo das refeições: rode a partir de ${label} (dia 2 do mês seguinte)`
        });
    }
    const refeicaoRows = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRefeicao.findMany({
        where: {
            userId: params.tenantUserId,
            storeSlug: params.storeSlug,
            competencia: params.competencia
        },
        orderBy: [
            {
                data: 'asc'
            },
            {
                createdAt: 'asc'
            }
        ]
    });
    const consumoValor = linhas.reduce((a, l)=>a + l.consumoValor, 0);
    const consumoMp = linhas.filter((l)=>l.secao === 'MATERIA_PRIMA').reduce((a, l)=>a + l.consumoValor, 0);
    const consumoEmb = linhas.filter((l)=>l.secao === 'EMBALAGEM').reduce((a, l)=>a + l.consumoValor, 0);
    const consumoBeb = linhas.filter((l)=>l.secao === 'BEBIDA').reduce((a, l)=>a + l.consumoValor, 0);
    const vendaMes = fechamento.vendaMes != null ? n(fechamento.vendaMes) : null;
    const calcRef = vendaMes != null && vendaMes > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$cmv$2d$real$2f$refeicoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularCustoRefeicoes"])({
        consumoMp,
        vendaMes,
        refeicoes: refeicaoRows.map((r)=>({
                categoria: r.categoria,
                valorItens: n(r.valorItens),
                ignorada: r.ignorada
            }))
    }) : {
        pctCmvMpBruto: 0,
        porCategoria: [],
        custoTotal: 0,
        consumoMpLiquido: consumoMp
    };
    const pctOf = (valor)=>vendaMes != null && vendaMes > 0 ? Math.round(valor / vendaMes * 10000) / 10000 : null;
    // CMV MP = consumo MP − custo refeições (jantas/sócio); espelha a planilha
    const cmvMpValor = vendaMes != null && vendaMes > 0 ? calcRef.consumoMpLiquido : consumoMp;
    const cmvEmbalagensValor = Math.round(consumoEmb * 100) / 100;
    const cmvBebidasValor = Math.round(consumoBeb * 100) / 100;
    const cmvTotalValor = Math.round((cmvMpValor + cmvEmbalagensValor + cmvBebidasValor) * 100) / 100;
    const comprasMp = linhas.filter((l)=>l.secao === 'MATERIA_PRIMA').reduce((a, l)=>a + l.comprasValor, 0);
    const comprasEmb = linhas.filter((l)=>l.secao === 'EMBALAGEM').reduce((a, l)=>a + l.comprasValor, 0);
    const comprasBeb = linhas.filter((l)=>l.secao === 'BEBIDA').reduce((a, l)=>a + l.comprasValor, 0);
    const comprasTotal = comprasMp + comprasEmb + comprasBeb;
    return {
        fechamento,
        linhas,
        alertasTransferencia,
        pendencias,
        transferencias: docsTransf,
        orfaosCatalogoCount: orfaosCatalogo.length,
        refeicoes: refeicaoRows.map((r)=>({
                id: r.id,
                data: r.data.toISOString().slice(0, 10),
                categoria: r.categoria,
                consumidor: r.consumidor,
                formaPagamento: r.formaPagamento,
                valorItens: n(r.valorItens),
                origem: r.origem,
                ignorada: r.ignorada
            })),
        totais: {
            consumoValor,
            consumoMp,
            comprasValor: linhas.reduce((a, l)=>a + l.comprasValor, 0),
            transfEnviadaValor: linhas.reduce((a, l)=>a + l.transfEnviadaValor, 0),
            transfRecebidaValor: linhas.reduce((a, l)=>a + l.transfRecebidaValor, 0),
            ajustesValor,
            vendaMes,
            pctCmvMpBruto: vendaMes != null && vendaMes > 0 ? calcRef.pctCmvMpBruto : null,
            custoRefeicoes: calcRef.custoTotal,
            consumoMpLiquido: vendaMes != null && vendaMes > 0 ? calcRef.consumoMpLiquido : null,
            cmvMp: {
                valor: cmvMpValor,
                pct: pctOf(cmvMpValor)
            },
            cmvEmbalagens: {
                valor: cmvEmbalagensValor,
                pct: pctOf(cmvEmbalagensValor)
            },
            cmvBebidas: {
                valor: cmvBebidasValor,
                pct: pctOf(cmvBebidasValor)
            },
            cmvTotal: {
                valor: cmvTotalValor,
                pct: pctOf(cmvTotalValor)
            },
            semEstoqueFinal: !fimMap.size,
            ritmo: {
                materiaPrima: {
                    valor: comprasMp,
                    pct: pctOf(comprasMp)
                },
                embalagens: {
                    valor: comprasEmb,
                    pct: pctOf(comprasEmb)
                },
                bebidas: {
                    valor: comprasBeb,
                    pct: pctOf(comprasBeb)
                },
                total: {
                    valor: comprasTotal,
                    pct: pctOf(comprasTotal)
                }
            },
            refeicoesPorCategoria: calcRef.porCategoria
        }
    };
}
function parseAjustes(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map((a, i)=>{
        const o = a;
        return {
            id: String(o.id ?? `adj-${i}`),
            secao: o.secao || 'GERAL',
            descricao: String(o.descricao ?? ''),
            valor: Number(o.valor ?? 0),
            criadoPorId: o.criadoPorId != null ? String(o.criadoPorId) : null,
            criadoEm: String(o.criadoEm ?? new Date().toISOString())
        };
    });
}
function parseRefeicoes(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map((a, i)=>{
        const o = a;
        return {
            id: String(o.id ?? `ref-${i}`),
            descricao: String(o.descricao ?? ''),
            valorVenda: Number(o.valorVenda ?? 0)
        };
    });
}
}),
"[project]/Demo-2/src/lib/nfe/exportar-fechamento.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Exporta fechamento CMV Real para XLSX.
 */ __turbopack_context__.s([
    "exportarFechamentoXlsx",
    ()=>exportarFechamentoXlsx
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/xlsx/xlsx.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/lojas.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/ui-labels.ts [app-route] (ecmascript)");
;
;
const STATUS_XLSX = {
    AGUARDANDO_ENTRADA: 'Aguardando entrada',
    AGUARDANDO_SAIDA: 'Aguardando saída',
    CONCILIADA: 'Conciliada',
    DIVERGENTE: 'Divergente'
};
function exportarFechamentoXlsx(params) {
    const rows = params.linhas.map((l)=>({
            Seção: l.secao,
            Produto: l.nome,
            Unidade: l.unidade,
            'Estoque inicial': l.estoqueInicial,
            'Custo ini': l.custoMedioInicial,
            'Origem custo ini': l.custoOrigemInicial,
            'Compras qtd': l.comprasQtd,
            'Compras R$': l.comprasValor,
            'Sem 1 qtd': l.comprasPorSemana[1].qtd,
            'Sem 2 qtd': l.comprasPorSemana[2].qtd,
            'Sem 3 qtd': l.comprasPorSemana[3].qtd,
            'Sem 4 qtd': l.comprasPorSemana[4].qtd,
            'Sem 5 qtd': l.comprasPorSemana[5].qtd,
            'Transf. enviada qtd': l.transfEnviadaQtd,
            'Transf. enviada R$': l.transfEnviadaValor,
            'Transf. recebida qtd': l.transfRecebidaQtd,
            'Transf. recebida R$': l.transfRecebidaValor,
            'Desperdício qtd': l.desperdicioQtd,
            'Estoque final': l.estoqueFinal,
            'Custo fin': l.custoMedioFinal,
            'Origem custo fin': l.custoOrigemFinal,
            'Consumo qtd': l.consumoQtd,
            'Consumo R$': l.consumoValor
        }));
    const wb = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].book_new();
    const ws = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(rows);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'Fechamento');
    const pctLabel = (p)=>p != null ? `${(p * 100).toFixed(2)}%` : '';
    const resumo = [
        {
            Campo: 'Loja',
            Valor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeLabel"])(params.storeSlug)
        },
        {
            Campo: 'Competência',
            Valor: params.competencia
        },
        {
            Campo: 'Venda/mês',
            Valor: params.vendaMes != null ? params.vendaMes : ''
        },
        {
            Campo: 'CMV Matéria-prima',
            Valor: params.cmvMp?.valor ?? '',
            '%': pctLabel(params.cmvMp?.pct)
        },
        {
            Campo: 'CMV Embalagens',
            Valor: params.cmvEmbalagens?.valor ?? '',
            '%': pctLabel(params.cmvEmbalagens?.pct)
        },
        {
            Campo: 'CMV Bebidas',
            Valor: params.cmvBebidas?.valor ?? '',
            '%': pctLabel(params.cmvBebidas?.pct)
        },
        {
            Campo: 'CMV Total',
            Valor: params.cmvTotal?.valor ?? '',
            '%': pctLabel(params.cmvTotal?.pct)
        },
        ...params.ajustes.map((a, i)=>({
                Campo: `Ajuste ${i + 1} (${a.secao})`,
                Valor: `${a.descricao}: ${a.valor}`,
                '%': ''
            }))
    ];
    const ws2 = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(resumo);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws2, 'Resumo');
    const transfRows = [];
    for (const d of params.transferencias ?? []){
        const lados = d.lados.length ? d.lados : [
            null
        ];
        for (const lado of lados){
            const itens = lado?.itens?.length ? lado.itens : [
                null
            ];
            for (const it of itens){
                transfRows.push({
                    Documento: d.numeroDocumento,
                    Data: d.data.slice(0, 10),
                    Origem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeLabel"])(d.lojaOrigem),
                    Destino: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeLabel"])(d.lojaDestino),
                    Status: STATUS_XLSX[d.status] || d.status,
                    Lado: lado?.tipo || '',
                    Loja: lado ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeLabel"])(lado.storeSlug) : '',
                    Rascunho: lado?.rascunho ? 'sim' : '',
                    Produto: it?.nome || '',
                    Qtd: it?.quantidade ?? '',
                    Unidade: it?.unidade || '',
                    'Custo un': it?.custoUnitario ?? '',
                    Valor: it?.valorTotal ?? '',
                    'Origem custo': it?.custoOrigem || ''
                });
            }
        }
    }
    const ws3 = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(transfRows.length ? transfRows : [
        {
            Documento: 'Nenhuma transferência neste período'
        }
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws3, 'Transferências');
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["write"](wb, {
        type: 'buffer',
        bookType: 'xlsx'
    });
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/Demo-2/app/api/cmv-real/fechamento/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/tenant.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-permissions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/fechamento.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/lojas.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/ui-labels.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$exportar$2d$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/exportar-fechamento.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
const dynamic = 'force-dynamic';
;
;
;
;
;
;
;
;
;
function decimal(n) {
    return new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["Prisma"].Decimal(n);
}
async function GET(req) {
    const { tenant, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireCmvRealAccess"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].CMV_REAL_VISUALIZAR);
    if (error) return error;
    const sp = req.nextUrl.searchParams;
    const storeSlug = sp.get('storeSlug');
    const competencia = sp.get('competencia');
    const exportXlsx = sp.get('export') === 'xlsx';
    if (!storeSlug || !competencia) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'storeSlug e competencia obrigatórios'
        }, {
            status: 400
        });
    }
    const filter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveCmvRealStoreFilter"])(tenant, storeSlug);
    if (filter !== null && !filter.includes(storeSlug)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Sem acesso a esta loja'
        }, {
            status: 403
        });
    }
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["montarFechamento"])({
        tenantUserId: tenant.tenantUserId,
        storeSlug,
        competencia
    });
    if (exportXlsx) {
        const buf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$exportar$2d$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["exportarFechamentoXlsx"])({
            storeSlug,
            competencia,
            linhas: data.linhas,
            vendaMes: data.totais.vendaMes,
            ajustes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAjustes"])(data.fechamento.ajustes),
            cmvMp: data.totais.cmvMp,
            cmvEmbalagens: data.totais.cmvEmbalagens,
            cmvBebidas: data.totais.cmvBebidas,
            cmvTotal: data.totais.cmvTotal,
            transferencias: data.transferencias
        });
        const filename = `cmv-${storeSlug}-${competencia}.xlsx`;
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](new Uint8Array(buf), {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });
    }
    const { getRhContext } = await __turbopack_context__.A("[project]/Demo-2/src/lib/rh-auth.ts [app-route] (ecmascript, async loader)");
    const ctx = await getRhContext();
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        storeLabel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeLabel"])(storeSlug),
        allowedStoreSlugs: tenant.allowedStoreSlugs ?? __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CMV_STORE_SLUGS"],
        lojaTravada: !tenant.isAdmin && tenant.allowedStoreSlugs != null,
        canFechar: tenant.isAdmin || (ctx?.hasPermission(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].CMV_REAL_FECHAMENTO) ?? false),
        canReabrir: tenant.isAdmin || (ctx?.hasPermission(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].CMV_REAL_REABRIR) ?? false),
        canLancamentos: tenant.isAdmin || (ctx?.hasPermission(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].CMV_REAL_LANCAMENTOS) ?? false),
        fechamento: {
            id: data.fechamento.id,
            status: data.fechamento.status,
            vendaMes: data.fechamento.vendaMes != null ? Number(data.fechamento.vendaMes) : null,
            vendaMesOrigem: data.fechamento.vendaMesOrigem,
            ajustes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAjustes"])(data.fechamento.ajustes),
            /** Legado JSON no fechamento — preferir `refeicoesSaipos` */ refeicoes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseRefeicoes"])(data.fechamento.refeicoesFuncionarios),
            contagemId: data.fechamento.contagemId,
            fechadoEm: data.fechamento.fechadoEm
        },
        refeicoesSaipos: data.refeicoes,
        linhas: data.linhas,
        alertasTransferencia: data.alertasTransferencia,
        pendencias: data.pendencias,
        orfaosCatalogoCount: data.orfaosCatalogoCount,
        totais: data.totais
    });
}
async function PATCH(req) {
    const body = await req.json();
    if (!body.action || !body.storeSlug || !body.competencia) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'action, storeSlug e competencia obrigatórios'
        }, {
            status: 400
        });
    }
    const perm = body.action === 'reabrir' ? __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].CMV_REAL_REABRIR : __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].CMV_REAL_FECHAMENTO;
    const { tenant, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireCmvRealAccess"])(perm, body.storeSlug);
    if (error) return error;
    const key = {
        userId_storeSlug_competencia: {
            userId: tenant.tenantUserId,
            storeSlug: body.storeSlug,
            competencia: body.competencia
        }
    };
    let fechamento = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvFechamento.upsert({
        where: key,
        create: {
            userId: tenant.tenantUserId,
            storeSlug: body.storeSlug,
            competencia: body.competencia,
            status: 'ABERTO',
            ajustes: [],
            refeicoesFuncionarios: []
        },
        update: {}
    });
    if (body.action === 'set_venda') {
        if (fechamento.status === 'FECHADO') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Competência fechada'
            }, {
                status: 400
            });
        }
        fechamento = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvFechamento.update({
            where: {
                id: fechamento.id
            },
            data: {
                vendaMes: body.vendaMes == null ? null : decimal(Number(body.vendaMes)),
                vendaMesOrigem: 'MANUAL'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            vendaMes: fechamento.vendaMes != null ? Number(fechamento.vendaMes) : null,
            vendaMesOrigem: fechamento.vendaMesOrigem
        });
    }
    if (body.action === 'usar_venda_saipos') {
        if (fechamento.status === 'FECHADO') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Competência fechada'
            }, {
                status: 400
            });
        }
        if (body.vendaMesSaipos == null || !Number.isFinite(Number(body.vendaMesSaipos))) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'vendaMesSaipos obrigatório'
            }, {
                status: 400
            });
        }
        fechamento = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvFechamento.update({
            where: {
                id: fechamento.id
            },
            data: {
                vendaMes: decimal(Number(body.vendaMesSaipos)),
                vendaMesOrigem: 'SAIPOS'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            vendaMes: Number(fechamento.vendaMes),
            vendaMesOrigem: fechamento.vendaMesOrigem
        });
    }
    if (body.action === 'add_ajuste') {
        if (fechamento.status === 'FECHADO') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Competência fechada'
            }, {
                status: 400
            });
        }
        if (!body.secao || !body.descricao || body.valor == null) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'secao, descricao e valor obrigatórios'
            }, {
                status: 400
            });
        }
        const ajustes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAjustes"])(fechamento.ajustes);
        ajustes.push({
            id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])(),
            secao: body.secao,
            descricao: body.descricao,
            valor: Number(body.valor),
            criadoPorId: tenant.actorUserId,
            criadoEm: new Date().toISOString()
        });
        fechamento = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvFechamento.update({
            where: {
                id: fechamento.id
            },
            data: {
                ajustes
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            ajustes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAjustes"])(fechamento.ajustes)
        });
    }
    if (body.action === 'remove_ajuste') {
        if (fechamento.status === 'FECHADO') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Competência fechada'
            }, {
                status: 400
            });
        }
        const ajustes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAjustes"])(fechamento.ajustes).filter((a)=>a.id !== body.ajusteId);
        fechamento = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvFechamento.update({
            where: {
                id: fechamento.id
            },
            data: {
                ajustes
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            ajustes
        });
    }
    if (body.action === 'set_refeicoes') {
        if (fechamento.status === 'FECHADO') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Competência fechada'
            }, {
                status: 400
            });
        }
        const refeicoes = (body.refeicoes || []).map((r)=>({
                id: r.id || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])(),
                descricao: r.descricao,
                valorVenda: Number(r.valorVenda)
            }));
        fechamento = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvFechamento.update({
            where: {
                id: fechamento.id
            },
            data: {
                refeicoesFuncionarios: refeicoes
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            refeicoes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseRefeicoes"])(fechamento.refeicoesFuncionarios)
        });
    }
    if (body.action === 'fechar') {
        if (fechamento.status === 'FECHADO') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: true,
                status: 'FECHADO'
            });
        }
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["montarFechamento"])({
            tenantUserId: tenant.tenantUserId,
            storeSlug: body.storeSlug,
            competencia: body.competencia
        });
        fechamento = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvFechamento.update({
            where: {
                id: fechamento.id
            },
            data: {
                status: 'FECHADO',
                fechadoEm: new Date(),
                fechadoPorId: tenant.actorUserId,
                snapshot: {
                    totais: snap.totais,
                    refeicoes: snap.refeicoes,
                    pendencias: snap.pendencias,
                    alertasTransferencia: snap.alertasTransferencia,
                    linhasCount: snap.linhas.length,
                    pctCmvMpBruto: snap.totais.pctCmvMpBruto,
                    custoRefeicoes: snap.totais.custoRefeicoes,
                    cmvMp: snap.totais.cmvMp,
                    cmvEmbalagens: snap.totais.cmvEmbalagens,
                    cmvBebidas: snap.totais.cmvBebidas,
                    cmvTotal: snap.totais.cmvTotal
                }
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            status: fechamento.status,
            pendencias: snap.pendencias
        });
    }
    if (body.action === 'reabrir') {
        fechamento = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvFechamento.update({
            where: {
                id: fechamento.id
            },
            data: {
                status: 'ABERTO',
                fechadoEm: null,
                fechadoPorId: null,
                snapshot: __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["Prisma"].DbNull
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            status: fechamento.status
        });
    }
    if (body.action === 'set_custo_saldo') {
        if (fechamento.status === 'FECHADO') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Competência fechada'
            }, {
                status: 400
            });
        }
        if (!body.estoqueInsumoId || body.custoMedio == null || !Number.isFinite(Number(body.custoMedio))) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'estoqueInsumoId e custoMedio obrigatórios'
            }, {
                status: 400
            });
        }
        const custo = Number(body.custoMedio);
        if (custo <= 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'custoMedio deve ser > 0'
            }, {
                status: 400
            });
        }
        const alvo = body.alvoCusto === 'final' ? 'final' : 'inicial';
        const competenciaSaldo = alvo === 'final' ? body.competencia : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["competenciaAnterior"])(body.competencia);
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.findUnique({
            where: {
                userId_storeSlug_competencia_estoqueInsumoId: {
                    userId: tenant.tenantUserId,
                    storeSlug: body.storeSlug,
                    competencia: competenciaSaldo,
                    estoqueInsumoId: body.estoqueInsumoId
                }
            }
        });
        if (!existing) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Saldo não encontrado para atualizar o custo'
            }, {
                status: 404
            });
        }
        const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.update({
            where: {
                id: existing.id
            },
            data: {
                custoMedio: decimal(custo),
                custoOrigem: 'MANUAL',
                custoOrigemDetalhe: 'Informado manualmente no fechamento'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            alvo,
            competenciaSaldo,
            estoqueInsumoId: updated.estoqueInsumoId,
            custoMedio: Number(updated.custoMedio),
            custoOrigem: updated.custoOrigem,
            custoOrigemDetalhe: updated.custoOrigemDetalhe
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'action inválida'
    }, {
        status: 400
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6db85bcb._.js.map