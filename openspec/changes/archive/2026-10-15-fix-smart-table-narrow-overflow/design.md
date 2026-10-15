# Design

## Decisões

- **`minmax(0, 1fr)` na raiz**: a faixa implícita do grid usa `auto`, cujo mínimo é o
  conteúdo mínimo dos filhos. `minmax(0, 1fr)` zera esse mínimo para todos os filhos
  (filtros, barra de ferramentas e paginação), em vez de corrigir só a paginação.
- **Sem mudança de API ou de markup.**

## Validação

Teste de CSS em `packages/admin/tests/package.test.mjs` e E2E do demo em 375 px
(`/clientes`, com paginação), que falhava antes da correção.
