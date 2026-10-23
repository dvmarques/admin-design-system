## Contexto

`styles.css` de `@admin-ds/admin` é CSS simples, sem Tailwind, distribuído em `@admin-ds/admin/styles.css`. O limite desktop (`48rem`) é o mesmo de `desktopQuery` em `admin-shell-state.tsx`.

## Decisões

- **Altura da viewport no root, só no desktop.** Dentro de `@media (min-width: 48rem)`, `.ads-admin-shell` vira `display: flex; flex-direction: column; height: 100vh; height: 100dvh; overflow: hidden`. `100dvh` é declarado após `100vh`, que serve de fallback. No móvel nada muda, preservando a rolagem da página e o Drawer.
- **Sem altura mágica.** O header segue `flex: 0 0 auto` com `min-height: 4rem`; o corpo usa `flex: 1 1 auto; min-height: 0`. Um header com várias linhas empurra o corpo em vez de sobrepô-lo. `position: fixed` não é usado; o `sticky` do header permanece inofensivo.
- **Rolagem independente.** A sidebar desktop (`aside`) é um item flex esticado e a `nav` interna mantém `height: 100%; overflow-y: auto`, rolando só quando os itens excedem a altura. `.ads-admin-shell-main` recebe `min-height: 0; overflow-y: auto` (e `overflow-x: auto` não é usado, para não criar rolagem horizontal inesperada; o conteúdo largo, como tabelas, é responsabilidade do próprio componente). `overscroll-behavior: contain` evita encadear rolagem.
- **Acessibilidade da região rolável.** `AdsAdminShell.Main` passa a ter `tabIndex={0}` por padrão (sobrescrevível) e anel de foco `:focus-visible`, para atender a regra de região rolável focável sem conteúdo focável. É a única mudança em componente React.
- **Contenção de absolutos.** O shell desktop tem `position: relative`, para que textos visualmente ocultos e outros descendentes absolutos não gerem rolagem da página.
- **Safe areas.** `padding-bottom` de main e sidebar usa `max(<padding atual>, env(safe-area-inset-bottom))`.
- **Largura e estado.** Largura expandida/recolhida, `data-collapsed` e estado controlado/não controlado não são tocados.
- **Server/Client Components.** Nenhuma mudança: só CSS.
- **Tailwind e CSS distribuído.** Sem Tailwind; usa apenas propriedades CSS e tokens `--ads-*` existentes. Seletores permanecem sob `ads-admin-shell` na camada `components`.
- **Conflitos com consumidores.** Apenas classes `ads-`; consumidores que renderizem o shell dentro de um contêiner com altura própria devem lembrar que o shell ocupa a viewport (documentado).

## Alternativas

- `position: fixed` na sidebar: exige alturas e offsets fixos do header e deixa o main sob a sidebar; descartado.
- `position: sticky; top: <header>; height: calc(100dvh - header)` na sidebar: depende da altura do header, que varia; descartado.
- Aplicar a regra também no móvel: alteraria o Drawer e a rolagem atual; fora do escopo.

## Riscos

- Código do consumidor que rola a janela (`window.scrollTo`, âncoras) deixa de ter efeito no desktop; documentado em Impact. Elementos `sticky` dentro do conteúdo passam a ser relativos ao main.
- Bloqueio de scroll de overlays (`overflow` em `body`) continua válido; o main não rola sob um modal por causa de `inert`/backdrop.
