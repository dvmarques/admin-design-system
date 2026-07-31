## Why

As aplicações consumidoras ainda precisam implementar por conta própria camadas que interrompem, complementam ou notificam sobre o conteúdo da página. Uma família de overlays acessível e consistente reduz essa duplicação e permite construir fluxos administrativos sem abrir mão dos contratos de tema, CSS distribuído e compatibilidade com Next.js.

## What Changes

- Adicionar diálogos modais e drawers/offcanvas reutilizáveis, com gerenciamento de foco, fechamento previsível e superfície configurável.
- Adicionar tooltip e popover para contexto ancorado a elementos da interface, com interação por teclado e semântica apropriada.
- Adicionar toasts para comunicações não bloqueantes, com região de anúncio acessível, variantes semânticas e fechamento opcional.
- Publicar componentes e tipos prefixados por `Ads` em `@admin-ds/components`, usando tokens semânticos e o CSS compilado da biblioteca.
- Documentar os componentes no Storybook, demonstrar consumo por exports públicos no admin demo e cobrir temas, acessibilidade e interações críticas por testes automatizados.

Fora do escopo: dropdowns e menus de navegação, gerenciamento global de estado ou fila de notificações, posicionamento inteligente que dependa de uma biblioteca externa, fluxos de negócio e qualquer código ou ativo proprietário do CoreUI PRO.

## Capabilities

### New Capabilities

- `overlay-dialogs`: modais e drawers/offcanvas acessíveis que apresentam conteúdo sobre a página e administram foco e fechamento.
- `anchored-overlays`: tooltips e popovers ancorados, acessíveis por teclado e adequados a conteúdo contextual.
- `toast-notifications`: toasts não bloqueantes, tematizáveis e anunciáveis por tecnologias assistivas.

### Modified Capabilities

Nenhuma.

## Impact

- `packages/components`: novas APIs React, tipos públicos, estilos compilados e testes para overlays.
- `apps/docs`: histórias e documentação de estados, temas e interações da família.
- `apps/admin-demo`: exemplos que consomem exclusivamente os exports e CSS públicos distribuídos.
- A implementação reutilizará os tokens, contratos de tema, distribuição e compatibilidade Next.js existentes; novas dependências de runtime só serão consideradas se estritamente justificadas no design.
