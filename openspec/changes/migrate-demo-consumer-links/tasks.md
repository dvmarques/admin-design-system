# Tasks

## 1. Demo

- [x] 1.1 Migrar `customers-pagination.tsx` para `renderPageLink` com `next/link`; verificar que não há `useRouter` nem interativos aninhados.
- [x] 1.2 Migrar `navigation-showcase.tsx` para `renderLink` com `next/link` em `AdsBreadcrumb` e `AdsNav`; verificar que o item com `onClick` continua um botão.
- [x] 1.3 Atualizar os testes E2E de `/clientes` para localizar páginas como `link` por nome acessível; revisar snapshots afetados (atualizar só se a mudança visual for intencional).
- [x] 1.4 Em `packages/components/src/button.tsx`, fazer o `AdsButton` herdar a fonte da página (`[font-family:inherit]` na classe base), o que cobre os botões de `AdsPagination` e torna o "Anterior" desabilitado igual aos links de `renderPageLink`; remover a exceção local de `pagination.tsx`; verificar em `button-and-loading-indicator.test.tsx` e `navigation.test.tsx` a classe, em `navigation-styles.test.ts` a utilidade no `dist/styles.css`, e regerar e revisar no Windows os snapshots afetados.

## 2. Documentação

- [x] 2.1 Atualizar `docs/integration.md` (seção de paginação) com o exemplo do demo e registrar em `CHANGELOG.md`.

## 3. Validação final

- [x] 3.1 `npx prettier --write` nos arquivos alterados.
- [x] 3.2 `npm run lint`, `npm run typecheck`, `npm run test:quiet` e `npm run build`.
- [x] 3.3 `CI=1 npm run test:e2e` sem falhas (o `CI=1` pula os snapshots visuais); no Windows, `npm run test:e2e` completo, com os snapshots visuais win32, também sem falhas.
- [x] 3.4 `openspec validate --all --strict`.
- [x] 3.5 Tarefa final: `npm run format`.
