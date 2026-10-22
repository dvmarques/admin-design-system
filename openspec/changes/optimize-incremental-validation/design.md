## Context
`ci-changed-paths.mjs` só reconhece docs_only; quality, build e E2E repetem builds. Os jobs atuais protegem develop/master e releases.

## Decisions
1. Classificar mudanças a partir de caminhos e do grafo de dependências dos package.json dos workspaces, incluindo dependentes transitivos; arquivos desconhecidos, configuração global e alterações de release implicam full.
2. A seleção focal será opt-in para feedback local. CI obrigatória continuará completa até haver provas automatizadas de equivalência e métricas; nunca reduzir checks exigidos por branch protection.
3. Publicar decisões de escopo como saída legível e JSON, sem executar comandos externos oriundos de arquivos modificados.
4. Medir tempo real por job e taxa de falha usando runs GitHub Actions; tokens/custo só quando o provedor expuser valores verificáveis.

## Risks
Grafo incompleto, scripts compartilhados e imports não declarados podem produzir falsos negativos. Fallback full em ambiguidade e testes de dependência transitiva mitigam esse risco.

## Validation
Testes unitários da classificação, fixtures para tokens/components/admin/apps, casos desconhecidos, release e grafo transitivo; format/lint/build/typecheck/testes e E2E completos antes do merge.
