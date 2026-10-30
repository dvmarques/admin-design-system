## MODIFIED Requirements

### Requirement: Escape do painel de colunas não fecha o overlay ao redor

Com o painel de colunas aberto dentro de um `AdsDialog` ou `AdsDrawer`, o primeiro Escape MUST fechar apenas o painel e devolver o foco ao botão "Colunas"; um segundo Escape MUST solicitar o fechamento do overlay. O Escape tratado pelo painel MUST ser marcado como tratado e MUST NOT ser observado por outras camadas de Escape, de modo que o fechamento do painel e o do overlay ao redor nunca ocorram no mesmo pressionamento. Com o painel fechado, o painel MUST NOT absorver o Escape.

#### Scenario: Painel de colunas dentro de um diálogo

- **WHEN** o painel de colunas está aberto dentro de um diálogo e o usuário pressiona Escape
- **THEN** o painel fecha, o foco volta ao botão "Colunas" e o diálogo permanece aberto

#### Scenario: Segundo Escape

- **WHEN** o painel já foi fechado e o usuário pressiona Escape novamente
- **THEN** o diálogo solicita o fechamento

#### Scenario: Escape tratado pelo painel não alcança a pilha de camadas

- **WHEN** o painel de colunas aberto trata um Escape
- **THEN** o evento é marcado como tratado e nenhuma camada de Escape ao redor solicita fechamento

#### Scenario: Escape com o painel fechado

- **WHEN** o painel de colunas está fechado e o foco está na barra de ferramentas
- **THEN** o Escape não é marcado como tratado pelo painel e segue para o overlay ao redor
