# Proposal

## Why

O Catálogo apresenta recuo e marcadores indevidos nos atalhos e páginas do Demo divergem da densidade da Visão geral (#339).

## What Changes

- Corrigir a lista de atalhos e uniformizar o espaçamento das páginas administrativas usando tokens existentes.
- Preservar contraste no exemplo de tema aninhado encontrado durante a auditoria do Catálogo.
- Auditar rotas, preservar semântica, interações, temas e responsividade e acrescentar testes de layout.
- Fora do escopo: autenticação, densidade interna de componentes e alterações de API ou CSS público.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `admin-demo-application`: ritmo e alinhamento das páginas administrativas.
- `component-catalog`: apresentação e navegação dos atalhos de exemplos.

## Impact

Perfil **Standard**: estilos e comportamento visual internos ao Demo, sem modificar pacotes ou APIs públicas. A aplicação Next.js demonstra aos consumidores padrões consistentes com os componentes e tokens existentes. Testes Playwright e documentação da change registram a validação. Sem novas dependências.
