## ADDED Requirements

### Requirement: Overlays ancorados respeitam a prioridade de notificações

AdsTooltip e AdsPopover MUST usar uma camada de overlay inferior à camada de
notificações, preservando a visibilidade de toasts durante a interação com
conteúdo contextual.

#### Scenario: Notificação é apresentada sobre um popover

- **WHEN** um popover ou tooltip está aberto e uma notificação é exibida
- **THEN** a notificação permanece visualmente acima do overlay ancorado
