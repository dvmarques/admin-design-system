# Design

## Decisões

- **Render prop por item**, alinhada a `renderPageLink` de `AdsPagination`.
  `asChild` foi descartado por exigir clonagem de elementos e slot.
- **Aditivo**: `href`, `onClick` e `label` continuam valendo.
- **Estilo**: as classes do item de `AdsNav` e do link do breadcrumb viram
  constantes estáticas compartilhadas entre o `<a>` interno e o link do
  consumidor, sem classes dinâmicas.

## Client e Server Components

Sem `"use client"`. A função `renderLink` é fornecida pelo consumidor; a
biblioteca não importa nem acessa o roteador.

## Acessibilidade

Um único elemento interativo por item. `aria-current="page"` é repassado ao link
em `AdsNav`; no breadcrumb o item atual segue como `<span>`. Foco visível vem das
classes aplicadas. Itens `disabled` não viram link.

## Tailwind, CSS e bundle

Reaproveita utilidades existentes; sem dependências novas.
