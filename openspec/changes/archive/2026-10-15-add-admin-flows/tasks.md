## 1. API e tipos

- [x] 1.1 Definir tipos públicos (`AdsBulkActionBarProps`, `AdsBulkActionBarLabels`, `AdsListFlowProps`, `AdsStepFormProps`, `AdsStepFormLabels`, `AdsStepDefinition`, `AdsConfirmDialogProps`) sem `any` e exportá-los por `@admin-ds/admin`. Concluída quando passam no `typecheck`.

## 2. Componentes

- [x] 2.1 Implementar `AdsBulkActionBar` (região de anúncio sempre presente, barra só com seleção, limpar, `getFocusTargetOnEmpty`).
- [x] 2.2 Implementar `AdsConfirmDialog` sobre `AdsDialog` (foco inicial em "Cancelar", `destructive`, `pending` com `aria-disabled` e `Escape`/clique fora suspensos mesmo quando informados, foco nunca no `<body>`, `returnFocusRef`).
- [x] 2.3 Implementar `AdsListFlow` compondo `AdsFilterBar`, `AdsBulkActionBar`, `AdsSmartTable` e paginação (foco no cabeçalho ou na região da tabela quando a barra some).
- [x] 2.4 Implementar `AdsStepForm` (indicador, validação por etapa com alerta removido quando a etapa fica válida, foco e anúncio, etapas montadas, confirmação final, `submitting`).
- [x] 2.5 Adicionar estilos `ads-bulk-action-bar*`, `ads-list-flow*` e `ads-step-form*` em `packages/admin/src/styles.css`, com tokens, temas claro e escuro e telas estreitas, sem Tailwind.

## 3. Testes e documentação

- [x] 3.1 Testes de comportamento: barra (anúncio, ausência sem seleção, limpar), fluxo de listagem, confirmação (foco, Escape, confirmar/cancelar, `pending`, clique no fundo, origem removida), formulário em etapas (validação, foco, anúncio, dados preservados, confirmação final, controle estrito), SSR, `axe` e ausência de `next/*`; ajustar `package.test.mjs` e `verify-package.mjs` para o CSS novo.
- [x] 3.2 Stories no Storybook (listagem com ações e confirmação, formulário em etapas, com erro de etapa, estreita, tema escuro).
- [x] 3.3 Atualizar `docs/integration.md`, `docs/architecture.md`, `docs/limitations.md` e `CHANGELOG.md`.

## 4. Validação

- [x] 4.1 Executar `npm run format`, `lint`, `build`, `typecheck` (todos os workspaces), `test:quiet`, `inspect:packages`, `openspec validate --all --strict` e `npm run test:e2e`, confirmando que nenhum teste E2E falha.
- [x] 4.2 Registrar que os snapshots visuais têm baseline só `win32` (pulados na CI Linux, falham localmente fora do Windows) e que a change não adiciona nem altera baseline.
- [x] 4.3 Confirmar que nenhuma dependência de runtime foi adicionada e que `apps/admin-demo` não foi alterado.
- [x] 4.4 Validar o consumo do CSS compilado em Next.js (build de produção do `admin-demo` com página temporária não commitada, temas claro e escuro, estreita, sem erro de hidratação), restaurando `next-env.d.ts`.
- [x] 4.5 Atualizar `docs/bundle-baseline.json` e `docs/bundle-baseline.md`: `admin` 165809 em LF (`122232` +33670 fluxos +9907 R1); ver `docs/bundle-baseline.md`.

Notas de validação (Linux cloud, Node 22): `npm run format`, `lint`, `build`, `typecheck` (todos os workspaces), `test:quiet` e `test:quality` passaram; o Vitest do `admin` tem 122 testes, incluindo os desta change. `inspect:packages` excedeu o baseline de `@admin-ds/admin` (153584 > 120751) e o baseline foi atualizado e justificado em `docs/bundle-baseline.md`. No E2E (Chromium do Playwright em `/opt/pw-browsers`, via configuração temporária fora do repositório), 85 testes passaram e 7 falharam, todos snapshots visuais sem baseline `linux` (os baselines só existem para `win32`); nenhum baseline foi criado ou alterado, e o `npm run test:e2e` completo (com os snapshots `win32`) não pôde ser executado aqui. A 4.4 foi feita numa página temporária, não commitada, no build de produção do `admin-demo`, a 375 px, nos temas claro e escuro: sem rolagem horizontal, foco movido ao título da etapa e sem erro ou aviso de hidratação (apenas um 404 de recurso estático no tema claro, não relacionado). As stories também foram conferidas a 375 px (tema escuro) e 1100 px (claro) no Storybook estático. `openspec validate --all --strict` só reporta o warning pré-existente em `spec/date-picker`. Sem novas dependências de runtime; `apps/admin-demo` não foi alterado. Não foram feitas revisão manual com leitor de tela nem testes em outros navegadores.

Notas de validação (Windows, Node 24): o merge da `origin/develop` (`07da9ac`) não trouxe mudanças. A 3.1 foi completada com um teste do CSS dos fluxos em `package.test.mjs` e com testes do clique fora no `AdsConfirmDialog` (cancela sem `pending`, não cancela com `pending`). `npm ci` e `npm run validate` passaram: Vitest com 38 arquivos e 374 testes, `test:quality` 28/28 e E2E 92/92 com os snapshots `win32` existentes, sem baseline criado ou alterado. `openspec validate --all --strict` passou 39/39 no repositório e num clone descartável (só o INFO pré-existente em `spec/date-picker`). `inspect:packages` passou no worktree e num clone em LF (`core.autocrlf=false`): tokens 27039, components 272873 e admin 154132 bytes. A 4.4 foi repetida no build de produção do `admin-demo`, numa rota temporária já apagada: a 375 e 1100 px, nos temas claro e escuro, sem rolagem horizontal da página e sem erros no console; barra de ações com anúncio único, diálogo com foco inicial em "Cancelar", clique fora e `Escape` suspensos com `pending`, etapas com foco no título, dados preservados ao voltar e confirmação final.

Notas da revisão R1 (Linux cloud, Node 22): merge `origin/feat/smart-table` em `165357b` e `1be4a67` (R3); change `add-admin-flows` reativada (I1). Correções I3–I8 e S1–S3 no `packages/admin` (sem helpers do `admin-demo`). Baseline `admin` em clone LF com `dist/` limpo: **165809** = **122232** + **33670** (fluxos pré-R1) + **9907** (R1); `3326fc5` media **154132** na base smart-table antiga (+**1770** de `smart-table`/`styles` após merge da #67). Quebra R1: `confirm-dialog` +3584, `selection-focus` interno ~+2061, `step-form` +1864, `bulk-action-bar` +1418, `list-flow` +772, CSS +208. `CI=1 npm run validate`: Vitest 387, E2E 85 passaram e 7 `win32` pulados. OpenSpec 1.10.0 strict 39/39 (ativo e archive simulado).
