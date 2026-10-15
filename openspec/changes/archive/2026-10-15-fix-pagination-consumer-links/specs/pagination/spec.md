# Spec Delta

## ADDED Requirements

### Requirement: Links do consumidor sem conteúdo interativo aninhado

`AdsPagination` MUST permitir que o consumidor forneça o elemento de link de cada destino (página, anterior e próxima habilitados), recebendo as props de estilo, `aria-current` e nome acessível para aplicá-las ao link. A biblioteca MUST NOT renderizar um botão dentro do link nem acessar o roteador. Anterior e próxima indisponíveis MUST permanecer desabilitados. A API `renderPage` existente MUST continuar funcionando.

#### Scenario: Links do Next.js em cada página

- **WHEN** uma aplicação Next.js fornece `next/link` para cada página
- **THEN** cada destino é um único link, sem botão aninhado, a página atual expõe `aria-current="page"` e mantém o estilo de item da biblioteca

#### Scenario: Limites com links

- **WHEN** a primeira página está ativa e o consumidor fornece links
- **THEN** o destino anterior é um botão desabilitado e o seguinte é um link

#### Scenario: Compatibilidade com renderPage

- **WHEN** uma aplicação usa apenas `renderPage`
- **THEN** o comportamento anterior é preservado
