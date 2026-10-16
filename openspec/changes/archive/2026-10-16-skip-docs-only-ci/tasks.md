## 1. Classificação de caminhos

- [x] 1.1 Criar `scripts/ci-changed-paths.mjs` com a lista de documentação, a lista de exceções e a regra de falha segura. Concluída quando o script imprimir `docs_only=true|false` e tratar diff vazio ou erro como `false`.
- [x] 1.2 Criar `scripts/ci-changed-paths.test.mjs` cobrindo documentação pura, exceções, mistura com código, lista vazia e eventos de `push`/`master`. Concluída quando `node --test` passar e `npm run test:release` (ou o script de teste correspondente) incluir o novo teste.

## 2. Workflow de CI

- [x] 2.1 Em `build` e `e2e`, adicionar o step de classificação e condicionar os steps pesados a `docs_only != 'true'`, mantendo nomes e a conclusão com sucesso. Concluída quando uma PR só de documentação concluir os dois checks sem construir nem testar.
- [x] 2.2 Garantir `fetch-depth` suficiente para o `git diff` da base. Concluída quando o cálculo funcionar em PR e cair em `false` fora dela.
- [x] 2.3 Ajustar `scripts/release-workflows.test.mjs` apenas se o texto do `ci.yml` testado mudar. Concluída quando os testes de release passarem.

## 3. Documentação e spec

- [x] 3.1 Atualizar `docs/release-process.md` (seção de CI) com a regra de PRs somente de documentação e as listas. Concluída quando o texto não contradisser o workflow nem o requisito.
- [x] 3.2 Confirmar o delta `ADDED` em `specs/quality-assurance/spec.md` contra o workflow final. Concluída quando requisito e `ci.yml` não se contradisserem.

## 4. Validação

- [x] 4.1 Rodar `npx --yes @fission-ai/openspec@1.10.0 validate --all --strict`. Concluída quando passar.
- [x] 4.2 Rodar `npx prettier --write` nos arquivos alterados e `npm run format`. Concluída quando `npm run format` passar.
- [x] 4.3 Rodar `npm run lint`, `npm run build`, `npm run typecheck` e `npm run test:quiet`. Concluída quando todos passarem.
- [x] 4.4 Rodar `npm run test:e2e` sem atualizar snapshots. Concluída quando nenhum E2E falhar; comparações visuais só com baseline win32 ficam para a CI. Validado no ambiente cloud com o Chromium da imagem e `ignoreSnapshots` (108 passaram).
- [ ] 4.5 Na PR, validar os dois caminhos reais: esta PR altera código (deve rodar completo) e uma PR só de documentação (deve pular). Concluída quando ambos os resultados forem registrados na descrição. Parcial, arquivada por decisão: a PR #82 validou o caminho de fluxo completo (`docs_only=false`, cache do Chromium com hit). O caminho `docs_only=true` será observado na primeira PR somente de documentação após o merge (a que arquiva estas changes).
