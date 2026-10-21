## ADDED Requirements

### Requirement: Escape em overlays aninhados fecha apenas a camada superior

Quando mais de um overlay estiver aberto, o Escape MUST ser tratado apenas pela camada superior, definida pela ordem de abertura, e MUST NOT fechar uma camada inferior no mesmo pressionamento.

#### Scenario: Popover aberto dentro de um diálogo

- **WHEN** um popover aberto a partir de um diálogo recebe um Escape
- **THEN** apenas o popover solicita fechamento, o diálogo permanece aberto e o foco volta ao gatilho do popover dentro do diálogo

#### Scenario: Segundo Escape fecha o diálogo

- **WHEN** o popover já foi fechado e o usuário pressiona Escape novamente
- **THEN** o diálogo solicita fechamento e o foco volta ao elemento que o abriu

#### Scenario: Camada superior não fecha por Escape

- **WHEN** a camada superior tem o fechamento por Escape desabilitado e o usuário pressiona Escape
- **THEN** nenhuma camada solicita fechamento e a camada inferior permanece aberta
