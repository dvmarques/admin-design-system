# Changelog

Todas as alterações relevantes deste projeto são registradas neste arquivo.

O formato segue as convenções do Keep a Changelog, com mudanças organizadas por change do OpenSpec.

## 0.0.7 - 2026-09-06

### refine-component-visual-language

- Refinada a linguagem visual dos componentes existentes para maior hierarquia, contraste e consistência entre temas claro e escuro.
- Adicionados tokens semânticos para superfícies de hover e seleção, bordas fortes, foco, hover de ações, elevação e camadas de overlay.
- Refinados estados de botões, campos, controles de seleção e composição de formulários, distinguindo somente leitura, erro, sucesso e indisponibilidade.
- Ajustada a seleção estrutural de navegação e tabs, além de alvos e estabilidade visual da paginação em larguras reduzidas.
- Aplicada escala de profundidade e espaçamento responsivo a dropdowns, dialogs, drawers, tooltips, popovers e toasts.
- Adicionada cobertura de testes para os novos estados e comportamentos compactos.
- Mantidas as APIs públicas, o CSS distribuído e o escopo do Storybook sem alterações estruturais.

## 0.0.6 - 2026-07-31

### refine-visual-foundation

- Revisada a fundação visual global de tipografia, cores, estados e temas claro/escuro.
- Refinados critérios de contraste WCAG 2.2 AA e estados de foco.
- Atualizados densidade e hierarquia visual dos componentes existentes sem criar novas APIs.
- Atualizados exemplos e validações visuais dos componentes.

## 0.0.5 - 2026-07-31

### add-navigation-components

- Adicionados AdsBreadcrumb, AdsNav e AdsTabs.
- Adicionados AdsDropdown e AdsPagination com teclado, foco, Escape e posicionamento responsivo.
- Publicados tipos, exports, estilos compilados e testes da família de navegação.

## 0.0.3 - 2026-07-30

### add-form-components

- Adicionados AdsInput, AdsTextarea, AdsSelect, AdsCheckbox, AdsRadio e AdsSwitch.
- Adicionadas composições AdsField, AdsInputGroup e AdsSelectionGroup.
- Definidos estados de foco, validação, sucesso, somente leitura e desabilitado.
- Adicionados testes de teclado, acessibilidade, temas e associação semântica de campos.

## 0.0.4 - 2026-07-30

### add-overlay-components

- Adicionados AdsDialog e AdsDrawer com gerenciamento de foco e fechamento previsível.
- Adicionados AdsTooltip, AdsPopover e AdsToast com semântica acessível e suporte a temas.
- Adicionados testes de interação, acessibilidade e consumo do CSS distribuído.

## 0.0.2 - 2026-07-30

### add-core-primitives

- Adicionados AdsButton, AdsBadge, AdsAvatar, AdsSurface, AdsTypography, AdsIcon e AdsLoadingIndicator.
- Definidas variantes, tamanhos, estados e APIs públicas com prefixo Ads.
- Publicados estilos compilados e documentação visual dos componentes.

## 0.0.1 - 2026-07-29

### establish-design-system-foundation

- Estruturado o monorepo com workspaces para tokens, componentes, documentação e aplicações consumidoras.
- Definidos tokens semânticos de cor, tipografia, espaçamento, borda, elevação e movimento.
- Estabelecidos temas claro/escuro, distribuição de CSS compilado e metadados TypeScript.
- Configurados Tailwind CSS, Storybook, Next.js, testes, lint, typecheck e validações de acessibilidade.
- Definidos contratos de compatibilidade com React, TypeScript e Next.js App Router.
