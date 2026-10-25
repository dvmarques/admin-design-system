## ADDED Requirements

### Requirement: Topo opcional da sidebar acompanha o cabeçalho

AdsAdminShell MUST oferecer composição opcional com conteúdo no topo da sidebar alinhado à altura natural do header principal, preservando o layout padrão quando não solicitada. O topo MUST permanecer alcançável enquanto a navegação e o main rolam independentemente.

#### Scenario: Header cresce e sidebar recolhe

- **WHEN** a composição é ativada e o header ou branding tem múltiplas linhas, ou a sidebar é recolhida
- **THEN** os topos compartilham a altura necessária sem sobreposição, corte de texto ou rolagem duplicada

#### Scenario: Conteúdo opcional ausente

- **WHEN** não há conteúdo de topo ou organização fornecido
- **THEN** não há bloco vazio, separador ou altura reservada para esse conteúdo

#### Scenario: Consumidor mantém composição anterior

- **WHEN** o consumidor não ativa a nova composição
- **THEN** layout, estados controlados/não controlados, CSS distribuído e renderização no servidor preservam os contratos existentes

#### Scenario: Navegação móvel

- **WHEN** a viewport passa ao mobile e o usuário abre o menu pelo header
- **THEN** o conteúdo de topo aparece em uma única instância no Drawer, com organização opcional, foco, fechamento e isolamento existentes

#### Scenario: Temas e personalização

- **WHEN** o consumidor aplica temas ou sobrescreve tokens públicos
- **THEN** superfícies, texto, foco e bordas da nova composição respondem sem Tailwind no consumidor
