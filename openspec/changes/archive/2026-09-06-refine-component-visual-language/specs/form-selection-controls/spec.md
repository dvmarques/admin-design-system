## ADDED Requirements

### Requirement: Seleção com estados perceptíveis

`AdsCheckbox`, `AdsRadio` e `AdsSwitch` MUST manter alinhamento óptico entre controle e rótulo e distinguir os estados selecionado, foco, inválido, sucesso e desabilitado nos dois temas.

#### Scenario: Controle de seleção é desabilitado

- **WHEN** uma aplicação desabilita uma opção de seleção com rótulo
- **THEN** a indisponibilidade é perceptível sem reduzir a legibilidade do rótulo abaixo do contraste aceitável
