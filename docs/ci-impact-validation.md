# Validação por impacto na CI e localmente

Entregue pela issue #164. Reduz **somente** trabalho comprovadamente irrelevante em PRs para `develop`, sem alterar os checks obrigatórios. Decisões e requisitos: `openspec/changes/archive/2026-10-22-optimize-incremental-validation/`.

## Como funciona

`scripts/ci-impact.mjs` classifica os arquivos alterados:

| Resultado | Quando                                                                                                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs`    | Todos os arquivos são documentação (`isDocsFile`, em `scripts/ci-changed-paths.mjs`).                                                                                       |
| `scoped`  | Há arquivos de workspaces (`apps/*`, `packages/*`), exceto o `package.json` do workspace; `affected` traz o fecho de dependentes, em ordem de dependência.                  |
| `full`    | Qualquer outra situação: caminho desconhecido, inseguro ou global (`scripts/`, `.github/`, `e2e/`, lockfile, configs), manifestos inválidos ou cíclicos, falha de detecção. |

Os workspaces vêm dos padrões `workspaces` da raiz. O grafo usa `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies` e as dependências implícitas `components → tokens` e `admin → tokens` (`implicitDependencies`). O teste `no workspace references another one outside the dependency graph` falha se surgir outra referência (nome de pacote ou import relativo) fora do grafo.

## Matriz normativa de eventos e impacto

| Evento / estado                                          | Política e qualidade                       | Build de apps / E2E da CI principal                                                | Pages (build + E2E Pages)                              |
| -------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------ |
| PR Draft para `develop` ou `master`                      | Checks de PR skipped                       | Checks skipped, nenhum teste executado                                             | Job de PR skipped (somente PR para develop)            |
| PR Ready para `develop`, impacto `docs`                  | Qualidade completa e política de develop   | Jobs concluídos com etapas dispensadas (`docs_only`), sem builds, E2E ou snapshots | Executa integralmente em PR para develop, sem publicar |
| PR Ready para `develop`, impacto `scoped`                | Qualidade completa e política de develop   | Builds de pacotes e inspeção; apps/E2E somente se afetados                         | Executa integralmente em PR para develop, sem publicar |
| PR Ready para `develop`, impacto `full` ou indeterminado | Qualidade completa e política de develop   | Builds, inspeção e E2E completos, snapshots Chromium                               | Executa integralmente em PR para develop, sem publicar |
| PR Ready para `master`                                   | Qualidade completa e `release-check`       | Completo, sem dispensa por impacto                                                 | Sem gatilho de PR para master                          |
| Push para `develop`                                      | Qualidade e jobs da CI principal completos | Completo, sem dispensa por impacto                                                 | Build, teste e publicação no Pages                     |
| Push para `master`                                       | Qualidade e jobs da CI principal completos | Completo, sem dispensa por impacto                                                 | Sem gatilho de push para master                        |

O workflow `pages.yml` não usa `ci-scope`: em PR Ready para develop ele constrói o
site estático e roda o E2E Pages mesmo quando a CI principal dispensa etapas por
impacto `docs`. Ele (corrigido na #189 / PR #190) valida build estático
e `test:e2e:pages` em PR Ready para develop; publicar é reservado ao push em
`develop`. Um check **successful** cujo job dispensou etapas não equivale a build
ou testes executados: leia o resumo do scope e as etapas efetivamente rodadas.
Atualizar baselines visuais não faz parte deste fluxo de documentação e só ocorre
pelo workflow manual Linux.

## O que a CI dispensa

`scripts/ci-scope.mjs` (usado pelos jobs `build` e `e2e`) escreve `docs_only`, `build_docs`, `build_demo` e `e2e` somente quando o evento é `pull_request` para `develop` e o diff é identificável. Push, PR para `master` (release) e qualquer falha executam tudo.

| Etapa                                                               | `docs` | `apps/docs` apenas | demais `scoped` | `full` |
| ------------------------------------------------------------------- | :----: | :----------------: | :-------------: | :----: |
| `Qualidade rápida` (format, lint, build, typecheck, `test:quality`) |   ✅   |         ✅         |       ✅        |   ✅   |
| `Política de develop` (política e OpenSpec estrito)                 |   ✅   |         ✅         |       ✅        |   ✅   |
| Build dos pacotes, geração de tokens e `inspect:packages`           |   —    |         ✅         |       ✅        |   ✅   |
| Build do Storybook                                                  |   —    |         ✅         |   se afetado    |   ✅   |
| Build do admin demo                                                 |   —    |         —          |   se afetado    |   ✅   |
| E2E Chromium, Firefox e WebKit                                      |   —    |         —          |   se afetado    |   ✅   |

Garantias:

- Os jobs dispensam **etapas**, não jobs: os nomes dos checks obrigatórios continuam sendo reportados (um job de matriz pulado por `if` não reporta os nomes `Fluxos no navegador (...)`). Custo: a inicialização do container (≈ 30 s por job de E2E).
- Condições usam `!= 'false'`: saída ausente executa tudo.
- O E2E só é dispensado quando `apps/admin-demo` está fora do fecho de impacto. O Playwright serve e testa apenas o demo; o teste `skipping E2E is equivalent...` falha se a configuração ou os specs passarem a depender de outro workspace.
- A validação completa continua a cada push em `develop`/`master` e em PRs de release; é ela que garante a premissa de base verde das PRs `scoped`.
- O resumo do job `Qualidade rápida` mostra a decisão e o que foi dispensado.

### Bug corrigido: dispensa de E2E em container

Nos jobs de E2E (container Playwright), o `git` falhava e `docs_only` caía em `false` sem aviso (`error: Could not access 'HEAD^1'` no script antigo); desde a #172, toda PR só de documentação executava os três E2E (ex.: run 39806673826 da #173, 185 testes no Chromium). A causa **não** era o checkout raso: o container roda como root sobre um checkout de outro usuário, e o `safe.directory` que o `actions/checkout` grava fica em um `HOME` temporário, descartado antes dos passos seguintes; todo comando `git` falha com `detected dubious ownership`. Na CI, `ci-impact.mjs` passa `-c safe.directory=<checkout>` apenas aos seus comandos de leitura. O valor precisa ser o caminho exato, **sem barra final** (o diretório padrão dos scripts termina em barra; o git 2.43 não aceita), o que a primeira tentativa de correção não tratou e a CI revelou. O motivo da decisão agora inclui o stderr do git, e o teste `a checkout owned by another user...` reproduz o container (rodando como root) e falha sem a correção. Confirmado na CI: no job de Firefox, o passo `ci-scope` informa `mode: full` com o motivo `caminho fora dos workspaces e da documentação: .github/workflows/ci-metrics.yml`, em vez de `detecção indisponível`.

Os jobs fazem checkout completo e `listPullRequestFiles` usa o commit de merge (primeiro pai = base); se o `HEAD` não for um merge de PR, o resultado é `full`.

## Uso local (opcional)

```bash
npm run validate:impact          # lint + typecheck + testes focais
npm run validate:impact:lint
npm run validate:impact:types
npm run validate:impact:test
node scripts/validate-impact.mjs test --dry-run   # mostra o plano
node scripts/validate-impact.mjs test --verbose   # saída completa
node scripts/ci-impact.mjs --files                # classificação e arquivos
```

Compara a árvore de trabalho (incluindo arquivos não rastreados) com o ancestral comum de `origin/develop` (ou `--base REV`, `IMPACT_BASE`). `typecheck` e testes constroem antes os pacotes em ordem topológica (≈ 9 s). Sem base ou em caso de dúvida, usa os mesmos comandos da CI (`npm run lint`, `npm run typecheck`, `npm run test:quality`). A saída é concisa; falhas mostram o final do log e `--verbose` transmite tudo. **Não substitui `npm run validate` antes de abrir ou atualizar uma PR.**

## Medição antes/depois

```bash
node scripts/ci-metrics.mjs --repo dvmarques/admin-design-system --before ID,ID,ID --after ID,ID,ID
node scripts/ci-metrics.mjs --before-file antes.json --after-file depois.json
```

Também há o workflow manual **Métricas de CI** (`ci-metrics.yml`, somente leitura), que grava a tabela no resumo. Mede duração por job (início a fim, sem fila), tempo total de jobs, duração da execução, falhas e reruns; sinaliza amostras com menos de três execuções. Tokens e custo: **não disponível** (sem telemetria verificável; nada é estimado).

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

**Projeção, não medição:** se o E2E de PRs de docs (15) e de PRs só do Storybook (4) fosse dispensado, cada PR economizaria ≈ 190 s de jobs (≈ 290 s de E2E menos ≈ 100 s de inicialização dos três containers) e ≈ 30 s de duração da execução em PRs de docs (E2E Chromium 133 s → Qualidade rápida 99 s como etapa mais longa). Na PR #175, que altera `.github/` e `scripts/`, a CI rodou como `full` por política, então não serviu de "depois". Após o merge, as primeiras PRs só de docs forneceram o "depois": em três PRs (#200, #202, #203) o tempo total de jobs caiu de 411 s para 299 s (-27,3%) e os três E2E passaram de 78–133 s para 33–35 s, mas a duração da execução subiu 37 s, porque `Qualidade rápida` (99 s → 170 s) passou a ser a etapa mais longa por mudanças posteriores ao baseline. A projeção de ≈ 30 s a menos na duração da execução não se confirmou. Amostra pequena; detalhes em `openspec/changes/archive/2026-10-22-optimize-incremental-validation/evidence/medicao-pos-merge.md`.

## Avaliado e não adotado

| Opção                                       | Motivo (dados medidos)                                                                                                                                      |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Compartilhar `dist` entre jobs por artefato | Economiza ≈ 16 s por job de E2E, mas exige upload/download e `needs`, serializando jobs hoje paralelos; a duração da execução não cai.                      |
| Dispensar testes/lint em PRs de docs        | Testes de conteúdo leem documentação e scripts (ex.: `token-override-docs`, `release-workflows`); não há equivalência demonstrada. Qualidade fica completa. |
| Cache de `node_modules`                     | `npm ci` leva 10–21 s com o cache `~/.npm` do `setup-node`; o ganho não justifica o risco de estado obsoleto.                                               |
| Pular o job inteiro de E2E                  | Em matriz, o check obrigatório deixaria de ser reportado; mantida a dispensa por etapa.                                                                     |

## Limitações

- O grafo cobre `package.json`, as dependências implícitas conhecidas e referências textuais/relativas; não analisa imports dinâmicos montados em tempo de execução. O fallback `full` e a CI completa em `develop` limitam o risco.
- `scoped` em PRs reduz apenas builds de apps e E2E; não reduz a qualidade rápida.
- A projeção depende das medianas de poucas execuções (amostra insuficiente no sentido do relatório).
