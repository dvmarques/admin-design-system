## ADDED Requirements

### Requirement: Cores independentes do Admin Shell por CSS com fallback dinâmico

O Admin Shell MUST permitir sobrescrever cores da sidebar e do header por variáveis CSS públicas específicas, sem mudar tokens globais, props, DOM ou necessidade de recompilação. A ausência de cada override MUST resolver para a mesma variável semântica global utilizada antes da mudança, inclusive nos dois temas e em alto contraste. A variável `--ads-sidebar-active-background` existente MUST continuar funcionando com seu fallback anterior.

#### Scenario: Nenhum override

- **WHEN** uma aplicação importa o CSS do Admin DS sem sobrescritas específicas
- **THEN** sidebar, cabeçalho, navegação, foco, hover, ativo e cores dos textos são cromaticamente idênticos à versão anterior, em light, dark, system, expansão, recolhimento e mobile

#### Scenario: Alteração global continua sendo herdada

- **WHEN** o consumidor altera `--ads-color-surface-raised` e não fornece `--ads-sidebar-background`
- **THEN** a sidebar acompanha o novo valor, sem necessitar recompilar o pacote

#### Scenario: Override específico preserva o restante

- **WHEN** o consumidor fornece `--ads-sidebar-background` e `--ads-sidebar-active-background` apenas no tema claro
- **THEN** somente as superfícies correspondentes da sidebar clara mudam, sem mudar header principal, conteúdo, cards, campos, overlays ou o tema escuro

#### Scenario: Header principal customizado independentemente

- **WHEN** o consumidor define `--ads-header-background`, `--ads-header-border` ou `--ads-header-text`
- **THEN** apenas os papéis correspondentes do header principal são afetados

#### Scenario: Navegação e cabeçalho da sidebar

- **WHEN** o consumidor configura papéis específicos para hover, texto, texto atenuado, seleção, marcador, borda e fundo do cabeçalho
- **THEN** esses estilos usam o override nos estados e variantes relevantes, preservando focos, legibilidade do padrão e contratos ARIA

#### Scenario: Compatibilidade e documentação

- **WHEN** um consumidor usa `--ads-sidebar-active-background` existente ou segue a documentação de tokens públicos
- **THEN** ambos continuam válidos, e os novos nomes, fallback e responsabilidades de contraste estão documentados
