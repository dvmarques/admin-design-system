# Tasks

## 1. Demo

- [x] 1.1 Migrar `customers-pagination.tsx` para `renderPageLink` com `next/link`; verificar que não há `useRouter` nem interativos aninhados.
- [x] 1.2 Migrar `navigation-showcase.tsx` para `renderLink` com `next/link` em `AdsBreadcrumb` e `AdsNav`; verificar que o item com `onClick` continua um botão.
- [x] 1.3 Atualizar os testes E2E de `/clientes` para localizar páginas como `link` por nome acessível; revisar snapshots afetados (atualizar só se a mudança visual for intencional).

## 2. Documentação

- [x] 2.1 Atualizar `docs/integration.md` (seção de paginação) com o exemplo do demo e registrar em `CHANGELOG.md`.

## 3. Validação final

- [x] 3.1 `npx prettier --write` nos arquivos alterados.
- [x] 3.2 `npm run lint`, `npm run typecheck`, `npm run test:quiet` e `npm run build`.
- [x] 3.3 `CI=1 npm run test:e2e` sem falhas.
- [x] 3.4 `openspec validate --all --strict`.
- [x] 3.5 Tarefa final: `npm run format`.
