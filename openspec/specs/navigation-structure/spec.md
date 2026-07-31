# navigation-structure Specification

## Purpose

Fornece padrões de navegação estrutural acessíveis, tematizáveis e independentes de roteador para aplicações administrativas React.

## Requirements

### Requirement: Breadcrumbs semânticos e personalizáveis

O sistema MUST fornecer `AdsBreadcrumb` para representar a hierarquia da página em uma região de navegação nomeada, com itens em lista ordenada. O item da página atual MUST expor `aria-current="page"` e não exigir destino; itens anteriores MUST aceitar links fornecidos pelo consumidor. Separadores visuais MUST ser ignorados por tecnologias assistivas, e os estilos MUST responder aos tokens públicos de texto, foco e borda nos temas claro e escuro.

#### Scenario: Página atual é identificada

- **WHEN** o consumidor renderiza uma trilha com um item atual
- **THEN** leitores de tela identificam a navegação e o item atual como a página atual sem anunciar separadores decorativos

#### Scenario: Consumo em Next.js sem acoplamento ao roteador

- **WHEN** uma aplicação Next.js fornece links por sua própria implementação de link
- **THEN** `AdsBreadcrumb` preserva esses links sem acessar APIs de roteamento

### Requirement: Navegação de destinos responsiva

O sistema MUST fornecer `AdsNav` para agrupar destinos de navegação usando semântica de lista dentro de uma região `nav` nomeável. Cada item MUST aceitar conteúdo de link ou botão fornecido pelo consumidor, suportar estado atual com `aria-current` apropriado e exibir foco visível. Em largura insuficiente, a navegação MUST permanecer utilizável por rolagem ou quebra de linha sem ocultar destinos interativos.

#### Scenario: Destino ativo é anunciado

- **WHEN** um item de `AdsNav` é marcado como atual
- **THEN** ele possui o valor `aria-current` configurado e mantém contraste distinguível nos dois temas

#### Scenario: Navegação em viewport estreita

- **WHEN** os destinos excedem a largura disponível
- **THEN** nenhum destino interativo fica inacessível e o usuário pode alcançar todos por teclado

### Requirement: Tabs compostas e acessíveis por teclado

O sistema MUST fornecer `AdsTabs` para associar tabs a painéis por IDs estáveis e relações ARIA. A API MUST suportar estado controlado e não controlado, uma tab ativa inicial e conteúdo composicionável. Uma tab desabilitada MUST não poder receber ativação. As setas MUST mover foco entre tabs elegíveis, Home e End MUST mover para a primeira e a última tab elegíveis, e Enter ou Space MUST ativar a tab focalizada.

#### Scenario: Alternância por teclado

- **WHEN** o foco está em uma tab e o usuário pressiona uma seta, Home ou End
- **THEN** o foco move para a tab elegível correspondente sem ativar conteúdo até Enter ou Space

#### Scenario: Painel ativo é exposto corretamente

- **WHEN** o usuário ativa uma tab
- **THEN** somente o painel associado à tab ativa é apresentado como painel ativo e a relação entre tab e painel é exposta por ARIA

#### Scenario: Tema e personalização

- **WHEN** o consumidor define tokens públicos de navegação em um escopo de tema
- **THEN** tabs, breadcrumb e nav usam os valores personalizados sem recompilação da biblioteca
