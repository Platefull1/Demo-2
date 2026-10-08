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
"[project]/drin-platform/src/lib/auth/toolPermissions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkToolPermission",
    ()=>checkToolPermission,
    "checkUserToolPermission",
    ()=>checkUserToolPermission,
    "requireToolPermission",
    ()=>requireToolPermission
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/stack.ts [app-route] (ecmascript)");
;
;
;
async function checkToolPermission(stackUserId, tool) {
    try {
        if (!stackUserId) {
            return false;
        }
        // Buscar StackUser com permissões
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stackUser.findUnique({
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
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
            or: 'return-null'
        });
        if (!stackUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autenticado',
                message: 'Você precisa estar logado para acessar esta ferramenta'
            }, {
                status: 401
            });
        }
        // Verificar permissão
        const hasPermission = await checkToolPermission(stackUser.id, tool);
        if (!hasPermission) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Acesso negado',
                message: `Você não tem permissão para acessar a ferramenta: ${tool}. Entre em contato com o administrador.`
            }, {
                status: 403
            });
        }
        return null;
    } catch (error) {
        console.error('Erro ao verificar permissão de ferramenta:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro ao verificar permissão',
            message: 'Ocorreu um erro ao verificar suas permissões'
        }, {
            status: 500
        });
    }
}
async function checkUserToolPermission(stackUserId, tool) {
    try {
        const permission = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userToolPermission.findUnique({
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
    return SystemTool;
}({});
}),
"[project]/drin-platform/app/api/auth/check-tool-permission/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/stack.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$auth$2f$toolPermissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/auth/toolPermissions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/types/admin.ts [app-route] (ecmascript)");
const dynamic = 'force-dynamic';
;
;
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const toolParam = searchParams.get('tool');
        if (!toolParam) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Ferramenta não especificada',
                hasPermission: false
            }, {
                status: 400
            });
        }
        // Validar se a ferramenta existe
        if (!Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"]).includes(toolParam)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Ferramenta inválida',
                hasPermission: false
            }, {
                status: 400
            });
        }
        // Obter usuário do Stack Auth
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
            or: 'return-null'
        });
        if (!stackUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autenticado',
                hasPermission: false
            }, {
                status: 401
            });
        }
        // Verificar permissão
        const hasPermission = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$auth$2f$toolPermissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkToolPermission"])(stackUser.id, toolParam);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            hasPermission
        });
    } catch (error) {
        console.error('Erro ao verificar permissão de ferramenta:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro ao verificar permissão',
            hasPermission: false
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__441c950d._.js.map