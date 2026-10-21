## ADDED Requirements

### Requirement: Escape do painel de colunas não fecha o overlay ao redor

Com o painel de colunas aberto dentro de um `AdsDialog` ou `AdsDrawer`, o primeiro Escape MUST fechar apenas o painel e devolver o foco ao botão "Colunas"; um segundo Escape MUST solicitar o fechamento do overlay.

#### Scenario: Painel de colunas dentro de um diálogo

- **WHEN** o painel de colunas está aberto dentro de um diálogo e o usuário pressiona Escape
- **THEN** o painel fecha, o foco volta ao botão "Colunas" e o diálogo permanece aberto

#### Scenario: Segundo Escape

- **WHEN** o painel já foi fechado e o usuário pressiona Escape novamente
- **THEN** o diálogo solicita o fechamento
