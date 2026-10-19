# design-tokens Specification

## Purpose

Definir uma linguagem visual semântica, estável e personalizável para que componentes e aplicações consumidoras compartilhem as mesmas decisões de aparência.

## Requirements

### Requirement: Categorias mínimas de tokens

O sistema MUST disponibilizar tokens semânticos para cores, tipografia, espaçamento, dimensões, bordas, raios, elevação, opacidade e movimento.

#### Scenario: Aplicação consome as categorias de tokens

- **WHEN** uma aplicação importa os tokens públicos do design system
- **THEN** todas as categorias mínimas estão disponíveis sem importar módulos internos

### Requirement: Formatos públicos de distribuição

O sistema MUST expor os tokens como variáveis CSS e como metadados TypeScript tipados, mantendo nomes semânticos equivalentes entre os formatos.

#### Scenario: Consumidor utiliza tokens no CSS

- **WHEN** uma aplicação importa a folha de estilos pública de tokens
- **THEN** os tokens ficam disponíveis como variáveis CSS no escopo documentado

#### Scenario: Consumidor utiliza metadados em TypeScript

- **WHEN** uma aplicação importa os metadados públicos de tokens
- **THEN** ela recebe valores e nomes com tipos TypeScript sem acessar arquivos-fonte

### Requirement: Personalização por sobrescrita

O sistema MUST permitir que aplicações consumidoras personalizem tokens semânticos suportados por meio de variáveis CSS, sem alterar ou recompilar os componentes.

#### Scenario: Aplicação personaliza a cor primária

- **WHEN** a aplicação sobrescreve o token semântico de cor primária no escopo documentado
- **THEN** os componentes que usam esse token refletem o novo valor

### Requirement: Estabilidade dos nomes públicos

O sistema MUST tratar a remoção ou renomeação de tokens públicos como alteração incompatível da API.

#### Scenario: Token público é substituído

- **WHEN** uma versão futura substitui um token público
- **THEN** a mudança é registrada com orientação de migração e versionada de acordo com a política de compatibilidade

### Requirement: Tokens visuais globais coerentes

O sistema MUST disponibilizar tokens semânticos públicos que expressem a fundação visual revisada para tipografia, paleta de temas, estados e foco, com nomes estáveis e equivalentes nos formatos CSS e TypeScript.

#### Scenario: Componente consome a fundação global

- **WHEN** um componente existente é renderizado usando os estilos públicos da biblioteca
- **THEN** sua tipografia, cores e estados visuais usam tokens globais semânticos em vez de valores específicos do componente

#### Scenario: Consumidor personaliza um papel visual

- **WHEN** uma aplicação sobrescreve um token semântico suportado para um tema
- **THEN** os componentes existentes que consomem esse papel refletem o novo valor sem recompilação da biblioteca

### Requirement: Densidade e forma compartilhadas

O sistema MUST disponibilizar tokens reutilizáveis para controles pequenos, médios e grandes de `32 px`, `36 px` e `40 px`, respectivamente; também MUST disponibilizar raio de `6 px` para controles e de `8 px` para superfícies e overlays.

#### Scenario: Componente existente expõe um tamanho

- **WHEN** um componente interativo existente renderiza uma variante pequena, média ou grande
- **THEN** ele consome a dimensão compartilhada correspondente em vez de definir uma altura local

### Requirement: Controle de fechar usa papéis semânticos de cor

O sistema MUST disponibilizar tokens semânticos de fundo, conteúdo e fundo de hover para os controles de fechar de overlays, com valores específicos para os temas claro e escuro e equivalência entre CSS e TypeScript.

#### Scenario: Controle de fechar é renderizado em um overlay

- **WHEN** dialog, drawer ou toast apresenta seu controle de fechar
- **THEN** o fundo e o ícone são resolvidos pelos papéis semânticos do tema ativo, sem valores cromáticos locais no componente

### Requirement: Papéis de interação, elevação e camada são explícitos

O sistema MUST disponibilizar tokens semânticos aditivos para superfície de hover, superfície selecionada, borda forte, anel e offset de foco, hover de ações, três níveis de elevação e camadas de overlay. Os tokens MUST ter valores nos dois temas e preservar a possibilidade de sobrescrita por variáveis CSS.

#### Scenario: Consumidor personaliza o foco

- **WHEN** uma aplicação sobrescreve os tokens de anel e offset de foco
- **THEN** os componentes que recebem foco visível refletem a personalização sem exigir mudanças nas classes dos componentes

### Requirement: Conteúdo de superfície selecionada é personalizável

O sistema MUST disponibilizar um token semântico público de conteúdo sobre
superfície selecionada, com valores nos temas claro e escuro e equivalência
entre variáveis CSS e metadados TypeScript. Componentes que apresentam uma
superfície selecionada MUST usar esse papel para o conteúdo textual.

#### Scenario: Consumidor personaliza uma superfície selecionada

- **WHEN** uma aplicação sobrescreve os tokens de superfície e conteúdo
  selecionados em seu tema
- **THEN** os destinos e tabs selecionados preservam a associação entre fundo e
  conteúdo sem recompilar a biblioteca

### Requirement: Tokens de movimento respeitam a preferência de movimento

Os tokens públicos de duração de movimento MUST resolver para duração zero quando o usuário prefere movimento reduzido, de forma que todo componente que os consome elimine suas transições sem configuração adicional.

#### Scenario: Componente consome o token de movimento

- **WHEN** um componente usa o token de duração e o usuário prefere movimento reduzido
- **THEN** a duração efetiva da transição é zero

#### Scenario: Aplicação personaliza a duração

- **WHEN** a aplicação sobrescreve a duração de movimento apenas quando o usuário não prefere movimento reduzido
- **THEN** a duração personalizada vale sem movimento reduzido e continua zero com `prefers-reduced-motion: reduce`

### Requirement: Sobrescritas de contraste são distribuídas com os tokens

O pacote de tokens MUST distribuir sobrescritas dos papéis de cor para `prefers-contrast: more` nos dois temas, mantendo os nomes públicos existentes e sem exigir que a aplicação importe arquivos adicionais.

#### Scenario: Consumidor importa os estilos de tokens

- **WHEN** a aplicação importa `@admin-ds/tokens/styles.css` e o usuário prefere maior contraste
- **THEN** os papéis de borda, texto secundário e foco assumem valores de maior contraste no tema ativo

### Requirement: Borda de controle e borda decorativa são papéis distintos

O sistema MUST disponibilizar um token semântico público de borda de controle
(`borderControl`) para limites de controles interativos e indicadores de seleção
que exigem contraste mínimo de 3:1 contra os fundos aplicáveis. O papel `border`
MUST permanecer para divisões e contornos decorativos, sem esse requisito de
contraste não textual.

#### Scenario: Papéis de borda estão disponíveis nos formatos públicos

- **WHEN** uma aplicação importa os tokens de cor públicos
- **THEN** `borderControl` e `border` são papéis distintos nos dois temas, com
  equivalência entre variáveis CSS e metadados TypeScript

#### Scenario: Contraste do limite de controle

- **WHEN** o teste automatizado de contraste avalia `borderControl` sobre os
  fundos de formulário e superfície documentados
- **THEN** a razão de contraste é de pelo menos 3:1 em cada combinação de tema e
  `prefers-contrast: more` coberta pela lista de pares

### Requirement: Elevação tem valor próprio por tema

Os tokens públicos de elevação (`--ads-elevation-sm`, `-md` e `-lg`) MUST manter seus nomes e MUST ter valores distintos nos temas claro e escuro, de modo que a profundidade permaneça perceptível em ambos. Os nomes e usos existentes MUST NOT ser removidos ou renomeados.

#### Scenario: Tema escuro usa sombra própria

- **WHEN** a aplicação importa `@admin-ds/tokens/styles.css` e o tema escuro está ativo, explícito ou pelo sistema
- **THEN** cada token de elevação assume o valor do tema escuro e, no tema claro, o valor anterior

#### Scenario: Aplicação personaliza a elevação

- **WHEN** a aplicação sobrescreve um token de elevação no escopo de seu tema
- **THEN** os componentes que usam esse nível refletem o valor sem recompilar a biblioteca

### Requirement: Tokens de densidade de tabela

O sistema MUST disponibilizar tokens públicos de densidade para o espaçamento interno de células (`--ads-density-cell-padding-x` e `--ads-density-cell-padding-y`) com valores "confortável" (padrão) e "compacto". O valor compacto MUST valer no elemento e em seus descendentes quando `data-density="compact"` estiver presente no elemento ou em um ancestral, e `data-density="comfortable"` aninhado MUST restaurar o padrão.

#### Scenario: Densidade padrão

- **WHEN** nenhum elemento define `data-density`
- **THEN** os tokens de densidade assumem os valores confortáveis, equivalentes ao espaçamento anterior

#### Scenario: Densidade compacta herdada

- **WHEN** um ancestral define `data-density="compact"`
- **THEN** as tabelas descendentes usam o espaçamento compacto nos dois temas

#### Scenario: Metadados tipados

- **WHEN** uma aplicação importa os metadados públicos de tokens
- **THEN** os valores confortáveis dos tokens de densidade estão disponíveis com nomes equivalentes às variáveis CSS

### Requirement: Tokens de skeleton

O sistema MUST disponibilizar tokens públicos de altura de skeleton para texto, valor e bloco (`--ads-skeleton-height-text`, `-value` e `-block`), usados pelos placeholders de tabela, card de métrica e painel.

#### Scenario: Aplicação personaliza a altura

- **WHEN** a aplicação sobrescreve um token de altura de skeleton
- **THEN** os placeholders correspondentes refletem a nova altura sem recompilar a biblioteca
