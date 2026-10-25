# Password input

## ADDED Requirements

### Requirement: Entrada de senha reutilizável

O sistema SHALL disponibilizar AdsPasswordInput por export público, inicialmente mascarado e compatível com formulários React.

#### Scenario: Entrada padrão

- **WHEN** o consumidor renderiza AdsPasswordInput com rótulo
- **THEN** o campo é identificado e seu valor fica mascarado por padrão

### Requirement: Alternância acessível de visibilidade

O sistema SHALL permitir alternar a visibilidade sem perder o valor e com controle acessível por teclado.

#### Scenario: Mostrar e ocultar

- **WHEN** a pessoa ativa o controle de visibilidade
- **THEN** o valor alterna entre mascarado e visível, preservando foco e seleção quando suportado

### Requirement: Estados e feedback

O sistema SHALL suportar estados desabilitado, inválido e feedback opcional de regras e força, sem depender apenas de cor.

#### Scenario: Erro

- **WHEN** o campo é inválido
- **THEN** o erro é perceptível e associado ao campo por tecnologia assistiva

#### Scenario: Força e regras

- **WHEN** o consumidor habilita o indicador de força e uma lista de regras
- **THEN** a força e o status de cada regra são exibidos em texto e associados ao campo por `aria-describedby`, sem depender de cor

#### Scenario: Desabilitado

- **WHEN** o campo está desabilitado
- **THEN** entrada e ação de visibilidade não podem ser acionadas

### Requirement: Integração visual e consumo

O sistema SHALL preservar responsividade, temas claro/escuro, tokens e consumo do CSS compilado em Next.js.

#### Scenario: Admin Demo

- **WHEN** a pessoa acessa o catálogo de componentes
- **THEN** encontra AdsPasswordInput no menu e uma página no padrão existente com exemplos interativos de estados e propriedades

#### Scenario: Aplicação consumidora

- **WHEN** uma aplicação Next.js importa o componente e o CSS público
- **THEN** o campo funciona sem exigir Tailwind na aplicação
