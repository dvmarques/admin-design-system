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

### Requirement: Seleção de navegação é estrutural e responsiva

Tabs e navegação persistente MUST comunicar seleção por indicador, borda ou superfície suave, mantendo o foco visível distinto. Em largura reduzida, os destinos MUST permanecer acessíveis por rolagem horizontal ou quebra controlada, sem truncar ou ocultar itens interativos.

#### Scenario: Conjunto de tabs excede a largura disponível

- **WHEN** tabs não cabem na largura do contêiner
- **THEN** todos os destinos continuam alcançáveis e a tab ativa permanece identificável sem assumir aparência de botão de chamada principal

### Requirement: Tabs e breadcrumb mantêm contraste e seleção visíveis nos dois temas

O texto de links de `AdsBreadcrumb` e o texto de gatilhos de `AdsTabs`, ativos ou inativos, MUST atingir contraste mínimo de `4.5:1` contra `canvas`, `surface`, `surface-raised`, `surface-muted` e `surface-hover` nos temas claro e escuro. Os links MUST usar tokens públicos de texto, sem depender da cor padrão do navegador. A tab ativa MUST ser distinguível das inativas por superfície, cor de texto e borda, independentemente da ordem das utilidades no CSS distribuído.

#### Scenario: Links do breadcrumb em superfície elevada no tema escuro

- **WHEN** um `AdsBreadcrumb` com links é renderizado sobre `surface-raised` no tema escuro
- **THEN** a cor do texto vem de um token público de texto e atinge contraste mínimo de `4.5:1`

#### Scenario: Tabs inativas em superfície elevada nos dois temas

- **WHEN** um `AdsTabs` é renderizado sobre `surface-raised` no tema claro ou escuro
- **THEN** o texto das tabs inativas, inclusive com hover, atinge contraste mínimo de `4.5:1`

#### Scenario: Tab ativa distinguível da inativa

- **WHEN** uma tab é a ativa
- **THEN** ela apresenta superfície de seleção, cor de texto de seleção e borda inferior de destaque diferentes das tabs inativas, nos dois temas

#### Scenario: Personalização por tokens

- **WHEN** o consumidor sobrescreve tokens públicos de texto ou de seleção em um escopo de tema
- **THEN** tabs e breadcrumb refletem os novos valores sem recompilar a biblioteca

### Requirement: Links de AdsNav sem sublinhado nativo

Os itens de `AdsNav` renderizados como link MUST NOT exibir o sublinhado padrão do navegador, em nenhum estado, e MUST comunicar o item atual por `aria-current`, borda e superfície.

#### Scenario: Item de navegação com href

- **WHEN** um `AdsNav` com itens que possuem `href` é renderizado
- **THEN** o CSS distribuído remove o sublinhado dos links e o item atual mantém `aria-current="page"`

### Requirement: Links do consumidor em AdsNav e AdsBreadcrumb

`AdsNav` e `AdsBreadcrumb` MUST permitir que o consumidor forneça o elemento de link de cada item, recebendo as props de estilo, `aria-current` e conteúdo para aplicá-las ao link. O item MUST conter um único elemento interativo, o link do consumidor MUST receber o estilo e o foco visível do item, e a biblioteca MUST NOT acessar o roteador. Itens desabilitados de `AdsNav` MUST permanecer botões desabilitados, e o item atual de `AdsBreadcrumb` MUST permanecer sem link com `aria-current="page"`.

#### Scenario: Consumo em Next.js em AdsNav

- **WHEN** uma aplicação Next.js fornece `next/link` para os itens de `AdsNav`
- **THEN** cada item é um único link com o estilo da biblioteca, o item atual expõe `aria-current="page"` e não há `<button>` nem interativo aninhado

#### Scenario: Link do consumidor em AdsBreadcrumb

- **WHEN** uma aplicação fornece um link para um item anterior de `AdsBreadcrumb`
- **THEN** o link recebe cor de texto, hover e foco visível do breadcrumb

#### Scenario: Compatibilidade com href

- **WHEN** um item usa apenas `href` ou `onClick`
- **THEN** o comportamento anterior é preservado
