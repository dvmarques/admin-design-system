## 1. Correção reutilizável

- [x] 1.1 Acrescentar regressões de componente e confirmar a falha original: dialog com popover, com calendário e com dropdown, `AdsConfirmDialog` com `pending`, `closeOnEscape={false}` no topo e ordem de abertura.
- [x] 1.2 Coordenar o Escape por uma pilha de camadas em `overlay-utils`, sem mudar APIs públicas, e adotar a pilha em `AdsDialog`/`AdsDrawer`, `AdsPopover` e `AdsDropdown`.

## 2. Consumo e documentação

- [x] 2.1 Documentar o comportamento numa story existente e acrescentar E2E com foco real no admin-demo público, cobrindo dialog com popover.

## 3. Validação

- [x] 3.1 Executar build, typecheck, lint e testes concisos; iniciar Storybook e demo para validar integração.
- [x] 3.2 Executar `npm run test:e2e` e registrar limitações de plataforma, sem atualizar baselines de snapshot.
- [x] 3.3 Formatar arquivos alterados, executar `npm run format` e `openspec.cmd validate --all --strict` e registrar os resultados.
