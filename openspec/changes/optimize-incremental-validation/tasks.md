## 1. Baseline
- [ ] Registrar duração e falhas dos jobs representativos em develop e PRs, com IDs de execução.
- [ ] Registrar tokens, custo e retrabalho apenas quando houver telemetria verificável; indicar indisponibilidade quando necessário.

## 2. Implementação incremental
- [ ] Implementar classificação por workspace e dependentes transitivos com fallback full.
- [ ] Adicionar testes para caminhos, dependências, alterações globais e riscos.
- [ ] Criar comandos focais de lint, testes e typecheck com saída concisa e modo diagnóstico.
- [ ] Integrar seleção segura à CI preservando validações completas em risco, develop/master e release.
- [ ] Avaliar e eliminar redundâncias de build e test:quality somente com equivalência demonstrada.

## 3. Validação e métricas
- [ ] Automatizar comparação antes/depois com fontes verificáveis e documentar trade-offs.
- [ ] Executar formatação, lint, build, typecheck, testes e E2E completos.
- [ ] Atualizar CHANGELOG, documentação e evidências; revisar e corrigir antes da PR final.
