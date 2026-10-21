## ADDED Requirements

### Requirement: Escape dispensa o tooltip aberto

Um `AdsTooltip` aberto, por foco ou por apontamento, MUST fechar quando o usuário pressiona Escape, sem capturar nem deslocar o foco e sem exigir que o foco esteja no gatilho. O tooltip MUST ser tratado como camada para o Escape: com ele aberto, o Escape fecha apenas o tooltip e não fecha o overlay que contém o gatilho.

#### Scenario: Tooltip aberto por foco

- **WHEN** o gatilho de um tooltip tem o foco e o usuário pressiona Escape
- **THEN** o tooltip fecha, o foco permanece no gatilho e o gatilho deixa de referenciar o tooltip em `aria-describedby`

#### Scenario: Tooltip aberto apenas por apontamento

- **WHEN** o ponteiro está sobre o gatilho, que não tem o foco, e o usuário pressiona Escape
- **THEN** o tooltip fecha e o foco permanece onde estava

#### Scenario: Tooltip dentro de um diálogo

- **WHEN** um tooltip aberto cujo gatilho está dentro de um diálogo recebe um Escape
- **THEN** apenas o tooltip fecha e o diálogo permanece aberto; um segundo Escape solicita o fechamento do diálogo

### Requirement: Tooltip dispensado reabre apenas por novo gatilho

Depois de dispensado por Escape, o tooltip MUST permanecer fechado enquanto o foco ou o ponteiro continuarem no gatilho e MUST reabrir quando o gatilho receber um novo foco ou um novo apontamento. A associação por `aria-describedby` MUST existir apenas enquanto o tooltip está aberto.

#### Scenario: Reabertura por novo apontamento

- **WHEN** o tooltip foi dispensado por Escape, o ponteiro sai do gatilho e entra novamente
- **THEN** o tooltip volta a ser apresentado e associado ao gatilho

#### Scenario: Foco e ponteiro permanecem no gatilho

- **WHEN** o tooltip foi dispensado por Escape e o foco continua no gatilho
- **THEN** o tooltip permanece fechado
