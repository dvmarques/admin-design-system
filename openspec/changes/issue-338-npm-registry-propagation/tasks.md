# Tasks

## 1. Planejamento e riscos

- [x] 1.1 Analisar issue, normas do repositório, spec atual e fluxo release; definir perfil Critical, riscos, alternativas e rollback.
- [x] 1.2 Planejar deadline, tentativas, backoff e limite do job sem alterar os controles de supply chain.

## 2. Implementação

- [ ] 2.1 Implementar confirmação temporalmente limitada com backoff, timeout HTTP pelo saldo e diagnóstico explícito.
- [ ] 2.2 Limitar o job npm sem alterar OIDC, provenance, permissões ou concorrência.
- [ ] 2.3 Testar propagação após >30 s, esgotamento da janela, integridade divergente e idempotência sem sleeps reais.
- [ ] 2.4 Atualizar procedimento de release e spec, avaliando inclusão no changelog pela política editorial.
- [ ] 2.5 Revisar código, testes, diffs, compatibilidade e riscos.

## 3. Verificação

- [ ] 3.1 Formatar arquivos alterados; executar `npm run format`, lint, build e typecheck.
- [ ] 3.2 Executar `npm run test:release`, `npm run test:quality` e `npm run validate`.
- [ ] 3.3 Executar `npm run test:e2e` e confirmar que não há falhas.
- [ ] 3.4 Executar `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive` e verificar CI e revisão no SHA do PR.
