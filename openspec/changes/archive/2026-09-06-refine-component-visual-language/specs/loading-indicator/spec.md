## ADDED Requirements

### Requirement: Indicador alinhado à linguagem de movimento

`AdsLoadingIndicator` MUST usar os tokens revisados de cor, tamanho e movimento, mantendo uma indicação estática perceptível quando a preferência de movimento reduzido estiver ativa.

#### Scenario: Ambiente reduz movimento

- **WHEN** a pessoa ativa redução de movimento no sistema operacional
- **THEN** o indicador continua comunicando trabalho em andamento sem animação contínua não essencial
