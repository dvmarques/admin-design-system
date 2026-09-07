## Purpose

Define o ciclo reproduzível de preparação, validação, serialização, proteção, sincronização pós-release e publicação do Admin Design System, mantendo código, versão, changelog, tag, GitHub Release e `develop` coerentes entre si.

## ADDED Requirements

### Requirement: Preparação explícita e atômica de release
O sistema MUST fornecer um comando de preparação que receba uma versão SemVer `X.Y.Z`, valide completamente o estado atual e prepare os arquivos necessários sem publicar a release.

#### Scenario: Bootstrap da primeira release
- **WHEN** não existir versão fechada no changelog nem tag `v*` ou GitHub Release anterior
- **AND** os manifests coordenados declararem uma única versão atual `A.B.C`
- **THEN** o alvo da primeira release MUST ser uma SemVer maior ou igual a `A.B.C`
- **AND** downgrade MUST NOT ser permitido
- **AND** MUST existir exatamente uma seção `Em andamento` sem conflito com o alvo escolhido

#### Scenario: Preflight após a primeira release
- **WHEN** existir ao menos uma versão fechada
- **THEN** a versão coordenada atual dos manifests MUST corresponder à última versão fechada
- **AND** a versão alvo MUST ser estritamente superior à última versão fechada

#### Scenario: Preparar uma versão válida
- **WHEN** o preflight e a staging de todos os conteúdos forem concluídos com sucesso
- **THEN** o sistema MUST associar a única seção `Em andamento` à versão `X.Y.Z`, renomeando seu placeholder quando necessário
- **AND** MUST preservar o conteúdo acumulado nessa seção
- **AND** MUST fechar essa seção com a data corrente
- **AND** MUST atualizar para `X.Y.Z` o `package.json` raiz, todos os manifests de `packages/*` e `apps/*` e referências internas versionadas aplicáveis
- **AND** MUST regenerar o lockfile sem atualizar dependências externas
- **AND** MUST criar acima uma nova seção `Em andamento` para a próxima versão patch apenas como placeholder
- **AND** MUST aplicar alterações reais somente depois de toda a staging ter sido produzida com sucesso

#### Scenario: Estado inconsistente durante o preflight
- **WHEN** a branch não corresponder à versão, a working tree não estiver limpa, o changelog tiver formato inválido, houver zero ou múltiplas seções `Em andamento`, existir seção conflitante para `X.Y.Z`, as versões atuais estiverem divergentes, a regra de bootstrap não for satisfeita ou a versão alvo não respeitar a ordenação exigida
- **THEN** o comando MUST falhar antes de iniciar alterações

#### Scenario: Falha durante staging ou aplicação
- **WHEN** ocorrer falha durante geração do lockfile, staging ou substituição final
- **THEN** o sistema MUST terminar sem deixar os arquivos de trabalho em estado parcial
- **AND** MUST restaurar integralmente o estado anterior ou utilizar estratégia de substituição atômica equivalente

### Requirement: Changelog versionado de forma inequívoca
O processo MUST identificar versões fechadas por SemVer e data, sem depender apenas da posição textual do arquivo.

#### Scenario: Determinar última versão fechada
- **WHEN** existirem uma ou mais seções fechadas no `CHANGELOG.md`
- **THEN** a última versão fechada MUST ser a maior SemVer entre essas seções
- **AND** a seção `Em andamento` MUST NOT ser considerada versão fechada

#### Scenario: Validar integridade das versões fechadas
- **WHEN** o changelog for validado
- **THEN** versões fechadas MUST ser únicas
- **AND** MUST aparecer em ordem SemVer decrescente
- **AND** duplicidade ou ordem inválida MUST causar falha de validação

### Requirement: Escolha explícita da próxima versão
A próxima release MUST ser escolhida pelo mantenedor e não MUST ser limitada ao placeholder patch aberto pelo processo anterior.

#### Scenario: Placeholder diferente da versão escolhida
- **WHEN** existir uma única seção `A.B.C - Em andamento` e o mantenedor preparar uma SemVer válida `X.Y.Z` diferente de `A.B.C`
- **THEN** o processo MUST preservar o conteúdo da seção
- **AND** MUST tratá-la como `X.Y.Z` durante a preparação

### Requirement: Versionamento coordenado e toolchain reproduzível
Todos os manifests versionados do produto, dependências internas e lockfile MUST representar a mesma versão preparada, e a regeneração do lockfile MUST usar uma versão exata e compartilhada do npm.

#### Scenario: Release coordenada
- **WHEN** `X.Y.Z` tiver sido preparada
- **THEN** o manifesto raiz MUST declarar `X.Y.Z`
- **AND** todos os manifests em `packages/*` e `apps/*` MUST declarar `X.Y.Z`
- **AND** referências internas versionadas MUST usar a versão coordenada aplicável
- **AND** o lockfile MUST refletir esses manifests

#### Scenario: npm reproduzível
- **WHEN** a preparação ou CI regenerar/validar o lockfile
- **THEN** o projeto MUST declarar uma versão exata do npm em `packageManager`
- **AND** a preparação e a CI MUST usar essa mesma versão

### Requirement: `master` exclusiva e protegida para releases
A branch `master` MUST aceitar somente integração de branches `release/*` neste fluxo inicial e MUST ser protegida contra alterações fora do fluxo de PR aprovado.

#### Scenario: PR de release para master
- **WHEN** uma PR `release/X.Y.Z -> master` for validada
- **THEN** a CI MUST executar os checks gerais do projeto
- **AND** MUST executar o `release-check`

#### Scenario: PR não-release para master
- **WHEN** o evento for `pull_request` destinado a `master`
- **AND** a head branch não for `release/*`
- **THEN** o `release-check` MUST falhar explicitamente
- **AND** MUST informar que `master` aceita somente branches de release neste fluxo

#### Scenario: Push pós-merge em master
- **WHEN** a CI executar por evento `push` em `master`
- **THEN** a regra de origem baseada em `github.head_ref` MUST NOT ser aplicada
- **AND** os checks gerais MAY continuar executando normalmente

#### Scenario: Proteção da branch
- **WHEN** a proteção/ruleset de `master` for configurada
- **THEN** MUST exigir pull request antes de merge
- **AND** MUST exigir os status checks definidos para o fluxo
- **AND** MUST bloquear push direto fora do fluxo aprovado
- **AND** MUST bloquear force push
- **AND** MUST bloquear deleção de `master`
- **AND** qualquer bypass administrativo MUST ser mínimo e documentado

### Requirement: Release anterior publicada antes da próxima integração
Uma nova release MUST NOT ser integrada em `master` enquanto a última versão fechada anterior ainda não estiver publicada de forma consistente.

#### Scenario: Primeira release
- **WHEN** não existir versão fechada anterior
- **THEN** o `release-check` MUST permitir o bootstrap sem exigir publicação precedente

#### Scenario: Release anterior publicada
- **WHEN** existir versão fechada anterior à release em preparação
- **THEN** o `release-check` MUST validar que ela possui tag anotada válida e GitHub Release consistente
- **AND** MUST falhar se a publicação anterior estiver ausente ou divergente

### Requirement: OpenSpec reproduzível na CI
A validação OpenSpec executada na CI MUST usar uma forma versionada e multiplataforma de disponibilizar o CLI.

#### Scenario: Runner Linux
- **WHEN** a CI executar em Linux
- **THEN** MUST usar o launcher multiplataforma apropriado
- **AND** MUST NOT depender de `openspec.cmd` ou instalação global preexistente

### Requirement: Publicação manual enfileirada no commit exato
A publicação MUST depender de `workflow_dispatch`, MUST ser serializada sem substituir execuções pendentes e MUST usar o commit exato produzido pela PR de release.

#### Scenario: Concorrência
- **WHEN** houver múltiplos disparos de publicação
- **THEN** o workflow MUST usar um grupo de `concurrency` único para releases
- **AND** MUST usar `queue: max`
- **AND** MUST NOT usar `cancel-in-progress: true`

#### Scenario: Resolver commit da release
- **WHEN** o operador disparar `Publicar release` com `X.Y.Z`
- **THEN** o workflow MUST localizar de forma inequívoca a PR merged `release/X.Y.Z -> master`
- **AND** MUST usar o `merge_commit_sha` dessa PR
- **AND** MUST verificar que esse commit continua alcançável a partir do `master` atual
- **AND** MUST fazer checkout explícito desse SHA antes de validar versão, changelog e notas
- **AND** MUST NOT usar o checkout implícito do `workflow_dispatch` como substituto do commit liberado

#### Scenario: Commit não alcançável
- **WHEN** o `merge_commit_sha` não pertencer mais ao histórico de `master`
- **THEN** o workflow MUST falhar sem criar ou alterar tag/release

#### Scenario: Permissões mínimas
- **WHEN** o workflow for executado
- **THEN** MUST declarar `contents: write`
- **AND** MUST declarar `pull-requests: read`
- **AND** MUST manter outras permissões desabilitadas salvo necessidade explícita

### Requirement: Tags anotadas imutáveis e recuperação idempotente
O processo MUST usar apenas tags anotadas de release e MUST nunca mover, sobrescrever ou recriar uma tag existente.

#### Scenario: Tag inexistente
- **WHEN** `vX.Y.Z` não existir e todas as validações passarem
- **THEN** o workflow MUST criar uma tag anotada no `merge_commit_sha` validado antes da GitHub Release

#### Scenario: Tag anotada existente no mesmo commit
- **WHEN** `vX.Y.Z` existir como tag anotada e seu commit dereferenciado for o commit validado
- **THEN** a tag MAY ser reutilizada sem alteração

#### Scenario: Tag lightweight
- **WHEN** `vX.Y.Z` existir como lightweight tag
- **THEN** o workflow MUST falhar
- **AND** MUST NOT substituir ou recriar a tag

#### Scenario: Tag anotada em outro commit
- **WHEN** o commit dereferenciado da tag divergir do commit validado
- **THEN** o workflow MUST falhar sem alterar a tag

### Requirement: GitHub Release consistente e idempotente
Uma GitHub Release existente MUST ser tratada como publicação concluída somente quando todos os seus metadados relevantes corresponderem ao estado esperado.

#### Scenario: GitHub Release existente e consistente
- **WHEN** a GitHub Release `vX.Y.Z` já existir
- **AND** `tag_name` for `vX.Y.Z`
- **AND** o nome da release for `vX.Y.Z`
- **AND** `draft` for `false`
- **AND** `prerelease` for `false`
- **AND** a tag anotada dereferenciar para o commit validado
- **AND** o body for equivalente às notas extraídas após normalizar somente CRLF/LF e newline final
- **THEN** o workflow MUST encerrar como sucesso/no-op explícito
- **AND** MUST NOT modificar tag ou release

#### Scenario: GitHub Release existente divergente
- **WHEN** qualquer um desses metadados divergir
- **THEN** o workflow MUST falhar
- **AND** MUST NOT alterar tag ou release

#### Scenario: Recuperação após criação da tag
- **WHEN** a tag anotada válida existir no commit esperado e a GitHub Release não existir
- **THEN** o workflow MUST preservar a tag
- **AND** MUST criar somente a GitHub Release

### Requirement: Notas derivadas do changelog
As notas da GitHub Release MUST vir somente da seção fechada da versão correspondente no `CHANGELOG.md` do commit liberado.

#### Scenario: Extrair notas
- **WHEN** a release `X.Y.Z` for publicada ou recuperada
- **THEN** o corpo MUST conter apenas o conteúdo pertencente à seção fechada `X.Y.Z` daquele commit

### Requirement: Continuidade pós-release em develop
A mesma branch `release/X.Y.Z` integrada em `master` MUST ser sincronizada de volta para `develop` antes de ser removida e antes da próxima preparação de release.

#### Scenario: Congelar branch após merge em master
- **WHEN** a PR `release/X.Y.Z -> master` tiver sido integrada
- **THEN** a branch de release MUST NOT receber novas mudanças funcionais
- **AND** o estado de preparação que entrou em `master` MUST permanecer como referência do retorno para `develop`

#### Scenario: Sincronização normativa
- **WHEN** a PR `release/X.Y.Z -> master` tiver sido integrada
- **THEN** MUST ser aberto/realizado PR `release/X.Y.Z -> develop`
- **AND** o PR de retorno MUST conter somente o estado de release já integrado em `master` e ajustes estritamente necessários para resolução de conflitos do back-merge
- **AND** conflitos com mudanças posteriores em `develop` MUST ser resolvidos explicitamente
- **AND** refs MUST NOT ser reescritas à força

#### Scenario: Primeira implantação do workflow
- **WHEN** `release.yml` ainda não existir na default branch `develop`
- **THEN** a sincronização `release/X.Y.Z -> develop` MUST ocorrer antes do primeiro `workflow_dispatch`

#### Scenario: Próxima release
- **WHEN** `develop` ainda não contiver o estado pós-release anterior
- **THEN** a próxima preparação MUST NOT ser considerada pronta para iniciar

### Requirement: Processo documentado
O repositório MUST documentar claramente o fluxo e suas responsabilidades.

#### Scenario: Descobrir como publicar uma release
- **WHEN** um mantenedor consultar o `README.md`
- **THEN** MUST encontrar um resumo e link para `docs/release-process.md`
- **AND** o documento detalhado MUST explicar bootstrap, definição da última versão fechada, escolha da versão, preparação atômica, toolchain, política/proteção exclusiva de `master`, comportamento em `pull_request` e `push`, sequência entre releases, congelamento e PR de retorno para `develop`, publicação, recuperação e configuração de ruleset
