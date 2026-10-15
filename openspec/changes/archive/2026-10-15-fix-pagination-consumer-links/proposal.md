# Proposal

## Why

`AdsPagination.renderPage` só recebe o botão pronto da página. Envolvê-lo em
`next/link` ou `<a>` gera conteúdo interativo aninhado, e substituí-lo por um
link perde `aria-current="page"` e o estilo de item. Isso diverge do cenário
"Integração com Next.js" da spec `pagination` (issue #52, item 1).

## What Changes

**Biblioteca reutilizável (`packages/components`)**

- Nova prop opcional `renderPageLink(page, props)` em `AdsPagination`. Chamada
  para cada página e para anterior/próxima habilitados, recebe `className`,
  `aria-current`, `aria-label` e `children`; o consumidor espalha as props no
  link. Anterior/próxima nos limites continuam botões desabilitados.
- Novo tipo público `AdsPaginationLinkProps`.
- `renderPage` fica marcado como obsoleto (`@deprecated`) e continua
  funcionando; `renderPageLink` tem precedência quando ambos são informados.
- Testes, story `ConsumerLinks` e seção em `docs/integration.md`.

**Aplicações de demonstração**

- Nenhuma mudança: o demo continua usando `onPageChange` com `router.push`.

## Objetivos e fora do escopo

Objetivos: links do consumidor sem conteúdo interativo aninhado, com estilo,
foco e `aria-current` da biblioteca, sem acoplar ao roteador.

Fora do escopo: `AdsNav` e `AdsBreadcrumb` (change `fix-navigation-consumer-links`);
remover `renderPage`; migrar o demo.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `pagination`: requisito de links fornecidos pelo consumidor.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/components`; adiciona
  `AdsPaginationProps.renderPageLink` e o tipo `AdsPaginationLinkProps`.
  Retrocompatível.
- **Dependências**: nenhuma. **Bundle**: sem utilidades novas além das já usadas
  pelo botão.
- **Consumidores**: podem migrar de `renderPage` para `renderPageLink`.
