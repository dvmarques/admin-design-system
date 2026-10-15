# Proposal

## Why

A PR #53 adicionou `renderLink` a `AdsNav` e `AdsBreadcrumb` e `renderPageLink` a
`AdsPagination`, mas o admin demo ainda usa os contornos anteriores
(`onPageChange` com `router.push` em `/clientes` e links `<a>` simples no
catálogo de componentes). O demo deve consumir a biblioteca como uma aplicação
externa e exemplificar o caminho recomendado (issue #54).

## What Changes

**Biblioteca reutilizável (`packages/components`)**

- Nenhuma mudança.

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

Fora do escopo: mudanças em `packages/components`; a sidebar de `AdsAdminShell`,
que usa `next/link` diretamente.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `nextjs-consumption`: requisito da aplicação de referência para links do consumidor.

## Impact

- **Pacotes e APIs públicas**: nenhum pacote publicado nem API pública é afetado.
- **Dependências**: nenhuma. **Bundle**: sem impacto nas bibliotecas.
- **Consumidores**: ganham um exemplo funcional de `renderLink` e `renderPageLink`.
