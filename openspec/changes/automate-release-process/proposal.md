## Why

O projeto ainda não possui um processo padronizado e reproduzível para preparar e publicar releases. Hoje existe risco de divergência entre o commit integrado à `master`, a versão canônica do projeto, o `CHANGELOG.md`, a tag Git e a GitHub Release.

O issue #7 define a necessidade de um fluxo semi-automatizado no qual a decisão de publicar continua manual, enquanto as etapas mecânicas e validações de consistência ficam automatizadas.

## What Changes

- Criar um comando de preparação de release que recebe `X.Y.Z`, valida o estado atual e atualiza a versão canônica, lockfile e `CHANGELOG.md`.
- Fechar no changelog a seção `X.Y.Z - Em andamento` com a data corrente e abrir automaticamente a próxima versão patch como `Em andamento`.
- Adicionar validações de release à CI antes do merge em `master`.
- Criar workflow manual `Publicar release` para validar o commit em `master`, impedir sobrescrita de tag, criar tag anotada `vX.Y.Z` e criar a GitHub Release correspondente.
- Extrair as notas da GitHub Release exclusivamente da seção fechada da versão no `CHANGELOG.md`.
- Documentar o processo completo em `docs/release-process.md` e incluir no `README.md` um resumo com link para esse documento.
- Manter a escolha da versão, criação da branch/PR, merge e disparo da publicação como ações humanas explícitas.

## Capabilities

### New Capabilities

- `release-process`: preparação, validação e publicação rastreável de releases do design system.

### Modified Capabilities

Nenhuma.

## Impact

- Scripts de automação em `scripts/`.
- Scripts npm e versão canônica no `package.json` raiz.
- `package-lock.json`, quando aplicável.
- `CHANGELOG.md`.
- GitHub Actions em `.github/workflows/`.
- Documentação em `README.md` e `docs/release-process.md`.
- Testes automatizados do processo de release.
