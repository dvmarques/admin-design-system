## ADDED Requirements

### Requirement: Tooltip pode abrir somente por apontamento

`AdsTooltip` MUST aceitar `showOnFocus` (padrão `true`). Com `false`, o foco MUST NOT abrir o tooltip, e o apontamento continua abrindo-o; o padrão MUST preservar o comportamento por foco e apontamento.

#### Scenario: Foco não abre o tooltip

- **WHEN** `showOnFocus` é `false` e o gatilho recebe foco
- **THEN** o tooltip não abre; ao apontar o gatilho, ele abre

#### Scenario: Padrão preservado

- **WHEN** `showOnFocus` não é informado
- **THEN** o tooltip abre por foco e por apontamento, como antes

### Requirement: Tooltip pode não descrever o gatilho

`AdsTooltip` MUST aceitar `describeTrigger` (padrão `true`). Com `false`, o tooltip aberto MUST NOT acrescentar `aria-describedby` ao gatilho; o padrão MUST preservar a associação atual.

#### Scenario: Tooltip que repete o nome

- **WHEN** `describeTrigger` é `false` e o tooltip abre
- **THEN** o gatilho não recebe `aria-describedby`

#### Scenario: Descrição preservada por padrão

- **WHEN** `describeTrigger` não é informado e o tooltip abre
- **THEN** o gatilho referencia o id do tooltip em `aria-describedby`
