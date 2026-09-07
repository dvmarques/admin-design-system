## Why

O projeto ainda não possui um processo padronizado e reproduzível para preparar e publicar releases. Hoje existe risco de divergência entre o commit efetivamente liberado, a versão coordenada do monorepo, o `CHANGELOG.md`, a tag Git e a GitHub Release.

O issue #7 define um fluxo semi-automatizado no qual a decisão de versão, integração e publicação continua humana, enquanto preparação, validações de consistência, resolução do commit liberado, tag e GitHub Release ficam automatizadas.

O repositório está atualmente alinhado em `0.0.1` no manifesto raiz, workspaces e lockfile, com `0.0.1 - Em andamento` no changelog. Não existem tags `v*` nem GitHub Releases, portanto esse estado caracteriza o bootstrap da primeira release.

A governança atual do repositório separa contratos estáveis de instruções operacionais. Por isso, a nova capability especificará apenas comportamentos observáveis da automação de release; política de branches, ruleset, passos humanos, back-merge e operação do workflow serão documentados no design e nas fontes operacionais apropriadas.

## What Changes

### Contrato estável da automação

- Criar um comando de preparação que recebe uma versão estável `X.Y.Z`, valida o estado, prepara todas as alterações e evita estado parcial em caso de falha.
- Rejeitar prerelease (`-alpha`, `-rc` etc.) e build metadata (`+...`) neste primeiro fluxo.
- Definir bootstrap explícito para a primeira release, impedindo downgrade.
- Validar versões fechadas do changelog por SemVer, unicidade e ordem decrescente, distinguindo a versão alvo de sua predecessora.
- Permitir escolha explícita de patch, minor ou major independentemente do placeholder `Em andamento`.
- Fechar a versão usando a data civil de `America/Sao_Paulo`, em `dd-mmm-aaaa`, com abreviações PT-BR fixas.
- Atualizar de forma coordenada manifesto raiz, `packages/*`, `apps/*`, dependências internas e `package-lock.json`.
- Fixar uma versão exata do npm para tornar a regeneração/validação do lockfile reproduzível.
- Criar validação reutilizável que bloqueie uma release inconsistente e, após o bootstrap, exija publicação consistente da predecessora.
- Publicar manualmente uma versão validando o commit exato integrado em `master`, sem assumir o HEAD corrente.
- Criar somente tags anotadas `vX.Y.Z`, nunca mover/recriar tags existentes e permitir recuperação idempotente quando a tag correta já existe.
- Criar/validar GitHub Release consistente com tag, commit e notas derivadas exclusivamente do changelog do commit liberado.
- Disponibilizar a validação OpenSpec na CI de forma versionada, reproduzível e multiplataforma.

### Processo operacional

- Manter `master` como linha estável, aceitando releases conforme a política documentada do repositório.
- Usar `release/X.Y.Z` a partir de `develop`, integrar em `master`, reconciliar o estado de release de volta para `develop` e só então remover a branch.
- Proteger `master` com PR e required checks, bloqueando push direto/force push/deleção conforme configuração documentada.
- Disparar a publicação a partir da default branch `develop` e serializar execuções conforme o workflow documentado.
- Documentar o procedimento completo em `docs/release-process.md`, manter resumo no `README.md` e referências operacionais concisas em `AGENTS.md`/`openspec/config.yaml` quando aplicável.

## Capabilities

### New Capabilities

- `release-process`: preparação, validação e publicação rastreável, consistente e recuperável de releases do design system.

### Modified Capabilities

Nenhuma.

## Impact

- Scripts de automação em `scripts/`.
- `package.json`, incluindo `packageManager` com versão exata do npm, e manifests em `packages/*` e `apps/*`.
- Dependências internas entre workspaces e `package-lock.json`.
- `CHANGELOG.md`.
- GitHub Actions em `.github/workflows/`.
- Configuração operacional de proteção/ruleset de `master`.
- Forma de instalação/execução do OpenSpec na CI.
- Documentação em `README.md`, `docs/release-process.md`, `AGENTS.md` e, quando necessário, `openspec/config.yaml`.
- Testes automatizados do processo de release.
