## 1. Preparação e planejamento

- [x] 1.1 Ler a #265, as PRs #266/#270, `AGENTS.md`, a política OpenSpec e as dependências na `develop`.
- [x] 1.2 Criar branch exclusiva `issue-265-deps-batch3` com base em `develop`.
- [x] 1.3 Escrever proposta, design, delta de requisitos e checklist do OpenSpec para o lote 3.
- [x] 1.4 Validar OpenSpec estrito e registrar revisão do plano antes da implementação.

## 2. Migrações de dependências

- [x] 2.1 Atualizar TypeScript 6.0.3; comprovar configurações, declarações .d.ts, typecheck, builds e compatibilidade com typescript-eslint.
- [x] 2.2 Atualizar Vitest e coverage-v8 em 5.0.5; avaliar mocks, Vite peer e cobertura; corrigir regressões reais.
- [x] 2.3 Atualizar jsdom 30.1.3, confirmar Node 24.15+ efetivo nos testes, DOM/accessibility e engines da biblioteca preservadas.
- [x] 2.4 Atualizar lint-staged 17.6.0, validar Husky e hook em arquivos staged com testes controlados.
- [x] 2.5a Regenerar package-lock via Node 24/npm 11.19.1; `npm ci --ignore-scripts`, `npm ls`, peers/engines sem inconsistências (preflight #41199697708).
- [ ] 2.5b Executar e registrar `npm outdated`, justificando exceções intencionais TypeScript 7 e `@types/node` fora de Node 24.
- [x] 2.6 Registrar changelog 0.1.1 com impacto e exceções; preservar contrato público, CSS/tokens e peers.

## 3. Verificação e revisão

- [x] 3.1 `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quality`, `npm run test:coverage`.
- [x] 3.2 Verificar `npm run inspect:packages`, `npm run verify:optional-peer`, docs Storybook/API/output, demo Next, `npm run build:pages` e consumo de tarballs externo.
- [x] 3.3 Validar `npm run test:e2e` com Chromium/Firefox/WebKit, Pages E2E, acessibilidade, temas e snapshots sem alterações inesperadas.
- [x] 3.4 Registrar `npm audit --json` e `--omit=dev` baseline/final; classificação high/critical, avisos herdados, exceções e risco residual.
- [x] 3.5 Validar OpenSpec estrito; revisar diff final e corrigir problemas antes de concluir.
- [x] 3.6a Confirmar Prettier e `npm run format` no preflight e na CI da PR.
- [ ] 3.6b Executar o comando agregado `npm run validate` (as verificações equivalentes foram aprovadas em preflight/CI, mas não se deve reportar o comando literal como executado).

## 4. PR e CI

- [x] 4.1 Abrir PR parcial para `develop`, vinculando #265 sem fechamento automático.
- [ ] 4.2 Conferir CI, Pages, Security Gate e seus jobs realmente executados no SHA final, corrigindo falhas.
- [x] 4.3 Documentar evidências e pendências, revisar diffs e marcar apenas tarefas comprovadamente concluídas.

O archive/sync, merge e fechamento da #265 são gates administrativos fora deste checklist; exigem seus próprios critérios e autorização.

## Evidências

- Preflight [#41199697708](https://github.com/dvmarques/admin-design-system/actions/runs/41199697708): instalação, lint, format, build, typecheck, quality, coverage, Storybook, Pages, OpenSpec strict, staged lint-staged, audit.
- CI oficial [#41200069724](https://github.com/dvmarques/admin-design-system/actions/runs/41200069724): 455 Chromium, Firefox/WebKit, quality, distribuição e smoke externo.
- Pages [#41200069680](https://github.com/dvmarques/admin-design-system/actions/runs/41200069680): 30 E2E; publicação pulada corretamente para PR.
- Security Gate [#41200069735](https://github.com/dvmarques/admin-design-system/actions/runs/41200069735): CodeQL, Gitleaks, npm audit aprovados.
- Resultado e pendências em [verification.md](verification.md). A PR permanece aberta para revisão; merge/archive/encerramento da issue dependem de autorização e checklist completo.
