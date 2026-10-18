# Tasks

## 1. AdsSelect e AdsInput com a mesma altura em sm

- [ ] 1.1 Estender `e2e/form-control-layout.spec.ts` com um `AdsInput` e um `AdsSelect` reais, montados com o CSS distribuído, lado a lado em `sm`, `md` e `lg`; verificar em 1280px e 390px que os dois têm a mesma altura e o mesmo topo, e que o teste falha em `sm` antes da correção (30px contra 28px).
- [ ] 1.2 Em `packages/tokens/source/tokens.mjs`, alterar `dimension.fieldSm` de `1.75rem` para `1.875rem` e regenerar as saídas com `npm run generate --workspace @admin-ds/tokens`; verificar que `npm run check:generated --workspace @admin-ds/tokens` e os testes de `packages/tokens/tests` passam e que apenas o valor desse token mudou em `src/generated.ts` e `dist/tokens.css`.
- [ ] 1.3 Adicionar em `apps/docs/src/form.stories.tsx` uma story de tamanhos que renderize `AdsInput` e `AdsSelect` em `sm`, `md` e `lg` lado a lado; verificar no Storybook, nos temas claro e escuro, que `AdsSelect` `sm` mede 30px, igual ao `AdsInput`, que `AdsInput`, `AdsTextarea` e os tamanhos `md` e `lg` não mudaram, e que o gatilho do `AdsDatePicker` continua com a altura do campo em `sm`. Hoje nenhuma story, página do demo ou componente do `admin` renderiza `AdsSelect` com `size`.

## 2. Orientação para botões ao lado de campos

- [ ] 2.1 Em `docs/integration.md`, adicionar uma seção sobre botões ao lado de campos com as alturas por tamanho (botão 32, 36 e 40px; campo 30, 32 e 36px), a orientação de alinhamento (`align-items: stretch` ou alinhar pelo topo e aceitar a diferença) e o aviso de que um `AdsButton` em `startContent` ou `endContent` de `AdsInputGroup` faz o campo crescer (34, 38 e 42px); verificar que cada número do texto bate com a medição feita com os componentes reais.

## 3. Integração e documentação

- [ ] 3.1 Adicionar a entrada `fix-select-sm-height-and-document-field-button-pairing` ao `CHANGELOG.md`, em `[0.1.1] - Em andamento`, seção Changed (valor do token `--ads-dimension-field-sm` e altura do `AdsSelect` `sm`); verificar que o texto descreve o que mudou.
- [ ] 3.2 Rodar a varredura de geometria em todas as stories, nos dois temas e em 1280px e 390px, e relatar o resultado; verificar que não surgiu achado novo.
- [ ] 3.3 Verificar no admin demo (`npm run start --workspace @admin-ds/admin-demo`), em todas as rotas, em claro e escuro, em 1280px e 390px, que não há rolagem horizontal nem erros no console.

## 4. Validação final

- [ ] 4.1 Executar `npx.cmd prettier --write` nos arquivos alterados (`npx prettier --write` fora do Windows), antes da validação final; verificar que o comando conclui sem erros.
- [ ] 4.2 Executar `npm run lint`, `npm run typecheck`, `npm run test:quiet` (usar `npm run test:verbose` para diagnóstico) e `npm run build`; verificar que todos passam.
- [ ] 4.3 Executar `npm run test:e2e` e confirmar que nenhum teste falha antes do commit (usar `npm run test:e2e:verbose` para diagnóstico). Fora do Windows, executar com `CI=1` para pular os snapshots visuais sem baseline e relatar que a validação visual não foi feita; se algum snapshot mudar, executar o workflow "Atualizar baselines visuais" na branch, revisar o diff e só então aceitar.
- [ ] 4.4 Executar `openspec.cmd validate --all --strict` (`npx @fission-ai/openspec@1.10.0 validate --all --strict --no-interactive` fora do Windows, a versão fixada na CI); verificar que passa.
- [ ] 4.5 Tarefa final: executar `npm run format`; verificar saída sem falhas.

## Workflow follow-up

- Arquivar esta change com sincronização das specs `form-controls` e `component-documentation`.
