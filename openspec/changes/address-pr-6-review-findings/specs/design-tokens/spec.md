## ADDED Requirements

### Requirement: Conteúdo de superfície selecionada é personalizável

O sistema MUST disponibilizar um token semântico público de conteúdo sobre
superfície selecionada, com valores nos temas claro e escuro e equivalência
entre variáveis CSS e metadados TypeScript. Componentes que apresentam uma
superfície selecionada MUST usar esse papel para o conteúdo textual.

#### Scenario: Consumidor personaliza uma superfície selecionada

- **WHEN** uma aplicação sobrescreve os tokens de superfície e conteúdo
  selecionados em seu tema
- **THEN** os destinos e tabs selecionados preservam a associação entre fundo e
  conteúdo sem recompilar a biblioteca
