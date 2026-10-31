## 1. Preparação e baseline

- [x] 1.1 Auditar seis workflows, versão Node/Playwright, permissões e dependências #265/#267/#195.
- [x] 1.2 Identificar refs oficiais SHAs, digest MCR e estratégia de rollback.
- [ ] 1.3 Validar a proposta e a change em OpenSpec strict.

## 2. Implementação

- [ ] 2.1 Fixar SHAs completos e comentários de versão para todas as actions externas.
- [ ] 2.2 Fixar digest Playwright nos três workflows, preservando a matriz de browsers e Pages.
- [ ] 2.3 Isolar geração read-only e gravação de baselines write com validação de branch, SHA e artefatos PNG.
- [ ] 2.4 Ajustar checkouts para não persistir token sem enfraquecer release ou CodeQL.
- [ ] 2.5 Criar teste estático fail-closed de SHA, digest/lockfile e privilégio, integrado a `test:ci`.
- [ ] 2.6 Documentar processo de atualização, matriz antes/depois, riscos remanescentes e CHANGELOG.

## 3. Verificações e revisão

- [ ] 3.1 Revisar diff, formato e cenários negativos de branch/ref/payload.
- [ ] 3.2 Executar `npm run format`, lint, build, typecheck e test:quality/test:ci.
- [ ] 3.3 Executar `npm run test:e2e` (Chromium, Firefox e WebKit) e Pages; conferir o mecanismo de snapshots sem atualização não intencional.
- [ ] 3.4 Executar `npm run validate` e OpenSpec strict, documentando qualquer limitação real.
- [ ] 3.5 Abrir PR em Draft, tornar Ready para revisão e conferir CI/Pages/Security no HEAD, corrigindo falhas reais.
- [ ] 3.6 Confirmar preservação dos gates release/Pages e revisar evidência do workflow manual; marcar somente etapas comprovadas.
