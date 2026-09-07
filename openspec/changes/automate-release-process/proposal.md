## Why

O projeto ainda não possui um processo padronizado e reproduzível para preparar e publicar releases. Hoje existe risco de divergência entre o commit efetivamente liberado, a versão do monorepo, o `CHANGELOG.md`, a tag Git e a GitHub Release.

O issue #7 define a necessidade de um fluxo semi-automatizado no qual a decisão de publicar continua manual, enquanto as etapas mecânicas e validações de consistência ficam automatizadas.

O repositório está atualmente alinhado em `0.0.1` no manifesto raiz, workspaces e lockfile, com `0.0.1 - Em andamento` no changelog. Portanto `0.0.1` é a primeira release prevista pelo processo.

## What Changes

- Criar um comando de preparação de release que recebe `X.Y.Z`, executa preflight completo sem alterar arquivos e, somente após sucesso, atualiza de forma coordenada todos os manifests do monorepo, dependências internas, lockfile e `CHANGELOG.md`.
- Fechar no changelog a seção `X.Y.Z - Em andamento` com a data corrente e abrir automaticamente a próxima versão patch como `Em andamento`.
- Adicionar validações específicas de release à CI existente antes do merge em `master`, sem duplicar os jobs de qualidade, build e E2E já existentes.
- Garantir que os checks necessários sejam exigidos pela proteção/ruleset de `master` para que uma release inconsistente não possa ser integrada.
- Criar workflow manual `Publicar release` que resolve o commit exato integrado pela PR `release/X.Y.Z -> master`, valida esse commit e cria a tag anotada `vX.Y.Z` nele, mesmo que `master` já tenha avançado.
- Tornar a publicação recuperável: se a tag já existir no mesmo commit e a GitHub Release ainda não existir, reutilizar a tag sem alterá-la e concluir apenas a criação da release; se a tag apontar para outro commit, falhar.
- Extrair as notas da GitHub Release exclusivamente da seção fechada da versão no `CHANGELOG.md`.
- Disponibilizar o OpenSpec de forma reprodutível e multiplataforma na CI, sem depender de instalação global ou do launcher Windows `openspec.cmd`.
- Documentar o processo completo em `docs/release-process.md` e incluir no `README.md` um resumo com link para esse documento.
- Manter a escolha da versão, criação da branch/PR, merge e disparo da publicação como ações humanas explícitas.

## Capabilities

### New Capabilities

- `release-process`: preparação, validação e publicação rastreável e recuperável de releases do design system.

### Modified Capabilities

Nenhuma.

## Impact

- Scripts de automação em `scripts/`.
- Scripts npm e versões em `package.json`, `packages/*/package.json` e `apps/*/package.json`.
- Dependências internas entre workspaces.
- `package-lock.json`.
- `CHANGELOG.md`.
- GitHub Actions em `.github/workflows/` e configuração de checks obrigatórios de `master`.
- Forma de instalação/execução do OpenSpec na CI.
- Documentação em `README.md` e `docs/release-process.md`.
- Testes automatizados do processo de release.
