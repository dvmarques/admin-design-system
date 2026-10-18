# Design

## Context

Estado observado em 65 stories (Storybook, temas claro e escuro, 1280px e
390px) com checagem de geometria no Playwright.

**Controles de texto.** `formControlClasses`
(`packages/components/src/form-control-classes.ts`) é usado por `AdsInput`,
`AdsTextarea` e `AdsSelect`. A classe base tem `block w-full ... border` e
`px-2/3/4`, sem `box-border`. A biblioteca distribui o CSS sem preflight do
Tailwind (`styles.test.ts` garante que não há `*,:after,:before`), então
`<input>` e `<textarea>` ficam em `content-box`: em `md`, 275,5px de largura mais
24px de padding e 2px de borda dão 302px contra 276px do `.ads-field`. O
`<select>` não sofre, porque o navegador já o renderiza com `border-box`. O
admin demo tem `* { box-sizing: border-box }` em `globals.css`, o que mascara o
defeito.

**Cabeçalho do shell.** `.ads-admin-shell-header` (`packages/admin/src/styles.css`)
é `display: flex; align-items: center; gap: 1rem; min-height: 4rem` com
`padding-inline`. Sem `flex-wrap` e sem `min-width: 0` nos filhos diretos, o
conteúdo composto pela aplicação (gatilhos de navegação, título, selo de
ambiente, `ThemeToggle` e botão de conta) não pode ficar abaixo da largura
natural. Em 390px isso soma 412px e a página rola 22px. `ThemeToggle`
(`packages/components/src/theme-toggle.tsx`) é um `<button>` com
`rounded-md border px-3 py-2 text-text`, sem `font-sans` nem
`whitespace-nowrap`: sem preflight, `<button>` não herda `font-family`, e o
rótulo "Usar tema escuro" quebra em 3 linhas em 66px.

## Goals / Non-Goals

**Goals:**

- Controles de texto contidos na largura do campo, sem exigir reset do consumidor.
- Cabeçalho do shell sem rolagem horizontal em 390px e sem controles cortados.
- `ThemeToggle` com a fonte do design system e rótulo em uma linha.
- Nenhuma mudança de API pública, de classe `ads-*` ou de variável `--ads-*`.

**Non-Goals:**

- Distribuir um reset global de `box-sizing` ou o preflight do Tailwind.
- Prescrever o conteúdo do cabeçalho: o shell continua sem regras de domínio.
- Rolagem das stories de documentação `foundation-components--surfaces` e
  `--tokens`, o SVG de `AdsLoadingIndicator` e o alinhamento de 2px de "Criado em".

## Decisions

**Adicionar `box-border` a `formControlClasses`.** Classe estática do Tailwind,
no mesmo ponto que define `w-full` e a borda, sem nova dependência. Vale para os
três controles; para `AdsSelect` é inócuo.

Alternativas descartadas:

- _Distribuir `box-sizing: border-box` global ou o preflight_: a biblioteca
  passaria a impor reset à aplicação, contra o contrato de não afetar estilos
  externos e de não exigir Tailwind do consumidor.
- _Regra `.ads-form-control { box-sizing }` no CSS de `styles.css`_: duplica o
  que a classe utilitária já expressa e foge do padrão do arquivo.
- _Compensar com `calc(100% - 26px)`_: frágil para os três tamanhos e para
  diferentes larguras de borda.

**Cabeçalho do shell com `flex-wrap: wrap` e filhos que podem encolher.**
`.ads-admin-shell-header` ganha `flex-wrap: wrap`, `row-gap` e `padding-block`
pequenos, e os filhos diretos ganham `min-width: 0`. Em larguras onde tudo
cabe, a disposição não muda; em 390px o conteúdo excedente passa para uma
segunda linha dentro do cabeçalho.

Premissa registrada: a quebra em segunda linha é preferida a truncar ou ocultar
controles, porque o shell não conhece o conteúdo (pode haver ações críticas) e
ocultar ações sem acesso alternativo prejudicaria a acessibilidade. Se o
mantenedor preferir ocultar itens em telas estreitas, essa decisão cabe à
aplicação, que compõe o cabeçalho, e a story já exemplifica isso.

Alternativas descartadas:

- _`overflow-x: auto` no cabeçalho_: esconde ações atrás de rolagem horizontal
  dentro de uma barra sticky, ruim para teclado e toque.
- _Só corrigir a story_: o defeito está no contêiner e no `ThemeToggle`; qualquer
  consumidor com conteúdo largo estouraria a página do mesmo jeito.
- _`overflow: hidden`_: corta controles sem aviso.

**`ThemeToggle` com `font-sans` e `whitespace-nowrap`.** Mesmo mecanismo dos
demais controles da biblioteca; mantém o rótulo em uma linha e usa o token
público de fonte.

**Limites de Client e Server Components.** Sem mudança: `ThemeToggle` continua
Client Component; `formControlClasses` e o CSS do shell continuam compatíveis
com Server Components.

**Acessibilidade.** Sem mudança de papéis, nomes acessíveis, foco ou ARIA. A
quebra do cabeçalho preserva a ordem de leitura e de tabulação do DOM. A
verificação cobre tamanho de alvo e ausência de controles cortados em 390px.

**Tailwind, tokens e CSS distribuído.** Só classes estáticas e o CSS do pacote
admin; nenhum token novo. `box-border`, `font-sans` e `whitespace-nowrap` já são
gerados pelo build do pacote de componentes; o impacto no tamanho do bundle é
desprezível.

**Conflitos de CSS com aplicações.** As mudanças ficam em classes `ads-*` e em
utilidades do CSS compilado; não há seletor global, então não há conflito com o
CSS da aplicação.

## Risks / Trade-offs

- Aplicações que, sem saber, compensavam a largura de 26px dos campos verão os
  campos mais estreitos (passam a caber no contêiner). Mudança intencional,
  registrada no `CHANGELOG.md`.
- O cabeçalho passa a crescer em altura em telas estreitas quando o conteúdo
  quebra para uma segunda linha; `min-height: 4rem` e o cabeçalho `sticky` se
  mantêm. `.ads-admin-shell-body` usa `min-height: calc(100vh - 4rem)`, então a
  altura extra pode gerar rolagem vertical mínima em páginas curtas.
- Snapshots visuais do admin demo em 390px e do Admin Shell móvel podem mudar;
  só devem ser atualizados após revisão do diff, conforme `AGENTS.md`. O
  baseline é do Chromium/Linux, e a validação visual deve ser feita no ambiente
  da CI.
- Os testes de geometria dependem de CSS compilado e de navegador real, não de
  jsdom; ficam no Playwright.
