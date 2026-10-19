# Tasks

## 1. Correção no admin demo

- [x] 1.1 Em `apps/admin-demo/app/globals.css`, trocar `1fr` por `minmax(0, 1fr)` nos cinco grids da media query de telas estreitas; em `apps/admin-demo/app/navigation-showcase.tsx`, aplicar a mesma coluna ao grid interno; verificar em 320px que `/componentes` não rola na horizontal.
- [x] 1.2 Em `e2e/admin-demo-all-routes.spec.ts`, incluir 320px nas larguras verificadas; verificar que o teste falha em `/componentes` nos dois temas sem a correção e passa com ela.
- [x] 1.3 Verificar a paginação do painel de navegação em 320px: rola dentro do painel, sem cortar controles nem alargar a página.
- [x] 1.4 Auditar todas as rotas em 320, 390, 768, 1024 e 1440px, nos dois temas; verificar que não há rolagem horizontal da página nem elemento fora da viewport sem contêiner rolável.

## 2. Integração e documentação

- [x] 2.1 Adicionar a entrada `fix-demo-narrow-width` ao `CHANGELOG.md`, em `[0.1.1] - Em andamento`, seção Changed; verificar que o texto descreve o que mudou.

## 3. Validação final

- [x] 3.1 Executar `npx prettier --write` nos arquivos alterados; verificar que conclui sem erros.
- [x] 3.2 Executar `npm run lint`, `npm run typecheck`, `npm run test:quiet` e `npm run build`; verificar que todos passam.
- [x] 3.3 Executar `npm run test:e2e` (com `CI=1` fora do Windows) e relatar a validação visual; atualizar snapshots apenas se a mudança for intencional e o diff revisado. O E2E completo rodou na CI (Chromium, Firefox e WebKit) e passou, inclusive os snapshots visuais do demo, sem mudança; localmente rodei o E2E de todas as rotas (13 de 13 com 320px).
- [x] 3.4 Executar `openspec validate --all --strict`; verificar que passa.
- [x] 3.5 Tarefa final: executar `npm run format`; verificar saída sem falhas.

## Workflow follow-up

- Arquivar esta change com sincronização da spec `admin-demo-application`.
