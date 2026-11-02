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
