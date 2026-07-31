## Purpose

Fornece menus suspensos contextuais que preservam a acessibilidade, o foco e a visibilidade em layouts administrativos responsivos.

## ADDED Requirements

### Requirement: Dropdown composto e controlável

O sistema MUST fornecer `AdsDropdown` composto por gatilho, conteúdo e itens, com estado aberto controlado ou não controlado. O gatilho MUST expor estado expandido e a relação com o menu; itens MUST aceitar ações ou links fornecidos pelo consumidor e preservar seus atributos nativos. A API MUST ser independente de roteamento e aceitar personalização segura por `className` e tokens públicos.

#### Scenario: Abertura por gatilho

- **WHEN** o usuário ativa o gatilho por mouse, Enter, Space ou seta para baixo
- **THEN** o menu é aberto, a relação ARIA é atualizada e o foco é movido ao primeiro item elegível quando a abertura é pelo teclado

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
