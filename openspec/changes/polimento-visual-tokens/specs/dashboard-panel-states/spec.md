## ADDED Requirements

### Requirement: Vazio textual usa o estado vazio padrão

`AdsMetricCard` e `AdsDashboardPanel` MUST apresentar `empty`, quando for `string` ou `number`, como `AdsEmptyState` compacto com o texto como título. Quando `empty` for um nó React, MUST renderizá-lo como informado.

#### Scenario: Vazio textual no card de métrica

- **WHEN** `empty` é um texto e não há carregamento nem erro
- **THEN** o card mantém o título e apresenta um estado vazio compacto com o texto, sem `role="alert"`

#### Scenario: Vazio textual no painel

- **WHEN** `empty` é um texto e o painel não está carregando nem em erro
- **THEN** o painel apresenta um estado vazio compacto com o texto no lugar dos filhos

#### Scenario: Vazio como nó

- **WHEN** `empty` é um nó React, como um `AdsEmptyState` próprio
- **THEN** o nó é renderizado como informado, sem envoltório adicional de estado vazio
