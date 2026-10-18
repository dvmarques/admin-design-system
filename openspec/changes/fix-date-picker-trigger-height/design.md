# Design

## Context

`AdsDatePicker` (`packages/components/src/date-picker.tsx`) renderiza uma linha
`flex w-full items-center gap-2` com o campo (ou dois, no intervalo) e o gatilho
do calendário. O gatilho é um `AdsButton` `variant="secondary"` com o mesmo `size`
do campo.

Os tamanhos divergem por token:

- `AdsInput` (`formControlClasses`): `min-h-[var(--ads-dimension-field-*)]`, que vale
  28, 32 e 36px em `sm`, `md` e `lg`.
- `AdsButton` (`buttonSizes`): `min-h-[var(--ads-dimension-control-*)]`, que vale
  32, 36 e 40px.

O botão não tem padding vertical (`buttonBase` não define `py-*`), então a altura
vem só do `min-h` e fica 4px acima da do campo em todos os tamanhos. Com
`items-center`, o campo é centralizado e desce 2px em relação à linha. Medido no
Storybook (`layout-filterbar--default`, 1280px): "Busca" e "Status" no topo em 93px
e altura 32px; o campo de data no topo em 95px e o gatilho no topo em 93px com
altura 36px.

## Goals / Non-Goals

**Goals:**

- Gatilho do calendário com a altura do campo em `sm`, `md` e `lg`.
- Campo de data alinhado ao topo dos controles vizinhos de mesmo `size`.
- Nenhuma mudança de API pública, de classe `ads-*` ou de variável `--ads-*`.

**Non-Goals:**

- Alterar tokens `--ads-dimension-*` ou criar tamanho novo em `AdsButton`.
- Auditar outros usos de `AdsButton` ao lado de `AdsInput`.

## Decisions

**Sobrescrever a altura mínima do gatilho com o token de campo, com `!`.** O
gatilho recebe, por mapeamento explícito de `size`, a utilidade
`min-h-[var(--ads-dimension-field-{size})]!`. O mapeamento é estático, como pede o
projeto, e não monta classe por concatenação.

O modificador `!` é necessário: duas utilidades `min-h-[...]` conflitantes saem em
ordem alfabética no CSS compilado (`control-*` antes de `field-*`). Sem `!`, o
resultado dependeria dessa coincidência de nomes; o experimento com o Tailwind
`4.3` do projeto confirmou a ordem e que `!` gera `!important`. O mesmo tipo de
conflito já quebrou o estado ativo das abas em uma change anterior
(`fix-navigation-theme-contrast`).

Alternativas descartadas:

- _`items-start` na linha_: alinha o topo do campo, mas o gatilho continua 4px mais
  alto que o campo e a linha cresce 4px abaixo; não corrige a aparência.
- _`items-stretch`_: o campo esticaria até 36px e deixaria de ter a altura dos
  vizinhos.
- _Novo tamanho ou prop em `AdsButton`_: mudaria a API pública para resolver um caso
  interno do seletor.
- _Alterar os tokens de controle ou de campo_: afetaria todos os botões e campos.
- _Sobrescrever sem `!`_: depende da ordem alfabética das utilidades.

**Limites de Client e Server Components.** Sem mudança: `AdsDatePicker` continua
Client Component.

**Acessibilidade.** Sem mudança de papéis, nome acessível (`labels.openCalendar`),
foco ou teclado. O alvo do gatilho passa de 36px para 32px em `md`
(28px em `sm`, 36px em `lg`); `md` e `lg` continuam acima do mínimo de 24px de
alvo da WCAG 2.2 (critério 2.5.8). `sm` fica em 28px, também acima de 24px.

**Tailwind, tokens e CSS distribuído.** Só classes estáticas, consumindo o token
público `--ads-dimension-field-*`; nenhum token novo. As três utilidades com `!`
entram no CSS distribuído, com impacto desprezível no tamanho do bundle.

**Conflitos de CSS com aplicações.** A regra usa a classe utilitária no gatilho
(`ads-date-picker__trigger`), sem seletor global.

## Risks / Trade-offs

- O gatilho do calendário fica 4px mais baixo. Mudança intencional, registrada no
  `CHANGELOG.md`.
- Snapshots visuais que incluem o gatilho (por exemplo, páginas do demo com
  `AdsFilterBar` e datas) podem mudar; só devem ser atualizados após revisão do diff,
  conforme `AGENTS.md`. O workflow "Atualizar baselines visuais" regenera os
  baselines Linux na CI, a validação visual deve ser feita lá.
- `!important` em um utilitário de altura impede que o consumidor sobrescreva a
  altura do gatilho por `className` sem o mesmo modificador. É aceitável: o gatilho
  existe para acompanhar a altura do campo.
