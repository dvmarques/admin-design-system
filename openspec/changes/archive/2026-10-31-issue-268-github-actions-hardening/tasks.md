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

- [x] 3.1 Revisar diff, formato e cenários negativos de branch/ref/payload.
- [x] 3.2 Executar `npm run format`, lint, build, typecheck e test:quality/test:ci.
- [x] 3.3 Executar `npm run test:e2e` (Chromium, Firefox e WebKit) e Pages; conferir o mecanismo de snapshots sem atualização não intencional.
- [x] 3.4 Executar `npm run validate` e OpenSpec strict, documentando qualquer limitação real.
- [x] 3.5 Abrir PR em Draft, tornar Ready para revisão e conferir CI/Pages/Security no HEAD, corrigindo falhas reais.
- [x] 3.6 Confirmar preservação dos gates release/Pages e revisar evidência do workflow manual; marcar somente etapas comprovadas.

## Evidências confirmadas em 31/10/2026

- CI, Pages e Security Gate aprovados no SHA funcional `f7bc102` e no HEAD com as correções finais (CI completa com Chromium, Firefox e WebKit, qualidade, distribuição e política de develop; Pages build/E2E com deploy skipped em PR; CodeQL, npm audit e Gitleaks). O CodeQL high de TOCTOU foi corrigido por leitura de descritor único sem seguir links simbólicos.
- **Revisão (3.1):** cenários negativos de branch protegida/inválida, ref divergente e SHA malformado cobertos por `scripts/visual-baseline-transfer.test.mjs` (em `test:ci`). A revisão encontrou e corrigiu: (a) o job `generate` perdeu o `safe.directory` do fluxo original e o transfer falhava com _dubious ownership_ no contêiner — corrigido e travado por `verify-workflow-supply-chain.mjs`; (b) `ls-remote` do job de commit passou a usar o token, pois o checkout não persiste credenciais.
- **Validação local (3.4):** com Node 24.22.2/npm 11.19.1, `npm run validate` executou com sucesso format, lint, build, `test:output`, `verify:optional-peer`, typecheck e `test:quality`; o E2E local não pôde rodar porque o ambiente não possui os browsers desta versão do Playwright (limitação de ambiente) e foi comprovado pela CI nos três browsers. `openspec validate --all --strict` passou (64/64).
- **Workflow manual (3.6):** disparado em branch de teste descartável com um PNG removido: `generate` regenerou e validou, o artefato foi transferido e o job `commit` publicou, como `github-actions[bot]`, exatamente um commit com um PNG, byte a byte idêntico ao original. A primeira tentativa falhou pelo `safe.directory` acima, o que comprova o valor do teste. Gates release/Pages preservados pelos testes estáticos e pelos checks da CI (`release-check` skipped por base develop, sem aprovar release).
