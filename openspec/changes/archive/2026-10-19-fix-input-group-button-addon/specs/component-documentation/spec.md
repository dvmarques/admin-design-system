# Spec Delta

## MODIFIED Requirements

### Requirement: Orientação para botões e campos na mesma linha

A documentação de integração MUST informar que botões e campos de mesmo `size` têm alturas diferentes, indicar essas alturas por tamanho e orientar como alinhá-los quando posicionados na mesma linha, inclusive como usar um botão no adendo de um grupo de entrada.

#### Scenario: Consumidor posiciona um botão ao lado de um campo

- **WHEN** um desenvolvedor consulta a documentação para colocar um `AdsButton` ao lado de um `AdsInput` na mesma linha
- **THEN** ele encontra as alturas de botão e de campo por tamanho e a orientação para alinhar os dois, sem depender de inspeção do CSS

#### Scenario: Consumidor considera um botão no adendo do grupo de entrada

- **WHEN** um desenvolvedor considera usar um botão como conteúdo inicial ou final de um grupo de entrada
- **THEN** a documentação informa que o botão acompanha a altura do campo e fica rente a ele, que deve ser o único conteúdo do adendo e que o `size` do botão não altera a altura do grupo
