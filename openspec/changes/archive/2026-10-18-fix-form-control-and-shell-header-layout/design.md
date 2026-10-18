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
`padding-inline`. O conteúdo é composto pela aplicação (gatilhos de navegação,
título, selo de ambiente, `ThemeToggle` e botão de conta). Na story, em 390px,
o grupo de ações não pode quebrar linha e soma 412px, e a página rola 22px.
`ThemeToggle` (`packages/components/src/theme-toggle.tsx`) é um `<button>` com
`rounded-md border px-3 py-2 text-text`, sem `font-sans` nem
`whitespace-nowrap`: sem preflight, `<button>` não herda `font-family`, e o
rótulo "Usar tema escuro" quebra em 3 linhas em 66px.

O admin demo, com o mesmo CSS do cabeçalho, já cabe em 390px: 64px de altura em
uma linha, com o título encolhendo e quebrando em 2 linhas.

## Goals / Non-Goals

**Goals:**

- Controles de texto contidos na largura do campo, sem exigir reset do consumidor.
- `ThemeToggle` com a fonte do design system e rótulo em uma linha.
- Cabeçalho do shell composto na story e no demo sem rolagem horizontal em 390px e
  sem controles cortados, com a orientação de composição documentada.
- Nenhuma mudança de API pública, de classe `ads-*` ou de variável `--ads-*`.

**Non-Goals:**

- Distribuir um reset global de `box-sizing` ou o preflight do Tailwind.
- Prescrever o conteúdo do cabeçalho: o shell continua sem regras de domínio.
- Alterar o CSS de `.ads-admin-shell-header`.
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

**Não alterar o CSS do cabeçalho do shell.** O plano inicial previa
`flex-wrap: wrap` e `min-width: 0` nos filhos diretos. As alternativas foram
medidas no Storybook e no admin demo (390px):

- _`flex-wrap: wrap`_: elimina o estouro, mas muda o que já funcionava. No demo o
  cabeçalho passa de 64px (uma linha, título encolhendo) para 99px (duas linhas),
  porque, com quebra de linha, os itens preferem a largura natural a encolher. Isso
  altera o snapshot visual do Admin Shell móvel, cujo baseline é do Chromium/Linux
  da CI e não pode ser regenerado de forma confiável fora dela.
- _Só `min-width: 0`_: sem ganho útil. O gatilho de navegação já encolhe até 34px
  sem ele e vai a 29px com ele; o título quebra em duas linhas e as ações empilham.
- _`overflow-x: auto` ou `overflow: hidden`_: escondem ou cortam ações, ruim para
  teclado e toque.

A causa do estouro está no conteúdo composto, e a correção fica ali:
`ThemeToggle` passa a ter `font-sans` e `whitespace-nowrap`, e a story compõe o
grupo de ações com `flex-wrap`. Medido nas 6 stories do shell, sem tocar no CSS do
cabeçalho: nenhuma rolagem horizontal em 390px nem em 1280px, e altura de 65px em
telas largas, igual à original.

Consequência aceita: a biblioteca não protege um consumidor que ponha no cabeçalho
conteúdo que não encolhe nem quebra linha. A orientação fica em
`docs/integration.md`. Se no futuro o mantenedor preferir que o contêiner quebre
linha, `flex-wrap` pode ser adotado em uma change própria, com revisão dos
snapshots na CI.

**`ThemeToggle` com `font-sans` e `whitespace-nowrap`.** Mesmo mecanismo dos
demais controles da biblioteca; mantém o rótulo em uma linha e usa o token
público de fonte.

**Limites de Client e Server Components.** Sem mudança: `ThemeToggle` continua
Client Component; `formControlClasses` e o CSS do shell continuam compatíveis
com Server Components.

**Acessibilidade.** Sem mudança de papéis, nomes acessíveis, foco ou ARIA. A
quebra do cabeçalho preserva a ordem de leitura e de tabulação do DOM. A
verificação cobre tamanho de alvo e ausência de controles cortados em 390px.

**Tailwind, tokens e CSS distribuído.** Só classes estáticas; nenhum token
novo. `box-border`, `font-sans` e `whitespace-nowrap` já são
gerados pelo build do pacote de componentes; o impacto no tamanho do bundle é
desprezível.

**Conflitos de CSS com aplicações.** As mudanças ficam em classes `ads-*` e em
utilidades do CSS compilado; não há seletor global, então não há conflito com o
CSS da aplicação.

## Risks / Trade-offs

- Aplicações que, sem saber, compensavam a largura de 26px dos campos verão os
  campos mais estreitos (passam a caber no contêiner). Mudança intencional,
  registrada no `CHANGELOG.md`.
- Um consumidor que componha no cabeçalho conteúdo que não encolhe nem quebra linha
  continua podendo estourar a largura em telas estreitas; é uma responsabilidade
  de composição, documentada em `docs/integration.md`.
- `ThemeToggle` ganha `whitespace-nowrap`: em uma largura muito estreita o botão
  não encolhe abaixo do rótulo e depende do contêiner para quebrar linha.
- Snapshots visuais do admin demo podem mudar onde `ThemeToggle` aparece e onde o
  `box-border` altera campos; só devem ser atualizados após revisão do diff,
  conforme `AGENTS.md`. O baseline é do Chromium/Linux, e a validação visual deve
  ser feita no ambiente da CI.
- Os testes de geometria dependem de CSS compilado e de navegador real, não de
  jsdom; ficam no Playwright.
