# Spec Delta

## ADDED Requirements

### Requirement: Política editorial das notas públicas de release

A revisão humana do `CHANGELOG.md` MUST selecionar e redigir notas de cada versão pelo impacto para quem consome os pacotes, sem perder referências, avisos de compatibilidade e rastreabilidade de alterações internas. A seleção MUST ocorrer antes de aprovar a seção por SHA-256 e MUST NOT alterar versões fechadas.

#### Scenario: Mudança relevante para o consumidor

- **WHEN** uma alteração adiciona ou altera componente, API ou comportamento visível, corrige defeito relevante, afeta segurança, depreca/remove recurso ou exige migração
- **THEN** a revisão editorial MUST incluir uma nota pública objetiva sob a categoria pertinente `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed` ou `Security`
- **AND** MUST preservar referências às issues
- **AND** MUST destacar incompatibilidades e migrações obrigatórias

#### Scenario: Alteração exclusivamente interna

- **WHEN** uma mudança de CI, tooling, refatoração ou manutenção não altera o consumo, a distribuição, a segurança ou a compatibilidade dos pacotes
- **THEN** a revisão MAY omitir a entrada das notas públicas
- **AND** MUST preservar sua rastreabilidade em issues, PRs, commits ou OpenSpec
- **AND** MUST NOT interpretar essa omissão como autorização para esconder uma mudança incompatível

#### Scenario: Consolidação de entradas correlatas

- **WHEN** várias tarefas descrevem um mesmo efeito para consumidores
- **THEN** a revisão MUST privilegiar uma nota consolidada com até 300 caracteres e as referências pertinentes
- **AND** MUST NOT ocultar consequências materiais, avisos BREAKING ou ações exigidas
- **AND** MUST NOT modificar a seção automaticamente sem confirmação humana

#### Scenario: Formato compatível e versões fechadas imutáveis

- **WHEN** a política editorial for adotada em uma seção `Em andamento`
- **THEN** a seção MUST preservar o placeholder versionado existente, os cabeçalhos de versões fechadas e suas datas oficiais
- **AND** MUST preservar as aprovações SHA-256 de versões fechadas e a equivalência das notas publicadas
- **AND** MUST NOT exigir migração para `Unreleased`, datas ISO, links de comparação ou arquivamento histórico

#### Scenario: Aprovação e extração permanecem idênticas

- **WHEN** a versão for preparada, validada ou publicada após revisão editorial
- **THEN** a aprovação MUST continuar vinculada ao texto exato da seção por SHA-256
- **AND** as notas públicas MUST continuar correspondendo à seção fechada aprovada, excluindo apenas o marcador interno
- **AND** as verificações de release e back-merge MUST manter as garantias vigentes
