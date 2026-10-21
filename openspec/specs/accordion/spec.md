# accordion Specification

## Purpose

Fornece seções expansíveis acessíveis, tematizáveis e independentes de roteador para aplicações administrativas React, com um ou vários itens abertos por vez.

## Requirements

### Requirement: Accordion semântico e composicionável

O sistema MUST fornecer `AdsAccordion` composto por raiz, item, cabeçalho, gatilho e painel. O cabeçalho MUST ser um heading real, com nível configurável de 2 a 6, e conter o gatilho como um único botão. O gatilho MUST expor `aria-expanded` e referenciar o painel, e o painel MUST expor uma região nomeada pelo gatilho.

#### Scenario: Estrutura exposta a tecnologias assistivas

- **WHEN** o consumidor renderiza um accordion com itens fechados e um aberto
- **THEN** cada gatilho é um botão dentro de um heading, `aria-expanded` reflete o estado do item e o painel aberto é uma região cujo nome é o texto do gatilho

#### Scenario: Nível de heading configurável

- **WHEN** o consumidor define o nível 4 no cabeçalho de um item
- **THEN** o item é exposto como heading de nível 4, sem alterar os demais

### Requirement: Modos single e multiple com estado controlado ou não

O sistema MUST suportar o modo `single`, com no máximo um item aberto, e o modo `multiple`, com qualquer quantidade. No modo `single`, o item aberto MUST poder ser fechado somente quando a opção `collapsible` estiver ativa. O estado MUST poder ser controlado ou não, com valor inicial e notificação de mudança.

#### Scenario: Abrir outro item no modo single

- **WHEN** um item está aberto no modo `single` e o usuário ativa o gatilho de outro item
- **THEN** o segundo item abre e o primeiro fecha

#### Scenario: Fechar o item aberto no modo single

- **WHEN** o usuário ativa o gatilho do único item aberto
- **THEN** o item permanece aberto sem `collapsible` e fecha com `collapsible`

#### Scenario: Vários itens abertos no modo multiple

- **WHEN** o usuário ativa os gatilhos de dois itens no modo `multiple`
- **THEN** os dois itens ficam abertos e cada gatilho fecha apenas o seu item

#### Scenario: Estado controlado

- **WHEN** o consumidor fornece o valor e o usuário ativa um gatilho
- **THEN** a mudança é notificada e a aparência só muda quando o consumidor atualiza o valor

### Requirement: Accordion operável por teclado

Enter e Space MUST alternar o item do gatilho focalizado. Todos os gatilhos habilitados MUST permanecer na ordem de tabulação. As setas para cima e para baixo MUST mover o foco entre gatilhos habilitados do mesmo accordion, Home e End MUST mover para o primeiro e o último, e o foco MUST ter indicador visível.

#### Scenario: Navegação entre gatilhos

- **WHEN** o foco está em um gatilho e o usuário pressiona seta para baixo, seta para cima, Home ou End
- **THEN** o foco move para o gatilho habilitado correspondente sem alterar o estado dos itens

#### Scenario: Accordions aninhados

- **WHEN** um painel contém outro accordion e o foco está em um gatilho interno
- **THEN** as setas movem o foco somente entre os gatilhos do accordion interno

### Requirement: Itens desabilitados

Um item desabilitado MUST NOT poder ser aberto nem fechado pelo usuário, MUST ser exposto como desabilitado e MUST ser ignorado pela navegação por setas, Home e End. O estado desabilitado MUST ser distinguível visualmente nos dois temas.

#### Scenario: Gatilho desabilitado

- **WHEN** o usuário tenta ativar o gatilho de um item desabilitado, por clique ou teclado
- **THEN** o estado do item não muda e a navegação por setas passa direto por ele

### Requirement: Montagem do painel

Por padrão, o painel fechado MUST permanecer no documento oculto, preservando o estado interno de seu conteúdo. A opção `unmountOnCollapse` MUST remover o conteúdo do painel fechado do documento, podendo ser definida na raiz e sobrescrita em cada item. O gatilho MUST NOT referenciar um painel ausente.

#### Scenario: Painel fechado oculto por padrão

- **WHEN** um item com um campo de formulário é aberto, preenchido, fechado e reaberto
- **THEN** o valor digitado é preservado e, enquanto fechado, o painel não é anunciado nem focalizável

#### Scenario: Desmontar ao fechar

- **WHEN** `unmountOnCollapse` está ativo e o item é fechado
- **THEN** o conteúdo do painel sai do documento e o gatilho não referencia painel inexistente

#### Scenario: Item sobrescreve a raiz

- **WHEN** a raiz ativa `unmountOnCollapse` e um item o desativa
- **THEN** somente esse item mantém o painel oculto no documento ao fechar

### Requirement: Aparência do accordion nos temas e em telas estreitas

O gatilho MUST exibir um indicador de estado que não dependa só de cor e MUST respeitar a preferência por movimento reduzido. Texto, bordas e superfícies MUST usar tokens públicos e atingir contraste mínimo de `4.5:1` para texto nos temas claro e escuro. Em largura de 320px, o conteúdo MUST quebrar linha sem rolagem horizontal da página. A personalização MUST ocorrer por tokens, sem recompilar a biblioteca.

#### Scenario: Contraste e indicador nos dois temas

- **WHEN** um accordion é renderizado nos temas claro e escuro
- **THEN** o texto do gatilho atinge contraste mínimo de `4.5:1` e o indicador distingue item aberto de fechado

#### Scenario: Viewport de 320px

- **WHEN** um gatilho com texto longo é renderizado em 320px de largura
- **THEN** o texto quebra linha e a página não ganha rolagem horizontal

### Requirement: Accordion em aplicações Next.js

`AdsAccordion` MUST ser importável pelo caminho público do pacote em uma página Server Component, que compõe suas partes por exportações nomeadas (a notação `AdsAccordion.Item` só existe em Client Components), e MUST renderizar no servidor e hidratar sem divergência, inclusive com estado inicial aberto.

#### Scenario: Uso em página do App Router

- **WHEN** uma página Server Component renderiza `AdsAccordion` com um item aberto por padrão
- **THEN** a renderização no servidor não gera erro e o cliente hidrata sem aviso de divergência
