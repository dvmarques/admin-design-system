## Why

O painel SVG do login cresce pela proporção intrínseca e força rolagem mesmo em desktop amplo. A composição deve acompanhar a altura disponível e manter os controles acessíveis.

## What Changes

- Conter as três rotas de autenticação na viewport e retirar o SVG do cálculo de altura.
- Compactar espaçamentos em telas baixas e permitir rolagem interna somente quando o conteúdo realmente exceder a área disponível.
- Cobrir dimensões, erros e navegação por teclado com E2E e documentar o comportamento.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `admin-demo-application`: contenção do fluxo demonstrativo de autenticação na viewport.

## Impact

Perfil Standard: correção de composição e CSS interno do demo, sem CSS distribuído ou API pública afetada. Bibliotecas `@admin-ds/*`, tokens, dependências e Storybook permanecem iguais; consumidores ganham um exemplo correto de dimensionamento. Fora do escopo: autenticação real, identidade visual, mudanças de conteúdo e redução de controles para forçar encaixe em alturas arbitrárias.
