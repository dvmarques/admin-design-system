## ADDED Requirements

### Requirement: Tooltip pode abrir somente por apontamento

`AdsTooltip` MUST aceitar `showOnFocus` (padrão `true`). Com `false`, o foco MUST NOT abrir o tooltip, e o apontamento continua abrindo-o; o padrão MUST preservar o comportamento por foco e apontamento.

#### Scenario: Foco não abre o tooltip

- **WHEN** `showOnFocus` é `false` e o gatilho recebe foco
- **THEN** o tooltip não abre; ao apontar o gatilho, ele abre

#### Scenario: Padrão preservado

- **WHEN** `showOnFocus` não é informado
- **THEN** o tooltip abre por foco e por apontamento, como antes
