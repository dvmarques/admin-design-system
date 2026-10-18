# Spec Delta

## ADDED Requirements

### Requirement: Controles textuais respeitam a largura do contêiner

Controles textuais públicos de largura total MUST ocupar no máximo a largura do campo ou da coluna que os contém, contando padding e borda, independentemente de a aplicação consumidora definir um reset de `box-sizing`.

#### Scenario: Campo de texto em uma coluna de filtros

- **WHEN** um controle textual é renderizado em uma coluna de uma grade ao lado de um seletor, sem reset global de `box-sizing` na aplicação
- **THEN** a borda direita do controle não ultrapassa a borda da coluna e não sobrepõe o controle vizinho

#### Scenario: Largura reduzida

- **WHEN** a viewport tem 390px de largura e o controle textual está em um campo de largura total
- **THEN** o controle permanece dentro do campo, sem causar rolagem horizontal na página

#### Scenario: Temas e estados

- **WHEN** o controle está nos temas claro ou escuro, ou em estado de erro, sucesso ou desabilitado
- **THEN** a largura ocupada é a mesma do estado padrão
