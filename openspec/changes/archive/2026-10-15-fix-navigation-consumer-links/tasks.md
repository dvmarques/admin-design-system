# Tasks

## 1. AdsNav e AdsBreadcrumb

- [x] 1.1 Em `packages/components/src/navigation.tsx`, adicionar `renderLink` aos itens de `AdsNav` e `AdsBreadcrumb` e o tipo `AdsLinkRenderProps` (exportado em `index.ts`), com classes estáticas compartilhadas; verificar em `navigation.test.tsx` link único, `aria-current`, classes, ausência de interativos aninhados, item desabilitado e compatibilidade com `href`.
- [x] 1.2 A story `ConsumerLinks` em `apps/docs/src/navigation.stories.tsx` cobre os dois componentes; verificar que o Storybook compila.
- [x] 1.3 Documentar em `docs/integration.md`, remover a entrada de `docs/limitations.md` e registrar em `CHANGELOG.md`; verificar o texto.

## 2. Validação final

- [x] 2.1 `npx prettier --write` nos arquivos alterados.
- [x] 2.2 `npm run lint`, `npm run typecheck`, `npm run test:quiet` e `npm run build`.
- [x] 2.3 `CI=1 npm run test:e2e` (fora do Windows, snapshots sem baseline são pulados).
- [x] 2.4 `openspec validate --all --strict`.
- [x] 2.5 Tarefa final: `npm run format`.
