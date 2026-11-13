# Tasks

## 1. Gate e identidade da publicação

- [x] 1.1 Exigir dispatch a partir da ref `master` e SHA exatamente igual ao merge aprovado; rejeitar ref e SHA divergentes antes de publicar.
- [x] 1.2 Preservar back-merge e validações de release/changelog usando SHA imutável de `develop` capturado no gate.
- [x] 1.3 Preservar validação do artifact de `develop` por ID, origem, digest, manifest/hashes e commit de release, sem rebuild.
- [x] 1.4 Manter separação de permissões npm OIDC e GitHub tag/release, sem segredos npm.

## 2. Testes e documentação

- [x] 2.1 Cobrir ref permitida/negada, SHA certo/divergente e ancestralidade do artifact.
- [x] 2.2 Atualizar `docs/release-process.md`, specs de release e npm, e `CHANGELOG.md`.
- [x] 2.3 Revisar diff, riscos, efeitos nos consumidores e consistência da change.

## 3. Verificação pré-PR

- [x] 3.1 Executar testes de release, `npm run format`, lint, build, typecheck e qualidade.
- [ ] 3.2 Executar `npm run test:e2e` e garantir nenhuma falha E2E.
- [ ] 3.3 Executar `npm run validate` e `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`.

A prova de provenance efetiva na próxima versão autorizada é critério posterior da issue, não tarefa que permita simular uma release nesta change.
