# Proposal

## Why

Ao demonstrar o `AdsSmartTable` no `admin-demo` (#62), a página `/clientes` rolava na
horizontal em 375 px com a prop `pagination`: o `ul` com `min-w-max` de
`AdsPagination` alarga a coluna do grid do componente além do contêiner.

## What Changes

**Biblioteca reutilizável (`packages/admin`)**

- `.ads-smart-table` passa a usar `grid-template-columns: minmax(0, 1fr)`, de modo
  que nenhum filho alargue a coluna; a tabela continua rolando na própria região.

## Objetivos e fora do escopo

Objetivo: a página não rolar na horizontal em telas estreitas com paginação.
Fora do escopo: qualquer outra mudança visual ou de API.

## Capabilities

### Modified Capabilities

- `smart-table`: o requisito "Rolagem horizontal acessível" passa a cobrir a paginação.

## Impact

- **Pacotes e APIs públicas**: apenas CSS de `@admin-ds/admin`; nenhuma API muda.
- **Dependências**: nenhuma. **Bundle**: variação desprezível de CSS.
