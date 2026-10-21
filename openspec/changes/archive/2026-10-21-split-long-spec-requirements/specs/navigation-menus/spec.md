# Spec Delta

## MODIFIED Requirements

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
