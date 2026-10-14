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
    "formatNumBr",
    ()=>formatNumBr,
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
    IGNORADA: 'Fora do CMV'
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
}),
"[project]/Demo-2/src/lib/nfe/lojas.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Slugs e nomes de loja do CMV Real + normalização de lojaNome (contagem).
 */ __turbopack_context__.s([
    "CMV_STORE_SLUGS",
    ()=>CMV_STORE_SLUGS,
    "STORE_CNPJ_BY_SLUG",
    ()=>STORE_CNPJ_BY_SLUG,
    "competenciaAnterior",
    ()=>competenciaAnterior,
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
const STORE_CNPJ_BY_SLUG = {
};
function storeSlugFromCnpj(cnpj) {
    const digits = String(cnpj || '').replace(/\D/g, '');
    if (digits.length < 11) return null;
    for (const [slug, c] of Object.entries(STORE_CNPJ_BY_SLUG)){
        if (c && c.replace(/\D/g, '') === digits) return slug;
    }
    return null;
}
function competenciaAnterior(competencia) {
    const [y, m] = competencia.split('-').map(Number);
    if (!y || !m) throw new Error(`competência inválida: ${competencia}`);
    if (m === 1) return `${y - 1}-12`;
    return `${y}-${String(m - 1).padStart(2, '0')}`;
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
"[project]/Demo-2/src/lib/nfe/fechamento.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$dates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/dates.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/lojas.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$ui$2d$labels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/ui-labels.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencias$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/transferencias.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$cmv$2d$real$2f$refeicoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/cmv-real/refeicoes.ts [app-route] (ecmascript)");
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
    const [configs, saldosIni, saldosFim, lancs] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.findMany({
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
        }),
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
    if (notasRev > 0) {
        pendencias.push(`${notasRev} nota(s) em revisão`);
    }
    for (const a of alertasTransferencia){
        pendencias.push(a.mensagem);
    }
    if (!fimMap.size) {
        pendencias.push('Estoque final ainda não informado (contagem ou importação)');
    }
    const ajustes = parseAjustes(fechamento.ajustes);
    const ajustesValor = ajustes.reduce((a, x)=>a + x.valor, 0);
    // Aviso: API de Dados ~24h de atraso; sync definitivo a partir do dia 2 do mês seguinte
    const [yStr, mStr] = params.competencia.split('-');
    const y = Number(yStr);
    const m = Number(mStr); // 1–12; Date.UTC month é 0-based → m = mês seguinte
    // competencia 2026-10 → Date.UTC(2026, 10, 2) = 02/11/2026
    const syncDefinitivoApartir = new Date(Date.UTC(y, m, 2));
    const hoje = new Date();
    if (fechamento.status !== 'FECHADO') {
        pendencias.push('Dados da Saipos até ontem (API de Dados ~24h de atraso)');
    }
    if (hoje < syncDefinitivoApartir) {
        const label = syncDefinitivoApartir.toLocaleDateString('pt-BR', {
            timeZone: 'UTC'
        });
        pendencias.push(`Sync definitivo das refeições: rode a partir de ${label} (dia 2 do mês seguinte)`);
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
    return {
        fechamento,
        linhas,
        alertasTransferencia,
        pendencias,
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
;
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
function exportarFechamentoXlsx(params) {
    const rows = params.linhas.map((l)=>({
            Seção: l.secao,
            Produto: l.nome,
            Unidade: l.unidade,
            'Estoque inicial': l.estoqueInicial,
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
            'Consumo qtd': l.consumoQtd,
            'Consumo R$': l.consumoValor
        }));
    const wb = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].book_new();
    const ws = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(rows);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'Fechamento');
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
        ...params.ajustes.map((a, i)=>({
                Campo: `Ajuste ${i + 1} (${a.secao})`,
                Valor: `${a.descricao}: ${a.valor}`
            }))
    ];
    const ws2 = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(resumo);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws2, 'Resumo');
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/fechamento.ts [app-route] (ecmascript) <locals>");
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
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["montarFechamento"])({
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
            ajustes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parseAjustes"])(data.fechamento.ajustes)
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
            ajustes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parseAjustes"])(data.fechamento.ajustes),
            /** Legado JSON no fechamento — preferir `refeicoesSaipos` */ refeicoes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parseRefeicoes"])(data.fechamento.refeicoesFuncionarios),
            contagemId: data.fechamento.contagemId,
            fechadoEm: data.fechamento.fechadoEm
        },
        refeicoesSaipos: data.refeicoes,
        linhas: data.linhas,
        alertasTransferencia: data.alertasTransferencia,
        pendencias: data.pendencias,
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
        const ajustes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parseAjustes"])(fechamento.ajustes);
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
            ajustes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parseAjustes"])(fechamento.ajustes)
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
        const ajustes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parseAjustes"])(fechamento.ajustes).filter((a)=>a.id !== body.ajusteId);
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
            refeicoes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parseRefeicoes"])(fechamento.refeicoesFuncionarios)
        });
    }
    if (body.action === 'fechar') {
        if (fechamento.status === 'FECHADO') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: true,
                status: 'FECHADO'
            });
        }
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$fechamento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["montarFechamento"])({
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
                    custoRefeicoes: snap.totais.custoRefeicoes
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'action inválida'
    }, {
        status: 400
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8136d1f5._.js.map