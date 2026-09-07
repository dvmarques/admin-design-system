## Why

O projeto ainda não possui um processo padronizado e reproduzível para preparar e publicar releases. Hoje existe risco de divergência entre o commit efetivamente liberado, a versão do monorepo, o `CHANGELOG.md`, a tag Git, a GitHub Release e o estado de continuidade em `develop`.

O issue #7 define a necessidade de um fluxo semi-automatizado no qual a decisão de publicar continua manual, enquanto as etapas mecânicas, validações de consistência e recuperação de falhas ficam automatizadas.

O repositório está atualmente alinhado em `0.0.1` no manifesto raiz, workspaces e lockfile, com `0.0.1 - Em andamento` no changelog. Portanto `0.0.1` é a primeira release prevista pelo processo.

## What Changes

- Criar um comando de preparação de release que recebe `X.Y.Z`, executa preflight completo sem alterar arquivos e prepara todas as mudanças de forma atômica, aplicando-as somente quando manifests, dependências internas, lockfile e changelog puderem ser produzidos com sucesso.
- Permitir que o mantenedor escolha qualquer próxima versão SemVer válida superior à última release fechada; a seção `Em andamento` pode ser renomeada da versão placeholder para a versão escolhida durante a preparação.
- Fechar no changelog a seção da versão escolhida com a data corrente e abrir automaticamente a próxima versão patch como placeholder `Em andamento`.
- Atualizar de forma coordenada todos os manifests do monorepo, dependências internas e lockfile.
- Adicionar validações específicas de release à CI existente antes do merge em `master`, sem duplicar os jobs de qualidade, build e E2E já existentes.
- Manter o check obrigatório de release presente em PRs para `master`, executando a validação específica quando a origem for `release/*` e concluindo com sucesso nos demais casos, evitando checks obrigatórios permanentemente pendentes.
- Garantir que os checks necessários sejam exigidos pela proteção/ruleset de `master` para que uma release inconsistente não possa ser integrada.
- Criar workflow manual `Publicar release` que localiza a PR merged `release/X.Y.Z -> master`, usa seu `merge_commit_sha` como commit liberado e cria a tag anotada `vX.Y.Z` nesse commit, mesmo que `master` já tenha avançado.
- Validar tags existentes como tags anotadas e comparar o commit dereferenciado da tag com o commit liberado antes de qualquer recuperação.
- Tornar a publicação recuperável: se a tag anotada já existir no mesmo commit e a GitHub Release ainda não existir, reutilizar a tag sem alterá-la e concluir apenas a criação da release; se a tag ou release existente divergir do estado esperado, falhar sem alterar recursos remotos.
- Validar uma GitHub Release já existente contra tag, commit e notas extraídas antes de tratá-la como publicação já concluída.
- Extrair as notas da GitHub Release exclusivamente da seção fechada da versão no `CHANGELOG.md` do commit liberado.
- Sincronizar de volta para `develop` as mudanças da preparação de release após a integração em `master`, para que a próxima release parta do changelog e versionamento atualizados.
- Disponibilizar o OpenSpec de forma reprodutível e multiplataforma na CI, sem depender de instalação global ou do launcher Windows `openspec.cmd`.
- Documentar o processo completo em `docs/release-process.md` e incluir no `README.md` um resumo com link para esse documento.
- Manter a escolha da versão, criação da branch/PR, merge, sincronização com `develop` e disparo da publicação como ações humanas explícitas quando não forem automatizadas pelo GitHub.

## Capabilities

### New Capabilities

- `release-process`: preparação, validação, sincronização e publicação rastreável e recuperável de releases do design system.

### Modified Capabilities

Nenhuma.

## Impact

- Scripts de automação em `scripts/`.
- Scripts npm e versões em `package.json`, `packages/*/package.json` e `apps/*/package.json`.
- Dependências internas entre workspaces.
- `package-lock.json`.
- `CHANGELOG.md`.
- GitHub Actions em `.github/workflows/` e configuração de checks obrigatórios de `master`.
- Estratégia de sincronização entre `master` e `develop` após releases.
- Forma de instalação/execução do OpenSpec na CI.
- Documentação em `README.md` e `docs/release-process.md`.
- Testes automatizados do processo de release.
