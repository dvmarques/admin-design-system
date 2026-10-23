## 1. Preparação e especificação

- [x] 1.1 Ler a issue #182, AGENTS.md, README.md, configuração OpenSpec e o código atual de `ThemeToggle`, do dropdown e do tema do demo.
- [x] 1.2 Criar a change OpenSpec (perfil Critical) e validar em modo estrito.

## 2. Biblioteca (`@admin-ds/components`)

- [x] 2.1 `AdsIcon`: ícones `sun`, `moon` e `monitor`; teste de renderização decorativa.
- [x] 2.2 `AdsDropdown`: `Item` com `role="menuitemradio"`/`aria-checked`, navegação por `[role^="menuitem"]`, foco inicial no item marcado, `Trigger` com `variant`/`size`; testes de regressão.
- [x] 2.2b `AdsTooltip`: prop `showOnFocus`; teste.
- [x] 2.3 `AdsThemeControl` (`menu` e `group`, controlado/não controlado, `optionDisplay`, `labels`, `tooltips`, `disabled`) e exports de tipos; `ThemeToggle` intacto.
- [x] 2.4 Testes: interação, teclado, foco preservado em mudança externa, controlado/não controlado, rótulos e tooltips, `disabled`, axe (aberto/fechado, duas variantes), temas, modal.
- [x] 2.5 Stories: modos, apresentações (menu/grupo, ícones/ícone+texto), estados (disabled, controlado) e dentro de modal.

## 3. Demo (`apps/admin-demo`)

- [x] 3.1 `lib/theme.ts`, `server-theme.ts` e script inicial: preferência `light | dark | system`, cookie compatível, fallback `light` no servidor, sem flash.
- [x] 3.2 `useThemePreference`, `ThemeSystemSync` (listener `prefers-color-scheme` só em Sistema, com limpeza) e armazenamento resiliente.
- [x] 3.3 Cabeçalho com `AdsThemeControl` (menu de ícones) e Preferências com o grupo, sem `key` e sem perda de foco.
- [x] 3.4 Showcase `AdsThemeControl` no catálogo (dados, demo, snippet, cobertura).
- [x] 3.5 Testes unitários: preferência, sistema, persistência, SSR/hidratação, armazenamento indisponível, limpeza de listeners.
- [x] 3.6 E2E: escolha direta, teclado/foco, sincronização cabeçalho/Preferências, persistência, Sistema por `colorScheme`, sem flash; ajustar testes que usavam o botão binário.

## 4. Documentação e entrega

- [x] 4.1 `docs/integration.md` (uso, migração de `ThemeToggle`, SSR e fallback), `docs/admin-demo-catalog.md` e CHANGELOG.
- [x] 4.2 Executados: prettier, `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quiet` (950 testes) e E2E em Chromium (226 aprovados). Os 9 snapshots visuais restantes divergem por mudança intencional do cabeçalho (ícone no lugar do botão de texto) e pela renderização local, que não é fonte de verdade; seus baselines Linux devem ser regenerados pelo workflow "Atualizar baselines visuais" na branch e revistos na PR. Firefox e WebKit (`theme-control`, `smoke`, `dropdown-focus`) não puderam ser executados localmente: os navegadores não estão instalados; ficam para a CI.
- [x] 4.3 `openspec validate --all --strict` (49 itens) e `npm run check:agent-skills` aprovados; `npm run test:ci` e `npm run test:release` aprovados.
- [ ] 4.4 Abrir PR para `develop` com changelog, issue e change, evidências e riscos.
