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
