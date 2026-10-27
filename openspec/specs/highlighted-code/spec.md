# highlighted-code Specification

## Purpose

Definir o pacote opcional `@admin-ds/highlighted-code` e o componente `AdsHighlightedCodeSnippet` para syntax highlighting assíncrono com Shiki, isolado do bundle principal do design system.

## Requirements

### Requirement: Pacote opcional independente

O design system MUST publicar `AdsHighlightedCodeSnippet` somente no pacote `@admin-ds/highlighted-code`, com export explícito e sem reexport pelo entrypoint de `@admin-ds/components` ou `@admin-ds/admin`.

#### Scenario: Consumidor importa o componente avançado

- **WHEN** uma aplicação importa `AdsHighlightedCodeSnippet` de `@admin-ds/highlighted-code`
- **THEN** o módulo resolve sem exigir import do pacote principal de componentes

#### Scenario: Bundle principal permanece sem Shiki

- **WHEN** uma aplicação importa apenas `@admin-ds/components`
- **THEN** o cenário de bundle público de componentes não inclui dependências de Shiki

### Requirement: Highlighting assíncrono com plain imediato

`AdsHighlightedCodeSnippet` MUST exibir o código fonte em texto plain imediatamente e aplicar syntax highlighting de forma assíncrona, sem skeleton e sem bloquear a interface.

#### Scenario: Carregamento inicial

- **WHEN** o componente é montado com código válido
- **THEN** o texto plain é visível antes da conclusão do carregamento do motor de highlighting

#### Scenario: Falha de carregamento

- **WHEN** o motor, a gramática ou o tema não podem ser carregados
- **THEN** o componente permanece em texto plain e continua utilizável

### Requirement: Linguagens suportadas e extensão

O componente MUST suportar TypeScript, TSX, JavaScript, JSX, Java, SQL, JSON, HTML, CSS, XML, YAML e Bash, com arquitetura que permita registrar outras linguagens, e MUST usar texto plain quando a linguagem é desconhecida.

#### Scenario: Linguagem suportada

- **WHEN** `language` corresponde a uma linguagem suportada
- **THEN** o highlighting é aplicado após o carregamento da gramática

#### Scenario: Linguagem desconhecida

- **WHEN** `language` não é reconhecida
- **THEN** o código é exibido em plain sem erro fatal

### Requirement: Cabeçalho, cópia e opções de exibição

O componente MUST oferecer cabeçalho com identificação da linguagem e ação para copiar o código original; MUST aceitar `showLineNumbers` e `wrapLines`; MUST aceitar `theme` com valores `light`, `dark` ou `auto` alinhado ao tema efetivo da aplicação.

#### Scenario: Copiar código

- **WHEN** a pessoa aciona copiar no cabeçalho
- **THEN** a área de transferência recebe exatamente o valor da prop `code` e um feedback acessível é anunciado

#### Scenario: Tema automático

- **WHEN** `theme` é `auto` e o tema efetivo da página alterna entre claro e escuro
- **THEN** o highlighting acompanha o tema efetivo

### Requirement: Segurança do markup

O componente MUST NOT injetar HTML arbitrário da entrada do usuário; tokens de highlighting MUST ser renderizados como texto em elementos React.

#### Scenario: Entrada com sequências HTML

- **WHEN** o código contém marcadores HTML ou script
- **THEN** o conteúdo é exibido como texto literal sem executar markup
