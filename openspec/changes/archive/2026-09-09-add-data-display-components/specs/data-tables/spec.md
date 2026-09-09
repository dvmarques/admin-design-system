## Purpose

Fornece tabelas acessíveis, tematizáveis e composicionais para apresentação de dados administrativos sem acoplamento a uma engine de dados.

## ADDED Requirements

### Requirement: Tabelas preservam semântica nativa

O sistema MUST fornecer `AdsTable` para apresentar dados tabulares usando estrutura HTML tabular válida. Cabeçalhos MUST poder identificar seu escopo ou associação, linhas e células MUST aceitar conteúdo composicional e a API MUST permitir atributos HTML apropriados sem exigir uma biblioteca de dados externa.

#### Scenario: Cabeçalhos são interpretáveis por tecnologia assistiva

- **WHEN** o consumidor renderiza colunas com cabeçalhos e linhas de dados
- **THEN** a tabela mantém estrutura semântica que permite associar cabeçalhos às células correspondentes

#### Scenario: Conteúdo customizado permanece válido

- **WHEN** uma célula contém badge, link, botão ou outro componente público
- **THEN** o conteúdo permanece operável sem quebrar a semântica tabular

### Requirement: Tabela suporta apresentação administrativa responsiva

`AdsTable` MUST oferecer estilos de cabeçalho, corpo, divisores, alinhamento e estados visuais não interativos de linha usando tokens públicos nos temas claro e escuro. Quando as colunas excederem a largura disponível, a estrutura tabular MUST ser preservada e todo o conteúdo MUST permanecer acessível por deslocamento horizontal em um container apropriado. O componente MUST NOT ocultar colunas automaticamente nem transformar a tabela em outra estrutura visual que descaracterize sua semântica.

#### Scenario: Tabela excede a largura disponível

- **WHEN** as colunas excedem a largura do container
- **THEN** o usuário consegue acessar horizontalmente todas as colunas sem perda de células e a marcação continua semanticamente tabular

### Requirement: Componente não assume lógica de dados

`AdsTable` MUST NOT buscar, ordenar, filtrar, paginar, virtualizar, selecionar ou editar dados por conta própria. O consumidor MUST poder combinar a tabela com `AdsPagination`, `AdsProgress`, `AdsEmptyState` ou lógica externa sem acoplamento interno entre esses recursos.

#### Scenario: Consumidor controla ordenação externamente

- **WHEN** uma aplicação adiciona um botão de ordenação em um cabeçalho e reorganiza seus próprios dados
- **THEN** `AdsTable` apenas apresenta a nova ordem recebida e não mantém estado de sorting interno
