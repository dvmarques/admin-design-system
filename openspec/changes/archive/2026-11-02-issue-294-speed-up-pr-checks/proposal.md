## Why

Os checks de PR Ready para `develop` repetem suites Node/Vitest, builds e instalações. Na PR #293, o Chromium usou dois workers para 459 testes e ocupou ~370 s de job (241 s somente Playwright); o job `quality` levou ~243 s. A PR #284 apresentou Chromium ~350 s e `quality` ~163 s. A prioridade é encurtar o caminho crítico real, sem confundir segundos de jobs com duração ponta a ponta, nem trocar segurança por velocidade.

## What Changes

- Avaliar e implementar sharding do Chromium em duas partições, com agregador fail-closed **`Fluxos no navegador`** e Firefox/WebKit intactos.
- Executar os testes de qualidade exatamente uma vez por suíte no workflow, produzindo artefatos de cobertura Node e Vitest sem mudar o contrato local `test:quality`.
- Avaliar o smoke de distribuição, o cache/flags de npm, o impacto de Pages e o cancelamento de PRs antigas, adotando só otimizações medidas e seguras.
- Conservar políticas de PR Draft, `ready_for_review`, escopo incremental com fallback completo, push `develop`/`master`, releases e Security Gate.
- Registrar runs antes/depois e decisões, inclusive alternativas não adotadas.

## Impact

Workflow CI, scripts de qualidade, testes estáticos de workflow, documentação de engenharia/OpenSpec. Nenhuma API pública, CSS, UI, permissões ou snapshot alterados. Os checks obrigatórios preservam os nomes e significado.

## Out of Scope

Diminuir a cobertura de testes, desativar gates CodeQL/npm audit/Gitleaks, elevar tolerância de snapshot, mudar toolchain ou configurar runners próprios. Nenhuma exigência de aprovação de outra pessoa. Release/publish não é alterado.
