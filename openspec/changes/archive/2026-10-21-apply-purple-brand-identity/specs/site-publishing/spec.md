# Spec Delta

## ADDED Requirements

### Requirement: Marca resolve sob o subcaminho do site

O site publicado MUST carregar o logotipo do cabeçalho do demo e os favicons do demo e do Storybook sob o subcaminho do repositório, sem requisições a caminhos da raiz do domínio e sem respostas de erro. O Storybook MUST resolver seu favicon sob `/storybook/`, tanto no manager quanto no iframe de preview.

#### Scenario: Logotipo do cabeçalho no site publicado

- **WHEN** uma pessoa abre o demo publicado sob o subcaminho do projeto
- **THEN** o logotipo do cabeçalho é carregado a partir do subcaminho e é exibido

#### Scenario: Favicon do Storybook no site publicado

- **WHEN** uma pessoa abre o manager ou o iframe de preview do Storybook publicado
- **THEN** o favicon é carregado a partir de `/storybook/`, sem resposta de erro
