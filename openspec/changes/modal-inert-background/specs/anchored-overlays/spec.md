## ADDED Requirements

### Requirement: Overlays ancorados abertos dentro de um modal permanecem interativos

Um popover, tooltip, menu do `AdsDropdown` ou calendário do `AdsDatePicker` aberto enquanto um modal está aberto MUST continuar interativo e acessível, e o fundo MUST continuar inerte.

#### Scenario: Popover aberto dentro de um diálogo

- **WHEN** um popover é aberto a partir de um diálogo aberto
- **THEN** o conteúdo do popover recebe foco e cliques e a página de fundo continua inerte

#### Scenario: Popover aberto antes do modal

- **WHEN** um popover está aberto e um modal é aberto a partir dele
- **THEN** o popover deixa de receber foco e cliques até o modal fechar
