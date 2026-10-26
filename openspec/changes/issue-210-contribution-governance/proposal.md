## Why

A issue #210 identificou lacunas na experiência de contribuição e no encerramento de changes: falta de formulários de issues, template de PR e guia unificado. O fluxo já sofisticado do Admin DS precisa ser explicado sem perder garantias de CI e release.

## What Changes

- Criar templates de bug, enhancement e documentation com labels existentes.
- Criar template de PR e CONTRIBUTING.md.
- Documentar ciclo completo OpenSpec com archive/sync antes do squash em PRs comuns, gates e exceção justificada.
- Alinhar referências normativas entre AGENTS.md, config e guia adaptativo, sem alterar regras de release.

## Capabilities

### New Capabilities
- `contribution-governance`: orientação consistente para issues, PRs e encerramento de changes.

## Impact
Somente documentação e arquivos GitHub/OpenSpec. Não altera componentes, APIs públicas, tokens, pacotes, demos ou comportamento em runtime. Preserva processo de release, skills e CI. Issue #210.
