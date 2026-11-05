# time-picker Specification

## Purpose

Disponibilizar às aplicações administrativas uma seleção de horário acessível em formatos 12h/24h, com valor canônico `HH:mm`, limites e integração a formulários nativos, sem depender de backend ou de bibliotecas externas.

## Requirements

### Requirement: Seleção de horário com contrato estável

O componente AdsTimePicker MUST oferecer seleção de horas/minutos e representar valores válidos como `HH:mm` em 24h ou `null` vazio, sem dependência de backend ou de AdsDatePicker.

#### Scenario: Uso em 24 horas

- **WHEN** uma aplicação seleciona 15 horas e 30 minutos
- **THEN** o componente fornece `15:30`.

#### Scenario: Uso em 12 horas

- **WHEN** a mesma seleção é exibida em modo 12h
- **THEN** os controles exibem 03:30 PM e o valor permanece `15:30`.

#### Scenario: Controle externo

- **WHEN** `value` é fornecido e o usuário seleciona novo horário
- **THEN** `onValueChange` informa a proposta sem substituir `value` até o pai atualizar a prop.

#### Scenario: Estado local

- **WHEN** apenas `defaultValue` é fornecido
- **THEN** o estado interno acompanha a seleção do usuário.

### Requirement: Restrições e validação

O componente MUST respeitar min/max inclusivos no mesmo dia, `minuteStep` alinhado a `:00` e os estados obrigatório, erro e desabilitado.

#### Scenario: Opções incompatíveis

- **WHEN** a hora selecionada não admite determinado minuto pelo passo ou limites
- **THEN** esse minuto não pode ser confirmado e não é emitido como horário válido.

#### Scenario: Edição parcial

- **WHEN** o usuário deixa de possuir seleção completa
- **THEN** o valor confirmado é `null`, sem publicar horário inconsistente.

#### Scenario: Erro externo

- **WHEN** `validationState='error'` ou um valor externo é inválido
- **THEN** controles mostram `aria-invalid` com estilo de erro.

### Requirement: Acessibilidade e integração

O componente MUST ser utilizável com teclado, leitor de tela e foco visível; MUST integrar AdsField e HTML forms sem exigir outra biblioteca.

#### Scenario: Campo nomeado

- **WHEN** AdsTimePicker está dentro de AdsField com descrição e erro
- **THEN** o primeiro controle recebe a label e os controles são identificáveis e descrevem o erro.

#### Scenario: Formulário

- **WHEN** a aplicação informa `name` e seleciona um horário válido
- **THEN** o envio do formulário inclui exatamente um valor canônico.

#### Scenario: Temas e responsividade

- **WHEN** o usuário alterna tema ou usa viewport estreita
- **THEN** os controles preservam legibilidade, layout sem overflow e foco visível com tokens existentes.

### Requirement: Exemplos verificáveis

A implementação MUST incluir demonstrações funcionais no admin demo e no Storybook, testes automatizados e documentação.

#### Scenario: Data e hora independentes

- **WHEN** o exemplo compõe AdsDatePicker e AdsTimePicker
- **THEN** cada um pode ser alterado independentemente e ambos são visíveis na aplicação.
