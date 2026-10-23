## Why

O controle de tema atual (`ThemeToggle`) é binário (claro/escuro), mantém estado interno e não pode ser controlado. O demo precisa remontá-lo por `key` para refletir mudanças externas, o que descarta o foco, e não oferece a opção **Sistema** (`prefers-color-scheme`) (issue #182).

## What Changes

- **Novo `AdsThemeControl`** em `@admin-ds/components`: seletor exclusivo de três preferências (`light | dark | system`), com tipos públicos `AdsThemePreference`, `AdsThemeControlProps`, `AdsThemeControlVariant`, `AdsThemeControlOptionDisplay` e `AdsThemeControlLabels`. Estado controlado (`value`/`onValueChange`) e não controlado (`defaultValue`, padrão `system`); mudanças externas atualizam a interface sem remontagem e sem perder o foco.
- Duas apresentações: `variant="menu"` (padrão; botão compacto só com ícone que abre um menu de itens `menuitemradio`) e `variant="group"` (grupo `radiogroup` inline). Opções somente com ícone por padrão (`optionDisplay="icon"`, com tooltip e nome acessível); `optionDisplay="icon-text"` é opcional.
- `AdsTooltip` ganha `showOnFocus` (padrão `true`; aditivo), usado nas opções do menu para que Escape feche o menu em uma pressão.
- Ícones `sun`, `moon` e `monitor` em `AdsIcon` (aditivo). O gatilho mostra o ícone da **preferência** escolhida; em Sistema permanece o monitor.
- `AdsDropdown`: `AdsDropdown.Item` aceita `role="menuitemradio"` com `aria-checked`; a navegação por teclado considera todos os papéis `menuitem*` e o foco inicial vai para o item marcado. `AdsDropdown.Trigger` aceita `variant` e `size`. Compatível com o uso atual.
- `ThemeToggle`, `ThemeToggleProps`, `initialTheme` e `onThemeChange` permanecem **inalterados**. Migração documentada; sem depreciação formal nesta change.
- **Demo (`apps/admin-demo`)**: cabeçalho (menu compacto de ícones) e Preferências (grupo) compartilham uma única fonte de verdade (atributos de `<html>`). A preferência (`light | dark | system`) é persistida no cookie `ads-theme` existente (valores `light`/`dark` antigos continuam válidos). `system` é resolvido por `prefers-color-scheme` e acompanhado enquanto selecionado; `data-theme` recebe sempre o tema efetivo.
- Aplicação inicial: script inline no `<head>` (todos os builds) resolve a preferência antes da primeira pintura; o servidor renderiza o fallback `light` quando a preferência é `system` ou ausente, e o script corrige antes da pintura.
- Showcase no catálogo do demo, stories, testes unitários/E2E, documentação, exports e CHANGELOG.

## Impact

- Pacotes: `@admin-ds/components` (novo `AdsThemeControl`, `AdsIcon`, `AdsDropdown`, `AdsTooltip`); `apps/admin-demo`; `apps/docs` (stories).
- API pública: **aditiva**. Novos exports `AdsThemeControl` e tipos; novos nomes em `AdsIconName`; novas props opcionais em `AdsDropdown.Item`/`Trigger`. Nenhuma remoção. CSS: apenas utilitários internos; classes públicas novas com prefixo `ads-theme-control`. Sem dependência nova, sem exigir Tailwind do consumidor.
- Consumidores: a biblioteca não impõe provider, persistência, roteador nem acesso ao DOM global; a aplicação aplica o tema.
- Cookie `ads-theme` do demo passa a aceitar `system`; leitores antigos que só conheciam `light`/`dark` tratam `system` como `light`.

## Out of Scope

- Redesenho de tokens, novos temas/paletas, componentes não relacionados e a issue #91.
- Provider global, persistência ou aplicação do tema pela biblioteca; dependência do CoreUI.
- Depreciação formal (`@deprecated`) de `ThemeToggle`.

## Perfil de execução

Critical: nova API pública e exports, acessibilidade (semântica de seleção exclusiva, tooltip, foco), SSR/hidratação e alteração aditiva em `AdsDropdown`. Rollback: reverter a change; `ThemeToggle` e o cookie `light`/`dark` seguem funcionando.
