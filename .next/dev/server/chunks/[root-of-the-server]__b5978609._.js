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
"[project]/Demo-2/src/lib/nfe/cmv-catalogo.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Catálogo CMV Real (CmvRealInsumoConfig): ensure, órfãos e marcação na importação.
 */ __turbopack_context__.s([
    "ensureCmvRealInsumoConfig",
    ()=>ensureCmvRealInsumoConfig,
    "idsNoCatalogoCmv",
    ()=>idsNoCatalogoCmv,
    "incluirOrfaosNoCatalogoCmv",
    ()=>incluirOrfaosNoCatalogoCmv,
    "listarOrfaosCmvCatalogo",
    ()=>listarOrfaosCmvCatalogo,
    "secaoFromCategoriaId",
    ()=>secaoFromCategoriaId,
    "secaoFromNomeProduto",
    ()=>secaoFromNomeProduto,
    "unidadeFromEstoque",
    ()=>unidadeFromEstoque
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
;
function secaoFromCategoriaId(categoriaId) {
    const id = String(categoriaId || '').toLowerCase();
    if (id.includes('embalag')) return 'EMBALAGEM';
    if (id.includes('bebid')) return 'BEBIDA';
    return 'MATERIA_PRIMA';
}
function secaoFromNomeProduto(nome) {
    const n = String(nome || '').toUpperCase();
    if (/EMBALAGEM|MESINHA|SEPARADOR|SACOLA|POTE|COPO|TAMPA|PAPEL|FILME/.test(n)) {
        return 'EMBALAGEM';
    }
    if (/COCA|PEPSI|GUARAN|SPRITE|SUCO|AGUA|REFRIG|CERVEJ|HEINEKEN|SPATEN|BEBIDA|SCHIN|FANTA/.test(n)) {
        return 'BEBIDA';
    }
    return 'MATERIA_PRIMA';
}
function unidadeFromEstoque(unidade) {
    return String(unidade || '').toLowerCase() === 'un' ? 'UN' : 'KG';
}
async function ensureCmvRealInsumoConfig(params) {
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.findUnique({
        where: {
            userId_estoqueInsumoId: {
                userId: params.tenantUserId,
                estoqueInsumoId: params.estoqueInsumoId
            }
        }
    });
    if (existing) {
        if (!existing.ativo) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.update({
                where: {
                    id: existing.id
                },
                data: {
                    ativo: true,
                    secao: params.secao,
                    unidade: params.unidade,
                    ...params.ordem != null ? {
                        ordem: params.ordem
                    } : {}
                }
            });
            return {
                created: true
            };
        }
        return {
            created: false
        };
    }
    let ordem = params.ordem;
    if (ordem == null) {
        const max = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.aggregate({
            where: {
                userId: params.tenantUserId,
                secao: params.secao
            },
            _max: {
                ordem: true
            }
        });
        ordem = (max._max.ordem ?? 0) + 1;
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.create({
        data: {
            userId: params.tenantUserId,
            estoqueInsumoId: params.estoqueInsumoId,
            secao: params.secao,
            unidade: params.unidade,
            ordem,
            ativo: true
        }
    });
    return {
        created: true
    };
}
async function idsNoCatalogoCmv(tenantUserId) {
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.findMany({
        where: {
            userId: tenantUserId,
            ativo: true
        },
        select: {
            estoqueInsumoId: true
        }
    });
    return new Set(rows.map((r)=>r.estoqueInsumoId));
}
async function listarOrfaosCmvCatalogo(params) {
    const competenciaSaldo = params.competenciaSaldo || '2026-09';
    const competenciasCompras = params.competenciasCompras || [
        competenciaSaldo
    ];
    const inCfg = await idsNoCatalogoCmv(params.tenantUserId);
    const [saldos, lancs] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvSaldoEstoque.findMany({
            where: {
                userId: params.tenantUserId,
                competencia: competenciaSaldo
            },
            select: {
                estoqueInsumoId: true,
                storeSlug: true,
                qtdFinal: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvLancamento.findMany({
            where: {
                userId: params.tenantUserId,
                competencia: {
                    in: competenciasCompras
                },
                tipo: {
                    in: [
                        'COMPRA_NFE',
                        'COMPRA_MANUAL'
                    ]
                }
            },
            select: {
                estoqueInsumoId: true,
                storeSlug: true,
                valorTotal: true
            }
        })
    ]);
    const orphanIds = new Set();
    for (const s of saldos){
        if (!inCfg.has(s.estoqueInsumoId)) orphanIds.add(s.estoqueInsumoId);
    }
    for (const l of lancs){
        if (!inCfg.has(l.estoqueInsumoId)) orphanIds.add(l.estoqueInsumoId);
    }
    if (orphanIds.size === 0) return [];
    const insumos = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findMany({
        where: {
            id: {
                in: [
                    ...orphanIds
                ]
            }
        },
        select: {
            id: true,
            nome: true,
            unidade: true,
            categoriaId: true
        }
    });
    const byId = new Map(insumos.map((i)=>[
            i.id,
            i
        ]));
    const out = [];
    for (const id of orphanIds){
        const ins = byId.get(id);
        const saldosI = saldos.filter((s)=>s.estoqueInsumoId === id);
        const lancsI = lancs.filter((l)=>l.estoqueInsumoId === id);
        const lojas = [
            ...new Set([
                ...saldosI.map((s)=>s.storeSlug),
                ...lancsI.map((l)=>l.storeSlug)
            ])
        ].sort();
        const qtdSaldoPorLoja = {};
        for (const s of saldosI){
            qtdSaldoPorLoja[s.storeSlug] = Number(s.qtdFinal);
        }
        const comprasValorPorLoja = {};
        for (const l of lancsI){
            comprasValorPorLoja[l.storeSlug] = (comprasValorPorLoja[l.storeSlug] ?? 0) + Number(l.valorTotal);
        }
        const secaoPorNome = secaoFromNomeProduto(ins?.nome || '');
        const secaoFinal = secaoPorNome !== 'MATERIA_PRIMA' ? secaoPorNome : secaoFromCategoriaId(ins?.categoriaId);
        out.push({
            estoqueInsumoId: id,
            nome: ins?.nome || id,
            unidade: unidadeFromEstoque(ins?.unidade),
            secaoSugerida: secaoFinal,
            lojas,
            qtdSaldoPorLoja,
            comprasValorPorLoja,
            comprasValor: lancsI.reduce((a, l)=>a + Number(l.valorTotal), 0)
        });
    }
    out.sort((a, b)=>{
        if (a.secaoSugerida !== b.secaoSugerida) {
            return a.secaoSugerida.localeCompare(b.secaoSugerida);
        }
        return a.nome.localeCompare(b.nome, 'pt-BR');
    });
    return out;
}
async function incluirOrfaosNoCatalogoCmv(params) {
    let incluidos = 0;
    for (const it of params.itens){
        const insumo = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findUnique({
            where: {
                id: it.estoqueInsumoId
            },
            select: {
                unidade: true
            }
        });
        const { created } = await ensureCmvRealInsumoConfig({
            tenantUserId: params.tenantUserId,
            estoqueInsumoId: it.estoqueInsumoId,
            secao: it.secao,
            unidade: it.unidade ?? unidadeFromEstoque(insumo?.unidade)
        });
        if (created) incluidos += 1;
    }
    return {
        incluidos
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
"[project]/Demo-2/app/api/cmv-real/produtos/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/estoque-nome.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/estoque-tenant.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$cmv$2d$catalogo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/cmv-catalogo.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/nfe/tenant.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-permissions.ts [app-route] (ecmascript)");
const dynamic = 'force-dynamic';
;
;
;
;
;
;
;
function secaoFromCategoria(categoriaId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$cmv$2d$catalogo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["secaoFromCategoriaId"])(categoriaId);
}
async function GET(req) {
    const { tenant, ctx, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireCmvRealAccess"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].CMV_REAL_VISUALIZAR);
    if (error) return error;
    const fonte = req.nextUrl.searchParams.get('fonte');
    const canConfig = tenant.isAdmin || (ctx?.hasPermission(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].CMV_REAL_CONFIG) ?? false);
    if (fonte === 'orfaos') {
        const competenciaSaldo = req.nextUrl.searchParams.get('competenciaSaldo') || undefined;
        const comprasRaw = req.nextUrl.searchParams.get('competenciasCompras');
        const competenciasCompras = comprasRaw ? comprasRaw.split(',').map((s)=>s.trim()).filter(Boolean) : undefined;
        const orfaos = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$cmv$2d$catalogo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listarOrfaosCmvCatalogo"])({
            tenantUserId: tenant.tenantUserId,
            competenciaSaldo,
            competenciasCompras
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            canConfig,
            orfaos
        });
    }
    if (fonte === 'estoque') {
        const [insumos, cmvConfigs] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findMany({
                where: {
                    userId: {
                        in: tenant.userIds
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
            __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.findMany({
                where: {
                    userId: tenant.tenantUserId
                },
                select: {
                    id: true,
                    estoqueInsumoId: true,
                    secao: true,
                    unidade: true,
                    ordem: true,
                    ativo: true
                }
            })
        ]);
        let deduped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["dedupeInsumosBySlug"])(insumos, tenant.tenantUserId);
        deduped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dedupeInsumosByNome"])(deduped, tenant.tenantUserId);
        const cmvByInsumoId = new Map(cmvConfigs.map((c)=>[
                c.estoqueInsumoId,
                c
            ]));
        const itens = deduped.map((p)=>{
            const cmv = cmvByInsumoId.get(p.id);
            return {
                id: cmv?.id ?? null,
                estoqueInsumoId: p.id,
                nome: p.nome,
                slug: p.insumoId,
                secao: cmv?.secao ?? secaoFromCategoria(p.categoriaId),
                unidade: cmv?.unidade ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$cmv$2d$catalogo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unidadeFromEstoque"])(p.unidade),
                ordem: cmv?.ordem ?? 0,
                ativo: cmv?.ativo ?? true
            };
        }).sort((a, b)=>a.nome.localeCompare(b.nome, 'pt-BR'));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            tenantUserId: tenant.tenantUserId,
            canConfig,
            fonte: 'estoque',
            itens
        });
    }
    const configs = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.findMany({
        where: {
            userId: tenant.tenantUserId
        },
        include: {
            estoqueInsumo: {
                select: {
                    id: true,
                    nome: true,
                    insumoId: true,
                    unidade: true
                }
            }
        },
        orderBy: [
            {
                secao: 'asc'
            },
            {
                ordem: 'asc'
            },
            {
                createdAt: 'asc'
            }
        ]
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        tenantUserId: tenant.tenantUserId,
        canConfig,
        itens: configs.map((c)=>({
                id: c.id,
                estoqueInsumoId: c.estoqueInsumoId,
                nome: c.estoqueInsumo.nome,
                slug: c.estoqueInsumo.insumoId,
                secao: c.secao,
                unidade: c.unidade,
                ordem: c.ordem,
                ativo: c.ativo
            }))
    });
}
async function POST(req) {
    const { tenant, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireCmvRealAccess"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].CMV_REAL_CONFIG);
    if (error) return error;
    const body = await req.json();
    if (body.action === 'incluir_orfaos') {
        if (!body.itens?.length) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'itens obrigatório'
            }, {
                status: 400
            });
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$cmv$2d$catalogo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["incluirOrfaosNoCatalogoCmv"])({
            tenantUserId: tenant.tenantUserId,
            itens: body.itens.map((it)=>({
                    estoqueInsumoId: it.estoqueInsumoId,
                    secao: it.secao,
                    unidade: it.unidade
                }))
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            ...result
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'action inválida'
    }, {
        status: 400
    });
}
async function PATCH(req) {
    const { tenant, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$nfe$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireCmvRealAccess"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["P"].CMV_REAL_CONFIG);
    if (error) return error;
    const body = await req.json();
    if (!body.id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'id obrigatório'
        }, {
            status: 400
        });
    }
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.findFirst({
        where: {
            id: body.id,
            userId: tenant.tenantUserId
        }
    });
    if (!existing) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Não encontrado'
        }, {
            status: 404
        });
    }
    const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cmvRealInsumoConfig.update({
        where: {
            id: body.id
        },
        data: {
            ...body.secao ? {
                secao: body.secao
            } : {},
            ...body.unidade ? {
                unidade: body.unidade
            } : {},
            ...body.ordem != null ? {
                ordem: body.ordem
            } : {},
            ...body.ativo != null ? {
                ativo: body.ativo
            } : {}
        }
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        item: updated
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b5978609._.js.map