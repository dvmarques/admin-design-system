# Tasks

## 1. Vários botões no adendo

- [x] 1.1 Em `packages/components/src/field.tsx`, adicionar a sobreposição de 1px entre botões e as quinas internas retas por posição (`:not(:first-child)`, `:not(:last-child)`); verificar no Storybook que dois botões medem a altura do campo, ficam contíguos e só a quina externa é arredondada.
- [x] 1.2 Em `packages/components/tests/form-controls.test.tsx`, verificar as classes de dois botões no adendo inicial e no final; verificar que o teste falha sem a mudança.
- [x] 1.3 Em `e2e/form-control-layout.spec.ts`, verificar sem reset de CSS que dois botões no fim do grupo têm a altura do campo, o mesmo topo e a junção de 1px, em `sm`, `md` e `lg`, no desktop e no mobile; verificar que falham sem a mudança.
- [x] 1.4 Verificar que um adendo com um só botão e adendos de texto não mudam (alturas e quinas do Storybook e testes existentes).

## 2. Integração e documentação

- [x] 2.1 Adicionar à story `InputGroupWithButton` uma linha com dois botões por tamanho; verificar que aparece no Storybook.
- [x] 2.2 Atualizar `docs/integration.md` com o exemplo de dois botões e o limite do conteúdo misto; verificar que o texto bate com o comportamento medido.
- [x] 2.3 Adicionar a entrada `add-input-group-multiple-button-addons` ao `CHANGELOG.md`, em `[0.1.1] - Em andamento`, seção Changed; verificar que o texto descreve o que mudou.

## 3. Validação final

- [x] 3.1 Executar `npx prettier --write` nos arquivos alterados; verificar que conclui sem erros.
- [x] 3.2 Executar `npm run lint`, `npm run typecheck`, `npm run test:quiet` e `npm run build`; verificar que todos passam.
- [ ] 3.3 Executar `npm run test:e2e` (com `CI=1` fora do Windows) e relatar a validação visual; atualizar snapshots apenas se a mudança for intencional e o diff revisado.
- [x] 3.4 Executar `openspec validate --all --strict`; verificar que passa.
- [x] 3.5 Tarefa final: executar `npm run format`; verificar saída sem falhas.

## Workflow follow-up

- Revisar os snapshots visuais que incluam `AdsInputGroup` antes de aceitar.
- Arquivar esta change com sincronização das specs `form-controls` e `component-documentation`.
