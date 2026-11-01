## ADDED Requirements

### Requirement: Drawer preserva altura integral em telas estreitas

AdsDrawer MUST ocupar toda a altura disponível do backdrop em telas estreitas, sem herdar o limite de altura reservado a AdsDialog. MUST preservar rolagem interna, foco, isolamento e fechamento existentes.

#### Scenario: Drawer móvel com conteúdo longo

- **WHEN** um drawer esquerdo ou direito abre em uma viewport móvel
- **THEN** ele alcança o rodapé da viewport, o conteúdo rola internamente e os controles permanecem alcançáveis

#### Scenario: Diálogo móvel

- **WHEN** um AdsDialog abre na mesma viewport
- **THEN** seus limites e margens anteriores permanecem preservados
