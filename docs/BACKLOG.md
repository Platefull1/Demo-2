# Backlog — Platefull

Pendências encontradas durante redesigns (não bloqueiam a entrega visual).

## Relatórios / Revisão de reclamações (out/2026)

- Hub `/relatorios` ainda usa tabelas HTML (não `DataTable`); ações em botões por linha em vez de menu “…”.
- Modais de “Novo relatório” / editar e formulário de grupos iFood: restyle superficial com tokens; candidato a `Dialog` shadcn completo.
- Enum de etiquetas inclui `PIZZA_VIRADA` além das 5 do brief visual; comportamento de lógica mantido (todas as chaves de `CATEGORIA_LABELS`).
- Busca e filtro “Na ata / Fora da ata” na revisão são client-side sobre dados já carregados (sem API nova).
- `Switch` base em `src/components/ui/switch.tsx` ainda usa hex legado no thumb/track; override local com `data-[state=checked]:bg-primary` na revisão.

## Design system

- Dívida residual de hex/amber em outras telas legadas fora do AppShell redesign.
- `docs/BACKLOG.md` criado nesta entrega (arquivo inexistente antes).
