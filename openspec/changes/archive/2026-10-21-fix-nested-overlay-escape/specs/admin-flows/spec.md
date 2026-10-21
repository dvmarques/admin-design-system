## ADDED Requirements

### Requirement: Confirmação pendente protege o diálogo de Escape em camadas aninhadas

Enquanto `pending` for verdadeiro, `AdsConfirmDialog` MUST NOT fechar por Escape, inclusive quando houver um overlay aberto dentro dele. Um Escape destinado a esse overlay interno MUST fechar apenas ele e MUST NOT cancelar a confirmação.

#### Scenario: Popover aberto dentro de uma confirmação pendente

- **WHEN** `pending` é verdadeiro, há um popover aberto dentro do diálogo e o usuário pressiona Escape duas vezes
- **THEN** o primeiro Escape fecha só o popover e o segundo não cancela a confirmação
