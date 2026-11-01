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

### Requirement: Seleção recolhida é proporcional e tem recuo consistente

Na composição sidebar-header, o item ativo recolhido MUST ter destaque de 2,75rem por 2,75rem sem alargar a barra. Expandido e recolhido MUST ter o mesmo recuo lateral do destaque, preservando ícones, texto, hierarquia, foco e aria-current, com ou sem espaço ocupado pela scrollbar.

#### Scenario: Recolhimento com scrollbar

- **WHEN** a navegação precisa de scrollbar e a sidebar alterna seu estado
- **THEN** o destaque mantém o mesmo recuo da borda e fica quadrado no recolhido, sem mudar a largura da barra ou cortar o conteúdo

#### Scenario: Navegação sem scrollbar

- **WHEN** os itens cabem ou o navegador usa scrollbar sobreposta
- **THEN** o destaque recolhido continua quadrado, com recuo coerente no estado expandido

### Requirement: Menu móvel do shell ocupa a viewport

O menu móvel do shell MUST ocupar a largura e altura da viewport sem faixa de backdrop no rodapé. O branding opcional MUST coexistir com o botão de fechar sem sobreposição, mesmo sem mobileTitle.

#### Scenario: Menu sem título adicional

- **WHEN** o consumidor fornece branding e omite mobileTitle
- **THEN** marca, organização e navegação aparecem a partir do topo, sem espaço editorial vazio, mantendo nome acessível, fechamento e foco
