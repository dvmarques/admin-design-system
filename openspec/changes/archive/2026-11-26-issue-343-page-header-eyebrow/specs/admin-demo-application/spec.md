## ADDED Requirements

### Requirement: Cabeçalhos de página do Demo usam o eyebrow do pacote

Os cabeçalhos de página administrativos do Demo MUST usar `AdsPageHeader` com a prop `eyebrow` em vez de estilos locais de kicker.

#### Scenario: Pessoa abre uma página administrativa

- **WHEN** a pessoa abre Visão geral, Clientes, Novo cliente, Data display ou Preferências
- **THEN** o eyebrow aparece acima do H1 com o estilo do pacote e o ritmo vertical da página é preservado
