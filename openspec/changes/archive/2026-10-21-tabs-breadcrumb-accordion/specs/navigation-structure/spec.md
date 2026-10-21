# Spec Delta

## ADDED Requirements

### Requirement: Tabs com ativação automática opcional

`AdsTabs` MUST suportar o modo de ativação `manual`, padrão, em que o foco só muda a tab ativa com Enter ou Space, e o modo `automatic`, em que mover o foco entre tabs elegíveis ativa a tab focalizada. O modo `manual` MUST preservar o comportamento anterior.

#### Scenario: Ativação automática

- **WHEN** o modo é `automatic` e o usuário move o foco com uma seta, Home ou End
- **THEN** a tab focalizada se torna a ativa e seu painel é apresentado

#### Scenario: Ativação manual por padrão

- **WHEN** nenhum modo é informado e o usuário move o foco com uma seta
- **THEN** a tab ativa não muda até Enter ou Space

### Requirement: Tabs em orientação vertical

`AdsTabs` MUST suportar a orientação `horizontal`, padrão, e `vertical`. A lista MUST expor a orientação configurada. Na orientação vertical, as setas para cima e para baixo MUST mover o foco entre tabs elegíveis e as setas horizontais MUST NOT movê-lo; Home e End MUST continuar valendo. Na vertical, a tab ativa MUST ser distinguível por indicador lateral e a lista MUST permanecer utilizável em largura reduzida.

#### Scenario: Navegação vertical

- **WHEN** a orientação é `vertical` e o usuário pressiona seta para baixo, seta para cima, Home ou End
- **THEN** o foco move para a tab elegível correspondente e as setas para a esquerda e para a direita não alteram o foco

#### Scenario: Orientação exposta

- **WHEN** a orientação é `vertical`
- **THEN** a lista de tabs é exposta como vertical a tecnologias assistivas

### Requirement: Painéis inativos de Tabs montados sob demanda

Por padrão, `AdsTabs` MUST manter somente o painel ativo no documento. A opção `keepMounted` MUST manter também os painéis inativos no documento, ocultos e fora da navegação por teclado, preservando o estado interno de seu conteúdo. A opção MUST poder ser definida na raiz e sobrescrita em cada painel.

#### Scenario: Padrão desmonta painéis inativos

- **WHEN** uma tab é ativada e depois outra
- **THEN** somente o painel da tab ativa existe no documento

#### Scenario: Painéis preservados

- **WHEN** `keepMounted` está ativo, um campo do painel inativo foi preenchido e a tab é reativada
- **THEN** o valor digitado foi preservado e, enquanto inativo, o painel não é anunciado nem focalizável

### Requirement: Tabs com identificadores válidos e parada de tabulação garantida

`AdsTabs` MUST gerar identificadores válidos e únicos para qualquer valor de tab, inclusive com espaços e caracteres especiais, de modo que valores distintos nunca colidam e a relação entre tab e painel permaneça correta. A lista MUST sempre ter exatamente uma tab tabulável quando houver ao menos uma tab habilitada, inclusive quando a tab ativa estiver desabilitada ou ausente.

#### Scenario: Valores com caracteres especiais

- **WHEN** duas tabs têm os valores `a b` e `a_b`
- **THEN** os identificadores são distintos e válidos e cada tab referencia o painel correto

#### Scenario: Tab ativa desabilitada

- **WHEN** a tab ativa está desabilitada
- **THEN** a primeira tab habilitada é a única na ordem de tabulação e pode receber o foco por Tab

### Requirement: Breadcrumb colapsável

`AdsBreadcrumb` MUST colapsar itens intermediários quando o número de itens excede `maxItems`, exibindo os primeiros itens, um botão de expansão e os últimos, e mantendo o item atual sempre visível. O botão MUST ter nome acessível sobrescrevível e MUST revelar todos os itens no lugar, sem perder o foco. Sem `maxItems`, a trilha MUST ser exibida por inteiro.

#### Scenario: Trilha longa colapsada

- **WHEN** uma trilha de seis itens é renderizada com `maxItems` igual a 4
- **THEN** são exibidos o primeiro item, o botão de expansão e os dois últimos, e o item atual continua com `aria-current="page"`

#### Scenario: Expandir a trilha

- **WHEN** o usuário ativa o botão de expansão
- **THEN** todos os itens são exibidos, o botão deixa de existir e o foco vai para o primeiro item revelado

#### Scenario: Trilha curta ou sem limite

- **WHEN** o número de itens não excede `maxItems` ou `maxItems` não é informado
- **THEN** todos os itens são exibidos e nenhum botão de expansão é renderizado

### Requirement: Separador do breadcrumb configurável

`AdsBreadcrumb` MUST aceitar um separador definido pelo consumidor, ignorado por tecnologias assistivas. Sem separador, MUST usar o padrão atual.

#### Scenario: Separador personalizado

- **WHEN** o consumidor define um separador
- **THEN** ele aparece entre os itens e não é anunciado por leitores de tela

### Requirement: Textos padrão de navegação sobrescrevíveis

Todo texto embutido em `AdsTabs`, `AdsBreadcrumb` e `AdsAccordion` MUST ter padrão em inglês e MUST poder ser sobrescrito por propriedade, prevalecendo sobre o padrão. Nenhum texto visível ou anunciado MUST depender de conteúdo gerado por CSS.

#### Scenario: Rótulos traduzidos pelo consumidor

- **WHEN** o consumidor informa o rótulo da navegação e o nome do botão de expansão do breadcrumb
- **THEN** esses valores substituem os padrões em inglês

#### Scenario: Padrão em inglês

- **WHEN** o consumidor não informa os rótulos
- **THEN** o breadcrumb expõe o nome `Breadcrumb` e o botão de expansão expõe o nome `Show full path`

### Requirement: Breadcrumb e nav compatíveis com Server Components

`AdsBreadcrumb` e `AdsNav` MUST poder ser renderizados em um Server Component, inclusive com itens que fornecem `renderLink`, sem exigir que a página declare `"use client"`. `AdsTabs` MUST funcionar quando importado por uma página Server Component, que compõe suas partes por exportações nomeadas (a notação `AdsTabs.List` só existe em Client Components), e todos MUST hidratar sem divergência.

#### Scenario: Breadcrumb com renderLink em Server Component

- **WHEN** uma página Server Component renderiza `AdsBreadcrumb` com itens que usam `renderLink`
- **THEN** a página renderiza sem erro de serialização e os links preservam o estilo e o foco do breadcrumb

#### Scenario: Tabs importado por Server Component

- **WHEN** uma página Server Component compõe `AdsTabs` com as partes de lista, tab e painel importadas pelo caminho público
- **THEN** o componente renderiza no servidor e hidrata sem aviso de divergência
