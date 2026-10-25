## Why

Issue de acompanhamento: #205.

No desktop, os ícones da navegação mudam de posição horizontal ao recolher a sidebar porque o estado compacto centraliza na área útil descontada a scrollbar. O usuário solicita alinhamento estável, centralizado no destaque selecionado e compartilhado com o avatar da organização.

## What Changes

- Fixar a coluna dos ícones na composição sidebar-header nos estados expandido e recolhido.
- Alinhar a coluna ao centro do destaque compacto e ao avatar da organização, preservando largura da barra, destaque ativo, hierarquia e comportamento móvel.
- Documentar e testar o alinhamento com scrollbar nativa e sobreposta.
- Fora do escopo: novas props, ícones, identidade ou navegação.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `admin-shell-layout`: estabilidade horizontal dos ícones no recolhimento desktop.

## Impact

Biblioteca: CSS público de @admin-ds/admin, composição AdsAdminShell layout sidebar-header e Navigation, NavigationGroup, NavigationItem e AdsOrganizationSwitcher. Sem novas dependências ou props. Demo e Storybook validam consumo do CSS compilado. Layout standard e mobile preservados.

## Perfil e compatibilidade

Perfil **Critical**, pois altera CSS distribuído de pacotes públicos e seu consumo no demo e Storybook. Mantém props, exports, DOM e contratos de acessibilidade; o efeito visual foi revisado pelo mantenedor no demo. Sem dependências ou alteração de bundle JavaScript. Rollback: reverter a alteração de estilos e seus baselines em conjunto. Validar a suíte completa e revisar diffs Linux antes da revisão humana da PR.
