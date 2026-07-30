# form-field-composition Specification

## Purpose

Oferecer composição semântica de campos para associar controles, rótulos e mensagens de ajuda ou validação sem duplicar lógica em cada aplicação.

## Requirements

### Requirement: Composição de campo acessível

O sistema MUST exportar componentes públicos prefixados por `Ads` para compor um campo com rótulo, descrição e mensagem de validação, associando essas informações ao controle correspondente por identificadores acessíveis.

#### Scenario: Campo possui rótulo e descrição

- **WHEN** uma aplicação compõe um controle com rótulo e descrição
- **THEN** o rótulo identifica o controle e a descrição fica disponível como orientação associada ao campo

#### Scenario: Campo exibe mensagem de erro

- **WHEN** uma aplicação apresenta uma mensagem de erro para um campo inválido
- **THEN** o controle é identificado como inválido e a mensagem é associada ao campo de forma disponível para tecnologias assistivas

### Requirement: Grupos de entrada e seleção

O sistema MUST oferecer composição pública para grupos de entrada e grupos de seleção relacionados, preservando a semântica e o nome acessível coletivo quando houver mais de uma opção.

#### Scenario: Aplicação agrupa opções relacionadas

- **WHEN** uma aplicação agrupa opções de checkbox ou radio sob um rótulo comum
- **THEN** tecnologias assistivas conseguem identificar o conjunto e seu rótulo antes de interagir com as opções

#### Scenario: Aplicação adiciona conteúdo adjacente ao input

- **WHEN** uma aplicação usa um grupo de entrada com conteúdo antes ou depois de um controle textual
- **THEN** o conteúdo complementar é apresentado sem alterar o nome, o valor ou a operação nativa do controle

### Requirement: Consistência visual da composição

Os componentes de composição MUST espaçar, alinhar e estilizar rótulos, controles e mensagens com tokens semânticos nos temas claro e escuro, permitindo uma `className` segura nos seus elementos públicos.

#### Scenario: Campo alterna entre estados de validação

- **WHEN** uma aplicação altera um campo entre os estados normal, sucesso e erro
- **THEN** a composição apresenta a mensagem e o estado correspondentes de modo consistente, sem modificar dados do campo
