# Evidência histórica — validação incremental e impacto da CI

Registro preservado de `docs/ci-impact-validation.md` na issue #197, com origem em [change arquivada](../../openspec/changes/archive/2026-10-22-optimize-incremental-validation/) e medições documentadas no estado `97dc53d` (distribuição histórica, 54 primeiros-pai). Projeções não são medições de ganhos pós-merge; essa tarefa continua na [#164](https://github.com/dvmarques/admin-design-system/issues/164). Guia atual: [validação por impacto](../ci-impact-validation.md).

---

### Baseline medido (runs reais)

Evidências em `openspec/changes/archive/2026-10-22-optimize-incremental-validation/evidence/`. Medianas por job, em segundos:

| Job                            | PRs só de docs (3 runs; E2E **não** dispensado) | PRs de código (2 runs) |
| ------------------------------ | ----------------------------------------------: | ---------------------: |
| Qualidade rápida               |                                              99 |                     97 |
| Artefatos de distribuição      |                                               6 |                     52 |
| Fluxos no navegador (Chromium) |                                             133 |                    140 |
| Fluxos no navegador (Firefox)  |                                              79 |                     78 |
| Fluxos no navegador (WebKit)   |                                              78 |                     86 |
| Duração da execução            |                                             133 |                    140 |
| Tempo total de jobs            |                                             411 |                    466 |

Leitura: `Artefatos de distribuição` já era dispensado em PRs de docs (6 s contra 52 s), mas os três E2E não (≈ 290 s de jobs). Etapas de uma execução de código (job Chromium, 139 s): inicialização do container 26 s, `npm ci` 10 s, builds 16 s (tokens 1, components 4, admin 2, demo 9), Playwright 69 s. Qualidade rápida: `npm ci` 19 s, format 8 s, lint 4 s, builds 7 s, typecheck 11 s, `test:quality` 35 s.

### Distribuição histórica (verificável) e projeção

`node scripts/ci-impact.mjs --history 54 --ref origin/develop` classifica os 54 primeiros-pai de `develop` (estado `97dc53d`): `docs` 15 (28%), `scoped` apenas `apps/docs` 4 (7%), `scoped` com o demo 1 (2%), `full` 34 (63%).

**Projeção, não medição:** se o E2E de PRs de docs (15) e de PRs só do Storybook (4) fosse dispensado, cada PR economizaria ≈ 190 s de jobs (≈ 290 s de E2E menos ≈ 100 s de inicialização dos três containers) e ≈ 30 s de duração da execução em PRs de docs (E2E Chromium 133 s → Qualidade rápida 99 s como etapa mais longa). Não há ainda execução pós-mudança: a PR #175 altera `.github/` e `scripts/` e, por política, roda como `full`. Após o merge, as primeiras PRs só de docs fornecem o "depois" para o comando acima; até lá nenhum ganho é declarado como medido.

## Avaliado e não adotado

| Opção                                       | Motivo (dados medidos)                                                                                                                                      |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Compartilhar `dist` entre jobs por artefato | Economiza ≈ 16 s por job de E2E, mas exige upload/download e `needs`, serializando jobs hoje paralelos; a duração da execução não cai.                      |
| Dispensar testes/lint em PRs de docs        | Testes de conteúdo leem documentação e scripts (ex.: `token-override-docs`, `release-workflows`); não há equivalência demonstrada. Qualidade fica completa. |
| Cache de `node_modules`                     | `npm ci` leva 10–21 s com o cache `~/.npm` do `setup-node`; o ganho não justifica o risco de estado obsoleto.                                               |
| Pular o job inteiro de E2E                  | Em matriz, o check obrigatório deixaria de ser reportado; mantida a dispensa por etapa.                                                                     |

