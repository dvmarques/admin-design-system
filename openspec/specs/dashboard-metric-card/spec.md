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

### Requirement: Card de métrica exibe um sparkline opcional

O `AdsMetricCard` MUST aceitar a prop opcional `sparkline` (`values`, `min`, `max`, `labels`, `label`, `summary` e `formatValue` do `AdsSparkline`, sem `tone`) e exibir o `AdsSparkline` abaixo da variação, com o traço seguindo o `sentiment` efetivo. O sparkline MUST ser omitido sem pontos válidos e nos estados `error` e `empty`; em `loading`, o card MUST reservar sua altura com um placeholder. Sem a prop, o card MUST permanecer como antes.

#### Scenario: Card com série

- **WHEN** o consumidor informa `sparkline` com `values` e `label`
- **THEN** o card apresenta uma imagem com nome acessível que resume a série, ao lado do valor e da variação

#### Scenario: Cor segue o sentimento

- **WHEN** `trend` é `down` e `sentiment` é `positive`
- **THEN** o sparkline usa o tom positivo, e o ícone continua apontando para baixo

#### Scenario: Série sem pontos válidos

- **WHEN** `sparkline.values` não contém valores finitos
- **THEN** o card não renderiza o sparkline e mantém o restante do conteúdo

#### Scenario: Carregamento

- **WHEN** `loading` é verdadeiro e `sparkline` é informado
- **THEN** o placeholder do sparkline ocupa a mesma altura e não há salto de layout ao carregar

#### Scenario: Compatibilidade

- **WHEN** o consumidor não informa `sparkline`
- **THEN** a marcação do card é a mesma de antes

#### Scenario: Sentimento negativo ou neutro

- **WHEN** o `sentiment` efetivo é `negative` ou não há sentimento
- **THEN** o sparkline usa o tom negativo ou, sem sentimento, a cor padrão

#### Scenario: Estados de erro e vazio

- **WHEN** o card está em `error` ou `empty`
- **THEN** o sparkline não é renderizado

### Requirement: Variação com sentimento invertido

O card MUST permitir que a cor da variação seja independente da direção, de modo que uma queda possa ser positiva (por exemplo, queda de cancelamentos) e uma alta possa ser negativa, mantendo o ícone e o texto da direção real.

#### Scenario: Queda positiva

- **WHEN** `trend` é `down` e `sentiment` é `positive`
- **THEN** o ícone aponta para baixo, o texto acessível é "Em queda" e a cor de sucesso é aplicada

#### Scenario: Servidor e acessibilidade

- **WHEN** o card é renderizado no servidor e verificado com `axe`
- **THEN** não há violações e o texto da tendência está presente
