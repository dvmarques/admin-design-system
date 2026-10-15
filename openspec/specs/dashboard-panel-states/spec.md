# dashboard-panel-states Specification

## Purpose

Define os estados de carregamento, vazio e erro dos painéis e cards de métrica.

## Requirements

### Requirement: Painel cobre carregamento, vazio e erro

`AdsDashboardPanel` MUST suportar os estados de carregamento, vazio e erro, com prioridade carregamento, erro, vazio e conteúdo. `error` e `empty` MUST aceitar nós React. O componente MUST NOT buscar dados.

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

- **WHEN** `empty` é informado e não há carregamento nem erro
- **THEN** o painel apresenta o conteúdo de vazio informado, por exemplo um `AdsEmptyState` com título e descrição, no lugar dos filhos

#### Scenario: Conteúdo

- **WHEN** nenhum estado especial é informado
- **THEN** o painel renderiza seus filhos

### Requirement: Card de métrica cobre os mesmos estados

`AdsMetricCard` MUST suportar `loading`, `error` e `empty` com a mesma prioridade e os mesmos tipos do painel (nós React), mantendo o título visível.

#### Scenario: Métrica em carregamento

- **WHEN** `loading` é verdadeiro
- **THEN** o card mantém o título e substitui valor e variação por placeholders com status acessível

#### Scenario: Métrica sem dados

- **WHEN** `empty` é informado e não há carregamento nem erro
- **THEN** o card mantém o título e apresenta o conteúdo de vazio no lugar de valor e variação
