# Spec Delta

## MODIFIED Requirements

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
