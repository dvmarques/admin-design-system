## 1. Correção reutilizável

- [x] 1.1 Acrescentar regressões que falham hoje: fundo inerte com `AdsDialog` e `AdsDrawer`, restauração ao fechar, `inert` anterior do consumidor, aninhamento, StrictMode e roots de popup e toast sem `inert`.
- [x] 1.2 Adicionar `layer` ao `OverlayPortal` (marca `data-ads-overlay-layer`) e usá-lo em `AdsDialog`, `AdsDrawer` e `AdsToast`, sem mudar APIs públicas.
- [x] 1.3 Implementar o registro de modais em `overlay-utils` (contagem por nó, estado anterior, só em efeitos) e registrá-lo pelo portal modal, com o cleanup antes da devolução de foco.
- [x] 1.4 Tratar nós de `body` criados ou substituídos durante o modal, a origem dos popups e a posse de `inert` alterada pelo consumidor, com regressões para cada caso.
- [x] 1.5 Devolver o foco a um alvo utilizável quando o modal de origem fecha antes de um modal aninhado, com regressão.
- [x] 1.6 Confirmar `AdsConfirmDialog` e o drawer do `AdsAdminShell` sem mudança de código e sem regressão de foco.

## 2. Consumo e documentação

- [x] 2.1 Acrescentar a story do fundo inerte (modal aninhado, popover aberto dentro do modal), registrar a mudança de comportamento no CHANGELOG, descrever o comportamento em `docs/integration.md` e as limitações em `docs/limitations.md`.
- [x] 2.2 Acrescentar E2E com foco real no Chromium sobre o admin-demo público: Tab, foco programático, árvore de acessibilidade, `axe` e restauração.

## 3. Validação

- [x] 3.1 Executar build, typecheck, lint e testes concisos; iniciar Storybook e demo; verificar temas claro e escuro, responsividade e `prefers-reduced-motion`.
- [x] 3.2 Executar `npm run test:e2e` e registrar limitações de plataforma, sem atualizar baselines de snapshot.
- [x] 3.3 Formatar arquivos alterados, executar `npm run format` e `openspec validate --all --strict` e registrar os resultados.
