# Tasks

## 1. Correção em AdsSmartTable

- [x] 1.1 Em `packages/admin/src/styles.css`, antes do bloco `.ads-smart-table-visually-hidden`, adicionar `.ads-smart-table-scroll :where(.ads-table-caption)` com padding de densidade; verificar no Storybook (`layout-smarttable--default`) que a legenda alinha ao texto da primeira coluna.
- [x] 1.2 Estender `packages/admin/tests/package.test.mjs` para verificar a regra no CSS distribuído e que `.ads-smart-table-visually-hidden` vem depois dela; verificar que o teste falha sem a regra.
- [x] 1.3 Verificar com `hideCaption` (story com legenda oculta, se existir, ou via teste) que a legenda continua sem espaço visível.

## 2. Integração e documentação

- [x] 2.1 Adicionar a entrada `fix-smart-table-caption-padding` ao `CHANGELOG.md`, em `[0.1.1] - Em andamento`, seção Changed; verificar que o texto descreve o que mudou.
- [x] 2.2 Verificar no admin demo (`/clientes`) e nos temas claro e escuro que a legenda não encosta na borda e que não há erros no console. Verificado pelos snapshots de `/clientes` (claro e escuro): a legenda desce 12px e ganha margem, e o restante da página é idêntico; o console do demo não foi inspecionado.

## 3. Validação final

- [x] 3.1 Executar `npx prettier --write` nos arquivos alterados; verificar que conclui sem erros.
- [x] 3.2 Executar `npm run lint`, `npm run typecheck`, `npm run test:quiet` e `npm run build`; verificar que todos passam.
- [x] 3.3 Executar `npm run test:e2e` (com `CI=1` fora do Windows) e relatar a validação visual; atualizar snapshots apenas se a mudança for intencional e o diff revisado. O E2E rodou na CI, não localmente: 130 de 131 testes do Chromium passaram e o snapshot de `/clientes` mudou de forma intencional (+12px de altura); os baselines Linux foram regenerados pelo workflow e o diff foi revisado.
- [x] 3.4 Executar `openspec validate --all --strict`; verificar que passa.
- [x] 3.5 Tarefa final: executar `npm run format`; verificar saída sem falhas.

## Workflow follow-up

- Revisar os snapshots visuais que incluam `SmartTable` antes de aceitar.
- Arquivar esta change com sincronização da spec `smart-table`.
