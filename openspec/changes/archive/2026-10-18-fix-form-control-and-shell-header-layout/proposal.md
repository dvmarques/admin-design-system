# Proposal

## Why

Uma varredura com Playwright em todas as stories do Storybook (65 stories, temas
claro e escuro, 1280px e 390px) encontrou dois defeitos de layout reais, o
primeiro em `@admin-ds/components` e o segundo na composição do cabeçalho do
`AdsAdminShell` (`@admin-ds/admin`) com componentes da biblioteca:

- `<input>` e `<textarea>` com `.ads-form-control` ficam 26px mais largos que o
  `.ads-field` que os contém (12px de padding e 1px de borda de cada lado). No
  `AdsFilterBar` o campo "Busca" invade 10px da coluna do "Status"; o mesmo
  transbordo aparece em `form-controls`, `adminflows` e `AdsSmartTable` com
  filtros. O `<select>` não sofre, porque o navegador o renderiza com
  `border-box`. O admin demo esconde o defeito com `* { box-sizing: border-box }`
  no `globals.css`; a biblioteca não distribui reset, então qualquer aplicação
  consumidora sem esse reset vê o problema.
- O cabeçalho do `AdsAdminShell` em 390px faz a página rolar 22px na
  horizontal: o botão "Conta" fica cortado, "Usar tema escuro" quebra em 3
  linhas e o título "Admin Abril" em 2. A causa está no conteúdo composto no
  cabeçalho: o `ThemeToggle` da biblioteca é um `<button>` sem fonte herdada e
  sem `whitespace-nowrap`, e o grupo de ações da story não pode quebrar linha.

Isso descumpre a diretriz de que os componentes funcionem em diferentes tamanhos
de tela.

## What Changes

**Biblioteca reutilizável**

- `packages/components`: `formControlClasses` passa a incluir `box-border`, para
  que a largura de `w-full` inclua padding e borda em `AdsInput`, `AdsTextarea`
  e demais controles que o usam.
- `packages/components`: `ThemeToggle`, usado no cabeçalho, passa a usar a fonte
  do design system e a manter o rótulo em uma linha. Hoje ele é um `<button>`
  sem fonte herdada, que cai na fonte padrão do navegador e quebra em 3 linhas
  em 66px de largura.
- Testes de classes e de CSS distribuído, e testes de geometria no navegador
  para os dois casos.

**Aplicações de demonstração e documentação**

- Storybook: a story do Admin Shell passa a compor o grupo de ações do cabeçalho
  de forma que ele quebre linha em larguras estreitas.
- Documentação: `docs/integration.md` registra que o conteúdo composto no
  cabeçalho do shell deve poder quebrar linha ou encolher em telas estreitas.
- Admin demo: nenhuma mudança de código esperada; ele apenas confirma que o
  resultado não muda onde o reset global já existe e que o cabeçalho cabe em
  390px (verificação adicionada ao E2E).

## Objetivos e fora do escopo

Objetivos: controles de texto contidos na largura do campo sem exigir reset de
CSS do consumidor; `ThemeToggle` com a fonte do design system e rótulo em uma
linha; cabeçalho do shell sem rolagem horizontal em 390px com a composição
documentada; nenhuma mudança de API pública.

Fora do escopo: alterar o CSS de `.ads-admin-shell-header` (`flex-wrap` e `min-width: 0` foram
avaliados e descartados, ver `design.md`); rolagem horizontal das stories de documentação
`foundation-components--surfaces` e `--tokens`; ajuste de 2–3px do SVG de
`AdsLoadingIndicator`; alinhamento vertical de 2px do campo "Criado em" no
`AdsFilterBar` (reavaliar após o `box-border`); distribuir um reset global de
`box-sizing`; novo conteúdo ou props no cabeçalho do shell.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `form-controls`: adiciona o requisito de que controles textuais ocupem no
  máximo a largura do contêiner, independentemente do reset de CSS do consumidor.
- `admin-shell-layout`: adiciona o requisito de que o controle de tema do
  cabeçalho use a tipografia do design system com o rótulo em uma linha e de que
  um cabeçalho composto com conteúdo responsivo caiba em larguras estreitas.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/components` (classes de `AdsInput`,
  `AdsTextarea`, `AdsSelect` via `formControlClasses`, e de `ThemeToggle`).
  `@admin-ds/admin` não muda. Nenhuma prop, tipo, export, classe `ads-*` ou
  variável `--ads-*` muda; compatibilidade retroativa preservada. A aparência muda
  de forma intencional só onde o consumidor não tinha reset de `box-sizing` e
  onde `ThemeToggle` caía na fonte padrão do navegador.
- **Dependências**: nenhuma.
- **Consumidores**: campos de texto deixam de invadir colunas vizinhas e
  `ThemeToggle` passa a usar a fonte do design system, sem configuração
  adicional. O conteúdo que a aplicação compõe no cabeçalho do shell continua sendo
  responsabilidade dela, com a orientação registrada na documentação.
