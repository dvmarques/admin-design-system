## Why

O projeto ainda não possui um processo padronizado e reproduzível para preparar e publicar releases. Hoje existe risco de divergência entre o commit efetivamente liberado, a versão do monorepo, o `CHANGELOG.md`, a tag Git, a GitHub Release e o estado de continuidade em `develop`.

O issue #7 define a necessidade de um fluxo semi-automatizado no qual a decisão de publicar continua manual, enquanto preparação, validações de consistência, serialização das releases e recuperação de falhas ficam automatizadas.

O repositório está atualmente alinhado em `0.0.1` no manifesto raiz, workspaces e lockfile, com `0.0.1 - Em andamento` no changelog. Não existem tags `v*` nem GitHub Releases, portanto `0.0.1` é a primeira release prevista pela implantação inicial do processo.

## What Changes

- Criar um comando de preparação que recebe `X.Y.Z`, executa preflight somente leitura, produz todas as alterações em staging e aplica os arquivos reais de forma atômica somente após sucesso completo.
- Definir bootstrap explícito para a primeira release: quando não existir versão fechada, tag `v*` ou GitHub Release anterior, permitir a versão coordenada atual como alvo inicial.
- Após a primeira release, exigir que o estado coordenado atual corresponda à última versão fechada e que a próxima `X.Y.Z` seja uma SemVer estritamente superior.
- Permitir que o mantenedor escolha patch, minor ou major; a única seção `Em andamento` pode ser renomeada do placeholder para a versão escolhida, preservando conteúdo.
- Atualizar de forma coordenada manifesto raiz, `packages/*`, `apps/*`, dependências internas e `package-lock.json`.
- Fixar uma versão exata do npm no projeto e reutilizá-la localmente e na CI para tornar a regeneração do lockfile reproduzível.
- Tornar `master` exclusiva para integração de branches `release/*`; PRs comuns diretamente para `master` devem ser rejeitadas pelo `release-check`.
- Exigir que, quando já existir uma release fechada anterior, ela esteja publicada com tag anotada e GitHub Release consistentes antes de permitir a integração de uma nova release.
- Criar workflow manual `Publicar release` serializado por `concurrency`, com permissões mínimas explícitas.
- Localizar a PR merged `release/X.Y.Z -> master`, usar seu `merge_commit_sha`, validar que esse commit continua alcançável a partir de `master` e fazer checkout explícito dele antes de validar manifests, changelog e notas.
- Criar somente tags anotadas `vX.Y.Z`; tags existentes devem ser dereferenciadas até o commit e nunca movidas, sobrescritas ou recriadas.
- Tratar GitHub Release existente como idempotente apenas quando tag, commit, nome, estado draft/prerelease e notas forem equivalentes ao esperado.
- Normalizar somente finais de linha e newline final ao comparar release notes, sem aceitar diferenças reais de conteúdo.
- Sincronizar obrigatoriamente a branch `release/X.Y.Z` de volta para `develop` por PR após o merge em `master`, preservando a branch até essa sincronização terminar.
- Exigir a sincronização com `develop` antes da publicação inicial quando necessário para disponibilizar o `workflow_dispatch` na default branch, e sempre antes da próxima preparação de release.
- Disponibilizar OpenSpec de forma versionada, reproduzível e multiplataforma na CI.
- Documentar o processo em `docs/release-process.md` e manter no `README.md` apenas um resumo com link.

## Capabilities

### New Capabilities

- `release-process`: preparação, validação, serialização, sincronização e publicação rastreável e recuperável de releases do design system.

### Modified Capabilities

Nenhuma.

## Impact

- Scripts de automação em `scripts/`.
- `package.json`, incluindo `packageManager` com versão exata do npm, e manifests em `packages/*` e `apps/*`.
- Dependências internas entre workspaces.
- `package-lock.json`.
- `CHANGELOG.md`.
- GitHub Actions em `.github/workflows/`, required checks e proteção/ruleset de `master`.
- Política de branching: `master` recebe apenas `release/*` neste fluxo inicial.
- Estratégia normativa de sincronização `release/X.Y.Z -> develop` após o merge em `master`.
- Forma de instalação/execução do OpenSpec na CI.
- Documentação em `README.md` e `docs/release-process.md`.
- Testes automatizados do processo de release.
