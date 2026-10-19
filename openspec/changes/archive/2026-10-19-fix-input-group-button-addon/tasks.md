# Tasks

## 1. Correção em AdsInputGroup

- [x] 1.1 Em `packages/components/src/field.tsx`, ativar por `has-[>.ads-button]` as classes do adendo que removem borda, fundo e padding, esticam o botão (`min-h-0!`), arredondam só a quina externa, sobrepõem 1px e anulam o deslize de hover; verificar no Storybook (`forms-form-controls--input-group-with-button`) que grupo, campo e botão medem 30, 32 e 36px em `sm`, `md` e `lg`.
- [x] 1.2 Em `packages/components/tests/form-controls.test.tsx`, verificar as classes do adendo com botão e que o adendo de texto mantém a moldura; verificar que o teste falha sem as classes.
- [x] 1.3 Verificar com `npm run test:quiet --workspace @admin-ds/components` que o teste de classes de 1.2 passa. Não há teste do CSS distribuído para as classes novas: o Tailwind detecta fontes também em `tests/`, e as classes citadas no teste gerariam o CSS mesmo sem a correção; a guarda do comportamento é o E2E de 1.4.
- [x] 1.4 Em `e2e/form-control-layout.spec.ts`, verificar sem reset de CSS que grupo, campo e botão têm a altura do grupo com adendo de texto em `sm`, `md` e `lg`, no desktop e no mobile, e que o hover não desloca o botão.
- [x] 1.5 Verificar nos temas claro e escuro, com foco por teclado no botão, que o foco é visível; relatar o resultado.

## 2. Integração e documentação

- [x] 2.1 Adicionar a story `InputGroupWithButton` em `apps/docs/src/form.stories.tsx` (botão no início e no fim, três tamanhos, adendo de texto de referência); verificar que aparece no Storybook.
- [x] 2.2 Substituir em `docs/integration.md` o alerta sobre botão no adendo pela orientação de uso (altura do campo, `size` do botão, botão como único conteúdo, limite do filho direto); verificar que o texto bate com o comportamento medido.
- [x] 2.3 Adicionar a entrada `fix-input-group-button-addon` ao `CHANGELOG.md`, em `[0.1.1] - Em andamento`, seção Changed; verificar que o texto descreve o que mudou.
- [x] 2.4 Verificar no admin demo se algum `AdsInputGroup` com botão existe e continua correto; se não existir, registrar. O admin demo não usa `AdsInputGroup`; nada a verificar lá.

## 3. Validação final

- [x] 3.1 Executar `npx prettier --write` nos arquivos alterados; verificar que conclui sem erros.
- [x] 3.2 Executar `npm run lint`, `npm run typecheck`, `npm run test:quiet` e `npm run build`; verificar que todos passam.
- [x] 3.3 Executar `npm run test:e2e` (com `CI=1` fora do Windows) e relatar a validação visual; atualizar snapshots apenas se a mudança for intencional e o diff revisado. O E2E completo rodou na CI (Chromium, Firefox e WebKit) e passou, sem mudança de snapshot; localmente só o `form-control-layout` foi executado.
- [x] 3.4 Executar `openspec validate --all --strict`; verificar que passa.
- [x] 3.5 Tarefa final: executar `npm run format`; verificar saída sem falhas.

## Workflow follow-up

- Revisar os snapshots visuais que incluam `AdsInputGroup` antes de aceitar.
- Arquivar esta change com sincronização das specs `form-controls` e `component-documentation`.
