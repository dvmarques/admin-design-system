# dashboard-metric-card Specification

## Purpose

Fornece o card de métrica (KPI) reutilizável de dashboards administrativos, sem regras de negócio.

## Requirements

### Requirement: Card de métrica apresenta título, valor e variação

O sistema MUST fornecer `AdsMetricCard` em `@admin-ds/admin` com título, valor, variação opcional, descrição opcional e progresso opcional, aceitando `className` e atributos HTML do elemento raiz.

#### Scenario: Consumidor exibe uma métrica

- **WHEN** o consumidor informa título, valor e variação
- **THEN** o card apresenta os três textos sem interpretar seu significado de negócio

#### Scenario: Consumidor exibe progresso

- **WHEN** o consumidor informa as propriedades de progresso com um rótulo
- **THEN** o card apresenta um `AdsProgress` com nome acessível

### Requirement: Tendência não depende apenas de cor

O card MUST comunicar a tendência (`up`, `down` ou `neutral`) por ícone e por texto acessível, e MUST usar tokens públicos de cor com contraste suficiente nos temas claro e escuro. A cor MUST seguir o `sentiment`, independente da direção.

#### Scenario: Tendência em alta

- **WHEN** `trend` é `up`
- **THEN** o card exibe um ícone de alta decorativo e o texto "Em alta" acessível junto da variação

#### Scenario: Alta com sentimento negativo

- **WHEN** `trend` é `up` e `sentiment` é `negative`
- **THEN** o ícone aponta para cima e a cor de perigo é aplicada

#### Scenario: Tema escuro

- **WHEN** o tema escuro está ativo
- **THEN** as cores de tendência usam os tokens do tema ativo
