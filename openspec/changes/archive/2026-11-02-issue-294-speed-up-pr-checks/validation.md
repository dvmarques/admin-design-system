# Evidências da otimização da CI — issue #294

## Baseline observacional anterior

Três PRs Ready para `develop`, execuções de CI bem-sucedidas, tempos por logs dos
jobs (início/fim, **sem fila**). Não são a mesma revisão, nem têm cache equivalente.

- [PR #284, run 41339885867](https://github.com/dvmarques/admin-design-system/actions/runs/41339885867), 01/11/2026: Chromium 350 s, soma de jobs da CI 770 s.
- [PR #292, run 41445823938](https://github.com/dvmarques/admin-design-system/actions/runs/41445823938), 02/11/2026: Chromium 378 s, soma de jobs 944 s.
- [PR #293, run 41464172195](https://github.com/dvmarques/admin-design-system/actions/runs/41464172195), 02/11/2026: Chromium 370 s, soma de jobs 960 s.

Medianas: Chromium 370 s; soma de tempos de jobs 944 s. A soma mede carga de
runners, não duração de relógio. Tempo de espera em fila e custo cobrado não
estão disponíveis de forma reproduzível neste registro.

## Primeira validação após implementação

[PR #295 — CI run 41470126831](https://github.com/dvmarques/admin-design-system/actions/runs/41470126831),
02/11/2026, PR Ready para `develop`. Resultado final: CI success.

Chromium shard 1/2: 233 testes aprovados, job 203 s, mantendo o smoke de
tarballs em Next.js externo. Chromium shard 2/2: 226 testes aprovados, job
289 s. O conjunto reproduz os **459 testes** do Chromium da PR #293, sem
redução de cobertura por sharding. O check agregado `Fluxos no navegador`
aprovou somente após a conclusão de toda a matriz. Firefox: 26 testes aprovados,
job 100 s. WebKit: 26 testes descobertos, 25 aprovados e 1 skipped (comportamento
pré-existente), job 93 s.

Qualidade rápida: 141 s. Build/distribuição: 57 s. Política de develop/OpenSpec
estrito: 9 s. A soma dos jobs aprovados de CI foi 892 s, com tempo máximo
individual de 289 s (Chromium 2/2). Os artefatos de cobertura
`cobertura-node-ci` e `cobertura-vitest` foram publicados: 2.849.002 bytes e
432.474 bytes, respectivamente.

[Pages run 41470126893](https://github.com/dvmarques/admin-design-system/actions/runs/41470126893):
`Construir o site` success; `Publicar` skipped, como esperado numa PR.
[Security Gate run 41470127220](https://github.com/dvmarques/admin-design-system/actions/runs/41470127220):
CodeQL, npm audit e Gitleaks aprovados.

## Interpretação e riscos remanescentes

A comparação exploratória com a mediana do baseline indica diferença de
81 s no maior job Chromium (370 -> 289 s, aproximadamente -22%) e de
52 s na soma de jobs CI (944 -> 892 s, aproximadamente -5,5%).
Esses percentuais **não são ganhos comprovados ou causalmente isolados**:
há somente uma execução nova, revisões e condições de cache diferentes;
não há uma medição equivalente da fila nem três amostras pós-merge.

O smoke externo ficou no primeiro shard por exigir o browser real do container.
`test:quality` local foi preservado; a CI coleta cobertura ao executar cada
suíte uma única vez. Os required checks mantêm seus nomes, inclusive o
agregador fail-closed. A seleção docs-only de Pages e os cenários Draft,
falha/cancelamento de shard, PR de release e push protegido ainda exigem
evidência específica quando forem exercitados. Não fechar a issue #294 antes
das medições e cenários restantes.

## Rollback

Se um cenário especial revelar verde falso, teste ausente ou regressão, reverter
a mudança isolada na CI/Pages (ou a PR completa) preservando os checks
obrigatórios e registrando os links da falha. Não alterar snapshots nem
configurações de segurança para contornar falhas.

## Medição local de flags npm

Em 02/11/2026, no worktree Windows com Node 24.21.0 e npm 11.19.1, rodei
`npm ci --ignore-scripts --no-audit --no-fund` com cache npm isolado e depois
repeti as variantes para comparar o cache quente/frio. Uma única execução por
condição produziu:

| Cache  | Flags                  | Duração |
| ------ | ---------------------- | ------: |
| frio   | sem `--prefer-offline` |  27,2 s |
| quente | com `--prefer-offline` |  28,7 s |
| quente | sem `--prefer-offline` |  28,9 s |
| frio   | com `--prefer-offline` |  29,9 s |

As quatro observações não mostram vantagem mensurável para `--prefer-offline`;
diferenças de 0,2 s no cache quente são ruído de uma amostra e não sustentam
uma melhoria. Por isso, a flag foi removida dos jobs CI e Pages. O ambiente
local não reproduz runners/caches do GitHub Actions e não fornece custo de
runners. `--no-audit` continua restrito a instalações de validação: o workflow
Security Gate mantém o `npm audit` explícito sobre dependências de produção e
desenvolvimento, relatório, política high/critical e falha bloqueante.

Essa conclusão para a task 3.4 usa somente medições locais no Windows; uma nova
medição em runner Linux será acompanhada na issue #294 após a integração.

## Revisão externa e verificações locais desta execução

Revisão normal do Claude Code, em modo somente leitura, encontrou inicialmente
que um script auxiliar do agregador não seria encontrado porque `chromium-gate`
não faz checkout. A implementação foi corrigida para Bash inline, sem checkout,
mantendo falha para qualquer resultado diferente de `success`; o teste estático
verifica esse contrato e que o gate não depende de arquivos do repositório.
Uma segunda revisão do Claude não encontrou achados bloqueantes. O revisor
também confirmou os resumos de escopo docs-only e os limites de cancelamento.

No Windows, a validação completa passou por format, lint, builds, teste de saída
Storybook, verificação do peer opcional, typecheck e `test:quality` (80 arquivos
Vitest/1.511 testes; 120 testes Node e 18 skips deliberados). `test:e2e` executou
511 testes: 501 passaram, 1 foi skipped e 9 falharam porque as snapshots
`chromium-win32` não existem no repositório; os PNGs gerados localmente foram
removidos e nenhuma baseline foi atualizada. `build:pages` passou; o E2E Pages
teve 21 aprovações e 9 falhas com 404 em requisições RSC sob o subcaminho, no
servidor estático Windows. No head 9145fab, a CI Linux e o Pages passaram; essas limitações permanecem específicas da execução local descrita.

O WSL não está instalado. `verify:optional-peer` falhou apenas quando a primeira
tentativa usou o npm 12.2.1 do host; repetido com npm 11.19.1, passou. A correção
do teste de transferência de snapshots (`fileURLToPath`) fez os oito casos
passarem no Windows.

## Experimentos de Actions na PR #295

- [CI em Draft](https://github.com/dvmarques/admin-design-system/actions/runs/41505860812): todos os jobs, incluindo o agregador, ficaram skipped; [Pages](https://github.com/dvmarques/admin-design-system/actions/runs/41505860877) e [Security](https://github.com/dvmarques/admin-design-system/actions/runs/41505860849) também ficaram skipped.
- [CI anterior](https://github.com/dvmarques/admin-design-system/actions/runs/41505468788) foi cancelada após novo synchronize da mesma PR. A PR foi restaurada para Ready.
- [Falha controlada](https://github.com/dvmarques/admin-design-system/actions/runs/41506215952): uma etapa temporária reprovou Chromium 1/2; Chromium 2/2, Firefox e WebKit passaram e o agregador Fluxos no navegador falhou. O job de qualidade também falhou ao detectar a etapa temporária fora das condições esperadas. A etapa foi removida após o experimento.
- Docs-only, push e PR de release possuem testes de escopo com entradas simuladas executados no job de qualidade; isso não comprova eventos reais desses tipos no GitHub. A issue #294 acompanha essas evidências restantes.
