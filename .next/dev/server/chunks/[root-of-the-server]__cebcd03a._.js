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
"[project]/Demo-2/app/api/cmv-real/transferencias/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/tenant.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-permissions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$documento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/transferencia-documento.ts [app-route] (ecmascript)");
const dynamic = 'force-dynamic';
;
;
;
;
async function GET(_req, { params }) {
    const { tenant, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireCmvRealAccess"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].CMV_REAL_VISUALIZAR);
    if (error) return error;
    const { id } = await params;
    const doc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$documento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["obterTransferencia"])({
        userId: tenant.tenantUserId,
        id
    });
    if (!doc) return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Não encontrada'
    }, {
        status: 404
    });
    const [origemFechada, destinoFechada] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$documento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["competenciaEstaFechada"])(tenant.tenantUserId, doc.lojaOrigem, doc.competencia),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$documento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["competenciaEstaFechada"])(tenant.tenantUserId, doc.lojaDestino, doc.competencia)
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        transferencia: doc,
        competenciaFechada: origemFechada || destinoFechada,
        lojasFechadas: [
            ...origemFechada ? [
                doc.lojaOrigem
            ] : [],
            ...destinoFechada ? [
                doc.lojaDestino
            ] : []
        ]
    });
}
async function DELETE(_req, { params }) {
    const { tenant, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireCmvRealAccess"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].CMV_REAL_LANCAMENTOS);
    if (error) return error;
    const { id } = await params;
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$transferencia$2d$documento$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["excluirTransferencia"])({
            userId: tenant.tenantUserId,
            actorUserId: tenant.actorUserId,
            id
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e instanceof Error ? e.message : 'Falha ao excluir'
        }, {
            status: 400
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cebcd03a._.js.map