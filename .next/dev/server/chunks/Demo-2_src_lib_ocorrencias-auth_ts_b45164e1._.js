module.exports = [
"[project]/Demo-2/src/lib/ocorrencias-auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/stack.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/stack-auth-sync.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/types/admin.ts [app-route] (ecmascript)");
;
;
;
;
;
async function resolveOcorrenciasTenant(stackUser, dbUserId) {
    const ownsTeam = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.count({
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
    const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
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
        const pending = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.findFirst({
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhTeamMember.update({
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
    const hasLojas = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].rhLoja.count({
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
    const su = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stackUser.findUnique({
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
    const { tenantUserId, isTenantOwner } = await resolveOcorrenciasTenant({
        id: stackUser.id,
        primaryEmail: stackUser.primaryEmail,
        displayName: stackUser.displayName
    }, dbUser.id);
    const [regPerm, verPerm] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userToolPermission.findUnique({
            where: {
                stackUserId_tool: {
                    stackUserId: stackUser.id,
                    tool: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"].REGISTRAR_OCORRENCIAS
                }
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userToolPermission.findUnique({
            where: {
                stackUserId_tool: {
                    stackUserId: stackUser.id,
                    tool: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"].VER_OCORRENCIAS
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
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sessão expirada ou sem permissão para acessar ocorrências'
            }, {
                status: 401
            })
        };
    }
    if (requirePermission === 'REGISTRAR' && !ctx.canRegister) {
        return {
            ctx: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sem permissão para registrar ocorrências'
            }, {
                status: 403
            })
        };
    }
    if (requirePermission === 'VER' && !ctx.canView) {
        return {
            ctx: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
    const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
        or: 'return-null'
    });
    if (!stackUser) return false;
    if (await isOcorrenciasTenantAdmin(stackUser.id)) return false;
    const allPerms = await __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userToolPermission.findMany({
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
    return tools.includes(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"].REGISTRAR_OCORRENCIAS) && !tools.includes(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"].VER_OCORRENCIAS) && tools.every((t)=>t === __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$types$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemTool"].REGISTRAR_OCORRENCIAS);
}
}),
];

//# sourceMappingURL=Demo-2_src_lib_ocorrencias-auth_ts_b45164e1._.js.map