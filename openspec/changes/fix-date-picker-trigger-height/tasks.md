# Tasks

## 1. Gatilho do calendário com a altura do campo

- [x] 1.1 Em `packages/components/src/date-picker.tsx`, aplicar ao gatilho `AdsButton` a classe `min-h-0!` e à linha `.ads-date-picker` a classe `[&>.ads-popover-anchor]:self-stretch`; verificar em `packages/components/tests/date-picker.test.tsx` que o gatilho de seleção única e o de intervalo têm essas classes em `sm`, `md` e `lg`, e que o teste falha ao removê-las temporariamente.
- [x] 1.2 Estender `packages/components/tests/form-controls-styles.test.ts` (ou o arquivo de estilos mais adequado) para verificar que `dist/styles.css` contém `.min-h-0\!` com `!important` e a regra de `self-stretch` do filho `.ads-popover-anchor`; verificar com `npm run test --workspace @admin-ds/components`, que compila o CSS antes.
- [x] 1.3 Estender `e2e/form-control-layout.spec.ts` com um `AdsDatePicker` real, montado com o CSS distribuído, em `sm`, `md` e `lg`, ao lado de um `AdsInput` do mesmo tamanho em uma grade; verificar em 1280px e 390px que a altura do gatilho é igual à do campo e que o topo do campo de data coincide com o do vizinho, e que o teste falha sem a correção.
- [x] 1.4 Verificar no Storybook (`layout-filterbar--default`, `forms-datepicker--single`, `--range` e `--states`), nos temas claro e escuro e em 1280px e 390px, que o topo de "Criado em" coincide com o de "Busca" e "Status", que gatilho e campo têm a mesma altura e que o foco visível do gatilho não é cortado.

## 2. Integração e documentação

- [x] 2.1 Adicionar a entrada `fix-date-picker-trigger-height` ao `CHANGELOG.md`, em `[0.1.1] - Em andamento`, seção Changed (mudança visual intencional da altura do gatilho do calendário); verificar que o texto descreve o que mudou.
- [x] 2.2 Rodar a varredura de geometria em todas as stories, nos dois temas e em 1280px e 390px, e relatar o resultado; verificar que não há achado de desalinhamento no `AdsDatePicker` e que nada novo apareceu.
- [x] 2.3 O admin demo não usa `AdsDatePicker` nem `AdsFilterBar`; verificar em todas as rotas do demo (`npm run start --workspace @admin-ds/admin-demo`), em claro e escuro, em 1280px e 390px, que não há rolagem horizontal nem erros no console (24 páginas verificadas, sem ocorrências).

## 3. Validação final

- [x] 3.1 Executar `npx.cmd prettier --write` nos arquivos alterados (`npx prettier --write` fora do Windows), antes da validação final; verificar que o comando conclui sem erros.
- [x] 3.2 Executar `npm run lint`, `npm run typecheck`, `npm run test:quiet` (usar `npm run test:verbose` para diagnóstico) e `npm run build`; verificar que todos passam.
- [ ] 3.3 Executar `npm run test:e2e` e confirmar que nenhum teste falha antes do commit (usar `npm run test:e2e:verbose` para diagnóstico). Fora do Windows, executar com `CI=1` para pular os snapshots visuais sem baseline e relatar que a validação visual não foi feita; se houver snapshot afetado, executar o workflow "Atualizar baselines visuais" na branch, revisar o diff e só então aceitar.
- [x] 3.4 Executar `openspec.cmd validate --all --strict` (`npx @fission-ai/openspec@1.10.0 validate --all --strict --no-interactive` fora do Windows, a versão fixada na CI); verificar que passa.
- [x] 3.5 Tarefa final: executar `npm run format`; verificar saída sem falhas.

## Workflow follow-up

- Arquivar esta change com sincronização da spec `date-picker`.
