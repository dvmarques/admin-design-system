# Proposal

## Why

`AdsNav` não comporta um link do consumidor sem aninhar interativos: com `href`
renderiza o próprio `<a>` e, sem `href`, um `<button>`. `AdsBreadcrumb` aceita um
`next/link` em `label`, mas só aplica estilo e foco de link com `href`. Os dois
divergem da spec `navigation-structure` ("Cada item MUST aceitar conteúdo de
link…" e "Consumo em Next.js sem acoplamento ao roteador") — issue #52, item 1.

## What Changes

**Biblioteca reutilizável (`packages/components`)**

- Prop opcional `renderLink(props)` nos itens de `AdsNav` e `AdsBreadcrumb`.
  Recebe `className`, `aria-current` e `children`; o consumidor espalha as props
  no link (por exemplo `next/link`). Tem precedência sobre `href`.
- Novo tipo público `AdsLinkRenderProps`.
- Em `AdsNav`, item `disabled` continua botão desabilitado; no breadcrumb, o
  item atual continua `<span aria-current="page">`.
- Testes, story `ConsumerLinks` e seção em `docs/integration.md`.

**Aplicações de demonstração**

- Nenhuma mudança: o `next/link` na sidebar do shell segue como está.

## Objetivos e fora do escopo

Objetivos: link do consumidor com estilo, foco e `aria-current` da biblioteca, sem
interativos aninhados nem acoplamento ao roteador.

Fora do escopo: `AdsPagination` (change `fix-pagination-consumer-links`);
`AdsTabs`; sidebar do `AdsAdminShell`; migrar o demo.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `navigation-structure`: requisito de links do consumidor em `AdsNav` e
  `AdsBreadcrumb`.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/components`; adiciona `renderLink` a
  `AdsNavItem` e `AdsBreadcrumbItem` e o tipo `AdsLinkRenderProps`.
  Retrocompatível.
- **Dependências**: nenhuma. **Bundle**: nenhuma utilidade nova.
- **Consumidores**: podem usar `next/link` direto nos itens.
