# Spec Delta

## ADDED Requirements

### Requirement: Links do consumidor em AdsNav e AdsBreadcrumb

`AdsNav` e `AdsBreadcrumb` MUST permitir que o consumidor forneça o elemento de link de cada item, recebendo as props de estilo, `aria-current` e conteúdo para aplicá-las ao link. O item MUST conter um único elemento interativo, o link do consumidor MUST receber o estilo e o foco visível do item, e a biblioteca MUST NOT acessar o roteador. Itens desabilitados de `AdsNav` MUST permanecer botões desabilitados, e o item atual de `AdsBreadcrumb` MUST permanecer sem link com `aria-current="page"`.

#### Scenario: Consumo em Next.js em AdsNav

- **WHEN** uma aplicação Next.js fornece `next/link` para os itens de `AdsNav`
- **THEN** cada item é um único link com o estilo da biblioteca, o item atual expõe `aria-current="page"` e não há `<button>` nem interativo aninhado

#### Scenario: Link do consumidor em AdsBreadcrumb

- **WHEN** uma aplicação fornece um link para um item anterior de `AdsBreadcrumb`
- **THEN** o link recebe cor de texto, hover e foco visível do breadcrumb

#### Scenario: Compatibilidade com href

- **WHEN** um item usa apenas `href` ou `onClick`
- **THEN** o comportamento anterior é preservado
