## 1. Biblioteca reutilizável

- [x] 1.1 Acrescentar regressões de AdsPopover, confirmar falha original e restringir alternância ao gatilho preservando handlers, propagação, Escape, clique externo e fechamento controlado.
- [x] 1.2 Remover o contorno local de AdsDatePicker e validar navegação de mês, seleção única e intervalo com testes de componente.

## 2. Consumidores e navegador

- [x] 2.1 Documentar o contrato e demonstrar conteúdo interativo no Storybook e no demo por APIs públicas; acrescentar regressões E2E de Popover e DatePicker, com teclado, axe, temas e viewports.

## 3. Validação

- [x] 3.1 Executar build, tipos, testes de qualidade, lint e consumo dos apps; registrar eventual falha preexistente de worktrees sem ampliar escopo.
- [x] 3.2 Executar npm run test:e2e sem falhas funcionais, preservando baselines Linux e registrando limitações da plataforma; diagnóstico com npm run test:e2e:verbose quando necessário.
- [x] 3.3 Formatar arquivos alterados com npx.cmd prettier --write, executar npm run format e openspec.cmd validate --all --strict; registrar resultados para revisão.
