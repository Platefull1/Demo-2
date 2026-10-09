# Backlog — Platefull

Pendências encontradas durante redesigns (não bloqueiam a entrega visual).

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

## Design system

- Dívida residual de hex/amber em outras telas legadas fora do AppShell redesign.
- `docs/BACKLOG.md` criado nesta entrega (arquivo inexistente antes).
