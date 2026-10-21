## 1. Correção reutilizável

- [ ] 1.1 Acrescentar regressões do `AdsTooltip` e confirmar a falha original: Escape por foco, por apontamento, foco preservado, `aria-describedby`, reabertura apenas por novo gatilho, tooltip dentro de `AdsDialog` e com `AdsPopover` aberto.
- [ ] 1.2 Registrar o tooltip aberto na pilha de camadas de Escape e controlar o estado dispensado em `overlay-anchored`, sem mudar APIs públicas.
- [ ] 1.3 Acrescentar testes do `AdsDrawer` (esquerda e direita, `aria-modal`, foco preso, Escape e retorno de foco) e corrigir apenas as divergências encontradas.
- [ ] 1.4 Acrescentar regressão do painel de colunas do `AdsSmartTable` dentro de `AdsDialog` e `AdsDrawer`, sem alterar o mecanismo atual do painel.

## 2. Consumo e documentação

- [ ] 2.1 Atualizar as stories de Tooltip (Escape, tooltip dentro de diálogo) e Drawer, e registrar o comportamento no CHANGELOG e em `docs/` quando aplicável.
- [ ] 2.2 Acrescentar E2E com foco real no admin-demo público, cobrindo tooltip e diálogo.

## 3. Validação

- [ ] 3.1 Executar build, typecheck, lint e testes concisos; iniciar Storybook e demo; verificar temas claro e escuro, responsividade e `prefers-reduced-motion`.
- [ ] 3.2 Executar `npm run test:e2e` e registrar limitações de plataforma, sem atualizar baselines de snapshot.
- [ ] 3.3 Formatar arquivos alterados, executar `npm run format` e `openspec.cmd validate --all --strict` e registrar os resultados.
