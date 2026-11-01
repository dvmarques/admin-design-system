# Medição pós-merge: PRs só de documentação (tarefa 3.3)

Medição "depois" da validação por impacto (#164), com execuções reais do workflow CI (evento `pull_request`, base `develop`) de PRs só de documentação integradas depois do commit `91d47c9`. Dados brutos em `pos-merge-docs-prs.json`; baseline em `baseline-docs-prs.json`.

## Execuções

| PR   | Run (último head)                                                                        | Head      | Arquivos alterados                                | Conclusão |
| ---- | ---------------------------------------------------------------------------------------- | --------- | ------------------------------------------------- | --------- |
| #200 | [40225899757](https://github.com/dvmarques/admin-design-system/actions/runs/40225899757) | `38bb0dc` | `AGENTS.md`, `CHANGELOG.md`, `docs/`, `openspec/` | success   |
| #202 | [40228625135](https://github.com/dvmarques/admin-design-system/actions/runs/40228625135) | `534e7eb` | `CHANGELOG.md`, `docs/`, `openspec/`              | success   |
| #203 | [40230248797](https://github.com/dvmarques/admin-design-system/actions/runs/40230248797) | `6e86b2b` | `openspec/` (um arquivo)                          | success   |

Baseline (antes da mudança, PRs só de docs com E2E **não** dispensado): runs `39806673826`, `39807815321` e `39808620893`.

## Confirmação da dispensa

- Nos três runs, o passo `ci-scope` do job de Chromium registra `docs_only=true`, `build_docs=false`, `build_demo=false`, `e2e=false` e `{"mode":"docs","reason":"somente documentação"}`. Nenhum run informou `detecção indisponível`. O log foi lido apenas no job de Chromium; em Firefox e WebKit a dispensa foi confirmada pelos passos (setup, `npm ci`, builds e Playwright `skipped`).
- Os três jobs de E2E duram 33 a 48 s (container e checkout); `Artefatos de distribuição` também deixou de instalar e compilar.
- `Qualidade rápida` e `Política de develop` rodaram completas, com `openspec validate --all --strict`.

## Comparação

Gerada com `node scripts/ci-metrics.mjs --before-file evidence/baseline-docs-prs.json --after-file evidence/pos-merge-docs-prs.json`:

| Job (mediana)                  | Antes | Depois |      Diferença |
| ------------------------------ | ----: | -----: | -------------: |
| Fluxos no navegador (Chromium) |  133s |    34s |  -99s (-74,4%) |
| Fluxos no navegador (Firefox)  |   79s |    35s |  -44s (-55,7%) |
| Fluxos no navegador (WebKit)   |   78s |    33s |  -45s (-57,7%) |
| Artefatos de distribuição      |    6s |     6s |             0s |
| Política de develop            |   13s |    12s |    -1s (-7,7%) |
| Qualidade rápida               |   99s |   170s |  +71s (+71,7%) |
| **Tempo total de jobs**        |  411s |   299s | -112s (-27,3%) |
| **Duração da execução**        |  133s |   170s |  +37s (+27,8%) |

Execuções sem sucesso: 0 antes, 0 depois. Reruns: 0 antes, 0 depois. Tokens e custo: **não disponível**.

## Leitura e limites

- A dispensa do E2E funcionou como projetado: ≈ 190 s de jobs de E2E por PR deixaram de ser executados e o tempo total de jobs caiu 27,3%.
- A projeção de ≈ 30 s a menos na duração da execução **não se confirmou**: a duração subiu 37 s porque a etapa mais longa passou a ser `Qualidade rápida` (99 s antes, 170 s agora), não mais o E2E.
- O aumento de `Qualidade rápida` não decorre da validação por impacto. Os runs de "depois" incluem as etapas de cobertura (`Gerar cobertura dos testes Vitest`, ≈ 53 s) e o `test:quality` ampliado, acrescentados à CI por mudanças posteriores ao baseline (#184). Esta é uma hipótese a partir dos passos dos runs de "depois"; as etapas do baseline não foram comparadas uma a uma.
- Amostra pequena: três PRs, no mesmo dia, comparadas com três runs do baseline (dois dos quais de commits diferentes). Os números são indicativos e não permitem atribuir causalidade; não generalize.
