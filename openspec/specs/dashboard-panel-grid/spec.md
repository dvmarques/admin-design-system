# dashboard-panel-grid Specification

## Purpose

Fornece o grid responsivo de painéis de dashboard com painéis de largura variável.

## Requirements

### Requirement: Grid organiza painéis de largura variável

O sistema MUST fornecer `AdsDashboardGrid` e `AdsDashboardPanel` em `@dvmarques/admin-ds-admin`. O painel MUST aceitar `span` de 1 a 4 colunas e MUST renderizar uma `section` nomeada pelo seu título, com nível de heading configurável.

#### Scenario: Painel ocupa várias colunas

- **WHEN** um painel recebe `span` igual a 2
- **THEN** ele declara ocupar duas colunas quando o grid tiver colunas suficientes

#### Scenario: Painel tem nome acessível

- **WHEN** um painel é renderizado com título
- **THEN** a região é identificável pelo título e o heading usa o nível configurado

### Requirement: Layout responsivo preserva a ordem de leitura

O grid MUST adaptar o número de colunas à largura disponível do próprio grid (container query), e não à largura da viewport, e MUST NOT reordenar painéis visualmente, de modo que a ordem do DOM coincida com a ordem visual e de foco. O CSS MUST ser utilizável sem Tailwind na aplicação consumidora.

#### Scenario: Grid estreito

- **WHEN** a largura disponível do grid é estreita
- **THEN** os painéis são empilhados em uma coluna na ordem do DOM

#### Scenario: Grid estreito em viewport larga

- **WHEN** o grid ocupa uma área estreita de uma viewport larga, como ao lado de uma sidebar
- **THEN** o número de colunas segue a largura do grid, não a da viewport

#### Scenario: Consumo sem Tailwind

- **WHEN** a aplicação importa `@dvmarques/admin-ds-admin/styles.css`
- **THEN** o CSS distribuído não contém diretivas Tailwind e define as classes do grid e do painel

### Requirement: Padrões de dashboard funcionam com renderização no servidor

`AdsMetricCard`, `AdsDashboardGrid` e `AdsDashboardPanel` MUST renderizar no servidor sem APIs do navegador e MUST hidratar no cliente sem divergência de markup.

#### Scenario: Hidratação

- **WHEN** o markup renderizado no servidor é hidratado no cliente com as mesmas props
- **THEN** a hidratação não emite avisos nem erros e o markup não muda
