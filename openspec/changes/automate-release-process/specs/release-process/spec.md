## ADDED Requirements

### Requirement: Preparação explícita e atômica de release
O sistema MUST fornecer um comando de preparação que receba uma versão SemVer `X.Y.Z`, valide completamente o estado atual e prepare os arquivos versionados necessários sem publicar a release.

#### Scenario: Preflight válido
- **WHEN** o operador executar o comando em uma branch `release/X.Y.Z`, com working tree limpa, SemVer válida, versões coordenadas e única seção `Em andamento` correspondente
- **THEN** o sistema MUST concluir todas as validações antes de alterar qualquer arquivo
- **AND** MUST calcular previamente todas as alterações necessárias

#### Scenario: Preparar uma versão válida
- **WHEN** o preflight for concluído com sucesso
- **THEN** o sistema MUST fechar a seção `X.Y.Z - Em andamento` com a data corrente
- **AND** MUST atualizar para `X.Y.Z` o `package.json` raiz, todos os manifests de `packages/*` e `apps/*` e referências internas versionadas aplicáveis
- **AND** MUST regenerar o lockfile sem atualizar dependências externas
- **AND** MUST criar acima uma nova seção `Em andamento` para a próxima versão patch

#### Scenario: Estado inconsistente durante a preparação
- **WHEN** a branch não corresponder à versão, a working tree não estiver limpa, o changelog tiver formato inválido, houver zero ou múltiplas seções `Em andamento`, a versão já estiver fechada, as versões atuais estiverem divergentes ou a versão solicitada não corresponder ao estado esperado
- **THEN** o comando MUST falhar antes de iniciar alterações
- **AND** MUST NOT deixar uma preparação parcial produzida pelo script

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
A CI MUST validar a consistência da release em pull requests `release/*` direcionadas a `master` sem duplicar desnecessariamente os jobs de qualidade, build e E2E existentes.

#### Scenario: PR de release consistente
- **WHEN** uma PR `release/X.Y.Z -> master` for validada
- **THEN** a CI MUST executar os checks gerais já definidos pelo projeto
- **AND** MUST executar um check específico de release para versões coordenadas e changelog
- **AND** MUST executar a validação OpenSpec estrita em ambiente reproduzível e multiplataforma

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
- **AND** MUST obter o commit resultante efetivamente integrado por essa PR
- **AND** MUST validar nesse commit as versões coordenadas e a seção fechada do changelog
- **AND** MUST NOT assumir que o HEAD atual de `master` é o commit da release

#### Scenario: Publicar uma release válida
- **WHEN** a PR e o commit correspondente forem resolvidos e todas as validações passarem
- **THEN** o workflow MUST criar uma tag Git anotada `vX.Y.Z` apontando para o commit validado quando a tag ainda não existir
- **AND** MUST criar uma GitHub Release `vX.Y.Z` apontando para essa tag

#### Scenario: PR de release não resolvida
- **WHEN** não existir uma PR merged correspondente ou houver ambiguidade sobre o commit da release
- **THEN** o workflow MUST falhar sem criar tag ou GitHub Release

### Requirement: Tags imutáveis e recuperação idempotente
O processo MUST nunca mover, sobrescrever ou recriar uma tag existente e MUST permitir recuperação segura quando a tag foi criada mas a GitHub Release não.

#### Scenario: Tag ainda não existe
- **WHEN** `vX.Y.Z` não existir e a publicação for válida
- **THEN** o workflow MUST criar a tag no commit resolvido da release antes de criar a GitHub Release

#### Scenario: Tag existente no mesmo commit sem GitHub Release
- **WHEN** `vX.Y.Z` já existir apontando exatamente para o commit validado e a GitHub Release correspondente não existir
- **THEN** o workflow MUST preservar a tag existente
- **AND** MUST continuar criando somente a GitHub Release

#### Scenario: Tag existente em outro commit
- **WHEN** `vX.Y.Z` já existir apontando para um commit diferente
- **THEN** o workflow MUST falhar
- **AND** MUST NOT mover, sobrescrever ou recriar a tag existente

#### Scenario: GitHub Release já existente
- **WHEN** a GitHub Release `vX.Y.Z` já existir
- **THEN** o workflow MUST informar que a versão já foi publicada
- **AND** MUST NOT recriar silenciosamente a release

### Requirement: Notas derivadas do changelog
As notas da GitHub Release MUST ser extraídas somente da seção fechada da versão correspondente no `CHANGELOG.md` do commit liberado.

#### Scenario: Extrair notas da versão
- **WHEN** a release `X.Y.Z` for publicada ou recuperada após falha parcial
- **THEN** o corpo da GitHub Release MUST conter apenas o conteúdo pertencente à seção fechada `X.Y.Z` naquele commit

### Requirement: Processo documentado
O repositório MUST documentar de forma clara quais etapas são humanas e quais são automatizadas.

#### Scenario: Descobrir como publicar uma release
- **WHEN** um mantenedor consultar o `README.md`
- **THEN** MUST encontrar um resumo do fluxo de release e um link para `docs/release-process.md`
- **AND** o documento detalhado MUST explicar preparação, PR, checks obrigatórios, merge, resolução do commit, disparo manual, publicação e recuperação de falhas
- **AND** MUST registrar `0.0.1` como primeira release prevista enquanto esse continuar sendo o estado inicial do repositório
