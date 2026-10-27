# Validação

## Divergência encontrada pelos testes

Antes da correção, os testes "ignora desabilitados (inclusive em `fieldset`)", "ignora ocultos", "ignora inertes" e "volta a Cancelar quando todos são inelegíveis" falhavam: `useOverlayFocus` focava o primeiro seletor focável sem checar elegibilidade. A composição padrão e o primeiro controle elegível já passavam. Os testes de retorno de foco, `returnFocusRef`, `pending`, `alertdialog`/`dialog` e `Escape` em camadas já existiam e seguem verdes.

## Orçamento de distribuição

`@admin-ds/components` (JS/CSS publicados): 189.409 B na develop → 190.139 B (+730 B, o helper é replicado nos chunks que incluem `overlay-utils`). O limite em `docs/browser-budget.json` sobe de 190.000 para 190.250 B; gzip e os demais limites permanecem.

## Execução local (Linux)

Passaram: `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quality` (1183 testes unitários, 28 + 107 testes de scripts, skills e tokens gerados) e a validação OpenSpec estrita (59 itens, com `@fission-ai/openspec@latest`, não a 1.15.0 fixada na documentação).

Limitações: `npm run test:e2e` não pôde ser executado, pois o Chromium instalado no ambiente não corresponde à versão do Playwright do projeto; E2E e snapshots ficam para a CI. Nenhum snapshot foi atualizado. A change foi desenvolvida na branch de trabalho da sessão, não em worktree isolada.
