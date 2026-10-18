# Proposal

## Why

Uma varredura com Playwright em todas as stories do Storybook (65 stories, temas
claro e escuro, 1280px e 390px) encontrou dois defeitos de layout reais em
`@admin-ds/components` e `@admin-ds/admin`:

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
  linhas e o título "Admin Abril" em 2. O contêiner `.ads-admin-shell-header` é
  `display: flex` sem quebra de linha, e o conteúdo composto pela aplicação não
  tem como encolher abaixo da largura natural.

Isso descumpre a diretriz de que os componentes funcionem em diferentes tamanhos
de tela.

## What Changes

**Biblioteca reutilizável**

- `packages/components`: `formControlClasses` passa a incluir `box-border`, para
  que a largura de `w-full` inclua padding e borda em `AdsInput`, `AdsTextarea`
  e demais controles que o usam.
- `packages/admin`: `.ads-admin-shell-header` passa a quebrar linha quando o
  conteúdo não cabe e a permitir que seus filhos diretos encolham, sem causar
  rolagem horizontal da página.
- `packages/components`: `ThemeToggle`, usado no cabeçalho, passa a usar a fonte
  do design system e a manter o rótulo em uma linha. Hoje ele é um `<button>`
  sem fonte herdada, que cai na fonte padrão do navegador e quebra em 3 linhas
  em 66px de largura.
- Testes de classes e de CSS distribuído, e testes de geometria no navegador
  para os dois casos.

**Aplicações de demonstração e documentação**

- Storybook: a story do Admin Shell passa a compor o cabeçalho de forma
  responsiva (por exemplo, sem exibir o selo de ambiente em larguras estreitas)
  e ganha uma verificação em 390px.
- Admin demo: nenhuma mudança de código esperada; ele apenas confirma que o
  resultado não muda onde o reset global já existe e que o cabeçalho cabe em
  390px.

## Objetivos e fora do escopo

Objetivos: controles de texto contidos na largura do campo sem exigir reset de
CSS do consumidor; cabeçalho do shell sem rolagem horizontal em 390px; nenhuma
mudança de API pública.

Fora do escopo: rolagem horizontal das stories de documentação
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
- `admin-shell-layout`: adiciona o requisito de que o cabeçalho do shell não
  provoque rolagem horizontal em larguras estreitas.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/components` (classes de `AdsInput`,
  `AdsTextarea`, `AdsSelect` via `formControlClasses`, e de `ThemeToggle`) e
  `@admin-ds/admin` (CSS de `AdsAdminShell.Header`). Nenhuma prop, tipo, export,
  classe `ads-*` ou variável `--ads-*` muda; compatibilidade retroativa
  preservada. A aparência muda de forma intencional só onde o consumidor não tinha
  reset de `box-sizing` ou onde o cabeçalho antes estourava a largura.
- **Dependências**: nenhuma.
- **Consumidores**: campos de texto deixam de invadir colunas vizinhas e o
  cabeçalho do shell cabe em telas estreitas, sem configuração adicional.
