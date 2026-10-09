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
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/Demo-2/src/lib/rider-auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RIDER_COOKIE",
    ()=>RIDER_COOKIE,
    "createRiderToken",
    ()=>createRiderToken,
    "generateInviteToken",
    ()=>generateInviteToken,
    "getRiderSession",
    ()=>getRiderSession,
    "hashPassword",
    ()=>hashPassword,
    "requireRiderSession",
    ()=>requireRiderSession,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
;
const RIDER_COOKIE = 'rider_token';
const SESSION_DURATION = 8 * 60 * 60; // 8 horas
function getSecret() {
    const secret = process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) throw new Error('JWT secret não configurado');
    return secret;
}
async function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 10);
}
async function verifyPassword(password, hash) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, hash);
}
function createRiderToken(session) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(session, getSecret(), {
        expiresIn: SESSION_DURATION
    });
}
async function getRiderSession() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const token = cookieStore.get(RIDER_COOKIE)?.value;
        if (!token) return null;
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, getSecret());
        if (decoded.exp && decoded.exp < Date.now() / 1000) return null;
        return decoded;
    } catch  {
        return null;
    }
}
async function requireRiderSession(req) {
    try {
        const token = req.cookies.get(RIDER_COOKIE)?.value;
        if (!token) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/rider/login', req.url));
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, getSecret());
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/rider/login', req.url));
        }
        return decoded;
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/rider/login', req.url));
    }
}
function generateInviteToken() {
    return crypto.randomUUID();
}
}),
"[project]/Demo-2/src/lib/rider-invite-email.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildInviteLink",
    ()=>buildInviteLink,
    "buildWhatsAppLink",
    ()=>buildWhatsAppLink,
    "sendInviteEmail",
    ()=>sendInviteEmail
]);
const FROM = 'Platefull <noreply@platefull.com.br>';
function getAppUrl() {
    return process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'https://platefull.com.br';
}
function buildInviteLink(token) {
    return `${getAppUrl()}/rider/setup?token=${token}`;
}
function buildWhatsAppLink(phone, inviteLink) {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, '');
    const number = digits.startsWith('55') ? digits : `55${digits}`;
    const msg = encodeURIComponent(`Olá! Você foi cadastrado(a) como motoboy na plataforma Drin.\n\nClique no link abaixo para criar sua senha e acessar o portal:\n${inviteLink}\n\nO link é válido por 30 dias.`);
    return `https://wa.me/${number}?text=${msg}`;
}
async function sendInviteEmail(params) {
    const { to, riderName, lojaNome, inviteLink } = params;
    if (!process.env.RESEND_API_KEY) {
        console.warn('[rider-invite-email] RESEND_API_KEY não configurado — e-mail não enviado');
        return;
    }
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#0a0a0a;padding:32px 40px;text-align:center;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#f97316;">Platefull</p>
          <p style="margin:6px 0 0;font-size:13px;color:#9ca3af;">Portal do Motoboy</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Olá, <strong>${riderName}</strong>!</p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            Você foi cadastrado(a) como motoboy na loja <strong>${lojaNome}</strong>.
            Para acessar o portal e visualizar suas quinzenas e documentos, você precisa criar sua senha.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#374151;">Clique no botão abaixo para criar sua senha:</p>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
            <tr><td style="background:#f97316;border-radius:8px;">
              <a href="${inviteLink}" target="_blank"
                style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#000000;text-decoration:none;">
                Criar minha senha
              </a>
            </td></tr>
          </table>

          <!-- Link alternativo -->
          <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Ou copie e cole este link no seu navegador:</p>
          <p style="margin:0 0 24px;font-size:12px;color:#f97316;word-break:break-all;">${inviteLink}</p>

          <p style="margin:0;font-size:13px;color:#9ca3af;">
            ⏳ Este link é válido por <strong>30 dias</strong>. Após acessar, você poderá entrar sempre em:
            <br><a href="${getAppUrl()}/rider/login" style="color:#f97316;">${getAppUrl()}/rider/login</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            Se você não esperava este e-mail, pode ignorá-lo com segurança.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: FROM,
            to,
            subject: `Bem-vindo(a) ao portal do motoboy — ${lojaNome}`,
            html
        })
    });
    if (!response.ok) {
        const body = await response.text().catch(()=>'');
        throw new Error(`Resend retornou ${response.status}: ${body}`);
    }
}
}),
"[project]/Demo-2/src/lib/rider-quinzena-docs.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Regras de documentos por tipo de quinzena (válido para todas as lojas):
 * - 1ª quinzena (dia 1–15): boleto obrigatório; NF opcional
 * - 2ª quinzena (dia 16–fim): boleto + NF obrigatórios
 *
 * Usa periodStart (dia do mês) em vez do periodLabel, que pode ser editado no RH.
 */ __turbopack_context__.s([
    "computeRiderDocStatus",
    ()=>computeRiderDocStatus,
    "getQuinzenaKind",
    ()=>getQuinzenaKind,
    "isCurrentCalendarQuinzena",
    ()=>isCurrentCalendarQuinzena,
    "isDocumentsComplete",
    ()=>isDocumentsComplete
]);
function getQuinzenaKind(periodStart) {
    // Preferência: extrair o dia do ISO "YYYY-MM-DD" (como o RH envia ao criar)
    if (typeof periodStart === 'string' && /^\d{4}-\d{2}-\d{2}/.test(periodStart)) {
        const day = Number(periodStart.slice(8, 10));
        return day <= 15 ? 'first' : 'second';
    }
    const d = periodStart instanceof Date ? periodStart : new Date(periodStart);
    // Datas salvas via `new Date("YYYY-MM-DD")` ficam em meia-noite UTC
    const day = d.getUTCDate();
    return day <= 15 ? 'first' : 'second';
}
function isDocumentsComplete(periodStart, docs) {
    const hasBoleto = docs.some((d)=>d.documentType === 'boleto');
    if (!hasBoleto) return false;
    if (getQuinzenaKind(periodStart) === 'first') return true;
    return docs.some((d)=>d.documentType === 'nf');
}
function isCurrentCalendarQuinzena(periodStart, now = new Date()) {
    let pYear;
    let pMonth; // 0-11
    let pDay;
    if (typeof periodStart === 'string' && /^\d{4}-\d{2}-\d{2}/.test(periodStart)) {
        pYear = Number(periodStart.slice(0, 4));
        pMonth = Number(periodStart.slice(5, 7)) - 1;
        pDay = Number(periodStart.slice(8, 10));
    } else {
        const d = periodStart instanceof Date ? periodStart : new Date(periodStart);
        pYear = d.getUTCFullYear();
        pMonth = d.getUTCMonth();
        pDay = d.getUTCDate();
    }
    // "Agora" em America/Sao_Paulo
    const sp = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(now); // YYYY-MM-DD
    const nYear = Number(sp.slice(0, 4));
    const nMonth = Number(sp.slice(5, 7)) - 1;
    const nDay = Number(sp.slice(8, 10));
    if (pYear !== nYear || pMonth !== nMonth) return false;
    const periodKind = pDay <= 15 ? 'first' : 'second';
    const nowKind = nDay <= 15 ? 'first' : 'second';
    return periodKind === nowKind;
}
function computeRiderDocStatus(period) {
    if (!period) return 'none';
    if (period.status === 'paid' || period.status === 'approved') return 'none';
    if (!isCurrentCalendarQuinzena(period.periodStart)) return 'none';
    if (isDocumentsComplete(period.periodStart, period.documents)) return 'received';
    const hasNf = period.documents.some((d)=>d.documentType === 'nf');
    const hasBoleto = period.documents.some((d)=>d.documentType === 'boleto');
    if (hasNf || hasBoleto) return 'partial';
    // Sem docs ainda — só alerta se a quinzena ainda está aguardando envio
    if (period.status === 'pending_documents') return 'pending';
    return 'none';
}
}),
"[project]/Demo-2/app/api/rh/motoboys/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-permissions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rider$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rider-auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rider$2d$invite$2d$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rider-invite-email.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rider$2d$quinzena$2d$docs$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rider-quinzena-docs.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
const dynamic = 'force-dynamic';
const INVITE_DAYS = 30;
function validarCNPJ(cnpj) {
    const nums = cnpj.replace(/\D/g, '');
    if (nums.length !== 14 || /^(\d)\1{13}$/.test(nums)) return false;
    const calc = (n)=>{
        let sum = 0;
        let pos = n - 7;
        for(let i = n; i >= 1; i--){
            sum += parseInt(nums[n - i]) * pos--;
            if (pos < 2) pos = 9;
        }
        const r = sum % 11;
        return r < 2 ? 0 : 11 - r;
    };
    return calc(12) === parseInt(nums[12]) && calc(13) === parseInt(nums[13]);
}
async function GET(req) {
    const { ctx, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireRhPermission"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].RIDERS_VIEW);
    if (error) return error;
    const lojaId = req.nextUrl.searchParams.get('lojaId');
    const status = req.nextUrl.searchParams.get('status');
    const riders = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deliveryRider.findMany({
        where: {
            userId: ctx.userId,
            ...lojaId ? {
                lojaId
            } : {},
            ...status ? {
                status
            } : {}
        },
        include: {
            loja: {
                select: {
                    nome: true
                }
            },
            paymentPeriods: {
                orderBy: {
                    periodStart: 'desc'
                },
                take: 3,
                include: {
                    documents: {
                        select: {
                            documentType: true,
                            status: true
                        }
                    }
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
    const result = riders.map(({ paymentPeriods, ...r })=>{
        const latest = paymentPeriods[0] ?? null;
        // Etiqueta: só quinzena civil atual (antigas ficam sem badge)
        const currentForBadge = paymentPeriods.find((p)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rider$2d$quinzena$2d$docs$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeRiderDocStatus"])(p) !== 'none') ?? null;
        const docStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rider$2d$quinzena$2d$docs$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeRiderDocStatus"])(currentForBadge);
        return {
            ...r,
            docStatus,
            activePeriodId: currentForBadge?.id ?? latest?.id ?? null
        };
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
}
async function POST(req) {
    try {
        const { ctx, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireRhPermission"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].RIDERS_CREATE);
        if (error) return error;
        const body = await req.json();
        if (!body.name || !body.cnpj || !body.email || !body.lojaId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Campos obrigatórios faltando'
            }, {
                status: 400
            });
        }
        const cnpjNums = body.cnpj.replace(/\D/g, '');
        if (!validarCNPJ(cnpjNums)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'CNPJ inválido'
            }, {
                status: 400
            });
        }
        const inviteToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rider$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateInviteToken"])();
        const inviteTokenExpiresAt = new Date(Date.now() + INVITE_DAYS * 24 * 60 * 60 * 1000);
        // Buscar loja para o e-mail
        const loja = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhLoja.findUnique({
            where: {
                id: body.lojaId
            },
            select: {
                nome: true
            }
        });
        // Verificar se e-mail ou CNPJ já existem
        const [existentePorEmail, existentePorCnpj] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deliveryRider.findFirst({
                where: {
                    userId: ctx.userId,
                    email: body.email.toLowerCase()
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deliveryRider.findFirst({
                where: {
                    userId: ctx.userId,
                    cnpj: cnpjNums
                }
            })
        ]);
        // CNPJ já usado por outro cadastro com e-mail diferente → conflito
        if (existentePorCnpj && (!existentePorEmail || existentePorCnpj.id !== existentePorEmail.id)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'CNPJ já cadastrado para outro motoboy'
            }, {
                status: 409
            });
        }
        const existente = existentePorEmail ?? existentePorCnpj ?? null;
        let rider;
        let reativado = false;
        if (existente) {
            // Se está ativo E já tem senha → bloquear
            if (existente.status === 'active' && existente.passwordHash) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'E-mail já cadastrado e ativo'
                }, {
                    status: 409
                });
            }
            // Inativo ou sem senha → reativar como pending_setup
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deliveryRider.update({
                where: {
                    id: existente.id
                },
                data: {
                    name: body.name,
                    cnpj: cnpjNums,
                    phone: body.phone ?? existente.phone,
                    lojaId: body.lojaId,
                    status: 'pending_setup',
                    passwordHash: null,
                    inviteToken,
                    inviteTokenExpiresAt
                }
            });
            rider = updated;
            reativado = true;
        } else {
            const created = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deliveryRider.create({
                data: {
                    userId: ctx.userId,
                    lojaId: body.lojaId,
                    name: body.name,
                    cnpj: cnpjNums,
                    email: body.email.toLowerCase(),
                    phone: body.phone,
                    status: 'pending_setup',
                    inviteToken,
                    inviteTokenExpiresAt
                }
            });
            rider = created;
        }
        // Disparar e-mail — falha silenciosa (não bloqueia o cadastro)
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rider$2d$invite$2d$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendInviteEmail"])({
            to: rider.email,
            riderName: rider.name,
            lojaNome: loja?.nome ?? 'sua loja',
            inviteLink: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rider$2d$invite$2d$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildInviteLink"])(inviteToken)
        }).catch((err)=>console.error('[POST /api/rh/motoboys] falha ao enviar e-mail de convite:', err));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...rider,
            inviteToken,
            inviteLink: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rider$2d$invite$2d$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildInviteLink"])(inviteToken),
            reativado
        }, {
            status: reativado ? 200 : 201
        });
    } catch (err) {
        console.error('[POST /api/rh/motoboys]', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro interno ao cadastrar motoboy'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__85b6f30b._.js.map