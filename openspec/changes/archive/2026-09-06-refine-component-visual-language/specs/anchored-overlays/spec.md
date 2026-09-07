## ADDED Requirements

### Requirement: Contexto ancorado com contraste refinado

`AdsTooltip` e `AdsPopover` MUST usar superfícies, tipografia e elevação que mantenham o conteúdo associado ao gatilho visualmente identificável e legível em ambos os temas.

#### Scenario: Popover é exibido sobre uma superfície elevada

- **WHEN** um popover abre sobre conteúdo com elevação
- **THEN** seus limites e texto permanecem distinguíveis sem esconder a relação com o gatilho

### Requirement: Overlays ancorados usam profundidade consistente

AdsTooltip e AdsPopover MUST usar tokens de superfície, elevação e camada apropriados ao seu contexto, mantendo o gatilho perceptível e o foco visível quando aplicável.

#### Scenario: Popover abre sobre conteúdo selecionado

- **WHEN** um popover é aberto a partir de um controle em superfície selecionada
- **THEN** o popover permanece visualmente distinto da seleção e preserva a associação com seu gatilho
