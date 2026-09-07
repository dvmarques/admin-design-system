## ADDED Requirements

### Requirement: Hierarquia visual de overlays modais

`AdsDialog` e `AdsDrawer` MUST separar visualmente conteúdo, ações, controle de fechar e backdrop por tokens de superfície, elevação e espaçamento consistentes nos dois temas.

#### Scenario: Diálogo de confirmação é aberto

- **WHEN** uma aplicação abre um diálogo com título, descrição e ação
- **THEN** o conteúdo prioritário e a ação principal são identificáveis sem confundir o overlay com o conteúdo de fundo

### Requirement: Overlays modais respeitam escala de camada e largura reduzida

AdsDialog e AdsDrawer MUST usar a escala semântica de elevação e camada para se separar do conteúdo de fundo. Em largura inferior a 768 px, o espaçamento interno e a composição de ações MUST se adaptar sem reduzir a legibilidade, a área de toque ou os contratos de foco.

#### Scenario: Diálogo é aberto em tela estreita

- **WHEN** um diálogo com ações é exibido em largura inferior a 768 px
- **THEN** conteúdo, ações e controle de fechar permanecem acessíveis sem colisão ou corte do conteúdo
