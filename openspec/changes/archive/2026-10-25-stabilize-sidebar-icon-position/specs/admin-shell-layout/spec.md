## ADDED Requirements

### Requirement: Ícones da navegação mantêm posição horizontal no desktop

Na composição sidebar-header, os ícones de links e grupos de navegação MUST manter a mesma coordenada horizontal ao expandir e recolher a sidebar desktop, com ou sem scrollbar física. Os ícones MUST ficar centralizados no destaque azul recolhido, e o avatar da organização MUST compartilhar a mesma coluna nos dois estados. Ícones MUST permanecer visíveis e contidos nos seus alvos, preservando foco, nomes acessíveis, aria-current e a navegação móvel.

#### Scenario: Recolhimento com scrollbar nativa

- **WHEN** o usuário recolhe e expande a sidebar desktop com itens suficientes para rolagem nos temas claro ou escuro
- **THEN** os ícones mantêm sua coordenada horizontal e a centralização no destaque e o alinhamento do avatar da organização sem serem cortados

#### Scenario: Navegação com scrollbar sobreposta

- **WHEN** o navegador não reserva espaço lateral para a scrollbar
- **THEN** a posição dos ícones permanece estável entre os dois estados

#### Scenario: Consumo com tokens e mobile

- **WHEN** uma aplicação Next.js importa o CSS compilado, personaliza a largura compacta e depois abre o menu em viewport móvel
- **THEN** o eixo desktop acompanha a largura configurada e o menu móvel mantém rótulos e composição completa
