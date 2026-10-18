# Proposal

## Why

Ao validar overlays no Storybook com o tema escuro, o conteúdo de `AdsPopover`
e o painel de `AdsDatePicker` apareceram em `Times New Roman`, enquanto
`AdsDialog`, `AdsDrawer`, `AdsTooltip`, `AdsDropdown` e `AdsToast` usam a fonte
do design system.

Os overlays são renderizados em um portal no `body`, fora do ancestral que
define `font-family`. Os painéis que declaram `font-sans` não dependem desse
ancestral; o painel de `AdsPopover` (`overlay-anchored.tsx`) não declara, e os
controles filhos que usam `font-family: inherit` herdam a fonte padrão do
navegador. `AdsDatePicker` renderiza seu calendário dentro de `AdsPopover` e tem
o mesmo defeito. No admin demo o problema não aparece porque o `globals.css`
define a fonte no `body`; qualquer aplicação consumidora que não faça o mesmo
exibe o popover e o calendário em fonte serifada.

## What Changes

**Biblioteca reutilizável (`packages/components`)**

- `AdsPopover`: o painel passa a declarar `font-sans`, como os demais overlays.
  A correção também vale para `AdsDatePicker`, que reutiliza `AdsPopover`.
- Testes de classes do painel do popover e do calendário, e de existência de
  `font-sans` no CSS distribuído.

**Aplicações de demonstração e documentação**

- Nenhuma mudança de código no admin demo; ele apenas confirma que o resultado
  visual não muda onde o `body` já define a fonte.
- Verificação manual no Storybook (`apps/docs`) de que popover e datepicker usam
  a fonte do design system nos dois temas.

## Objetivos e fora do escopo

Objetivos: popover e calendário com a fonte do design system independentemente
do ancestral, sem mudar a API pública.

Fora do escopo: alterar tokens ou valores de fonte; definir fonte global no
`body` dos consumidores; novas props; revisão de outros componentes (os demais
overlays já declaram `font-sans`).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `anchored-overlays`: adiciona o requisito de que o conteúdo de overlays
  ancorados use a fonte do design system sem depender de ancestrais.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/components`, `AdsPopover` e, por
  reutilização, `AdsDatePicker`. Nenhuma prop, tipo, export, classe `ads-*` ou
  variável `--ads-*` muda; compatibilidade retroativa preservada. A aparência
  muda de forma intencional apenas onde o `body` não define a fonte.
- **Dependências**: nenhuma.
- **Consumidores**: popover e calendário passam a usar a fonte do design system
  sem configuração adicional.
