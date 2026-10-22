## 1. Baseline

- [x] 1.1 Registrar duração e falhas dos jobs representativos com IDs de execução (`evidence/baseline-docs-prs.json`, `evidence/reference-code-prs.json`; tabela em `docs/ci-impact-validation.md`). Amostra pequena, declarada como insuficiente.
- [x] 1.2 Registrar tokens, custo e retrabalho apenas com telemetria verificável: indisponíveis, declarados como "não disponível" nas ferramentas e na documentação.

## 2. Implementação incremental

- [x] 2.1 Implementar classificação por workspace e dependentes transitivos com fallback `full` (`scripts/ci-impact.mjs`), incluindo renomeações, dependências implícitas verificadas por teste e ordem topológica.
- [x] 2.2 Adicionar testes para caminhos, dependências, tokens, componentes, admin, aplicações, configurações globais, caminhos desconhecidos e inseguros, manifestos inválidos, ciclos e falhas de detecção com git real (merge, renomeação, checkout raso).
- [x] 2.3 Criar comandos focais de lint, typecheck e testes com saída concisa e modo diagnóstico (`validate:impact*`, `--verbose`, `--dry-run`).
- [ ] 2.4 Integrar a seleção à CI preservando validações completas em risco, `develop`/`master` e release (`ci-scope.mjs`, etapas condicionais, testes estruturais do workflow). Pendente de confirmação da CI na PR.
- [x] 2.5 Avaliar redundâncias de build e `test:quality` entre jobs: artefatos compartilhados, cache de `node_modules` e dispensa de testes em PRs de docs avaliados e não adotados, com os números e motivos em `docs/ci-impact-validation.md` e no `design.md`.
- [x] 2.6 Corrigir a dispensa de E2E em PRs só de documentação nos jobs em container (`HEAD^1` inacessível no checkout raso).

## 3. Validação e métricas

- [x] 3.1 Automatizar a comparação antes/depois (`scripts/ci-metrics.mjs`, workflow manual `ci-metrics.yml`) com fontes verificáveis e documentar trade-offs.
- [ ] 3.2 Executar format, lint, build, typecheck, testes e E2E completos. Local: format, lint, build, typecheck, `test:quality` e OpenSpec estrito passaram; E2E e CI em Chromium, Firefox e WebKit pendentes de confirmação.
- [ ] 3.3 Registrar a medição "depois" com execuções pós-merge de PRs só de documentação (comando em `docs/ci-impact-validation.md`); até lá nenhum ganho é declarado como medido.
- [x] 3.4 Atualizar CHANGELOG, documentação e evidências.
