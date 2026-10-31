## 1. Preparação e baseline

- [x] 1.1 Auditar seis workflows, versão Node/Playwright, permissões e dependências #265/#267/#195.
- [x] 1.2 Identificar refs oficiais SHAs, digest MCR e estratégia de rollback.
- [x] 1.3 Validar a proposta e a change em OpenSpec strict.

## 2. Implementação

- [x] 2.1 Fixar SHAs completos e comentários de versão para todas as actions externas.
- [x] 2.2 Fixar digest Playwright nos três workflows, preservando a matriz de browsers e Pages.
- [x] 2.3 Isolar geração read-only e gravação de baselines write com validação de branch, SHA e artefatos PNG.
- [x] 2.4 Ajustar checkouts para não persistir token sem enfraquecer release ou CodeQL.
- [x] 2.5 Criar teste estático fail-closed de SHA, digest/lockfile e privilégio, integrado a `test:ci`.
- [x] 2.6 Documentar processo de atualização, matriz antes/depois, riscos remanescentes e CHANGELOG.

## 3. Verificações e revisão

- [ ] 3.1 Revisar diff, formato e cenários negativos de branch/ref/payload.
- [x] 3.2 Executar `npm run format`, lint, build, typecheck e test:quality/test:ci.
- [x] 3.3 Executar `npm run test:e2e` (Chromium, Firefox e WebKit) e Pages; conferir o mecanismo de snapshots sem atualização não intencional.
- [ ] 3.4 Executar `npm run validate` e OpenSpec strict, documentando qualquer limitação real.
- [ ] 3.5 Abrir PR em Draft, tornar Ready para revisão e conferir CI/Pages/Security no HEAD, corrigindo falhas reais.
- [ ] 3.6 Confirmar preservação dos gates release/Pages e revisar evidência do workflow manual; marcar somente etapas comprovadas.

## Evidências confirmadas em 31/10/2026

- [CI completa (Qualidade rápida, distribuição, develop-policy, Chromium, Firefox e WebKit)](https://github.com/dvmarques/admin-design-system/actions/runs/41235122061) aprovada no SHA `f7bc102fa8cd1c59e9b13302698d459c8f1d6bbc`. Validação OpenSpec `--all --strict` passou na política de develop; `npm run test:ci` e o verificador de supply chain foram executados no `test:quality`.
- [Pages (build e E2E)](https://github.com/dvmarques/admin-design-system/actions/runs/41235121983) aprovado, deploy ignorado por se tratar de PR.
- [Security Gate (CodeQL, npm audit, Gitleaks)](https://github.com/dvmarques/admin-design-system/actions/runs/41235121998) aprovado; CodeQL high de TOCTOU foi corrigido pela leitura de descritor único sem seguir links simbólicos.
- `npm run validate` como comando literal não foi executado em checkout local; houve cobertura equivalente de qualidade, build e três browsers na CI. O fluxo `workflow_dispatch` de baselines com escrita não foi disparado e **não** está comprovado em integração. A change permanece ativa, sem archive ou merge.
- As verificações finais precisam ser reconfirmadas no HEAD após este ajuste documental de checklist. Não confundir jobs skipped com execução.
