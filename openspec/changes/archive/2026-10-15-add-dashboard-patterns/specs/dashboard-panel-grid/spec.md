## Purpose

Fornece o grid responsivo de painéis de dashboard com painéis de largura variável.

## ADDED Requirements

### Requirement: Grid organiza painéis de largura variável

O sistema MUST fornecer `AdsDashboardGrid` e `AdsDashboardPanel` em `@admin-ds/admin`. O painel MUST aceitar `span` de 1 a 4 colunas e MUST renderizar uma `section` nomeada pelo seu título, com nível de heading configurável.

#### Scenario: Painel ocupa várias colunas

- **WHEN** um painel recebe `span` igual a 2
- **THEN** ele declara ocupar duas colunas quando o grid tiver colunas suficientes

#### Scenario: Painel tem nome acessível

- **WHEN** um painel é renderizado com título
- **THEN** a região é identificável pelo título e o heading usa o nível configurado

### Requirement: Layout responsivo preserva a ordem de leitura

O grid MUST adaptar o número de colunas à largura disponível e MUST NOT reordenar painéis visualmente, de modo que a ordem do DOM coincida com a ordem visual e de foco. O CSS MUST ser utilizável sem Tailwind na aplicação consumidora.

#### Scenario: Viewport estreita

- **WHEN** a viewport é estreita
- **THEN** os painéis são empilhados em uma coluna na ordem do DOM

#### Scenario: Consumo sem Tailwind

- **WHEN** a aplicação importa `@admin-ds/admin/styles.css`
- **THEN** o CSS distribuído não contém diretivas Tailwind e define as classes do grid e do painel
