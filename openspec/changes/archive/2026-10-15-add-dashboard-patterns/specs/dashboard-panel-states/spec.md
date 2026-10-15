## Purpose

Define os estados de carregamento, vazio e erro dos painéis e cards de métrica.

## ADDED Requirements

### Requirement: Painel cobre carregamento, vazio e erro

`AdsDashboardPanel` MUST suportar os estados de carregamento, vazio e erro, com prioridade carregamento, erro, vazio e conteúdo. O componente MUST NOT buscar dados.

#### Scenario: Carregamento

- **WHEN** `loading` é verdadeiro
- **THEN** o painel apresenta placeholders `AdsSkeleton` anunciados por um status com rótulo, marca `aria-busy` e não renderiza o conteúdo

#### Scenario: Erro

- **WHEN** `error` é informado e o painel não está carregando
- **THEN** a mensagem é apresentada com `role="alert"`, junto das ações opcionais de recuperação

#### Scenario: Vazio

- **WHEN** `empty` é informado e não há carregamento nem erro
- **THEN** o painel apresenta um `AdsEmptyState` com título e descrição

#### Scenario: Conteúdo

- **WHEN** nenhum estado especial é informado
- **THEN** o painel renderiza seus filhos

### Requirement: Card de métrica cobre os mesmos estados

`AdsMetricCard` MUST suportar `loading`, `error` e `empty` com a mesma prioridade, mantendo o título visível.

#### Scenario: Métrica em carregamento

- **WHEN** `loading` é verdadeiro
- **THEN** o card mantém o título e substitui valor e variação por placeholders com status acessível
