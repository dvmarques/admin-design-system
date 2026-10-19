# Spec Delta

## MODIFIED Requirements

### Requirement: Orientação para botões e campos na mesma linha

A documentação de integração MUST informar que botões e campos de mesmo `size` têm alturas diferentes, indicar essas alturas por tamanho e orientar como alinhá-los quando posicionados na mesma linha, inclusive como usar um ou mais botões no adendo de um grupo de entrada e o limite do conteúdo misto de texto e botão.

#### Scenario: Consumidor posiciona um botão ao lado de um campo

- **WHEN** um desenvolvedor consulta a documentação para colocar um `AdsButton` ao lado de um `AdsInput` na mesma linha
- **THEN** ele encontra as alturas de botão e de campo por tamanho e a orientação para alinhar os dois, sem depender de inspeção do CSS

#### Scenario: Consumidor considera um botão no adendo do grupo de entrada

- **WHEN** um desenvolvedor considera usar um ou mais botões como conteúdo inicial ou final de um grupo de entrada
- **THEN** a documentação informa que os botões acompanham a altura do campo e ficam contíguos a ele, que o adendo deve conter só botões como filhos diretos e que o `size` do botão não altera a altura do grupo

#### Scenario: Consumidor considera texto e botão no mesmo adendo

- **WHEN** um desenvolvedor considera colocar texto e botão no mesmo adendo
- **THEN** a documentação informa que isso não é suportado e indica a alternativa de usar um adendo de texto de um lado e o botão do outro
