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

### Requirement: Estado recolhido controla somente a sidebar desktop

O estado `collapsed`/`defaultCollapsed` MUST controlar somente a ocupação estrutural da sidebar persistente em viewports amplas. O shell MUST expor esse estado por contrato suficiente para que o consumidor adapte explicitamente o conteúdo apresentado no desktop quando necessário e MUST NOT inferir automaticamente como converter texto, labels ou outros elementos em uma representação compacta.

Em viewports estreitas, a navegação móvel MUST usar sua apresentação completa por padrão e MUST NOT herdar largura reduzida, labels ocultos ou outra representação compacta apenas porque a sidebar desktop está recolhida. O consumidor MAY adaptar explicitamente o conteúdo para mobile, mas essa adaptação MUST NOT ocorrer automaticamente em função de `collapsed`.

#### Scenario: Aplicação adapta navegação desktop ao estado recolhido

- **WHEN** a sidebar desktop está recolhida e a aplicação deseja manter itens por ícones
- **THEN** o consumidor consegue reagir ao estado do shell e fornecer uma representação acessível no desktop, mantendo nomes acessíveis e ordem de teclado válida

#### Scenario: Sidebar desktop recolhida não compacta o drawer mobile

- **WHEN** `collapsed` é verdadeiro e a viewport entra no modo móvel
- **THEN** o drawer apresenta a navegação em sua forma completa por padrão, sem herdar largura reduzida ou ocultação automática de labels

#### Scenario: Consumidor adapta explicitamente o conteúdo mobile

- **WHEN** a aplicação decide fornecer uma apresentação específica para mobile
- **THEN** essa adaptação ocorre por composição explícita do consumidor e não como efeito implícito do estado `collapsed`

### Requirement: Navegação móvel usa apresentação sobreposta acessível

Em viewports estreitas, a navegação estrutural MUST deixar de reservar permanentemente a largura da sidebar e MUST poder ser aberta por um controle acessível. A apresentação móvel MUST reutilizar o comportamento público de overlay/drawer existente quando adequado, incluindo foco gerenciado, fechamento por `Escape`, backdrop e retorno de foco. O estado de abertura móvel MUST permanecer separado da preferência `collapsed` da sidebar desktop.

#### Scenario: Usuário abre a navegação no mobile

- **WHEN** o usuário ativa o controle de menu em viewport estreita
- **THEN** a navegação é apresentada sobre o conteúdo, recebe gerenciamento de foco apropriado e o controle comunica seu estado aberto

#### Scenario: Usuário fecha a navegação com Escape

- **WHEN** a navegação móvel está aberta e o usuário pressiona `Escape`
- **THEN** a navegação fecha e o foco retorna ao controle que iniciou a abertura conforme o contrato do overlay utilizado

#### Scenario: Drawer mobile ignora preferência collapsed do desktop

- **WHEN** a navegação móvel é aberta enquanto a preferência desktop está recolhida
- **THEN** o drawer não aplica automaticamente largura compacta, ocultação de labels ou representação reduzida da sidebar desktop

### Requirement: Shell fornece contrato público para o trigger da navegação móvel

O shell MUST fornecer uma API pública para compor o controle que abre a navegação móvel, como uma primitive `MobileMenuTrigger` ou contrato equivalente. Essa API MUST coordenar o estado móvel e os atributos acessíveis necessários, sem exigir que o consumidor reproduza manualmente detalhes internos do shell. O consumidor MAY customizar a apresentação e o conteúdo do trigger.

`aria-expanded` MUST refletir se a apresentação móvel está efetivamente aberta e operável no breakpoint atual, e não apenas o valor bruto de uma prop controlada temporariamente suprimida durante uma transição para desktop.

#### Scenario: Consumidor posiciona trigger no header

- **WHEN** a aplicação compõe o trigger móvel dentro de seu header
- **THEN** o controle usa o estado coordenado pelo shell, comunica `aria-expanded`, mantém associação com a navegação móvel e abre o drawer correspondente

#### Scenario: Aplicação usa estado móvel controlado

- **WHEN** a navegação móvel é controlada externamente por prop e callback
- **THEN** a ativação do trigger solicita a mudança pelo contrato público sem manter estado concorrente interno

#### Scenario: Prop controlada permanece verdadeira durante desktop

- **WHEN** o shell solicitou fechamento ao sair do mobile mas a prop controlada ainda permanece verdadeira no layout desktop
- **THEN** o trigger não comunica falsamente um overlay operável e `aria-expanded` reflete a apresentação móvel efetiva como fechada/inativa

#### Scenario: Drawer fecha e foco retorna ao trigger

- **WHEN** a navegação móvel é fechada após ter sido aberta por um trigger do shell e esse trigger continua visível e focável
- **THEN** o foco pode retornar ao elemento que iniciou a abertura conforme o contrato acessível do overlay utilizado

### Requirement: Shell não depende de roteador para navegação

O shell MUST NOT importar ou exigir Next.js, React Router ou outra biblioteca de roteamento. Links, callbacks, item atual e fechamento da navegação após uma ação MUST ser controláveis pelo conteúdo ou pela aplicação consumidora.

#### Scenario: Aplicação usa roteador próprio

- **WHEN** o consumidor fornece links ou componentes de navegação integrados ao seu roteador
- **THEN** o shell apenas estrutura e apresenta a navegação sem conhecer a implementação do roteamento

### Requirement: Responsividade preserva acessibilidade e uma única instância lógica da navegação

A mudança entre modos desktop e móvel MUST NOT manter duas montagens simultâneas do mesmo conteúdo arbitrário da sidebar como estratégia padrão. A implementação MUST preservar uma única instância lógica da navegação por vez, evitando duplicação de IDs, estado interno, efeitos, listeners e integrações de roteamento. Controles ocultos MUST NOT permanecer indevidamente focáveis, e transições MUST respeitar `prefers-reduced-motion`.

#### Scenario: Viewport muda de desktop para mobile

- **WHEN** o layout passa para o modo móvel
- **THEN** a representação desktop deixa de ser a instância ativa e somente a representação mobile apropriada permanece montada/operável conforme a estratégia escolhida, sem duas cópias simultâneas do mesmo conteúdo arbitrário

#### Scenario: Conteúdo da sidebar possui estado interno

- **WHEN** o consumidor fornece conteúdo de navegação com IDs, estado interno ou efeitos próprios
- **THEN** o shell não mantém duas instâncias simultâneas desse conteúdo apenas para atender aos dois breakpoints

#### Scenario: Implementação excepcionalmente exige duas montagens

- **WHEN** uma solução técnica só puder ser implementada com duas montagens simultâneas
- **THEN** essa exceção deve ser justificada explicitamente e coberta por testes que demonstrem ausência de colisões de IDs, estado, efeitos e exposição duplicada à árvore de acessibilidade

### Requirement: Mobile aberto é encerrado ao entrar no layout desktop

Quando a viewport deixa o breakpoint móvel enquanto a navegação overlay está aberta, o shell MUST encerrar ou coordenar o encerramento da apresentação mobile antes ou de forma coordenada com a ativação da sidebar desktop. Backdrop, portal e focus trap MUST NOT permanecer ativos quando o layout desktop estiver visível, o foco MUST terminar em um elemento válido ainda montado e a transição MUST NOT produzir uma segunda instância simultânea/operável da navegação.

No modo não controlado, o shell MUST fechar/resetar o estado interno `mobileOpen` ou equivalente. Esse estado interno MUST NOT permanecer latente a ponto de reabrir o drawer inesperadamente caso a viewport retorne ao mobile.

No modo controlado, o shell MUST NOT alterar a prop externamente, mas MUST disparar o callback de mudança solicitando fechamento. Enquanto o consumidor ainda não refletir a prop atualizada, o shell MUST desativar os efeitos do overlay no layout desktop e MUST NOT manter backdrop, portal, focus trap ou navegação duplicada operáveis. O valor controlado ainda verdadeiro após essa solicitação MUST ser tratado como uma abertura pendente já invalidada pela troca de breakpoint, e não como autorização suficiente para reabrir automaticamente o drawer ao retornar ao mobile. Essa supressão de apresentação é coordenação transitória do breakpoint, não uma segunda fonte pública de verdade para `mobileOpen`.

Uma nova abertura controlada após esse fechamento MUST exigir que o consumidor primeiro reconheça o fechamento (`mobileOpen=false`) e depois produza uma nova transição explícita para aberto (`false → true`), ou outra sinalização pública equivalente que represente uma nova intenção de abertura. Um `true` antigo que nunca reconheceu o fechamento solicitado MUST NOT causar reabertura inesperada.

#### Scenario: Mobile aberto muda para desktop em modo não controlado

- **WHEN** o drawer está aberto por estado interno e a viewport cruza para desktop
- **THEN** o overlay é encerrado, o estado interno móvel é resetado para fechado, não permanece backdrop/focus trap/portal ativo e somente a navegação desktop fica operável

#### Scenario: Mobile aberto muda para desktop em modo controlado

- **WHEN** o drawer está aberto por prop controlada e a viewport cruza para desktop
- **THEN** o shell solicita `false` pelo callback sem mutar a prop, remove/desativa os efeitos do overlay no desktop e mantém somente uma instância operável da navegação

#### Scenario: Consumidor não reconhece imediatamente o fechamento controlado

- **WHEN** o callback de fechamento já foi disparado, a prop continua `true` e a viewport retorna ao mobile
- **THEN** o drawer permanece fechado e o valor `true` anterior não é interpretado como uma nova solicitação de abertura

#### Scenario: Consumidor reconhece e solicita nova abertura controlada

- **WHEN** após a solicitação de fechamento o consumidor atualiza `mobileOpen` para `false` e posteriormente realiza nova transição explícita para `true`
- **THEN** o drawer pode abrir novamente no breakpoint móvel

#### Scenario: Desktop retorna ao mobile após fechamento coordenado

- **WHEN** a viewport volta ao breakpoint móvel depois que a transição anterior fechou ou solicitou o fechamento do drawer
- **THEN** a navegação móvel permanece fechada até nova ação explícita no modo não controlado ou nova intenção controlada reconhecida pelo contrato de fechamento e reabertura

#### Scenario: Overlay não deixa resíduos após transição

- **WHEN** o layout desktop fica ativo após um drawer mobile aberto
- **THEN** não existe backdrop residual, focus trap ativo, portal overlay operável nem foco preso em conteúdo desmontado

#### Scenario: Foco não retorna para trigger indisponível

- **WHEN** a troca para desktop desmonta, oculta ou torna não focável o trigger que abriu o drawer
- **THEN** o shell não força foco para esse trigger e garante que o foco termine em um elemento válido ainda montado/operável segundo a estratégia acessível adotada

#### Scenario: Estado móvel não reabre inesperadamente

- **WHEN** a viewport alterna mobile aberto → desktop → mobile sem nova ação de abertura
- **THEN** o drawer não reabre por estado interno latente, prop controlada antiga ainda verdadeira ou coordenação de breakpoint incorreta

### Requirement: Responsividade é segura para SSR e hidratação

O comportamento responsivo MUST ser compatível com renderização sem DOM e MUST NOT depender de `window`, `matchMedia` ou leitura de viewport durante SSR. O markup do primeiro render do cliente MUST ser compatível com o produzido no servidor, evitando hydration mismatch. Qualquer coordenação de breakpoint em runtime MUST ocorrer de forma encapsulada e segura após hidratação ou por estratégia equivalente.

#### Scenario: Shell é renderizado no servidor

- **WHEN** `AdsAdminShell` é renderizado em ambiente sem `window` ou `matchMedia`
- **THEN** a renderização conclui sem erro e produz markup determinístico que pode ser hidratado pelo cliente

#### Scenario: Cliente hidrata em viewport móvel

- **WHEN** o markup gerado no servidor é hidratado em uma viewport estreita
- **THEN** o primeiro render do cliente permanece compatível com o servidor e a adaptação ao modo móvel ocorre sem hydration mismatch

#### Scenario: Breakpoint muda após hidratação

- **WHEN** a viewport cruza o breakpoint depois que a aplicação já foi hidratada
- **THEN** o shell atualiza a apresentação responsiva preservando seus contratos de estado, foco e instância lógica da navegação
