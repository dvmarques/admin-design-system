## 1. Preparação e especificação

- [x] 1.1 Ler a issue #185, AGENTS.md, README.md, configuração OpenSpec, `AdsAvatar`, `AdsPopover`, `AdsDrawer`, `AdsAdminShell` e o demo atual.
- [x] 1.2 Criar a change OpenSpec (perfil Critical) e validar em modo estrito antes de implementar.

## 2. Evoluções compatíveis em `@admin-ds/components`

- [x] 2.1 `AdsIcon`: ícones `bell`, `building`, `chevronDown`, `chevronsUpDown`, `logOut`, `settings`, `user`; teste decorativo/informativo e regressão dos existentes.
- [x] 2.2 `AdsAvatar`: falha de imagem reavaliada quando `src` muda; testes de foto, falha, troca de `src`, fallback vazio e uso isolado.

## 3. Incremento 1 — `AdsAccountMenu` (`@admin-ds/admin`)

- [x] 3.1 Componente, tipos, exports públicos e CSS (`ads-account-menu*`).
- [x] 3.2 Testes: abertura/fechamento, foco e retorno, setas/Home/End/Tab, grupos, `switchAccount` opcional, desabilitada, `Promise` pendente/erro, controlado/não controlado, foto/iniciais/falha, axe e SSR.
- [x] 3.3 Stories e showcase no catálogo.

## 4. Incremento 2 — `AdsNotificationCenter` (`@admin-ds/admin`)

- [x] 4.1 Componente, tipos, exports públicos e CSS (`ads-notification-center*`).
- [x] 4.2 Testes: contador (zero, 99+, não lidas ≠ carregadas), abrir não marca, política de ativação, botão irmão do link, filtros, leitura individual/global, carregando/vazio/erro/pendente/erro de ação/carregar mais, rótulos e `formatTime`, foco/Escape/retorno, axe e SSR.
- [x] 4.3 Stories e showcase no catálogo.

## 5. Incremento 3 — `AdsOrganizationSwitcher` (`@admin-ds/admin`)

- [x] 5.1 Componente, tipos, exports públicos e CSS (`ads-organization-switcher*`), sem alterar `AdsAdminShell` além de um hook interno opcional.
- [x] 5.2 Testes: ausente/presente, zero/uma/muitas, busca e sem resultados, atual marcada, troca síncrona e assíncrona (pendente/erro, sem confirmar antes), carregando/erro, desabilitada, logo falho, recolhida e mobile, foco, axe e SSR.
- [x] 5.3 Stories e showcase no catálogo, incluindo exemplo sem organização.

## 6. Incremento 4 — Integração

- [x] 6.1 Demo: cabeçalho (tema + sino + avatar) e topo da sidebar com dados fictícios e feedback local; testes do demo.
- [x] 6.2 Catálogo: entradas, composições, snippets (`node scripts/catalog-snippets.mjs`), matriz em `docs/admin-demo-catalog.md` e teste de cobertura.
- [x] 6.3 E2E: conta, notificações, organização (expandida, recolhida, mobile), overlays aninhados, tema claro/escuro, hidratação e exemplo sem organização.
- [x] 6.4 Documentação em `docs/integration.md`, `docs/admin-demo-catalog.md`, `docs/bundle-baseline.md` (orçamentos de `@admin-ds/admin` atualizados e justificados) e CHANGELOG `[0.1.1]`. Baselines visuais **não** foram regenerados localmente: 9 snapshots divergem pela mudança intencional do cabeçalho/sidebar e devem ser regenerados pelo workflow "Atualizar baselines visuais" e revistos na PR.

## 7. Formatação e validação

- [x] 7.1 `npx prettier --write` nos arquivos alterados e `npm run format`.
- [x] 7.2 `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quiet` (verboso para diagnóstico: `npm run test:verbose`).
- [x] 7.3 E2E em Chromium (build de produção, binário local compatível): 246 de 265 aprovados na suíte completa; as 10 falhas de snapshot visual (cabeçalho/sidebar mudaram de forma intencional) ficam para o workflow de baselines e as demais foram corrigidas e reexecutadas (59 aprovados em `overlay-position`, `catalog`, `popover-content` e no spec novo). Firefox e WebKit não foram executados localmente; ficam para a CI.
- [x] 7.4 `openspec validate --all --strict` e `npm run check:agent-skills`.
