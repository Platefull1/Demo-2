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
"[project]/Demo-2/src/lib/calculos-rh.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FATOR_ANUAL",
    ()=>FATOR_ANUAL,
    "calcularBonificacoesComposicao",
    ()=>calcularBonificacoesComposicao,
    "calcularComposicaoSalarial",
    ()=>calcularComposicaoSalarial,
    "calcularEncargosPatronais",
    ()=>calcularEncargosPatronais,
    "custoAnualizado",
    ()=>custoAnualizado,
    "custoMensalEmpresaComBonificacoes",
    ()=>custoMensalEmpresaComBonificacoes,
    "mediaMensalBonificacoesTrimestrais",
    ()=>mediaMensalBonificacoesTrimestrais,
    "plrProjetadoMensal",
    ()=>plrProjetadoMensal,
    "totalBrutoComBonificacoes",
    ()=>totalBrutoComBonificacoes
]);
function calcularComposicaoSalarial(funcionario) {
    const adicionalResponsabilidade = funcionario.cargoResponsabilidade ? funcionario.salarioBase * 0.4 : 0;
    const baseCalculoEncargos = funcionario.salarioBase + adicionalResponsabilidade;
    const totalBruto = baseCalculoEncargos + funcionario.valorAlimentacao + funcionario.valorVT + (funcionario.bonificacaoAssiduidade ?? 0);
    return {
        salarioBase: funcionario.salarioBase,
        adicionalResponsabilidade,
        bonificacaoAssiduidade: funcionario.bonificacaoAssiduidade,
        valorAlimentacao: funcionario.valorAlimentacao,
        valorVT: funcionario.valorVT,
        baseCalculoEncargos,
        totalBruto
    };
}
function calcularEncargosPatronais(baseCalculoEncargos, rat = 2, fap = 1.0) {
    if (baseCalculoEncargos <= 0) {
        return {
            fgts: 0,
            rat: 0,
            totalEncargos: 0,
            custoTotal: 0,
            custoTotalEmpresa: 0,
            percentualSobreSalario: 0,
            percentualSobreBase: 0
        };
    }
    const fgts = baseCalculoEncargos * 0.08;
    const ratAjustado = baseCalculoEncargos * (rat / 100) * fap;
    const totalEncargos = fgts + ratAjustado;
    const custoTotalEmpresa = baseCalculoEncargos + totalEncargos;
    return {
        fgts,
        rat: ratAjustado,
        totalEncargos,
        custoTotal: custoTotalEmpresa,
        custoTotalEmpresa,
        percentualSobreSalario: totalEncargos / baseCalculoEncargos * 100,
        percentualSobreBase: totalEncargos / baseCalculoEncargos * 100
    };
}
const FATOR_ANUAL = 14.33;
function custoAnualizado(custoMensal) {
    return custoMensal * FATOR_ANUAL;
}
function mediaMensalBonificacoesTrimestrais(bonificacoes) {
    const ativas = bonificacoes.filter((b)=>b.ativo !== false);
    if (ativas.length === 0) return 0;
    const soma = ativas.reduce((s, b)=>s + b.valor, 0);
    return soma / 12;
}
function plrProjetadoMensal(valorTrimestre) {
    if (!valorTrimestre || valorTrimestre <= 0) return 0;
    return valorTrimestre / 3;
}
function calcularBonificacoesComposicao(input) {
    const assiduidadePrograma = input.assiduidadeMes?.recebeu === true ? input.assiduidadeMes.valorDireito : 0;
    const plrProjetado = plrProjetadoMensal(input.plrValorTrimestre);
    const bonificacaoTrimestralMedia = mediaMensalBonificacoesTrimestrais(input.trimestrais ?? []);
    const totalVariavel = assiduidadePrograma + plrProjetado + bonificacaoTrimestralMedia;
    return {
        mes: input.mes,
        ano: input.ano,
        trimestre: input.trimestre,
        assiduidadePrograma,
        plrProjetadoMensal: plrProjetado,
        bonificacaoTrimestralMedia,
        totalVariavel
    };
}
function totalBrutoComBonificacoes(composicao, bonificacoes) {
    return composicao.totalBruto + bonificacoes.totalVariavel;
}
function custoMensalEmpresaComBonificacoes(composicao, encargosTotal, bonificacoes) {
    return composicao.baseCalculoEncargos + encargosTotal + composicao.valorAlimentacao + composicao.valorVT + bonificacoes.totalVariavel;
}
}),
"[project]/Demo-2/src/lib/rh-funcionario.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CAMPOS_COMPOSICAO_HISTORICO",
    ()=>CAMPOS_COMPOSICAO_HISTORICO,
    "enrichFuncionario",
    ()=>enrichFuncionario,
    "enrichFuncionarios",
    ()=>enrichFuncionarios,
    "formatComposicaoHistorico",
    ()=>formatComposicaoHistorico
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$calculos$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/calculos-rh.ts [app-route] (ecmascript)");
;
function enrichFuncionario(funcionario, ratPct, fap, bonificacoesComposicao) {
    const f = funcionario;
    const normalized = {
        ...funcionario,
        escala: f.escala ?? '6x1',
        turno: f.turno ?? 'manhã',
        diasFolga: Array.isArray(f.diasFolga) ? f.diasFolga : []
    };
    const composicaoSalarial = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$calculos$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularComposicaoSalarial"])(normalized);
    const encargosPatronais = ratPct !== undefined ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$calculos$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularEncargosPatronais"])(composicaoSalarial.baseCalculoEncargos, ratPct, fap ?? 1) : undefined;
    const salarioBruto = bonificacoesComposicao ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$calculos$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["totalBrutoComBonificacoes"])(composicaoSalarial, bonificacoesComposicao) : composicaoSalarial.totalBruto;
    const custoMensalTotal = bonificacoesComposicao && encargosPatronais ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$calculos$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["custoMensalEmpresaComBonificacoes"])(composicaoSalarial, encargosPatronais.totalEncargos, bonificacoesComposicao) : undefined;
    return {
        ...normalized,
        composicaoSalarial,
        salarioBruto,
        ...bonificacoesComposicao ? {
            bonificacoesComposicao
        } : {},
        ...custoMensalTotal !== undefined ? {
            custoMensalTotal
        } : {},
        ...encargosPatronais ? {
            encargosPatronais
        } : {}
    };
}
function enrichFuncionarios(funcionarios, fapPorLoja) {
    return funcionarios.map((f)=>{
        const rat = f.cargo?.ratPct ?? 2;
        const fap = fapPorLoja?.[f.lojaId ?? ''] ?? 1;
        return enrichFuncionario(f, rat, fap);
    });
}
function formatComposicaoHistorico(composicao) {
    return `R$ ${composicao.totalBruto.toFixed(2)} (base encargos: R$ ${composicao.baseCalculoEncargos.toFixed(2)})`;
}
const CAMPOS_COMPOSICAO_HISTORICO = [
    'salarioBase',
    'cargoResponsabilidade',
    'bonificacaoAssiduidade',
    'valorAlimentacao',
    'valorVT'
];
}),
"[project]/Demo-2/src/lib/rh-bonificacoes-composicao.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "carregarBonificacoesComposicao",
    ()=>carregarBonificacoesComposicao,
    "trimestreDoMes",
    ()=>trimestreDoMes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$calculos$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/calculos-rh.ts [app-route] (ecmascript)");
;
;
function trimestreDoMes(mes) {
    return Math.ceil(mes / 3);
}
async function carregarBonificacoesComposicao(funcionarioId, ref = new Date()) {
    const mes = ref.getMonth() + 1;
    const ano = ref.getFullYear();
    const trimestre = trimestreDoMes(mes);
    const [assiduidadeMes, plrPagamento, trimestrais] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhBonificacaoAssiduidade.findUnique({
            where: {
                funcionarioId_mes_ano: {
                    funcionarioId,
                    mes,
                    ano
                }
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhPLRPagamento.findFirst({
            where: {
                funcionarioId,
                plr: {
                    trimestre,
                    ano
                }
            },
            select: {
                valor: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhBonificacaoTrimestral.findMany({
            where: {
                funcionarioId,
                ano,
                ativo: true
            },
            select: {
                valor: true,
                ativo: true
            }
        })
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$calculos$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularBonificacoesComposicao"])({
        mes,
        ano,
        trimestre,
        assiduidadeMes: assiduidadeMes ? {
            recebeu: assiduidadeMes.recebeu,
            valorDireito: assiduidadeMes.valorDireito
        } : null,
        plrValorTrimestre: plrPagamento?.valor ?? null,
        trimestrais
    });
}
}),
"[project]/Demo-2/src/lib/validacoes.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Remove máscara e retorna apenas dígitos do CPF */ __turbopack_context__.s([
    "calcularIdade",
    ()=>calcularIdade,
    "formatarCPF",
    ()=>formatarCPF,
    "limparCPF",
    ()=>limparCPF,
    "validarCPF",
    ()=>validarCPF,
    "validarDataNascimento",
    ()=>validarDataNascimento
]);
function limparCPF(cpf) {
    if (!cpf) return '';
    return cpf.replace(/\D/g, '').slice(0, 11);
}
function validarCPF(cpf) {
    const digits = limparCPF(cpf);
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;
    let sum = 0;
    for(let i = 0; i < 9; i++)sum += parseInt(digits[i], 10) * (10 - i);
    let rest = sum * 10 % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(digits[9], 10)) return false;
    sum = 0;
    for(let i = 0; i < 10; i++)sum += parseInt(digits[i], 10) * (11 - i);
    rest = sum * 10 % 11;
    if (rest === 10 || rest === 11) rest = 0;
    return rest === parseInt(digits[10], 10);
}
function formatarCPF(cpf) {
    if (!cpf) return '—';
    const d = limparCPF(cpf);
    if (d.length !== 11) return cpf;
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
function calcularIdade(dataNascimento, referencia = new Date()) {
    let idade = referencia.getFullYear() - dataNascimento.getFullYear();
    const m = referencia.getMonth() - dataNascimento.getMonth();
    if (m < 0 || m === 0 && referencia.getDate() < dataNascimento.getDate()) {
        idade--;
    }
    return idade;
}
function validarDataNascimento(data) {
    if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
        return 'Data de nascimento inválida';
    }
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    if (data > hoje) return 'Data de nascimento não pode ser futura';
    const idade = calcularIdade(data);
    if (Number.isNaN(idade) || idade > 120) return 'Data de nascimento inválida';
    if (idade < 16) return 'Idade mínima de 16 anos para trabalho';
    return null;
}
}),
"[project]/Demo-2/src/lib/ferias-rh.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Utilitários de período aquisitivo de férias (CLT). */ __turbopack_context__.s([
    "addYears",
    ()=>addYears,
    "calcPeriodoAquisitivo",
    ()=>calcPeriodoAquisitivo,
    "deveAvancarPeriodoAoSalvarGozo",
    ()=>deveAvancarPeriodoAoSalvarGozo,
    "formatDateUTC",
    ()=>formatDateUTC,
    "inicioAquisitivoAposGozo",
    ()=>inicioAquisitivoAposGozo,
    "inicioAquisitivoEfetivo",
    ()=>inicioAquisitivoEfetivo,
    "proximoInicioAquisitivo",
    ()=>proximoInicioAquisitivo,
    "sameUtcDay",
    ()=>sameUtcDay
]);
function addYears(date, years) {
    const d = new Date(date.getTime());
    d.setUTCFullYear(d.getUTCFullYear() + years);
    return d;
}
function toUtcDay(d) {
    return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}
function sameUtcDay(a, b) {
    return toUtcDay(a) === toUtcDay(b);
}
/** Compara só o dia civil (UTC) — evita flutuação de horário. */ function utcDayMs(d) {
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}
function inicioAquisitivoAposGozo(dataGozoFerias, opts) {
    const base = opts.dataAdmissao ?? opts.dataInicioFerias;
    if (!base) {
        throw new Error('inicioAquisitivoAposGozo requer dataAdmissao ou dataInicioFerias');
    }
    let inicio = new Date(base);
    const gozoMs = utcDayMs(new Date(dataGozoFerias));
    let guard = 0;
    while(utcDayMs(addYears(inicio, 1)) <= gozoMs && guard < 80){
        inicio = addYears(inicio, 1);
        guard++;
    }
    // Gozo ainda dentro do 1º período aquisitivo (antes do 1º vencimento).
    // Só aplica com âncora de admissão — evita +1 duplicado quando o fallback
    // é um dataInicioFerias já alinhado.
    if (guard === 0 && opts.dataAdmissao && sameUtcDay(inicio, new Date(opts.dataAdmissao))) {
        inicio = addYears(inicio, 1);
    }
    return inicio;
}
function inicioAquisitivoEfetivo(dataInicioFerias, dataAdmissao, dataGozoFerias) {
    const inicio = new Date(dataInicioFerias);
    if (!dataGozoFerias) return inicio;
    if (!dataAdmissao && !dataInicioFerias) return inicio;
    const alinhado = inicioAquisitivoAposGozo(dataGozoFerias, {
        dataAdmissao,
        dataInicioFerias
    });
    if (!sameUtcDay(alinhado, inicio)) return alinhado;
    return inicio;
}
function calcPeriodoAquisitivo(dataInicioFerias, opts) {
    if (!dataInicioFerias) return null;
    const inicio = inicioAquisitivoEfetivo(dataInicioFerias, opts?.dataAdmissao, opts?.dataGozoFerias);
    const vencimento = addYears(inicio, 1);
    const hoje = opts?.hoje ? new Date(opts.hoje) : new Date();
    const hojeMs = utcDayMs(hoje);
    const vencMs = utcDayMs(vencimento);
    const inicioMs = utcDayMs(inicio);
    const diasRestantes = Math.round((vencMs - hojeMs) / (1000 * 60 * 60 * 24));
    const mesesTrabalhados = Math.floor((hojeMs - inicioMs) / (1000 * 60 * 60 * 24 * 30));
    const diasDireito = Math.min(30, Math.max(0, Math.floor(mesesTrabalhados * 2.5)));
    return {
        inicio,
        vencimento,
        diasRestantes,
        diasDireito
    };
}
function formatDateUTC(d) {
    if (!d) return '—';
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    });
}
function deveAvancarPeriodoAoSalvarGozo(gozoAnterior, gozoNovo) {
    if (!gozoNovo) return false;
    if (!gozoAnterior) return true;
    const prev = new Date(gozoAnterior);
    const next = new Date(gozoNovo);
    if (sameUtcDay(prev, next)) return false;
    return next > prev;
}
function proximoInicioAquisitivo(dataInicioFerias) {
    return addYears(new Date(dataInicioFerias), 1);
}
}),
"[project]/Demo-2/app/api/rh/funcionarios/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$funcionario$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-funcionario.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$calculos$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/calculos-rh.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$bonificacoes$2d$composicao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-bonificacoes-composicao.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$validacoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/validacoes.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ferias$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/ferias-rh.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
const dynamic = 'force-dynamic';
const INCLUDE = {
    cargo: {
        select: {
            id: true,
            nome: true,
            ratPct: true
        }
    },
    loja: {
        select: {
            id: true,
            nome: true,
            fap: true
        }
    }
};
const CAMPOS_HISTORICO = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$funcionario$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CAMPOS_COMPOSICAO_HISTORICO"],
    'cargoId',
    'lojaId',
    'escala',
    'turno',
    'ativo'
];
function valorParaString(campo, valor, existing) {
    if (valor === null || valor === undefined) return '';
    if (campo === 'cargoResponsabilidade') return valor ? 'Sim' : 'Não';
    if (typeof valor === 'boolean') return valor ? 'Ativo' : 'Inativo';
    if (campo === 'salarioBase' || campo === 'bonificacaoAssiduidade' || campo === 'valorAlimentacao' || campo === 'valorVT') {
        return `R$ ${Number(valor).toFixed(2)}`;
    }
    if (__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$funcionario$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CAMPOS_COMPOSICAO_HISTORICO"].includes(campo)) {
        return '';
    }
    return String(valor);
}
function composicaoSnapshot(data) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$funcionario$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatComposicaoHistorico"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$calculos$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularComposicaoSalarial"])(data));
}
function calcDatasExperiencia(dataAdmissao) {
    const d1 = new Date(dataAdmissao);
    d1.setDate(d1.getDate() + 45);
    const d2 = new Date(dataAdmissao);
    d2.setDate(d2.getDate() + 90);
    return {
        dataFimExperiencia1: d1,
        dataFimExperiencia2: d2
    };
}
async function GET(_req, { params }) {
    try {
        const { id } = await params;
        const rh = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rhGetUser"])();
        if (!rh) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Não autorizado'
        }, {
            status: 401
        });
        let funcionario = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhFuncionario.findFirst({
            where: {
                id,
                userId: rh.userId
            },
            include: INCLUDE
        });
        if (!funcionario) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Funcionário não encontrado'
        }, {
            status: 404
        });
        // Corrige legado: gozo registrado sem avançar o período aquisitivo
        if (funcionario.dataInicioFerias && funcionario.dataAdmissao && funcionario.dataGozoFerias) {
            const efetivo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ferias$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inicioAquisitivoEfetivo"])(funcionario.dataInicioFerias, funcionario.dataAdmissao, funcionario.dataGozoFerias);
            if (efetivo.getTime() !== new Date(funcionario.dataInicioFerias).getTime()) {
                funcionario = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhFuncionario.update({
                    where: {
                        id
                    },
                    data: {
                        dataInicioFerias: efetivo
                    },
                    include: INCLUDE
                });
            }
        }
        const bonificacoesComposicao = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$bonificacoes$2d$composicao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["carregarBonificacoesComposicao"])(id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$funcionario$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enrichFuncionario"])(funcionario, funcionario.cargo?.ratPct ?? 1.0, funcionario.loja?.fap ?? 1.0, bonificacoesComposicao));
    } catch (err) {
        console.error('[GET /api/rh/funcionarios/[id]]', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro interno'
        }, {
            status: 500
        });
    }
}
async function PATCH(req, { params }) {
    try {
        const { id } = await params;
        const rh = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rhGetUser"])();
        if (!rh) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Não autorizado'
        }, {
            status: 401
        });
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhFuncionario.findFirst({
            where: {
                id,
                userId: rh.userId
            }
        });
        if (!existing) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Funcionário não encontrado'
        }, {
            status: 404
        });
        const body = await req.json();
        const { nome, cpf: cpfRaw, email, telefone, dataNascimento, dataAdmissao, cargoId, lojaId, salarioBase, valorAlimentacao, valorVT, cargoResponsabilidade, bonificacaoAssiduidade, escala, turno, horarioEntrada, horarioSaida, horarioDigest, diasFolga, domingoFolga, observacoes, ativo, dataGozoFerias, statusFerias, diasFeriasGozados, motivo, numeroFolha: numeroFolhaRaw } = body;
        const numeroFolhaNorm = numeroFolhaRaw !== undefined ? numeroFolhaRaw?.trim() || null : undefined;
        // Normaliza strings vazias de campos opcionais (form manda "" em vez de null)
        const cpfLimpo = cpfRaw !== undefined ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$validacoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["limparCPF"])(String(cpfRaw || '')) : undefined;
        const nascStr = dataNascimento !== undefined ? dataNascimento ? String(dataNascimento) : null : undefined;
        const admissaoStr = dataAdmissao !== undefined ? dataAdmissao ? String(dataAdmissao) : null : undefined;
        const cargoIdNorm = cargoId !== undefined ? cargoId ? String(cargoId) : null : undefined;
        const lojaIdNorm = lojaId !== undefined ? lojaId ? String(lojaId) : null : undefined;
        if (cpfLimpo !== undefined) {
            if (cpfLimpo) {
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$validacoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validarCPF"])(cpfLimpo)) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'CPF inválido'
                }, {
                    status: 400
                });
                const dup = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhFuncionario.findFirst({
                    where: {
                        userId: rh.userId,
                        cpf: cpfLimpo,
                        ativo: true,
                        id: {
                            not: id
                        }
                    }
                });
                if (dup) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'CPF já cadastrado'
                }, {
                    status: 409
                });
            }
        }
        if (nascStr) {
            const nasc = new Date(nascStr);
            if (Number.isNaN(nasc.getTime())) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Data de nascimento inválida'
            }, {
                status: 400
            });
            const errNasc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$validacoes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validarDataNascimento"])(nasc);
            if (errNasc) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: errNasc
            }, {
                status: 400
            });
        }
        if (numeroFolhaNorm !== undefined && numeroFolhaNorm) {
            const folhaDup = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhFuncionario.findFirst({
                where: {
                    userId: rh.userId,
                    numeroFolha: numeroFolhaNorm,
                    id: {
                        not: id
                    }
                },
                select: {
                    id: true
                }
            });
            if (folhaDup) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'N° da folha já cadastrado em outro funcionário'
            }, {
                status: 409
            });
        }
        if (salarioBase !== undefined && Number(salarioBase) <= 0) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Salário base inválido'
        }, {
            status: 400
        });
        let experienciaData = {};
        if (admissaoStr) {
            const admissao = new Date(admissaoStr);
            if (Number.isNaN(admissao.getTime())) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Data de admissão inválida'
            }, {
                status: 400
            });
            const { dataFimExperiencia1, dataFimExperiencia2 } = calcDatasExperiencia(admissao);
            experienciaData = {
                dataInicioExperiencia: admissao,
                dataFimExperiencia1,
                dataFimExperiencia2
            };
            // Só reinicia o período aquisitivo se a admissão mudou de fato
            const admissaoMudou = !existing.dataAdmissao || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ferias$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sameUtcDay"])(admissao, new Date(existing.dataAdmissao));
            if (admissaoMudou) {
                experienciaData.dataInicioFerias = existing.dataGozoFerias ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ferias$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inicioAquisitivoAposGozo"])(existing.dataGozoFerias, {
                    dataAdmissao: admissao,
                    dataInicioFerias: admissao
                }) : admissao;
            }
        }
        const composicaoAntes = composicaoSnapshot(existing);
        const merged = {
            salarioBase: salarioBase !== undefined ? Number(salarioBase) : existing.salarioBase,
            cargoResponsabilidade: cargoResponsabilidade !== undefined ? Boolean(cargoResponsabilidade) : existing.cargoResponsabilidade,
            bonificacaoAssiduidade: bonificacaoAssiduidade !== undefined ? Number(bonificacaoAssiduidade) : existing.bonificacaoAssiduidade,
            valorAlimentacao: valorAlimentacao !== undefined ? Number(valorAlimentacao) : existing.valorAlimentacao,
            valorVT: valorVT !== undefined ? Number(valorVT) : existing.valorVT
        };
        const composicaoDepois = composicaoSnapshot(merged);
        const composicaoMudou = composicaoAntes !== composicaoDepois;
        const alteracoes = [];
        for (const campo of CAMPOS_HISTORICO){
            if (campo === 'salarioBase' && composicaoMudou) continue;
            if (body[campo] !== undefined) {
                const anterior = valorParaString(campo, existing[campo]);
                const novo = valorParaString(campo, body[campo]);
                if (anterior !== novo) {
                    alteracoes.push({
                        campo,
                        valorAnterior: anterior,
                        valorNovo: novo
                    });
                }
            }
        }
        if (composicaoMudou) {
            alteracoes.push({
                campo: 'composicaoSalarial',
                valorAnterior: composicaoAntes,
                valorNovo: composicaoDepois
            });
        }
        const alteradoPor = rh.userId;
        // Avanço do período aquisitivo ao registrar/atualizar gozo de férias
        let feriasData = {};
        if (dataGozoFerias !== undefined || statusFerias !== undefined || diasFeriasGozados !== undefined) {
            const gozoNovo = dataGozoFerias !== undefined ? dataGozoFerias ? new Date(dataGozoFerias) : null : existing.dataGozoFerias;
            if (dataGozoFerias !== undefined) {
                feriasData.dataGozoFerias = gozoNovo;
            }
            if (diasFeriasGozados !== undefined) {
                feriasData.diasFeriasGozados = Number(diasFeriasGozados);
            }
            // Registrar gozo → status gozadas (salvo se o cliente mandar outro)
            if (statusFerias !== undefined) {
                feriasData.statusFerias = statusFerias;
            } else if (gozoNovo) {
                feriasData.statusFerias = 'gozadas';
            }
            // Alinha o período aquisitivo à data de gozo (avança N anos se necessário)
            if (gozoNovo && (existing.dataAdmissao || existing.dataInicioFerias)) {
                const alvo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ferias$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inicioAquisitivoAposGozo"])(gozoNovo, {
                    dataAdmissao: existing.dataAdmissao,
                    dataInicioFerias: existing.dataInicioFerias
                });
                const atual = existing.dataInicioFerias;
                if (!atual || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ferias$2d$rh$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sameUtcDay"])(alvo, new Date(atual))) {
                    feriasData.dataInicioFerias = alvo;
                }
            }
        }
        const funcionario = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction(async (tx)=>{
            const updated = await tx.rhFuncionario.update({
                where: {
                    id
                },
                data: {
                    ...nome !== undefined && {
                        nome: nome.trim()
                    },
                    ...cpfLimpo !== undefined && {
                        cpf: cpfLimpo || null
                    },
                    ...email !== undefined && {
                        email: email || null
                    },
                    ...telefone !== undefined && {
                        telefone: telefone || null
                    },
                    ...nascStr !== undefined && {
                        dataNascimento: nascStr ? new Date(nascStr) : null
                    },
                    ...admissaoStr !== undefined && {
                        dataAdmissao: admissaoStr ? new Date(admissaoStr) : null
                    },
                    ...cargoIdNorm !== undefined && {
                        cargoId: cargoIdNorm
                    },
                    ...lojaIdNorm !== undefined && {
                        lojaId: lojaIdNorm
                    },
                    ...salarioBase !== undefined && {
                        salarioBase: Number(salarioBase)
                    },
                    ...valorAlimentacao !== undefined && {
                        valorAlimentacao: Number(valorAlimentacao)
                    },
                    ...valorVT !== undefined && {
                        valorVT: Number(valorVT)
                    },
                    ...cargoResponsabilidade !== undefined && {
                        cargoResponsabilidade: Boolean(cargoResponsabilidade)
                    },
                    ...bonificacaoAssiduidade !== undefined && {
                        bonificacaoAssiduidade: Number(bonificacaoAssiduidade)
                    },
                    ...escala !== undefined && {
                        escala
                    },
                    ...turno !== undefined && {
                        turno
                    },
                    ...horarioEntrada !== undefined && {
                        horarioEntrada
                    },
                    ...horarioSaida !== undefined && {
                        horarioSaida
                    },
                    ...horarioDigest !== undefined && /^\d{2}:\d{2}$/.test(String(horarioDigest)) && {
                        horarioDigest: String(horarioDigest)
                    },
                    ...diasFolga !== undefined && {
                        diasFolga
                    },
                    ...domingoFolga !== undefined && {
                        domingoFolga: domingoFolga || null
                    },
                    ...observacoes !== undefined && {
                        observacoes: observacoes || null
                    },
                    ...ativo !== undefined && {
                        ativo
                    },
                    ...numeroFolhaNorm !== undefined && {
                        numeroFolha: numeroFolhaNorm
                    },
                    ...feriasData,
                    ...experienciaData
                },
                include: INCLUDE
            });
            if (alteracoes.length > 0) {
                await tx.rhHistoricoFuncionario.createMany({
                    data: alteracoes.map((a)=>({
                            userId: rh.userId,
                            funcionarioId: id,
                            campo: a.campo,
                            valorAnterior: a.valorAnterior,
                            valorNovo: a.valorNovo,
                            alteradoPor,
                            motivo: motivo || null
                        }))
                });
            }
            return updated;
        });
        const bonificacoesComposicao = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$bonificacoes$2d$composicao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["carregarBonificacoesComposicao"])(id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$funcionario$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enrichFuncionario"])(funcionario, funcionario.cargo?.ratPct ?? 1.0, funcionario.loja?.fap ?? 1.0, bonificacoesComposicao));
    } catch (err) {
        console.error('[PATCH /api/rh/funcionarios/[id]]', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro interno'
        }, {
            status: 500
        });
    }
}
async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const rh = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rhGetUser"])();
        if (!rh) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Não autorizado'
        }, {
            status: 401
        });
        const permanent = req.nextUrl.searchParams.get('permanent') === 'true';
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhFuncionario.findFirst({
            where: {
                id,
                userId: rh.userId
            }
        });
        if (!existing) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Funcionário não encontrado'
        }, {
            status: 404
        });
        if (permanent) {
            // Exclusão definitiva — só permitida para funcionários já inativos
            if (existing.ativo) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Desative o funcionário antes de excluir permanentemente'
            }, {
                status: 400
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhFuncionario.delete({
                where: {
                    id
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: true
            });
        }
        // Soft delete — desativar
        const alteradoPor = rh.userId;
        await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction(async (tx)=>{
            await tx.rhFuncionario.update({
                where: {
                    id
                },
                data: {
                    ativo: false
                }
            });
            await tx.rhHistoricoFuncionario.create({
                data: {
                    userId: rh.userId,
                    funcionarioId: id,
                    campo: 'ativo',
                    valorAnterior: 'Ativo',
                    valorNovo: 'Inativo',
                    alteradoPor
                }
            });
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    } catch (err) {
        console.error('[DELETE /api/rh/funcionarios/[id]]', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro interno'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__965c2f88._.js.map