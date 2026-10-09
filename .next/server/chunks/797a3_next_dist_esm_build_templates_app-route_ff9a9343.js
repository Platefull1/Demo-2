module.exports=[947351,e=>{"use strict";var t=e.i(28324),r=e.i(465694),a=e.i(496264),o=e.i(9995),n=e.i(650948),i=e.i(821811),s=e.i(156380),d=e.i(545034),l=e.i(315747),p=e.i(522375),c=e.i(935947),u=e.i(898601),f=e.i(729761),g=e.i(494692),m=e.i(676838),x=e.i(301570),h=e.i(193695);e.i(546155);var b=e.i(361378),y=e.i(574587),w=e.i(205416),v=e.i(48826),R=e.i(709381);let E="Platefull <noreply@platefull.com.br>";async function C(e){let{to:t,riderName:r,lojaNome:a,periodLabel:o,amountCents:n,riderId:i,nfUrl:s,boletoUrl:d}=e;if(!process.env.RESEND_API_KEY)return void console.warn("[rider-payment-email] RESEND_API_KEY não configurado — e-mail não enviado");let l=`https://platefull.com.br/rh/motoboys/${i}`,p=`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Documentos de Pagamento Recebidos</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.10);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#0a0a0a;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:24px;font-weight:800;color:#f97316;letter-spacing:-0.5px;">Platefull</p>
            <p style="margin:6px 0 0;font-size:13px;color:#9ca3af;">Sistema de Gest\xe3o de Motoboys</p>
          </td>
        </tr>

        <!-- \xcdcone + t\xedtulo -->
        <tr>
          <td style="padding:40px 40px 0;text-align:center;">
            <div style="display:inline-block;background:#f97316;border-radius:50%;width:56px;height:56px;line-height:56px;text-align:center;font-size:26px;">
              📄
            </div>
            <h1 style="margin:16px 0 4px;font-size:22px;font-weight:700;color:#111827;">
              Documentos Recebidos
            </h1>
            <p style="margin:0;font-size:14px;color:#6b7280;">
              Um motoboy enviou os documentos para pagamento
            </p>
          </td>
        </tr>

        <!-- Corpo -->
        <tr>
          <td style="padding:32px 40px;">

            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              Ol\xe1! Os documentos de pagamento da quinzena abaixo foram enviados e est\xe3o
              aguardando sua <strong>revis\xe3o e aprova\xe7\xe3o</strong>.
            </p>

            <!-- Card de detalhes -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:28px;">
              <tr>
                <td style="padding:24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:14px;border-bottom:1px solid #e5e7eb;">
                        <p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.6px;">Motoboy</p>
                        <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#111827;">${r}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;">
                        <p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.6px;">Loja</p>
                        <p style="margin:4px 0 0;font-size:15px;color:#374151;">${a}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;">
                        <p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.6px;">Quinzena</p>
                        <p style="margin:4px 0 0;font-size:15px;color:#374151;">${o}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:14px 0 0;">
                        <p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.6px;">Valor a Pagar</p>
                        <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#f97316;">${(n/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Documentos enviados -->
            <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.5px;">
              Documentos Enviados
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;border-collapse:separate;border-spacing:0;">
              <!-- NF -->
              <tr>
                <td style="padding:14px 16px;background:#ecfdf5;border:1px solid #d1fae5;border-radius:8px 8px 0 0;border-bottom:none;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0;font-size:14px;color:#065f46;">✅ &nbsp;<strong>Nota Fiscal (NF)</strong></p>
                      </td>
                      <td align="right">
                        ${s?`<a href="${s}" target="_blank"
                              style="display:inline-block;background:#059669;color:#ffffff;font-size:12px;font-weight:700;text-decoration:none;padding:6px 14px;border-radius:6px;">
                              ⬇ Baixar NF
                            </a>`:`<span style="font-size:12px;color:#6b7280;">Link indispon\xedvel</span>`}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Boleto -->
              <tr>
                <td style="padding:14px 16px;background:#ecfdf5;border:1px solid #d1fae5;border-radius:0 0 8px 8px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0;font-size:14px;color:#065f46;">✅ &nbsp;<strong>Boleto</strong></p>
                      </td>
                      <td align="right">
                        ${d?`<a href="${d}" target="_blank"
                              style="display:inline-block;background:#059669;color:#ffffff;font-size:12px;font-weight:700;text-decoration:none;padding:6px 14px;border-radius:6px;">
                              ⬇ Baixar Boleto
                            </a>`:`<span style="font-size:12px;color:#6b7280;">Link indispon\xedvel</span>`}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <!-- Validade dos links -->
            <p style="margin:-20px 0 28px;font-size:11px;color:#9ca3af;text-align:right;">
              ⏳ Links v\xe1lidos por 7 dias
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
              <tr>
                <td style="background:#f97316;border-radius:10px;">
                  <a href="${l}" target="_blank"
                    style="display:inline-block;padding:16px 36px;font-size:15px;font-weight:700;color:#000000;text-decoration:none;">
                    Revisar e Aprovar Documentos
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
              Ou acesse diretamente:<br>
              <a href="${l}" style="color:#f97316;font-size:12px;word-break:break-all;">${l}</a>
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              Este e-mail foi enviado automaticamente pela plataforma Platefull.<br>
              Voc\xea est\xe1 recebendo porque est\xe1 configurado como respons\xe1vel pelo pagamento de motoboys.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;console.info(`[rider-payment-email] POST Resend → to=${t} from=${E}`);let c=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from:E,to:[t],subject:`📄 Documentos de pagamento recebidos — ${r} (${a})`,html:p})});if(!c.ok){let e=await c.text().catch(()=>"");throw Error(`Resend retornou ${c.status} (to=${t}): ${e}`)}let u=await c.json().catch(()=>({}));console.info(`[rider-payment-email] Enviado com sucesso → to=${t} id=${u?.id??"?"}`)}var N=e.i(144438);let P="rider-documents";async function S(e){let{data:t,error:r}=await e.storage.listBuckets();if(r)throw r;if(t?.some(e=>e.name===P))return;let{error:a}=await e.storage.createBucket(P,{public:!1});if(a&&!/already exists/i.test(a.message))throw a}async function k(e,{params:t}){let r=await (0,v.getRiderSession)();if(!r)return y.NextResponse.json({error:"Não autorizado"},{status:401});let a="uluydllxvrteawtltceu",o=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!a||!o)return console.error("[upload rider doc] variáveis Supabase não configuradas"),y.NextResponse.json({error:"Configuração de storage ausente no servidor"},{status:500});let{id:n}=await t,i=await w.prisma.riderPaymentPeriod.findFirst({where:{id:n,riderId:r.riderId,userId:r.userId},include:{documents:!0}});if(!i)return y.NextResponse.json({error:"Quinzena não encontrada"},{status:404});if("paid"===i.status)return y.NextResponse.json({error:"Quinzena já paga — não é possível alterar documentos"},{status:400});let s=await e.formData(),d=s.get("file"),l=s.get("documentType");if(!d||!l||!["nf","boleto"].includes(l))return y.NextResponse.json({error:"Arquivo e tipo (nf|boleto) são obrigatórios"},{status:400});if("application/pdf"!==d.type)return y.NextResponse.json({error:"Apenas PDF é aceito"},{status:400});if(d.size>0xa00000)return y.NextResponse.json({error:"Arquivo excede 10MB"},{status:400});let p=i.documents.find(e=>e.documentType===l),c=`${r.userId}/${r.riderId}/${n}/${l}.pdf`,u=Buffer.from(await d.arrayBuffer()),f=(0,R.createClient)(a,o);try{await S(f)}catch(e){return console.error("[upload rider doc] ensureBucket",e),y.NextResponse.json({error:"Não foi possível acessar o storage. Verifique as credenciais do Supabase."},{status:500})}let{error:g}=await f.storage.from(P).upload(c,u,{contentType:"application/pdf",upsert:!0});if(g)return console.error("[upload rider doc]",g),y.NextResponse.json({error:`Falha no upload: ${g.message}`},{status:500});await w.prisma.riderDocument.upsert({where:{id:p?.id??"new"},update:{fileName:d.name,storagePath:c,status:"pending",reviewedBy:null,reviewedAt:null,uploadedAt:new Date},create:{userId:r.userId,periodId:n,riderId:r.riderId,documentType:l,fileName:d.name,storagePath:c}}).catch(async()=>{p&&await w.prisma.riderDocument.delete({where:{id:p.id}}),await w.prisma.riderDocument.create({data:{userId:r.userId,periodId:n,riderId:r.riderId,documentType:l,fileName:d.name,storagePath:c}})});let m=await w.prisma.riderDocument.findMany({where:{periodId:n}}),x=(0,N.isDocumentsComplete)(i.periodStart,m),h=await w.prisma.riderPaymentPeriod.findUnique({where:{id:n}}),b=h?.status??i.status;if(x&&"pending_documents"===b&&await w.prisma.riderPaymentPeriod.update({where:{id:n},data:{status:"documents_received"}}),x&&("pending_documents"===b||"documents_received"===b)){let e=r.userId,t={...i};(0,y.after)(async()=>{try{await A(e,t)}catch(e){console.error("[upload rider doc] Falha ao notificar responsável:",e)}})}return y.NextResponse.json({ok:!0,storagePath:c})}async function A(e,t){let r=`rider_payment_email_${e}`,a=await w.prisma.systemConfig.findUnique({where:{key:r}}),o=a?.value?.trim();if(!o)return void console.info("[rider-payment-email] Nenhum e-mail de responsável configurado — notificação ignorada");console.info(`[rider-payment-email] Enviando notifica\xe7\xe3o para ${o} (period=${t.id})`);let n=await w.prisma.deliveryRider.findUnique({where:{id:t.riderId},include:{loja:{select:{nome:!0}}}});if(!n)return;let i="uluydllxvrteawtltceu",s=process.env.SUPABASE_SERVICE_ROLE_KEY,d=null,l=null;if(i&&s){let e=(0,R.createClient)(i,s),r=await w.prisma.riderDocument.findMany({where:{periodId:t.id}});await Promise.all(r.map(async t=>{let{data:r}=await e.storage.from(P).createSignedUrl(t.storagePath,604800);"nf"===t.documentType&&(d=r?.signedUrl??null),"boleto"===t.documentType&&(l=r?.signedUrl??null)}))}await C({to:o,riderName:n.name,lojaNome:n.loja?.nome??"Loja",periodLabel:t.periodLabel,periodStart:t.periodStart.toISOString(),periodEnd:t.periodEnd.toISOString(),amountCents:t.amountCents,riderId:t.riderId,nfUrl:d,boletoUrl:l})}e.s(["POST",()=>k,"dynamic",0,"force-dynamic"],726393);var _=e.i(726393);let I=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/rider/quinzenas/[id]/upload/route",pathname:"/api/rider/quinzenas/[id]/upload",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/drin-platform/app/api/rider/quinzenas/[id]/upload/route.ts",nextConfigOutput:"",userland:_}),{workAsyncStorage:$,workUnitAsyncStorage:z,serverHooks:T}=I;function O(){return(0,a.patchFetch)({workAsyncStorage:$,workUnitAsyncStorage:z})}async function D(e,t,a){I.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/rider/quinzenas/[id]/upload/route";y=y.replace(/\/index$/,"")||"/";let w=await I.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:v,params:R,nextConfig:E,parsedUrl:C,isDraftMode:N,prerenderManifest:P,routerServerContext:S,isOnDemandRevalidate:k,revalidateOnlyGenerated:A,resolvedPathname:_,clientReferenceManifest:$,serverActionsManifest:z}=w,T=(0,d.normalizeAppPath)(y),O=!!(P.dynamicRoutes[T]||P.routes[_]),D=async()=>((null==S?void 0:S.render404)?await S.render404(e,t,C,!1):t.end("This page could not be found"),null);if(O&&!N){let e=!!P.routes[_],t=P.dynamicRoutes[T];if(t&&!1===t.fallback&&!e){if(E.experimental.adapterPath)return await D();throw new h.NoFallbackError}}let j=null;!O||I.isDev||N||(j="/index"===(j=_)?"/":j);let q=!0===I.isDev||!O,U=O&&!q;z&&$&&(0,i.setReferenceManifestsSingleton)({page:y,clientReferenceManifest:$,serverActionsManifest:z,serverModuleMap:(0,s.createServerModuleMap)({serverActionsManifest:z})});let B=e.method||"GET",M=(0,n.getTracer)(),H=M.getActiveScopeSpan(),F={params:R,prerenderManifest:P,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts},cacheComponents:!!E.cacheComponents,supportsDynamicResponse:q,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:E.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>I.onRequestError(e,t,a,S)},sharedContext:{buildId:v}},L=new l.NodeNextRequest(e),K=new l.NodeNextResponse(t),V=p.NextRequestAdapter.fromNodeNextRequest(L,(0,p.signalFromNodeResponse)(t));try{let i=async e=>I.handle(V,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=M.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${B} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${B} ${y}`)}),s=!!(0,o.getRequestMeta)(e,"minimalMode"),d=async o=>{var n,d;let l=async({previousCacheEntry:r})=>{try{if(!s&&k&&A&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=F.renderOpts.fetchMetrics;let d=F.renderOpts.pendingWaitUntil;d&&a.waitUntil&&(a.waitUntil(d),d=void 0);let l=F.renderOpts.collectedTags;if(!O)return await (0,f.sendResponse)(L,K,n,F.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[x.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=x.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,a=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=x.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:b.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await I.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:k})},S),t}},p=await I.handleResponse({req:e,nextConfig:E,cacheKey:j,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:P,isRoutePPREnabled:!1,isOnDemandRevalidate:k,revalidateOnlyGenerated:A,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:s});if(!O)return null;if((null==p||null==(n=p.value)?void 0:n.kind)!==b.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(d=p.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",k?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,g.fromNodeOutgoingHttpHeaders)(p.value.headers);return s&&O||c.delete(x.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,m.getCacheControlHeader)(p.cacheControl)),await (0,f.sendResponse)(L,K,new Response(p.value.body,{headers:c,status:p.value.status||200})),null};H?await d(H):await M.withPropagatedContext(e.headers,()=>M.trace(c.BaseServerSpan.handleRequest,{spanName:`${B} ${y}`,kind:n.SpanKind.SERVER,attributes:{"http.method":B,"http.target":e.url}},d))}catch(t){if(t instanceof h.NoFallbackError||await I.onRequestError(e,t,{routerKind:"App Router",routePath:T,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:k})}),O)throw t;return await (0,f.sendResponse)(L,K,new Response(null,{status:500})),null}}e.s(["handler",()=>D,"patchFetch",()=>O,"routeModule",()=>I,"serverHooks",()=>T,"workAsyncStorage",()=>$,"workUnitAsyncStorage",()=>z],947351)}];

//# sourceMappingURL=797a3_next_dist_esm_build_templates_app-route_ff9a9343.js.map