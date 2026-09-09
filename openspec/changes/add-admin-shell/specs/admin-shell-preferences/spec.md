## Purpose

Define os contratos de estado e preferências estruturais do Admin Shell sem impor persistência ou um sistema global de configurações.

## ADDED Requirements

### Requirement: Sidebar desktop suporta estado controlado e não controlado

`AdsAdminShell` MUST permitir que o estado expandido/recolhido da sidebar desktop seja controlado pela aplicação por prop e callback ou mantido internamente a partir de um valor inicial/default. O comportamento MUST seguir convenções React previsíveis e MUST NOT sobrescrever um valor controlado recebido do consumidor.

O contrato `collapsed`/`defaultCollapsed` (ou equivalente) MUST representar exclusivamente a preferência estrutural da sidebar persistente em viewports amplas. Esse estado MAY ser exposto ao consumidor para composição explícita de labels, ícones ou outras representações no desktop, mas MUST NOT compactar automaticamente a navegação móvel.

#### Scenario: Aplicação controla a sidebar desktop

- **WHEN** o consumidor fornece o estado `collapsed` da sidebar e callback de alteração
- **THEN** o shell solicita alterações pelo callback e renderiza a sidebar desktop de acordo com o valor controlado recebido

#### Scenario: Shell mantém estado local da sidebar desktop

- **WHEN** o consumidor fornece apenas `defaultCollapsed` ou valor inicial equivalente
- **THEN** o shell mantém internamente as alterações de expansão e recolhimento da sidebar desktop durante seu ciclo de vida

#### Scenario: Preferência recolhida não compacta mobile

- **WHEN** a preferência desktop está recolhida e a viewport passa ao modo móvel
- **THEN** o drawer mobile usa apresentação completa por padrão e não herda automaticamente largura reduzida, labels ocultos ou representação compacta

#### Scenario: Consumidor usa estado recolhido para composição desktop

- **WHEN** a aplicação precisa adaptar explicitamente o conteúdo da sidebar desktop ao estado recolhido
- **THEN** ela consegue consumir o estado exposto pelo shell sem que essa adaptação seja aplicada implicitamente ao drawer mobile

### Requirement: Navegação móvel possui estado separado controlado e não controlado

A abertura da navegação móvel MUST ser representada por estado separado da preferência `collapsed`, como `mobileOpen`/`defaultMobileOpen` ou contrato equivalente. Esse estado MUST poder ser controlado externamente ou mantido internamente. O shell MUST expor callback de alteração suficiente para que a aplicação coordene esse estado quando necessário.

Alterações em `collapsed` MUST NOT abrir, fechar ou compactar automaticamente o drawer móvel. Alterações em `mobileOpen` MUST NOT redefinir a preferência expandida/recolhida da sidebar desktop.

#### Scenario: Aplicação fecha menu após navegação

- **WHEN** a aplicação controla o estado móvel e uma ação de navegação é concluída
- **THEN** ela consegue fechar a navegação atualizando a prop correspondente sem depender de API interna do shell

#### Scenario: Estados desktop e mobile permanecem independentes

- **WHEN** a aplicação altera `collapsed` enquanto `mobileOpen` possui outro valor
- **THEN** cada estado afeta somente sua responsabilidade estrutural e o shell não deriva automaticamente um a partir do outro

### Requirement: Estado móvel não controlado é resetado ao sair do breakpoint mobile

Quando o drawer está aberto por estado interno e a viewport deixa o breakpoint móvel, o shell MUST fechar/resetar `mobileOpen` (ou equivalente) para evitar estado latente. Se a viewport voltar ao mobile depois, o drawer MUST permanecer fechado até uma nova ação explícita de abertura.

#### Scenario: Mobile aberto não controlado muda para desktop

- **WHEN** `mobileOpen` é mantido internamente, está aberto e a viewport entra no layout desktop
- **THEN** o shell reseta o estado interno para fechado durante a transição

#### Scenario: Viewport retorna ao mobile após reset

- **WHEN** a viewport retorna ao modo móvel depois do reset realizado na transição anterior
- **THEN** o drawer permanece fechado e não reabre inesperadamente por valor interno latente

### Requirement: Estado móvel controlado solicita fechamento ao sair do breakpoint mobile

Quando `mobileOpen` é controlado externamente e está aberto, cruzar para desktop MUST NOT fazer o shell mutar ou substituir a prop recebida. O shell MUST disparar o callback de mudança solicitando fechamento. Enquanto a aplicação ainda não refletir a atualização, a apresentação desktop MUST permanecer livre dos efeitos do overlay móvel, incluindo backdrop, portal e focus trap ativos.

O shell MAY manter apenas a coordenação transitória necessária para lembrar que aquele valor controlado `true` já recebeu uma solicitação de fechamento por mudança de breakpoint. Essa coordenação MUST NOT substituir `mobileOpen` como fonte de verdade pública nem produzir um segundo contrato controlável; sua única função é impedir que o mesmo `true` antigo provoque reabertura inesperada caso a viewport volte ao mobile antes de o consumidor reconhecer o fechamento.

Depois de uma solicitação de fechamento por breakpoint, uma nova abertura controlada MUST depender de reconhecimento do fechamento (`mobileOpen=false`) seguido por uma nova intenção explícita de abertura (`false → true`), ou sinalização pública equivalente. Manter continuamente `mobileOpen=true` sem reconhecer o fechamento MUST NOT ser interpretado como uma nova abertura.

#### Scenario: Mobile aberto controlado muda para desktop

- **WHEN** `mobileOpen` é controlado externamente, está verdadeiro e a viewport entra no layout desktop
- **THEN** o shell solicita `false` pelo callback, preserva o valor controlado como responsabilidade do consumidor e desativa os efeitos operáveis do overlay no desktop

#### Scenario: Consumidor demora a refletir fechamento controlado

- **WHEN** o callback de fechamento foi disparado mas a prop controlada ainda permanece verdadeira durante o layout desktop
- **THEN** o shell não mantém backdrop, portal, focus trap ou segunda navegação móvel operável enquanto aguarda a atualização externa

#### Scenario: Viewport volta ao mobile antes do reconhecimento externo

- **WHEN** o callback de fechamento foi disparado, `mobileOpen` ainda permanece `true` e a viewport retorna ao mobile
- **THEN** o drawer continua fechado e o valor antigo não é tratado como nova intenção de abertura

#### Scenario: Consumidor reconhece fechamento e abre novamente

- **WHEN** o consumidor atualiza `mobileOpen` para `false` após a solicitação e posteriormente muda novamente para `true`
- **THEN** o shell reconhece essa nova transição como nova intenção controlada de abertura no breakpoint móvel

### Requirement: Estado acessível do trigger representa a apresentação efetiva

Quando a abertura móvel controlada estiver temporariamente suprimida pela troca para desktop, os atributos de estado do trigger MUST representar a apresentação efetivamente operável. Em particular, `aria-expanded` MUST NOT permanecer `true` apenas porque a prop controlada ainda não reconheceu a solicitação de fechamento.

#### Scenario: Prop controlada antiga permanece verdadeira no desktop

- **WHEN** `mobileOpen=true` permanece recebido após o shell solicitar fechamento e o overlay móvel está inativo no layout desktop
- **THEN** o trigger não anuncia a navegação móvel como expandida/operável

### Requirement: Persistência de preferências pertence ao consumidor

O shell MUST NOT gravar estado automaticamente em localStorage, cookies, sessão ou backend. O consumidor MAY persistir uma preferência externamente e fornecer o valor restaurado ao shell por sua API controlada ou valor inicial.

#### Scenario: Aplicação restaura preferência persistida

- **WHEN** uma aplicação recupera externamente que o usuário prefere sidebar desktop recolhida
- **THEN** ela consegue inicializar ou controlar o shell nesse estado sem que o design system conheça o mecanismo de persistência

### Requirement: Tema permanece fora do estado do shell

O shell MUST NOT criar um segundo mecanismo de tema. Controles como `ThemeToggle` MAY ser compostos no header, e a aparência do shell MUST responder aos tokens/tema globais já aplicados pelo design system.

#### Scenario: Header inclui controle de tema

- **WHEN** o consumidor compõe `ThemeToggle` ou controle equivalente no header
- **THEN** a alteração do tema afeta o shell pelos contratos públicos existentes sem estado de tema duplicado no pacote admin

### Requirement: Primeira versão limita preferências ao necessário para a estrutura

A change MUST NOT introduzir um sistema genérico de configurações de layout. Densidade global, posicionamento arbitrário do header, múltiplas sidebars, presets de layout e outras preferências não exigidas pelo shell ficam fora do escopo.

#### Scenario: Consumidor precisa de configuração não suportada

- **WHEN** uma aplicação necessita de uma preferência estrutural além dos contratos definidos nesta change
- **THEN** essa necessidade é tratada pela composição da aplicação ou por evolução futura da especificação, sem API genérica prematura
