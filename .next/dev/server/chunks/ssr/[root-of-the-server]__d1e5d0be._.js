module.exports = [
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/Demo-2/src/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Demo-2/src/lib/stack-auth-sync.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUserByStackId",
    ()=>getUserByStackId,
    "syncStackAuthUser",
    ()=>syncStackAuthUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/db.ts [app-rsc] (ecmascript)");
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
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureConnection"])();
        let dbStackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].stackUser.findUnique({
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
            dbStackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].stackUser.create({
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
            dbStackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].stackUser.update({
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
        const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].user.findUnique({
            where: {
                email: stackUser.primaryEmail
            }
        });
        if (existingUser) {
            // Associar StackUser existente ao User existente
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    stackUserId: dbStackUser.id,
                    fullName: stackUser.displayName || existingUser.fullName
                }
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].stackUser.update({
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
        const newUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].user.create({
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].stackUser.update({
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
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].stackUser.findUnique({
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
"[project]/Demo-2/src/lib/prisma.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Demo-2/src/types/admin.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Demo-2/src/lib/ocorrencias-auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/stack.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/stack-auth-sync.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/types/admin.ts [app-rsc] (ecmascript)");
;
;
;
;
;
async function resolveOcorrenciasTenant(stackUser, dbUserId) {
    const ownsTeam = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.count({
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
    const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
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
        const pending = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.update({
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
    const hasLojas = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].rhLoja.count({
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
    const su = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].stackUser.findUnique({
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
    const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
        or: 'return-null'
    });
    if (!stackUser) return null;
    const dbUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["syncStackAuthUser"])({
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
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].userToolPermission.findUnique({
            where: {
                stackUserId_tool: {
                    stackUserId: stackUser.id,
                    tool: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].REGISTRAR_OCORRENCIAS
                }
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].userToolPermission.findUnique({
            where: {
                stackUserId_tool: {
                    stackUserId: stackUser.id,
                    tool: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].VER_OCORRENCIAS
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
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sessão expirada ou sem permissão para acessar ocorrências'
            }, {
                status: 401
            })
        };
    }
    if (requirePermission === 'REGISTRAR' && !ctx.canRegister) {
        return {
            ctx: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sem permissão para registrar ocorrências'
            }, {
                status: 403
            })
        };
    }
    if (requirePermission === 'VER' && !ctx.canView) {
        return {
            ctx: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
    const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
        or: 'return-null'
    });
    if (!stackUser) return false;
    if (await isOcorrenciasTenantAdmin(stackUser.id)) return false;
    const allPerms = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].userToolPermission.findMany({
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
    return tools.includes(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].REGISTRAR_OCORRENCIAS) && !tools.includes(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].VER_OCORRENCIAS) && tools.every((t)=>t === __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].REGISTRAR_OCORRENCIAS);
}
}),
"[project]/Demo-2/src/lib/rh-permissions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─── Strings de permissão (valores exatos salvos no banco) ───────────────────
__turbopack_context__.s([
    "ADMIN_ONLY_PERMISSIONS",
    ()=>ADMIN_ONLY_PERMISSIONS,
    "CMV_REAL_PERMISSIONS",
    ()=>CMV_REAL_PERMISSIONS,
    "CMV_REAL_PERMISSION_SET",
    ()=>CMV_REAL_PERMISSION_SET,
    "CORE_RH_PERMISSIONS",
    ()=>CORE_RH_PERMISSIONS,
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
const CORE_RH_PERMISSIONS = Object.values(P).filter((p)=>!CMV_REAL_PERMISSION_SET.has(p));
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
"[project]/Demo-2/src/lib/rh-auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRhContext",
    ()=>getRhContext,
    "memberHasCoreRhPermission",
    ()=>memberHasCoreRhPermission,
    "requireRhPermission",
    ()=>requireRhPermission,
    "rhGetUser",
    ()=>rhGetUser,
    "rhRequireModuleUser",
    ()=>rhRequireModuleUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/stack.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/stack-auth-sync.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-permissions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
function memberHasCoreRhPermission(ctx) {
    if (ctx.isAdmin) return true;
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CORE_RH_PERMISSIONS"].some((p)=>ctx.hasPermission(p));
}
async function rhGetUser() {
    const ctx = await getRhContext();
    if (!ctx) return null;
    return {
        userId: ctx.userId,
        isAdmin: ctx.isAdmin
    };
}
async function rhRequireModuleUser() {
    const ctx = await getRhContext();
    if (!ctx) return null;
    if (!memberHasCoreRhPermission(ctx)) return null;
    return {
        userId: ctx.userId,
        isAdmin: ctx.isAdmin
    };
}
async function getRhContext() {
    const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
        or: 'return-null'
    });
    if (!stackUser) return null;
    const dbUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["syncStackAuthUser"])({
        id: stackUser.id,
        primaryEmail: stackUser.primaryEmail || undefined,
        displayName: stackUser.displayName || undefined,
        profileImageUrl: stackUser.profileImageUrl || undefined,
        primaryEmailVerified: stackUser.primaryEmailVerified ? new Date() : null
    });
    if (!dbUser) return null;
    // Dono de equipe RH: prioriza os próprios dados (evita sumir relatórios/grupos
    // quando o admin também está cadastrado como membro ou tem convite cruzado).
    const ownsTeam = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.count({
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
    const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
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
        const pendingMembership = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
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
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.update({
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
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sessão expirada. Por favor, faça login novamente.',
                code: 'UNAUTHENTICATED'
            }, {
                status: 401
            })
        };
    }
    if (!memberHasCoreRhPermission(ctx)) {
        return {
            ctx: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sem permissão para esta ação'
            }, {
                status: 403
            })
        };
    }
    if (permission && !ctx.hasPermission(permission)) {
        return {
            ctx: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
"[project]/Demo-2/src/lib/navigation.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Menu da sidebar: calculado no servidor a partir das permissões do usuário.
 * Itens sem permissão não entram — não existe estado "locked".
 */ __turbopack_context__.s([
    "buildNavSections",
    ()=>buildNavSections,
    "getNavigationForUser",
    ()=>getNavigationForUser,
    "navItemIsActive",
    ()=>navItemIsActive
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/rh-permissions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/types/admin.ts [app-rsc] (ecmascript)");
;
;
;
;
function navItemIsActive(pathname, match) {
    if (match.exact?.some((p)=>pathname === p)) return true;
    if (match.prefix?.some((p)=>pathname.startsWith(p))) return true;
    return false;
}
function buildNavSections(input) {
    const { hasTool, canViewCmvReal } = input;
    const canViewOcorrencias = hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].VER_OCORRENCIAS);
    const canRegisterOcorrencias = hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].REGISTRAR_OCORRENCIAS);
    const geral = [
        {
            id: 'visao-geral',
            label: 'Visão geral',
            href: '/dashboard',
            icon: 'LayoutDashboard',
            match: {
                exact: [
                    '/dashboard'
                ]
            }
        }
    ];
    const operacao = [];
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].IFOOD)) {
        operacao.push({
            id: 'ifood',
            label: 'iFood',
            icon: 'ShoppingBag',
            match: {
                prefix: [
                    '/ifood'
                ]
            },
            children: [
                {
                    id: 'ifood-config',
                    label: 'Configurações',
                    href: '/ifood/configuracoes'
                },
                {
                    id: 'ifood-operacional',
                    label: 'Operacional',
                    href: '/ifood/operacional'
                },
                {
                    id: 'ifood-financeiro',
                    label: 'Financeiro',
                    href: '/ifood/financeiro'
                },
                {
                    id: 'ifood-cardapio',
                    label: 'Cardápio',
                    href: '/ifood/cardapio'
                }
            ]
        });
    }
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].TAREFAS)) {
        operacao.push({
            id: 'tarefas',
            label: 'Tarefas',
            href: '/tarefas',
            icon: 'ListChecks',
            match: {
                prefix: [
                    '/tarefas'
                ]
            }
        });
    }
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].CHECKLIST)) {
        operacao.push({
            id: 'checklist',
            label: 'Checklist',
            href: '/checklist',
            icon: 'ClipboardCheck',
            match: {
                prefix: [
                    '/checklist'
                ]
            }
        });
    }
    if (canViewOcorrencias || canRegisterOcorrencias) {
        operacao.push({
            id: 'ocorrencias',
            label: 'Central de Ocorrências',
            href: canViewOcorrencias ? '/ocorrencias' : '/ocorrencias/nova',
            icon: 'AlertTriangle',
            match: {
                exact: [
                    '/ocorrencias'
                ],
                prefix: [
                    '/ocorrencias/'
                ]
            }
        });
    }
    const financeiro = [];
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].CMV)) {
        financeiro.push({
            id: 'cmv',
            label: 'CMV',
            href: '/cmv',
            icon: 'BarChart2',
            match: {
                exact: [
                    '/cmv'
                ],
                prefix: [
                    '/cmv/'
                ]
            }
        });
    }
    if (canViewCmvReal) {
        financeiro.push({
            id: 'cmv-real',
            label: 'CMV Real',
            href: '/cmv-real/notas',
            icon: 'Receipt',
            match: {
                prefix: [
                    '/cmv-real'
                ]
            }
        });
    }
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].ESTOQUE)) {
        financeiro.push({
            id: 'estoque',
            label: 'Estoque',
            href: '/estoque',
            icon: 'Warehouse',
            match: {
                prefix: [
                    '/estoque'
                ]
            }
        });
    }
    const pessoas = [];
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].RH)) {
        pessoas.push({
            id: 'rh',
            label: 'RH',
            href: '/rh',
            icon: 'Users',
            match: {
                prefix: [
                    '/rh',
                    '/bonificacao'
                ]
            }
        });
    }
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].PONTOS)) {
        pessoas.push({
            id: 'pontos',
            label: 'Pontos',
            href: '/pontos',
            icon: 'Clock',
            match: {
                prefix: [
                    '/pontos'
                ]
            }
        });
    }
    const comunicacao = [];
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].WHATSAPP_CHAT)) {
        comunicacao.push({
            id: 'whatsapp',
            label: 'WhatsApp Chat',
            href: '/whatsapp-tools',
            icon: 'MessageSquare',
            match: {
                exact: [
                    '/whatsapp-tools'
                ],
                prefix: [
                    '/whatsapp-config'
                ]
            }
        });
    }
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].CHAT)) {
        comunicacao.push({
            id: 'chat',
            label: 'Chat',
            href: '/chat',
            icon: 'Bot',
            match: {
                prefix: [
                    '/chat'
                ]
            }
        });
    }
    const configuracoes = [];
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].CONEXOES)) {
        configuracoes.push({
            id: 'conexoes',
            label: 'Conexões',
            href: '/connections',
            icon: 'Link2',
            match: {
                exact: [
                    '/connections'
                ]
            }
        });
    }
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].PRODUTOS)) {
        configuracoes.push({
            id: 'produtos',
            label: 'Produtos',
            href: '/produtos',
            icon: 'Package',
            match: {
                exact: [
                    '/produtos'
                ]
            }
        });
    }
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].ETIQUETAGEM)) {
        configuracoes.push({
            id: 'etiquetagem',
            label: 'Etiquetagem',
            href: '/etiquetagem',
            icon: 'Tag',
            match: {
                prefix: [
                    '/etiquetagem'
                ]
            }
        });
    }
    if (hasTool(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"].AGENDAMENTO_RELATORIOS)) {
        configuracoes.push({
            id: 'relatorios',
            label: 'Central de Relatórios',
            href: '/relatorios',
            icon: 'FileBarChart2',
            match: {
                exact: [
                    '/relatorios'
                ],
                prefix: [
                    '/relatorios/'
                ]
            }
        });
    }
    return [
        {
            id: 'geral',
            label: 'Geral',
            items: geral
        },
        {
            id: 'operacao',
            label: 'Operação',
            items: operacao
        },
        {
            id: 'financeiro',
            label: 'Financeiro',
            items: financeiro
        },
        {
            id: 'pessoas',
            label: 'Pessoas',
            items: pessoas
        },
        {
            id: 'comunicacao',
            label: 'Comunicação',
            items: comunicacao
        },
        {
            id: 'configuracoes',
            label: 'Configurações',
            items: configuracoes
        }
    ].filter((section)=>section.items.length > 0);
}
function hasToolFromSet(enabled) {
    return (tool)=>enabled.has(tool);
}
async function getNavigationForUser() {
    const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRhContext"])();
    if (!ctx) return [];
    const [perms, stackUser] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].userToolPermission.findMany({
            where: {
                stackUserId: ctx.stackUserId
            },
            select: {
                tool: true,
                isEnabled: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].stackUser.findUnique({
            where: {
                id: ctx.stackUserId
            },
            select: {
                isActive: true
            }
        })
    ]);
    if (!stackUser?.isActive) {
        return buildNavSections({
            hasTool: ()=>false,
            canViewCmvReal: false
        });
    }
    const enabled = new Set();
    if (ctx.isAdmin) {
        for (const tool of Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SystemTool"]))enabled.add(tool);
    } else {
        for (const p of perms){
            if (p.isEnabled) enabled.add(p.tool);
        }
    }
    let canViewCmvReal = ctx.isAdmin || ctx.hasPermission(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$rh$2d$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["P"].CMV_REAL_VISUALIZAR);
    if (canViewCmvReal && !ctx.isAdmin && ctx.memberId) {
        const member = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findUnique({
            where: {
                id: ctx.memberId
            },
            select: {
                lojas: true,
                perfil: true
            }
        });
        if (member?.perfil === 'gerente_loja' && member.lojas.length === 0) {
            canViewCmvReal = false;
        }
    }
    return buildNavSections({
        hasTool: hasToolFromSet(enabled),
        canViewCmvReal
    });
}
}),
"[project]/Demo-2/app/(app)/AppGroupLayout.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Demo-2/app/(app)/AppGroupLayout.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Demo-2/app/(app)/AppGroupLayout.tsx <module evaluation>", "default");
}),
"[project]/Demo-2/app/(app)/AppGroupLayout.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Demo-2/app/(app)/AppGroupLayout.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Demo-2/app/(app)/AppGroupLayout.tsx", "default");
}),
"[project]/Demo-2/app/(app)/AppGroupLayout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f28$app$292f$AppGroupLayout$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Demo-2/app/(app)/AppGroupLayout.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f28$app$292f$AppGroupLayout$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Demo-2/app/(app)/AppGroupLayout.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f28$app$292f$AppGroupLayout$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Demo-2/app/(app)/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppLayout,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ocorrencias$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/ocorrencias-auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/navigation.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f28$app$292f$AppGroupLayout$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/app/(app)/AppGroupLayout.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
const dynamic = 'force-dynamic';
async function AppLayout({ children }) {
    if (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ocorrencias$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isOcorrenciasOnlyUser"])()) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/ocorrencias/nova');
    }
    const navSections = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNavigationForUser"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$app$2f28$app$292f$AppGroupLayout$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        navSections: navSections,
        children: children
    }, void 0, false, {
        fileName: "[project]/Demo-2/app/(app)/layout.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d1e5d0be._.js.map