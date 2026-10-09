module.exports = [
"[project]/Demo-2/node_modules/oauth4webapi/build/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OperationProcessingError",
    ()=>OperationProcessingError,
    "UnsupportedOperationError",
    ()=>UnsupportedOperationError,
    "authorizationCodeGrantRequest",
    ()=>authorizationCodeGrantRequest,
    "calculatePKCECodeChallenge",
    ()=>calculatePKCECodeChallenge,
    "clientCredentialsGrantRequest",
    ()=>clientCredentialsGrantRequest,
    "clockSkew",
    ()=>clockSkew,
    "clockTolerance",
    ()=>clockTolerance,
    "customFetch",
    ()=>customFetch,
    "deviceAuthorizationRequest",
    ()=>deviceAuthorizationRequest,
    "deviceCodeGrantRequest",
    ()=>deviceCodeGrantRequest,
    "discoveryRequest",
    ()=>discoveryRequest,
    "expectNoNonce",
    ()=>expectNoNonce,
    "expectNoState",
    ()=>expectNoState,
    "experimentalCustomFetch",
    ()=>experimentalCustomFetch,
    "experimentalUseMtlsAlias",
    ()=>experimentalUseMtlsAlias,
    "experimental_customFetch",
    ()=>experimental_customFetch,
    "experimental_jwksCache",
    ()=>experimental_jwksCache,
    "experimental_useMtlsAlias",
    ()=>experimental_useMtlsAlias,
    "experimental_validateDetachedSignatureResponse",
    ()=>experimental_validateDetachedSignatureResponse,
    "experimental_validateJwtAccessToken",
    ()=>experimental_validateJwtAccessToken,
    "generateKeyPair",
    ()=>generateKeyPair,
    "generateRandomCodeVerifier",
    ()=>generateRandomCodeVerifier,
    "generateRandomNonce",
    ()=>generateRandomNonce,
    "generateRandomState",
    ()=>generateRandomState,
    "genericTokenEndpointRequest",
    ()=>genericTokenEndpointRequest,
    "getValidatedIdTokenClaims",
    ()=>getValidatedIdTokenClaims,
    "introspectionRequest",
    ()=>introspectionRequest,
    "isOAuth2Error",
    ()=>isOAuth2Error,
    "issueRequestObject",
    ()=>issueRequestObject,
    "jweDecrypt",
    ()=>jweDecrypt,
    "jwksCache",
    ()=>jwksCache,
    "modifyAssertion",
    ()=>modifyAssertion,
    "parseWwwAuthenticateChallenges",
    ()=>parseWwwAuthenticateChallenges,
    "processAuthorizationCodeOAuth2Response",
    ()=>processAuthorizationCodeOAuth2Response,
    "processAuthorizationCodeOpenIDResponse",
    ()=>processAuthorizationCodeOpenIDResponse,
    "processClientCredentialsResponse",
    ()=>processClientCredentialsResponse,
    "processDeviceAuthorizationResponse",
    ()=>processDeviceAuthorizationResponse,
    "processDeviceCodeResponse",
    ()=>processDeviceCodeResponse,
    "processDiscoveryResponse",
    ()=>processDiscoveryResponse,
    "processIntrospectionResponse",
    ()=>processIntrospectionResponse,
    "processPushedAuthorizationResponse",
    ()=>processPushedAuthorizationResponse,
    "processRefreshTokenResponse",
    ()=>processRefreshTokenResponse,
    "processRevocationResponse",
    ()=>processRevocationResponse,
    "processUserInfoResponse",
    ()=>processUserInfoResponse,
    "protectedResourceRequest",
    ()=>protectedResourceRequest,
    "pushedAuthorizationRequest",
    ()=>pushedAuthorizationRequest,
    "refreshTokenGrantRequest",
    ()=>refreshTokenGrantRequest,
    "revocationRequest",
    ()=>revocationRequest,
    "skipAuthTimeCheck",
    ()=>skipAuthTimeCheck,
    "skipStateCheck",
    ()=>skipStateCheck,
    "skipSubjectCheck",
    ()=>skipSubjectCheck,
    "useMtlsAlias",
    ()=>useMtlsAlias,
    "userInfoRequest",
    ()=>userInfoRequest,
    "validateAuthResponse",
    ()=>validateAuthResponse,
    "validateDetachedSignatureResponse",
    ()=>validateDetachedSignatureResponse,
    "validateIdTokenSignature",
    ()=>validateIdTokenSignature,
    "validateJwtAccessToken",
    ()=>validateJwtAccessToken,
    "validateJwtAuthResponse",
    ()=>validateJwtAuthResponse,
    "validateJwtIntrospectionSignature",
    ()=>validateJwtIntrospectionSignature,
    "validateJwtUserInfoSignature",
    ()=>validateJwtUserInfoSignature,
    "validateJwtUserinfoSignature",
    ()=>validateJwtUserinfoSignature
]);
let USER_AGENT;
if (typeof navigator === 'undefined' || !navigator.userAgent?.startsWith?.('Mozilla/5.0 ')) {
    const NAME = 'oauth4webapi';
    const VERSION = 'v2.17.0';
    USER_AGENT = `${NAME}/${VERSION}`;
}
function looseInstanceOf(input, expected) {
    if (input == null) {
        return false;
    }
    try {
        return input instanceof expected || Object.getPrototypeOf(input)[Symbol.toStringTag] === expected.prototype[Symbol.toStringTag];
    } catch  {
        return false;
    }
}
const clockSkew = Symbol();
const clockTolerance = Symbol();
const customFetch = Symbol();
const modifyAssertion = Symbol();
const jweDecrypt = Symbol();
const jwksCache = Symbol();
const useMtlsAlias = Symbol();
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function buf(input) {
    if (typeof input === 'string') {
        return encoder.encode(input);
    }
    return decoder.decode(input);
}
const CHUNK_SIZE = 0x8000;
function encodeBase64Url(input) {
    if (input instanceof ArrayBuffer) {
        input = new Uint8Array(input);
    }
    const arr = [];
    for(let i = 0; i < input.byteLength; i += CHUNK_SIZE){
        arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
    }
    return btoa(arr.join('')).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function decodeBase64Url(input) {
    try {
        const binary = atob(input.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, ''));
        const bytes = new Uint8Array(binary.length);
        for(let i = 0; i < binary.length; i++){
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    } catch (cause) {
        throw new OPE('The input to be decoded is not correctly encoded.', {
            cause
        });
    }
}
function b64u(input) {
    if (typeof input === 'string') {
        return decodeBase64Url(input);
    }
    return encodeBase64Url(input);
}
class LRU {
    constructor(maxSize){
        this.cache = new Map();
        this._cache = new Map();
        this.maxSize = maxSize;
    }
    get(key) {
        let v = this.cache.get(key);
        if (v) {
            return v;
        }
        if (v = this._cache.get(key)) {
            this.update(key, v);
            return v;
        }
        return undefined;
    }
    has(key) {
        return this.cache.has(key) || this._cache.has(key);
    }
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.set(key, value);
        } else {
            this.update(key, value);
        }
        return this;
    }
    delete(key) {
        if (this.cache.has(key)) {
            return this.cache.delete(key);
        }
        if (this._cache.has(key)) {
            return this._cache.delete(key);
        }
        return false;
    }
    update(key, value) {
        this.cache.set(key, value);
        if (this.cache.size >= this.maxSize) {
            this._cache = this.cache;
            this.cache = new Map();
        }
    }
}
class UnsupportedOperationError extends Error {
    constructor(message){
        super(message ?? 'operation not supported');
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
class OperationProcessingError extends Error {
    constructor(message, options){
        super(message, options);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
const OPE = OperationProcessingError;
const dpopNonces = new LRU(100);
function isCryptoKey(key) {
    return key instanceof CryptoKey;
}
function isPrivateKey(key) {
    return isCryptoKey(key) && key.type === 'private';
}
function isPublicKey(key) {
    return isCryptoKey(key) && key.type === 'public';
}
const SUPPORTED_JWS_ALGS = [
    'PS256',
    'ES256',
    'RS256',
    'PS384',
    'ES384',
    'RS384',
    'PS512',
    'ES512',
    'RS512',
    'EdDSA'
];
function processDpopNonce(response) {
    try {
        const nonce = response.headers.get('dpop-nonce');
        if (nonce) {
            dpopNonces.set(new URL(response.url).origin, nonce);
        }
    } catch  {}
    return response;
}
function normalizeTyp(value) {
    return value.toLowerCase().replace(/^application\//, '');
}
function isJsonObject(input) {
    if (input === null || typeof input !== 'object' || Array.isArray(input)) {
        return false;
    }
    return true;
}
function prepareHeaders(input) {
    if (looseInstanceOf(input, Headers)) {
        input = Object.fromEntries(input.entries());
    }
    const headers = new Headers(input);
    if (USER_AGENT && !headers.has('user-agent')) {
        headers.set('user-agent', USER_AGENT);
    }
    if (headers.has('authorization')) {
        throw new TypeError('"options.headers" must not include the "authorization" header name');
    }
    if (headers.has('dpop')) {
        throw new TypeError('"options.headers" must not include the "dpop" header name');
    }
    return headers;
}
function signal(value) {
    if (typeof value === 'function') {
        value = value();
    }
    if (!(value instanceof AbortSignal)) {
        throw new TypeError('"options.signal" must return or be an instance of AbortSignal');
    }
    return value;
}
async function discoveryRequest(issuerIdentifier, options) {
    if (!(issuerIdentifier instanceof URL)) {
        throw new TypeError('"issuerIdentifier" must be an instance of URL');
    }
    if (issuerIdentifier.protocol !== 'https:' && issuerIdentifier.protocol !== 'http:') {
        throw new TypeError('"issuer.protocol" must be "https:" or "http:"');
    }
    const url = new URL(issuerIdentifier.href);
    switch(options?.algorithm){
        case undefined:
        case 'oidc':
            url.pathname = `${url.pathname}/.well-known/openid-configuration`.replace('//', '/');
            break;
        case 'oauth2':
            if (url.pathname === '/') {
                url.pathname = '.well-known/oauth-authorization-server';
            } else {
                url.pathname = `.well-known/oauth-authorization-server/${url.pathname}`.replace('//', '/');
            }
            break;
        default:
            throw new TypeError('"options.algorithm" must be "oidc" (default), or "oauth2"');
    }
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    return (options?.[customFetch] || fetch)(url.href, {
        headers: Object.fromEntries(headers.entries()),
        method: 'GET',
        redirect: 'manual',
        signal: options?.signal ? signal(options.signal) : null
    }).then(processDpopNonce);
}
function validateString(input) {
    return typeof input === 'string' && input.length !== 0;
}
async function processDiscoveryResponse(expectedIssuerIdentifier, response) {
    if (!(expectedIssuerIdentifier instanceof URL)) {
        throw new TypeError('"expectedIssuer" must be an instance of URL');
    }
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        throw new OPE('"response" is not a conform Authorization Server Metadata response');
    }
    assertReadableResponse(response);
    let json;
    try {
        json = await response.json();
    } catch (cause) {
        throw new OPE('failed to parse "response" body as JSON', {
            cause
        });
    }
    if (!isJsonObject(json)) {
        throw new OPE('"response" body must be a top level object');
    }
    if (!validateString(json.issuer)) {
        throw new OPE('"response" body "issuer" property must be a non-empty string');
    }
    if (new URL(json.issuer).href !== expectedIssuerIdentifier.href) {
        throw new OPE('"response" body "issuer" does not match "expectedIssuer"');
    }
    return json;
}
function randomBytes() {
    return b64u(crypto.getRandomValues(new Uint8Array(32)));
}
function generateRandomCodeVerifier() {
    return randomBytes();
}
function generateRandomState() {
    return randomBytes();
}
function generateRandomNonce() {
    return randomBytes();
}
async function calculatePKCECodeChallenge(codeVerifier) {
    if (!validateString(codeVerifier)) {
        throw new TypeError('"codeVerifier" must be a non-empty string');
    }
    return b64u(await crypto.subtle.digest('SHA-256', buf(codeVerifier)));
}
function getKeyAndKid(input) {
    if (input instanceof CryptoKey) {
        return {
            key: input
        };
    }
    if (!(input?.key instanceof CryptoKey)) {
        return {};
    }
    if (input.kid !== undefined && !validateString(input.kid)) {
        throw new TypeError('"kid" must be a non-empty string');
    }
    return {
        key: input.key,
        kid: input.kid,
        modifyAssertion: input[modifyAssertion]
    };
}
function formUrlEncode(token) {
    return encodeURIComponent(token).replace(/%20/g, '+');
}
function clientSecretBasic(clientId, clientSecret) {
    const username = formUrlEncode(clientId);
    const password = formUrlEncode(clientSecret);
    const credentials = btoa(`${username}:${password}`);
    return `Basic ${credentials}`;
}
function psAlg(key) {
    switch(key.algorithm.hash.name){
        case 'SHA-256':
            return 'PS256';
        case 'SHA-384':
            return 'PS384';
        case 'SHA-512':
            return 'PS512';
        default:
            throw new UnsupportedOperationError('unsupported RsaHashedKeyAlgorithm hash name');
    }
}
function rsAlg(key) {
    switch(key.algorithm.hash.name){
        case 'SHA-256':
            return 'RS256';
        case 'SHA-384':
            return 'RS384';
        case 'SHA-512':
            return 'RS512';
        default:
            throw new UnsupportedOperationError('unsupported RsaHashedKeyAlgorithm hash name');
    }
}
function esAlg(key) {
    switch(key.algorithm.namedCurve){
        case 'P-256':
            return 'ES256';
        case 'P-384':
            return 'ES384';
        case 'P-521':
            return 'ES512';
        default:
            throw new UnsupportedOperationError('unsupported EcKeyAlgorithm namedCurve');
    }
}
function keyToJws(key) {
    switch(key.algorithm.name){
        case 'RSA-PSS':
            return psAlg(key);
        case 'RSASSA-PKCS1-v1_5':
            return rsAlg(key);
        case 'ECDSA':
            return esAlg(key);
        case 'Ed25519':
        case 'Ed448':
            return 'EdDSA';
        default:
            throw new UnsupportedOperationError('unsupported CryptoKey algorithm name');
    }
}
function getClockSkew(client) {
    const skew = client?.[clockSkew];
    return typeof skew === 'number' && Number.isFinite(skew) ? skew : 0;
}
function getClockTolerance(client) {
    const tolerance = client?.[clockTolerance];
    return typeof tolerance === 'number' && Number.isFinite(tolerance) && Math.sign(tolerance) !== -1 ? tolerance : 30;
}
function epochTime() {
    return Math.floor(Date.now() / 1000);
}
function clientAssertion(as, client) {
    const now = epochTime() + getClockSkew(client);
    return {
        jti: randomBytes(),
        aud: [
            as.issuer,
            as.token_endpoint
        ],
        exp: now + 60,
        iat: now,
        nbf: now,
        iss: client.client_id,
        sub: client.client_id
    };
}
async function privateKeyJwt(as, client, key, kid, modifyAssertion) {
    const header = {
        alg: keyToJws(key),
        kid
    };
    const payload = clientAssertion(as, client);
    modifyAssertion?.(header, payload);
    return jwt(header, payload, key);
}
function assertAs(as) {
    if (typeof as !== 'object' || as === null) {
        throw new TypeError('"as" must be an object');
    }
    if (!validateString(as.issuer)) {
        throw new TypeError('"as.issuer" property must be a non-empty string');
    }
    return true;
}
function assertClient(client) {
    if (typeof client !== 'object' || client === null) {
        throw new TypeError('"client" must be an object');
    }
    if (!validateString(client.client_id)) {
        throw new TypeError('"client.client_id" property must be a non-empty string');
    }
    return true;
}
function assertClientSecret(clientSecret) {
    if (!validateString(clientSecret)) {
        throw new TypeError('"client.client_secret" property must be a non-empty string');
    }
    return clientSecret;
}
function assertNoClientPrivateKey(clientAuthMethod, clientPrivateKey) {
    if (clientPrivateKey !== undefined) {
        throw new TypeError(`"options.clientPrivateKey" property must not be provided when ${clientAuthMethod} client authentication method is used.`);
    }
}
function assertNoClientSecret(clientAuthMethod, clientSecret) {
    if (clientSecret !== undefined) {
        throw new TypeError(`"client.client_secret" property must not be provided when ${clientAuthMethod} client authentication method is used.`);
    }
}
async function clientAuthentication(as, client, body, headers, clientPrivateKey) {
    body.delete('client_secret');
    body.delete('client_assertion_type');
    body.delete('client_assertion');
    switch(client.token_endpoint_auth_method){
        case undefined:
        case 'client_secret_basic':
            {
                assertNoClientPrivateKey('client_secret_basic', clientPrivateKey);
                headers.set('authorization', clientSecretBasic(client.client_id, assertClientSecret(client.client_secret)));
                break;
            }
        case 'client_secret_post':
            {
                assertNoClientPrivateKey('client_secret_post', clientPrivateKey);
                body.set('client_id', client.client_id);
                body.set('client_secret', assertClientSecret(client.client_secret));
                break;
            }
        case 'private_key_jwt':
            {
                assertNoClientSecret('private_key_jwt', client.client_secret);
                if (clientPrivateKey === undefined) {
                    throw new TypeError('"options.clientPrivateKey" must be provided when "client.token_endpoint_auth_method" is "private_key_jwt"');
                }
                const { key, kid, modifyAssertion } = getKeyAndKid(clientPrivateKey);
                if (!isPrivateKey(key)) {
                    throw new TypeError('"options.clientPrivateKey.key" must be a private CryptoKey');
                }
                body.set('client_id', client.client_id);
                body.set('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
                body.set('client_assertion', await privateKeyJwt(as, client, key, kid, modifyAssertion));
                break;
            }
        case 'tls_client_auth':
        case 'self_signed_tls_client_auth':
        case 'none':
            {
                assertNoClientSecret(client.token_endpoint_auth_method, client.client_secret);
                assertNoClientPrivateKey(client.token_endpoint_auth_method, clientPrivateKey);
                body.set('client_id', client.client_id);
                break;
            }
        default:
            throw new UnsupportedOperationError('unsupported client token_endpoint_auth_method');
    }
}
async function jwt(header, payload, key) {
    if (!key.usages.includes('sign')) {
        throw new TypeError('CryptoKey instances used for signing assertions must include "sign" in their "usages"');
    }
    const input = `${b64u(buf(JSON.stringify(header)))}.${b64u(buf(JSON.stringify(payload)))}`;
    const signature = b64u(await crypto.subtle.sign(keyToSubtle(key), key, buf(input)));
    return `${input}.${signature}`;
}
async function issueRequestObject(as, client, parameters, privateKey) {
    assertAs(as);
    assertClient(client);
    parameters = new URLSearchParams(parameters);
    const { key, kid, modifyAssertion } = getKeyAndKid(privateKey);
    if (!isPrivateKey(key)) {
        throw new TypeError('"privateKey.key" must be a private CryptoKey');
    }
    parameters.set('client_id', client.client_id);
    const now = epochTime() + getClockSkew(client);
    const claims = {
        ...Object.fromEntries(parameters.entries()),
        jti: randomBytes(),
        aud: as.issuer,
        exp: now + 60,
        iat: now,
        nbf: now,
        iss: client.client_id
    };
    let resource;
    if (parameters.has('resource') && (resource = parameters.getAll('resource')) && resource.length > 1) {
        claims.resource = resource;
    }
    {
        let value = parameters.get('max_age');
        if (value !== null) {
            claims.max_age = parseInt(value, 10);
            if (!Number.isFinite(claims.max_age)) {
                throw new OPE('"max_age" parameter must be a number');
            }
        }
    }
    {
        let value = parameters.get('claims');
        if (value !== null) {
            try {
                claims.claims = JSON.parse(value);
            } catch (cause) {
                throw new OPE('failed to parse the "claims" parameter as JSON', {
                    cause
                });
            }
            if (!isJsonObject(claims.claims)) {
                throw new OPE('"claims" parameter must be a JSON with a top level object');
            }
        }
    }
    {
        let value = parameters.get('authorization_details');
        if (value !== null) {
            try {
                claims.authorization_details = JSON.parse(value);
            } catch (cause) {
                throw new OPE('failed to parse the "authorization_details" parameter as JSON', {
                    cause
                });
            }
            if (!Array.isArray(claims.authorization_details)) {
                throw new OPE('"authorization_details" parameter must be a JSON with a top level array');
            }
        }
    }
    const header = {
        alg: keyToJws(key),
        typ: 'oauth-authz-req+jwt',
        kid
    };
    modifyAssertion?.(header, claims);
    return jwt(header, claims, key);
}
async function dpopProofJwt(headers, options, url, htm, clockSkew, accessToken) {
    const { privateKey, publicKey, nonce = dpopNonces.get(url.origin) } = options;
    if (!isPrivateKey(privateKey)) {
        throw new TypeError('"DPoP.privateKey" must be a private CryptoKey');
    }
    if (!isPublicKey(publicKey)) {
        throw new TypeError('"DPoP.publicKey" must be a public CryptoKey');
    }
    if (nonce !== undefined && !validateString(nonce)) {
        throw new TypeError('"DPoP.nonce" must be a non-empty string or undefined');
    }
    if (!publicKey.extractable) {
        throw new TypeError('"DPoP.publicKey.extractable" must be true');
    }
    const now = epochTime() + clockSkew;
    const header = {
        alg: keyToJws(privateKey),
        typ: 'dpop+jwt',
        jwk: await publicJwk(publicKey)
    };
    const payload = {
        iat: now,
        jti: randomBytes(),
        htm,
        nonce,
        htu: `${url.origin}${url.pathname}`,
        ath: accessToken ? b64u(await crypto.subtle.digest('SHA-256', buf(accessToken))) : undefined
    };
    options[modifyAssertion]?.(header, payload);
    headers.set('dpop', await jwt(header, payload, privateKey));
}
let jwkCache;
async function getSetPublicJwkCache(key) {
    const { kty, e, n, x, y, crv } = await crypto.subtle.exportKey('jwk', key);
    const jwk = {
        kty,
        e,
        n,
        x,
        y,
        crv
    };
    jwkCache.set(key, jwk);
    return jwk;
}
async function publicJwk(key) {
    jwkCache || (jwkCache = new WeakMap());
    return jwkCache.get(key) || getSetPublicJwkCache(key);
}
function validateEndpoint(value, endpoint, useMtlsAlias) {
    if (typeof value !== 'string') {
        if (useMtlsAlias) {
            throw new TypeError(`"as.mtls_endpoint_aliases.${endpoint}" must be a string`);
        }
        throw new TypeError(`"as.${endpoint}" must be a string`);
    }
    return new URL(value);
}
function resolveEndpoint(as, endpoint, useMtlsAlias = false) {
    if (useMtlsAlias && as.mtls_endpoint_aliases && endpoint in as.mtls_endpoint_aliases) {
        return validateEndpoint(as.mtls_endpoint_aliases[endpoint], endpoint, useMtlsAlias);
    }
    return validateEndpoint(as[endpoint], endpoint, useMtlsAlias);
}
function alias(client, options) {
    if (client.use_mtls_endpoint_aliases || options?.[useMtlsAlias]) {
        return true;
    }
    return false;
}
async function pushedAuthorizationRequest(as, client, parameters, options) {
    assertAs(as);
    assertClient(client);
    const url = resolveEndpoint(as, 'pushed_authorization_request_endpoint', alias(client, options));
    const body = new URLSearchParams(parameters);
    body.set('client_id', client.client_id);
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    if (options?.DPoP !== undefined) {
        await dpopProofJwt(headers, options.DPoP, url, 'POST', getClockSkew(client));
    }
    return authenticatedRequest(as, client, 'POST', url, body, headers, options);
}
function isOAuth2Error(input) {
    const value = input;
    if (typeof value !== 'object' || Array.isArray(value) || value === null) {
        return false;
    }
    return value.error !== undefined;
}
function unquote(value) {
    if (value.length >= 2 && value[0] === '"' && value[value.length - 1] === '"') {
        return value.slice(1, -1);
    }
    return value;
}
const SPLIT_REGEXP = /((?:,|, )?[0-9a-zA-Z!#$%&'*+-.^_`|~]+=)/;
const SCHEMES_REGEXP = /(?:^|, ?)([0-9a-zA-Z!#$%&'*+\-.^_`|~]+)(?=$|[ ,])/g;
function wwwAuth(scheme, params) {
    const arr = params.split(SPLIT_REGEXP).slice(1);
    if (!arr.length) {
        return {
            scheme: scheme.toLowerCase(),
            parameters: {}
        };
    }
    arr[arr.length - 1] = arr[arr.length - 1].replace(/,$/, '');
    const parameters = {};
    for(let i = 1; i < arr.length; i += 2){
        const idx = i;
        if (arr[idx][0] === '"') {
            while(arr[idx].slice(-1) !== '"' && ++i < arr.length){
                arr[idx] += arr[i];
            }
        }
        const key = arr[idx - 1].replace(/^(?:, ?)|=$/g, '').toLowerCase();
        parameters[key] = unquote(arr[idx]);
    }
    return {
        scheme: scheme.toLowerCase(),
        parameters
    };
}
function parseWwwAuthenticateChallenges(response) {
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    const header = response.headers.get('www-authenticate');
    if (header === null) {
        return undefined;
    }
    const result = [];
    for (const { 1: scheme, index } of header.matchAll(SCHEMES_REGEXP)){
        result.push([
            scheme,
            index
        ]);
    }
    if (!result.length) {
        return undefined;
    }
    const challenges = result.map(([scheme, indexOf], i, others)=>{
        const next = others[i + 1];
        let parameters;
        if (next) {
            parameters = header.slice(indexOf, next[1]);
        } else {
            parameters = header.slice(indexOf);
        }
        return wwwAuth(scheme, parameters);
    });
    return challenges;
}
async function processPushedAuthorizationResponse(as, client, response) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 201) {
        let err;
        if (err = await handleOAuthBodyError(response)) {
            return err;
        }
        throw new OPE('"response" is not a conform Pushed Authorization Request Endpoint response');
    }
    assertReadableResponse(response);
    let json;
    try {
        json = await response.json();
    } catch (cause) {
        throw new OPE('failed to parse "response" body as JSON', {
            cause
        });
    }
    if (!isJsonObject(json)) {
        throw new OPE('"response" body must be a top level object');
    }
    if (!validateString(json.request_uri)) {
        throw new OPE('"response" body "request_uri" property must be a non-empty string');
    }
    if (typeof json.expires_in !== 'number' || json.expires_in <= 0) {
        throw new OPE('"response" body "expires_in" property must be a positive number');
    }
    return json;
}
async function protectedResourceRequest(accessToken, method, url, headers, body, options) {
    if (!validateString(accessToken)) {
        throw new TypeError('"accessToken" must be a non-empty string');
    }
    if (!(url instanceof URL)) {
        throw new TypeError('"url" must be an instance of URL');
    }
    headers = prepareHeaders(headers);
    if (options?.DPoP === undefined) {
        headers.set('authorization', `Bearer ${accessToken}`);
    } else {
        await dpopProofJwt(headers, options.DPoP, url, method.toUpperCase(), getClockSkew({
            [clockSkew]: options?.[clockSkew]
        }), accessToken);
        headers.set('authorization', `DPoP ${accessToken}`);
    }
    return (options?.[customFetch] || fetch)(url.href, {
        body,
        headers: Object.fromEntries(headers.entries()),
        method,
        redirect: 'manual',
        signal: options?.signal ? signal(options.signal) : null
    }).then(processDpopNonce);
}
async function userInfoRequest(as, client, accessToken, options) {
    assertAs(as);
    assertClient(client);
    const url = resolveEndpoint(as, 'userinfo_endpoint', alias(client, options));
    const headers = prepareHeaders(options?.headers);
    if (client.userinfo_signed_response_alg) {
        headers.set('accept', 'application/jwt');
    } else {
        headers.set('accept', 'application/json');
        headers.append('accept', 'application/jwt');
    }
    return protectedResourceRequest(accessToken, 'GET', url, headers, null, {
        ...options,
        [clockSkew]: getClockSkew(client)
    });
}
let jwksMap;
function setJwksCache(as, jwks, uat, cache) {
    jwksMap || (jwksMap = new WeakMap());
    jwksMap.set(as, {
        jwks,
        uat,
        get age () {
            return epochTime() - this.uat;
        }
    });
    if (cache) {
        Object.assign(cache, {
            jwks: structuredClone(jwks),
            uat
        });
    }
}
function isFreshJwksCache(input) {
    if (typeof input !== 'object' || input === null) {
        return false;
    }
    if (!('uat' in input) || typeof input.uat !== 'number' || epochTime() - input.uat >= 300) {
        return false;
    }
    if (!('jwks' in input) || !isJsonObject(input.jwks) || !Array.isArray(input.jwks.keys) || !Array.prototype.every.call(input.jwks.keys, isJsonObject)) {
        return false;
    }
    return true;
}
function clearJwksCache(as, cache) {
    jwksMap?.delete(as);
    delete cache?.jwks;
    delete cache?.uat;
}
async function getPublicSigKeyFromIssuerJwksUri(as, options, header) {
    const { alg, kid } = header;
    checkSupportedJwsAlg(alg);
    if (!jwksMap?.has(as) && isFreshJwksCache(options?.[jwksCache])) {
        setJwksCache(as, options?.[jwksCache].jwks, options?.[jwksCache].uat);
    }
    let jwks;
    let age;
    if (jwksMap?.has(as)) {
        ;
        ({ jwks, age } = jwksMap.get(as));
        if (age >= 300) {
            clearJwksCache(as, options?.[jwksCache]);
            return getPublicSigKeyFromIssuerJwksUri(as, options, header);
        }
    } else {
        jwks = await jwksRequest(as, options).then(processJwksResponse);
        age = 0;
        setJwksCache(as, jwks, epochTime(), options?.[jwksCache]);
    }
    let kty;
    switch(alg.slice(0, 2)){
        case 'RS':
        case 'PS':
            kty = 'RSA';
            break;
        case 'ES':
            kty = 'EC';
            break;
        case 'Ed':
            kty = 'OKP';
            break;
        default:
            throw new UnsupportedOperationError();
    }
    const candidates = jwks.keys.filter((jwk)=>{
        if (jwk.kty !== kty) {
            return false;
        }
        if (kid !== undefined && kid !== jwk.kid) {
            return false;
        }
        if (jwk.alg !== undefined && alg !== jwk.alg) {
            return false;
        }
        if (jwk.use !== undefined && jwk.use !== 'sig') {
            return false;
        }
        if (jwk.key_ops?.includes('verify') === false) {
            return false;
        }
        switch(true){
            case alg === 'ES256' && jwk.crv !== 'P-256':
            case alg === 'ES384' && jwk.crv !== 'P-384':
            case alg === 'ES512' && jwk.crv !== 'P-521':
            case alg === 'EdDSA' && !(jwk.crv === 'Ed25519' || jwk.crv === 'Ed448'):
                return false;
        }
        return true;
    });
    const { 0: jwk, length } = candidates;
    if (!length) {
        if (age >= 60) {
            clearJwksCache(as, options?.[jwksCache]);
            return getPublicSigKeyFromIssuerJwksUri(as, options, header);
        }
        throw new OPE('error when selecting a JWT verification key, no applicable keys found');
    }
    if (length !== 1) {
        throw new OPE('error when selecting a JWT verification key, multiple applicable keys found, a "kid" JWT Header Parameter is required');
    }
    const key = await importJwk(alg, jwk);
    if (key.type !== 'public') {
        throw new OPE('jwks_uri must only contain public keys');
    }
    return key;
}
const skipSubjectCheck = Symbol();
function getContentType(response) {
    return response.headers.get('content-type')?.split(';')[0];
}
async function processUserInfoResponse(as, client, expectedSubject, response) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        throw new OPE('"response" is not a conform UserInfo Endpoint response');
    }
    let json;
    if (getContentType(response) === 'application/jwt') {
        assertReadableResponse(response);
        const { claims, jwt } = await validateJwt(await response.text(), checkSigningAlgorithm.bind(undefined, client.userinfo_signed_response_alg, as.userinfo_signing_alg_values_supported), noSignatureCheck, getClockSkew(client), getClockTolerance(client), client[jweDecrypt]).then(validateOptionalAudience.bind(undefined, client.client_id)).then(validateOptionalIssuer.bind(undefined, as.issuer));
        jwtResponseBodies.set(response, jwt);
        json = claims;
    } else {
        if (client.userinfo_signed_response_alg) {
            throw new OPE('JWT UserInfo Response expected');
        }
        assertReadableResponse(response);
        try {
            json = await response.json();
        } catch (cause) {
            throw new OPE('failed to parse "response" body as JSON', {
                cause
            });
        }
    }
    if (!isJsonObject(json)) {
        throw new OPE('"response" body must be a top level object');
    }
    if (!validateString(json.sub)) {
        throw new OPE('"response" body "sub" property must be a non-empty string');
    }
    switch(expectedSubject){
        case skipSubjectCheck:
            break;
        default:
            if (!validateString(expectedSubject)) {
                throw new OPE('"expectedSubject" must be a non-empty string');
            }
            if (json.sub !== expectedSubject) {
                throw new OPE('unexpected "response" body "sub" value');
            }
    }
    return json;
}
async function authenticatedRequest(as, client, method, url, body, headers, options) {
    await clientAuthentication(as, client, body, headers, options?.clientPrivateKey);
    headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    return (options?.[customFetch] || fetch)(url.href, {
        body,
        headers: Object.fromEntries(headers.entries()),
        method,
        redirect: 'manual',
        signal: options?.signal ? signal(options.signal) : null
    }).then(processDpopNonce);
}
async function tokenEndpointRequest(as, client, grantType, parameters, options) {
    const url = resolveEndpoint(as, 'token_endpoint', alias(client, options));
    parameters.set('grant_type', grantType);
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    if (options?.DPoP !== undefined) {
        await dpopProofJwt(headers, options.DPoP, url, 'POST', getClockSkew(client));
    }
    return authenticatedRequest(as, client, 'POST', url, parameters, headers, options);
}
async function refreshTokenGrantRequest(as, client, refreshToken, options) {
    assertAs(as);
    assertClient(client);
    if (!validateString(refreshToken)) {
        throw new TypeError('"refreshToken" must be a non-empty string');
    }
    const parameters = new URLSearchParams(options?.additionalParameters);
    parameters.set('refresh_token', refreshToken);
    return tokenEndpointRequest(as, client, 'refresh_token', parameters, options);
}
const idTokenClaims = new WeakMap();
const jwtResponseBodies = new WeakMap();
function getValidatedIdTokenClaims(ref) {
    if (!ref.id_token) {
        return undefined;
    }
    const claims = idTokenClaims.get(ref);
    if (!claims) {
        throw new TypeError('"ref" was already garbage collected or did not resolve from the proper sources');
    }
    return claims[0];
}
async function validateIdTokenSignature(as, ref, options) {
    assertAs(as);
    if (!idTokenClaims.has(ref)) {
        throw new OPE('"ref" does not contain an ID Token to verify the signature of');
    }
    const { 0: protectedHeader, 1: payload, 2: encodedSignature } = idTokenClaims.get(ref)[1].split('.');
    const header = JSON.parse(buf(b64u(protectedHeader)));
    if (header.alg.startsWith('HS')) {
        throw new UnsupportedOperationError();
    }
    let key;
    key = await getPublicSigKeyFromIssuerJwksUri(as, options, header);
    await validateJwsSignature(protectedHeader, payload, key, b64u(encodedSignature));
}
async function validateJwtResponseSignature(as, ref, options) {
    assertAs(as);
    if (!jwtResponseBodies.has(ref)) {
        throw new OPE('"ref" does not contain a processed JWT Response to verify the signature of');
    }
    const { 0: protectedHeader, 1: payload, 2: encodedSignature } = jwtResponseBodies.get(ref).split('.');
    const header = JSON.parse(buf(b64u(protectedHeader)));
    if (header.alg.startsWith('HS')) {
        throw new UnsupportedOperationError();
    }
    let key;
    key = await getPublicSigKeyFromIssuerJwksUri(as, options, header);
    await validateJwsSignature(protectedHeader, payload, key, b64u(encodedSignature));
}
function validateJwtUserInfoSignature(as, ref, options) {
    return validateJwtResponseSignature(as, ref, options);
}
function validateJwtIntrospectionSignature(as, ref, options) {
    return validateJwtResponseSignature(as, ref, options);
}
async function processGenericAccessTokenResponse(as, client, response, ignoreIdToken = false, ignoreRefreshToken = false) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        let err;
        if (err = await handleOAuthBodyError(response)) {
            return err;
        }
        throw new OPE('"response" is not a conform Token Endpoint response');
    }
    assertReadableResponse(response);
    let json;
    try {
        json = await response.json();
    } catch (cause) {
        throw new OPE('failed to parse "response" body as JSON', {
            cause
        });
    }
    if (!isJsonObject(json)) {
        throw new OPE('"response" body must be a top level object');
    }
    if (!validateString(json.access_token)) {
        throw new OPE('"response" body "access_token" property must be a non-empty string');
    }
    if (!validateString(json.token_type)) {
        throw new OPE('"response" body "token_type" property must be a non-empty string');
    }
    json.token_type = json.token_type.toLowerCase();
    if (json.token_type !== 'dpop' && json.token_type !== 'bearer') {
        throw new UnsupportedOperationError('unsupported `token_type` value');
    }
    if (json.expires_in !== undefined && (typeof json.expires_in !== 'number' || json.expires_in <= 0)) {
        throw new OPE('"response" body "expires_in" property must be a positive number');
    }
    if (!ignoreRefreshToken && json.refresh_token !== undefined && !validateString(json.refresh_token)) {
        throw new OPE('"response" body "refresh_token" property must be a non-empty string');
    }
    if (json.scope !== undefined && typeof json.scope !== 'string') {
        throw new OPE('"response" body "scope" property must be a string');
    }
    if (!ignoreIdToken) {
        if (json.id_token !== undefined && !validateString(json.id_token)) {
            throw new OPE('"response" body "id_token" property must be a non-empty string');
        }
        if (json.id_token) {
            const { claims, jwt } = await validateJwt(json.id_token, checkSigningAlgorithm.bind(undefined, client.id_token_signed_response_alg, as.id_token_signing_alg_values_supported), noSignatureCheck, getClockSkew(client), getClockTolerance(client), client[jweDecrypt]).then(validatePresence.bind(undefined, [
                'aud',
                'exp',
                'iat',
                'iss',
                'sub'
            ])).then(validateIssuer.bind(undefined, as.issuer)).then(validateAudience.bind(undefined, client.client_id));
            if (Array.isArray(claims.aud) && claims.aud.length !== 1) {
                if (claims.azp === undefined) {
                    throw new OPE('ID Token "aud" (audience) claim includes additional untrusted audiences');
                }
                if (claims.azp !== client.client_id) {
                    throw new OPE('unexpected ID Token "azp" (authorized party) claim value');
                }
            }
            if (claims.auth_time !== undefined && (!Number.isFinite(claims.auth_time) || Math.sign(claims.auth_time) !== 1)) {
                throw new OPE('ID Token "auth_time" (authentication time) must be a positive number');
            }
            idTokenClaims.set(json, [
                claims,
                jwt
            ]);
        }
    }
    return json;
}
async function processRefreshTokenResponse(as, client, response) {
    return processGenericAccessTokenResponse(as, client, response);
}
function validateOptionalAudience(expected, result) {
    if (result.claims.aud !== undefined) {
        return validateAudience(expected, result);
    }
    return result;
}
function validateAudience(expected, result) {
    if (Array.isArray(result.claims.aud)) {
        if (!result.claims.aud.includes(expected)) {
            throw new OPE('unexpected JWT "aud" (audience) claim value');
        }
    } else if (result.claims.aud !== expected) {
        throw new OPE('unexpected JWT "aud" (audience) claim value');
    }
    return result;
}
function validateOptionalIssuer(expected, result) {
    if (result.claims.iss !== undefined) {
        return validateIssuer(expected, result);
    }
    return result;
}
function validateIssuer(expected, result) {
    if (result.claims.iss !== expected) {
        throw new OPE('unexpected JWT "iss" (issuer) claim value');
    }
    return result;
}
const branded = new WeakSet();
function brand(searchParams) {
    branded.add(searchParams);
    return searchParams;
}
async function authorizationCodeGrantRequest(as, client, callbackParameters, redirectUri, codeVerifier, options) {
    assertAs(as);
    assertClient(client);
    if (!branded.has(callbackParameters)) {
        throw new TypeError('"callbackParameters" must be an instance of URLSearchParams obtained from "validateAuthResponse()", or "validateJwtAuthResponse()');
    }
    if (!validateString(redirectUri)) {
        throw new TypeError('"redirectUri" must be a non-empty string');
    }
    if (!validateString(codeVerifier)) {
        throw new TypeError('"codeVerifier" must be a non-empty string');
    }
    const code = getURLSearchParameter(callbackParameters, 'code');
    if (!code) {
        throw new OPE('no authorization code in "callbackParameters"');
    }
    const parameters = new URLSearchParams(options?.additionalParameters);
    parameters.set('redirect_uri', redirectUri);
    parameters.set('code_verifier', codeVerifier);
    parameters.set('code', code);
    return tokenEndpointRequest(as, client, 'authorization_code', parameters, options);
}
const jwtClaimNames = {
    aud: 'audience',
    c_hash: 'code hash',
    client_id: 'client id',
    exp: 'expiration time',
    iat: 'issued at',
    iss: 'issuer',
    jti: 'jwt id',
    nonce: 'nonce',
    s_hash: 'state hash',
    sub: 'subject',
    ath: 'access token hash',
    htm: 'http method',
    htu: 'http uri',
    cnf: 'confirmation'
};
function validatePresence(required, result) {
    for (const claim of required){
        if (result.claims[claim] === undefined) {
            throw new OPE(`JWT "${claim}" (${jwtClaimNames[claim]}) claim missing`);
        }
    }
    return result;
}
const expectNoNonce = Symbol();
const skipAuthTimeCheck = Symbol();
async function processAuthorizationCodeOpenIDResponse(as, client, response, expectedNonce, maxAge) {
    const result = await processGenericAccessTokenResponse(as, client, response);
    if (isOAuth2Error(result)) {
        return result;
    }
    if (!validateString(result.id_token)) {
        throw new OPE('"response" body "id_token" property must be a non-empty string');
    }
    maxAge ?? (maxAge = client.default_max_age ?? skipAuthTimeCheck);
    const claims = getValidatedIdTokenClaims(result);
    if ((client.require_auth_time || maxAge !== skipAuthTimeCheck) && claims.auth_time === undefined) {
        throw new OPE('ID Token "auth_time" (authentication time) claim missing');
    }
    if (maxAge !== skipAuthTimeCheck) {
        if (typeof maxAge !== 'number' || maxAge < 0) {
            throw new TypeError('"maxAge" must be a non-negative number');
        }
        const now = epochTime() + getClockSkew(client);
        const tolerance = getClockTolerance(client);
        if (claims.auth_time + maxAge < now - tolerance) {
            throw new OPE('too much time has elapsed since the last End-User authentication');
        }
    }
    switch(expectedNonce){
        case undefined:
        case expectNoNonce:
            if (claims.nonce !== undefined) {
                throw new OPE('unexpected ID Token "nonce" claim value');
            }
            break;
        default:
            if (!validateString(expectedNonce)) {
                throw new TypeError('"expectedNonce" must be a non-empty string');
            }
            if (claims.nonce === undefined) {
                throw new OPE('ID Token "nonce" claim missing');
            }
            if (claims.nonce !== expectedNonce) {
                throw new OPE('unexpected ID Token "nonce" claim value');
            }
    }
    return result;
}
async function processAuthorizationCodeOAuth2Response(as, client, response) {
    const result = await processGenericAccessTokenResponse(as, client, response, true);
    if (isOAuth2Error(result)) {
        return result;
    }
    if (result.id_token !== undefined) {
        if (typeof result.id_token === 'string' && result.id_token.length) {
            throw new OPE('Unexpected ID Token returned, use processAuthorizationCodeOpenIDResponse() for OpenID Connect callback processing');
        }
        delete result.id_token;
    }
    return result;
}
function checkJwtType(expected, result) {
    if (typeof result.header.typ !== 'string' || normalizeTyp(result.header.typ) !== expected) {
        throw new OPE('unexpected JWT "typ" header parameter value');
    }
    return result;
}
async function clientCredentialsGrantRequest(as, client, parameters, options) {
    assertAs(as);
    assertClient(client);
    return tokenEndpointRequest(as, client, 'client_credentials', new URLSearchParams(parameters), options);
}
async function genericTokenEndpointRequest(as, client, grantType, parameters, options) {
    assertAs(as);
    assertClient(client);
    if (!validateString(grantType)) {
        throw new TypeError('"grantType" must be a non-empty string');
    }
    return tokenEndpointRequest(as, client, grantType, new URLSearchParams(parameters), options);
}
async function processClientCredentialsResponse(as, client, response) {
    const result = await processGenericAccessTokenResponse(as, client, response, true, true);
    if (isOAuth2Error(result)) {
        return result;
    }
    return result;
}
async function revocationRequest(as, client, token, options) {
    assertAs(as);
    assertClient(client);
    if (!validateString(token)) {
        throw new TypeError('"token" must be a non-empty string');
    }
    const url = resolveEndpoint(as, 'revocation_endpoint', alias(client, options));
    const body = new URLSearchParams(options?.additionalParameters);
    body.set('token', token);
    const headers = prepareHeaders(options?.headers);
    headers.delete('accept');
    return authenticatedRequest(as, client, 'POST', url, body, headers, options);
}
async function processRevocationResponse(response) {
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        let err;
        if (err = await handleOAuthBodyError(response)) {
            return err;
        }
        throw new OPE('"response" is not a conform Revocation Endpoint response');
    }
    return undefined;
}
function assertReadableResponse(response) {
    if (response.bodyUsed) {
        throw new TypeError('"response" body has been used already');
    }
}
async function introspectionRequest(as, client, token, options) {
    assertAs(as);
    assertClient(client);
    if (!validateString(token)) {
        throw new TypeError('"token" must be a non-empty string');
    }
    const url = resolveEndpoint(as, 'introspection_endpoint', alias(client, options));
    const body = new URLSearchParams(options?.additionalParameters);
    body.set('token', token);
    const headers = prepareHeaders(options?.headers);
    if (options?.requestJwtResponse ?? client.introspection_signed_response_alg) {
        headers.set('accept', 'application/token-introspection+jwt');
    } else {
        headers.set('accept', 'application/json');
    }
    return authenticatedRequest(as, client, 'POST', url, body, headers, options);
}
async function processIntrospectionResponse(as, client, response) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        let err;
        if (err = await handleOAuthBodyError(response)) {
            return err;
        }
        throw new OPE('"response" is not a conform Introspection Endpoint response');
    }
    let json;
    if (getContentType(response) === 'application/token-introspection+jwt') {
        assertReadableResponse(response);
        const { claims, jwt } = await validateJwt(await response.text(), checkSigningAlgorithm.bind(undefined, client.introspection_signed_response_alg, as.introspection_signing_alg_values_supported), noSignatureCheck, getClockSkew(client), getClockTolerance(client), client[jweDecrypt]).then(checkJwtType.bind(undefined, 'token-introspection+jwt')).then(validatePresence.bind(undefined, [
            'aud',
            'iat',
            'iss'
        ])).then(validateIssuer.bind(undefined, as.issuer)).then(validateAudience.bind(undefined, client.client_id));
        jwtResponseBodies.set(response, jwt);
        json = claims.token_introspection;
        if (!isJsonObject(json)) {
            throw new OPE('JWT "token_introspection" claim must be a JSON object');
        }
    } else {
        assertReadableResponse(response);
        try {
            json = await response.json();
        } catch (cause) {
            throw new OPE('failed to parse "response" body as JSON', {
                cause
            });
        }
        if (!isJsonObject(json)) {
            throw new OPE('"response" body must be a top level object');
        }
    }
    if (typeof json.active !== 'boolean') {
        throw new OPE('"response" body "active" property must be a boolean');
    }
    return json;
}
async function jwksRequest(as, options) {
    assertAs(as);
    const url = resolveEndpoint(as, 'jwks_uri');
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    headers.append('accept', 'application/jwk-set+json');
    return (options?.[customFetch] || fetch)(url.href, {
        headers: Object.fromEntries(headers.entries()),
        method: 'GET',
        redirect: 'manual',
        signal: options?.signal ? signal(options.signal) : null
    }).then(processDpopNonce);
}
async function processJwksResponse(response) {
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        throw new OPE('"response" is not a conform JSON Web Key Set response');
    }
    assertReadableResponse(response);
    let json;
    try {
        json = await response.json();
    } catch (cause) {
        throw new OPE('failed to parse "response" body as JSON', {
            cause
        });
    }
    if (!isJsonObject(json)) {
        throw new OPE('"response" body must be a top level object');
    }
    if (!Array.isArray(json.keys)) {
        throw new OPE('"response" body "keys" property must be an array');
    }
    if (!Array.prototype.every.call(json.keys, isJsonObject)) {
        throw new OPE('"response" body "keys" property members must be JWK formatted objects');
    }
    return json;
}
async function handleOAuthBodyError(response) {
    if (response.status > 399 && response.status < 500) {
        assertReadableResponse(response);
        try {
            const json = await response.json();
            if (isJsonObject(json) && typeof json.error === 'string' && json.error.length) {
                if (json.error_description !== undefined && typeof json.error_description !== 'string') {
                    delete json.error_description;
                }
                if (json.error_uri !== undefined && typeof json.error_uri !== 'string') {
                    delete json.error_uri;
                }
                if (json.algs !== undefined && typeof json.algs !== 'string') {
                    delete json.algs;
                }
                if (json.scope !== undefined && typeof json.scope !== 'string') {
                    delete json.scope;
                }
                return json;
            }
        } catch  {}
    }
    return undefined;
}
function checkSupportedJwsAlg(alg) {
    if (!SUPPORTED_JWS_ALGS.includes(alg)) {
        throw new UnsupportedOperationError('unsupported JWS "alg" identifier');
    }
    return alg;
}
function checkRsaKeyAlgorithm(algorithm) {
    if (typeof algorithm.modulusLength !== 'number' || algorithm.modulusLength < 2048) {
        throw new OPE(`${algorithm.name} modulusLength must be at least 2048 bits`);
    }
}
function ecdsaHashName(namedCurve) {
    switch(namedCurve){
        case 'P-256':
            return 'SHA-256';
        case 'P-384':
            return 'SHA-384';
        case 'P-521':
            return 'SHA-512';
        default:
            throw new UnsupportedOperationError();
    }
}
function keyToSubtle(key) {
    switch(key.algorithm.name){
        case 'ECDSA':
            return {
                name: key.algorithm.name,
                hash: ecdsaHashName(key.algorithm.namedCurve)
            };
        case 'RSA-PSS':
            {
                checkRsaKeyAlgorithm(key.algorithm);
                switch(key.algorithm.hash.name){
                    case 'SHA-256':
                    case 'SHA-384':
                    case 'SHA-512':
                        return {
                            name: key.algorithm.name,
                            saltLength: parseInt(key.algorithm.hash.name.slice(-3), 10) >> 3
                        };
                    default:
                        throw new UnsupportedOperationError();
                }
            }
        case 'RSASSA-PKCS1-v1_5':
            checkRsaKeyAlgorithm(key.algorithm);
            return key.algorithm.name;
        case 'Ed448':
        case 'Ed25519':
            return key.algorithm.name;
    }
    throw new UnsupportedOperationError();
}
const noSignatureCheck = Symbol();
async function validateJwsSignature(protectedHeader, payload, key, signature) {
    const input = `${protectedHeader}.${payload}`;
    const verified = await crypto.subtle.verify(keyToSubtle(key), key, signature, buf(input));
    if (!verified) {
        throw new OPE('JWT signature verification failed');
    }
}
async function validateJwt(jws, checkAlg, getKey, clockSkew, clockTolerance, decryptJwt) {
    let { 0: protectedHeader, 1: payload, 2: encodedSignature, length } = jws.split('.');
    if (length === 5) {
        if (decryptJwt !== undefined) {
            jws = await decryptJwt(jws);
            ({ 0: protectedHeader, 1: payload, 2: encodedSignature, length } = jws.split('.'));
        } else {
            throw new UnsupportedOperationError('JWE structure JWTs are not supported');
        }
    }
    if (length !== 3) {
        throw new OPE('Invalid JWT');
    }
    let header;
    try {
        header = JSON.parse(buf(b64u(protectedHeader)));
    } catch (cause) {
        throw new OPE('failed to parse JWT Header body as base64url encoded JSON', {
            cause
        });
    }
    if (!isJsonObject(header)) {
        throw new OPE('JWT Header must be a top level object');
    }
    checkAlg(header);
    if (header.crit !== undefined) {
        throw new OPE('unexpected JWT "crit" header parameter');
    }
    const signature = b64u(encodedSignature);
    let key;
    if (getKey !== noSignatureCheck) {
        key = await getKey(header);
        await validateJwsSignature(protectedHeader, payload, key, signature);
    }
    let claims;
    try {
        claims = JSON.parse(buf(b64u(payload)));
    } catch (cause) {
        throw new OPE('failed to parse JWT Payload body as base64url encoded JSON', {
            cause
        });
    }
    if (!isJsonObject(claims)) {
        throw new OPE('JWT Payload must be a top level object');
    }
    const now = epochTime() + clockSkew;
    if (claims.exp !== undefined) {
        if (typeof claims.exp !== 'number') {
            throw new OPE('unexpected JWT "exp" (expiration time) claim type');
        }
        if (claims.exp <= now - clockTolerance) {
            throw new OPE('unexpected JWT "exp" (expiration time) claim value, timestamp is <= now()');
        }
    }
    if (claims.iat !== undefined) {
        if (typeof claims.iat !== 'number') {
            throw new OPE('unexpected JWT "iat" (issued at) claim type');
        }
    }
    if (claims.iss !== undefined) {
        if (typeof claims.iss !== 'string') {
            throw new OPE('unexpected JWT "iss" (issuer) claim type');
        }
    }
    if (claims.nbf !== undefined) {
        if (typeof claims.nbf !== 'number') {
            throw new OPE('unexpected JWT "nbf" (not before) claim type');
        }
        if (claims.nbf > now + clockTolerance) {
            throw new OPE('unexpected JWT "nbf" (not before) claim value, timestamp is > now()');
        }
    }
    if (claims.aud !== undefined) {
        if (typeof claims.aud !== 'string' && !Array.isArray(claims.aud)) {
            throw new OPE('unexpected JWT "aud" (audience) claim type');
        }
    }
    return {
        header,
        claims,
        signature,
        key,
        jwt: jws
    };
}
async function validateJwtAuthResponse(as, client, parameters, expectedState, options) {
    assertAs(as);
    assertClient(client);
    if (parameters instanceof URL) {
        parameters = parameters.searchParams;
    }
    if (!(parameters instanceof URLSearchParams)) {
        throw new TypeError('"parameters" must be an instance of URLSearchParams, or URL');
    }
    const response = getURLSearchParameter(parameters, 'response');
    if (!response) {
        throw new OPE('"parameters" does not contain a JARM response');
    }
    const { claims } = await validateJwt(response, checkSigningAlgorithm.bind(undefined, client.authorization_signed_response_alg, as.authorization_signing_alg_values_supported), getPublicSigKeyFromIssuerJwksUri.bind(undefined, as, options), getClockSkew(client), getClockTolerance(client), client[jweDecrypt]).then(validatePresence.bind(undefined, [
        'aud',
        'exp',
        'iss'
    ])).then(validateIssuer.bind(undefined, as.issuer)).then(validateAudience.bind(undefined, client.client_id));
    const result = new URLSearchParams();
    for (const [key, value] of Object.entries(claims)){
        if (typeof value === 'string' && key !== 'aud') {
            result.set(key, value);
        }
    }
    return validateAuthResponse(as, client, result, expectedState);
}
async function idTokenHash(alg, data, key) {
    let algorithm;
    switch(alg){
        case 'RS256':
        case 'PS256':
        case 'ES256':
            algorithm = 'SHA-256';
            break;
        case 'RS384':
        case 'PS384':
        case 'ES384':
            algorithm = 'SHA-384';
            break;
        case 'RS512':
        case 'PS512':
        case 'ES512':
            algorithm = 'SHA-512';
            break;
        case 'EdDSA':
            if (key.algorithm.name === 'Ed25519') {
                algorithm = 'SHA-512';
                break;
            }
            throw new UnsupportedOperationError();
        default:
            throw new UnsupportedOperationError();
    }
    const digest = await crypto.subtle.digest(algorithm, buf(data));
    return b64u(digest.slice(0, digest.byteLength / 2));
}
async function idTokenHashMatches(data, actual, alg, key) {
    const expected = await idTokenHash(alg, data, key);
    return actual === expected;
}
async function validateDetachedSignatureResponse(as, client, parameters, expectedNonce, expectedState, maxAge, options) {
    assertAs(as);
    assertClient(client);
    if (parameters instanceof URL) {
        if (!parameters.hash.length) {
            throw new TypeError('"parameters" as an instance of URL must contain a hash (fragment) with the Authorization Response parameters');
        }
        parameters = new URLSearchParams(parameters.hash.slice(1));
    }
    if (!(parameters instanceof URLSearchParams)) {
        throw new TypeError('"parameters" must be an instance of URLSearchParams');
    }
    parameters = new URLSearchParams(parameters);
    const id_token = getURLSearchParameter(parameters, 'id_token');
    parameters.delete('id_token');
    switch(expectedState){
        case undefined:
        case expectNoState:
            break;
        default:
            if (!validateString(expectedState)) {
                throw new TypeError('"expectedState" must be a non-empty string');
            }
    }
    const result = validateAuthResponse({
        ...as,
        authorization_response_iss_parameter_supported: false
    }, client, parameters, expectedState);
    if (isOAuth2Error(result)) {
        return result;
    }
    if (!id_token) {
        throw new OPE('"parameters" does not contain an ID Token');
    }
    const code = getURLSearchParameter(parameters, 'code');
    if (!code) {
        throw new OPE('"parameters" does not contain an Authorization Code');
    }
    const requiredClaims = [
        'aud',
        'exp',
        'iat',
        'iss',
        'sub',
        'nonce',
        'c_hash'
    ];
    if (typeof expectedState === 'string') {
        requiredClaims.push('s_hash');
    }
    const { claims, header, key } = await validateJwt(id_token, checkSigningAlgorithm.bind(undefined, client.id_token_signed_response_alg, as.id_token_signing_alg_values_supported), getPublicSigKeyFromIssuerJwksUri.bind(undefined, as, options), getClockSkew(client), getClockTolerance(client), client[jweDecrypt]).then(validatePresence.bind(undefined, requiredClaims)).then(validateIssuer.bind(undefined, as.issuer)).then(validateAudience.bind(undefined, client.client_id));
    const clockSkew = getClockSkew(client);
    const now = epochTime() + clockSkew;
    if (claims.iat < now - 3600) {
        throw new OPE('unexpected JWT "iat" (issued at) claim value, it is too far in the past');
    }
    if (typeof claims.c_hash !== 'string' || await idTokenHashMatches(code, claims.c_hash, header.alg, key) !== true) {
        throw new OPE('invalid ID Token "c_hash" (code hash) claim value');
    }
    if (claims.s_hash !== undefined && typeof expectedState !== 'string') {
        throw new OPE('could not verify ID Token "s_hash" (state hash) claim value');
    }
    if (typeof expectedState === 'string' && (typeof claims.s_hash !== 'string' || await idTokenHashMatches(expectedState, claims.s_hash, header.alg, key) !== true)) {
        throw new OPE('invalid ID Token "s_hash" (state hash) claim value');
    }
    if (claims.auth_time !== undefined && (!Number.isFinite(claims.auth_time) || Math.sign(claims.auth_time) !== 1)) {
        throw new OPE('ID Token "auth_time" (authentication time) must be a positive number');
    }
    maxAge ?? (maxAge = client.default_max_age ?? skipAuthTimeCheck);
    if ((client.require_auth_time || maxAge !== skipAuthTimeCheck) && claims.auth_time === undefined) {
        throw new OPE('ID Token "auth_time" (authentication time) claim missing');
    }
    if (maxAge !== skipAuthTimeCheck) {
        if (typeof maxAge !== 'number' || maxAge < 0) {
            throw new TypeError('"maxAge" must be a non-negative number');
        }
        const now = epochTime() + getClockSkew(client);
        const tolerance = getClockTolerance(client);
        if (claims.auth_time + maxAge < now - tolerance) {
            throw new OPE('too much time has elapsed since the last End-User authentication');
        }
    }
    if (!validateString(expectedNonce)) {
        throw new TypeError('"expectedNonce" must be a non-empty string');
    }
    if (claims.nonce !== expectedNonce) {
        throw new OPE('unexpected ID Token "nonce" claim value');
    }
    if (Array.isArray(claims.aud) && claims.aud.length !== 1) {
        if (claims.azp === undefined) {
            throw new OPE('ID Token "aud" (audience) claim includes additional untrusted audiences');
        }
        if (claims.azp !== client.client_id) {
            throw new OPE('unexpected ID Token "azp" (authorized party) claim value');
        }
    }
    return result;
}
function checkSigningAlgorithm(client, issuer, header) {
    if (client !== undefined) {
        if (header.alg !== client) {
            throw new OPE('unexpected JWT "alg" header parameter');
        }
        return;
    }
    if (Array.isArray(issuer)) {
        if (!issuer.includes(header.alg)) {
            throw new OPE('unexpected JWT "alg" header parameter');
        }
        return;
    }
    if (header.alg !== 'RS256') {
        throw new OPE('unexpected JWT "alg" header parameter');
    }
}
function getURLSearchParameter(parameters, name) {
    const { 0: value, length } = parameters.getAll(name);
    if (length > 1) {
        throw new OPE(`"${name}" parameter must be provided only once`);
    }
    return value;
}
const skipStateCheck = Symbol();
const expectNoState = Symbol();
function validateAuthResponse(as, client, parameters, expectedState) {
    assertAs(as);
    assertClient(client);
    if (parameters instanceof URL) {
        parameters = parameters.searchParams;
    }
    if (!(parameters instanceof URLSearchParams)) {
        throw new TypeError('"parameters" must be an instance of URLSearchParams, or URL');
    }
    if (getURLSearchParameter(parameters, 'response')) {
        throw new OPE('"parameters" contains a JARM response, use validateJwtAuthResponse() instead of validateAuthResponse()');
    }
    const iss = getURLSearchParameter(parameters, 'iss');
    const state = getURLSearchParameter(parameters, 'state');
    if (!iss && as.authorization_response_iss_parameter_supported) {
        throw new OPE('response parameter "iss" (issuer) missing');
    }
    if (iss && iss !== as.issuer) {
        throw new OPE('unexpected "iss" (issuer) response parameter value');
    }
    switch(expectedState){
        case undefined:
        case expectNoState:
            if (state !== undefined) {
                throw new OPE('unexpected "state" response parameter encountered');
            }
            break;
        case skipStateCheck:
            break;
        default:
            if (!validateString(expectedState)) {
                throw new OPE('"expectedState" must be a non-empty string');
            }
            if (state === undefined) {
                throw new OPE('response parameter "state" missing');
            }
            if (state !== expectedState) {
                throw new OPE('unexpected "state" response parameter value');
            }
    }
    const error = getURLSearchParameter(parameters, 'error');
    if (error) {
        return {
            error,
            error_description: getURLSearchParameter(parameters, 'error_description'),
            error_uri: getURLSearchParameter(parameters, 'error_uri')
        };
    }
    const id_token = getURLSearchParameter(parameters, 'id_token');
    const token = getURLSearchParameter(parameters, 'token');
    if (id_token !== undefined || token !== undefined) {
        throw new UnsupportedOperationError('implicit and hybrid flows are not supported');
    }
    return brand(new URLSearchParams(parameters));
}
function algToSubtle(alg, crv) {
    switch(alg){
        case 'PS256':
        case 'PS384':
        case 'PS512':
            return {
                name: 'RSA-PSS',
                hash: `SHA-${alg.slice(-3)}`
            };
        case 'RS256':
        case 'RS384':
        case 'RS512':
            return {
                name: 'RSASSA-PKCS1-v1_5',
                hash: `SHA-${alg.slice(-3)}`
            };
        case 'ES256':
        case 'ES384':
            return {
                name: 'ECDSA',
                namedCurve: `P-${alg.slice(-3)}`
            };
        case 'ES512':
            return {
                name: 'ECDSA',
                namedCurve: 'P-521'
            };
        case 'EdDSA':
            {
                switch(crv){
                    case 'Ed25519':
                    case 'Ed448':
                        return crv;
                    default:
                        throw new UnsupportedOperationError();
                }
            }
        default:
            throw new UnsupportedOperationError();
    }
}
async function importJwk(alg, jwk) {
    const { ext, key_ops, use, ...key } = jwk;
    return crypto.subtle.importKey('jwk', key, algToSubtle(alg, jwk.crv), true, [
        'verify'
    ]);
}
async function deviceAuthorizationRequest(as, client, parameters, options) {
    assertAs(as);
    assertClient(client);
    const url = resolveEndpoint(as, 'device_authorization_endpoint', alias(client, options));
    const body = new URLSearchParams(parameters);
    body.set('client_id', client.client_id);
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    return authenticatedRequest(as, client, 'POST', url, body, headers, options);
}
async function processDeviceAuthorizationResponse(as, client, response) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        let err;
        if (err = await handleOAuthBodyError(response)) {
            return err;
        }
        throw new OPE('"response" is not a conform Device Authorization Endpoint response');
    }
    assertReadableResponse(response);
    let json;
    try {
        json = await response.json();
    } catch (cause) {
        throw new OPE('failed to parse "response" body as JSON', {
            cause
        });
    }
    if (!isJsonObject(json)) {
        throw new OPE('"response" body must be a top level object');
    }
    if (!validateString(json.device_code)) {
        throw new OPE('"response" body "device_code" property must be a non-empty string');
    }
    if (!validateString(json.user_code)) {
        throw new OPE('"response" body "user_code" property must be a non-empty string');
    }
    if (!validateString(json.verification_uri)) {
        throw new OPE('"response" body "verification_uri" property must be a non-empty string');
    }
    if (typeof json.expires_in !== 'number' || json.expires_in <= 0) {
        throw new OPE('"response" body "expires_in" property must be a positive number');
    }
    if (json.verification_uri_complete !== undefined && !validateString(json.verification_uri_complete)) {
        throw new OPE('"response" body "verification_uri_complete" property must be a non-empty string');
    }
    if (json.interval !== undefined && (typeof json.interval !== 'number' || json.interval <= 0)) {
        throw new OPE('"response" body "interval" property must be a positive number');
    }
    return json;
}
async function deviceCodeGrantRequest(as, client, deviceCode, options) {
    assertAs(as);
    assertClient(client);
    if (!validateString(deviceCode)) {
        throw new TypeError('"deviceCode" must be a non-empty string');
    }
    const parameters = new URLSearchParams(options?.additionalParameters);
    parameters.set('device_code', deviceCode);
    return tokenEndpointRequest(as, client, 'urn:ietf:params:oauth:grant-type:device_code', parameters, options);
}
async function processDeviceCodeResponse(as, client, response) {
    return processGenericAccessTokenResponse(as, client, response);
}
async function generateKeyPair(alg, options) {
    if (!validateString(alg)) {
        throw new TypeError('"alg" must be a non-empty string');
    }
    const algorithm = algToSubtle(alg, alg === 'EdDSA' ? options?.crv ?? 'Ed25519' : undefined);
    if (alg.startsWith('PS') || alg.startsWith('RS')) {
        Object.assign(algorithm, {
            modulusLength: options?.modulusLength ?? 2048,
            publicExponent: new Uint8Array([
                0x01,
                0x00,
                0x01
            ])
        });
    }
    return crypto.subtle.generateKey(algorithm, options?.extractable ?? false, [
        'sign',
        'verify'
    ]);
}
function normalizeHtu(htu) {
    const url = new URL(htu);
    url.search = '';
    url.hash = '';
    return url.href;
}
async function validateDPoP(as, request, accessToken, accessTokenClaims, options) {
    const header = request.headers.get('dpop');
    if (header === null) {
        throw new OPE('operation indicated DPoP use but the request has no DPoP HTTP Header');
    }
    if (request.headers.get('authorization')?.toLowerCase().startsWith('dpop ') === false) {
        throw new OPE(`operation indicated DPoP use but the request's Authorization HTTP Header scheme is not DPoP`);
    }
    if (typeof accessTokenClaims.cnf?.jkt !== 'string') {
        throw new OPE('operation indicated DPoP use but the JWT Access Token has no jkt confirmation claim');
    }
    const clockSkew = getClockSkew(options);
    const proof = await validateJwt(header, checkSigningAlgorithm.bind(undefined, undefined, as?.dpop_signing_alg_values_supported || SUPPORTED_JWS_ALGS), async ({ jwk, alg })=>{
        if (!jwk) {
            throw new OPE('DPoP Proof is missing the jwk header parameter');
        }
        const key = await importJwk(alg, jwk);
        if (key.type !== 'public') {
            throw new OPE('DPoP Proof jwk header parameter must contain a public key');
        }
        return key;
    }, clockSkew, getClockTolerance(options), undefined).then(checkJwtType.bind(undefined, 'dpop+jwt')).then(validatePresence.bind(undefined, [
        'iat',
        'jti',
        'ath',
        'htm',
        'htu'
    ]));
    const now = epochTime() + clockSkew;
    const diff = Math.abs(now - proof.claims.iat);
    if (diff > 300) {
        throw new OPE('DPoP Proof iat is not recent enough');
    }
    if (proof.claims.htm !== request.method) {
        throw new OPE('DPoP Proof htm mismatch');
    }
    if (typeof proof.claims.htu !== 'string' || normalizeHtu(proof.claims.htu) !== normalizeHtu(request.url)) {
        throw new OPE('DPoP Proof htu mismatch');
    }
    {
        const expected = b64u(await crypto.subtle.digest('SHA-256', encoder.encode(accessToken)));
        if (proof.claims.ath !== expected) {
            throw new OPE('DPoP Proof ath mismatch');
        }
    }
    {
        let components;
        switch(proof.header.jwk.kty){
            case 'EC':
                components = {
                    crv: proof.header.jwk.crv,
                    kty: proof.header.jwk.kty,
                    x: proof.header.jwk.x,
                    y: proof.header.jwk.y
                };
                break;
            case 'OKP':
                components = {
                    crv: proof.header.jwk.crv,
                    kty: proof.header.jwk.kty,
                    x: proof.header.jwk.x
                };
                break;
            case 'RSA':
                components = {
                    e: proof.header.jwk.e,
                    kty: proof.header.jwk.kty,
                    n: proof.header.jwk.n
                };
                break;
            default:
                throw new UnsupportedOperationError();
        }
        const expected = b64u(await crypto.subtle.digest('SHA-256', encoder.encode(JSON.stringify(components))));
        if (accessTokenClaims.cnf.jkt !== expected) {
            throw new OPE('JWT Access Token confirmation mismatch');
        }
    }
}
async function validateJwtAccessToken(as, request, expectedAudience, options) {
    assertAs(as);
    if (!looseInstanceOf(request, Request)) {
        throw new TypeError('"request" must be an instance of Request');
    }
    if (!validateString(expectedAudience)) {
        throw new OPE('"expectedAudience" must be a non-empty string');
    }
    const authorization = request.headers.get('authorization');
    if (authorization === null) {
        throw new OPE('"request" is missing an Authorization HTTP Header');
    }
    let { 0: scheme, 1: accessToken, length } = authorization.split(' ');
    scheme = scheme.toLowerCase();
    switch(scheme){
        case 'dpop':
        case 'bearer':
            break;
        default:
            throw new UnsupportedOperationError('unsupported Authorization HTTP Header scheme');
    }
    if (length !== 2) {
        throw new OPE('invalid Authorization HTTP Header format');
    }
    const requiredClaims = [
        'iss',
        'exp',
        'aud',
        'sub',
        'iat',
        'jti',
        'client_id'
    ];
    if (options?.requireDPoP || scheme === 'dpop' || request.headers.has('dpop')) {
        requiredClaims.push('cnf');
    }
    const { claims } = await validateJwt(accessToken, checkSigningAlgorithm.bind(undefined, undefined, SUPPORTED_JWS_ALGS), getPublicSigKeyFromIssuerJwksUri.bind(undefined, as, options), getClockSkew(options), getClockTolerance(options), undefined).then(checkJwtType.bind(undefined, 'at+jwt')).then(validatePresence.bind(undefined, requiredClaims)).then(validateIssuer.bind(undefined, as.issuer)).then(validateAudience.bind(undefined, expectedAudience));
    for (const claim of [
        'client_id',
        'jti',
        'sub'
    ]){
        if (typeof claims[claim] !== 'string') {
            throw new OPE(`unexpected JWT "${claim}" claim type`);
        }
    }
    if ('cnf' in claims) {
        if (!isJsonObject(claims.cnf)) {
            throw new OPE('unexpected JWT "cnf" (confirmation) claim value');
        }
        const { 0: cnf, length } = Object.keys(claims.cnf);
        if (length) {
            if (length !== 1) {
                throw new UnsupportedOperationError('multiple confirmation claims are not supported');
            }
            if (cnf !== 'jkt') {
                throw new UnsupportedOperationError('unsupported JWT Confirmation method');
            }
        }
    }
    if (options?.requireDPoP || scheme === 'dpop' || claims.cnf?.jkt !== undefined || request.headers.has('dpop')) {
        await validateDPoP(as, request, accessToken, claims, options);
    }
    return claims;
}
const experimentalCustomFetch = customFetch;
const experimental_customFetch = customFetch;
const experimentalUseMtlsAlias = useMtlsAlias;
const experimental_useMtlsAlias = useMtlsAlias;
const experimental_validateDetachedSignatureResponse = (...args)=>validateDetachedSignatureResponse(...args);
const experimental_validateJwtAccessToken = (...args)=>validateJwtAccessToken(...args);
const validateJwtUserinfoSignature = (...args)=>validateJwtUserInfoSignature(...args);
const experimental_jwksCache = jwksCache;
}),
"[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/runtime/digest.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
const digest = (algorithm, data)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])(algorithm).update(data).digest();
const __TURBOPACK__default__export__ = digest;
}),
"[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/lib/buffer_utils.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "concat",
    ()=>concat,
    "concatKdf",
    ()=>concatKdf,
    "decoder",
    ()=>decoder,
    "encoder",
    ()=>encoder,
    "lengthAndInput",
    ()=>lengthAndInput,
    "p2s",
    ()=>p2s,
    "uint32be",
    ()=>uint32be,
    "uint64be",
    ()=>uint64be
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$digest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/runtime/digest.js [app-route] (ecmascript)");
;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const MAX_INT32 = 2 ** 32;
function concat(...buffers) {
    const size = buffers.reduce((acc, { length })=>acc + length, 0);
    const buf = new Uint8Array(size);
    let i = 0;
    for (const buffer of buffers){
        buf.set(buffer, i);
        i += buffer.length;
    }
    return buf;
}
function p2s(alg, p2sInput) {
    return concat(encoder.encode(alg), new Uint8Array([
        0
    ]), p2sInput);
}
function writeUInt32BE(buf, value, offset) {
    if (value < 0 || value >= MAX_INT32) {
        throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);
    }
    buf.set([
        value >>> 24,
        value >>> 16,
        value >>> 8,
        value & 0xff
    ], offset);
}
function uint64be(value) {
    const high = Math.floor(value / MAX_INT32);
    const low = value % MAX_INT32;
    const buf = new Uint8Array(8);
    writeUInt32BE(buf, high, 0);
    writeUInt32BE(buf, low, 4);
    return buf;
}
function uint32be(value) {
    const buf = new Uint8Array(4);
    writeUInt32BE(buf, value);
    return buf;
}
function lengthAndInput(input) {
    return concat(uint32be(input.length), input);
}
async function concatKdf(secret, bits, value) {
    const iterations = Math.ceil((bits >> 3) / 32);
    const res = new Uint8Array(iterations * 32);
    for(let iter = 0; iter < iterations; iter++){
        const buf = new Uint8Array(4 + secret.length + value.length);
        buf.set(uint32be(iter + 1));
        buf.set(secret, 4);
        buf.set(value, 4 + secret.length);
        res.set(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$digest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])('sha256', buf), iter * 32);
    }
    return res.slice(0, bits >> 3);
}
}),
"[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/runtime/base64url.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "decodeBase64",
    ()=>decodeBase64,
    "encode",
    ()=>encode,
    "encodeBase64",
    ()=>encodeBase64
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/lib/buffer_utils.js [app-route] (ecmascript)");
;
;
function normalize(input) {
    let encoded = input;
    if (encoded instanceof Uint8Array) {
        encoded = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decoder"].decode(encoded);
    }
    return encoded;
}
const encode = (input)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(input).toString('base64url');
const decodeBase64 = (input)=>new Uint8Array(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(input, 'base64'));
const encodeBase64 = (input)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(input).toString('base64');
;
const decode = (input)=>new Uint8Array(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(normalize(input), 'base64url'));
}),
"[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/util/base64url.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "encode",
    ()=>encode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/runtime/base64url.js [app-route] (ecmascript)");
;
const encode = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encode"];
const decode = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decode"];
}),
"[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/lib/is_object.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>isObject
]);
function isObjectLike(value) {
    return typeof value === 'object' && value !== null;
}
function isObject(input) {
    if (!isObjectLike(input) || Object.prototype.toString.call(input) !== '[object Object]') {
        return false;
    }
    if (Object.getPrototypeOf(input) === null) {
        return true;
    }
    let proto = input;
    while(Object.getPrototypeOf(proto) !== null){
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(input) === proto;
}
}),
"[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JOSEAlgNotAllowed",
    ()=>JOSEAlgNotAllowed,
    "JOSEError",
    ()=>JOSEError,
    "JOSENotSupported",
    ()=>JOSENotSupported,
    "JWEDecryptionFailed",
    ()=>JWEDecryptionFailed,
    "JWEInvalid",
    ()=>JWEInvalid,
    "JWKInvalid",
    ()=>JWKInvalid,
    "JWKSInvalid",
    ()=>JWKSInvalid,
    "JWKSMultipleMatchingKeys",
    ()=>JWKSMultipleMatchingKeys,
    "JWKSNoMatchingKey",
    ()=>JWKSNoMatchingKey,
    "JWKSTimeout",
    ()=>JWKSTimeout,
    "JWSInvalid",
    ()=>JWSInvalid,
    "JWSSignatureVerificationFailed",
    ()=>JWSSignatureVerificationFailed,
    "JWTClaimValidationFailed",
    ()=>JWTClaimValidationFailed,
    "JWTExpired",
    ()=>JWTExpired,
    "JWTInvalid",
    ()=>JWTInvalid
]);
class JOSEError extends Error {
    static code = 'ERR_JOSE_GENERIC';
    code = 'ERR_JOSE_GENERIC';
    constructor(message, options){
        super(message, options);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
class JWTClaimValidationFailed extends JOSEError {
    static code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';
    code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';
    claim;
    reason;
    payload;
    constructor(message, payload, claim = 'unspecified', reason = 'unspecified'){
        super(message, {
            cause: {
                claim,
                reason,
                payload
            }
        });
        this.claim = claim;
        this.reason = reason;
        this.payload = payload;
    }
}
class JWTExpired extends JOSEError {
    static code = 'ERR_JWT_EXPIRED';
    code = 'ERR_JWT_EXPIRED';
    claim;
    reason;
    payload;
    constructor(message, payload, claim = 'unspecified', reason = 'unspecified'){
        super(message, {
            cause: {
                claim,
                reason,
                payload
            }
        });
        this.claim = claim;
        this.reason = reason;
        this.payload = payload;
    }
}
class JOSEAlgNotAllowed extends JOSEError {
    static code = 'ERR_JOSE_ALG_NOT_ALLOWED';
    code = 'ERR_JOSE_ALG_NOT_ALLOWED';
}
class JOSENotSupported extends JOSEError {
    static code = 'ERR_JOSE_NOT_SUPPORTED';
    code = 'ERR_JOSE_NOT_SUPPORTED';
}
class JWEDecryptionFailed extends JOSEError {
    static code = 'ERR_JWE_DECRYPTION_FAILED';
    code = 'ERR_JWE_DECRYPTION_FAILED';
    constructor(message = 'decryption operation failed', options){
        super(message, options);
    }
}
class JWEInvalid extends JOSEError {
    static code = 'ERR_JWE_INVALID';
    code = 'ERR_JWE_INVALID';
}
class JWSInvalid extends JOSEError {
    static code = 'ERR_JWS_INVALID';
    code = 'ERR_JWS_INVALID';
}
class JWTInvalid extends JOSEError {
    static code = 'ERR_JWT_INVALID';
    code = 'ERR_JWT_INVALID';
}
class JWKInvalid extends JOSEError {
    static code = 'ERR_JWK_INVALID';
    code = 'ERR_JWK_INVALID';
}
class JWKSInvalid extends JOSEError {
    static code = 'ERR_JWKS_INVALID';
    code = 'ERR_JWKS_INVALID';
}
class JWKSNoMatchingKey extends JOSEError {
    static code = 'ERR_JWKS_NO_MATCHING_KEY';
    code = 'ERR_JWKS_NO_MATCHING_KEY';
    constructor(message = 'no applicable key found in the JSON Web Key Set', options){
        super(message, options);
    }
}
class JWKSMultipleMatchingKeys extends JOSEError {
    [Symbol.asyncIterator];
    static code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
    code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
    constructor(message = 'multiple matching keys found in the JSON Web Key Set', options){
        super(message, options);
    }
}
class JWKSTimeout extends JOSEError {
    static code = 'ERR_JWKS_TIMEOUT';
    code = 'ERR_JWKS_TIMEOUT';
    constructor(message = 'request timed out', options){
        super(message, options);
    }
}
class JWSSignatureVerificationFailed extends JOSEError {
    static code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
    code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
    constructor(message = 'signature verification failed', options){
        super(message, options);
    }
}
}),
"[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/util/decode_jwt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeJwt",
    ()=>decodeJwt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/util/base64url.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/lib/buffer_utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/lib/is_object.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@stackframe/stack-shared/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)");
;
;
;
;
function decodeJwt(jwt) {
    if (typeof jwt !== 'string') throw new __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTInvalid"]('JWTs must use Compact JWS serialization, JWT must be a string');
    const { 1: payload, length } = jwt.split('.');
    if (length === 5) throw new __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTInvalid"]('Only JWTs using Compact JWS serialization can be decoded');
    if (length !== 3) throw new __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTInvalid"]('Invalid JWT');
    if (!payload) throw new __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTInvalid"]('JWTs must contain a payload');
    let decoded;
    try {
        decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decode"])(payload);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTInvalid"]('Failed to base64url decode the payload');
    }
    let result;
    try {
        result = JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decoder"].decode(decoded));
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTInvalid"]('Failed to parse the decoded payload as JSON');
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(result)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTInvalid"]('Invalid JWT Claims Set');
    return result;
}
}),
"[project]/Demo-2/node_modules/property-expr/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Based on Kendo UI Core expression code <https://github.com/telerik/kendo-ui-core#license-information>
 */ function Cache(maxSize) {
    this._maxSize = maxSize;
    this.clear();
}
Cache.prototype.clear = function() {
    this._size = 0;
    this._values = Object.create(null);
};
Cache.prototype.get = function(key) {
    return this._values[key];
};
Cache.prototype.set = function(key, value) {
    this._size >= this._maxSize && this.clear();
    if (!(key in this._values)) this._size++;
    return this._values[key] = value;
};
var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g, DIGIT_REGEX = /^\d+$/, LEAD_DIGIT_REGEX = /^\d/, SPEC_CHAR_REGEX = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g, CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/, MAX_CACHE_SIZE = 512;
var pathCache = new Cache(MAX_CACHE_SIZE), setCache = new Cache(MAX_CACHE_SIZE), getCache = new Cache(MAX_CACHE_SIZE);
var config;
module.exports = {
    Cache: Cache,
    split: split,
    normalizePath: normalizePath,
    setter: function(path) {
        var parts = normalizePath(path);
        return setCache.get(path) || setCache.set(path, function setter(obj, value) {
            var index = 0;
            var len = parts.length;
            var data = obj;
            while(index < len - 1){
                var part = parts[index];
                if (part === '__proto__' || part === 'constructor' || part === 'prototype') {
                    return obj;
                }
                data = data[parts[index++]];
            }
            data[parts[index]] = value;
        });
    },
    getter: function(path, safe) {
        var parts = normalizePath(path);
        return getCache.get(path) || getCache.set(path, function getter(data) {
            var index = 0, len = parts.length;
            while(index < len){
                if (data != null || !safe) data = data[parts[index++]];
                else return;
            }
            return data;
        });
    },
    join: function(segments) {
        return segments.reduce(function(path, part) {
            return path + (isQuoted(part) || DIGIT_REGEX.test(part) ? '[' + part + ']' : (path ? '.' : '') + part);
        }, '');
    },
    forEach: function(path, cb, thisArg) {
        forEach(Array.isArray(path) ? path : split(path), cb, thisArg);
    }
};
function normalizePath(path) {
    return pathCache.get(path) || pathCache.set(path, split(path).map(function(part) {
        return part.replace(CLEAN_QUOTES_REGEX, '$2');
    }));
}
function split(path) {
    return path.match(SPLIT_REGEX) || [
        ''
    ];
}
function forEach(parts, iter, thisArg) {
    var len = parts.length, part, idx, isArray, isBracket;
    for(idx = 0; idx < len; idx++){
        part = parts[idx];
        if (part) {
            if (shouldBeQuoted(part)) {
                part = '"' + part + '"';
            }
            isBracket = isQuoted(part);
            isArray = !isBracket && /^\d+$/.test(part);
            iter.call(thisArg, part, isBracket, isArray, idx, parts);
        }
    }
}
function isQuoted(str) {
    return typeof str === 'string' && str && [
        "'",
        '"'
    ].indexOf(str.charAt(0)) !== -1;
}
function hasLeadingNumber(part) {
    return part.match(LEAD_DIGIT_REGEX) && !part.match(DIGIT_REGEX);
}
function hasSpecialChars(part) {
    return SPEC_CHAR_REGEX.test(part);
}
function shouldBeQuoted(part) {
    return !isQuoted(part) && (hasLeadingNumber(part) || hasSpecialChars(part));
}
}),
"[project]/Demo-2/node_modules/tiny-case/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const reWords = /[A-Z\xc0-\xd6\xd8-\xde]?[a-z\xdf-\xf6\xf8-\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde]|$)|(?:[A-Z\xc0-\xd6\xd8-\xde]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde](?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])|$)|[A-Z\xc0-\xd6\xd8-\xde]?(?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\xc0-\xd6\xd8-\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\d*(?:1ST|2ND|3RD|(?![123])\dTH)(?=\b|[a-z_])|\d*(?:1st|2nd|3rd|(?![123])\dth)(?=\b|[A-Z_])|\d+|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?)*/g;
const words = (str)=>str.match(reWords) || [];
const upperFirst = (str)=>str[0].toUpperCase() + str.slice(1);
const join = (str, d)=>words(str).join(d).toLowerCase();
const camelCase = (str)=>words(str).reduce((acc, next)=>`${acc}${!acc ? next.toLowerCase() : next[0].toUpperCase() + next.slice(1).toLowerCase()}`, '');
const pascalCase = (str)=>upperFirst(camelCase(str));
const snakeCase = (str)=>join(str, '_');
const kebabCase = (str)=>join(str, '-');
const sentenceCase = (str)=>upperFirst(join(str, ' '));
const titleCase = (str)=>words(str).map(upperFirst).join(' ');
module.exports = {
    words,
    upperFirst,
    camelCase,
    pascalCase,
    snakeCase,
    kebabCase,
    sentenceCase,
    titleCase
};
}),
"[project]/Demo-2/node_modules/toposort/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Topological sorting function
 *
 * @param {Array} edges
 * @returns {Array}
 */ module.exports = function(edges) {
    return toposort(uniqueNodes(edges), edges);
};
module.exports.array = toposort;
function toposort(nodes, edges) {
    var cursor = nodes.length, sorted = new Array(cursor), visited = {}, i = cursor, outgoingEdges = makeOutgoingEdges(edges), nodesHash = makeNodesHash(nodes);
    // check for unknown nodes
    edges.forEach(function(edge) {
        if (!nodesHash.has(edge[0]) || !nodesHash.has(edge[1])) {
            throw new Error('Unknown node. There is an unknown node in the supplied edges.');
        }
    });
    while(i--){
        if (!visited[i]) visit(nodes[i], i, new Set());
    }
    return sorted;
    //TURBOPACK unreachable
    ;
    function visit(node, i, predecessors) {
        if (predecessors.has(node)) {
            var nodeRep;
            try {
                nodeRep = ", node was:" + JSON.stringify(node);
            } catch (e) {
                nodeRep = "";
            }
            throw new Error('Cyclic dependency' + nodeRep);
        }
        if (!nodesHash.has(node)) {
            throw new Error('Found unknown node. Make sure to provided all involved nodes. Unknown node: ' + JSON.stringify(node));
        }
        if (visited[i]) return;
        visited[i] = true;
        var outgoing = outgoingEdges.get(node) || new Set();
        outgoing = Array.from(outgoing);
        if (i = outgoing.length) {
            predecessors.add(node);
            do {
                var child = outgoing[--i];
                visit(child, nodesHash.get(child), predecessors);
            }while (i)
            predecessors.delete(node);
        }
        sorted[--cursor] = node;
    }
}
function uniqueNodes(arr) {
    var res = new Set();
    for(var i = 0, len = arr.length; i < len; i++){
        var edge = arr[i];
        res.add(edge[0]);
        res.add(edge[1]);
    }
    return Array.from(res);
}
function makeOutgoingEdges(arr) {
    var edges = new Map();
    for(var i = 0, len = arr.length; i < len; i++){
        var edge = arr[i];
        if (!edges.has(edge[0])) edges.set(edge[0], new Set());
        if (!edges.has(edge[1])) edges.set(edge[1], new Set());
        edges.get(edge[0]).add(edge[1]);
    }
    return edges;
}
function makeNodesHash(arr) {
    var res = new Map();
    for(var i = 0, len = arr.length; i < len; i++){
        res.set(arr[i], i);
    }
    return res;
}
}),
"[project]/Demo-2/node_modules/yup/index.esm.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArraySchema",
    ()=>ArraySchema,
    "BooleanSchema",
    ()=>BooleanSchema,
    "DateSchema",
    ()=>DateSchema,
    "LazySchema",
    ()=>Lazy,
    "MixedSchema",
    ()=>MixedSchema,
    "NumberSchema",
    ()=>NumberSchema,
    "ObjectSchema",
    ()=>ObjectSchema,
    "Schema",
    ()=>Schema,
    "StringSchema",
    ()=>StringSchema,
    "TupleSchema",
    ()=>TupleSchema,
    "ValidationError",
    ()=>ValidationError,
    "addMethod",
    ()=>addMethod,
    "array",
    ()=>create$2,
    "bool",
    ()=>create$7,
    "boolean",
    ()=>create$7,
    "date",
    ()=>create$4,
    "defaultLocale",
    ()=>locale,
    "getIn",
    ()=>getIn,
    "isSchema",
    ()=>isSchema,
    "lazy",
    ()=>create,
    "mixed",
    ()=>create$8,
    "number",
    ()=>create$5,
    "object",
    ()=>create$3,
    "printValue",
    ()=>printValue,
    "reach",
    ()=>reach,
    "ref",
    ()=>create$9,
    "setLocale",
    ()=>setLocale,
    "string",
    ()=>create$6,
    "tuple",
    ()=>create$1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$property$2d$expr$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/property-expr/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tiny$2d$case$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/tiny-case/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$toposort$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/toposort/index.js [app-route] (ecmascript)");
;
;
;
const toString = Object.prototype.toString;
const errorToString = Error.prototype.toString;
const regExpToString = RegExp.prototype.toString;
const symbolToString = typeof Symbol !== 'undefined' ? Symbol.prototype.toString : ()=>'';
const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
function printNumber(val) {
    if (val != +val) return 'NaN';
    const isNegativeZero = val === 0 && 1 / val < 0;
    return isNegativeZero ? '-0' : '' + val;
}
function printSimpleValue(val, quoteStrings = false) {
    if (val == null || val === true || val === false) return '' + val;
    const typeOf = typeof val;
    if (typeOf === 'number') return printNumber(val);
    if (typeOf === 'string') return quoteStrings ? `"${val}"` : val;
    if (typeOf === 'function') return '[Function ' + (val.name || 'anonymous') + ']';
    if (typeOf === 'symbol') return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
    const tag = toString.call(val).slice(8, -1);
    if (tag === 'Date') return isNaN(val.getTime()) ? '' + val : val.toISOString(val);
    if (tag === 'Error' || val instanceof Error) return '[' + errorToString.call(val) + ']';
    if (tag === 'RegExp') return regExpToString.call(val);
    return null;
}
function printValue(value, quoteStrings) {
    let result = printSimpleValue(value, quoteStrings);
    if (result !== null) return result;
    return JSON.stringify(value, function(key, value) {
        let result = printSimpleValue(this[key], quoteStrings);
        if (result !== null) return result;
        return value;
    }, 2);
}
function toArray(value) {
    return value == null ? [] : [].concat(value);
}
let _Symbol$toStringTag, _Symbol$hasInstance, _Symbol$toStringTag2;
let strReg = /\$\{\s*(\w+)\s*\}/g;
_Symbol$toStringTag = Symbol.toStringTag;
class ValidationErrorNoStack {
    constructor(errorOrErrors, value, field, type){
        this.name = void 0;
        this.message = void 0;
        this.value = void 0;
        this.path = void 0;
        this.type = void 0;
        this.params = void 0;
        this.errors = void 0;
        this.inner = void 0;
        this[_Symbol$toStringTag] = 'Error';
        this.name = 'ValidationError';
        this.value = value;
        this.path = field;
        this.type = type;
        this.errors = [];
        this.inner = [];
        toArray(errorOrErrors).forEach((err)=>{
            if (ValidationError.isError(err)) {
                this.errors.push(...err.errors);
                const innerErrors = err.inner.length ? err.inner : [
                    err
                ];
                this.inner.push(...innerErrors);
            } else {
                this.errors.push(err);
            }
        });
        this.message = this.errors.length > 1 ? `${this.errors.length} errors occurred` : this.errors[0];
    }
}
_Symbol$hasInstance = Symbol.hasInstance;
_Symbol$toStringTag2 = Symbol.toStringTag;
class ValidationError extends Error {
    static formatError(message, params) {
        // Attempt to make the path more friendly for error message interpolation.
        const path = params.label || params.path || 'this';
        // Store the original path under `originalPath` so it isn't lost to custom
        // message functions; e.g., ones provided in `setLocale()` calls.
        params = Object.assign({}, params, {
            path,
            originalPath: params.path
        });
        if (typeof message === 'string') return message.replace(strReg, (_, key)=>printValue(params[key]));
        if (typeof message === 'function') return message(params);
        return message;
    }
    static isError(err) {
        return err && err.name === 'ValidationError';
    }
    constructor(errorOrErrors, value, field, type, disableStack){
        const errorNoStack = new ValidationErrorNoStack(errorOrErrors, value, field, type);
        if (disableStack) {
            return errorNoStack;
        }
        super();
        this.value = void 0;
        this.path = void 0;
        this.type = void 0;
        this.params = void 0;
        this.errors = [];
        this.inner = [];
        this[_Symbol$toStringTag2] = 'Error';
        this.name = errorNoStack.name;
        this.message = errorNoStack.message;
        this.type = errorNoStack.type;
        this.value = errorNoStack.value;
        this.path = errorNoStack.path;
        this.errors = errorNoStack.errors;
        this.inner = errorNoStack.inner;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }
    static [_Symbol$hasInstance](inst) {
        return ValidationErrorNoStack[Symbol.hasInstance](inst) || super[Symbol.hasInstance](inst);
    }
}
let mixed = {
    default: '${path} is invalid',
    required: '${path} is a required field',
    defined: '${path} must be defined',
    notNull: '${path} cannot be null',
    oneOf: '${path} must be one of the following values: ${values}',
    notOneOf: '${path} must not be one of the following values: ${values}',
    notType: ({ path, type, value, originalValue })=>{
        const castMsg = originalValue != null && originalValue !== value ? ` (cast from the value \`${printValue(originalValue, true)}\`).` : '.';
        return type !== 'mixed' ? `${path} must be a \`${type}\` type, ` + `but the final value was: \`${printValue(value, true)}\`` + castMsg : `${path} must match the configured type. ` + `The validated value was: \`${printValue(value, true)}\`` + castMsg;
    }
};
let string = {
    length: '${path} must be exactly ${length} characters',
    min: '${path} must be at least ${min} characters',
    max: '${path} must be at most ${max} characters',
    matches: '${path} must match the following: "${regex}"',
    email: '${path} must be a valid email',
    url: '${path} must be a valid URL',
    uuid: '${path} must be a valid UUID',
    datetime: '${path} must be a valid ISO date-time',
    datetime_precision: '${path} must be a valid ISO date-time with a sub-second precision of exactly ${precision} digits',
    datetime_offset: '${path} must be a valid ISO date-time with UTC "Z" timezone',
    trim: '${path} must be a trimmed string',
    lowercase: '${path} must be a lowercase string',
    uppercase: '${path} must be a upper case string'
};
let number = {
    min: '${path} must be greater than or equal to ${min}',
    max: '${path} must be less than or equal to ${max}',
    lessThan: '${path} must be less than ${less}',
    moreThan: '${path} must be greater than ${more}',
    positive: '${path} must be a positive number',
    negative: '${path} must be a negative number',
    integer: '${path} must be an integer'
};
let date = {
    min: '${path} field must be later than ${min}',
    max: '${path} field must be at earlier than ${max}'
};
let boolean = {
    isValue: '${path} field must be ${value}'
};
let object = {
    noUnknown: '${path} field has unspecified keys: ${unknown}',
    exact: '${path} object contains unknown properties: ${properties}'
};
let array = {
    min: '${path} field must have at least ${min} items',
    max: '${path} field must have less than or equal to ${max} items',
    length: '${path} must have ${length} items'
};
let tuple = {
    notType: (params)=>{
        const { path, value, spec } = params;
        const typeLen = spec.types.length;
        if (Array.isArray(value)) {
            if (value.length < typeLen) return `${path} tuple value has too few items, expected a length of ${typeLen} but got ${value.length} for value: \`${printValue(value, true)}\``;
            if (value.length > typeLen) return `${path} tuple value has too many items, expected a length of ${typeLen} but got ${value.length} for value: \`${printValue(value, true)}\``;
        }
        return ValidationError.formatError(mixed.notType, params);
    }
};
var locale = Object.assign(Object.create(null), {
    mixed,
    string,
    number,
    date,
    object,
    array,
    boolean,
    tuple
});
const isSchema = (obj)=>obj && obj.__isYupSchema__;
class Condition {
    static fromOptions(refs, config) {
        if (!config.then && !config.otherwise) throw new TypeError('either `then:` or `otherwise:` is required for `when()` conditions');
        let { is, then, otherwise } = config;
        let check = typeof is === 'function' ? is : (...values)=>values.every((value)=>value === is);
        return new Condition(refs, (values, schema)=>{
            var _branch;
            let branch = check(...values) ? then : otherwise;
            return (_branch = branch == null ? void 0 : branch(schema)) != null ? _branch : schema;
        });
    }
    constructor(refs, builder){
        this.fn = void 0;
        this.refs = refs;
        this.refs = refs;
        this.fn = builder;
    }
    resolve(base, options) {
        let values = this.refs.map((ref)=>// TODO: ? operator here?
            ref.getValue(options == null ? void 0 : options.value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context));
        let schema = this.fn(values, base, options);
        if (schema === undefined || // @ts-ignore this can be base
        schema === base) {
            return base;
        }
        if (!isSchema(schema)) throw new TypeError('conditions must return a schema object');
        return schema.resolve(options);
    }
}
const prefixes = {
    context: '$',
    value: '.'
};
function create$9(key, options) {
    return new Reference(key, options);
}
class Reference {
    constructor(key, options = {}){
        this.key = void 0;
        this.isContext = void 0;
        this.isValue = void 0;
        this.isSibling = void 0;
        this.path = void 0;
        this.getter = void 0;
        this.map = void 0;
        if (typeof key !== 'string') throw new TypeError('ref must be a string, got: ' + key);
        this.key = key.trim();
        if (key === '') throw new TypeError('ref must be a non-empty string');
        this.isContext = this.key[0] === prefixes.context;
        this.isValue = this.key[0] === prefixes.value;
        this.isSibling = !this.isContext && !this.isValue;
        let prefix = this.isContext ? prefixes.context : this.isValue ? prefixes.value : '';
        this.path = this.key.slice(prefix.length);
        this.getter = this.path && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$property$2d$expr$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getter"])(this.path, true);
        this.map = options.map;
    }
    getValue(value, parent, context) {
        let result = this.isContext ? context : this.isValue ? value : parent;
        if (this.getter) result = this.getter(result || {});
        if (this.map) result = this.map(result);
        return result;
    }
    /**
   *
   * @param {*} value
   * @param {Object} options
   * @param {Object=} options.context
   * @param {Object=} options.parent
   */ cast(value, options) {
        return this.getValue(value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context);
    }
    resolve() {
        return this;
    }
    describe() {
        return {
            type: 'ref',
            key: this.key
        };
    }
    toString() {
        return `Ref(${this.key})`;
    }
    static isRef(value) {
        return value && value.__isYupRef;
    }
}
// @ts-ignore
Reference.prototype.__isYupRef = true;
const isAbsent = (value)=>value == null;
function createValidation(config) {
    function validate({ value, path = '', options, originalValue, schema }, panic, next) {
        const { name, test, params, message, skipAbsent } = config;
        let { parent, context, abortEarly = schema.spec.abortEarly, disableStackTrace = schema.spec.disableStackTrace } = options;
        const resolveOptions = {
            value,
            parent,
            context
        };
        function createError(overrides = {}) {
            const nextParams = resolveParams(Object.assign({
                value,
                originalValue,
                label: schema.spec.label,
                path: overrides.path || path,
                spec: schema.spec,
                disableStackTrace: overrides.disableStackTrace || disableStackTrace
            }, params, overrides.params), resolveOptions);
            const error = new ValidationError(ValidationError.formatError(overrides.message || message, nextParams), value, nextParams.path, overrides.type || name, nextParams.disableStackTrace);
            error.params = nextParams;
            return error;
        }
        const invalid = abortEarly ? panic : next;
        let ctx = {
            path,
            parent,
            type: name,
            from: options.from,
            createError,
            resolve (item) {
                return resolveMaybeRef(item, resolveOptions);
            },
            options,
            originalValue,
            schema
        };
        const handleResult = (validOrError)=>{
            if (ValidationError.isError(validOrError)) invalid(validOrError);
            else if (!validOrError) invalid(createError());
            else next(null);
        };
        const handleError = (err)=>{
            if (ValidationError.isError(err)) invalid(err);
            else panic(err);
        };
        const shouldSkip = skipAbsent && isAbsent(value);
        if (shouldSkip) {
            return handleResult(true);
        }
        let result;
        try {
            var _result;
            result = test.call(ctx, value, ctx);
            if (typeof ((_result = result) == null ? void 0 : _result.then) === 'function') {
                if (options.sync) {
                    throw new Error(`Validation test of type: "${ctx.type}" returned a Promise during a synchronous validate. ` + `This test will finish after the validate call has returned`);
                }
                return Promise.resolve(result).then(handleResult, handleError);
            }
        } catch (err) {
            handleError(err);
            return;
        }
        handleResult(result);
    }
    validate.OPTIONS = config;
    return validate;
}
// Warning: mutates the input
function resolveParams(params, options) {
    if (!params) return params;
    for (const key of Object.keys(params)){
        params[key] = resolveMaybeRef(params[key], options);
    }
    return params;
}
function resolveMaybeRef(item, options) {
    return Reference.isRef(item) ? item.getValue(options.value, options.parent, options.context) : item;
}
function getIn(schema, path, value, context = value) {
    let parent, lastPart, lastPartDebug;
    // root path: ''
    if (!path) return {
        parent,
        parentPath: path,
        schema
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$property$2d$expr$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["forEach"])(path, (_part, isBracket, isArray)=>{
        let part = isBracket ? _part.slice(1, _part.length - 1) : _part;
        schema = schema.resolve({
            context,
            parent,
            value
        });
        let isTuple = schema.type === 'tuple';
        let idx = isArray ? parseInt(part, 10) : 0;
        if (schema.innerType || isTuple) {
            if (isTuple && !isArray) throw new Error(`Yup.reach cannot implicitly index into a tuple type. the path part "${lastPartDebug}" must contain an index to the tuple element, e.g. "${lastPartDebug}[0]"`);
            if (value && idx >= value.length) {
                throw new Error(`Yup.reach cannot resolve an array item at index: ${_part}, in the path: ${path}. ` + `because there is no value at that index. `);
            }
            parent = value;
            value = value && value[idx];
            schema = isTuple ? schema.spec.types[idx] : schema.innerType;
        }
        // sometimes the array index part of a path doesn't exist: "nested.arr.child"
        // in these cases the current part is the next schema and should be processed
        // in this iteration. For cases where the index signature is included this
        // check will fail and we'll handle the `child` part on the next iteration like normal
        if (!isArray) {
            if (!schema.fields || !schema.fields[part]) throw new Error(`The schema does not contain the path: ${path}. ` + `(failed at: ${lastPartDebug} which is a type: "${schema.type}")`);
            parent = value;
            value = value && value[part];
            schema = schema.fields[part];
        }
        lastPart = part;
        lastPartDebug = isBracket ? '[' + _part + ']' : '.' + _part;
    });
    return {
        schema,
        parent,
        parentPath: lastPart
    };
}
function reach(obj, path, value, context) {
    return getIn(obj, path, value, context).schema;
}
class ReferenceSet extends Set {
    describe() {
        const description = [];
        for (const item of this.values()){
            description.push(Reference.isRef(item) ? item.describe() : item);
        }
        return description;
    }
    resolveAll(resolve) {
        let result = [];
        for (const item of this.values()){
            result.push(resolve(item));
        }
        return result;
    }
    clone() {
        return new ReferenceSet(this.values());
    }
    merge(newItems, removeItems) {
        const next = this.clone();
        newItems.forEach((value)=>next.add(value));
        removeItems.forEach((value)=>next.delete(value));
        return next;
    }
}
// tweaked from https://github.com/Kelin2025/nanoclone/blob/0abeb7635bda9b68ef2277093f76dbe3bf3948e1/src/index.js
function clone(src, seen = new Map()) {
    if (isSchema(src) || !src || typeof src !== 'object') return src;
    if (seen.has(src)) return seen.get(src);
    let copy;
    if (src instanceof Date) {
        // Date
        copy = new Date(src.getTime());
        seen.set(src, copy);
    } else if (src instanceof RegExp) {
        // RegExp
        copy = new RegExp(src);
        seen.set(src, copy);
    } else if (Array.isArray(src)) {
        // Array
        copy = new Array(src.length);
        seen.set(src, copy);
        for(let i = 0; i < src.length; i++)copy[i] = clone(src[i], seen);
    } else if (src instanceof Map) {
        // Map
        copy = new Map();
        seen.set(src, copy);
        for (const [k, v] of src.entries())copy.set(k, clone(v, seen));
    } else if (src instanceof Set) {
        // Set
        copy = new Set();
        seen.set(src, copy);
        for (const v of src)copy.add(clone(v, seen));
    } else if (src instanceof Object) {
        // Object
        copy = {};
        seen.set(src, copy);
        for (const [k, v] of Object.entries(src))copy[k] = clone(v, seen);
    } else {
        throw Error(`Unable to clone ${src}`);
    }
    return copy;
}
/**
 * Copied from @standard-schema/spec to avoid having a dependency on it.
 * https://github.com/standard-schema/standard-schema/blob/main/packages/spec/src/index.ts
 */ function createStandardPath(path) {
    if (!(path != null && path.length)) {
        return undefined;
    }
    // Array to store the final path segments
    const segments = [];
    // Buffer for building the current segment
    let currentSegment = '';
    // Track if we're inside square brackets (array/property access)
    let inBrackets = false;
    // Track if we're inside quotes (for property names with special chars)
    let inQuotes = false;
    for(let i = 0; i < path.length; i++){
        const char = path[i];
        if (char === '[' && !inQuotes) {
            // When entering brackets, push any accumulated segment after splitting on dots
            if (currentSegment) {
                segments.push(...currentSegment.split('.').filter(Boolean));
                currentSegment = '';
            }
            inBrackets = true;
            continue;
        }
        if (char === ']' && !inQuotes) {
            if (currentSegment) {
                // Handle numeric indices (e.g. arr[0])
                if (/^\d+$/.test(currentSegment)) {
                    segments.push(currentSegment);
                } else {
                    // Handle quoted property names (e.g. obj["foo.bar"])
                    segments.push(currentSegment.replace(/^"|"$/g, ''));
                }
                currentSegment = '';
            }
            inBrackets = false;
            continue;
        }
        if (char === '"') {
            // Toggle quote state for handling quoted property names
            inQuotes = !inQuotes;
            continue;
        }
        if (char === '.' && !inBrackets && !inQuotes) {
            // On dots outside brackets/quotes, push current segment
            if (currentSegment) {
                segments.push(currentSegment);
                currentSegment = '';
            }
            continue;
        }
        currentSegment += char;
    }
    // Push any remaining segment after splitting on dots
    if (currentSegment) {
        segments.push(...currentSegment.split('.').filter(Boolean));
    }
    return segments;
}
function createStandardIssues(error, parentPath) {
    const path = parentPath ? `${parentPath}.${error.path}` : error.path;
    return error.errors.map((err)=>({
            message: err,
            path: createStandardPath(path)
        }));
}
function issuesFromValidationError(error, parentPath) {
    var _error$inner;
    if (!((_error$inner = error.inner) != null && _error$inner.length) && error.errors.length) {
        return createStandardIssues(error, parentPath);
    }
    const path = parentPath ? `${parentPath}.${error.path}` : error.path;
    return error.inner.flatMap((err)=>issuesFromValidationError(err, path));
}
// If `CustomSchemaMeta` isn't extended with any keys, we'll fall back to a
// loose Record definition allowing free form usage.
class Schema {
    constructor(options){
        this.type = void 0;
        this.deps = [];
        this.tests = void 0;
        this.transforms = void 0;
        this.conditions = [];
        this._mutate = void 0;
        this.internalTests = {};
        this._whitelist = new ReferenceSet();
        this._blacklist = new ReferenceSet();
        this.exclusiveTests = Object.create(null);
        this._typeCheck = void 0;
        this.spec = void 0;
        this.tests = [];
        this.transforms = [];
        this.withMutation(()=>{
            this.typeError(mixed.notType);
        });
        this.type = options.type;
        this._typeCheck = options.check;
        this.spec = Object.assign({
            strip: false,
            strict: false,
            abortEarly: true,
            recursive: true,
            disableStackTrace: false,
            nullable: false,
            optional: true,
            coerce: true
        }, options == null ? void 0 : options.spec);
        this.withMutation((s)=>{
            s.nonNullable();
        });
    }
    // TODO: remove
    get _type() {
        return this.type;
    }
    clone(spec) {
        if (this._mutate) {
            if (spec) Object.assign(this.spec, spec);
            return this;
        }
        // if the nested value is a schema we can skip cloning, since
        // they are already immutable
        const next = Object.create(Object.getPrototypeOf(this));
        // @ts-expect-error this is readonly
        next.type = this.type;
        next._typeCheck = this._typeCheck;
        next._whitelist = this._whitelist.clone();
        next._blacklist = this._blacklist.clone();
        next.internalTests = Object.assign({}, this.internalTests);
        next.exclusiveTests = Object.assign({}, this.exclusiveTests);
        // @ts-expect-error this is readonly
        next.deps = [
            ...this.deps
        ];
        next.conditions = [
            ...this.conditions
        ];
        next.tests = [
            ...this.tests
        ];
        next.transforms = [
            ...this.transforms
        ];
        next.spec = clone(Object.assign({}, this.spec, spec));
        return next;
    }
    label(label) {
        let next = this.clone();
        next.spec.label = label;
        return next;
    }
    meta(...args) {
        if (args.length === 0) return this.spec.meta;
        let next = this.clone();
        next.spec.meta = Object.assign(next.spec.meta || {}, args[0]);
        return next;
    }
    withMutation(fn) {
        let before = this._mutate;
        this._mutate = true;
        let result = fn(this);
        this._mutate = before;
        return result;
    }
    concat(schema) {
        if (!schema || schema === this) return this;
        if (schema.type !== this.type && this.type !== 'mixed') throw new TypeError(`You cannot \`concat()\` schema's of different types: ${this.type} and ${schema.type}`);
        let base = this;
        let combined = schema.clone();
        const mergedSpec = Object.assign({}, base.spec, combined.spec);
        combined.spec = mergedSpec;
        combined.internalTests = Object.assign({}, base.internalTests, combined.internalTests);
        // manually merge the blacklist/whitelist (the other `schema` takes
        // precedence in case of conflicts)
        combined._whitelist = base._whitelist.merge(schema._whitelist, schema._blacklist);
        combined._blacklist = base._blacklist.merge(schema._blacklist, schema._whitelist);
        // start with the current tests
        combined.tests = base.tests;
        combined.exclusiveTests = base.exclusiveTests;
        // manually add the new tests to ensure
        // the deduping logic is consistent
        combined.withMutation((next)=>{
            schema.tests.forEach((fn)=>{
                next.test(fn.OPTIONS);
            });
        });
        combined.transforms = [
            ...base.transforms,
            ...combined.transforms
        ];
        return combined;
    }
    isType(v) {
        if (v == null) {
            if (this.spec.nullable && v === null) return true;
            if (this.spec.optional && v === undefined) return true;
            return false;
        }
        return this._typeCheck(v);
    }
    resolve(options) {
        let schema = this;
        if (schema.conditions.length) {
            let conditions = schema.conditions;
            schema = schema.clone();
            schema.conditions = [];
            schema = conditions.reduce((prevSchema, condition)=>condition.resolve(prevSchema, options), schema);
            schema = schema.resolve(options);
        }
        return schema;
    }
    resolveOptions(options) {
        var _options$strict, _options$abortEarly, _options$recursive, _options$disableStack;
        return Object.assign({}, options, {
            from: options.from || [],
            strict: (_options$strict = options.strict) != null ? _options$strict : this.spec.strict,
            abortEarly: (_options$abortEarly = options.abortEarly) != null ? _options$abortEarly : this.spec.abortEarly,
            recursive: (_options$recursive = options.recursive) != null ? _options$recursive : this.spec.recursive,
            disableStackTrace: (_options$disableStack = options.disableStackTrace) != null ? _options$disableStack : this.spec.disableStackTrace
        });
    }
    /**
   * Run the configured transform pipeline over an input value.
   */ cast(value, options = {}) {
        let resolvedSchema = this.resolve(Object.assign({}, options, {
            value
        }));
        let allowOptionality = options.assert === 'ignore-optionality';
        let result = resolvedSchema._cast(value, options);
        if (options.assert !== false && !resolvedSchema.isType(result)) {
            if (allowOptionality && isAbsent(result)) {
                return result;
            }
            let formattedValue = printValue(value);
            let formattedResult = printValue(result);
            throw new TypeError(`The value of ${options.path || 'field'} could not be cast to a value ` + `that satisfies the schema type: "${resolvedSchema.type}". \n\n` + `attempted value: ${formattedValue} \n` + (formattedResult !== formattedValue ? `result of cast: ${formattedResult}` : ''));
        }
        return result;
    }
    _cast(rawValue, options) {
        let value = rawValue === undefined ? rawValue : this.transforms.reduce((prevValue, fn)=>fn.call(this, prevValue, rawValue, this, options), rawValue);
        if (value === undefined) {
            value = this.getDefault(options);
        }
        return value;
    }
    _validate(_value, options = {}, panic, next) {
        let { path, originalValue = _value, strict = this.spec.strict } = options;
        let value = _value;
        if (!strict) {
            value = this._cast(value, Object.assign({
                assert: false
            }, options));
        }
        let initialTests = [];
        for (let test of Object.values(this.internalTests)){
            if (test) initialTests.push(test);
        }
        this.runTests({
            path,
            value,
            originalValue,
            options,
            tests: initialTests
        }, panic, (initialErrors)=>{
            // even if we aren't ending early we can't proceed further if the types aren't correct
            if (initialErrors.length) {
                return next(initialErrors, value);
            }
            this.runTests({
                path,
                value,
                originalValue,
                options,
                tests: this.tests
            }, panic, next);
        });
    }
    /**
   * Executes a set of validations, either schema, produced Tests or a nested
   * schema validate result.
   */ runTests(runOptions, panic, next) {
        let fired = false;
        let { tests, value, originalValue, path, options } = runOptions;
        let panicOnce = (arg)=>{
            if (fired) return;
            fired = true;
            panic(arg, value);
        };
        let nextOnce = (arg)=>{
            if (fired) return;
            fired = true;
            next(arg, value);
        };
        let count = tests.length;
        let nestedErrors = [];
        if (!count) return nextOnce([]);
        let args = {
            value,
            originalValue,
            path,
            options,
            schema: this
        };
        for(let i = 0; i < tests.length; i++){
            const test = tests[i];
            test(args, panicOnce, function finishTestRun(err) {
                if (err) {
                    Array.isArray(err) ? nestedErrors.push(...err) : nestedErrors.push(err);
                }
                if (--count <= 0) {
                    nextOnce(nestedErrors);
                }
            });
        }
    }
    asNestedTest({ key, index, parent, parentPath, originalParent, options }) {
        const k = key != null ? key : index;
        if (k == null) {
            throw TypeError('Must include `key` or `index` for nested validations');
        }
        const isIndex = typeof k === 'number';
        let value = parent[k];
        const testOptions = Object.assign({}, options, {
            // Nested validations fields are always strict:
            //    1. parent isn't strict so the casting will also have cast inner values
            //    2. parent is strict in which case the nested values weren't cast either
            strict: true,
            parent,
            value,
            originalValue: originalParent[k],
            // FIXME: tests depend on `index` being passed around deeply,
            //   we should not let the options.key/index bleed through
            key: undefined,
            // index: undefined,
            [isIndex ? 'index' : 'key']: k,
            path: isIndex || k.includes('.') ? `${parentPath || ''}[${isIndex ? k : `"${k}"`}]` : (parentPath ? `${parentPath}.` : '') + key
        });
        return (_, panic, next)=>this.resolve(testOptions)._validate(value, testOptions, panic, next);
    }
    validate(value, options) {
        var _options$disableStack2;
        let schema = this.resolve(Object.assign({}, options, {
            value
        }));
        let disableStackTrace = (_options$disableStack2 = options == null ? void 0 : options.disableStackTrace) != null ? _options$disableStack2 : schema.spec.disableStackTrace;
        return new Promise((resolve, reject)=>schema._validate(value, options, (error, parsed)=>{
                if (ValidationError.isError(error)) error.value = parsed;
                reject(error);
            }, (errors, validated)=>{
                if (errors.length) reject(new ValidationError(errors, validated, undefined, undefined, disableStackTrace));
                else resolve(validated);
            }));
    }
    validateSync(value, options) {
        var _options$disableStack3;
        let schema = this.resolve(Object.assign({}, options, {
            value
        }));
        let result;
        let disableStackTrace = (_options$disableStack3 = options == null ? void 0 : options.disableStackTrace) != null ? _options$disableStack3 : schema.spec.disableStackTrace;
        schema._validate(value, Object.assign({}, options, {
            sync: true
        }), (error, parsed)=>{
            if (ValidationError.isError(error)) error.value = parsed;
            throw error;
        }, (errors, validated)=>{
            if (errors.length) throw new ValidationError(errors, value, undefined, undefined, disableStackTrace);
            result = validated;
        });
        return result;
    }
    isValid(value, options) {
        return this.validate(value, options).then(()=>true, (err)=>{
            if (ValidationError.isError(err)) return false;
            throw err;
        });
    }
    isValidSync(value, options) {
        try {
            this.validateSync(value, options);
            return true;
        } catch (err) {
            if (ValidationError.isError(err)) return false;
            throw err;
        }
    }
    _getDefault(options) {
        let defaultValue = this.spec.default;
        if (defaultValue == null) {
            return defaultValue;
        }
        return typeof defaultValue === 'function' ? defaultValue.call(this, options) : clone(defaultValue);
    }
    getDefault(options) {
        let schema = this.resolve(options || {});
        return schema._getDefault(options);
    }
    default(def) {
        if (arguments.length === 0) {
            return this._getDefault();
        }
        let next = this.clone({
            default: def
        });
        return next;
    }
    strict(isStrict = true) {
        return this.clone({
            strict: isStrict
        });
    }
    nullability(nullable, message) {
        const next = this.clone({
            nullable
        });
        next.internalTests.nullable = createValidation({
            message,
            name: 'nullable',
            test (value) {
                return value === null ? this.schema.spec.nullable : true;
            }
        });
        return next;
    }
    optionality(optional, message) {
        const next = this.clone({
            optional
        });
        next.internalTests.optionality = createValidation({
            message,
            name: 'optionality',
            test (value) {
                return value === undefined ? this.schema.spec.optional : true;
            }
        });
        return next;
    }
    optional() {
        return this.optionality(true);
    }
    defined(message = mixed.defined) {
        return this.optionality(false, message);
    }
    nullable() {
        return this.nullability(true);
    }
    nonNullable(message = mixed.notNull) {
        return this.nullability(false, message);
    }
    required(message = mixed.required) {
        return this.clone().withMutation((next)=>next.nonNullable(message).defined(message));
    }
    notRequired() {
        return this.clone().withMutation((next)=>next.nullable().optional());
    }
    transform(fn) {
        let next = this.clone();
        next.transforms.push(fn);
        return next;
    }
    /**
   * Adds a test function to the schema's queue of tests.
   * tests can be exclusive or non-exclusive.
   *
   * - exclusive tests, will replace any existing tests of the same name.
   * - non-exclusive: can be stacked
   *
   * If a non-exclusive test is added to a schema with an exclusive test of the same name
   * the exclusive test is removed and further tests of the same name will be stacked.
   *
   * If an exclusive test is added to a schema with non-exclusive tests of the same name
   * the previous tests are removed and further tests of the same name will replace each other.
   */ test(...args) {
        let opts;
        if (args.length === 1) {
            if (typeof args[0] === 'function') {
                opts = {
                    test: args[0]
                };
            } else {
                opts = args[0];
            }
        } else if (args.length === 2) {
            opts = {
                name: args[0],
                test: args[1]
            };
        } else {
            opts = {
                name: args[0],
                message: args[1],
                test: args[2]
            };
        }
        if (opts.message === undefined) opts.message = mixed.default;
        if (typeof opts.test !== 'function') throw new TypeError('`test` is a required parameters');
        let next = this.clone();
        let validate = createValidation(opts);
        let isExclusive = opts.exclusive || opts.name && next.exclusiveTests[opts.name] === true;
        if (opts.exclusive) {
            if (!opts.name) throw new TypeError('Exclusive tests must provide a unique `name` identifying the test');
        }
        if (opts.name) next.exclusiveTests[opts.name] = !!opts.exclusive;
        next.tests = next.tests.filter((fn)=>{
            if (fn.OPTIONS.name === opts.name) {
                if (isExclusive) return false;
                if (fn.OPTIONS.test === validate.OPTIONS.test) return false;
            }
            return true;
        });
        next.tests.push(validate);
        return next;
    }
    when(keys, options) {
        if (!Array.isArray(keys) && typeof keys !== 'string') {
            options = keys;
            keys = '.';
        }
        let next = this.clone();
        let deps = toArray(keys).map((key)=>new Reference(key));
        deps.forEach((dep)=>{
            // @ts-ignore readonly array
            if (dep.isSibling) next.deps.push(dep.key);
        });
        next.conditions.push(typeof options === 'function' ? new Condition(deps, options) : Condition.fromOptions(deps, options));
        return next;
    }
    typeError(message) {
        let next = this.clone();
        next.internalTests.typeError = createValidation({
            message,
            name: 'typeError',
            skipAbsent: true,
            test (value) {
                if (!this.schema._typeCheck(value)) return this.createError({
                    params: {
                        type: this.schema.type
                    }
                });
                return true;
            }
        });
        return next;
    }
    oneOf(enums, message = mixed.oneOf) {
        let next = this.clone();
        enums.forEach((val)=>{
            next._whitelist.add(val);
            next._blacklist.delete(val);
        });
        next.internalTests.whiteList = createValidation({
            message,
            name: 'oneOf',
            skipAbsent: true,
            test (value) {
                let valids = this.schema._whitelist;
                let resolved = valids.resolveAll(this.resolve);
                return resolved.includes(value) ? true : this.createError({
                    params: {
                        values: Array.from(valids).join(', '),
                        resolved
                    }
                });
            }
        });
        return next;
    }
    notOneOf(enums, message = mixed.notOneOf) {
        let next = this.clone();
        enums.forEach((val)=>{
            next._blacklist.add(val);
            next._whitelist.delete(val);
        });
        next.internalTests.blacklist = createValidation({
            message,
            name: 'notOneOf',
            test (value) {
                let invalids = this.schema._blacklist;
                let resolved = invalids.resolveAll(this.resolve);
                if (resolved.includes(value)) return this.createError({
                    params: {
                        values: Array.from(invalids).join(', '),
                        resolved
                    }
                });
                return true;
            }
        });
        return next;
    }
    strip(strip = true) {
        let next = this.clone();
        next.spec.strip = strip;
        return next;
    }
    /**
   * Return a serialized description of the schema including validations, flags, types etc.
   *
   * @param options Provide any needed context for resolving runtime schema alterations (lazy, when conditions, etc).
   */ describe(options) {
        const next = (options ? this.resolve(options) : this).clone();
        const { label, meta, optional, nullable } = next.spec;
        const description = {
            meta,
            label,
            optional,
            nullable,
            default: next.getDefault(options),
            type: next.type,
            oneOf: next._whitelist.describe(),
            notOneOf: next._blacklist.describe(),
            tests: next.tests.filter((n, idx, list)=>list.findIndex((c)=>c.OPTIONS.name === n.OPTIONS.name) === idx).map((fn)=>{
                const params = fn.OPTIONS.params && options ? resolveParams(Object.assign({}, fn.OPTIONS.params), options) : fn.OPTIONS.params;
                return {
                    name: fn.OPTIONS.name,
                    params
                };
            })
        };
        return description;
    }
    get ['~standard']() {
        const schema = this;
        const standard = {
            version: 1,
            vendor: 'yup',
            async validate (value) {
                try {
                    const result = await schema.validate(value, {
                        abortEarly: false
                    });
                    return {
                        value: result
                    };
                } catch (err) {
                    if (err instanceof ValidationError) {
                        return {
                            issues: issuesFromValidationError(err)
                        };
                    }
                    throw err;
                }
            }
        };
        return standard;
    }
}
// @ts-expect-error
Schema.prototype.__isYupSchema__ = true;
for (const method of [
    'validate',
    'validateSync'
])Schema.prototype[`${method}At`] = function(path, value, options = {}) {
    const { parent, parentPath, schema } = getIn(this, path, value, options.context);
    return schema[method](parent && parent[parentPath], Object.assign({}, options, {
        parent,
        path
    }));
};
for (const alias of [
    'equals',
    'is'
])Schema.prototype[alias] = Schema.prototype.oneOf;
for (const alias of [
    'not',
    'nope'
])Schema.prototype[alias] = Schema.prototype.notOneOf;
const returnsTrue = ()=>true;
function create$8(spec) {
    return new MixedSchema(spec);
}
class MixedSchema extends Schema {
    constructor(spec){
        super(typeof spec === 'function' ? {
            type: 'mixed',
            check: spec
        } : Object.assign({
            type: 'mixed',
            check: returnsTrue
        }, spec));
    }
}
create$8.prototype = MixedSchema.prototype;
function create$7() {
    return new BooleanSchema();
}
class BooleanSchema extends Schema {
    constructor(){
        super({
            type: 'boolean',
            check (v) {
                if (v instanceof Boolean) v = v.valueOf();
                return typeof v === 'boolean';
            }
        });
        this.withMutation(()=>{
            this.transform((value, _raw)=>{
                if (this.spec.coerce && !this.isType(value)) {
                    if (/^(true|1)$/i.test(String(value))) return true;
                    if (/^(false|0)$/i.test(String(value))) return false;
                }
                return value;
            });
        });
    }
    isTrue(message = boolean.isValue) {
        return this.test({
            message,
            name: 'is-value',
            exclusive: true,
            params: {
                value: 'true'
            },
            test (value) {
                return isAbsent(value) || value === true;
            }
        });
    }
    isFalse(message = boolean.isValue) {
        return this.test({
            message,
            name: 'is-value',
            exclusive: true,
            params: {
                value: 'false'
            },
            test (value) {
                return isAbsent(value) || value === false;
            }
        });
    }
    default(def) {
        return super.default(def);
    }
    defined(msg) {
        return super.defined(msg);
    }
    optional() {
        return super.optional();
    }
    required(msg) {
        return super.required(msg);
    }
    notRequired() {
        return super.notRequired();
    }
    nullable() {
        return super.nullable();
    }
    nonNullable(msg) {
        return super.nonNullable(msg);
    }
    strip(v) {
        return super.strip(v);
    }
}
create$7.prototype = BooleanSchema.prototype;
/**
 * This file is a modified version of the file from the following repository:
 * Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
 * NON-CONFORMANT EDITION.
 * © 2011 Colin Snover <http://zetafleet.com>
 * Released under MIT license.
 */ // prettier-ignore
//                1 YYYY                2 MM        3 DD              4 HH     5 mm        6 ss           7 msec         8 Z 9 ±   10 tzHH    11 tzmm
const isoReg = /^(\d{4}|[+-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,.](\d{1,}))?)?(?:(Z)|([+-])(\d{2})(?::?(\d{2}))?)?)?$/;
function parseIsoDate(date) {
    const struct = parseDateStruct(date);
    if (!struct) return Date.parse ? Date.parse(date) : Number.NaN;
    // timestamps without timezone identifiers should be considered local time
    if (struct.z === undefined && struct.plusMinus === undefined) {
        return new Date(struct.year, struct.month, struct.day, struct.hour, struct.minute, struct.second, struct.millisecond).valueOf();
    }
    let totalMinutesOffset = 0;
    if (struct.z !== 'Z' && struct.plusMinus !== undefined) {
        totalMinutesOffset = struct.hourOffset * 60 + struct.minuteOffset;
        if (struct.plusMinus === '+') totalMinutesOffset = 0 - totalMinutesOffset;
    }
    return Date.UTC(struct.year, struct.month, struct.day, struct.hour, struct.minute + totalMinutesOffset, struct.second, struct.millisecond);
}
function parseDateStruct(date) {
    var _regexResult$7$length, _regexResult$;
    const regexResult = isoReg.exec(date);
    if (!regexResult) return null;
    // use of toNumber() avoids NaN timestamps caused by “undefined”
    // values being passed to Date constructor
    return {
        year: toNumber(regexResult[1]),
        month: toNumber(regexResult[2], 1) - 1,
        day: toNumber(regexResult[3], 1),
        hour: toNumber(regexResult[4]),
        minute: toNumber(regexResult[5]),
        second: toNumber(regexResult[6]),
        millisecond: regexResult[7] ? // allow arbitrary sub-second precision beyond milliseconds
        toNumber(regexResult[7].substring(0, 3)) : 0,
        precision: (_regexResult$7$length = (_regexResult$ = regexResult[7]) == null ? void 0 : _regexResult$.length) != null ? _regexResult$7$length : undefined,
        z: regexResult[8] || undefined,
        plusMinus: regexResult[9] || undefined,
        hourOffset: toNumber(regexResult[10]),
        minuteOffset: toNumber(regexResult[11])
    };
}
function toNumber(str, defaultValue = 0) {
    return Number(str) || defaultValue;
}
// Taken from HTML spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
let rEmail = // eslint-disable-next-line
/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
let rUrl = // eslint-disable-next-line
/^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
// eslint-disable-next-line
let rUUID = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
let yearMonthDay = '^\\d{4}-\\d{2}-\\d{2}';
let hourMinuteSecond = '\\d{2}:\\d{2}:\\d{2}';
let zOrOffset = '(([+-]\\d{2}(:?\\d{2})?)|Z)';
let rIsoDateTime = new RegExp(`${yearMonthDay}T${hourMinuteSecond}(\\.\\d+)?${zOrOffset}$`);
let isTrimmed = (value)=>isAbsent(value) || value === value.trim();
let objStringTag = ({}).toString();
function create$6() {
    return new StringSchema();
}
class StringSchema extends Schema {
    constructor(){
        super({
            type: 'string',
            check (value) {
                if (value instanceof String) value = value.valueOf();
                return typeof value === 'string';
            }
        });
        this.withMutation(()=>{
            this.transform((value, _raw)=>{
                if (!this.spec.coerce || this.isType(value)) return value;
                // don't ever convert arrays
                if (Array.isArray(value)) return value;
                const strValue = value != null && value.toString ? value.toString() : value;
                // no one wants plain objects converted to [Object object]
                if (strValue === objStringTag) return value;
                return strValue;
            });
        });
    }
    required(message) {
        return super.required(message).withMutation((schema)=>schema.test({
                message: message || mixed.required,
                name: 'required',
                skipAbsent: true,
                test: (value)=>!!value.length
            }));
    }
    notRequired() {
        return super.notRequired().withMutation((schema)=>{
            schema.tests = schema.tests.filter((t)=>t.OPTIONS.name !== 'required');
            return schema;
        });
    }
    length(length, message = string.length) {
        return this.test({
            message,
            name: 'length',
            exclusive: true,
            params: {
                length
            },
            skipAbsent: true,
            test (value) {
                return value.length === this.resolve(length);
            }
        });
    }
    min(min, message = string.min) {
        return this.test({
            message,
            name: 'min',
            exclusive: true,
            params: {
                min
            },
            skipAbsent: true,
            test (value) {
                return value.length >= this.resolve(min);
            }
        });
    }
    max(max, message = string.max) {
        return this.test({
            name: 'max',
            exclusive: true,
            message,
            params: {
                max
            },
            skipAbsent: true,
            test (value) {
                return value.length <= this.resolve(max);
            }
        });
    }
    matches(regex, options) {
        let excludeEmptyString = false;
        let message;
        let name;
        if (options) {
            if (typeof options === 'object') {
                ({ excludeEmptyString = false, message, name } = options);
            } else {
                message = options;
            }
        }
        return this.test({
            name: name || 'matches',
            message: message || string.matches,
            params: {
                regex
            },
            skipAbsent: true,
            test: (value)=>value === '' && excludeEmptyString || value.search(regex) !== -1
        });
    }
    email(message = string.email) {
        return this.matches(rEmail, {
            name: 'email',
            message,
            excludeEmptyString: true
        });
    }
    url(message = string.url) {
        return this.matches(rUrl, {
            name: 'url',
            message,
            excludeEmptyString: true
        });
    }
    uuid(message = string.uuid) {
        return this.matches(rUUID, {
            name: 'uuid',
            message,
            excludeEmptyString: false
        });
    }
    datetime(options) {
        let message = '';
        let allowOffset;
        let precision;
        if (options) {
            if (typeof options === 'object') {
                ({ message = '', allowOffset = false, precision = undefined } = options);
            } else {
                message = options;
            }
        }
        return this.matches(rIsoDateTime, {
            name: 'datetime',
            message: message || string.datetime,
            excludeEmptyString: true
        }).test({
            name: 'datetime_offset',
            message: message || string.datetime_offset,
            params: {
                allowOffset
            },
            skipAbsent: true,
            test: (value)=>{
                if (!value || allowOffset) return true;
                const struct = parseDateStruct(value);
                if (!struct) return false;
                return !!struct.z;
            }
        }).test({
            name: 'datetime_precision',
            message: message || string.datetime_precision,
            params: {
                precision
            },
            skipAbsent: true,
            test: (value)=>{
                if (!value || precision == undefined) return true;
                const struct = parseDateStruct(value);
                if (!struct) return false;
                return struct.precision === precision;
            }
        });
    }
    //-- transforms --
    ensure() {
        return this.default('').transform((val)=>val === null ? '' : val);
    }
    trim(message = string.trim) {
        return this.transform((val)=>val != null ? val.trim() : val).test({
            message,
            name: 'trim',
            test: isTrimmed
        });
    }
    lowercase(message = string.lowercase) {
        return this.transform((value)=>!isAbsent(value) ? value.toLowerCase() : value).test({
            message,
            name: 'string_case',
            exclusive: true,
            skipAbsent: true,
            test: (value)=>isAbsent(value) || value === value.toLowerCase()
        });
    }
    uppercase(message = string.uppercase) {
        return this.transform((value)=>!isAbsent(value) ? value.toUpperCase() : value).test({
            message,
            name: 'string_case',
            exclusive: true,
            skipAbsent: true,
            test: (value)=>isAbsent(value) || value === value.toUpperCase()
        });
    }
}
create$6.prototype = StringSchema.prototype;
//
// String Interfaces
//
let isNaN$1 = (value)=>value != +value;
function create$5() {
    return new NumberSchema();
}
class NumberSchema extends Schema {
    constructor(){
        super({
            type: 'number',
            check (value) {
                if (value instanceof Number) value = value.valueOf();
                return typeof value === 'number' && !isNaN$1(value);
            }
        });
        this.withMutation(()=>{
            this.transform((value, _raw)=>{
                if (!this.spec.coerce) return value;
                let parsed = value;
                if (typeof parsed === 'string') {
                    parsed = parsed.replace(/\s/g, '');
                    if (parsed === '') return NaN;
                    // don't use parseFloat to avoid positives on alpha-numeric strings
                    parsed = +parsed;
                }
                // null -> NaN isn't useful; treat all nulls as null and let it fail on
                // nullability check vs TypeErrors
                if (this.isType(parsed) || parsed === null) return parsed;
                return parseFloat(parsed);
            });
        });
    }
    min(min, message = number.min) {
        return this.test({
            message,
            name: 'min',
            exclusive: true,
            params: {
                min
            },
            skipAbsent: true,
            test (value) {
                return value >= this.resolve(min);
            }
        });
    }
    max(max, message = number.max) {
        return this.test({
            message,
            name: 'max',
            exclusive: true,
            params: {
                max
            },
            skipAbsent: true,
            test (value) {
                return value <= this.resolve(max);
            }
        });
    }
    lessThan(less, message = number.lessThan) {
        return this.test({
            message,
            name: 'max',
            exclusive: true,
            params: {
                less
            },
            skipAbsent: true,
            test (value) {
                return value < this.resolve(less);
            }
        });
    }
    moreThan(more, message = number.moreThan) {
        return this.test({
            message,
            name: 'min',
            exclusive: true,
            params: {
                more
            },
            skipAbsent: true,
            test (value) {
                return value > this.resolve(more);
            }
        });
    }
    positive(msg = number.positive) {
        return this.moreThan(0, msg);
    }
    negative(msg = number.negative) {
        return this.lessThan(0, msg);
    }
    integer(message = number.integer) {
        return this.test({
            name: 'integer',
            message,
            skipAbsent: true,
            test: (val)=>Number.isInteger(val)
        });
    }
    truncate() {
        return this.transform((value)=>!isAbsent(value) ? value | 0 : value);
    }
    round(method) {
        var _method;
        let avail = [
            'ceil',
            'floor',
            'round',
            'trunc'
        ];
        method = ((_method = method) == null ? void 0 : _method.toLowerCase()) || 'round';
        // this exists for symemtry with the new Math.trunc
        if (method === 'trunc') return this.truncate();
        if (avail.indexOf(method.toLowerCase()) === -1) throw new TypeError('Only valid options for round() are: ' + avail.join(', '));
        return this.transform((value)=>!isAbsent(value) ? Math[method](value) : value);
    }
}
create$5.prototype = NumberSchema.prototype;
//
// Number Interfaces
//
let invalidDate = new Date('');
let isDate = (obj)=>Object.prototype.toString.call(obj) === '[object Date]';
function create$4() {
    return new DateSchema();
}
class DateSchema extends Schema {
    constructor(){
        super({
            type: 'date',
            check (v) {
                return isDate(v) && !isNaN(v.getTime());
            }
        });
        this.withMutation(()=>{
            this.transform((value, _raw)=>{
                // null -> InvalidDate isn't useful; treat all nulls as null and let it fail on
                // nullability check vs TypeErrors
                if (!this.spec.coerce || this.isType(value) || value === null) return value;
                value = parseIsoDate(value);
                // 0 is a valid timestamp equivalent to 1970-01-01T00:00:00Z(unix epoch) or before.
                return !isNaN(value) ? new Date(value) : DateSchema.INVALID_DATE;
            });
        });
    }
    prepareParam(ref, name) {
        let param;
        if (!Reference.isRef(ref)) {
            let cast = this.cast(ref);
            if (!this._typeCheck(cast)) throw new TypeError(`\`${name}\` must be a Date or a value that can be \`cast()\` to a Date`);
            param = cast;
        } else {
            param = ref;
        }
        return param;
    }
    min(min, message = date.min) {
        let limit = this.prepareParam(min, 'min');
        return this.test({
            message,
            name: 'min',
            exclusive: true,
            params: {
                min
            },
            skipAbsent: true,
            test (value) {
                return value >= this.resolve(limit);
            }
        });
    }
    max(max, message = date.max) {
        let limit = this.prepareParam(max, 'max');
        return this.test({
            message,
            name: 'max',
            exclusive: true,
            params: {
                max
            },
            skipAbsent: true,
            test (value) {
                return value <= this.resolve(limit);
            }
        });
    }
}
DateSchema.INVALID_DATE = invalidDate;
create$4.prototype = DateSchema.prototype;
create$4.INVALID_DATE = invalidDate;
// @ts-expect-error
function sortFields(fields, excludedEdges = []) {
    let edges = [];
    let nodes = new Set();
    let excludes = new Set(excludedEdges.map(([a, b])=>`${a}-${b}`));
    function addNode(depPath, key) {
        let node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$property$2d$expr$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["split"])(depPath)[0];
        nodes.add(node);
        if (!excludes.has(`${key}-${node}`)) edges.push([
            key,
            node
        ]);
    }
    for (const key of Object.keys(fields)){
        let value = fields[key];
        nodes.add(key);
        if (Reference.isRef(value) && value.isSibling) addNode(value.path, key);
        else if (isSchema(value) && 'deps' in value) value.deps.forEach((path)=>addNode(path, key));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$toposort$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].array(Array.from(nodes), edges).reverse();
}
function findIndex(arr, err) {
    let idx = Infinity;
    arr.some((key, ii)=>{
        var _err$path;
        if ((_err$path = err.path) != null && _err$path.includes(key)) {
            idx = ii;
            return true;
        }
    });
    return idx;
}
function sortByKeyOrder(keys) {
    return (a, b)=>{
        return findIndex(keys, a) - findIndex(keys, b);
    };
}
const parseJson = (value, _, schema)=>{
    if (typeof value !== 'string') {
        return value;
    }
    let parsed = value;
    try {
        parsed = JSON.parse(value);
    } catch (err) {
    /* */ }
    return schema.isType(parsed) ? parsed : value;
};
// @ts-ignore
function deepPartial(schema) {
    if ('fields' in schema) {
        const partial = {};
        for (const [key, fieldSchema] of Object.entries(schema.fields)){
            partial[key] = deepPartial(fieldSchema);
        }
        return schema.setFields(partial);
    }
    if (schema.type === 'array') {
        const nextArray = schema.optional();
        if (nextArray.innerType) nextArray.innerType = deepPartial(nextArray.innerType);
        return nextArray;
    }
    if (schema.type === 'tuple') {
        return schema.optional().clone({
            types: schema.spec.types.map(deepPartial)
        });
    }
    if ('optional' in schema) {
        return schema.optional();
    }
    return schema;
}
const deepHas = (obj, p)=>{
    const path = [
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$property$2d$expr$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizePath"])(p)
    ];
    if (path.length === 1) return path[0] in obj;
    let last = path.pop();
    let parent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$property$2d$expr$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getter"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$property$2d$expr$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["join"])(path), true)(obj);
    return !!(parent && last in parent);
};
let isObject = (obj)=>Object.prototype.toString.call(obj) === '[object Object]';
function unknown(ctx, value) {
    let known = Object.keys(ctx.fields);
    return Object.keys(value).filter((key)=>known.indexOf(key) === -1);
}
const defaultSort = sortByKeyOrder([]);
function create$3(spec) {
    return new ObjectSchema(spec);
}
class ObjectSchema extends Schema {
    constructor(spec){
        super({
            type: 'object',
            check (value) {
                return isObject(value) || typeof value === 'function';
            }
        });
        this.fields = Object.create(null);
        this._sortErrors = defaultSort;
        this._nodes = [];
        this._excludedEdges = [];
        this.withMutation(()=>{
            if (spec) {
                this.shape(spec);
            }
        });
    }
    _cast(_value, options = {}) {
        var _options$stripUnknown;
        let value = super._cast(_value, options);
        //should ignore nulls here
        if (value === undefined) return this.getDefault(options);
        if (!this._typeCheck(value)) return value;
        let fields = this.fields;
        let strip = (_options$stripUnknown = options.stripUnknown) != null ? _options$stripUnknown : this.spec.noUnknown;
        let props = [].concat(this._nodes, Object.keys(value).filter((v)=>!this._nodes.includes(v)));
        let intermediateValue = {}; // is filled during the transform below
        let innerOptions = Object.assign({}, options, {
            parent: intermediateValue,
            __validating: options.__validating || false
        });
        let isChanged = false;
        for (const prop of props){
            let field = fields[prop];
            let exists = prop in value;
            let inputValue = value[prop];
            if (field) {
                let fieldValue;
                // safe to mutate since this is fired in sequence
                innerOptions.path = (options.path ? `${options.path}.` : '') + prop;
                field = field.resolve({
                    value: inputValue,
                    context: options.context,
                    parent: intermediateValue
                });
                let fieldSpec = field instanceof Schema ? field.spec : undefined;
                let strict = fieldSpec == null ? void 0 : fieldSpec.strict;
                if (fieldSpec != null && fieldSpec.strip) {
                    isChanged = isChanged || prop in value;
                    continue;
                }
                fieldValue = !options.__validating || !strict ? field.cast(inputValue, innerOptions) : inputValue;
                if (fieldValue !== undefined) {
                    intermediateValue[prop] = fieldValue;
                }
            } else if (exists && !strip) {
                intermediateValue[prop] = inputValue;
            }
            if (exists !== prop in intermediateValue || intermediateValue[prop] !== inputValue) {
                isChanged = true;
            }
        }
        return isChanged ? intermediateValue : value;
    }
    _validate(_value, options = {}, panic, next) {
        let { from = [], originalValue = _value, recursive = this.spec.recursive } = options;
        options.from = [
            {
                schema: this,
                value: originalValue
            },
            ...from
        ];
        // this flag is needed for handling `strict` correctly in the context of
        // validation vs just casting. e.g strict() on a field is only used when validating
        options.__validating = true;
        options.originalValue = originalValue;
        super._validate(_value, options, panic, (objectErrors, value)=>{
            if (!recursive || !isObject(value)) {
                next(objectErrors, value);
                return;
            }
            originalValue = originalValue || value;
            let tests = [];
            for (let key of this._nodes){
                let field = this.fields[key];
                if (!field || Reference.isRef(field)) {
                    continue;
                }
                tests.push(field.asNestedTest({
                    options,
                    key,
                    parent: value,
                    parentPath: options.path,
                    originalParent: originalValue
                }));
            }
            this.runTests({
                tests,
                value,
                originalValue,
                options
            }, panic, (fieldErrors)=>{
                next(fieldErrors.sort(this._sortErrors).concat(objectErrors), value);
            });
        });
    }
    clone(spec) {
        const next = super.clone(spec);
        next.fields = Object.assign({}, this.fields);
        next._nodes = this._nodes;
        next._excludedEdges = this._excludedEdges;
        next._sortErrors = this._sortErrors;
        return next;
    }
    concat(schema) {
        let next = super.concat(schema);
        let nextFields = next.fields;
        for (let [field, schemaOrRef] of Object.entries(this.fields)){
            const target = nextFields[field];
            nextFields[field] = target === undefined ? schemaOrRef : target;
        }
        return next.withMutation((s)=>// XXX: excludes here is wrong
            s.setFields(nextFields, [
                ...this._excludedEdges,
                ...schema._excludedEdges
            ]));
    }
    _getDefault(options) {
        if ('default' in this.spec) {
            return super._getDefault(options);
        }
        // if there is no default set invent one
        if (!this._nodes.length) {
            return undefined;
        }
        let dft = {};
        this._nodes.forEach((key)=>{
            var _innerOptions;
            const field = this.fields[key];
            let innerOptions = options;
            if ((_innerOptions = innerOptions) != null && _innerOptions.value) {
                innerOptions = Object.assign({}, innerOptions, {
                    parent: innerOptions.value,
                    value: innerOptions.value[key]
                });
            }
            dft[key] = field && 'getDefault' in field ? field.getDefault(innerOptions) : undefined;
        });
        return dft;
    }
    setFields(shape, excludedEdges) {
        let next = this.clone();
        next.fields = shape;
        next._nodes = sortFields(shape, excludedEdges);
        next._sortErrors = sortByKeyOrder(Object.keys(shape));
        // XXX: this carries over edges which may not be what you want
        if (excludedEdges) next._excludedEdges = excludedEdges;
        return next;
    }
    shape(additions, excludes = []) {
        return this.clone().withMutation((next)=>{
            let edges = next._excludedEdges;
            if (excludes.length) {
                if (!Array.isArray(excludes[0])) excludes = [
                    excludes
                ];
                edges = [
                    ...next._excludedEdges,
                    ...excludes
                ];
            }
            // XXX: excludes here is wrong
            return next.setFields(Object.assign(next.fields, additions), edges);
        });
    }
    partial() {
        const partial = {};
        for (const [key, schema] of Object.entries(this.fields)){
            partial[key] = 'optional' in schema && schema.optional instanceof Function ? schema.optional() : schema;
        }
        return this.setFields(partial);
    }
    deepPartial() {
        const next = deepPartial(this);
        return next;
    }
    pick(keys) {
        const picked = {};
        for (const key of keys){
            if (this.fields[key]) picked[key] = this.fields[key];
        }
        return this.setFields(picked, this._excludedEdges.filter(([a, b])=>keys.includes(a) && keys.includes(b)));
    }
    omit(keys) {
        const remaining = [];
        for (const key of Object.keys(this.fields)){
            if (keys.includes(key)) continue;
            remaining.push(key);
        }
        return this.pick(remaining);
    }
    from(from, to, alias) {
        let fromGetter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$property$2d$expr$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getter"])(from, true);
        return this.transform((obj)=>{
            if (!obj) return obj;
            let newObj = obj;
            if (deepHas(obj, from)) {
                newObj = Object.assign({}, obj);
                if (!alias) delete newObj[from];
                newObj[to] = fromGetter(obj);
            }
            return newObj;
        });
    }
    /** Parse an input JSON string to an object */ json() {
        return this.transform(parseJson);
    }
    /**
   * Similar to `noUnknown` but only validates that an object is the right shape without stripping the unknown keys
   */ exact(message) {
        return this.test({
            name: 'exact',
            exclusive: true,
            message: message || object.exact,
            test (value) {
                if (value == null) return true;
                const unknownKeys = unknown(this.schema, value);
                return unknownKeys.length === 0 || this.createError({
                    params: {
                        properties: unknownKeys.join(', ')
                    }
                });
            }
        });
    }
    stripUnknown() {
        return this.clone({
            noUnknown: true
        });
    }
    noUnknown(noAllow = true, message = object.noUnknown) {
        if (typeof noAllow !== 'boolean') {
            message = noAllow;
            noAllow = true;
        }
        let next = this.test({
            name: 'noUnknown',
            exclusive: true,
            message: message,
            test (value) {
                if (value == null) return true;
                const unknownKeys = unknown(this.schema, value);
                return !noAllow || unknownKeys.length === 0 || this.createError({
                    params: {
                        unknown: unknownKeys.join(', ')
                    }
                });
            }
        });
        next.spec.noUnknown = noAllow;
        return next;
    }
    unknown(allow = true, message = object.noUnknown) {
        return this.noUnknown(!allow, message);
    }
    transformKeys(fn) {
        return this.transform((obj)=>{
            if (!obj) return obj;
            const result = {};
            for (const key of Object.keys(obj))result[fn(key)] = obj[key];
            return result;
        });
    }
    camelCase() {
        return this.transformKeys(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tiny$2d$case$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["camelCase"]);
    }
    snakeCase() {
        return this.transformKeys(__TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tiny$2d$case$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["snakeCase"]);
    }
    constantCase() {
        return this.transformKeys((key)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$tiny$2d$case$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["snakeCase"])(key).toUpperCase());
    }
    describe(options) {
        const next = (options ? this.resolve(options) : this).clone();
        const base = super.describe(options);
        base.fields = {};
        for (const [key, value] of Object.entries(next.fields)){
            var _innerOptions2;
            let innerOptions = options;
            if ((_innerOptions2 = innerOptions) != null && _innerOptions2.value) {
                innerOptions = Object.assign({}, innerOptions, {
                    parent: innerOptions.value,
                    value: innerOptions.value[key]
                });
            }
            base.fields[key] = value.describe(innerOptions);
        }
        return base;
    }
}
create$3.prototype = ObjectSchema.prototype;
function create$2(type) {
    return new ArraySchema(type);
}
class ArraySchema extends Schema {
    constructor(type){
        super({
            type: 'array',
            spec: {
                types: type
            },
            check (v) {
                return Array.isArray(v);
            }
        });
        // `undefined` specifically means uninitialized, as opposed to "no subtype"
        this.innerType = void 0;
        this.innerType = type;
    }
    _cast(_value, _opts) {
        const value = super._cast(_value, _opts);
        // should ignore nulls here
        if (!this._typeCheck(value) || !this.innerType) {
            return value;
        }
        let isChanged = false;
        const castArray = value.map((v, idx)=>{
            const castElement = this.innerType.cast(v, Object.assign({}, _opts, {
                path: `${_opts.path || ''}[${idx}]`,
                parent: value,
                originalValue: v,
                value: v,
                index: idx
            }));
            if (castElement !== v) {
                isChanged = true;
            }
            return castElement;
        });
        return isChanged ? castArray : value;
    }
    _validate(_value, options = {}, panic, next) {
        var _options$recursive;
        // let sync = options.sync;
        // let path = options.path;
        let innerType = this.innerType;
        // let endEarly = options.abortEarly ?? this.spec.abortEarly;
        let recursive = (_options$recursive = options.recursive) != null ? _options$recursive : this.spec.recursive;
        options.originalValue != null ? options.originalValue : _value;
        super._validate(_value, options, panic, (arrayErrors, value)=>{
            var _options$originalValu2;
            if (!recursive || !innerType || !this._typeCheck(value)) {
                next(arrayErrors, value);
                return;
            }
            // #950 Ensure that sparse array empty slots are validated
            let tests = new Array(value.length);
            for(let index = 0; index < value.length; index++){
                var _options$originalValu;
                tests[index] = innerType.asNestedTest({
                    options,
                    index,
                    parent: value,
                    parentPath: options.path,
                    originalParent: (_options$originalValu = options.originalValue) != null ? _options$originalValu : _value
                });
            }
            this.runTests({
                value,
                tests,
                originalValue: (_options$originalValu2 = options.originalValue) != null ? _options$originalValu2 : _value,
                options
            }, panic, (innerTypeErrors)=>next(innerTypeErrors.concat(arrayErrors), value));
        });
    }
    clone(spec) {
        const next = super.clone(spec);
        // @ts-expect-error readonly
        next.innerType = this.innerType;
        return next;
    }
    /** Parse an input JSON string to an object */ json() {
        return this.transform(parseJson);
    }
    concat(schema) {
        let next = super.concat(schema);
        // @ts-expect-error readonly
        next.innerType = this.innerType;
        if (schema.innerType) // @ts-expect-error readonly
        next.innerType = next.innerType ? // @ts-expect-error Lazy doesn't have concat and will break
        next.innerType.concat(schema.innerType) : schema.innerType;
        return next;
    }
    of(schema) {
        // FIXME: this should return a new instance of array without the default to be
        let next = this.clone();
        if (!isSchema(schema)) throw new TypeError('`array.of()` sub-schema must be a valid yup schema not: ' + printValue(schema));
        // @ts-expect-error readonly
        next.innerType = schema;
        next.spec = Object.assign({}, next.spec, {
            types: schema
        });
        return next;
    }
    length(length, message = array.length) {
        return this.test({
            message,
            name: 'length',
            exclusive: true,
            params: {
                length
            },
            skipAbsent: true,
            test (value) {
                return value.length === this.resolve(length);
            }
        });
    }
    min(min, message) {
        message = message || array.min;
        return this.test({
            message,
            name: 'min',
            exclusive: true,
            params: {
                min
            },
            skipAbsent: true,
            // FIXME(ts): Array<typeof T>
            test (value) {
                return value.length >= this.resolve(min);
            }
        });
    }
    max(max, message) {
        message = message || array.max;
        return this.test({
            message,
            name: 'max',
            exclusive: true,
            params: {
                max
            },
            skipAbsent: true,
            test (value) {
                return value.length <= this.resolve(max);
            }
        });
    }
    ensure() {
        return this.default(()=>[]).transform((val, original)=>{
            // We don't want to return `null` for nullable schema
            if (this._typeCheck(val)) return val;
            return original == null ? [] : [].concat(original);
        });
    }
    compact(rejector) {
        let reject = !rejector ? (v)=>!!v : (v, i, a)=>!rejector(v, i, a);
        return this.transform((values)=>values != null ? values.filter(reject) : values);
    }
    describe(options) {
        const next = (options ? this.resolve(options) : this).clone();
        const base = super.describe(options);
        if (next.innerType) {
            var _innerOptions;
            let innerOptions = options;
            if ((_innerOptions = innerOptions) != null && _innerOptions.value) {
                innerOptions = Object.assign({}, innerOptions, {
                    parent: innerOptions.value,
                    value: innerOptions.value[0]
                });
            }
            base.innerType = next.innerType.describe(innerOptions);
        }
        return base;
    }
}
create$2.prototype = ArraySchema.prototype;
// @ts-ignore
function create$1(schemas) {
    return new TupleSchema(schemas);
}
class TupleSchema extends Schema {
    constructor(schemas){
        super({
            type: 'tuple',
            spec: {
                types: schemas
            },
            check (v) {
                const types = this.spec.types;
                return Array.isArray(v) && v.length === types.length;
            }
        });
        this.withMutation(()=>{
            this.typeError(tuple.notType);
        });
    }
    _cast(inputValue, options) {
        const { types } = this.spec;
        const value = super._cast(inputValue, options);
        if (!this._typeCheck(value)) {
            return value;
        }
        let isChanged = false;
        const castArray = types.map((type, idx)=>{
            const castElement = type.cast(value[idx], Object.assign({}, options, {
                path: `${options.path || ''}[${idx}]`,
                parent: value,
                originalValue: value[idx],
                value: value[idx],
                index: idx
            }));
            if (castElement !== value[idx]) isChanged = true;
            return castElement;
        });
        return isChanged ? castArray : value;
    }
    _validate(_value, options = {}, panic, next) {
        let itemTypes = this.spec.types;
        super._validate(_value, options, panic, (tupleErrors, value)=>{
            var _options$originalValu2;
            // intentionally not respecting recursive
            if (!this._typeCheck(value)) {
                next(tupleErrors, value);
                return;
            }
            let tests = [];
            for (let [index, itemSchema] of itemTypes.entries()){
                var _options$originalValu;
                tests[index] = itemSchema.asNestedTest({
                    options,
                    index,
                    parent: value,
                    parentPath: options.path,
                    originalParent: (_options$originalValu = options.originalValue) != null ? _options$originalValu : _value
                });
            }
            this.runTests({
                value,
                tests,
                originalValue: (_options$originalValu2 = options.originalValue) != null ? _options$originalValu2 : _value,
                options
            }, panic, (innerTypeErrors)=>next(innerTypeErrors.concat(tupleErrors), value));
        });
    }
    describe(options) {
        const next = (options ? this.resolve(options) : this).clone();
        const base = super.describe(options);
        base.innerType = next.spec.types.map((schema, index)=>{
            var _innerOptions;
            let innerOptions = options;
            if ((_innerOptions = innerOptions) != null && _innerOptions.value) {
                innerOptions = Object.assign({}, innerOptions, {
                    parent: innerOptions.value,
                    value: innerOptions.value[index]
                });
            }
            return schema.describe(innerOptions);
        });
        return base;
    }
}
create$1.prototype = TupleSchema.prototype;
function create(builder) {
    return new Lazy(builder);
}
function catchValidationError(fn) {
    try {
        return fn();
    } catch (err) {
        if (ValidationError.isError(err)) return Promise.reject(err);
        throw err;
    }
}
class Lazy {
    constructor(builder){
        this.type = 'lazy';
        this.__isYupSchema__ = true;
        this.spec = void 0;
        this._resolve = (value, options = {})=>{
            let schema = this.builder(value, options);
            if (!isSchema(schema)) throw new TypeError('lazy() functions must return a valid schema');
            if (this.spec.optional) schema = schema.optional();
            return schema.resolve(options);
        };
        this.builder = builder;
        this.spec = {
            meta: undefined,
            optional: false
        };
    }
    clone(spec) {
        const next = new Lazy(this.builder);
        next.spec = Object.assign({}, this.spec, spec);
        return next;
    }
    optionality(optional) {
        const next = this.clone({
            optional
        });
        return next;
    }
    optional() {
        return this.optionality(true);
    }
    resolve(options) {
        return this._resolve(options.value, options);
    }
    cast(value, options) {
        return this._resolve(value, options).cast(value, options);
    }
    asNestedTest(config) {
        let { key, index, parent, options } = config;
        let value = parent[index != null ? index : key];
        return this._resolve(value, Object.assign({}, options, {
            value,
            parent
        })).asNestedTest(config);
    }
    validate(value, options) {
        return catchValidationError(()=>this._resolve(value, options).validate(value, options));
    }
    validateSync(value, options) {
        return this._resolve(value, options).validateSync(value, options);
    }
    validateAt(path, value, options) {
        return catchValidationError(()=>this._resolve(value, options).validateAt(path, value, options));
    }
    validateSyncAt(path, value, options) {
        return this._resolve(value, options).validateSyncAt(path, value, options);
    }
    isValid(value, options) {
        try {
            return this._resolve(value, options).isValid(value, options);
        } catch (err) {
            if (ValidationError.isError(err)) {
                return Promise.resolve(false);
            }
            throw err;
        }
    }
    isValidSync(value, options) {
        return this._resolve(value, options).isValidSync(value, options);
    }
    describe(options) {
        return options ? this.resolve(options).describe(options) : {
            type: 'lazy',
            meta: this.spec.meta,
            label: undefined
        };
    }
    meta(...args) {
        if (args.length === 0) return this.spec.meta;
        let next = this.clone();
        next.spec.meta = Object.assign(next.spec.meta || {}, args[0]);
        return next;
    }
    get ['~standard']() {
        const schema = this;
        const standard = {
            version: 1,
            vendor: 'yup',
            async validate (value) {
                try {
                    const result = await schema.validate(value, {
                        abortEarly: false
                    });
                    return {
                        value: result
                    };
                } catch (err) {
                    if (ValidationError.isError(err)) {
                        return {
                            issues: issuesFromValidationError(err)
                        };
                    }
                    throw err;
                }
            }
        };
        return standard;
    }
}
function setLocale(custom) {
    Object.keys(custom).forEach((type)=>{
        // @ts-ignore
        Object.keys(custom[type]).forEach((method)=>{
            // @ts-ignore
            locale[type][method] = custom[type][method];
        });
    });
}
function addMethod(schemaType, name, fn) {
    if (!schemaType || !isSchema(schemaType.prototype)) throw new TypeError('You must provide a yup schema constructor function');
    if (typeof name !== 'string') throw new TypeError('A Method name must be provided');
    if (typeof fn !== 'function') throw new TypeError('Method function must be provided');
    schemaType.prototype[name] = fn;
}
;
}),
"[project]/Demo-2/node_modules/async-mutex/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "E_ALREADY_LOCKED",
    ()=>E_ALREADY_LOCKED,
    "E_CANCELED",
    ()=>E_CANCELED,
    "E_TIMEOUT",
    ()=>E_TIMEOUT,
    "Mutex",
    ()=>Mutex,
    "Semaphore",
    ()=>Semaphore,
    "tryAcquire",
    ()=>tryAcquire,
    "withTimeout",
    ()=>withTimeout
]);
const E_TIMEOUT = new Error('timeout while waiting for mutex to become available');
const E_ALREADY_LOCKED = new Error('mutex already locked');
const E_CANCELED = new Error('request for lock canceled');
var __awaiter$2 = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
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
};
class Semaphore {
    constructor(_value, _cancelError = E_CANCELED){
        this._value = _value;
        this._cancelError = _cancelError;
        this._queue = [];
        this._weightedWaiters = [];
    }
    acquire(weight = 1, priority = 0) {
        if (weight <= 0) throw new Error(`invalid weight ${weight}: must be positive`);
        return new Promise((resolve, reject)=>{
            const task = {
                resolve,
                reject,
                weight,
                priority
            };
            const i = findIndexFromEnd(this._queue, (other)=>priority <= other.priority);
            if (i === -1 && weight <= this._value) {
                // Needs immediate dispatch, skip the queue
                this._dispatchItem(task);
            } else {
                this._queue.splice(i + 1, 0, task);
            }
        });
    }
    runExclusive(callback_1) {
        return __awaiter$2(this, arguments, void 0, function*(callback, weight = 1, priority = 0) {
            const [value, release] = yield this.acquire(weight, priority);
            try {
                return yield callback(value);
            } finally{
                release();
            }
        });
    }
    waitForUnlock(weight = 1, priority = 0) {
        if (weight <= 0) throw new Error(`invalid weight ${weight}: must be positive`);
        if (this._couldLockImmediately(weight, priority)) {
            return Promise.resolve();
        } else {
            return new Promise((resolve)=>{
                if (!this._weightedWaiters[weight - 1]) this._weightedWaiters[weight - 1] = [];
                insertSorted(this._weightedWaiters[weight - 1], {
                    resolve,
                    priority
                });
            });
        }
    }
    isLocked() {
        return this._value <= 0;
    }
    getValue() {
        return this._value;
    }
    setValue(value) {
        this._value = value;
        this._dispatchQueue();
    }
    release(weight = 1) {
        if (weight <= 0) throw new Error(`invalid weight ${weight}: must be positive`);
        this._value += weight;
        this._dispatchQueue();
    }
    cancel() {
        this._queue.forEach((entry)=>entry.reject(this._cancelError));
        this._queue = [];
    }
    _dispatchQueue() {
        this._drainUnlockWaiters();
        while(this._queue.length > 0 && this._queue[0].weight <= this._value){
            this._dispatchItem(this._queue.shift());
            this._drainUnlockWaiters();
        }
    }
    _dispatchItem(item) {
        const previousValue = this._value;
        this._value -= item.weight;
        item.resolve([
            previousValue,
            this._newReleaser(item.weight)
        ]);
    }
    _newReleaser(weight) {
        let called = false;
        return ()=>{
            if (called) return;
            called = true;
            this.release(weight);
        };
    }
    _drainUnlockWaiters() {
        if (this._queue.length === 0) {
            for(let weight = this._value; weight > 0; weight--){
                const waiters = this._weightedWaiters[weight - 1];
                if (!waiters) continue;
                waiters.forEach((waiter)=>waiter.resolve());
                this._weightedWaiters[weight - 1] = [];
            }
        } else {
            const queuedPriority = this._queue[0].priority;
            for(let weight = this._value; weight > 0; weight--){
                const waiters = this._weightedWaiters[weight - 1];
                if (!waiters) continue;
                const i = waiters.findIndex((waiter)=>waiter.priority <= queuedPriority);
                (i === -1 ? waiters : waiters.splice(0, i)).forEach((waiter)=>waiter.resolve());
            }
        }
    }
    _couldLockImmediately(weight, priority) {
        return (this._queue.length === 0 || this._queue[0].priority < priority) && weight <= this._value;
    }
}
function insertSorted(a, v) {
    const i = findIndexFromEnd(a, (other)=>v.priority <= other.priority);
    a.splice(i + 1, 0, v);
}
function findIndexFromEnd(a, predicate) {
    for(let i = a.length - 1; i >= 0; i--){
        if (predicate(a[i])) {
            return i;
        }
    }
    return -1;
}
var __awaiter$1 = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
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
};
class Mutex {
    constructor(cancelError){
        this._semaphore = new Semaphore(1, cancelError);
    }
    acquire() {
        return __awaiter$1(this, arguments, void 0, function*(priority = 0) {
            const [, releaser] = yield this._semaphore.acquire(1, priority);
            return releaser;
        });
    }
    runExclusive(callback, priority = 0) {
        return this._semaphore.runExclusive(()=>callback(), 1, priority);
    }
    isLocked() {
        return this._semaphore.isLocked();
    }
    waitForUnlock(priority = 0) {
        return this._semaphore.waitForUnlock(1, priority);
    }
    release() {
        if (this._semaphore.isLocked()) this._semaphore.release();
    }
    cancel() {
        return this._semaphore.cancel();
    }
}
var __awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
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
};
function withTimeout(sync, timeout, timeoutError = E_TIMEOUT) {
    return {
        acquire: (weightOrPriority, priority)=>{
            let weight;
            if (isSemaphore(sync)) {
                weight = weightOrPriority;
            } else {
                weight = undefined;
                priority = weightOrPriority;
            }
            if (weight !== undefined && weight <= 0) {
                throw new Error(`invalid weight ${weight}: must be positive`);
            }
            return new Promise((resolve, reject)=>__awaiter(this, void 0, void 0, function*() {
                    let isTimeout = false;
                    const handle = setTimeout(()=>{
                        isTimeout = true;
                        reject(timeoutError);
                    }, timeout);
                    try {
                        const ticket = yield isSemaphore(sync) ? sync.acquire(weight, priority) : sync.acquire(priority);
                        if (isTimeout) {
                            const release = Array.isArray(ticket) ? ticket[1] : ticket;
                            release();
                        } else {
                            clearTimeout(handle);
                            resolve(ticket);
                        }
                    } catch (e) {
                        if (!isTimeout) {
                            clearTimeout(handle);
                            reject(e);
                        }
                    }
                }));
        },
        runExclusive (callback, weight, priority) {
            return __awaiter(this, void 0, void 0, function*() {
                let release = ()=>undefined;
                try {
                    const ticket = yield this.acquire(weight, priority);
                    if (Array.isArray(ticket)) {
                        release = ticket[1];
                        return yield callback(ticket[0]);
                    } else {
                        release = ticket;
                        return yield callback();
                    }
                } finally{
                    release();
                }
            });
        },
        release (weight) {
            sync.release(weight);
        },
        cancel () {
            return sync.cancel();
        },
        waitForUnlock: (weightOrPriority, priority)=>{
            let weight;
            if (isSemaphore(sync)) {
                weight = weightOrPriority;
            } else {
                weight = undefined;
                priority = weightOrPriority;
            }
            if (weight !== undefined && weight <= 0) {
                throw new Error(`invalid weight ${weight}: must be positive`);
            }
            return new Promise((resolve, reject)=>{
                const handle = setTimeout(()=>reject(timeoutError), timeout);
                (isSemaphore(sync) ? sync.waitForUnlock(weight, priority) : sync.waitForUnlock(priority)).then(()=>{
                    clearTimeout(handle);
                    resolve();
                });
            });
        },
        isLocked: ()=>sync.isLocked(),
        getValue: ()=>sync.getValue(),
        setValue: (value)=>sync.setValue(value)
    };
}
function isSemaphore(sync) {
    return sync.getValue !== undefined;
}
// eslint-disable-next-lisne @typescript-eslint/explicit-module-boundary-types
function tryAcquire(sync, alreadyAcquiredError = E_ALREADY_LOCKED) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return withTimeout(sync, 0, alreadyAcquiredError);
}
;
}),
"[project]/Demo-2/node_modules/@simplewebauthn/browser/dist/bundle/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* [@simplewebauthn/browser@11.0.0] */ __turbopack_context__.s([
    "WebAuthnAbortService",
    ()=>WebAuthnAbortService,
    "WebAuthnError",
    ()=>WebAuthnError,
    "base64URLStringToBuffer",
    ()=>base64URLStringToBuffer,
    "browserSupportsWebAuthn",
    ()=>browserSupportsWebAuthn,
    "browserSupportsWebAuthnAutofill",
    ()=>browserSupportsWebAuthnAutofill,
    "bufferToBase64URLString",
    ()=>bufferToBase64URLString,
    "platformAuthenticatorIsAvailable",
    ()=>platformAuthenticatorIsAvailable,
    "startAuthentication",
    ()=>startAuthentication,
    "startRegistration",
    ()=>startRegistration
]);
function bufferToBase64URLString(buffer) {
    const bytes = new Uint8Array(buffer);
    let str = '';
    for (const charCode of bytes){
        str += String.fromCharCode(charCode);
    }
    const base64String = btoa(str);
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function base64URLStringToBuffer(base64URLString) {
    const base64 = base64URLString.replace(/-/g, '+').replace(/_/g, '/');
    const padLength = (4 - base64.length % 4) % 4;
    const padded = base64.padEnd(base64.length + padLength, '=');
    const binary = atob(padded);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    for(let i = 0; i < binary.length; i++){
        bytes[i] = binary.charCodeAt(i);
    }
    return buffer;
}
function browserSupportsWebAuthn() {
    return window?.PublicKeyCredential !== undefined && typeof window.PublicKeyCredential === 'function';
}
function toPublicKeyCredentialDescriptor(descriptor) {
    const { id } = descriptor;
    return {
        ...descriptor,
        id: base64URLStringToBuffer(id),
        transports: descriptor.transports
    };
}
function isValidDomain(hostname) {
    return hostname === 'localhost' || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(hostname);
}
class WebAuthnError extends Error {
    constructor({ message, code, cause, name }){
        super(message, {
            cause
        });
        this.name = name ?? cause.name;
        this.code = code;
    }
}
function identifyRegistrationError({ error, options }) {
    const { publicKey } = options;
    if (!publicKey) {
        throw Error('options was missing required publicKey property');
    }
    if (error.name === 'AbortError') {
        if (options.signal instanceof AbortSignal) {
            return new WebAuthnError({
                message: 'Registration ceremony was sent an abort signal',
                code: 'ERROR_CEREMONY_ABORTED',
                cause: error
            });
        }
    } else if (error.name === 'ConstraintError') {
        if (publicKey.authenticatorSelection?.requireResidentKey === true) {
            return new WebAuthnError({
                message: 'Discoverable credentials were required but no available authenticator supported it',
                code: 'ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT',
                cause: error
            });
        } else if (options.mediation === 'conditional' && publicKey.authenticatorSelection?.userVerification === 'required') {
            return new WebAuthnError({
                message: 'User verification was required during automatic registration but it could not be performed',
                code: 'ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE',
                cause: error
            });
        } else if (publicKey.authenticatorSelection?.userVerification === 'required') {
            return new WebAuthnError({
                message: 'User verification was required but no available authenticator supported it',
                code: 'ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT',
                cause: error
            });
        }
    } else if (error.name === 'InvalidStateError') {
        return new WebAuthnError({
            message: 'The authenticator was previously registered',
            code: 'ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED',
            cause: error
        });
    } else if (error.name === 'NotAllowedError') {
        return new WebAuthnError({
            message: error.message,
            code: 'ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY',
            cause: error
        });
    } else if (error.name === 'NotSupportedError') {
        const validPubKeyCredParams = publicKey.pubKeyCredParams.filter((param)=>param.type === 'public-key');
        if (validPubKeyCredParams.length === 0) {
            return new WebAuthnError({
                message: 'No entry in pubKeyCredParams was of type "public-key"',
                code: 'ERROR_MALFORMED_PUBKEYCREDPARAMS',
                cause: error
            });
        }
        return new WebAuthnError({
            message: 'No available authenticator supported any of the specified pubKeyCredParams algorithms',
            code: 'ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG',
            cause: error
        });
    } else if (error.name === 'SecurityError') {
        const effectiveDomain = window.location.hostname;
        if (!isValidDomain(effectiveDomain)) {
            return new WebAuthnError({
                message: `${window.location.hostname} is an invalid domain`,
                code: 'ERROR_INVALID_DOMAIN',
                cause: error
            });
        } else if (publicKey.rp.id !== effectiveDomain) {
            return new WebAuthnError({
                message: `The RP ID "${publicKey.rp.id}" is invalid for this domain`,
                code: 'ERROR_INVALID_RP_ID',
                cause: error
            });
        }
    } else if (error.name === 'TypeError') {
        if (publicKey.user.id.byteLength < 1 || publicKey.user.id.byteLength > 64) {
            return new WebAuthnError({
                message: 'User ID was not between 1 and 64 characters',
                code: 'ERROR_INVALID_USER_ID_LENGTH',
                cause: error
            });
        }
    } else if (error.name === 'UnknownError') {
        return new WebAuthnError({
            message: 'The authenticator was unable to process the specified options, or could not create a new credential',
            code: 'ERROR_AUTHENTICATOR_GENERAL_ERROR',
            cause: error
        });
    }
    return error;
}
class BaseWebAuthnAbortService {
    createNewAbortSignal() {
        if (this.controller) {
            const abortError = new Error('Cancelling existing WebAuthn API call for new one');
            abortError.name = 'AbortError';
            this.controller.abort(abortError);
        }
        const newController = new AbortController();
        this.controller = newController;
        return newController.signal;
    }
    cancelCeremony() {
        if (this.controller) {
            const abortError = new Error('Manually cancelling existing WebAuthn API call');
            abortError.name = 'AbortError';
            this.controller.abort(abortError);
            this.controller = undefined;
        }
    }
}
const WebAuthnAbortService = new BaseWebAuthnAbortService();
const attachments = [
    'cross-platform',
    'platform'
];
function toAuthenticatorAttachment(attachment) {
    if (!attachment) {
        return;
    }
    if (attachments.indexOf(attachment) < 0) {
        return;
    }
    return attachment;
}
async function startRegistration(options) {
    const { optionsJSON, useAutoRegister = false } = options;
    if (!browserSupportsWebAuthn()) {
        throw new Error('WebAuthn is not supported in this browser');
    }
    const publicKey = {
        ...optionsJSON,
        challenge: base64URLStringToBuffer(optionsJSON.challenge),
        user: {
            ...optionsJSON.user,
            id: base64URLStringToBuffer(optionsJSON.user.id)
        },
        excludeCredentials: optionsJSON.excludeCredentials?.map(toPublicKeyCredentialDescriptor)
    };
    const createOptions = {};
    if (useAutoRegister) {
        createOptions.mediation = 'conditional';
    }
    createOptions.publicKey = publicKey;
    createOptions.signal = WebAuthnAbortService.createNewAbortSignal();
    let credential;
    try {
        credential = await navigator.credentials.create(createOptions);
    } catch (err) {
        throw identifyRegistrationError({
            error: err,
            options: createOptions
        });
    }
    if (!credential) {
        throw new Error('Registration was not completed');
    }
    const { id, rawId, response, type } = credential;
    let transports = undefined;
    if (typeof response.getTransports === 'function') {
        transports = response.getTransports();
    }
    let responsePublicKeyAlgorithm = undefined;
    if (typeof response.getPublicKeyAlgorithm === 'function') {
        try {
            responsePublicKeyAlgorithm = response.getPublicKeyAlgorithm();
        } catch (error) {
            warnOnBrokenImplementation('getPublicKeyAlgorithm()', error);
        }
    }
    let responsePublicKey = undefined;
    if (typeof response.getPublicKey === 'function') {
        try {
            const _publicKey = response.getPublicKey();
            if (_publicKey !== null) {
                responsePublicKey = bufferToBase64URLString(_publicKey);
            }
        } catch (error) {
            warnOnBrokenImplementation('getPublicKey()', error);
        }
    }
    let responseAuthenticatorData;
    if (typeof response.getAuthenticatorData === 'function') {
        try {
            responseAuthenticatorData = bufferToBase64URLString(response.getAuthenticatorData());
        } catch (error) {
            warnOnBrokenImplementation('getAuthenticatorData()', error);
        }
    }
    return {
        id,
        rawId: bufferToBase64URLString(rawId),
        response: {
            attestationObject: bufferToBase64URLString(response.attestationObject),
            clientDataJSON: bufferToBase64URLString(response.clientDataJSON),
            transports,
            publicKeyAlgorithm: responsePublicKeyAlgorithm,
            publicKey: responsePublicKey,
            authenticatorData: responseAuthenticatorData
        },
        type,
        clientExtensionResults: credential.getClientExtensionResults(),
        authenticatorAttachment: toAuthenticatorAttachment(credential.authenticatorAttachment)
    };
}
function warnOnBrokenImplementation(methodName, cause) {
    console.warn(`The browser extension that intercepted this WebAuthn API call incorrectly implemented ${methodName}. You should report this error to them.\n`, cause);
}
function browserSupportsWebAuthnAutofill() {
    if (!browserSupportsWebAuthn()) {
        return new Promise((resolve)=>resolve(false));
    }
    const globalPublicKeyCredential = window.PublicKeyCredential;
    if (globalPublicKeyCredential.isConditionalMediationAvailable === undefined) {
        return new Promise((resolve)=>resolve(false));
    }
    return globalPublicKeyCredential.isConditionalMediationAvailable();
}
function identifyAuthenticationError({ error, options }) {
    const { publicKey } = options;
    if (!publicKey) {
        throw Error('options was missing required publicKey property');
    }
    if (error.name === 'AbortError') {
        if (options.signal instanceof AbortSignal) {
            return new WebAuthnError({
                message: 'Authentication ceremony was sent an abort signal',
                code: 'ERROR_CEREMONY_ABORTED',
                cause: error
            });
        }
    } else if (error.name === 'NotAllowedError') {
        return new WebAuthnError({
            message: error.message,
            code: 'ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY',
            cause: error
        });
    } else if (error.name === 'SecurityError') {
        const effectiveDomain = window.location.hostname;
        if (!isValidDomain(effectiveDomain)) {
            return new WebAuthnError({
                message: `${window.location.hostname} is an invalid domain`,
                code: 'ERROR_INVALID_DOMAIN',
                cause: error
            });
        } else if (publicKey.rpId !== effectiveDomain) {
            return new WebAuthnError({
                message: `The RP ID "${publicKey.rpId}" is invalid for this domain`,
                code: 'ERROR_INVALID_RP_ID',
                cause: error
            });
        }
    } else if (error.name === 'UnknownError') {
        return new WebAuthnError({
            message: 'The authenticator was unable to process the specified options, or could not create a new assertion signature',
            code: 'ERROR_AUTHENTICATOR_GENERAL_ERROR',
            cause: error
        });
    }
    return error;
}
async function startAuthentication(options) {
    const { optionsJSON, useBrowserAutofill = false, verifyBrowserAutofillInput = true } = options;
    if (!browserSupportsWebAuthn()) {
        throw new Error('WebAuthn is not supported in this browser');
    }
    let allowCredentials;
    if (optionsJSON.allowCredentials?.length !== 0) {
        allowCredentials = optionsJSON.allowCredentials?.map(toPublicKeyCredentialDescriptor);
    }
    const publicKey = {
        ...optionsJSON,
        challenge: base64URLStringToBuffer(optionsJSON.challenge),
        allowCredentials
    };
    const getOptions = {};
    if (useBrowserAutofill) {
        if (!await browserSupportsWebAuthnAutofill()) {
            throw Error('Browser does not support WebAuthn autofill');
        }
        const eligibleInputs = document.querySelectorAll("input[autocomplete$='webauthn']");
        if (eligibleInputs.length < 1 && verifyBrowserAutofillInput) {
            throw Error('No <input> with "webauthn" as the only or last value in its `autocomplete` attribute was detected');
        }
        getOptions.mediation = 'conditional';
        publicKey.allowCredentials = [];
    }
    getOptions.publicKey = publicKey;
    getOptions.signal = WebAuthnAbortService.createNewAbortSignal();
    let credential;
    try {
        credential = await navigator.credentials.get(getOptions);
    } catch (err) {
        throw identifyAuthenticationError({
            error: err,
            options: getOptions
        });
    }
    if (!credential) {
        throw new Error('Authentication was not completed');
    }
    const { id, rawId, response, type } = credential;
    let userHandle = undefined;
    if (response.userHandle) {
        userHandle = bufferToBase64URLString(response.userHandle);
    }
    return {
        id,
        rawId: bufferToBase64URLString(rawId),
        response: {
            authenticatorData: bufferToBase64URLString(response.authenticatorData),
            clientDataJSON: bufferToBase64URLString(response.clientDataJSON),
            signature: bufferToBase64URLString(response.signature),
            userHandle
        },
        type,
        clientExtensionResults: credential.getClientExtensionResults(),
        authenticatorAttachment: toAuthenticatorAttachment(credential.authenticatorAttachment)
    };
}
function platformAuthenticatorIsAvailable() {
    if (!browserSupportsWebAuthn()) {
        return new Promise((resolve)=>resolve(false));
    }
    return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}
;
}),
"[project]/Demo-2/node_modules/cookie/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ /**
 * Module exports.
 * @public
 */ exports.parse = parse;
exports.serialize = serialize;
/**
 * Module variables.
 * @private
 */ var __toString = Object.prototype.toString;
/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */ var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */ function parse(str, options) {
    if (typeof str !== 'string') {
        throw new TypeError('argument str must be a string');
    }
    var obj = {};
    var opt = options || {};
    var dec = opt.decode || decode;
    var index = 0;
    while(index < str.length){
        var eqIdx = str.indexOf('=', index);
        // no more cookie pairs
        if (eqIdx === -1) {
            break;
        }
        var endIdx = str.indexOf(';', index);
        if (endIdx === -1) {
            endIdx = str.length;
        } else if (endIdx < eqIdx) {
            // backtrack on prior semicolon
            index = str.lastIndexOf(';', eqIdx - 1) + 1;
            continue;
        }
        var key = str.slice(index, eqIdx).trim();
        // only assign once
        if (undefined === obj[key]) {
            var val = str.slice(eqIdx + 1, endIdx).trim();
            // quoted values
            if (val.charCodeAt(0) === 0x22) {
                val = val.slice(1, -1);
            }
            obj[key] = tryDecode(val, dec);
        }
        index = endIdx + 1;
    }
    return obj;
}
/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */ function serialize(name, val, options) {
    var opt = options || {};
    var enc = opt.encode || encode;
    if (typeof enc !== 'function') {
        throw new TypeError('option encode is invalid');
    }
    if (!fieldContentRegExp.test(name)) {
        throw new TypeError('argument name is invalid');
    }
    var value = enc(val);
    if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError('argument val is invalid');
    }
    var str = name + '=' + value;
    if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
            throw new TypeError('option maxAge is invalid');
        }
        str += '; Max-Age=' + Math.floor(maxAge);
    }
    if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
            throw new TypeError('option domain is invalid');
        }
        str += '; Domain=' + opt.domain;
    }
    if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
            throw new TypeError('option path is invalid');
        }
        str += '; Path=' + opt.path;
    }
    if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
            throw new TypeError('option expires is invalid');
        }
        str += '; Expires=' + expires.toUTCString();
    }
    if (opt.httpOnly) {
        str += '; HttpOnly';
    }
    if (opt.secure) {
        str += '; Secure';
    }
    if (opt.partitioned) {
        str += '; Partitioned';
    }
    if (opt.priority) {
        var priority = typeof opt.priority === 'string' ? opt.priority.toLowerCase() : opt.priority;
        switch(priority){
            case 'low':
                str += '; Priority=Low';
                break;
            case 'medium':
                str += '; Priority=Medium';
                break;
            case 'high':
                str += '; Priority=High';
                break;
            default:
                throw new TypeError('option priority is invalid');
        }
    }
    if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch(sameSite){
            case true:
                str += '; SameSite=Strict';
                break;
            case 'lax':
                str += '; SameSite=Lax';
                break;
            case 'strict':
                str += '; SameSite=Strict';
                break;
            case 'none':
                str += '; SameSite=None';
                break;
            default:
                throw new TypeError('option sameSite is invalid');
        }
    }
    return str;
}
/**
 * URL-decode string value. Optimized to skip native call when no %.
 *
 * @param {string} str
 * @returns {string}
 */ function decode(str) {
    return str.indexOf('%') !== -1 ? decodeURIComponent(str) : str;
}
/**
 * URL-encode value.
 *
 * @param {string} val
 * @returns {string}
 */ function encode(val) {
    return encodeURIComponent(val);
}
/**
 * Determine if value is a Date.
 *
 * @param {*} val
 * @private
 */ function isDate(val) {
    return __toString.call(val) === '[object Date]' || val instanceof Date;
}
/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */ function tryDecode(str, decode) {
    try {
        return decode(str);
    } catch (e) {
        return str;
    }
}
}),
"[project]/Demo-2/node_modules/@stackframe/stack-sc/dist/next-static-analysis-workaround.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Next statically analyzes the imports and ensures that the `next/headers` module is never imported on a client bundle.
//
// We know what we're doing though. We ensure at runtime that we never use the module unless we're on the server, so the
// static analysis is wrong.
//
// Fortunately, as a hack, we can get around it by importing them using the `export from` syntax, which the static
// analyzer does not detect, but Webpack is fine with it.
//
// So, we can use the export syntax here, and then import them normally in the main file.
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/headers.js [app-route] (ecmascript)");
;
}),
"[project]/Demo-2/node_modules/@stackframe/stack-sc/dist/index.react-server.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cookies",
    ()=>cookies,
    "headers",
    ()=>headers,
    "isReactServer",
    ()=>isReactServer
]);
// In Next.js 15, the `next/headers` module returns async functions.
// Since we support both Next.js 14 and 15, we return a union of the two.
// TODO: Remove this once we drop support for Next.js 14, and replace it with `export { cookies, headers } from 'next/headers';`
// https://nextjs.org/blog/next-15#async-request-apis-breaking-change
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f40$stackframe$2f$stack$2d$sc$2f$dist$2f$next$2d$static$2d$analysis$2d$workaround$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/@stackframe/stack-sc/dist/next-static-analysis-workaround.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Demo-2/node_modules/next/headers.js [app-route] (ecmascript)");
const isReactServer = true;
;
const cookies = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"];
const headers = __TURBOPACK__imported__module__$5b$project$5d2f$Demo$2d$2$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["headers"];
}),
"[project]/Demo-2/node_modules/js-cookie/dist/js.cookie.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*! js-cookie v3.0.5 | MIT */ /* eslint-disable no-var */ __turbopack_context__.s([
    "default",
    ()=>api
]);
function assign(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i];
        for(var key in source){
            target[key] = source[key];
        }
    }
    return target;
}
/* eslint-enable no-var */ /* eslint-disable no-var */ var defaultConverter = {
    read: function(value) {
        if (value[0] === '"') {
            value = value.slice(1, -1);
        }
        return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    },
    write: function(value) {
        return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
    }
};
/* eslint-enable no-var */ /* eslint-disable no-var */ function init(converter, defaultAttributes) {
    function set(name, value, attributes) {
        if (typeof document === 'undefined') {
            return;
        }
        attributes = assign({}, defaultAttributes, attributes);
        if (typeof attributes.expires === 'number') {
            attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
        }
        if (attributes.expires) {
            attributes.expires = attributes.expires.toUTCString();
        }
        name = encodeURIComponent(name).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
        var stringifiedAttributes = '';
        for(var attributeName in attributes){
            if (!attributes[attributeName]) {
                continue;
            }
            stringifiedAttributes += '; ' + attributeName;
            if (attributes[attributeName] === true) {
                continue;
            }
            // Considers RFC 6265 section 5.2:
            // ...
            // 3.  If the remaining unparsed-attributes contains a %x3B (";")
            //     character:
            // Consume the characters of the unparsed-attributes up to,
            // not including, the first %x3B (";") character.
            // ...
            stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
        }
        return document.cookie = name + '=' + converter.write(value, name) + stringifiedAttributes;
    }
    function get(name) {
        if (typeof document === 'undefined' || arguments.length && !name) {
            return;
        }
        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all.
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var jar = {};
        for(var i = 0; i < cookies.length; i++){
            var parts = cookies[i].split('=');
            var value = parts.slice(1).join('=');
            try {
                var found = decodeURIComponent(parts[0]);
                jar[found] = converter.read(value, found);
                if (name === found) {
                    break;
                }
            } catch (e) {}
        }
        return name ? jar[name] : jar;
    }
    return Object.create({
        set,
        get,
        remove: function(name, attributes) {
            set(name, '', assign({}, attributes, {
                expires: -1
            }));
        },
        withAttributes: function(attributes) {
            return init(this.converter, assign({}, this.attributes, attributes));
        },
        withConverter: function(converter) {
            return init(assign({}, this.converter, converter), this.attributes);
        }
    }, {
        attributes: {
            value: Object.freeze(defaultAttributes)
        },
        converter: {
            value: Object.freeze(converter)
        }
    });
}
var api = init(defaultConverter, {
    path: '/'
});
;
}),
"[project]/Demo-2/node_modules/safe-buffer/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */ /* eslint-disable node/no-deprecated-api */ var buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
var Buffer = buffer.Buffer;
// alternative to using Object.keys for old browsers
function copyProps(src, dst) {
    for(var key in src){
        dst[key] = src[key];
    }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer;
} else {
    // Copy properties from require('buffer')
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
}
function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length);
}
SafeBuffer.prototype = Object.create(Buffer.prototype);
// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);
SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
        throw new TypeError('Argument must not be a number');
    }
    return Buffer(arg, encodingOrOffset, length);
};
SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    var buf = Buffer(size);
    if (fill !== undefined) {
        if (typeof encoding === 'string') {
            buf.fill(fill, encoding);
        } else {
            buf.fill(fill);
        }
    } else {
        buf.fill(0);
    }
    return buf;
};
SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return Buffer(size);
};
SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return buffer.SlowBuffer(size);
};
}),
"[project]/Demo-2/node_modules/jws/lib/data-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global module, process*/ var Buffer = __turbopack_context__.r("[project]/Demo-2/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
function DataStream(data) {
    this.buffer = null;
    this.writable = true;
    this.readable = true;
    // No input
    if (!data) {
        this.buffer = Buffer.alloc(0);
        return this;
    }
    // Stream
    if (typeof data.pipe === 'function') {
        this.buffer = Buffer.alloc(0);
        data.pipe(this);
        return this;
    }
    // Buffer or String
    // or Object (assumedly a passworded key)
    if (data.length || typeof data === 'object') {
        this.buffer = data;
        this.writable = false;
        process.nextTick((function() {
            this.emit('end', data);
            this.readable = false;
            this.emit('close');
        }).bind(this));
        return this;
    }
    throw new TypeError('Unexpected data type (' + typeof data + ')');
}
util.inherits(DataStream, Stream);
DataStream.prototype.write = function write(data) {
    this.buffer = Buffer.concat([
        this.buffer,
        Buffer.from(data)
    ]);
    this.emit('data', data);
};
DataStream.prototype.end = function end(data) {
    if (data) this.write(data);
    this.emit('end', data);
    this.emit('close');
    this.writable = false;
    this.readable = false;
};
module.exports = DataStream;
}),
"[project]/Demo-2/node_modules/jws/lib/tostring.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global module*/ var Buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").Buffer;
module.exports = function toString(obj) {
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'number' || Buffer.isBuffer(obj)) return obj.toString();
    return JSON.stringify(obj);
};
}),
"[project]/Demo-2/node_modules/jws/lib/sign-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global module*/ var Buffer = __turbopack_context__.r("[project]/Demo-2/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var DataStream = __turbopack_context__.r("[project]/Demo-2/node_modules/jws/lib/data-stream.js [app-route] (ecmascript)");
var jwa = __turbopack_context__.r("[project]/Demo-2/node_modules/jwa/index.js [app-route] (ecmascript)");
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
var toString = __turbopack_context__.r("[project]/Demo-2/node_modules/jws/lib/tostring.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
function base64url(string, encoding) {
    return Buffer.from(string, encoding).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function jwsSecuredInput(header, payload, encoding) {
    encoding = encoding || 'utf8';
    var encodedHeader = base64url(toString(header), 'binary');
    var encodedPayload = base64url(toString(payload), encoding);
    return util.format('%s.%s', encodedHeader, encodedPayload);
}
function jwsSign(opts) {
    var header = opts.header;
    var payload = opts.payload;
    var secretOrKey = opts.secret || opts.privateKey;
    var encoding = opts.encoding;
    var algo = jwa(header.alg);
    var securedInput = jwsSecuredInput(header, payload, encoding);
    var signature = algo.sign(securedInput, secretOrKey);
    return util.format('%s.%s', securedInput, signature);
}
function SignStream(opts) {
    var secret = opts.secret;
    secret = secret == null ? opts.privateKey : secret;
    secret = secret == null ? opts.key : secret;
    if (/^hs/i.test(opts.header.alg) === true && secret == null) {
        throw new TypeError('secret must be a string or buffer or a KeyObject');
    }
    var secretStream = new DataStream(secret);
    this.readable = true;
    this.header = opts.header;
    this.encoding = opts.encoding;
    this.secret = this.privateKey = this.key = secretStream;
    this.payload = new DataStream(opts.payload);
    this.secret.once('close', (function() {
        if (!this.payload.writable && this.readable) this.sign();
    }).bind(this));
    this.payload.once('close', (function() {
        if (!this.secret.writable && this.readable) this.sign();
    }).bind(this));
}
util.inherits(SignStream, Stream);
SignStream.prototype.sign = function sign() {
    try {
        var signature = jwsSign({
            header: this.header,
            payload: this.payload.buffer,
            secret: this.secret.buffer,
            encoding: this.encoding
        });
        this.emit('done', signature);
        this.emit('data', signature);
        this.emit('end');
        this.readable = false;
        return signature;
    } catch (e) {
        this.readable = false;
        this.emit('error', e);
        this.emit('close');
    }
};
SignStream.sign = jwsSign;
module.exports = SignStream;
}),
"[project]/Demo-2/node_modules/jws/lib/verify-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global module*/ var Buffer = __turbopack_context__.r("[project]/Demo-2/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var DataStream = __turbopack_context__.r("[project]/Demo-2/node_modules/jws/lib/data-stream.js [app-route] (ecmascript)");
var jwa = __turbopack_context__.r("[project]/Demo-2/node_modules/jwa/index.js [app-route] (ecmascript)");
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
var toString = __turbopack_context__.r("[project]/Demo-2/node_modules/jws/lib/tostring.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
function isObject(thing) {
    return Object.prototype.toString.call(thing) === '[object Object]';
}
function safeJsonParse(thing) {
    if (isObject(thing)) return thing;
    try {
        return JSON.parse(thing);
    } catch (e) {
        return undefined;
    }
}
function headerFromJWS(jwsSig) {
    var encodedHeader = jwsSig.split('.', 1)[0];
    return safeJsonParse(Buffer.from(encodedHeader, 'base64').toString('binary'));
}
function securedInputFromJWS(jwsSig) {
    return jwsSig.split('.', 2).join('.');
}
function signatureFromJWS(jwsSig) {
    return jwsSig.split('.')[2];
}
function payloadFromJWS(jwsSig, encoding) {
    encoding = encoding || 'utf8';
    var payload = jwsSig.split('.')[1];
    return Buffer.from(payload, 'base64').toString(encoding);
}
function isValidJws(string) {
    return JWS_REGEX.test(string) && !!headerFromJWS(string);
}
function jwsVerify(jwsSig, algorithm, secretOrKey) {
    if (!algorithm) {
        var err = new Error("Missing algorithm parameter for jws.verify");
        err.code = "MISSING_ALGORITHM";
        throw err;
    }
    jwsSig = toString(jwsSig);
    var signature = signatureFromJWS(jwsSig);
    var securedInput = securedInputFromJWS(jwsSig);
    var algo = jwa(algorithm);
    return algo.verify(securedInput, signature, secretOrKey);
}
function jwsDecode(jwsSig, opts) {
    opts = opts || {};
    jwsSig = toString(jwsSig);
    if (!isValidJws(jwsSig)) return null;
    var header = headerFromJWS(jwsSig);
    if (!header) return null;
    var payload = payloadFromJWS(jwsSig);
    if (header.typ === 'JWT' || opts.json) payload = JSON.parse(payload, opts.encoding);
    return {
        header: header,
        payload: payload,
        signature: signatureFromJWS(jwsSig)
    };
}
function VerifyStream(opts) {
    opts = opts || {};
    var secretOrKey = opts.secret;
    secretOrKey = secretOrKey == null ? opts.publicKey : secretOrKey;
    secretOrKey = secretOrKey == null ? opts.key : secretOrKey;
    if (/^hs/i.test(opts.algorithm) === true && secretOrKey == null) {
        throw new TypeError('secret must be a string or buffer or a KeyObject');
    }
    var secretStream = new DataStream(secretOrKey);
    this.readable = true;
    this.algorithm = opts.algorithm;
    this.encoding = opts.encoding;
    this.secret = this.publicKey = this.key = secretStream;
    this.signature = new DataStream(opts.signature);
    this.secret.once('close', (function() {
        if (!this.signature.writable && this.readable) this.verify();
    }).bind(this));
    this.signature.once('close', (function() {
        if (!this.secret.writable && this.readable) this.verify();
    }).bind(this));
}
util.inherits(VerifyStream, Stream);
VerifyStream.prototype.verify = function verify() {
    try {
        var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
        var obj = jwsDecode(this.signature.buffer, this.encoding);
        this.emit('done', valid, obj);
        this.emit('data', valid);
        this.emit('end');
        this.readable = false;
        return valid;
    } catch (e) {
        this.readable = false;
        this.emit('error', e);
        this.emit('close');
    }
};
VerifyStream.decode = jwsDecode;
VerifyStream.isValid = isValidJws;
VerifyStream.verify = jwsVerify;
module.exports = VerifyStream;
}),
"[project]/Demo-2/node_modules/jws/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global exports*/ var SignStream = __turbopack_context__.r("[project]/Demo-2/node_modules/jws/lib/sign-stream.js [app-route] (ecmascript)");
var VerifyStream = __turbopack_context__.r("[project]/Demo-2/node_modules/jws/lib/verify-stream.js [app-route] (ecmascript)");
var ALGORITHMS = [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512'
];
exports.ALGORITHMS = ALGORITHMS;
exports.sign = SignStream.sign;
exports.verify = VerifyStream.verify;
exports.decode = VerifyStream.decode;
exports.isValid = VerifyStream.isValid;
exports.createSign = function createSign(opts) {
    return new SignStream(opts);
};
exports.createVerify = function createVerify(opts) {
    return new VerifyStream(opts);
};
}),
"[project]/Demo-2/node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function getParamSize(keySize) {
    var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
    return result;
}
var paramBytesForAlg = {
    ES256: getParamSize(256),
    ES384: getParamSize(384),
    ES512: getParamSize(521)
};
function getParamBytesForAlg(alg) {
    var paramBytes = paramBytesForAlg[alg];
    if (paramBytes) {
        return paramBytes;
    }
    throw new Error('Unknown algorithm "' + alg + '"');
}
module.exports = getParamBytesForAlg;
}),
"[project]/Demo-2/node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var Buffer = __turbopack_context__.r("[project]/Demo-2/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var getParamBytesForAlg = __turbopack_context__.r("[project]/Demo-2/node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js [app-route] (ecmascript)");
var MAX_OCTET = 0x80, CLASS_UNIVERSAL = 0, PRIMITIVE_BIT = 0x20, TAG_SEQ = 0x10, TAG_INT = 0x02, ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6, ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
function base64Url(base64) {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function signatureAsBuffer(signature) {
    if (Buffer.isBuffer(signature)) {
        return signature;
    } else if ('string' === typeof signature) {
        return Buffer.from(signature, 'base64');
    }
    throw new TypeError('ECDSA signature must be a Base64 string or a Buffer');
}
function derToJose(signature, alg) {
    signature = signatureAsBuffer(signature);
    var paramBytes = getParamBytesForAlg(alg);
    // the DER encoded param should at most be the param size, plus a padding
    // zero, since due to being a signed integer
    var maxEncodedParamLength = paramBytes + 1;
    var inputLength = signature.length;
    var offset = 0;
    if (signature[offset++] !== ENCODED_TAG_SEQ) {
        throw new Error('Could not find expected "seq"');
    }
    var seqLength = signature[offset++];
    if (seqLength === (MAX_OCTET | 1)) {
        seqLength = signature[offset++];
    }
    if (inputLength - offset < seqLength) {
        throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
    }
    if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "r"');
    }
    var rLength = signature[offset++];
    if (inputLength - offset - 2 < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
    }
    if (maxEncodedParamLength < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    }
    var rOffset = offset;
    offset += rLength;
    if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "s"');
    }
    var sLength = signature[offset++];
    if (inputLength - offset !== sLength) {
        throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
    }
    if (maxEncodedParamLength < sLength) {
        throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    }
    var sOffset = offset;
    offset += sLength;
    if (offset !== inputLength) {
        throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
    }
    var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength;
    var dst = Buffer.allocUnsafe(rPadding + rLength + sPadding + sLength);
    for(offset = 0; offset < rPadding; ++offset){
        dst[offset] = 0;
    }
    signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);
    offset = paramBytes;
    for(var o = offset; offset < o + sPadding; ++offset){
        dst[offset] = 0;
    }
    signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);
    dst = dst.toString('base64');
    dst = base64Url(dst);
    return dst;
}
function countPadding(buf, start, stop) {
    var padding = 0;
    while(start + padding < stop && buf[start + padding] === 0){
        ++padding;
    }
    var needsSign = buf[start + padding] >= MAX_OCTET;
    if (needsSign) {
        --padding;
    }
    return padding;
}
function joseToDer(signature, alg) {
    signature = signatureAsBuffer(signature);
    var paramBytes = getParamBytesForAlg(alg);
    var signatureBytes = signature.length;
    if (signatureBytes !== paramBytes * 2) {
        throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
    }
    var rPadding = countPadding(signature, 0, paramBytes);
    var sPadding = countPadding(signature, paramBytes, signature.length);
    var rLength = paramBytes - rPadding;
    var sLength = paramBytes - sPadding;
    var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
    var shortLength = rsBytes < MAX_OCTET;
    var dst = Buffer.allocUnsafe((shortLength ? 2 : 3) + rsBytes);
    var offset = 0;
    dst[offset++] = ENCODED_TAG_SEQ;
    if (shortLength) {
        // Bit 8 has value "0"
        // bits 7-1 give the length.
        dst[offset++] = rsBytes;
    } else {
        // Bit 8 of first octet has value "1"
        // bits 7-1 give the number of additional length octets.
        dst[offset++] = MAX_OCTET | 1;
        // length, base 256
        dst[offset++] = rsBytes & 0xff;
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = rLength;
    if (rPadding < 0) {
        dst[offset++] = 0;
        offset += signature.copy(dst, offset, 0, paramBytes);
    } else {
        offset += signature.copy(dst, offset, rPadding, paramBytes);
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = sLength;
    if (sPadding < 0) {
        dst[offset++] = 0;
        signature.copy(dst, offset, paramBytes);
    } else {
        signature.copy(dst, offset, paramBytes + sPadding);
    }
    return dst;
}
module.exports = {
    derToJose: derToJose,
    joseToDer: joseToDer
};
}),
"[project]/Demo-2/node_modules/buffer-equal-constant-time/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*jshint node:true */ var Buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").Buffer; // browserify
var SlowBuffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").SlowBuffer;
module.exports = bufferEq;
function bufferEq(a, b) {
    // shortcutting on type is necessary for correctness
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        return false;
    }
    // buffer sizes should be well-known information, so despite this
    // shortcutting, it doesn't leak any information about the *contents* of the
    // buffers.
    if (a.length !== b.length) {
        return false;
    }
    var c = 0;
    for(var i = 0; i < a.length; i++){
        /*jshint bitwise:false */ c |= a[i] ^ b[i]; // XOR
    }
    return c === 0;
}
bufferEq.install = function() {
    Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
        return bufferEq(this, that);
    };
};
var origBufEqual = Buffer.prototype.equal;
var origSlowBufEqual = SlowBuffer.prototype.equal;
bufferEq.restore = function() {
    Buffer.prototype.equal = origBufEqual;
    SlowBuffer.prototype.equal = origSlowBufEqual;
};
}),
"[project]/Demo-2/node_modules/jwa/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Buffer = __turbopack_context__.r("[project]/Demo-2/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var crypto = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
var formatEcdsa = __turbopack_context__.r("[project]/Demo-2/node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".';
var MSG_INVALID_SECRET = 'secret must be a string or buffer';
var MSG_INVALID_VERIFIER_KEY = 'key must be a string or a buffer';
var MSG_INVALID_SIGNER_KEY = 'key must be a string, a buffer or an object';
var supportsKeyObjects = typeof crypto.createPublicKey === 'function';
if (supportsKeyObjects) {
    MSG_INVALID_VERIFIER_KEY += ' or a KeyObject';
    MSG_INVALID_SECRET += 'or a KeyObject';
}
function checkIsPublicKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === 'string') {
        return;
    }
    if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key !== 'object') {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.type !== 'string') {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.asymmetricKeyType !== 'string') {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.export !== 'function') {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
}
;
function checkIsPrivateKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === 'string') {
        return;
    }
    if (typeof key === 'object') {
        return;
    }
    throw typeError(MSG_INVALID_SIGNER_KEY);
}
;
function checkIsSecretKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === 'string') {
        return key;
    }
    if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (typeof key !== 'object') {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (key.type !== 'secret') {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (typeof key.export !== 'function') {
        throw typeError(MSG_INVALID_SECRET);
    }
}
function fromBase64(base64) {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function toBase64(base64url) {
    base64url = base64url.toString();
    var padding = 4 - base64url.length % 4;
    if (padding !== 4) {
        for(var i = 0; i < padding; ++i){
            base64url += '=';
        }
    }
    return base64url.replace(/\-/g, '+').replace(/_/g, '/');
}
function typeError(template) {
    var args = [].slice.call(arguments, 1);
    var errMsg = util.format.bind(util, template).apply(null, args);
    return new TypeError(errMsg);
}
function bufferOrString(obj) {
    return Buffer.isBuffer(obj) || typeof obj === 'string';
}
function normalizeInput(thing) {
    if (!bufferOrString(thing)) thing = JSON.stringify(thing);
    return thing;
}
function createHmacSigner(bits) {
    return function sign(thing, secret) {
        checkIsSecretKey(secret);
        thing = normalizeInput(thing);
        var hmac = crypto.createHmac('sha' + bits, secret);
        var sig = (hmac.update(thing), hmac.digest('base64'));
        return fromBase64(sig);
    };
}
var bufferEqual;
var timingSafeEqual = 'timingSafeEqual' in crypto ? function timingSafeEqual(a, b) {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    return crypto.timingSafeEqual(a, b);
} : function timingSafeEqual(a, b) {
    if (!bufferEqual) {
        bufferEqual = __turbopack_context__.r("[project]/Demo-2/node_modules/buffer-equal-constant-time/index.js [app-route] (ecmascript)");
    }
    return bufferEqual(a, b);
};
function createHmacVerifier(bits) {
    return function verify(thing, signature, secret) {
        var computedSig = createHmacSigner(bits)(thing, secret);
        return timingSafeEqual(Buffer.from(signature), Buffer.from(computedSig));
    };
}
function createKeySigner(bits) {
    return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        // Even though we are specifying "RSA" here, this works with ECDSA
        // keys as well.
        var signer = crypto.createSign('RSA-SHA' + bits);
        var sig = (signer.update(thing), signer.sign(privateKey, 'base64'));
        return fromBase64(sig);
    };
}
function createKeyVerifier(bits) {
    return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify('RSA-SHA' + bits);
        verifier.update(thing);
        return verifier.verify(publicKey, signature, 'base64');
    };
}
function createPSSKeySigner(bits) {
    return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto.createSign('RSA-SHA' + bits);
        var sig = (signer.update(thing), signer.sign({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, 'base64'));
        return fromBase64(sig);
    };
}
function createPSSKeyVerifier(bits) {
    return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify('RSA-SHA' + bits);
        verifier.update(thing);
        return verifier.verify({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, signature, 'base64');
    };
}
function createECDSASigner(bits) {
    var inner = createKeySigner(bits);
    return function sign() {
        var signature = inner.apply(null, arguments);
        signature = formatEcdsa.derToJose(signature, 'ES' + bits);
        return signature;
    };
}
function createECDSAVerifer(bits) {
    var inner = createKeyVerifier(bits);
    return function verify(thing, signature, publicKey) {
        signature = formatEcdsa.joseToDer(signature, 'ES' + bits).toString('base64');
        var result = inner(thing, signature, publicKey);
        return result;
    };
}
function createNoneSigner() {
    return function sign() {
        return '';
    };
}
function createNoneVerifier() {
    return function verify(thing, signature) {
        return signature === '';
    };
}
module.exports = function jwa(algorithm) {
    var signerFactories = {
        hs: createHmacSigner,
        rs: createKeySigner,
        ps: createPSSKeySigner,
        es: createECDSASigner,
        none: createNoneSigner
    };
    var verifierFactories = {
        hs: createHmacVerifier,
        rs: createKeyVerifier,
        ps: createPSSKeyVerifier,
        es: createECDSAVerifer,
        none: createNoneVerifier
    };
    var match = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
    if (!match) throw typeError(MSG_INVALID_ALGORITHM, algorithm);
    var algo = (match[1] || match[3]).toLowerCase();
    var bits = match[2];
    return {
        sign: signerFactories[algo](bits),
        verify: verifierFactories[algo](bits)
    };
};
}),
"[project]/Demo-2/node_modules/jsonwebtoken/decode.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var jws = __turbopack_context__.r("[project]/Demo-2/node_modules/jws/index.js [app-route] (ecmascript)");
module.exports = function(jwt, options) {
    options = options || {};
    var decoded = jws.decode(jwt, options);
    if (!decoded) {
        return null;
    }
    var payload = decoded.payload;
    //try parse the payload
    if (typeof payload === 'string') {
        try {
            var obj = JSON.parse(payload);
            if (obj !== null && typeof obj === 'object') {
                payload = obj;
            }
        } catch (e) {}
    }
    //return header if `complete` option is enabled.  header includes claims
    //such as `kid` and `alg` used to select the key within a JWKS needed to
    //verify the signature
    if (options.complete === true) {
        return {
            header: decoded.header,
            payload: payload,
            signature: decoded.signature
        };
    }
    return payload;
};
}),
"[project]/Demo-2/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var JsonWebTokenError = function(message, error) {
    Error.call(this, message);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
    this.name = 'JsonWebTokenError';
    this.message = message;
    if (error) this.inner = error;
};
JsonWebTokenError.prototype = Object.create(Error.prototype);
JsonWebTokenError.prototype.constructor = JsonWebTokenError;
module.exports = JsonWebTokenError;
}),
"[project]/Demo-2/node_modules/jsonwebtoken/lib/NotBeforeError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var JsonWebTokenError = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)");
var NotBeforeError = function(message, date) {
    JsonWebTokenError.call(this, message);
    this.name = 'NotBeforeError';
    this.date = date;
};
NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);
NotBeforeError.prototype.constructor = NotBeforeError;
module.exports = NotBeforeError;
}),
"[project]/Demo-2/node_modules/jsonwebtoken/lib/TokenExpiredError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var JsonWebTokenError = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)");
var TokenExpiredError = function(message, expiredAt) {
    JsonWebTokenError.call(this, message);
    this.name = 'TokenExpiredError';
    this.expiredAt = expiredAt;
};
TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);
TokenExpiredError.prototype.constructor = TokenExpiredError;
module.exports = TokenExpiredError;
}),
"[project]/Demo-2/node_modules/jsonwebtoken/lib/timespan.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var ms = __turbopack_context__.r("[project]/Demo-2/node_modules/ms/index.js [app-route] (ecmascript)");
module.exports = function(time, iat) {
    var timestamp = iat || Math.floor(Date.now() / 1000);
    if (typeof time === 'string') {
        var milliseconds = ms(time);
        if (typeof milliseconds === 'undefined') {
            return;
        }
        return Math.floor(timestamp + milliseconds / 1000);
    } else if (typeof time === 'number') {
        return timestamp + time;
    } else {
        return;
    }
};
}),
"[project]/Demo-2/node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const semver = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/index.js [app-route] (ecmascript)");
module.exports = semver.satisfies(process.version, '>=15.7.0');
}),
"[project]/Demo-2/node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const semver = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/index.js [app-route] (ecmascript)");
module.exports = semver.satisfies(process.version, '>=16.9.0');
}),
"[project]/Demo-2/node_modules/jsonwebtoken/lib/validateAsymmetricKey.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const ASYMMETRIC_KEY_DETAILS_SUPPORTED = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js [app-route] (ecmascript)");
const RSA_PSS_KEY_DETAILS_SUPPORTED = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js [app-route] (ecmascript)");
const allowedAlgorithmsForKeys = {
    'ec': [
        'ES256',
        'ES384',
        'ES512'
    ],
    'rsa': [
        'RS256',
        'PS256',
        'RS384',
        'PS384',
        'RS512',
        'PS512'
    ],
    'rsa-pss': [
        'PS256',
        'PS384',
        'PS512'
    ]
};
const allowedCurves = {
    ES256: 'prime256v1',
    ES384: 'secp384r1',
    ES512: 'secp521r1'
};
module.exports = function(algorithm, key) {
    if (!algorithm || !key) return;
    const keyType = key.asymmetricKeyType;
    if (!keyType) return;
    const allowedAlgorithms = allowedAlgorithmsForKeys[keyType];
    if (!allowedAlgorithms) {
        throw new Error(`Unknown key type "${keyType}".`);
    }
    if (!allowedAlgorithms.includes(algorithm)) {
        throw new Error(`"alg" parameter for "${keyType}" key type must be one of: ${allowedAlgorithms.join(', ')}.`);
    }
    /*
   * Ignore the next block from test coverage because it gets executed
   * conditionally depending on the Node version. Not ignoring it would
   * prevent us from reaching the target % of coverage for versions of
   * Node under 15.7.0.
   */ /* istanbul ignore next */ if (ASYMMETRIC_KEY_DETAILS_SUPPORTED) {
        switch(keyType){
            case 'ec':
                const keyCurve = key.asymmetricKeyDetails.namedCurve;
                const allowedCurve = allowedCurves[algorithm];
                if (keyCurve !== allowedCurve) {
                    throw new Error(`"alg" parameter "${algorithm}" requires curve "${allowedCurve}".`);
                }
                break;
            case 'rsa-pss':
                if (RSA_PSS_KEY_DETAILS_SUPPORTED) {
                    const length = parseInt(algorithm.slice(-3), 10);
                    const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = key.asymmetricKeyDetails;
                    if (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm) {
                        throw new Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${algorithm}.`);
                    }
                    if (saltLength !== undefined && saltLength > length >> 3) {
                        throw new Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${algorithm}.`);
                    }
                }
                break;
        }
    }
};
}),
"[project]/Demo-2/node_modules/jsonwebtoken/lib/psSupported.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var semver = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/index.js [app-route] (ecmascript)");
module.exports = semver.satisfies(process.version, '^6.12.0 || >=8.0.0');
}),
"[project]/Demo-2/node_modules/jsonwebtoken/verify.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const JsonWebTokenError = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)");
const NotBeforeError = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/NotBeforeError.js [app-route] (ecmascript)");
const TokenExpiredError = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/TokenExpiredError.js [app-route] (ecmascript)");
const decode = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/decode.js [app-route] (ecmascript)");
const timespan = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/timespan.js [app-route] (ecmascript)");
const validateAsymmetricKey = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/validateAsymmetricKey.js [app-route] (ecmascript)");
const PS_SUPPORTED = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/psSupported.js [app-route] (ecmascript)");
const jws = __turbopack_context__.r("[project]/Demo-2/node_modules/jws/index.js [app-route] (ecmascript)");
const { KeyObject, createSecretKey, createPublicKey } = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
const PUB_KEY_ALGS = [
    'RS256',
    'RS384',
    'RS512'
];
const EC_KEY_ALGS = [
    'ES256',
    'ES384',
    'ES512'
];
const RSA_KEY_ALGS = [
    'RS256',
    'RS384',
    'RS512'
];
const HS_ALGS = [
    'HS256',
    'HS384',
    'HS512'
];
if (PS_SUPPORTED) {
    PUB_KEY_ALGS.splice(PUB_KEY_ALGS.length, 0, 'PS256', 'PS384', 'PS512');
    RSA_KEY_ALGS.splice(RSA_KEY_ALGS.length, 0, 'PS256', 'PS384', 'PS512');
}
module.exports = function(jwtString, secretOrPublicKey, options, callback) {
    if (typeof options === 'function' && !callback) {
        callback = options;
        options = {};
    }
    if (!options) {
        options = {};
    }
    //clone this object since we are going to mutate it.
    options = Object.assign({}, options);
    let done;
    if (callback) {
        done = callback;
    } else {
        done = function(err, data) {
            if (err) throw err;
            return data;
        };
    }
    if (options.clockTimestamp && typeof options.clockTimestamp !== 'number') {
        return done(new JsonWebTokenError('clockTimestamp must be a number'));
    }
    if (options.nonce !== undefined && (typeof options.nonce !== 'string' || options.nonce.trim() === '')) {
        return done(new JsonWebTokenError('nonce must be a non-empty string'));
    }
    if (options.allowInvalidAsymmetricKeyTypes !== undefined && typeof options.allowInvalidAsymmetricKeyTypes !== 'boolean') {
        return done(new JsonWebTokenError('allowInvalidAsymmetricKeyTypes must be a boolean'));
    }
    const clockTimestamp = options.clockTimestamp || Math.floor(Date.now() / 1000);
    if (!jwtString) {
        return done(new JsonWebTokenError('jwt must be provided'));
    }
    if (typeof jwtString !== 'string') {
        return done(new JsonWebTokenError('jwt must be a string'));
    }
    const parts = jwtString.split('.');
    if (parts.length !== 3) {
        return done(new JsonWebTokenError('jwt malformed'));
    }
    let decodedToken;
    try {
        decodedToken = decode(jwtString, {
            complete: true
        });
    } catch (err) {
        return done(err);
    }
    if (!decodedToken) {
        return done(new JsonWebTokenError('invalid token'));
    }
    const header = decodedToken.header;
    let getSecret;
    if (typeof secretOrPublicKey === 'function') {
        if (!callback) {
            return done(new JsonWebTokenError('verify must be called asynchronous if secret or public key is provided as a callback'));
        }
        getSecret = secretOrPublicKey;
    } else {
        getSecret = function(header, secretCallback) {
            return secretCallback(null, secretOrPublicKey);
        };
    }
    return getSecret(header, function(err, secretOrPublicKey) {
        if (err) {
            return done(new JsonWebTokenError('error in secret or public key callback: ' + err.message));
        }
        const hasSignature = parts[2].trim() !== '';
        if (!hasSignature && secretOrPublicKey) {
            return done(new JsonWebTokenError('jwt signature is required'));
        }
        if (hasSignature && !secretOrPublicKey) {
            return done(new JsonWebTokenError('secret or public key must be provided'));
        }
        if (!hasSignature && !options.algorithms) {
            return done(new JsonWebTokenError('please specify "none" in "algorithms" to verify unsigned tokens'));
        }
        if (secretOrPublicKey != null && !(secretOrPublicKey instanceof KeyObject)) {
            try {
                secretOrPublicKey = createPublicKey(secretOrPublicKey);
            } catch (_) {
                try {
                    secretOrPublicKey = createSecretKey(typeof secretOrPublicKey === 'string' ? Buffer.from(secretOrPublicKey) : secretOrPublicKey);
                } catch (_) {
                    return done(new JsonWebTokenError('secretOrPublicKey is not valid key material'));
                }
            }
        }
        if (!options.algorithms) {
            if (secretOrPublicKey.type === 'secret') {
                options.algorithms = HS_ALGS;
            } else if ([
                'rsa',
                'rsa-pss'
            ].includes(secretOrPublicKey.asymmetricKeyType)) {
                options.algorithms = RSA_KEY_ALGS;
            } else if (secretOrPublicKey.asymmetricKeyType === 'ec') {
                options.algorithms = EC_KEY_ALGS;
            } else {
                options.algorithms = PUB_KEY_ALGS;
            }
        }
        if (options.algorithms.indexOf(decodedToken.header.alg) === -1) {
            return done(new JsonWebTokenError('invalid algorithm'));
        }
        if (header.alg.startsWith('HS') && secretOrPublicKey.type !== 'secret') {
            return done(new JsonWebTokenError(`secretOrPublicKey must be a symmetric key when using ${header.alg}`));
        } else if (/^(?:RS|PS|ES)/.test(header.alg) && secretOrPublicKey.type !== 'public') {
            return done(new JsonWebTokenError(`secretOrPublicKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInvalidAsymmetricKeyTypes) {
            try {
                validateAsymmetricKey(header.alg, secretOrPublicKey);
            } catch (e) {
                return done(e);
            }
        }
        let valid;
        try {
            valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPublicKey);
        } catch (e) {
            return done(e);
        }
        if (!valid) {
            return done(new JsonWebTokenError('invalid signature'));
        }
        const payload = decodedToken.payload;
        if (typeof payload.nbf !== 'undefined' && !options.ignoreNotBefore) {
            if (typeof payload.nbf !== 'number') {
                return done(new JsonWebTokenError('invalid nbf value'));
            }
            if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
                return done(new NotBeforeError('jwt not active', new Date(payload.nbf * 1000)));
            }
        }
        if (typeof payload.exp !== 'undefined' && !options.ignoreExpiration) {
            if (typeof payload.exp !== 'number') {
                return done(new JsonWebTokenError('invalid exp value'));
            }
            if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
                return done(new TokenExpiredError('jwt expired', new Date(payload.exp * 1000)));
            }
        }
        if (options.audience) {
            const audiences = Array.isArray(options.audience) ? options.audience : [
                options.audience
            ];
            const target = Array.isArray(payload.aud) ? payload.aud : [
                payload.aud
            ];
            const match = target.some(function(targetAudience) {
                return audiences.some(function(audience) {
                    return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience;
                });
            });
            if (!match) {
                return done(new JsonWebTokenError('jwt audience invalid. expected: ' + audiences.join(' or ')));
            }
        }
        if (options.issuer) {
            const invalid_issuer = typeof options.issuer === 'string' && payload.iss !== options.issuer || Array.isArray(options.issuer) && options.issuer.indexOf(payload.iss) === -1;
            if (invalid_issuer) {
                return done(new JsonWebTokenError('jwt issuer invalid. expected: ' + options.issuer));
            }
        }
        if (options.subject) {
            if (payload.sub !== options.subject) {
                return done(new JsonWebTokenError('jwt subject invalid. expected: ' + options.subject));
            }
        }
        if (options.jwtid) {
            if (payload.jti !== options.jwtid) {
                return done(new JsonWebTokenError('jwt jwtid invalid. expected: ' + options.jwtid));
            }
        }
        if (options.nonce) {
            if (payload.nonce !== options.nonce) {
                return done(new JsonWebTokenError('jwt nonce invalid. expected: ' + options.nonce));
            }
        }
        if (options.maxAge) {
            if (typeof payload.iat !== 'number') {
                return done(new JsonWebTokenError('iat required when maxAge is specified'));
            }
            const maxAgeTimestamp = timespan(options.maxAge, payload.iat);
            if (typeof maxAgeTimestamp === 'undefined') {
                return done(new JsonWebTokenError('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
            }
            if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
                return done(new TokenExpiredError('maxAge exceeded', new Date(maxAgeTimestamp * 1000)));
            }
        }
        if (options.complete === true) {
            const signature = decodedToken.signature;
            return done(null, {
                header: header,
                payload: payload,
                signature: signature
            });
        }
        return done(null, payload);
    });
};
}),
"[project]/Demo-2/node_modules/jsonwebtoken/sign.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const timespan = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/timespan.js [app-route] (ecmascript)");
const PS_SUPPORTED = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/psSupported.js [app-route] (ecmascript)");
const validateAsymmetricKey = __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/validateAsymmetricKey.js [app-route] (ecmascript)");
const jws = __turbopack_context__.r("[project]/Demo-2/node_modules/jws/index.js [app-route] (ecmascript)");
const includes = __turbopack_context__.r("[project]/Demo-2/node_modules/lodash.includes/index.js [app-route] (ecmascript)");
const isBoolean = __turbopack_context__.r("[project]/Demo-2/node_modules/lodash.isboolean/index.js [app-route] (ecmascript)");
const isInteger = __turbopack_context__.r("[project]/Demo-2/node_modules/lodash.isinteger/index.js [app-route] (ecmascript)");
const isNumber = __turbopack_context__.r("[project]/Demo-2/node_modules/lodash.isnumber/index.js [app-route] (ecmascript)");
const isPlainObject = __turbopack_context__.r("[project]/Demo-2/node_modules/lodash.isplainobject/index.js [app-route] (ecmascript)");
const isString = __turbopack_context__.r("[project]/Demo-2/node_modules/lodash.isstring/index.js [app-route] (ecmascript)");
const once = __turbopack_context__.r("[project]/Demo-2/node_modules/lodash.once/index.js [app-route] (ecmascript)");
const { KeyObject, createSecretKey, createPrivateKey } = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
const SUPPORTED_ALGS = [
    'RS256',
    'RS384',
    'RS512',
    'ES256',
    'ES384',
    'ES512',
    'HS256',
    'HS384',
    'HS512',
    'none'
];
if (PS_SUPPORTED) {
    SUPPORTED_ALGS.splice(3, 0, 'PS256', 'PS384', 'PS512');
}
const sign_options_schema = {
    expiresIn: {
        isValid: function(value) {
            return isInteger(value) || isString(value) && value;
        },
        message: '"expiresIn" should be a number of seconds or string representing a timespan'
    },
    notBefore: {
        isValid: function(value) {
            return isInteger(value) || isString(value) && value;
        },
        message: '"notBefore" should be a number of seconds or string representing a timespan'
    },
    audience: {
        isValid: function(value) {
            return isString(value) || Array.isArray(value);
        },
        message: '"audience" must be a string or array'
    },
    algorithm: {
        isValid: includes.bind(null, SUPPORTED_ALGS),
        message: '"algorithm" must be a valid string enum value'
    },
    header: {
        isValid: isPlainObject,
        message: '"header" must be an object'
    },
    encoding: {
        isValid: isString,
        message: '"encoding" must be a string'
    },
    issuer: {
        isValid: isString,
        message: '"issuer" must be a string'
    },
    subject: {
        isValid: isString,
        message: '"subject" must be a string'
    },
    jwtid: {
        isValid: isString,
        message: '"jwtid" must be a string'
    },
    noTimestamp: {
        isValid: isBoolean,
        message: '"noTimestamp" must be a boolean'
    },
    keyid: {
        isValid: isString,
        message: '"keyid" must be a string'
    },
    mutatePayload: {
        isValid: isBoolean,
        message: '"mutatePayload" must be a boolean'
    },
    allowInsecureKeySizes: {
        isValid: isBoolean,
        message: '"allowInsecureKeySizes" must be a boolean'
    },
    allowInvalidAsymmetricKeyTypes: {
        isValid: isBoolean,
        message: '"allowInvalidAsymmetricKeyTypes" must be a boolean'
    }
};
const registered_claims_schema = {
    iat: {
        isValid: isNumber,
        message: '"iat" should be a number of seconds'
    },
    exp: {
        isValid: isNumber,
        message: '"exp" should be a number of seconds'
    },
    nbf: {
        isValid: isNumber,
        message: '"nbf" should be a number of seconds'
    }
};
function validate(schema, allowUnknown, object, parameterName) {
    if (!isPlainObject(object)) {
        throw new Error('Expected "' + parameterName + '" to be a plain object.');
    }
    Object.keys(object).forEach(function(key) {
        const validator = schema[key];
        if (!validator) {
            if (!allowUnknown) {
                throw new Error('"' + key + '" is not allowed in "' + parameterName + '"');
            }
            return;
        }
        if (!validator.isValid(object[key])) {
            throw new Error(validator.message);
        }
    });
}
function validateOptions(options) {
    return validate(sign_options_schema, false, options, 'options');
}
function validatePayload(payload) {
    return validate(registered_claims_schema, true, payload, 'payload');
}
const options_to_payload = {
    'audience': 'aud',
    'issuer': 'iss',
    'subject': 'sub',
    'jwtid': 'jti'
};
const options_for_objects = [
    'expiresIn',
    'notBefore',
    'noTimestamp',
    'audience',
    'issuer',
    'subject',
    'jwtid'
];
module.exports = function(payload, secretOrPrivateKey, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    } else {
        options = options || {};
    }
    const isObjectPayload = typeof payload === 'object' && !Buffer.isBuffer(payload);
    const header = Object.assign({
        alg: options.algorithm || 'HS256',
        typ: isObjectPayload ? 'JWT' : undefined,
        kid: options.keyid
    }, options.header);
    function failure(err) {
        if (callback) {
            return callback(err);
        }
        throw err;
    }
    if (!secretOrPrivateKey && options.algorithm !== 'none') {
        return failure(new Error('secretOrPrivateKey must have a value'));
    }
    if (secretOrPrivateKey != null && !(secretOrPrivateKey instanceof KeyObject)) {
        try {
            secretOrPrivateKey = createPrivateKey(secretOrPrivateKey);
        } catch (_) {
            try {
                secretOrPrivateKey = createSecretKey(typeof secretOrPrivateKey === 'string' ? Buffer.from(secretOrPrivateKey) : secretOrPrivateKey);
            } catch (_) {
                return failure(new Error('secretOrPrivateKey is not valid key material'));
            }
        }
    }
    if (header.alg.startsWith('HS') && secretOrPrivateKey.type !== 'secret') {
        return failure(new Error(`secretOrPrivateKey must be a symmetric key when using ${header.alg}`));
    } else if (/^(?:RS|PS|ES)/.test(header.alg)) {
        if (secretOrPrivateKey.type !== 'private') {
            return failure(new Error(`secretOrPrivateKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInsecureKeySizes && !header.alg.startsWith('ES') && secretOrPrivateKey.asymmetricKeyDetails !== undefined && //KeyObject.asymmetricKeyDetails is supported in Node 15+
        secretOrPrivateKey.asymmetricKeyDetails.modulusLength < 2048) {
            return failure(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
        }
    }
    if (typeof payload === 'undefined') {
        return failure(new Error('payload is required'));
    } else if (isObjectPayload) {
        try {
            validatePayload(payload);
        } catch (error) {
            return failure(error);
        }
        if (!options.mutatePayload) {
            payload = Object.assign({}, payload);
        }
    } else {
        const invalid_options = options_for_objects.filter(function(opt) {
            return typeof options[opt] !== 'undefined';
        });
        if (invalid_options.length > 0) {
            return failure(new Error('invalid ' + invalid_options.join(',') + ' option for ' + typeof payload + ' payload'));
        }
    }
    if (typeof payload.exp !== 'undefined' && typeof options.expiresIn !== 'undefined') {
        return failure(new Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
    }
    if (typeof payload.nbf !== 'undefined' && typeof options.notBefore !== 'undefined') {
        return failure(new Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
    }
    try {
        validateOptions(options);
    } catch (error) {
        return failure(error);
    }
    if (!options.allowInvalidAsymmetricKeyTypes) {
        try {
            validateAsymmetricKey(header.alg, secretOrPrivateKey);
        } catch (error) {
            return failure(error);
        }
    }
    const timestamp = payload.iat || Math.floor(Date.now() / 1000);
    if (options.noTimestamp) {
        delete payload.iat;
    } else if (isObjectPayload) {
        payload.iat = timestamp;
    }
    if (typeof options.notBefore !== 'undefined') {
        try {
            payload.nbf = timespan(options.notBefore, timestamp);
        } catch (err) {
            return failure(err);
        }
        if (typeof payload.nbf === 'undefined') {
            return failure(new Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
    }
    if (typeof options.expiresIn !== 'undefined' && typeof payload === 'object') {
        try {
            payload.exp = timespan(options.expiresIn, timestamp);
        } catch (err) {
            return failure(err);
        }
        if (typeof payload.exp === 'undefined') {
            return failure(new Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
    }
    Object.keys(options_to_payload).forEach(function(key) {
        const claim = options_to_payload[key];
        if (typeof options[key] !== 'undefined') {
            if (typeof payload[claim] !== 'undefined') {
                return failure(new Error('Bad "options.' + key + '" option. The payload already has an "' + claim + '" property.'));
            }
            payload[claim] = options[key];
        }
    });
    const encoding = options.encoding || 'utf8';
    if (typeof callback === 'function') {
        callback = callback && once(callback);
        jws.createSign({
            header: header,
            privateKey: secretOrPrivateKey,
            payload: payload,
            encoding: encoding
        }).once('error', callback).once('done', function(signature) {
            // TODO: Remove in favor of the modulus length check before signing once node 15+ is the minimum supported version
            if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
                return callback(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
            }
            callback(null, signature);
        });
    } else {
        let signature = jws.sign({
            header: header,
            payload: payload,
            secret: secretOrPrivateKey,
            encoding: encoding
        });
        // TODO: Remove in favor of the modulus length check before signing once node 15+ is the minimum supported version
        if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
            throw new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`);
        }
        return signature;
    }
};
}),
"[project]/Demo-2/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    decode: __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/decode.js [app-route] (ecmascript)"),
    verify: __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/verify.js [app-route] (ecmascript)"),
    sign: __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/sign.js [app-route] (ecmascript)"),
    JsonWebTokenError: __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)"),
    NotBeforeError: __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/NotBeforeError.js [app-route] (ecmascript)"),
    TokenExpiredError: __turbopack_context__.r("[project]/Demo-2/node_modules/jsonwebtoken/lib/TokenExpiredError.js [app-route] (ecmascript)")
};
}),
"[project]/Demo-2/node_modules/ms/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Helpers.
 */ var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */ module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === 'string' && val.length > 0) {
        return parse(val);
    } else if (type === 'number' && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};
/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */ function parse(str) {
    str = String(str);
    if (str.length > 100) {
        return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
        return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch(type){
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return n * y;
        case 'weeks':
        case 'week':
        case 'w':
            return n * w;
        case 'days':
        case 'day':
        case 'd':
            return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return n;
        default:
            return undefined;
    }
}
/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return Math.round(ms / d) + 'd';
    }
    if (msAbs >= h) {
        return Math.round(ms / h) + 'h';
    }
    if (msAbs >= m) {
        return Math.round(ms / m) + 'm';
    }
    if (msAbs >= s) {
        return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
}
/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day');
    }
    if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour');
    }
    if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute');
    }
    if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second');
    }
    return ms + ' ms';
}
/**
 * Pluralization helper.
 */ function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}
}),
"[project]/Demo-2/node_modules/semver/internal/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0';
const MAX_LENGTH = 256;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */ 9007199254740991;
// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16;
// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
const RELEASE_TYPES = [
    'major',
    'premajor',
    'minor',
    'preminor',
    'patch',
    'prepatch',
    'prerelease'
];
module.exports = {
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 0b001,
    FLAG_LOOSE: 0b010
};
}),
"[project]/Demo-2/node_modules/semver/internal/debug.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const debug = typeof process === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args)=>console.error('SEMVER', ...args) : ()=>{};
module.exports = debug;
}),
"[project]/Demo-2/node_modules/semver/internal/re.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
exports = module.exports = {};
// The actual regexps go on exports.re
const re = exports.re = [];
const safeRe = exports.safeRe = [];
const src = exports.src = [];
const safeSrc = exports.safeSrc = [];
const t = exports.t = {};
let R = 0;
const LETTERDASHNUMBER = '[a-zA-Z0-9-]';
// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
    [
        '\\s',
        1
    ],
    [
        '\\d',
        MAX_LENGTH
    ],
    [
        LETTERDASHNUMBER,
        MAX_SAFE_BUILD_LENGTH
    ]
];
const makeSafeRegex = (value)=>{
    for (const [token, max] of safeRegexReplacements){
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
    }
    return value;
};
const createToken = (name, value, isGlobal)=>{
    const safe = makeSafeRegex(value);
    const index = R++;
    debug(name, index, value);
    t[name] = index;
    src[index] = value;
    safeSrc[index] = safe;
    re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
    safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined);
};
// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.
// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.
createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
createToken('NUMERICIDENTIFIERLOOSE', '\\d+');
// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.
createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
// ## Main Version
// Three dot-separated numeric identifiers.
createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})`);
createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})`);
// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.
// Non-numeric identifiers include numeric identifiers but can be longer.
// Therefore non-numeric identifiers must go first.
createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.
createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.
createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`);
// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.
createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.
// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.
createToken('FULLPLAIN', `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
createToken('FULL', `^${src[t.FULLPLAIN]}$`);
// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);
createToken('GTLT', '((?:<|>)?=?)');
// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifier, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?` + `)?)?`);
createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?` + `)?)?`);
createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCEPLAIN', `${'(^|[^\\d])' + '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
createToken('COERCE', `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
createToken('COERCEFULL', src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?` + `(?:${src[t.BUILD]})?` + `(?:$|[^\\d])`);
createToken('COERCERTL', src[t.COERCE], true);
createToken('COERCERTLFULL', src[t.COERCEFULL], true);
// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)');
createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
exports.tildeTrimReplace = '$1~';
createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)');
createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
exports.caretTrimReplace = '$1^';
createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
exports.comparatorTrimReplace = '$1$2$3';
// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAIN]})` + `\\s*$`);
createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAINLOOSE]})` + `\\s*$`);
// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*');
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$');
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$');
}),
"[project]/Demo-2/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// parse out just the options we care about
const looseOption = Object.freeze({
    loose: true
});
const emptyOpts = Object.freeze({});
const parseOptions = (options)=>{
    if (!options) {
        return emptyOpts;
    }
    if (typeof options !== 'object') {
        return looseOption;
    }
    return options;
};
module.exports = parseOptions;
}),
"[project]/Demo-2/node_modules/semver/internal/identifiers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const numeric = /^[0-9]+$/;
const compareIdentifiers = (a, b)=>{
    if (typeof a === 'number' && typeof b === 'number') {
        return a === b ? 0 : a < b ? -1 : 1;
    }
    const anum = numeric.test(a);
    const bnum = numeric.test(b);
    if (anum && bnum) {
        a = +a;
        b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};
const rcompareIdentifiers = (a, b)=>compareIdentifiers(b, a);
module.exports = {
    compareIdentifiers,
    rcompareIdentifiers
};
}),
"[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const debug = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const { safeRe: re, t } = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const parseOptions = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)");
const { compareIdentifiers } = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/identifiers.js [app-route] (ecmascript)");
const isPrereleaseIdentifier = (prerelease, identifier)=>{
    const identifiers = identifier.split('.');
    if (identifiers.length > prerelease.length) {
        return false;
    }
    for(let i = 0; i < identifiers.length; i++){
        if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) {
            return false;
        }
    }
    return true;
};
class SemVer {
    constructor(version, options){
        options = parseOptions(options);
        if (version instanceof SemVer) {
            if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
                return version;
            } else {
                version = version.version;
            }
        } else if (typeof version !== 'string') {
            throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
            throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
        }
        debug('SemVer', version, options);
        this.options = options;
        this.loose = !!options.loose;
        // this isn't actually relevant for versions, but keep it so that we
        // don't run into trouble passing this.options around.
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
            throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        // these are actually numbers
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
            throw new TypeError('Invalid major version');
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
            throw new TypeError('Invalid minor version');
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
            throw new TypeError('Invalid patch version');
        }
        // numberify any prerelease numeric ids
        if (!m[4]) {
            this.prerelease = [];
        } else {
            this.prerelease = m[4].split('.').map((id)=>{
                if (/^[0-9]+$/.test(id)) {
                    const num = +id;
                    if (num >= 0 && num < MAX_SAFE_INTEGER) {
                        return num;
                    }
                }
                return id;
            });
        }
        this.build = m[5] ? m[5].split('.') : [];
        this.format();
    }
    format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
            this.version += `-${this.prerelease.join('.')}`;
        }
        return this.version;
    }
    toString() {
        return this.version;
    }
    compare(other) {
        debug('SemVer.compare', this.version, this.options, other);
        if (!(other instanceof SemVer)) {
            if (typeof other === 'string' && other === this.version) {
                return 0;
            }
            other = new SemVer(other, this.options);
        }
        if (other.version === this.version) {
            return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        if (this.major < other.major) {
            return -1;
        }
        if (this.major > other.major) {
            return 1;
        }
        if (this.minor < other.minor) {
            return -1;
        }
        if (this.minor > other.minor) {
            return 1;
        }
        if (this.patch < other.patch) {
            return -1;
        }
        if (this.patch > other.patch) {
            return 1;
        }
        return 0;
    }
    comparePre(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        // NOT having a prerelease is > having one
        if (this.prerelease.length && !other.prerelease.length) {
            return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
        }
        let i = 0;
        do {
            const a = this.prerelease[i];
            const b = other.prerelease[i];
            debug('prerelease compare', i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers(a, b);
            }
        }while (++i)
    }
    compareBuild(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        let i = 0;
        do {
            const a = this.build[i];
            const b = other.build[i];
            debug('build compare', i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers(a, b);
            }
        }while (++i)
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier, identifierBase) {
        if (release.startsWith('pre')) {
            if (!identifier && identifierBase === false) {
                throw new Error('invalid increment argument: identifier is empty');
            }
            // Avoid an invalid semver results
            if (identifier) {
                const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
                if (!match || match[1] !== identifier) {
                    throw new Error(`invalid identifier: ${identifier}`);
                }
            }
        }
        switch(release){
            case 'premajor':
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor = 0;
                this.major++;
                this.inc('pre', identifier, identifierBase);
                break;
            case 'preminor':
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor++;
                this.inc('pre', identifier, identifierBase);
                break;
            case 'prepatch':
                // If this is already a prerelease, it will bump to the next version
                // drop any prereleases that might already exist, since they are not
                // relevant at this point.
                this.prerelease.length = 0;
                this.inc('patch', identifier, identifierBase);
                this.inc('pre', identifier, identifierBase);
                break;
            // If the input is a non-prerelease version, this acts the same as
            // prepatch.
            case 'prerelease':
                if (this.prerelease.length === 0) {
                    this.inc('patch', identifier, identifierBase);
                }
                this.inc('pre', identifier, identifierBase);
                break;
            case 'release':
                if (this.prerelease.length === 0) {
                    throw new Error(`version ${this.raw} is not a prerelease`);
                }
                this.prerelease.length = 0;
                break;
            case 'major':
                // If this is a pre-major version, bump up to the same major version.
                // Otherwise increment major.
                // 1.0.0-5 bumps to 1.0.0
                // 1.1.0 bumps to 2.0.0
                if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
                    this.major++;
                }
                this.minor = 0;
                this.patch = 0;
                this.prerelease = [];
                break;
            case 'minor':
                // If this is a pre-minor version, bump up to the same minor version.
                // Otherwise increment minor.
                // 1.2.0-5 bumps to 1.2.0
                // 1.2.1 bumps to 1.3.0
                if (this.patch !== 0 || this.prerelease.length === 0) {
                    this.minor++;
                }
                this.patch = 0;
                this.prerelease = [];
                break;
            case 'patch':
                // If this is not a pre-release version, it will increment the patch.
                // If it is a pre-release it will bump up to the same patch version.
                // 1.2.0-5 patches to 1.2.0
                // 1.2.0 patches to 1.2.1
                if (this.prerelease.length === 0) {
                    this.patch++;
                }
                this.prerelease = [];
                break;
            // This probably shouldn't be used publicly.
            // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
            case 'pre':
                {
                    const base = Number(identifierBase) ? 1 : 0;
                    if (this.prerelease.length === 0) {
                        this.prerelease = [
                            base
                        ];
                    } else {
                        let i = this.prerelease.length;
                        while(--i >= 0){
                            if (typeof this.prerelease[i] === 'number') {
                                this.prerelease[i]++;
                                i = -2;
                            }
                        }
                        if (i === -1) {
                            // didn't increment anything
                            if (identifier === this.prerelease.join('.') && identifierBase === false) {
                                throw new Error('invalid increment argument: identifier already exists');
                            }
                            this.prerelease.push(base);
                        }
                    }
                    if (identifier) {
                        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
                        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
                        let prerelease = [
                            identifier,
                            base
                        ];
                        if (identifierBase === false) {
                            prerelease = [
                                identifier
                            ];
                        }
                        if (isPrereleaseIdentifier(this.prerelease, identifier)) {
                            const prereleaseBase = this.prerelease[identifier.split('.').length];
                            if (isNaN(prereleaseBase)) {
                                this.prerelease = prerelease;
                            }
                        } else {
                            this.prerelease = prerelease;
                        }
                    }
                    break;
                }
            default:
                throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
            this.raw += `+${this.build.join('.')}`;
        }
        return this;
    }
}
module.exports = SemVer;
}),
"[project]/Demo-2/node_modules/semver/functions/parse.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const parse = (version, options, throwErrors = false)=>{
    if (version instanceof SemVer) {
        return version;
    }
    try {
        return new SemVer(version, options);
    } catch (er) {
        if (!throwErrors) {
            return null;
        }
        throw er;
    }
};
module.exports = parse;
}),
"[project]/Demo-2/node_modules/semver/functions/valid.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const valid = (version, options)=>{
    const v = parse(version, options);
    return v ? v.version : null;
};
module.exports = valid;
}),
"[project]/Demo-2/node_modules/semver/functions/clean.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const clean = (version, options)=>{
    const s = parse(version.trim().replace(/^[=v]+/, ''), options);
    return s ? s.version : null;
};
module.exports = clean;
}),
"[project]/Demo-2/node_modules/semver/functions/inc.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const inc = (version, release, options, identifier, identifierBase)=>{
    if (typeof options === 'string') {
        identifierBase = identifier;
        identifier = options;
        options = undefined;
    }
    try {
        return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
    } catch (er) {
        return null;
    }
};
module.exports = inc;
}),
"[project]/Demo-2/node_modules/semver/functions/diff.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const diff = (version1, version2)=>{
    const v1 = parse(version1, null, true);
    const v2 = parse(version2, null, true);
    const comparison = v1.compare(v2);
    if (comparison === 0) {
        return null;
    }
    const v1Higher = comparison > 0;
    const highVersion = v1Higher ? v1 : v2;
    const lowVersion = v1Higher ? v2 : v1;
    const highHasPre = !!highVersion.prerelease.length;
    const lowHasPre = !!lowVersion.prerelease.length;
    if (lowHasPre && !highHasPre) {
        // Going from prerelease -> no prerelease requires some special casing
        // If the low version has only a major, then it will always be a major
        // Some examples:
        // 1.0.0-1 -> 1.0.0
        // 1.0.0-1 -> 1.1.1
        // 1.0.0-1 -> 2.0.0
        if (!lowVersion.patch && !lowVersion.minor) {
            return 'major';
        }
        // If the main part has no difference
        if (lowVersion.compareMain(highVersion) === 0) {
            if (lowVersion.minor && !lowVersion.patch) {
                return 'minor';
            }
            return 'patch';
        }
    }
    // add the `pre` prefix if we are going to a prerelease version
    const prefix = highHasPre ? 'pre' : '';
    if (v1.major !== v2.major) {
        return prefix + 'major';
    }
    if (v1.minor !== v2.minor) {
        return prefix + 'minor';
    }
    if (v1.patch !== v2.patch) {
        return prefix + 'patch';
    }
    // high and low are prereleases
    return 'prerelease';
};
module.exports = diff;
}),
"[project]/Demo-2/node_modules/semver/functions/major.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const major = (a, loose)=>new SemVer(a, loose).major;
module.exports = major;
}),
"[project]/Demo-2/node_modules/semver/functions/minor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const minor = (a, loose)=>new SemVer(a, loose).minor;
module.exports = minor;
}),
"[project]/Demo-2/node_modules/semver/functions/patch.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const patch = (a, loose)=>new SemVer(a, loose).patch;
module.exports = patch;
}),
"[project]/Demo-2/node_modules/semver/functions/prerelease.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const prerelease = (version, options)=>{
    const parsed = parse(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
};
module.exports = prerelease;
}),
"[project]/Demo-2/node_modules/semver/functions/compare.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const compare = (a, b, loose)=>new SemVer(a, loose).compare(new SemVer(b, loose));
module.exports = compare;
}),
"[project]/Demo-2/node_modules/semver/functions/rcompare.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const rcompare = (a, b, loose)=>compare(b, a, loose);
module.exports = rcompare;
}),
"[project]/Demo-2/node_modules/semver/functions/compare-loose.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const compareLoose = (a, b)=>compare(a, b, true);
module.exports = compareLoose;
}),
"[project]/Demo-2/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const compareBuild = (a, b, loose)=>{
    const versionA = new SemVer(a, loose);
    const versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
};
module.exports = compareBuild;
}),
"[project]/Demo-2/node_modules/semver/functions/sort.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compareBuild = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)");
const sort = (list, loose)=>list.sort((a, b)=>compareBuild(a, b, loose));
module.exports = sort;
}),
"[project]/Demo-2/node_modules/semver/functions/rsort.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compareBuild = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)");
const rsort = (list, loose)=>list.sort((a, b)=>compareBuild(b, a, loose));
module.exports = rsort;
}),
"[project]/Demo-2/node_modules/semver/functions/gt.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const gt = (a, b, loose)=>compare(a, b, loose) > 0;
module.exports = gt;
}),
"[project]/Demo-2/node_modules/semver/functions/lt.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const lt = (a, b, loose)=>compare(a, b, loose) < 0;
module.exports = lt;
}),
"[project]/Demo-2/node_modules/semver/functions/eq.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const eq = (a, b, loose)=>compare(a, b, loose) === 0;
module.exports = eq;
}),
"[project]/Demo-2/node_modules/semver/functions/neq.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const neq = (a, b, loose)=>compare(a, b, loose) !== 0;
module.exports = neq;
}),
"[project]/Demo-2/node_modules/semver/functions/gte.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const gte = (a, b, loose)=>compare(a, b, loose) >= 0;
module.exports = gte;
}),
"[project]/Demo-2/node_modules/semver/functions/lte.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const lte = (a, b, loose)=>compare(a, b, loose) <= 0;
module.exports = lte;
}),
"[project]/Demo-2/node_modules/semver/functions/cmp.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const eq = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/eq.js [app-route] (ecmascript)");
const neq = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/neq.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const gte = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/gte.js [app-route] (ecmascript)");
const lt = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/lt.js [app-route] (ecmascript)");
const lte = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/lte.js [app-route] (ecmascript)");
const cmp = (a, op, b, loose)=>{
    switch(op){
        case '===':
            if (typeof a === 'object') {
                a = a.version;
            }
            if (typeof b === 'object') {
                b = b.version;
            }
            return a === b;
        case '!==':
            if (typeof a === 'object') {
                a = a.version;
            }
            if (typeof b === 'object') {
                b = b.version;
            }
            return a !== b;
        case '':
        case '=':
        case '==':
            return eq(a, b, loose);
        case '!=':
            return neq(a, b, loose);
        case '>':
            return gt(a, b, loose);
        case '>=':
            return gte(a, b, loose);
        case '<':
            return lt(a, b, loose);
        case '<=':
            return lte(a, b, loose);
        default:
            throw new TypeError(`Invalid operator: ${op}`);
    }
};
module.exports = cmp;
}),
"[project]/Demo-2/node_modules/semver/functions/coerce.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const parse = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const { safeRe: re, t } = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const coerce = (version, options)=>{
    if (version instanceof SemVer) {
        return version;
    }
    if (typeof version === 'number') {
        version = String(version);
    }
    if (typeof version !== 'string') {
        return null;
    }
    options = options || {};
    let match = null;
    if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
    } else {
        // Find the right-most coercible string that does not share
        // a terminus with a more left-ward coercible string.
        // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
        // With includePrerelease option set, '1.2.3.4-rc' wants to coerce '2.3.4-rc', not '2.3.4'
        //
        // Walk through the string checking with a /g regexp
        // Manually set the index so as to pick up overlapping matches.
        // Stop when we get a match that ends at the string end, since no
        // coercible string can be more right-ward without the same terminus.
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)){
            if (!match || next.index + next[0].length !== match.index + match[0].length) {
                match = next;
            }
            coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        // leave it in a clean state
        coerceRtlRegex.lastIndex = -1;
    }
    if (match === null) {
        return null;
    }
    const major = match[2];
    const minor = match[3] || '0';
    const patch = match[4] || '0';
    const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : '';
    const build = options.includePrerelease && match[6] ? `+${match[6]}` : '';
    return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
};
module.exports = coerce;
}),
"[project]/Demo-2/node_modules/semver/functions/truncate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const constants = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const truncate = (version, truncation, options)=>{
    if (!constants.RELEASE_TYPES.includes(truncation)) {
        return null;
    }
    const clonedVersion = cloneInputVersion(version, options);
    return clonedVersion && doTruncation(clonedVersion, truncation);
};
const cloneInputVersion = (version, options)=>{
    const versionStringToParse = version instanceof SemVer ? version.version : version;
    return parse(versionStringToParse, options);
};
const doTruncation = (version, truncation)=>{
    if (isPrerelease(truncation)) {
        return version.version;
    }
    version.prerelease = [];
    switch(truncation){
        case 'major':
            version.minor = 0;
            version.patch = 0;
            break;
        case 'minor':
            version.patch = 0;
            break;
    }
    return version.format();
};
const isPrerelease = (type)=>{
    return type.startsWith('pre');
};
module.exports = truncate;
}),
"[project]/Demo-2/node_modules/semver/internal/lrucache.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

class LRUCache {
    constructor(){
        this.max = 1000;
        this.map = new Map();
    }
    get(key) {
        const value = this.map.get(key);
        if (value === undefined) {
            return undefined;
        } else {
            // Remove the key from the map and add it to the end
            this.map.delete(key);
            this.map.set(key, value);
            return value;
        }
    }
    delete(key) {
        return this.map.delete(key);
    }
    set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== undefined) {
            // If cache is full, delete the least recently used item
            if (this.map.size >= this.max) {
                const firstKey = this.map.keys().next().value;
                this.delete(firstKey);
            }
            this.map.set(key, value);
        }
        return this;
    }
}
module.exports = LRUCache;
}),
"[project]/Demo-2/node_modules/semver/classes/range.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SPACE_CHARACTERS = /\s+/g;
// hoisted class for cyclic dependency
class Range {
    constructor(range, options){
        options = parseOptions(options);
        if (range instanceof Range) {
            if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
                return range;
            } else {
                return new Range(range.raw, options);
            }
        }
        if (range instanceof Comparator) {
            // just put it in the set and return
            this.raw = range.value;
            this.set = [
                [
                    range
                ]
            ];
            this.formatted = undefined;
            return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        // First reduce all whitespace as much as possible so we do not have to rely
        // on potentially slow regexes like \s*. This is then stored and used for
        // future error messages as well.
        this.raw = range.trim().replace(SPACE_CHARACTERS, ' ');
        // First, split on ||
        this.set = this.raw.split('||')// map the range to a 2d array of comparators
        .map((r)=>this.parseRange(r.trim()))// throw out any comparator lists that are empty
        // this generally means that it was not a valid range, which is allowed
        // in loose mode, but will still throw if the WHOLE range is invalid.
        .filter((c)=>c.length);
        if (!this.set.length) {
            throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        // if we have any that are not the null set, throw out null sets.
        if (this.set.length > 1) {
            // keep the first one, in case they're all null sets
            const first = this.set[0];
            this.set = this.set.filter((c)=>!isNullSet(c[0]));
            if (this.set.length === 0) {
                this.set = [
                    first
                ];
            } else if (this.set.length > 1) {
                // if we have any that are *, then the range is just *
                for (const c of this.set){
                    if (c.length === 1 && isAny(c[0])) {
                        this.set = [
                            c
                        ];
                        break;
                    }
                }
            }
        }
        this.formatted = undefined;
    }
    get range() {
        if (this.formatted === undefined) {
            this.formatted = '';
            for(let i = 0; i < this.set.length; i++){
                if (i > 0) {
                    this.formatted += '||';
                }
                const comps = this.set[i];
                for(let k = 0; k < comps.length; k++){
                    if (k > 0) {
                        this.formatted += ' ';
                    }
                    this.formatted += comps[k].toString().trim();
                }
            }
        }
        return this.formatted;
    }
    format() {
        return this.range;
    }
    toString() {
        return this.range;
    }
    parseRange(range) {
        // strip build metadata so it can't bleed into the version
        range = range.replace(BUILDSTRIPRE, '');
        // memoize range parsing for performance.
        // this is a very hot path, and fully deterministic.
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ':' + range;
        const cached = cache.get(memoKey);
        if (cached) {
            return cached;
        }
        const loose = this.options.loose;
        // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug('hyphen replace', range);
        // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug('comparator trim', range);
        // `~ 1.2.3` => `~1.2.3`
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug('tilde trim', range);
        // `^ 1.2.3` => `^1.2.3`
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug('caret trim', range);
        // At this point, the range is completely trimmed and
        // ready to be split into comparators.
        let rangeList = range.split(' ').map((comp)=>parseComparator(comp, this.options)).join(' ').split(/\s+/)// >=0.0.0 is equivalent to *
        .map((comp)=>replaceGTE0(comp, this.options));
        if (loose) {
            // in loose mode, throw out any that are not valid comparators
            rangeList = rangeList.filter((comp)=>{
                debug('loose invalid filter', comp, this.options);
                return !!comp.match(re[t.COMPARATORLOOSE]);
            });
        }
        debug('range list', rangeList);
        // if any comparators are the null set, then replace with JUST null set
        // if more than one comparator, remove any * comparators
        // also, don't include the same comparator more than once
        const rangeMap = new Map();
        const comparators = rangeList.map((comp)=>new Comparator(comp, this.options));
        for (const comp of comparators){
            if (isNullSet(comp)) {
                return [
                    comp
                ];
            }
            rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has('')) {
            rangeMap.delete('');
        }
        const result = [
            ...rangeMap.values()
        ];
        cache.set(memoKey, result);
        return result;
    }
    intersects(range, options) {
        if (!(range instanceof Range)) {
            throw new TypeError('a Range is required');
        }
        return this.set.some((thisComparators)=>{
            return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators)=>{
                return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator)=>{
                    return rangeComparators.every((rangeComparator)=>{
                        return thisComparator.intersects(rangeComparator, options);
                    });
                });
            });
        });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version) {
        if (!version) {
            return false;
        }
        if (typeof version === 'string') {
            try {
                version = new SemVer(version, this.options);
            } catch (er) {
                return false;
            }
        }
        for(let i = 0; i < this.set.length; i++){
            if (testSet(this.set[i], version, this.options)) {
                return true;
            }
        }
        return false;
    }
}
module.exports = Range;
const LRU = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/lrucache.js [app-route] (ecmascript)");
const cache = new LRU();
const parseOptions = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const { safeRe: re, src, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
// unbounded global build-metadata stripper used by parseRange
const BUILDSTRIPRE = new RegExp(src[t.BUILD], 'g');
const isNullSet = (c)=>c.value === '<0.0.0-0';
const isAny = (c)=>c.value === '';
// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options)=>{
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while(result && remainingComparators.length){
        result = remainingComparators.every((otherComparator)=>{
            return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
    }
    return result;
};
// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options)=>{
    comp = comp.replace(re[t.BUILD], '');
    debug('comp', comp, options);
    comp = replaceCarets(comp, options);
    debug('caret', comp);
    comp = replaceTildes(comp, options);
    debug('tildes', comp);
    comp = replaceXRanges(comp, options);
    debug('xrange', comp);
    comp = replaceStars(comp, options);
    debug('stars', comp);
    return comp;
};
const isX = (id)=>!id || id.toLowerCase() === 'x' || id === '*';
const invalidXRangeOrder = (M, m, p)=>isX(M) && !isX(m) || isX(m) && p && !isX(p);
// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options)=>{
    return comp.trim().split(/\s+/).map((c)=>replaceTilde(c, options)).join(' ');
};
const replaceTilde = (comp, options)=>{
    const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
    // if we're including prereleases in the match, then the lower bound is
    // -0, the lowest possible prerelease value, just like x-ranges and carets.
    // this keeps `~1.2` equivalent to the `1.2.x` x-range it's documented as.
    const z = options.includePrerelease ? '-0' : '';
    return comp.replace(r, (_, M, m, p, pr)=>{
        debug('tilde', comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
            ret = '';
        } else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            // ~1.2 == >=1.2.0 <1.3.0-0
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else if (pr) {
            debug('replaceTilde pr', pr);
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
            // ~1.2.3 == >=1.2.3 <1.3.0-0
            ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug('tilde return', ret);
        return ret;
    });
};
// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options)=>{
    return comp.trim().split(/\s+/).map((c)=>replaceCaret(c, options)).join(' ');
};
const replaceCaret = (comp, options)=>{
    debug('caret', comp, options);
    const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
    const z = options.includePrerelease ? '-0' : '';
    return comp.replace(r, (_, M, m, p, pr)=>{
        debug('caret', comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
            ret = '';
        } else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            if (M === '0') {
                ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
            } else {
                ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
            }
        } else if (pr) {
            debug('replaceCaret pr', pr);
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
            }
        } else {
            debug('no pr');
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
            }
        }
        debug('caret return', ret);
        return ret;
    });
};
const replaceXRanges = (comp, options)=>{
    debug('replaceXRanges', comp, options);
    return comp.split(/\s+/).map((c)=>replaceXRange(c, options)).join(' ');
};
const replaceXRange = (comp, options)=>{
    comp = comp.trim();
    const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr)=>{
        debug('xRange', comp, ret, gtlt, M, m, p, pr);
        if (invalidXRangeOrder(M, m, p)) {
            return comp;
        }
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === '=' && anyX) {
            gtlt = '';
        }
        // if we're including prereleases in the match, then we need
        // to fix this to -0, the lowest possible prerelease value
        pr = options.includePrerelease ? '-0' : '';
        if (xM) {
            if (gtlt === '>' || gtlt === '<') {
                // nothing is allowed
                ret = '<0.0.0-0';
            } else {
                // nothing is forbidden
                ret = '*';
            }
        } else if (gtlt && anyX) {
            // we know patch is an x, because we have any x at all.
            // replace X with 0
            if (xm) {
                m = 0;
            }
            p = 0;
            if (gtlt === '>') {
                // >1 => >=2.0.0
                // >1.2 => >=1.3.0
                gtlt = '>=';
                if (xm) {
                    M = +M + 1;
                    m = 0;
                    p = 0;
                } else {
                    m = +m + 1;
                    p = 0;
                }
            } else if (gtlt === '<=') {
                // <=0.7.x is actually <0.8.0, since any 0.7.x should
                // pass.  Similarly, <=7.x is actually <8.0.0, etc.
                gtlt = '<';
                if (xm) {
                    M = +M + 1;
                } else {
                    m = +m + 1;
                }
            }
            if (gtlt === '<') {
                pr = '-0';
            }
            ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
            ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug('xRange return', ret);
        return ret;
    });
};
// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options)=>{
    debug('replaceStars', comp, options);
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re[t.STAR], '');
};
const replaceGTE0 = (comp, options)=>{
    debug('replaceGTE0', comp, options);
    return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '');
};
// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
// TODO build?
const hyphenReplace = (incPr)=>($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr)=>{
        if (isX(fM)) {
            from = '';
        } else if (isX(fm)) {
            from = `>=${fM}.0.0${incPr ? '-0' : ''}`;
        } else if (isX(fp)) {
            from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`;
        } else if (fpr) {
            from = `>=${from}`;
        } else {
            from = `>=${from}${incPr ? '-0' : ''}`;
        }
        if (isX(tM)) {
            to = '';
        } else if (isX(tm)) {
            to = `<${+tM + 1}.0.0-0`;
        } else if (isX(tp)) {
            to = `<${tM}.${+tm + 1}.0-0`;
        } else if (tpr) {
            to = `<=${tM}.${tm}.${tp}-${tpr}`;
        } else if (incPr) {
            to = `<${tM}.${tm}.${+tp + 1}-0`;
        } else {
            to = `<=${to}`;
        }
        return `${from} ${to}`.trim();
    };
const testSet = (set, version, options)=>{
    for(let i = 0; i < set.length; i++){
        if (!set[i].test(version)) {
            return false;
        }
    }
    if (version.prerelease.length && !options.includePrerelease) {
        // Find the set of versions that are allowed to have prereleases
        // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
        // That should allow `1.2.3-pr.2` to pass.
        // However, `1.2.4-alpha.notready` should NOT be allowed,
        // even though it's within the range set by the comparators.
        for(let i = 0; i < set.length; i++){
            debug(set[i].semver);
            if (set[i].semver === Comparator.ANY) {
                continue;
            }
            if (set[i].semver.prerelease.length > 0) {
                const allowed = set[i].semver;
                if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
                    return true;
                }
            }
        }
        // Version has a -pre, but it's not one of the ones we like.
        return false;
    }
    return true;
};
}),
"[project]/Demo-2/node_modules/semver/classes/comparator.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const ANY = Symbol('SemVer ANY');
// hoisted class for cyclic dependency
class Comparator {
    static get ANY() {
        return ANY;
    }
    constructor(comp, options){
        options = parseOptions(options);
        if (comp instanceof Comparator) {
            if (comp.loose === !!options.loose) {
                return comp;
            } else {
                comp = comp.value;
            }
        }
        comp = comp.trim().split(/\s+/).join(' ');
        debug('comparator', comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
            this.value = '';
        } else {
            this.value = this.operator + this.semver.version;
        }
        debug('comp', this);
    }
    parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
            throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== undefined ? m[1] : '';
        if (this.operator === '=') {
            this.operator = '';
        }
        // if it literally is just '>' or '' then allow anything.
        if (!m[2]) {
            this.semver = ANY;
        } else {
            this.semver = new SemVer(m[2], this.options.loose);
        }
    }
    toString() {
        return this.value;
    }
    test(version) {
        debug('Comparator.test', version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
            return true;
        }
        if (typeof version === 'string') {
            try {
                version = new SemVer(version, this.options);
            } catch (er) {
                return false;
            }
        }
        return cmp(version, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
        if (!(comp instanceof Comparator)) {
            throw new TypeError('a Comparator is required');
        }
        if (this.operator === '') {
            if (this.value === '') {
                return true;
            }
            return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === '') {
            if (comp.value === '') {
                return true;
            }
            return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        // Special cases where nothing can possibly be lower
        if (options.includePrerelease && (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
            return false;
        }
        if (!options.includePrerelease && (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
            return false;
        }
        // Same direction increasing (> or >=)
        if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
            return true;
        }
        // Same direction decreasing (< or <=)
        if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
            return true;
        }
        // same SemVer and both sides are inclusive (<= or >=)
        if (this.semver.version === comp.semver.version && this.operator.includes('=') && comp.operator.includes('=')) {
            return true;
        }
        // opposite directions less than
        if (cmp(this.semver, '<', comp.semver, options) && this.operator.startsWith('>') && comp.operator.startsWith('<')) {
            return true;
        }
        // opposite directions greater than
        if (cmp(this.semver, '>', comp.semver, options) && this.operator.startsWith('<') && comp.operator.startsWith('>')) {
            return true;
        }
        return false;
    }
}
module.exports = Comparator;
const parseOptions = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)");
const { safeRe: re, t } = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const cmp = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/cmp.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/range.js [app-route] (ecmascript)");
}),
"[project]/Demo-2/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const satisfies = (version, range, options)=>{
    try {
        range = new Range(range, options);
    } catch (er) {
        return false;
    }
    return range.test(version);
};
module.exports = satisfies;
}),
"[project]/Demo-2/node_modules/semver/ranges/to-comparators.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/range.js [app-route] (ecmascript)");
// Mostly just for testing and legacy API reasons
const toComparators = (range, options)=>new Range(range, options).set.map((comp)=>comp.map((c)=>c.value).join(' ').trim().split(' '));
module.exports = toComparators;
}),
"[project]/Demo-2/node_modules/semver/ranges/max-satisfying.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const maxSatisfying = (versions, range, options)=>{
    let max = null;
    let maxSV = null;
    let rangeObj = null;
    try {
        rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach((v)=>{
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!max || maxSV.compare(v) === -1) {
                // compare(max, v, true)
                max = v;
                maxSV = new SemVer(max, options);
            }
        }
    });
    return max;
};
module.exports = maxSatisfying;
}),
"[project]/Demo-2/node_modules/semver/ranges/min-satisfying.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const minSatisfying = (versions, range, options)=>{
    let min = null;
    let minSV = null;
    let rangeObj = null;
    try {
        rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach((v)=>{
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!min || minSV.compare(v) === 1) {
                // compare(min, v, true)
                min = v;
                minSV = new SemVer(min, options);
            }
        }
    });
    return min;
};
module.exports = minSatisfying;
}),
"[project]/Demo-2/node_modules/semver/ranges/min-version.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const minVersion = (range, loose)=>{
    range = new Range(range, loose);
    let minver = new SemVer('0.0.0');
    if (range.test(minver)) {
        return minver;
    }
    minver = new SemVer('0.0.0-0');
    if (range.test(minver)) {
        return minver;
    }
    minver = null;
    for(let i = 0; i < range.set.length; ++i){
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator)=>{
            // Clone to avoid manipulating the comparator's semver object.
            const compver = new SemVer(comparator.semver.version);
            switch(comparator.operator){
                case '>':
                    if (compver.prerelease.length === 0) {
                        compver.patch++;
                    } else {
                        compver.prerelease.push(0);
                    }
                    compver.raw = compver.format();
                /* fallthrough */ case '':
                case '>=':
                    if (!setMin || gt(compver, setMin)) {
                        setMin = compver;
                    }
                    break;
                case '<':
                case '<=':
                    break;
                /* istanbul ignore next */ default:
                    throw new Error(`Unexpected operation: ${comparator.operator}`);
            }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
            minver = setMin;
        }
    }
    if (minver && range.test(minver)) {
        return minver;
    }
    return null;
};
module.exports = minVersion;
}),
"[project]/Demo-2/node_modules/semver/ranges/valid.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const validRange = (range, options)=>{
    try {
        // Return '*' instead of '' so that truthiness works.
        // This will throw if it's invalid anyway
        return new Range(range, options).range || '*';
    } catch (er) {
        return null;
    }
};
module.exports = validRange;
}),
"[project]/Demo-2/node_modules/semver/ranges/outside.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const { ANY } = Comparator;
const Range = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const satisfies = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const lt = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/lt.js [app-route] (ecmascript)");
const lte = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/lte.js [app-route] (ecmascript)");
const gte = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/gte.js [app-route] (ecmascript)");
const outside = (version, range, hilo, options)=>{
    version = new SemVer(version, options);
    range = new Range(range, options);
    let gtfn, ltefn, ltfn, comp, ecomp;
    switch(hilo){
        case '>':
            gtfn = gt;
            ltefn = lte;
            ltfn = lt;
            comp = '>';
            ecomp = '>=';
            break;
        case '<':
            gtfn = lt;
            ltefn = gte;
            ltfn = gt;
            comp = '<';
            ecomp = '<=';
            break;
        default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    // If it satisfies the range it is not outside
    if (satisfies(version, range, options)) {
        return false;
    }
    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.
    for(let i = 0; i < range.set.length; ++i){
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator)=>{
            if (comparator.semver === ANY) {
                comparator = new Comparator('>=0.0.0');
            }
            high = high || comparator;
            low = low || comparator;
            if (gtfn(comparator.semver, high.semver, options)) {
                high = comparator;
            } else if (ltfn(comparator.semver, low.semver, options)) {
                low = comparator;
            }
        });
        // If the edge version comparator has a operator then our version
        // isn't outside it
        if (high.operator === comp || high.operator === ecomp) {
            return false;
        }
        // If the lowest version comparator has an operator and our version
        // is less than it then it isn't higher than the range
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
            return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
            return false;
        }
    }
    return true;
};
module.exports = outside;
}),
"[project]/Demo-2/node_modules/semver/ranges/gtr.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Determine if version is greater than all the versions possible in the range.
const outside = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/outside.js [app-route] (ecmascript)");
const gtr = (version, range, options)=>outside(version, range, '>', options);
module.exports = gtr;
}),
"[project]/Demo-2/node_modules/semver/ranges/ltr.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const outside = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/outside.js [app-route] (ecmascript)");
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options)=>outside(version, range, '<', options);
module.exports = ltr;
}),
"[project]/Demo-2/node_modules/semver/ranges/intersects.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const intersects = (r1, r2, options)=>{
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2, options);
};
module.exports = intersects;
}),
"[project]/Demo-2/node_modules/semver/ranges/simplify.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const compare = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
module.exports = (versions, range, options)=>{
    const set = [];
    let first = null;
    let prev = null;
    const v = versions.sort((a, b)=>compare(a, b, options));
    for (const version of v){
        const included = satisfies(version, range, options);
        if (included) {
            prev = version;
            if (!first) {
                first = version;
            }
        } else {
            if (prev) {
                set.push([
                    first,
                    prev
                ]);
            }
            prev = null;
            first = null;
        }
    }
    if (first) {
        set.push([
            first,
            null
        ]);
    }
    const ranges = [];
    for (const [min, max] of set){
        if (min === max) {
            ranges.push(min);
        } else if (!max && min === v[0]) {
            ranges.push('*');
        } else if (!max) {
            ranges.push(`>=${min}`);
        } else if (min === v[0]) {
            ranges.push(`<=${max}`);
        } else {
            ranges.push(`${min} - ${max}`);
        }
    }
    const simplified = ranges.join(' || ');
    const original = typeof range.raw === 'string' ? range.raw : String(range);
    return simplified.length < original.length ? simplified : range;
};
}),
"[project]/Demo-2/node_modules/semver/ranges/subset.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const { ANY } = Comparator;
const satisfies = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const compare = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If LT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true
const subset = (sub, dom, options = {})=>{
    if (sub === dom) {
        return true;
    }
    sub = new Range(sub, options);
    dom = new Range(dom, options);
    let sawNonNull = false;
    OUTER: for (const simpleSub of sub.set){
        for (const simpleDom of dom.set){
            const isSub = simpleSubset(simpleSub, simpleDom, options);
            sawNonNull = sawNonNull || isSub !== null;
            if (isSub) {
                continue OUTER;
            }
        }
        // the null set is a subset of everything, but null simple ranges in
        // a complex range should be ignored.  so if we saw a non-null range,
        // then we know this isn't a subset, but if EVERY simple range was null,
        // then it is a subset.
        if (sawNonNull) {
            return false;
        }
    }
    return true;
};
const minimumVersionWithPreRelease = [
    new Comparator('>=0.0.0-0')
];
const minimumVersion = [
    new Comparator('>=0.0.0')
];
const simpleSubset = (sub, dom, options)=>{
    if (sub === dom) {
        return true;
    }
    if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
            return true;
        } else if (options.includePrerelease) {
            sub = minimumVersionWithPreRelease;
        } else {
            sub = minimumVersion;
        }
    }
    if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
            return true;
        } else {
            dom = minimumVersion;
        }
    }
    const eqSet = new Set();
    let gt, lt;
    for (const c of sub){
        if (c.operator === '>' || c.operator === '>=') {
            gt = higherGT(gt, c, options);
        } else if (c.operator === '<' || c.operator === '<=') {
            lt = lowerLT(lt, c, options);
        } else {
            eqSet.add(c.semver);
        }
    }
    if (eqSet.size > 1) {
        return null;
    }
    let gtltComp;
    if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
            return null;
        } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
            return null;
        }
    }
    // will iterate one or zero times
    for (const eq of eqSet){
        if (gt && !satisfies(eq, String(gt), options)) {
            return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
            return null;
        }
        for (const c of dom){
            if (!satisfies(eq, String(c), options)) {
                return false;
            }
        }
        return true;
    }
    let higher, lower;
    let hasDomLT, hasDomGT;
    // if the subset has a prerelease, we need a comparator in the superset
    // with the same tuple and a prerelease, or it's not a subset
    let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
    let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
    // exception: <1.2.3-0 is the same as <1.2.3
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
    }
    for (const c of dom){
        hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>=';
        hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<=';
        if (gt) {
            if (needDomGTPre) {
                if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
                    needDomGTPre = false;
                }
            }
            if (c.operator === '>' || c.operator === '>=') {
                higher = higherGT(gt, c, options);
                if (higher === c && higher !== gt) {
                    return false;
                }
            } else if (gt.operator === '>=' && !c.test(gt.semver)) {
                return false;
            }
        }
        if (lt) {
            if (needDomLTPre) {
                if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
                    needDomLTPre = false;
                }
            }
            if (c.operator === '<' || c.operator === '<=') {
                lower = lowerLT(lt, c, options);
                if (lower === c && lower !== lt) {
                    return false;
                }
            } else if (lt.operator === '<=' && !c.test(lt.semver)) {
                return false;
            }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
            return false;
        }
    }
    // if there was a < or >, and nothing in the dom, then must be false
    // UNLESS it was limited by another range in the other direction.
    // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
    if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
    }
    if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
    }
    // we needed a prerelease range in a specific tuple, but didn't get one
    // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
    // because it includes prereleases in the 1.2.3 tuple
    if (needDomGTPre || needDomLTPre) {
        return false;
    }
    return true;
};
// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options)=>{
    if (!a) {
        return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp > 0 ? a : comp < 0 ? b : b.operator === '>' && a.operator === '>=' ? b : a;
};
// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options)=>{
    if (!a) {
        return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp < 0 ? a : comp > 0 ? b : b.operator === '<' && a.operator === '<=' ? b : a;
};
module.exports = subset;
}),
"[project]/Demo-2/node_modules/semver/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// just pre-load all the stuff that index.js lazily exports
const internalRe = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const constants = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const identifiers = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/internal/identifiers.js [app-route] (ecmascript)");
const parse = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const valid = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/valid.js [app-route] (ecmascript)");
const clean = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/clean.js [app-route] (ecmascript)");
const inc = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/inc.js [app-route] (ecmascript)");
const diff = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/diff.js [app-route] (ecmascript)");
const major = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/major.js [app-route] (ecmascript)");
const minor = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/minor.js [app-route] (ecmascript)");
const patch = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/patch.js [app-route] (ecmascript)");
const prerelease = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/prerelease.js [app-route] (ecmascript)");
const compare = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const rcompare = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/rcompare.js [app-route] (ecmascript)");
const compareLoose = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare-loose.js [app-route] (ecmascript)");
const compareBuild = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)");
const sort = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/sort.js [app-route] (ecmascript)");
const rsort = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/rsort.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const lt = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/lt.js [app-route] (ecmascript)");
const eq = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/eq.js [app-route] (ecmascript)");
const neq = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/neq.js [app-route] (ecmascript)");
const gte = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/gte.js [app-route] (ecmascript)");
const lte = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/lte.js [app-route] (ecmascript)");
const cmp = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/cmp.js [app-route] (ecmascript)");
const coerce = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/coerce.js [app-route] (ecmascript)");
const truncate = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/truncate.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const satisfies = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const toComparators = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/to-comparators.js [app-route] (ecmascript)");
const maxSatisfying = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/max-satisfying.js [app-route] (ecmascript)");
const minSatisfying = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/min-satisfying.js [app-route] (ecmascript)");
const minVersion = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/min-version.js [app-route] (ecmascript)");
const validRange = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/valid.js [app-route] (ecmascript)");
const outside = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/outside.js [app-route] (ecmascript)");
const gtr = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/gtr.js [app-route] (ecmascript)");
const ltr = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/ltr.js [app-route] (ecmascript)");
const intersects = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/intersects.js [app-route] (ecmascript)");
const simplifyRange = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/simplify.js [app-route] (ecmascript)");
const subset = __turbopack_context__.r("[project]/Demo-2/node_modules/semver/ranges/subset.js [app-route] (ecmascript)");
module.exports = {
    parse,
    valid,
    clean,
    inc,
    diff,
    major,
    minor,
    patch,
    prerelease,
    compare,
    rcompare,
    compareLoose,
    compareBuild,
    sort,
    rsort,
    gt,
    lt,
    eq,
    neq,
    gte,
    lte,
    cmp,
    coerce,
    truncate,
    Comparator,
    Range,
    satisfies,
    toComparators,
    maxSatisfying,
    minSatisfying,
    minVersion,
    validRange,
    outside,
    gtr,
    ltr,
    intersects,
    simplifyRange,
    subset,
    SemVer,
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: constants.RELEASE_TYPES,
    compareIdentifiers: identifiers.compareIdentifiers,
    rcompareIdentifiers: identifiers.rcompareIdentifiers
};
}),
"[project]/Demo-2/node_modules/lodash.includes/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as references for various `Number` constants. */ var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 1.7976931348623157e+308, NAN = 0 / 0;
/** `Object#toString` result references. */ var argsTag = '[object Arguments]', funcTag = '[object Function]', genTag = '[object GeneratorFunction]', stringTag = '[object String]', symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Used to detect unsigned integer values. */ var reIsUint = /^(?:0|[1-9]\d*)$/;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */ function arrayMap(array, iteratee) {
    var index = -1, length = array ? array.length : 0, result = Array(length);
    while(++index < length){
        result[index] = iteratee(array[index], index, array);
    }
    return result;
}
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
    while(fromRight ? index-- : ++index < length){
        if (predicate(array[index], index, array)) {
            return index;
        }
    }
    return -1;
}
/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
    }
    var index = fromIndex - 1, length = array.length;
    while(++index < length){
        if (array[index] === value) {
            return index;
        }
    }
    return -1;
}
/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */ function baseIsNaN(value) {
    return value !== value;
}
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */ function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while(++index < n){
        result[index] = iteratee(index);
    }
    return result;
}
/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */ function baseValues(object, props) {
    return arrayMap(props, function(key) {
        return object[key];
    });
}
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */ function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
/** Used for built-in method references. */ var objectProto = Object.prototype;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/** Built-in value references. */ var propertyIsEnumerable = objectProto.propertyIsEnumerable;
/* Built-in method references for those with the same name as other `lodash` methods. */ var nativeKeys = overArg(Object.keys, Object), nativeMax = Math.max;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */ function arrayLikeKeys(value, inherited) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    // Safari 9 makes `arguments.length` enumerable in strict mode.
    var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length, skipIndexes = !!length;
    for(var key in value){
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
            result.push(key);
        }
    }
    return result;
}
/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */ function baseKeys(object) {
    if (!isPrototype(object)) {
        return nativeKeys(object);
    }
    var result = [];
    for(var key in Object(object)){
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
            result.push(key);
        }
    }
    return result;
}
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */ function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */ function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
    return value === proto;
}
/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */ function includes(collection, value, fromIndex, guard) {
    collection = isArrayLike(collection) ? collection : values(collection);
    fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
    var length = collection.length;
    if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
    }
    return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
}
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */ function isArguments(value) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */ var isArray = Array.isArray;
/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */ function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}
/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */ function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
}
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */ function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
}
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */ function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */ function isString(value) {
    return typeof value == 'string' || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */ function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */ function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == 'number') {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? other + '' : other;
    }
    if (typeof value != 'string') {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */ function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */ function values(object) {
    return object ? baseValues(object, keys(object)) : [];
}
module.exports = includes;
}),
"[project]/Demo-2/node_modules/lodash.isboolean/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */ /** `Object#toString` result references. */ var boolTag = '[object Boolean]';
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is classified as a boolean primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isBoolean(false);
 * // => true
 *
 * _.isBoolean(null);
 * // => false
 */ function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && objectToString.call(value) == boolTag;
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
module.exports = isBoolean;
}),
"[project]/Demo-2/node_modules/lodash.isinteger/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as references for various `Number` constants. */ var INFINITY = 1 / 0, MAX_INTEGER = 1.7976931348623157e+308, NAN = 0 / 0;
/** `Object#toString` result references. */ var symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is an integer.
 *
 * **Note:** This method is based on
 * [`Number.isInteger`](https://mdn.io/Number/isInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
 * @example
 *
 * _.isInteger(3);
 * // => true
 *
 * _.isInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isInteger(Infinity);
 * // => false
 *
 * _.isInteger('3');
 * // => false
 */ function isInteger(value) {
    return typeof value == 'number' && value == toInteger(value);
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */ function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */ function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == 'number') {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? other + '' : other;
    }
    if (typeof value != 'string') {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
module.exports = isInteger;
}),
"[project]/Demo-2/node_modules/lodash.isnumber/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */ /** `Object#toString` result references. */ var numberTag = '[object Number]';
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
 * as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */ function isNumber(value) {
    return typeof value == 'number' || isObjectLike(value) && objectToString.call(value) == numberTag;
}
module.exports = isNumber;
}),
"[project]/Demo-2/node_modules/lodash.isplainobject/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** `Object#toString` result references. */ var objectTag = '[object Object]';
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */ function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
        try {
            result = !!(value + '');
        } catch (e) {}
    }
    return result;
}
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */ function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
/** Used for built-in method references. */ var funcProto = Function.prototype, objectProto = Object.prototype;
/** Used to resolve the decompiled source of functions. */ var funcToString = funcProto.toString;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/** Used to infer the `Object` constructor. */ var objectCtorString = funcToString.call(Object);
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/** Built-in value references. */ var getPrototype = overArg(Object.getPrototypeOf, Object);
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */ function isPlainObject(value) {
    if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
        return true;
    }
    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
module.exports = isPlainObject;
}),
"[project]/Demo-2/node_modules/lodash.isstring/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash 4.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */ /** `Object#toString` result references. */ var stringTag = '[object String]';
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */ var isArray = Array.isArray;
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */ function isString(value) {
    return typeof value == 'string' || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
}
module.exports = isString;
}),
"[project]/Demo-2/node_modules/lodash.once/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as the `TypeError` message for "Functions" methods. */ var FUNC_ERROR_TEXT = 'Expected a function';
/** Used as references for various `Number` constants. */ var INFINITY = 1 / 0, MAX_INTEGER = 1.7976931348623157e+308, NAN = 0 / 0;
/** `Object#toString` result references. */ var symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery(element).on('click', _.before(5, addContactToList));
 * // => Allows adding up to 4 contacts to the list.
 */ function before(n, func) {
    var result;
    if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
    }
    n = toInteger(n);
    return function() {
        if (--n > 0) {
            result = func.apply(this, arguments);
        }
        if (n <= 1) {
            func = undefined;
        }
        return result;
    };
}
/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first invocation. The `func` is
 * invoked with the `this` binding and arguments of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // => `createApplication` is invoked once
 */ function once(func) {
    return before(2, func);
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */ function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */ function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == 'number') {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? other + '' : other;
    }
    if (typeof value != 'string') {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
module.exports = once;
}),
"[project]/Demo-2/node_modules/bcryptjs/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 Copyright (c) 2012 Nevins Bartolomeo <nevins.bartolomeo@gmail.com>
 Copyright (c) 2012 Shane Girish <shaneGirish@gmail.com>
 Copyright (c) 2025 Daniel Wirtz <dcode@dcode.io>

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */ // The Node.js crypto module is used as a fallback for the Web Crypto API. When
// building for the browser, inclusion of the crypto module should be disabled,
// which the package hints at in its package.json for bundlers that support it.
__turbopack_context__.s([
    "compare",
    ()=>compare,
    "compareSync",
    ()=>compareSync,
    "decodeBase64",
    ()=>decodeBase64,
    "default",
    ()=>__TURBOPACK__default__export__,
    "encodeBase64",
    ()=>encodeBase64,
    "genSalt",
    ()=>genSalt,
    "genSaltSync",
    ()=>genSaltSync,
    "getRounds",
    ()=>getRounds,
    "getSalt",
    ()=>getSalt,
    "hash",
    ()=>hash,
    "hashSync",
    ()=>hashSync,
    "setRandomFallback",
    ()=>setRandomFallback,
    "truncates",
    ()=>truncates
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
/**
 * The random implementation to use as a fallback.
 * @type {?function(number):!Array.<number>}
 * @inner
 */ var randomFallback = null;
/**
 * Generates cryptographically secure random bytes.
 * @function
 * @param {number} len Bytes length
 * @returns {!Array.<number>} Random bytes
 * @throws {Error} If no random implementation is available
 * @inner
 */ function randomBytes(len) {
    // Web Crypto API. Globally available in the browser and in Node.js >=23.
    try {
        return crypto.getRandomValues(new Uint8Array(len));
    } catch  {}
    // Node.js crypto module for non-browser environments.
    try {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(len);
    } catch  {}
    // Custom fallback specified with `setRandomFallback`.
    if (!randomFallback) {
        throw Error("Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative");
    }
    return randomFallback(len);
}
function setRandomFallback(random) {
    randomFallback = random;
}
function genSaltSync(rounds, seed_length) {
    rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;
    if (typeof rounds !== "number") throw Error("Illegal arguments: " + typeof rounds + ", " + typeof seed_length);
    if (rounds < 4) rounds = 4;
    else if (rounds > 31) rounds = 31;
    var salt = [];
    salt.push("$2b$");
    if (rounds < 10) salt.push("0");
    salt.push(rounds.toString());
    salt.push("$");
    salt.push(base64_encode(randomBytes(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN)); // May throw
    return salt.join("");
}
function genSalt(rounds, seed_length, callback) {
    if (typeof seed_length === "function") callback = seed_length, seed_length = undefined; // Not supported.
    if (typeof rounds === "function") callback = rounds, rounds = undefined;
    if (typeof rounds === "undefined") rounds = GENSALT_DEFAULT_LOG2_ROUNDS;
    else if (typeof rounds !== "number") throw Error("illegal arguments: " + typeof rounds);
    function _async(callback) {
        nextTick(function() {
            // Pretty thin, but salting is fast enough
            try {
                callback(null, genSaltSync(rounds));
            } catch (err) {
                callback(err);
            }
        });
    }
    if (callback) {
        if (typeof callback !== "function") throw Error("Illegal callback: " + typeof callback);
        _async(callback);
    } else return new Promise(function(resolve, reject) {
        _async(function(err, res) {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    });
}
function hashSync(password, salt) {
    if (typeof salt === "undefined") salt = GENSALT_DEFAULT_LOG2_ROUNDS;
    if (typeof salt === "number") salt = genSaltSync(salt);
    if (typeof password !== "string" || typeof salt !== "string") throw Error("Illegal arguments: " + typeof password + ", " + typeof salt);
    return _hash(password, salt);
}
function hash(password, salt, callback, progressCallback) {
    function _async(callback) {
        if (typeof password === "string" && typeof salt === "number") genSalt(salt, function(err, salt) {
            _hash(password, salt, callback, progressCallback);
        });
        else if (typeof password === "string" && typeof salt === "string") _hash(password, salt, callback, progressCallback);
        else nextTick(callback.bind(this, Error("Illegal arguments: " + typeof password + ", " + typeof salt)));
    }
    if (callback) {
        if (typeof callback !== "function") throw Error("Illegal callback: " + typeof callback);
        _async(callback);
    } else return new Promise(function(resolve, reject) {
        _async(function(err, res) {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    });
}
/**
 * Compares two strings of the same length in constant time.
 * @param {string} known Must be of the correct length
 * @param {string} unknown Must be the same length as `known`
 * @returns {boolean}
 * @inner
 */ function safeStringCompare(known, unknown) {
    var diff = known.length ^ unknown.length;
    for(var i = 0; i < known.length; ++i){
        diff |= known.charCodeAt(i) ^ unknown.charCodeAt(i);
    }
    return diff === 0;
}
function compareSync(password, hash) {
    if (typeof password !== "string" || typeof hash !== "string") throw Error("Illegal arguments: " + typeof password + ", " + typeof hash);
    if (hash.length !== 60) return false;
    return safeStringCompare(hashSync(password, hash.substring(0, hash.length - 31)), hash);
}
function compare(password, hashValue, callback, progressCallback) {
    function _async(callback) {
        if (typeof password !== "string" || typeof hashValue !== "string") {
            nextTick(callback.bind(this, Error("Illegal arguments: " + typeof password + ", " + typeof hashValue)));
            return;
        }
        if (hashValue.length !== 60) {
            nextTick(callback.bind(this, null, false));
            return;
        }
        hash(password, hashValue.substring(0, 29), function(err, comp) {
            if (err) callback(err);
            else callback(null, safeStringCompare(comp, hashValue));
        }, progressCallback);
    }
    if (callback) {
        if (typeof callback !== "function") throw Error("Illegal callback: " + typeof callback);
        _async(callback);
    } else return new Promise(function(resolve, reject) {
        _async(function(err, res) {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    });
}
function getRounds(hash) {
    if (typeof hash !== "string") throw Error("Illegal arguments: " + typeof hash);
    return parseInt(hash.split("$")[2], 10);
}
function getSalt(hash) {
    if (typeof hash !== "string") throw Error("Illegal arguments: " + typeof hash);
    if (hash.length !== 60) throw Error("Illegal hash length: " + hash.length + " != 60");
    return hash.substring(0, 29);
}
function truncates(password) {
    if (typeof password !== "string") throw Error("Illegal arguments: " + typeof password);
    return utf8Length(password) > 72;
}
/**
 * Continues with the callback on the next tick.
 * @function
 * @param {function(...[*])} callback Callback to execute
 * @inner
 */ var nextTick = typeof process !== "undefined" && process && typeof process.nextTick === "function" ? typeof setImmediate === "function" ? setImmediate : process.nextTick : setTimeout;
/** Calculates the byte length of a string encoded as UTF8. */ function utf8Length(string) {
    var len = 0, c = 0;
    for(var i = 0; i < string.length; ++i){
        c = string.charCodeAt(i);
        if (c < 128) len += 1;
        else if (c < 2048) len += 2;
        else if ((c & 0xfc00) === 0xd800 && (string.charCodeAt(i + 1) & 0xfc00) === 0xdc00) {
            ++i;
            len += 4;
        } else len += 3;
    }
    return len;
}
/** Converts a string to an array of UTF8 bytes. */ function utf8Array(string) {
    var offset = 0, c1, c2;
    var buffer = new Array(utf8Length(string));
    for(var i = 0, k = string.length; i < k; ++i){
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6 | 192;
            buffer[offset++] = c1 & 63 | 128;
        } else if ((c1 & 0xfc00) === 0xd800 && ((c2 = string.charCodeAt(i + 1)) & 0xfc00) === 0xdc00) {
            c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff);
            ++i;
            buffer[offset++] = c1 >> 18 | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12 | 224;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
        }
    }
    return buffer;
}
// A base64 implementation for the bcrypt algorithm. This is partly non-standard.
/**
 * bcrypt's own non-standard base64 dictionary.
 * @type {!Array.<string>}
 * @const
 * @inner
 **/ var BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
/**
 * @type {!Array.<number>}
 * @const
 * @inner
 **/ var BASE64_INDEX = [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0,
    1,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    -1,
    -1,
    -1,
    -1,
    -1
];
/**
 * Encodes a byte array to base64 with up to len bytes of input.
 * @param {!Array.<number>} b Byte array
 * @param {number} len Maximum input length
 * @returns {string}
 * @inner
 */ function base64_encode(b, len) {
    var off = 0, rs = [], c1, c2;
    if (len <= 0 || len > b.length) throw Error("Illegal len: " + len);
    while(off < len){
        c1 = b[off++] & 0xff;
        rs.push(BASE64_CODE[c1 >> 2 & 0x3f]);
        c1 = (c1 & 0x03) << 4;
        if (off >= len) {
            rs.push(BASE64_CODE[c1 & 0x3f]);
            break;
        }
        c2 = b[off++] & 0xff;
        c1 |= c2 >> 4 & 0x0f;
        rs.push(BASE64_CODE[c1 & 0x3f]);
        c1 = (c2 & 0x0f) << 2;
        if (off >= len) {
            rs.push(BASE64_CODE[c1 & 0x3f]);
            break;
        }
        c2 = b[off++] & 0xff;
        c1 |= c2 >> 6 & 0x03;
        rs.push(BASE64_CODE[c1 & 0x3f]);
        rs.push(BASE64_CODE[c2 & 0x3f]);
    }
    return rs.join("");
}
/**
 * Decodes a base64 encoded string to up to len bytes of output.
 * @param {string} s String to decode
 * @param {number} len Maximum output length
 * @returns {!Array.<number>}
 * @inner
 */ function base64_decode(s, len) {
    var off = 0, slen = s.length, olen = 0, rs = [], c1, c2, c3, c4, o, code;
    if (len <= 0) throw Error("Illegal len: " + len);
    while(off < slen - 1 && olen < len){
        code = s.charCodeAt(off++);
        c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
        code = s.charCodeAt(off++);
        c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
        if (c1 == -1 || c2 == -1) break;
        o = c1 << 2 >>> 0;
        o |= (c2 & 0x30) >> 4;
        rs.push(String.fromCharCode(o));
        if (++olen >= len || off >= slen) break;
        code = s.charCodeAt(off++);
        c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
        if (c3 == -1) break;
        o = (c2 & 0x0f) << 4 >>> 0;
        o |= (c3 & 0x3c) >> 2;
        rs.push(String.fromCharCode(o));
        if (++olen >= len || off >= slen) break;
        code = s.charCodeAt(off++);
        c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
        o = (c3 & 0x03) << 6 >>> 0;
        o |= c4;
        rs.push(String.fromCharCode(o));
        ++olen;
    }
    var res = [];
    for(off = 0; off < olen; off++)res.push(rs[off].charCodeAt(0));
    return res;
}
/**
 * @type {number}
 * @const
 * @inner
 */ var BCRYPT_SALT_LEN = 16;
/**
 * @type {number}
 * @const
 * @inner
 */ var GENSALT_DEFAULT_LOG2_ROUNDS = 10;
/**
 * @type {number}
 * @const
 * @inner
 */ var BLOWFISH_NUM_ROUNDS = 16;
/**
 * @type {number}
 * @const
 * @inner
 */ var MAX_EXECUTION_TIME = 100;
/**
 * @type {Array.<number>}
 * @const
 * @inner
 */ var P_ORIG = [
    0x243f6a88,
    0x85a308d3,
    0x13198a2e,
    0x03707344,
    0xa4093822,
    0x299f31d0,
    0x082efa98,
    0xec4e6c89,
    0x452821e6,
    0x38d01377,
    0xbe5466cf,
    0x34e90c6c,
    0xc0ac29b7,
    0xc97c50dd,
    0x3f84d5b5,
    0xb5470917,
    0x9216d5d9,
    0x8979fb1b
];
/**
 * @type {Array.<number>}
 * @const
 * @inner
 */ var S_ORIG = [
    0xd1310ba6,
    0x98dfb5ac,
    0x2ffd72db,
    0xd01adfb7,
    0xb8e1afed,
    0x6a267e96,
    0xba7c9045,
    0xf12c7f99,
    0x24a19947,
    0xb3916cf7,
    0x0801f2e2,
    0x858efc16,
    0x636920d8,
    0x71574e69,
    0xa458fea3,
    0xf4933d7e,
    0x0d95748f,
    0x728eb658,
    0x718bcd58,
    0x82154aee,
    0x7b54a41d,
    0xc25a59b5,
    0x9c30d539,
    0x2af26013,
    0xc5d1b023,
    0x286085f0,
    0xca417918,
    0xb8db38ef,
    0x8e79dcb0,
    0x603a180e,
    0x6c9e0e8b,
    0xb01e8a3e,
    0xd71577c1,
    0xbd314b27,
    0x78af2fda,
    0x55605c60,
    0xe65525f3,
    0xaa55ab94,
    0x57489862,
    0x63e81440,
    0x55ca396a,
    0x2aab10b6,
    0xb4cc5c34,
    0x1141e8ce,
    0xa15486af,
    0x7c72e993,
    0xb3ee1411,
    0x636fbc2a,
    0x2ba9c55d,
    0x741831f6,
    0xce5c3e16,
    0x9b87931e,
    0xafd6ba33,
    0x6c24cf5c,
    0x7a325381,
    0x28958677,
    0x3b8f4898,
    0x6b4bb9af,
    0xc4bfe81b,
    0x66282193,
    0x61d809cc,
    0xfb21a991,
    0x487cac60,
    0x5dec8032,
    0xef845d5d,
    0xe98575b1,
    0xdc262302,
    0xeb651b88,
    0x23893e81,
    0xd396acc5,
    0x0f6d6ff3,
    0x83f44239,
    0x2e0b4482,
    0xa4842004,
    0x69c8f04a,
    0x9e1f9b5e,
    0x21c66842,
    0xf6e96c9a,
    0x670c9c61,
    0xabd388f0,
    0x6a51a0d2,
    0xd8542f68,
    0x960fa728,
    0xab5133a3,
    0x6eef0b6c,
    0x137a3be4,
    0xba3bf050,
    0x7efb2a98,
    0xa1f1651d,
    0x39af0176,
    0x66ca593e,
    0x82430e88,
    0x8cee8619,
    0x456f9fb4,
    0x7d84a5c3,
    0x3b8b5ebe,
    0xe06f75d8,
    0x85c12073,
    0x401a449f,
    0x56c16aa6,
    0x4ed3aa62,
    0x363f7706,
    0x1bfedf72,
    0x429b023d,
    0x37d0d724,
    0xd00a1248,
    0xdb0fead3,
    0x49f1c09b,
    0x075372c9,
    0x80991b7b,
    0x25d479d8,
    0xf6e8def7,
    0xe3fe501a,
    0xb6794c3b,
    0x976ce0bd,
    0x04c006ba,
    0xc1a94fb6,
    0x409f60c4,
    0x5e5c9ec2,
    0x196a2463,
    0x68fb6faf,
    0x3e6c53b5,
    0x1339b2eb,
    0x3b52ec6f,
    0x6dfc511f,
    0x9b30952c,
    0xcc814544,
    0xaf5ebd09,
    0xbee3d004,
    0xde334afd,
    0x660f2807,
    0x192e4bb3,
    0xc0cba857,
    0x45c8740f,
    0xd20b5f39,
    0xb9d3fbdb,
    0x5579c0bd,
    0x1a60320a,
    0xd6a100c6,
    0x402c7279,
    0x679f25fe,
    0xfb1fa3cc,
    0x8ea5e9f8,
    0xdb3222f8,
    0x3c7516df,
    0xfd616b15,
    0x2f501ec8,
    0xad0552ab,
    0x323db5fa,
    0xfd238760,
    0x53317b48,
    0x3e00df82,
    0x9e5c57bb,
    0xca6f8ca0,
    0x1a87562e,
    0xdf1769db,
    0xd542a8f6,
    0x287effc3,
    0xac6732c6,
    0x8c4f5573,
    0x695b27b0,
    0xbbca58c8,
    0xe1ffa35d,
    0xb8f011a0,
    0x10fa3d98,
    0xfd2183b8,
    0x4afcb56c,
    0x2dd1d35b,
    0x9a53e479,
    0xb6f84565,
    0xd28e49bc,
    0x4bfb9790,
    0xe1ddf2da,
    0xa4cb7e33,
    0x62fb1341,
    0xcee4c6e8,
    0xef20cada,
    0x36774c01,
    0xd07e9efe,
    0x2bf11fb4,
    0x95dbda4d,
    0xae909198,
    0xeaad8e71,
    0x6b93d5a0,
    0xd08ed1d0,
    0xafc725e0,
    0x8e3c5b2f,
    0x8e7594b7,
    0x8ff6e2fb,
    0xf2122b64,
    0x8888b812,
    0x900df01c,
    0x4fad5ea0,
    0x688fc31c,
    0xd1cff191,
    0xb3a8c1ad,
    0x2f2f2218,
    0xbe0e1777,
    0xea752dfe,
    0x8b021fa1,
    0xe5a0cc0f,
    0xb56f74e8,
    0x18acf3d6,
    0xce89e299,
    0xb4a84fe0,
    0xfd13e0b7,
    0x7cc43b81,
    0xd2ada8d9,
    0x165fa266,
    0x80957705,
    0x93cc7314,
    0x211a1477,
    0xe6ad2065,
    0x77b5fa86,
    0xc75442f5,
    0xfb9d35cf,
    0xebcdaf0c,
    0x7b3e89a0,
    0xd6411bd3,
    0xae1e7e49,
    0x00250e2d,
    0x2071b35e,
    0x226800bb,
    0x57b8e0af,
    0x2464369b,
    0xf009b91e,
    0x5563911d,
    0x59dfa6aa,
    0x78c14389,
    0xd95a537f,
    0x207d5ba2,
    0x02e5b9c5,
    0x83260376,
    0x6295cfa9,
    0x11c81968,
    0x4e734a41,
    0xb3472dca,
    0x7b14a94a,
    0x1b510052,
    0x9a532915,
    0xd60f573f,
    0xbc9bc6e4,
    0x2b60a476,
    0x81e67400,
    0x08ba6fb5,
    0x571be91f,
    0xf296ec6b,
    0x2a0dd915,
    0xb6636521,
    0xe7b9f9b6,
    0xff34052e,
    0xc5855664,
    0x53b02d5d,
    0xa99f8fa1,
    0x08ba4799,
    0x6e85076a,
    0x4b7a70e9,
    0xb5b32944,
    0xdb75092e,
    0xc4192623,
    0xad6ea6b0,
    0x49a7df7d,
    0x9cee60b8,
    0x8fedb266,
    0xecaa8c71,
    0x699a17ff,
    0x5664526c,
    0xc2b19ee1,
    0x193602a5,
    0x75094c29,
    0xa0591340,
    0xe4183a3e,
    0x3f54989a,
    0x5b429d65,
    0x6b8fe4d6,
    0x99f73fd6,
    0xa1d29c07,
    0xefe830f5,
    0x4d2d38e6,
    0xf0255dc1,
    0x4cdd2086,
    0x8470eb26,
    0x6382e9c6,
    0x021ecc5e,
    0x09686b3f,
    0x3ebaefc9,
    0x3c971814,
    0x6b6a70a1,
    0x687f3584,
    0x52a0e286,
    0xb79c5305,
    0xaa500737,
    0x3e07841c,
    0x7fdeae5c,
    0x8e7d44ec,
    0x5716f2b8,
    0xb03ada37,
    0xf0500c0d,
    0xf01c1f04,
    0x0200b3ff,
    0xae0cf51a,
    0x3cb574b2,
    0x25837a58,
    0xdc0921bd,
    0xd19113f9,
    0x7ca92ff6,
    0x94324773,
    0x22f54701,
    0x3ae5e581,
    0x37c2dadc,
    0xc8b57634,
    0x9af3dda7,
    0xa9446146,
    0x0fd0030e,
    0xecc8c73e,
    0xa4751e41,
    0xe238cd99,
    0x3bea0e2f,
    0x3280bba1,
    0x183eb331,
    0x4e548b38,
    0x4f6db908,
    0x6f420d03,
    0xf60a04bf,
    0x2cb81290,
    0x24977c79,
    0x5679b072,
    0xbcaf89af,
    0xde9a771f,
    0xd9930810,
    0xb38bae12,
    0xdccf3f2e,
    0x5512721f,
    0x2e6b7124,
    0x501adde6,
    0x9f84cd87,
    0x7a584718,
    0x7408da17,
    0xbc9f9abc,
    0xe94b7d8c,
    0xec7aec3a,
    0xdb851dfa,
    0x63094366,
    0xc464c3d2,
    0xef1c1847,
    0x3215d908,
    0xdd433b37,
    0x24c2ba16,
    0x12a14d43,
    0x2a65c451,
    0x50940002,
    0x133ae4dd,
    0x71dff89e,
    0x10314e55,
    0x81ac77d6,
    0x5f11199b,
    0x043556f1,
    0xd7a3c76b,
    0x3c11183b,
    0x5924a509,
    0xf28fe6ed,
    0x97f1fbfa,
    0x9ebabf2c,
    0x1e153c6e,
    0x86e34570,
    0xeae96fb1,
    0x860e5e0a,
    0x5a3e2ab3,
    0x771fe71c,
    0x4e3d06fa,
    0x2965dcb9,
    0x99e71d0f,
    0x803e89d6,
    0x5266c825,
    0x2e4cc978,
    0x9c10b36a,
    0xc6150eba,
    0x94e2ea78,
    0xa5fc3c53,
    0x1e0a2df4,
    0xf2f74ea7,
    0x361d2b3d,
    0x1939260f,
    0x19c27960,
    0x5223a708,
    0xf71312b6,
    0xebadfe6e,
    0xeac31f66,
    0xe3bc4595,
    0xa67bc883,
    0xb17f37d1,
    0x018cff28,
    0xc332ddef,
    0xbe6c5aa5,
    0x65582185,
    0x68ab9802,
    0xeecea50f,
    0xdb2f953b,
    0x2aef7dad,
    0x5b6e2f84,
    0x1521b628,
    0x29076170,
    0xecdd4775,
    0x619f1510,
    0x13cca830,
    0xeb61bd96,
    0x0334fe1e,
    0xaa0363cf,
    0xb5735c90,
    0x4c70a239,
    0xd59e9e0b,
    0xcbaade14,
    0xeecc86bc,
    0x60622ca7,
    0x9cab5cab,
    0xb2f3846e,
    0x648b1eaf,
    0x19bdf0ca,
    0xa02369b9,
    0x655abb50,
    0x40685a32,
    0x3c2ab4b3,
    0x319ee9d5,
    0xc021b8f7,
    0x9b540b19,
    0x875fa099,
    0x95f7997e,
    0x623d7da8,
    0xf837889a,
    0x97e32d77,
    0x11ed935f,
    0x16681281,
    0x0e358829,
    0xc7e61fd6,
    0x96dedfa1,
    0x7858ba99,
    0x57f584a5,
    0x1b227263,
    0x9b83c3ff,
    0x1ac24696,
    0xcdb30aeb,
    0x532e3054,
    0x8fd948e4,
    0x6dbc3128,
    0x58ebf2ef,
    0x34c6ffea,
    0xfe28ed61,
    0xee7c3c73,
    0x5d4a14d9,
    0xe864b7e3,
    0x42105d14,
    0x203e13e0,
    0x45eee2b6,
    0xa3aaabea,
    0xdb6c4f15,
    0xfacb4fd0,
    0xc742f442,
    0xef6abbb5,
    0x654f3b1d,
    0x41cd2105,
    0xd81e799e,
    0x86854dc7,
    0xe44b476a,
    0x3d816250,
    0xcf62a1f2,
    0x5b8d2646,
    0xfc8883a0,
    0xc1c7b6a3,
    0x7f1524c3,
    0x69cb7492,
    0x47848a0b,
    0x5692b285,
    0x095bbf00,
    0xad19489d,
    0x1462b174,
    0x23820e00,
    0x58428d2a,
    0x0c55f5ea,
    0x1dadf43e,
    0x233f7061,
    0x3372f092,
    0x8d937e41,
    0xd65fecf1,
    0x6c223bdb,
    0x7cde3759,
    0xcbee7460,
    0x4085f2a7,
    0xce77326e,
    0xa6078084,
    0x19f8509e,
    0xe8efd855,
    0x61d99735,
    0xa969a7aa,
    0xc50c06c2,
    0x5a04abfc,
    0x800bcadc,
    0x9e447a2e,
    0xc3453484,
    0xfdd56705,
    0x0e1e9ec9,
    0xdb73dbd3,
    0x105588cd,
    0x675fda79,
    0xe3674340,
    0xc5c43465,
    0x713e38d8,
    0x3d28f89e,
    0xf16dff20,
    0x153e21e7,
    0x8fb03d4a,
    0xe6e39f2b,
    0xdb83adf7,
    0xe93d5a68,
    0x948140f7,
    0xf64c261c,
    0x94692934,
    0x411520f7,
    0x7602d4f7,
    0xbcf46b2e,
    0xd4a20068,
    0xd4082471,
    0x3320f46a,
    0x43b7d4b7,
    0x500061af,
    0x1e39f62e,
    0x97244546,
    0x14214f74,
    0xbf8b8840,
    0x4d95fc1d,
    0x96b591af,
    0x70f4ddd3,
    0x66a02f45,
    0xbfbc09ec,
    0x03bd9785,
    0x7fac6dd0,
    0x31cb8504,
    0x96eb27b3,
    0x55fd3941,
    0xda2547e6,
    0xabca0a9a,
    0x28507825,
    0x530429f4,
    0x0a2c86da,
    0xe9b66dfb,
    0x68dc1462,
    0xd7486900,
    0x680ec0a4,
    0x27a18dee,
    0x4f3ffea2,
    0xe887ad8c,
    0xb58ce006,
    0x7af4d6b6,
    0xaace1e7c,
    0xd3375fec,
    0xce78a399,
    0x406b2a42,
    0x20fe9e35,
    0xd9f385b9,
    0xee39d7ab,
    0x3b124e8b,
    0x1dc9faf7,
    0x4b6d1856,
    0x26a36631,
    0xeae397b2,
    0x3a6efa74,
    0xdd5b4332,
    0x6841e7f7,
    0xca7820fb,
    0xfb0af54e,
    0xd8feb397,
    0x454056ac,
    0xba489527,
    0x55533a3a,
    0x20838d87,
    0xfe6ba9b7,
    0xd096954b,
    0x55a867bc,
    0xa1159a58,
    0xcca92963,
    0x99e1db33,
    0xa62a4a56,
    0x3f3125f9,
    0x5ef47e1c,
    0x9029317c,
    0xfdf8e802,
    0x04272f70,
    0x80bb155c,
    0x05282ce3,
    0x95c11548,
    0xe4c66d22,
    0x48c1133f,
    0xc70f86dc,
    0x07f9c9ee,
    0x41041f0f,
    0x404779a4,
    0x5d886e17,
    0x325f51eb,
    0xd59bc0d1,
    0xf2bcc18f,
    0x41113564,
    0x257b7834,
    0x602a9c60,
    0xdff8e8a3,
    0x1f636c1b,
    0x0e12b4c2,
    0x02e1329e,
    0xaf664fd1,
    0xcad18115,
    0x6b2395e0,
    0x333e92e1,
    0x3b240b62,
    0xeebeb922,
    0x85b2a20e,
    0xe6ba0d99,
    0xde720c8c,
    0x2da2f728,
    0xd0127845,
    0x95b794fd,
    0x647d0862,
    0xe7ccf5f0,
    0x5449a36f,
    0x877d48fa,
    0xc39dfd27,
    0xf33e8d1e,
    0x0a476341,
    0x992eff74,
    0x3a6f6eab,
    0xf4f8fd37,
    0xa812dc60,
    0xa1ebddf8,
    0x991be14c,
    0xdb6e6b0d,
    0xc67b5510,
    0x6d672c37,
    0x2765d43b,
    0xdcd0e804,
    0xf1290dc7,
    0xcc00ffa3,
    0xb5390f92,
    0x690fed0b,
    0x667b9ffb,
    0xcedb7d9c,
    0xa091cf0b,
    0xd9155ea3,
    0xbb132f88,
    0x515bad24,
    0x7b9479bf,
    0x763bd6eb,
    0x37392eb3,
    0xcc115979,
    0x8026e297,
    0xf42e312d,
    0x6842ada7,
    0xc66a2b3b,
    0x12754ccc,
    0x782ef11c,
    0x6a124237,
    0xb79251e7,
    0x06a1bbe6,
    0x4bfb6350,
    0x1a6b1018,
    0x11caedfa,
    0x3d25bdd8,
    0xe2e1c3c9,
    0x44421659,
    0x0a121386,
    0xd90cec6e,
    0xd5abea2a,
    0x64af674e,
    0xda86a85f,
    0xbebfe988,
    0x64e4c3fe,
    0x9dbc8057,
    0xf0f7c086,
    0x60787bf8,
    0x6003604d,
    0xd1fd8346,
    0xf6381fb0,
    0x7745ae04,
    0xd736fccc,
    0x83426b33,
    0xf01eab71,
    0xb0804187,
    0x3c005e5f,
    0x77a057be,
    0xbde8ae24,
    0x55464299,
    0xbf582e61,
    0x4e58f48f,
    0xf2ddfda2,
    0xf474ef38,
    0x8789bdc2,
    0x5366f9c3,
    0xc8b38e74,
    0xb475f255,
    0x46fcd9b9,
    0x7aeb2661,
    0x8b1ddf84,
    0x846a0e79,
    0x915f95e2,
    0x466e598e,
    0x20b45770,
    0x8cd55591,
    0xc902de4c,
    0xb90bace1,
    0xbb8205d0,
    0x11a86248,
    0x7574a99e,
    0xb77f19b6,
    0xe0a9dc09,
    0x662d09a1,
    0xc4324633,
    0xe85a1f02,
    0x09f0be8c,
    0x4a99a025,
    0x1d6efe10,
    0x1ab93d1d,
    0x0ba5a4df,
    0xa186f20f,
    0x2868f169,
    0xdcb7da83,
    0x573906fe,
    0xa1e2ce9b,
    0x4fcd7f52,
    0x50115e01,
    0xa70683fa,
    0xa002b5c4,
    0x0de6d027,
    0x9af88c27,
    0x773f8641,
    0xc3604c06,
    0x61a806b5,
    0xf0177a28,
    0xc0f586e0,
    0x006058aa,
    0x30dc7d62,
    0x11e69ed7,
    0x2338ea63,
    0x53c2dd94,
    0xc2c21634,
    0xbbcbee56,
    0x90bcb6de,
    0xebfc7da1,
    0xce591d76,
    0x6f05e409,
    0x4b7c0188,
    0x39720a3d,
    0x7c927c24,
    0x86e3725f,
    0x724d9db9,
    0x1ac15bb4,
    0xd39eb8fc,
    0xed545578,
    0x08fca5b5,
    0xd83d7cd3,
    0x4dad0fc4,
    0x1e50ef5e,
    0xb161e6f8,
    0xa28514d9,
    0x6c51133c,
    0x6fd5c7e7,
    0x56e14ec4,
    0x362abfce,
    0xddc6c837,
    0xd79a3234,
    0x92638212,
    0x670efa8e,
    0x406000e0,
    0x3a39ce37,
    0xd3faf5cf,
    0xabc27737,
    0x5ac52d1b,
    0x5cb0679e,
    0x4fa33742,
    0xd3822740,
    0x99bc9bbe,
    0xd5118e9d,
    0xbf0f7315,
    0xd62d1c7e,
    0xc700c47b,
    0xb78c1b6b,
    0x21a19045,
    0xb26eb1be,
    0x6a366eb4,
    0x5748ab2f,
    0xbc946e79,
    0xc6a376d2,
    0x6549c2c8,
    0x530ff8ee,
    0x468dde7d,
    0xd5730a1d,
    0x4cd04dc6,
    0x2939bbdb,
    0xa9ba4650,
    0xac9526e8,
    0xbe5ee304,
    0xa1fad5f0,
    0x6a2d519a,
    0x63ef8ce2,
    0x9a86ee22,
    0xc089c2b8,
    0x43242ef6,
    0xa51e03aa,
    0x9cf2d0a4,
    0x83c061ba,
    0x9be96a4d,
    0x8fe51550,
    0xba645bd6,
    0x2826a2f9,
    0xa73a3ae1,
    0x4ba99586,
    0xef5562e9,
    0xc72fefd3,
    0xf752f7da,
    0x3f046f69,
    0x77fa0a59,
    0x80e4a915,
    0x87b08601,
    0x9b09e6ad,
    0x3b3ee593,
    0xe990fd5a,
    0x9e34d797,
    0x2cf0b7d9,
    0x022b8b51,
    0x96d5ac3a,
    0x017da67d,
    0xd1cf3ed6,
    0x7c7d2d28,
    0x1f9f25cf,
    0xadf2b89b,
    0x5ad6b472,
    0x5a88f54c,
    0xe029ac71,
    0xe019a5e6,
    0x47b0acfd,
    0xed93fa9b,
    0xe8d3c48d,
    0x283b57cc,
    0xf8d56629,
    0x79132e28,
    0x785f0191,
    0xed756055,
    0xf7960e44,
    0xe3d35e8c,
    0x15056dd4,
    0x88f46dba,
    0x03a16125,
    0x0564f0bd,
    0xc3eb9e15,
    0x3c9057a2,
    0x97271aec,
    0xa93a072a,
    0x1b3f6d9b,
    0x1e6321f5,
    0xf59c66fb,
    0x26dcf319,
    0x7533d928,
    0xb155fdf5,
    0x03563482,
    0x8aba3cbb,
    0x28517711,
    0xc20ad9f8,
    0xabcc5167,
    0xccad925f,
    0x4de81751,
    0x3830dc8e,
    0x379d5862,
    0x9320f991,
    0xea7a90c2,
    0xfb3e7bce,
    0x5121ce64,
    0x774fbe32,
    0xa8b6e37e,
    0xc3293d46,
    0x48de5369,
    0x6413e680,
    0xa2ae0810,
    0xdd6db224,
    0x69852dfd,
    0x09072166,
    0xb39a460a,
    0x6445c0dd,
    0x586cdecf,
    0x1c20c8ae,
    0x5bbef7dd,
    0x1b588d40,
    0xccd2017f,
    0x6bb4e3bb,
    0xdda26a7e,
    0x3a59ff45,
    0x3e350a44,
    0xbcb4cdd5,
    0x72eacea8,
    0xfa6484bb,
    0x8d6612ae,
    0xbf3c6f47,
    0xd29be463,
    0x542f5d9e,
    0xaec2771b,
    0xf64e6370,
    0x740e0d8d,
    0xe75b1357,
    0xf8721671,
    0xaf537d5d,
    0x4040cb08,
    0x4eb4e2cc,
    0x34d2466a,
    0x0115af84,
    0xe1b00428,
    0x95983a1d,
    0x06b89fb4,
    0xce6ea048,
    0x6f3f3b82,
    0x3520ab82,
    0x011a1d4b,
    0x277227f8,
    0x611560b1,
    0xe7933fdc,
    0xbb3a792b,
    0x344525bd,
    0xa08839e1,
    0x51ce794b,
    0x2f32c9b7,
    0xa01fbac9,
    0xe01cc87e,
    0xbcc7d1f6,
    0xcf0111c3,
    0xa1e8aac7,
    0x1a908749,
    0xd44fbd9a,
    0xd0dadecb,
    0xd50ada38,
    0x0339c32a,
    0xc6913667,
    0x8df9317c,
    0xe0b12b4f,
    0xf79e59b7,
    0x43f5bb3a,
    0xf2d519ff,
    0x27d9459c,
    0xbf97222c,
    0x15e6fc2a,
    0x0f91fc71,
    0x9b941525,
    0xfae59361,
    0xceb69ceb,
    0xc2a86459,
    0x12baa8d1,
    0xb6c1075e,
    0xe3056a0c,
    0x10d25065,
    0xcb03a442,
    0xe0ec6e0e,
    0x1698db3b,
    0x4c98a0be,
    0x3278e964,
    0x9f1f9532,
    0xe0d392df,
    0xd3a0342b,
    0x8971f21e,
    0x1b0a7441,
    0x4ba3348c,
    0xc5be7120,
    0xc37632d8,
    0xdf359f8d,
    0x9b992f2e,
    0xe60b6f47,
    0x0fe3f11d,
    0xe54cda54,
    0x1edad891,
    0xce6279cf,
    0xcd3e7e6f,
    0x1618b166,
    0xfd2c1d05,
    0x848fd2c5,
    0xf6fb2299,
    0xf523f357,
    0xa6327623,
    0x93a83531,
    0x56cccd02,
    0xacf08162,
    0x5a75ebb5,
    0x6e163697,
    0x88d273cc,
    0xde966292,
    0x81b949d0,
    0x4c50901b,
    0x71c65614,
    0xe6c6c7bd,
    0x327a140a,
    0x45e1d006,
    0xc3f27b9a,
    0xc9aa53fd,
    0x62a80f00,
    0xbb25bfe2,
    0x35bdd2f6,
    0x71126905,
    0xb2040222,
    0xb6cbcf7c,
    0xcd769c2b,
    0x53113ec0,
    0x1640e3d3,
    0x38abbd60,
    0x2547adf0,
    0xba38209c,
    0xf746ce76,
    0x77afa1c5,
    0x20756060,
    0x85cbfe4e,
    0x8ae88dd8,
    0x7aaaf9b0,
    0x4cf9aa7e,
    0x1948c25c,
    0x02fb8a8c,
    0x01c36ae4,
    0xd6ebe1f9,
    0x90d4f869,
    0xa65cdea0,
    0x3f09252d,
    0xc208e69f,
    0xb74e6132,
    0xce77e25b,
    0x578fdfe3,
    0x3ac372e6
];
/**
 * @type {Array.<number>}
 * @const
 * @inner
 */ var C_ORIG = [
    0x4f727068,
    0x65616e42,
    0x65686f6c,
    0x64657253,
    0x63727944,
    0x6f756274
];
/**
 * @param {Array.<number>} lr
 * @param {number} off
 * @param {Array.<number>} P
 * @param {Array.<number>} S
 * @returns {Array.<number>}
 * @inner
 */ function _encipher(lr, off, P, S) {
    // This is our bottleneck: 1714/1905 ticks / 90% - see profile.txt
    var n, l = lr[off], r = lr[off + 1];
    l ^= P[0];
    /*
    for (var i=0, k=BLOWFISH_NUM_ROUNDS-2; i<=k;)
        // Feistel substitution on left word
        n  = S[l >>> 24],
        n += S[0x100 | ((l >> 16) & 0xff)],
        n ^= S[0x200 | ((l >> 8) & 0xff)],
        n += S[0x300 | (l & 0xff)],
        r ^= n ^ P[++i],
        // Feistel substitution on right word
        n  = S[r >>> 24],
        n += S[0x100 | ((r >> 16) & 0xff)],
        n ^= S[0x200 | ((r >> 8) & 0xff)],
        n += S[0x300 | (r & 0xff)],
        l ^= n ^ P[++i];
    */ //The following is an unrolled version of the above loop.
    //Iteration 0
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[1];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[2];
    //Iteration 1
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[3];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[4];
    //Iteration 2
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[5];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[6];
    //Iteration 3
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[7];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[8];
    //Iteration 4
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[9];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[10];
    //Iteration 5
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[11];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[12];
    //Iteration 6
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[13];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[14];
    //Iteration 7
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[15];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[16];
    lr[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
    lr[off + 1] = l;
    return lr;
}
/**
 * @param {Array.<number>} data
 * @param {number} offp
 * @returns {{key: number, offp: number}}
 * @inner
 */ function _streamtoword(data, offp) {
    for(var i = 0, word = 0; i < 4; ++i)word = word << 8 | data[offp] & 0xff, offp = (offp + 1) % data.length;
    return {
        key: word,
        offp: offp
    };
}
/**
 * @param {Array.<number>} key
 * @param {Array.<number>} P
 * @param {Array.<number>} S
 * @inner
 */ function _key(key, P, S) {
    var offset = 0, lr = [
        0,
        0
    ], plen = P.length, slen = S.length, sw;
    for(var i = 0; i < plen; i++)sw = _streamtoword(key, offset), offset = sw.offp, P[i] = P[i] ^ sw.key;
    for(i = 0; i < plen; i += 2)lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
    for(i = 0; i < slen; i += 2)lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
/**
 * Expensive key schedule Blowfish.
 * @param {Array.<number>} data
 * @param {Array.<number>} key
 * @param {Array.<number>} P
 * @param {Array.<number>} S
 * @inner
 */ function _ekskey(data, key, P, S) {
    var offp = 0, lr = [
        0,
        0
    ], plen = P.length, slen = S.length, sw;
    for(var i = 0; i < plen; i++)sw = _streamtoword(key, offp), offp = sw.offp, P[i] = P[i] ^ sw.key;
    offp = 0;
    for(i = 0; i < plen; i += 2)sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
    for(i = 0; i < slen; i += 2)sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
/**
 * Internaly crypts a string.
 * @param {Array.<number>} b Bytes to crypt
 * @param {Array.<number>} salt Salt bytes to use
 * @param {number} rounds Number of rounds
 * @param {function(Error, Array.<number>=)=} callback Callback receiving the error, if any, and the resulting bytes. If
 *  omitted, the operation will be performed synchronously.
 *  @param {function(number)=} progressCallback Callback called with the current progress
 * @returns {!Array.<number>|undefined} Resulting bytes if callback has been omitted, otherwise `undefined`
 * @inner
 */ function _crypt(b, salt, rounds, callback, progressCallback) {
    var cdata = C_ORIG.slice(), clen = cdata.length, err;
    // Validate
    if (rounds < 4 || rounds > 31) {
        err = Error("Illegal number of rounds (4-31): " + rounds);
        if (callback) {
            nextTick(callback.bind(this, err));
            return;
        } else throw err;
    }
    if (salt.length !== BCRYPT_SALT_LEN) {
        err = Error("Illegal salt length: " + salt.length + " != " + BCRYPT_SALT_LEN);
        if (callback) {
            nextTick(callback.bind(this, err));
            return;
        } else throw err;
    }
    rounds = 1 << rounds >>> 0;
    var P, S, i = 0, j;
    //Use typed arrays when available - huge speedup!
    if (typeof Int32Array === "function") {
        P = new Int32Array(P_ORIG);
        S = new Int32Array(S_ORIG);
    } else {
        P = P_ORIG.slice();
        S = S_ORIG.slice();
    }
    _ekskey(salt, b, P, S);
    /**
   * Calcualtes the next round.
   * @returns {Array.<number>|undefined} Resulting array if callback has been omitted, otherwise `undefined`
   * @inner
   */ function next() {
        if (progressCallback) progressCallback(i / rounds);
        if (i < rounds) {
            var start = Date.now();
            for(; i < rounds;){
                i = i + 1;
                _key(b, P, S);
                _key(salt, P, S);
                if (Date.now() - start > MAX_EXECUTION_TIME) break;
            }
        } else {
            for(i = 0; i < 64; i++)for(j = 0; j < clen >> 1; j++)_encipher(cdata, j << 1, P, S);
            var ret = [];
            for(i = 0; i < clen; i++)ret.push((cdata[i] >> 24 & 0xff) >>> 0), ret.push((cdata[i] >> 16 & 0xff) >>> 0), ret.push((cdata[i] >> 8 & 0xff) >>> 0), ret.push((cdata[i] & 0xff) >>> 0);
            if (callback) {
                callback(null, ret);
                return;
            } else return ret;
        }
        if (callback) nextTick(next);
    }
    // Async
    if (typeof callback !== "undefined") {
        next();
    // Sync
    } else {
        var res;
        while(true)if (typeof (res = next()) !== "undefined") return res || [];
    }
}
/**
 * Internally hashes a password.
 * @param {string} password Password to hash
 * @param {?string} salt Salt to use, actually never null
 * @param {function(Error, string=)=} callback Callback receiving the error, if any, and the resulting hash. If omitted,
 *  hashing is performed synchronously.
 *  @param {function(number)=} progressCallback Callback called with the current progress
 * @returns {string|undefined} Resulting hash if callback has been omitted, otherwise `undefined`
 * @inner
 */ function _hash(password, salt, callback, progressCallback) {
    var err;
    if (typeof password !== "string" || typeof salt !== "string") {
        err = Error("Invalid string / salt: Not a string");
        if (callback) {
            nextTick(callback.bind(this, err));
            return;
        } else throw err;
    }
    // Validate the salt
    var minor, offset;
    if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
        err = Error("Invalid salt version: " + salt.substring(0, 2));
        if (callback) {
            nextTick(callback.bind(this, err));
            return;
        } else throw err;
    }
    if (salt.charAt(2) === "$") minor = String.fromCharCode(0), offset = 3;
    else {
        minor = salt.charAt(2);
        if (minor !== "a" && minor !== "b" && minor !== "y" || salt.charAt(3) !== "$") {
            err = Error("Invalid salt revision: " + salt.substring(2, 4));
            if (callback) {
                nextTick(callback.bind(this, err));
                return;
            } else throw err;
        }
        offset = 4;
    }
    // Extract number of rounds
    if (salt.charAt(offset + 2) > "$") {
        err = Error("Missing salt rounds");
        if (callback) {
            nextTick(callback.bind(this, err));
            return;
        } else throw err;
    }
    var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10, r2 = parseInt(salt.substring(offset + 1, offset + 2), 10), rounds = r1 + r2, real_salt = salt.substring(offset + 3, offset + 25);
    password += minor >= "a" ? "\x00" : "";
    var passwordb = utf8Array(password), saltb = base64_decode(real_salt, BCRYPT_SALT_LEN);
    /**
   * Finishes hashing.
   * @param {Array.<number>} bytes Byte array
   * @returns {string}
   * @inner
   */ function finish(bytes) {
        var res = [];
        res.push("$2");
        if (minor >= "a") res.push(minor);
        res.push("$");
        if (rounds < 10) res.push("0");
        res.push(rounds.toString());
        res.push("$");
        res.push(base64_encode(saltb, saltb.length));
        res.push(base64_encode(bytes, C_ORIG.length * 4 - 1));
        return res.join("");
    }
    // Sync
    if (typeof callback == "undefined") return finish(_crypt(passwordb, saltb, rounds));
    else {
        _crypt(passwordb, saltb, rounds, function(err, bytes) {
            if (err) callback(err, null);
            else callback(null, finish(bytes));
        }, progressCallback);
    }
}
function encodeBase64(bytes, length) {
    return base64_encode(bytes, length);
}
function decodeBase64(string, length) {
    return base64_decode(string, length);
}
const __TURBOPACK__default__export__ = {
    setRandomFallback,
    genSaltSync,
    genSalt,
    hashSync,
    hash,
    compareSync,
    compare,
    getRounds,
    getSalt,
    truncates,
    encodeBase64,
    decodeBase64
};
}),
];

//# sourceMappingURL=6e6c4_5461c8ab._.js.map