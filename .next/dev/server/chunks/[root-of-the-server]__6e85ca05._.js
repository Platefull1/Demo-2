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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

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
"[project]/drin-platform/src/types/admin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
    SystemTool["REGISTRAR_OCORRENCIAS"] = "registrar_ocorrencias";
    SystemTool["VER_OCORRENCIAS"] = "ver_ocorrencias";
    return SystemTool;
}({});
}),
"[project]/drin-platform/src/lib/ocorrencias-auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Contexto de autenticação para o módulo Central de Ocorrências.
 *
 * Separado do módulo de reclamações. Reutiliza só o cadastro de lojas/motoboys
 * (tenant = User.id) e, quando o login é membro de equipe RH, resolve o dono
 * dos dados — senão os 4 logins de loja não veriam as lojas da empresa.
 */ __turbopack_context__.s([
    "getOcorrenciasContext",
    ()=>getOcorrenciasContext,
    "isOcorrenciasOnlyUser",
    ()=>isOcorrenciasOnlyUser,
    "isOcorrenciasTenantAdmin",
    ()=>isOcorrenciasTenantAdmin,
    "requireOcorrenciasContext",
    ()=>requireOcorrenciasContext,
    "resolveOcorrenciasTenant",
    ()=>resolveOcorrenciasTenant
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/stack.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/stack-auth-sync.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/types/admin.ts [app-route] (ecmascript)");
;
;
;
;
;
async function resolveOcorrenciasTenant(stackUser, dbUserId) {
    const ownsTeam = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.count({
        where: {
            tenantUserId: dbUserId,
            isActive: true
        }
    }) > 0;
    if (ownsTeam) {
        return {
            tenantUserId: dbUserId,
            isTenantOwner: true
        };
    }
    const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
        where: {
            stackUserId: stackUser.id,
            isActive: true
        }
    });
    if (membership && membership.tenantUserId !== dbUserId) {
        return {
            tenantUserId: membership.tenantUserId,
            isTenantOwner: false
        };
    }
    if (stackUser.primaryEmail) {
        const pending = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
            where: {
                email: stackUser.primaryEmail.toLowerCase(),
                stackUserId: null,
                isActive: true,
                NOT: {
                    tenantUserId: dbUserId
                }
            }
        });
        if (pending) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.update({
                where: {
                    id: pending.id
                },
                data: {
                    stackUserId: stackUser.id,
                    displayName: stackUser.displayName ?? undefined
                }
            });
            return {
                tenantUserId: pending.tenantUserId,
                isTenantOwner: false
            };
        }
    }
    const hasLojas = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhLoja.count({
        where: {
            userId: dbUserId
        }
    }) > 0;
    return {
        tenantUserId: dbUserId,
        isTenantOwner: hasLojas
    };
}
async function isOcorrenciasTenantAdmin(stackUserId) {
    const su = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stackUser.findUnique({
        where: {
            id: stackUserId
        },
        select: {
            userId: true,
            primaryEmail: true,
            displayName: true
        }
    });
    if (!su?.userId) return false;
    const { isTenantOwner } = await resolveOcorrenciasTenant({
        id: stackUserId,
        primaryEmail: su.primaryEmail,
        displayName: su.displayName
    }, su.userId);
    return isTenantOwner;
}
async function getOcorrenciasContext() {
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
    const { tenantUserId, isTenantOwner } = await resolveOcorrenciasTenant({
        id: stackUser.id,
        primaryEmail: stackUser.primaryEmail,
        displayName: stackUser.displayName
    }, dbUser.id);
    const [regPerm, verPerm] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userToolPermission.findUnique({
            where: {
                stackUserId_tool: {
                    stackUserId: stackUser.id,
                    tool: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"].REGISTRAR_OCORRENCIAS
                }
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userToolPermission.findUnique({
            where: {
                stackUserId_tool: {
                    stackUserId: stackUser.id,
                    tool: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"].VER_OCORRENCIAS
                }
            }
        })
    ]);
    const canRegister = regPerm?.isEnabled === true || isTenantOwner;
    const canView = verPerm?.isEnabled === true || isTenantOwner;
    if (!canRegister && !canView) return null;
    return {
        userId: tenantUserId,
        stackUserId: stackUser.id,
        canRegister,
        canView,
        isTenantOwner
    };
}
async function requireOcorrenciasContext(requirePermission) {
    const ctx = await getOcorrenciasContext();
    if (!ctx) {
        return {
            ctx: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sessão expirada ou sem permissão para acessar ocorrências'
            }, {
                status: 401
            })
        };
    }
    if (requirePermission === 'REGISTRAR' && !ctx.canRegister) {
        return {
            ctx: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sem permissão para registrar ocorrências'
            }, {
                status: 403
            })
        };
    }
    if (requirePermission === 'VER' && !ctx.canView) {
        return {
            ctx: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sem permissão para visualizar ocorrências'
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
async function isOcorrenciasOnlyUser() {
    const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
        or: 'return-null'
    });
    if (!stackUser) return false;
    if (await isOcorrenciasTenantAdmin(stackUser.id)) return false;
    const allPerms = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userToolPermission.findMany({
        where: {
            stackUserId: stackUser.id,
            isEnabled: true
        },
        select: {
            tool: true
        }
    });
    if (allPerms.length === 0) return false;
    const tools = allPerms.map((p)=>p.tool);
    return tools.includes(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"].REGISTRAR_OCORRENCIAS) && !tools.includes(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"].VER_OCORRENCIAS) && tools.every((t)=>t === __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"].REGISTRAR_OCORRENCIAS);
}
}),
"[project]/drin-platform/src/lib/ocorrencias-storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OCORRENCIAS_BUCKET",
    ()=>OCORRENCIAS_BUCKET,
    "createOcorrenciaFotoSignedUrl",
    ()=>createOcorrenciaFotoSignedUrl,
    "createOcorrenciaFotoSignedUrls",
    ()=>createOcorrenciaFotoSignedUrls,
    "deleteOcorrenciaFoto",
    ()=>deleteOcorrenciaFoto,
    "uploadOcorrenciaFoto",
    ()=>uploadOcorrenciaFoto
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const OCORRENCIAS_BUCKET = 'ocorrencias-fotos';
const SIGNED_URL_TTL = 3600; // 1 hora
let _client = null;
function getClient() {
    const url = ("TURBOPACK compile-time value", "uluydllxvrteawtltceu")?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !key) return null;
    const fullUrl = url.startsWith('http') ? url : `https://${url}.supabase.co`;
    if (!_client) _client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(fullUrl, key);
    return _client;
}
async function uploadOcorrenciaFoto(path, data, contentType) {
    const supabase = getClient();
    if (!supabase) throw new Error('Supabase não configurado');
    const { error } = await supabase.storage.from(OCORRENCIAS_BUCKET).upload(path, data, {
        contentType,
        upsert: false
    });
    if (error) throw new Error(`Upload falhou: ${error.message}`);
    return path;
}
async function deleteOcorrenciaFoto(path) {
    const supabase = getClient();
    if (!supabase) return;
    await supabase.storage.from(OCORRENCIAS_BUCKET).remove([
        path
    ]);
}
async function createOcorrenciaFotoSignedUrl(path) {
    const supabase = getClient();
    if (!supabase) return null;
    const { data, error } = await supabase.storage.from(OCORRENCIAS_BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
}
async function createOcorrenciaFotoSignedUrls(paths) {
    const unique = [
        ...new Set(paths.filter(Boolean))
    ];
    if (unique.length === 0) return {};
    const supabase = getClient();
    if (!supabase) return {};
    const { data, error } = await supabase.storage.from(OCORRENCIAS_BUCKET).createSignedUrls(unique, SIGNED_URL_TTL);
    if (error || !data) return {};
    const map = {};
    for (const item of data){
        if (item.path && item.signedUrl) map[item.path] = item.signedUrl;
    }
    return map;
}
}),
"[project]/drin-platform/src/lib/ocorrencias-lojas.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Escritório / central não entram no lançamento mobile. */ __turbopack_context__.s([
    "isLojaEscritorio",
    ()=>isLojaEscritorio
]);
function isLojaEscritorio(nome) {
    const n = nome.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
    return n.includes('escritorio') || n.includes('central');
}
}),
"[project]/drin-platform/src/lib/ocorrencias-period.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Fuso fixo America/Sao_Paulo (UTC−3; Brasil sem horário de verão desde 2019). */ __turbopack_context__.s([
    "currentMonthBoundsSP",
    ()=>currentMonthBoundsSP,
    "saoPauloYmd",
    ()=>saoPauloYmd,
    "spDayEnd",
    ()=>spDayEnd,
    "spDayStart",
    ()=>spDayStart
]);
const SP_OFFSET = '-03:00';
function saoPauloYmd(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(date);
    const get = (type)=>Number(parts.find((p)=>p.type === type)?.value);
    return {
        year: get('year'),
        month: get('month'),
        day: get('day')
    };
}
function currentMonthBoundsSP(now = new Date()) {
    const { year, month } = saoPauloYmd(now);
    const mm = String(month).padStart(2, '0');
    const start = new Date(`${year}-${mm}-01T00:00:00.000${SP_OFFSET}`);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const nm = String(nextMonth).padStart(2, '0');
    const end = new Date(new Date(`${nextYear}-${nm}-01T00:00:00.000${SP_OFFSET}`).getTime() - 1);
    return {
        start,
        end
    };
}
function spDayStart(ymd) {
    return new Date(`${ymd}T00:00:00.000${SP_OFFSET}`);
}
function spDayEnd(ymd) {
    return new Date(`${ymd}T23:59:59.999${SP_OFFSET}`);
}
}),
"[project]/drin-platform/app/api/ocorrencias/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/ocorrencias-auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/ocorrencias-storage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/ocorrencias-lojas.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$period$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/ocorrencias-period.ts [app-route] (ecmascript)");
const dynamic = 'force-dynamic';
;
;
;
;
;
;
;
;
const MAX_FOTO_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic'
]);
const bodySchema = __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    lojaId: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Loja obrigatória'),
    numeroPedidoSaipos: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Número do pedido Saipos obrigatório'),
    numeroPedidoExterno: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    canalExterno: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'IFOOD',
        'DELIVERY_DIRETO'
    ]).optional(),
    descricao: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    motoboyId: __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
function ymdFromIsoOrDate(value) {
    if (!value) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    const { year, month, day } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$period$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saoPauloYmd"])(d);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
async function POST(request) {
    const { ctx, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireOcorrenciasContext"])('REGISTRAR');
    if (error) return error;
    let formData;
    try {
        formData = await request.formData();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Requisição inválida (multipart esperado)'
        }, {
            status: 400
        });
    }
    const foto = formData.get('foto');
    if (!foto) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Foto obrigatória'
        }, {
            status: 400
        });
    }
    if (!ACCEPTED_TYPES.has(foto.type)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Tipo de arquivo não suportado. Use JPEG, PNG, WEBP ou HEIC.'
        }, {
            status: 400
        });
    }
    const fotoBuffer = Buffer.from(await foto.arrayBuffer());
    if (fotoBuffer.length > MAX_FOTO_BYTES) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Foto muito grande. Máximo: 8 MB.'
        }, {
            status: 400
        });
    }
    const campos = {
        lojaId: formData.get('lojaId'),
        numeroPedidoSaipos: formData.get('numeroPedidoSaipos'),
        numeroPedidoExterno: formData.get('numeroPedidoExterno') || undefined,
        canalExterno: formData.get('canalExterno') || undefined,
        descricao: formData.get('descricao'),
        motoboyId: formData.get('motoboyId') || undefined
    };
    const parsed = bodySchema.safeParse(campos);
    if (!parsed.success) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Dados inválidos',
            detalhes: parsed.error.flatten().fieldErrors
        }, {
            status: 400
        });
    }
    const { lojaId, numeroPedidoSaipos, numeroPedidoExterno, canalExterno, descricao, motoboyId } = parsed.data;
    if (numeroPedidoExterno && !canalExterno) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Canal externo obrigatório quando há número de pedido externo'
        }, {
            status: 400
        });
    }
    const loja = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhLoja.findFirst({
        where: {
            id: lojaId,
            userId: ctx.userId,
            ativo: true
        }
    });
    if (!loja || (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$lojas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isLojaEscritorio"])(loja.nome)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Loja inválida'
        }, {
            status: 400
        });
    }
    if (motoboyId) {
        const motoboy = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deliveryRider.findFirst({
            where: {
                id: motoboyId,
                userId: ctx.userId,
                lojaId,
                status: 'active'
            }
        });
        if (!motoboy) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Motoboy inválido para esta loja'
            }, {
                status: 400
            });
        }
    }
    const ocorrenciaId = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])();
    const { year, month } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$period$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saoPauloYmd"])();
    const mesPasta = `${year}-${String(month).padStart(2, '0')}`;
    const fotoPath = `${ctx.userId}/${mesPasta}/${ocorrenciaId}.jpg`;
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uploadOcorrenciaFoto"])(fotoPath, fotoBuffer, foto.type);
    } catch (err) {
        console.error('[ocorrencias] upload foto falhou:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro ao enviar foto. Tente novamente.'
        }, {
            status: 500
        });
    }
    try {
        const ocorrencia = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].ocorrencia.create({
            data: {
                id: ocorrenciaId,
                userId: ctx.userId,
                lojaId,
                numeroPedidoSaipos,
                numeroPedidoExterno: numeroPedidoExterno || null,
                canalExterno: canalExterno || null,
                descricao,
                fotoPath,
                motoboyId: motoboyId || null,
                criadoPorUserId: ctx.stackUserId
            },
            select: {
                id: true,
                numeroPedidoSaipos: true,
                loja: {
                    select: {
                        nome: true
                    }
                },
                createdAt: true
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            ocorrencia
        }, {
            status: 201
        });
    } catch (err) {
        console.error('[ocorrencias] create falhou, removendo foto:', err);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteOcorrenciaFoto"])(fotoPath);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro ao salvar ocorrência. Foto removida. Tente novamente.'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    const { ctx, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireOcorrenciasContext"])('VER');
    if (error) return error;
    const { searchParams } = new URL(request.url);
    const lojaId = searchParams.get('lojaId') || undefined;
    const motoboyId = searchParams.get('motoboyId') || undefined;
    const busca = searchParams.get('busca') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = 25;
    const defaults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$period$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentMonthBoundsSP"])();
    const inicioYmd = ymdFromIsoOrDate(searchParams.get('inicio'));
    const fimYmd = ymdFromIsoOrDate(searchParams.get('fim'));
    const inicio = inicioYmd ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$period$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["spDayStart"])(inicioYmd) : defaults.start;
    const fim = fimYmd ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$period$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["spDayEnd"])(fimYmd) : defaults.end;
    const where = {
        userId: ctx.userId,
        createdAt: {
            gte: inicio,
            lte: fim
        }
    };
    if (lojaId) where.lojaId = lojaId;
    if (motoboyId) where.motoboyId = motoboyId;
    if (busca) {
        where.OR = [
            {
                numeroPedidoSaipos: {
                    contains: busca,
                    mode: 'insensitive'
                }
            },
            {
                numeroPedidoExterno: {
                    contains: busca,
                    mode: 'insensitive'
                }
            }
        ];
    }
    const [total, ocorrencias, totalPorLoja] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].ocorrencia.count({
            where
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].ocorrencia.findMany({
            where,
            select: {
                id: true,
                numeroPedidoSaipos: true,
                numeroPedidoExterno: true,
                canalExterno: true,
                descricao: true,
                fotoPath: true,
                criadoPorUserId: true,
                createdAt: true,
                loja: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                motoboy: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (page - 1) * pageSize,
            take: pageSize
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].ocorrencia.groupBy({
            by: [
                'lojaId'
            ],
            where,
            _count: {
                id: true
            }
        })
    ]);
    const lojaIds = totalPorLoja.map((t)=>t.lojaId);
    const criadorIds = [
        ...new Set(ocorrencias.map((o)=>o.criadoPorUserId))
    ];
    const [lojasNomes, criadores, fotoUrls] = await Promise.all([
        lojaIds.length > 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhLoja.findMany({
            where: {
                id: {
                    in: lojaIds
                },
                userId: ctx.userId
            },
            select: {
                id: true,
                nome: true
            }
        }) : [],
        criadorIds.length > 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stackUser.findMany({
            where: {
                id: {
                    in: criadorIds
                }
            },
            select: {
                id: true,
                displayName: true,
                primaryEmail: true
            }
        }) : [],
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$ocorrencias$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOcorrenciaFotoSignedUrls"])(ocorrencias.map((o)=>o.fotoPath))
    ]);
    const nomeMap = Object.fromEntries(lojasNomes.map((l)=>[
            l.id,
            l.nome
        ]));
    const criadorMap = Object.fromEntries(criadores.map((c)=>[
            c.id,
            c.displayName?.trim() || c.primaryEmail || '—'
        ]));
    const contadoresPorLoja = totalPorLoja.map((t)=>({
            lojaId: t.lojaId,
            lojaNome: nomeMap[t.lojaId] || t.lojaId,
            total: t._count.id
        }));
    return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ocorrencias: ocorrencias.map(({ fotoPath, ...oc })=>({
                ...oc,
                criadoPorNome: criadorMap[oc.criadoPorUserId] || '—',
                fotoUrl: fotoUrls[fotoPath] || null
            })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        contadoresPorLoja
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6e85ca05._.js.map