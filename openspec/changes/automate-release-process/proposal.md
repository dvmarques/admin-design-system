## Why

O projeto ainda não possui um processo padronizado e reproduzível para preparar e publicar releases. Hoje existe risco de divergência entre o commit efetivamente liberado, a versão do monorepo, o `CHANGELOG.md`, a tag Git, a GitHub Release e o estado de continuidade em `develop`.

O issue #7 define a necessidade de um fluxo semi-automatizado no qual a decisão de publicar continua manual, enquanto preparação, validações de consistência, serialização das releases, proteção de `master` e recuperação de falhas ficam automatizadas.

O repositório está atualmente alinhado em `0.0.1` no manifesto raiz, workspaces e lockfile, com `0.0.1 - Em andamento` no changelog. Não existem tags `v*` nem GitHub Releases, portanto esse estado caracteriza o bootstrap da primeira release.

## What Changes

- Criar um comando de preparação que recebe uma versão estável `X.Y.Z`, executa preflight somente leitura, produz todas as alterações em staging e aplica os arquivos reais de forma atômica somente após sucesso completo.
- Não suportar prerelease (`-alpha`, `-rc` etc.) nem build metadata (`+...`) neste primeiro fluxo; eventual suporte futuro deverá ser especificado separadamente.
- Definir bootstrap explícito para a primeira release: quando não existir versão fechada, tag `v*` ou GitHub Release anterior, permitir como alvo qualquer SemVer maior ou igual à versão coordenada atual, sem permitir downgrade.
- Definir a última versão fechada como a maior SemVer entre as seções fechadas do `CHANGELOG.md`, exigindo versões fechadas únicas e ordenadas de forma decrescente no arquivo.
- Definir a release anterior de um alvo `X.Y.Z` como a maior SemVer fechada estritamente menor que o alvo, evitando confundir a versão em preparação com sua predecessora.
- Após a primeira release, exigir que o estado coordenado atual corresponda à última versão fechada antes da preparação e que a próxima `X.Y.Z` seja uma SemVer estritamente superior.
- Permitir que o mantenedor escolha patch, minor ou major; a única seção `Em andamento` pode ser renomeada do placeholder para a versão escolhida, preservando conteúdo.
- Fechar a versão no changelog usando a data civil de `America/Sao_Paulo`, em `dd-mmm-aaaa`, com abreviações PT-BR fixas (`jan`, `fev`, `mar`, `abr`, `mai`, `jun`, `jul`, `ago`, `set`, `out`, `nov`, `dez`).
- Atualizar de forma coordenada manifesto raiz, `packages/*`, `apps/*`, dependências internas e `package-lock.json`.
- Fixar uma versão exata do npm no projeto e reutilizá-la localmente e na CI para tornar a regeneração do lockfile reproduzível.
- Tornar `master` exclusiva para integração de branches `release/*`, tanto por política de PR quanto por proteção/ruleset contra push direto, force push e deleção.
- Fazer o `release-check` aplicar a política de origem apenas em eventos `pull_request` destinados a `master`, sem falhar indevidamente em execuções de `push` pós-merge.
- Exigir que a release anterior ao alvo esteja publicada com tag anotada e GitHub Release consistentes antes de permitir a integração de uma nova release.
- Criar workflow manual `Publicar release` serializado por `concurrency` com grupo único e `queue: max`, sem cancelar publicação em andamento.
- Exigir que o `workflow_dispatch` de publicação seja executado a partir da default branch `develop`; dispatch em qualquer outro branch/tag deve falhar antes de qualquer escrita.
- Localizar a PR merged `release/X.Y.Z -> master`, usar seu `merge_commit_sha`, validar que esse commit continua alcançável a partir de `master` e fazer checkout explícito dele antes de validar manifests, changelog e notas.
- Criar somente tags anotadas `vX.Y.Z`; tags existentes devem ser dereferenciadas até o commit e nunca movidas, sobrescritas ou recriadas.
- Tratar GitHub Release existente como idempotente apenas quando tag, commit, nome, estado draft/prerelease e notas forem equivalentes ao esperado.
- Normalizar somente finais de linha e newline final ao comparar release notes, sem aceitar diferenças reais de conteúdo.
- Sincronizar obrigatoriamente a mesma branch `release/X.Y.Z` de volta para `develop` por PR após o merge em `master`, sem permitir novo delta funcional da release branch.
- Permitir incorporar/mesclar o estado mais recente de `develop` na release branch exclusivamente para resolver o back-merge, desde que o PR de retorno não introduza delta funcional novo e permaneça restrito aos arquivos de preparação.
- Limitar o PR de retorno aos arquivos de preparação de release (`CHANGELOG.md`, manifests e lockfile).
- Preservar o bloco fechado `X.Y.Z` exatamente como liberado em `master`; entradas adicionadas em `develop` após o corte devem permanecer na nova seção `Em andamento`.
- Recoordenar, no back-merge, todos os manifests existentes em `develop`, inclusive workspaces criados após o corte, para `X.Y.Z`, preservando dependências e metadados futuros.
- Manter a branch `release/X.Y.Z` até que back-merge para `develop` e publicação da GitHub Release estejam ambos concluídos com sucesso.
- Exigir a sincronização com `develop` antes da primeira publicação para disponibilizar o `workflow_dispatch` na default branch, e sempre antes da próxima preparação de release.
- Disponibilizar OpenSpec de forma versionada, reproduzível e multiplataforma na CI.
- Documentar o processo em `docs/release-process.md` e manter no `README.md` apenas um resumo com link.

## Capabilities

### New Capabilities

- `release-process`: preparação, validação, serialização, proteção, sincronização e publicação rastreável e recuperável de releases do design system.

### Modified Capabilities

Nenhuma.

## Impact

- Scripts de automação em `scripts/`.
- `package.json`, incluindo `packageManager` com versão exata do npm, e manifests em `packages/*` e `apps/*`.
- Dependências internas entre workspaces.
- `package-lock.json`.
- `CHANGELOG.md`.
- GitHub Actions em `.github/workflows/`, required checks e proteção/ruleset de `master`.
- Política de branching: `master` recebe apenas `release/*` neste fluxo inicial e não aceita push direto.
- Estratégia normativa de sincronização `release/X.Y.Z -> develop` após o merge em `master`, com retenção da branch até publicação concluída.
- Forma de instalação/execução do OpenSpec na CI.
- Documentação em `README.md` e `docs/release-process.md`.
- Testes automatizados do processo de release.
