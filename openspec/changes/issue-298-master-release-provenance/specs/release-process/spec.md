# Spec Delta

## ADDED Requirements

### Requirement: Dispatch de publicação vinculado ao commit de merge aprovado

O processo de publicação MUST executar em `master` exclusivamente no commit de merge aprovado para a versão, sem usar HEAD posterior ou branch alternativa como identidade de publicação. A preparação de artifacts MUST continuar restrita a `develop`.

#### Scenario: Publicação manual no merge correto

- **WHEN** o mantenedor dispara a publicação em `refs/heads/master`
- **AND** o SHA da execução coincide com o merge SHA da PR de release aprovada
- **AND** o back-merge aprovado pertence ao histórico de `develop`
- **THEN** a publicação MAY prosseguir para as demais validações do artifact e registry
- **AND** MUST validar versão e notas do merge de `master` e de um SHA fixado e confiável de `develop`

#### Scenario: Ref diferente de master

- **WHEN** a publicação é disparada de `develop`, branch de feature, tag ou outra ref
- **THEN** o processo MUST rejeitar a execução antes de qualquer escrita no npm ou GitHub

#### Scenario: SHA posterior ou divergente

- **WHEN** a execução em `master` tem SHA diferente do `merge_commit_sha` resolvido para a versão
- **THEN** o processo MUST falhar antes de publicar, mesmo que o SHA pertença ao histórico de `master`

#### Scenario: Back-merge ausente ou inválido

- **WHEN** o back-merge aprovado não existir ou não pertencer ao histórico esperado de `develop`
- **THEN** o processo MUST falhar antes de publicar
