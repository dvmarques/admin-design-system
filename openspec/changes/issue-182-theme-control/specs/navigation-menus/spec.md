## ADDED Requirements

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
