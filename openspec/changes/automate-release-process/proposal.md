## Why

O projeto ainda não possui um processo padronizado e reproduzível para preparar e publicar releases. Hoje existe risco de divergência entre o commit efetivamente liberado, a versão coordenada do monorepo, o `CHANGELOG.md`, a tag Git e a GitHub Release.

O issue #7 define um fluxo semi-automatizado no qual a decisão de versão, integração e publicação continua humana, enquanto preparação, validações de consistência, resolução do commit liberado, tag e GitHub Release ficam automatizadas.

O repositório está atualmente alinhado em `0.0.1` no manifesto raiz, workspaces e lockfile, com `0.0.1 - Em andamento` no changelog. Não existem tags de release `vX.Y.Z` nem GitHub Releases correspondentes, portanto esse estado caracteriza o bootstrap da primeira release.

A governança atual do repositório separa contratos estáveis de instruções operacionais. Por isso, a nova capability especificará apenas comportamentos observáveis da automação de release; política de branches, rulesets, passos humanos, back-merge e operação do workflow serão documentados no design e nas fontes operacionais apropriadas.

## What Changes

### Contrato estável da automação

- Criar um comando local de preparação que recebe uma versão estável `X.Y.Z`, valida changelog/manifests/working copy, prepara todas as alterações e evita estado parcial em caso de falha, sem depender de acesso à API do GitHub.
- Não suportar prerelease (`-alpha`, `-rc` etc.) nem build metadata (`+...`) neste primeiro fluxo; eventual suporte futuro deverá ser especificado separadamente.
- Definir bootstrap local explícito para a primeira release com base no changelog e na versão coordenada atual, permitindo alvo maior ou igual ao estado atual e proibindo downgrade.
- Rejeitar na validação remota pré-integração qualquer tag/GitHub Release já existente para a própria versão alvo `vX.Y.Z`; no bootstrap sem predecessora, rejeitar também histórico remoto de releases incompatível com a ausência de versões fechadas.
- Definir a última versão fechada como a maior SemVer entre as seções fechadas do `CHANGELOG.md`, exigindo versões fechadas únicas, ordenadas de forma decrescente e com data no formato oficial.
- Definir a release anterior de um alvo `X.Y.Z` como a maior SemVer fechada estritamente menor que o alvo, evitando confundir a versão em preparação com sua predecessora.
- Após a primeira release, exigir que o estado coordenado atual corresponda à última versão fechada antes da preparação e que a próxima `X.Y.Z` seja uma SemVer estritamente superior.
- Permitir que o mantenedor escolha patch, minor ou major; a única seção `Em andamento` pode ser renomeada do placeholder para a versão escolhida, preservando conteúdo.
- Fechar a versão usando a data civil de `America/Sao_Paulo`, em `dd-mmm-aaaa`, com abreviações PT-BR fixas.
- Atualizar de forma coordenada manifesto raiz, `packages/*`, `apps/*`, dependências internas e `package-lock.json`.
- Fixar uma versão exata do npm para tornar a regeneração/validação do lockfile reproduzível.
- Criar validação reutilizável que bloqueie uma release inconsistente e, após o bootstrap, exija publicação consistente da predecessora contra um commit resolvido independentemente.
- Publicar manualmente uma versão validando o commit exato integrado na linha estável, sem assumir o HEAD corrente.
- Criar somente tags anotadas `vX.Y.Z`, nunca mover/recriar tags existentes e permitir recuperação idempotente quando a tag correta já existe.
- Criar/validar GitHub Release consistente com tag, commit e notas derivadas exclusivamente do changelog do commit liberado.
- Disponibilizar a validação OpenSpec na CI de forma versionada, reproduzível e multiplataforma.

### Processo operacional

- Manter `master` como linha estável, aceitando releases conforme a política documentada do repositório.
- Usar `release/X.Y.Z` a partir de `develop`, integrar em `master`, reconciliar o estado de release de volta para `develop` e só então publicar/remover a branch.
- Proteger `master` com PR e required checks, bloqueando push direto/force push/deleção conforme configuração documentada.
- Proteger também `develop`, por ser a default branch que contém a definição revisada dos workflows e recebe o back-merge, exigindo PR + CI e bloqueando push direto, force push e deleção; sem restringir as branches de origem como em `master`.
- Tornar obrigatório em `develop` um `develop-policy` que preserve histórico fechado e versão coordenada em PRs comuns e aplique regras estritas de back-merge em `release/X.Y.Z`.
- Exigir que `Publicar release` confirme a PR de back-merge merged e o estado atual de `develop` consistente antes de criar tag/GitHub Release.
- Disparar a publicação a partir da default branch `develop` e serializar execuções conforme o workflow documentado.
- Separar a publicação em validação read-only e mutação privilegiada; o job com escrita rederiva independentemente commit/notas/estado remoto por lógica confiável do workflow e não executa scripts do commit liberado.
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
- Configuração operacional de proteção/rulesets de `master` e `develop`.
- Forma de instalação/execução do OpenSpec na CI.
- Documentação em `README.md`, `docs/release-process.md`, `AGENTS.md` e, quando necessário, `openspec/config.yaml`.
- Testes automatizados do processo de release.
