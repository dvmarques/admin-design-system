# Spec Delta

## ADDED Requirements

### Requirement: Vários botões no mesmo adendo ficam contíguos

Quando o conteúdo inicial ou final de `AdsInputGroup` contém mais de um `AdsButton` como filhos diretos, os botões MUST ficar contíguos, com a altura do campo, sem fresta entre eles, e somente a quina externa do conjunto MUST ser arredondada. Um adendo com um só botão MUST NOT mudar.

#### Scenario: Dois botões no fim do grupo

- **WHEN** um `AdsInputGroup` com dois `AdsButton` em `endContent` é renderizado em `sm`, `md` ou `lg`
- **THEN** os dois botões têm a altura e o topo do campo, a junção entre eles se sobrepõe em 1px e somente a quina direita do segundo botão é arredondada

#### Scenario: Dois botões no início do grupo

- **WHEN** um `AdsInputGroup` com dois `AdsButton` em `startContent` é renderizado em qualquer tamanho
- **THEN** somente a quina esquerda do primeiro botão é arredondada e a junção entre os botões e a junção com o campo não somam bordas duplas

#### Scenario: Ponteiro e teclado

- **WHEN** o ponteiro passa sobre um dos botões ou ele recebe foco por teclado
- **THEN** o botão não se desloca, o foco é visível e cada botão continua acessível por `Tab` na ordem visual

#### Scenario: Um só botão

- **WHEN** o adendo contém um único botão
- **THEN** a aparência e as medidas são as do requisito de botão no adendo
