## ADDED Requirements

### Requirement: Preparação explícita de release
O sistema MUST fornecer um comando de preparação que receba uma versão SemVer `X.Y.Z` e prepare os arquivos versionados necessários sem publicar a release.

#### Scenario: Preparar uma versão válida
- **WHEN** o operador executar o comando de preparação informando uma versão válida que corresponde à única seção `Em andamento` do changelog
- **THEN** o sistema MUST fechar essa seção com a data corrente
- **AND** MUST atualizar a versão canônica do projeto para `X.Y.Z`
- **AND** MUST atualizar o lockfile quando aplicável
- **AND** MUST criar acima uma nova seção `Em andamento` para a próxima versão patch

#### Scenario: Estado inconsistente durante a preparação
- **WHEN** o changelog tiver formato inválido, mais de uma seção `Em andamento`, a versão já estiver fechada ou a versão solicitada não corresponder ao estado esperado
- **THEN** o comando MUST falhar sem concluir uma preparação parcial

### Requirement: Validação antes do merge
A CI MUST validar a consistência da release em pull requests de preparação antes do merge em `master`.

#### Scenario: PR de release consistente
- **WHEN** uma PR de preparação de release for validada
- **THEN** a CI MUST executar as validações gerais do projeto
- **AND** MUST executar a validação OpenSpec estrita
- **AND** MUST validar a consistência entre versão canônica e changelog

#### Scenario: PR de release inconsistente
- **WHEN** qualquer validação obrigatória falhar
- **THEN** a CI MUST falhar e impedir que o estado seja considerado pronto para release

### Requirement: Publicação manual e rastreável
A publicação de uma release MUST depender de um disparo manual do GitHub Actions informando a versão desejada.

#### Scenario: Publicar uma release válida
- **WHEN** o operador disparar `Publicar release` com `X.Y.Z`
- **THEN** o workflow MUST verificar que o commit alvo pertence a `master`
- **AND** MUST verificar que a versão canônica é `X.Y.Z`
- **AND** MUST verificar que o changelog contém a seção fechada correspondente
- **AND** MUST verificar que `vX.Y.Z` ainda não existe
- **AND** MUST criar uma tag Git anotada `vX.Y.Z` apontando para o commit validado em `master`
- **AND** MUST criar uma GitHub Release `vX.Y.Z` apontando para essa tag

#### Scenario: Tag já existente
- **WHEN** `vX.Y.Z` já existir
- **THEN** o workflow MUST falhar
- **AND** MUST NOT mover, sobrescrever ou recriar a tag existente

### Requirement: Notas derivadas do changelog
As notas da GitHub Release MUST ser extraídas somente da seção fechada da versão correspondente no `CHANGELOG.md`.

#### Scenario: Extrair notas da versão
- **WHEN** a release `X.Y.Z` for publicada
- **THEN** o corpo da GitHub Release MUST conter apenas o conteúdo pertencente à seção fechada `X.Y.Z`

### Requirement: Processo documentado
O repositório MUST documentar de forma clara quais etapas são humanas e quais são automatizadas.

#### Scenario: Descobrir como publicar uma release
- **WHEN** um mantenedor consultar o `README.md`
- **THEN** MUST encontrar um resumo do fluxo de release e um link para `docs/release-process.md`
- **AND** o documento detalhado MUST explicar preparação, PR, merge, disparo manual, validações, publicação e recuperação de falhas
