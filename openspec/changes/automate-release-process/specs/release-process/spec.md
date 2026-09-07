## ADDED Requirements

### Requirement: Preparação explícita e atômica de release
O sistema MUST fornecer um comando de preparação que receba uma versão SemVer `X.Y.Z`, valide completamente o estado atual e prepare os arquivos versionados necessários sem publicar a release.

#### Scenario: Preflight válido
- **WHEN** o operador executar o comando em uma branch `release/X.Y.Z`, com working tree limpa, SemVer válida, versões coordenadas e exatamente uma seção `Em andamento`
- **THEN** o sistema MUST concluir todas as validações antes de alterar qualquer arquivo
- **AND** MUST validar que `X.Y.Z` é superior à última versão fechada
- **AND** MUST calcular previamente todas as alterações necessárias

#### Scenario: Preparar uma versão válida
- **WHEN** o preflight e a staging de todos os conteúdos forem concluídos com sucesso
- **THEN** o sistema MUST associar a única seção `Em andamento` à versão `X.Y.Z`, renomeando seu placeholder quando necessário
- **AND** MUST fechar essa seção com a data corrente
- **AND** MUST atualizar para `X.Y.Z` o `package.json` raiz, todos os manifests de `packages/*` e `apps/*` e referências internas versionadas aplicáveis
- **AND** MUST regenerar o lockfile sem atualizar dependências externas
- **AND** MUST criar acima uma nova seção `Em andamento` para a próxima versão patch como placeholder
- **AND** MUST aplicar as alterações aos arquivos reais somente depois de toda a preparação ter sido produzida com sucesso

#### Scenario: Estado inconsistente durante o preflight
- **WHEN** a branch não corresponder à versão, a working tree não estiver limpa, o changelog tiver formato inválido, houver zero ou múltiplas seções `Em andamento`, já existir seção conflitante para `X.Y.Z`, a versão solicitada não for superior à última release fechada ou as versões atuais estiverem divergentes
- **THEN** o comando MUST falhar antes de iniciar alterações
- **AND** MUST NOT deixar uma preparação parcial produzida pelo script

#### Scenario: Falha durante staging ou aplicação
- **WHEN** ocorrer uma falha depois do preflight, durante a geração do lockfile, staging ou substituição final dos arquivos
- **THEN** o sistema MUST terminar sem deixar os arquivos de trabalho em estado parcial
- **AND** MUST restaurar o estado anterior ou utilizar estratégia de substituição atômica equivalente

### Requirement: Escolha explícita da próxima versão
A versão da próxima release MUST ser escolhida pelo mantenedor e não MUST ser limitada ao placeholder patch aberto pelo processo anterior.

#### Scenario: Placeholder diferente da versão escolhida
- **WHEN** existir uma única seção `A.B.C - Em andamento` e o mantenedor preparar uma SemVer superior `X.Y.Z` diferente de `A.B.C`
- **THEN** o processo MUST preservar o conteúdo da seção em andamento
- **AND** MUST tratá-la como a seção `X.Y.Z` durante a preparação

### Requirement: Versionamento coordenado do monorepo
Todos os manifests versionados do produto e suas dependências internas MUST representar a mesma versão preparada.

#### Scenario: Release coordenada
- **WHEN** `X.Y.Z` tiver sido preparada
- **THEN** o manifesto raiz MUST declarar `X.Y.Z`
- **AND** todos os manifests em `packages/*` e `apps/*` MUST declarar `X.Y.Z`
- **AND** referências internas versionadas entre workspaces MUST usar a versão coordenada aplicável
- **AND** o lockfile MUST refletir esses manifests

#### Scenario: Divergência entre workspaces
- **WHEN** qualquer manifesto ou referência interna relevante divergir de `X.Y.Z`
- **THEN** a validação de release MUST falhar

### Requirement: Validação antes do merge
A CI MUST validar a consistência da release em pull requests destinadas a `master` sem duplicar desnecessariamente os jobs de qualidade, build e E2E existentes.

#### Scenario: PR de release consistente
- **WHEN** uma PR `release/X.Y.Z -> master` for validada
- **THEN** a CI MUST executar os checks gerais já definidos pelo projeto
- **AND** MUST executar um check específico de release para versões coordenadas e changelog
- **AND** MUST executar a validação OpenSpec estrita em ambiente reproduzível e multiplataforma

#### Scenario: PR não relacionada a release
- **WHEN** uma PR destinada a `master` não tiver head branch `release/*`
- **THEN** o check obrigatório de release MUST continuar presente
- **AND** MUST concluir com sucesso sem executar as validações específicas de preparação de release

#### Scenario: PR de release inconsistente
- **WHEN** qualquer check obrigatório falhar
- **THEN** a CI MUST marcar a preparação como inválida
- **AND** a configuração de proteção/ruleset de `master` MUST impedir o merge enquanto os checks obrigatórios não estiverem aprovados

### Requirement: OpenSpec reproduzível na CI
A validação OpenSpec executada na CI MUST usar uma forma versionada e multiplataforma de disponibilizar o CLI.

#### Scenario: Validar OpenSpec no runner Linux
- **WHEN** a CI executar em Linux
- **THEN** MUST usar o executável/launcher multiplataforma apropriado
- **AND** MUST NOT depender de `openspec.cmd` ou de uma instalação global preexistente no runner

### Requirement: Publicação manual no commit exato da release
A publicação de uma release MUST depender de um disparo manual do GitHub Actions informando a versão desejada e MUST usar o commit exato produzido pela PR correspondente.

#### Scenario: Resolver commit da release
- **WHEN** o operador disparar `Publicar release` com `X.Y.Z`
- **THEN** o workflow MUST resolver de forma inequívoca a PR merged `release/X.Y.Z -> master`
- **AND** MUST usar o `merge_commit_sha` dessa PR como commit efetivamente liberado
- **AND** MUST validar nesse commit as versões coordenadas e a seção fechada do changelog
- **AND** MUST NOT assumir que o HEAD atual de `master` é o commit da release

#### Scenario: Permissões mínimas do workflow
- **WHEN** o workflow de publicação for executado
- **THEN** MUST declarar explicitamente `contents: write`
- **AND** MUST declarar explicitamente `pull-requests: read`
- **AND** MUST manter outras permissões desabilitadas salvo necessidade explícita

#### Scenario: PR de release não resolvida
- **WHEN** não existir uma PR merged correspondente ou houver ambiguidade sobre o commit da release
- **THEN** o workflow MUST falhar sem criar tag ou GitHub Release

### Requirement: Tags anotadas imutáveis e recuperação idempotente
O processo MUST usar tags anotadas para releases, nunca mover, sobrescrever ou recriar uma tag existente e MUST permitir recuperação segura quando a tag foi criada mas a GitHub Release não.

#### Scenario: Tag ainda não existe
- **WHEN** `vX.Y.Z` não existir e a publicação for válida
- **THEN** o workflow MUST criar uma tag anotada no `merge_commit_sha` validado antes de criar a GitHub Release

#### Scenario: Tag anotada existente no mesmo commit sem GitHub Release
- **WHEN** `vX.Y.Z` já existir como tag anotada e seu commit dereferenciado for exatamente o commit validado e a GitHub Release correspondente não existir
- **THEN** o workflow MUST preservar a tag existente
- **AND** MUST continuar criando somente a GitHub Release

#### Scenario: Tag lightweight existente
- **WHEN** `vX.Y.Z` existir como lightweight tag, ainda que aponte para o commit esperado
- **THEN** o workflow MUST falhar
- **AND** MUST NOT substituir ou recriar a tag

#### Scenario: Tag anotada existente em outro commit
- **WHEN** `vX.Y.Z` já existir e seu commit dereferenciado for diferente do commit validado
- **THEN** o workflow MUST falhar
- **AND** MUST NOT mover, sobrescrever ou recriar a tag existente

### Requirement: GitHub Release consistente e idempotente
Uma GitHub Release existente MUST ser tratada como publicação concluída somente quando estiver consistente com tag, commit e changelog esperados.

#### Scenario: GitHub Release já existente e consistente
- **WHEN** a GitHub Release `vX.Y.Z` já existir
- **AND** estiver associada à tag `vX.Y.Z`
- **AND** a tag anotada dereferenciar para o commit validado
- **AND** o corpo da release corresponder às notas extraídas do changelog desse commit
- **THEN** o workflow MUST encerrar como sucesso/no-op explícito
- **AND** MUST NOT recriar ou alterar silenciosamente a release

#### Scenario: GitHub Release existente divergente
- **WHEN** a GitHub Release `vX.Y.Z` existir mas tag, commit ou notas divergirem do estado esperado
- **THEN** o workflow MUST falhar
- **AND** MUST NOT alterar a tag ou a release existente

### Requirement: Notas derivadas do changelog
As notas da GitHub Release MUST ser extraídas somente da seção fechada da versão correspondente no `CHANGELOG.md` do commit liberado.

#### Scenario: Extrair notas da versão
- **WHEN** a release `X.Y.Z` for publicada ou recuperada após falha parcial
- **THEN** o corpo da GitHub Release MUST conter apenas o conteúdo pertencente à seção fechada `X.Y.Z` naquele commit

### Requirement: Continuidade pós-release em develop
O estado preparado da release MUST ser sincronizado de volta para `develop` antes da preparação da próxima release.

#### Scenario: Sincronizar release concluída
- **WHEN** a PR `release/X.Y.Z -> master` tiver sido integrada
- **THEN** as alterações da preparação MUST ser integradas também em `develop` por merge/PR ou mecanismo equivalente sem reescrever refs à força
- **AND** `develop` MUST conter a versão coordenada, a seção `X.Y.Z` fechada e o novo placeholder `Em andamento`

#### Scenario: Próxima release com develop desatualizada
- **WHEN** `develop` ainda não contiver o estado pós-release anterior
- **THEN** a próxima preparação de release MUST NOT ser considerada pronta para iniciar

### Requirement: Processo documentado
O repositório MUST documentar de forma clara quais etapas são humanas e quais são automatizadas.

#### Scenario: Descobrir como publicar uma release
- **WHEN** um mantenedor consultar o `README.md`
- **THEN** MUST encontrar um resumo do fluxo de release e um link para `docs/release-process.md`
- **AND** o documento detalhado MUST explicar preparação, escolha da versão, PR, checks obrigatórios, merge, sincronização com `develop`, resolução do commit, disparo manual, publicação e recuperação de falhas
