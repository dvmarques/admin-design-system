## MODIFIED Requirements

### Requirement: Painel cobre carregamento, vazio e erro

`AdsDashboardPanel` MUST suportar os estados de carregamento, vazio e erro, com prioridade carregamento, erro, vazio e conteúdo. `error` MUST aceitar nós React. `empty` MUST aceitar `string`, `number` ou nós React; quando for texto ou número, MUST renderizar `AdsEmptyState` compacto com o valor como título. O componente MUST NOT buscar dados.

#### Scenario: Carregamento

- **WHEN** `loading` é verdadeiro
- **THEN** o painel apresenta placeholders `AdsSkeleton` anunciados por um status com rótulo, marca `aria-busy` e não renderiza o conteúdo

#### Scenario: Erro

- **WHEN** `error` é informado e o painel não está carregando
- **THEN** a mensagem é apresentada com `role="alert"`, junto das ações opcionais de recuperação

#### Scenario: Erro com conteúdo em bloco

- **WHEN** `error` contém elementos de bloco, como uma lista
- **THEN** o painel e o card produzem HTML válido e a hidratação não emite avisos

#### Scenario: Vazio

- **WHEN** `empty` é um nó React, como um `AdsEmptyState` com título e descrição, e não há carregamento nem erro
- **THEN** o painel apresenta o conteúdo de vazio informado no lugar dos filhos

#### Scenario: Vazio textual

- **WHEN** `empty` é `string` ou `number` e não há carregamento nem erro
- **THEN** o painel apresenta `AdsEmptyState` compacto com o texto como título, no lugar dos filhos

#### Scenario: Conteúdo

- **WHEN** nenhum estado especial é informado
- **THEN** o painel renderiza seus filhos

### Requirement: Card de métrica cobre os mesmos estados

`AdsMetricCard` MUST suportar `loading`, `error` e `empty` com a mesma prioridade e os mesmos tipos do painel (`string`, `number` ou nós React), mantendo o título visível. Quando `empty` for texto ou número, MUST renderizar `AdsEmptyState` compacto com o valor como título.

#### Scenario: Métrica em carregamento

- **WHEN** `loading` é verdadeiro
- **THEN** o card mantém o título e substitui valor e variação por placeholders com status acessível

#### Scenario: Métrica sem dados

- **WHEN** `empty` é um nó React e não há carregamento nem erro
- **THEN** o card mantém o título e apresenta o conteúdo de vazio no lugar de valor e variação

#### Scenario: Métrica sem dados textual

- **WHEN** `empty` é `string` ou `number` e não há carregamento nem erro
- **THEN** o card mantém o título e apresenta `AdsEmptyState` compacto no lugar de valor e variação, sem `role="alert"`
