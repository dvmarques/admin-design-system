# navigation-menus Specification

## Purpose

Fornece menus suspensos contextuais que preservam a acessibilidade, o foco e a visibilidade em layouts administrativos responsivos.

## Requirements

### Requirement: Dropdown composto e controlável

O sistema MUST fornecer `AdsDropdown` composto por gatilho, conteúdo e itens, com estado aberto controlado ou não controlado, independente de roteamento e personalizável por `className` e tokens públicos. O gatilho MUST expor estado expandido e a relação com o menu; itens MUST aceitar ações ou links do consumidor preservando seus atributos nativos. A abertura pelo teclado MUST focar o primeiro item habilitado, e a abertura por mouse MUST NOT mover o foco para um item.

#### Scenario: Abertura por gatilho

- **WHEN** o usuário foca o gatilho e pressiona ArrowDown, Enter ou Espaço com estado controlado ou não controlado
- **THEN** o menu abre, sua relação ARIA é atualizada e o primeiro item habilitado recebe foco quando o conteúdo fica disponível, mesmo se a montagem acontecer depois da atualização de abertura

#### Scenario: Reabertura por teclado

- **WHEN** o usuário fecha com Escape e abre novamente pelo teclado
- **THEN** o primeiro item habilitado recebe foco novamente e setas, Home e End permitem navegar ignorando desabilitados

#### Scenario: Abertura por mouse

- **WHEN** o usuário clica no gatilho, inclusive após fechar uma abertura por teclado
- **THEN** o menu abre sem deslocar foco para um item

#### Scenario: Menu sem itens habilitados

- **WHEN** o usuário abre pelo teclado um menu vazio ou com todos os itens desabilitados
- **THEN** nenhum item recebe foco, nenhuma ação é executada e Escape permite fechar

#### Scenario: Solicitação abandonada de abertura

- **WHEN** o consumidor recusa ou adia a abertura por teclado e o usuário sai do gatilho antes de uma abertura posterior
- **THEN** a abertura posterior não captura o foco, mesmo que o usuário retorne ao gatilho antes dela

#### Scenario: Abertura sem deslocar a página

- **WHEN** o gatilho está visível numa página rolada e o usuário abre o menu pelo teclado
- **THEN** o primeiro item habilitado recebe foco sem deslocar a rolagem da página durante a abertura

### Requirement: Menu operável por teclado e foco gerenciado

Enquanto aberto, `AdsDropdown` MUST permitir mover foco entre itens elegíveis com seta para cima, seta para baixo, Home e End. Escape MUST solicitar o fechamento e restaurar foco ao gatilho; fechar por interação externa MUST remover o menu sem executar uma ação de item. Itens desabilitados MUST ser ignorados pela navegação e não executar ação.

#### Scenario: Fechamento com Escape

- **WHEN** o foco está no menu aberto e o usuário pressiona Escape
- **THEN** o menu fecha e o foco retorna ao gatilho que o abriu

#### Scenario: Item desabilitado

- **WHEN** o usuário navega pelo menu com teclado e há um item desabilitado
- **THEN** o foco não para nesse item e sua ação não é disparada

### Requirement: Posicionamento visível e tematizável

O menu MUST ser posicionado junto ao gatilho conforme uma posição preferida configurável e MUST permanecer visível ao rolar, redimensionar ou ao abrir próximo às bordas da viewport. Quando não houver espaço na direção preferida, o menu MUST inverter ou restringir sua posição para manter o conteúdo alcançável. O menu MUST manter o tema explícito mais próximo do gatilho quando renderizado fora de sua subárvore DOM.

#### Scenario: Gatilho próximo à borda da viewport

- **WHEN** um dropdown é aberto sem espaço suficiente na direção preferida
- **THEN** o menu é reposicionado ou limitado para permanecer visível e interativo

#### Scenario: Tema explícito no portal

- **WHEN** o dropdown é aberto dentro de um escopo com tema explícito
- **THEN** o menu aberto usa o mesmo tema, inclusive após mudança de tema enquanto permanece aberto

### Requirement: Itens de menu de seleção exclusiva

`AdsDropdown.Item` MUST aceitar `role="menuitemradio"` com `aria-checked`, preservando `menuitem` como padrão. A navegação por teclado MUST considerar itens `menuitem` e `menuitemradio`, ignorando os desabilitados, e a abertura pelo teclado MUST focar o item `menuitemradio` marcado quando existir.

#### Scenario: Foco inicial no item marcado

- **WHEN** o menu com itens `menuitemradio` é aberto pelo teclado e um deles está marcado
- **THEN** o foco vai para o item marcado

#### Scenario: Uso existente preservado

- **WHEN** um menu usa apenas itens `menuitem`
- **THEN** a navegação, o foco inicial no primeiro item e o fechamento permanecem como antes

### Requirement: Escolha de item de seleção exclusiva devolve o foco

Escolher um item `menuitemradio` MUST fechar o menu e devolver o foco ao gatilho; itens `menuitem` MUST manter o comportamento atual.

#### Scenario: Escolha devolve o foco

- **WHEN** o usuário escolhe um item `menuitemradio` por clique ou teclado
- **THEN** o menu fecha e o foco fica no gatilho

### Requirement: Gatilho aceita variante e tamanho

`AdsDropdown.Trigger` MUST aceitar `variant` e `size` do botão, mantendo os padrões atuais.

#### Scenario: Gatilho com variante

- **WHEN** o gatilho recebe `variant="ghost"` e `size="sm"`
- **THEN** ele usa a aparência correspondente do botão

### Requirement: Cabeçalhos e separadores não interativos de dropdown

O AdsDropdown MUST oferecer `Header` e `Divider` composáveis no Content, mantendo a API e os mecanismos existentes de menu, posicionamento e portal. Header e Divider MUST permanecer fora da navegação por itens ativáveis e MUST permitir agrupamento acessível com semântica nativa de grupo e rótulo.

#### Scenario: Menu com agrupamento

- **WHEN** o consumidor coloca Header com id e grupos `role=group` com `aria-labelledby`, intercalando Divider e Item
- **THEN** leitores de tela encontram os grupos identificados e separadores, enquanto somente Items habilitados recebem foco na navegação por setas, Home e End

#### Scenario: Fechamento e retorno de foco

- **WHEN** o usuário navega por teclado e pressiona Escape, Tab ou Shift+Tab
- **THEN** Escape fecha e devolve foco ao gatilho, enquanto Tab fecha e prossegue para a parada de foco anterior ou seguinte ao gatilho sem aprisionamento no portal

#### Scenario: Tab com foco no gatilho

- **WHEN** o menu está aberto e o foco permanece no gatilho após clique ou por não existir item habilitado
- **THEN** Tab e Shift+Tab fecham o menu e preservam a navegação nativa a partir do gatilho

#### Scenario: Regressão de menu

- **WHEN** Tab ou Shift+Tab chega ao limite da sequência do documento com o menu portado aberto
- **THEN** o menu fecha e permite a tabulação nativa a partir do gatilho, inclusive a saída do documento quando não existe outra parada nesse sentido

#### Scenario: Evento de teclado cancelado pelo consumidor

- **WHEN** um descendente ou o handler público do Content cancela o evento de teclado
- **THEN** o dropdown preserva o estado e o foco, sem executar sua navegação ou fechamento internos

#### Scenario: Regressão de itens

- **WHEN** o consumidor usa Items normais, desabilitados, menus vazios ou valores radio em telas pequenas ou portais aninhados
- **THEN** os novos elementos não recebem foco nem ativação e fechamento, layering e posicionamento existentes continuam funcionando
