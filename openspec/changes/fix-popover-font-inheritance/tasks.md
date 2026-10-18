# Tasks

## 1. Correção em AdsPopover e AdsDatePicker

- [ ] 1.1 Em `packages/components/src/overlay-anchored.tsx`, adicionar `font-sans` às classes do painel de `AdsPopover`; verificar em `packages/components/tests/overlay-anchored.test.tsx` que o `dialog` do popover aberto tem `font-sans`, como já verificado para o drawer e o toast.
- [ ] 1.2 Em `packages/components/tests/date-picker.test.tsx`, verificar que o `dialog` do calendário aberto tem `font-sans`; verificar que o teste falha ao remover temporariamente `font-sans` do popover.
- [ ] 1.3 Verificar que `dist/styles.css` contém `.font-sans` e que o painel do popover o usa, estendendo o teste de estilos distribuídos existente em `packages/components/tests/` apenas se ainda não houver cobertura; verificar com `npm run test --workspace @admin-ds/components`, que compila o CSS antes.
- [ ] 1.4 Verificar no Storybook (`npm run dev --workspace @admin-ds/docs`, stories `overlays-components--popover` e `forms-datepicker--single`) nos temas claro e escuro que o painel, o botão do popover e o calendário têm `font-family` igual ao token `--ads-typography-font-family`, e não `Times New Roman`; relatar o resultado.

## 2. Integração e documentação

- [ ] 2.1 Adicionar a entrada `fix-popover-font-inheritance` ao `CHANGELOG.md`, em `[0.1.1] - Em andamento`, seção Changed (mudança visual intencional onde o `body` não define a fonte); verificar que o texto descreve o que mudou.
- [ ] 2.2 Verificar no admin demo (`npm run dev --workspace @admin-ds/admin-demo`, `/componentes`) que popover e calendário continuam com a mesma aparência, nos dois temas, sem erros no console.

## 3. Validação final

- [ ] 3.1 Executar `npx.cmd prettier --write` nos arquivos alterados (`npx prettier --write` fora do Windows), antes da validação final; verificar que o comando conclui sem erros.
- [ ] 3.2 Executar `npm run lint`, `npm run typecheck`, `npm run test:quiet` (usar `npm run test:verbose` para diagnóstico) e `npm run build`; verificar que todos passam.
- [ ] 3.3 Executar `npm run test:e2e` e confirmar que nenhum teste falha antes do commit (usar `npm run test:e2e:verbose` para diagnóstico). Fora do Windows, executar com `CI=1` para pular os snapshots visuais sem baseline e relatar que a validação visual não foi feita; atualizar snapshots apenas se a mudança visual for intencional e o diff tiver sido revisado.
- [ ] 3.4 Executar `openspec.cmd validate --all --strict` (`openspec validate --all --strict` fora do Windows); verificar que passa.
- [ ] 3.5 Tarefa final: executar `npm run format`; verificar saída sem falhas.

## Workflow follow-up

- Revisar e regenerar no Windows os snapshots visuais de popover e datepicker, se existirem, antes de aceitar.
- Arquivar esta change com sincronização da spec `anchored-overlays`.
