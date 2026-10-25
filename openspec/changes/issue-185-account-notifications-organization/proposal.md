## Why

O cabeçalho e a sidebar do admin demo ainda não oferecem as três interações esperadas de uma aplicação administrativa: abrir a conta pelo avatar, consultar notificações e trocar o contexto de organização. Cada aplicação consumidora teria de reconstruí-las, com riscos de acessibilidade (menus, drawers, overlays aninhados e foco). A issue #185 pede três composições reutilizáveis e independentes, sem autenticação, backend, transporte de notificações ou multitenancy na biblioteca.

## What Changes

Perfil: **Critical** (novas APIs públicas e exports, acessibilidade transversal de overlays, mudança de múltiplos pacotes, CSS distribuído).

Incrementos independentes, nesta ordem:

1. **Conta compacta** — `AdsAccountMenu` em `@admin-ds/admin`: gatilho com `AdsAvatar`, bloco de identidade, ações configuráveis (ícone opcional, grupos, links ou callbacks, desabilitado, pendente), `Trocar conta` opcional.
2. **Notificações** — `AdsNotificationCenter` em `@admin-ds/admin`: sino com contador e painel lateral direito (`AdsDrawer`), filtros Todas/Não lidas, leitura individual/global, estados de carregamento, vazio, erro, ação pendente/erro, carregar mais.
3. **Organização** — `AdsOrganizationSwitcher` em `@admin-ds/admin`: gatilho no topo da sidebar, lista com busca, estados, sidebar recolhida; **opcional**, sem alterar o `AdsAdminShell`.
4. **Integração** — demo, showcases no catálogo, stories, documentação, matriz do catálogo, changelog e E2E.

Evoluções compatíveis em pacotes existentes: `AdsAvatar` (falha de imagem reavaliada quando `src` muda), `AdsIcon` (ícones `bell`, `chevronDown`, `chevronsUpDown`, `user`, `settings`, `logOut`, `building`).

Fora do escopo: redesenhar o dashboard ou a identidade visual, autenticação/sessão/logout reais, multitenancy, gestão de organizações, conexão com serviços de notificação (API, WebSocket, push, armazenamento), buscas ou paginação de backend, alterar o `AdsThemeControl` (#182) e a issue #91.

## Capabilities

### New Capabilities

- `account-menu`: menu de conta compacto aberto pelo avatar.
- `notification-center`: central de notificações em painel lateral.
- `organization-switcher`: seletor opcional de organização para a sidebar.

### Modified Capabilities

- `avatar`: imagem que falhou volta a ser tentada quando `src` muda.
- `icon`: novos ícones públicos.
- `admin-demo-application`: integração dos três componentes e exemplo sem organização.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/admin` exporta `AdsAccountMenu`, `AdsNotificationCenter`, `AdsOrganizationSwitcher` e seus tipos; `@admin-ds/components` ganha nomes de `AdsIconName`. Nenhuma API existente muda de contrato; nenhuma dependência nova.
- **Biblioteca reutilizável**: componentes, CSS simples com tokens `--ads-*` e classes `ads-*` em `packages/admin/src/styles.css`, testes e stories.
- **Demonstração**: `apps/admin-demo` (cabeçalho, sidebar, dados fictícios, ações com feedback local), showcases no catálogo e exemplo sem seletor de organização. Nada disso é API pública.
- **Valor para consumidores**: composições prontas, acessíveis e controladas pela aplicação, que preservam shell, tema e SSR do Next.js App Router.
