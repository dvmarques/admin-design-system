## MODIFIED Requirements

### Requirement: Link do demo para o Storybook

O demo publicado MUST oferecer na navegação principal um link com nome acessível para o Storybook, e esse link MUST NOT aparecer quando o endereço do catálogo não estiver configurado.

#### Scenario: Link no site publicado

- **WHEN** uma pessoa usa o teclado na navegação principal do demo publicado, expandida, recolhida ou móvel
- **THEN** o link para o Storybook recebe foco visível, tem nome acessível que indica que abre em nova aba e leva ao catálogo

#### Scenario: Ambiente local

- **WHEN** o demo roda em desenvolvimento ou nos testes E2E, sem o endereço do catálogo configurado
- **THEN** nenhum link para o Storybook é exibido

### Requirement: Marca resolve sob o subcaminho do site

O site publicado MUST carregar o logotipo visível do demo e os favicons do demo e do Storybook sob o subcaminho do repositório, sem requisições a caminhos da raiz do domínio e sem respostas de erro. O Storybook MUST resolver seu favicon sob `/storybook/`, tanto no manager quanto no iframe de preview.

#### Scenario: Logotipo do cabeçalho no site publicado

- **WHEN** uma pessoa abre o demo publicado sob o subcaminho do projeto
- **THEN** o logotipo do cabeçalho é carregado a partir do subcaminho e é exibido

#### Scenario: Logotipo responsivo no site publicado

- **WHEN** uma pessoa abre o demo publicado em desktop expandido ou recolhido, ou em celular com menu fechado ou aberto, nos temas claro e escuro
- **THEN** o logotipo visível é carregado a partir do subcaminho e é exibido na região correspondente

#### Scenario: Favicon do Storybook no site publicado

- **WHEN** uma pessoa abre o manager ou o iframe de preview do Storybook publicado
- **THEN** o favicon é carregado a partir de `/storybook/`, sem resposta de erro

## ADDED Requirements

### Requirement: Validação do site antes do merge

PRs não Draft para develop MUST executar o build estático e a suíte Pages em Linux, sem configurar, enviar artefatos ou publicar no Pages. A publicação MUST ocorrer somente a partir de develop fora de eventos de PR, após o build e os testes aprovarem.

#### Scenario: PR pronta para revisão

- **WHEN** uma PR para develop é aberta, atualizada, reaberta ou marcada Ready for review sem estar em Draft
- **THEN** o site é construído e testado sob o subcaminho no Linux, sem executar etapas de publicação

#### Scenario: PR em Draft

- **WHEN** uma PR permanece em Draft
- **THEN** o job Pages é pulado sem comprovar validação e nenhuma publicação ocorre

#### Scenario: Branch distinta de develop

- **WHEN** o workflow é disparado manualmente em outra branch
- **THEN** somente build e testes executam, sem configurar, enviar artefatos ou publicar no Pages
