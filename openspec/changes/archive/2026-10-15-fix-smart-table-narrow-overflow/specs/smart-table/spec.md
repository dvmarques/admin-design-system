# Spec Delta

## MODIFIED Requirements

### Requirement: Rolagem horizontal acessível

`AdsSmartTable` MUST envolver a tabela em uma região rolável com nome acessível (a legenda) e focável por teclado, sem ocultar colunas automaticamente, e MUST manter a barra de ferramentas e a paginação fora da região rolável. Nenhum elemento do componente, inclusive a paginação, MUST ampliar a largura da página além da área disponível.

#### Scenario: Tela estreita

- **WHEN** as colunas excedem a largura disponível
- **THEN** a região recebe foco por `Tab`, rola horizontalmente com as setas e mantém todas as colunas acessíveis, com foco visível

#### Scenario: Paginação em tela estreita

- **WHEN** o componente com paginação é exibido em 375 px
- **THEN** a página não rola na horizontal e a paginação rola dentro do próprio contêiner
