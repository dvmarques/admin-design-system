## Contexto

`ThemeToggle` guarda o tema em estado local; o demo sincroniza mudanças externas remontando-o por `key`. Cabeçalho e Preferências leem o tema de `data-theme` em `<html>` via `useSyncExternalStore`. A issue pede três preferências, sincronização sem remontagem e SSR sem flash.

## Decisões

### Nome e API pública

`AdsThemeControl` (controle de preferência), em vez de `AdsThemeSelector`: descreve a função, não a apresentação, e cobre as duas variantes. Props: `value`, `defaultValue` (`system`), `onValueChange(preference)`, `variant` (`menu` | `group`), `optionDisplay` (`icon` | `icon-text`), `labels` (`group`, `light`, `dark`, `system`), `tooltips` (padrão `true`, aplica-se ao modo só com ícone), `disabled`, `className` e atributos do elemento raiz. O componente só **emite** a preferência: não persiste, não lê `matchMedia`, não escreve no DOM global.

`ThemeToggle` permanece binário e intacto. A API ternária não substitui a binária silenciosamente; a migração é trocar `ThemeToggle initialTheme/onThemeChange` por `AdsThemeControl defaultValue/onValueChange`, resolvendo `system` na aplicação. Depreciação formal fica para versão futura.

### Preferência × tema efetivo

`AdsThemePreference = 'light' | 'dark' | 'system'` é a escolha; o tema efetivo (`light | dark`) é responsabilidade da aplicação. No demo, `<html data-theme-preference>` guarda a preferência e `<html data-theme>` o efetivo, compatível com os tokens atuais (`[data-theme='light'|'dark']`). Sem mudança em tokens.

### Acessibilidade

- **Menu** (cabeçalho): gatilho `AdsDropdown.Trigger` só com ícone, nome acessível `"<rótulo do grupo>: <opção atual>"` (ex.: "Tema: Sistema"), `aria-haspopup="menu"`, `aria-expanded`. Itens `role="menuitemradio"` com `aria-checked`. Seleção anunciada pelo estado; foco volta ao gatilho ao fechar (comportamento do dropdown). Foco inicial no item marcado.
- **Grupo** (Preferências): `role="radiogroup"` com nome acessível; botões `role="radio"` com `aria-checked` e tabindex móvel; setas, Home e End movem e selecionam, como radios nativos.
- Ícones decorativos (`aria-hidden`); em modo só com ícone o nome vem de `aria-label`. Em `icon-text` o nome vem do texto visível.
- Tooltip (`AdsTooltip`) no gatilho e no grupo abre por foco e ponteiro, não é o único nome e é dispensável com Escape. Nas opções do **menu**, o tooltip abre só por ponteiro (`showOnFocus={false}`, prop aditiva em `AdsTooltip`): a pilha de Escape do sistema deixa a camada superior absorver o evento, então um tooltip aberto pelo foco inicial faria o primeiro Escape não fechar o menu. O nome acessível anuncia a opção focada.
- Seleção não depende só de cor: marca de verificação (`check`) além de fundo/borda. Alvos de toque ≥ 2,5 rem (40 px), como o botão de alternar a sidebar do shell.
- Não mistura rótulo de "próxima ação" com `aria-pressed`: o rótulo descreve o estado atual.

### Reuso

Reusa `AdsButton`, `AdsIcon`, `AdsTooltip` e `AdsDropdown`. Mudanças aditivas em `AdsDropdown`: `Item` aceita `role` (`menuitem` | `menuitemradio`; só `menuitemradio` devolve o foco ao gatilho ao escolher, preservando o comportamento dos itens atuais), a navegação usa `[role^="menuitem"]` e o foco inicial prefere o item marcado; `Trigger` aceita `variant` e `size` (padrões atuais preservados). Sem novo overlay, sem dependências.

### Client/Server

`AdsThemeControl` declara `"use client"` (estado, teclado, overlay). As funções do demo (`lib/theme.ts`) continuam importáveis por Server Components; só tocam `document` quando chamadas.

### Demo: fonte de verdade, SSR e hidratação

- Fonte de verdade: atributos de `<html>` observados por `MutationObserver` (`useThemePreference`). Cabeçalho e Preferências leem o mesmo valor; nenhuma `key`. O fallback de armazenamento indisponível é natural: o estado vive no DOM, e a escrita do cookie é protegida por `try/catch`.
- Persistência: cookie `ads-theme` (`light | dark | system`), reaproveitando a integração SSR existente. Valores antigos `light`/`dark` permanecem válidos (migração implícita); valor ausente ou inválido = `system`.
- Servidor: lê o cookie; `light`/`dark` renderizam o tema correto; `system`/ausente renderiza `data-theme="light"` (fallback: o servidor não conhece o SO) e `data-theme-preference="system"`.
- Primeira pintura: script inline no `<head>` em todos os builds resolve a preferência (cookie ou `system` → `matchMedia`) e define os dois atributos antes da pintura; `suppressHydrationWarning` em `<html>`. Quando falha (script bloqueado), permanece o fallback do servidor.
- Hidratação: `useSyncExternalStore` usa a preferência do servidor como snapshot de servidor; o ícone do gatilho depende só da preferência, portanto não diverge.
- Sistema: `ThemeSystemSync` (Client Component no layout raiz) assina `matchMedia('(prefers-color-scheme: dark)')` somente enquanto a preferência for `system` e remove o listener ao sair/desmontar. Preferência explícita nunca é sobrescrita.
- Site estático (GitHub Pages): sem servidor, mesmo script; padrão passa a `system` (antes `light`).

### CSS e distribuição

Utilitários Tailwind internos compilados em `@admin-ds/components/styles.css`; classes públicas `ads-theme-control`, `ads-theme-control-trigger`, `ads-theme-control-option`. Sem dependência do Tailwind pelo consumidor. Conflito de CSS evitado por prefixo `ads-` e escopo nas classes.

### Alternativas descartadas

- Estender `ThemeToggle` para três valores: quebraria silenciosamente a API binária.
- Provider/hook global na biblioteca: impõe persistência e DOM global.
- Radios nativos estilizados: exigiriam CSS dependente de `:checked` com sobreposição visual; botões `role="radio"` com tabindex móvel dão o mesmo contrato com controle total do foco.
- Persistir também em `localStorage`: duas fontes de verdade e sem benefício de SSR.

### Bundle e dependências

Sem dependências novas. Acréscimo: um componente pequeno, três ícones e ajustes no dropdown.

## Riscos

- Flash para quem usa `system` com SO escuro caso o script inline seja bloqueado (CSP): fallback `light` documentado.
- Tooltip dentro do menu: z-index do tooltip (`--ads-layer-overlay`) é acima do dropdown; coberto por teste/E2E.
