## ADDED Requirements

### Requirement: Texto controlado divergente

O `AdsCombobox` MUST tratar como texto livre um `inputValue` controlado que diverge do rótulo da opção selecionada, sem submeter o `value` anterior.

#### Scenario: Atualização externa do texto

- **WHEN** o consumidor altera `inputValue` externamente sem alterar `value`
- **THEN** o formulário não envia o `value` antigo por `name`
- **AND** voltar o texto ao rótulo da opção restaura o envio do `value`, inclusive após uma edição do usuário

### Requirement: Identidade da origem de dados

O `AdsAutocomplete` MUST permitir identificar a origem dos dados por `requestKey`, invalidando consulta pendente e resultados quando ela muda.

#### Scenario: Troca de origem com o mesmo termo

- **WHEN** `requestKey` muda mantendo o mesmo termo pesquisado
- **THEN** a consulta anterior é abortada, os resultados antigos deixam de ser exibidos e a busca é refeita

#### Scenario: Primeiro render após a troca

- **WHEN** `requestKey` muda e uma resposta ou erro da origem anterior já estava armazenado
- **THEN** o primeiro render da nova origem não exibe esses dados

#### Scenario: Função inline

- **WHEN** apenas a identidade de `loadOptions` muda entre renders
- **THEN** nenhuma nova consulta é disparada
