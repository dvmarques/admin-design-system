## Contexto e evidência

A `ci.yml` atual roda `quality`, `build`, matriz `e2e`, `develop-policy` e `release-check` em paralelo. A matriz possui Chromium (suíte completa; 459 testes na PR #293), Firefox e WebKit (26 testes cada). O browser Chromium é o maior caminho crítico observado; `test:quality` engloba `test:ci` e Vitest, mas a CI os repete para cobertura.

Baseline inicial ilustrativo, **não resultado de ganho**:

- [PR #284 — CI](https://github.com/dvmarques/admin-design-system/actions/runs/41339885867): Chromium 350 s, testes 230 s; qualidade 163 s; Pages 95 s.
- [PR #293 — CI](https://github.com/dvmarques/admin-design-system/actions/runs/41464172195): Chromium 370 s, testes 241 s; qualidade 243 s; Pages 127 s.
- Testes Chromium: 455 (#284) e 459 (#293); contagem dinâmica, portanto comparar com revisão equivalente. Medição por timestamp de logs, sem fila e sem amostra suficiente para conclusão causal.
- Segurança: CodeQL 59–74 s; audit 25–64 s. Esses gates independentes não são candidatos a ser desligados.

## Decisions and invariants

1. **Check agregado e fail-closed.** Matriz do E2E mantém Firefox/WebKit e divide Chromium em `1/2`, `2/2`. Os checks individuais dos shards são informativos. Um job agregador simples, chamado **`Fluxos no navegador`**, depende do resultado integral da matriz e aprova somente se todas as partições relevantes e browsers concluírem com `success`; um resultado `failure`, `cancelled` ou `skipped` inesperado falha. A agregação não deve criar verde falso quando a matriz falha, nem pendência em PR Ready. Em PR Draft, manter políticas atuais de skipped. Em PR docs-only, as etapas E2E continuam dispensadas por escopo válido dentro dos jobs.
2. **Cobertura de qualidade uma única vez.** Preservar os comandos `test:node:quiet`, `test:release`, `test:ci` e a execução completa do Vitest com cobertura; preservar geração/check de tokens e `check:agent-skills`. Uma nova orquestração exclusiva da CI evita `test:quality` + `test:ci` + `test:coverage` sobrepostos. `test:quality` local permanece igual. A cobertura Node depende de `NODE_V8_COVERAGE` no comando `test:ci`; a cobertura Vitest deve continuar em `coverage/vitest/`.
3. **Smoke de distribuição** é bloqueante e deve continuar exercitando os quatro tarballs no consumidor Next.js externo, com browser Chromium real, locks e versões válidas. Não migrar para runner sem browser disponível; alternativa é mantê-lo no Chromium até haver ambiente equivalente e comparação robusta.
4. **Instalação** mantém `npm ci --ignore-scripts` e Node 24/npm 11.19.1. Flags que só eliminam auditoria implícita e mensagens de fundos são aceitáveis quando o gate explícito continua; `prefer-offline` apenas após teste de cache frio/quente. Cache de `node_modules` compartilhado entre jobs não será adotado sem validação de proveniência.
5. **Pages** preserva build/testes quando há potencial de impacto. Uma classificação limitada e conservadora pode dispensar apenas mudanças seguras de documentos sem entrada no Pages, com fallback completo. O workflow permanece acionado para preservar status do check e os pushes `develop` nunca são cancelados por PRs.
6. **Observabilidade**: medir duração ponta a ponta (incluindo fila quando disponível), tempo de jobs e soma de runner-minutes separadamente. Comparar no mínimo três amostras comparáveis por tipo de PR e documentar limites. Não afirmar economia antes de evidência.
7. **Segurança e release**: actions por SHA, imagem Playwright por digest, checkout sem credenciais persistentes, forks somente `pull_request` read-only, nunca `pull_request_target`. Não modificar rulesets sem necessidade; se check for alterado, testar proteção efetiva.

## Review pré-implementação

Revisão dos riscos identificou duas correções à abordagem inicial:

- Um shard Chromium não pode manter sozinho o nome obrigatório, pois daria verde antes de outro shard terminar. O nome obrigatório passa a ser o **agregador**.
- O smoke `verify:distribution` lança Chromium via Playwright; mover diretamente para `build` sem browser instalado quebra a equivalência. **Adiar movimentação** até haver prova de que o runner alternativo contém o mesmo executável/ambiente.

## Verification and rollback

Validar `openspec validate --all --strict` na CI, `npm run format`, `lint`, `typecheck`, `test:quality`, artefatos de cobertura e jobs E2E + Pages + Security Gate em PR Ready. Simular falha de shard na checagem estática, e verificar cancelamento de job/fallback de escopo. Comparar logs antes/depois; reverter a otimização isolada que causar falha, checks verdes falsos ou perda de cobertura.
