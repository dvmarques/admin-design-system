## MODIFIED Requirements

### Requirement: Documentação de APIs públicas

Cada componente público MUST possuir referência navegável no catálogo, incluindo propósito, propriedades e tipos, obrigatoriedade, valores padrão reais, variantes, estados suportados, requisitos de acessibilidade e exemplos executáveis. Informações não inferíveis automaticamente MUST ser complementadas explicitamente; tipos genéricos e partes compostas MUST preservar suas restrições de uso.

#### Scenario: Desenvolvedor consulta referência de componente simples

- **WHEN** o desenvolvedor abre a página de referência de um export público de UI
- **THEN** ele encontra propriedades com tipo, obrigatoriedade e valor padrão quando aplicável, além de descrição, variantes, estados, acessibilidade e exemplos funcionais

#### Scenario: Desenvolvedor consulta parte composta ou API genérica

- **WHEN** o desenvolvedor abre a referência de uma API composta ou genérica
- **THEN** a documentação explica o contexto necessário, o contrato genérico e os parâmetros que a inferência automática não descreve corretamente

#### Scenario: Novo export visual é integrado

- **WHEN** um export público de UI é acrescentado aos pacotes antes de publicar o catálogo
- **THEN** a validação exige sua referência de API ou uma exceção explícita, justificada e verificável, sem exigir componentes ainda planejados

### Requirement: Catálogo publicado com referência de API verificada

O catálogo MUST publicar páginas navegáveis de documentação de API e exemplos com temas claro e escuro, e validar sua existência e renderização a partir dos artefatos gerados, incluindo a publicação estática sob o subcaminho do GitHub Pages.

#### Scenario: Build do Storybook gera documentação de API

- **WHEN** o Storybook produz o build estático
- **THEN** a saída contém entradas de documentação e de stories para os exports de UI cobertos, detectadas a partir dos artefatos publicados e não apenas de tags no código-fonte

#### Scenario: Consumidor abre o catálogo publicado pelo Pages

- **WHEN** o consumidor visita `/admin-design-system/storybook/` e acessa a referência de um componente
- **THEN** a documentação, tabela de API, exemplos, navegação e temas claro/escuro carregam sem erro sob o subcaminho publicado
