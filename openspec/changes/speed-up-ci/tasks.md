## 1. Workflow de CI

- [ ] 1.1 Em `.github/workflows/ci.yml`, remover `needs` de `build` e `e2e`. Concluída quando os três jobs não tiverem dependência entre si e os nomes permanecerem iguais.
- [ ] 1.2 Adicionar `concurrency` com grupo por PR ou ref e `cancel-in-progress` só em `pull_request`. Concluída quando um push em `develop`/`master` não cancelar outro.
- [ ] 1.3 Cachear `~/.cache/ms-playwright` com chave pela versão do Playwright, usando `install-deps` no cache hit e `install --with-deps` no miss. Concluída quando ambos os caminhos passarem na CI.

## 2. Documentação e spec

- [ ] 2.1 Atualizar `docs/release-process.md` (seção de CI) com paralelismo e cancelamento por PR. Concluída quando o texto não contradisser o workflow nem o requisito.
- [ ] 2.2 Confirmar o delta `ADDED` em `specs/quality-assurance/spec.md` contra o workflow final. Concluída quando requisito e `ci.yml` não se contradisserem.

## 3. Validação

- [ ] 3.1 Rodar `npx --yes @fission-ai/openspec@1.10.0 validate --all --strict`. Concluída quando passar.
- [ ] 3.2 Rodar `npx prettier --write` nos arquivos alterados e `npm run format`. Concluída quando `npm run format` passar.
- [ ] 3.3 Rodar `npm run lint` e `npm run typecheck`. Concluída quando ambos passarem.
- [ ] 3.4 Rodar `npm run build` e `npm run test:e2e` no ambiente local/cloud, sem atualizar snapshots. Concluída quando nenhum E2E falhar; comparações visuais só com baseline win32 ficam para a CI.
- [ ] 3.5 Na PR, comparar a duração da CI antes e depois (execuções recentes em `develop` como referência) e registrar o resultado na descrição. Concluída quando houver números reais.
