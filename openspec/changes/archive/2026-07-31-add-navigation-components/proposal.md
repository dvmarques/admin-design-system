## Why

As primitivas, controles de formulário e overlays já estão disponíveis, mas cada aplicação consumidora ainda precisa implementar padrões de navegação e sua acessibilidade de forma independente. Esta change fornece componentes reutilizáveis para orientar a navegação administrativa com comportamento consistente em teclado, leitores de tela, temas e aplicações Next.js.

## What Changes

- Adicionar `AdsBreadcrumb`, `AdsNav` e `AdsTabs` para hierarquia e alternância entre seções, com semântica e interações acessíveis.
- Adicionar `AdsDropdown` composto para menus acionados por botão, incluindo foco gerenciado, Escape, clique externo e posicionamento responsivo.
- Adicionar `AdsPagination` para navegação entre páginas, com rótulos acessíveis, estado atual e composição segura com links ou callbacks.
- Distribuir os estilos compilados, tokens semânticos, exports públicos, histórias Storybook e exemplos no admin demo para todos os componentes da família.
- Cobrir comportamento, acessibilidade, temas claro/escuro, responsividade, consumo público e fluxos críticos com testes automatizados.

Fora do escopo: sidebar, header, shell administrativo, roteamento específico de Next.js, tabelas paginadas, busca, filtros, menus multinível e megamenus. Esses itens pertencem às changes de composição administrativa, apresentação de dados ou padrões avançados.

## Capabilities

### New Capabilities

- `navigation-structure`: breadcrumbs, navegação e tabs acessíveis e tematizáveis para organizar e alternar seções.
- `navigation-menus`: dropdown composto e acessível para apresentar ações ou destinos contextuais.
- `pagination`: paginação acessível e responsiva para navegar por coleções paginadas.

### Modified Capabilities

Nenhuma.

## Impact

- Pacote `@admin-ds/components`: novos componentes React, tipos, exports públicos e CSS compilado para `AdsBreadcrumb`, `AdsNav`, `AdsTabs`, `AdsDropdown` e `AdsPagination`.
- Pacote de tokens: possível adição de tokens semânticos de estados de navegação, foco e superfícies de menu, compartilhados entre os temas.
- Aplicação `apps/docs`: histórias e exemplos visuais de cada API pública.
- Aplicação `apps/admin-demo`: demonstrações de consumo exclusivamente por APIs e CSS públicos, sem dependência de roteamento Next.js nos componentes.
- Qualidade: testes Vitest/React Testing Library, verificações axe, fluxos Playwright e snapshots visuais nos dois temas; nenhuma dependência de runtime é prevista inicialmente.
