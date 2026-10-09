module.exports=[918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},29173,(e,t,r)=>{t.exports=e.x("@prisma/client",()=>require("@prisma/client"))},205416,e=>{"use strict";var t=e.i(29173);let r=global.prisma??new t.PrismaClient({log:["error"],datasources:{db:{url:process.env.DATABASE_URL}}});process.on("beforeExit",async()=>{await r.$disconnect()}),e.s(["prisma",0,r])},224361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},254799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},688947,(e,t,r)=>{t.exports=e.x("stream",()=>require("stream"))},500874,(e,t,r)=>{t.exports=e.x("buffer",()=>require("buffer"))},262913,e=>{"use strict";function t(){return"https://platefull.com.br"}function r(e){return`${t()}/rider/setup?token=${e}`}function a(e,t){if(!e)return null;let r=e.replace(/\D/g,""),a=r.startsWith("55")?r:`55${r}`,o=encodeURIComponent(`Ol\xe1! Voc\xea foi cadastrado(a) como motoboy na plataforma Drin.

Clique no link abaixo para criar sua senha e acessar o portal:
${t}

O link \xe9 v\xe1lido por 30 dias.`);return`https://wa.me/${a}?text=${o}`}async function o(e){let{to:r,riderName:a,lojaNome:o,inviteLink:n}=e;if(!process.env.RESEND_API_KEY)return void console.warn("[rider-invite-email] RESEND_API_KEY não configurado — e-mail não enviado");let i=`<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#0a0a0a;padding:32px 40px;text-align:center;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#f97316;">Platefull</p>
          <p style="margin:6px 0 0;font-size:13px;color:#9ca3af;">Portal do Motoboy</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Ol\xe1, <strong>${a}</strong>!</p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            Voc\xea foi cadastrado(a) como motoboy na loja <strong>${o}</strong>.
            Para acessar o portal e visualizar suas quinzenas e documentos, voc\xea precisa criar sua senha.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#374151;">Clique no bot\xe3o abaixo para criar sua senha:</p>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
            <tr><td style="background:#f97316;border-radius:8px;">
              <a href="${n}" target="_blank"
                style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#000000;text-decoration:none;">
                Criar minha senha
              </a>
            </td></tr>
          </table>

          <!-- Link alternativo -->
          <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Ou copie e cole este link no seu navegador:</p>
          <p style="margin:0 0 24px;font-size:12px;color:#f97316;word-break:break-all;">${n}</p>

          <p style="margin:0;font-size:13px;color:#9ca3af;">
            ⏳ Este link \xe9 v\xe1lido por <strong>30 dias</strong>. Ap\xf3s acessar, voc\xea poder\xe1 entrar sempre em:
            <br><a href="${t()}/rider/login" style="color:#f97316;">${t()}/rider/login</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            Se voc\xea n\xe3o esperava este e-mail, pode ignor\xe1-lo com seguran\xe7a.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,s=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from:"Platefull <noreply@platefull.com.br>",to:r,subject:`Bem-vindo(a) ao portal do motoboy — ${o}`,html:i})});if(!s.ok){let e=await s.text().catch(()=>"");throw Error(`Resend retornou ${s.status}: ${e}`)}}e.s(["buildInviteLink",()=>r,"buildWhatsAppLink",()=>a,"sendInviteEmail",()=>o])},798952,e=>{"use strict";var t=e.i(28324),r=e.i(465694),a=e.i(496264),o=e.i(9995),n=e.i(650948),i=e.i(821811),s=e.i(156380),l=e.i(545034),d=e.i(315747),p=e.i(522375),c=e.i(935947),u=e.i(898601),f=e.i(729761),x=e.i(494692),g=e.i(676838),m=e.i(301570),h=e.i(193695);e.i(546155);var b=e.i(361378),y=e.i(574587),v=e.i(205416),w=e.i(48826),R=e.i(262913);let E="https://platefull.com.br";async function k(e){let{to:t,riderName:r,link:a}=e;if(!process.env.RESEND_API_KEY)return void console.warn("[forgot-password] RESEND_API_KEY não configurado — e-mail não enviado");let o=`<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="background:#0a0a0a;padding:32px 40px;text-align:center;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#f97316;">Platefull</p>
          <p style="margin:6px 0 0;font-size:13px;color:#9ca3af;">Portal do Motoboy</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Ol\xe1, <strong>${r}</strong>!</p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            Recebemos um pedido para <strong>redefinir sua senha</strong> no Portal do Motoboy.
            Clique no bot\xe3o abaixo para criar uma nova senha:
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
            <tr><td style="background:#f97316;border-radius:8px;">
              <a href="${a}" target="_blank"
                style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#000000;text-decoration:none;">
                Redefinir minha senha
              </a>
            </td></tr>
          </table>
          <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Ou copie e cole este link no seu navegador:</p>
          <p style="margin:0 0 24px;font-size:12px;color:#f97316;word-break:break-all;">${a}</p>
          <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">⏳ Este link expira em <strong>24 horas</strong>.</p>
          <p style="margin:0;font-size:13px;color:#9ca3af;">
            Se voc\xea n\xe3o solicitou a redefini\xe7\xe3o de senha, ignore este e-mail. Sua senha continua a mesma.
          </p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            Acesse sempre em: <a href="${E}/rider/login" style="color:#f97316;">${E}/rider/login</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,n=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from:"Platefull <noreply@platefull.com.br>",to:t,subject:"🔑 Redefinição de senha — Portal do Motoboy",html:o})});if(!n.ok){let e=await n.text().catch(()=>"");throw Error(`Resend retornou ${n.status}: ${e}`)}}async function A(e){try{let t=((await e.json()).email??"").trim().toLowerCase();if(!t)return y.NextResponse.json({error:"E-mail obrigatório"},{status:400});let r=await v.prisma.deliveryRider.findFirst({where:{email:{equals:t,mode:"insensitive"},status:"active"},include:{loja:{select:{nome:!0}}}});if(!r)return console.info(`[forgot-password] e-mail "${t}" n\xe3o encontrado (rider inativo ou inexistente)`),y.NextResponse.json({ok:!0});let a=(0,w.generateInviteToken)(),o=new Date(Date.now()+864e5);await v.prisma.deliveryRider.update({where:{id:r.id},data:{inviteToken:a,inviteTokenExpiresAt:o}});let n=(0,R.buildInviteLink)(a);console.info(`[forgot-password] enviando reset para ${r.email} (rider ${r.id})`);try{await k({to:r.email,riderName:r.name,link:n}),console.info(`[forgot-password] e-mail enviado com sucesso para ${r.email}`)}catch(e){console.error("[forgot-password] falha ao enviar e-mail:",e)}return y.NextResponse.json({ok:!0})}catch(e){return console.error("[POST /api/rider/forgot-password]",e),y.NextResponse.json({ok:!0})}}e.s(["POST",()=>A,"dynamic",0,"force-dynamic"],985017);var C=e.i(985017);let P=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/rider/forgot-password/route",pathname:"/api/rider/forgot-password",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/drin-platform/app/api/rider/forgot-password/route.ts",nextConfigOutput:"",userland:C}),{workAsyncStorage:T,workUnitAsyncStorage:$,serverHooks:N}=P;function S(){return(0,a.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:$})}async function O(e,t,a){P.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/rider/forgot-password/route";y=y.replace(/\/index$/,"")||"/";let v=await P.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:w,params:R,nextConfig:E,parsedUrl:k,isDraftMode:A,prerenderManifest:C,routerServerContext:T,isOnDemandRevalidate:$,revalidateOnlyGenerated:N,resolvedPathname:S,clientReferenceManifest:O,serverActionsManifest:_}=v,q=(0,l.normalizeAppPath)(y),j=!!(C.dynamicRoutes[q]||C.routes[S]),D=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,k,!1):t.end("This page could not be found"),null);if(j&&!A){let e=!!C.routes[S],t=C.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(E.experimental.adapterPath)return await D();throw new h.NoFallbackError}}let I=null;!j||P.isDev||A||(I="/index"===(I=S)?"/":I);let z=!0===P.isDev||!j,H=j&&!z;_&&O&&(0,i.setReferenceManifestsSingleton)({page:y,clientReferenceManifest:O,serverActionsManifest:_,serverModuleMap:(0,s.createServerModuleMap)({serverActionsManifest:_})});let M=e.method||"GET",U=(0,n.getTracer)(),K=U.getActiveScopeSpan(),B={params:R,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts},cacheComponents:!!E.cacheComponents,supportsDynamicResponse:z,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:E.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>P.onRequestError(e,t,a,T)},sharedContext:{buildId:w}},F=new d.NodeNextRequest(e),L=new d.NodeNextResponse(t),Y=p.NextRequestAdapter.fromNodeNextRequest(F,(0,p.signalFromNodeResponse)(t));try{let i=async e=>P.handle(Y,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=U.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${M} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${M} ${y}`)}),s=!!(0,o.getRequestMeta)(e,"minimalMode"),l=async o=>{var n,l;let d=async({previousCacheEntry:r})=>{try{if(!s&&$&&N&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=B.renderOpts.fetchMetrics;let l=B.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let d=B.renderOpts.collectedTags;if(!j)return await (0,f.sendResponse)(F,L,n,B.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,x.toNodeOutgoingHttpHeaders)(n.headers);d&&(t[m.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,a=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:b.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await P.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:$})},T),t}},p=await P.handleResponse({req:e,nextConfig:E,cacheKey:I,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:$,revalidateOnlyGenerated:N,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:s});if(!j)return null;if((null==p||null==(n=p.value)?void 0:n.kind)!==b.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(l=p.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",$?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,x.fromNodeOutgoingHttpHeaders)(p.value.headers);return s&&j||c.delete(m.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,g.getCacheControlHeader)(p.cacheControl)),await (0,f.sendResponse)(F,L,new Response(p.value.body,{headers:c,status:p.value.status||200})),null};K?await l(K):await U.withPropagatedContext(e.headers,()=>U.trace(c.BaseServerSpan.handleRequest,{spanName:`${M} ${y}`,kind:n.SpanKind.SERVER,attributes:{"http.method":M,"http.target":e.url}},l))}catch(t){if(t instanceof h.NoFallbackError||await P.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:$})}),j)throw t;return await (0,f.sendResponse)(F,L,new Response(null,{status:500})),null}}e.s(["handler",()=>O,"patchFetch",()=>S,"routeModule",()=>P,"serverHooks",()=>N,"workAsyncStorage",()=>T,"workUnitAsyncStorage",()=>$],798952)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__7c7ce45e._.js.map