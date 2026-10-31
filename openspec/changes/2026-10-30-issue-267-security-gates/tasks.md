## 1. OpenSpec e baseline

- [x] 1.1 Revisar issue #267, convenções de CI/OpenSpec e fronteira com #265/#268.
- [x] 1.2 Validar OpenSpec com CLI 1.15.0 em modo estrito.
- [x] 1.3 Capturar 3 execuções históricas comparáveis e registrar método/limitações.

## 2. Implementação

- [x] 2.1 Criar security.yml com CodeQL, bloqueio SARIF high/critical, npm audit, Gitleaks; triggers Draft/Ready/push/weekly, permissões mínimas e pinning.
- [ ] 2.2 Criar política SCA com relatório sanitizado, exceções justificadas/expiráveis e testes sintéticos.
- [x] 2.3 Configurar Dependabot npm e Actions com limites de PRs, documentando automações.
- [x] 2.4 Escrever guia de triagem, baseline, recursos do GitHub, forks, execução local e métricas.
- [x] 2.5 Atualizar CHANGELOG [0.1.1].

## 3. Revisão, testes e evidência

- [ ] 3.1 Validar testes do gate, format, lint, Node 24, build, typecheck, test:quality, E2E aplicável e OpenSpec estrito.
- [x] 3.2 Abrir PR Draft; evidenciar que scanners não executam, sem checks exigidos pendentes.
- [ ] 3.3 Marcar Ready, comprovar execução e revisar logs/resultados, corrigindo falhas encontradas.
- [ ] 3.4 Comparar jobs e latência com baseline real, registrar medições progressivas na issue #267 e indicar amostra insuficiente quando couber.
- [ ] 3.5 Revisar diff final, CI/Pages completos e riscos pendentes; não marcar como concluído se não verificado.
