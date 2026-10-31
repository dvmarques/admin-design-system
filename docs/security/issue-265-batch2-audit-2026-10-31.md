# Auditoria de dependências — issue #265, lote 2 (31/10/2026)

## Escopo e evidências

Esta auditoria registra a atualização incremental de Storybook 10.6.5, Playwright 1.64.1 e axe-core 4.14.0, vinculada à [PR #270](https://github.com/dvmarques/admin-design-system/pull/270) e à [issue #265](https://github.com/dvmarques/admin-design-system/issues/265).

- Baseline imutável: `develop` em `9775ffe71581483b3ab77056d6a2eddb90dd980b`, depois do merge do lote 1.
- Execução: [GitHub Actions #41157964299](https://github.com/dvmarques/admin-design-system/actions/runs/41157964299), 31/10/2026 às 02:01:24 UTC, Node `v24.22.1`, npm `11.19.1`.
- Evidência bruta: artefato `issue-265-batch2-npm-audit`, ID `13025873055`, disponível pelo Actions até 30/11/2026; contém os quatro arquivos JSON completos, códigos de saída e `summary.json`.
- Instalação reproduzível: `npm install --package-lock-only --ignore-scripts --no-audit --no-fund`, seguido de `npm ci --ignore-scripts --no-audit --no-fund` e `npm ls --depth=0`. O npm resolveu e conferiu explicitamente as cinco dependências diretas e as versões transitivas do Playwright.

## Resultado do npm audit

`npm audit --json` e `npm audit --json --omit=dev` foram executados na raiz de dois checkouts Git independentes, usando o mesmo ambiente Node/npm.

| Severidade | Antes (completo) | Antes (produção) | Depois (completo) | Depois (produção) |
| --- | ---: | ---: | ---: | ---: |
| Critical | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 |
| Moderate | 14 | 0 | 14 | 0 |
| Low | 0 | 0 | 0 | 0 |
| Info | 0 | 0 | 0 | 0 |
| Total | 14 | 0 | 14 | 0 |
| Código de saída | 1 | 0 | 1 | 0 |

Os **mesmos 14 pacotes** foram apontados no baseline e no lote 2. Não houve novos achados nem high/critical. A contagem inclui dependências que herdam os dois advisories principais, e não representa 14 vulnerabilidades independentes:

- [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4): `glob`, caminho de desenvolvimento de Storybook via `@joshwooding/vite-plugin-react-docgen-typescript`.
- [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249): `minimatch`, caminhos de tooling via ESLint, `@typescript-eslint/typescript-estree` e `glob`.

**Exposição e decisão:** as duas vulnerabilidades principais são moderadas, estão no grafo de desenvolvimento, e a consulta `--omit=dev` retornou zero achados. Isso não garante risco zero se ferramentas processarem entradas não confiáveis. Não foi executado `npm audit fix --force`, que no lote anterior propôs downgrades incompatíveis. Manter acompanhamento nos lotes seguintes da #265, restringindo entradas não confiáveis no tooling; hardening de workflows/digest cabe à #268 e gate automático à #267. Responsável: mantenedor da #265, com reavaliação nos próximos upgrades ou novo advisory; nenhuma reavaliação foi agendada aqui.

## Limites e validações

O `axe-core` 4.14.0 é um motor de verificação de acessibilidade e não um advisory. A atualização exige confirmar nomes acessíveis contendo as iniciais visíveis de conta/organização e não deve suprimir `label-content-name-mismatch`.

A sincronização da imagem `mcr.microsoft.com/playwright:v1.64.1-noble` em CI, Pages e baselines preserva a verificação contra a versão do lockfile; este lote **não** implementa a fixação por digest, o pin de Actions por SHA nem alterações de permissões, atividades da #268. A CI preserva Node 24, `engines.node >=24.0.0` e npm 11.19.1.

A conclusão técnica do lote 2 depende do resultado de CI, testes E2E (Chromium, Firefox, WebKit), cobertura, build Storybook e Pages no SHA final da PR. A existência do artefato de auditoria não equivale à aprovação desses testes.
