## Purpose

Define o comportamento responsivo e acessível da navegação estrutural do Admin Shell em viewports amplas e estreitas.

## ADDED Requirements

### Requirement: Sidebar participa do layout em viewports amplas

Em viewports amplas, `AdsAdminShell` MUST apresentar a sidebar como parte persistente do layout, mantendo o conteúdo principal disponível sem sobreposição. A sidebar MUST poder ser apresentada expandida ou recolhida conforme o estado de layout fornecido ao shell.

#### Scenario: Desktop com sidebar expandida

- **WHEN** o shell é renderizado em viewport ampla com sidebar expandida
- **THEN** a navegação ocupa sua região estrutural e o conteúdo principal usa o espaço restante

#### Scenario: Desktop com sidebar recolhida

- **WHEN** o consumidor recolhe a sidebar em viewport ampla
- **THEN** o shell reduz a ocupação estrutural da navegação sem remover o conteúdo principal nem quebrar a ordem de teclado

### Requirement: Conteúdo da sidebar permanece responsabilidade da composição consumidora

A sidebar MUST aceitar conteúdo React arbitrário por API pública e MUST NOT presumir que um componente de navegação existente possui orientação ou comportamento visual adequado ao contexto lateral. O shell MAY ser composto com `AdsNav` quando sua API pública atender ao caso; caso uma orientação vertical genérica seja necessária, ela MUST ser tratada como evolução reutilizável de `AdsNav`, e não como comportamento implícito ou específico do Admin Shell.

#### Scenario: Consumidor usa navegação compatível com sidebar

- **WHEN** o consumidor fornece uma estrutura de navegação pública adequada ao contexto lateral
- **THEN** o shell organiza essa estrutura sem reinterpretar seus itens, rotas ou semântica

#### Scenario: AdsNav atual não atende ao layout lateral

- **WHEN** a implementação constata que `AdsNav` não oferece orientação adequada para a sidebar
- **THEN** o shell não força estilos privados ou acoplados e a capacidade de orientação só é adicionada a `AdsNav` se for genérica e reutilizável fora do Admin Shell

### Requirement: Estado recolhido controla estrutura, não transforma conteúdo arbitrário

O estado recolhido da sidebar MUST controlar sua ocupação estrutural. O shell MUST expor esse estado por contrato suficiente para que o consumidor adapte o conteúdo apresentado quando necessário e MUST NOT inferir automaticamente como converter texto, labels ou outros elementos em uma representação compacta.

#### Scenario: Aplicação adapta navegação ao estado recolhido

- **WHEN** a sidebar está recolhida e a aplicação deseja manter itens por ícones
- **THEN** o consumidor consegue reagir ao estado do shell e fornecer uma representação acessível, mantendo nomes acessíveis e ordem de teclado válida

### Requirement: Navegação móvel usa apresentação sobreposta acessível

Em viewports estreitas, a navegação estrutural MUST deixar de reservar permanentemente a largura da sidebar e MUST poder ser aberta por um controle acessível. A apresentação móvel MUST reutilizar o comportamento público de overlay/drawer existente quando adequado, incluindo foco gerenciado, fechamento por `Escape`, backdrop e retorno de foco.

#### Scenario: Usuário abre a navegação no mobile

- **WHEN** o usuário ativa o controle de menu em viewport estreita
- **THEN** a navegação é apresentada sobre o conteúdo, recebe gerenciamento de foco apropriado e o controle comunica seu estado aberto

#### Scenario: Usuário fecha a navegação com Escape

- **WHEN** a navegação móvel está aberta e o usuário pressiona `Escape`
- **THEN** a navegação fecha e o foco retorna ao controle que iniciou a abertura conforme o contrato do overlay utilizado

### Requirement: Shell não depende de roteador para navegação

O shell MUST NOT importar ou exigir Next.js, React Router ou outra biblioteca de roteamento. Links, callbacks, item atual e fechamento da navegação após uma ação MUST ser controláveis pelo conteúdo ou pela aplicação consumidora.

#### Scenario: Aplicação usa roteador próprio

- **WHEN** o consumidor fornece links ou componentes de navegação integrados ao seu roteador
- **THEN** o shell apenas estrutura e apresenta a navegação sem conhecer a implementação do roteamento

### Requirement: Responsividade preserva acessibilidade e conteúdo

A mudança entre modos desktop e móvel MUST NOT duplicar conteúdo de navegação de forma que duas cópias operáveis permaneçam simultaneamente expostas a tecnologias assistivas. Controles ocultos MUST NOT permanecer indevidamente focáveis, e transições MUST respeitar `prefers-reduced-motion`.

#### Scenario: Viewport muda de desktop para mobile

- **WHEN** o layout passa para o modo móvel
- **THEN** somente a representação interativa apropriada da navegação fica disponível ao usuário e à árvore de acessibilidade
