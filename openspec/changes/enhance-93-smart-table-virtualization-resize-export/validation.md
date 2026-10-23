# Validação — issue #93

## Escopo

Perfil Critical, sobre `develop` `3592719` (após merge). Nenhuma dependência de runtime nova. Ambiente: Node 22.22.0 (o projeto exige 24) e npm 10.9.4, `npm ci --ignore-scripts`; Chromium 1243 do ambiente em vez da versão fixada pelo Playwright. Nenhum merge, archive ou fechamento de issue.

## Evidência local (na branch)

- `npm run build` (cinco workspaces, incluindo Storybook e Next.js), `npm run typecheck`, `npm run lint`, `npm run format` e `openspec validate --all --strict` (49 itens) passaram.
- `npm run test:quality` passou: 56 arquivos e 875 testes (inclui `smart-table-advanced`, SSR/hidratação, `axe` e cobertura de `AdsListFlow`), release, CI, skills e artefatos gerados.
- `inspect:packages` passou com o baseline atualizado de `@admin-ds/admin` (224766 bytes; ver `docs/bundle-baseline.md`).
- E2E completo no Chromium: 217 passaram e 7 falharam. As 7 falhas são `toHaveScreenshot` em `/componentes`, `/clientes`, `/clientes/novo`, `/preferencias`, na referência do admin-demo, no Admin Shell e em exibição de dados (diferença de cerca de 1% dos pixels). Os 7 testes novos de `e2e/smart-table-advanced.spec.ts` passaram, inclusive `axe` nos temas claro e escuro. Nenhum snapshot foi atualizado.

## Pendências e limitações

- As 7 falhas de snapshot **não foram atribuídas com certeza**: nenhuma dessas páginas usa as novas props, e o CSS novo só atinge `ads-smart-table-*` sob opt-in, mas a repetição na `develop` não foi conclusiva (a execução de comparação teve 49 falhas, muitas fora de snapshots, indicando interferência do ambiente). Os baselines são do Chromium fixado; é preciso rodar o E2E na CI, com a versão fixada, antes de qualquer decisão sobre snapshots.
- Node 24 e a CI no SHA final não foram executados aqui. Firefox e WebKit não foram executados.
- Não houve teste manual com leitor de tela real nem com zoom de 200%; os limites de altura fixa em pixels e da busca nativa estão documentados em `docs/limitations.md`.
- A tarefa 10 permanece aberta até a CI confirmar o E2E.

## Revisões

Revisões estáticas de contratos públicos e de acessibilidade. Aplicados: `aria-rowindex` no cabeçalho, linhas vizinhas à focada mantidas montadas, nome do cabeçalho sem a alça, `labels.resizeValue`, foco sem corte (`overflow: clip`), `scroll-padding-top` por densidade, `forced-colors` e cobertura via `AdsListFlow`. Não aplicados: reserva de espaço entre a alça e o botão de ordenação em colunas alinhadas ao fim, `rowHeight` em `rem`, reinício da rolagem ao trocar de página e feedback do botão "Exportar" (ficam como melhorias futuras).
