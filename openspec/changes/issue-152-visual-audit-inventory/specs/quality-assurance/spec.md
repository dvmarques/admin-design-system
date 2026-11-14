## ADDED Requirements

### Requirement: Inventário rastreável de inspeção visual

O projeto MUST manter uma matriz de inspeção por export visual, ligada ao catálogo e às stories, diferenciando cobertura cadastrada de inspeção comprovada e preservando as evidências existentes.

#### Scenario: Export ou referência de Storybook é modificado

- **WHEN** o inventário é verificado após alteração nas fontes
- **THEN** a verificação falha se nomes, grupos, rotas ou stories divergirem, sem marcar automaticamente a inspeção como concluída

#### Scenario: Inspeção recebe status não pendente

- **WHEN** uma pessoa indica análise, ausência de divergência, defeito ou não aplicabilidade
- **THEN** a verificação exige evidência/justificativa e não sobrescreve outros registros

#### Scenario: Novo modelo é solicitado

- **WHEN** o comando de impressão do inventário é executado
- **THEN** ele produz uma matriz pendente sem modificar arquivos existentes
