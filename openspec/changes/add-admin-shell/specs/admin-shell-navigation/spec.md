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
