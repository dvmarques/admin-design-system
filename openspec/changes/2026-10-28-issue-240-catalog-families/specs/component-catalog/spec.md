# Catálogo de componentes — delta da issue #240

## ADDED Requirements

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
