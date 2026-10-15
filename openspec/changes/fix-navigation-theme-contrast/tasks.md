# Tasks

## 1. Correção em AdsBreadcrumb e AdsTabs

- [ ] 1.1 Em `packages/components/src/navigation.tsx`, dar aos links de `AdsBreadcrumb` as classes `text-text-muted hover:text-text` e mapear as classes do gatilho de `AdsTabs` por estado (ativo e inativo, sem utilidades conflitantes); verificar com testes em `packages/components/tests/navigation.test.tsx` que o gatilho ativo tem `bg-surface-selected`, `text-on-surface-selected` e `border-primary` e não tem `bg-transparent` nem `text-text-secondary`, que o inativo tem `text-text-secondary` e não tem `text-primary` nem `bg-surface-selected`, e que os links do breadcrumb têm `text-text-muted`.
- [ ] 1.2 Estender `packages/components/tests/styles.test.mjs` para verificar que as classes usadas (`text-text-secondary`, `hover:text-text`, `text-text-muted`, `bg-surface-selected`, `text-on-surface-selected`, `border-primary`) existem em `dist/styles.css`; verificar rodando `npm run build --workspace @admin-ds/components` e o teste.
- [ ] 1.3 Estender o teste de pares de contraste em `packages/tokens/tests/generation.test.mjs` com `text` e `textSecondary` contra `canvas`, `surface`, `surfaceRaised`, `surfaceMuted` e `surfaceHover`, e `onSurfaceSelected` contra `surfaceSelected`, a 4,5:1 nos dois temas; verificar que o teste passa e que falha ao reduzir temporariamente o contraste de um dos tokens.
- [ ] 1.4 Atualizar a story de navegação em `apps/docs/src/navigation.stories.tsx` com tabs e breadcrumb sobre superfície elevada nos temas claro e escuro; verificar que o Storybook compila (`npm run build --workspace @admin-ds/docs`, se existir).

## 2. Integração e documentação

- [ ] 2.1 Remover de `docs/limitations.md` o item de contraste insuficiente de `AdsBreadcrumb` e `AdsTabs` e adicionar a entrada `fix-navigation-theme-contrast` ao `CHANGELOG.md`, em `[0.0.2] - Em andamento`, na seção Changed (mudança visual intencional de tabs e breadcrumb); verificar que o texto descreve o que mudou.
- [ ] 2.2 Verificar no admin demo que a auditoria `axe-core` de `/componentes` passa nos dois temas, executando `CI=1 npx playwright test e2e/admin-demo-all-routes.spec.ts` sem alterar o teste; verificar que as 13 verificações passam.

## 3. Validação final

- [ ] 3.1 Executar `npx.cmd prettier --write` nos arquivos alterados (`npx prettier --write` fora do Windows), antes da validação final; verificar que o comando conclui sem erros.
- [ ] 3.2 Executar `npm run lint`, `npm run typecheck`, `npm run test:quiet` (usar `npm run test:verbose` para diagnóstico) e `npm run build`; verificar que todos passam.
- [ ] 3.3 Executar `npm run test:e2e` e confirmar que nenhum teste falha antes do commit (usar `npm run test:e2e:verbose` para diagnóstico). Fora do Windows, executar com `CI=1` para pular os snapshots visuais sem baseline e relatar que a validação visual não foi feita.
- [ ] 3.4 Executar `openspec.cmd validate --all --strict` (`openspec validate --all --strict` fora do Windows); verificar que passa.
- [ ] 3.5 Tarefa final: executar `npm run format`; verificar saída sem falhas.

## Workflow follow-up

- Arquivar esta change antes de `add-nextjs-admin-demo`, com sincronização da spec `navigation-structure`.
- Revisar e regenerar no Windows os snapshots visuais afetados (admin demo e Storybook) antes de aceitar.
