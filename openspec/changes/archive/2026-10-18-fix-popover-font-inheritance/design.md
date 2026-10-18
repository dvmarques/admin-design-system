# Design

## Context

Os overlays ancorados usam `OverlayPortal` (`overlay-utils.tsx`), que renderiza
no `body` e copia `data-theme` do ancestral. Tema e cores chegam ao portal por
variáveis CSS e pelo atributo copiado, mas `font-family` é uma propriedade
herdada: o portal só a recebe do `body`.

Estado observado (Storybook, tema escuro, painel principal em portal):

- `AdsDialog`, `AdsDrawer`, `AdsTooltip`, `AdsDropdown` e `AdsToast` declaram
  `font-sans` no painel (`--font-sans` mapeia `--ads-typography-font-family` em
  `styles.css`).
- O painel de `AdsPopover` (`overlay-anchored.tsx`) declara `text-text` mas não
  `font-sans`. `AdsButton` e `.ads-date-picker__day` usam `[font-family:inherit]`,
  então herdam `Times New Roman` do `body`.
- `AdsDatePicker` renderiza o calendário em `AdsPopover`, por isso o defeito é
  compartilhado e a correção é um único ponto.
- No admin demo o `body` define a fonte, o que mascara o problema.

## Goals / Non-Goals

**Goals:**

- Popover e calendário com a fonte do design system sem depender do `body`.
- Alinhar o painel do popover ao padrão dos outros overlays.
- Nenhuma mudança de API pública, de classe `ads-*` ou de variável `--ads-*`.

**Non-Goals:**

- Alterar valores de tokens ou criar tokens.
- Definir `font-family` no `body` ou em `:root` pela biblioteca, o que afetaria
  aplicações consumidoras.
- Revisar overlays que já declaram `font-sans`.

## Decisions

**Adicionar `font-sans` ao painel do `AdsPopover`.** É o mesmo mecanismo dos
demais painéis, usa o token público e é estaticamente analisável. Sem classes
dinâmicas e sem novas dependências.

Alternativas descartadas:

- _`font-family` no `OverlayPortal`_: mexeria em todos os overlays, inclusive nos
  que já declaram a fonte, sem ganho para o caso corrigido.
- _`font-family` em `:root` ou `.ads-*` global_: a biblioteca passaria a impor
  fonte à aplicação consumidora, contra o contrato de não afetar estilos externos.
- _Corrigir só `AdsDatePicker`_: deixaria `AdsPopover` com o defeito para outros
  consumidores.

**Limites de Client e Server Components.** Sem mudança: `overlay-anchored.tsx`
continua sendo Client Component.

**Acessibilidade.** Sem mudança de papéis, foco ou ARIA; a verificação cobre apenas
a tipografia.

**Tailwind e CSS distribuído.** `font-sans` já é usada por outros componentes e
está no `dist/styles.css`; não há novo tamanho de bundle relevante. Como o painel
usa classe com prefixo da biblioteca no CSS compilado, não há conflito com o CSS
da aplicação.

## Risks / Trade-offs

- Aplicações que dependiam, sem saber, da fonte do navegador no popover verão a
  fonte do design system. Mudança intencional, registrada no `CHANGELOG.md`.
- Snapshots visuais de popover ou datepicker podem mudar onde o `body` não define
  a fonte; só devem ser atualizados após revisão do diff, conforme `AGENTS.md`.
