# Validação — issue #93

## Escopo

Perfil Critical, sobre `develop` `6dc0e96` (após merge). Nenhuma dependência de runtime nova. Ambiente: Node 22.22.0 (o projeto exige 24) e npm 10.9.4, `npm ci --ignore-scripts`; Chromium 1243 do ambiente em vez da versão fixada pelo Playwright. Nenhum merge, archive ou fechamento de issue.

## Evidência local (na branch)

- `npm run build` (cinco workspaces, incluindo Storybook e Next.js), `npm run typecheck`, `npm run lint`, `npm run format` e `openspec validate --all --strict` (49 itens) passaram.
- `npm run test:quality` passou: 56 arquivos e 875 testes (inclui `smart-table-advanced`, SSR/hidratação, `axe` e cobertura de `AdsListFlow`), release, CI, skills e artefatos gerados.
- `inspect:packages` passou com o baseline atualizado de `@admin-ds/admin` (236799 bytes; ver `docs/bundle-baseline.md`).
- E2E local completo no Chromium do ambiente: 217 passaram e 7 falharam (snapshots; resolvido na CI, ver abaixo). As 7 falhas são `toHaveScreenshot` em `/componentes`, `/clientes`, `/clientes/novo`, `/preferencias`, na referência do admin-demo, no Admin Shell e em exibição de dados (diferença de cerca de 1% dos pixels). Os 7 testes novos de `e2e/smart-table-advanced.spec.ts` passaram, inclusive `axe` nos temas claro e escuro. Nenhum snapshot foi atualizado.

## CI (head `acae4f3`)

"Qualidade rápida", "Política de develop", "Artefatos de distribuição" e "Fluxos no navegador" (Chromium, Firefox e WebKit) passaram; "Validação de release" foi pulada, como esperado fora de release. O E2E completo no Chromium fixado passou, inclusive os snapshots que falharam no ambiente local (diferença do Chromium e do Node locais, sem alteração de baseline). Revisão humana técnica aprovada no mesmo commit, após a correção do foco por id.

## Limitações

- Node 24 e a execução local de Firefox e WebKit não foram feitos fora da CI.
- Não houve teste manual com leitor de tela real nem com zoom de 200%; os limites de altura fixa em pixels e da busca nativa estão documentados em `docs/limitations.md`.

## Revisões

Revisões estáticas de contratos públicos e de acessibilidade. Aplicados: `aria-rowindex` no cabeçalho, linhas vizinhas à focada mantidas montadas, nome do cabeçalho sem a alça, `labels.resizeValue`, foco sem corte (`overflow: clip`), `scroll-padding-top` por densidade, `forced-colors` e cobertura via `AdsListFlow`. Não aplicados: reserva de espaço entre a alça e o botão de ordenação em colunas alinhadas ao fim, `rowHeight` em `rem`, reinício da rolagem ao trocar de página e feedback do botão "Exportar" (ficam como melhorias futuras).
