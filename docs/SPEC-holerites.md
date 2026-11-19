# SPEC — Módulo de Holerites (Platefull)

> Especificação para execução no Cursor, em etapas. Arquitetura espelhada no módulo de motoboys (`/rh/motoboys` + `/rider/**`), incorporando as correções que a auditoria dos riders apontou.
>
> **Antes de qualquer tela:** leia e siga as rules de layout/roles do projeto (`.cursor/rules/`). Tudo que é do RH roda dentro do AppShell e respeita o design system. O portal do colaborador fica fora do AppShell, com layout próprio mobile-first (fundo escuro + destaque verde), no mesmo padrão do `/rider`.

---

## 0. Resumo em uma frase

O RH sobe os PDFs da contabilidade por competência. O sistema separa as páginas por CPF e vincula cada uma ao funcionário. O RH confere e publica. O funcionário recebe o aviso pelo WhatsApp, entra no portal com CPF + código, vê o holerite e registra a ciência ("recebi e li"), que fica gravada com data, IP e hash do arquivo.

---

## 1. Visão geral da arquitetura

```
┌──────────────────────────┐        ┌───────────────────────────────┐
│  RH (Stack Auth)         │        │  Colaborador (JWT próprio)    │
│  /rh/holerites           │        │  /colaborador/*               │
│  /api/rh/holerites/*     │        │  /api/colaborador/*           │
└────────────┬─────────────┘        └───────────────┬───────────────┘
             │          Prisma / Neon Postgres       │
             ├──────── Funcionario (existente) ──────┤
             ├──────── PayslipBatch ─────────────────┤
             ├──────── Payslip ──────────────────────┤
             ├──────── PayslipAccessLog ─────────────┤
             └──────── EmployeeLoginCode ────────────┘
                              │
                   Supabase Storage (bucket privado `payslips`)
                              │
              n8n (VPS) → WPPConnect → WhatsApp do funcionário
              (código de login + aviso de holerite publicado)
```

**Pensado para o app mobile desde já:**
- Toda a lógica fica em **route handlers** (`/api/...`). Nada de Server Actions no portal do colaborador.
- Schemas zod e tipos ficam em `src/lib/shared/holerites/`, que depois vira `packages/shared` no monorepo.
- O JWT do colaborador é aceito tanto por **cookie** (web) quanto por **`Authorization: Bearer`** (futuro app Expo).

---

## 2. Modelo de dados (Prisma)

> Na auditoria dos riders, status em string livre foi apontado como bug. Aqui use **enums Prisma**, ou, se o projeto preferir manter string, um union TS + validação zod obrigatória em toda escrita.

```prisma
enum PayslipType {
  MENSAL
  ADIANTAMENTO
  DECIMO_TERCEIRO_1
  DECIMO_TERCEIRO_2
  FERIAS
  RESCISAO
}

enum PayslipStatus {
  DRAFT          // vinculado, ainda não visível ao funcionário
  PUBLISHED      // visível, ainda não aberto
  VIEWED         // abriu ao menos uma vez
  ACKNOWLEDGED   // registrou ciência
  REVOKED        // retirado pelo RH (substituído/retificado)
}

enum PayslipBatchStatus {
  PROCESSING     // PDFs sendo separados
  REVIEW         // aguardando conferência do RH
  PUBLISHED
  CANCELLED
}

model PayslipBatch {
  id              String             @id @default(cuid())
  userId          String             // tenant RH (mesmo padrão dos riders)
  competencia     String             // "2026-10"
  type            PayslipType
  status          PayslipBatchStatus @default(PROCESSING)
  sourceFiles     Json               // [{ path, name, pages, sha256 }]
  unmatchedPages  Json?              // páginas sem CPF reconhecido, para vínculo manual
  createdBy       String
  publishedAt     DateTime?
  publishedBy     String?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
  payslips        Payslip[]

  @@index([userId, competencia])
  @@map("payslip_batches")
}

model Payslip {
  id               String        @id @default(cuid())
  userId           String
  batchId          String
  batch            PayslipBatch  @relation(fields: [batchId], references: [id])
  funcionarioId    String
  funcionario      Funcionario   @relation(fields: [funcionarioId], references: [id])
  lojaId           String        // snapshot da loja na competência
  competencia      String        // "2026-10"
  type             PayslipType
  status           PayslipStatus @default(DRAFT)
  storagePath      String
  fileSha256       String
  fileSizeBytes    Int
  pageCount        Int
  netAmountCents   Int?          // opcional: líquido extraído do PDF (centavos, padrão do projeto)
  rhNote           String?       // mensagem do RH ao funcionário (igual ao `summary` dos riders)
  replacesId       String?       // retificação: aponta para o holerite substituído
  publishedAt      DateTime?
  firstViewedAt    DateTime?
  acknowledgedAt   DateTime?
  ackIp            String?
  ackUserAgent     String?
  ackFileSha256    String?       // hash do arquivo no momento da ciência
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  accessLogs       PayslipAccessLog[]

  @@index([userId, competencia, status])
  @@index([funcionarioId, status])
  @@map("payslips")
}
// Unicidade: um holerite ativo por (funcionarioId, competencia, type).
// Fazer via índice parcial em migration SQL:
//   CREATE UNIQUE INDEX payslip_active_unique ON payslips
//   ("funcionarioId", competencia, type) WHERE status <> 'REVOKED';

model PayslipAccessLog {
  id          String   @id @default(cuid())
  payslipId   String
  payslip     Payslip  @relation(fields: [payslipId], references: [id])
  actorType   String   // "employee" | "rh"
  actorId     String
  action      String   // "view" | "download" | "acknowledge" | "revoke"
  ip          String?
  userAgent   String?
  createdAt   DateTime @default(now())

  @@index([payslipId])
  @@map("payslip_access_logs")
}

model EmployeeLoginCode {
  id             String    @id @default(cuid())
  funcionarioId  String
  codeHash       String    // sha256(code + pepper), nunca o código puro
  expiresAt      DateTime  // +10 min
  attempts       Int       @default(0)
  consumedAt     DateTime?
  requestIp      String?
  createdAt      DateTime  @default(now())

  @@index([funcionarioId, createdAt])
  @@map("employee_login_codes")
}
```

**Campos novos em `Funcionario` (existente):**
```prisma
  portalStatus        String    @default("enabled")  // enabled | disabled
  portalTokenVersion  Int       @default(0)          // incrementar = derruba todas as sessões
  portalLastLoginAt   DateTime?
```

> Conferir no schema atual o nome real do model (`Funcionario`?), os campos de CPF e celular, e a relação com `RhLoja`. Ajustar os nomes acima antes de gerar a migration.

---

## 3. Autenticação do colaborador (isolada, como a dos riders)

Arquivo-chave: `src/lib/employee-auth.ts` (espelho de `rider-auth.ts`).

| Item | Valor |
|---|---|
| Cookie | `employee_token` (httpOnly, secure, sameSite=lax) |
| Issuer | `platefull-employee` |
| Secret | `EMPLOYEE_JWT_SECRET` (≥32 chars, **diferente** de `RIDER_JWT_SECRET`) |
| Validade | 30 dias (sliding: renova se faltar < 7 dias) |
| Payload | `funcionarioId`, `userId` (tenant), `lojaId`, `name`, `tv` (portalTokenVersion) |
| Validação extra | a cada request, checa `portalStatus === 'enabled'` e `tv === portalTokenVersion` |

**Por que CPF + código e não e-mail + senha (como nos riders):** a maioria dos funcionários de loja não tem e-mail ativo e não vai lembrar senha. O WhatsApp já está no cadastro e o WPPConnect já roda na VPS.

### Fluxo de login
1. `/colaborador/login`: funcionário digita o CPF.
2. `POST /api/colaborador/auth/request-code`
   - **Sempre** responde 200 com "Se o CPF estiver cadastrado, enviamos um código para o WhatsApp terminado em ••42" (anti-enumeração; mostra o final do número só quando existe).
   - Gera um código de 6 dígitos e salva o hash. Invalida códigos anteriores não usados.
   - Chama o webhook do n8n (`N8N_EMPLOYEE_OTP_WEBHOOK`, autenticado por header secreto), que manda a mensagem pelo WPPConnect.
   - Rate limit: 3 pedidos / 15 min por CPF e 10 / 15 min por IP.
3. `/colaborador/verificar`: digita o código.
4. `POST /api/colaborador/auth/verify-code`
   - Máx. 5 tentativas por código, depois disso invalida.
   - Comparação em tempo constante.
   - Sucesso: seta o cookie. Se o header for `X-Client: mobile`, devolve também `{ token }` no body (para o app).
   - Atualiza `portalLastLoginAt`.
5. `DELETE /api/colaborador/auth`: logout (limpa o cookie).

### Middleware
- `/colaborador/login` e `/colaborador/verificar` são públicos. Todo o resto de `/colaborador/**` exige JWT válido.
- **Cobrir também `/api/colaborador/**` no middleware** (os riders não cobriam `/api/*`, foi um dos bugs da auditoria).
- `/api/colaborador/**` entra no mapa de tools com `gate: skip` (não usa SystemTool do Stack), igual aos riders.

### Isolamento (testes obrigatórios, no padrão do `jwt-cross.test.ts`)
- Token de colaborador **não** autentica `/rider/**`, `/api/rider/**` nem o back-office.
- Token de rider **não** autentica `/colaborador/**`.
- Colaborador A nunca acessa holerite do colaborador B (testar trocando o `id` na URL e esperar 404, não 403).
- Incrementar `portalTokenVersion` derruba a sessão na próxima request.

---

## 4. Ingestão dos PDFs (o coração do módulo)

**Um algoritmo só atende os dois formatos possíveis da contabilidade** (um PDF único com todo mundo, ou um PDF por funcionário):

1. O RH escolhe a **competência** (mês/ano) e o **tipo** (Mensal, Adiantamento, 13º etc.) e arrasta um ou mais PDFs.
2. **Upload direto para o Supabase** via `createSignedUploadUrl` no caminho de staging `{userId}/_staging/{batchId}/{arquivo}.pdf`.
   - ⚠️ Não passar o PDF pelo body da API: a Vercel limita o body das functions a ~4,5 MB e um PDF consolidado passa disso fácil.
3. `POST /api/rh/holerites/lotes/[id]/processar` (com `maxDuration` adequado):
   - Lê cada PDF e extrai o texto **por página** (`unpdf` ou `pdf-parse`).
   - Procura CPF na página (regex com e sem máscara + validação dos dígitos verificadores).
   - Agrupa páginas **consecutivas** com o mesmo CPF (holerite de 2 páginas continua sendo um só).
   - Gera um PDF por grupo com `pdf-lib`, calcula o sha256 e salva em `{userId}/{funcionarioId}/{competencia}/{type}-{cuid}.pdf`.
   - Busca o funcionário pelo CPF no tenant e cria o `Payslip` como `DRAFT`.
   - Página sem CPF reconhecido ou com CPF que não está no cadastro vai para `unmatchedPages`, para vínculo manual.
   - (Opcional) tenta extrair o líquido ("Líquido a receber", "Valor líquido") para `netAmountCents`.
   - Apaga os arquivos de staging no fim.
   - Lote vai para `REVIEW`.
4. **Atomicidade** (bug apontado nos riders): se o `prisma.create` falhar depois do upload, apagar o arquivo do storage. Se o processamento falhar no meio, o lote fica em `PROCESSING` com erro registrado e o botão "Reprocessar" é idempotente (limpa os DRAFTs do lote antes de recriar).
5. **Bucket:** criar uma vez via migration/script. **Não** chamar `ensureBucket()` a cada upload (outro bug dos riders).

### Tela de conferência (`/rh/holerites/lotes/[id]`)
- Resumo: "48 holerites vinculados · 2 páginas sem vínculo · 3 funcionários ativos sem holerite".
- Tabela: funcionário, loja, páginas, líquido (se extraído), botão de prévia do PDF.
- **Páginas sem vínculo:** prévia da página + combobox para escolher o funcionário.
- **Funcionários ativos sem holerite nesta competência:** lista de alerta (pode ser normal, tipo admissão no fim do mês, mas o RH precisa ver).
- Se já existir holerite ativo do mesmo funcionário/competência/tipo: aviso "vai substituir o atual (retificação)".
- Botão **Publicar** com modal de confirmação mostrando o total.

### Publicação
`POST /api/rh/holerites/lotes/[id]/publicar`
- Em transação: DRAFT → PUBLISHED, `publishedAt`. Holerites substituídos → `REVOKED` e o novo recebe `replacesId`.
- Depois da transação (via `after()`, como nos riders): dispara o webhook n8n `N8N_PAYSLIP_PUBLISHED_WEBHOOK` com a lista `{ nome, telefone, competenciaLabel, link }`.
- **No n8n, enfileirar as mensagens com intervalo aleatório (ex.: 8–20 s entre envios).** Disparar dezenas de mensagens seguidas pelo WPPConnect é o jeito mais rápido de tomar ban do número.

Mensagem sugerida:
> Oi, {primeiroNome}! Seu holerite de {Outubro/2026} já está disponível no portal da Calenzano 👉 {link}

---

## 5. Portal do colaborador (`/colaborador/**`)

Layout próprio, fora do AppShell, mobile-first, fundo escuro com destaque verde. Seguir as rules de layout.

| Rota | Função |
|---|---|
| `/colaborador` | Redirect: logado → início; senão → login |
| `/colaborador/login` | CPF |
| `/colaborador/verificar` | Código de 6 dígitos (input com `autocomplete="one-time-code"`) |
| `/colaborador/inicio` | Card do holerite mais recente + destaque "Pendente de ciência" se houver |
| `/colaborador/holerites` | Histórico agrupado por ano |
| `/colaborador/holerites/[id]` | Visualizador do PDF + botão de download + bloco de ciência |

### Visualização e ciência
- `GET /api/colaborador/holerites/[id]/arquivo` devolve uma **signed URL de 5 minutos**, registra `PayslipAccessLog(view)` e, se for a primeira vez, seta `firstViewedAt` e status `VIEWED`.
- O bloco de ciência só aparece depois que o PDF foi aberto. Checkbox "Declaro que recebi e li meu holerite de {Outubro/2026}" + botão **Confirmar**.
- `POST /api/colaborador/holerites/[id]/ciencia`: grava `acknowledgedAt`, `ackIp`, `ackUserAgent`, `ackFileSha256` (igual ao `fileSha256` atual) e o log. Idempotente: segunda chamada não sobrescreve.
- Holerite `REVOKED` some da lista; o novo aparece no lugar com a etiqueta "Retificado".

---

## 6. Admin RH (`/rh/holerites`)

Dentro do AppShell, seguindo as rules de layout/roles.

| Rota | Função |
|---|---|
| `/rh/holerites` | Seletor de competência + cards (Publicados · Abertos · Com ciência · Pendentes) + tabela por funcionário com filtro de loja/status |
| `/rh/holerites/lotes/novo` | Competência + tipo + upload |
| `/rh/holerites/lotes/[id]` | Conferência e publicação (seção 4) |
| `/rh/funcionarios/[id]` (aba nova) | Holerites do funcionário + status do portal (último login, botão "Encerrar sessões", habilitar/desabilitar portal) |

Ações por holerite publicado:
- **Ver PDF** (signed URL de 5 min + log `rh/view`).
- **Revogar** (exige motivo; vira `REVOKED` com log). Holerite com ciência **não pode ser apagado**, só retificado por um novo lote.
- **Reenviar aviso** pelo WhatsApp (1 clique, com rate limit).
- Apagar: só se `DRAFT` (análogo ao `canRhDeleteQuinzena`).

---

## 7. Permissões

Em `rh-permissions.ts`:

```
payslips.view · payslips.upload · payslips.publish · payslips.revoke · payslips.portal_manage
```

- **Toda** rota `/api/rh/holerites/**` chama `requireRhPermission(<permissão específica>)`. Nada de só `rhRequireModuleUser` (nos riders, `approve_docs` foi declarada e nunca aplicada; aqui não pode repetir).
- Cadastrar a ferramenta **"Holerites"** no painel Plateful Admin. Ferramenta desligada no painel não aparece no menu nem abre, para qualquer conta.
- Teste: um usuário RH sem `payslips.publish` recebe 403 no endpoint de publicar.

---

## 8. APIs (resumo)

**Portal (`/api/colaborador/**`)** (sempre filtrado pelo `funcionarioId` do JWT):
- `POST /auth/request-code` · `POST /auth/verify-code` · `DELETE /auth`
- `GET /holerites` (paginado, só `PUBLISHED | VIEWED | ACKNOWLEDGED`)
- `GET /holerites/[id]` · `GET /holerites/[id]/arquivo` · `POST /holerites/[id]/ciencia`

**RH (`/api/rh/holerites/**`)** (sempre filtrado pelo `userId` do tenant):
- `POST /lotes` (cria lote + devolve signed upload URLs)
- `POST /lotes/[id]/processar` · `GET /lotes/[id]` · `PATCH /lotes/[id]/vinculos` · `POST /lotes/[id]/publicar` · `DELETE /lotes/[id]` (só se não publicado)
- `GET /holerites?competencia=&loja=&status=` (paginado)
- `GET /holerites/[id]/arquivo` · `POST /holerites/[id]/revogar` · `POST /holerites/[id]/reenviar-aviso`
- `POST /funcionarios/[id]/portal` (habilitar/desabilitar/encerrar sessões)

**Regras que vêm da auditoria dos riders:**
- Respostas de listagem **nunca** incluem campos sensíveis (hash de código, tokens). Usar `select` explícito.
- Paginação em todas as listas.
- Queries independentes em `Promise.all`, não em sequência de awaits.
- Rate limit nas rotas de auth (Upstash ou tabela no Neon, o que o projeto já usar).

---

## 9. Variáveis de ambiente novas

```
EMPLOYEE_JWT_SECRET=
EMPLOYEE_OTP_PEPPER=
N8N_EMPLOYEE_OTP_WEBHOOK=
N8N_PAYSLIP_PUBLISHED_WEBHOOK=
N8N_WEBHOOK_SECRET=
SUPABASE_PAYSLIPS_BUCKET=payslips
```

---

## 10. Ordem de execução no Cursor

Cada etapa termina com build passando, testes passando e verificação manual. **Não** avançar com etapa quebrada.

1. **Schema + migration**: models, enums, índice parcial, campos novos em `Funcionario`, bucket privado.
   - ✅ `prisma migrate dev` ok; bucket existe e é privado.
2. **Auth do colaborador**: `employee-auth.ts`, rotas de auth, middleware, webhook n8n do código.
   - ✅ Login com CPF real recebe o código no WhatsApp; testes de isolamento passando; CPF inexistente devolve a mesma resposta.
3. **Ingestão**: criar lote, upload direto, processamento por página, vínculo por CPF.
   - ✅ Testado com um PDF consolidado real **e** com PDFs individuais; páginas sem CPF caem em "sem vínculo".
4. **Tela de conferência + publicação** + webhook de aviso.
   - ✅ Publicar muda status em transação; mensagens saem espaçadas no n8n.
5. **Portal do colaborador**: início, histórico, visualizador, ciência.
   - ✅ Ciência grava IP, UA e hash; segunda ciência não sobrescreve; A não vê holerite de B.
6. **Painel do RH**: visão por competência, revogar, reenviar, aba no funcionário.
   - ✅ Cards batem com a contagem real; holerite com ciência não pode ser apagado.
7. **Permissões + Plateful Admin**: permissões aplicadas em todas as rotas e ferramenta registrada.
   - ✅ Teste de 403 por permissão; ferramenta desligada some do menu.

---

## 11. Decisões em aberto (resolver antes da etapa 3 ou 5)

1. **Formato que a contabilidade entrega** (PDF único ou um por funcionário? O CPF aparece no texto ou é PDF escaneado/imagem?). Se for imagem, a extração por texto não funciona e vamos precisar de OCR ou vínculo manual. **Pedir um PDF real de amostra antes da etapa 3.**
2. **Funcionário desligado:** mantém acesso aos holerites antigos? Sugestão: acesso só leitura por 90 dias após a demissão e depois `portalStatus = disabled`. O RH pode reabrir.
3. **Retenção:** por quanto tempo guardar os PDFs no storage (alinhar com a contabilidade).
4. **Ciência eletrônica como comprovante de entrega:** confirmar com a contabilidade se o registro (data/hora, IP, hash) atende ao que eles precisam.
