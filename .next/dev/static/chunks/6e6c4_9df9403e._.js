(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assign: null,
    searchParamsToUrlQuery: null,
    urlQueryToSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    assign: function() {
        return assign;
    },
    searchParamsToUrlQuery: function() {
        return searchParamsToUrlQuery;
    },
    urlQueryToSearchParams: function() {
        return urlQueryToSearchParams;
    }
});
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    for (const [key, value] of searchParams.entries()){
        const existing = query[key];
        if (typeof existing === 'undefined') {
            query[key] = value;
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            query[key] = [
                existing,
                value
            ];
        }
    }
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === 'string') {
        return param;
    }
    if (typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
        return String(param);
    } else {
        return '';
    }
}
function urlQueryToSearchParams(query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)){
        if (Array.isArray(value)) {
            for (const item of value){
                searchParams.append(key, stringifyUrlQueryParam(item));
            }
        } else {
            searchParams.set(key, stringifyUrlQueryParam(value));
        }
    }
    return searchParams;
}
function assign(target, ...searchParamsList) {
    for (const searchParams of searchParamsList){
        for (const key of searchParams.keys()){
            target.delete(key);
        }
        for (const [key, value] of searchParams.entries()){
            target.append(key, value);
        }
    }
    return target;
} //# sourceMappingURL=querystring.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatUrl: null,
    formatWithValidation: null,
    urlObjectKeys: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    formatUrl: function() {
        return formatUrl;
    },
    formatWithValidation: function() {
        return formatWithValidation;
    },
    urlObjectKeys: function() {
        return urlObjectKeys;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/Demo-2/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _querystring = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)"));
const slashedProtocols = /https?|ftp|gopher|file/;
function formatUrl(urlObj) {
    let { auth, hostname } = urlObj;
    let protocol = urlObj.protocol || '';
    let pathname = urlObj.pathname || '';
    let hash = urlObj.hash || '';
    let query = urlObj.query || '';
    let host = false;
    auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';
    if (urlObj.host) {
        host = auth + urlObj.host;
    } else if (hostname) {
        host = auth + (~hostname.indexOf(':') ? `[${hostname}]` : hostname);
        if (urlObj.port) {
            host += ':' + urlObj.port;
        }
    }
    if (query && typeof query === 'object') {
        query = String(_querystring.urlQueryToSearchParams(query));
    }
    let search = urlObj.search || query && `?${query}` || '';
    if (protocol && !protocol.endsWith(':')) protocol += ':';
    if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
    } else if (!host) {
        host = '';
    }
    if (hash && hash[0] !== '#') hash = '#' + hash;
    if (search && search[0] !== '?') search = '?' + search;
    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace('#', '%23');
    return `${protocol}${host}${pathname}${search}${hash}`;
}
const urlObjectKeys = [
    'auth',
    'hash',
    'host',
    'hostname',
    'href',
    'path',
    'pathname',
    'port',
    'protocol',
    'query',
    'search',
    'slashes'
];
function formatWithValidation(url) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (url !== null && typeof url === 'object') {
            Object.keys(url).forEach((key)=>{
                if (!urlObjectKeys.includes(key)) {
                    console.warn(`Unknown key passed via urlObject into url.format: ${key}`);
                }
            });
        }
    }
    return formatUrl(url);
} //# sourceMappingURL=format-url.js.map
}),
"[project]/Demo-2/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useMergedRef", {
    enumerable: true,
    get: function() {
        return useMergedRef;
    }
});
const _react = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function useMergedRef(refA, refB) {
    const cleanupA = (0, _react.useRef)(null);
    const cleanupB = (0, _react.useRef)(null);
    // NOTE: In theory, we could skip the wrapping if only one of the refs is non-null.
    // (this happens often if the user doesn't pass a ref to Link/Form/Image)
    // But this can cause us to leak a cleanup-ref into user code (previously via `<Link legacyBehavior>`),
    // and the user might pass that ref into ref-merging library that doesn't support cleanup refs
    // (because it hasn't been updated for React 19)
    // which can then cause things to blow up, because a cleanup-returning ref gets called with `null`.
    // So in practice, it's safer to be defensive and always wrap the ref, even on React 19.
    return (0, _react.useCallback)((current)=>{
        if (current === null) {
            const cleanupFnA = cleanupA.current;
            if (cleanupFnA) {
                cleanupA.current = null;
                cleanupFnA();
            }
            const cleanupFnB = cleanupB.current;
            if (cleanupFnB) {
                cleanupB.current = null;
                cleanupFnB();
            }
        } else {
            if (refA) {
                cleanupA.current = applyRef(refA, current);
            }
            if (refB) {
                cleanupB.current = applyRef(refB, current);
            }
        }
    }, [
        refA,
        refB
    ]);
}
function applyRef(refA, current) {
    if (typeof refA === 'function') {
        const cleanup = refA(current);
        if (typeof cleanup === 'function') {
            return cleanup;
        } else {
            return ()=>refA(null);
        }
    } else {
        refA.current = current;
        return ()=>{
            refA.current = null;
        };
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=use-merged-ref.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DecodeError: null,
    MiddlewareNotFoundError: null,
    MissingStaticPage: null,
    NormalizeError: null,
    PageNotFoundError: null,
    SP: null,
    ST: null,
    WEB_VITALS: null,
    execOnce: null,
    getDisplayName: null,
    getLocationOrigin: null,
    getURL: null,
    isAbsoluteUrl: null,
    isResSent: null,
    loadGetInitialProps: null,
    normalizeRepeatedSlashes: null,
    stringifyError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DecodeError: function() {
        return DecodeError;
    },
    MiddlewareNotFoundError: function() {
        return MiddlewareNotFoundError;
    },
    MissingStaticPage: function() {
        return MissingStaticPage;
    },
    NormalizeError: function() {
        return NormalizeError;
    },
    PageNotFoundError: function() {
        return PageNotFoundError;
    },
    SP: function() {
        return SP;
    },
    ST: function() {
        return ST;
    },
    WEB_VITALS: function() {
        return WEB_VITALS;
    },
    execOnce: function() {
        return execOnce;
    },
    getDisplayName: function() {
        return getDisplayName;
    },
    getLocationOrigin: function() {
        return getLocationOrigin;
    },
    getURL: function() {
        return getURL;
    },
    isAbsoluteUrl: function() {
        return isAbsoluteUrl;
    },
    isResSent: function() {
        return isResSent;
    },
    loadGetInitialProps: function() {
        return loadGetInitialProps;
    },
    normalizeRepeatedSlashes: function() {
        return normalizeRepeatedSlashes;
    },
    stringifyError: function() {
        return stringifyError;
    }
});
const WEB_VITALS = [
    'CLS',
    'FCP',
    'FID',
    'INP',
    'LCP',
    'TTFB'
];
function execOnce(fn) {
    let used = false;
    let result;
    return (...args)=>{
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}
function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    const urlParts = url.split('?');
    const urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, '/').replace(/\/\/+/g, '/') + (urlParts[1] ? `?${urlParts.slice(1).join('?')}` : '');
}
async function loadGetInitialProps(App, ctx) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (App.prototype?.getInitialProps) {
            const message = `"${getDisplayName(App)}.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.`;
            throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
                value: "E394",
                enumerable: false,
                configurable: true
            });
        }
    }
    // when called from _app `ctx` is nested in `ctx`
    const res = ctx.res || ctx.ctx && ctx.ctx.res;
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            // @ts-ignore pageProps default
            return {
                pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
            };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) {
        return props;
    }
    if (!props) {
        const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
        throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (Object.keys(props).length === 0 && !ctx.ctx) {
            console.warn(`${getDisplayName(App)} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://nextjs.org/docs/messages/empty-object-getInitialProps`);
        }
    }
    return props;
}
const SP = typeof performance !== 'undefined';
const ST = SP && [
    'mark',
    'measure',
    'getEntriesByName'
].every((method)=>typeof performance[method] === 'function');
class DecodeError extends Error {
}
class NormalizeError extends Error {
}
class PageNotFoundError extends Error {
    constructor(page){
        super();
        this.code = 'ENOENT';
        this.name = 'PageNotFoundError';
        this.message = `Cannot find module for page: ${page}`;
    }
}
class MissingStaticPage extends Error {
    constructor(page, message){
        super();
        this.message = `Failed to load static file for page: ${page} ${message}`;
    }
}
class MiddlewareNotFoundError extends Error {
    constructor(){
        super();
        this.code = 'ENOENT';
        this.message = `Cannot find the middleware module`;
    }
}
function stringifyError(error) {
    return JSON.stringify({
        message: error.message,
        stack: error.stack
    });
} //# sourceMappingURL=utils.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLocalURL", {
    enumerable: true,
    get: function() {
        return isLocalURL;
    }
});
const _utils = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _hasbasepath = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/client/has-base-path.js [app-client] (ecmascript)");
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils.isAbsoluteUrl)(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils.getLocationOrigin)();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasbasepath.hasBasePath)(resolved.pathname);
    } catch (_) {
        return false;
    }
} //# sourceMappingURL=is-local-url.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "errorOnce", {
    enumerable: true,
    get: function() {
        return errorOnce;
    }
});
let errorOnce = (_)=>{};
if ("TURBOPACK compile-time truthy", 1) {
    const errors = new Set();
    errorOnce = (msg)=>{
        if (!errors.has(msg)) {
            console.error(msg);
        }
        errors.add(msg);
    };
} //# sourceMappingURL=error-once.js.map
}),
"[project]/Demo-2/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    useLinkStatus: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * A React component that extends the HTML `<a>` element to provide
 * [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)
 * and client-side navigation. This is the primary way to navigate between routes in Next.js.
 *
 * @remarks
 * - Prefetching is only enabled in production.
 *
 * @see https://nextjs.org/docs/app/api-reference/components/link
 */ default: function() {
        return LinkComponent;
    },
    useLinkStatus: function() {
        return useLinkStatus;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/Demo-2/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _formaturl = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _usemergedref = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _addbasepath = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/client/add-base-path.js [app-client] (ecmascript)");
const _warnonce = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
const _links = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/client/components/links.js [app-client] (ecmascript)");
const _islocalurl = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)");
const _types = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/client/components/segment-cache/types.js [app-client] (ecmascript)");
const _erroronce = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)");
function isModifiedEvent(event) {
    const eventTarget = event.currentTarget;
    const target = eventTarget.getAttribute('target');
    return target && target !== '_self' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
    event.nativeEvent && event.nativeEvent.which === 2;
}
function linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate) {
    if (typeof window !== 'undefined') {
        const { nodeName } = e.currentTarget;
        // anchors inside an svg have a lowercase nodeName
        const isAnchorNodeName = nodeName.toUpperCase() === 'A';
        if (isAnchorNodeName && isModifiedEvent(e) || e.currentTarget.hasAttribute('download')) {
            // ignore click for browser’s default behavior
            return;
        }
        if (!(0, _islocalurl.isLocalURL)(href)) {
            if (replace) {
                // browser default behavior does not replace the history state
                // so we need to do it manually
                e.preventDefault();
                location.replace(href);
            }
            // ignore click for browser’s default behavior
            return;
        }
        e.preventDefault();
        if (onNavigate) {
            let isDefaultPrevented = false;
            onNavigate({
                preventDefault: ()=>{
                    isDefaultPrevented = true;
                }
            });
            if (isDefaultPrevented) {
                return;
            }
        }
        const { dispatchNavigateAction } = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/client/components/app-router-instance.js [app-client] (ecmascript)");
        _react.default.startTransition(()=>{
            dispatchNavigateAction(as || href, replace ? 'replace' : 'push', scroll ?? true, linkInstanceRef.current);
        });
    }
}
function formatStringOrUrl(urlObjOrString) {
    if (typeof urlObjOrString === 'string') {
        return urlObjOrString;
    }
    return (0, _formaturl.formatUrl)(urlObjOrString);
}
function LinkComponent(props) {
    const [linkStatus, setOptimisticLinkStatus] = (0, _react.useOptimistic)(_links.IDLE_LINK_STATUS);
    let children;
    const linkInstanceRef = (0, _react.useRef)(null);
    const { href: hrefProp, as: asProp, children: childrenProp, prefetch: prefetchProp = null, passHref, replace, shallow, scroll, onClick, onMouseEnter: onMouseEnterProp, onTouchStart: onTouchStartProp, legacyBehavior = false, onNavigate, ref: forwardedRef, unstable_dynamicOnHover, ...restProps } = props;
    children = childrenProp;
    if (legacyBehavior && (typeof children === 'string' || typeof children === 'number')) {
        children = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            children: children
        });
    }
    const router = _react.default.useContext(_approutercontextsharedruntime.AppRouterContext);
    const prefetchEnabled = prefetchProp !== false;
    const fetchStrategy = prefetchProp !== false ? getFetchStrategyFromPrefetchProp(prefetchProp) : _types.FetchStrategy.PPR;
    if ("TURBOPACK compile-time truthy", 1) {
        function createPropError(args) {
            return Object.defineProperty(new Error(`Failed prop type: The prop \`${args.key}\` expects a ${args.expected} in \`<Link>\`, but got \`${args.actual}\` instead.` + (typeof window !== 'undefined' ? "\nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                value: "E319",
                enumerable: false,
                configurable: true
            });
        }
        // TypeScript trick for type-guarding:
        const requiredPropsGuard = {
            href: true
        };
        const requiredProps = Object.keys(requiredPropsGuard);
        requiredProps.forEach((key)=>{
            if (key === 'href') {
                if (props[key] == null || typeof props[key] !== 'string' && typeof props[key] !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: props[key] === null ? 'null' : typeof props[key]
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
        // TypeScript trick for type-guarding:
        const optionalPropsGuard = {
            as: true,
            replace: true,
            scroll: true,
            shallow: true,
            passHref: true,
            prefetch: true,
            unstable_dynamicOnHover: true,
            onClick: true,
            onMouseEnter: true,
            onTouchStart: true,
            legacyBehavior: true,
            onNavigate: true
        };
        const optionalProps = Object.keys(optionalPropsGuard);
        optionalProps.forEach((key)=>{
            const valType = typeof props[key];
            if (key === 'as') {
                if (props[key] && valType !== 'string' && valType !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: valType
                    });
                }
            } else if (key === 'onClick' || key === 'onMouseEnter' || key === 'onTouchStart' || key === 'onNavigate') {
                if (props[key] && valType !== 'function') {
                    throw createPropError({
                        key,
                        expected: '`function`',
                        actual: valType
                    });
                }
            } else if (key === 'replace' || key === 'scroll' || key === 'shallow' || key === 'passHref' || key === 'legacyBehavior' || key === 'unstable_dynamicOnHover') {
                if (props[key] != null && valType !== 'boolean') {
                    throw createPropError({
                        key,
                        expected: '`boolean`',
                        actual: valType
                    });
                }
            } else if (key === 'prefetch') {
                if (props[key] != null && valType !== 'boolean' && props[key] !== 'auto') {
                    throw createPropError({
                        key,
                        expected: '`boolean | "auto"`',
                        actual: valType
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (props.locale) {
            (0, _warnonce.warnOnce)('The `locale` prop is not supported in `next/link` while using the `app` router. Read more about app router internalization: https://nextjs.org/docs/app/building-your-application/routing/internationalization');
        }
        if (!asProp) {
            let href;
            if (typeof hrefProp === 'string') {
                href = hrefProp;
            } else if (typeof hrefProp === 'object' && typeof hrefProp.pathname === 'string') {
                href = hrefProp.pathname;
            }
            if (href) {
                const hasDynamicSegment = href.split('/').some((segment)=>segment.startsWith('[') && segment.endsWith(']'));
                if (hasDynamicSegment) {
                    throw Object.defineProperty(new Error(`Dynamic href \`${href}\` found in <Link> while using the \`/app\` router, this is not supported. Read more: https://nextjs.org/docs/messages/app-dir-dynamic-href`), "__NEXT_ERROR_CODE", {
                        value: "E267",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
    }
    const { href, as } = _react.default.useMemo({
        "LinkComponent.useMemo": ()=>{
            const resolvedHref = formatStringOrUrl(hrefProp);
            return {
                href: resolvedHref,
                as: asProp ? formatStringOrUrl(asProp) : resolvedHref
            };
        }
    }["LinkComponent.useMemo"], [
        hrefProp,
        asProp
    ]);
    // This will return the first child, if multiple are provided it will throw an error
    let child;
    if (legacyBehavior) {
        if (children?.$$typeof === Symbol.for('react.lazy')) {
            throw Object.defineProperty(new Error(`\`<Link legacyBehavior>\` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's \`<a>\` tag.`), "__NEXT_ERROR_CODE", {
                value: "E863",
                enumerable: false,
                configurable: true
            });
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (onClick) {
                console.warn(`"onClick" was passed to <Link> with \`href\` of \`${hrefProp}\` but "legacyBehavior" was set. The legacy behavior requires onClick be set on the child of next/link`);
            }
            if (onMouseEnterProp) {
                console.warn(`"onMouseEnter" was passed to <Link> with \`href\` of \`${hrefProp}\` but "legacyBehavior" was set. The legacy behavior requires onMouseEnter be set on the child of next/link`);
            }
            try {
                child = _react.default.Children.only(children);
            } catch (err) {
                if (!children) {
                    throw Object.defineProperty(new Error(`No children were passed to <Link> with \`href\` of \`${hrefProp}\` but one child is required https://nextjs.org/docs/messages/link-no-children`), "__NEXT_ERROR_CODE", {
                        value: "E320",
                        enumerable: false,
                        configurable: true
                    });
                }
                throw Object.defineProperty(new Error(`Multiple children were passed to <Link> with \`href\` of \`${hrefProp}\` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children` + (typeof window !== 'undefined' ? " \nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                    value: "E266",
                    enumerable: false,
                    configurable: true
                });
            }
        } else //TURBOPACK unreachable
        ;
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            if (children?.type === 'a') {
                throw Object.defineProperty(new Error('Invalid <Link> with <a> child. Please remove <a> or use <Link legacyBehavior>.\nLearn more: https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor'), "__NEXT_ERROR_CODE", {
                    value: "E209",
                    enumerable: false,
                    configurable: true
                });
            }
        }
    }
    const childRef = legacyBehavior ? child && typeof child === 'object' && child.ref : forwardedRef;
    // Use a callback ref to attach an IntersectionObserver to the anchor tag on
    // mount. In the future we will also use this to keep track of all the
    // currently mounted <Link> instances, e.g. so we can re-prefetch them after
    // a revalidation or refresh.
    const observeLinkVisibilityOnMount = _react.default.useCallback({
        "LinkComponent.useCallback[observeLinkVisibilityOnMount]": (element)=>{
            if (router !== null) {
                linkInstanceRef.current = (0, _links.mountLinkInstance)(element, href, router, fetchStrategy, prefetchEnabled, setOptimisticLinkStatus);
            }
            return ({
                "LinkComponent.useCallback[observeLinkVisibilityOnMount]": ()=>{
                    if (linkInstanceRef.current) {
                        (0, _links.unmountLinkForCurrentNavigation)(linkInstanceRef.current);
                        linkInstanceRef.current = null;
                    }
                    (0, _links.unmountPrefetchableInstance)(element);
                }
            })["LinkComponent.useCallback[observeLinkVisibilityOnMount]"];
        }
    }["LinkComponent.useCallback[observeLinkVisibilityOnMount]"], [
        prefetchEnabled,
        href,
        router,
        fetchStrategy,
        setOptimisticLinkStatus
    ]);
    const mergedRef = (0, _usemergedref.useMergedRef)(observeLinkVisibilityOnMount, childRef);
    const childProps = {
        ref: mergedRef,
        onClick (e) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (!e) {
                    throw Object.defineProperty(new Error(`Component rendered inside next/link has to pass click event to "onClick" prop.`), "__NEXT_ERROR_CODE", {
                        value: "E312",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
            if (!legacyBehavior && typeof onClick === 'function') {
                onClick(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onClick === 'function') {
                child.props.onClick(e);
            }
            if (!router) {
                return;
            }
            if (e.defaultPrevented) {
                return;
            }
            linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate);
        },
        onMouseEnter (e) {
            if (!legacyBehavior && typeof onMouseEnterProp === 'function') {
                onMouseEnterProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onMouseEnter === 'function') {
                child.props.onMouseEnter(e);
            }
            if (!router) {
                return;
            }
            if ("TURBOPACK compile-time truthy", 1) {
                return;
            }
            //TURBOPACK unreachable
            ;
            const upgradeToDynamicPrefetch = undefined;
        },
        onTouchStart: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : function onTouchStart(e) {
            if (!legacyBehavior && typeof onTouchStartProp === 'function') {
                onTouchStartProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onTouchStart === 'function') {
                child.props.onTouchStart(e);
            }
            if (!router) {
                return;
            }
            if (!prefetchEnabled) {
                return;
            }
            const upgradeToDynamicPrefetch = unstable_dynamicOnHover === true;
            (0, _links.onNavigationIntent)(e.currentTarget, upgradeToDynamicPrefetch);
        }
    };
    // If the url is absolute, we can bypass the logic to prepend the basePath.
    if ((0, _utils.isAbsoluteUrl)(as)) {
        childProps.href = as;
    } else if (!legacyBehavior || passHref || child.type === 'a' && !('href' in child.props)) {
        childProps.href = (0, _addbasepath.addBasePath)(as);
    }
    let link;
    if (legacyBehavior) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, _erroronce.errorOnce)('`legacyBehavior` is deprecated and will be removed in a future ' + 'release. A codemod is available to upgrade your components:\n\n' + 'npx @next/codemod@latest new-link .\n\n' + 'Learn more: https://nextjs.org/docs/app/building-your-application/upgrading/codemods#remove-a-tags-from-link-components');
        }
        link = /*#__PURE__*/ _react.default.cloneElement(child, childProps);
    } else {
        link = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            ...restProps,
            ...childProps,
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(LinkStatusContext.Provider, {
        value: linkStatus,
        children: link
    });
}
const LinkStatusContext = /*#__PURE__*/ (0, _react.createContext)(_links.IDLE_LINK_STATUS);
const useLinkStatus = ()=>{
    return (0, _react.useContext)(LinkStatusContext);
};
function getFetchStrategyFromPrefetchProp(prefetchProp) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return prefetchProp === null || prefetchProp === 'auto' ? _types.FetchStrategy.PPR : // (although invalid values should've been filtered out by prop validation in dev)
        _types.FetchStrategy.Full;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=link.js.map
}),
"[project]/Demo-2/node_modules/@radix-ui/react-avatar/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Avatar",
    ()=>Avatar,
    "AvatarFallback",
    ()=>AvatarFallback,
    "AvatarImage",
    ()=>AvatarImage,
    "Fallback",
    ()=>AvatarFallback,
    "Image",
    ()=>AvatarImage,
    "Root",
    ()=>Avatar,
    "createAvatarScope",
    ()=>createAvatarScope
]);
// src/avatar.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$internal$2f$is$2d$development$2e$true$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/primitive/dist/internal/is-development.true.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-context/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
var __defProp = Object.defineProperty;
var __name = (target, value)=>__defProp(target, "name", {
        value,
        configurable: true
    });
;
;
;
;
;
;
;
var AVATAR_NAME = "Avatar";
var [createAvatarContext, createAvatarScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextScope"])(AVATAR_NAME);
var ImageLoadingStatus = {
    Idle: "idle",
    Loading: "loading",
    Loaded: "loaded",
    Error: "error"
};
var STATIC_IMAGE_COUNT_STATE = [
    0,
    ()=>void 0
];
var [AvatarProvider, useAvatarContext] = createAvatarContext(AVATAR_NAME);
var Avatar = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function Avatar2(props, forwardedRef) {
    const { __scopeAvatar, ...avatarProps } = props;
    const [imageLoadingStatus, setImageLoadingStatus] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](ImageLoadingStatus.Idle);
    const [imageCount, setImageCount] = useImageCount();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(AvatarProvider, {
        scope: __scopeAvatar,
        imageLoadingStatus,
        setImageLoadingStatus,
        imageCount,
        setImageCount,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].span, {
            ...avatarProps,
            ref: forwardedRef
        })
    });
}, "Avatar"));
var IMAGE_NAME = "AvatarImage";
var AvatarImage = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function AvatarImage2(props, forwardedRef) {
    const { __scopeAvatar, src, onLoadingStatusChange, ...imageProps } = props;
    const context = useAvatarContext(IMAGE_NAME, __scopeAvatar);
    useUpdateImageCount(context.setImageCount);
    const imageLoadingStatus = useImageLoadingStatus(src, {
        referrerPolicy: imageProps.referrerPolicy,
        crossOrigin: imageProps.crossOrigin,
        loadingStatus: context.imageLoadingStatus,
        setLoadingStatus: context.setImageLoadingStatus
    });
    const handleLoadingStatusChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"])({
        "AvatarImage.AvatarImage2.useCallbackRef[handleLoadingStatusChange]": (status)=>{
            onLoadingStatusChange?.(status);
        }
    }["AvatarImage.AvatarImage2.useCallbackRef[handleLoadingStatusChange]"]);
    const loadingStatusRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](imageLoadingStatus);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "AvatarImage.AvatarImage2.useLayoutEffect": ()=>{
            const previousLoadingStatus = loadingStatusRef.current;
            loadingStatusRef.current = imageLoadingStatus;
            if (imageLoadingStatus !== previousLoadingStatus) {
                handleLoadingStatusChange(imageLoadingStatus);
            }
        }
    }["AvatarImage.AvatarImage2.useLayoutEffect"], [
        imageLoadingStatus,
        handleLoadingStatusChange
    ]);
    return imageLoadingStatus === ImageLoadingStatus.Loaded ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].img, {
        ...imageProps,
        ref: forwardedRef,
        src
    }) : null;
}, "AvatarImage"));
var FALLBACK_NAME = "AvatarFallback";
var AvatarFallback = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function AvatarFallback2(props, forwardedRef) {
    const { __scopeAvatar, delayMs, ...fallbackProps } = props;
    const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar);
    const [canRender, setCanRender] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](delayMs === void 0);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "AvatarFallback.AvatarFallback2.useEffect": ()=>{
            if (delayMs !== void 0) {
                const timerId = window.setTimeout({
                    "AvatarFallback.AvatarFallback2.useEffect.timerId": ()=>setCanRender(true)
                }["AvatarFallback.AvatarFallback2.useEffect.timerId"], delayMs);
                return ({
                    "AvatarFallback.AvatarFallback2.useEffect": ()=>window.clearTimeout(timerId)
                })["AvatarFallback.AvatarFallback2.useEffect"];
            }
        }
    }["AvatarFallback.AvatarFallback2.useEffect"], [
        delayMs
    ]);
    return canRender && context.imageLoadingStatus !== ImageLoadingStatus.Loaded ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].span, {
        ...fallbackProps,
        ref: forwardedRef
    }) : null;
}, "AvatarFallback"));
function useImageLoadingStatus(src, { loadingStatus, setLoadingStatus, referrerPolicy, crossOrigin }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "useImageLoadingStatus.useLayoutEffect": ()=>{
            if (!src) {
                setLoadingStatus(ImageLoadingStatus.Error);
                return;
            }
            const image = new window.Image();
            const handleLoad = /* @__PURE__ */ __name({
                "useImageLoadingStatus.useLayoutEffect.handleLoad": (event)=>{
                    const image2 = event.currentTarget;
                    setLoadingStatus(getImageLoadingStatus(image2));
                }
            }["useImageLoadingStatus.useLayoutEffect.handleLoad"], "handleLoad");
            const handleError = /* @__PURE__ */ __name({
                "useImageLoadingStatus.useLayoutEffect.handleError": ()=>setLoadingStatus(ImageLoadingStatus.Error)
            }["useImageLoadingStatus.useLayoutEffect.handleError"], "handleError");
            image.addEventListener("load", handleLoad);
            image.addEventListener("error", handleError);
            if (referrerPolicy) {
                image.referrerPolicy = referrerPolicy;
            }
            image.crossOrigin = crossOrigin ?? null;
            image.src = src;
            setLoadingStatus(getImageLoadingStatus(image));
            return ({
                "useImageLoadingStatus.useLayoutEffect": ()=>{
                    image.removeEventListener("load", handleLoad);
                    image.removeEventListener("error", handleError);
                    setLoadingStatus(ImageLoadingStatus.Idle);
                }
            })["useImageLoadingStatus.useLayoutEffect"];
        }
    }["useImageLoadingStatus.useLayoutEffect"], [
        src,
        crossOrigin,
        referrerPolicy,
        setLoadingStatus
    ]);
    return loadingStatus;
}
__name(useImageLoadingStatus, "useImageLoadingStatus");
function getImageLoadingStatus(image) {
    return image.complete ? image.naturalWidth > 0 ? ImageLoadingStatus.Loaded : ImageLoadingStatus.Error : ImageLoadingStatus.Loading;
}
__name(getImageLoadingStatus, "getImageLoadingStatus");
function useImageCount() {
    let state = STATIC_IMAGE_COUNT_STATE;
    if (__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$internal$2f$is$2d$development$2e$true$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IS_DEVELOPMENT"]) {
        state = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](0);
        const [imageCount] = state;
        const hasWarnedRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
            "useImageCount.useEffect": ()=>{
                if (imageCount > 1 && !hasWarnedRef.current) {
                    hasWarnedRef.current = true;
                    console.warn("Avatar: Only one `Avatar.Image` component should be rendered per `Avatar.Root`, but multiple were detected. This will lead to unexpected behavior.");
                }
            }
        }["useImageCount.useEffect"], [
            imageCount
        ]);
    }
    return state;
}
__name(useImageCount, "useImageCount");
function useUpdateImageCount(setImageCount) {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$internal$2f$is$2d$development$2e$true$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IS_DEVELOPMENT"]) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
            "useUpdateImageCount.useEffect": ()=>{
                setImageCount({
                    "useUpdateImageCount.useEffect": (imageCount)=>imageCount + 1
                }["useUpdateImageCount.useEffect"]);
                return ({
                    "useUpdateImageCount.useEffect": ()=>{
                        setImageCount({
                            "useUpdateImageCount.useEffect": (imageCount)=>imageCount - 1
                        }["useUpdateImageCount.useEffect"]);
                    }
                })["useUpdateImageCount.useEffect"];
            }
        }["useUpdateImageCount.useEffect"], [
            setImageCount
        ]);
    }
}
__name(useUpdateImageCount, "useUpdateImageCount");
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Demo-2/node_modules/@radix-ui/react-collection/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCollection",
    ()=>createCollection,
    "unstable_createCollection",
    ()=>createCollection2
]);
// src/collection-legacy.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-context/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs [app-client] (ecmascript)");
"use client";
var __defProp = Object.defineProperty;
var __name = (target, value)=>__defProp(target, "name", {
        value,
        configurable: true
    });
;
;
;
;
;
// @__NO_SIDE_EFFECTS__
function createCollection(name) {
    const PROVIDER_NAME = name + "CollectionProvider";
    const [createCollectionContext, createCollectionScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextScope"])(PROVIDER_NAME);
    const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(PROVIDER_NAME, {
        collectionRef: {
            current: null
        },
        itemMap: /* @__PURE__ */ new Map()
    });
    const CollectionProvider = /* @__PURE__ */ __name((props)=>{
        const { scope, children } = props;
        const ref = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
        const itemMap = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](/* @__PURE__ */ new Map()).current;
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CollectionProviderImpl, {
            scope,
            itemMap,
            collectionRef: ref,
            children
        });
    }, "CollectionProvider");
    CollectionProvider.displayName = PROVIDER_NAME;
    const COLLECTION_SLOT_NAME = name + "CollectionSlot";
    const CollectionSlotImpl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSlot"])(COLLECTION_SLOT_NAME);
    const CollectionSlot = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
        const { scope, children } = props;
        const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
        const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, context.collectionRef);
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CollectionSlotImpl, {
            ref: composedRefs,
            children
        });
    });
    CollectionSlot.displayName = COLLECTION_SLOT_NAME;
    const ITEM_SLOT_NAME = name + "CollectionItemSlot";
    const ITEM_DATA_ATTR = "data-radix-collection-item";
    const CollectionItemSlotImpl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSlot"])(ITEM_SLOT_NAME);
    const CollectionItemSlot = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
        const { scope, children, ...itemData } = props;
        const ref = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
        const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, ref);
        const context = useCollectionContext(ITEM_SLOT_NAME, scope);
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
            "createCollection.CollectionItemSlot.useEffect": ()=>{
                context.itemMap.set(ref, {
                    ref,
                    ...itemData
                });
                return ({
                    "createCollection.CollectionItemSlot.useEffect": ()=>void context.itemMap.delete(ref)
                })["createCollection.CollectionItemSlot.useEffect"];
            }
        }["createCollection.CollectionItemSlot.useEffect"]);
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CollectionItemSlotImpl, {
            ...{
                [ITEM_DATA_ATTR]: ""
            },
            ref: composedRefs,
            children
        });
    });
    CollectionItemSlot.displayName = ITEM_SLOT_NAME;
    function useCollection(scope) {
        const context = useCollectionContext(name + "CollectionConsumer", scope);
        const getItems = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "createCollection.useCollection.useCallback[getItems]": ()=>{
                const collectionNode = context.collectionRef.current;
                if (!collectionNode) return [];
                const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
                const items = Array.from(context.itemMap.values());
                const orderedItems = items.sort({
                    "createCollection.useCollection.useCallback[getItems].orderedItems": (a, b)=>orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
                }["createCollection.useCollection.useCallback[getItems].orderedItems"]);
                return orderedItems;
            }
        }["createCollection.useCollection.useCallback[getItems]"], [
            context.collectionRef,
            context.itemMap
        ]);
        return getItems;
    }
    __name(useCollection, "useCollection");
    return [
        {
            Provider: CollectionProvider,
            Slot: CollectionSlot,
            ItemSlot: CollectionItemSlot
        },
        useCollection,
        createCollectionScope
    ];
}
__name(createCollection, "createCollection");
;
;
;
;
;
// src/ordered-dictionary.ts
var __instanciated = /* @__PURE__ */ new WeakMap();
var OrderedDict = class _OrderedDict extends Map {
    static{
        __name(this, "OrderedDict");
    }
    #keys;
    constructor(entries){
        super(entries);
        this.#keys = [
            ...super.keys()
        ];
        __instanciated.set(this, true);
    }
    set(key, value) {
        if (__instanciated.get(this) && !this.has(key)) {
            this.#keys.push(key);
        }
        super.set(key, value);
        return this;
    }
    /**
   * Sets a key-value pair so that it ends up at the given index.
   * - Existing keys are moved
   * - Negative indices count from the end of the resulting dictionary, so
   *   inserting at -1 makes the item the last one, -2 the second to last, etc.
   * - Out-of-range indices are clamped
   */ insert(index, key, value) {
        const has = this.has(key);
        const finalSize = has ? this.size : this.size + 1;
        const relativeIndex = toSafeInteger(index);
        const targetIndex = relativeIndex >= 0 ? Math.min(relativeIndex, finalSize - 1) : Math.max(finalSize + relativeIndex, 0);
        if (has ? this.#keys.indexOf(key) === targetIndex : targetIndex === this.size) {
            this.set(key, value);
            return this;
        }
        const keys = this.#keys.filter((existingKey)=>existingKey !== key);
        keys.splice(targetIndex, 0, key);
        const entries = keys.map((entryKey)=>[
                entryKey,
                entryKey === key ? value : this.get(entryKey)
            ]);
        this.clear();
        for (const [entryKey, entryValue] of entries){
            this.set(entryKey, entryValue);
        }
        return this;
    }
    with(index, key, value) {
        const copy = new _OrderedDict(this);
        copy.insert(index, key, value);
        return copy;
    }
    before(key) {
        const index = this.#keys.indexOf(key) - 1;
        if (index < 0) {
            return void 0;
        }
        return this.entryAt(index);
    }
    /**
   * Sets a new key-value pair at the position before the given key.
   */ setBefore(key, newKey, value) {
        const index = this.#keys.indexOf(key);
        if (index === -1) {
            return this;
        }
        const currentIndex = this.#keys.indexOf(newKey);
        const targetIndex = currentIndex !== -1 && currentIndex < index ? index - 1 : index;
        return this.insert(targetIndex, newKey, value);
    }
    after(key) {
        let index = this.#keys.indexOf(key);
        index = index === -1 || index === this.size - 1 ? -1 : index + 1;
        if (index === -1) {
            return void 0;
        }
        return this.entryAt(index);
    }
    /**
   * Sets a new key-value pair at the position after the given key.
   */ setAfter(key, newKey, value) {
        const index = this.#keys.indexOf(key);
        if (index === -1) {
            return this;
        }
        const currentIndex = this.#keys.indexOf(newKey);
        const targetIndex = currentIndex !== -1 && currentIndex <= index ? index : index + 1;
        return this.insert(targetIndex, newKey, value);
    }
    first() {
        return this.entryAt(0);
    }
    last() {
        return this.entryAt(-1);
    }
    clear() {
        this.#keys = [];
        return super.clear();
    }
    delete(key) {
        const deleted = super.delete(key);
        if (deleted) {
            this.#keys.splice(this.#keys.indexOf(key), 1);
        }
        return deleted;
    }
    deleteAt(index) {
        const key = this.keyAt(index);
        if (key !== void 0) {
            return this.delete(key);
        }
        return false;
    }
    at(index) {
        const key = at(this.#keys, index);
        if (key !== void 0) {
            return this.get(key);
        }
    }
    entryAt(index) {
        const key = at(this.#keys, index);
        if (key !== void 0) {
            return [
                key,
                this.get(key)
            ];
        }
    }
    indexOf(key) {
        return this.#keys.indexOf(key);
    }
    keyAt(index) {
        return at(this.#keys, index);
    }
    from(key, offset) {
        const index = this.indexOf(key);
        if (index === -1) {
            return void 0;
        }
        let dest = index + offset;
        if (dest < 0) dest = 0;
        if (dest >= this.size) dest = this.size - 1;
        return this.at(dest);
    }
    keyFrom(key, offset) {
        const index = this.indexOf(key);
        if (index === -1) {
            return void 0;
        }
        let dest = index + offset;
        if (dest < 0) dest = 0;
        if (dest >= this.size) dest = this.size - 1;
        return this.keyAt(dest);
    }
    find(predicate, thisArg) {
        let index = 0;
        for (const entry of this){
            if (Reflect.apply(predicate, thisArg, [
                entry,
                index,
                this
            ])) {
                return entry;
            }
            index++;
        }
        return void 0;
    }
    findIndex(predicate, thisArg) {
        let index = 0;
        for (const entry of this){
            if (Reflect.apply(predicate, thisArg, [
                entry,
                index,
                this
            ])) {
                return index;
            }
            index++;
        }
        return -1;
    }
    filter(predicate, thisArg) {
        const entries = [];
        let index = 0;
        for (const entry of this){
            if (Reflect.apply(predicate, thisArg, [
                entry,
                index,
                this
            ])) {
                entries.push(entry);
            }
            index++;
        }
        return new _OrderedDict(entries);
    }
    map(callbackfn, thisArg) {
        const entries = [];
        let index = 0;
        for (const entry of this){
            entries.push([
                entry[0],
                Reflect.apply(callbackfn, thisArg, [
                    entry,
                    index,
                    this
                ])
            ]);
            index++;
        }
        return new _OrderedDict(entries);
    }
    reduce(...args) {
        const [callbackfn, initialValue] = args;
        const hasInitialValue = args.length > 1;
        if (!hasInitialValue && this.size === 0) {
            throw new TypeError("Reduce of empty OrderedDict with no initial value");
        }
        let index = 0;
        let accumulator = initialValue;
        for (const entry of this){
            if (index === 0 && !hasInitialValue) {
                accumulator = entry;
            } else {
                accumulator = Reflect.apply(callbackfn, this, [
                    accumulator,
                    entry,
                    index,
                    this
                ]);
            }
            index++;
        }
        return accumulator;
    }
    reduceRight(...args) {
        const [callbackfn, initialValue] = args;
        const hasInitialValue = args.length > 1;
        if (!hasInitialValue && this.size === 0) {
            throw new TypeError("Reduce of empty OrderedDict with no initial value");
        }
        let accumulator = initialValue;
        for(let index = this.size - 1; index >= 0; index--){
            const entry = this.entryAt(index);
            if (index === this.size - 1 && !hasInitialValue) {
                accumulator = entry;
            } else {
                accumulator = Reflect.apply(callbackfn, this, [
                    accumulator,
                    entry,
                    index,
                    this
                ]);
            }
        }
        return accumulator;
    }
    /**
   * Sorts the dictionary in place. This method mutates the dictionary and
   * returns a reference to the same object
   *
   * @param compareFn Function used to determine the order of the elements. It
   * is expected to return a negative value if the first argument is less than
   * the second argument, zero if they're equal, and a positive value otherwise.
   */ sort(compareFn) {
        if (typeof compareFn !== "function") {
            throw new TypeError(`OrderedDict.sort requires a compare function`);
        }
        const entries = [
            ...this.entries()
        ].sort(compareFn);
        this.clear();
        for (const [key, value] of entries){
            this.set(key, value);
        }
        return this;
    }
    /**
   * Returns a copy of the dictionary with its elements sorted.
   *
   * @param compareFn Function used to determine the order of the elements. It
   * is expected to return a negative value if the first argument is less than
   * the second argument, zero if they're equal, and a positive value otherwise.
   */ toSorted(compareFn) {
        if (typeof compareFn !== "function") {
            throw new TypeError(`OrderedDict.toSorted requires a compare function`);
        }
        const entries = [
            ...this.entries()
        ].sort(compareFn);
        return new _OrderedDict(entries);
    }
    toReversed() {
        const reversed = new _OrderedDict();
        for(let index = this.size - 1; index >= 0; index--){
            const key = this.keyAt(index);
            const element = this.get(key);
            reversed.set(key, element);
        }
        return reversed;
    }
    toSpliced(...args) {
        const entries = [
            ...this.entries()
        ];
        entries.splice(...args);
        return new _OrderedDict(entries);
    }
    slice(start, end) {
        const result = new _OrderedDict();
        for (const key of this.#keys.slice(start, end)){
            result.set(key, this.get(key));
        }
        return result;
    }
    every(predicate, thisArg) {
        let index = 0;
        for (const entry of this){
            if (!Reflect.apply(predicate, thisArg, [
                entry,
                index,
                this
            ])) {
                return false;
            }
            index++;
        }
        return true;
    }
    some(predicate, thisArg) {
        let index = 0;
        for (const entry of this){
            if (Reflect.apply(predicate, thisArg, [
                entry,
                index,
                this
            ])) {
                return true;
            }
            index++;
        }
        return false;
    }
};
function at(array, index) {
    if ("at" in Array.prototype) {
        return Array.prototype.at.call(array, index);
    }
    const actualIndex = toSafeIndex(array, index);
    return actualIndex === -1 ? void 0 : array[actualIndex];
}
__name(at, "at");
function toSafeIndex(array, index) {
    const length = array.length;
    const relativeIndex = toSafeInteger(index);
    const actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
    return actualIndex < 0 || actualIndex >= length ? -1 : actualIndex;
}
__name(toSafeIndex, "toSafeIndex");
function toSafeInteger(number) {
    return number !== number || number === 0 ? 0 : Math.trunc(number);
}
__name(toSafeInteger, "toSafeInteger");
;
// @__NO_SIDE_EFFECTS__
function createCollection2(name) {
    const PROVIDER_NAME = name + "CollectionProvider";
    const [createCollectionContext, createCollectionScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextScope"])(PROVIDER_NAME);
    const [CollectionStableContextProvider, useStableCollectionContext] = createCollectionContext(PROVIDER_NAME);
    CollectionStableContextProvider.displayName = name + "CollectionStableContextProvider";
    const [CollectionStatefulContextProvider, useStatefulCollectionContext] = createCollectionContext(PROVIDER_NAME);
    CollectionStatefulContextProvider.displayName = name + "CollectionStatefulContextProvider";
    const CollectionProvider = /* @__PURE__ */ __name(({ state, ...props })=>{
        return state ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CollectionProviderImpl, {
            ...props,
            state
        }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CollectionInit, {
            ...props
        });
    }, "CollectionProvider");
    CollectionProvider.displayName = PROVIDER_NAME;
    const CollectionInit = /* @__PURE__ */ __name((props)=>{
        const state = useInitCollection();
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CollectionProviderImpl, {
            ...props,
            state
        });
    }, "CollectionInit");
    CollectionInit.displayName = name + "CollectionInit";
    const CollectionProviderImpl = /* @__PURE__ */ __name((props)=>{
        const { scope, children, state } = props;
        const ref = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
        const [collectionElement, setCollectionElement] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
        const composeRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(ref, setCollectionElement);
        const [collection, setCollection] = state;
        const registryRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](new OrderedDict());
        const getCollection = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "createCollection2.CollectionProviderImpl.useCallback[getCollection]": ()=>{
                const registry = registryRef.current;
                if (!isInDocumentOrder(registry)) {
                    registry.sort(sortByDocumentPosition);
                }
                return registry;
            }
        }["createCollection2.CollectionProviderImpl.useCallback[getCollection]"], []);
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
            "createCollection2.CollectionProviderImpl.useEffect": ()=>{
                if (!collectionElement) {
                    return;
                }
                const observer = getChildListObserver({
                    "createCollection2.CollectionProviderImpl.useEffect.observer": ()=>{
                        setCollection({
                            "createCollection2.CollectionProviderImpl.useEffect.observer": (map)=>{
                                const sorted = map.toSorted(sortByDocumentPosition);
                                const orderChanged = sorted.some({
                                    "createCollection2.CollectionProviderImpl.useEffect.observer.orderChanged": ([key], index)=>map.keyAt(index) !== key
                                }["createCollection2.CollectionProviderImpl.useEffect.observer.orderChanged"]);
                                return orderChanged ? sorted : map;
                            }
                        }["createCollection2.CollectionProviderImpl.useEffect.observer"]);
                    }
                }["createCollection2.CollectionProviderImpl.useEffect.observer"]);
                observer.observe(collectionElement, {
                    childList: true,
                    subtree: true
                });
                return ({
                    "createCollection2.CollectionProviderImpl.useEffect": ()=>{
                        observer.disconnect();
                    }
                })["createCollection2.CollectionProviderImpl.useEffect"];
            }
        }["createCollection2.CollectionProviderImpl.useEffect"], [
            collectionElement,
            setCollection
        ]);
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CollectionStableContextProvider, {
            scope,
            collectionElementRef: composeRefs,
            collectionElementRefObject: ref,
            getCollection,
            setCollection,
            registryRef,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CollectionStatefulContextProvider, {
                scope,
                collectionElement,
                collection,
                children
            })
        });
    }, "CollectionProviderImpl");
    CollectionProviderImpl.displayName = name + "CollectionProviderImpl";
    const COLLECTION_SLOT_NAME = name + "CollectionSlot";
    const CollectionSlotImpl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSlot"])(COLLECTION_SLOT_NAME);
    const CollectionSlot = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
        const { scope, children } = props;
        const context = useStableCollectionContext(COLLECTION_SLOT_NAME, scope);
        const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, context.collectionElementRef);
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CollectionSlotImpl, {
            ref: composedRefs,
            children
        });
    });
    CollectionSlot.displayName = COLLECTION_SLOT_NAME;
    const ITEM_SLOT_NAME = name + "CollectionItemSlot";
    const ITEM_DATA_ATTR = "data-radix-collection-item";
    const CollectionItemSlotImpl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSlot"])(ITEM_SLOT_NAME);
    const CollectionItemSlot = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
        const { scope, children, ...itemData } = props;
        const ref = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
        const context = useStableCollectionContext(ITEM_SLOT_NAME, scope);
        const { setCollection, registryRef } = context;
        const itemDataRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](itemData);
        if (!shallowEqual(itemDataRef.current, itemData)) {
            itemDataRef.current = itemData;
        }
        const memoizedItemData = itemDataRef.current;
        const registerElement = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "createCollection2.CollectionItemSlot.useCallback[registerElement]": (node)=>{
                const registry = registryRef.current;
                if (node) {
                    registry.set(node, {
                        ...itemDataRef.current,
                        element: node
                    });
                } else if (ref.current) {
                    registry.delete(ref.current);
                }
            }
        }["createCollection2.CollectionItemSlot.useCallback[registerElement]"], [
            registryRef
        ]);
        const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, registerElement, ref);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
            "createCollection2.CollectionItemSlot.useLayoutEffect": ()=>{
                const node = ref.current;
                const registry = registryRef.current;
                if (node && registry.has(node)) {
                    registry.set(node, {
                        ...memoizedItemData,
                        element: node
                    });
                }
            }
        }["createCollection2.CollectionItemSlot.useLayoutEffect"], [
            memoizedItemData,
            registryRef
        ]);
        const registeredRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
            "createCollection2.CollectionItemSlot.useEffect": ()=>{
                const element = ref.current;
                const registered = registeredRef.current;
                if ((registered?.element ?? null) === element && (!element || registered?.itemData === memoizedItemData)) {
                    return;
                }
                registeredRef.current = element ? {
                    element,
                    itemData: memoizedItemData
                } : null;
                setCollection({
                    "createCollection2.CollectionItemSlot.useEffect": (map)=>{
                        const next = new OrderedDict(map);
                        if (registered && registered.element !== element) {
                            next.delete(registered.element);
                        }
                        if (element) {
                            next.set(element, {
                                ...memoizedItemData,
                                element
                            });
                        }
                        return next.sort(sortByDocumentPosition);
                    }
                }["createCollection2.CollectionItemSlot.useEffect"]);
            }
        }["createCollection2.CollectionItemSlot.useEffect"]);
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
            "createCollection2.CollectionItemSlot.useEffect": ()=>{
                return ({
                    "createCollection2.CollectionItemSlot.useEffect": ()=>{
                        const registered = registeredRef.current;
                        registeredRef.current = null;
                        if (!registered) {
                            return;
                        }
                        setCollection({
                            "createCollection2.CollectionItemSlot.useEffect": (map)=>{
                                if (!map.has(registered.element)) {
                                    return map;
                                }
                                const next = new OrderedDict(map);
                                next.delete(registered.element);
                                return next;
                            }
                        }["createCollection2.CollectionItemSlot.useEffect"]);
                    }
                })["createCollection2.CollectionItemSlot.useEffect"];
            }
        }["createCollection2.CollectionItemSlot.useEffect"], [
            setCollection
        ]);
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CollectionItemSlotImpl, {
            ...{
                [ITEM_DATA_ATTR]: ""
            },
            ref: composedRefs,
            children
        });
    });
    CollectionItemSlot.displayName = ITEM_SLOT_NAME;
    function useInitCollection() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](new OrderedDict());
    }
    __name(useInitCollection, "useInitCollection");
    function useCollection(scope) {
        const { collection } = useStatefulCollectionContext(name + "CollectionConsumer", scope);
        return collection;
    }
    __name(useCollection, "useCollection");
    function useGetCollection(scope) {
        const { getCollection } = useStableCollectionContext(name + "CollectionConsumer", scope);
        return getCollection;
    }
    __name(useGetCollection, "useGetCollection");
    const functions = {
        createCollectionScope,
        useCollection,
        useGetCollection,
        useInitCollection
    };
    return [
        {
            Provider: CollectionProvider,
            Slot: CollectionSlot,
            ItemSlot: CollectionItemSlot
        },
        functions
    ];
}
__name(createCollection2, "createCollection");
function shallowEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== "object" || typeof b !== "object") return false;
    if (a == null || b == null) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA){
        if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
        if (a[key] !== b[key]) return false;
    }
    return true;
}
__name(shallowEqual, "shallowEqual");
function isElementPreceding(a, b) {
    return !!(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
}
__name(isElementPreceding, "isElementPreceding");
function isInDocumentOrder(dict) {
    let previous;
    for (const element of dict.keys()){
        if (previous) {
            const position = previous.compareDocumentPosition(element);
            if (!(position & Node.DOCUMENT_POSITION_DISCONNECTED) && position & Node.DOCUMENT_POSITION_PRECEDING) {
                return false;
            }
        }
        previous = element;
    }
    return true;
}
__name(isInDocumentOrder, "isInDocumentOrder");
function sortByDocumentPosition(a, b) {
    return !a[1].element || !b[1].element ? 0 : isElementPreceding(a[1].element, b[1].element) ? -1 : 1;
}
__name(sortByDocumentPosition, "sortByDocumentPosition");
function getChildListObserver(callback) {
    const observer = new MutationObserver((mutationsList)=>{
        for (const mutation of mutationsList){
            if (mutation.type === "childList") {
                callback();
                return;
            }
        }
    });
    return observer;
}
__name(getChildListObserver, "getChildListObserver");
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Demo-2/node_modules/@radix-ui/react-direction/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DirectionProvider",
    ()=>DirectionProvider,
    "Provider",
    ()=>DirectionProvider,
    "useDirection",
    ()=>useDirection
]);
// src/direction.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
var __defProp = Object.defineProperty;
var __name = (target, value)=>__defProp(target, "name", {
        value,
        configurable: true
    });
;
;
var Direction = {
    LTR: "ltr",
    RTL: "rtl"
};
var DirectionContext = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](void 0);
var DirectionProvider = /* @__PURE__ */ __name((props)=>{
    const { dir, children } = props;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(DirectionContext.Provider, {
        value: dir,
        children
    });
}, "DirectionProvider");
function useDirection(localDir) {
    const globalDir = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](DirectionContext);
    return localDir || globalDir || Direction.LTR;
}
__name(useDirection, "useDirection");
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Demo-2/node_modules/@radix-ui/react-focus-guards/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FocusGuards",
    ()=>FocusGuards,
    "Root",
    ()=>FocusGuards,
    "useFocusGuards",
    ()=>useFocusGuards
]);
// src/focus-guards.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
var __defProp = Object.defineProperty;
var __name = (target, value)=>__defProp(target, "name", {
        value,
        configurable: true
    });
;
var count = 0;
var guards = null;
function FocusGuards(props) {
    useFocusGuards();
    return props.children;
}
__name(FocusGuards, "FocusGuards");
function useFocusGuards() {
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useFocusGuards.useEffect": ()=>{
            if (!guards) {
                guards = {
                    start: createFocusGuard(),
                    end: createFocusGuard()
                };
            }
            const { start, end } = guards;
            if (document.body.firstElementChild !== start) {
                document.body.insertAdjacentElement("afterbegin", start);
            }
            if (document.body.lastElementChild !== end) {
                document.body.insertAdjacentElement("beforeend", end);
            }
            count++;
            return ({
                "useFocusGuards.useEffect": ()=>{
                    if (count === 1) {
                        guards?.start.remove();
                        guards?.end.remove();
                        guards = null;
                    }
                    count = Math.max(0, count - 1);
                }
            })["useFocusGuards.useEffect"];
        }
    }["useFocusGuards.useEffect"], []);
}
__name(useFocusGuards, "useFocusGuards");
function createFocusGuard() {
    const element = document.createElement("span");
    element.setAttribute("data-radix-focus-guard", "");
    element.tabIndex = 0;
    element.style.outline = "none";
    element.style.opacity = "0";
    element.style.position = "fixed";
    element.style.pointerEvents = "none";
    return element;
}
__name(createFocusGuard, "createFocusGuard");
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Demo-2/node_modules/@radix-ui/react-use-is-hydrated/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIsHydrated",
    ()=>useIsHydrated2
]);
// src/use-is-hydrated.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __defProp = Object.defineProperty;
var __name = (target, value)=>__defProp(target, "name", {
        value,
        configurable: true
    });
;
;
var _isHydrated = false;
function useIsHydrated() {
    const [isHydrated, setIsHydrated] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useState(_isHydrated);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useEffect({
        "useIsHydrated.useEffect": ()=>{
            if (!_isHydrated) {
                _isHydrated = true;
                setIsHydrated(true);
            }
        }
    }["useIsHydrated.useEffect"], []);
    return isHydrated;
}
__name(useIsHydrated, "useIsHydrated");
// src/use-is-hydrated.tsx
var useReactSyncExternalStore = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[" useSyncExternalStore ".trim().toString()];
function subscribe() {
    return ()=>{};
}
__name(subscribe, "subscribe");
function useIsHydratedModern() {
    return useReactSyncExternalStore(subscribe, {
        "useIsHydratedModern.useReactSyncExternalStore": ()=>true
    }["useIsHydratedModern.useReactSyncExternalStore"], {
        "useIsHydratedModern.useReactSyncExternalStore": ()=>false
    }["useIsHydratedModern.useReactSyncExternalStore"]);
}
__name(useIsHydratedModern, "useIsHydratedModern");
var useIsHydrated2 = typeof useReactSyncExternalStore === "function" ? useIsHydratedModern : useIsHydrated;
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Demo-2/node_modules/@radix-ui/react-roving-focus/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Item",
    ()=>RovingFocusGroupItem,
    "Root",
    ()=>RovingFocusGroup,
    "RovingFocusGroup",
    ()=>RovingFocusGroup,
    "RovingFocusGroupItem",
    ()=>RovingFocusGroupItem,
    "createRovingFocusGroupScope",
    ()=>createRovingFocusGroupScope
]);
// src/roving-focus-group.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collection$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-collection/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-context/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-id/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$direction$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-direction/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$is$2d$hydrated$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-use-is-hydrated/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
var __defProp = Object.defineProperty;
var __name = (target, value)=>__defProp(target, "name", {
        value,
        configurable: true
    });
;
;
;
;
;
;
;
;
;
;
;
;
;
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = {
    bubbles: false,
    cancelable: true
};
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collection$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCollection"])(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextScope"])(GROUP_NAME, [
    createCollectionScope
]);
var Orientation = {
    Vertical: "vertical",
    Horizontal: "horizontal"
};
var Direction = {
    LTR: "ltr",
    RTL: "rtl"
};
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function RovingFocusGroup2(props, forwardedRef) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.Provider, {
        scope: props.__scopeRovingFocusGroup,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.Slot, {
            scope: props.__scopeRovingFocusGroup,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(RovingFocusGroupImpl, {
                ...props,
                ref: forwardedRef
            })
        })
    });
}, "RovingFocusGroup"));
var RovingFocusGroupImpl = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function RovingFocusGroupImpl2(props, forwardedRef) {
    const { __scopeRovingFocusGroup, orientation, loop = false, dir, currentTabStopId: currentTabStopIdProp, defaultCurrentTabStopId, onCurrentTabStopIdChange, onEntryFocus, preventScrollOnEntryFocus = false, ...groupProps } = props;
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, ref);
    const direction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$direction$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDirection"])(dir);
    const [currentTabStopId, setCurrentTabStopId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControllableState"])({
        prop: currentTabStopIdProp,
        defaultProp: defaultCurrentTabStopId ?? null,
        onChange: onCurrentTabStopIdChange,
        caller: GROUP_NAME
    });
    const [isTabbingBackOut, setIsTabbingBackOut] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const handleEntryFocus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"])(onEntryFocus);
    const getItems = useCollection(__scopeRovingFocusGroup);
    const isClickFocusRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const [focusableItemsCount, setFocusableItemsCount] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](0);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "RovingFocusGroupImpl.RovingFocusGroupImpl2.useEffect": ()=>{
            const node = ref.current;
            if (node) {
                node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
                return ({
                    "RovingFocusGroupImpl.RovingFocusGroupImpl2.useEffect": ()=>node.removeEventListener(ENTRY_FOCUS, handleEntryFocus)
                })["RovingFocusGroupImpl.RovingFocusGroupImpl2.useEffect"];
            }
        }
    }["RovingFocusGroupImpl.RovingFocusGroupImpl2.useEffect"], [
        handleEntryFocus
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(RovingFocusProvider, {
        scope: __scopeRovingFocusGroup,
        orientation,
        dir: direction,
        loop,
        currentTabStopId,
        onItemFocus: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "RovingFocusGroupImpl.RovingFocusGroupImpl2.useCallback": (tabStopId)=>setCurrentTabStopId(tabStopId)
        }["RovingFocusGroupImpl.RovingFocusGroupImpl2.useCallback"], [
            setCurrentTabStopId
        ]),
        onItemShiftTab: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "RovingFocusGroupImpl.RovingFocusGroupImpl2.useCallback": ()=>setIsTabbingBackOut(true)
        }["RovingFocusGroupImpl.RovingFocusGroupImpl2.useCallback"], []),
        onFocusableItemAdd: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "RovingFocusGroupImpl.RovingFocusGroupImpl2.useCallback": ()=>setFocusableItemsCount({
                    "RovingFocusGroupImpl.RovingFocusGroupImpl2.useCallback": (prevCount)=>prevCount + 1
                }["RovingFocusGroupImpl.RovingFocusGroupImpl2.useCallback"])
        }["RovingFocusGroupImpl.RovingFocusGroupImpl2.useCallback"], []),
        onFocusableItemRemove: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "RovingFocusGroupImpl.RovingFocusGroupImpl2.useCallback": ()=>setFocusableItemsCount({
                    "RovingFocusGroupImpl.RovingFocusGroupImpl2.useCallback": (prevCount)=>prevCount - 1
                }["RovingFocusGroupImpl.RovingFocusGroupImpl2.useCallback"])
        }["RovingFocusGroupImpl.RovingFocusGroupImpl2.useCallback"], []),
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
            tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
            "data-orientation": orientation,
            ...groupProps,
            ref: composedRefs,
            style: {
                outline: "none",
                ...props.style
            },
            onMouseDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onMouseDown, ()=>{
                isClickFocusRef.current = true;
            }),
            onFocus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onFocus, (event)=>{
                const isKeyboardFocus = !isClickFocusRef.current;
                if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
                    const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
                    event.currentTarget.dispatchEvent(entryFocusEvent);
                    if (!entryFocusEvent.defaultPrevented) {
                        const items = getItems().filter((item)=>item.focusable);
                        const activeItem = items.find((item)=>item.active);
                        const currentItem = items.find((item)=>item.id === currentTabStopId);
                        const candidateItems = [
                            activeItem,
                            currentItem,
                            ...items
                        ].filter(Boolean);
                        const candidateNodes = candidateItems.map((item)=>item.ref.current);
                        focusFirst(candidateNodes, preventScrollOnEntryFocus);
                    }
                }
                isClickFocusRef.current = false;
            }),
            onBlur: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onBlur, ()=>setIsTabbingBackOut(false))
        })
    });
}, "RovingFocusGroupImpl"));
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function RovingFocusGroupItem2(props, forwardedRef) {
    const { __scopeRovingFocusGroup, focusable = true, active = false, tabStopId, children, ...itemProps } = props;
    const autoId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    const isHydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$is$2d$hydrated$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsHydrated"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "RovingFocusGroupItem.RovingFocusGroupItem2.useLayoutEffect": ()=>{
            if (!isHydrated || !focusable) {
                return;
            }
            onFocusableItemAdd();
            return ({
                "RovingFocusGroupItem.RovingFocusGroupItem2.useLayoutEffect": ()=>onFocusableItemRemove()
            })["RovingFocusGroupItem.RovingFocusGroupItem2.useLayoutEffect"];
        }
    }["RovingFocusGroupItem.RovingFocusGroupItem2.useLayoutEffect"], [
        isHydrated,
        focusable,
        onFocusableItemAdd,
        onFocusableItemRemove
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "RovingFocusGroupItem.RovingFocusGroupItem2.useEffect": ()=>{
            if (isHydrated || !focusable) {
                return;
            }
            onFocusableItemAdd();
            return ({
                "RovingFocusGroupItem.RovingFocusGroupItem2.useEffect": ()=>onFocusableItemRemove()
            })["RovingFocusGroupItem.RovingFocusGroupItem2.useEffect"];
        }
    }["RovingFocusGroupItem.RovingFocusGroupItem2.useEffect"], [
        isHydrated,
        focusable,
        onFocusableItemAdd,
        onFocusableItemRemove
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.ItemSlot, {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].span, {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onMouseDown, (event)=>{
                if (!focusable) event.preventDefault();
                else context.onItemFocus(id);
            }),
            onFocus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onFocus, ()=>context.onItemFocus(id)),
            onKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onKeyDown, (event)=>{
                if (event.key === "Tab" && event.shiftKey) {
                    context.onItemShiftTab();
                    return;
                }
                if (event.target !== event.currentTarget) return;
                const focusIntent = getFocusIntent(event, context.orientation, context.dir);
                if (focusIntent !== void 0) {
                    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                    event.preventDefault();
                    const items = getItems().filter((item)=>item.focusable);
                    let candidateNodes = items.map((item)=>item.ref.current);
                    if (focusIntent === "last") candidateNodes.reverse();
                    else if (focusIntent === "prev" || focusIntent === "next") {
                        if (focusIntent === "prev") candidateNodes.reverse();
                        const currentIndex = candidateNodes.indexOf(event.currentTarget);
                        candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                    }
                    setTimeout(()=>focusFirst(candidateNodes));
                }
            }),
            children: typeof children === "function" ? children({
                isCurrentTabStop,
                hasTabStop: currentTabStopId != null
            }) : children
        })
    });
}, "RovingFocusGroupItem"));
var MAP_KEY_TO_FOCUS_INTENT = {
    ArrowLeft: "prev",
    ArrowUp: "prev",
    ArrowRight: "next",
    ArrowDown: "next",
    PageUp: "first",
    Home: "first",
    PageDown: "last",
    End: "last"
};
function getDirectionAwareKey(key, dir) {
    if (dir !== Direction.RTL) return key;
    return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
__name(getDirectionAwareKey, "getDirectionAwareKey");
function getFocusIntent(event, orientation, dir) {
    const key = getDirectionAwareKey(event.key, dir);
    if (orientation === Orientation.Vertical && [
        "ArrowLeft",
        "ArrowRight"
    ].includes(key)) {
        return void 0;
    }
    if (orientation === Orientation.Horizontal && [
        "ArrowUp",
        "ArrowDown"
    ].includes(key)) {
        return void 0;
    }
    return MAP_KEY_TO_FOCUS_INTENT[key];
}
__name(getFocusIntent, "getFocusIntent");
function focusFirst(candidates, preventScroll = false) {
    const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
    for (const candidate of candidates){
        if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
        candidate.focus({
            preventScroll
        });
        if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
    }
}
__name(focusFirst, "focusFirst");
function wrapArray(array, startIndex) {
    return array.map((_, index)=>array[(startIndex + index) % array.length]);
}
__name(wrapArray, "wrapArray");
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Demo-2/node_modules/aria-hidden/dist/es2015/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hideOthers",
    ()=>hideOthers,
    "inertOthers",
    ()=>inertOthers,
    "supportsInert",
    ()=>supportsInert,
    "suppressOthers",
    ()=>suppressOthers
]);
var getDefaultParent = function(originalTarget) {
    if (typeof document === 'undefined') {
        return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
};
var counterMap = new WeakMap();
var uncontrolledNodes = new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function(node) {
    return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function(parent, targets) {
    return targets.map(function(target) {
        if (parent.contains(target)) {
            return target;
        }
        var correctedTarget = unwrapHost(target);
        if (correctedTarget && parent.contains(correctedTarget)) {
            return correctedTarget;
        }
        console.error('aria-hidden', target, 'in not contained inside', parent, '. Doing nothing');
        return null;
    }).filter(function(x) {
        return Boolean(x);
    });
};
/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @param {String} [controlAttribute] - html Attribute to control
 * @return {Undo} undo command
 */ var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [
        originalTarget
    ]);
    if (!markerMap[markerName]) {
        markerMap[markerName] = new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = new Set();
    var elementsToStop = new Set(targets);
    var keep = function(el) {
        if (!el || elementsToKeep.has(el)) {
            return;
        }
        elementsToKeep.add(el);
        keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function(parent) {
        if (!parent || elementsToStop.has(parent)) {
            return;
        }
        Array.prototype.forEach.call(parent.children, function(node) {
            if (elementsToKeep.has(node)) {
                deep(node);
            } else {
                try {
                    var attr = node.getAttribute(controlAttribute);
                    var alreadyHidden = attr !== null && attr !== 'false';
                    var counterValue = (counterMap.get(node) || 0) + 1;
                    var markerValue = (markerCounter.get(node) || 0) + 1;
                    counterMap.set(node, counterValue);
                    markerCounter.set(node, markerValue);
                    hiddenNodes.push(node);
                    if (counterValue === 1 && alreadyHidden) {
                        uncontrolledNodes.set(node, true);
                    }
                    if (markerValue === 1) {
                        node.setAttribute(markerName, 'true');
                    }
                    if (!alreadyHidden) {
                        node.setAttribute(controlAttribute, 'true');
                    }
                } catch (e) {
                    console.error('aria-hidden: cannot operate on ', node, e);
                }
            }
        });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function() {
        hiddenNodes.forEach(function(node) {
            var counterValue = counterMap.get(node) - 1;
            var markerValue = markerCounter.get(node) - 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            if (!counterValue) {
                if (!uncontrolledNodes.has(node)) {
                    node.removeAttribute(controlAttribute);
                }
                uncontrolledNodes.delete(node);
            }
            if (!markerValue) {
                node.removeAttribute(markerName);
            }
        });
        lockCount--;
        if (!lockCount) {
            // clear
            counterMap = new WeakMap();
            counterMap = new WeakMap();
            uncontrolledNodes = new WeakMap();
            markerMap = {};
        }
    };
};
var hideOthers = function(originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
        markerName = 'data-aria-hidden';
    }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [
        originalTarget
    ]);
    var activeParentNode = parentNode || getDefaultParent(originalTarget);
    if (!activeParentNode) {
        return function() {
            return null;
        };
    }
    // we should not hide aria-live elements - https://github.com/theKashey/aria-hidden/issues/10
    // and script elements, as they have no impact on accessibility.
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll('[aria-live], script')));
    return applyAttributeToOthers(targets, activeParentNode, markerName, 'aria-hidden');
};
var inertOthers = function(originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
        markerName = 'data-inert-ed';
    }
    var activeParentNode = parentNode || getDefaultParent(originalTarget);
    if (!activeParentNode) {
        return function() {
            return null;
        };
    }
    return applyAttributeToOthers(originalTarget, activeParentNode, markerName, 'inert');
};
var supportsInert = function() {
    return typeof HTMLElement !== 'undefined' && HTMLElement.prototype.hasOwnProperty('inert');
};
var suppressOthers = function(originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
        markerName = 'data-suppressed';
    }
    return (supportsInert() ? inertOthers : hideOthers)(originalTarget, parentNode, markerName);
};
}),
"[project]/Demo-2/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ /* global Reflect, Promise, SuppressedError, Symbol, Iterator */ __turbopack_context__.s([
    "__addDisposableResource",
    ()=>__addDisposableResource,
    "__assign",
    ()=>__assign,
    "__asyncDelegator",
    ()=>__asyncDelegator,
    "__asyncGenerator",
    ()=>__asyncGenerator,
    "__asyncValues",
    ()=>__asyncValues,
    "__await",
    ()=>__await,
    "__awaiter",
    ()=>__awaiter,
    "__classPrivateFieldGet",
    ()=>__classPrivateFieldGet,
    "__classPrivateFieldIn",
    ()=>__classPrivateFieldIn,
    "__classPrivateFieldSet",
    ()=>__classPrivateFieldSet,
    "__createBinding",
    ()=>__createBinding,
    "__decorate",
    ()=>__decorate,
    "__disposeResources",
    ()=>__disposeResources,
    "__esDecorate",
    ()=>__esDecorate,
    "__exportStar",
    ()=>__exportStar,
    "__extends",
    ()=>__extends,
    "__generator",
    ()=>__generator,
    "__importDefault",
    ()=>__importDefault,
    "__importStar",
    ()=>__importStar,
    "__makeTemplateObject",
    ()=>__makeTemplateObject,
    "__metadata",
    ()=>__metadata,
    "__param",
    ()=>__param,
    "__propKey",
    ()=>__propKey,
    "__read",
    ()=>__read,
    "__rest",
    ()=>__rest,
    "__rewriteRelativeImportExtension",
    ()=>__rewriteRelativeImportExtension,
    "__runInitializers",
    ()=>__runInitializers,
    "__setFunctionName",
    ()=>__setFunctionName,
    "__spread",
    ()=>__spread,
    "__spreadArray",
    ()=>__spreadArray,
    "__spreadArrays",
    ()=>__spreadArrays,
    "__values",
    ()=>__values,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(d, b) {
        d.__proto__ = b;
    } || function(d, b) {
        for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };
    return extendStatics(d, b);
};
function __extends(d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function __rest(s, e) {
    var t = {};
    for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for(var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++){
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
}
function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) {
        if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
        return f;
    }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for(var i = decorators.length - 1; i >= 0; i--){
        var context = {};
        for(var p in contextIn)context[p] = p === "access" ? {} : contextIn[p];
        for(var p in contextIn.access)context.access[p] = contextIn.access[p];
        context.addInitializer = function(f) {
            if (done) throw new TypeError("Cannot add initializers after decoration has completed");
            extraInitializers.push(accept(f || null));
        };
        var result = (0, decorators[i])(kind === "accessor" ? {
            get: descriptor.get,
            set: descriptor.set
        } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        } else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
}
;
function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for(var i = 0; i < initializers.length; i++){
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
}
;
function __propKey(x) {
    return typeof x === "symbol" ? x : "".concat(x);
}
;
function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", {
        configurable: true,
        value: prefix ? "".concat(prefix, " ", name) : name
    });
}
;
function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}
function __generator(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var __createBinding = Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
};
function __exportStar(m, o) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}
function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function() {
            if (o && i >= o.length) o = void 0;
            return {
                value: o && o[i++],
                done: !o
            };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
}
function __spread() {
    for(var ar = [], i = 0; i < arguments.length; i++)ar = ar.concat(__read(arguments[i]));
    return ar;
}
function __spreadArrays() {
    for(var s = 0, i = 0, il = arguments.length; i < il; i++)s += arguments[i].length;
    for(var r = Array(s), k = 0, i = 0; i < il; i++)for(var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)r[k] = a[j];
    return r;
}
function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
        return this;
    }, i;
    //TURBOPACK unreachable
    ;
    function awaitReturn(f) {
        return function(v) {
            return Promise.resolve(v).then(f, reject);
        };
    }
    function verb(n, f) {
        if (g[n]) {
            i[n] = function(v) {
                return new Promise(function(a, b) {
                    q.push([
                        n,
                        v,
                        a,
                        b
                    ]) > 1 || resume(n, v);
                });
            };
            if (f) i[n] = f(i[n]);
        }
    }
    function resume(n, v) {
        try {
            step(g[n](v));
        } catch (e) {
            settle(q[0][3], e);
        }
    }
    function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
        resume("next", value);
    }
    function reject(value) {
        resume("throw", value);
    }
    function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
}
function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function(e) {
        throw e;
    }), verb("return"), i[Symbol.iterator] = function() {
        return this;
    }, i;
    //TURBOPACK unreachable
    ;
    function verb(n, f) {
        i[n] = o[n] ? function(v) {
            return (p = !p) ? {
                value: __await(o[n](v)),
                done: false
            } : f ? f(v) : v;
        } : f;
    }
}
function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
    }, i);
    //TURBOPACK unreachable
    ;
    function verb(n) {
        i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
                v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
        };
    }
    function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function(v) {
            resolve({
                value: v,
                done: d
            });
        }, reject);
    }
}
function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
        Object.defineProperty(cooked, "raw", {
            value: raw
        });
    } else {
        cooked.raw = raw;
    }
    return cooked;
}
;
var __setModuleDefault = Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
};
var ownKeys = function(o) {
    ownKeys = Object.getOwnPropertyNames || function(o) {
        var ar = [];
        for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
        return ar;
    };
    return ownKeys(o);
};
function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
    }
    __setModuleDefault(result, mod);
    return result;
}
function __importDefault(mod) {
    return mod && mod.__esModule ? mod : {
        default: mod
    };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}
function __addDisposableResource(env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() {
            try {
                inner.call(this);
            } catch (e) {
                return Promise.reject(e);
            }
        };
        env.stack.push({
            value: value,
            dispose: dispose,
            async: async
        });
    } else if (async) {
        env.stack.push({
            async: true
        });
    }
    return value;
}
var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function __disposeResources(env) {
    function fail(e) {
        env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }
    var r, s = 0;
    function next() {
        while(r = env.stack.pop()){
            try {
                if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                if (r.dispose) {
                    var result = r.dispose.call(r.value);
                    if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
                        fail(e);
                        return next();
                    });
                } else s |= 1;
            } catch (e) {
                fail(e);
            }
        }
        if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
        if (env.hasError) throw env.error;
    }
    return next();
}
function __rewriteRelativeImportExtension(path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
        });
    }
    return path;
}
const __TURBOPACK__default__export__ = {
    __extends,
    __assign,
    __rest,
    __decorate,
    __param,
    __esDecorate,
    __runInitializers,
    __propKey,
    __setFunctionName,
    __metadata,
    __awaiter,
    __generator,
    __createBinding,
    __exportStar,
    __values,
    __read,
    __spread,
    __spreadArrays,
    __spreadArray,
    __await,
    __asyncGenerator,
    __asyncDelegator,
    __asyncValues,
    __makeTemplateObject,
    __importStar,
    __importDefault,
    __classPrivateFieldGet,
    __classPrivateFieldSet,
    __classPrivateFieldIn,
    __addDisposableResource,
    __disposeResources,
    __rewriteRelativeImportExtension
};
}),
"[project]/Demo-2/node_modules/react-remove-scroll-bar/dist/es2015/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fullWidthClassName",
    ()=>fullWidthClassName,
    "noScrollbarsClassName",
    ()=>noScrollbarsClassName,
    "removedBarSizeVariable",
    ()=>removedBarSizeVariable,
    "zeroRightClassName",
    ()=>zeroRightClassName
]);
var zeroRightClassName = 'right-scroll-bar-position';
var fullWidthClassName = 'width-before-scroll-bar';
var noScrollbarsClassName = 'with-scroll-bars-hidden';
var removedBarSizeVariable = '--removed-body-scroll-bar-size';
}),
"[project]/Demo-2/node_modules/use-callback-ref/dist/es2015/assignRef.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Assigns a value for a given ref, no matter of the ref format
 * @param {RefObject} ref - a callback function or ref object
 * @param value - a new value
 *
 * @see https://github.com/theKashey/use-callback-ref#assignref
 * @example
 * const refObject = useRef();
 * const refFn = (ref) => {....}
 *
 * assignRef(refObject, "refValue");
 * assignRef(refFn, "refValue");
 */ __turbopack_context__.s([
    "assignRef",
    ()=>assignRef
]);
function assignRef(ref, value) {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
    return ref;
}
}),
"[project]/Demo-2/node_modules/use-callback-ref/dist/es2015/useRef.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCallbackRef",
    ()=>useCallbackRef
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function useCallbackRef(initialValue, callback) {
    var ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useCallbackRef.useState": function() {
            return {
                // value
                value: initialValue,
                // last callback
                callback: callback,
                // "memoized" public interface
                facade: {
                    get current () {
                        return ref.value;
                    },
                    set current (value){
                        var last = ref.value;
                        if (last !== value) {
                            ref.value = value;
                            ref.callback(value, last);
                        }
                    }
                }
            };
        }
    }["useCallbackRef.useState"])[0];
    // update callback
    ref.callback = callback;
    return ref.facade;
}
}),
"[project]/Demo-2/node_modules/use-callback-ref/dist/es2015/useMergeRef.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMergeRefs",
    ()=>useMergeRefs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$assignRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/use-callback-ref/dist/es2015/assignRef.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$useRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/use-callback-ref/dist/es2015/useRef.js [app-client] (ecmascript)");
;
;
;
var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"] : __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"];
var currentValues = new WeakMap();
function useMergeRefs(refs, defaultValue) {
    var callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$useRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"])(defaultValue || null, {
        "useMergeRefs.useCallbackRef[callbackRef]": function(newValue) {
            return refs.forEach({
                "useMergeRefs.useCallbackRef[callbackRef]": function(ref) {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$assignRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assignRef"])(ref, newValue);
                }
            }["useMergeRefs.useCallbackRef[callbackRef]"]);
        }
    }["useMergeRefs.useCallbackRef[callbackRef]"]);
    // handle refs changes - added or removed
    useIsomorphicLayoutEffect({
        "useMergeRefs.useIsomorphicLayoutEffect": function() {
            var oldValue = currentValues.get(callbackRef);
            if (oldValue) {
                var prevRefs_1 = new Set(oldValue);
                var nextRefs_1 = new Set(refs);
                var current_1 = callbackRef.current;
                prevRefs_1.forEach({
                    "useMergeRefs.useIsomorphicLayoutEffect": function(ref) {
                        if (!nextRefs_1.has(ref)) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$assignRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assignRef"])(ref, null);
                        }
                    }
                }["useMergeRefs.useIsomorphicLayoutEffect"]);
                nextRefs_1.forEach({
                    "useMergeRefs.useIsomorphicLayoutEffect": function(ref) {
                        if (!prevRefs_1.has(ref)) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$assignRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assignRef"])(ref, current_1);
                        }
                    }
                }["useMergeRefs.useIsomorphicLayoutEffect"]);
            }
            currentValues.set(callbackRef, refs);
        }
    }["useMergeRefs.useIsomorphicLayoutEffect"], [
        refs
    ]);
    return callbackRef;
}
}),
"[project]/Demo-2/node_modules/use-sidecar/dist/es2015/medium.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createMedium",
    ()=>createMedium,
    "createSidecarMedium",
    ()=>createSidecarMedium
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
;
function ItoI(a) {
    return a;
}
function innerCreateMedium(defaults, middleware) {
    if (middleware === void 0) {
        middleware = ItoI;
    }
    var buffer = [];
    var assigned = false;
    var medium = {
        read: function() {
            if (assigned) {
                throw new Error('Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.');
            }
            if (buffer.length) {
                return buffer[buffer.length - 1];
            }
            return defaults;
        },
        useMedium: function(data) {
            var item = middleware(data, assigned);
            buffer.push(item);
            return function() {
                buffer = buffer.filter(function(x) {
                    return x !== item;
                });
            };
        },
        assignSyncMedium: function(cb) {
            assigned = true;
            while(buffer.length){
                var cbs = buffer;
                buffer = [];
                cbs.forEach(cb);
            }
            buffer = {
                push: function(x) {
                    return cb(x);
                },
                filter: function() {
                    return buffer;
                }
            };
        },
        assignMedium: function(cb) {
            assigned = true;
            var pendingQueue = [];
            if (buffer.length) {
                var cbs = buffer;
                buffer = [];
                cbs.forEach(cb);
                pendingQueue = buffer;
            }
            var executeQueue = function() {
                var cbs = pendingQueue;
                pendingQueue = [];
                cbs.forEach(cb);
            };
            var cycle = function() {
                return Promise.resolve().then(executeQueue);
            };
            cycle();
            buffer = {
                push: function(x) {
                    pendingQueue.push(x);
                    cycle();
                },
                filter: function(filter) {
                    pendingQueue = pendingQueue.filter(filter);
                    return buffer;
                }
            };
        }
    };
    return medium;
}
function createMedium(defaults, middleware) {
    if (middleware === void 0) {
        middleware = ItoI;
    }
    return innerCreateMedium(defaults, middleware);
}
function createSidecarMedium(options) {
    if (options === void 0) {
        options = {};
    }
    var medium = innerCreateMedium(null);
    medium.options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({
        async: true,
        ssr: false
    }, options);
    return medium;
}
}),
"[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/medium.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "effectCar",
    ()=>effectCar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$use$2d$sidecar$2f$dist$2f$es2015$2f$medium$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/use-sidecar/dist/es2015/medium.js [app-client] (ecmascript)");
;
var effectCar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$use$2d$sidecar$2f$dist$2f$es2015$2f$medium$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSidecarMedium"])();
}),
"[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/UI.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RemoveScroll",
    ()=>RemoveScroll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll-bar/dist/es2015/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$useMergeRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/use-callback-ref/dist/es2015/useMergeRef.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$medium$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/medium.js [app-client] (ecmascript)");
;
;
;
;
;
var nothing = function() {
    return;
};
/**
 * Removes scrollbar from the page and contain the scroll within the Lock
 */ var RemoveScroll = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function(props, parentRef) {
    var ref = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    var _a = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        onScrollCapture: nothing,
        onWheelCapture: nothing,
        onTouchMoveCapture: nothing
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? 'div' : _b, gapMode = props.gapMode, rest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__rest"])(props, [
        "forwardProps",
        "children",
        "className",
        "removeScrollBar",
        "enabled",
        "shards",
        "sideCar",
        "noRelative",
        "noIsolation",
        "inert",
        "allowPinchZoom",
        "as",
        "gapMode"
    ]);
    var SideCar = sideCar;
    var containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$useMergeRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMergeRefs"])([
        ref,
        parentRef
    ]);
    var containerProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, rest), callbacks);
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], null, enabled && __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](SideCar, {
        sideCar: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$medium$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["effectCar"],
        removeScrollBar: removeScrollBar,
        shards: shards,
        noRelative: noRelative,
        noIsolation: noIsolation,
        inert: inert,
        setCallbacks: setCallbacks,
        allowPinchZoom: !!allowPinchZoom,
        lockRef: ref,
        gapMode: gapMode
    }), forwardProps ? __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"](__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].only(children), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, containerProps), {
        ref: containerRef
    })) : __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](Container, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, containerProps, {
        className: className,
        ref: containerRef
    }), children));
});
RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
};
RemoveScroll.classNames = {
    fullWidth: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fullWidthClassName"],
    zeroRight: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zeroRightClassName"]
};
;
}),
"[project]/Demo-2/node_modules/use-sidecar/dist/es2015/exports.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exportSidecar",
    ()=>exportSidecar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
var SideCar = function(_a) {
    var sideCar = _a.sideCar, rest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__rest"])(_a, [
        "sideCar"
    ]);
    if (!sideCar) {
        throw new Error('Sidecar: please provide `sideCar` property to import the right car');
    }
    var Target = sideCar.read();
    if (!Target) {
        throw new Error('Sidecar medium not found');
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](Target, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, rest));
};
SideCar.isSideCarExport = true;
function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar;
}
}),
"[project]/Demo-2/node_modules/get-nonce/dist/es2015/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNonce",
    ()=>getNonce,
    "setNonce",
    ()=>setNonce
]);
var currentNonce;
var setNonce = function(nonce) {
    currentNonce = nonce;
};
var getNonce = function() {
    if (currentNonce) {
        return currentNonce;
    }
    if (typeof __webpack_nonce__ !== 'undefined') {
        return __webpack_nonce__;
    }
    return undefined;
};
}),
"[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/singleton.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stylesheetSingleton",
    ()=>stylesheetSingleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$get$2d$nonce$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/get-nonce/dist/es2015/index.js [app-client] (ecmascript)");
;
function makeStyleTag() {
    if (!document) return null;
    var tag = document.createElement('style');
    tag.type = 'text/css';
    var nonce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$get$2d$nonce$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNonce"])();
    if (nonce) {
        tag.setAttribute('nonce', nonce);
    }
    return tag;
}
function injectStyles(tag, css) {
    // @ts-ignore
    if (tag.styleSheet) {
        // @ts-ignore
        tag.styleSheet.cssText = css;
    } else {
        tag.appendChild(document.createTextNode(css));
    }
}
function insertStyleTag(tag) {
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(tag);
}
var stylesheetSingleton = function() {
    var counter = 0;
    var stylesheet = null;
    return {
        add: function(style) {
            if (counter == 0) {
                if (stylesheet = makeStyleTag()) {
                    injectStyles(stylesheet, style);
                    insertStyleTag(stylesheet);
                }
            }
            counter++;
        },
        remove: function() {
            counter--;
            if (!counter && stylesheet) {
                stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
                stylesheet = null;
            }
        }
    };
};
}),
"[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/hook.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "styleHookSingleton",
    ()=>styleHookSingleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$singleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/singleton.js [app-client] (ecmascript)");
;
;
var styleHookSingleton = function() {
    var sheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$singleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stylesheetSingleton"])();
    return function(styles, isDynamic) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
            "styleHookSingleton.useEffect": function() {
                sheet.add(styles);
                return ({
                    "styleHookSingleton.useEffect": function() {
                        sheet.remove();
                    }
                })["styleHookSingleton.useEffect"];
            }
        }["styleHookSingleton.useEffect"], [
            styles && isDynamic
        ]);
    };
};
}),
"[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/component.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "styleSingleton",
    ()=>styleSingleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$hook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/hook.js [app-client] (ecmascript)");
;
var styleSingleton = function() {
    var useStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$hook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["styleHookSingleton"])();
    var Sheet = function(_a) {
        var styles = _a.styles, dynamic = _a.dynamic;
        useStyle(styles, dynamic);
        return null;
    };
    return Sheet;
};
}),
"[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$singleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/singleton.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$hook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/hook.js [app-client] (ecmascript)");
;
;
;
}),
"[project]/Demo-2/node_modules/react-remove-scroll-bar/dist/es2015/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getGapWidth",
    ()=>getGapWidth,
    "zeroGap",
    ()=>zeroGap
]);
var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
};
var parse = function(x) {
    return parseInt(x || '', 10) || 0;
};
var getOffset = function(gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === 'padding' ? 'paddingLeft' : 'marginLeft'];
    var top = cs[gapMode === 'padding' ? 'paddingTop' : 'marginTop'];
    var right = cs[gapMode === 'padding' ? 'paddingRight' : 'marginRight'];
    return [
        parse(left),
        parse(top),
        parse(right)
    ];
};
var getGapWidth = function(gapMode) {
    if (gapMode === void 0) {
        gapMode = 'margin';
    }
    if (typeof window === 'undefined') {
        return zeroGap;
    }
    var offsets = getOffset(gapMode);
    var documentWidth = document.documentElement.clientWidth;
    var windowWidth = window.innerWidth;
    return {
        left: offsets[0],
        top: offsets[1],
        right: offsets[2],
        gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
    };
};
}),
"[project]/Demo-2/node_modules/react-remove-scroll-bar/dist/es2015/component.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RemoveScrollBar",
    ()=>RemoveScrollBar,
    "lockAttribute",
    ()=>lockAttribute,
    "useLockAttribute",
    ()=>useLockAttribute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll-bar/dist/es2015/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll-bar/dist/es2015/utils.js [app-client] (ecmascript)");
;
;
;
;
var Style = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["styleSingleton"])();
var lockAttribute = 'data-scroll-locked';
// important tip - once we measure scrollBar width and remove them
// we could not repeat this operation
// thus we are using style-singleton - only the first "yet correct" style will be applied.
var getStyles = function(_a, allowRelative, gapMode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapMode === void 0) {
        gapMode = 'margin';
    }
    return "\n  .".concat(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noScrollbarsClassName"], " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
        allowRelative && "position: relative ".concat(important, ";"),
        gapMode === 'margin' && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
        gapMode === 'padding' && "padding-right: ".concat(gap, "px ").concat(important, ";")
    ].filter(Boolean).join(''), "\n  }\n  \n  .").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zeroRightClassName"], " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fullWidthClassName"], " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zeroRightClassName"], " .").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zeroRightClassName"], " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fullWidthClassName"], " .").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fullWidthClassName"], " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removedBarSizeVariable"], ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function() {
    var counter = parseInt(document.body.getAttribute(lockAttribute) || '0', 10);
    return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function() {
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useLockAttribute.useEffect": function() {
            document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
            return ({
                "useLockAttribute.useEffect": function() {
                    var newCounter = getCurrentUseCounter() - 1;
                    if (newCounter <= 0) {
                        document.body.removeAttribute(lockAttribute);
                    } else {
                        document.body.setAttribute(lockAttribute, newCounter.toString());
                    }
                }
            })["useLockAttribute.useEffect"];
        }
    }["useLockAttribute.useEffect"], []);
};
var RemoveScrollBar = function(_a) {
    var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? 'margin' : _b;
    useLockAttribute();
    /*
     gap will be measured on every component mount
     however it will be used only by the "first" invocation
     due to singleton nature of <Style
     */ var gap = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "RemoveScrollBar.useMemo[gap]": function() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGapWidth"])(gapMode);
        }
    }["RemoveScrollBar.useMemo[gap]"], [
        gapMode
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](Style, {
        styles: getStyles(gap, !noRelative, gapMode, !noImportant ? '!important' : '')
    });
};
}),
"[project]/Demo-2/node_modules/react-remove-scroll-bar/dist/es2015/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll-bar/dist/es2015/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll-bar/dist/es2015/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll-bar/dist/es2015/utils.js [app-client] (ecmascript)");
;
;
;
;
}),
"[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "nonPassive",
    ()=>nonPassive
]);
var passiveSupported = false;
if (typeof window !== 'undefined') {
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function() {
                passiveSupported = true;
                return true;
            }
        });
        // @ts-ignore
        window.addEventListener('test', options, options);
        // @ts-ignore
        window.removeEventListener('test', options, options);
    } catch (err) {
        passiveSupported = false;
    }
}
var nonPassive = passiveSupported ? {
    passive: false
} : false;
}),
"[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/handleScroll.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "handleScroll",
    ()=>handleScroll,
    "locationCouldBeScrolled",
    ()=>locationCouldBeScrolled
]);
var alwaysContainsScroll = function(node) {
    // textarea will always _contain_ scroll inside self. It only can be hidden
    return node.tagName === 'TEXTAREA';
};
var elementCanBeScrolled = function(node, overflow) {
    if (!(node instanceof Element)) {
        return false;
    }
    var styles = window.getComputedStyle(node);
    return(// not-not-scrollable
    styles[overflow] !== 'hidden' && // contains scroll inside self
    !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === 'visible'));
};
var elementCouldBeVScrolled = function(node) {
    return elementCanBeScrolled(node, 'overflowY');
};
var elementCouldBeHScrolled = function(node) {
    return elementCanBeScrolled(node, 'overflowX');
};
var locationCouldBeScrolled = function(axis, node) {
    var ownerDocument = node.ownerDocument;
    var current = node;
    do {
        // Skip over shadow root
        if (typeof ShadowRoot !== 'undefined' && current instanceof ShadowRoot) {
            current = current.host;
        }
        var isScrollable = elementCouldBeScrolled(axis, current);
        if (isScrollable) {
            var _a = getScrollVariables(axis, current), scrollHeight = _a[1], clientHeight = _a[2];
            if (scrollHeight > clientHeight) {
                return true;
            }
        }
        current = current.parentNode;
    }while (current && current !== ownerDocument.body)
    return false;
};
var getVScrollVariables = function(_a) {
    var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
    return [
        scrollTop,
        scrollHeight,
        clientHeight
    ];
};
var getHScrollVariables = function(_a) {
    var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
    return [
        scrollLeft,
        scrollWidth,
        clientWidth
    ];
};
var elementCouldBeScrolled = function(axis, node) {
    return axis === 'v' ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function(axis, node) {
    return axis === 'v' ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function(axis, direction) {
    /**
     * If the element's direction is rtl (right-to-left), then scrollLeft is 0 when the scrollbar is at its rightmost position,
     * and then increasingly negative as you scroll towards the end of the content.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
     */ return axis === 'h' && direction === 'rtl' ? -1 : 1;
};
var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
    var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
    var delta = directionFactor * sourceDelta;
    // find scrollable target
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
        if (!target) {
            break;
        }
        var _a = getScrollVariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
        var elementScroll = scroll_1 - capacity - directionFactor * position;
        if (position || elementScroll) {
            if (elementCouldBeScrolled(axis, target)) {
                availableScroll += elementScroll;
                availableScrollTop += position;
            }
        }
        var parent_1 = target.parentNode;
        // we will "bubble" from ShadowDom in case we are, or just to the parent in normal case
        // this is the same logic used in focus-lock
        target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
    }while (// portaled content
    !targetInLock && target !== document.body || targetInLock && (endTarget.contains(target) || endTarget === target))
    // handle epsilon around 0 (non standard zoom levels)
    if (isDeltaPositive && (noOverscroll && Math.abs(availableScroll) < 1 || !noOverscroll && delta > availableScroll)) {
        shouldCancelScroll = true;
    } else if (!isDeltaPositive && (noOverscroll && Math.abs(availableScrollTop) < 1 || !noOverscroll && -delta > availableScrollTop)) {
        shouldCancelScroll = true;
    }
    return shouldCancelScroll;
};
}),
"[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/SideEffect.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RemoveScrollSideCar",
    ()=>RemoveScrollSideCar,
    "getDeltaXY",
    ()=>getDeltaXY,
    "getTouchXY",
    ()=>getTouchXY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll-bar/dist/es2015/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll-bar/dist/es2015/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-style-singleton/dist/es2015/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$handleScroll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/handleScroll.js [app-client] (ecmascript)");
;
;
;
;
;
;
var getTouchXY = function(event) {
    return 'changedTouches' in event ? [
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY
    ] : [
        0,
        0
    ];
};
var getDeltaXY = function(event) {
    return [
        event.deltaX,
        event.deltaY
    ];
};
var extractRef = function(ref) {
    return ref && 'current' in ref ? ref.current : ref;
};
var deltaCompare = function(x, y) {
    return x[0] === y[0] && x[1] === y[1];
};
var generateStyle = function(id) {
    return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
};
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
    var shouldPreventQueue = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]([]);
    var touchStartRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]([
        0,
        0
    ]);
    var activeAxis = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]();
    var id = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](idCounter++)[0];
    var Style = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["styleSingleton"])[0];
    var lastProps = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](props);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "RemoveScrollSideCar.useEffect": function() {
            lastProps.current = props;
        }
    }["RemoveScrollSideCar.useEffect"], [
        props
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "RemoveScrollSideCar.useEffect": function() {
            if (props.inert) {
                document.body.classList.add("block-interactivity-".concat(id));
                var allow_1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__spreadArray"])([
                    props.lockRef.current
                ], (props.shards || []).map(extractRef), true).filter(Boolean);
                allow_1.forEach({
                    "RemoveScrollSideCar.useEffect": function(el) {
                        return el.classList.add("allow-interactivity-".concat(id));
                    }
                }["RemoveScrollSideCar.useEffect"]);
                return ({
                    "RemoveScrollSideCar.useEffect": function() {
                        document.body.classList.remove("block-interactivity-".concat(id));
                        allow_1.forEach({
                            "RemoveScrollSideCar.useEffect": function(el) {
                                return el.classList.remove("allow-interactivity-".concat(id));
                            }
                        }["RemoveScrollSideCar.useEffect"]);
                    }
                })["RemoveScrollSideCar.useEffect"];
            }
            return;
        }
    }["RemoveScrollSideCar.useEffect"], [
        props.inert,
        props.lockRef.current,
        props.shards
    ]);
    var shouldCancelEvent = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "RemoveScrollSideCar.useCallback[shouldCancelEvent]": function(event, parent) {
            if ('touches' in event && event.touches.length === 2 || event.type === 'wheel' && event.ctrlKey) {
                return !lastProps.current.allowPinchZoom;
            }
            var touch = getTouchXY(event);
            var touchStart = touchStartRef.current;
            var deltaX = 'deltaX' in event ? event.deltaX : touchStart[0] - touch[0];
            var deltaY = 'deltaY' in event ? event.deltaY : touchStart[1] - touch[1];
            var currentAxis;
            var target = event.target;
            var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'h' : 'v';
            // allow horizontal touch move on Range inputs. They will not cause any scroll
            if ('touches' in event && moveDirection === 'h' && target.type === 'range') {
                return false;
            }
            // allow drag selection (iOS); check if selection's anchorNode is the same as target or contains target
            var selection = window.getSelection();
            var anchorNode = selection && selection.anchorNode;
            var isTouchingSelection = anchorNode ? anchorNode === target || anchorNode.contains(target) : false;
            if (isTouchingSelection) {
                return false;
            }
            var canBeScrolledInMainDirection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$handleScroll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locationCouldBeScrolled"])(moveDirection, target);
            if (!canBeScrolledInMainDirection) {
                return true;
            }
            if (canBeScrolledInMainDirection) {
                currentAxis = moveDirection;
            } else {
                currentAxis = moveDirection === 'v' ? 'h' : 'v';
                canBeScrolledInMainDirection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$handleScroll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locationCouldBeScrolled"])(moveDirection, target);
            // other axis might be not scrollable
            }
            if (!canBeScrolledInMainDirection) {
                return false;
            }
            if (!activeAxis.current && 'changedTouches' in event && (deltaX || deltaY)) {
                activeAxis.current = currentAxis;
            }
            if (!currentAxis) {
                return true;
            }
            var cancelingAxis = activeAxis.current || currentAxis;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$handleScroll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleScroll"])(cancelingAxis, parent, event, cancelingAxis === 'h' ? deltaX : deltaY, true);
        }
    }["RemoveScrollSideCar.useCallback[shouldCancelEvent]"], []);
    var shouldPrevent = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "RemoveScrollSideCar.useCallback[shouldPrevent]": function(_event) {
            var event = _event;
            if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) {
                // not the last active
                return;
            }
            var delta = 'deltaY' in event ? getDeltaXY(event) : getTouchXY(event);
            var sourceEvent = shouldPreventQueue.current.filter({
                "RemoveScrollSideCar.useCallback[shouldPrevent]": function(e) {
                    return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
                }
            }["RemoveScrollSideCar.useCallback[shouldPrevent]"])[0];
            // self event, and should be canceled
            if (sourceEvent && sourceEvent.should) {
                if (event.cancelable) {
                    event.preventDefault();
                }
                return;
            }
            // outside or shard event
            if (!sourceEvent) {
                var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter({
                    "RemoveScrollSideCar.useCallback[shouldPrevent].shardNodes": function(node) {
                        return node.contains(event.target);
                    }
                }["RemoveScrollSideCar.useCallback[shouldPrevent].shardNodes"]);
                var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
                if (shouldStop) {
                    if (event.cancelable) {
                        event.preventDefault();
                    }
                }
            }
        }
    }["RemoveScrollSideCar.useCallback[shouldPrevent]"], []);
    var shouldCancel = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "RemoveScrollSideCar.useCallback[shouldCancel]": function(name, delta, target, should) {
            var event = {
                name: name,
                delta: delta,
                target: target,
                should: should,
                shadowParent: getOutermostShadowParent(target)
            };
            shouldPreventQueue.current.push(event);
            setTimeout({
                "RemoveScrollSideCar.useCallback[shouldCancel]": function() {
                    shouldPreventQueue.current = shouldPreventQueue.current.filter({
                        "RemoveScrollSideCar.useCallback[shouldCancel]": function(e) {
                            return e !== event;
                        }
                    }["RemoveScrollSideCar.useCallback[shouldCancel]"]);
                }
            }["RemoveScrollSideCar.useCallback[shouldCancel]"], 1);
        }
    }["RemoveScrollSideCar.useCallback[shouldCancel]"], []);
    var scrollTouchStart = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "RemoveScrollSideCar.useCallback[scrollTouchStart]": function(event) {
            touchStartRef.current = getTouchXY(event);
            activeAxis.current = undefined;
        }
    }["RemoveScrollSideCar.useCallback[scrollTouchStart]"], []);
    var scrollWheel = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "RemoveScrollSideCar.useCallback[scrollWheel]": function(event) {
            shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
        }
    }["RemoveScrollSideCar.useCallback[scrollWheel]"], []);
    var scrollTouchMove = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "RemoveScrollSideCar.useCallback[scrollTouchMove]": function(event) {
            shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
        }
    }["RemoveScrollSideCar.useCallback[scrollTouchMove]"], []);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "RemoveScrollSideCar.useEffect": function() {
            lockStack.push(Style);
            props.setCallbacks({
                onScrollCapture: scrollWheel,
                onWheelCapture: scrollWheel,
                onTouchMoveCapture: scrollTouchMove
            });
            document.addEventListener('wheel', shouldPrevent, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nonPassive"]);
            document.addEventListener('touchmove', shouldPrevent, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nonPassive"]);
            document.addEventListener('touchstart', scrollTouchStart, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nonPassive"]);
            return ({
                "RemoveScrollSideCar.useEffect": function() {
                    lockStack = lockStack.filter({
                        "RemoveScrollSideCar.useEffect": function(inst) {
                            return inst !== Style;
                        }
                    }["RemoveScrollSideCar.useEffect"]);
                    document.removeEventListener('wheel', shouldPrevent, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nonPassive"]);
                    document.removeEventListener('touchmove', shouldPrevent, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nonPassive"]);
                    document.removeEventListener('touchstart', scrollTouchStart, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nonPassive"]);
                }
            })["RemoveScrollSideCar.useEffect"];
        }
    }["RemoveScrollSideCar.useEffect"], []);
    var removeScrollBar = props.removeScrollBar, inert = props.inert;
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], null, inert ? __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](Style, {
        styles: generateStyle(id)
    }) : null, removeScrollBar ? __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RemoveScrollBar"], {
        noRelative: props.noRelative,
        gapMode: props.gapMode
    }) : null);
}
function getOutermostShadowParent(node) {
    var shadowParent = null;
    while(node !== null){
        if (node instanceof ShadowRoot) {
            shadowParent = node.host;
            node = node.host;
        }
        node = node.parentNode;
    }
    return shadowParent;
}
}),
"[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/sidecar.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$use$2d$sidecar$2f$dist$2f$es2015$2f$exports$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/use-sidecar/dist/es2015/exports.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$SideEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/SideEffect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$medium$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/medium.js [app-client] (ecmascript)");
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$use$2d$sidecar$2f$dist$2f$es2015$2f$exports$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exportSidecar"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$medium$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["effectCar"], __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$SideEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RemoveScrollSideCar"]);
}),
"[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/Combination.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$UI$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/UI.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$sidecar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/sidecar.js [app-client] (ecmascript)");
;
;
;
;
var ReactRemoveScroll = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function(props, ref) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$UI$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RemoveScroll"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, props, {
        ref: ref,
        sideCar: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$sidecar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    }));
});
ReactRemoveScroll.classNames = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$UI$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RemoveScroll"].classNames;
const __TURBOPACK__default__export__ = ReactRemoveScroll;
}),
"[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/Combination.js [app-client] (ecmascript) <export default as RemoveScroll>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RemoveScroll",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$Combination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$Combination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/Combination.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/@radix-ui/react-menu/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Anchor",
    ()=>MenuAnchor,
    "Arrow",
    ()=>MenuArrow,
    "CheckboxItem",
    ()=>MenuCheckboxItem,
    "Content",
    ()=>MenuContent,
    "Group",
    ()=>MenuGroup,
    "Item",
    ()=>MenuItem,
    "ItemIndicator",
    ()=>MenuItemIndicator,
    "Label",
    ()=>MenuLabel,
    "Menu",
    ()=>Menu,
    "MenuAnchor",
    ()=>MenuAnchor,
    "MenuArrow",
    ()=>MenuArrow,
    "MenuCheckboxItem",
    ()=>MenuCheckboxItem,
    "MenuContent",
    ()=>MenuContent,
    "MenuGroup",
    ()=>MenuGroup,
    "MenuItem",
    ()=>MenuItem,
    "MenuItemIndicator",
    ()=>MenuItemIndicator,
    "MenuLabel",
    ()=>MenuLabel,
    "MenuPortal",
    ()=>MenuPortal,
    "MenuRadioGroup",
    ()=>MenuRadioGroup,
    "MenuRadioItem",
    ()=>MenuRadioItem,
    "MenuSeparator",
    ()=>MenuSeparator,
    "MenuSub",
    ()=>MenuSub,
    "MenuSubContent",
    ()=>MenuSubContent,
    "MenuSubTrigger",
    ()=>MenuSubTrigger,
    "Portal",
    ()=>MenuPortal,
    "RadioGroup",
    ()=>MenuRadioGroup,
    "RadioItem",
    ()=>MenuRadioItem,
    "Root",
    ()=>Menu,
    "Separator",
    ()=>MenuSeparator,
    "Sub",
    ()=>MenuSub,
    "SubContent",
    ()=>MenuSubContent,
    "SubTrigger",
    ()=>MenuSubTrigger,
    "createMenuScope",
    ()=>createMenuScope
]);
// src/menu.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collection$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-collection/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-context/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$direction$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-direction/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dismissable$2d$layer$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$guards$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-focus-guards/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$scope$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-focus-scope/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-id/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popper$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-popper/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$portal$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-portal/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-presence/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$roving$2d$focus$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-roving-focus/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$aria$2d$hidden$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/aria-hidden/dist/es2015/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$Combination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RemoveScroll$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/Combination.js [app-client] (ecmascript) <export default as RemoveScroll>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
var __defProp = Object.defineProperty;
var __name = (target, value)=>__defProp(target, "name", {
        value,
        configurable: true
    });
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
var Direction = {
    LTR: "ltr",
    RTL: "rtl"
};
var SELECTION_KEYS = [
    "Enter",
    " "
];
var FIRST_KEYS = [
    "ArrowDown",
    "PageUp",
    "Home"
];
var LAST_KEYS = [
    "ArrowUp",
    "PageDown",
    "End"
];
var FIRST_LAST_KEYS = [
    ...FIRST_KEYS,
    ...LAST_KEYS
];
var SUB_OPEN_KEYS = {
    ltr: [
        ...SELECTION_KEYS,
        "ArrowRight"
    ],
    rtl: [
        ...SELECTION_KEYS,
        "ArrowLeft"
    ]
};
var SUB_CLOSE_KEYS = {
    ltr: [
        "ArrowLeft"
    ],
    rtl: [
        "ArrowRight"
    ]
};
var MENU_NAME = "Menu";
var [Collection, useCollection, createCollectionScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collection$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCollection"])(MENU_NAME);
var [createMenuContext, createMenuScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextScope"])(MENU_NAME, [
    createCollectionScope,
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popper$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPopperScope"],
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$roving$2d$focus$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRovingFocusGroupScope"]
]);
var usePopperScope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popper$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPopperScope"])();
var useRovingFocusGroupScope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$roving$2d$focus$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRovingFocusGroupScope"])();
var [MenuProvider, useMenuContext] = createMenuContext(MENU_NAME);
var [MenuRootProvider, useMenuRootContext] = createMenuContext(MENU_NAME);
var Menu = /* @__PURE__ */ __name((props)=>{
    const { __scopeMenu, open = false, children, dir, onOpenChange, modal = true } = props;
    const popperScope = usePopperScope(__scopeMenu);
    const [content, setContent] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const isUsingKeyboardRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const handleOpenChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"])(onOpenChange);
    const direction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$direction$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDirection"])(dir);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "Menu.useEffect": ()=>{
            const handleKeyDown = /* @__PURE__ */ __name({
                "Menu.useEffect.handleKeyDown": ()=>{
                    isUsingKeyboardRef.current = true;
                    document.addEventListener("pointerdown", handlePointer, {
                        capture: true,
                        once: true
                    });
                    document.addEventListener("pointermove", handlePointer, {
                        capture: true,
                        once: true
                    });
                }
            }["Menu.useEffect.handleKeyDown"], "handleKeyDown");
            const handlePointer = /* @__PURE__ */ __name({
                "Menu.useEffect.handlePointer": ()=>isUsingKeyboardRef.current = false
            }["Menu.useEffect.handlePointer"], "handlePointer");
            document.addEventListener("keydown", handleKeyDown, {
                capture: true
            });
            return ({
                "Menu.useEffect": ()=>{
                    document.removeEventListener("keydown", handleKeyDown, {
                        capture: true
                    });
                    document.removeEventListener("pointerdown", handlePointer, {
                        capture: true
                    });
                    document.removeEventListener("pointermove", handlePointer, {
                        capture: true
                    });
                }
            })["Menu.useEffect"];
        }
    }["Menu.useEffect"], []);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "Menu.useEffect": ()=>{
            if (!open) {
                return;
            }
            const handleBlur = /* @__PURE__ */ __name({
                "Menu.useEffect.handleBlur": ()=>handleOpenChange(false)
            }["Menu.useEffect.handleBlur"], "handleBlur");
            window.addEventListener("blur", handleBlur);
            return ({
                "Menu.useEffect": ()=>window.removeEventListener("blur", handleBlur)
            })["Menu.useEffect"];
        }
    }["Menu.useEffect"], [
        open,
        handleOpenChange
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popper$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ...popperScope,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuProvider, {
            scope: __scopeMenu,
            open,
            onOpenChange: handleOpenChange,
            content,
            onContentChange: setContent,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuRootProvider, {
                scope: __scopeMenu,
                onClose: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
                    "Menu.useCallback": ()=>handleOpenChange(false)
                }["Menu.useCallback"], [
                    handleOpenChange
                ]),
                isUsingKeyboardRef,
                dir: direction,
                modal,
                children
            })
        })
    });
}, "Menu");
var MenuAnchor = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function MenuAnchor2(props, forwardedRef) {
    const { __scopeMenu, ...anchorProps } = props;
    const popperScope = usePopperScope(__scopeMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popper$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Anchor"], {
        ...popperScope,
        ...anchorProps,
        ref: forwardedRef
    });
}, "MenuAnchor"));
var PORTAL_NAME = "MenuPortal";
var [PortalProvider, usePortalContext] = createMenuContext(PORTAL_NAME, {
    forceMount: void 0
});
var MenuPortal = /* @__PURE__ */ __name((props)=>{
    const { __scopeMenu, forceMount, children, container } = props;
    const context = useMenuContext(PORTAL_NAME, __scopeMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PortalProvider, {
        scope: __scopeMenu,
        forceMount,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Presence"], {
            present: forceMount || context.open,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$portal$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
                asChild: true,
                container,
                children
            })
        })
    });
}, "MenuPortal");
var CONTENT_NAME = "MenuContent";
var [MenuContentProvider, useMenuContentContext] = createMenuContext(CONTENT_NAME);
var MenuContent = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function MenuContent2(props, forwardedRef) {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useMenuContext(CONTENT_NAME, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME, props.__scopeMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.Provider, {
        scope: props.__scopeMenu,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Presence"], {
            present: forceMount || context.open,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.Slot, {
                scope: props.__scopeMenu,
                children: rootContext.modal ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuRootContentModal, {
                    ...contentProps,
                    ref: forwardedRef
                }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuRootContentNonModal, {
                    ...contentProps,
                    ref: forwardedRef
                })
            })
        })
    });
}, "MenuContent"));
var MenuRootContentModal = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function MenuRootContentModal2(props, forwardedRef) {
    const context = useMenuContext(CONTENT_NAME, props.__scopeMenu);
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, ref);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "MenuRootContentModal.MenuRootContentModal2.useEffect": ()=>{
            const content = ref.current;
            if (content) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$aria$2d$hidden$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hideOthers"])(content);
        }
    }["MenuRootContentModal.MenuRootContentModal2.useEffect"], []);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuContentImpl, {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: context.open,
        disableOutsideScroll: true,
        onFocusOutside: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onFocusOutside, (event)=>event.preventDefault(), {
            checkForDefaultPrevented: false
        }),
        onDismiss: ()=>context.onOpenChange(false)
    });
}, "MenuRootContentModal"));
var MenuRootContentNonModal = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function MenuRootContentNonModal2(props, forwardedRef) {
    const context = useMenuContext(CONTENT_NAME, props.__scopeMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuContentImpl, {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        disableOutsideScroll: false,
        onDismiss: ()=>context.onOpenChange(false)
    });
}, "MenuRootContentNonModal"));
var Slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSlot"])("MenuContent.ScrollLock");
var MenuContentImpl = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function MenuContentImpl2(props, forwardedRef) {
    const { __scopeMenu, loop = false, trapFocus, onOpenAutoFocus, onCloseAutoFocus, disableOutsidePointerEvents, onEntryFocus, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, disableOutsideScroll, ...contentProps } = props;
    const context = useMenuContext(CONTENT_NAME, __scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME, __scopeMenu);
    const popperScope = usePopperScope(__scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
    const getItems = useCollection(__scopeMenu);
    const [currentItemId, setCurrentItemId] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const contentRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const [branchNode, setBranchNode] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$scope$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFocusScopeBranch"])(branchNode);
    const { nodes: branchNodes, registry: branchRegistry } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$scope$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFocusScopeBranchRegistry"])();
    const isModal = Boolean(trapFocus || disableOutsideScroll);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, contentRef, context.onContentChange, setBranchNode);
    const timerRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](0);
    const searchRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]("");
    const pointerGraceTimerRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](0);
    const pointerGraceIntentRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const pointerDirRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]("right");
    const lastPointerXRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](0);
    const shards = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "MenuContentImpl.MenuContentImpl2.useMemo[shards]": ()=>disableOutsideScroll ? [
                contentRef,
                ...branchNodes.map({
                    "MenuContentImpl.MenuContentImpl2.useMemo[shards]": (node)=>({
                            current: node
                        })
                }["MenuContentImpl.MenuContentImpl2.useMemo[shards]"])
            ] : []
    }["MenuContentImpl.MenuContentImpl2.useMemo[shards]"], [
        contentRef,
        branchNodes,
        disableOutsideScroll
    ]);
    const ScrollLockWrapper = disableOutsideScroll ? __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$Combination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RemoveScroll$3e$__["RemoveScroll"] : __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"];
    const scrollLockWrapperProps = disableOutsideScroll ? {
        as: Slot,
        allowPinchZoom: true,
        shards
    } : void 0;
    const handleTypeaheadSearch = /* @__PURE__ */ __name((key)=>{
        const search = searchRef.current + key;
        const items = getItems().filter((item)=>!item.disabled);
        const currentItem = document.activeElement;
        const currentMatch = items.find((item)=>item.ref.current === currentItem)?.textValue;
        const values = items.map((item)=>item.textValue);
        const nextMatch = getNextMatch(values, search, currentMatch);
        const newItem = items.find((item)=>item.textValue === nextMatch)?.ref.current;
        function updateSearch(value) {
            searchRef.current = value;
            window.clearTimeout(timerRef.current);
            if (value !== "") timerRef.current = window.setTimeout(()=>updateSearch(""), 1e3);
        }
        __name(updateSearch, "updateSearch");
        updateSearch(search);
        if (newItem) {
            setTimeout(()=>newItem.focus());
        }
    }, "handleTypeaheadSearch");
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "MenuContentImpl.MenuContentImpl2.useEffect": ()=>{
            return ({
                "MenuContentImpl.MenuContentImpl2.useEffect": ()=>window.clearTimeout(timerRef.current)
            })["MenuContentImpl.MenuContentImpl2.useEffect"];
        }
    }["MenuContentImpl.MenuContentImpl2.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$guards$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFocusGuards"])();
    const isPointerMovingToSubmenu = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "MenuContentImpl.MenuContentImpl2.useCallback[isPointerMovingToSubmenu]": (event)=>{
            const isMovingTowards = pointerDirRef.current === pointerGraceIntentRef.current?.side;
            return isMovingTowards && isPointerInGraceArea(event, pointerGraceIntentRef.current?.area);
        }
    }["MenuContentImpl.MenuContentImpl2.useCallback[isPointerMovingToSubmenu]"], []);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuContentProvider, {
        scope: __scopeMenu,
        searchRef,
        onItemEnter: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "MenuContentImpl.MenuContentImpl2.useCallback": (event)=>{
                if (isPointerMovingToSubmenu(event)) event.preventDefault();
            }
        }["MenuContentImpl.MenuContentImpl2.useCallback"], [
            isPointerMovingToSubmenu
        ]),
        onItemLeave: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "MenuContentImpl.MenuContentImpl2.useCallback": (event)=>{
                if (isPointerMovingToSubmenu(event)) return;
                contentRef.current?.focus();
                setCurrentItemId(null);
            }
        }["MenuContentImpl.MenuContentImpl2.useCallback"], [
            isPointerMovingToSubmenu
        ]),
        onTriggerLeave: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "MenuContentImpl.MenuContentImpl2.useCallback": (event)=>{
                if (isPointerMovingToSubmenu(event)) event.preventDefault();
            }
        }["MenuContentImpl.MenuContentImpl2.useCallback"], [
            isPointerMovingToSubmenu
        ]),
        pointerGraceTimerRef,
        onPointerGraceIntentChange: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "MenuContentImpl.MenuContentImpl2.useCallback": (intent)=>{
                pointerGraceIntentRef.current = intent;
            }
        }["MenuContentImpl.MenuContentImpl2.useCallback"], []),
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$scope$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FocusScopeBranchProvider"], {
            registry: isModal ? branchRegistry : null,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ScrollLockWrapper, {
                ...scrollLockWrapperProps,
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$scope$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FocusScope"], {
                    asChild: true,
                    trapped: trapFocus,
                    branches: branchNodes,
                    onMountAutoFocus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onOpenAutoFocus, (event)=>{
                        event.preventDefault();
                        contentRef.current?.focus({
                            preventScroll: true
                        });
                    }),
                    onUnmountAutoFocus: onCloseAutoFocus,
                    children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dismissable$2d$layer$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DismissableLayer"], {
                        asChild: true,
                        disableOutsidePointerEvents,
                        onEscapeKeyDown,
                        onPointerDownOutside,
                        onFocusOutside,
                        onInteractOutside,
                        onDismiss,
                        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$roving$2d$focus$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
                            asChild: true,
                            ...rovingFocusGroupScope,
                            dir: rootContext.dir,
                            orientation: "vertical",
                            loop,
                            currentTabStopId: currentItemId,
                            onCurrentTabStopIdChange: setCurrentItemId,
                            onEntryFocus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onEntryFocus, (event)=>{
                                if (!rootContext.isUsingKeyboardRef.current) event.preventDefault();
                            }),
                            preventScrollOnEntryFocus: true,
                            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popper$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                                role: "menu",
                                "aria-orientation": "vertical",
                                "data-state": getOpenState(context.open),
                                "data-radix-menu-content": "",
                                dir: rootContext.dir,
                                ...popperScope,
                                ...contentProps,
                                ref: composedRefs,
                                style: {
                                    outline: "none",
                                    ...contentProps.style
                                },
                                onKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(contentProps.onKeyDown, (event)=>{
                                    const target = event.target;
                                    const isKeyDownInside = target.closest("[data-radix-menu-content]") === event.currentTarget;
                                    const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                                    const isCharacterKey = event.key.length === 1;
                                    if (isKeyDownInside) {
                                        if (event.key === "Tab") event.preventDefault();
                                        if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key);
                                    }
                                    const content = contentRef.current;
                                    if (event.target !== content) return;
                                    if (!FIRST_LAST_KEYS.includes(event.key)) return;
                                    event.preventDefault();
                                    const items = getItems().filter((item)=>!item.disabled);
                                    const candidateNodes = items.map((item)=>item.ref.current);
                                    if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
                                    focusFirst(candidateNodes);
                                }),
                                onBlur: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onBlur, (event)=>{
                                    if (!event.currentTarget.contains(event.target)) {
                                        window.clearTimeout(timerRef.current);
                                        searchRef.current = "";
                                    }
                                }),
                                onPointerMove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onPointerMove, whenMouse((event)=>{
                                    const target = event.target;
                                    const pointerXHasChanged = lastPointerXRef.current !== event.clientX;
                                    if (event.currentTarget.contains(target) && pointerXHasChanged) {
                                        const newDir = event.clientX > lastPointerXRef.current ? "right" : "left";
                                        pointerDirRef.current = newDir;
                                        lastPointerXRef.current = event.clientX;
                                    }
                                }))
                            })
                        })
                    })
                })
            })
        })
    });
}, "MenuContentImpl"));
var MenuGroup = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function MenuGroup2(props, forwardedRef) {
    const { __scopeMenu, ...groupProps } = props;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
        role: "group",
        ...groupProps,
        ref: forwardedRef
    });
}, "MenuGroup"));
var MenuLabel = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function MenuLabel2(props, forwardedRef) {
    const { __scopeMenu, ...labelProps } = props;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...labelProps,
        ref: forwardedRef
    });
}, "MenuLabel"));
var ITEM_NAME = "MenuItem";
var ITEM_SELECT = "menu.itemSelect";
var MenuItem = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function MenuItem2(props, forwardedRef) {
    const { disabled = false, onSelect, ...itemProps } = props;
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const rootContext = useMenuRootContext(ITEM_NAME, props.__scopeMenu);
    const contentContext = useMenuContentContext(ITEM_NAME, props.__scopeMenu);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, ref);
    const isPointerDownRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const handleSelect = /* @__PURE__ */ __name(()=>{
        const menuItem = ref.current;
        if (!disabled && menuItem) {
            const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
                bubbles: true,
                cancelable: true
            });
            menuItem.addEventListener(ITEM_SELECT, (event)=>onSelect?.(event), {
                once: true
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatchDiscreteCustomEvent"])(menuItem, itemSelectEvent);
            if (itemSelectEvent.defaultPrevented) {
                isPointerDownRef.current = false;
            } else {
                rootContext.onClose();
            }
        }
    }, "handleSelect");
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuItemImpl, {
        ...itemProps,
        ref: composedRefs,
        disabled,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onClick, handleSelect),
        onPointerDown: (event)=>{
            props.onPointerDown?.(event);
            isPointerDownRef.current = true;
        },
        onPointerUp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onPointerUp, (event)=>{
            if (!isPointerDownRef.current) event.currentTarget?.click();
        }),
        onKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onKeyDown, (event)=>{
            if (disabled || event.target !== event.currentTarget) {
                return;
            }
            const isTypingAhead = contentContext.searchRef.current !== "";
            if (isTypingAhead && event.key === " ") {
                return;
            }
            if (SELECTION_KEYS.includes(event.key)) {
                event.currentTarget.click();
                event.preventDefault();
            }
        })
    });
}, "MenuItem"));
var MenuItemImpl = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function MenuItemImpl2(props, forwardedRef) {
    const { __scopeMenu, disabled = false, textValue, ...itemProps } = props;
    const contentContext = useMenuContentContext(ITEM_NAME, __scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, ref);
    const [isFocused, setIsFocused] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [textContent, setTextContent] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]("");
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "MenuItemImpl.MenuItemImpl2.useEffect": ()=>{
            const menuItem = ref.current;
            if (menuItem) {
                setTextContent((menuItem.textContent ?? "").trim());
            }
        }
    }["MenuItemImpl.MenuItemImpl2.useEffect"], [
        itemProps.children
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.ItemSlot, {
        scope: __scopeMenu,
        disabled,
        textValue: textValue ?? textContent,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$roving$2d$focus$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
            asChild: true,
            ...rovingFocusGroupScope,
            focusable: !disabled,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
                role: "menuitem",
                "data-highlighted": isFocused ? "" : void 0,
                "aria-disabled": disabled || void 0,
                "data-disabled": disabled ? "" : void 0,
                ...itemProps,
                ref: composedRefs,
                onPointerMove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onPointerMove, whenMouse((event)=>{
                    if (disabled) {
                        contentContext.onItemLeave(event);
                    } else {
                        contentContext.onItemEnter(event);
                        if (!event.defaultPrevented) {
                            const item = event.currentTarget;
                            item.focus({
                                preventScroll: true
                            });
                        }
                    }
                })),
                onPointerLeave: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onPointerLeave, whenMouse((event)=>contentContext.onItemLeave(event))),
                onFocus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onFocus, ()=>setIsFocused(true)),
                onBlur: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onBlur, ()=>setIsFocused(false))
            })
        })
    });
}, "MenuItemImpl"));
var MenuCheckboxItem = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function MenuCheckboxItem2(props, forwardedRef) {
    const { checked = false, onCheckedChange, ...checkboxItemProps } = props;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ItemIndicatorProvider, {
        scope: props.__scopeMenu,
        checked,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuItem, {
            role: "menuitemcheckbox",
            "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
            ...checkboxItemProps,
            ref: forwardedRef,
            "data-state": getCheckedState(checked),
            onSelect: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(checkboxItemProps.onSelect, ()=>onCheckedChange?.(isIndeterminate(checked) ? true : !checked), {
                checkForDefaultPrevented: false
            })
        })
    });
}, "MenuCheckboxItem"));
var RADIO_GROUP_NAME = "MenuRadioGroup";
var [RadioGroupProvider, useRadioGroupContext] = createMenuContext(RADIO_GROUP_NAME, {
    value: void 0,
    onValueChange: /* @__PURE__ */ __name(()=>{}, "onValueChange")
});
var MenuRadioGroup = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function MenuRadioGroup2(props, forwardedRef) {
    const { value, onValueChange, ...groupProps } = props;
    const handleValueChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"])(onValueChange);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(RadioGroupProvider, {
        scope: props.__scopeMenu,
        value,
        onValueChange: handleValueChange,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuGroup, {
            ...groupProps,
            ref: forwardedRef
        })
    });
}, "MenuRadioGroup"));
var RADIO_ITEM_NAME = "MenuRadioItem";
var MenuRadioItem = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function MenuRadioItem2(props, forwardedRef) {
    const { value, ...radioItemProps } = props;
    const context = useRadioGroupContext(RADIO_ITEM_NAME, props.__scopeMenu);
    const checked = value === context.value;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ItemIndicatorProvider, {
        scope: props.__scopeMenu,
        checked,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuItem, {
            role: "menuitemradio",
            "aria-checked": checked,
            ...radioItemProps,
            ref: forwardedRef,
            "data-state": getCheckedState(checked),
            onSelect: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(radioItemProps.onSelect, ()=>context.onValueChange?.(value), {
                checkForDefaultPrevented: false
            })
        })
    });
}, "MenuRadioItem"));
var ITEM_INDICATOR_NAME = "MenuItemIndicator";
var [ItemIndicatorProvider, useItemIndicatorContext] = createMenuContext(ITEM_INDICATOR_NAME, {
    checked: false
});
var MenuItemIndicator = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function MenuItemIndicator2(props, forwardedRef) {
    const { __scopeMenu, forceMount, ...itemIndicatorProps } = props;
    const indicatorContext = useItemIndicatorContext(ITEM_INDICATOR_NAME, __scopeMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Presence"], {
        present: forceMount || isIndeterminate(indicatorContext.checked) || indicatorContext.checked === true,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].span, {
            ...itemIndicatorProps,
            ref: forwardedRef,
            "data-state": getCheckedState(indicatorContext.checked)
        })
    });
}, "MenuItemIndicator"));
var MenuSeparator = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function MenuSeparator2(props, forwardedRef) {
    const { __scopeMenu, ...separatorProps } = props;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
        role: "separator",
        "aria-orientation": "horizontal",
        ...separatorProps,
        ref: forwardedRef
    });
}, "MenuSeparator"));
var MenuArrow = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function MenuArrow2(props, forwardedRef) {
    const { __scopeMenu, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popper$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Arrow"], {
        ...popperScope,
        ...arrowProps,
        ref: forwardedRef
    });
}, "MenuArrow"));
var SUB_NAME = "MenuSub";
var [MenuSubProvider, useMenuSubContext] = createMenuContext(SUB_NAME);
var MenuSub = /* @__PURE__ */ __name((props)=>{
    const { __scopeMenu, children, open = false, onOpenChange } = props;
    const parentMenuContext = useMenuContext(SUB_NAME, __scopeMenu);
    const popperScope = usePopperScope(__scopeMenu);
    const [trigger, setTrigger] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [content, setContent] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const handleOpenChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"])(onOpenChange);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "MenuSub.useEffect": ()=>{
            if (parentMenuContext.open === false) handleOpenChange(false);
            return ({
                "MenuSub.useEffect": ()=>handleOpenChange(false)
            })["MenuSub.useEffect"];
        }
    }["MenuSub.useEffect"], [
        parentMenuContext.open,
        handleOpenChange
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popper$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ...popperScope,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuProvider, {
            scope: __scopeMenu,
            open,
            onOpenChange: handleOpenChange,
            content,
            onContentChange: setContent,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuSubProvider, {
                scope: __scopeMenu,
                contentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(),
                triggerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(),
                trigger,
                onTriggerChange: setTrigger,
                children
            })
        })
    });
}, "MenuSub");
var SUB_TRIGGER_NAME = "MenuSubTrigger";
var MenuSubTrigger = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function MenuSubTrigger2(props, forwardedRef) {
    const context = useMenuContext(SUB_TRIGGER_NAME, props.__scopeMenu);
    const rootContext = useMenuRootContext(SUB_TRIGGER_NAME, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_TRIGGER_NAME, props.__scopeMenu);
    const contentContext = useMenuContentContext(SUB_TRIGGER_NAME, props.__scopeMenu);
    const openTimerRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext;
    const scope = {
        __scopeMenu: props.__scopeMenu
    };
    const clearOpenTimer = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "MenuSubTrigger.MenuSubTrigger2.useCallback[clearOpenTimer]": ()=>{
            if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
        }
    }["MenuSubTrigger.MenuSubTrigger2.useCallback[clearOpenTimer]"], []);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "MenuSubTrigger.MenuSubTrigger2.useEffect": ()=>clearOpenTimer
    }["MenuSubTrigger.MenuSubTrigger2.useEffect"], [
        clearOpenTimer
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "MenuSubTrigger.MenuSubTrigger2.useEffect": ()=>{
            const pointerGraceTimer = pointerGraceTimerRef.current;
            return ({
                "MenuSubTrigger.MenuSubTrigger2.useEffect": ()=>{
                    window.clearTimeout(pointerGraceTimer);
                    onPointerGraceIntentChange(null);
                }
            })["MenuSubTrigger.MenuSubTrigger2.useEffect"];
        }
    }["MenuSubTrigger.MenuSubTrigger2.useEffect"], [
        pointerGraceTimerRef,
        onPointerGraceIntentChange
    ]);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, subContext.onTriggerChange);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuAnchor, {
        asChild: true,
        ...scope,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuItemImpl, {
            id: subContext.triggerId,
            "aria-haspopup": "menu",
            "aria-expanded": context.open,
            "aria-controls": context.open ? subContext.contentId : void 0,
            "data-state": getOpenState(context.open),
            ...props,
            ref: composedRefs,
            onClick: (event)=>{
                props.onClick?.(event);
                if (props.disabled || event.defaultPrevented) return;
                event.currentTarget.focus();
                if (!context.open) context.onOpenChange(true);
            },
            onPointerMove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onPointerMove, whenMouse((event)=>{
                contentContext.onItemEnter(event);
                if (event.defaultPrevented) return;
                if (!props.disabled && !context.open && !openTimerRef.current) {
                    contentContext.onPointerGraceIntentChange(null);
                    openTimerRef.current = window.setTimeout(()=>{
                        context.onOpenChange(true);
                        clearOpenTimer();
                    }, 100);
                }
            })),
            onPointerLeave: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onPointerLeave, whenMouse((event)=>{
                clearOpenTimer();
                const contentRect = context.content?.getBoundingClientRect();
                if (contentRect) {
                    const side = context.content?.dataset.side;
                    const rightSide = side === "right";
                    const bleed = rightSide ? -5 : 5;
                    const contentNearEdge = contentRect[rightSide ? "left" : "right"];
                    const contentFarEdge = contentRect[rightSide ? "right" : "left"];
                    contentContext.onPointerGraceIntentChange({
                        area: [
                            // Apply a bleed on clientX to ensure that our exit point is
                            // consistently within polygon bounds
                            {
                                x: event.clientX + bleed,
                                y: event.clientY
                            },
                            {
                                x: contentNearEdge,
                                y: contentRect.top
                            },
                            {
                                x: contentFarEdge,
                                y: contentRect.top
                            },
                            {
                                x: contentFarEdge,
                                y: contentRect.bottom
                            },
                            {
                                x: contentNearEdge,
                                y: contentRect.bottom
                            }
                        ],
                        side
                    });
                    window.clearTimeout(pointerGraceTimerRef.current);
                    pointerGraceTimerRef.current = window.setTimeout(()=>contentContext.onPointerGraceIntentChange(null), 300);
                } else {
                    contentContext.onTriggerLeave(event);
                    if (event.defaultPrevented) return;
                    contentContext.onPointerGraceIntentChange(null);
                }
            })),
            onKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onKeyDown, (event)=>{
                if (props.disabled || event.target !== event.currentTarget) {
                    return;
                }
                const isTypingAhead = contentContext.searchRef.current !== "";
                if (isTypingAhead && event.key === " ") {
                    return;
                }
                if (SUB_OPEN_KEYS[rootContext.dir].includes(event.key)) {
                    context.onOpenChange(true);
                    context.content?.focus();
                    event.preventDefault();
                }
            })
        })
    });
}, "MenuSubTrigger"));
var SUB_CONTENT_NAME = "MenuSubContent";
var MenuSubContent = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function MenuSubContent2(props, forwardedRef) {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, align = "start", ...subContentProps } = props;
    const context = useMenuContext(CONTENT_NAME, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_CONTENT_NAME, props.__scopeMenu);
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, ref);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.Provider, {
        scope: props.__scopeMenu,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Presence"], {
            present: forceMount || context.open,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.Slot, {
                scope: props.__scopeMenu,
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(MenuContentImpl, {
                    id: subContext.contentId,
                    "aria-labelledby": subContext.triggerId,
                    ...subContentProps,
                    ref: composedRefs,
                    align,
                    side: rootContext.dir === Direction.RTL ? "left" : "right",
                    disableOutsidePointerEvents: false,
                    disableOutsideScroll: false,
                    trapFocus: false,
                    onOpenAutoFocus: (event)=>{
                        if (rootContext.isUsingKeyboardRef.current) ref.current?.focus();
                        event.preventDefault();
                    },
                    onCloseAutoFocus: (event)=>event.preventDefault(),
                    onFocusOutside: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onFocusOutside, (event)=>{
                        if (event.target !== subContext.trigger) context.onOpenChange(false);
                    }),
                    onEscapeKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onEscapeKeyDown, (event)=>{
                        rootContext.onClose();
                        event.preventDefault();
                    }),
                    onKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onKeyDown, (event)=>{
                        const isKeyDownInside = event.currentTarget.contains(event.target);
                        const isCloseKey = SUB_CLOSE_KEYS[rootContext.dir].includes(event.key);
                        if (isKeyDownInside && isCloseKey) {
                            context.onOpenChange(false);
                            subContext.trigger?.focus();
                            event.preventDefault();
                        }
                    })
                })
            })
        })
    });
}, "MenuSubContent"));
function getOpenState(open) {
    return open ? "open" : "closed";
}
__name(getOpenState, "getOpenState");
function isIndeterminate(checked) {
    return checked === "indeterminate";
}
__name(isIndeterminate, "isIndeterminate");
function getCheckedState(checked) {
    return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
__name(getCheckedState, "getCheckedState");
function focusFirst(candidates) {
    const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
    for (const candidate of candidates){
        if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
        candidate.focus();
        if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
    }
}
__name(focusFirst, "focusFirst");
function wrapArray(array, startIndex) {
    return array.map((_, index)=>array[(startIndex + index) % array.length]);
}
__name(wrapArray, "wrapArray");
function getNextMatch(values, search, currentMatch) {
    const isRepeated = search.length > 1 && Array.from(search).every((char)=>char === search[0]);
    const normalizedSearch = isRepeated ? search[0] : search;
    const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
    let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
    const excludeCurrentMatch = normalizedSearch.length === 1;
    if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v)=>v !== currentMatch);
    const nextMatch = wrappedValues.find((value)=>value.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
    return nextMatch !== currentMatch ? nextMatch : void 0;
}
__name(getNextMatch, "getNextMatch");
function isPointInPolygon(point, polygon) {
    const { x, y } = point;
    let inside = false;
    for(let i = 0, j = polygon.length - 1; i < polygon.length; j = i++){
        const ii = polygon[i];
        const jj = polygon[j];
        const xi = ii.x;
        const yi = ii.y;
        const xj = jj.x;
        const yj = jj.y;
        const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}
__name(isPointInPolygon, "isPointInPolygon");
function isPointerInGraceArea(event, area) {
    if (!area) return false;
    const cursorPos = {
        x: event.clientX,
        y: event.clientY
    };
    return isPointInPolygon(cursorPos, area);
}
__name(isPointerInGraceArea, "isPointerInGraceArea");
function whenMouse(handler) {
    return (event)=>event.pointerType === "mouse" ? handler(event) : void 0;
}
__name(whenMouse, "whenMouse");
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Demo-2/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Arrow",
    ()=>DropdownMenuArrow,
    "CheckboxItem",
    ()=>DropdownMenuCheckboxItem,
    "Content",
    ()=>DropdownMenuContent,
    "DropdownMenu",
    ()=>DropdownMenu,
    "DropdownMenuArrow",
    ()=>DropdownMenuArrow,
    "DropdownMenuCheckboxItem",
    ()=>DropdownMenuCheckboxItem,
    "DropdownMenuContent",
    ()=>DropdownMenuContent,
    "DropdownMenuGroup",
    ()=>DropdownMenuGroup,
    "DropdownMenuItem",
    ()=>DropdownMenuItem,
    "DropdownMenuItemIndicator",
    ()=>DropdownMenuItemIndicator,
    "DropdownMenuLabel",
    ()=>DropdownMenuLabel,
    "DropdownMenuPortal",
    ()=>DropdownMenuPortal,
    "DropdownMenuRadioGroup",
    ()=>DropdownMenuRadioGroup,
    "DropdownMenuRadioItem",
    ()=>DropdownMenuRadioItem,
    "DropdownMenuSeparator",
    ()=>DropdownMenuSeparator,
    "DropdownMenuSub",
    ()=>DropdownMenuSub,
    "DropdownMenuSubContent",
    ()=>DropdownMenuSubContent,
    "DropdownMenuSubTrigger",
    ()=>DropdownMenuSubTrigger,
    "DropdownMenuTrigger",
    ()=>DropdownMenuTrigger,
    "Group",
    ()=>DropdownMenuGroup,
    "Item",
    ()=>DropdownMenuItem,
    "ItemIndicator",
    ()=>DropdownMenuItemIndicator,
    "Label",
    ()=>DropdownMenuLabel,
    "Portal",
    ()=>DropdownMenuPortal,
    "RadioGroup",
    ()=>DropdownMenuRadioGroup,
    "RadioItem",
    ()=>DropdownMenuRadioItem,
    "Root",
    ()=>DropdownMenu,
    "Separator",
    ()=>DropdownMenuSeparator,
    "Sub",
    ()=>DropdownMenuSub,
    "SubContent",
    ()=>DropdownMenuSubContent,
    "SubTrigger",
    ()=>DropdownMenuSubTrigger,
    "Trigger",
    ()=>DropdownMenuTrigger,
    "createDropdownMenuScope",
    ()=>createDropdownMenuScope
]);
// src/dropdown-menu.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-context/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-id/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
var __defProp = Object.defineProperty;
var __name = (target, value)=>__defProp(target, "name", {
        value,
        configurable: true
    });
;
;
;
;
;
;
;
;
;
;
var DROPDOWN_MENU_NAME = "DropdownMenu";
var [createDropdownMenuContext, createDropdownMenuScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextScope"])(DROPDOWN_MENU_NAME, [
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createMenuScope"]
]);
var useMenuScope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createMenuScope"])();
var [DropdownMenuProvider, useDropdownMenuContext] = createDropdownMenuContext(DROPDOWN_MENU_NAME);
var DropdownMenu = /* @__PURE__ */ __name((props)=>{
    const { __scopeDropdownMenu, children, dir, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    const triggerRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControllableState"])({
        prop: openProp,
        defaultProp: defaultOpen ?? false,
        onChange: onOpenChange,
        caller: DROPDOWN_MENU_NAME
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(DropdownMenuProvider, {
        scope: __scopeDropdownMenu,
        triggerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(),
        triggerRef,
        contentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(),
        open,
        onOpenChange: setOpen,
        onOpenToggle: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "DropdownMenu.useCallback": ()=>setOpen({
                    "DropdownMenu.useCallback": (prevOpen)=>!prevOpen
                }["DropdownMenu.useCallback"])
        }["DropdownMenu.useCallback"], [
            setOpen
        ]),
        modal,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
            ...menuScope,
            open,
            onOpenChange: setOpen,
            dir,
            modal,
            children
        })
    });
}, "DropdownMenu");
var TRIGGER_NAME = "DropdownMenuTrigger";
var DropdownMenuTrigger = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function DropdownMenuTrigger2(props, forwardedRef) {
    const { __scopeDropdownMenu, disabled = false, ...triggerProps } = props;
    const context = useDropdownMenuContext(TRIGGER_NAME, __scopeDropdownMenu);
    const menuScope = useMenuScope(__scopeDropdownMenu);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Anchor"], {
        asChild: true,
        ...menuScope,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
            type: "button",
            id: context.triggerId,
            "aria-haspopup": "menu",
            "aria-expanded": context.open,
            "aria-controls": context.open ? context.contentId : void 0,
            "data-state": context.open ? "open" : "closed",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            ...triggerProps,
            ref: composedRefs,
            onPointerDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onPointerDown, (event)=>{
                if (!disabled && event.button === 0 && event.ctrlKey === false) {
                    context.onOpenToggle();
                    if (!context.open) event.preventDefault();
                }
            }),
            onKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onKeyDown, (event)=>{
                if (disabled) return;
                if ([
                    "Enter",
                    " "
                ].includes(event.key)) context.onOpenToggle();
                if (event.key === "ArrowDown") context.onOpenChange(true);
                if ([
                    "Enter",
                    " ",
                    "ArrowDown"
                ].includes(event.key)) event.preventDefault();
            })
        })
    });
}, "DropdownMenuTrigger"));
var DropdownMenuPortal = /* @__PURE__ */ __name((props)=>{
    const { __scopeDropdownMenu, ...portalProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        ...menuScope,
        ...portalProps
    });
}, "DropdownMenuPortal");
var CONTENT_NAME = "DropdownMenuContent";
var DropdownMenuContent = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function DropdownMenuContent2(props, forwardedRef) {
    const { __scopeDropdownMenu, ...contentProps } = props;
    const context = useDropdownMenuContext(CONTENT_NAME, __scopeDropdownMenu);
    const menuScope = useMenuScope(__scopeDropdownMenu);
    const hasInteractedOutsideRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
        id: context.contentId,
        "aria-labelledby": context.triggerId,
        ...menuScope,
        ...contentProps,
        ref: forwardedRef,
        onCloseAutoFocus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onCloseAutoFocus, (event)=>{
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
            hasInteractedOutsideRef.current = false;
            event.preventDefault();
        }),
        onInteractOutside: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onInteractOutside, (event)=>{
            const originalEvent = event.detail.originalEvent;
            const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
            if (!context.modal || isRightClick) hasInteractedOutsideRef.current = true;
        }),
        style: {
            ...props.style,
            // re-namespace exposed content custom properties
            ...{
                "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
                "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
                "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
                "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
                "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
            }
        }
    });
}, "DropdownMenuContent"));
var DropdownMenuGroup = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function DropdownMenuGroup2(props, forwardedRef) {
    const { __scopeDropdownMenu, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        ...menuScope,
        ...groupProps,
        ref: forwardedRef
    });
}, "DropdownMenuGroup"));
var DropdownMenuLabel = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function DropdownMenuLabel2(props, forwardedRef) {
    const { __scopeDropdownMenu, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        ...menuScope,
        ...labelProps,
        ref: forwardedRef
    });
}, "DropdownMenuLabel"));
var DropdownMenuItem = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function DropdownMenuItem2(props, forwardedRef) {
    const { __scopeDropdownMenu, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ...menuScope,
        ...itemProps,
        ref: forwardedRef
    });
}, "DropdownMenuItem"));
var DropdownMenuCheckboxItem = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function DropdownMenuCheckboxItem2(props, forwardedRef) {
    const { __scopeDropdownMenu, ...checkboxItemProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckboxItem"], {
        ...menuScope,
        ...checkboxItemProps,
        ref: forwardedRef
    });
}, "DropdownMenuCheckboxItem"));
var DropdownMenuRadioGroup = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function DropdownMenuRadioGroup2(props, forwardedRef) {
    const { __scopeDropdownMenu, ...radioGroupProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroup"], {
        ...menuScope,
        ...radioGroupProps,
        ref: forwardedRef
    });
}, "DropdownMenuRadioGroup"));
var DropdownMenuRadioItem = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function DropdownMenuRadioItem2(props, forwardedRef) {
    const { __scopeDropdownMenu, ...radioItemProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioItem"], {
        ...menuScope,
        ...radioItemProps,
        ref: forwardedRef
    });
}, "DropdownMenuRadioItem"));
var DropdownMenuItemIndicator = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function DropdownMenuItemIndicator2(props, forwardedRef) {
    const { __scopeDropdownMenu, ...itemIndicatorProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
        ...menuScope,
        ...itemIndicatorProps,
        ref: forwardedRef
    });
}, "DropdownMenuItemIndicator"));
var DropdownMenuSeparator = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function DropdownMenuSeparator2(props, forwardedRef) {
    const { __scopeDropdownMenu, ...separatorProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ...menuScope,
        ...separatorProps,
        ref: forwardedRef
    });
}, "DropdownMenuSeparator"));
var DropdownMenuArrow = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function DropdownMenuArrow2(props, forwardedRef) {
    const { __scopeDropdownMenu, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Arrow"], {
        ...menuScope,
        ...arrowProps,
        ref: forwardedRef
    });
}, "DropdownMenuArrow"));
var DropdownMenuSub = /* @__PURE__ */ __name((props)=>{
    const { __scopeDropdownMenu, children, open: openProp, onOpenChange, defaultOpen } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControllableState"])({
        prop: openProp,
        defaultProp: defaultOpen ?? false,
        onChange: onOpenChange,
        caller: "DropdownMenuSub"
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sub"], {
        ...menuScope,
        open,
        onOpenChange: setOpen,
        children
    });
}, "DropdownMenuSub");
var DropdownMenuSubTrigger = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function DropdownMenuSubTrigger2(props, forwardedRef) {
    const { __scopeDropdownMenu, ...subTriggerProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubTrigger"], {
        ...menuScope,
        ...subTriggerProps,
        ref: forwardedRef
    });
}, "DropdownMenuSubTrigger"));
var DropdownMenuSubContent = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function DropdownMenuSubContent2(props, forwardedRef) {
    const { __scopeDropdownMenu, ...subContentProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubContent"], {
        ...menuScope,
        ...subContentProps,
        ref: forwardedRef,
        style: {
            ...props.style,
            // re-namespace exposed content custom properties
            ...{
                "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
                "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
                "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
                "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
                "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
            }
        }
    });
}, "DropdownMenuSubContent"));
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Check
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }
    ]
];
const Check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("check", __iconNode);
;
 //# sourceMappingURL=check.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CheckIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronRight
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m9 18 6-6-6-6",
            key: "mthhwq"
        }
    ]
];
const ChevronRight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chevron-right", __iconNode);
;
 //# sourceMappingURL=chevron-right.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRightIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronRightIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Circle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ]
];
const Circle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("circle", __iconNode);
;
 //# sourceMappingURL=circle.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as CircleIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CircleIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Settings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
            key: "1i5ecw"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "3",
            key: "1v7zrd"
        }
    ]
];
const Settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("settings", __iconNode);
;
 //# sourceMappingURL=settings.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Settings",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>User
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
            key: "975kel"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "7",
            r: "4",
            key: "17ys0d"
        }
    ]
];
const User = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("user", __iconNode);
;
 //# sourceMappingURL=user.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "User",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Moon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
            key: "kfwtm"
        }
    ]
];
const Moon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("moon", __iconNode);
;
 //# sourceMappingURL=moon.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Moon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Sun
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "4",
            key: "4exip2"
        }
    ],
    [
        "path",
        {
            d: "M12 2v2",
            key: "tus03m"
        }
    ],
    [
        "path",
        {
            d: "M12 20v2",
            key: "1lh1kg"
        }
    ],
    [
        "path",
        {
            d: "m4.93 4.93 1.41 1.41",
            key: "149t6j"
        }
    ],
    [
        "path",
        {
            d: "m17.66 17.66 1.41 1.41",
            key: "ptbguv"
        }
    ],
    [
        "path",
        {
            d: "M2 12h2",
            key: "1t8f8n"
        }
    ],
    [
        "path",
        {
            d: "M20 12h2",
            key: "1q8mjw"
        }
    ],
    [
        "path",
        {
            d: "m6.34 17.66-1.41 1.41",
            key: "1m8zz5"
        }
    ],
    [
        "path",
        {
            d: "m19.07 4.93-1.41 1.41",
            key: "1shlcs"
        }
    ]
];
const Sun = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("sun", __iconNode);
;
 //# sourceMappingURL=sun.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sun",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>LogOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m16 17 5-5-5-5",
            key: "1bji2h"
        }
    ],
    [
        "path",
        {
            d: "M21 12H9",
            key: "dn1m92"
        }
    ],
    [
        "path",
        {
            d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
            key: "1uf3rs"
        }
    ]
];
const LogOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("log-out", __iconNode);
;
 //# sourceMappingURL=log-out.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogOut",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/image-blur-svg.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * A shared function, used on both client and server, to generate a SVG blur placeholder.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getImageBlurSvg", {
    enumerable: true,
    get: function() {
        return getImageBlurSvg;
    }
});
function getImageBlurSvg({ widthInt, heightInt, blurWidth, blurHeight, blurDataURL, objectFit }) {
    const std = 20;
    const svgWidth = blurWidth ? blurWidth * 40 : widthInt;
    const svgHeight = blurHeight ? blurHeight * 40 : heightInt;
    const viewBox = svgWidth && svgHeight ? `viewBox='0 0 ${svgWidth} ${svgHeight}'` : '';
    const preserveAspectRatio = viewBox ? 'none' : objectFit === 'contain' ? 'xMidYMid' : objectFit === 'cover' ? 'xMidYMid slice' : 'none';
    return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${viewBox}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='${std}'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='${std}'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${preserveAspectRatio}' style='filter: url(%23b);' href='${blurDataURL}'/%3E%3C/svg%3E`;
} //# sourceMappingURL=image-blur-svg.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/image-config.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    VALID_LOADERS: null,
    imageConfigDefault: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    VALID_LOADERS: function() {
        return VALID_LOADERS;
    },
    imageConfigDefault: function() {
        return imageConfigDefault;
    }
});
const VALID_LOADERS = [
    'default',
    'imgix',
    'cloudinary',
    'akamai',
    'custom'
];
const imageConfigDefault = {
    deviceSizes: [
        640,
        750,
        828,
        1080,
        1200,
        1920,
        2048,
        3840
    ],
    imageSizes: [
        32,
        48,
        64,
        96,
        128,
        256,
        384
    ],
    path: '/_next/image',
    loader: 'default',
    loaderFile: '',
    /**
   * @deprecated Use `remotePatterns` instead to protect your application from malicious users.
   */ domains: [],
    disableStaticImages: false,
    minimumCacheTTL: 14400,
    formats: [
        'image/webp'
    ],
    maximumRedirects: 3,
    dangerouslyAllowLocalIP: false,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: `script-src 'none'; frame-src 'none'; sandbox;`,
    contentDispositionType: 'attachment',
    localPatterns: undefined,
    remotePatterns: [],
    qualities: [
        75
    ],
    unoptimized: false
}; //# sourceMappingURL=image-config.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/get-img-props.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getImgProps", {
    enumerable: true,
    get: function() {
        return getImgProps;
    }
});
const _warnonce = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
const _imageblursvg = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/image-blur-svg.js [app-client] (ecmascript)");
const _imageconfig = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/image-config.js [app-client] (ecmascript)");
const VALID_LOADING_VALUES = [
    'lazy',
    'eager',
    undefined
];
// Object-fit values that are not valid background-size values
const INVALID_BACKGROUND_SIZE_VALUES = [
    '-moz-initial',
    'fill',
    'none',
    'scale-down',
    undefined
];
function isStaticRequire(src) {
    return src.default !== undefined;
}
function isStaticImageData(src) {
    return src.src !== undefined;
}
function isStaticImport(src) {
    return !!src && typeof src === 'object' && (isStaticRequire(src) || isStaticImageData(src));
}
const allImgs = new Map();
let perfObserver;
function getInt(x) {
    if (typeof x === 'undefined') {
        return x;
    }
    if (typeof x === 'number') {
        return Number.isFinite(x) ? x : NaN;
    }
    if (typeof x === 'string' && /^[0-9]+$/.test(x)) {
        return parseInt(x, 10);
    }
    return NaN;
}
function getWidths({ deviceSizes, allSizes }, width, sizes) {
    if (sizes) {
        // Find all the "vw" percent sizes used in the sizes prop
        const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
        const percentSizes = [];
        for(let match; match = viewportWidthRe.exec(sizes); match){
            percentSizes.push(parseInt(match[2]));
        }
        if (percentSizes.length) {
            const smallestRatio = Math.min(...percentSizes) * 0.01;
            return {
                widths: allSizes.filter((s)=>s >= deviceSizes[0] * smallestRatio),
                kind: 'w'
            };
        }
        return {
            widths: allSizes,
            kind: 'w'
        };
    }
    if (typeof width !== 'number') {
        return {
            widths: deviceSizes,
            kind: 'w'
        };
    }
    const widths = [
        ...new Set(// > are actually 3x in the green color, but only 1.5x in the red and
        // > blue colors. Showing a 3x resolution image in the app vs a 2x
        // > resolution image will be visually the same, though the 3x image
        // > takes significantly more data. Even true 3x resolution screens are
        // > wasteful as the human eye cannot see that level of detail without
        // > something like a magnifying glass.
        // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
        [
            width,
            width * 2 /*, width * 3*/ 
        ].map((w)=>allSizes.find((p)=>p >= w) || allSizes[allSizes.length - 1]))
    ];
    return {
        widths,
        kind: 'x'
    };
}
function generateImgAttrs({ config, src, unoptimized, width, quality, sizes, loader }) {
    if (unoptimized) {
        return {
            src,
            srcSet: undefined,
            sizes: undefined
        };
    }
    const { widths, kind } = getWidths(config, width, sizes);
    const last = widths.length - 1;
    return {
        sizes: !sizes && kind === 'w' ? '100vw' : sizes,
        srcSet: widths.map((w, i)=>`${loader({
                config,
                src,
                quality,
                width: w
            })} ${kind === 'w' ? w : i + 1}${kind}`).join(', '),
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        src: loader({
            config,
            src,
            quality,
            width: widths[last]
        })
    };
}
function getImgProps({ src, sizes, unoptimized = false, priority = false, preload = false, loading, className, quality, width, height, fill = false, style, overrideSrc, onLoad, onLoadingComplete, placeholder = 'empty', blurDataURL, fetchPriority, decoding = 'async', layout, objectFit, objectPosition, lazyBoundary, lazyRoot, ...rest }, _state) {
    const { imgConf, showAltText, blurComplete, defaultLoader } = _state;
    let config;
    let c = imgConf || _imageconfig.imageConfigDefault;
    if ('allSizes' in c) {
        config = c;
    } else {
        const allSizes = [
            ...c.deviceSizes,
            ...c.imageSizes
        ].sort((a, b)=>a - b);
        const deviceSizes = c.deviceSizes.sort((a, b)=>a - b);
        const qualities = c.qualities?.sort((a, b)=>a - b);
        config = {
            ...c,
            allSizes,
            deviceSizes,
            qualities
        };
    }
    if (typeof defaultLoader === 'undefined') {
        throw Object.defineProperty(new Error('images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config'), "__NEXT_ERROR_CODE", {
            value: "E163",
            enumerable: false,
            configurable: true
        });
    }
    let loader = rest.loader || defaultLoader;
    // Remove property so it's not spread on <img> element
    delete rest.loader;
    delete rest.srcSet;
    // This special value indicates that the user
    // didn't define a "loader" prop or "loader" config.
    const isDefaultLoader = '__next_img_default' in loader;
    if (isDefaultLoader) {
        if (config.loader === 'custom') {
            throw Object.defineProperty(new Error(`Image with src "${src}" is missing "loader" prop.` + `\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader`), "__NEXT_ERROR_CODE", {
                value: "E252",
                enumerable: false,
                configurable: true
            });
        }
    } else {
        // The user defined a "loader" prop or config.
        // Since the config object is internal only, we
        // must not pass it to the user-defined "loader".
        const customImageLoader = loader;
        loader = (obj)=>{
            const { config: _, ...opts } = obj;
            return customImageLoader(opts);
        };
    }
    if (layout) {
        if (layout === 'fill') {
            fill = true;
        }
        const layoutToStyle = {
            intrinsic: {
                maxWidth: '100%',
                height: 'auto'
            },
            responsive: {
                width: '100%',
                height: 'auto'
            }
        };
        const layoutToSizes = {
            responsive: '100vw',
            fill: '100vw'
        };
        const layoutStyle = layoutToStyle[layout];
        if (layoutStyle) {
            style = {
                ...style,
                ...layoutStyle
            };
        }
        const layoutSizes = layoutToSizes[layout];
        if (layoutSizes && !sizes) {
            sizes = layoutSizes;
        }
    }
    let staticSrc = '';
    let widthInt = getInt(width);
    let heightInt = getInt(height);
    let blurWidth;
    let blurHeight;
    if (isStaticImport(src)) {
        const staticImageData = isStaticRequire(src) ? src.default : src;
        if (!staticImageData.src) {
            throw Object.defineProperty(new Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(staticImageData)}`), "__NEXT_ERROR_CODE", {
                value: "E460",
                enumerable: false,
                configurable: true
            });
        }
        if (!staticImageData.height || !staticImageData.width) {
            throw Object.defineProperty(new Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(staticImageData)}`), "__NEXT_ERROR_CODE", {
                value: "E48",
                enumerable: false,
                configurable: true
            });
        }
        blurWidth = staticImageData.blurWidth;
        blurHeight = staticImageData.blurHeight;
        blurDataURL = blurDataURL || staticImageData.blurDataURL;
        staticSrc = staticImageData.src;
        if (!fill) {
            if (!widthInt && !heightInt) {
                widthInt = staticImageData.width;
                heightInt = staticImageData.height;
            } else if (widthInt && !heightInt) {
                const ratio = widthInt / staticImageData.width;
                heightInt = Math.round(staticImageData.height * ratio);
            } else if (!widthInt && heightInt) {
                const ratio = heightInt / staticImageData.height;
                widthInt = Math.round(staticImageData.width * ratio);
            }
        }
    }
    src = typeof src === 'string' ? src : staticSrc;
    let isLazy = !priority && !preload && (loading === 'lazy' || typeof loading === 'undefined');
    if (!src || src.startsWith('data:') || src.startsWith('blob:')) {
        // https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
        unoptimized = true;
        isLazy = false;
    }
    if (config.unoptimized) {
        unoptimized = true;
    }
    if (isDefaultLoader && !config.dangerouslyAllowSVG && src.split('?', 1)[0].endsWith('.svg')) {
        // Special case to make svg serve as-is to avoid proxying
        // through the built-in Image Optimization API.
        unoptimized = true;
    }
    const qualityInt = getInt(quality);
    if ("TURBOPACK compile-time truthy", 1) {
        if (config.output === 'export' && isDefaultLoader && !unoptimized) {
            throw Object.defineProperty(new Error(`Image Optimization using the default loader is not compatible with \`{ output: 'export' }\`.
  Possible solutions:
    - Remove \`{ output: 'export' }\` and run "next start" to run server mode including the Image Optimization API.
    - Configure \`{ images: { unoptimized: true } }\` in \`next.config.js\` to disable the Image Optimization API.
  Read more: https://nextjs.org/docs/messages/export-image-api`), "__NEXT_ERROR_CODE", {
                value: "E500",
                enumerable: false,
                configurable: true
            });
        }
        if (!src) {
            // React doesn't show the stack trace and there's
            // no `src` to help identify which image, so we
            // instead console.error(ref) during mount.
            unoptimized = true;
        } else {
            if (fill) {
                if (width) {
                    throw Object.defineProperty(new Error(`Image with src "${src}" has both "width" and "fill" properties. Only one should be used.`), "__NEXT_ERROR_CODE", {
                        value: "E96",
                        enumerable: false,
                        configurable: true
                    });
                }
                if (height) {
                    throw Object.defineProperty(new Error(`Image with src "${src}" has both "height" and "fill" properties. Only one should be used.`), "__NEXT_ERROR_CODE", {
                        value: "E115",
                        enumerable: false,
                        configurable: true
                    });
                }
                if (style?.position && style.position !== 'absolute') {
                    throw Object.defineProperty(new Error(`Image with src "${src}" has both "fill" and "style.position" properties. Images with "fill" always use position absolute - it cannot be modified.`), "__NEXT_ERROR_CODE", {
                        value: "E216",
                        enumerable: false,
                        configurable: true
                    });
                }
                if (style?.width && style.width !== '100%') {
                    throw Object.defineProperty(new Error(`Image with src "${src}" has both "fill" and "style.width" properties. Images with "fill" always use width 100% - it cannot be modified.`), "__NEXT_ERROR_CODE", {
                        value: "E73",
                        enumerable: false,
                        configurable: true
                    });
                }
                if (style?.height && style.height !== '100%') {
                    throw Object.defineProperty(new Error(`Image with src "${src}" has both "fill" and "style.height" properties. Images with "fill" always use height 100% - it cannot be modified.`), "__NEXT_ERROR_CODE", {
                        value: "E404",
                        enumerable: false,
                        configurable: true
                    });
                }
            } else {
                if (typeof widthInt === 'undefined') {
                    throw Object.defineProperty(new Error(`Image with src "${src}" is missing required "width" property.`), "__NEXT_ERROR_CODE", {
                        value: "E451",
                        enumerable: false,
                        configurable: true
                    });
                } else if (isNaN(widthInt)) {
                    throw Object.defineProperty(new Error(`Image with src "${src}" has invalid "width" property. Expected a numeric value in pixels but received "${width}".`), "__NEXT_ERROR_CODE", {
                        value: "E66",
                        enumerable: false,
                        configurable: true
                    });
                }
                if (typeof heightInt === 'undefined') {
                    throw Object.defineProperty(new Error(`Image with src "${src}" is missing required "height" property.`), "__NEXT_ERROR_CODE", {
                        value: "E397",
                        enumerable: false,
                        configurable: true
                    });
                } else if (isNaN(heightInt)) {
                    throw Object.defineProperty(new Error(`Image with src "${src}" has invalid "height" property. Expected a numeric value in pixels but received "${height}".`), "__NEXT_ERROR_CODE", {
                        value: "E444",
                        enumerable: false,
                        configurable: true
                    });
                }
                // eslint-disable-next-line no-control-regex
                if (/^[\x00-\x20]/.test(src)) {
                    throw Object.defineProperty(new Error(`Image with src "${src}" cannot start with a space or control character. Use src.trimStart() to remove it or encodeURIComponent(src) to keep it.`), "__NEXT_ERROR_CODE", {
                        value: "E176",
                        enumerable: false,
                        configurable: true
                    });
                }
                // eslint-disable-next-line no-control-regex
                if (/[\x00-\x20]$/.test(src)) {
                    throw Object.defineProperty(new Error(`Image with src "${src}" cannot end with a space or control character. Use src.trimEnd() to remove it or encodeURIComponent(src) to keep it.`), "__NEXT_ERROR_CODE", {
                        value: "E21",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
        if (!VALID_LOADING_VALUES.includes(loading)) {
            throw Object.defineProperty(new Error(`Image with src "${src}" has invalid "loading" property. Provided "${loading}" should be one of ${VALID_LOADING_VALUES.map(String).join(',')}.`), "__NEXT_ERROR_CODE", {
                value: "E357",
                enumerable: false,
                configurable: true
            });
        }
        if (priority && loading === 'lazy') {
            throw Object.defineProperty(new Error(`Image with src "${src}" has both "priority" and "loading='lazy'" properties. Only one should be used.`), "__NEXT_ERROR_CODE", {
                value: "E218",
                enumerable: false,
                configurable: true
            });
        }
        if (preload && loading === 'lazy') {
            throw Object.defineProperty(new Error(`Image with src "${src}" has both "preload" and "loading='lazy'" properties. Only one should be used.`), "__NEXT_ERROR_CODE", {
                value: "E803",
                enumerable: false,
                configurable: true
            });
        }
        if (preload && priority) {
            throw Object.defineProperty(new Error(`Image with src "${src}" has both "preload" and "priority" properties. Only "preload" should be used.`), "__NEXT_ERROR_CODE", {
                value: "E802",
                enumerable: false,
                configurable: true
            });
        }
        if (placeholder !== 'empty' && placeholder !== 'blur' && !placeholder.startsWith('data:image/')) {
            throw Object.defineProperty(new Error(`Image with src "${src}" has invalid "placeholder" property "${placeholder}".`), "__NEXT_ERROR_CODE", {
                value: "E431",
                enumerable: false,
                configurable: true
            });
        }
        if (placeholder !== 'empty') {
            if (widthInt && heightInt && widthInt * heightInt < 1600) {
                (0, _warnonce.warnOnce)(`Image with src "${src}" is smaller than 40x40. Consider removing the "placeholder" property to improve performance.`);
            }
        }
        if (qualityInt && config.qualities && !config.qualities.includes(qualityInt)) {
            (0, _warnonce.warnOnce)(`Image with src "${src}" is using quality "${qualityInt}" which is not configured in images.qualities [${config.qualities.join(', ')}]. Please update your config to [${[
                ...config.qualities,
                qualityInt
            ].sort().join(', ')}].` + `\nRead more: https://nextjs.org/docs/messages/next-image-unconfigured-qualities`);
        }
        if (placeholder === 'blur' && !blurDataURL) {
            const VALID_BLUR_EXT = [
                'jpeg',
                'png',
                'webp',
                'avif'
            ] // should match next-image-loader
            ;
            throw Object.defineProperty(new Error(`Image with src "${src}" has "placeholder='blur'" property but is missing the "blurDataURL" property.
        Possible solutions:
          - Add a "blurDataURL" property, the contents should be a small Data URL to represent the image
          - Change the "src" property to a static import with one of the supported file types: ${VALID_BLUR_EXT.join(',')} (animated images not supported)
          - Remove the "placeholder" property, effectively no blur effect
        Read more: https://nextjs.org/docs/messages/placeholder-blur-data-url`), "__NEXT_ERROR_CODE", {
                value: "E371",
                enumerable: false,
                configurable: true
            });
        }
        if ('ref' in rest) {
            (0, _warnonce.warnOnce)(`Image with src "${src}" is using unsupported "ref" property. Consider using the "onLoad" property instead.`);
        }
        if (!unoptimized && !isDefaultLoader) {
            const urlStr = loader({
                config,
                src,
                width: widthInt || 400,
                quality: qualityInt || 75
            });
            let url;
            try {
                url = new URL(urlStr);
            } catch (err) {}
            if (urlStr === src || url && url.pathname === src && !url.search) {
                (0, _warnonce.warnOnce)(`Image with src "${src}" has a "loader" property that does not implement width. Please implement it or use the "unoptimized" property instead.` + `\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader-width`);
            }
        }
        if (onLoadingComplete) {
            (0, _warnonce.warnOnce)(`Image with src "${src}" is using deprecated "onLoadingComplete" property. Please use the "onLoad" property instead.`);
        }
        for (const [legacyKey, legacyValue] of Object.entries({
            layout,
            objectFit,
            objectPosition,
            lazyBoundary,
            lazyRoot
        })){
            if (legacyValue) {
                (0, _warnonce.warnOnce)(`Image with src "${src}" has legacy prop "${legacyKey}". Did you forget to run the codemod?` + `\nRead more: https://nextjs.org/docs/messages/next-image-upgrade-to-13`);
            }
        }
        if (typeof window !== 'undefined' && !perfObserver && window.PerformanceObserver) {
            perfObserver = new PerformanceObserver((entryList)=>{
                for (const entry of entryList.getEntries()){
                    // @ts-ignore - missing "LargestContentfulPaint" class with "element" prop
                    const imgSrc = entry?.element?.src || '';
                    const lcpImage = allImgs.get(imgSrc);
                    if (lcpImage && lcpImage.loading === 'lazy' && lcpImage.placeholder === 'empty' && !lcpImage.src.startsWith('data:') && !lcpImage.src.startsWith('blob:')) {
                        // https://web.dev/lcp/#measure-lcp-in-javascript
                        (0, _warnonce.warnOnce)(`Image with src "${lcpImage.src}" was detected as the Largest Contentful Paint (LCP). Please add the \`loading="eager"\` property if this image is above the fold.` + `\nRead more: https://nextjs.org/docs/app/api-reference/components/image#loading`);
                    }
                }
            });
            try {
                perfObserver.observe({
                    type: 'largest-contentful-paint',
                    buffered: true
                });
            } catch (err) {
                // Log error but don't crash the app
                console.error(err);
            }
        }
    }
    const imgStyle = Object.assign(fill ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit,
        objectPosition
    } : {}, showAltText ? {} : {
        color: 'transparent'
    }, style);
    const backgroundImage = !blurComplete && placeholder !== 'empty' ? placeholder === 'blur' ? `url("data:image/svg+xml;charset=utf-8,${(0, _imageblursvg.getImageBlurSvg)({
        widthInt,
        heightInt,
        blurWidth,
        blurHeight,
        blurDataURL: blurDataURL || '',
        objectFit: imgStyle.objectFit
    })}")` : `url("${placeholder}")` // assume `data:image/`
     : null;
    const backgroundSize = !INVALID_BACKGROUND_SIZE_VALUES.includes(imgStyle.objectFit) ? imgStyle.objectFit : imgStyle.objectFit === 'fill' ? '100% 100%' // the background-size equivalent of `fill`
     : 'cover';
    let placeholderStyle = backgroundImage ? {
        backgroundSize,
        backgroundPosition: imgStyle.objectPosition || '50% 50%',
        backgroundRepeat: 'no-repeat',
        backgroundImage
    } : {};
    if ("TURBOPACK compile-time truthy", 1) {
        if (placeholderStyle.backgroundImage && placeholder === 'blur' && blurDataURL?.startsWith('/')) {
            // During `next dev`, we don't want to generate blur placeholders with webpack
            // because it can delay starting the dev server. Instead, `next-image-loader.js`
            // will inline a special url to lazily generate the blur placeholder at request time.
            placeholderStyle.backgroundImage = `url("${blurDataURL}")`;
        }
    }
    const imgAttributes = generateImgAttrs({
        config,
        src,
        unoptimized,
        width: widthInt,
        quality: qualityInt,
        sizes,
        loader
    });
    const loadingFinal = isLazy ? 'lazy' : loading;
    if ("TURBOPACK compile-time truthy", 1) {
        if (typeof window !== 'undefined') {
            let fullUrl;
            try {
                fullUrl = new URL(imgAttributes.src);
            } catch (e) {
                fullUrl = new URL(imgAttributes.src, window.location.href);
            }
            allImgs.set(fullUrl.href, {
                src,
                loading: loadingFinal,
                placeholder
            });
        }
    }
    const props = {
        ...rest,
        loading: loadingFinal,
        fetchPriority,
        width: widthInt,
        height: heightInt,
        decoding,
        className,
        style: {
            ...imgStyle,
            ...placeholderStyle
        },
        sizes: imgAttributes.sizes,
        srcSet: imgAttributes.srcSet,
        src: overrideSrc || imgAttributes.src
    };
    const meta = {
        unoptimized,
        preload: preload || priority,
        placeholder,
        fill
    };
    return {
        props,
        meta
    };
} //# sourceMappingURL=get-img-props.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/side-effect.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return SideEffect;
    }
});
const _react = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const isServer = typeof window === 'undefined';
const useClientOnlyLayoutEffect = isServer ? ()=>{} : _react.useLayoutEffect;
const useClientOnlyEffect = isServer ? ()=>{} : _react.useEffect;
function SideEffect(props) {
    const { headManager, reduceComponentsToState } = props;
    function emitChange() {
        if (headManager && headManager.mountedInstances) {
            const headElements = _react.Children.toArray(Array.from(headManager.mountedInstances).filter(Boolean));
            headManager.updateHead(reduceComponentsToState(headElements));
        }
    }
    if (isServer) {
        headManager?.mountedInstances?.add(props.children);
        emitChange();
    }
    useClientOnlyLayoutEffect({
        "SideEffect.useClientOnlyLayoutEffect": ()=>{
            headManager?.mountedInstances?.add(props.children);
            return ({
                "SideEffect.useClientOnlyLayoutEffect": ()=>{
                    headManager?.mountedInstances?.delete(props.children);
                }
            })["SideEffect.useClientOnlyLayoutEffect"];
        }
    }["SideEffect.useClientOnlyLayoutEffect"]);
    // We need to call `updateHead` method whenever the `SideEffect` is trigger in all
    // life-cycles: mount, update, unmount. However, if there are multiple `SideEffect`s
    // being rendered, we only trigger the method from the last one.
    // This is ensured by keeping the last unflushed `updateHead` in the `_pendingUpdate`
    // singleton in the layout effect pass, and actually trigger it in the effect pass.
    useClientOnlyLayoutEffect({
        "SideEffect.useClientOnlyLayoutEffect": ()=>{
            if (headManager) {
                headManager._pendingUpdate = emitChange;
            }
            return ({
                "SideEffect.useClientOnlyLayoutEffect": ()=>{
                    if (headManager) {
                        headManager._pendingUpdate = emitChange;
                    }
                }
            })["SideEffect.useClientOnlyLayoutEffect"];
        }
    }["SideEffect.useClientOnlyLayoutEffect"]);
    useClientOnlyEffect({
        "SideEffect.useClientOnlyEffect": ()=>{
            if (headManager && headManager._pendingUpdate) {
                headManager._pendingUpdate();
                headManager._pendingUpdate = null;
            }
            return ({
                "SideEffect.useClientOnlyEffect": ()=>{
                    if (headManager && headManager._pendingUpdate) {
                        headManager._pendingUpdate();
                        headManager._pendingUpdate = null;
                    }
                }
            })["SideEffect.useClientOnlyEffect"];
        }
    }["SideEffect.useClientOnlyEffect"]);
    return null;
} //# sourceMappingURL=side-effect.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/head.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    defaultHead: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    defaultHead: function() {
        return defaultHead;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/Demo-2/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _interop_require_wildcard = __turbopack_context__.r("[project]/Demo-2/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _sideeffect = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/side-effect.js [app-client] (ecmascript)"));
const _headmanagercontextsharedruntime = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/head-manager-context.shared-runtime.js [app-client] (ecmascript)");
const _warnonce = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
function defaultHead() {
    const head = [
        /*#__PURE__*/ (0, _jsxruntime.jsx)("meta", {
            charSet: "utf-8"
        }, "charset"),
        /*#__PURE__*/ (0, _jsxruntime.jsx)("meta", {
            name: "viewport",
            content: "width=device-width"
        }, "viewport")
    ];
    return head;
}
function onlyReactElement(list, child) {
    // React children can be "string" or "number" in this case we ignore them for backwards compat
    if (typeof child === 'string' || typeof child === 'number') {
        return list;
    }
    // Adds support for React.Fragment
    if (child.type === _react.default.Fragment) {
        return list.concat(_react.default.Children.toArray(child.props.children).reduce((fragmentList, fragmentChild)=>{
            if (typeof fragmentChild === 'string' || typeof fragmentChild === 'number') {
                return fragmentList;
            }
            return fragmentList.concat(fragmentChild);
        }, []));
    }
    return list.concat(child);
}
const METATYPES = [
    'name',
    'httpEquiv',
    'charSet',
    'itemProp'
];
/*
 returns a function for filtering head child elements
 which shouldn't be duplicated, like <title/>
 Also adds support for deduplicated `key` properties
*/ function unique() {
    const keys = new Set();
    const tags = new Set();
    const metaTypes = new Set();
    const metaCategories = {};
    return (h)=>{
        let isUnique = true;
        let hasKey = false;
        if (h.key && typeof h.key !== 'number' && h.key.indexOf('$') > 0) {
            hasKey = true;
            const key = h.key.slice(h.key.indexOf('$') + 1);
            if (keys.has(key)) {
                isUnique = false;
            } else {
                keys.add(key);
            }
        }
        // eslint-disable-next-line default-case
        switch(h.type){
            case 'title':
            case 'base':
                if (tags.has(h.type)) {
                    isUnique = false;
                } else {
                    tags.add(h.type);
                }
                break;
            case 'meta':
                for(let i = 0, len = METATYPES.length; i < len; i++){
                    const metatype = METATYPES[i];
                    if (!h.props.hasOwnProperty(metatype)) continue;
                    if (metatype === 'charSet') {
                        if (metaTypes.has(metatype)) {
                            isUnique = false;
                        } else {
                            metaTypes.add(metatype);
                        }
                    } else {
                        const category = h.props[metatype];
                        const categories = metaCategories[metatype] || new Set();
                        if ((metatype !== 'name' || !hasKey) && categories.has(category)) {
                            isUnique = false;
                        } else {
                            categories.add(category);
                            metaCategories[metatype] = categories;
                        }
                    }
                }
                break;
        }
        return isUnique;
    };
}
/**
 *
 * @param headChildrenElements List of children of <Head>
 */ function reduceComponents(headChildrenElements) {
    return headChildrenElements.reduce(onlyReactElement, []).reverse().concat(defaultHead().reverse()).filter(unique()).reverse().map((c, i)=>{
        const key = c.key || i;
        if ("TURBOPACK compile-time truthy", 1) {
            // omit JSON-LD structured data snippets from the warning
            if (c.type === 'script' && c.props['type'] !== 'application/ld+json') {
                const srcMessage = c.props['src'] ? `<script> tag with src="${c.props['src']}"` : `inline <script>`;
                (0, _warnonce.warnOnce)(`Do not add <script> tags using next/head (see ${srcMessage}). Use next/script instead. \nSee more info here: https://nextjs.org/docs/messages/no-script-tags-in-head-component`);
            } else if (c.type === 'link' && c.props['rel'] === 'stylesheet') {
                (0, _warnonce.warnOnce)(`Do not add stylesheets using next/head (see <link rel="stylesheet"> tag with href="${c.props['href']}"). Use Document instead. \nSee more info here: https://nextjs.org/docs/messages/no-stylesheets-in-head-component`);
            }
        }
        return /*#__PURE__*/ _react.default.cloneElement(c, {
            key
        });
    });
}
/**
 * This component injects elements to `<head>` of your page.
 * To avoid duplicated `tags` in `<head>` you can use the `key` property, which will make sure every tag is only rendered once.
 */ function Head({ children }) {
    const headManager = (0, _react.useContext)(_headmanagercontextsharedruntime.HeadManagerContext);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_sideeffect.default, {
        reduceComponentsToState: reduceComponents,
        headManager: headManager,
        children: children
    });
}
const _default = Head;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=head.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/image-config-context.shared-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImageConfigContext", {
    enumerable: true,
    get: function() {
        return ImageConfigContext;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/Demo-2/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _imageconfig = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/image-config.js [app-client] (ecmascript)");
const ImageConfigContext = _react.default.createContext(_imageconfig.imageConfigDefault);
if ("TURBOPACK compile-time truthy", 1) {
    ImageConfigContext.displayName = 'ImageConfigContext';
} //# sourceMappingURL=image-config-context.shared-runtime.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/router-context.shared-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RouterContext", {
    enumerable: true,
    get: function() {
        return RouterContext;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/Demo-2/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const RouterContext = _react.default.createContext(null);
if ("TURBOPACK compile-time truthy", 1) {
    RouterContext.displayName = 'RouterContext';
} //# sourceMappingURL=router-context.shared-runtime.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/find-closest-quality.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findClosestQuality", {
    enumerable: true,
    get: function() {
        return findClosestQuality;
    }
});
function findClosestQuality(quality, config) {
    const q = quality || 75;
    if (!config?.qualities?.length) {
        return q;
    }
    return config.qualities.reduce((prev, cur)=>Math.abs(cur - q) < Math.abs(prev - q) ? cur : prev, 0);
} //# sourceMappingURL=find-closest-quality.js.map
}),
"[project]/Demo-2/node_modules/next/dist/compiled/picomatch/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
(()=>{
    "use strict";
    var t = {
        170: (t, e, u)=>{
            const n = u(510);
            const isWindows = ()=>{
                if (typeof navigator !== "undefined" && navigator.platform) {
                    const t = navigator.platform.toLowerCase();
                    return t === "win32" || t === "windows";
                }
                if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].platform) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].platform === "win32";
                }
                return false;
            };
            function picomatch(t, e, u = false) {
                if (e && (e.windows === null || e.windows === undefined)) {
                    e = {
                        ...e,
                        windows: isWindows()
                    };
                }
                return n(t, e, u);
            }
            Object.assign(picomatch, n);
            t.exports = picomatch;
        },
        154: (t)=>{
            const e = "\\\\/";
            const u = `[^${e}]`;
            const n = "\\.";
            const o = "\\+";
            const s = "\\?";
            const r = "\\/";
            const a = "(?=.)";
            const i = "[^/]";
            const c = `(?:${r}|$)`;
            const p = `(?:^|${r})`;
            const l = `${n}{1,2}${c}`;
            const f = `(?!${n})`;
            const A = `(?!${p}${l})`;
            const _ = `(?!${n}{0,1}${c})`;
            const R = `(?!${l})`;
            const E = `[^.${r}]`;
            const h = `${i}*?`;
            const g = "/";
            const b = {
                DOT_LITERAL: n,
                PLUS_LITERAL: o,
                QMARK_LITERAL: s,
                SLASH_LITERAL: r,
                ONE_CHAR: a,
                QMARK: i,
                END_ANCHOR: c,
                DOTS_SLASH: l,
                NO_DOT: f,
                NO_DOTS: A,
                NO_DOT_SLASH: _,
                NO_DOTS_SLASH: R,
                QMARK_NO_DOT: E,
                STAR: h,
                START_ANCHOR: p,
                SEP: g
            };
            const C = {
                ...b,
                SLASH_LITERAL: `[${e}]`,
                QMARK: u,
                STAR: `${u}*?`,
                DOTS_SLASH: `${n}{1,2}(?:[${e}]|$)`,
                NO_DOT: `(?!${n})`,
                NO_DOTS: `(?!(?:^|[${e}])${n}{1,2}(?:[${e}]|$))`,
                NO_DOT_SLASH: `(?!${n}{0,1}(?:[${e}]|$))`,
                NO_DOTS_SLASH: `(?!${n}{1,2}(?:[${e}]|$))`,
                QMARK_NO_DOT: `[^.${e}]`,
                START_ANCHOR: `(?:^|[${e}])`,
                END_ANCHOR: `(?:[${e}]|$)`,
                SEP: "\\"
            };
            const y = {
                alnum: "a-zA-Z0-9",
                alpha: "a-zA-Z",
                ascii: "\\x00-\\x7F",
                blank: " \\t",
                cntrl: "\\x00-\\x1F\\x7F",
                digit: "0-9",
                graph: "\\x21-\\x7E",
                lower: "a-z",
                print: "\\x20-\\x7E ",
                punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
                space: " \\t\\r\\n\\v\\f",
                upper: "A-Z",
                word: "A-Za-z0-9_",
                xdigit: "A-Fa-f0-9"
            };
            t.exports = {
                MAX_LENGTH: 1024 * 64,
                POSIX_REGEX_SOURCE: y,
                REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
                REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
                REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
                REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
                REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
                REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
                REPLACEMENTS: {
                    "***": "*",
                    "**/**": "**",
                    "**/**/**": "**"
                },
                CHAR_0: 48,
                CHAR_9: 57,
                CHAR_UPPERCASE_A: 65,
                CHAR_LOWERCASE_A: 97,
                CHAR_UPPERCASE_Z: 90,
                CHAR_LOWERCASE_Z: 122,
                CHAR_LEFT_PARENTHESES: 40,
                CHAR_RIGHT_PARENTHESES: 41,
                CHAR_ASTERISK: 42,
                CHAR_AMPERSAND: 38,
                CHAR_AT: 64,
                CHAR_BACKWARD_SLASH: 92,
                CHAR_CARRIAGE_RETURN: 13,
                CHAR_CIRCUMFLEX_ACCENT: 94,
                CHAR_COLON: 58,
                CHAR_COMMA: 44,
                CHAR_DOT: 46,
                CHAR_DOUBLE_QUOTE: 34,
                CHAR_EQUAL: 61,
                CHAR_EXCLAMATION_MARK: 33,
                CHAR_FORM_FEED: 12,
                CHAR_FORWARD_SLASH: 47,
                CHAR_GRAVE_ACCENT: 96,
                CHAR_HASH: 35,
                CHAR_HYPHEN_MINUS: 45,
                CHAR_LEFT_ANGLE_BRACKET: 60,
                CHAR_LEFT_CURLY_BRACE: 123,
                CHAR_LEFT_SQUARE_BRACKET: 91,
                CHAR_LINE_FEED: 10,
                CHAR_NO_BREAK_SPACE: 160,
                CHAR_PERCENT: 37,
                CHAR_PLUS: 43,
                CHAR_QUESTION_MARK: 63,
                CHAR_RIGHT_ANGLE_BRACKET: 62,
                CHAR_RIGHT_CURLY_BRACE: 125,
                CHAR_RIGHT_SQUARE_BRACKET: 93,
                CHAR_SEMICOLON: 59,
                CHAR_SINGLE_QUOTE: 39,
                CHAR_SPACE: 32,
                CHAR_TAB: 9,
                CHAR_UNDERSCORE: 95,
                CHAR_VERTICAL_LINE: 124,
                CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
                extglobChars (t) {
                    return {
                        "!": {
                            type: "negate",
                            open: "(?:(?!(?:",
                            close: `))${t.STAR})`
                        },
                        "?": {
                            type: "qmark",
                            open: "(?:",
                            close: ")?"
                        },
                        "+": {
                            type: "plus",
                            open: "(?:",
                            close: ")+"
                        },
                        "*": {
                            type: "star",
                            open: "(?:",
                            close: ")*"
                        },
                        "@": {
                            type: "at",
                            open: "(?:",
                            close: ")"
                        }
                    };
                },
                globChars (t) {
                    return t === true ? C : b;
                }
            };
        },
        697: (t, e, u)=>{
            const n = u(154);
            const o = u(96);
            const { MAX_LENGTH: s, POSIX_REGEX_SOURCE: r, REGEX_NON_SPECIAL_CHARS: a, REGEX_SPECIAL_CHARS_BACKREF: i, REPLACEMENTS: c } = n;
            const expandRange = (t, e)=>{
                if (typeof e.expandRange === "function") {
                    return e.expandRange(...t, e);
                }
                t.sort();
                const u = `[${t.join("-")}]`;
                try {
                    new RegExp(u);
                } catch (e) {
                    return t.map((t)=>o.escapeRegex(t)).join("..");
                }
                return u;
            };
            const syntaxError = (t, e)=>`Missing ${t}: "${e}" - use "\\\\${e}" to match literal characters`;
            const parse = (t, e)=>{
                if (typeof t !== "string") {
                    throw new TypeError("Expected a string");
                }
                t = c[t] || t;
                const u = {
                    ...e
                };
                const p = typeof u.maxLength === "number" ? Math.min(s, u.maxLength) : s;
                let l = t.length;
                if (l > p) {
                    throw new SyntaxError(`Input length: ${l}, exceeds maximum allowed length: ${p}`);
                }
                const f = {
                    type: "bos",
                    value: "",
                    output: u.prepend || ""
                };
                const A = [
                    f
                ];
                const _ = u.capture ? "" : "?:";
                const R = n.globChars(u.windows);
                const E = n.extglobChars(R);
                const { DOT_LITERAL: h, PLUS_LITERAL: g, SLASH_LITERAL: b, ONE_CHAR: C, DOTS_SLASH: y, NO_DOT: $, NO_DOT_SLASH: x, NO_DOTS_SLASH: S, QMARK: H, QMARK_NO_DOT: v, STAR: d, START_ANCHOR: L } = R;
                const globstar = (t)=>`(${_}(?:(?!${L}${t.dot ? y : h}).)*?)`;
                const T = u.dot ? "" : $;
                const O = u.dot ? H : v;
                let k = u.bash === true ? globstar(u) : d;
                if (u.capture) {
                    k = `(${k})`;
                }
                if (typeof u.noext === "boolean") {
                    u.noextglob = u.noext;
                }
                const m = {
                    input: t,
                    index: -1,
                    start: 0,
                    dot: u.dot === true,
                    consumed: "",
                    output: "",
                    prefix: "",
                    backtrack: false,
                    negated: false,
                    brackets: 0,
                    braces: 0,
                    parens: 0,
                    quotes: 0,
                    globstar: false,
                    tokens: A
                };
                t = o.removePrefix(t, m);
                l = t.length;
                const w = [];
                const N = [];
                const I = [];
                let B = f;
                let G;
                const eos = ()=>m.index === l - 1;
                const D = m.peek = (e = 1)=>t[m.index + e];
                const M = m.advance = ()=>t[++m.index] || "";
                const remaining = ()=>t.slice(m.index + 1);
                const consume = (t = "", e = 0)=>{
                    m.consumed += t;
                    m.index += e;
                };
                const append = (t)=>{
                    m.output += t.output != null ? t.output : t.value;
                    consume(t.value);
                };
                const negate = ()=>{
                    let t = 1;
                    while(D() === "!" && (D(2) !== "(" || D(3) === "?")){
                        M();
                        m.start++;
                        t++;
                    }
                    if (t % 2 === 0) {
                        return false;
                    }
                    m.negated = true;
                    m.start++;
                    return true;
                };
                const increment = (t)=>{
                    m[t]++;
                    I.push(t);
                };
                const decrement = (t)=>{
                    m[t]--;
                    I.pop();
                };
                const push = (t)=>{
                    if (B.type === "globstar") {
                        const e = m.braces > 0 && (t.type === "comma" || t.type === "brace");
                        const u = t.extglob === true || w.length && (t.type === "pipe" || t.type === "paren");
                        if (t.type !== "slash" && t.type !== "paren" && !e && !u) {
                            m.output = m.output.slice(0, -B.output.length);
                            B.type = "star";
                            B.value = "*";
                            B.output = k;
                            m.output += B.output;
                        }
                    }
                    if (w.length && t.type !== "paren") {
                        w[w.length - 1].inner += t.value;
                    }
                    if (t.value || t.output) append(t);
                    if (B && B.type === "text" && t.type === "text") {
                        B.output = (B.output || B.value) + t.value;
                        B.value += t.value;
                        return;
                    }
                    t.prev = B;
                    A.push(t);
                    B = t;
                };
                const extglobOpen = (t, e)=>{
                    const n = {
                        ...E[e],
                        conditions: 1,
                        inner: ""
                    };
                    n.prev = B;
                    n.parens = m.parens;
                    n.output = m.output;
                    const o = (u.capture ? "(" : "") + n.open;
                    increment("parens");
                    push({
                        type: t,
                        value: e,
                        output: m.output ? "" : C
                    });
                    push({
                        type: "paren",
                        extglob: true,
                        value: M(),
                        output: o
                    });
                    w.push(n);
                };
                const extglobClose = (t)=>{
                    let n = t.close + (u.capture ? ")" : "");
                    let o;
                    if (t.type === "negate") {
                        let s = k;
                        if (t.inner && t.inner.length > 1 && t.inner.includes("/")) {
                            s = globstar(u);
                        }
                        if (s !== k || eos() || /^\)+$/.test(remaining())) {
                            n = t.close = `)$))${s}`;
                        }
                        if (t.inner.includes("*") && (o = remaining()) && /^\.[^\\/.]+$/.test(o)) {
                            const u = parse(o, {
                                ...e,
                                fastpaths: false
                            }).output;
                            n = t.close = `)${u})${s})`;
                        }
                        if (t.prev.type === "bos") {
                            m.negatedExtglob = true;
                        }
                    }
                    push({
                        type: "paren",
                        extglob: true,
                        value: G,
                        output: n
                    });
                    decrement("parens");
                };
                if (u.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(t)) {
                    let n = false;
                    let s = t.replace(i, (t, e, u, o, s, r)=>{
                        if (o === "\\") {
                            n = true;
                            return t;
                        }
                        if (o === "?") {
                            if (e) {
                                return e + o + (s ? H.repeat(s.length) : "");
                            }
                            if (r === 0) {
                                return O + (s ? H.repeat(s.length) : "");
                            }
                            return H.repeat(u.length);
                        }
                        if (o === ".") {
                            return h.repeat(u.length);
                        }
                        if (o === "*") {
                            if (e) {
                                return e + o + (s ? k : "");
                            }
                            return k;
                        }
                        return e ? t : `\\${t}`;
                    });
                    if (n === true) {
                        if (u.unescape === true) {
                            s = s.replace(/\\/g, "");
                        } else {
                            s = s.replace(/\\+/g, (t)=>t.length % 2 === 0 ? "\\\\" : t ? "\\" : "");
                        }
                    }
                    if (s === t && u.contains === true) {
                        m.output = t;
                        return m;
                    }
                    m.output = o.wrapOutput(s, m, e);
                    return m;
                }
                while(!eos()){
                    G = M();
                    if (G === "\0") {
                        continue;
                    }
                    if (G === "\\") {
                        const t = D();
                        if (t === "/" && u.bash !== true) {
                            continue;
                        }
                        if (t === "." || t === ";") {
                            continue;
                        }
                        if (!t) {
                            G += "\\";
                            push({
                                type: "text",
                                value: G
                            });
                            continue;
                        }
                        const e = /^\\+/.exec(remaining());
                        let n = 0;
                        if (e && e[0].length > 2) {
                            n = e[0].length;
                            m.index += n;
                            if (n % 2 !== 0) {
                                G += "\\";
                            }
                        }
                        if (u.unescape === true) {
                            G = M();
                        } else {
                            G += M();
                        }
                        if (m.brackets === 0) {
                            push({
                                type: "text",
                                value: G
                            });
                            continue;
                        }
                    }
                    if (m.brackets > 0 && (G !== "]" || B.value === "[" || B.value === "[^")) {
                        if (u.posix !== false && G === ":") {
                            const t = B.value.slice(1);
                            if (t.includes("[")) {
                                B.posix = true;
                                if (t.includes(":")) {
                                    const t = B.value.lastIndexOf("[");
                                    const e = B.value.slice(0, t);
                                    const u = B.value.slice(t + 2);
                                    const n = r[u];
                                    if (n) {
                                        B.value = e + n;
                                        m.backtrack = true;
                                        M();
                                        if (!f.output && A.indexOf(B) === 1) {
                                            f.output = C;
                                        }
                                        continue;
                                    }
                                }
                            }
                        }
                        if (G === "[" && D() !== ":" || G === "-" && D() === "]") {
                            G = `\\${G}`;
                        }
                        if (G === "]" && (B.value === "[" || B.value === "[^")) {
                            G = `\\${G}`;
                        }
                        if (u.posix === true && G === "!" && B.value === "[") {
                            G = "^";
                        }
                        B.value += G;
                        append({
                            value: G
                        });
                        continue;
                    }
                    if (m.quotes === 1 && G !== '"') {
                        G = o.escapeRegex(G);
                        B.value += G;
                        append({
                            value: G
                        });
                        continue;
                    }
                    if (G === '"') {
                        m.quotes = m.quotes === 1 ? 0 : 1;
                        if (u.keepQuotes === true) {
                            push({
                                type: "text",
                                value: G
                            });
                        }
                        continue;
                    }
                    if (G === "(") {
                        increment("parens");
                        push({
                            type: "paren",
                            value: G
                        });
                        continue;
                    }
                    if (G === ")") {
                        if (m.parens === 0 && u.strictBrackets === true) {
                            throw new SyntaxError(syntaxError("opening", "("));
                        }
                        const t = w[w.length - 1];
                        if (t && m.parens === t.parens + 1) {
                            extglobClose(w.pop());
                            continue;
                        }
                        push({
                            type: "paren",
                            value: G,
                            output: m.parens ? ")" : "\\)"
                        });
                        decrement("parens");
                        continue;
                    }
                    if (G === "[") {
                        if (u.nobracket === true || !remaining().includes("]")) {
                            if (u.nobracket !== true && u.strictBrackets === true) {
                                throw new SyntaxError(syntaxError("closing", "]"));
                            }
                            G = `\\${G}`;
                        } else {
                            increment("brackets");
                        }
                        push({
                            type: "bracket",
                            value: G
                        });
                        continue;
                    }
                    if (G === "]") {
                        if (u.nobracket === true || B && B.type === "bracket" && B.value.length === 1) {
                            push({
                                type: "text",
                                value: G,
                                output: `\\${G}`
                            });
                            continue;
                        }
                        if (m.brackets === 0) {
                            if (u.strictBrackets === true) {
                                throw new SyntaxError(syntaxError("opening", "["));
                            }
                            push({
                                type: "text",
                                value: G,
                                output: `\\${G}`
                            });
                            continue;
                        }
                        decrement("brackets");
                        const t = B.value.slice(1);
                        if (B.posix !== true && t[0] === "^" && !t.includes("/")) {
                            G = `/${G}`;
                        }
                        B.value += G;
                        append({
                            value: G
                        });
                        if (u.literalBrackets === false || o.hasRegexChars(t)) {
                            continue;
                        }
                        const e = o.escapeRegex(B.value);
                        m.output = m.output.slice(0, -B.value.length);
                        if (u.literalBrackets === true) {
                            m.output += e;
                            B.value = e;
                            continue;
                        }
                        B.value = `(${_}${e}|${B.value})`;
                        m.output += B.value;
                        continue;
                    }
                    if (G === "{" && u.nobrace !== true) {
                        increment("braces");
                        const t = {
                            type: "brace",
                            value: G,
                            output: "(",
                            outputIndex: m.output.length,
                            tokensIndex: m.tokens.length
                        };
                        N.push(t);
                        push(t);
                        continue;
                    }
                    if (G === "}") {
                        const t = N[N.length - 1];
                        if (u.nobrace === true || !t) {
                            push({
                                type: "text",
                                value: G,
                                output: G
                            });
                            continue;
                        }
                        let e = ")";
                        if (t.dots === true) {
                            const t = A.slice();
                            const n = [];
                            for(let e = t.length - 1; e >= 0; e--){
                                A.pop();
                                if (t[e].type === "brace") {
                                    break;
                                }
                                if (t[e].type !== "dots") {
                                    n.unshift(t[e].value);
                                }
                            }
                            e = expandRange(n, u);
                            m.backtrack = true;
                        }
                        if (t.comma !== true && t.dots !== true) {
                            const u = m.output.slice(0, t.outputIndex);
                            const n = m.tokens.slice(t.tokensIndex);
                            t.value = t.output = "\\{";
                            G = e = "\\}";
                            m.output = u;
                            for (const t of n){
                                m.output += t.output || t.value;
                            }
                        }
                        push({
                            type: "brace",
                            value: G,
                            output: e
                        });
                        decrement("braces");
                        N.pop();
                        continue;
                    }
                    if (G === "|") {
                        if (w.length > 0) {
                            w[w.length - 1].conditions++;
                        }
                        push({
                            type: "text",
                            value: G
                        });
                        continue;
                    }
                    if (G === ",") {
                        let t = G;
                        const e = N[N.length - 1];
                        if (e && I[I.length - 1] === "braces") {
                            e.comma = true;
                            t = "|";
                        }
                        push({
                            type: "comma",
                            value: G,
                            output: t
                        });
                        continue;
                    }
                    if (G === "/") {
                        if (B.type === "dot" && m.index === m.start + 1) {
                            m.start = m.index + 1;
                            m.consumed = "";
                            m.output = "";
                            A.pop();
                            B = f;
                            continue;
                        }
                        push({
                            type: "slash",
                            value: G,
                            output: b
                        });
                        continue;
                    }
                    if (G === ".") {
                        if (m.braces > 0 && B.type === "dot") {
                            if (B.value === ".") B.output = h;
                            const t = N[N.length - 1];
                            B.type = "dots";
                            B.output += G;
                            B.value += G;
                            t.dots = true;
                            continue;
                        }
                        if (m.braces + m.parens === 0 && B.type !== "bos" && B.type !== "slash") {
                            push({
                                type: "text",
                                value: G,
                                output: h
                            });
                            continue;
                        }
                        push({
                            type: "dot",
                            value: G,
                            output: h
                        });
                        continue;
                    }
                    if (G === "?") {
                        const t = B && B.value === "(";
                        if (!t && u.noextglob !== true && D() === "(" && D(2) !== "?") {
                            extglobOpen("qmark", G);
                            continue;
                        }
                        if (B && B.type === "paren") {
                            const t = D();
                            let e = G;
                            if (B.value === "(" && !/[!=<:]/.test(t) || t === "<" && !/<([!=]|\w+>)/.test(remaining())) {
                                e = `\\${G}`;
                            }
                            push({
                                type: "text",
                                value: G,
                                output: e
                            });
                            continue;
                        }
                        if (u.dot !== true && (B.type === "slash" || B.type === "bos")) {
                            push({
                                type: "qmark",
                                value: G,
                                output: v
                            });
                            continue;
                        }
                        push({
                            type: "qmark",
                            value: G,
                            output: H
                        });
                        continue;
                    }
                    if (G === "!") {
                        if (u.noextglob !== true && D() === "(") {
                            if (D(2) !== "?" || !/[!=<:]/.test(D(3))) {
                                extglobOpen("negate", G);
                                continue;
                            }
                        }
                        if (u.nonegate !== true && m.index === 0) {
                            negate();
                            continue;
                        }
                    }
                    if (G === "+") {
                        if (u.noextglob !== true && D() === "(" && D(2) !== "?") {
                            extglobOpen("plus", G);
                            continue;
                        }
                        if (B && B.value === "(" || u.regex === false) {
                            push({
                                type: "plus",
                                value: G,
                                output: g
                            });
                            continue;
                        }
                        if (B && (B.type === "bracket" || B.type === "paren" || B.type === "brace") || m.parens > 0) {
                            push({
                                type: "plus",
                                value: G
                            });
                            continue;
                        }
                        push({
                            type: "plus",
                            value: g
                        });
                        continue;
                    }
                    if (G === "@") {
                        if (u.noextglob !== true && D() === "(" && D(2) !== "?") {
                            push({
                                type: "at",
                                extglob: true,
                                value: G,
                                output: ""
                            });
                            continue;
                        }
                        push({
                            type: "text",
                            value: G
                        });
                        continue;
                    }
                    if (G !== "*") {
                        if (G === "$" || G === "^") {
                            G = `\\${G}`;
                        }
                        const t = a.exec(remaining());
                        if (t) {
                            G += t[0];
                            m.index += t[0].length;
                        }
                        push({
                            type: "text",
                            value: G
                        });
                        continue;
                    }
                    if (B && (B.type === "globstar" || B.star === true)) {
                        B.type = "star";
                        B.star = true;
                        B.value += G;
                        B.output = k;
                        m.backtrack = true;
                        m.globstar = true;
                        consume(G);
                        continue;
                    }
                    let e = remaining();
                    if (u.noextglob !== true && /^\([^?]/.test(e)) {
                        extglobOpen("star", G);
                        continue;
                    }
                    if (B.type === "star") {
                        if (u.noglobstar === true) {
                            consume(G);
                            continue;
                        }
                        const n = B.prev;
                        const o = n.prev;
                        const s = n.type === "slash" || n.type === "bos";
                        const r = o && (o.type === "star" || o.type === "globstar");
                        if (u.bash === true && (!s || e[0] && e[0] !== "/")) {
                            push({
                                type: "star",
                                value: G,
                                output: ""
                            });
                            continue;
                        }
                        const a = m.braces > 0 && (n.type === "comma" || n.type === "brace");
                        const i = w.length && (n.type === "pipe" || n.type === "paren");
                        if (!s && n.type !== "paren" && !a && !i) {
                            push({
                                type: "star",
                                value: G,
                                output: ""
                            });
                            continue;
                        }
                        while(e.slice(0, 3) === "/**"){
                            const u = t[m.index + 4];
                            if (u && u !== "/") {
                                break;
                            }
                            e = e.slice(3);
                            consume("/**", 3);
                        }
                        if (n.type === "bos" && eos()) {
                            B.type = "globstar";
                            B.value += G;
                            B.output = globstar(u);
                            m.output = B.output;
                            m.globstar = true;
                            consume(G);
                            continue;
                        }
                        if (n.type === "slash" && n.prev.type !== "bos" && !r && eos()) {
                            m.output = m.output.slice(0, -(n.output + B.output).length);
                            n.output = `(?:${n.output}`;
                            B.type = "globstar";
                            B.output = globstar(u) + (u.strictSlashes ? ")" : "|$)");
                            B.value += G;
                            m.globstar = true;
                            m.output += n.output + B.output;
                            consume(G);
                            continue;
                        }
                        if (n.type === "slash" && n.prev.type !== "bos" && e[0] === "/") {
                            const t = e[1] !== void 0 ? "|$" : "";
                            m.output = m.output.slice(0, -(n.output + B.output).length);
                            n.output = `(?:${n.output}`;
                            B.type = "globstar";
                            B.output = `${globstar(u)}${b}|${b}${t})`;
                            B.value += G;
                            m.output += n.output + B.output;
                            m.globstar = true;
                            consume(G + M());
                            push({
                                type: "slash",
                                value: "/",
                                output: ""
                            });
                            continue;
                        }
                        if (n.type === "bos" && e[0] === "/") {
                            B.type = "globstar";
                            B.value += G;
                            B.output = `(?:^|${b}|${globstar(u)}${b})`;
                            m.output = B.output;
                            m.globstar = true;
                            consume(G + M());
                            push({
                                type: "slash",
                                value: "/",
                                output: ""
                            });
                            continue;
                        }
                        m.output = m.output.slice(0, -B.output.length);
                        B.type = "globstar";
                        B.output = globstar(u);
                        B.value += G;
                        m.output += B.output;
                        m.globstar = true;
                        consume(G);
                        continue;
                    }
                    const n = {
                        type: "star",
                        value: G,
                        output: k
                    };
                    if (u.bash === true) {
                        n.output = ".*?";
                        if (B.type === "bos" || B.type === "slash") {
                            n.output = T + n.output;
                        }
                        push(n);
                        continue;
                    }
                    if (B && (B.type === "bracket" || B.type === "paren") && u.regex === true) {
                        n.output = G;
                        push(n);
                        continue;
                    }
                    if (m.index === m.start || B.type === "slash" || B.type === "dot") {
                        if (B.type === "dot") {
                            m.output += x;
                            B.output += x;
                        } else if (u.dot === true) {
                            m.output += S;
                            B.output += S;
                        } else {
                            m.output += T;
                            B.output += T;
                        }
                        if (D() !== "*") {
                            m.output += C;
                            B.output += C;
                        }
                    }
                    push(n);
                }
                while(m.brackets > 0){
                    if (u.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
                    m.output = o.escapeLast(m.output, "[");
                    decrement("brackets");
                }
                while(m.parens > 0){
                    if (u.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
                    m.output = o.escapeLast(m.output, "(");
                    decrement("parens");
                }
                while(m.braces > 0){
                    if (u.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
                    m.output = o.escapeLast(m.output, "{");
                    decrement("braces");
                }
                if (u.strictSlashes !== true && (B.type === "star" || B.type === "bracket")) {
                    push({
                        type: "maybe_slash",
                        value: "",
                        output: `${b}?`
                    });
                }
                if (m.backtrack === true) {
                    m.output = "";
                    for (const t of m.tokens){
                        m.output += t.output != null ? t.output : t.value;
                        if (t.suffix) {
                            m.output += t.suffix;
                        }
                    }
                }
                return m;
            };
            parse.fastpaths = (t, e)=>{
                const u = {
                    ...e
                };
                const r = typeof u.maxLength === "number" ? Math.min(s, u.maxLength) : s;
                const a = t.length;
                if (a > r) {
                    throw new SyntaxError(`Input length: ${a}, exceeds maximum allowed length: ${r}`);
                }
                t = c[t] || t;
                const { DOT_LITERAL: i, SLASH_LITERAL: p, ONE_CHAR: l, DOTS_SLASH: f, NO_DOT: A, NO_DOTS: _, NO_DOTS_SLASH: R, STAR: E, START_ANCHOR: h } = n.globChars(u.windows);
                const g = u.dot ? _ : A;
                const b = u.dot ? R : A;
                const C = u.capture ? "" : "?:";
                const y = {
                    negated: false,
                    prefix: ""
                };
                let $ = u.bash === true ? ".*?" : E;
                if (u.capture) {
                    $ = `(${$})`;
                }
                const globstar = (t)=>{
                    if (t.noglobstar === true) return $;
                    return `(${C}(?:(?!${h}${t.dot ? f : i}).)*?)`;
                };
                const create = (t)=>{
                    switch(t){
                        case "*":
                            return `${g}${l}${$}`;
                        case ".*":
                            return `${i}${l}${$}`;
                        case "*.*":
                            return `${g}${$}${i}${l}${$}`;
                        case "*/*":
                            return `${g}${$}${p}${l}${b}${$}`;
                        case "**":
                            return g + globstar(u);
                        case "**/*":
                            return `(?:${g}${globstar(u)}${p})?${b}${l}${$}`;
                        case "**/*.*":
                            return `(?:${g}${globstar(u)}${p})?${b}${$}${i}${l}${$}`;
                        case "**/.*":
                            return `(?:${g}${globstar(u)}${p})?${i}${l}${$}`;
                        default:
                            {
                                const e = /^(.*?)\.(\w+)$/.exec(t);
                                if (!e) return;
                                const u = create(e[1]);
                                if (!u) return;
                                return u + i + e[2];
                            }
                    }
                };
                const x = o.removePrefix(t, y);
                let S = create(x);
                if (S && u.strictSlashes !== true) {
                    S += `${p}?`;
                }
                return S;
            };
            t.exports = parse;
        },
        510: (t, e, u)=>{
            const n = u(716);
            const o = u(697);
            const s = u(96);
            const r = u(154);
            const isObject = (t)=>t && typeof t === "object" && !Array.isArray(t);
            const picomatch = (t, e, u = false)=>{
                if (Array.isArray(t)) {
                    const n = t.map((t)=>picomatch(t, e, u));
                    const arrayMatcher = (t)=>{
                        for (const e of n){
                            const u = e(t);
                            if (u) return u;
                        }
                        return false;
                    };
                    return arrayMatcher;
                }
                const n = isObject(t) && t.tokens && t.input;
                if (t === "" || typeof t !== "string" && !n) {
                    throw new TypeError("Expected pattern to be a non-empty string");
                }
                const o = e || {};
                const s = o.windows;
                const r = n ? picomatch.compileRe(t, e) : picomatch.makeRe(t, e, false, true);
                const a = r.state;
                delete r.state;
                let isIgnored = ()=>false;
                if (o.ignore) {
                    const t = {
                        ...e,
                        ignore: null,
                        onMatch: null,
                        onResult: null
                    };
                    isIgnored = picomatch(o.ignore, t, u);
                }
                const matcher = (u, n = false)=>{
                    const { isMatch: i, match: c, output: p } = picomatch.test(u, r, e, {
                        glob: t,
                        posix: s
                    });
                    const l = {
                        glob: t,
                        state: a,
                        regex: r,
                        posix: s,
                        input: u,
                        output: p,
                        match: c,
                        isMatch: i
                    };
                    if (typeof o.onResult === "function") {
                        o.onResult(l);
                    }
                    if (i === false) {
                        l.isMatch = false;
                        return n ? l : false;
                    }
                    if (isIgnored(u)) {
                        if (typeof o.onIgnore === "function") {
                            o.onIgnore(l);
                        }
                        l.isMatch = false;
                        return n ? l : false;
                    }
                    if (typeof o.onMatch === "function") {
                        o.onMatch(l);
                    }
                    return n ? l : true;
                };
                if (u) {
                    matcher.state = a;
                }
                return matcher;
            };
            picomatch.test = (t, e, u, { glob: n, posix: o } = {})=>{
                if (typeof t !== "string") {
                    throw new TypeError("Expected input to be a string");
                }
                if (t === "") {
                    return {
                        isMatch: false,
                        output: ""
                    };
                }
                const r = u || {};
                const a = r.format || (o ? s.toPosixSlashes : null);
                let i = t === n;
                let c = i && a ? a(t) : t;
                if (i === false) {
                    c = a ? a(t) : t;
                    i = c === n;
                }
                if (i === false || r.capture === true) {
                    if (r.matchBase === true || r.basename === true) {
                        i = picomatch.matchBase(t, e, u, o);
                    } else {
                        i = e.exec(c);
                    }
                }
                return {
                    isMatch: Boolean(i),
                    match: i,
                    output: c
                };
            };
            picomatch.matchBase = (t, e, u)=>{
                const n = e instanceof RegExp ? e : picomatch.makeRe(e, u);
                return n.test(s.basename(t));
            };
            picomatch.isMatch = (t, e, u)=>picomatch(e, u)(t);
            picomatch.parse = (t, e)=>{
                if (Array.isArray(t)) return t.map((t)=>picomatch.parse(t, e));
                return o(t, {
                    ...e,
                    fastpaths: false
                });
            };
            picomatch.scan = (t, e)=>n(t, e);
            picomatch.compileRe = (t, e, u = false, n = false)=>{
                if (u === true) {
                    return t.output;
                }
                const o = e || {};
                const s = o.contains ? "" : "^";
                const r = o.contains ? "" : "$";
                let a = `${s}(?:${t.output})${r}`;
                if (t && t.negated === true) {
                    a = `^(?!${a}).*$`;
                }
                const i = picomatch.toRegex(a, e);
                if (n === true) {
                    i.state = t;
                }
                return i;
            };
            picomatch.makeRe = (t, e = {}, u = false, n = false)=>{
                if (!t || typeof t !== "string") {
                    throw new TypeError("Expected a non-empty string");
                }
                let s = {
                    negated: false,
                    fastpaths: true
                };
                if (e.fastpaths !== false && (t[0] === "." || t[0] === "*")) {
                    s.output = o.fastpaths(t, e);
                }
                if (!s.output) {
                    s = o(t, e);
                }
                return picomatch.compileRe(s, e, u, n);
            };
            picomatch.toRegex = (t, e)=>{
                try {
                    const u = e || {};
                    return new RegExp(t, u.flags || (u.nocase ? "i" : ""));
                } catch (t) {
                    if (e && e.debug === true) throw t;
                    return /$^/;
                }
            };
            picomatch.constants = r;
            t.exports = picomatch;
        },
        716: (t, e, u)=>{
            const n = u(96);
            const { CHAR_ASTERISK: o, CHAR_AT: s, CHAR_BACKWARD_SLASH: r, CHAR_COMMA: a, CHAR_DOT: i, CHAR_EXCLAMATION_MARK: c, CHAR_FORWARD_SLASH: p, CHAR_LEFT_CURLY_BRACE: l, CHAR_LEFT_PARENTHESES: f, CHAR_LEFT_SQUARE_BRACKET: A, CHAR_PLUS: _, CHAR_QUESTION_MARK: R, CHAR_RIGHT_CURLY_BRACE: E, CHAR_RIGHT_PARENTHESES: h, CHAR_RIGHT_SQUARE_BRACKET: g } = u(154);
            const isPathSeparator = (t)=>t === p || t === r;
            const depth = (t)=>{
                if (t.isPrefix !== true) {
                    t.depth = t.isGlobstar ? Infinity : 1;
                }
            };
            const scan = (t, e)=>{
                const u = e || {};
                const b = t.length - 1;
                const C = u.parts === true || u.scanToEnd === true;
                const y = [];
                const $ = [];
                const x = [];
                let S = t;
                let H = -1;
                let v = 0;
                let d = 0;
                let L = false;
                let T = false;
                let O = false;
                let k = false;
                let m = false;
                let w = false;
                let N = false;
                let I = false;
                let B = false;
                let G = false;
                let D = 0;
                let M;
                let P;
                let K = {
                    value: "",
                    depth: 0,
                    isGlob: false
                };
                const eos = ()=>H >= b;
                const peek = ()=>S.charCodeAt(H + 1);
                const advance = ()=>{
                    M = P;
                    return S.charCodeAt(++H);
                };
                while(H < b){
                    P = advance();
                    let t;
                    if (P === r) {
                        N = K.backslashes = true;
                        P = advance();
                        if (P === l) {
                            w = true;
                        }
                        continue;
                    }
                    if (w === true || P === l) {
                        D++;
                        while(eos() !== true && (P = advance())){
                            if (P === r) {
                                N = K.backslashes = true;
                                advance();
                                continue;
                            }
                            if (P === l) {
                                D++;
                                continue;
                            }
                            if (w !== true && P === i && (P = advance()) === i) {
                                L = K.isBrace = true;
                                O = K.isGlob = true;
                                G = true;
                                if (C === true) {
                                    continue;
                                }
                                break;
                            }
                            if (w !== true && P === a) {
                                L = K.isBrace = true;
                                O = K.isGlob = true;
                                G = true;
                                if (C === true) {
                                    continue;
                                }
                                break;
                            }
                            if (P === E) {
                                D--;
                                if (D === 0) {
                                    w = false;
                                    L = K.isBrace = true;
                                    G = true;
                                    break;
                                }
                            }
                        }
                        if (C === true) {
                            continue;
                        }
                        break;
                    }
                    if (P === p) {
                        y.push(H);
                        $.push(K);
                        K = {
                            value: "",
                            depth: 0,
                            isGlob: false
                        };
                        if (G === true) continue;
                        if (M === i && H === v + 1) {
                            v += 2;
                            continue;
                        }
                        d = H + 1;
                        continue;
                    }
                    if (u.noext !== true) {
                        const t = P === _ || P === s || P === o || P === R || P === c;
                        if (t === true && peek() === f) {
                            O = K.isGlob = true;
                            k = K.isExtglob = true;
                            G = true;
                            if (P === c && H === v) {
                                B = true;
                            }
                            if (C === true) {
                                while(eos() !== true && (P = advance())){
                                    if (P === r) {
                                        N = K.backslashes = true;
                                        P = advance();
                                        continue;
                                    }
                                    if (P === h) {
                                        O = K.isGlob = true;
                                        G = true;
                                        break;
                                    }
                                }
                                continue;
                            }
                            break;
                        }
                    }
                    if (P === o) {
                        if (M === o) m = K.isGlobstar = true;
                        O = K.isGlob = true;
                        G = true;
                        if (C === true) {
                            continue;
                        }
                        break;
                    }
                    if (P === R) {
                        O = K.isGlob = true;
                        G = true;
                        if (C === true) {
                            continue;
                        }
                        break;
                    }
                    if (P === A) {
                        while(eos() !== true && (t = advance())){
                            if (t === r) {
                                N = K.backslashes = true;
                                advance();
                                continue;
                            }
                            if (t === g) {
                                T = K.isBracket = true;
                                O = K.isGlob = true;
                                G = true;
                                break;
                            }
                        }
                        if (C === true) {
                            continue;
                        }
                        break;
                    }
                    if (u.nonegate !== true && P === c && H === v) {
                        I = K.negated = true;
                        v++;
                        continue;
                    }
                    if (u.noparen !== true && P === f) {
                        O = K.isGlob = true;
                        if (C === true) {
                            while(eos() !== true && (P = advance())){
                                if (P === f) {
                                    N = K.backslashes = true;
                                    P = advance();
                                    continue;
                                }
                                if (P === h) {
                                    G = true;
                                    break;
                                }
                            }
                            continue;
                        }
                        break;
                    }
                    if (O === true) {
                        G = true;
                        if (C === true) {
                            continue;
                        }
                        break;
                    }
                }
                if (u.noext === true) {
                    k = false;
                    O = false;
                }
                let U = S;
                let X = "";
                let F = "";
                if (v > 0) {
                    X = S.slice(0, v);
                    S = S.slice(v);
                    d -= v;
                }
                if (U && O === true && d > 0) {
                    U = S.slice(0, d);
                    F = S.slice(d);
                } else if (O === true) {
                    U = "";
                    F = S;
                } else {
                    U = S;
                }
                if (U && U !== "" && U !== "/" && U !== S) {
                    if (isPathSeparator(U.charCodeAt(U.length - 1))) {
                        U = U.slice(0, -1);
                    }
                }
                if (u.unescape === true) {
                    if (F) F = n.removeBackslashes(F);
                    if (U && N === true) {
                        U = n.removeBackslashes(U);
                    }
                }
                const Q = {
                    prefix: X,
                    input: t,
                    start: v,
                    base: U,
                    glob: F,
                    isBrace: L,
                    isBracket: T,
                    isGlob: O,
                    isExtglob: k,
                    isGlobstar: m,
                    negated: I,
                    negatedExtglob: B
                };
                if (u.tokens === true) {
                    Q.maxDepth = 0;
                    if (!isPathSeparator(P)) {
                        $.push(K);
                    }
                    Q.tokens = $;
                }
                if (u.parts === true || u.tokens === true) {
                    let e;
                    for(let n = 0; n < y.length; n++){
                        const o = e ? e + 1 : v;
                        const s = y[n];
                        const r = t.slice(o, s);
                        if (u.tokens) {
                            if (n === 0 && v !== 0) {
                                $[n].isPrefix = true;
                                $[n].value = X;
                            } else {
                                $[n].value = r;
                            }
                            depth($[n]);
                            Q.maxDepth += $[n].depth;
                        }
                        if (n !== 0 || r !== "") {
                            x.push(r);
                        }
                        e = s;
                    }
                    if (e && e + 1 < t.length) {
                        const n = t.slice(e + 1);
                        x.push(n);
                        if (u.tokens) {
                            $[$.length - 1].value = n;
                            depth($[$.length - 1]);
                            Q.maxDepth += $[$.length - 1].depth;
                        }
                    }
                    Q.slashes = y;
                    Q.parts = x;
                }
                return Q;
            };
            t.exports = scan;
        },
        96: (t, e, u)=>{
            const { REGEX_BACKSLASH: n, REGEX_REMOVE_BACKSLASH: o, REGEX_SPECIAL_CHARS: s, REGEX_SPECIAL_CHARS_GLOBAL: r } = u(154);
            e.isObject = (t)=>t !== null && typeof t === "object" && !Array.isArray(t);
            e.hasRegexChars = (t)=>s.test(t);
            e.isRegexChar = (t)=>t.length === 1 && e.hasRegexChars(t);
            e.escapeRegex = (t)=>t.replace(r, "\\$1");
            e.toPosixSlashes = (t)=>t.replace(n, "/");
            e.removeBackslashes = (t)=>t.replace(o, (t)=>t === "\\" ? "" : t);
            e.escapeLast = (t, u, n)=>{
                const o = t.lastIndexOf(u, n);
                if (o === -1) return t;
                if (t[o - 1] === "\\") return e.escapeLast(t, u, o - 1);
                return `${t.slice(0, o)}\\${t.slice(o)}`;
            };
            e.removePrefix = (t, e = {})=>{
                let u = t;
                if (u.startsWith("./")) {
                    u = u.slice(2);
                    e.prefix = "./";
                }
                return u;
            };
            e.wrapOutput = (t, e = {}, u = {})=>{
                const n = u.contains ? "" : "^";
                const o = u.contains ? "" : "$";
                let s = `${n}(?:${t})${o}`;
                if (e.negated === true) {
                    s = `(?:^(?!${s}).*$)`;
                }
                return s;
            };
            e.basename = (t, { windows: e } = {})=>{
                const u = t.split(e ? /[\\/]/ : "/");
                const n = u[u.length - 1];
                if (n === "") {
                    return u[u.length - 2];
                }
                return n;
            };
        }
    };
    var e = {};
    function __nccwpck_require__(u) {
        var n = e[u];
        if (n !== undefined) {
            return n.exports;
        }
        var o = e[u] = {
            exports: {}
        };
        var s = true;
        try {
            t[u](o, o.exports, __nccwpck_require__);
            s = false;
        } finally{
            if (s) delete e[u];
        }
        return o.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/Demo-2/node_modules/next/dist/compiled/picomatch") + "/";
    var u = __nccwpck_require__(170);
    module.exports = u;
})();
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/match-local-pattern.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    hasLocalMatch: null,
    matchLocalPattern: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    hasLocalMatch: function() {
        return hasLocalMatch;
    },
    matchLocalPattern: function() {
        return matchLocalPattern;
    }
});
const _picomatch = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/picomatch/index.js [app-client] (ecmascript)");
function matchLocalPattern(pattern, url) {
    if (pattern.search !== undefined) {
        if (pattern.search !== url.search) {
            return false;
        }
    }
    if (!(0, _picomatch.makeRe)(pattern.pathname ?? '**', {
        dot: true
    }).test(url.pathname)) {
        return false;
    }
    return true;
}
function hasLocalMatch(localPatterns, urlPathAndQuery) {
    if (!localPatterns) {
        // if the user didn't define "localPatterns", we allow all local images
        return true;
    }
    const url = new URL(urlPathAndQuery, 'http://n');
    return localPatterns.some((p)=>matchLocalPattern(p, url));
} //# sourceMappingURL=match-local-pattern.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/match-remote-pattern.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    hasRemoteMatch: null,
    matchRemotePattern: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    hasRemoteMatch: function() {
        return hasRemoteMatch;
    },
    matchRemotePattern: function() {
        return matchRemotePattern;
    }
});
const _picomatch = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/picomatch/index.js [app-client] (ecmascript)");
function matchRemotePattern(pattern, url) {
    if (pattern.protocol !== undefined) {
        if (pattern.protocol.replace(/:$/, '') !== url.protocol.replace(/:$/, '')) {
            return false;
        }
    }
    if (pattern.port !== undefined) {
        if (pattern.port !== url.port) {
            return false;
        }
    }
    if (pattern.hostname === undefined) {
        throw Object.defineProperty(new Error(`Pattern should define hostname but found\n${JSON.stringify(pattern)}`), "__NEXT_ERROR_CODE", {
            value: "E410",
            enumerable: false,
            configurable: true
        });
    } else {
        if (!(0, _picomatch.makeRe)(pattern.hostname).test(url.hostname)) {
            return false;
        }
    }
    if (pattern.search !== undefined) {
        if (pattern.search !== url.search) {
            return false;
        }
    }
    // Should be the same as writeImagesManifest()
    if (!(0, _picomatch.makeRe)(pattern.pathname ?? '**', {
        dot: true
    }).test(url.pathname)) {
        return false;
    }
    return true;
}
function hasRemoteMatch(domains, remotePatterns, url) {
    return domains.some((domain)=>url.hostname === domain) || remotePatterns.some((p)=>matchRemotePattern(p, url));
} //# sourceMappingURL=match-remote-pattern.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/image-loader.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _findclosestquality = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/find-closest-quality.js [app-client] (ecmascript)");
function defaultLoader({ config, src, width, quality }) {
    if (src.startsWith('/') && src.includes('?') && config.localPatterns?.length === 1 && config.localPatterns[0].pathname === '**' && config.localPatterns[0].search === '') {
        throw Object.defineProperty(new Error(`Image with src "${src}" is using a query string which is not configured in images.localPatterns.` + `\nRead more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`), "__NEXT_ERROR_CODE", {
            value: "E871",
            enumerable: false,
            configurable: true
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        const missingValues = [];
        // these should always be provided but make sure they are
        if (!src) missingValues.push('src');
        if (!width) missingValues.push('width');
        if (missingValues.length > 0) {
            throw Object.defineProperty(new Error(`Next Image Optimization requires ${missingValues.join(', ')} to be provided. Make sure you pass them as props to the \`next/image\` component. Received: ${JSON.stringify({
                src,
                width,
                quality
            })}`), "__NEXT_ERROR_CODE", {
                value: "E188",
                enumerable: false,
                configurable: true
            });
        }
        if (src.startsWith('//')) {
            throw Object.defineProperty(new Error(`Failed to parse src "${src}" on \`next/image\`, protocol-relative URL (//) must be changed to an absolute URL (http:// or https://)`), "__NEXT_ERROR_CODE", {
                value: "E360",
                enumerable: false,
                configurable: true
            });
        }
        if (src.startsWith('/') && config.localPatterns) {
            if ("TURBOPACK compile-time truthy", 1) {
                // We use dynamic require because this should only error in development
                const { hasLocalMatch } = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/match-local-pattern.js [app-client] (ecmascript)");
                if (!hasLocalMatch(config.localPatterns, src)) {
                    throw Object.defineProperty(new Error(`Invalid src prop (${src}) on \`next/image\` does not match \`images.localPatterns\` configured in your \`next.config.js\`\n` + `See more info: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`), "__NEXT_ERROR_CODE", {
                        value: "E426",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
        if (!src.startsWith('/') && (config.domains || config.remotePatterns)) {
            let parsedSrc;
            try {
                parsedSrc = new URL(src);
            } catch (err) {
                console.error(err);
                throw Object.defineProperty(new Error(`Failed to parse src "${src}" on \`next/image\`, if using relative image it must start with a leading slash "/" or be an absolute URL (http:// or https://)`), "__NEXT_ERROR_CODE", {
                    value: "E63",
                    enumerable: false,
                    configurable: true
                });
            }
            if ("TURBOPACK compile-time truthy", 1) {
                // We use dynamic require because this should only error in development
                const { hasRemoteMatch } = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/match-remote-pattern.js [app-client] (ecmascript)");
                if (!hasRemoteMatch(config.domains, config.remotePatterns, parsedSrc)) {
                    throw Object.defineProperty(new Error(`Invalid src prop (${src}) on \`next/image\`, hostname "${parsedSrc.hostname}" is not configured under images in your \`next.config.js\`\n` + `See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host`), "__NEXT_ERROR_CODE", {
                        value: "E231",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
    }
    const q = (0, _findclosestquality.findClosestQuality)(quality, config);
    return `${config.path}?url=${encodeURIComponent(src)}&w=${width}&q=${q}${src.startsWith('/_next/static/media/') && ("TURBOPACK compile-time value", false) ? "TURBOPACK unreachable" : ''}`;
}
// We use this to determine if the import is the default loader
// or a custom loader defined by the user in next.config.js
defaultLoader.__next_img_default = true;
const _default = defaultLoader; //# sourceMappingURL=image-loader.js.map
}),
"[project]/Demo-2/node_modules/next/dist/client/image-component.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Image", {
    enumerable: true,
    get: function() {
        return Image;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/Demo-2/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _interop_require_wildcard = __turbopack_context__.r("[project]/Demo-2/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _reactdom = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)"));
const _head = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/head.js [app-client] (ecmascript)"));
const _getimgprops = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/get-img-props.js [app-client] (ecmascript)");
const _imageconfig = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/image-config.js [app-client] (ecmascript)");
const _imageconfigcontextsharedruntime = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/image-config-context.shared-runtime.js [app-client] (ecmascript)");
const _warnonce = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
const _routercontextsharedruntime = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router-context.shared-runtime.js [app-client] (ecmascript)");
const _imageloader = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/image-loader.js [app-client] (ecmascript)"));
const _usemergedref = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)");
// This is replaced by webpack define plugin
const configEnv = ("TURBOPACK compile-time value", {
    "deviceSizes": ("TURBOPACK compile-time value", [
        ("TURBOPACK compile-time value", 640),
        ("TURBOPACK compile-time value", 750),
        ("TURBOPACK compile-time value", 828),
        ("TURBOPACK compile-time value", 1080),
        ("TURBOPACK compile-time value", 1200),
        ("TURBOPACK compile-time value", 1920),
        ("TURBOPACK compile-time value", 2048),
        ("TURBOPACK compile-time value", 3840)
    ]),
    "imageSizes": ("TURBOPACK compile-time value", [
        ("TURBOPACK compile-time value", 32),
        ("TURBOPACK compile-time value", 48),
        ("TURBOPACK compile-time value", 64),
        ("TURBOPACK compile-time value", 96),
        ("TURBOPACK compile-time value", 128),
        ("TURBOPACK compile-time value", 256),
        ("TURBOPACK compile-time value", 384)
    ]),
    "qualities": ("TURBOPACK compile-time value", [
        ("TURBOPACK compile-time value", 75),
        ("TURBOPACK compile-time value", 70)
    ]),
    "path": ("TURBOPACK compile-time value", "/_next/image"),
    "loader": ("TURBOPACK compile-time value", "default"),
    "dangerouslyAllowSVG": ("TURBOPACK compile-time value", false),
    "unoptimized": ("TURBOPACK compile-time value", false),
    "domains": ("TURBOPACK compile-time value", [
        ("TURBOPACK compile-time value", "platefull.com.br")
    ]),
    "remotePatterns": ("TURBOPACK compile-time value", []),
    "localPatterns": ("TURBOPACK compile-time value", [
        ("TURBOPACK compile-time value", {
            "pathname": ("TURBOPACK compile-time value", "**"),
            "search": ("TURBOPACK compile-time value", "")
        })
    ])
});
if (typeof window === 'undefined') {
    ;
    globalThis.__NEXT_IMAGE_IMPORTED = true;
}
// See https://stackoverflow.com/q/39777833/266535 for why we use this ref
// handler instead of the img's onLoad attribute.
function handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized, sizesInput) {
    const src = img?.src;
    if (!img || img['data-loaded-src'] === src) {
        return;
    }
    img['data-loaded-src'] = src;
    const p = 'decode' in img ? img.decode() : Promise.resolve();
    p.catch(()=>{}).then(()=>{
        if (!img.parentElement || !img.isConnected) {
            // Exit early in case of race condition:
            // - onload() is called
            // - decode() is called but incomplete
            // - unmount is called
            // - decode() completes
            return;
        }
        if (placeholder !== 'empty') {
            setBlurComplete(true);
        }
        if (onLoadRef?.current) {
            // Since we don't have the SyntheticEvent here,
            // we must create one with the same shape.
            // See https://reactjs.org/docs/events.html
            const event = new Event('load');
            Object.defineProperty(event, 'target', {
                writable: false,
                value: img
            });
            let prevented = false;
            let stopped = false;
            onLoadRef.current({
                ...event,
                nativeEvent: event,
                currentTarget: img,
                target: img,
                isDefaultPrevented: ()=>prevented,
                isPropagationStopped: ()=>stopped,
                persist: ()=>{},
                preventDefault: ()=>{
                    prevented = true;
                    event.preventDefault();
                },
                stopPropagation: ()=>{
                    stopped = true;
                    event.stopPropagation();
                }
            });
        }
        if (onLoadingCompleteRef?.current) {
            onLoadingCompleteRef.current(img);
        }
        if ("TURBOPACK compile-time truthy", 1) {
            const origSrc = new URL(src, 'http://n').searchParams.get('url') || src;
            if (img.getAttribute('data-nimg') === 'fill') {
                if (!unoptimized && (!sizesInput || sizesInput === '100vw')) {
                    let widthViewportRatio = img.getBoundingClientRect().width / window.innerWidth;
                    if (widthViewportRatio < 0.6) {
                        if (sizesInput === '100vw') {
                            (0, _warnonce.warnOnce)(`Image with src "${origSrc}" has "fill" prop and "sizes" prop of "100vw", but image is not rendered at full viewport width. Please adjust "sizes" to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes`);
                        } else {
                            (0, _warnonce.warnOnce)(`Image with src "${origSrc}" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes`);
                        }
                    }
                }
                if (img.parentElement) {
                    const { position } = window.getComputedStyle(img.parentElement);
                    const valid = [
                        'absolute',
                        'fixed',
                        'relative'
                    ];
                    if (!valid.includes(position)) {
                        (0, _warnonce.warnOnce)(`Image with src "${origSrc}" has "fill" and parent element with invalid "position". Provided "${position}" should be one of ${valid.map(String).join(',')}.`);
                    }
                }
                if (img.height === 0) {
                    (0, _warnonce.warnOnce)(`Image with src "${origSrc}" has "fill" and a height value of 0. This is likely because the parent element of the image has not been styled to have a set height.`);
                }
            }
            const heightModified = img.height.toString() !== img.getAttribute('height');
            const widthModified = img.width.toString() !== img.getAttribute('width');
            if (heightModified && !widthModified || !heightModified && widthModified) {
                (0, _warnonce.warnOnce)(`Image with src "${origSrc}" has either width or height modified, but not the other. If you use CSS to change the size of your image, also include the styles 'width: "auto"' or 'height: "auto"' to maintain the aspect ratio.`);
            }
        }
    });
}
function getDynamicProps(fetchPriority) {
    if (Boolean(_react.use)) {
        // In React 19.0.0 or newer, we must use camelCase
        // prop to avoid "Warning: Invalid DOM property".
        // See https://github.com/facebook/react/pull/25927
        return {
            fetchPriority
        };
    }
    // In React 18.2.0 or older, we must use lowercase prop
    // to avoid "Warning: Invalid DOM property".
    return {
        fetchpriority: fetchPriority
    };
}
const ImageElement = /*#__PURE__*/ (0, _react.forwardRef)(({ src, srcSet, sizes, height, width, decoding, className, style, fetchPriority, placeholder, loading, unoptimized, fill, onLoadRef, onLoadingCompleteRef, setBlurComplete, setShowAltText, sizesInput, onLoad, onError, ...rest }, forwardedRef)=>{
    const ownRef = (0, _react.useCallback)((img)=>{
        if (!img) {
            return;
        }
        if (onError) {
            // If the image has an error before react hydrates, then the error is lost.
            // The workaround is to wait until the image is mounted which is after hydration,
            // then we set the src again to trigger the error handler (if there was an error).
            // eslint-disable-next-line no-self-assign
            img.src = img.src;
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (!src) {
                console.error(`Image is missing required "src" property:`, img);
            }
            if (img.getAttribute('alt') === null) {
                console.error(`Image is missing required "alt" property. Please add Alternative Text to describe the image for screen readers and search engines.`);
            }
        }
        if (img.complete) {
            handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized, sizesInput);
        }
    }, [
        src,
        placeholder,
        onLoadRef,
        onLoadingCompleteRef,
        setBlurComplete,
        onError,
        unoptimized,
        sizesInput
    ]);
    const ref = (0, _usemergedref.useMergedRef)(forwardedRef, ownRef);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("img", {
        ...rest,
        ...getDynamicProps(fetchPriority),
        // It's intended to keep `loading` before `src` because React updates
        // props in order which causes Safari/Firefox to not lazy load properly.
        // See https://github.com/facebook/react/issues/25883
        loading: loading,
        width: width,
        height: height,
        decoding: decoding,
        "data-nimg": fill ? 'fill' : '1',
        className: className,
        style: style,
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        sizes: sizes,
        srcSet: srcSet,
        src: src,
        ref: ref,
        onLoad: (event)=>{
            const img = event.currentTarget;
            handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized, sizesInput);
        },
        onError: (event)=>{
            // if the real image fails to load, this will ensure "alt" is visible
            setShowAltText(true);
            if (placeholder !== 'empty') {
                // If the real image fails to load, this will still remove the placeholder.
                setBlurComplete(true);
            }
            if (onError) {
                onError(event);
            }
        }
    });
});
function ImagePreload({ isAppRouter, imgAttributes }) {
    const opts = {
        as: 'image',
        imageSrcSet: imgAttributes.srcSet,
        imageSizes: imgAttributes.sizes,
        crossOrigin: imgAttributes.crossOrigin,
        referrerPolicy: imgAttributes.referrerPolicy,
        ...getDynamicProps(imgAttributes.fetchPriority)
    };
    if (isAppRouter && _reactdom.default.preload) {
        _reactdom.default.preload(imgAttributes.src, opts);
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_head.default, {
        children: /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
            rel: "preload",
            // Note how we omit the `href` attribute, as it would only be relevant
            // for browsers that do not support `imagesrcset`, and in those cases
            // it would cause the incorrect image to be preloaded.
            //
            // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
            href: imgAttributes.srcSet ? undefined : imgAttributes.src,
            ...opts
        }, '__nimg-' + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes)
    });
}
const Image = /*#__PURE__*/ (0, _react.forwardRef)((props, forwardedRef)=>{
    const pagesRouter = (0, _react.useContext)(_routercontextsharedruntime.RouterContext);
    // We're in the app directory if there is no pages router.
    const isAppRouter = !pagesRouter;
    const configContext = (0, _react.useContext)(_imageconfigcontextsharedruntime.ImageConfigContext);
    const config = (0, _react.useMemo)(()=>{
        const c = configEnv || configContext || _imageconfig.imageConfigDefault;
        const allSizes = [
            ...c.deviceSizes,
            ...c.imageSizes
        ].sort((a, b)=>a - b);
        const deviceSizes = c.deviceSizes.sort((a, b)=>a - b);
        const qualities = c.qualities?.sort((a, b)=>a - b);
        return {
            ...c,
            allSizes,
            deviceSizes,
            qualities,
            // During the SSR, configEnv (__NEXT_IMAGE_OPTS) does not include
            // security sensitive configs like `localPatterns`, which is needed
            // during the server render to ensure it's validated. Therefore use
            // configContext, which holds the config from the server for validation.
            localPatterns: typeof window === 'undefined' ? configContext?.localPatterns : c.localPatterns
        };
    }, [
        configContext
    ]);
    const { onLoad, onLoadingComplete } = props;
    const onLoadRef = (0, _react.useRef)(onLoad);
    (0, _react.useEffect)(()=>{
        onLoadRef.current = onLoad;
    }, [
        onLoad
    ]);
    const onLoadingCompleteRef = (0, _react.useRef)(onLoadingComplete);
    (0, _react.useEffect)(()=>{
        onLoadingCompleteRef.current = onLoadingComplete;
    }, [
        onLoadingComplete
    ]);
    const [blurComplete, setBlurComplete] = (0, _react.useState)(false);
    const [showAltText, setShowAltText] = (0, _react.useState)(false);
    const { props: imgAttributes, meta: imgMeta } = (0, _getimgprops.getImgProps)(props, {
        defaultLoader: _imageloader.default,
        imgConf: config,
        blurComplete,
        showAltText
    });
    return /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
        children: [
            /*#__PURE__*/ (0, _jsxruntime.jsx)(ImageElement, {
                ...imgAttributes,
                unoptimized: imgMeta.unoptimized,
                placeholder: imgMeta.placeholder,
                fill: imgMeta.fill,
                onLoadRef: onLoadRef,
                onLoadingCompleteRef: onLoadingCompleteRef,
                setBlurComplete: setBlurComplete,
                setShowAltText: setShowAltText,
                sizesInput: props.sizes,
                ref: forwardedRef
            }),
            imgMeta.preload ? /*#__PURE__*/ (0, _jsxruntime.jsx)(ImagePreload, {
                isAppRouter: isAppRouter,
                imgAttributes: imgAttributes
            }) : null
        ]
    });
});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=image-component.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/image-external.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    getImageProps: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    getImageProps: function() {
        return getImageProps;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/Demo-2/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _getimgprops = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/get-img-props.js [app-client] (ecmascript)");
const _imagecomponent = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/client/image-component.js [app-client] (ecmascript)");
const _imageloader = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/image-loader.js [app-client] (ecmascript)"));
function getImageProps(imgProps) {
    const { props } = (0, _getimgprops.getImgProps)(imgProps, {
        defaultLoader: _imageloader.default,
        // This is replaced by webpack define plugin
        imgConf: ("TURBOPACK compile-time value", {
            "deviceSizes": ("TURBOPACK compile-time value", [
                ("TURBOPACK compile-time value", 640),
                ("TURBOPACK compile-time value", 750),
                ("TURBOPACK compile-time value", 828),
                ("TURBOPACK compile-time value", 1080),
                ("TURBOPACK compile-time value", 1200),
                ("TURBOPACK compile-time value", 1920),
                ("TURBOPACK compile-time value", 2048),
                ("TURBOPACK compile-time value", 3840)
            ]),
            "imageSizes": ("TURBOPACK compile-time value", [
                ("TURBOPACK compile-time value", 32),
                ("TURBOPACK compile-time value", 48),
                ("TURBOPACK compile-time value", 64),
                ("TURBOPACK compile-time value", 96),
                ("TURBOPACK compile-time value", 128),
                ("TURBOPACK compile-time value", 256),
                ("TURBOPACK compile-time value", 384)
            ]),
            "qualities": ("TURBOPACK compile-time value", [
                ("TURBOPACK compile-time value", 75),
                ("TURBOPACK compile-time value", 70)
            ]),
            "path": ("TURBOPACK compile-time value", "/_next/image"),
            "loader": ("TURBOPACK compile-time value", "default"),
            "dangerouslyAllowSVG": ("TURBOPACK compile-time value", false),
            "unoptimized": ("TURBOPACK compile-time value", false),
            "domains": ("TURBOPACK compile-time value", [
                ("TURBOPACK compile-time value", "platefull.com.br")
            ]),
            "remotePatterns": ("TURBOPACK compile-time value", []),
            "localPatterns": ("TURBOPACK compile-time value", [
                ("TURBOPACK compile-time value", {
                    "pathname": ("TURBOPACK compile-time value", "**"),
                    "search": ("TURBOPACK compile-time value", "")
                })
            ])
        })
    });
    // Normally we don't care about undefined props because we pass to JSX,
    // but this exported function could be used by the end user for anything
    // so we delete undefined props to clean it up a little.
    for (const [key, value] of Object.entries(props)){
        if (value === undefined) {
            delete props[key];
        }
    }
    return {
        props
    };
}
const _default = _imagecomponent.Image; //# sourceMappingURL=image-external.js.map
}),
"[project]/Demo-2/node_modules/next/image.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/image-external.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>TriangleAlert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
            key: "wmoenq"
        }
    ],
    [
        "path",
        {
            d: "M12 9v4",
            key: "juzpu7"
        }
    ],
    [
        "path",
        {
            d: "M12 17h.01",
            key: "p32p05"
        }
    ]
];
const TriangleAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("triangle-alert", __iconNode);
;
 //# sourceMappingURL=triangle-alert.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertTriangle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chart-no-axes-column.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChartNoAxesColumn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M5 21v-6",
            key: "1hz6c0"
        }
    ],
    [
        "path",
        {
            d: "M12 21V3",
            key: "1lcnhd"
        }
    ],
    [
        "path",
        {
            d: "M19 21V9",
            key: "unv183"
        }
    ]
];
const ChartNoAxesColumn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chart-no-axes-column", __iconNode);
;
 //# sourceMappingURL=chart-no-axes-column.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chart-no-axes-column.js [app-client] (ecmascript) <export default as BarChart2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BarChart2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chart-no-axes-column.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Bot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12 8V4H8",
            key: "hb8ula"
        }
    ],
    [
        "rect",
        {
            width: "16",
            height: "12",
            x: "4",
            y: "8",
            rx: "2",
            key: "enze0r"
        }
    ],
    [
        "path",
        {
            d: "M2 14h2",
            key: "vft8re"
        }
    ],
    [
        "path",
        {
            d: "M20 14h2",
            key: "4cs60a"
        }
    ],
    [
        "path",
        {
            d: "M15 13v2",
            key: "1xurst"
        }
    ],
    [
        "path",
        {
            d: "M9 13v2",
            key: "rq6x2g"
        }
    ]
];
const Bot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("bot", __iconNode);
;
 //# sourceMappingURL=bot.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Bot",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronDown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m6 9 6 6 6-6",
            key: "qrunsl"
        }
    ]
];
const ChevronDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chevron-down", __iconNode);
;
 //# sourceMappingURL=chevron-down.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronDown",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronLeft
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m15 18-6-6 6-6",
            key: "1wnfg3"
        }
    ]
];
const ChevronLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chevron-left", __iconNode);
;
 //# sourceMappingURL=chevron-left.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronLeft",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronRight",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/clipboard-check.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ClipboardCheck
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "8",
            height: "4",
            x: "8",
            y: "2",
            rx: "1",
            ry: "1",
            key: "tgr4d6"
        }
    ],
    [
        "path",
        {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
            key: "116196"
        }
    ],
    [
        "path",
        {
            d: "m9 14 2 2 4-4",
            key: "df797q"
        }
    ]
];
const ClipboardCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("clipboard-check", __iconNode);
;
 //# sourceMappingURL=clipboard-check.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/clipboard-check.js [app-client] (ecmascript) <export default as ClipboardCheck>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClipboardCheck",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/clipboard-check.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Clock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12 6v6l4 2",
            key: "mmk7yg"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ]
];
const Clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("clock", __iconNode);
;
 //# sourceMappingURL=clock.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Clock",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/file-chart-column.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>FileChartColumn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
            key: "1rqfz7"
        }
    ],
    [
        "path",
        {
            d: "M14 2v4a2 2 0 0 0 2 2h4",
            key: "tnqrlb"
        }
    ],
    [
        "path",
        {
            d: "M8 18v-1",
            key: "zg0ygc"
        }
    ],
    [
        "path",
        {
            d: "M12 18v-6",
            key: "17g6i2"
        }
    ],
    [
        "path",
        {
            d: "M16 18v-3",
            key: "j5jt4h"
        }
    ]
];
const FileChartColumn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("file-chart-column", __iconNode);
;
 //# sourceMappingURL=file-chart-column.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/file-chart-column.js [app-client] (ecmascript) <export default as FileBarChart2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileBarChart2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/file-chart-column.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>LayoutDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "7",
            height: "9",
            x: "3",
            y: "3",
            rx: "1",
            key: "10lvy0"
        }
    ],
    [
        "rect",
        {
            width: "7",
            height: "5",
            x: "14",
            y: "3",
            rx: "1",
            key: "16une8"
        }
    ],
    [
        "rect",
        {
            width: "7",
            height: "9",
            x: "14",
            y: "12",
            rx: "1",
            key: "1hutg5"
        }
    ],
    [
        "rect",
        {
            width: "7",
            height: "5",
            x: "3",
            y: "16",
            rx: "1",
            key: "ldoo1y"
        }
    ]
];
const LayoutDashboard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("layout-dashboard", __iconNode);
;
 //# sourceMappingURL=layout-dashboard.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LayoutDashboard",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Link2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M9 17H7A5 5 0 0 1 7 7h2",
            key: "8i5ue5"
        }
    ],
    [
        "path",
        {
            d: "M15 7h2a5 5 0 1 1 0 10h-2",
            key: "1b9ql8"
        }
    ],
    [
        "line",
        {
            x1: "8",
            x2: "16",
            y1: "12",
            y2: "12",
            key: "1jonct"
        }
    ]
];
const Link2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("link-2", __iconNode);
;
 //# sourceMappingURL=link-2.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Link2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/list-checks.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ListChecks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M13 5h8",
            key: "a7qcls"
        }
    ],
    [
        "path",
        {
            d: "M13 12h8",
            key: "h98zly"
        }
    ],
    [
        "path",
        {
            d: "M13 19h8",
            key: "c3s6r1"
        }
    ],
    [
        "path",
        {
            d: "m3 17 2 2 4-4",
            key: "1jhpwq"
        }
    ],
    [
        "path",
        {
            d: "m3 7 2 2 4-4",
            key: "1obspn"
        }
    ]
];
const ListChecks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("list-checks", __iconNode);
;
 //# sourceMappingURL=list-checks.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/list-checks.js [app-client] (ecmascript) <export default as ListChecks>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ListChecks",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/list-checks.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Menu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M4 5h16",
            key: "1tepv9"
        }
    ],
    [
        "path",
        {
            d: "M4 12h16",
            key: "1lakjw"
        }
    ],
    [
        "path",
        {
            d: "M4 19h16",
            key: "1djgab"
        }
    ]
];
const Menu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("menu", __iconNode);
;
 //# sourceMappingURL=menu.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Menu",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>MessageSquare
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
            key: "18887p"
        }
    ]
];
const MessageSquare = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("message-square", __iconNode);
;
 //# sourceMappingURL=message-square.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageSquare",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Package
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
            key: "1a0edw"
        }
    ],
    [
        "path",
        {
            d: "M12 22V12",
            key: "d0xqtd"
        }
    ],
    [
        "polyline",
        {
            points: "3.29 7 12 12 20.71 7",
            key: "ousv84"
        }
    ],
    [
        "path",
        {
            d: "m7.5 4.27 9 5.15",
            key: "1c824w"
        }
    ]
];
const Package = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("package", __iconNode);
;
 //# sourceMappingURL=package.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Package",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/receipt.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Receipt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
            key: "q3az6g"
        }
    ],
    [
        "path",
        {
            d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",
            key: "1h4pet"
        }
    ],
    [
        "path",
        {
            d: "M12 17.5v-11",
            key: "1jc1ny"
        }
    ]
];
const Receipt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("receipt", __iconNode);
;
 //# sourceMappingURL=receipt.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/receipt.js [app-client] (ecmascript) <export default as Receipt>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Receipt",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/receipt.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ShoppingBag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M16 10a4 4 0 0 1-8 0",
            key: "1ltviw"
        }
    ],
    [
        "path",
        {
            d: "M3.103 6.034h17.794",
            key: "awc11p"
        }
    ],
    [
        "path",
        {
            d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
            key: "o988cm"
        }
    ]
];
const ShoppingBag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("shopping-bag", __iconNode);
;
 //# sourceMappingURL=shopping-bag.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShoppingBag",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Tag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
            key: "vktsd0"
        }
    ],
    [
        "circle",
        {
            cx: "7.5",
            cy: "7.5",
            r: ".5",
            fill: "currentColor",
            key: "kqv944"
        }
    ]
];
const Tag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("tag", __iconNode);
;
 //# sourceMappingURL=tag.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tag",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Users
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
            key: "1yyitq"
        }
    ],
    [
        "path",
        {
            d: "M16 3.128a4 4 0 0 1 0 7.744",
            key: "16gr8j"
        }
    ],
    [
        "path",
        {
            d: "M22 21v-2a4 4 0 0 0-3-3.87",
            key: "kshegd"
        }
    ],
    [
        "circle",
        {
            cx: "9",
            cy: "7",
            r: "4",
            key: "nufk8"
        }
    ]
];
const Users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("users", __iconNode);
;
 //# sourceMappingURL=users.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Users",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/warehouse.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Warehouse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11",
            key: "pb2vm6"
        }
    ],
    [
        "path",
        {
            d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z",
            key: "doq5xv"
        }
    ],
    [
        "path",
        {
            d: "M6 13h12",
            key: "yf64js"
        }
    ],
    [
        "path",
        {
            d: "M6 17h12",
            key: "1jwigz"
        }
    ]
];
const Warehouse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("warehouse", __iconNode);
;
 //# sourceMappingURL=warehouse.js.map
}),
"[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/warehouse.js [app-client] (ecmascript) <export default as Warehouse>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Warehouse",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$warehouse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$warehouse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/lucide-react/dist/esm/icons/warehouse.js [app-client] (ecmascript)");
}),
"[project]/Demo-2/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Close",
    ()=>DialogClose,
    "Content",
    ()=>DialogContent,
    "Description",
    ()=>DialogDescription,
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger,
    "Overlay",
    ()=>DialogOverlay,
    "Portal",
    ()=>DialogPortal,
    "Root",
    ()=>Dialog,
    "Title",
    ()=>DialogTitle,
    "Trigger",
    ()=>DialogTrigger,
    "WarningProvider",
    ()=>WarningProvider,
    "createDialogScope",
    ()=>createDialogScope
]);
// src/dialog.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-context/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-id/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dismissable$2d$layer$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$scope$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-focus-scope/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$portal$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-portal/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-presence/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$guards$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-focus-guards/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$Combination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RemoveScroll$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/react-remove-scroll/dist/es2015/Combination.js [app-client] (ecmascript) <export default as RemoveScroll>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$aria$2d$hidden$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/aria-hidden/dist/es2015/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
var __defProp = Object.defineProperty;
var __name = (target, value)=>__defProp(target, "name", {
        value,
        configurable: true
    });
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextScope"])(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = /* @__PURE__ */ __name((props)=>{
    const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
    const triggerRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const contentRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const { nodes: branchNodes, registry: branchRegistry } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$scope$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFocusScopeBranchRegistry"])();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControllableState"])({
        prop: openProp,
        defaultProp: defaultOpen ?? false,
        onChange: onOpenChange,
        caller: DIALOG_NAME
    });
    const [titleCount, setTitleCount] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](0);
    const [descriptionCount, setDescriptionCount] = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](0);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(DialogProvider, {
        scope: __scopeDialog,
        triggerRef,
        contentRef,
        contentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(),
        titleId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(),
        descriptionId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(),
        titlePresent: titleCount > 0,
        descriptionPresent: descriptionCount > 0,
        setTitleCount,
        setDescriptionCount,
        open,
        onOpenChange: setOpen,
        onOpenToggle: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "Dialog.useCallback": ()=>setOpen({
                    "Dialog.useCallback": (prevOpen)=>!prevOpen
                }["Dialog.useCallback"])
        }["Dialog.useCallback"], [
            setOpen
        ]),
        modal,
        branchNodes,
        branchRegistry,
        children
    });
}, "Dialog");
var TRIGGER_NAME = "DialogTrigger";
var DialogTrigger = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function DialogTrigger2(props, forwardedRef) {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.open ? context.contentId : void 0,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onClick, context.onOpenToggle)
    });
}, "DialogTrigger"));
var PORTAL_NAME = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME, {
    forceMount: void 0
});
var DialogPortal = /* @__PURE__ */ __name((props)=>{
    const { __scopeDialog, forceMount, children, container } = props;
    const context = useDialogContext(PORTAL_NAME, __scopeDialog);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PortalProvider, {
        scope: __scopeDialog,
        forceMount,
        children: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].map(children, (child)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Presence"], {
                present: forceMount || context.open,
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$portal$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
                    asChild: true,
                    container,
                    children: child
                })
            }))
    });
}, "DialogPortal");
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function DialogOverlay2(props, forwardedRef) {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Presence"], {
        present: forceMount || context.open,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(DialogOverlayImpl, {
            ...overlayProps,
            ref: forwardedRef
        })
    }) : null;
}, "DialogOverlay"));
var Slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSlot"])("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function DialogOverlayImpl2(props, forwardedRef) {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
    const registerDismissableSurface = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dismissable$2d$layer$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDismissableLayerSurface"])();
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, registerDismissableSurface);
    return(// Make sure `Content` is scrollable even when it doesn't live inside
    // `RemoveScroll` (eg. when `Overlay` and `Content` are siblings). Nested
    // layers are registered as branches and added as shards so they remain
    // scrollable too. See https://github.com/radix-ui/primitives/issues/3423
    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$Combination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RemoveScroll$3e$__["RemoveScroll"], {
        as: Slot,
        allowPinchZoom: true,
        shards: __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
            "DialogOverlayImpl.DialogOverlayImpl2.useMemo": ()=>[
                    context.contentRef,
                    ...context.branchNodes.map({
                        "DialogOverlayImpl.DialogOverlayImpl2.useMemo": (node)=>({
                                current: node
                            })
                    }["DialogOverlayImpl.DialogOverlayImpl2.useMemo"])
                ]
        }["DialogOverlayImpl.DialogOverlayImpl2.useMemo"], [
            context.contentRef,
            context.branchNodes
        ]),
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
            "data-state": getState(context.open),
            ...overlayProps,
            ref: composedRefs,
            style: {
                pointerEvents: "auto",
                ...overlayProps.style
            }
        })
    }));
}, "DialogOverlayImpl"));
var CONTENT_NAME = "DialogContent";
var DialogContent = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function DialogContent2(props, forwardedRef) {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Presence"], {
        present: forceMount || context.open,
        children: context.modal ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(DialogContentModal, {
            ...contentProps,
            ref: forwardedRef
        }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(DialogContentNonModal, {
            ...contentProps,
            ref: forwardedRef
        })
    });
}, "DialogContent"));
var DialogContentModal = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function DialogContentModal2(props, forwardedRef) {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const contentRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, context.contentRef, contentRef);
    __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "DialogContentModal.DialogContentModal2.useEffect": ()=>{
            const content = contentRef.current;
            if (content) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$aria$2d$hidden$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hideOthers"])(content);
        }
    }["DialogContentModal.DialogContentModal2.useEffect"], []);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(DialogContentImpl, {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: context.open,
        onCloseAutoFocus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onCloseAutoFocus, (event)=>{
            event.preventDefault();
            context.triggerRef.current?.focus();
        }),
        onPointerDownOutside: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onPointerDownOutside, (event)=>{
            const originalEvent = event.detail.originalEvent;
            const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
            if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onFocusOutside, (event)=>event.preventDefault())
    });
}, "DialogContentModal"));
var DialogContentNonModal = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function DialogContentNonModal2(props, forwardedRef) {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const hasInteractedOutsideRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const hasPointerDownOutsideRef = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(DialogContentImpl, {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event)=>{
            props.onCloseAutoFocus?.(event);
            if (!event.defaultPrevented) {
                if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
                event.preventDefault();
            }
            hasInteractedOutsideRef.current = false;
            hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event)=>{
            props.onInteractOutside?.(event);
            if (!event.defaultPrevented) {
                hasInteractedOutsideRef.current = true;
                if (event.detail.originalEvent.type === "pointerdown") {
                    hasPointerDownOutsideRef.current = true;
                }
            }
            const target = event.target;
            const targetIsTrigger = context.triggerRef.current?.contains(target);
            if (targetIsTrigger) event.preventDefault();
            if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
                event.preventDefault();
            }
        }
    });
}, "DialogContentNonModal"));
var DialogContentImpl = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function DialogContentImpl2(props, forwardedRef) {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, "aria-describedby": ariaDescribedby, children, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, __scopeDialog);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$guards$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFocusGuards"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$scope$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FocusScopeBranchProvider"], {
        registry: context.branchRegistry,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$focus$2d$scope$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FocusScope"], {
            asChild: true,
            loop: true,
            trapped: trapFocus,
            branches: context.branchNodes,
            onMountAutoFocus: onOpenAutoFocus,
            onUnmountAutoFocus: onCloseAutoFocus,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dismissable$2d$layer$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DismissableLayer"], {
                role: "dialog",
                id: context.contentId,
                "aria-labelledby": context.titlePresent ? context.titleId : void 0,
                "aria-describedby": context.descriptionPresent ? concatAriaDescribedby(ariaDescribedby, context.descriptionId) : ariaDescribedby,
                "data-state": getState(context.open),
                ...contentProps,
                ref: forwardedRef,
                deferPointerDownOutside: true,
                onDismiss: ()=>context.onOpenChange(false),
                children
            })
        })
    });
}, "DialogContentImpl"));
var DialogTitle = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function DialogTitle2(props, forwardedRef) {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext("DialogTitle", __scopeDialog);
    const { setTitleCount } = context;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "DialogTitle.DialogTitle2.useLayoutEffect": ()=>{
            setTitleCount({
                "DialogTitle.DialogTitle2.useLayoutEffect": (count)=>count + 1
            }["DialogTitle.DialogTitle2.useLayoutEffect"]);
            return ({
                "DialogTitle.DialogTitle2.useLayoutEffect": ()=>setTitleCount({
                        "DialogTitle.DialogTitle2.useLayoutEffect": (count)=>count - 1
                    }["DialogTitle.DialogTitle2.useLayoutEffect"])
            })["DialogTitle.DialogTitle2.useLayoutEffect"];
        }
    }["DialogTitle.DialogTitle2.useLayoutEffect"], [
        setTitleCount
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].h2, {
        id: context.titleId,
        ...titleProps,
        ref: forwardedRef
    });
}, "DialogTitle"));
var DialogDescription = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](// blank line to reduce diff noise
/* @__PURE__ */ __name(function DialogDescription2(props, forwardedRef) {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext("DialogDescription", __scopeDialog);
    const { setDescriptionCount } = context;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "DialogDescription.DialogDescription2.useLayoutEffect": ()=>{
            setDescriptionCount({
                "DialogDescription.DialogDescription2.useLayoutEffect": (count)=>count + 1
            }["DialogDescription.DialogDescription2.useLayoutEffect"]);
            return ({
                "DialogDescription.DialogDescription2.useLayoutEffect": ()=>setDescriptionCount({
                        "DialogDescription.DialogDescription2.useLayoutEffect": (count)=>count - 1
                    }["DialogDescription.DialogDescription2.useLayoutEffect"])
            })["DialogDescription.DialogDescription2.useLayoutEffect"];
        }
    }["DialogDescription.DialogDescription2.useLayoutEffect"], [
        setDescriptionCount
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].p, {
        id: context.descriptionId,
        ...descriptionProps,
        ref: forwardedRef
    });
}, "DialogDescription"));
var CLOSE_NAME = "DialogClose";
var DialogClose = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](/* @__PURE__ */ __name(function DialogClose2(props, forwardedRef) {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onClick, ()=>context.onOpenChange(false))
    });
}, "DialogClose"));
var WarningProvider = /* @__PURE__ */ __name((props)=>{
    return props.children;
}, "WarningProvider");
function concatAriaDescribedby(...values) {
    const ids = /* @__PURE__ */ new Set();
    for (const value of values){
        if (typeof value !== "string") continue;
        for (const id of String(value).trim().split(/\s+/)){
            if (id) ids.add(id);
        }
    }
    return ids.size > 0 ? Array.from(ids).join(" ") : void 0;
}
__name(concatAriaDescribedby, "concatAriaDescribedby");
function getState(open) {
    return open ? "open" : "closed";
}
__name(getState, "getState");
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Demo-2/node_modules/@prisma/client/runtime/index-browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var pe = Object.defineProperty;
var Xe = Object.getOwnPropertyDescriptor;
var Ke = Object.getOwnPropertyNames;
var Qe = Object.prototype.hasOwnProperty;
var Ye = (e)=>{
    throw TypeError(e);
};
var Oe = (e, n)=>{
    for(var i in n)pe(e, i, {
        get: n[i],
        enumerable: !0
    });
}, xe = (e, n, i, t)=>{
    if (n && typeof n == "object" || typeof n == "function") for (let r of Ke(n))!Qe.call(e, r) && r !== i && pe(e, r, {
        get: ()=>n[r],
        enumerable: !(t = Xe(n, r)) || t.enumerable
    });
    return e;
};
var ze = (e)=>xe(pe({}, "__esModule", {
        value: !0
    }), e);
var ne = (e, n, i)=>n.has(e) ? Ye("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(e) : n.set(e, i);
var ii = {};
Oe(ii, {
    Decimal: ()=>Je,
    Public: ()=>ge,
    getRuntime: ()=>_e,
    makeStrictEnum: ()=>qe,
    objectEnumValues: ()=>Ae
});
module.exports = ze(ii);
var ge = {};
Oe(ge, {
    validator: ()=>Re
});
function Re(...e) {
    return (n)=>n;
}
var ie = Symbol(), me = new WeakMap, we = class {
    constructor(n){
        n === ie ? me.set(this, "Prisma.".concat(this._getName())) : me.set(this, "new Prisma.".concat(this._getNamespace(), ".").concat(this._getName(), "()"));
    }
    _getName() {
        return this.constructor.name;
    }
    toString() {
        return me.get(this);
    }
}, G = class extends we {
    _getNamespace() {
        return "NullTypes";
    }
}, Ne, J = class extends G {
    constructor(){
        super(...arguments);
        ne(this, Ne);
    }
};
Ne = new WeakMap;
ke(J, "DbNull");
var ve, X = class extends G {
    constructor(){
        super(...arguments);
        ne(this, ve);
    }
};
ve = new WeakMap;
ke(X, "JsonNull");
var Ee, K = class extends G {
    constructor(){
        super(...arguments);
        ne(this, Ee);
    }
};
Ee = new WeakMap;
ke(K, "AnyNull");
var Ae = {
    classes: {
        DbNull: J,
        JsonNull: X,
        AnyNull: K
    },
    instances: {
        DbNull: new J(ie),
        JsonNull: new X(ie),
        AnyNull: new K(ie)
    }
};
function ke(e, n) {
    Object.defineProperty(e, "name", {
        value: n,
        configurable: !0
    });
}
var ye = new Set([
    "toJSON",
    "$$typeof",
    "asymmetricMatch",
    Symbol.iterator,
    Symbol.toStringTag,
    Symbol.isConcatSpreadable,
    Symbol.toPrimitive
]);
function qe(e) {
    return new Proxy(e, {
        get (n, i) {
            if (i in n) return n[i];
            if (!ye.has(i)) throw new TypeError("Invalid enum value: ".concat(String(i)));
        }
    });
}
var en = ()=>{
    var e, n;
    return ((n = (e = globalThis.process) == null ? void 0 : e.release) == null ? void 0 : n.name) === "node";
}, nn = ()=>{
    var e, n;
    return !!globalThis.Bun || !!((n = (e = globalThis.process) == null ? void 0 : e.versions) != null && n.bun);
}, tn = ()=>!!globalThis.Deno, rn = ()=>typeof globalThis.Netlify == "object", sn = ()=>typeof globalThis.EdgeRuntime == "object", on = ()=>{
    var e;
    return ((e = globalThis.navigator) == null ? void 0 : e.userAgent) === "Cloudflare-Workers";
};
function un() {
    var i;
    return (i = [
        [
            rn,
            "netlify"
        ],
        [
            sn,
            "edge-light"
        ],
        [
            on,
            "workerd"
        ],
        [
            tn,
            "deno"
        ],
        [
            nn,
            "bun"
        ],
        [
            en,
            "node"
        ]
    ].flatMap((t)=>t[0]() ? [
            t[1]
        ] : []).at(0)) != null ? i : "";
}
var fn = {
    node: "Node.js",
    workerd: "Cloudflare Workers",
    deno: "Deno and Deno Deploy",
    netlify: "Netlify Edge Functions",
    "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)"
};
function _e() {
    let e = un();
    return {
        id: e,
        prettyName: fn[e] || e,
        isEdge: [
            "workerd",
            "deno",
            "netlify",
            "edge-light"
        ].includes(e)
    };
}
var V = 9e15, H = 1e9, Se = "0123456789abcdef", se = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058", oe = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789", Me = {
    precision: 20,
    rounding: 4,
    modulo: 1,
    toExpNeg: -7,
    toExpPos: 21,
    minE: -V,
    maxE: V,
    crypto: !1
}, Le, Z, w = !0, fe = "[DecimalError] ", $ = fe + "Invalid argument: ", Ie = fe + "Precision limit exceeded", Ze = fe + "crypto unavailable", Ue = "[object Decimal]", R = Math.floor, C = Math.pow, cn = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i, ln = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i, an = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i, Be = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, D = 1e7, m = 7, dn = 9007199254740991, hn = se.length - 1, Ce = oe.length - 1, h = {
    toStringTag: Ue
};
h.absoluteValue = h.abs = function() {
    var e = new this.constructor(this);
    return e.s < 0 && (e.s = 1), p(e);
};
h.ceil = function() {
    return p(new this.constructor(this), this.e + 1, 2);
};
h.clampedTo = h.clamp = function(e, n) {
    var i, t = this, r = t.constructor;
    if (e = new r(e), n = new r(n), !e.s || !n.s) return new r(NaN);
    if (e.gt(n)) throw Error($ + n);
    return i = t.cmp(e), i < 0 ? e : t.cmp(n) > 0 ? n : new r(t);
};
h.comparedTo = h.cmp = function(e) {
    var n, i, t, r, s = this, o = s.d, u = (e = new s.constructor(e)).d, c = s.s, f = e.s;
    if (!o || !u) return !c || !f ? NaN : c !== f ? c : o === u ? 0 : !o ^ c < 0 ? 1 : -1;
    if (!o[0] || !u[0]) return o[0] ? c : u[0] ? -f : 0;
    if (c !== f) return c;
    if (s.e !== e.e) return s.e > e.e ^ c < 0 ? 1 : -1;
    for(t = o.length, r = u.length, n = 0, i = t < r ? t : r; n < i; ++n)if (o[n] !== u[n]) return o[n] > u[n] ^ c < 0 ? 1 : -1;
    return t === r ? 0 : t > r ^ c < 0 ? 1 : -1;
};
h.cosine = h.cos = function() {
    var e, n, i = this, t = i.constructor;
    return i.d ? i.d[0] ? (e = t.precision, n = t.rounding, t.precision = e + Math.max(i.e, i.sd()) + m, t.rounding = 1, i = pn(t, We(t, i)), t.precision = e, t.rounding = n, p(Z == 2 || Z == 3 ? i.neg() : i, e, n, !0)) : new t(1) : new t(NaN);
};
h.cubeRoot = h.cbrt = function() {
    var e, n, i, t, r, s, o, u, c, f, l = this, a = l.constructor;
    if (!l.isFinite() || l.isZero()) return new a(l);
    for(w = !1, s = l.s * C(l.s * l, 1 / 3), !s || Math.abs(s) == 1 / 0 ? (i = b(l.d), e = l.e, (s = (e - i.length + 1) % 3) && (i += s == 1 || s == -2 ? "0" : "00"), s = C(i, 1 / 3), e = R((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2)), s == 1 / 0 ? i = "5e" + e : (i = s.toExponential(), i = i.slice(0, i.indexOf("e") + 1) + e), t = new a(i), t.s = l.s) : t = new a(s.toString()), o = (e = a.precision) + 3;;)if (u = t, c = u.times(u).times(u), f = c.plus(l), t = k(f.plus(l).times(u), f.plus(c), o + 2, 1), b(u.d).slice(0, o) === (i = b(t.d)).slice(0, o)) if (i = i.slice(o - 3, o + 1), i == "9999" || !r && i == "4999") {
        if (!r && (p(u, e + 1, 0), u.times(u).times(u).eq(l))) {
            t = u;
            break;
        }
        o += 4, r = 1;
    } else {
        (!+i || !+i.slice(1) && i.charAt(0) == "5") && (p(t, e + 1, 1), n = !t.times(t).times(t).eq(l));
        break;
    }
    return w = !0, p(t, e, a.rounding, n);
};
h.decimalPlaces = h.dp = function() {
    var e, n = this.d, i = NaN;
    if (n) {
        if (e = n.length - 1, i = (e - R(this.e / m)) * m, e = n[e], e) for(; e % 10 == 0; e /= 10)i--;
        i < 0 && (i = 0);
    }
    return i;
};
h.dividedBy = h.div = function(e) {
    return k(this, new this.constructor(e));
};
h.dividedToIntegerBy = h.divToInt = function(e) {
    var n = this, i = n.constructor;
    return p(k(n, new i(e), 0, 1, 1), i.precision, i.rounding);
};
h.equals = h.eq = function(e) {
    return this.cmp(e) === 0;
};
h.floor = function() {
    return p(new this.constructor(this), this.e + 1, 3);
};
h.greaterThan = h.gt = function(e) {
    return this.cmp(e) > 0;
};
h.greaterThanOrEqualTo = h.gte = function(e) {
    var n = this.cmp(e);
    return n == 1 || n === 0;
};
h.hyperbolicCosine = h.cosh = function() {
    var e, n, i, t, r, s = this, o = s.constructor, u = new o(1);
    if (!s.isFinite()) return new o(s.s ? 1 / 0 : NaN);
    if (s.isZero()) return u;
    i = o.precision, t = o.rounding, o.precision = i + Math.max(s.e, s.sd()) + 4, o.rounding = 1, r = s.d.length, r < 32 ? (e = Math.ceil(r / 3), n = (1 / le(4, e)).toString()) : (e = 16, n = "2.3283064365386962890625e-10"), s = j(o, 1, s.times(n), new o(1), !0);
    for(var c, f = e, l = new o(8); f--;)c = s.times(s), s = u.minus(c.times(l.minus(c.times(l))));
    return p(s, o.precision = i, o.rounding = t, !0);
};
h.hyperbolicSine = h.sinh = function() {
    var e, n, i, t, r = this, s = r.constructor;
    if (!r.isFinite() || r.isZero()) return new s(r);
    if (n = s.precision, i = s.rounding, s.precision = n + Math.max(r.e, r.sd()) + 4, s.rounding = 1, t = r.d.length, t < 3) r = j(s, 2, r, r, !0);
    else {
        e = 1.4 * Math.sqrt(t), e = e > 16 ? 16 : e | 0, r = r.times(1 / le(5, e)), r = j(s, 2, r, r, !0);
        for(var o, u = new s(5), c = new s(16), f = new s(20); e--;)o = r.times(r), r = r.times(u.plus(o.times(c.times(o).plus(f))));
    }
    return s.precision = n, s.rounding = i, p(r, n, i, !0);
};
h.hyperbolicTangent = h.tanh = function() {
    var e, n, i = this, t = i.constructor;
    return i.isFinite() ? i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + 7, t.rounding = 1, k(i.sinh(), i.cosh(), t.precision = e, t.rounding = n)) : new t(i.s);
};
h.inverseCosine = h.acos = function() {
    var e = this, n = e.constructor, i = e.abs().cmp(1), t = n.precision, r = n.rounding;
    return i !== -1 ? i === 0 ? e.isNeg() ? F(n, t, r) : new n(0) : new n(NaN) : e.isZero() ? F(n, t + 4, r).times(.5) : (n.precision = t + 6, n.rounding = 1, e = new n(1).minus(e).div(e.plus(1)).sqrt().atan(), n.precision = t, n.rounding = r, e.times(2));
};
h.inverseHyperbolicCosine = h.acosh = function() {
    var e, n, i = this, t = i.constructor;
    return i.lte(1) ? new t(i.eq(1) ? 0 : NaN) : i.isFinite() ? (e = t.precision, n = t.rounding, t.precision = e + Math.max(Math.abs(i.e), i.sd()) + 4, t.rounding = 1, w = !1, i = i.times(i).minus(1).sqrt().plus(i), w = !0, t.precision = e, t.rounding = n, i.ln()) : new t(i);
};
h.inverseHyperbolicSine = h.asinh = function() {
    var e, n, i = this, t = i.constructor;
    return !i.isFinite() || i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + 2 * Math.max(Math.abs(i.e), i.sd()) + 6, t.rounding = 1, w = !1, i = i.times(i).plus(1).sqrt().plus(i), w = !0, t.precision = e, t.rounding = n, i.ln());
};
h.inverseHyperbolicTangent = h.atanh = function() {
    var e, n, i, t, r = this, s = r.constructor;
    return r.isFinite() ? r.e >= 0 ? new s(r.abs().eq(1) ? r.s / 0 : r.isZero() ? r : NaN) : (e = s.precision, n = s.rounding, t = r.sd(), Math.max(t, e) < 2 * -r.e - 1 ? p(new s(r), e, n, !0) : (s.precision = i = t - r.e, r = k(r.plus(1), new s(1).minus(r), i + e, 1), s.precision = e + 4, s.rounding = 1, r = r.ln(), s.precision = e, s.rounding = n, r.times(.5))) : new s(NaN);
};
h.inverseSine = h.asin = function() {
    var e, n, i, t, r = this, s = r.constructor;
    return r.isZero() ? new s(r) : (n = r.abs().cmp(1), i = s.precision, t = s.rounding, n !== -1 ? n === 0 ? (e = F(s, i + 4, t).times(.5), e.s = r.s, e) : new s(NaN) : (s.precision = i + 6, s.rounding = 1, r = r.div(new s(1).minus(r.times(r)).sqrt().plus(1)).atan(), s.precision = i, s.rounding = t, r.times(2)));
};
h.inverseTangent = h.atan = function() {
    var e, n, i, t, r, s, o, u, c, f = this, l = f.constructor, a = l.precision, d = l.rounding;
    if (f.isFinite()) {
        if (f.isZero()) return new l(f);
        if (f.abs().eq(1) && a + 4 <= Ce) return o = F(l, a + 4, d).times(.25), o.s = f.s, o;
    } else {
        if (!f.s) return new l(NaN);
        if (a + 4 <= Ce) return o = F(l, a + 4, d).times(.5), o.s = f.s, o;
    }
    for(l.precision = u = a + 10, l.rounding = 1, i = Math.min(28, u / m + 2 | 0), e = i; e; --e)f = f.div(f.times(f).plus(1).sqrt().plus(1));
    for(w = !1, n = Math.ceil(u / m), t = 1, c = f.times(f), o = new l(f), r = f; e !== -1;)if (r = r.times(c), s = o.minus(r.div(t += 2)), r = r.times(c), o = s.plus(r.div(t += 2)), o.d[n] !== void 0) for(e = n; o.d[e] === s.d[e] && e--;);
    return i && (o = o.times(2 << i - 1)), w = !0, p(o, l.precision = a, l.rounding = d, !0);
};
h.isFinite = function() {
    return !!this.d;
};
h.isInteger = h.isInt = function() {
    return !!this.d && R(this.e / m) > this.d.length - 2;
};
h.isNaN = function() {
    return !this.s;
};
h.isNegative = h.isNeg = function() {
    return this.s < 0;
};
h.isPositive = h.isPos = function() {
    return this.s > 0;
};
h.isZero = function() {
    return !!this.d && this.d[0] === 0;
};
h.lessThan = h.lt = function(e) {
    return this.cmp(e) < 0;
};
h.lessThanOrEqualTo = h.lte = function(e) {
    return this.cmp(e) < 1;
};
h.logarithm = h.log = function(e) {
    var n, i, t, r, s, o, u, c, f = this, l = f.constructor, a = l.precision, d = l.rounding, g = 5;
    if (e == null) e = new l(10), n = !0;
    else {
        if (e = new l(e), i = e.d, e.s < 0 || !i || !i[0] || e.eq(1)) return new l(NaN);
        n = e.eq(10);
    }
    if (i = f.d, f.s < 0 || !i || !i[0] || f.eq(1)) return new l(i && !i[0] ? -1 / 0 : f.s != 1 ? NaN : i ? 0 : 1 / 0);
    if (n) if (i.length > 1) s = !0;
    else {
        for(r = i[0]; r % 10 === 0;)r /= 10;
        s = r !== 1;
    }
    if (w = !1, u = a + g, o = B(f, u), t = n ? ue(l, u + 10) : B(e, u), c = k(o, t, u, 1), Q(c.d, r = a, d)) do if (u += 10, o = B(f, u), t = n ? ue(l, u + 10) : B(e, u), c = k(o, t, u, 1), !s) {
        +b(c.d).slice(r + 1, r + 15) + 1 == 1e14 && (c = p(c, a + 1, 0));
        break;
    }
    while (Q(c.d, r += 10, d))
    return w = !0, p(c, a, d);
};
h.minus = h.sub = function(e) {
    var n, i, t, r, s, o, u, c, f, l, a, d, g = this, v = g.constructor;
    if (e = new v(e), !g.d || !e.d) return !g.s || !e.s ? e = new v(NaN) : g.d ? e.s = -e.s : e = new v(e.d || g.s !== e.s ? g : NaN), e;
    if (g.s != e.s) return e.s = -e.s, g.plus(e);
    if (f = g.d, d = e.d, u = v.precision, c = v.rounding, !f[0] || !d[0]) {
        if (d[0]) e.s = -e.s;
        else if (f[0]) e = new v(g);
        else return new v(c === 3 ? -0 : 0);
        return w ? p(e, u, c) : e;
    }
    if (i = R(e.e / m), l = R(g.e / m), f = f.slice(), s = l - i, s) {
        for(a = s < 0, a ? (n = f, s = -s, o = d.length) : (n = d, i = l, o = f.length), t = Math.max(Math.ceil(u / m), o) + 2, s > t && (s = t, n.length = 1), n.reverse(), t = s; t--;)n.push(0);
        n.reverse();
    } else {
        for(t = f.length, o = d.length, a = t < o, a && (o = t), t = 0; t < o; t++)if (f[t] != d[t]) {
            a = f[t] < d[t];
            break;
        }
        s = 0;
    }
    for(a && (n = f, f = d, d = n, e.s = -e.s), o = f.length, t = d.length - o; t > 0; --t)f[o++] = 0;
    for(t = d.length; t > s;){
        if (f[--t] < d[t]) {
            for(r = t; r && f[--r] === 0;)f[r] = D - 1;
            --f[r], f[t] += D;
        }
        f[t] -= d[t];
    }
    for(; f[--o] === 0;)f.pop();
    for(; f[0] === 0; f.shift())--i;
    return f[0] ? (e.d = f, e.e = ce(f, i), w ? p(e, u, c) : e) : new v(c === 3 ? -0 : 0);
};
h.modulo = h.mod = function(e) {
    var n, i = this, t = i.constructor;
    return e = new t(e), !i.d || !e.s || e.d && !e.d[0] ? new t(NaN) : !e.d || i.d && !i.d[0] ? p(new t(i), t.precision, t.rounding) : (w = !1, t.modulo == 9 ? (n = k(i, e.abs(), 0, 3, 1), n.s *= e.s) : n = k(i, e, 0, t.modulo, 1), n = n.times(e), w = !0, i.minus(n));
};
h.naturalExponential = h.exp = function() {
    return be(this);
};
h.naturalLogarithm = h.ln = function() {
    return B(this);
};
h.negated = h.neg = function() {
    var e = new this.constructor(this);
    return e.s = -e.s, p(e);
};
h.plus = h.add = function(e) {
    var n, i, t, r, s, o, u, c, f, l, a = this, d = a.constructor;
    if (e = new d(e), !a.d || !e.d) return !a.s || !e.s ? e = new d(NaN) : a.d || (e = new d(e.d || a.s === e.s ? a : NaN)), e;
    if (a.s != e.s) return e.s = -e.s, a.minus(e);
    if (f = a.d, l = e.d, u = d.precision, c = d.rounding, !f[0] || !l[0]) return l[0] || (e = new d(a)), w ? p(e, u, c) : e;
    if (s = R(a.e / m), t = R(e.e / m), f = f.slice(), r = s - t, r) {
        for(r < 0 ? (i = f, r = -r, o = l.length) : (i = l, t = s, o = f.length), s = Math.ceil(u / m), o = s > o ? s + 1 : o + 1, r > o && (r = o, i.length = 1), i.reverse(); r--;)i.push(0);
        i.reverse();
    }
    for(o = f.length, r = l.length, o - r < 0 && (r = o, i = l, l = f, f = i), n = 0; r;)n = (f[--r] = f[r] + l[r] + n) / D | 0, f[r] %= D;
    for(n && (f.unshift(n), ++t), o = f.length; f[--o] == 0;)f.pop();
    return e.d = f, e.e = ce(f, t), w ? p(e, u, c) : e;
};
h.precision = h.sd = function(e) {
    var n, i = this;
    if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error($ + e);
    return i.d ? (n = $e(i.d), e && i.e + 1 > n && (n = i.e + 1)) : n = NaN, n;
};
h.round = function() {
    var e = this, n = e.constructor;
    return p(new n(e), e.e + 1, n.rounding);
};
h.sine = h.sin = function() {
    var e, n, i = this, t = i.constructor;
    return i.isFinite() ? i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + Math.max(i.e, i.sd()) + m, t.rounding = 1, i = mn(t, We(t, i)), t.precision = e, t.rounding = n, p(Z > 2 ? i.neg() : i, e, n, !0)) : new t(NaN);
};
h.squareRoot = h.sqrt = function() {
    var e, n, i, t, r, s, o = this, u = o.d, c = o.e, f = o.s, l = o.constructor;
    if (f !== 1 || !u || !u[0]) return new l(!f || f < 0 && (!u || u[0]) ? NaN : u ? o : 1 / 0);
    for(w = !1, f = Math.sqrt(+o), f == 0 || f == 1 / 0 ? (n = b(u), (n.length + c) % 2 == 0 && (n += "0"), f = Math.sqrt(n), c = R((c + 1) / 2) - (c < 0 || c % 2), f == 1 / 0 ? n = "5e" + c : (n = f.toExponential(), n = n.slice(0, n.indexOf("e") + 1) + c), t = new l(n)) : t = new l(f.toString()), i = (c = l.precision) + 3;;)if (s = t, t = s.plus(k(o, s, i + 2, 1)).times(.5), b(s.d).slice(0, i) === (n = b(t.d)).slice(0, i)) if (n = n.slice(i - 3, i + 1), n == "9999" || !r && n == "4999") {
        if (!r && (p(s, c + 1, 0), s.times(s).eq(o))) {
            t = s;
            break;
        }
        i += 4, r = 1;
    } else {
        (!+n || !+n.slice(1) && n.charAt(0) == "5") && (p(t, c + 1, 1), e = !t.times(t).eq(o));
        break;
    }
    return w = !0, p(t, c, l.rounding, e);
};
h.tangent = h.tan = function() {
    var e, n, i = this, t = i.constructor;
    return i.isFinite() ? i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + 10, t.rounding = 1, i = i.sin(), i.s = 1, i = k(i, new t(1).minus(i.times(i)).sqrt(), e + 10, 0), t.precision = e, t.rounding = n, p(Z == 2 || Z == 4 ? i.neg() : i, e, n, !0)) : new t(NaN);
};
h.times = h.mul = function(e) {
    var n, i, t, r, s, o, u, c, f, l = this, a = l.constructor, d = l.d, g = (e = new a(e)).d;
    if (e.s *= l.s, !d || !d[0] || !g || !g[0]) return new a(!e.s || d && !d[0] && !g || g && !g[0] && !d ? NaN : !d || !g ? e.s / 0 : e.s * 0);
    for(i = R(l.e / m) + R(e.e / m), c = d.length, f = g.length, c < f && (s = d, d = g, g = s, o = c, c = f, f = o), s = [], o = c + f, t = o; t--;)s.push(0);
    for(t = f; --t >= 0;){
        for(n = 0, r = c + t; r > t;)u = s[r] + g[t] * d[r - t - 1] + n, s[r--] = u % D | 0, n = u / D | 0;
        s[r] = (s[r] + n) % D | 0;
    }
    for(; !s[--o];)s.pop();
    return n ? ++i : s.shift(), e.d = s, e.e = ce(s, i), w ? p(e, a.precision, a.rounding) : e;
};
h.toBinary = function(e, n) {
    return Pe(this, 2, e, n);
};
h.toDecimalPlaces = h.toDP = function(e, n) {
    var i = this, t = i.constructor;
    return i = new t(i), e === void 0 ? i : (q(e, 0, H), n === void 0 ? n = t.rounding : q(n, 0, 8), p(i, e + i.e + 1, n));
};
h.toExponential = function(e, n) {
    var i, t = this, r = t.constructor;
    return e === void 0 ? i = L(t, !0) : (q(e, 0, H), n === void 0 ? n = r.rounding : q(n, 0, 8), t = p(new r(t), e + 1, n), i = L(t, !0, e + 1)), t.isNeg() && !t.isZero() ? "-" + i : i;
};
h.toFixed = function(e, n) {
    var i, t, r = this, s = r.constructor;
    return e === void 0 ? i = L(r) : (q(e, 0, H), n === void 0 ? n = s.rounding : q(n, 0, 8), t = p(new s(r), e + r.e + 1, n), i = L(t, !1, e + t.e + 1)), r.isNeg() && !r.isZero() ? "-" + i : i;
};
h.toFraction = function(e) {
    var n, i, t, r, s, o, u, c, f, l, a, d, g = this, v = g.d, N = g.constructor;
    if (!v) return new N(g);
    if (f = i = new N(1), t = c = new N(0), n = new N(t), s = n.e = $e(v) - g.e - 1, o = s % m, n.d[0] = C(10, o < 0 ? m + o : o), e == null) e = s > 0 ? n : f;
    else {
        if (u = new N(e), !u.isInt() || u.lt(f)) throw Error($ + u);
        e = u.gt(n) ? s > 0 ? n : f : u;
    }
    for(w = !1, u = new N(b(v)), l = N.precision, N.precision = s = v.length * m * 2; a = k(u, n, 0, 1, 1), r = i.plus(a.times(t)), r.cmp(e) != 1;)i = t, t = r, r = f, f = c.plus(a.times(r)), c = r, r = n, n = u.minus(a.times(r)), u = r;
    return r = k(e.minus(i), t, 0, 1, 1), c = c.plus(r.times(f)), i = i.plus(r.times(t)), c.s = f.s = g.s, d = k(f, t, s, 1).minus(g).abs().cmp(k(c, i, s, 1).minus(g).abs()) < 1 ? [
        f,
        t
    ] : [
        c,
        i
    ], N.precision = l, w = !0, d;
};
h.toHexadecimal = h.toHex = function(e, n) {
    return Pe(this, 16, e, n);
};
h.toNearest = function(e, n) {
    var i = this, t = i.constructor;
    if (i = new t(i), e == null) {
        if (!i.d) return i;
        e = new t(1), n = t.rounding;
    } else {
        if (e = new t(e), n === void 0 ? n = t.rounding : q(n, 0, 8), !i.d) return e.s ? i : e;
        if (!e.d) return e.s && (e.s = i.s), e;
    }
    return e.d[0] ? (w = !1, i = k(i, e, 0, n, 1).times(e), w = !0, p(i)) : (e.s = i.s, i = e), i;
};
h.toNumber = function() {
    return +this;
};
h.toOctal = function(e, n) {
    return Pe(this, 8, e, n);
};
h.toPower = h.pow = function(e) {
    var n, i, t, r, s, o, u = this, c = u.constructor, f = +(e = new c(e));
    if (!u.d || !e.d || !u.d[0] || !e.d[0]) return new c(C(+u, f));
    if (u = new c(u), u.eq(1)) return u;
    if (t = c.precision, s = c.rounding, e.eq(1)) return p(u, t, s);
    if (n = R(e.e / m), n >= e.d.length - 1 && (i = f < 0 ? -f : f) <= dn) return r = He(c, u, i, t), e.s < 0 ? new c(1).div(r) : p(r, t, s);
    if (o = u.s, o < 0) {
        if (n < e.d.length - 1) return new c(NaN);
        if ((e.d[n] & 1) == 0 && (o = 1), u.e == 0 && u.d[0] == 1 && u.d.length == 1) return u.s = o, u;
    }
    return i = C(+u, f), n = i == 0 || !isFinite(i) ? R(f * (Math.log("0." + b(u.d)) / Math.LN10 + u.e + 1)) : new c(i + "").e, n > c.maxE + 1 || n < c.minE - 1 ? new c(n > 0 ? o / 0 : 0) : (w = !1, c.rounding = u.s = 1, i = Math.min(12, (n + "").length), r = be(e.times(B(u, t + i)), t), r.d && (r = p(r, t + 5, 1), Q(r.d, t, s) && (n = t + 10, r = p(be(e.times(B(u, n + i)), n), n + 5, 1), +b(r.d).slice(t + 1, t + 15) + 1 == 1e14 && (r = p(r, t + 1, 0)))), r.s = o, w = !0, c.rounding = s, p(r, t, s));
};
h.toPrecision = function(e, n) {
    var i, t = this, r = t.constructor;
    return e === void 0 ? i = L(t, t.e <= r.toExpNeg || t.e >= r.toExpPos) : (q(e, 1, H), n === void 0 ? n = r.rounding : q(n, 0, 8), t = p(new r(t), e, n), i = L(t, e <= t.e || t.e <= r.toExpNeg, e)), t.isNeg() && !t.isZero() ? "-" + i : i;
};
h.toSignificantDigits = h.toSD = function(e, n) {
    var i = this, t = i.constructor;
    return e === void 0 ? (e = t.precision, n = t.rounding) : (q(e, 1, H), n === void 0 ? n = t.rounding : q(n, 0, 8)), p(new t(i), e, n);
};
h.toString = function() {
    var e = this, n = e.constructor, i = L(e, e.e <= n.toExpNeg || e.e >= n.toExpPos);
    return e.isNeg() && !e.isZero() ? "-" + i : i;
};
h.truncated = h.trunc = function() {
    return p(new this.constructor(this), this.e + 1, 1);
};
h.valueOf = h.toJSON = function() {
    var e = this, n = e.constructor, i = L(e, e.e <= n.toExpNeg || e.e >= n.toExpPos);
    return e.isNeg() ? "-" + i : i;
};
function b(e) {
    var n, i, t, r = e.length - 1, s = "", o = e[0];
    if (r > 0) {
        for(s += o, n = 1; n < r; n++)t = e[n] + "", i = m - t.length, i && (s += U(i)), s += t;
        o = e[n], t = o + "", i = m - t.length, i && (s += U(i));
    } else if (o === 0) return "0";
    for(; o % 10 === 0;)o /= 10;
    return s + o;
}
function q(e, n, i) {
    if (e !== ~~e || e < n || e > i) throw Error($ + e);
}
function Q(e, n, i, t) {
    var r, s, o, u;
    for(s = e[0]; s >= 10; s /= 10)--n;
    return --n < 0 ? (n += m, r = 0) : (r = Math.ceil((n + 1) / m), n %= m), s = C(10, m - n), u = e[r] % s | 0, t == null ? n < 3 ? (n == 0 ? u = u / 100 | 0 : n == 1 && (u = u / 10 | 0), o = i < 4 && u == 99999 || i > 3 && u == 49999 || u == 5e4 || u == 0) : o = (i < 4 && u + 1 == s || i > 3 && u + 1 == s / 2) && (e[r + 1] / s / 100 | 0) == C(10, n - 2) - 1 || (u == s / 2 || u == 0) && (e[r + 1] / s / 100 | 0) == 0 : n < 4 ? (n == 0 ? u = u / 1e3 | 0 : n == 1 ? u = u / 100 | 0 : n == 2 && (u = u / 10 | 0), o = (t || i < 4) && u == 9999 || !t && i > 3 && u == 4999) : o = ((t || i < 4) && u + 1 == s || !t && i > 3 && u + 1 == s / 2) && (e[r + 1] / s / 1e3 | 0) == C(10, n - 3) - 1, o;
}
function te(e, n, i) {
    for(var t, r = [
        0
    ], s, o = 0, u = e.length; o < u;){
        for(s = r.length; s--;)r[s] *= n;
        for(r[0] += Se.indexOf(e.charAt(o++)), t = 0; t < r.length; t++)r[t] > i - 1 && (r[t + 1] === void 0 && (r[t + 1] = 0), r[t + 1] += r[t] / i | 0, r[t] %= i);
    }
    return r.reverse();
}
function pn(e, n) {
    var i, t, r;
    if (n.isZero()) return n;
    t = n.d.length, t < 32 ? (i = Math.ceil(t / 3), r = (1 / le(4, i)).toString()) : (i = 16, r = "2.3283064365386962890625e-10"), e.precision += i, n = j(e, 1, n.times(r), new e(1));
    for(var s = i; s--;){
        var o = n.times(n);
        n = o.times(o).minus(o).times(8).plus(1);
    }
    return e.precision -= i, n;
}
var k = function() {
    function e(t, r, s) {
        var o, u = 0, c = t.length;
        for(t = t.slice(); c--;)o = t[c] * r + u, t[c] = o % s | 0, u = o / s | 0;
        return u && t.unshift(u), t;
    }
    function n(t, r, s, o) {
        var u, c;
        if (s != o) c = s > o ? 1 : -1;
        else for(u = c = 0; u < s; u++)if (t[u] != r[u]) {
            c = t[u] > r[u] ? 1 : -1;
            break;
        }
        return c;
    }
    function i(t, r, s, o) {
        for(var u = 0; s--;)t[s] -= u, u = t[s] < r[s] ? 1 : 0, t[s] = u * o + t[s] - r[s];
        for(; !t[0] && t.length > 1;)t.shift();
    }
    return function(t, r, s, o, u, c) {
        var f, l, a, d, g, v, N, A, M, _, E, P, x, I, ae, z, W, de, T, y, ee = t.constructor, he = t.s == r.s ? 1 : -1, O = t.d, S = r.d;
        if (!O || !O[0] || !S || !S[0]) return new ee(!t.s || !r.s || (O ? S && O[0] == S[0] : !S) ? NaN : O && O[0] == 0 || !S ? he * 0 : he / 0);
        for(c ? (g = 1, l = t.e - r.e) : (c = D, g = m, l = R(t.e / g) - R(r.e / g)), T = S.length, W = O.length, M = new ee(he), _ = M.d = [], a = 0; S[a] == (O[a] || 0); a++);
        if (S[a] > (O[a] || 0) && l--, s == null ? (I = s = ee.precision, o = ee.rounding) : u ? I = s + (t.e - r.e) + 1 : I = s, I < 0) _.push(1), v = !0;
        else {
            if (I = I / g + 2 | 0, a = 0, T == 1) {
                for(d = 0, S = S[0], I++; (a < W || d) && I--; a++)ae = d * c + (O[a] || 0), _[a] = ae / S | 0, d = ae % S | 0;
                v = d || a < W;
            } else {
                for(d = c / (S[0] + 1) | 0, d > 1 && (S = e(S, d, c), O = e(O, d, c), T = S.length, W = O.length), z = T, E = O.slice(0, T), P = E.length; P < T;)E[P++] = 0;
                y = S.slice(), y.unshift(0), de = S[0], S[1] >= c / 2 && ++de;
                do d = 0, f = n(S, E, T, P), f < 0 ? (x = E[0], T != P && (x = x * c + (E[1] || 0)), d = x / de | 0, d > 1 ? (d >= c && (d = c - 1), N = e(S, d, c), A = N.length, P = E.length, f = n(N, E, A, P), f == 1 && (d--, i(N, T < A ? y : S, A, c))) : (d == 0 && (f = d = 1), N = S.slice()), A = N.length, A < P && N.unshift(0), i(E, N, P, c), f == -1 && (P = E.length, f = n(S, E, T, P), f < 1 && (d++, i(E, T < P ? y : S, P, c))), P = E.length) : f === 0 && (d++, E = [
                    0
                ]), _[a++] = d, f && E[0] ? E[P++] = O[z] || 0 : (E = [
                    O[z]
                ], P = 1);
                while ((z++ < W || E[0] !== void 0) && I--)
                v = E[0] !== void 0;
            }
            _[0] || _.shift();
        }
        if (g == 1) M.e = l, Le = v;
        else {
            for(a = 1, d = _[0]; d >= 10; d /= 10)a++;
            M.e = a + l * g - 1, p(M, u ? s + M.e + 1 : s, o, v);
        }
        return M;
    };
}();
function p(e, n, i, t) {
    var r, s, o, u, c, f, l, a, d, g = e.constructor;
    e: if (n != null) {
        if (a = e.d, !a) return e;
        for(r = 1, u = a[0]; u >= 10; u /= 10)r++;
        if (s = n - r, s < 0) s += m, o = n, l = a[d = 0], c = l / C(10, r - o - 1) % 10 | 0;
        else if (d = Math.ceil((s + 1) / m), u = a.length, d >= u) if (t) {
            for(; u++ <= d;)a.push(0);
            l = c = 0, r = 1, s %= m, o = s - m + 1;
        } else break e;
        else {
            for(l = u = a[d], r = 1; u >= 10; u /= 10)r++;
            s %= m, o = s - m + r, c = o < 0 ? 0 : l / C(10, r - o - 1) % 10 | 0;
        }
        if (t = t || n < 0 || a[d + 1] !== void 0 || (o < 0 ? l : l % C(10, r - o - 1)), f = i < 4 ? (c || t) && (i == 0 || i == (e.s < 0 ? 3 : 2)) : c > 5 || c == 5 && (i == 4 || t || i == 6 && (s > 0 ? o > 0 ? l / C(10, r - o) : 0 : a[d - 1]) % 10 & 1 || i == (e.s < 0 ? 8 : 7)), n < 1 || !a[0]) return a.length = 0, f ? (n -= e.e + 1, a[0] = C(10, (m - n % m) % m), e.e = -n || 0) : a[0] = e.e = 0, e;
        if (s == 0 ? (a.length = d, u = 1, d--) : (a.length = d + 1, u = C(10, m - s), a[d] = o > 0 ? (l / C(10, r - o) % C(10, o) | 0) * u : 0), f) for(;;)if (d == 0) {
            for(s = 1, o = a[0]; o >= 10; o /= 10)s++;
            for(o = a[0] += u, u = 1; o >= 10; o /= 10)u++;
            s != u && (e.e++, a[0] == D && (a[0] = 1));
            break;
        } else {
            if (a[d] += u, a[d] != D) break;
            a[d--] = 0, u = 1;
        }
        for(s = a.length; a[--s] === 0;)a.pop();
    }
    return w && (e.e > g.maxE ? (e.d = null, e.e = NaN) : e.e < g.minE && (e.e = 0, e.d = [
        0
    ])), e;
}
function L(e, n, i) {
    if (!e.isFinite()) return je(e);
    var t, r = e.e, s = b(e.d), o = s.length;
    return n ? (i && (t = i - o) > 0 ? s = s.charAt(0) + "." + s.slice(1) + U(t) : o > 1 && (s = s.charAt(0) + "." + s.slice(1)), s = s + (e.e < 0 ? "e" : "e+") + e.e) : r < 0 ? (s = "0." + U(-r - 1) + s, i && (t = i - o) > 0 && (s += U(t))) : r >= o ? (s += U(r + 1 - o), i && (t = i - r - 1) > 0 && (s = s + "." + U(t))) : ((t = r + 1) < o && (s = s.slice(0, t) + "." + s.slice(t)), i && (t = i - o) > 0 && (r + 1 === o && (s += "."), s += U(t))), s;
}
function ce(e, n) {
    var i = e[0];
    for(n *= m; i >= 10; i /= 10)n++;
    return n;
}
function ue(e, n, i) {
    if (n > hn) throw w = !0, i && (e.precision = i), Error(Ie);
    return p(new e(se), n, 1, !0);
}
function F(e, n, i) {
    if (n > Ce) throw Error(Ie);
    return p(new e(oe), n, i, !0);
}
function $e(e) {
    var n = e.length - 1, i = n * m + 1;
    if (n = e[n], n) {
        for(; n % 10 == 0; n /= 10)i--;
        for(n = e[0]; n >= 10; n /= 10)i++;
    }
    return i;
}
function U(e) {
    for(var n = ""; e--;)n += "0";
    return n;
}
function He(e, n, i, t) {
    var r, s = new e(1), o = Math.ceil(t / m + 4);
    for(w = !1;;){
        if (i % 2 && (s = s.times(n), De(s.d, o) && (r = !0)), i = R(i / 2), i === 0) {
            i = s.d.length - 1, r && s.d[i] === 0 && ++s.d[i];
            break;
        }
        n = n.times(n), De(n.d, o);
    }
    return w = !0, s;
}
function Te(e) {
    return e.d[e.d.length - 1] & 1;
}
function Ve(e, n, i) {
    for(var t, r, s = new e(n[0]), o = 0; ++o < n.length;){
        if (r = new e(n[o]), !r.s) {
            s = r;
            break;
        }
        t = s.cmp(r), (t === i || t === 0 && s.s === i) && (s = r);
    }
    return s;
}
function be(e, n) {
    var i, t, r, s, o, u, c, f = 0, l = 0, a = 0, d = e.constructor, g = d.rounding, v = d.precision;
    if (!e.d || !e.d[0] || e.e > 17) return new d(e.d ? e.d[0] ? e.s < 0 ? 0 : 1 / 0 : 1 : e.s ? e.s < 0 ? 0 : e : NaN);
    for(n == null ? (w = !1, c = v) : c = n, u = new d(.03125); e.e > -2;)e = e.times(u), a += 5;
    for(t = Math.log(C(2, a)) / Math.LN10 * 2 + 5 | 0, c += t, i = s = o = new d(1), d.precision = c;;){
        if (s = p(s.times(e), c, 1), i = i.times(++l), u = o.plus(k(s, i, c, 1)), b(u.d).slice(0, c) === b(o.d).slice(0, c)) {
            for(r = a; r--;)o = p(o.times(o), c, 1);
            if (n == null) if (f < 3 && Q(o.d, c - t, g, f)) d.precision = c += 10, i = s = u = new d(1), l = 0, f++;
            else return p(o, d.precision = v, g, w = !0);
            else return d.precision = v, o;
        }
        o = u;
    }
}
function B(e, n) {
    var i, t, r, s, o, u, c, f, l, a, d, g = 1, v = 10, N = e, A = N.d, M = N.constructor, _ = M.rounding, E = M.precision;
    if (N.s < 0 || !A || !A[0] || !N.e && A[0] == 1 && A.length == 1) return new M(A && !A[0] ? -1 / 0 : N.s != 1 ? NaN : A ? 0 : N);
    if (n == null ? (w = !1, l = E) : l = n, M.precision = l += v, i = b(A), t = i.charAt(0), Math.abs(s = N.e) < 15e14) {
        for(; t < 7 && t != 1 || t == 1 && i.charAt(1) > 3;)N = N.times(e), i = b(N.d), t = i.charAt(0), g++;
        s = N.e, t > 1 ? (N = new M("0." + i), s++) : N = new M(t + "." + i.slice(1));
    } else return f = ue(M, l + 2, E).times(s + ""), N = B(new M(t + "." + i.slice(1)), l - v).plus(f), M.precision = E, n == null ? p(N, E, _, w = !0) : N;
    for(a = N, c = o = N = k(N.minus(1), N.plus(1), l, 1), d = p(N.times(N), l, 1), r = 3;;){
        if (o = p(o.times(d), l, 1), f = c.plus(k(o, new M(r), l, 1)), b(f.d).slice(0, l) === b(c.d).slice(0, l)) if (c = c.times(2), s !== 0 && (c = c.plus(ue(M, l + 2, E).times(s + ""))), c = k(c, new M(g), l, 1), n == null) if (Q(c.d, l - v, _, u)) M.precision = l += v, f = o = N = k(a.minus(1), a.plus(1), l, 1), d = p(N.times(N), l, 1), r = u = 1;
        else return p(c, M.precision = E, _, w = !0);
        else return M.precision = E, c;
        c = f, r += 2;
    }
}
function je(e) {
    return String(e.s * e.s / 0);
}
function re(e, n) {
    var i, t, r;
    for((i = n.indexOf(".")) > -1 && (n = n.replace(".", "")), (t = n.search(/e/i)) > 0 ? (i < 0 && (i = t), i += +n.slice(t + 1), n = n.substring(0, t)) : i < 0 && (i = n.length), t = 0; n.charCodeAt(t) === 48; t++);
    for(r = n.length; n.charCodeAt(r - 1) === 48; --r);
    if (n = n.slice(t, r), n) {
        if (r -= t, e.e = i = i - t - 1, e.d = [], t = (i + 1) % m, i < 0 && (t += m), t < r) {
            for(t && e.d.push(+n.slice(0, t)), r -= m; t < r;)e.d.push(+n.slice(t, t += m));
            n = n.slice(t), t = m - n.length;
        } else t -= r;
        for(; t--;)n += "0";
        e.d.push(+n), w && (e.e > e.constructor.maxE ? (e.d = null, e.e = NaN) : e.e < e.constructor.minE && (e.e = 0, e.d = [
            0
        ]));
    } else e.e = 0, e.d = [
        0
    ];
    return e;
}
function gn(e, n) {
    var i, t, r, s, o, u, c, f, l;
    if (n.indexOf("_") > -1) {
        if (n = n.replace(/(\d)_(?=\d)/g, "$1"), Be.test(n)) return re(e, n);
    } else if (n === "Infinity" || n === "NaN") return +n || (e.s = NaN), e.e = NaN, e.d = null, e;
    if (ln.test(n)) i = 16, n = n.toLowerCase();
    else if (cn.test(n)) i = 2;
    else if (an.test(n)) i = 8;
    else throw Error($ + n);
    for(s = n.search(/p/i), s > 0 ? (c = +n.slice(s + 1), n = n.substring(2, s)) : n = n.slice(2), s = n.indexOf("."), o = s >= 0, t = e.constructor, o && (n = n.replace(".", ""), u = n.length, s = u - s, r = He(t, new t(i), s, s * 2)), f = te(n, i, D), l = f.length - 1, s = l; f[s] === 0; --s)f.pop();
    return s < 0 ? new t(e.s * 0) : (e.e = ce(f, l), e.d = f, w = !1, o && (e = k(e, r, u * 4)), c && (e = e.times(Math.abs(c) < 54 ? C(2, c) : Y.pow(2, c))), w = !0, e);
}
function mn(e, n) {
    var i, t = n.d.length;
    if (t < 3) return n.isZero() ? n : j(e, 2, n, n);
    i = 1.4 * Math.sqrt(t), i = i > 16 ? 16 : i | 0, n = n.times(1 / le(5, i)), n = j(e, 2, n, n);
    for(var r, s = new e(5), o = new e(16), u = new e(20); i--;)r = n.times(n), n = n.times(s.plus(r.times(o.times(r).minus(u))));
    return n;
}
function j(e, n, i, t, r) {
    var s, o, u, c, f = 1, l = e.precision, a = Math.ceil(l / m);
    for(w = !1, c = i.times(i), u = new e(t);;){
        if (o = k(u.times(c), new e(n++ * n++), l, 1), u = r ? t.plus(o) : t.minus(o), t = k(o.times(c), new e(n++ * n++), l, 1), o = u.plus(t), o.d[a] !== void 0) {
            for(s = a; o.d[s] === u.d[s] && s--;);
            if (s == -1) break;
        }
        s = u, u = t, t = o, o = s, f++;
    }
    return w = !0, o.d.length = a + 1, o;
}
function le(e, n) {
    for(var i = e; --n;)i *= e;
    return i;
}
function We(e, n) {
    var i, t = n.s < 0, r = F(e, e.precision, 1), s = r.times(.5);
    if (n = n.abs(), n.lte(s)) return Z = t ? 4 : 1, n;
    if (i = n.divToInt(r), i.isZero()) Z = t ? 3 : 2;
    else {
        if (n = n.minus(i.times(r)), n.lte(s)) return Z = Te(i) ? t ? 2 : 3 : t ? 4 : 1, n;
        Z = Te(i) ? t ? 1 : 4 : t ? 3 : 2;
    }
    return n.minus(r).abs();
}
function Pe(e, n, i, t) {
    var r, s, o, u, c, f, l, a, d, g = e.constructor, v = i !== void 0;
    if (v ? (q(i, 1, H), t === void 0 ? t = g.rounding : q(t, 0, 8)) : (i = g.precision, t = g.rounding), !e.isFinite()) l = je(e);
    else {
        for(l = L(e), o = l.indexOf("."), v ? (r = 2, n == 16 ? i = i * 4 - 3 : n == 8 && (i = i * 3 - 2)) : r = n, o >= 0 && (l = l.replace(".", ""), d = new g(1), d.e = l.length - o, d.d = te(L(d), 10, r), d.e = d.d.length), a = te(l, 10, r), s = c = a.length; a[--c] == 0;)a.pop();
        if (!a[0]) l = v ? "0p+0" : "0";
        else {
            if (o < 0 ? s-- : (e = new g(e), e.d = a, e.e = s, e = k(e, d, i, t, 0, r), a = e.d, s = e.e, f = Le), o = a[i], u = r / 2, f = f || a[i + 1] !== void 0, f = t < 4 ? (o !== void 0 || f) && (t === 0 || t === (e.s < 0 ? 3 : 2)) : o > u || o === u && (t === 4 || f || t === 6 && a[i - 1] & 1 || t === (e.s < 0 ? 8 : 7)), a.length = i, f) for(; ++a[--i] > r - 1;)a[i] = 0, i || (++s, a.unshift(1));
            for(c = a.length; !a[c - 1]; --c);
            for(o = 0, l = ""; o < c; o++)l += Se.charAt(a[o]);
            if (v) {
                if (c > 1) if (n == 16 || n == 8) {
                    for(o = n == 16 ? 4 : 3, --c; c % o; c++)l += "0";
                    for(a = te(l, r, n), c = a.length; !a[c - 1]; --c);
                    for(o = 1, l = "1."; o < c; o++)l += Se.charAt(a[o]);
                } else l = l.charAt(0) + "." + l.slice(1);
                l = l + (s < 0 ? "p" : "p+") + s;
            } else if (s < 0) {
                for(; ++s;)l = "0" + l;
                l = "0." + l;
            } else if (++s > c) for(s -= c; s--;)l += "0";
            else s < c && (l = l.slice(0, s) + "." + l.slice(s));
        }
        l = (n == 16 ? "0x" : n == 2 ? "0b" : n == 8 ? "0o" : "") + l;
    }
    return e.s < 0 ? "-" + l : l;
}
function De(e, n) {
    if (e.length > n) return e.length = n, !0;
}
function wn(e) {
    return new this(e).abs();
}
function Nn(e) {
    return new this(e).acos();
}
function vn(e) {
    return new this(e).acosh();
}
function En(e, n) {
    return new this(e).plus(n);
}
function kn(e) {
    return new this(e).asin();
}
function Sn(e) {
    return new this(e).asinh();
}
function Mn(e) {
    return new this(e).atan();
}
function Cn(e) {
    return new this(e).atanh();
}
function bn(e, n) {
    e = new this(e), n = new this(n);
    var i, t = this.precision, r = this.rounding, s = t + 4;
    return !e.s || !n.s ? i = new this(NaN) : !e.d && !n.d ? (i = F(this, s, 1).times(n.s > 0 ? .25 : .75), i.s = e.s) : !n.d || e.isZero() ? (i = n.s < 0 ? F(this, t, r) : new this(0), i.s = e.s) : !e.d || n.isZero() ? (i = F(this, s, 1).times(.5), i.s = e.s) : n.s < 0 ? (this.precision = s, this.rounding = 1, i = this.atan(k(e, n, s, 1)), n = F(this, s, 1), this.precision = t, this.rounding = r, i = e.s < 0 ? i.minus(n) : i.plus(n)) : i = this.atan(k(e, n, s, 1)), i;
}
function Pn(e) {
    return new this(e).cbrt();
}
function On(e) {
    return p(e = new this(e), e.e + 1, 2);
}
function Rn(e, n, i) {
    return new this(e).clamp(n, i);
}
function An(e) {
    if (!e || typeof e != "object") throw Error(fe + "Object expected");
    var n, i, t, r = e.defaults === !0, s = [
        "precision",
        1,
        H,
        "rounding",
        0,
        8,
        "toExpNeg",
        -V,
        0,
        "toExpPos",
        0,
        V,
        "maxE",
        0,
        V,
        "minE",
        -V,
        0,
        "modulo",
        0,
        9
    ];
    for(n = 0; n < s.length; n += 3)if (i = s[n], r && (this[i] = Me[i]), (t = e[i]) !== void 0) if (R(t) === t && t >= s[n + 1] && t <= s[n + 2]) this[i] = t;
    else throw Error($ + i + ": " + t);
    if (i = "crypto", r && (this[i] = Me[i]), (t = e[i]) !== void 0) if (t === !0 || t === !1 || t === 0 || t === 1) if (t) if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) this[i] = !0;
    else throw Error(Ze);
    else this[i] = !1;
    else throw Error($ + i + ": " + t);
    return this;
}
function qn(e) {
    return new this(e).cos();
}
function _n(e) {
    return new this(e).cosh();
}
function Ge(e) {
    var n, i, t;
    function r(s) {
        var o, u, c, f = this;
        if (!(f instanceof r)) return new r(s);
        if (f.constructor = r, Fe(s)) {
            f.s = s.s, w ? !s.d || s.e > r.maxE ? (f.e = NaN, f.d = null) : s.e < r.minE ? (f.e = 0, f.d = [
                0
            ]) : (f.e = s.e, f.d = s.d.slice()) : (f.e = s.e, f.d = s.d ? s.d.slice() : s.d);
            return;
        }
        if (c = typeof s, c === "number") {
            if (s === 0) {
                f.s = 1 / s < 0 ? -1 : 1, f.e = 0, f.d = [
                    0
                ];
                return;
            }
            if (s < 0 ? (s = -s, f.s = -1) : f.s = 1, s === ~~s && s < 1e7) {
                for(o = 0, u = s; u >= 10; u /= 10)o++;
                w ? o > r.maxE ? (f.e = NaN, f.d = null) : o < r.minE ? (f.e = 0, f.d = [
                    0
                ]) : (f.e = o, f.d = [
                    s
                ]) : (f.e = o, f.d = [
                    s
                ]);
                return;
            }
            if (s * 0 !== 0) {
                s || (f.s = NaN), f.e = NaN, f.d = null;
                return;
            }
            return re(f, s.toString());
        }
        if (c === "string") return (u = s.charCodeAt(0)) === 45 ? (s = s.slice(1), f.s = -1) : (u === 43 && (s = s.slice(1)), f.s = 1), Be.test(s) ? re(f, s) : gn(f, s);
        if (c === "bigint") return s < 0 ? (s = -s, f.s = -1) : f.s = 1, re(f, s.toString());
        throw Error($ + s);
    }
    if (r.prototype = h, r.ROUND_UP = 0, r.ROUND_DOWN = 1, r.ROUND_CEIL = 2, r.ROUND_FLOOR = 3, r.ROUND_HALF_UP = 4, r.ROUND_HALF_DOWN = 5, r.ROUND_HALF_EVEN = 6, r.ROUND_HALF_CEIL = 7, r.ROUND_HALF_FLOOR = 8, r.EUCLID = 9, r.config = r.set = An, r.clone = Ge, r.isDecimal = Fe, r.abs = wn, r.acos = Nn, r.acosh = vn, r.add = En, r.asin = kn, r.asinh = Sn, r.atan = Mn, r.atanh = Cn, r.atan2 = bn, r.cbrt = Pn, r.ceil = On, r.clamp = Rn, r.cos = qn, r.cosh = _n, r.div = Tn, r.exp = Dn, r.floor = Fn, r.hypot = Ln, r.ln = In, r.log = Zn, r.log10 = Bn, r.log2 = Un, r.max = $n, r.min = Hn, r.mod = Vn, r.mul = jn, r.pow = Wn, r.random = Gn, r.round = Jn, r.sign = Xn, r.sin = Kn, r.sinh = Qn, r.sqrt = Yn, r.sub = xn, r.sum = zn, r.tan = yn, r.tanh = ei, r.trunc = ni, e === void 0 && (e = {}), e && e.defaults !== !0) for(t = [
        "precision",
        "rounding",
        "toExpNeg",
        "toExpPos",
        "maxE",
        "minE",
        "modulo",
        "crypto"
    ], n = 0; n < t.length;)e.hasOwnProperty(i = t[n++]) || (e[i] = this[i]);
    return r.config(e), r;
}
function Tn(e, n) {
    return new this(e).div(n);
}
function Dn(e) {
    return new this(e).exp();
}
function Fn(e) {
    return p(e = new this(e), e.e + 1, 3);
}
function Ln() {
    var e, n, i = new this(0);
    for(w = !1, e = 0; e < arguments.length;)if (n = new this(arguments[e++]), n.d) i.d && (i = i.plus(n.times(n)));
    else {
        if (n.s) return w = !0, new this(1 / 0);
        i = n;
    }
    return w = !0, i.sqrt();
}
function Fe(e) {
    return e instanceof Y || e && e.toStringTag === Ue || !1;
}
function In(e) {
    return new this(e).ln();
}
function Zn(e, n) {
    return new this(e).log(n);
}
function Un(e) {
    return new this(e).log(2);
}
function Bn(e) {
    return new this(e).log(10);
}
function $n() {
    return Ve(this, arguments, -1);
}
function Hn() {
    return Ve(this, arguments, 1);
}
function Vn(e, n) {
    return new this(e).mod(n);
}
function jn(e, n) {
    return new this(e).mul(n);
}
function Wn(e, n) {
    return new this(e).pow(n);
}
function Gn(e) {
    var n, i, t, r, s = 0, o = new this(1), u = [];
    if (e === void 0 ? e = this.precision : q(e, 1, H), t = Math.ceil(e / m), this.crypto) if (crypto.getRandomValues) for(n = crypto.getRandomValues(new Uint32Array(t)); s < t;)r = n[s], r >= 429e7 ? n[s] = crypto.getRandomValues(new Uint32Array(1))[0] : u[s++] = r % 1e7;
    else if (crypto.randomBytes) {
        for(n = crypto.randomBytes(t *= 4); s < t;)r = n[s] + (n[s + 1] << 8) + (n[s + 2] << 16) + ((n[s + 3] & 127) << 24), r >= 214e7 ? crypto.randomBytes(4).copy(n, s) : (u.push(r % 1e7), s += 4);
        s = t / 4;
    } else throw Error(Ze);
    else for(; s < t;)u[s++] = Math.random() * 1e7 | 0;
    for(t = u[--s], e %= m, t && e && (r = C(10, m - e), u[s] = (t / r | 0) * r); u[s] === 0; s--)u.pop();
    if (s < 0) i = 0, u = [
        0
    ];
    else {
        for(i = -1; u[0] === 0; i -= m)u.shift();
        for(t = 1, r = u[0]; r >= 10; r /= 10)t++;
        t < m && (i -= m - t);
    }
    return o.e = i, o.d = u, o;
}
function Jn(e) {
    return p(e = new this(e), e.e + 1, this.rounding);
}
function Xn(e) {
    return e = new this(e), e.d ? e.d[0] ? e.s : 0 * e.s : e.s || NaN;
}
function Kn(e) {
    return new this(e).sin();
}
function Qn(e) {
    return new this(e).sinh();
}
function Yn(e) {
    return new this(e).sqrt();
}
function xn(e, n) {
    return new this(e).sub(n);
}
function zn() {
    var e = 0, n = arguments, i = new this(n[e]);
    for(w = !1; i.s && ++e < n.length;)i = i.plus(n[e]);
    return w = !0, p(i, this.precision, this.rounding);
}
function yn(e) {
    return new this(e).tan();
}
function ei(e) {
    return new this(e).tanh();
}
function ni(e) {
    return p(e = new this(e), e.e + 1, 1);
}
h[Symbol.for("nodejs.util.inspect.custom")] = h.toString;
h[Symbol.toStringTag] = "Decimal";
var Y = h.constructor = Ge(Me);
se = new Y(se);
oe = new Y(oe);
var Je = Y;
0 && (module.exports = {
    Decimal,
    Public,
    getRuntime,
    makeStrictEnum,
    objectEnumValues
}); /*! Bundled license information:

decimal.js/decimal.mjs:
  (*!
   *  decimal.js v10.5.0
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   *)
*/  //# sourceMappingURL=index-browser.js.map
}),
"[project]/Demo-2/node_modules/.prisma/client/index-browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */ Object.defineProperty(exports, "__esModule", {
    value: true
});
const { Decimal, objectEnumValues, makeStrictEnum, Public, getRuntime, skip } = __turbopack_context__.r("[project]/Demo-2/node_modules/@prisma/client/runtime/index-browser.js [app-client] (ecmascript)");
const Prisma = {};
exports.Prisma = Prisma;
exports.$Enums = {};
/**
 * Prisma Client JS version: 6.17.1
 * Query Engine version: 272a37d34178c2894197e17273bf937f25acdeac
 */ Prisma.prismaVersion = {
    client: "6.17.1",
    engine: "272a37d34178c2894197e17273bf937f25acdeac"
};
Prisma.PrismaClientKnownRequestError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientUnknownRequestError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientRustPanicError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientInitializationError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientValidationError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.Decimal = Decimal;
/**
 * Re-export of sql-template-tag
 */ Prisma.sql = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.empty = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.join = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.raw = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.validator = Public.validator;
/**
* Extensions
*/ Prisma.getExtensionContext = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.defineExtension = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
/**
 * Shorthand utilities for JSON filtering
 */ Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;
Prisma.NullTypes = {
    DbNull: objectEnumValues.classes.DbNull,
    JsonNull: objectEnumValues.classes.JsonNull,
    AnyNull: objectEnumValues.classes.AnyNull
};
/**
 * Enums
 */ exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.Prisma.StackUserScalarFieldEnum = {
    id: 'id',
    primaryEmail: 'primaryEmail',
    displayName: 'displayName',
    profileImageUrl: 'profileImageUrl',
    primaryEmailVerified: 'primaryEmailVerified',
    lastActiveAt: 'lastActiveAt',
    userId: 'userId',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    username: 'username',
    password: 'password',
    fullName: 'fullName',
    cnpj: 'cnpj',
    birthDate: 'birthDate',
    isAdmin: 'isAdmin',
    stackUserId: 'stackUserId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    tarefasSessionSlot: 'tarefasSessionSlot',
    palavrasChaveReclamacao: 'palavrasChaveReclamacao'
};
exports.Prisma.UserAPIScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    name: 'name',
    type: 'type',
    apiKey: 'apiKey',
    baseUrl: 'baseUrl',
    storeId: 'storeId',
    status: 'status',
    isSyncing: 'isSyncing',
    enabled: 'enabled',
    lastTest: 'lastTest',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.StoreScalarFieldEnum = {
    id: 'id',
    name: 'name',
    address: 'address',
    phone: 'phone',
    cnpj: 'cnpj',
    managerName: 'managerName',
    abbreviation: 'abbreviation',
    displayOrder: 'displayOrder',
    isActive: 'isActive',
    lastOvenMaintenance: 'lastOvenMaintenance',
    lastRefrigeratorMaintenance: 'lastRefrigeratorMaintenance',
    lastPestControl: 'lastPestControl',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.SalesDailyScalarFieldEnum = {
    id: 'id',
    apiId: 'apiId',
    storeId: 'storeId',
    date: 'date',
    totalOrders: 'totalOrders',
    totalSales: 'totalSales',
    uniqueCustomers: 'uniqueCustomers',
    channels: 'channels',
    createdAt: 'createdAt'
};
exports.Prisma.SaleScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    storeId: 'storeId',
    externalId: 'externalId',
    saleDateUtc: 'saleDateUtc',
    totalAmount: 'totalAmount',
    rawJson: 'rawJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.SalesRawPageScalarFieldEnum = {
    id: 'id',
    syncRunId: 'syncRunId',
    pageIndex: 'pageIndex',
    payload: 'payload',
    createdAt: 'createdAt'
};
exports.Prisma.SyncRunScalarFieldEnum = {
    id: 'id',
    userApiId: 'userApiId',
    storeId: 'storeId',
    status: 'status',
    startPeriod: 'startPeriod',
    endPeriod: 'endPeriod',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    lastUrl: 'lastUrl',
    totalRequests: 'totalRequests',
    totalRecordsRaw: 'totalRecordsRaw',
    totalAfterFilter: 'totalAfterFilter',
    syncedCount: 'syncedCount',
    errorsCount: 'errorsCount'
};
exports.Prisma.SyncErrorScalarFieldEnum = {
    id: 'id',
    syncRunId: 'syncRunId',
    message: 'message',
    payloadPreview: 'payloadPreview',
    createdAt: 'createdAt'
};
exports.Prisma.WhatsAppBotScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    slot: 'slot',
    status: 'status',
    isConnected: 'isConnected',
    connectedNumber: 'connectedNumber',
    sessionJson: 'sessionJson',
    label: 'label',
    iaAtiva: 'iaAtiva',
    iaPrompt: 'iaPrompt',
    monitorarReclamacoes: 'monitorarReclamacoes',
    provider: 'provider',
    qrCode: 'qrCode',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.WhatsAppMessageScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    sessionSlot: 'sessionSlot',
    direction: 'direction',
    contactId: 'contactId',
    contactName: 'contactName',
    messageType: 'messageType',
    textContent: 'textContent',
    mediaUrl: 'mediaUrl',
    sentByAgent: 'sentByAgent',
    whatsappMessageId: 'whatsappMessageId',
    timestamp: 'timestamp',
    complaintProcessedAt: 'complaintProcessedAt',
    createdAt: 'createdAt'
};
exports.Prisma.BotSettingsScalarFieldEnum = {
    userId: 'userId',
    botName: 'botName',
    storeType: 'storeType',
    contextLimit: 'contextLimit',
    lineLimit: 'lineLimit',
    basePrompt: 'basePrompt',
    forbidden: 'forbidden',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ChecklistCategoryScalarFieldEnum = {
    id: 'id',
    nome: 'nome',
    ordem: 'ordem',
    criadaEm: 'criadaEm'
};
exports.Prisma.ChecklistItemTemplateScalarFieldEnum = {
    id: 'id',
    categoriaId: 'categoriaId',
    nome: 'nome',
    weight: 'weight',
    fotoObrigatoria: 'fotoObrigatoria',
    ativo: 'ativo',
    ordem: 'ordem',
    criadaEm: 'criadaEm',
    atualizadaEm: 'atualizadaEm'
};
exports.Prisma.EvaluationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    storeId: 'storeId',
    storeName: 'storeName',
    supervisorName: 'supervisorName',
    evaluationDate: 'evaluationDate',
    totalScore: 'totalScore',
    maxTotalScore: 'maxTotalScore',
    status: 'status',
    maintenanceList: 'maintenanceList',
    improvementSuggestions: 'improvementSuggestions',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.TopicScoreScalarFieldEnum = {
    id: 'id',
    evaluationId: 'evaluationId',
    topicName: 'topicName',
    topicScore: 'topicScore',
    maxScore: 'maxScore',
    observations: 'observations',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ItemScoreScalarFieldEnum = {
    id: 'id',
    evaluationId: 'evaluationId',
    topicName: 'topicName',
    itemName: 'itemName',
    itemScore: 'itemScore',
    maxScore: 'maxScore',
    status: 'status',
    observations: 'observations',
    photoUrls: 'photoUrls',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ChecklistDraftScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    storeId: 'storeId',
    storeName: 'storeName',
    supervisorName: 'supervisorName',
    evaluationDate: 'evaluationDate',
    checklistData: 'checklistData',
    totalItems: 'totalItems',
    totalPhotos: 'totalPhotos',
    totalComments: 'totalComments',
    lastSaved: 'lastSaved',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
};
exports.Prisma.EtiquetagemUnidadeScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    nomeExibicao: 'nomeExibicao',
    cnpj: 'cnpj',
    cnpjFormatado: 'cnpjFormatado',
    cidade: 'cidade',
    codigoInterno: 'codigoInterno',
    isAtivo: 'isAtivo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.EtiquetagemCategoriaScalarFieldEnum = {
    id: 'id',
    nome: 'nome',
    temperaturaArmazenamento: 'temperaturaArmazenamento',
    validadeDescongelado: 'validadeDescongelado',
    validadeResfriado: 'validadeResfriado',
    validadePreparado: 'validadePreparado',
    validadePorcionado: 'validadePorcionado',
    validadeCongeladoMedio: 'validadeCongeladoMedio',
    validadeCongeladoProfundo: 'validadeCongeladoProfundo',
    isAtivo: 'isAtivo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.EtiquetagemProcessoScalarFieldEnum = {
    id: 'id',
    nome: 'nome',
    isRequerRefrigeracao: 'isRequerRefrigeracao',
    isAtivo: 'isAtivo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.EtiquetagemProdutoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    nome: 'nome',
    categoriaId: 'categoriaId',
    pesoPadrao: 'pesoPadrao',
    unidadeMedida: 'unidadeMedida',
    marcaFornecedor: 'marcaFornecedor',
    tipoArmazenamentoPadrao: 'tipoArmazenamentoPadrao',
    isAtivo: 'isAtivo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.EtiquetagemNomeResponsavelScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    unidadeId: 'unidadeId',
    nomeCompleto: 'nomeCompleto',
    primeiraUtilizacao: 'primeiraUtilizacao',
    ultimaUtilizacao: 'ultimaUtilizacao',
    totalUsos: 'totalUsos',
    isAtivo: 'isAtivo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.EtiquetagemEtiquetaScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    produtoId: 'produtoId',
    unidadeId: 'unidadeId',
    processoId: 'processoId',
    dataValidadeOriginal: 'dataValidadeOriginal',
    dataHoraManipulacao: 'dataHoraManipulacao',
    dataHoraValidade: 'dataHoraValidade',
    pesoQuantidade: 'pesoQuantidade',
    unidadeMedida: 'unidadeMedida',
    responsavelNome: 'responsavelNome',
    responsavelId: 'responsavelId',
    temperaturaArmazenamento: 'temperaturaArmazenamento',
    codigoEtiqueta: 'codigoEtiqueta',
    marcaFornecedor: 'marcaFornecedor',
    periodoDias: 'periodoDias',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.AdminUserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    role: 'role',
    isActive: 'isActive',
    clientId: 'clientId',
    lastLogin: 'lastLogin',
    passwordResetToken: 'passwordResetToken',
    passwordResetExpires: 'passwordResetExpires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.AdminUserPermissionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    permission: 'permission',
    createdAt: 'createdAt'
};
exports.Prisma.AdminSessionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    token: 'token',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
exports.Prisma.AdminAuditLogScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    details: 'details',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
};
exports.Prisma.AdminClientScalarFieldEnum = {
    id: 'id',
    name: 'name',
    cnpj: 'cnpj',
    databaseSchema: 'databaseSchema',
    isActive: 'isActive',
    maxUsers: 'maxUsers',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CmvStoreDataScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    storeSlug: 'storeSlug',
    data: 'data',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.EstoqueInsumoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    insumoId: 'insumoId',
    nome: 'nome',
    unidade: 'unidade',
    categoriaId: 'categoriaId',
    categoriaNome: 'categoriaNome',
    categoriaIcone: 'categoriaIcone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.EstoqueContagemScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    status: 'status',
    criadoPor: 'criadoPor',
    lojaNome: 'lojaNome',
    sessoes: 'sessoes',
    dataCriacao: 'dataCriacao',
    updatedAt: 'updatedAt'
};
exports.Prisma.EstoqueProdutoConfigScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    produtoId: 'produtoId',
    ativo: 'ativo',
    estoqueMinimo: 'estoqueMinimo',
    modoContagem: 'modoContagem',
    kgPorUnidade: 'kgPorUnidade',
    updatedAt: 'updatedAt'
};
exports.Prisma.EstoqueProdutoOrdemScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    ordem: 'ordem',
    updatedAt: 'updatedAt'
};
exports.Prisma.IfoodConnectionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    merchantId: 'merchantId',
    merchantName: 'merchantName',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.IfoodOrderScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    displayId: 'displayId',
    merchantId: 'merchantId',
    userId: 'userId',
    status: 'status',
    orderType: 'orderType',
    orderTiming: 'orderTiming',
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    deliveryAddress: 'deliveryAddress',
    items: 'items',
    payments: 'payments',
    totalAmount: 'totalAmount',
    deliveryFee: 'deliveryFee',
    isTest: 'isTest',
    rawPayload: 'rawPayload',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.IfoodTokenScalarFieldEnum = {
    id: 'id',
    accessToken: 'accessToken',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.IfoodFinancialEventScalarFieldEnum = {
    id: 'id',
    merchantId: 'merchantId',
    userId: 'userId',
    eventType: 'eventType',
    amount: 'amount',
    description: 'description',
    referenceDate: 'referenceDate',
    orderId: 'orderId',
    rawData: 'rawData',
    createdAt: 'createdAt'
};
exports.Prisma.IfoodSettlementScalarFieldEnum = {
    id: 'id',
    merchantId: 'merchantId',
    userId: 'userId',
    settlementDate: 'settlementDate',
    grossAmount: 'grossAmount',
    netAmount: 'netAmount',
    commission: 'commission',
    fees: 'fees',
    rawData: 'rawData',
    createdAt: 'createdAt'
};
exports.Prisma.IfoodCatalogItemScalarFieldEnum = {
    id: 'id',
    itemId: 'itemId',
    merchantId: 'merchantId',
    userId: 'userId',
    name: 'name',
    description: 'description',
    price: 'price',
    originalPrice: 'originalPrice',
    status: 'status',
    category: 'category',
    categoryId: 'categoryId',
    imageUrl: 'imageUrl',
    rawData: 'rawData',
    syncedAt: 'syncedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.IfoodCatalogChangeLogScalarFieldEnum = {
    id: 'id',
    itemId: 'itemId',
    itemName: 'itemName',
    merchantId: 'merchantId',
    userId: 'userId',
    changeType: 'changeType',
    oldValue: 'oldValue',
    newValue: 'newValue',
    createdAt: 'createdAt'
};
exports.Prisma.RhLojaScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    nome: 'nome',
    cnpj: 'cnpj',
    endereco: 'endereco',
    latitude: 'latitude',
    longitude: 'longitude',
    raioVerificacaoM: 'raioVerificacaoM',
    fap: 'fap',
    ativo: 'ativo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RhCargoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    nome: 'nome',
    descricao: 'descricao',
    ratPct: 'ratPct',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RhFuncionarioScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    nome: 'nome',
    cpf: 'cpf',
    email: 'email',
    telefone: 'telefone',
    dataNascimento: 'dataNascimento',
    dataAdmissao: 'dataAdmissao',
    cargoId: 'cargoId',
    lojaId: 'lojaId',
    salarioBase: 'salarioBase',
    valorAlimentacao: 'valorAlimentacao',
    valorVT: 'valorVT',
    cargoResponsabilidade: 'cargoResponsabilidade',
    bonificacaoAssiduidade: 'bonificacaoAssiduidade',
    escala: 'escala',
    turno: 'turno',
    horarioEntrada: 'horarioEntrada',
    horarioSaida: 'horarioSaida',
    horarioDigest: 'horarioDigest',
    diasFolga: 'diasFolga',
    domingoFolga: 'domingoFolga',
    observacoes: 'observacoes',
    ativo: 'ativo',
    dataInicioExperiencia: 'dataInicioExperiencia',
    dataFimExperiencia1: 'dataFimExperiencia1',
    dataFimExperiencia2: 'dataFimExperiencia2',
    dataInicioFerias: 'dataInicioFerias',
    dataGozoFerias: 'dataGozoFerias',
    statusFerias: 'statusFerias',
    diasFeriasGozados: 'diasFeriasGozados',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    numeroFolha: 'numeroFolha',
    pisSecullum: 'pisSecullum',
    codigoEmpregadoSecullum: 'codigoEmpregadoSecullum'
};
exports.Prisma.RhEscalaVigenciaScalarFieldEnum = {
    id: 'id',
    funcionarioId: 'funcionarioId',
    vigenciaInicio: 'vigenciaInicio',
    vigenciaFim: 'vigenciaFim',
    escala: 'escala',
    diasFolga: 'diasFolga',
    domingoFolga: 'domingoFolga',
    horarioEntrada: 'horarioEntrada',
    horarioSaida: 'horarioSaida',
    createdAt: 'createdAt'
};
exports.Prisma.PontoRegistroScalarFieldEnum = {
    id: 'id',
    funcionarioId: 'funcionarioId',
    data: 'data',
    entrada1: 'entrada1',
    saida1: 'saida1',
    entrada2: 'entrada2',
    saida2: 'saida2',
    entrada3: 'entrada3',
    saida3: 'saida3',
    compensado: 'compensado',
    neutro: 'neutro',
    folga: 'folga',
    observacoes: 'observacoes',
    batidaIdSecullum: 'batidaIdSecullum',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.PontoPendenciaScalarFieldEnum = {
    id: 'id',
    numeroFolhaOrigem: 'numeroFolhaOrigem',
    nomeSugerido: 'nomeSugerido',
    data: 'data',
    payloadBruto: 'payloadBruto',
    resolvida: 'resolvida',
    createdAt: 'createdAt'
};
exports.Prisma.FechamentoMensalScalarFieldEnum = {
    id: 'id',
    mes: 'mes',
    ano: 'ano',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.FechamentoLinhaScalarFieldEnum = {
    id: 'id',
    fechamentoId: 'fechamentoId',
    funcionarioId: 'funcionarioId',
    ex60: 'ex60',
    ex100: 'ex100',
    en60: 'en60',
    en100: 'en100',
    atraso: 'atraso',
    faltas: 'faltas',
    faltaDsr: 'faltaDsr',
    faltasSecullum: 'faltasSecullum',
    faltaDsrSecullum: 'faltaDsrSecullum',
    valeTransporte: 'valeTransporte',
    descDiversos: 'descDiversos',
    descRefeicao: 'descRefeicao',
    descCompras: 'descCompras',
    status: 'status',
    observacao: 'observacao',
    origemErro: 'origemErro',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RhBonificacaoTrimestralScalarFieldEnum = {
    id: 'id',
    funcionarioId: 'funcionarioId',
    valor: 'valor',
    trimestre: 'trimestre',
    ano: 'ano',
    dataPagamento: 'dataPagamento',
    motivo: 'motivo',
    registradoPor: 'registradoPor',
    ativo: 'ativo',
    createdAt: 'createdAt'
};
exports.Prisma.RhBonificacaoAssiduidadeScalarFieldEnum = {
    id: 'id',
    funcionarioId: 'funcionarioId',
    mes: 'mes',
    ano: 'ano',
    valorDireito: 'valorDireito',
    recebeu: 'recebeu',
    motivo: 'motivo',
    registradoPor: 'registradoPor',
    viaIA: 'viaIA',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RhPLRTrimestralScalarFieldEnum = {
    id: 'id',
    lojaId: 'lojaId',
    trimestre: 'trimestre',
    ano: 'ano',
    valorTotal: 'valorTotal',
    valorPorFuncionario: 'valorPorFuncionario',
    metaBatida: 'metaBatida',
    observacao: 'observacao',
    registradoPor: 'registradoPor',
    viaIA: 'viaIA',
    createdAt: 'createdAt'
};
exports.Prisma.RhPLRPagamentoScalarFieldEnum = {
    id: 'id',
    plrId: 'plrId',
    funcionarioId: 'funcionarioId',
    valor: 'valor',
    createdAt: 'createdAt'
};
exports.Prisma.RhHistoricoFuncionarioScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    funcionarioId: 'funcionarioId',
    campo: 'campo',
    valorAnterior: 'valorAnterior',
    valorNovo: 'valorNovo',
    alteradoPor: 'alteradoPor',
    motivo: 'motivo',
    createdAt: 'createdAt'
};
exports.Prisma.RhQuadroIdealScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    lojaId: 'lojaId',
    nome: 'nome',
    ativo: 'ativo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RhSetorIdealScalarFieldEnum = {
    id: 'id',
    quadroIdealId: 'quadroIdealId',
    nome: 'nome',
    descricao: 'descricao',
    ordem: 'ordem',
    ativo: 'ativo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RhPosicaoIdealScalarFieldEnum = {
    id: 'id',
    setorId: 'setorId',
    cargoId: 'cargoId',
    turno: 'turno',
    quantidadeIdeal: 'quantidadeIdeal',
    observacoes: 'observacoes',
    ativo: 'ativo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RhIaConversaScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    titulo: 'titulo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RhIaMensagemScalarFieldEnum = {
    id: 'id',
    conversaId: 'conversaId',
    role: 'role',
    content: 'content',
    citacoes: 'citacoes',
    isError: 'isError',
    createdAt: 'createdAt'
};
exports.Prisma.ChatConversaScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    titulo: 'titulo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ChatMensagemScalarFieldEnum = {
    id: 'id',
    conversaId: 'conversaId',
    role: 'role',
    content: 'content',
    isError: 'isError',
    createdAt: 'createdAt'
};
exports.Prisma.RhDocumentoFuncionarioScalarFieldEnum = {
    id: 'id',
    funcionarioId: 'funcionarioId',
    userId: 'userId',
    tipo: 'tipo',
    nome: 'nome',
    url: 'url',
    tamanhoBytes: 'tamanhoBytes',
    dataVencimento: 'dataVencimento',
    mesReferencia: 'mesReferencia',
    anoReferencia: 'anoReferencia',
    observacoes: 'observacoes',
    ativo: 'ativo',
    uploadadoPor: 'uploadadoPor',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RhOcorrenciaScalarFieldEnum = {
    id: 'id',
    funcionarioId: 'funcionarioId',
    userId: 'userId',
    tipo: 'tipo',
    data: 'data',
    descricao: 'descricao',
    gravidade: 'gravidade',
    testemunhas: 'testemunhas',
    providencia: 'providencia',
    cidAfastamento: 'cidAfastamento',
    dataInicioAfastamento: 'dataInicioAfastamento',
    dataFimAfastamento: 'dataFimAfastamento',
    registradoPor: 'registradoPor',
    ativo: 'ativo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RhSnapshotCustoMensalScalarFieldEnum = {
    id: 'id',
    lojaId: 'lojaId',
    userId: 'userId',
    mes: 'mes',
    ano: 'ano',
    totalFuncionarios: 'totalFuncionarios',
    totalSalarioBruto: 'totalSalarioBruto',
    totalEncargos: 'totalEncargos',
    totalCustoReal: 'totalCustoReal',
    custoAnualizado: 'custoAnualizado',
    geradoEm: 'geradoEm'
};
exports.Prisma.RhTransferenciaLojaScalarFieldEnum = {
    id: 'id',
    funcionarioId: 'funcionarioId',
    lojaOrigemId: 'lojaOrigemId',
    lojaDestinoId: 'lojaDestinoId',
    userId: 'userId',
    dataTransferencia: 'dataTransferencia',
    motivo: 'motivo',
    aprovadoPor: 'aprovadoPor',
    createdAt: 'createdAt'
};
exports.Prisma.RhTaxaLojaScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    lojaId: 'lojaId',
    nome: 'nome',
    valorDiaria: 'valorDiaria',
    diasPorMes: 'diasPorMes',
    quantidadeIdeal: 'quantidadeIdeal',
    observacoes: 'observacoes',
    ativo: 'ativo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.DeliveryRiderScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    lojaId: 'lojaId',
    name: 'name',
    cnpj: 'cnpj',
    email: 'email',
    phone: 'phone',
    status: 'status',
    passwordHash: 'passwordHash',
    inviteToken: 'inviteToken',
    inviteTokenExpiresAt: 'inviteTokenExpiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RiderPaymentPeriodScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    riderId: 'riderId',
    lojaId: 'lojaId',
    periodLabel: 'periodLabel',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd',
    deliveryCount: 'deliveryCount',
    amountCents: 'amountCents',
    dailyRateCents: 'dailyRateCents',
    discountCents: 'discountCents',
    discountNotes: 'discountNotes',
    summary: 'summary',
    status: 'status',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RiderDocumentScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    periodId: 'periodId',
    riderId: 'riderId',
    documentType: 'documentType',
    fileName: 'fileName',
    storagePath: 'storagePath',
    uploadedAt: 'uploadedAt',
    status: 'status',
    reviewedBy: 'reviewedBy',
    reviewedAt: 'reviewedAt'
};
exports.Prisma.RhTeamMemberScalarFieldEnum = {
    id: 'id',
    tenantUserId: 'tenantUserId',
    stackUserId: 'stackUserId',
    email: 'email',
    displayName: 'displayName',
    isActive: 'isActive',
    invitedBy: 'invitedBy',
    lojas: 'lojas',
    perfil: 'perfil',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RhPermissionScalarFieldEnum = {
    id: 'id',
    memberId: 'memberId',
    permission: 'permission',
    grantedBy: 'grantedBy',
    grantedAt: 'grantedAt'
};
exports.Prisma.UserToolPermissionScalarFieldEnum = {
    id: 'id',
    stackUserId: 'stackUserId',
    tool: 'tool',
    isEnabled: 'isEnabled',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.SystemConfigScalarFieldEnum = {
    id: 'id',
    key: 'key',
    value: 'value',
    label: 'label',
    updatedAt: 'updatedAt'
};
exports.Prisma.TarefaTemplateScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    titulo: 'titulo',
    descricao: 'descricao',
    exigeFoto: 'exigeFoto',
    exigeConfirmacaoTexto: 'exigeConfirmacaoTexto',
    exigeLocalizacao: 'exigeLocalizacao',
    exigeArquivo: 'exigeArquivo',
    validacaoIA: 'validacaoIA',
    recorrenciaTipo: 'recorrenciaTipo',
    diasSemana: 'diasSemana',
    mensalModo: 'mensalModo',
    diaDoMes: 'diaDoMes',
    nth: 'nth',
    weekday: 'weekday',
    horarioPadrao: 'horarioPadrao',
    lojaId: 'lojaId',
    cargoId: 'cargoId',
    ativo: 'ativo',
    criadoPor: 'criadoPor',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.TarefaGrupoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    nome: 'nome',
    descricao: 'descricao',
    ativo: 'ativo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.TarefaGrupoItemScalarFieldEnum = {
    id: 'id',
    grupoId: 'grupoId',
    templateId: 'templateId',
    ordem: 'ordem'
};
exports.Prisma.TarefaSerieScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    templateId: 'templateId',
    funcionarioId: 'funcionarioId',
    lojaId: 'lojaId',
    horario: 'horario',
    tipo: 'tipo',
    diasSemana: 'diasSemana',
    mensalModo: 'mensalModo',
    diaDoMes: 'diaDoMes',
    nth: 'nth',
    weekday: 'weekday',
    renovarAuto: 'renovarAuto',
    ativo: 'ativo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.TarefaAtribuidaScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    templateId: 'templateId',
    funcionarioId: 'funcionarioId',
    lojaId: 'lojaId',
    serieId: 'serieId',
    dataAgendada: 'dataAgendada',
    status: 'status',
    enviadaEm: 'enviadaEm',
    concluidaEm: 'concluidaEm',
    minutosAtraso: 'minutosAtraso',
    emRevisaoAdm: 'emRevisaoAdm',
    revisadaPor: 'revisadaPor',
    revisadaEm: 'revisadaEm',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.SessaoTarefaScalarFieldEnum = {
    id: 'id',
    tarefaId: 'tarefaId',
    telefone: 'telefone',
    lid: 'lid',
    evidenciasExigidas: 'evidenciasExigidas',
    evidenciasRecebidas: 'evidenciasRecebidas',
    estado: 'estado',
    descricaoTarefa: 'descricaoTarefa',
    validacaoIA: 'validacaoIA',
    tentativasFoto: 'tentativasFoto',
    enviadaEm: 'enviadaEm',
    criadaEm: 'criadaEm',
    atualizadaEm: 'atualizadaEm'
};
exports.Prisma.TarefaEvidenciaScalarFieldEnum = {
    id: 'id',
    tarefaAtribuidaId: 'tarefaAtribuidaId',
    tipo: 'tipo',
    conteudoTexto: 'conteudoTexto',
    urlArquivo: 'urlArquivo',
    latitude: 'latitude',
    longitude: 'longitude',
    analiseIA: 'analiseIA',
    recebidaEm: 'recebidaEm'
};
exports.Prisma.ReportDefinitionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    nome: 'nome',
    fonte: 'fonte',
    horario: 'horario',
    escopoLoja: 'escopoLoja',
    destinoWhatsapp: 'destinoWhatsapp',
    sessionSlot: 'sessionSlot',
    ativo: 'ativo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ReportFieldScalarFieldEnum = {
    id: 'id',
    reportDefinitionId: 'reportDefinitionId',
    campoKey: 'campoKey',
    ordem: 'ordem'
};
exports.Prisma.SaiposFieldCatalogScalarFieldEnum = {
    key: 'key',
    label: 'label',
    grupo: 'grupo',
    ordem: 'ordem'
};
exports.Prisma.ReportExecutionScalarFieldEnum = {
    id: 'id',
    reportDefinitionId: 'reportDefinitionId',
    status: 'status',
    payload: 'payload',
    erro: 'erro',
    executadoEm: 'executadoEm'
};
exports.Prisma.ServiceApiKeyScalarFieldEnum = {
    id: 'id',
    key: 'key',
    nome: 'nome',
    userId: 'userId',
    ativo: 'ativo',
    createdAt: 'createdAt'
};
exports.Prisma.ComplaintReviewRunScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd',
    status: 'status',
    totalConversas: 'totalConversas',
    conversasProcessadas: 'conversasProcessadas',
    totalReclamacoes: 'totalReclamacoes',
    pendingContactIds: 'pendingContactIds',
    processedContactIds: 'processedContactIds',
    batchLockAt: 'batchLockAt',
    jobToken: 'jobToken',
    erro: 'erro',
    ataStoragePath: 'ataStoragePath',
    executadoEm: 'executadoEm'
};
exports.Prisma.IFoodComplaintGroupScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    groupWhatsAppId: 'groupWhatsAppId',
    lojaSlug: 'lojaSlug',
    lojaNome: 'lojaNome',
    sessionSlot: 'sessionSlot',
    ativo: 'ativo',
    createdAt: 'createdAt'
};
exports.Prisma.ComplaintScalarFieldEnum = {
    id: 'id',
    reviewRunId: 'reviewRunId',
    userId: 'userId',
    contactId: 'contactId',
    contactName: 'contactName',
    resumo: 'resumo',
    dataOcorrencia: 'dataOcorrencia',
    evidenciaMessageIds: 'evidenciaMessageIds',
    numeroPedido: 'numeroPedido',
    sessionSlot: 'sessionSlot',
    origem: 'origem',
    lojaGrupo: 'lojaGrupo',
    categoria: 'categoria',
    lojaId: 'lojaId',
    lojaIdentificada: 'lojaIdentificada',
    entregadorId: 'entregadorId',
    confirmadoPorHumano: 'confirmadoPorHumano',
    createdAt: 'createdAt'
};
exports.Prisma.TipoAvaliacaoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    lojaId: 'lojaId',
    lojaNome: 'lojaNome',
    nome: 'nome',
    modoCalculo: 'modoCalculo',
    entraNaMedia: 'entraNaMedia',
    metricas: 'metricas',
    descontos: 'descontos',
    faixas: 'faixas',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.BonificacaoTrimestreScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    lojaId: 'lojaId',
    lojaNome: 'lojaNome',
    tipoAvaliacaoId: 'tipoAvaliacaoId',
    ano: 'ano',
    trimestre: 'trimestre',
    dados: 'dados',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ComplaintComparisonScalarFieldEnum = {
    id: 'id',
    reviewRunId: 'reviewRunId',
    previousRunId: 'previousRunId',
    lojaId: 'lojaId',
    lojaNome: 'lojaNome',
    categoria: 'categoria',
    contagemMesAtual: 'contagemMesAtual',
    contagemMesAnterior: 'contagemMesAnterior',
    variacaoAbsoluta: 'variacaoAbsoluta',
    variacaoPercentual: 'variacaoPercentual',
    resumoTexto: 'resumoTexto',
    createdAt: 'createdAt'
};
exports.Prisma.CmvRealInsumoConfigScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    estoqueInsumoId: 'estoqueInsumoId',
    secao: 'secao',
    unidade: 'unidade',
    ordem: 'ordem',
    ativo: 'ativo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.NfeFornecedorScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    cnpj: 'cnpj',
    razaoSocial: 'razaoSocial',
    nomeFantasia: 'nomeFantasia',
    ignorarCmv: 'ignorarCmv',
    motivoIgnorar: 'motivoIgnorar',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.NfeNotaScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    storeSlug: 'storeSlug',
    saiposStoreId: 'saiposStoreId',
    saiposNotaId: 'saiposNotaId',
    chaveAcesso: 'chaveAcesso',
    numero: 'numero',
    fornecedorId: 'fornecedorId',
    dataEmissao: 'dataEmissao',
    dataEntrada: 'dataEntrada',
    dataCadastroSaipos: 'dataCadastroSaipos',
    competencia: 'competencia',
    valorTotal: 'valorTotal',
    somaItensLiquido: 'somaItensLiquido',
    status: 'status',
    tentativas: 'tentativas',
    ultimoErro: 'ultimoErro',
    alertas: 'alertas',
    conciliadaSaipos: 'conciliadaSaipos',
    saiposTransferenciaId: 'saiposTransferenciaId',
    rawReport: 'rawReport',
    rawDetalhe: 'rawDetalhe',
    aprovadaPorId: 'aprovadaPorId',
    aprovadaEm: 'aprovadaEm',
    aprovacaoAutomatica: 'aprovacaoAutomatica',
    aprovadaComAlerta: 'aprovadaComAlerta',
    aprovacaoRegra: 'aprovacaoRegra',
    reabertaPorId: 'reabertaPorId',
    reabertaEm: 'reabertaEm',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.NfeItemScalarFieldEnum = {
    id: 'id',
    notaId: 'notaId',
    saiposItemId: 'saiposItemId',
    numeroItem: 'numeroItem',
    descricao: 'descricao',
    descricaoNormalizada: 'descricaoNormalizada',
    ean: 'ean',
    ncm: 'ncm',
    cfop: 'cfop',
    unidadeComercial: 'unidadeComercial',
    quantidade: 'quantidade',
    valorBruto: 'valorBruto',
    valorLiquido: 'valorLiquido',
    estoqueInsumoId: 'estoqueInsumoId',
    mapeamentoId: 'mapeamentoId',
    fatorConversao: 'fatorConversao',
    quantidadeConvertida: 'quantidadeConvertida',
    unidadeConvertida: 'unidadeConvertida',
    custoUnitario: 'custoUnitario',
    fcpStRateado: 'fcpStRateado',
    fatorSugerido: 'fatorSugerido',
    fatorSugeridoOrigem: 'fatorSugeridoOrigem',
    status: 'status',
    sugestaoInsumoId: 'sugestaoInsumoId',
    sugestaoScore: 'sugestaoScore',
    sugestoes: 'sugestoes',
    alertas: 'alertas',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.NfeMapeamentoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    fornecedorId: 'fornecedorId',
    chave: 'chave',
    ean: 'ean',
    descricaoNormalizada: 'descricaoNormalizada',
    unidadeComercial: 'unidadeComercial',
    estoqueInsumoId: 'estoqueInsumoId',
    fatorConversao: 'fatorConversao',
    ignorar: 'ignorar',
    usos: 'usos',
    ultimoUsoEm: 'ultimoUsoEm',
    criadoPorId: 'criadoPorId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CmvLancamentoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    storeSlug: 'storeSlug',
    competencia: 'competencia',
    data: 'data',
    tipo: 'tipo',
    estoqueInsumoId: 'estoqueInsumoId',
    quantidade: 'quantidade',
    unidade: 'unidade',
    valorTotal: 'valorTotal',
    nfeItemId: 'nfeItemId',
    transferenciaItemId: 'transferenciaItemId',
    lojaOrigem: 'lojaOrigem',
    lojaDestino: 'lojaDestino',
    observacao: 'observacao',
    criadoPorId: 'criadoPorId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CmvSaldoEstoqueScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    storeSlug: 'storeSlug',
    competencia: 'competencia',
    estoqueInsumoId: 'estoqueInsumoId',
    qtdFinal: 'qtdFinal',
    custoMedio: 'custoMedio',
    custoOrigem: 'custoOrigem',
    custoOrigemDetalhe: 'custoOrigemDetalhe',
    origem: 'origem',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CmvFechamentoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    storeSlug: 'storeSlug',
    competencia: 'competencia',
    status: 'status',
    vendaMes: 'vendaMes',
    vendaMesOrigem: 'vendaMesOrigem',
    ajustes: 'ajustes',
    refeicoesFuncionarios: 'refeicoesFuncionarios',
    contagemId: 'contagemId',
    snapshot: 'snapshot',
    fechadoEm: 'fechadoEm',
    fechadoPorId: 'fechadoPorId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.NfeConfigScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    sessionSlot: 'sessionSlot',
    destinoPadrao: 'destinoPadrao',
    destinosPorLoja: 'destinosPorLoja',
    autoAprovar: 'autoAprovar',
    toleranciaTotalReais: 'toleranciaTotalReais',
    toleranciaTotalPercent: 'toleranciaTotalPercent',
    limiteVariacaoCustoPercent: 'limiteVariacaoCustoPercent',
    maxTentativas: 'maxTentativas',
    alertasQueBloqueiam: 'alertasQueBloqueiam',
    inicioCmvReal: 'inicioCmvReal',
    refeicaoRegras: 'refeicaoRegras',
    vendaMesConfig: 'vendaMesConfig',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CmvRefeicaoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    storeSlug: 'storeSlug',
    competencia: 'competencia',
    data: 'data',
    categoria: 'categoria',
    consumidor: 'consumidor',
    formaPagamento: 'formaPagamento',
    valorItens: 'valorItens',
    saiposSaleId: 'saiposSaleId',
    origem: 'origem',
    ignorada: 'ignorada',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CmvTransferenciaScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    numeroDocumento: 'numeroDocumento',
    data: 'data',
    competencia: 'competencia',
    lojaOrigem: 'lojaOrigem',
    lojaDestino: 'lojaDestino',
    status: 'status',
    origem: 'origem',
    saiposTransferenciaId: 'saiposTransferenciaId',
    nfeNotaId: 'nfeNotaId',
    anexoUrl: 'anexoUrl',
    anexoNome: 'anexoNome',
    observacao: 'observacao',
    criadoPorId: 'criadoPorId',
    editadoPorId: 'editadoPorId',
    editadoEm: 'editadoEm',
    excluidoPorId: 'excluidoPorId',
    excluidoEm: 'excluidoEm',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CmvTransferenciaLadoScalarFieldEnum = {
    id: 'id',
    transferenciaId: 'transferenciaId',
    tipo: 'tipo',
    storeSlug: 'storeSlug',
    registradoPorId: 'registradoPorId',
    registradoEm: 'registradoEm',
    rascunho: 'rascunho',
    congelado: 'congelado',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CmvTransferenciaItemScalarFieldEnum = {
    id: 'id',
    ladoId: 'ladoId',
    estoqueInsumoId: 'estoqueInsumoId',
    quantidade: 'quantidade',
    unidade: 'unidade',
    custoUnitario: 'custoUnitario',
    valorTotal: 'valorTotal',
    custoOrigem: 'custoOrigem',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.OcorrenciaScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    lojaId: 'lojaId',
    numeroPedidoSaipos: 'numeroPedidoSaipos',
    numeroPedidoExterno: 'numeroPedidoExterno',
    canalExterno: 'canalExterno',
    categorias: 'categorias',
    descricao: 'descricao',
    fotoPath: 'fotoPath',
    motoboyId: 'motoboyId',
    criadoPorUserId: 'criadoPorUserId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.Prisma.NullableJsonNullValueInput = {
    DbNull: Prisma.DbNull,
    JsonNull: Prisma.JsonNull
};
exports.Prisma.JsonNullValueInput = {
    JsonNull: Prisma.JsonNull
};
exports.Prisma.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.Prisma.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.Prisma.JsonNullValueFilter = {
    DbNull: Prisma.DbNull,
    JsonNull: Prisma.JsonNull,
    AnyNull: Prisma.AnyNull
};
exports.StatusTarefa = exports.$Enums.StatusTarefa = {
    AGENDADA: 'AGENDADA',
    ENVIADA: 'ENVIADA',
    AGUARDANDO_EVIDENCIA: 'AGUARDANDO_EVIDENCIA',
    CONCLUIDA: 'CONCLUIDA',
    CONCLUIDA_COM_ATRASO: 'CONCLUIDA_COM_ATRASO',
    NAO_CONCLUIDA: 'NAO_CONCLUIDA'
};
exports.TipoEvidencia = exports.$Enums.TipoEvidencia = {
    FOTO: 'FOTO',
    CONFIRMACAO_TEXTO: 'CONFIRMACAO_TEXTO',
    LOCALIZACAO: 'LOCALIZACAO',
    ARQUIVO: 'ARQUIVO'
};
exports.ReportFonte = exports.$Enums.ReportFonte = {
    SAIPOS_DASHBOARD: 'SAIPOS_DASHBOARD'
};
exports.ReportEscopoLoja = exports.$Enums.ReportEscopoLoja = {
    POR_LOJA: 'POR_LOJA',
    CONSOLIDADO: 'CONSOLIDADO',
    AMBOS: 'AMBOS'
};
exports.ReportExecucaoStatus = exports.$Enums.ReportExecucaoStatus = {
    SUCESSO: 'SUCESSO',
    FALHA: 'FALHA'
};
exports.ComplaintCategoria = exports.$Enums.ComplaintCategoria = {
    QUALIDADE: 'QUALIDADE',
    PIZZA_VIRADA: 'PIZZA_VIRADA',
    ESQUECEU_BEBIDA: 'ESQUECEU_BEBIDA',
    PEDIDO_ERRADO: 'PEDIDO_ERRADO',
    PEDIDO_ATRASADO: 'PEDIDO_ATRASADO',
    OUTROS: 'OUTROS'
};
exports.CmvRealSecao = exports.$Enums.CmvRealSecao = {
    MATERIA_PRIMA: 'MATERIA_PRIMA',
    EMBALAGEM: 'EMBALAGEM',
    BEBIDA: 'BEBIDA'
};
exports.CmvRealUnidade = exports.$Enums.CmvRealUnidade = {
    KG: 'KG',
    UN: 'UN'
};
exports.NfeNotaStatus = exports.$Enums.NfeNotaStatus = {
    AGUARDANDO_DETALHE: 'AGUARDANDO_DETALHE',
    PENDENTE_PROCESSAMENTO: 'PENDENTE_PROCESSAMENTO',
    EM_REVISAO: 'EM_REVISAO',
    APROVADA: 'APROVADA',
    IGNORADA: 'IGNORADA',
    ANTERIOR_CMV_REAL: 'ANTERIOR_CMV_REAL',
    ERRO_PROCESSAMENTO: 'ERRO_PROCESSAMENTO',
    FALHA: 'FALHA'
};
exports.NfeItemStatus = exports.$Enums.NfeItemStatus = {
    MAPEADO: 'MAPEADO',
    SUGERIDO: 'SUGERIDO',
    SEM_MAPEAMENTO: 'SEM_MAPEAMENTO',
    IGNORADO: 'IGNORADO'
};
exports.CmvLancamentoTipo = exports.$Enums.CmvLancamentoTipo = {
    COMPRA_NFE: 'COMPRA_NFE',
    COMPRA_MANUAL: 'COMPRA_MANUAL',
    TRANSFERENCIA_SAIDA: 'TRANSFERENCIA_SAIDA',
    TRANSFERENCIA_ENTRADA: 'TRANSFERENCIA_ENTRADA',
    DESPERDICIO: 'DESPERDICIO'
};
exports.CmvCustoOrigem = exports.$Enums.CmvCustoOrigem = {
    PLANILHA: 'PLANILHA',
    PLANILHA_RECALCULADO: 'PLANILHA_RECALCULADO',
    ULTIMA_COMPRA_LOJA: 'ULTIMA_COMPRA_LOJA',
    ULTIMA_COMPRA_GRUPO: 'ULTIMA_COMPRA_GRUPO',
    OUTRA_LOJA: 'OUTRA_LOJA',
    PLANILHA_MES_ANTERIOR: 'PLANILHA_MES_ANTERIOR',
    CMV_TEORICO: 'CMV_TEORICO',
    MANUAL: 'MANUAL',
    PENDENTE: 'PENDENTE'
};
exports.CmvSaldoOrigem = exports.$Enums.CmvSaldoOrigem = {
    CONTAGEM: 'CONTAGEM',
    MANUAL: 'MANUAL',
    IMPORTACAO: 'IMPORTACAO'
};
exports.CmvFechamentoStatus = exports.$Enums.CmvFechamentoStatus = {
    ABERTO: 'ABERTO',
    FECHADO: 'FECHADO'
};
exports.CmvTransferenciaStatus = exports.$Enums.CmvTransferenciaStatus = {
    AGUARDANDO_ENTRADA: 'AGUARDANDO_ENTRADA',
    AGUARDANDO_SAIDA: 'AGUARDANDO_SAIDA',
    CONCILIADA: 'CONCILIADA',
    DIVERGENTE: 'DIVERGENTE'
};
exports.CmvTransferenciaOrigem = exports.$Enums.CmvTransferenciaOrigem = {
    SAIPOS: 'SAIPOS',
    NFE_LOJA: 'NFE_LOJA',
    MANUAL: 'MANUAL'
};
exports.CmvTransferenciaLadoTipo = exports.$Enums.CmvTransferenciaLadoTipo = {
    SAIDA: 'SAIDA',
    ENTRADA: 'ENTRADA'
};
exports.CmvTransferenciaCustoOrigem = exports.$Enums.CmvTransferenciaCustoOrigem = {
    ULTIMO_CUSTO_ORIGEM: 'ULTIMO_CUSTO_ORIGEM',
    ESTOQUE_INICIAL_ORIGEM: 'ESTOQUE_INICIAL_ORIGEM',
    ULTIMO_CUSTO_QUALQUER_LOJA: 'ULTIMO_CUSTO_QUALQUER_LOJA',
    CUSTO_MANUAL: 'CUSTO_MANUAL'
};
exports.CanalOcorrencia = exports.$Enums.CanalOcorrencia = {
    IFOOD: 'IFOOD',
    DELIVERY_DIRETO: 'DELIVERY_DIRETO'
};
exports.CategoriaOcorrencia = exports.$Enums.CategoriaOcorrencia = {
    PEDIDO_ATRASADO: 'PEDIDO_ATRASADO',
    PEDIDO_REVIRADO: 'PEDIDO_REVIRADO',
    FALTOU_BEBIDA: 'FALTOU_BEBIDA',
    PEDIDO_ERRADO: 'PEDIDO_ERRADO',
    PEDIDO_TROCADO: 'PEDIDO_TROCADO',
    QUALIDADE: 'QUALIDADE',
    OUTROS: 'OUTROS'
};
exports.Prisma.ModelName = {
    StackUser: 'StackUser',
    User: 'User',
    UserAPI: 'UserAPI',
    Store: 'Store',
    SalesDaily: 'SalesDaily',
    Sale: 'Sale',
    SalesRawPage: 'SalesRawPage',
    SyncRun: 'SyncRun',
    SyncError: 'SyncError',
    WhatsAppBot: 'WhatsAppBot',
    WhatsAppMessage: 'WhatsAppMessage',
    BotSettings: 'BotSettings',
    ChecklistCategory: 'ChecklistCategory',
    ChecklistItemTemplate: 'ChecklistItemTemplate',
    Evaluation: 'Evaluation',
    TopicScore: 'TopicScore',
    ItemScore: 'ItemScore',
    ChecklistDraft: 'ChecklistDraft',
    EtiquetagemUnidade: 'EtiquetagemUnidade',
    EtiquetagemCategoria: 'EtiquetagemCategoria',
    EtiquetagemProcesso: 'EtiquetagemProcesso',
    EtiquetagemProduto: 'EtiquetagemProduto',
    EtiquetagemNomeResponsavel: 'EtiquetagemNomeResponsavel',
    EtiquetagemEtiqueta: 'EtiquetagemEtiqueta',
    AdminUser: 'AdminUser',
    AdminUserPermission: 'AdminUserPermission',
    AdminSession: 'AdminSession',
    AdminAuditLog: 'AdminAuditLog',
    AdminClient: 'AdminClient',
    CmvStoreData: 'CmvStoreData',
    EstoqueInsumo: 'EstoqueInsumo',
    EstoqueContagem: 'EstoqueContagem',
    EstoqueProdutoConfig: 'EstoqueProdutoConfig',
    EstoqueProdutoOrdem: 'EstoqueProdutoOrdem',
    IfoodConnection: 'IfoodConnection',
    IfoodOrder: 'IfoodOrder',
    IfoodToken: 'IfoodToken',
    IfoodFinancialEvent: 'IfoodFinancialEvent',
    IfoodSettlement: 'IfoodSettlement',
    IfoodCatalogItem: 'IfoodCatalogItem',
    IfoodCatalogChangeLog: 'IfoodCatalogChangeLog',
    RhLoja: 'RhLoja',
    RhCargo: 'RhCargo',
    RhFuncionario: 'RhFuncionario',
    RhEscalaVigencia: 'RhEscalaVigencia',
    PontoRegistro: 'PontoRegistro',
    PontoPendencia: 'PontoPendencia',
    FechamentoMensal: 'FechamentoMensal',
    FechamentoLinha: 'FechamentoLinha',
    RhBonificacaoTrimestral: 'RhBonificacaoTrimestral',
    RhBonificacaoAssiduidade: 'RhBonificacaoAssiduidade',
    RhPLRTrimestral: 'RhPLRTrimestral',
    RhPLRPagamento: 'RhPLRPagamento',
    RhHistoricoFuncionario: 'RhHistoricoFuncionario',
    RhQuadroIdeal: 'RhQuadroIdeal',
    RhSetorIdeal: 'RhSetorIdeal',
    RhPosicaoIdeal: 'RhPosicaoIdeal',
    RhIaConversa: 'RhIaConversa',
    RhIaMensagem: 'RhIaMensagem',
    ChatConversa: 'ChatConversa',
    ChatMensagem: 'ChatMensagem',
    RhDocumentoFuncionario: 'RhDocumentoFuncionario',
    RhOcorrencia: 'RhOcorrencia',
    RhSnapshotCustoMensal: 'RhSnapshotCustoMensal',
    RhTransferenciaLoja: 'RhTransferenciaLoja',
    RhTaxaLoja: 'RhTaxaLoja',
    DeliveryRider: 'DeliveryRider',
    RiderPaymentPeriod: 'RiderPaymentPeriod',
    RiderDocument: 'RiderDocument',
    RhTeamMember: 'RhTeamMember',
    RhPermission: 'RhPermission',
    UserToolPermission: 'UserToolPermission',
    SystemConfig: 'SystemConfig',
    TarefaTemplate: 'TarefaTemplate',
    TarefaGrupo: 'TarefaGrupo',
    TarefaGrupoItem: 'TarefaGrupoItem',
    TarefaSerie: 'TarefaSerie',
    TarefaAtribuida: 'TarefaAtribuida',
    SessaoTarefa: 'SessaoTarefa',
    TarefaEvidencia: 'TarefaEvidencia',
    ReportDefinition: 'ReportDefinition',
    ReportField: 'ReportField',
    SaiposFieldCatalog: 'SaiposFieldCatalog',
    ReportExecution: 'ReportExecution',
    ServiceApiKey: 'ServiceApiKey',
    ComplaintReviewRun: 'ComplaintReviewRun',
    IFoodComplaintGroup: 'IFoodComplaintGroup',
    Complaint: 'Complaint',
    TipoAvaliacao: 'TipoAvaliacao',
    BonificacaoTrimestre: 'BonificacaoTrimestre',
    ComplaintComparison: 'ComplaintComparison',
    CmvRealInsumoConfig: 'CmvRealInsumoConfig',
    NfeFornecedor: 'NfeFornecedor',
    NfeNota: 'NfeNota',
    NfeItem: 'NfeItem',
    NfeMapeamento: 'NfeMapeamento',
    CmvLancamento: 'CmvLancamento',
    CmvSaldoEstoque: 'CmvSaldoEstoque',
    CmvFechamento: 'CmvFechamento',
    NfeConfig: 'NfeConfig',
    CmvRefeicao: 'CmvRefeicao',
    CmvTransferencia: 'CmvTransferencia',
    CmvTransferenciaLado: 'CmvTransferenciaLado',
    CmvTransferenciaItem: 'CmvTransferenciaItem',
    Ocorrencia: 'Ocorrencia'
};
/**
 * This is a stub Prisma Client that will error at runtime if called.
 */ class PrismaClient {
    constructor(){
        return new Proxy(this, {
            get (target, prop) {
                let message;
                const runtime = getRuntime();
                if (runtime.isEdge) {
                    message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
                } else {
                    message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).';
                }
                message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`;
                throw new Error(message);
            }
        });
    }
}
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
}),
"[project]/Demo-2/node_modules/@prisma/client/index-browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const prisma = __turbopack_context__.r("[project]/Demo-2/node_modules/.prisma/client/index-browser.js [app-client] (ecmascript)");
module.exports = prisma;
}),
"[project]/Demo-2/node_modules/@stackframe/stack/dist/esm/lib/stack-app/apps/interfaces/server-app.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/stack-app/apps/interfaces/server-app.ts
__turbopack_context__.s([
    "StackServerApp",
    ()=>StackServerApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2f$apps$2f$implementations$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@stackframe/stack/dist/esm/lib/stack-app/apps/implementations/index.js [app-client] (ecmascript)");
;
var StackServerApp = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2f$apps$2f$implementations$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_StackServerAppImpl"];
;
 //# sourceMappingURL=server-app.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/i18n/detect-domain-locale.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "detectDomainLocale", {
    enumerable: true,
    get: function() {
        return detectDomainLocale;
    }
});
function detectDomainLocale(domainItems, hostname, detectedLocale) {
    if (!domainItems) return;
    if (detectedLocale) {
        detectedLocale = detectedLocale.toLowerCase();
    }
    for (const item of domainItems){
        // remove port if present
        const domainHostname = item.domain?.split(':', 1)[0].toLowerCase();
        if (hostname === domainHostname || detectedLocale === item.defaultLocale.toLowerCase() || item.locales?.some((locale)=>locale.toLowerCase() === detectedLocale)) {
            return item;
        }
    }
} //# sourceMappingURL=detect-domain-locale.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/add-path-suffix.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addPathSuffix", {
    enumerable: true,
    get: function() {
        return addPathSuffix;
    }
});
const _parsepath = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/parse-path.js [app-client] (ecmascript)");
function addPathSuffix(path, suffix) {
    if (!path.startsWith('/') || !suffix) {
        return path;
    }
    const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
    return `${pathname}${suffix}${query}${hash}`;
} //# sourceMappingURL=add-path-suffix.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/add-locale.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addLocale", {
    enumerable: true,
    get: function() {
        return addLocale;
    }
});
const _addpathprefix = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js [app-client] (ecmascript)");
const _pathhasprefix = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js [app-client] (ecmascript)");
function addLocale(path, locale, defaultLocale, ignorePrefix) {
    // If no locale was given or the locale is the default locale, we don't need
    // to prefix the path.
    if (!locale || locale === defaultLocale) return path;
    const lower = path.toLowerCase();
    // If the path is an API path or the path already has the locale prefix, we
    // don't need to prefix the path.
    if (!ignorePrefix) {
        if ((0, _pathhasprefix.pathHasPrefix)(lower, '/api')) return path;
        if ((0, _pathhasprefix.pathHasPrefix)(lower, `/${locale.toLowerCase()}`)) return path;
    }
    // Add the locale prefix to the path.
    return (0, _addpathprefix.addPathPrefix)(path, `/${locale}`);
} //# sourceMappingURL=add-locale.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/format-next-pathname-info.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatNextPathnameInfo", {
    enumerable: true,
    get: function() {
        return formatNextPathnameInfo;
    }
});
const _removetrailingslash = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js [app-client] (ecmascript)");
const _addpathprefix = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js [app-client] (ecmascript)");
const _addpathsuffix = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/add-path-suffix.js [app-client] (ecmascript)");
const _addlocale = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/add-locale.js [app-client] (ecmascript)");
function formatNextPathnameInfo(info) {
    let pathname = (0, _addlocale.addLocale)(info.pathname, info.locale, info.buildId ? undefined : info.defaultLocale, info.ignorePrefix);
    if (info.buildId || !info.trailingSlash) {
        pathname = (0, _removetrailingslash.removeTrailingSlash)(pathname);
    }
    if (info.buildId) {
        pathname = (0, _addpathsuffix.addPathSuffix)((0, _addpathprefix.addPathPrefix)(pathname, `/_next/data/${info.buildId}`), info.pathname === '/' ? 'index.json' : '.json');
    }
    pathname = (0, _addpathprefix.addPathPrefix)(pathname, info.basePath);
    return !info.buildId && info.trailingSlash ? !pathname.endsWith('/') ? (0, _addpathsuffix.addPathSuffix)(pathname, '/') : pathname : (0, _removetrailingslash.removeTrailingSlash)(pathname);
} //# sourceMappingURL=format-next-pathname-info.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/get-hostname.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getHostname", {
    enumerable: true,
    get: function() {
        return getHostname;
    }
});
function getHostname(parsed, headers) {
    // Get the hostname from the headers if it exists, otherwise use the parsed
    // hostname.
    let hostname;
    if (headers?.host && !Array.isArray(headers.host)) {
        hostname = headers.host.toString().split(':', 1)[0];
    } else if (parsed.hostname) {
        hostname = parsed.hostname;
    } else return;
    return hostname.toLowerCase();
} //# sourceMappingURL=get-hostname.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/i18n/normalize-locale-path.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizeLocalePath", {
    enumerable: true,
    get: function() {
        return normalizeLocalePath;
    }
});
/**
 * A cache of lowercased locales for each list of locales. This is stored as a
 * WeakMap so if the locales are garbage collected, the cache entry will be
 * removed as well.
 */ const cache = new WeakMap();
function normalizeLocalePath(pathname, locales) {
    // If locales is undefined, return the pathname as is.
    if (!locales) return {
        pathname
    };
    // Get the cached lowercased locales or create a new cache entry.
    let lowercasedLocales = cache.get(locales);
    if (!lowercasedLocales) {
        lowercasedLocales = locales.map((locale)=>locale.toLowerCase());
        cache.set(locales, lowercasedLocales);
    }
    let detectedLocale;
    // The first segment will be empty, because it has a leading `/`. If
    // there is no further segment, there is no locale (or it's the default).
    const segments = pathname.split('/', 2);
    // If there's no second segment (ie, the pathname is just `/`), there's no
    // locale.
    if (!segments[1]) return {
        pathname
    };
    // The second segment will contain the locale part if any.
    const segment = segments[1].toLowerCase();
    // See if the segment matches one of the locales. If it doesn't, there is
    // no locale (or it's the default).
    const index = lowercasedLocales.indexOf(segment);
    if (index < 0) return {
        pathname
    };
    // Return the case-sensitive locale.
    detectedLocale = locales[index];
    // Remove the `/${locale}` part of the pathname.
    pathname = pathname.slice(detectedLocale.length + 1) || '/';
    return {
        pathname,
        detectedLocale
    };
} //# sourceMappingURL=normalize-locale-path.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/remove-path-prefix.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removePathPrefix", {
    enumerable: true,
    get: function() {
        return removePathPrefix;
    }
});
const _pathhasprefix = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js [app-client] (ecmascript)");
function removePathPrefix(path, prefix) {
    // If the path doesn't start with the prefix we can return it as is. This
    // protects us from situations where the prefix is a substring of the path
    // prefix such as:
    //
    // For prefix: /blog
    //
    //   /blog -> true
    //   /blog/ -> true
    //   /blog/1 -> true
    //   /blogging -> false
    //   /blogging/ -> false
    //   /blogging/1 -> false
    if (!(0, _pathhasprefix.pathHasPrefix)(path, prefix)) {
        return path;
    }
    // Remove the prefix from the path via slicing.
    const withoutPrefix = path.slice(prefix.length);
    // If the path without the prefix starts with a `/` we can return it as is.
    if (withoutPrefix.startsWith('/')) {
        return withoutPrefix;
    }
    // If the path without the prefix doesn't start with a `/` we need to add it
    // back to the path to make sure it's a valid path.
    return `/${withoutPrefix}`;
} //# sourceMappingURL=remove-path-prefix.js.map
}),
"[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/get-next-pathname-info.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNextPathnameInfo", {
    enumerable: true,
    get: function() {
        return getNextPathnameInfo;
    }
});
const _normalizelocalepath = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/i18n/normalize-locale-path.js [app-client] (ecmascript)");
const _removepathprefix = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/remove-path-prefix.js [app-client] (ecmascript)");
const _pathhasprefix = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js [app-client] (ecmascript)");
function getNextPathnameInfo(pathname, options) {
    const { basePath, i18n, trailingSlash } = options.nextConfig ?? {};
    const info = {
        pathname,
        trailingSlash: pathname !== '/' ? pathname.endsWith('/') : trailingSlash
    };
    if (basePath && (0, _pathhasprefix.pathHasPrefix)(info.pathname, basePath)) {
        info.pathname = (0, _removepathprefix.removePathPrefix)(info.pathname, basePath);
        info.basePath = basePath;
    }
    let pathnameNoDataPrefix = info.pathname;
    if (info.pathname.startsWith('/_next/data/') && info.pathname.endsWith('.json')) {
        const paths = info.pathname.replace(/^\/_next\/data\//, '').replace(/\.json$/, '').split('/');
        const buildId = paths[0];
        info.buildId = buildId;
        pathnameNoDataPrefix = paths[1] !== 'index' ? `/${paths.slice(1).join('/')}` : '/';
        // update pathname with normalized if enabled although
        // we use normalized to populate locale info still
        if (options.parseData === true) {
            info.pathname = pathnameNoDataPrefix;
        }
    }
    // If provided, use the locale route normalizer to detect the locale instead
    // of the function below.
    if (i18n) {
        let result = options.i18nProvider ? options.i18nProvider.analyze(info.pathname) : (0, _normalizelocalepath.normalizeLocalePath)(info.pathname, i18n.locales);
        info.locale = result.detectedLocale;
        info.pathname = result.pathname ?? info.pathname;
        if (!result.detectedLocale && info.buildId) {
            result = options.i18nProvider ? options.i18nProvider.analyze(pathnameNoDataPrefix) : (0, _normalizelocalepath.normalizeLocalePath)(pathnameNoDataPrefix, i18n.locales);
            if (result.detectedLocale) {
                info.locale = result.detectedLocale;
            }
        }
    }
    return info;
} //# sourceMappingURL=get-next-pathname-info.js.map
}),
"[project]/Demo-2/node_modules/next/dist/server/web/next-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NextURL", {
    enumerable: true,
    get: function() {
        return NextURL;
    }
});
const _detectdomainlocale = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/i18n/detect-domain-locale.js [app-client] (ecmascript)");
const _formatnextpathnameinfo = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/format-next-pathname-info.js [app-client] (ecmascript)");
const _gethostname = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/get-hostname.js [app-client] (ecmascript)");
const _getnextpathnameinfo = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/shared/lib/router/utils/get-next-pathname-info.js [app-client] (ecmascript)");
const REGEX_LOCALHOST_HOSTNAME = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
function parseURL(url, base) {
    return new URL(String(url).replace(REGEX_LOCALHOST_HOSTNAME, 'localhost'), base && String(base).replace(REGEX_LOCALHOST_HOSTNAME, 'localhost'));
}
const Internal = Symbol('NextURLInternal');
class NextURL {
    constructor(input, baseOrOpts, opts){
        let base;
        let options;
        if (typeof baseOrOpts === 'object' && 'pathname' in baseOrOpts || typeof baseOrOpts === 'string') {
            base = baseOrOpts;
            options = opts || {};
        } else {
            options = opts || baseOrOpts || {};
        }
        this[Internal] = {
            url: parseURL(input, base ?? options.base),
            options: options,
            basePath: ''
        };
        this.analyze();
    }
    analyze() {
        var _this_Internal_options_nextConfig_i18n, _this_Internal_options_nextConfig, _this_Internal_domainLocale, _this_Internal_options_nextConfig_i18n1, _this_Internal_options_nextConfig1;
        const info = (0, _getnextpathnameinfo.getNextPathnameInfo)(this[Internal].url.pathname, {
            nextConfig: this[Internal].options.nextConfig,
            parseData: !("TURBOPACK compile-time value", void 0),
            i18nProvider: this[Internal].options.i18nProvider
        });
        const hostname = (0, _gethostname.getHostname)(this[Internal].url, this[Internal].options.headers);
        this[Internal].domainLocale = this[Internal].options.i18nProvider ? this[Internal].options.i18nProvider.detectDomainLocale(hostname) : (0, _detectdomainlocale.detectDomainLocale)((_this_Internal_options_nextConfig = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n.domains, hostname);
        const defaultLocale = ((_this_Internal_domainLocale = this[Internal].domainLocale) == null ? void 0 : _this_Internal_domainLocale.defaultLocale) || ((_this_Internal_options_nextConfig1 = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n1 = _this_Internal_options_nextConfig1.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n1.defaultLocale);
        this[Internal].url.pathname = info.pathname;
        this[Internal].defaultLocale = defaultLocale;
        this[Internal].basePath = info.basePath ?? '';
        this[Internal].buildId = info.buildId;
        this[Internal].locale = info.locale ?? defaultLocale;
        this[Internal].trailingSlash = info.trailingSlash;
    }
    formatPathname() {
        return (0, _formatnextpathnameinfo.formatNextPathnameInfo)({
            basePath: this[Internal].basePath,
            buildId: this[Internal].buildId,
            defaultLocale: !this[Internal].options.forceLocale ? this[Internal].defaultLocale : undefined,
            locale: this[Internal].locale,
            pathname: this[Internal].url.pathname,
            trailingSlash: this[Internal].trailingSlash
        });
    }
    formatSearch() {
        return this[Internal].url.search;
    }
    get buildId() {
        return this[Internal].buildId;
    }
    set buildId(buildId) {
        this[Internal].buildId = buildId;
    }
    get locale() {
        return this[Internal].locale ?? '';
    }
    set locale(locale) {
        var _this_Internal_options_nextConfig_i18n, _this_Internal_options_nextConfig;
        if (!this[Internal].locale || !((_this_Internal_options_nextConfig = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n.locales.includes(locale))) {
            throw Object.defineProperty(new TypeError(`The NextURL configuration includes no locale "${locale}"`), "__NEXT_ERROR_CODE", {
                value: "E597",
                enumerable: false,
                configurable: true
            });
        }
        this[Internal].locale = locale;
    }
    get defaultLocale() {
        return this[Internal].defaultLocale;
    }
    get domainLocale() {
        return this[Internal].domainLocale;
    }
    get searchParams() {
        return this[Internal].url.searchParams;
    }
    get host() {
        return this[Internal].url.host;
    }
    set host(value) {
        this[Internal].url.host = value;
    }
    get hostname() {
        return this[Internal].url.hostname;
    }
    set hostname(value) {
        this[Internal].url.hostname = value;
    }
    get port() {
        return this[Internal].url.port;
    }
    set port(value) {
        this[Internal].url.port = value;
    }
    get protocol() {
        return this[Internal].url.protocol;
    }
    set protocol(value) {
        this[Internal].url.protocol = value;
    }
    get href() {
        const pathname = this.formatPathname();
        const search = this.formatSearch();
        return `${this.protocol}//${this.host}${pathname}${search}${this.hash}`;
    }
    set href(url) {
        this[Internal].url = parseURL(url);
        this.analyze();
    }
    get origin() {
        return this[Internal].url.origin;
    }
    get pathname() {
        return this[Internal].url.pathname;
    }
    set pathname(value) {
        this[Internal].url.pathname = value;
    }
    get hash() {
        return this[Internal].url.hash;
    }
    set hash(value) {
        this[Internal].url.hash = value;
    }
    get search() {
        return this[Internal].url.search;
    }
    set search(value) {
        this[Internal].url.search = value;
    }
    get password() {
        return this[Internal].url.password;
    }
    set password(value) {
        this[Internal].url.password = value;
    }
    get username() {
        return this[Internal].url.username;
    }
    set username(value) {
        this[Internal].url.username = value;
    }
    get basePath() {
        return this[Internal].basePath;
    }
    set basePath(value) {
        this[Internal].basePath = value.startsWith('/') ? value : `/${value}`;
    }
    toString() {
        return this.href;
    }
    toJSON() {
        return this.href;
    }
    [Symbol.for('edge-runtime.inspect.custom')]() {
        return {
            href: this.href,
            origin: this.origin,
            protocol: this.protocol,
            username: this.username,
            password: this.password,
            host: this.host,
            hostname: this.hostname,
            port: this.port,
            pathname: this.pathname,
            search: this.search,
            searchParams: this.searchParams,
            hash: this.hash
        };
    }
    clone() {
        return new NextURL(String(this), this[Internal].options);
    }
} //# sourceMappingURL=next-url.js.map
}),
"[project]/Demo-2/node_modules/next/dist/server/web/utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    fromNodeOutgoingHttpHeaders: null,
    normalizeNextQueryParam: null,
    splitCookiesString: null,
    toNodeOutgoingHttpHeaders: null,
    validateURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    fromNodeOutgoingHttpHeaders: function() {
        return fromNodeOutgoingHttpHeaders;
    },
    normalizeNextQueryParam: function() {
        return normalizeNextQueryParam;
    },
    splitCookiesString: function() {
        return splitCookiesString;
    },
    toNodeOutgoingHttpHeaders: function() {
        return toNodeOutgoingHttpHeaders;
    },
    validateURL: function() {
        return validateURL;
    }
});
const _constants = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/lib/constants.js [app-client] (ecmascript)");
function fromNodeOutgoingHttpHeaders(nodeHeaders) {
    const headers = new Headers();
    for (let [key, value] of Object.entries(nodeHeaders)){
        const values = Array.isArray(value) ? value : [
            value
        ];
        for (let v of values){
            if (typeof v === 'undefined') continue;
            if (typeof v === 'number') {
                v = v.toString();
            }
            headers.append(key, v);
        }
    }
    return headers;
}
function splitCookiesString(cookiesString) {
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
        while(pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))){
            pos += 1;
        }
        return pos < cookiesString.length;
    }
    function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== '=' && ch !== ';' && ch !== ',';
    }
    while(pos < cookiesString.length){
        start = pos;
        cookiesSeparatorFound = false;
        while(skipWhitespace()){
            ch = cookiesString.charAt(pos);
            if (ch === ',') {
                // ',' is a cookie separator if we have later first '=', not ';' or ','
                lastComma = pos;
                pos += 1;
                skipWhitespace();
                nextStart = pos;
                while(pos < cookiesString.length && notSpecialChar()){
                    pos += 1;
                }
                // currently special character
                if (pos < cookiesString.length && cookiesString.charAt(pos) === '=') {
                    // we found cookies separator
                    cookiesSeparatorFound = true;
                    // pos is inside the next cookie, so back up and return it.
                    pos = nextStart;
                    cookiesStrings.push(cookiesString.substring(start, lastComma));
                    start = pos;
                } else {
                    // in param ',' or param separator ';',
                    // we continue from that comma
                    pos = lastComma + 1;
                }
            } else {
                pos += 1;
            }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
    }
    return cookiesStrings;
}
function toNodeOutgoingHttpHeaders(headers) {
    const nodeHeaders = {};
    const cookies = [];
    if (headers) {
        for (const [key, value] of headers.entries()){
            if (key.toLowerCase() === 'set-cookie') {
                // We may have gotten a comma joined string of cookies, or multiple
                // set-cookie headers. We need to merge them into one header array
                // to represent all the cookies.
                cookies.push(...splitCookiesString(value));
                nodeHeaders[key] = cookies.length === 1 ? cookies[0] : cookies;
            } else {
                nodeHeaders[key] = value;
            }
        }
    }
    return nodeHeaders;
}
function validateURL(url) {
    try {
        return String(new URL(String(url)));
    } catch (error) {
        throw Object.defineProperty(new Error(`URL is malformed "${String(url)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, {
            cause: error
        }), "__NEXT_ERROR_CODE", {
            value: "E61",
            enumerable: false,
            configurable: true
        });
    }
}
function normalizeNextQueryParam(key) {
    const prefixes = [
        _constants.NEXT_QUERY_PARAM_PREFIX,
        _constants.NEXT_INTERCEPTION_MARKER_PREFIX
    ];
    for (const prefix of prefixes){
        if (key !== prefix && key.startsWith(prefix)) {
            return key.substring(prefix.length);
        }
    }
    return null;
} //# sourceMappingURL=utils.js.map
}),
"[project]/Demo-2/node_modules/next/dist/server/web/error.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    PageSignatureError: null,
    RemovedPageError: null,
    RemovedUAError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PageSignatureError: function() {
        return PageSignatureError;
    },
    RemovedPageError: function() {
        return RemovedPageError;
    },
    RemovedUAError: function() {
        return RemovedUAError;
    }
});
class PageSignatureError extends Error {
    constructor({ page }){
        super(`The middleware "${page}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
    }
}
class RemovedPageError extends Error {
    constructor(){
        super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
    }
}
class RemovedUAError extends Error {
    constructor(){
        super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
    }
} //# sourceMappingURL=error.js.map
}),
"[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/request.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    INTERNALS: null,
    NextRequest: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    INTERNALS: function() {
        return INTERNALS;
    },
    NextRequest: function() {
        return NextRequest;
    }
});
const _nexturl = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/next-url.js [app-client] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/utils.js [app-client] (ecmascript)");
const _error = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/error.js [app-client] (ecmascript)");
const _cookies = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/cookies.js [app-client] (ecmascript)");
const INTERNALS = Symbol('internal request');
class NextRequest extends Request {
    constructor(input, init = {}){
        const url = typeof input !== 'string' && 'url' in input ? input.url : String(input);
        (0, _utils.validateURL)(url);
        // node Request instance requires duplex option when a body
        // is present or it errors, we don't handle this for
        // Request being passed in since it would have already
        // errored if this wasn't configured
        if ("TURBOPACK compile-time truthy", 1) {
            if (init.body && init.duplex !== 'half') {
                init.duplex = 'half';
            }
        }
        if (input instanceof Request) super(input, init);
        else super(url, init);
        const nextUrl = new _nexturl.NextURL(url, {
            headers: (0, _utils.toNodeOutgoingHttpHeaders)(this.headers),
            nextConfig: init.nextConfig
        });
        this[INTERNALS] = {
            cookies: new _cookies.RequestCookies(this.headers),
            nextUrl,
            url: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : nextUrl.toString()
        };
    }
    [Symbol.for('edge-runtime.inspect.custom')]() {
        return {
            cookies: this.cookies,
            nextUrl: this.nextUrl,
            url: this.url,
            // rest of props come from Request
            bodyUsed: this.bodyUsed,
            cache: this.cache,
            credentials: this.credentials,
            destination: this.destination,
            headers: Object.fromEntries(this.headers),
            integrity: this.integrity,
            keepalive: this.keepalive,
            method: this.method,
            mode: this.mode,
            redirect: this.redirect,
            referrer: this.referrer,
            referrerPolicy: this.referrerPolicy,
            signal: this.signal
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    get nextUrl() {
        return this[INTERNALS].nextUrl;
    }
    /**
   * @deprecated
   * `page` has been deprecated in favour of `URLPattern`.
   * Read more: https://nextjs.org/docs/messages/middleware-request-page
   */ get page() {
        throw new _error.RemovedPageError();
    }
    /**
   * @deprecated
   * `ua` has been removed in favour of \`userAgent\` function.
   * Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
   */ get ua() {
        throw new _error.RemovedUAError();
    }
    get url() {
        return this[INTERNALS].url;
    }
} //# sourceMappingURL=request.js.map
}),
"[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/response.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NextResponse", {
    enumerable: true,
    get: function() {
        return NextResponse;
    }
});
const _cookies = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/cookies.js [app-client] (ecmascript)");
const _nexturl = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/next-url.js [app-client] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/utils.js [app-client] (ecmascript)");
const _reflect = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-client] (ecmascript)");
const _cookies1 = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/cookies.js [app-client] (ecmascript)");
const INTERNALS = Symbol('internal response');
const REDIRECTS = new Set([
    301,
    302,
    303,
    307,
    308
]);
function handleMiddlewareField(init, headers) {
    var _init_request;
    if (init == null ? void 0 : (_init_request = init.request) == null ? void 0 : _init_request.headers) {
        if (!(init.request.headers instanceof Headers)) {
            throw Object.defineProperty(new Error('request.headers must be an instance of Headers'), "__NEXT_ERROR_CODE", {
                value: "E119",
                enumerable: false,
                configurable: true
            });
        }
        const keys = [];
        for (const [key, value] of init.request.headers){
            headers.set('x-middleware-request-' + key, value);
            keys.push(key);
        }
        headers.set('x-middleware-override-headers', keys.join(','));
    }
}
class NextResponse extends Response {
    constructor(body, init = {}){
        super(body, init);
        const headers = this.headers;
        const cookies = new _cookies1.ResponseCookies(headers);
        const cookiesProxy = new Proxy(cookies, {
            get (target, prop, receiver) {
                switch(prop){
                    case 'delete':
                    case 'set':
                        {
                            return (...args)=>{
                                const result = Reflect.apply(target[prop], target, args);
                                const newHeaders = new Headers(headers);
                                if (result instanceof _cookies1.ResponseCookies) {
                                    headers.set('x-middleware-set-cookie', result.getAll().map((cookie)=>(0, _cookies.stringifyCookie)(cookie)).join(','));
                                }
                                handleMiddlewareField(init, newHeaders);
                                return result;
                            };
                        }
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
        this[INTERNALS] = {
            cookies: cookiesProxy,
            url: init.url ? new _nexturl.NextURL(init.url, {
                headers: (0, _utils.toNodeOutgoingHttpHeaders)(headers),
                nextConfig: init.nextConfig
            }) : undefined
        };
    }
    [Symbol.for('edge-runtime.inspect.custom')]() {
        return {
            cookies: this.cookies,
            url: this.url,
            // rest of props come from Response
            body: this.body,
            bodyUsed: this.bodyUsed,
            headers: Object.fromEntries(this.headers),
            ok: this.ok,
            redirected: this.redirected,
            status: this.status,
            statusText: this.statusText,
            type: this.type
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    static json(body, init) {
        const response = Response.json(body, init);
        return new NextResponse(response.body, response);
    }
    static redirect(url, init) {
        const status = typeof init === 'number' ? init : (init == null ? void 0 : init.status) ?? 307;
        if (!REDIRECTS.has(status)) {
            throw Object.defineProperty(new RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", {
                value: "E529",
                enumerable: false,
                configurable: true
            });
        }
        const initObj = typeof init === 'object' ? init : {};
        const headers = new Headers(initObj == null ? void 0 : initObj.headers);
        headers.set('Location', (0, _utils.validateURL)(url));
        return new NextResponse(null, {
            ...initObj,
            headers,
            status
        });
    }
    static rewrite(destination, init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set('x-middleware-rewrite', (0, _utils.validateURL)(destination));
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
    static next(init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set('x-middleware-next', '1');
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
} //# sourceMappingURL=response.js.map
}),
"[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/image-response.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @deprecated ImageResponse moved from "next/server" to "next/og" since Next.js 14, please import from "next/og" instead.
 * Migration with codemods: https://nextjs.org/docs/app/building-your-application/upgrading/codemods#next-og-import
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImageResponse", {
    enumerable: true,
    get: function() {
        return ImageResponse;
    }
});
function ImageResponse() {
    throw Object.defineProperty(new Error('ImageResponse moved from "next/server" to "next/og" since Next.js 14, please import from "next/og" instead'), "__NEXT_ERROR_CODE", {
        value: "E183",
        enumerable: false,
        configurable: true
    });
} //# sourceMappingURL=image-response.js.map
}),
"[project]/Demo-2/node_modules/next/dist/compiled/ua-parser-js/ua-parser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

(()=>{
    var i = {
        226: function(i, e) {
            (function(o, a) {
                "use strict";
                var r = "1.0.35", t = "", n = "?", s = "function", b = "undefined", w = "object", l = "string", d = "major", c = "model", u = "name", p = "type", m = "vendor", f = "version", h = "architecture", v = "console", g = "mobile", k = "tablet", x = "smarttv", _ = "wearable", y = "embedded", q = 350;
                var T = "Amazon", S = "Apple", z = "ASUS", N = "BlackBerry", A = "Browser", C = "Chrome", E = "Edge", O = "Firefox", U = "Google", j = "Huawei", P = "LG", R = "Microsoft", M = "Motorola", B = "Opera", V = "Samsung", D = "Sharp", I = "Sony", W = "Viera", F = "Xiaomi", G = "Zebra", H = "Facebook", L = "Chromium OS", Z = "Mac OS";
                var extend = function(i, e) {
                    var o = {};
                    for(var a in i){
                        if (e[a] && e[a].length % 2 === 0) {
                            o[a] = e[a].concat(i[a]);
                        } else {
                            o[a] = i[a];
                        }
                    }
                    return o;
                }, enumerize = function(i) {
                    var e = {};
                    for(var o = 0; o < i.length; o++){
                        e[i[o].toUpperCase()] = i[o];
                    }
                    return e;
                }, has = function(i, e) {
                    return typeof i === l ? lowerize(e).indexOf(lowerize(i)) !== -1 : false;
                }, lowerize = function(i) {
                    return i.toLowerCase();
                }, majorize = function(i) {
                    return typeof i === l ? i.replace(/[^\d\.]/g, t).split(".")[0] : a;
                }, trim = function(i, e) {
                    if (typeof i === l) {
                        i = i.replace(/^\s\s*/, t);
                        return typeof e === b ? i : i.substring(0, q);
                    }
                };
                var rgxMapper = function(i, e) {
                    var o = 0, r, t, n, b, l, d;
                    while(o < e.length && !l){
                        var c = e[o], u = e[o + 1];
                        r = t = 0;
                        while(r < c.length && !l){
                            if (!c[r]) {
                                break;
                            }
                            l = c[r++].exec(i);
                            if (!!l) {
                                for(n = 0; n < u.length; n++){
                                    d = l[++t];
                                    b = u[n];
                                    if (typeof b === w && b.length > 0) {
                                        if (b.length === 2) {
                                            if (typeof b[1] == s) {
                                                this[b[0]] = b[1].call(this, d);
                                            } else {
                                                this[b[0]] = b[1];
                                            }
                                        } else if (b.length === 3) {
                                            if (typeof b[1] === s && !(b[1].exec && b[1].test)) {
                                                this[b[0]] = d ? b[1].call(this, d, b[2]) : a;
                                            } else {
                                                this[b[0]] = d ? d.replace(b[1], b[2]) : a;
                                            }
                                        } else if (b.length === 4) {
                                            this[b[0]] = d ? b[3].call(this, d.replace(b[1], b[2])) : a;
                                        }
                                    } else {
                                        this[b] = d ? d : a;
                                    }
                                }
                            }
                        }
                        o += 2;
                    }
                }, strMapper = function(i, e) {
                    for(var o in e){
                        if (typeof e[o] === w && e[o].length > 0) {
                            for(var r = 0; r < e[o].length; r++){
                                if (has(e[o][r], i)) {
                                    return o === n ? a : o;
                                }
                            }
                        } else if (has(e[o], i)) {
                            return o === n ? a : o;
                        }
                    }
                    return i;
                };
                var $ = {
                    "1.0": "/8",
                    1.2: "/1",
                    1.3: "/3",
                    "2.0": "/412",
                    "2.0.2": "/416",
                    "2.0.3": "/417",
                    "2.0.4": "/419",
                    "?": "/"
                }, X = {
                    ME: "4.90",
                    "NT 3.11": "NT3.51",
                    "NT 4.0": "NT4.0",
                    2e3: "NT 5.0",
                    XP: [
                        "NT 5.1",
                        "NT 5.2"
                    ],
                    Vista: "NT 6.0",
                    7: "NT 6.1",
                    8: "NT 6.2",
                    8.1: "NT 6.3",
                    10: [
                        "NT 6.4",
                        "NT 10.0"
                    ],
                    RT: "ARM"
                };
                var K = {
                    browser: [
                        [
                            /\b(?:crmo|crios)\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "Chrome"
                            ]
                        ],
                        [
                            /edg(?:e|ios|a)?\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "Edge"
                            ]
                        ],
                        [
                            /(opera mini)\/([-\w\.]+)/i,
                            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
                            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
                        ],
                        [
                            u,
                            f
                        ],
                        [
                            /opios[\/ ]+([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                B + " Mini"
                            ]
                        ],
                        [
                            /\bopr\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                B
                            ]
                        ],
                        [
                            /(kindle)\/([\w\.]+)/i,
                            /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,
                            /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,
                            /(ba?idubrowser)[\/ ]?([\w\.]+)/i,
                            /(?:ms|\()(ie) ([\w\.]+)/i,
                            /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
                            /(heytap|ovi)browser\/([\d\.]+)/i,
                            /(weibo)__([\d\.]+)/i
                        ],
                        [
                            u,
                            f
                        ],
                        [
                            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "UC" + A
                            ]
                        ],
                        [
                            /microm.+\bqbcore\/([\w\.]+)/i,
                            /\bqbcore\/([\w\.]+).+microm/i
                        ],
                        [
                            f,
                            [
                                u,
                                "WeChat(Win) Desktop"
                            ]
                        ],
                        [
                            /micromessenger\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "WeChat"
                            ]
                        ],
                        [
                            /konqueror\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "Konqueror"
                            ]
                        ],
                        [
                            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
                        ],
                        [
                            f,
                            [
                                u,
                                "IE"
                            ]
                        ],
                        [
                            /ya(?:search)?browser\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "Yandex"
                            ]
                        ],
                        [
                            /(avast|avg)\/([\w\.]+)/i
                        ],
                        [
                            [
                                u,
                                /(.+)/,
                                "$1 Secure " + A
                            ],
                            f
                        ],
                        [
                            /\bfocus\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                O + " Focus"
                            ]
                        ],
                        [
                            /\bopt\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                B + " Touch"
                            ]
                        ],
                        [
                            /coc_coc\w+\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "Coc Coc"
                            ]
                        ],
                        [
                            /dolfin\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "Dolphin"
                            ]
                        ],
                        [
                            /coast\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                B + " Coast"
                            ]
                        ],
                        [
                            /miuibrowser\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "MIUI " + A
                            ]
                        ],
                        [
                            /fxios\/([-\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                O
                            ]
                        ],
                        [
                            /\bqihu|(qi?ho?o?|360)browser/i
                        ],
                        [
                            [
                                u,
                                "360 " + A
                            ]
                        ],
                        [
                            /(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i
                        ],
                        [
                            [
                                u,
                                /(.+)/,
                                "$1 " + A
                            ],
                            f
                        ],
                        [
                            /(comodo_dragon)\/([\w\.]+)/i
                        ],
                        [
                            [
                                u,
                                /_/g,
                                " "
                            ],
                            f
                        ],
                        [
                            /(electron)\/([\w\.]+) safari/i,
                            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
                            /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i
                        ],
                        [
                            u,
                            f
                        ],
                        [
                            /(metasr)[\/ ]?([\w\.]+)/i,
                            /(lbbrowser)/i,
                            /\[(linkedin)app\]/i
                        ],
                        [
                            u
                        ],
                        [
                            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
                        ],
                        [
                            [
                                u,
                                H
                            ],
                            f
                        ],
                        [
                            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
                            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
                            /safari (line)\/([\w\.]+)/i,
                            /\b(line)\/([\w\.]+)\/iab/i,
                            /(chromium|instagram)[\/ ]([-\w\.]+)/i
                        ],
                        [
                            u,
                            f
                        ],
                        [
                            /\bgsa\/([\w\.]+) .*safari\//i
                        ],
                        [
                            f,
                            [
                                u,
                                "GSA"
                            ]
                        ],
                        [
                            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "TikTok"
                            ]
                        ],
                        [
                            /headlesschrome(?:\/([\w\.]+)| )/i
                        ],
                        [
                            f,
                            [
                                u,
                                C + " Headless"
                            ]
                        ],
                        [
                            / wv\).+(chrome)\/([\w\.]+)/i
                        ],
                        [
                            [
                                u,
                                C + " WebView"
                            ],
                            f
                        ],
                        [
                            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "Android " + A
                            ]
                        ],
                        [
                            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
                        ],
                        [
                            u,
                            f
                        ],
                        [
                            /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "Mobile Safari"
                            ]
                        ],
                        [
                            /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i
                        ],
                        [
                            f,
                            u
                        ],
                        [
                            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
                        ],
                        [
                            u,
                            [
                                f,
                                strMapper,
                                $
                            ]
                        ],
                        [
                            /(webkit|khtml)\/([\w\.]+)/i
                        ],
                        [
                            u,
                            f
                        ],
                        [
                            /(navigator|netscape\d?)\/([-\w\.]+)/i
                        ],
                        [
                            [
                                u,
                                "Netscape"
                            ],
                            f
                        ],
                        [
                            /mobile vr; rv:([\w\.]+)\).+firefox/i
                        ],
                        [
                            f,
                            [
                                u,
                                O + " Reality"
                            ]
                        ],
                        [
                            /ekiohf.+(flow)\/([\w\.]+)/i,
                            /(swiftfox)/i,
                            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
                            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
                            /(firefox)\/([\w\.]+)/i,
                            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
                            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
                            /(links) \(([\w\.]+)/i,
                            /panasonic;(viera)/i
                        ],
                        [
                            u,
                            f
                        ],
                        [
                            /(cobalt)\/([\w\.]+)/i
                        ],
                        [
                            u,
                            [
                                f,
                                /master.|lts./,
                                ""
                            ]
                        ]
                    ],
                    cpu: [
                        [
                            /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i
                        ],
                        [
                            [
                                h,
                                "amd64"
                            ]
                        ],
                        [
                            /(ia32(?=;))/i
                        ],
                        [
                            [
                                h,
                                lowerize
                            ]
                        ],
                        [
                            /((?:i[346]|x)86)[;\)]/i
                        ],
                        [
                            [
                                h,
                                "ia32"
                            ]
                        ],
                        [
                            /\b(aarch64|arm(v?8e?l?|_?64))\b/i
                        ],
                        [
                            [
                                h,
                                "arm64"
                            ]
                        ],
                        [
                            /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i
                        ],
                        [
                            [
                                h,
                                "armhf"
                            ]
                        ],
                        [
                            /windows (ce|mobile); ppc;/i
                        ],
                        [
                            [
                                h,
                                "arm"
                            ]
                        ],
                        [
                            /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i
                        ],
                        [
                            [
                                h,
                                /ower/,
                                t,
                                lowerize
                            ]
                        ],
                        [
                            /(sun4\w)[;\)]/i
                        ],
                        [
                            [
                                h,
                                "sparc"
                            ]
                        ],
                        [
                            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
                        ],
                        [
                            [
                                h,
                                lowerize
                            ]
                        ]
                    ],
                    device: [
                        [
                            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
                        ],
                        [
                            c,
                            [
                                m,
                                V
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
                            /samsung[- ]([-\w]+)/i,
                            /sec-(sgh\w+)/i
                        ],
                        [
                            c,
                            [
                                m,
                                V
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
                        ],
                        [
                            c,
                            [
                                m,
                                S
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\((ipad);[-\w\),; ]+apple/i,
                            /applecoremedia\/[\w\.]+ \((ipad)/i,
                            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
                        ],
                        [
                            c,
                            [
                                m,
                                S
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /(macintosh);/i
                        ],
                        [
                            c,
                            [
                                m,
                                S
                            ]
                        ],
                        [
                            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
                        ],
                        [
                            c,
                            [
                                m,
                                D
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
                        ],
                        [
                            c,
                            [
                                m,
                                j
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /(?:huawei|honor)([-\w ]+)[;\)]/i,
                            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
                        ],
                        [
                            c,
                            [
                                m,
                                j
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\b(poco[\w ]+)(?: bui|\))/i,
                            /\b; (\w+) build\/hm\1/i,
                            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
                            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
                            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i
                        ],
                        [
                            [
                                c,
                                /_/g,
                                " "
                            ],
                            [
                                m,
                                F
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i
                        ],
                        [
                            [
                                c,
                                /_/g,
                                " "
                            ],
                            [
                                m,
                                F
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /; (\w+) bui.+ oppo/i,
                            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "OPPO"
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /vivo (\w+)(?: bui|\))/i,
                            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Vivo"
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\b(rmx[12]\d{3})(?: bui|;|\))/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Realme"
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
                            /\bmot(?:orola)?[- ](\w*)/i,
                            /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
                        ],
                        [
                            c,
                            [
                                m,
                                M
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
                        ],
                        [
                            c,
                            [
                                m,
                                M
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
                        ],
                        [
                            c,
                            [
                                m,
                                P
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
                            /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
                            /\blg-?([\d\w]+) bui/i
                        ],
                        [
                            c,
                            [
                                m,
                                P
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /(ideatab[-\w ]+)/i,
                            /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Lenovo"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /(?:maemo|nokia).*(n900|lumia \d+)/i,
                            /nokia[-_ ]?([-\w\.]*)/i
                        ],
                        [
                            [
                                c,
                                /_/g,
                                " "
                            ],
                            [
                                m,
                                "Nokia"
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /(pixel c)\b/i
                        ],
                        [
                            c,
                            [
                                m,
                                U
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i
                        ],
                        [
                            c,
                            [
                                m,
                                U
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
                        ],
                        [
                            c,
                            [
                                m,
                                I
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /sony tablet [ps]/i,
                            /\b(?:sony)?sgp\w+(?: bui|\))/i
                        ],
                        [
                            [
                                c,
                                "Xperia Tablet"
                            ],
                            [
                                m,
                                I
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            / (kb2005|in20[12]5|be20[12][59])\b/i,
                            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
                        ],
                        [
                            c,
                            [
                                m,
                                "OnePlus"
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /(alexa)webm/i,
                            /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,
                            /(kf[a-z]+)( bui|\)).+silk\//i
                        ],
                        [
                            c,
                            [
                                m,
                                T
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
                        ],
                        [
                            [
                                c,
                                /(.+)/g,
                                "Fire Phone $1"
                            ],
                            [
                                m,
                                T
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /(playbook);[-\w\),; ]+(rim)/i
                        ],
                        [
                            c,
                            m,
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b((?:bb[a-f]|st[hv])100-\d)/i,
                            /\(bb10; (\w+)/i
                        ],
                        [
                            c,
                            [
                                m,
                                N
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
                        ],
                        [
                            c,
                            [
                                m,
                                z
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
                        ],
                        [
                            c,
                            [
                                m,
                                z
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /(nexus 9)/i
                        ],
                        [
                            c,
                            [
                                m,
                                "HTC"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
                            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
                            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
                        ],
                        [
                            m,
                            [
                                c,
                                /_/g,
                                " "
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Acer"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /droid.+; (m[1-5] note) bui/i,
                            /\bmz-([-\w]{2,})/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Meizu"
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
                            /(hp) ([\w ]+\w)/i,
                            /(asus)-?(\w+)/i,
                            /(microsoft); (lumia[\w ]+)/i,
                            /(lenovo)[-_ ]?([-\w]+)/i,
                            /(jolla)/i,
                            /(oppo) ?([\w ]+) bui/i
                        ],
                        [
                            m,
                            c,
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /(kobo)\s(ereader|touch)/i,
                            /(archos) (gamepad2?)/i,
                            /(hp).+(touchpad(?!.+tablet)|tablet)/i,
                            /(kindle)\/([\w\.]+)/i,
                            /(nook)[\w ]+build\/(\w+)/i,
                            /(dell) (strea[kpr\d ]*[\dko])/i,
                            /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
                            /(trinity)[- ]*(t\d{3}) bui/i,
                            /(gigaset)[- ]+(q\w{1,9}) bui/i,
                            /(vodafone) ([\w ]+)(?:\)| bui)/i
                        ],
                        [
                            m,
                            c,
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /(surface duo)/i
                        ],
                        [
                            c,
                            [
                                m,
                                R
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /droid [\d\.]+; (fp\du?)(?: b|\))/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Fairphone"
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /(u304aa)/i
                        ],
                        [
                            c,
                            [
                                m,
                                "AT&T"
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\bsie-(\w*)/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Siemens"
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\b(rct\w+) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "RCA"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b(venue[\d ]{2,7}) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Dell"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b(q(?:mv|ta)\w+) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Verizon"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Barnes & Noble"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b(tm\d{3}\w+) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "NuVision"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b(k88) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "ZTE"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b(nx\d{3}j) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "ZTE"
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\b(gen\d{3}) b.+49h/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Swiss"
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\b(zur\d{3}) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Swiss"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b((zeki)?tb.*\b) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Zeki"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b([yr]\d{2}) b/i,
                            /\b(dragon[- ]+touch |dt)(\w{5}) b/i
                        ],
                        [
                            [
                                m,
                                "Dragon Touch"
                            ],
                            c,
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b(ns-?\w{0,9}) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Insignia"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b((nxa|next)-?\w{0,9}) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "NextBook"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i
                        ],
                        [
                            [
                                m,
                                "Voice"
                            ],
                            c,
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\b(lvtel\-)?(v1[12]) b/i
                        ],
                        [
                            [
                                m,
                                "LvTel"
                            ],
                            c,
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\b(ph-1) /i
                        ],
                        [
                            c,
                            [
                                m,
                                "Essential"
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /\b(v(100md|700na|7011|917g).*\b) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Envizen"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b(trio[-\w\. ]+) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "MachSpeed"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\btu_(1491) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Rotor"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /(shield[\w ]+) b/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Nvidia"
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /(sprint) (\w+)/i
                        ],
                        [
                            m,
                            c,
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /(kin\.[onetw]{3})/i
                        ],
                        [
                            [
                                c,
                                /\./g,
                                " "
                            ],
                            [
                                m,
                                R
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
                        ],
                        [
                            c,
                            [
                                m,
                                G
                            ],
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
                        ],
                        [
                            c,
                            [
                                m,
                                G
                            ],
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /smart-tv.+(samsung)/i
                        ],
                        [
                            m,
                            [
                                p,
                                x
                            ]
                        ],
                        [
                            /hbbtv.+maple;(\d+)/i
                        ],
                        [
                            [
                                c,
                                /^/,
                                "SmartTV"
                            ],
                            [
                                m,
                                V
                            ],
                            [
                                p,
                                x
                            ]
                        ],
                        [
                            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
                        ],
                        [
                            [
                                m,
                                P
                            ],
                            [
                                p,
                                x
                            ]
                        ],
                        [
                            /(apple) ?tv/i
                        ],
                        [
                            m,
                            [
                                c,
                                S + " TV"
                            ],
                            [
                                p,
                                x
                            ]
                        ],
                        [
                            /crkey/i
                        ],
                        [
                            [
                                c,
                                C + "cast"
                            ],
                            [
                                m,
                                U
                            ],
                            [
                                p,
                                x
                            ]
                        ],
                        [
                            /droid.+aft(\w)( bui|\))/i
                        ],
                        [
                            c,
                            [
                                m,
                                T
                            ],
                            [
                                p,
                                x
                            ]
                        ],
                        [
                            /\(dtv[\);].+(aquos)/i,
                            /(aquos-tv[\w ]+)\)/i
                        ],
                        [
                            c,
                            [
                                m,
                                D
                            ],
                            [
                                p,
                                x
                            ]
                        ],
                        [
                            /(bravia[\w ]+)( bui|\))/i
                        ],
                        [
                            c,
                            [
                                m,
                                I
                            ],
                            [
                                p,
                                x
                            ]
                        ],
                        [
                            /(mitv-\w{5}) bui/i
                        ],
                        [
                            c,
                            [
                                m,
                                F
                            ],
                            [
                                p,
                                x
                            ]
                        ],
                        [
                            /Hbbtv.*(technisat) (.*);/i
                        ],
                        [
                            m,
                            c,
                            [
                                p,
                                x
                            ]
                        ],
                        [
                            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
                            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
                        ],
                        [
                            [
                                m,
                                trim
                            ],
                            [
                                c,
                                trim
                            ],
                            [
                                p,
                                x
                            ]
                        ],
                        [
                            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
                        ],
                        [
                            [
                                p,
                                x
                            ]
                        ],
                        [
                            /(ouya)/i,
                            /(nintendo) ([wids3utch]+)/i
                        ],
                        [
                            m,
                            c,
                            [
                                p,
                                v
                            ]
                        ],
                        [
                            /droid.+; (shield) bui/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Nvidia"
                            ],
                            [
                                p,
                                v
                            ]
                        ],
                        [
                            /(playstation [345portablevi]+)/i
                        ],
                        [
                            c,
                            [
                                m,
                                I
                            ],
                            [
                                p,
                                v
                            ]
                        ],
                        [
                            /\b(xbox(?: one)?(?!; xbox))[\); ]/i
                        ],
                        [
                            c,
                            [
                                m,
                                R
                            ],
                            [
                                p,
                                v
                            ]
                        ],
                        [
                            /((pebble))app/i
                        ],
                        [
                            m,
                            c,
                            [
                                p,
                                _
                            ]
                        ],
                        [
                            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
                        ],
                        [
                            c,
                            [
                                m,
                                S
                            ],
                            [
                                p,
                                _
                            ]
                        ],
                        [
                            /droid.+; (glass) \d/i
                        ],
                        [
                            c,
                            [
                                m,
                                U
                            ],
                            [
                                p,
                                _
                            ]
                        ],
                        [
                            /droid.+; (wt63?0{2,3})\)/i
                        ],
                        [
                            c,
                            [
                                m,
                                G
                            ],
                            [
                                p,
                                _
                            ]
                        ],
                        [
                            /(quest( 2| pro)?)/i
                        ],
                        [
                            c,
                            [
                                m,
                                H
                            ],
                            [
                                p,
                                _
                            ]
                        ],
                        [
                            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
                        ],
                        [
                            m,
                            [
                                p,
                                y
                            ]
                        ],
                        [
                            /(aeobc)\b/i
                        ],
                        [
                            c,
                            [
                                m,
                                T
                            ],
                            [
                                p,
                                y
                            ]
                        ],
                        [
                            /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i
                        ],
                        [
                            c,
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i
                        ],
                        [
                            c,
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
                        ],
                        [
                            [
                                p,
                                k
                            ]
                        ],
                        [
                            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
                        ],
                        [
                            [
                                p,
                                g
                            ]
                        ],
                        [
                            /(android[-\w\. ]{0,9});.+buil/i
                        ],
                        [
                            c,
                            [
                                m,
                                "Generic"
                            ]
                        ]
                    ],
                    engine: [
                        [
                            /windows.+ edge\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                E + "HTML"
                            ]
                        ],
                        [
                            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "Blink"
                            ]
                        ],
                        [
                            /(presto)\/([\w\.]+)/i,
                            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
                            /ekioh(flow)\/([\w\.]+)/i,
                            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
                            /(icab)[\/ ]([23]\.[\d\.]+)/i,
                            /\b(libweb)/i
                        ],
                        [
                            u,
                            f
                        ],
                        [
                            /rv\:([\w\.]{1,9})\b.+(gecko)/i
                        ],
                        [
                            f,
                            u
                        ]
                    ],
                    os: [
                        [
                            /microsoft (windows) (vista|xp)/i
                        ],
                        [
                            u,
                            f
                        ],
                        [
                            /(windows) nt 6\.2; (arm)/i,
                            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,
                            /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i
                        ],
                        [
                            u,
                            [
                                f,
                                strMapper,
                                X
                            ]
                        ],
                        [
                            /(win(?=3|9|n)|win 9x )([nt\d\.]+)/i
                        ],
                        [
                            [
                                u,
                                "Windows"
                            ],
                            [
                                f,
                                strMapper,
                                X
                            ]
                        ],
                        [
                            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
                            /ios;fbsv\/([\d\.]+)/i,
                            /cfnetwork\/.+darwin/i
                        ],
                        [
                            [
                                f,
                                /_/g,
                                "."
                            ],
                            [
                                u,
                                "iOS"
                            ]
                        ],
                        [
                            /(mac os x) ?([\w\. ]*)/i,
                            /(macintosh|mac_powerpc\b)(?!.+haiku)/i
                        ],
                        [
                            [
                                u,
                                Z
                            ],
                            [
                                f,
                                /_/g,
                                "."
                            ]
                        ],
                        [
                            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i
                        ],
                        [
                            f,
                            u
                        ],
                        [
                            /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
                            /(blackberry)\w*\/([\w\.]*)/i,
                            /(tizen|kaios)[\/ ]([\w\.]+)/i,
                            /\((series40);/i
                        ],
                        [
                            u,
                            f
                        ],
                        [
                            /\(bb(10);/i
                        ],
                        [
                            f,
                            [
                                u,
                                N
                            ]
                        ],
                        [
                            /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "Symbian"
                            ]
                        ],
                        [
                            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                O + " OS"
                            ]
                        ],
                        [
                            /web0s;.+rt(tv)/i,
                            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "webOS"
                            ]
                        ],
                        [
                            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                "watchOS"
                            ]
                        ],
                        [
                            /crkey\/([\d\.]+)/i
                        ],
                        [
                            f,
                            [
                                u,
                                C + "cast"
                            ]
                        ],
                        [
                            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
                        ],
                        [
                            [
                                u,
                                L
                            ],
                            f
                        ],
                        [
                            /panasonic;(viera)/i,
                            /(netrange)mmh/i,
                            /(nettv)\/(\d+\.[\w\.]+)/i,
                            /(nintendo|playstation) ([wids345portablevuch]+)/i,
                            /(xbox); +xbox ([^\);]+)/i,
                            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
                            /(mint)[\/\(\) ]?(\w*)/i,
                            /(mageia|vectorlinux)[; ]/i,
                            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
                            /(hurd|linux) ?([\w\.]*)/i,
                            /(gnu) ?([\w\.]*)/i,
                            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
                            /(haiku) (\w+)/i
                        ],
                        [
                            u,
                            f
                        ],
                        [
                            /(sunos) ?([\w\.\d]*)/i
                        ],
                        [
                            [
                                u,
                                "Solaris"
                            ],
                            f
                        ],
                        [
                            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
                            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
                            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,
                            /(unix) ?([\w\.]*)/i
                        ],
                        [
                            u,
                            f
                        ]
                    ]
                };
                var UAParser = function(i, e) {
                    if (typeof i === w) {
                        e = i;
                        i = a;
                    }
                    if (!(this instanceof UAParser)) {
                        return new UAParser(i, e).getResult();
                    }
                    var r = typeof o !== b && o.navigator ? o.navigator : a;
                    var n = i || (r && r.userAgent ? r.userAgent : t);
                    var v = r && r.userAgentData ? r.userAgentData : a;
                    var x = e ? extend(K, e) : K;
                    var _ = r && r.userAgent == n;
                    this.getBrowser = function() {
                        var i = {};
                        i[u] = a;
                        i[f] = a;
                        rgxMapper.call(i, n, x.browser);
                        i[d] = majorize(i[f]);
                        if (_ && r && r.brave && typeof r.brave.isBrave == s) {
                            i[u] = "Brave";
                        }
                        return i;
                    };
                    this.getCPU = function() {
                        var i = {};
                        i[h] = a;
                        rgxMapper.call(i, n, x.cpu);
                        return i;
                    };
                    this.getDevice = function() {
                        var i = {};
                        i[m] = a;
                        i[c] = a;
                        i[p] = a;
                        rgxMapper.call(i, n, x.device);
                        if (_ && !i[p] && v && v.mobile) {
                            i[p] = g;
                        }
                        if (_ && i[c] == "Macintosh" && r && typeof r.standalone !== b && r.maxTouchPoints && r.maxTouchPoints > 2) {
                            i[c] = "iPad";
                            i[p] = k;
                        }
                        return i;
                    };
                    this.getEngine = function() {
                        var i = {};
                        i[u] = a;
                        i[f] = a;
                        rgxMapper.call(i, n, x.engine);
                        return i;
                    };
                    this.getOS = function() {
                        var i = {};
                        i[u] = a;
                        i[f] = a;
                        rgxMapper.call(i, n, x.os);
                        if (_ && !i[u] && v && v.platform != "Unknown") {
                            i[u] = v.platform.replace(/chrome os/i, L).replace(/macos/i, Z);
                        }
                        return i;
                    };
                    this.getResult = function() {
                        return {
                            ua: this.getUA(),
                            browser: this.getBrowser(),
                            engine: this.getEngine(),
                            os: this.getOS(),
                            device: this.getDevice(),
                            cpu: this.getCPU()
                        };
                    };
                    this.getUA = function() {
                        return n;
                    };
                    this.setUA = function(i) {
                        n = typeof i === l && i.length > q ? trim(i, q) : i;
                        return this;
                    };
                    this.setUA(n);
                    return this;
                };
                UAParser.VERSION = r;
                UAParser.BROWSER = enumerize([
                    u,
                    f,
                    d
                ]);
                UAParser.CPU = enumerize([
                    h
                ]);
                UAParser.DEVICE = enumerize([
                    c,
                    m,
                    p,
                    v,
                    g,
                    x,
                    k,
                    _,
                    y
                ]);
                UAParser.ENGINE = UAParser.OS = enumerize([
                    u,
                    f
                ]);
                if (typeof e !== b) {
                    if ("object" !== b && i.exports) {
                        e = i.exports = UAParser;
                    }
                    e.UAParser = UAParser;
                } else {
                    if (typeof define === s && define.amd) {
                        ((r)=>r !== undefined && __turbopack_context__.v(r))(function() {
                            return UAParser;
                        }(__turbopack_context__.r, exports, module));
                    } else if (typeof o !== b) {
                        o.UAParser = UAParser;
                    }
                }
                var Q = typeof o !== b && (o.jQuery || o.Zepto);
                if (Q && !Q.ua) {
                    var Y = new UAParser;
                    Q.ua = Y.getResult();
                    Q.ua.get = function() {
                        return Y.getUA();
                    };
                    Q.ua.set = function(i) {
                        Y.setUA(i);
                        var e = Y.getResult();
                        for(var o in e){
                            Q.ua[o] = e[o];
                        }
                    };
                }
            })(typeof window === "object" ? window : this);
        }
    };
    var e = {};
    function __nccwpck_require__(o) {
        var a = e[o];
        if (a !== undefined) {
            return a.exports;
        }
        var r = e[o] = {
            exports: {}
        };
        var t = true;
        try {
            i[o].call(r.exports, r, r.exports, __nccwpck_require__);
            t = false;
        } finally{
            if (t) delete e[o];
        }
        return r.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/Demo-2/node_modules/next/dist/compiled/ua-parser-js") + "/";
    var o = __nccwpck_require__(226);
    module.exports = o;
})();
}),
"[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/user-agent.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    isBot: null,
    userAgent: null,
    userAgentFromString: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isBot: function() {
        return isBot;
    },
    userAgent: function() {
        return userAgent;
    },
    userAgentFromString: function() {
        return userAgentFromString;
    }
});
const _uaparserjs = /*#__PURE__*/ _interop_require_default(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/compiled/ua-parser-js/ua-parser.js [app-client] (ecmascript)"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function isBot(input) {
    return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Google-InspectionTool|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(input);
}
function userAgentFromString(input) {
    return {
        ...(0, _uaparserjs.default)(input),
        isBot: input === undefined ? false : isBot(input)
    };
}
function userAgent({ headers }) {
    return userAgentFromString(headers.get('user-agent') || undefined);
} //# sourceMappingURL=user-agent.js.map
}),
"[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/url-pattern.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "URLPattern", {
    enumerable: true,
    get: function() {
        return GlobalURLPattern;
    }
});
const GlobalURLPattern = typeof URLPattern === 'undefined' ? undefined : URLPattern; //# sourceMappingURL=url-pattern.js.map
}),
"[project]/Demo-2/node_modules/next/dist/server/after/after.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "after", {
    enumerable: true,
    get: function() {
        return after;
    }
});
const _workasyncstorageexternal = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/app-render/work-async-storage.external.js [app-client] (ecmascript)");
function after(task) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    if (!workStore) {
        // TODO(after): the linked docs page talks about *dynamic* APIs, which after soon won't be anymore
        throw Object.defineProperty(new Error('`after` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context'), "__NEXT_ERROR_CODE", {
            value: "E468",
            enumerable: false,
            configurable: true
        });
    }
    const { afterContext } = workStore;
    return afterContext.after(task);
} //# sourceMappingURL=after.js.map
}),
"[project]/Demo-2/node_modules/next/dist/server/after/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && __export(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/after/after.js [app-client] (ecmascript)"));
_export_star(__turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/after/after.js [app-client] (ecmascript)"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
} //# sourceMappingURL=index.js.map
}),
"[project]/Demo-2/node_modules/next/dist/server/request/connection.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Demo-2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "connection", {
    enumerable: true,
    get: function() {
        return connection;
    }
});
const _workasyncstorageexternal = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/app-render/work-async-storage.external.js [app-client] (ecmascript)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/app-render/work-unit-async-storage.external.js [app-client] (ecmascript)");
const _dynamicrendering = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-client] (ecmascript)");
const _staticgenerationbailout = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/client/components/static-generation-bailout.js [app-client] (ecmascript)");
const _dynamicrenderingutils = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/dynamic-rendering-utils.js [app-client] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/request/utils.js [app-client] (ecmascript)");
const _stagedrendering = __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/app-render/staged-rendering.js [app-client] (ecmascript)");
function connection() {
    const callingExpression = 'connection';
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore) {
        if (workUnitStore && workUnitStore.phase === 'after' && !(0, _utils.isRequestAPICallableInsideAfter)()) {
            throw Object.defineProperty(new Error(`Route ${workStore.route} used \`connection()\` inside \`after()\`. The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual Request, but \`after()\` executes after the request, so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", {
                value: "E827",
                enumerable: false,
                configurable: true
            });
        }
        if (workStore.forceStatic) {
            // When using forceStatic, we override all other logic and always just
            // return a resolving promise without tracking.
            return Promise.resolve(undefined);
        }
        if (workStore.dynamicShouldError) {
            throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${workStore.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`connection()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
                value: "E847",
                enumerable: false,
                configurable: true
            });
        }
        if (workUnitStore) {
            switch(workUnitStore.type){
                case 'cache':
                    {
                        const error = Object.defineProperty(new Error(`Route ${workStore.route} used \`connection()\` inside "use cache". The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual request, but caches must be able to be produced before a request, so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
                            value: "E841",
                            enumerable: false,
                            configurable: true
                        });
                        Error.captureStackTrace(error, connection);
                        workStore.invalidDynamicUsageError ??= error;
                        throw error;
                    }
                case 'private-cache':
                    {
                        // It might not be intuitive to throw for private caches as well, but
                        // we don't consider runtime prefetches as "actual requests" (in the
                        // navigation sense), despite allowing them to read cookies.
                        const error = Object.defineProperty(new Error(`Route ${workStore.route} used \`connection()\` inside "use cache: private". The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual navigation request, but caches must be able to be produced before a navigation request, so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
                            value: "E837",
                            enumerable: false,
                            configurable: true
                        });
                        Error.captureStackTrace(error, connection);
                        workStore.invalidDynamicUsageError ??= error;
                        throw error;
                    }
                case 'unstable-cache':
                    throw Object.defineProperty(new Error(`Route ${workStore.route} used \`connection()\` inside a function cached with \`unstable_cache()\`. The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual Request, but caches must be able to be produced before a Request so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", {
                        value: "E840",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender':
                case 'prerender-client':
                case 'prerender-runtime':
                    // We return a promise that never resolves to allow the prerender to
                    // stall at this point.
                    return (0, _dynamicrenderingutils.makeHangingPromise)(workUnitStore.renderSignal, workStore.route, '`connection()`');
                case 'prerender-ppr':
                    // We use React's postpone API to interrupt rendering here to create a
                    // dynamic hole
                    return (0, _dynamicrendering.postponeWithTracking)(workStore.route, 'connection', workUnitStore.dynamicTracking);
                case 'prerender-legacy':
                    // We throw an error here to interrupt prerendering to mark the route
                    // as dynamic
                    return (0, _dynamicrendering.throwToInterruptStaticGeneration)('connection', workStore, workUnitStore);
                case 'request':
                    (0, _dynamicrendering.trackDynamicDataInDynamicRender)(workUnitStore);
                    if ("TURBOPACK compile-time truthy", 1) {
                        // Semantically we only need the dev tracking when running in `next dev`
                        // but since you would never use next dev with production NODE_ENV we use this
                        // as a proxy so we can statically exclude this code from production builds.
                        if (workUnitStore.asyncApiPromises) {
                            return workUnitStore.asyncApiPromises.connection;
                        }
                        return (0, _dynamicrenderingutils.makeDevtoolsIOAwarePromise)(undefined, workUnitStore, _stagedrendering.RenderStage.Dynamic);
                    } else //TURBOPACK unreachable
                    ;
                default:
                    workUnitStore;
            }
        }
    }
    // If we end up here, there was no work store or work unit store present.
    (0, _workunitasyncstorageexternal.throwForMissingRequestStore)(callingExpression);
} //# sourceMappingURL=connection.js.map
}),
"[project]/Demo-2/node_modules/next/server.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const serverExports = {
    NextRequest: __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/request.js [app-client] (ecmascript)").NextRequest,
    NextResponse: __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/response.js [app-client] (ecmascript)").NextResponse,
    ImageResponse: __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/image-response.js [app-client] (ecmascript)").ImageResponse,
    userAgentFromString: __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/user-agent.js [app-client] (ecmascript)").userAgentFromString,
    userAgent: __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/user-agent.js [app-client] (ecmascript)").userAgent,
    URLPattern: __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/web/spec-extension/url-pattern.js [app-client] (ecmascript)").URLPattern,
    after: __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/after/index.js [app-client] (ecmascript)").after,
    connection: __turbopack_context__.r("[project]/Demo-2/node_modules/next/dist/server/request/connection.js [app-client] (ecmascript)").connection
};
// https://nodejs.org/api/esm.html#commonjs-namespaces
// When importing CommonJS modules, the module.exports object is provided as the default export
module.exports = serverExports;
// make import { xxx } from 'next/server' work
exports.NextRequest = serverExports.NextRequest;
exports.NextResponse = serverExports.NextResponse;
exports.ImageResponse = serverExports.ImageResponse;
exports.userAgentFromString = serverExports.userAgentFromString;
exports.userAgent = serverExports.userAgent;
exports.URLPattern = serverExports.URLPattern;
exports.after = serverExports.after;
exports.connection = serverExports.connection;
}),
]);

//# sourceMappingURL=6e6c4_9df9403e._.js.map