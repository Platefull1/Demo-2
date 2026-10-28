(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__104c4da7._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Demo-2/src/lib/ocorrencias-isolation.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Isolamento de usuários que só têm REGISTRAR_OCORRENCIAS.
 * Usado no middleware (Edge): sem Prisma. A decisão vem da sessão
 * via GET /api/ocorrencias/isolation; o cookie é cache assinado.
 */ __turbopack_context__.s([
    "ISOLATION_COOKIE_MAX_AGE",
    ()=>ISOLATION_COOKIE_MAX_AGE,
    "OCORRENCIAS_ONLY_COOKIE",
    ()=>OCORRENCIAS_ONLY_COOKIE,
    "hasStackSessionCookies",
    ()=>hasStackSessionCookies,
    "isIsolationApiPath",
    ()=>isIsolationApiPath,
    "isOcorrenciasAllowedPath",
    ()=>isOcorrenciasAllowedPath,
    "isolationCookieOptions",
    ()=>isolationCookieOptions,
    "readIsolationCookie",
    ()=>readIsolationCookie,
    "signIsolationCookie",
    ()=>signIsolationCookie
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/jose/dist/webapi/jwt/sign.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/jose/dist/webapi/jwt/verify.js [middleware-edge] (ecmascript)");
;
const OCORRENCIAS_ONLY_COOKIE = 'platefull_ocorrencias_only';
const ISOLATION_COOKIE_MAX_AGE = 5 * 60;
const ALLOWED_PREFIXES = [
    '/ocorrencias/nova',
    '/api/ocorrencias',
    '/handler',
    '/auth',
    '/api/auth',
    '/_next'
];
function isOcorrenciasAllowedPath(pathname) {
    if (pathname === '/') return true;
    return ALLOWED_PREFIXES.some((p)=>pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(p));
}
function hasStackSessionCookies(request) {
    return request.cookies.getAll().some((c)=>/stack/i.test(c.name));
}
function isolationSecret() {
    const raw = process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET || process.env.STACK_SECRET_SERVER_KEY;
    if (!raw) return null;
    return new TextEncoder().encode(raw);
}
function isolationCookieOptions() {
    return {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        maxAge: ISOLATION_COOKIE_MAX_AGE
    };
}
async function signIsolationCookie(only) {
    const secret = isolationSecret();
    if (!secret) return null;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["SignJWT"]({
        only
    }).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime(`${ISOLATION_COOKIE_MAX_AGE}s`).sign(secret);
}
async function readIsolationCookie(token) {
    if (!token) return null;
    const secret = isolationSecret();
    if (!secret) return null;
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["jwtVerify"])(token, secret);
        return payload.only === true;
    } catch  {
        return null;
    }
}
function isIsolationApiPath(pathname) {
    return pathname === '/api/ocorrencias/isolation' || pathname.startsWith('/api/ocorrencias/isolation/');
}
}),
"[project]/Demo-2/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/jose/dist/webapi/jwt/verify.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ocorrencias$2d$isolation$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/src/lib/ocorrencias-isolation.ts [middleware-edge] (ecmascript)");
;
;
;
const RIDER_COOKIE = 'rider_token';
async function getRiderSession(request) {
    try {
        const token = request.cookies.get(RIDER_COOKIE)?.value;
        if (!token) return null;
        const secret = process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET;
        if (!secret) return null;
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["jwtVerify"])(token, new TextEncoder().encode(secret));
        return payload;
    } catch  {
        return null;
    }
}
function denyOcorrenciasOnly(request) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Acesso restrito'
        }, {
            status: 403
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/ocorrencias/nova', request.url));
}
/**
 * Decisão pela sessão. Cookie assinado é só cache (5 min).
 * Apagar o cookie força nova consulta a /api/ocorrencias/isolation.
 */ async function resolveOcorrenciasOnly(request) {
    const cached = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ocorrencias$2d$isolation$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["readIsolationCookie"])(request.cookies.get(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ocorrencias$2d$isolation$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["OCORRENCIAS_ONLY_COOKIE"])?.value);
    if (cached !== null) {
        return {
            only: cached,
            tokenToSet: null
        };
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ocorrencias$2d$isolation$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["hasStackSessionCookies"])(request)) {
        return {
            only: false,
            tokenToSet: null
        };
    }
    try {
        const isolationUrl = new URL('/api/ocorrencias/isolation', request.url);
        const res = await fetch(isolationUrl, {
            headers: {
                cookie: request.headers.get('cookie') ?? ''
            },
            cache: 'no-store'
        });
        if (!res.ok) return {
            only: false,
            tokenToSet: null
        };
        const data = await res.json();
        const only = data.only === true;
        const tokenToSet = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ocorrencias$2d$isolation$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["signIsolationCookie"])(only);
        return {
            only,
            tokenToSet
        };
    } catch  {
        return {
            only: false,
            tokenToSet: null
        };
    }
}
function withIsolationCookie(response, token) {
    if (token) {
        response.cookies.set(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ocorrencias$2d$isolation$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["OCORRENCIAS_ONLY_COOKIE"], token, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ocorrencias$2d$isolation$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isolationCookieOptions"])());
    }
    return response;
}
async function middleware(request) {
    const { pathname, searchParams } = request.nextUrl;
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ocorrencias$2d$isolation$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isIsolationApiPath"])(pathname)) {
        const { only, tokenToSet } = await resolveOcorrenciasOnly(request);
        if (only && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$src$2f$lib$2f$ocorrencias$2d$isolation$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isOcorrenciasAllowedPath"])(pathname)) {
            return withIsolationCookie(denyOcorrenciasOnly(request), tokenToSet);
        }
        if (tokenToSet) {
            const next = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
            return withIsolationCookie(next, tokenToSet);
        }
    }
    if (pathname.startsWith('/rider')) {
        const publicRiderPaths = [
            '/rider/login',
            '/rider/setup'
        ];
        const isPublic = publicRiderPaths.some((p)=>pathname.startsWith(p));
        if (!isPublic) {
            const session = await getRiderSession(request);
            if (!session) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/rider/login', request.url));
            }
        }
    }
    if (pathname.startsWith('/handler')) {
        const code = searchParams.get('code');
        const afterAuthReturnTo = searchParams.get('after_auth_return_to');
        if (code || afterAuthReturnTo) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        }
    }
    if (pathname.startsWith('/dashboard')) {
        const code = searchParams.get('code');
        if (code) {
            const url = request.nextUrl.clone();
            url.search = '';
            return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/handler/:path*',
        '/dashboard/:path*',
        '/rider/:path*',
        '/rh/usuarios/:path*',
        '/((?!_next/static|_next/image|favicon|public|icons).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__104c4da7._.js.map