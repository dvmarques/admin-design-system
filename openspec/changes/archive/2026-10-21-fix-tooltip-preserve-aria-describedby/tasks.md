# Tasks

## 1. Correção em AdsTooltip

- [x] 1.1 Em `packages/components/src/overlay-anchored.tsx`, compor o `aria-describedby` do gatilho com o id do consumidor e o do tooltip; verificar que o gatilho sem o atributo continua recebendo só o id do tooltip.
- [x] 1.2 Em `packages/components/tests/overlay-anchored.test.tsx`, cobrir gatilho com `aria-describedby` aberto por foco e por hover, e o retorno ao original ao fechar, inclusive após Escape; verificar que os testes falham sem a correção.

## 2. Documentação e integração

- [x] 2.1 Adicionar story de `AdsTooltip` com gatilho que já possui `aria-describedby` em `apps/docs/src/overlay.stories.tsx`; verificar que renderiza no Storybook.
- [x] 2.2 Adicionar a entrada `fix-tooltip-preserve-aria-describedby` ao `CHANGELOG.md`, em `[0.1.1] - Em andamento`, seção Changed.

## 3. Validação final

- [x] 3.1 Executar `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck` e `npm run test:quiet`; verificar que passam.
- [x] 3.2 Executar os E2E relevantes e relatar o que não pôde rodar localmente. `e2e/overlay.spec.ts` passou localmente (3 de 3) no Chromium; os snapshots visuais ficam para a CI.
- [x] 3.3 Executar `openspec validate --all --strict`; verificar que a change passa.
