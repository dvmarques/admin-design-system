# Proposal

## Why

Uma auditoria de todas as rotas do admin demo em 320, 390, 768, 1024 e 1440px,
nos dois temas, encontrou um único defeito: `/componentes` rola 6px na horizontal
em 320px. A spec já exige rotas sem rolagem horizontal da página em largura de
celular, mas não fixa a largura mínima, e o E2E só verificava a partir de 375px.
320px é a largura de referência do reflow do WCAG 2.2 (zoom de 400% em 1280px).

## What Changes

**Aplicação de demonstração (`apps/admin-demo`)**

- Em telas estreitas, os grids da demonstração (`demo-foundations-grid`,
  `demo-utility-grid`, `demo-preferences`, `demo-evaluation-grid` e
  `demo-state-grid`) passam de `1fr` para `minmax(0, 1fr)`: `1fr` não encolhe
  abaixo do conteúdo, e a paginação, que não quebra linha, alargava a coluna e a
  página.
- O grid interno do `NavigationShowcase` recebe a mesma coluna, para a paginação
  rolar dentro do painel.

**Testes e especificação**

- O E2E de todas as rotas passa a verificar também 320px.
- O requisito de responsividade passa a fixar 320px como largura mínima.

**Biblioteca reutilizável**

- Nenhuma mudança: `AdsPagination` já rola dentro do próprio contêiner.

## Objetivos e fora do escopo

Objetivo: nenhuma rota do demo com rolagem horizontal da página a partir de 320px,
garantido pelo E2E.

Fora do escopo: mudar componentes, tokens ou o layout em larguras maiores.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `admin-demo-application`: o requisito de responsividade fixa 320px como largura
  mínima.

## Impact

- **Pacotes e APIs públicas**: nenhum pacote publicado; só `apps/admin-demo`.
  Nenhuma API pública, classe `ads-*` ou variável `--ads-*` muda.
- **Dependências**: nenhuma.
- **Consumidores**: nenhum; o ajuste é da aplicação de demonstração.
