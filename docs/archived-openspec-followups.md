# Pendências preservadas em changes OpenSpec arquivadas — issue #197

Inventário conferido na `develop` em 25/10/2026. **Não marque tasks históricas como concluídas sem a evidência exigida pelo texto original.** Arquivamento não significa que todos os checks foram executados. Preservamos o texto e a proveniência em cada `tasks.md`.

| Origem | Task originalmente aberta | Evidência já existente | Acompanhamento sem duplicar trabalho |
| --- | --- | --- | --- |
| [skip-docs-only-ci](../openspec/changes/archive/2026-10-16-skip-docs-only-ci/tasks.md) | 4.5: validar PR de código e PR só de docs | PR [#82](https://github.com/dvmarques/admin-design-system/pull/82) verificou fluxo completo (`docs_only=false`); **faltava** observar `docs_only=true` | Recolher run histórico verificável de PR de documentação após merge ou abrir issue específica **somente se** a evidência não existir; não alterar o checklist arquivado retroativamente |
| [speed-up-ci](../openspec/changes/archive/2026-10-16-speed-up-ci/tasks.md) | 3.5: comparação de duração antes/depois | PR [#80](https://github.com/dvmarques/admin-design-system/pull/80) informa ~1m46s em um run (cache miss); PR [#82](https://github.com/dvmarques/admin-design-system/pull/82) confirmou cache hit, E2E ~1m25s. O «antes» ~3–4min não foi medido no mesmo protocolo | Preservar como observações parciais; comparação causal segue **não demonstrada**. Se demandar medição atual, usar o processo da [#164](https://github.com/dvmarques/admin-design-system/issues/164), sem criar nova iniciativa |
| [optimize-incremental-validation](../openspec/changes/archive/2026-10-22-optimize-incremental-validation/tasks.md) | 3.3: medir «depois» em PRs docs reais após merge | [#164](https://github.com/dvmarques/admin-design-system/issues/164) **aberta**, solicita ao menos três PRs documentais reais; [guia da medição](ci-impact-validation.md) preserva método e projeções | **#164 é o acompanhamento canônico**, sem medição nova nesta issue. Não declarar projeções como ganho observado |

## Política

A #197 é documental. Não altera CI, limite de orçamento, snapshot visual, `pre-pr-validation` removido intencionalmente ou estado de tasks das changes arquivadas. Para fechar qualquer pendência, associar a evidência ao SHA, run ID, data e toolchain, mantendo o registro histórico da decisão.
