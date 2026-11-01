# site-publishing Specification

## Purpose

Definir a publicação gratuita do demo e do catálogo Storybook como um único site estático, com endereços estáveis, links entre as partes e referência no README, sem exigir servidor.

## Requirements

### Requirement: Site único com demo e Storybook

O site publicado MUST servir o demo na raiz do endereço do projeto e o Storybook no subcaminho `/storybook/`, ambos como conteúdo estático.

#### Scenario: Pessoa abre a raiz do site

- **WHEN** uma pessoa abre o endereço do projeto no GitHub Pages
- **THEN** a visão geral do demo é exibida com estilos e navegação funcionando

#### Scenario: Pessoa abre o Storybook

- **WHEN** uma pessoa abre `/storybook/` no endereço do projeto
- **THEN** o catálogo de componentes é carregado e permite navegar pelas stories

### Requirement: Navegação do demo sob subcaminho

O demo publicado MUST manter funcionais todos os links internos, estilos e recursos quando servido sob o subcaminho do repositório.

#### Scenario: Navegação entre rotas

- **WHEN** uma pessoa ativa um item da navegação principal do demo publicado
- **THEN** a rota correspondente abre sob o mesmo subcaminho, sem erro de página não encontrada

#### Scenario: Recarregar uma rota interna

- **WHEN** uma pessoa abre diretamente o endereço de uma rota interna, como a de clientes
- **THEN** a rota é exibida normalmente

### Requirement: Publicação automática e reproduzível

O workflow de publicação MUST gerar demo e Storybook a partir do mesmo commit e só publicar o site quando ambos forem construídos com sucesso.

#### Scenario: Build bem-sucedido

- **WHEN** o ramo de publicação recebe um novo commit e os dois builds concluem
- **THEN** o site é atualizado com o demo e o Storybook desse commit

#### Scenario: Falha em um dos builds

- **WHEN** o build do demo ou o do Storybook falha
- **THEN** nada é publicado e o site anterior permanece disponível

### Requirement: Link do demo para o Storybook

O demo publicado MUST oferecer na navegação principal um link com nome acessível para o Storybook, e esse link MUST NOT aparecer quando o endereço do catálogo não estiver configurado.

#### Scenario: Link no site publicado

- **WHEN** uma pessoa usa o teclado na navegação principal do demo publicado, expandida, recolhida ou móvel
- **THEN** o link para o Storybook recebe foco visível, tem nome acessível que indica que abre em nova aba e leva ao catálogo

#### Scenario: Ambiente local

- **WHEN** o demo roda em desenvolvimento ou nos testes E2E, sem o endereço do catálogo configurado
- **THEN** nenhum link para o Storybook é exibido

### Requirement: README aponta para o site publicado

O `README.md` MUST apresentar os links do site demonstrativo e do Storybook publicados.

#### Scenario: Pessoa lê o README

- **WHEN** uma pessoa abre o `README.md` na página do repositório
- **THEN** ela encontra os links para o demo e para o Storybook publicados

### Requirement: Tema legível no site estático

O demo publicado MUST aplicar o tema escolhido pela pessoa sem exibir o tema errado de forma perceptível ao carregar uma rota.

#### Scenario: Tema escuro persistido

- **WHEN** uma pessoa que escolheu o tema escuro abre uma rota do demo publicado
- **THEN** a página é exibida no tema escuro, sem alternar visivelmente a partir do tema claro e sem erro de hidratação

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
