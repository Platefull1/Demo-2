# Backlog — Platefull

Pendências encontradas durante redesigns (não bloqueiam a entrega visual).

## Auth / Camada 1 (out/2026)

- **Defesa em profundidade:** rotas sensíveis devem checar `canAccessTool` também no próprio handler, não só no middleware. O middleware cobre o prefixo; um handler sem checagem fica aberto se o mapa falhar ou se a rota for chamada internamente.
- **Dashboard / Visão geral:** métricas e vendas da dashboard ficam disponíveis a qualquer usuário logado (filtro pelas `user_apis` da conta, não pelo escopo de loja do RH). Avaliar restringir por loja (`lojas` do membro) para quem não é escritório.

## Estoque (out/2026) — PRIORIDADE ALTA

- Contagem: valores digitados e ainda não salvos ficam só em memória; se o app for fechado sem rede, são perdidos. Sugestão: rascunho local (IndexedDB/localStorage) por contagem/sessão, reenviado ao reabrir, com aviso de "valores pendentes de envio". (Uso real hoje: sinal ruim com o app aberto — fila de PATCH + keepalive; não há service worker.)

## Estoque / CMV Real — segurança e evolução (out/2026)

- **SEGURANÇA:** membros com `lojas=[]` e perfil diferente de `gerente_loja` ganham acesso a todas as lojas (fail-open em `storeScope`). Proposta: acesso total só com perfil explícito (`escritorio` / admin).
- **SEGURANÇA:** PATCH/DELETE de insumos e config do estoque são permitidos a qualquer membro do tenant, afetando todas as lojas. Proposta: restringir escrita a admin/escritório ou a uma permissão `estoque.config`.
- **Evolução:** `EstoqueContagem` usa `lojaNome` em texto livre; avaliar coluna `storeSlug` (migração não destrutiva) no futuro.

## Relatórios / Revisão de reclamações (out/2026)

- Hub `/relatorios` ainda usa tabelas HTML (não `DataTable`); ações em botões por linha em vez de menu “…”.
- Modais de “Novo relatório” / editar e formulário de grupos iFood: restyle superficial com tokens; candidato a `Dialog` shadcn completo.
- Enum de etiquetas inclui `PIZZA_VIRADA` além das 5 do brief visual; comportamento de lógica mantido (todas as chaves de `CATEGORIA_LABELS`).
- Busca e filtro “Na ata / Fora da ata” na revisão são client-side sobre dados já carregados (sem API nova).
- `Switch` base em `src/components/ui/switch.tsx` ainda usa hex legado no thumb/track; override local com `data-[state=checked]:bg-primary` na revisão.

## RH (out/2026)

- Telas ainda não redesenhadas (Blocos B/C): detalhe do funcionário, lojas, custos, escala, alertas, quadro, simulação, motoboys, bonificação, IA.
- `RhLojaCombobox` espelha o StoreCombobox visualmente, mas usa `Loja` do RH (StoreCombobox do dashboard é acoplado a iFood + sync).
- Keys React duplicadas no AppShell ao destacar `/rh/funcionarios` (pré-existente).
- Formulários de `FuncionarioForm` (campos legado) ainda podem ter hex interno — restyle superficial no Bloco A no shell da página novo.
- Usuários: estado 403 a alinhar; item no menu Mais permanece (permissão na página).

## CMV Real — refeições / venda Saipos (out/2026)

- Sync de refeições e venda Saipos no fechamento: UI pronta; confirmar tokens `SAIPOS_DATA_TOKEN_*` por loja em produção.
- Lançamento manual de refeição (`add_manual`) existe na API; ainda sem formulário na UI do fechamento.
- Regras `refeicaoRegras` / `vendaMesConfig` no `NfeConfig` usam defaults em código; tela de edição das regras ainda não existe.
- Export XLSX do fechamento ainda não inclui bloco de refeições / CMV líquido.

## Pontos (out/2026)

- `GET /api/pontos` agora devolve `ultimaSincronizacao` (max `updatedAt` do dia e da loja). Não há status de presença (trabalhando, intervalo, ausente, atrasado) nem coluna de horas no registro diário; a faixa de KPIs fica para quando esses status existirem.
- Pendências continuam globais (não filtradas pela data selecionada).

## Design system

- Dívida residual de hex/amber em outras telas legadas fora do AppShell redesign.
- `docs/BACKLOG.md` criado nesta entrega (arquivo inexistente antes).
