# Tarefas

- [x] 1. Versionar configuração por export/perfil, estados aplicáveis e N/A justificados; cruzar contra o catálogo atual. Evidência: 83 exports/83 entradas, 22 cenários, validação lógica isolada sem erros sobre o catálogo atual (não equivale a test:ci).
- [x] 2. Criar validação determinística e testes Node para drift, cenários duplicados e inconsistências. **Implementação commitada:** `scripts/visual-audit-coverage.mjs` e `scripts/visual-audit-coverage.test.mjs`; **execução oficial do teste ainda não comprovada** (task 8).
- [x] 3. Acrescentar cenários Playwright seletivos com estado/tema/viewport, foco, overlays, dados e preferências de mídia; isolar evidências. **Implementação commitada:** `visual-audit/states.spec.ts` com 22 cenários e arquivos de evidência por ID; **não executados ainda em navegador** (task 8).
- [x] 4. Evoluir relatório Markdown/JSON para cobertura planejada/executada/pendente/falha, revisão humana e screenshots verificáveis. **Implementação commitada:** `scripts/visual-audit-coverage-report.mjs` e teste com fixtures simuladas; **relatórios de execução real pendentes** (task 8).
- [x] 5. Atualizar documentação de uso, limites de zoom e auditoria manual, preservando snapshots e CI regular. Evidência: docs/visual-audit.md; nenhum snapshot oficial foi modificado.
- [ ] 6. Revisar criticamente código, compatibilidade, semântica dos testes, performance e falsos positivos; corrigir problemas identificados.
- [ ] 7. Formatar os arquivos alterados e executar npm run format, lint, build e typecheck.
- [ ] 8. Executar test:quality, test:e2e e auditoria visual opt-in, vinculando relatórios/evidências reais; sem atualização automática de baseline.
- [ ] 9. Executar validação OpenSpec estrita e reconciliar tasks concluídas/pendentes com resultados verificados.
