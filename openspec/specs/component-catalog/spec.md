# Catálogo de componentes

## Purpose

Definir o catálogo navegável da aplicação de demonstração, sua cobertura de componentes públicos e a navegação hierárquica reutilizável e acessível da sidebar.

## Requirements

### Requirement: Índice pesquisável

O admin demo SHALL apresentar um índice de componentes públicos por categoria, com pesquisa sem diferenciar maiúsculas de minúsculas e links estáveis.

#### Scenario: Busca por nome

- **WHEN** a pessoa pesquisa o nome de um componente público
- **THEN** o catálogo mostra um link para sua demonstração ou um estado vazio acessível quando não há resultados

### Requirement: Cobertura integral rastreável

O catálogo SHALL demonstrar todos os exports públicos visuais existentes, inclusive subcomponentes, e documentar exclusões de utilitários sem interface.

#### Scenario: Novo componente sem exemplo

- **WHEN** um export público visual é acrescentado sem mapeamento
- **THEN** a verificação automatizada de cobertura falha

### Requirement: Exemplos interativos

Cada demonstração SHALL fornecer descrição, exemplos funcionais e variações pertinentes, incluindo código TSX copiável quando viável. O bloco de código do preview MUST usar `AdsHighlightedCodeSnippet` do pacote `@admin-ds/highlighted-code`, preservando a geração automática de snippets e a ação de copiar o código original.

#### Scenario: Interação

- **WHEN** a pessoa interage por teclado com um controle demonstrado
- **THEN** seu estado é atualizado e a indicação de foco permanece perceptível

#### Scenario: Código destacado no catálogo

- **WHEN** a pessoa abre uma página de demonstração no catálogo
- **THEN** o snippet TSX gerado automaticamente é exibido com highlighting assíncrono e permanece copiável integralmente

### Requirement: Navegação responsiva

A navegação SHALL agrupar categorias, indicar página ativa, funcionar em dispositivos móveis e permitir inspecionar os temas claro e escuro sem overflow horizontal.

#### Scenario: Viewport estreita

- **WHEN** o catálogo é acessado em largura de celular
- **THEN** a navegação e os exemplos continuam utilizáveis sem recorte de controles

#### Scenario: Expansão preservada entre rotas

- **WHEN** a pessoa expande ou recolhe grupos da sidebar e navega para outra rota
- **THEN** os grupos preservam suas escolhas de expansão e o grupo da página de destino é aberto para expor o item ativo, sem remontar os demais grupos

### Requirement: Preservação dos exemplos de aplicação

As páginas de negócio existentes SHALL permanecer acessíveis por suas rotas atuais ou redirecionamentos equivalentes.

#### Scenario: Rota existente

- **WHEN** uma pessoa abre um URL de exemplo de negócio existente
- **THEN** a demonstração correspondente permanece acessível

### Requirement: Hierarquia visual reutilizável da sidebar

A navegação SHALL diferenciar títulos de seção não interativos, grupos expansíveis e links recuados, preservando identidade visual e nomes acessíveis. O pacote admin SHALL oferecer essa composição como partes públicas de AdsAdminShell, sem dependência de roteador.

#### Scenario: Exploração das categorias

- **WHEN** a pessoa acessa o catálogo
- **THEN** Visão geral e Catálogo são links diretos, os títulos organizam componentes, composições administrativas e exemplos de aplicação, e os grupos exibem ícones e indicadores de expansão à direita

#### Scenario: Grupo no desktop recolhido

- **WHEN** a pessoa ativa por mouse ou teclado um grupo da sidebar recolhida
- **THEN** a sidebar expande e os links do grupo ficam disponíveis, mantendo o foco no controle acionado

#### Scenario: Seções nomeadas e categorias distinguíveis

- **WHEN** a pessoa explora as seções com tecnologia assistiva ou recolhe a sidebar no desktop
- **THEN** cada seção associa seu nome ao conteúdo e cada destino visível no modo recolhido possui ícone ou iniciais distintos, preservando seu nome acessível completo

### Requirement: Ordem alfabética dentro dos grupos da navegação

A sidebar do catálogo SHALL ordenar alfabeticamente os nomes dos itens de cada grupo de componentes e composições administrativas, preservando a ordem dos grupos.

#### Scenario: Navegação por categoria

- **WHEN** uma pessoa expande um grupo da sidebar
- **THEN** encontra os itens em ordem alfabética pelo nome exibido e os grupos permanecem na ordem definida

### Requirement: Descoberta de componentes de pacotes opcionais

O catálogo MUST incluir componentes públicos visuais distribuídos em pacotes opcionais explicitamente suportados, sem exigir que sejam reexportados pelo pacote principal. O índice, a sidebar, a documentação e o teste de cobertura MUST distinguir componentes de utilitários e tipos sem interface.

#### Scenario: Busca por HighlightedCodeSnippet

- **WHEN** a pessoa pesquisa AdsHighlightedCodeSnippet, HighlightedCode, CodeSnippet ou Código destacado no catálogo
- **THEN** encontra o componente visual AdsHighlightedCodeSnippet na categoria Dados com acesso à página /catalogo/highlighted-code-snippet

#### Scenario: Pacote opcional não entra no bundle principal

- **WHEN** uma aplicação consome apenas @admin-ds/components e seu CSS público
- **THEN** Shiki e @admin-ds/highlighted-code não são carregados em decorrência do registro no catálogo

#### Scenario: Export opcional fica sem exemplo

- **WHEN** um novo export visual do pacote opcional explicitamente incluído na cobertura não tem página e demo executável
- **THEN** a verificação de cobertura do catálogo falha com identificação do export ausente

### Requirement: Documentação e demonstração do código destacado

A página canônica de AdsHighlightedCodeSnippet MUST documentar instalação do pacote opcional, API e props reais e MUST fornecer exemplos interativos de highlighting, temas, linhas, wrap, copiar e fallback, preservando a página preexistente de exemplo de aplicação.

#### Scenario: Pessoa experimenta variantes

- **WHEN** a pessoa altera linguagem, tema, exibição de linhas ou wrap nos exemplos
- **THEN** a demonstração atualiza o snippet, preservando código original copiável e feedback acessível nos temas claro e escuro

#### Scenario: Linguagem desconhecida

- **WHEN** a pessoa seleciona uma linguagem não suportada no exemplo
- **THEN** o código permanece legível e copiável em plain, sem erro fatal ou execução de markup

#### Scenario: Retorno ao exemplo antigo

- **WHEN** a pessoa abre /exemplos/codigo-destacado no site estático
- **THEN** o exemplo existente continua funcional e oferece navegação para a nova documentação oficial

#### Scenario: Uso em viewport estreita

- **WHEN** a demonstração é acessada em largura de celular ou por teclado
- **THEN** o código longo dispõe de rolagem local ou wrap, os controles e a ação de copiar continuam utilizáveis e a página não apresenta overflow horizontal

### Requirement: Páginas canônicas por família de composição

O catálogo MUST apresentar uma única entrada por família de composição na sidebar e MUST documentar todos os seus membros públicos na página canônica, preservando páginas próprias para componentes independentes. O agrupamento MUST corresponder às APIs reais; um exemplo de uso conjunto MUST NOT transformar exports independentes em partes obrigatórias.

#### Scenario: Pessoa navega pelas abas

- **WHEN** a pessoa expande Navegação na sidebar do catálogo
- **THEN** encontra uma entrada Tabs, sem links isolados para TabsList, TabsTrigger e TabsPanel, e a página Tabs lista e documenta explicitamente esses quatro nomes públicos

#### Scenario: Pessoa explora uma composição independente

- **WHEN** a pessoa acessa o grupo Dashboard ou usa um InputGroup
- **THEN** a documentação informa quais elementos são reutilizáveis independentemente e mantém páginas próprias para controles que não são partes da mesma API

### Requirement: Busca individual de membros de famílias

O índice MUST permitir pesquisar o nome exato de todo export público visual e das partes realmente oferecidas por uma API composta, retornando resultado com indicação da família e destino na seção correspondente da página canônica.

#### Scenario: Busca por TabsTrigger

- **WHEN** a pessoa pesquisa TabsTrigger, com ou sem prefixo Ads
- **THEN** o resultado identifica TabsTrigger como parte de Tabs e abre diretamente sua seção documentada

#### Scenario: Busca por parte exposta por propriedade

- **WHEN** a pessoa pesquisa Dropdown.Trigger ou AdminShell.NavigationItem
- **THEN** encontra essa parte como alias da API pública real, sem alegar que exista um export nomeado adicional

#### Scenario: Resultado vazio

- **WHEN** não há membro com nome ou descrição correspondente à busca
- **THEN** um estado vazio acessível é apresentado, sem resultados falsos

### Requirement: Nomes completos e links diretos em páginas de famílias

Cada página familiar MUST listar todos os membros pelo nome técnico exato no início e MUST manter um heading e uma âncora estável para seção com função, propriedades relevantes e exemplo de uso de cada membro.

#### Scenario: Acesso direto a uma seção

- **WHEN** a pessoa abre um link com âncora para AdsTableCaption em tela estreita
- **THEN** chega à seção AdsTableCaption, com heading legível, link estável e conteúdo utilizável por teclado nos temas claro e escuro

### Requirement: Compatibilidade de URLs e cobertura de exports

O catálogo MUST preservar acesso a slugs antigos dos exports públicos em geração estática, mesmo após consolidar as páginas, e MUST manter cobertura verificável de todos os exports visuais independentemente do número de páginas.

#### Scenario: Deep link legado no GitHub Pages

- **WHEN** uma pessoa abre ou recarrega diretamente um antigo slug de subcomponente no site estático
- **THEN** encontra a documentação da família/seção correspondente ou um alias navegável sem 404, inclusive sem JavaScript

#### Scenario: Export sem documentação individual

- **WHEN** um export visual deixa de ter mapeamento para família, seção ou exemplo executável
- **THEN** o teste automatizado de cobertura falha em vez de aceitar uma página familiar genérica
