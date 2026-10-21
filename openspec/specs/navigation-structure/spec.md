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

### Requirement: Tabs com ativação automática opcional

`AdsTabs` MUST suportar o modo de ativação `manual`, padrão, em que o foco só muda a tab ativa com Enter ou Space, e o modo `automatic`, em que mover o foco entre tabs elegíveis ativa a tab focalizada. O modo `manual` MUST preservar o comportamento anterior.

#### Scenario: Ativação automática

- **WHEN** o modo é `automatic` e o usuário move o foco com uma seta, Home ou End
- **THEN** a tab focalizada se torna a ativa e seu painel é apresentado

#### Scenario: Ativação manual por padrão

- **WHEN** nenhum modo é informado e o usuário move o foco com uma seta
- **THEN** a tab ativa não muda até Enter ou Space

### Requirement: Tabs em orientação vertical

`AdsTabs` MUST suportar a orientação `horizontal`, padrão, e `vertical`. A lista MUST expor a orientação configurada. Na orientação vertical, as setas para cima e para baixo MUST mover o foco entre tabs elegíveis e as setas horizontais MUST NOT movê-lo; Home e End MUST continuar valendo. Na vertical, a tab ativa MUST ser distinguível por indicador lateral e a lista MUST permanecer utilizável em largura reduzida.

#### Scenario: Navegação vertical

- **WHEN** a orientação é `vertical` e o usuário pressiona seta para baixo, seta para cima, Home ou End
- **THEN** o foco move para a tab elegível correspondente e as setas para a esquerda e para a direita não alteram o foco

#### Scenario: Orientação exposta

- **WHEN** a orientação é `vertical`
- **THEN** a lista de tabs é exposta como vertical a tecnologias assistivas

### Requirement: Painéis inativos de Tabs montados sob demanda

Por padrão, `AdsTabs` MUST manter somente o painel ativo no documento. A opção `keepMounted` MUST manter também os painéis inativos no documento, ocultos e fora da navegação por teclado, preservando o estado interno de seu conteúdo. A opção MUST poder ser definida na raiz e sobrescrita em cada painel.

#### Scenario: Padrão desmonta painéis inativos

- **WHEN** uma tab é ativada e depois outra
- **THEN** somente o painel da tab ativa existe no documento

#### Scenario: Painéis preservados

- **WHEN** `keepMounted` está ativo, um campo do painel inativo foi preenchido e a tab é reativada
- **THEN** o valor digitado foi preservado e, enquanto inativo, o painel não é anunciado nem focalizável

### Requirement: Tabs com identificadores válidos e parada de tabulação garantida

`AdsTabs` MUST gerar identificadores válidos e únicos para qualquer valor de tab, inclusive com espaços e caracteres especiais, de modo que valores distintos nunca colidam e a relação entre tab e painel permaneça correta. A lista MUST sempre ter exatamente uma tab tabulável quando houver ao menos uma tab habilitada, inclusive quando a tab ativa estiver desabilitada ou ausente.

#### Scenario: Valores com caracteres especiais

- **WHEN** duas tabs têm os valores `a b` e `a_b`
- **THEN** os identificadores são distintos e válidos e cada tab referencia o painel correto

#### Scenario: Tab ativa desabilitada

- **WHEN** a tab ativa está desabilitada
- **THEN** a primeira tab habilitada é a única na ordem de tabulação e pode receber o foco por Tab

### Requirement: Breadcrumb colapsável

`AdsBreadcrumb` MUST colapsar itens intermediários quando o número de itens excede `maxItems`, exibindo os primeiros itens, um botão de expansão e os últimos, e mantendo o item atual sempre visível. O botão MUST ter nome acessível sobrescrevível e MUST revelar todos os itens no lugar, sem perder o foco. Sem `maxItems`, a trilha MUST ser exibida por inteiro.

#### Scenario: Trilha longa colapsada

- **WHEN** uma trilha de seis itens é renderizada com `maxItems` igual a 4
- **THEN** são exibidos o primeiro item, o botão de expansão e os dois últimos, e o item atual continua com `aria-current="page"`

#### Scenario: Expandir a trilha

- **WHEN** o usuário ativa o botão de expansão
- **THEN** todos os itens são exibidos, o botão deixa de existir e o foco vai para o primeiro item revelado

#### Scenario: Trilha curta ou sem limite

- **WHEN** o número de itens não excede `maxItems` ou `maxItems` não é informado
- **THEN** todos os itens são exibidos e nenhum botão de expansão é renderizado

### Requirement: Separador do breadcrumb configurável

`AdsBreadcrumb` MUST aceitar um separador definido pelo consumidor, ignorado por tecnologias assistivas. Sem separador, MUST usar o padrão atual.

#### Scenario: Separador personalizado

- **WHEN** o consumidor define um separador
- **THEN** ele aparece entre os itens e não é anunciado por leitores de tela

### Requirement: Textos padrão de navegação sobrescrevíveis

Todo texto embutido em `AdsTabs`, `AdsBreadcrumb` e `AdsAccordion` MUST ter padrão em inglês e MUST poder ser sobrescrito por propriedade, prevalecendo sobre o padrão. Nenhum texto visível ou anunciado MUST depender de conteúdo gerado por CSS.

#### Scenario: Rótulos traduzidos pelo consumidor

- **WHEN** o consumidor informa o rótulo da navegação e o nome do botão de expansão do breadcrumb
- **THEN** esses valores substituem os padrões em inglês

#### Scenario: Padrão em inglês

- **WHEN** o consumidor não informa os rótulos
- **THEN** o breadcrumb expõe o nome `Breadcrumb` e o botão de expansão expõe o nome `Show full path`

### Requirement: Breadcrumb e nav compatíveis com Server Components

`AdsBreadcrumb` e `AdsNav` MUST poder ser renderizados em um Server Component, inclusive com itens que fornecem `renderLink`, sem exigir que a página declare `"use client"`. `AdsTabs` MUST funcionar quando importado por uma página Server Component, que compõe suas partes por exportações nomeadas (a notação `AdsTabs.List` só existe em Client Components), e todos MUST hidratar sem divergência.

#### Scenario: Breadcrumb com renderLink em Server Component

- **WHEN** uma página Server Component renderiza `AdsBreadcrumb` com itens que usam `renderLink`
- **THEN** a página renderiza sem erro de serialização e os links preservam o estilo e o foco do breadcrumb

#### Scenario: Tabs importado por Server Component

- **WHEN** uma página Server Component compõe `AdsTabs` com as partes de lista, tab e painel importadas pelo caminho público
- **THEN** o componente renderiza no servidor e hidrata sem aviso de divergência
