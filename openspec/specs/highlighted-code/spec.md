# highlighted-code Specification

## Purpose

Definir o pacote opcional `@dvmarques/admin-ds-highlighted-code` e o componente `AdsHighlightedCodeSnippet` para syntax highlighting assíncrono com Shiki, isolado do bundle principal do design system.

## Requirements

### Requirement: Pacote opcional independente

O design system MUST publicar `AdsHighlightedCodeSnippet` somente no pacote `@dvmarques/admin-ds-highlighted-code`, com export explícito e sem reexport pelo entrypoint de `@dvmarques/admin-ds-components` ou `@dvmarques/admin-ds-admin`.

#### Scenario: Consumidor importa o componente avançado

- **WHEN** uma aplicação importa `AdsHighlightedCodeSnippet` de `@dvmarques/admin-ds-highlighted-code`
- **THEN** o módulo resolve sem exigir import do pacote principal de componentes

#### Scenario: Bundle principal permanece sem Shiki

- **WHEN** uma aplicação importa apenas `@dvmarques/admin-ds-components`
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
- **THEN** o highlighting acompanha o tema efetivo, definido pelo `[data-theme]` válido (`light` ou `dark`) mais próximo, por `document.documentElement` ou por `prefers-color-scheme`, nessa ordem

### Requirement: Segurança do markup

O componente MUST NOT injetar HTML arbitrário da entrada do usuário; tokens de highlighting MUST ser renderizados como texto em elementos React.

#### Scenario: Entrada com sequências HTML

- **WHEN** o código contém marcadores HTML ou script
- **THEN** o conteúdo é exibido como texto literal sem executar markup

### Requirement: Tema automático por escopo

No tema `auto`, o tema efetivo MUST ser o do `[data-theme]` válido (`light` ou `dark`) mais próximo do componente, ignorando valores inválidos, senão o de `document.documentElement` (inválido na raiz vale `light`), senão `prefers-color-scheme`; o componente MUST acompanhar mudanças, MUST NOT exibir bloco claro antes de resolver um tema escuro e MUST tokenizar apenas no tema efetivo.

#### Scenario: Tema automático por ancestral

- **WHEN** `theme` é `auto` e o componente está dentro de um elemento com `data-theme` diferente do de `document.documentElement`
- **THEN** o tema efetivo é o do ancestral mais próximo e acompanha as mudanças desse atributo

#### Scenario: Valor inválido de data-theme

- **WHEN** `theme` é `auto` e o `[data-theme]` mais próximo tem valor diferente de `light` e `dark`
- **THEN** esse valor é ignorado e vale o próximo ancestral com `[data-theme]` válido; na raiz, valor inválido vale `light`, e sem atributo vale `prefers-color-scheme`

#### Scenario: Primeira exibição do tema automático

- **WHEN** `theme` é `auto` e o componente é renderizado no servidor ou hidratado
- **THEN** o código é exibido em plain, sem tokenizar, com fundo e cores do tema da página escolhidos por CSS, e o tema efetivo é resolvido antes da primeira pintura no cliente

### Requirement: Recuperação de falhas e carregamento único

O componente MUST NOT memorizar permanentemente uma falha de carregamento do motor, da gramática ou do tema, e MUST compartilhar uma única importação entre carregamentos simultâneos da mesma gramática ou tema.

#### Scenario: Nova tentativa depois de falha

- **WHEN** o carregamento do motor, da gramática ou do tema falha e uma nova tokenização é solicitada
- **THEN** o carregamento é tentado novamente e, se concluir, o código é destacado

#### Scenario: Carregamentos simultâneos

- **WHEN** várias tokenizações da mesma linguagem são solicitadas ao mesmo tempo
- **THEN** a gramática é importada uma única vez

### Requirement: Linhas e código extenso

O componente MUST manter a altura de uma linha para linhas vazias, MUST exibir plain e destacado com o mesmo número de linhas, normalizando CRLF/CR e ignorando uma única quebra de linha final, e MUST manter o texto plain, sem carregar o motor, quando o código excede 1000 linhas ou 100 000 caracteres.

#### Scenario: Linha vazia destacada

- **WHEN** o código contém uma linha vazia e o destaque é aplicado
- **THEN** a linha vazia mantém a altura de uma linha

#### Scenario: Quebra de linha final

- **WHEN** o código termina com uma única quebra de linha
- **THEN** nenhuma linha extra numerada é exibida e a cópia continua recebendo o valor original

#### Scenario: Código extenso

- **WHEN** o código excede o limite de linhas ou de caracteres
- **THEN** o texto completo permanece em plain e copiável

### Requirement: Acessibilidade do feedback de cópia

O componente MUST manter uma região de status persistente para o feedback de cópia, MUST limpar a mensagem após um intervalo e quando `code` muda, MUST reanunciar a mesma mensagem em cópias seguidas e MUST dar nome acessível ao bloco de código focável.

#### Scenario: Feedback de cópia

- **WHEN** a cópia é acionada
- **THEN** a região de status já existente passa a conter a mensagem e é esvaziada depois de alguns segundos

#### Scenario: Cópia repetida

- **WHEN** a cópia é acionada de novo enquanto a mesma mensagem ainda é exibida
- **THEN** a mensagem é esvaziada e reposta no tick seguinte, sem texto extra, e o tempo de exibição recomeça

#### Scenario: Troca de código

- **WHEN** `code` muda enquanto a mensagem é exibida
- **THEN** a mensagem é removida
