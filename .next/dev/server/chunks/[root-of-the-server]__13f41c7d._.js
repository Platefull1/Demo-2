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
"[project]/drin-platform/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/drin-platform/src/lib/estoque-nome.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/drin-platform/src/lib/stack-auth-sync.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUserByStackId",
    ()=>getUserByStackId,
    "syncStackAuthUser",
    ()=>syncStackAuthUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/db.ts [app-route] (ecmascript)");
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
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureConnection"])();
        let dbStackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.findUnique({
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
            dbStackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.create({
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
            dbStackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.update({
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
        const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
            where: {
                email: stackUser.primaryEmail
            }
        });
        if (existingUser) {
            // Associar StackUser existente ao User existente
            await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    stackUserId: dbStackUser.id,
                    fullName: stackUser.displayName || existingUser.fullName
                }
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.update({
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
        const newUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.create({
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.update({
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
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.findUnique({
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
"[project]/drin-platform/src/lib/rh-auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRhContext",
    ()=>getRhContext,
    "requireRhPermission",
    ()=>requireRhPermission,
    "rhGetUser",
    ()=>rhGetUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/stack.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/stack-auth-sync.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/server.js [app-route] (ecmascript)");
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
    const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
        or: 'return-null'
    });
    if (!stackUser) return null;
    const dbUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["syncStackAuthUser"])({
        id: stackUser.id,
        primaryEmail: stackUser.primaryEmail || undefined,
        displayName: stackUser.displayName || undefined,
        profileImageUrl: stackUser.profileImageUrl || undefined,
        primaryEmailVerified: stackUser.primaryEmailVerified ? new Date() : null
    });
    if (!dbUser) return null;
    // Dono de equipe RH: prioriza os próprios dados (evita sumir relatórios/grupos
    // quando o admin também está cadastrado como membro ou tem convite cruzado).
    const ownsTeam = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.count({
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
    const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
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
        const pendingMembership = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
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
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.update({
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
            error: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
            error: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
            error: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
"[project]/drin-platform/src/lib/effective-user.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/rh-auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
async function getEffectiveDbUser() {
    const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRhContext"])();
    if (!ctx) return null;
    return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            id: ctx.userId
        }
    });
}
async function getEffectiveUserIds(tenantUserId) {
    // Busca membros ativos que já fizeram login (têm stackUserId)
    const members = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findMany({
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
    const memberUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findMany({
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
"[project]/drin-platform/src/lib/estoque-tenant.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$effective$2d$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/effective-user.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/estoque-nome.ts [app-route] (ecmascript)");
;
;
async function getEstoqueTenantContext() {
    const dbUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$effective$2d$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEffectiveDbUser"])();
    if (!dbUser) return null;
    const userIds = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$effective$2d$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEffectiveUserIds"])(dbUser.id);
    return {
        tenantUserId: dbUser.id,
        userIds
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
"[project]/drin-platform/src/lib/estoque-insumos-padrao.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Lista padrão de insumos usada como seed inicial para novos usuários.
// Pode ser importada tanto pelo servidor (API) quanto pelo cliente.
__turbopack_context__.s([
    "CATEGORIAS_PADRAO",
    ()=>CATEGORIAS_PADRAO,
    "INSUMOS_PADRAO",
    ()=>INSUMOS_PADRAO
]);
const MATERIAS_PRIMAS = [
    {
        insumoId: 'abacaxi',
        nome: 'ABACAXI',
        unidade: 'un'
    },
    {
        insumoId: 'acucar',
        nome: 'AÇÚCAR',
        unidade: 'kg'
    },
    {
        insumoId: 'alho-moido',
        nome: 'ALHO MOÍDO',
        unidade: 'kg'
    },
    {
        insumoId: 'alho-crocante',
        nome: 'ALHO CROCANTE',
        unidade: 'kg'
    },
    {
        insumoId: 'amaciante-carne',
        nome: 'AMACIANTE DE CARNE',
        unidade: 'kg'
    },
    {
        insumoId: 'aneis-cebola',
        nome: 'ANÉIS DE CEBOLA',
        unidade: 'kg'
    },
    {
        insumoId: 'amendoim-granulado',
        nome: 'AMENDOIM GRANULADO',
        unidade: 'kg'
    },
    {
        insumoId: 'ameixa',
        nome: 'AMEIXA',
        unidade: 'kg'
    },
    {
        insumoId: 'atum-lata',
        nome: 'ATUM LATA',
        unidade: 'un'
    },
    {
        insumoId: 'azeite-oliva',
        nome: 'AZEITE DE OLIVA',
        unidade: 'L'
    },
    {
        insumoId: 'azeitona-preta',
        nome: 'AZEITONA PRETA',
        unidade: 'kg'
    },
    {
        insumoId: 'azeitona-verde',
        nome: 'AZEITONA VERDE',
        unidade: 'kg'
    },
    {
        insumoId: 'bacon-cru',
        nome: 'BACON (CRU)',
        unidade: 'kg'
    },
    {
        insumoId: 'banana',
        nome: 'BANANA',
        unidade: 'kg'
    },
    {
        insumoId: 'barbecue',
        nome: 'BARBECUE',
        unidade: 'kg'
    },
    {
        insumoId: 'batata-palha',
        nome: 'BATATA PALHA',
        unidade: 'kg'
    },
    {
        insumoId: 'batata-sorriso',
        nome: 'BATATA SORRISO',
        unidade: 'kg'
    },
    {
        insumoId: 'berinjela-crua',
        nome: 'BERINJELA (CRUA)',
        unidade: 'kg'
    },
    {
        insumoId: 'bolacha-negresco',
        nome: 'BOLACHA NEGRESCO',
        unidade: 'un'
    },
    {
        insumoId: 'biscoito-kitkat',
        nome: 'BISCOITO KIT KAT',
        unidade: 'un'
    },
    {
        insumoId: 'brocolis',
        nome: 'BRÓCOLIS',
        unidade: 'kg'
    },
    {
        insumoId: 'camarao',
        nome: 'CAMARÃO',
        unidade: 'kg'
    },
    {
        insumoId: 'canela',
        nome: 'CANELA',
        unidade: 'kg'
    },
    {
        insumoId: 'carne-isca-strogonoff',
        nome: 'CARNE EM ISCA (STROGONOFF)',
        unidade: 'kg'
    },
    {
        insumoId: 'carne-moida-bolonhesa',
        nome: 'CARNE MOÍDA (BOLONHESA)',
        unidade: 'kg'
    },
    {
        insumoId: 'catchup-galao',
        nome: 'CATCHUP GALÃO',
        unidade: 'un'
    },
    {
        insumoId: 'catchup-sache',
        nome: 'CATCHUP SACHE',
        unidade: 'un'
    },
    {
        insumoId: 'cebola',
        nome: 'CEBOLA',
        unidade: 'kg'
    },
    {
        insumoId: 'cebola-crocante',
        nome: 'CEBOLA CROCANTE',
        unidade: 'kg'
    },
    {
        insumoId: 'cereja',
        nome: 'CEREJA',
        unidade: 'kg'
    },
    {
        insumoId: 'champignon',
        nome: 'CHAMPIGNON',
        unidade: 'kg'
    },
    {
        insumoId: 'chocolate-branco',
        nome: 'CHOCOLATE BRANCO',
        unidade: 'kg'
    },
    {
        insumoId: 'chocolate-preto',
        nome: 'CHOCOLATE PRETO',
        unidade: 'kg'
    },
    {
        insumoId: 'coco-ralado',
        nome: 'COCO RALADO',
        unidade: 'kg'
    },
    {
        insumoId: 'confete',
        nome: 'CONFETE',
        unidade: 'un'
    },
    {
        insumoId: 'creme-leite',
        nome: 'CREME DE LEITE',
        unidade: 'un'
    },
    {
        insumoId: 'creme-beijinho',
        nome: 'CREME BEIJINHO',
        unidade: 'kg'
    },
    {
        insumoId: 'creme-pistache',
        nome: 'CREME PISTACHE',
        unidade: 'kg'
    },
    {
        insumoId: 'creme-culinario',
        nome: 'CREME CULINÁRIO',
        unidade: 'kg'
    },
    {
        insumoId: 'creme-galak',
        nome: 'CREME GALAK',
        unidade: 'kg'
    },
    {
        insumoId: 'creme-kitkat',
        nome: 'CREME KIT KAT',
        unidade: 'kg'
    },
    {
        insumoId: 'costela',
        nome: 'COSTELA',
        unidade: 'kg'
    },
    {
        insumoId: 'doce-leite',
        nome: 'DOCE DE LEITE',
        unidade: 'kg'
    },
    {
        insumoId: 'ervilha',
        nome: 'ERVILHA',
        unidade: 'kg'
    },
    {
        insumoId: 'escarola-crua',
        nome: 'ESCAROLA (CRUA)',
        unidade: 'kg'
    },
    {
        insumoId: 'doritos',
        nome: 'DORITOS',
        unidade: 'un'
    },
    {
        insumoId: 'farinha-trigo',
        nome: 'FARINHA DE TRIGO',
        unidade: 'kg'
    },
    {
        insumoId: 'fermento-biologico',
        nome: 'FERMENTO BIOLÓGICO',
        unidade: 'kg'
    },
    {
        insumoId: 'figo-calda',
        nome: 'FIGO EM CALDA',
        unidade: 'kg'
    },
    {
        insumoId: 'file-peito-sem-osso',
        nome: 'FILÉ DE PEITO SEM OSSO',
        unidade: 'kg'
    },
    {
        insumoId: 'lemon-pepper',
        nome: 'LEMON PEPPER',
        unidade: 'kg'
    },
    {
        insumoId: 'linguica-calabresa',
        nome: 'LINGUIÇA CALABRESA',
        unidade: 'kg'
    },
    {
        insumoId: 'lombo',
        nome: 'LOMBO',
        unidade: 'kg'
    },
    {
        insumoId: 'maionese-sache',
        nome: 'MAIONESE SACHE',
        unidade: 'un'
    },
    {
        insumoId: 'manjericao-italiano',
        nome: 'MANJERICÃO ITALIANO',
        unidade: 'kg'
    },
    {
        insumoId: 'margarina',
        nome: 'MARGARINA',
        unidade: 'kg'
    },
    {
        insumoId: 'milho',
        nome: 'MILHO',
        unidade: 'kg'
    },
    {
        insumoId: 'molho-pizza',
        nome: 'MOLHO PIZZA',
        unidade: 'kg'
    },
    {
        insumoId: 'molho-tomodoro',
        nome: 'MOLHO TOMODORO',
        unidade: 'kg'
    },
    {
        insumoId: 'morango',
        nome: 'MORANGO',
        unidade: 'kg'
    },
    {
        insumoId: 'mostarda-galao',
        nome: 'MOSTARDA GALÃO',
        unidade: 'un'
    },
    {
        insumoId: 'mostarda-sache',
        nome: 'MOSTARDA SACHE',
        unidade: 'un'
    },
    {
        insumoId: 'molho-pimenta-sache',
        nome: 'MOLHO PIMENTA SACHE',
        unidade: 'un'
    },
    {
        insumoId: 'oleo',
        nome: 'ÓLEO',
        unidade: 'L'
    },
    {
        insumoId: 'oregano',
        nome: 'ORÉGANO',
        unidade: 'kg'
    },
    {
        insumoId: 'ovos',
        nome: 'OVOS',
        unidade: 'un'
    },
    {
        insumoId: 'palmito',
        nome: 'PALMITO',
        unidade: 'kg'
    },
    {
        insumoId: 'pepperoni',
        nome: 'PEPPERONI',
        unidade: 'kg'
    },
    {
        insumoId: 'pessego-calda',
        nome: 'PÊSSEGO EM CALDA',
        unidade: 'kg'
    },
    {
        insumoId: 'pimenta-calabresa',
        nome: 'PIMENTA CALABRESA',
        unidade: 'kg'
    },
    {
        insumoId: 'pimentao-verde',
        nome: 'PIMENTÃO VERDE',
        unidade: 'kg'
    },
    {
        insumoId: 'pasta-alho',
        nome: 'PASTA DE ALHO',
        unidade: 'kg'
    },
    {
        insumoId: 'presunto',
        nome: 'PRESUNTO',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-catupiry',
        nome: 'QUEIJO CATUPIRY',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-cheddar',
        nome: 'QUEIJO CHEDDAR',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-gorgonzola',
        nome: 'QUEIJO GORGONZOLA',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-mussarela',
        nome: 'QUEIJO MUSSARELA',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-cream-cheese',
        nome: 'QUEIJO CREAM CHEESE',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-parmesao',
        nome: 'QUEIJO PARMESÃO',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-provolone',
        nome: 'QUEIJO PROVOLONE',
        unidade: 'kg'
    },
    {
        insumoId: 'queijo-ricota',
        nome: 'QUEIJO RICOTA',
        unidade: 'kg'
    },
    {
        insumoId: 'rucula',
        nome: 'RÚCULA',
        unidade: 'kg'
    },
    {
        insumoId: 'sal',
        nome: 'SAL',
        unidade: 'kg'
    },
    {
        insumoId: 'salame-italiano',
        nome: 'SALAME ITALIANO',
        unidade: 'kg'
    },
    {
        insumoId: 'semola',
        nome: 'SÊMOLA',
        unidade: 'kg'
    },
    {
        insumoId: 'tempero-completo',
        nome: 'TEMPERO COMPLETO',
        unidade: 'kg'
    },
    {
        insumoId: 'tomate',
        nome: 'TOMATE',
        unidade: 'kg'
    },
    {
        insumoId: 'tomate-seco',
        nome: 'TOMATE SECO',
        unidade: 'kg'
    },
    {
        insumoId: 'tomate-cereja',
        nome: 'TOMATE CEREJA',
        unidade: 'kg'
    },
    {
        insumoId: 'uva-passas',
        nome: 'UVA PASSAS',
        unidade: 'kg'
    },
    {
        insumoId: 'vinagre',
        nome: 'VINAGRE',
        unidade: 'L'
    }
];
const EMBALAGENS = [
    {
        insumoId: 'embalagem-20',
        nome: 'EMBALAGEM 20',
        unidade: 'un'
    },
    {
        insumoId: 'embalagem-25',
        nome: 'EMBALAGEM 25',
        unidade: 'un'
    },
    {
        insumoId: 'embalagem-30',
        nome: 'EMBALAGEM 30',
        unidade: 'un'
    },
    {
        insumoId: 'embalagem-35',
        nome: 'EMBALAGEM 35',
        unidade: 'un'
    },
    {
        insumoId: 'embalagem-40',
        nome: 'EMBALAGEM 40',
        unidade: 'un'
    },
    {
        insumoId: 'embalagem-calzone',
        nome: 'EMBALAGEM CALZONE',
        unidade: 'un'
    },
    {
        insumoId: 'embalagem-entradas',
        nome: 'EMBALAGEM ENTRADAS',
        unidade: 'un'
    },
    {
        insumoId: 'mesinha',
        nome: 'MESINHA',
        unidade: 'un'
    },
    {
        insumoId: 'separador',
        nome: 'SEPARADOR',
        unidade: 'un'
    }
];
const BEBIDAS = [
    {
        insumoId: 'agua-com-gas',
        nome: 'ÁGUA COM GÁS',
        unidade: 'un'
    },
    {
        insumoId: 'agua-sem-gas',
        nome: 'ÁGUA SEM GÁS',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-sol',
        nome: 'CERVEJA SOL',
        unidade: 'un'
    },
    {
        insumoId: 'energetico',
        nome: 'ENERGÉTICO',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-heineken-long-neck',
        nome: 'CERVEJA HEINEKEN LONG NECK',
        unidade: 'un'
    },
    {
        insumoId: 'cha-limao-15',
        nome: 'CHÁ LIMÃO 1,5',
        unidade: 'un'
    },
    {
        insumoId: 'cha-pessego-15',
        nome: 'CHÁ PÊSSEGO 1,5',
        unidade: 'un'
    },
    {
        insumoId: 'coca-lata',
        nome: 'COCA LATA',
        unidade: 'un'
    },
    {
        insumoId: 'coca-lata-zero',
        nome: 'COCA LATA ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'coca-600',
        nome: 'COCA 600',
        unidade: 'un'
    },
    {
        insumoId: 'coca-600-zero',
        nome: 'COCA 600 ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'coca-1litro',
        nome: 'COCA 1 LITRO',
        unidade: 'un'
    },
    {
        insumoId: 'coca-1litro-zero',
        nome: 'COCA 1 LITRO ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'coca-2litros',
        nome: 'COCA 2 LITROS',
        unidade: 'un'
    },
    {
        insumoId: 'coca-2litros-zero',
        nome: 'COCA 2 LITROS ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'fanta-guarana-lata',
        nome: 'FANTA GUARANÁ LATA',
        unidade: 'un'
    },
    {
        insumoId: 'fanta-guarana-2l',
        nome: 'FANTA GUARANÁ 2 LITROS',
        unidade: 'un'
    },
    {
        insumoId: 'fanta-guarana-zero-2l',
        nome: 'FANTA GUARANÁ ZERO 2 LITROS',
        unidade: 'un'
    },
    {
        insumoId: 'fanta-laranja-lata',
        nome: 'FANTA LARANJA LATA',
        unidade: 'un'
    },
    {
        insumoId: 'fanta-laranja-2l',
        nome: 'FANTA LARANJA 2 LITROS',
        unidade: 'un'
    },
    {
        insumoId: 'kuat-lata',
        nome: 'KUAT LATA',
        unidade: 'un'
    },
    {
        insumoId: 'kuat-2l',
        nome: 'KUAT 2 LITROS',
        unidade: 'un'
    },
    {
        insumoId: 'kuat-2l-zero',
        nome: 'KUAT 2 LITROS ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'sprite-2l',
        nome: 'SPRITE 2 LITROS',
        unidade: 'un'
    },
    {
        insumoId: 'suco-maracuja',
        nome: 'SUCO MARACUJÁ',
        unidade: 'un'
    },
    {
        insumoId: 'suco-manga',
        nome: 'SUCO DE MANGA',
        unidade: 'un'
    },
    {
        insumoId: 'suco-pessego',
        nome: 'SUCO PÊSSEGO',
        unidade: 'un'
    },
    {
        insumoId: 'suco-uva',
        nome: 'SUCO UVA',
        unidade: 'un'
    },
    {
        insumoId: 'suco-integral-uva-15',
        nome: 'SUCO INTEGRAL UVA 1,5',
        unidade: 'un'
    },
    {
        insumoId: 'tonica',
        nome: 'TÔNICA',
        unidade: 'un'
    },
    {
        insumoId: 'suco-laranja-900ml',
        nome: 'SUCO DE LARANJA 900 ML',
        unidade: 'un'
    },
    {
        insumoId: 'suco-abacaxi-900ml',
        nome: 'SUCO DE ABACAXI 900 ML',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-becks-lata',
        nome: 'CERVEJA BECKS LATA',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-becks-long-neck',
        nome: 'CERVEJA BECKS LONG NECK',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-budweiser-lata',
        nome: 'CERVEJA BUDWEISER LATA',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-spaten-long-neck',
        nome: 'CERVEJA SPATEN LONG NECK',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-spaten-lata',
        nome: 'CERVEJA SPATEN LATA',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-budweiser-long-neck',
        nome: 'CERVEJA BUDWEISER LONG NECK',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-original-lata',
        nome: 'CERVEJA ORIGINAL LATA',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-original-long-neck',
        nome: 'CERVEJA ORIGINAL LONG NECK',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-stella-lata',
        nome: 'CERVEJA STELLA ARTOIS LATA',
        unidade: 'un'
    },
    {
        insumoId: 'cerveja-stella-long-neck',
        nome: 'CERVEJA STELLA ARTOIS LONG NECK',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-lata',
        nome: 'GUARANÁ ANTÁRCTICA LATA',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-lata-zero',
        nome: 'GUARANÁ ANTÁRCTICA LATA ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-600',
        nome: 'GUARANÁ ANTÁRCTICA 600',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-200',
        nome: 'GUARANÁ ANTÁRCTICA 200',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-2l',
        nome: 'GUARANÁ ANTÁRCTICA 2L',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-2l-zero',
        nome: 'GUARANÁ ANTÁRCTICA 2L ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'pepsi-lata',
        nome: 'PEPSI LATA',
        unidade: 'un'
    },
    {
        insumoId: 'pepsi-lata-zero',
        nome: 'PEPSI LATA ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'pepsi-600',
        nome: 'PEPSI 600',
        unidade: 'un'
    },
    {
        insumoId: 'guarana-antarctica-600-zero',
        nome: 'GUARANÁ ANTÁRCTICA 600 ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'pepsi-2l',
        nome: 'PEPSI 2L',
        unidade: 'un'
    },
    {
        insumoId: 'pepsi-2l-zero',
        nome: 'PEPSI 2L ZERO',
        unidade: 'un'
    },
    {
        insumoId: 'soda',
        nome: 'SODA',
        unidade: 'un'
    },
    {
        insumoId: 'powerade',
        nome: 'POWERADE',
        unidade: 'un'
    }
];
const CATEGORIAS_PADRAO = [
    {
        id: 'materias-primas',
        nome: 'Matéria Prima',
        icone: '🧂'
    },
    {
        id: 'embalagens',
        nome: 'Embalagens',
        icone: '📦'
    },
    {
        id: 'bebidas',
        nome: 'Bebidas',
        icone: '🥤'
    },
    {
        id: 'receitas',
        nome: 'Receitas',
        icone: '📋'
    }
];
const INSUMOS_PADRAO = [
    ...MATERIAS_PRIMAS.map((p)=>({
            ...p,
            categoriaId: 'materias-primas',
            categoriaNome: 'Matéria Prima',
            categoriaIcone: '🧂'
        })),
    ...EMBALAGENS.map((p)=>({
            ...p,
            categoriaId: 'embalagens',
            categoriaNome: 'Embalagens',
            categoriaIcone: '📦'
        })),
    ...BEBIDAS.map((p)=>({
            ...p,
            categoriaId: 'bebidas',
            categoriaNome: 'Bebidas',
            categoriaIcone: '🥤'
        }))
];
}),
"[project]/drin-platform/app/api/estoque/insumos/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/estoque-nome.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/estoque-tenant.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$insumos$2d$padrao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/estoque-insumos-padrao.ts [app-route] (ecmascript)");
;
;
;
;
;
const dynamic = 'force-dynamic';
async function GET() {
    try {
        const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEstoqueTenantContext"])();
        if (!ctx) return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Não autorizado'
        }, {
            status: 401
        });
        const { tenantUserId, userIds } = ctx;
        let insumos = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findMany({
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
        });
        insumos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["dedupeInsumosBySlug"])(insumos, tenantUserId);
        // Evita "triplicar" o mesmo produto criado uma vez por loja (slugs diferentes, mesmo nome)
        insumos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dedupeInsumosByNome"])(insumos, tenantUserId);
        // Seed automático na primeira vez que o tenant acessa (nenhum membro tem dados)
        if (insumos.length === 0) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.createMany({
                data: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$insumos$2d$padrao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["INSUMOS_PADRAO"].map((p)=>({
                        userId: tenantUserId,
                        insumoId: p.insumoId,
                        nome: p.nome,
                        unidade: p.unidade,
                        categoriaId: p.categoriaId,
                        categoriaNome: p.categoriaNome,
                        categoriaIcone: p.categoriaIcone
                    })),
                skipDuplicates: true
            });
            insumos = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findMany({
                where: {
                    userId: tenantUserId
                },
                orderBy: [
                    {
                        categoriaId: 'asc'
                    },
                    {
                        createdAt: 'asc'
                    }
                ]
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(insumos);
    } catch (err) {
        console.error('[GET /api/estoque/insumos]', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro interno'
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEstoqueTenantContext"])();
        if (!ctx) return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Não autorizado'
        }, {
            status: 401
        });
        const { tenantUserId, userIds } = ctx;
        const body = await req.json();
        const { nome, unidade, categoriaId, categoriaNome, categoriaIcone } = body;
        if (!nome?.trim() || !unidade?.trim() || !categoriaId?.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'nome, unidade e categoriaId são obrigatórios'
            }, {
                status: 400
            });
        }
        const nomeFinal = nome.trim().toUpperCase();
        const jaExiste = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findFirst({
            where: {
                userId: {
                    in: userIds
                },
                nome: nomeFinal
            }
        });
        if (jaExiste) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Este produto já está na lista. O catálogo é compartilhado entre todas as lojas — basta adicionar uma vez.'
            }, {
                status: 409
            });
        }
        const baseSlug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$estoque$2d$nome$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["slugifyInsumoNome"])(nomeFinal) || `produto-${Date.now()}`;
        const slugTaken = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.findFirst({
            where: {
                userId: {
                    in: userIds
                },
                insumoId: baseSlug
            }
        });
        const insumoId = slugTaken ? `${baseSlug}-${Date.now()}` : baseSlug;
        const insumo = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].estoqueInsumo.create({
            data: {
                userId: tenantUserId,
                insumoId,
                nome: nomeFinal,
                unidade: unidade.trim(),
                categoriaId,
                categoriaNome: categoriaNome || categoriaId,
                categoriaIcone: categoriaIcone || '📦'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(insumo, {
            status: 201
        });
    } catch (err) {
        console.error('[POST /api/estoque/insumos]', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro interno'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__13f41c7d._.js.map