## Why

A CI repete trabalho que a mudança não afeta e a dispensa de trabalho só reconhece documentação. A medição de runs reais (ver `evidence/` e `docs/ci-impact-validation.md`) mostrou ainda que a dispensa de E2E para PRs só de documentação **não funciona nos jobs em container**: o `git` falha com `detected dubious ownership` (checkout de outro usuário e `safe.directory` do `actions/checkout` descartado) e o resultado cai silenciosamente em `docs_only=false`. Cada PR de documentação executa os três E2E sem necessidade (aprox. 290 s de jobs).

## What Changes

- Classificador de impacto por workspace e dependentes transitivos (`scripts/ci-impact.mjs`), com workspaces derivados da raiz, grafo declarado mais dependências implícitas verificadas por teste, ordem topológica e fallback completo para qualquer dúvida (caminho desconhecido, global, inseguro, manifesto inválido, ciclo, falha de detecção).
- Detecção do diff no commit de merge da PR (primeiro pai = base), com `safe.directory` do checkout nos comandos de leitura da CI; renomeações contam origem e destino.
- `scripts/ci-scope.mjs` substitui `ci-changed-paths.mjs` como CLI dos jobs: decide `docs_only`, `build_docs`, `build_demo` e `e2e` somente para PRs para `develop`; push, PRs para `master` e qualquer falha executam tudo. Qualidade rápida, política de develop e validação de release nunca dependem dessa decisão.
- Comandos locais opcionais `validate:impact:*` com plano testável, builds na ordem correta, saída concisa e `--verbose`/`--dry-run`.
- Medição: `scripts/ci-metrics.mjs` e workflow manual `ci-metrics.yml` comparam execuções do Actions (duração, falhas, reruns); evidências do baseline versionadas.
- Avaliação documentada de cache e compartilhamento de artefatos entre jobs, com números e decisão.

## Capabilities

### New Capabilities

- `impact-aware-validation`: seleção conservadora de trabalho por impacto, com fallback seguro e medição auditável.

## Impact

Scripts de CI, workflows do GitHub Actions, testes Node, documentação e comandos npm. Nenhuma API pública, CSS ou identidade visual muda. Os nomes dos checks obrigatórios permanecem.
