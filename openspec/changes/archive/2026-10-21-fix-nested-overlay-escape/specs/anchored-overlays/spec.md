## ADDED Requirements

### Requirement: Overlays ancorados aninhados respeitam a ordem das camadas

Um popover, o calendário do `AdsDatePicker` ou o menu do `AdsDropdown` aberto dentro de outro overlay MUST ser a camada superior para o Escape: o primeiro Escape fecha apenas essa camada e devolve o foco ao seu gatilho, e o overlay que o contém permanece aberto.

#### Scenario: Calendário aberto dentro de um diálogo

- **WHEN** o calendário de um `AdsDatePicker` aberto dentro de um diálogo recebe um Escape
- **THEN** o calendário fecha, o diálogo permanece aberto e o foco volta ao gatilho do calendário

#### Scenario: Dropdown aberto dentro de um diálogo

- **WHEN** um menu de `AdsDropdown` aberto dentro de um diálogo recebe um Escape
- **THEN** o menu fecha, o diálogo permanece aberto e o foco volta ao gatilho do menu
