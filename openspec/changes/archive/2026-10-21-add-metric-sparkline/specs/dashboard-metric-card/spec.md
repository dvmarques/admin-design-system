## ADDED Requirements

### Requirement: Card de métrica exibe um sparkline opcional

O `AdsMetricCard` MUST aceitar a prop opcional `sparkline` (valores, `min`, `max`, `labels`, `label`, `summary` e `formatValue` do `AdsSparkline`, sem `tone`) e exibir o `AdsSparkline` abaixo da variação. A cor do traço MUST seguir o `sentiment` efetivo do card (`positive` e `negative`; caso contrário a cor padrão). O sparkline MUST ser omitido quando não houver pontos válidos e nos estados `error` e `empty`. No estado `loading`, o card MUST reservar a altura do sparkline com um placeholder quando `sparkline` for informado. Sem a prop, o card MUST permanecer como antes.

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

### Requirement: Variação com sentimento invertido

O card MUST permitir que a cor da variação seja independente da direção, de modo que uma queda possa ser positiva (por exemplo, queda de cancelamentos) e uma alta possa ser negativa, mantendo o ícone e o texto da direção real.

#### Scenario: Queda positiva

- **WHEN** `trend` é `down` e `sentiment` é `positive`
- **THEN** o ícone aponta para baixo, o texto acessível é "Em queda" e a cor de sucesso é aplicada

#### Scenario: Servidor e acessibilidade

- **WHEN** o card é renderizado no servidor e verificado com `axe`
- **THEN** não há violações e o texto da tendência está presente
