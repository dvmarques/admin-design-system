# Spec Delta

## MODIFIED Requirements

### Requirement: Seleção de intervalo

`AdsDatePicker` com `mode="range"` MUST permitir selecionar uma data inicial e uma final, representadas por `{ start, end }`, e ordenar as extremidades quando a segunda data for anterior à primeira. No calendário, a primeira data ativada MUST ficar pendente, sem alterar o valor, até a segunda. A data pendente MUST ser anunciada por uma região `aria-live="polite"` visualmente oculta, com texto em `labels.pendingStart`.

#### Scenario: Escolher um intervalo no calendário

- **WHEN** a pessoa ativa uma data inicial e depois uma data final
- **THEN** o intervalo só é atualizado na segunda data, o período fica destacado e o calendário fecha

#### Scenario: Fechar antes da segunda data

- **WHEN** a pessoa ativa uma data e fecha o calendário antes de ativar a segunda
- **THEN** o valor não muda e o intervalo anterior continua destacado ao reabrir

#### Scenario: Anúncio da data pendente

- **WHEN** a pessoa ativa a primeira data do intervalo
- **THEN** leitores de tela anunciam, sem mover o foco, a data inicial escolhida e que falta a data final

#### Scenario: Digitar com data pendente

- **WHEN** há uma data pendente no calendário e a pessoa confirma uma data digitada
- **THEN** a data pendente é descartada e o próximo clique começa um novo intervalo

#### Scenario: Extremidades invertidas

- **WHEN** a segunda data escolhida é anterior à primeira
- **THEN** a data anterior vira o início do intervalo

#### Scenario: Início digitado depois do fim

- **WHEN** a pessoa digita uma data inicial posterior à data final atual
- **THEN** o valor não é alterado e a entrada é marcada como inválida
