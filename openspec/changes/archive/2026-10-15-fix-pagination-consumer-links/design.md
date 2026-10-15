# Design

## Decisões

- **Render prop, não `asChild`**: uma função que recebe props é estaticamente
  tipada, não exige clonar elementos nem dependência de slot, e funciona em
  Server Components quando a função vem de um Client Component do consumidor.
  `asChild` foi descartado por exigir `cloneElement`/slot.
- **Aditivo**: `renderPage` permanece; mudar sua assinatura quebraria a API.
- **Estilo compartilhado**: o link usa as mesmas classes do botão (variante
  `primary` na página atual, `secondary` nas demais, tamanho `sm`) via helper
  interno, sem novas classes dinâmicas e sem expor Tailwind na API.

## Client e Server Components

`AdsPagination` não declara `"use client"`; `renderPageLink` é função, então o
consumidor a fornece de um Client Component (ou usa links que funcionem no
servidor). A biblioteca não acessa o roteador.

## Acessibilidade

O link recebe `aria-current="page"` na página atual e `aria-label` ("Página N",
"Página anterior", "Próxima página"). Não há botão dentro de link. O foco
visível vem das classes do botão. Limites continuam `disabled`.

## Tailwind, CSS e bundle

Reaproveita utilidades do botão; `no-underline` já existe no CSS. Sem
dependências novas.
