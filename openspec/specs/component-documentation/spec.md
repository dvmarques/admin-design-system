# component-documentation Specification

## Purpose

Assegurar que cada API pública do design system possua documentação navegável, exemplos executáveis e orientação suficiente para adoção consistente.

## Requirements

### Requirement: Documentação de APIs públicas

Cada componente público MUST possuir referência navegável no catálogo, incluindo propósito, propriedades e tipos, obrigatoriedade, valores padrão reais, variantes, estados suportados, requisitos de acessibilidade e exemplos executáveis. Informações não inferíveis automaticamente MUST ser complementadas explicitamente; tipos genéricos e partes compostas MUST preservar suas restrições de uso.

#### Scenario: Desenvolvedor consulta um componente

- **WHEN** o desenvolvedor abre a documentação do componente
- **THEN** ele encontra a API pública e as orientações necessárias para o uso básico

#### Scenario: Desenvolvedor consulta referência de componente simples

- **WHEN** o desenvolvedor abre a página de referência de um export público de UI
- **THEN** ele encontra propriedades com tipo, obrigatoriedade e valor padrão quando aplicável, além de descrição, variantes, estados, acessibilidade e exemplos funcionais

#### Scenario: Desenvolvedor consulta parte composta ou API genérica

- **WHEN** o desenvolvedor abre a referência de uma API composta ou genérica
- **THEN** a documentação explica o contexto necessário, o contrato genérico e os parâmetros que a inferência automática não descreve corretamente

#### Scenario: Novo export visual é integrado

- **WHEN** um export público de UI é acrescentado aos pacotes antes de publicar o catálogo
- **THEN** a validação exige sua referência de API ou uma exceção explícita, justificada e verificável, sem exigir componentes ainda planejados

### Requirement: Exemplos visuais executáveis

Cada componente público MUST possuir exemplos executáveis no catálogo visual para seus estados e variantes relevantes.

#### Scenario: Componente possui variantes

- **WHEN** um componente oferece mais de uma variante pública
- **THEN** o catálogo apresenta exemplos que permitem comparar visualmente essas variantes

### Requirement: Cobertura dos temas

Os exemplos visuais MUST permitir verificar o componente nos temas claro e escuro.

#### Scenario: Tema do catálogo é alternado

- **WHEN** o usuário alterna o tema no catálogo
- **THEN** o exemplo ativo é renderizado com os tokens do tema selecionado

### Requirement: Exemplos de estados não ideais

Componentes que suportam estados como desabilitado, carregamento, erro ou vazio MUST documentar e demonstrar os estados aplicáveis.

#### Scenario: Componente suporta estado desabilitado

- **WHEN** o desenvolvedor consulta os exemplos do componente
- **THEN** existe um exemplo que demonstra sua aparência e comportamento desabilitado

### Requirement: Documentação de integração

O catálogo MUST documentar como instalar os pacotes, importar estilos, aplicar temas e consumir a biblioteca em uma aplicação Next.js.

#### Scenario: Novo consumidor inicia a integração

- **WHEN** um desenvolvedor segue a documentação publicada
- **THEN** ele consegue renderizar um exemplo usando apenas pontos de entrada públicos

### Requirement: Histórias atualizadas para a fundação visual

O catálogo visual MUST atualizar as histórias dos componentes existentes afetados para demonstrar a tipografia, os papéis de cor e os estados semânticos revisados, sem introduzir componentes novos.

#### Scenario: Desenvolvedor revisa um componente existente no catálogo

- **WHEN** o desenvolvedor abre uma história afetada pela fundação visual
- **THEN** ele pode verificar seus estados representativos nos temas claro e escuro com os tokens revisados

### Requirement: Catálogo demonstra overlays e controles de fechar nos dois temas

As histórias de dialog, drawer e toast MUST permitir verificar a superfície da caixa e os estados padrão, hover e foco do controle de fechar nos temas claro e escuro.

#### Scenario: Desenvolvedor alterna o tema de uma história de overlay

- **WHEN** o tema da história muda entre claro e escuro com o overlay aberto
- **THEN** a caixa e o controle de fechar refletem imediatamente o novo tema com contraste verificável

### Requirement: Orientação para botões e campos na mesma linha

A documentação de integração MUST informar que botões e campos de mesmo `size` têm alturas diferentes, indicar essas alturas por tamanho e orientar como alinhá-los quando posicionados na mesma linha, inclusive como usar um ou mais botões no adendo de um grupo de entrada e o limite do conteúdo misto de texto e botão.

#### Scenario: Consumidor posiciona um botão ao lado de um campo

- **WHEN** um desenvolvedor consulta a documentação para colocar um `AdsButton` ao lado de um `AdsInput` na mesma linha
- **THEN** ele encontra as alturas de botão e de campo por tamanho e a orientação para alinhar os dois, sem depender de inspeção do CSS

#### Scenario: Consumidor considera um botão no adendo do grupo de entrada

- **WHEN** um desenvolvedor considera usar um ou mais botões como conteúdo inicial ou final de um grupo de entrada
- **THEN** a documentação informa que os botões acompanham a altura do campo e ficam contíguos a ele, que o adendo deve conter só botões como filhos diretos e que o `size` do botão não altera a altura do grupo

#### Scenario: Consumidor considera texto e botão no mesmo adendo

- **WHEN** um desenvolvedor considera colocar texto e botão no mesmo adendo
- **THEN** a documentação informa que isso não é suportado e indica a alternativa de usar um adendo de texto de um lado e o botão do outro

### Requirement: Catálogo publicado com referência de API verificada

O catálogo MUST publicar páginas navegáveis de documentação de API e exemplos com temas claro e escuro, e validar sua existência e renderização a partir dos artefatos gerados, incluindo a publicação estática sob o subcaminho do GitHub Pages.

#### Scenario: Build do Storybook gera documentação de API

- **WHEN** o Storybook produz o build estático
- **THEN** a saída contém entradas de documentação e de stories para os exports de UI cobertos, detectadas a partir dos artefatos publicados e não apenas de tags no código-fonte

#### Scenario: Consumidor abre o catálogo publicado pelo Pages

- **WHEN** o consumidor visita `/admin-design-system/storybook/` e acessa a referência de um componente
- **THEN** a documentação, tabela de API, exemplos, navegação e temas claro/escuro carregam sem erro sob o subcaminho publicado
