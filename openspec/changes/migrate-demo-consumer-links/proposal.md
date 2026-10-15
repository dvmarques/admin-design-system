# Proposal

## Why

A PR #53 adicionou `renderLink` a `AdsNav` e `AdsBreadcrumb` e `renderPageLink` a
`AdsPagination`, mas o admin demo ainda usa os contornos anteriores
(`onPageChange` com `router.push` em `/clientes` e links `<a>` simples no
catálogo de componentes). O demo deve consumir a biblioteca como uma aplicação
externa e exemplificar o caminho recomendado (issue #54).

## What Changes

**Biblioteca reutilizável (`packages/components`)**

- `AdsButton`: passa a herdar a fonte da página (`font-family: inherit`) em vez
  da fonte padrão do navegador. Isso cobre os botões de `AdsPagination`, como o
  "Anterior" desabilitado, que ficam iguais aos links de `renderPageLink`.
  Encontrado na revisão da PR.

**Aplicações de demonstração (`apps/admin-demo`)**

- `customers-pagination.tsx` passa a usar `renderPageLink` com `next/link`: cada
  página é um link real para `/clientes?pagina=N`, sem `useRouter`.
- `navigation-showcase.tsx` passa a usar `renderLink` com `next/link` nos itens de
  `AdsBreadcrumb` e `AdsNav`.
- Testes E2E de `/clientes` passam a localizar as páginas como `link`, por
  função ARIA e nome acessível; snapshots afetados são revisados.
- `docs/integration.md`: a seção "Paginação por `onPageChange`" passa a mostrar o
  exemplo do demo com `renderPageLink`.

## Objetivos e fora do escopo

Objetivos: demo sem conteúdo interativo aninhado, navegação por links reais e
consumo apenas de caminhos públicos.

Fora do escopo: outras mudanças em `packages/components`, além da fonte do
`AdsButton`; a sidebar de `AdsAdminShell`, que usa `next/link` diretamente.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `nextjs-consumption`: o requisito "Aplicação de referência" passa a exigir os
  links do consumidor (`renderLink` e `renderPageLink`).

## Impact

- **Pacotes e APIs públicas**: em `@admin-ds/components`, muda apenas a fonte
  do `AdsButton` (e de quem o usa, como `AdsPagination`); nenhuma API pública
  é afetada. A mudança visual é intencional: botões passam a usar a fonte da
  aplicação.
- **Dependências**: nenhuma. **Bundle**: sem impacto nas bibliotecas.
- **Consumidores**: ganham um exemplo funcional de `renderLink` e `renderPageLink`.
