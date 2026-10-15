# Design

## Decisões

- **`renderPageLink` em vez de `onPageChange`**: cada página vira um link real
  (navegável com clique do meio, prefetch do `next/link` e sem JavaScript para
  navegar), sem botão aninhado e sem depender do roteador no componente.
- **Showcase com hrefs de âncora**: `renderLink` usa `next/link` com os mesmos
  destinos `#...` atuais, para não alterar a rota nem os snapshots além do
  necessário. Item de `AdsNav` com `onClick` permanece um botão.
- **Paginação local do showcase**: `AdsPagination` do catálogo usa estado local
  e não navega; permanece com `onPageChange`.

## Client e Server Components

`customers-pagination.tsx` continua um Client Component, pois passa uma função
(`renderPageLink`) ao componente; deixa de usar `useRouter`. `navigation-showcase.tsx`
já é um Client Component.

## Acessibilidade

Cada página é um único `link` com nome "Página N" e `aria-current="page"` na
atual; anterior/próxima nos limites seguem desabilitados. Testes E2E usam
função ARIA e nome acessível.

## Tailwind, CSS e bundle

No demo, as classes vêm das props recebidas, espalhadas no link. Os links herdam
a fonte da página, mas o botão nativo não (a biblioteca não usa o preflight do
Tailwind), então o "Anterior" desabilitado destoava das páginas. A classe base
do `AdsButton` recebe `[font-family:inherit]`, o que corrige todos os botões
da biblioteca, inclusive os de `AdsPagination`, sem exceção local. Sem novas
dependências.

## Alternativas

Manter `onPageChange` + `router.push`: descartado por não exercitar a API
recomendada nem produzir links reais.
