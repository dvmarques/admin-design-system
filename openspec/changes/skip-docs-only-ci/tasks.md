## 1. Classificação de caminhos

- [ ] 1.1 Criar `scripts/ci-changed-paths.mjs` com a lista de documentação, a lista de exceções e a regra de falha segura. Concluída quando o script imprimir `docs_only=true|false` e tratar diff vazio ou erro como `false`.
- [ ] 1.2 Criar `scripts/ci-changed-paths.test.mjs` cobrindo documentação pura, exceções, mistura com código, lista vazia e eventos de `push`/`master`. Concluída quando `node --test` passar e `npm run test:release` (ou o script de teste correspondente) incluir o novo teste.

## 2. Workflow de CI

- [ ] 2.1 Em `build` e `e2e`, adicionar o step de classificação e condicionar os steps pesados a `docs_only != 'true'`, mantendo nomes e a conclusão com sucesso. Concluída quando uma PR só de documentação concluir os dois checks sem construir nem testar.
- [ ] 2.2 Garantir `fetch-depth` suficiente para o `git diff` da base. Concluída quando o cálculo funcionar em PR e cair em `false` fora dela.
- [ ] 2.3 Ajustar `scripts/release-workflows.test.mjs` apenas se o texto do `ci.yml` testado mudar. Concluída quando os testes de release passarem.

## 3. Documentação e spec

- [ ] 3.1 Atualizar `docs/release-process.md` (seção de CI) com a regra de PRs somente de documentação e as listas. Concluída quando o texto não contradisser o workflow nem o requisito.
- [ ] 3.2 Confirmar o delta `ADDED` em `specs/quality-assurance/spec.md` contra o workflow final. Concluída quando requisito e `ci.yml` não se contradisserem.

## 4. Validação

- [ ] 4.1 Rodar `npx --yes @fission-ai/openspec@1.10.0 validate --all --strict`. Concluída quando passar.
- [ ] 4.2 Rodar `npx prettier --write` nos arquivos alterados e `npm run format`. Concluída quando `npm run format` passar.
- [ ] 4.3 Rodar `npm run lint`, `npm run build`, `npm run typecheck` e `npm run test:quiet`. Concluída quando todos passarem.
- [ ] 4.4 Rodar `npm run test:e2e` sem atualizar snapshots. Concluída quando nenhum E2E falhar; comparações visuais só com baseline win32 ficam para a CI.
- [ ] 4.5 Na PR, validar os dois caminhos reais: esta PR altera código (deve rodar completo) e uma PR só de documentação (deve pular). Concluída quando ambos os resultados forem registrados na descrição.
