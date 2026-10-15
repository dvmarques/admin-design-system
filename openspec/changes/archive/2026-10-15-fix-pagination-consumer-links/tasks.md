# Tasks

## 1. AdsPagination

- [x] 1.1 Em `packages/components/src/pagination.tsx`, adicionar `renderPageLink` e o tipo `AdsPaginationLinkProps` (exportado em `index.ts`), reutilizando as classes do botão por helper interno em `button.tsx`; marcar `renderPage` como `@deprecated`; verificar em `navigation.test.tsx` que há um único link por destino, `aria-current`, classes de item, ausência de interativos aninhados e limites desabilitados.
- [x] 1.2 Adicionar a story `ConsumerLinks` em `apps/docs/src/navigation.stories.tsx`; verificar que o Storybook compila.
- [x] 1.3 Documentar em `docs/integration.md`, remover a entrada de `docs/limitations.md` e registrar em `CHANGELOG.md`; verificar o texto.

## 2. Validação final

- [x] 2.1 `npx prettier --write` nos arquivos alterados.
- [x] 2.2 `npm run lint`, `npm run typecheck`, `npm run test:quiet` e `npm run build`.
- [x] 2.3 `CI=1 npm run test:e2e` (fora do Windows, snapshots sem baseline são pulados).
- [x] 2.4 `openspec validate --all --strict`.
- [x] 2.5 Tarefa final: `npm run format`.
