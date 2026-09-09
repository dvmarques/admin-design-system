## Why

O Admin Design System já fornece primitivas, formulários, overlays, navegação e componentes de apresentação de dados, mas aplicações administrativas ainda precisam reconstruir a estrutura principal de layout: header, sidebar, área de conteúdo, navegação responsiva e preferências de apresentação. Esta change cria uma composição pública e reutilizável para essa estrutura, mantendo independência de roteador, framework de aplicação e regras de negócio.

## What Changes

- Adicionar `AdsAdminShell` como composição estrutural pública no pacote `@admin-ds/admin`.
- Disponibilizar regiões explícitas para header, sidebar e conteúdo principal, com semântica HTML adequada e composição por React children/slots.
- Implementar sidebar persistente em viewports amplas e navegação móvel sobreposta em viewports estreitas, reutilizando padrões e componentes existentes quando apropriado.
- Permitir estado expandido/recolhido da sidebar em desktop e abertura/fechamento da navegação móvel de forma controlada ou não controlada, sem persistência obrigatória no design system.
- Permitir que aplicações componham branding, navegação, ações, usuário e preferências no shell sem acoplamento a Next.js ou a um roteador específico.
- Respeitar tokens, temas claro/escuro, foco visível, reduced motion e demais contratos visuais do design system.
- Documentar a API pública no Storybook, adicionar exemplos no admin demo e cobrir comportamento, acessibilidade, responsividade, consumo público e snapshots visuais.

Fora do escopo: autenticação, autorização, roteamento, carregamento de dados, breadcrumbs automáticos, menus derivados de permissões, persistência de preferências em backend/localStorage, dashboards, filtros avançados e evolução completa do `apps/admin-demo` para uma aplicação administrativa final. Esses itens pertencem à aplicação consumidora ou às próximas changes do roadmap.

## Capabilities

### New Capabilities

- `admin-shell-layout`: composição estrutural reutilizável com header, sidebar e conteúdo principal.
- `admin-shell-navigation`: comportamento responsivo e acessível da navegação estrutural, incluindo sidebar desktop e navegação móvel.
- `admin-shell-preferences`: contratos para preferências de layout controladas pelo consumidor, especialmente expansão/recolhimento da sidebar.

### Modified Capabilities

Nenhuma.

## Impact

- Pacote `@admin-ds/admin`: substituição do placeholder atual por componentes React, tipos públicos, exports e estilos distribuídos do Admin Shell.
- Pacote `@admin-ds/components`: reutilização de componentes públicos existentes como `AdsDrawer`, `AdsButton`, `AdsIcon`, `AdsNav` e `ThemeToggle`; alterações nesse pacote somente se uma lacuna genérica indispensável for identificada durante a implementação.
- Pacote de tokens: possível adição de tokens semânticos exclusivamente para conceitos estruturais ausentes, como dimensões do shell, superfícies ou divisores, priorizando reuso dos tokens existentes.
- Aplicação `apps/docs`: documentação e histórias do shell, seus estados e breakpoints representativos.
- Aplicação `apps/admin-demo`: exemplo integrado mínimo para validar a composição sem antecipar a change `add-nextjs-admin-demo`.
- Qualidade: testes unitários, acessibilidade, consumo público, responsividade, teclado, Playwright e snapshots visuais nos temas claro e escuro.
