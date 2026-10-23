# Catálogo de componentes

## ADDED Requirements

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

Cada demonstração SHALL fornecer descrição, exemplos funcionais e variações pertinentes, incluindo código TSX copiável quando viável.

#### Scenario: Interação

- **WHEN** a pessoa interage por teclado com um controle demonstrado
- **THEN** seu estado é atualizado e a indicação de foco permanece perceptível

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
