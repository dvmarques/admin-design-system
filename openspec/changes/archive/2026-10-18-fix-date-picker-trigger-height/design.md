# Design

## Context

`AdsDatePicker` (`packages/components/src/date-picker.tsx`) renderiza uma linha
`flex w-full items-center gap-2` com o campo (ou dois, no intervalo) e o gatilho
do calendário. O gatilho é um `AdsButton` `variant="secondary"` com o mesmo `size`
do campo.

Os tamanhos divergem por token:

- `AdsInput` (`formControlClasses`): `min-h-[var(--ads-dimension-field-*)]`, que vale
  28, 32 e 36px em `sm`, `md` e `lg`. É só altura mínima: a altura real também cresce
  com o padding e a linha (`py-1` + 20px + borda = 30px), então o campo mede 30, 32 e
  36px, e em `sm` o token (28px) não é a altura real.
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

**Esticar o gatilho até a altura da linha e anular o `min-h` do botão.** O gatilho
recebe `min-h-0!`, e a linha do seletor recebe `[&>.ads-popover-anchor]:self-stretch`.
O `AdsPopover` envolve o botão em um `<span class="ads-popover-anchor inline-flex">`,
que é o item da linha flex; esticar o `span` faz o botão (que estica dentro dele) ter
a altura da linha, que é a do campo, em qualquer tamanho. O seletor de filho tem
precedente em `field.tsx` (`[&>.ads-form-control]:rounded-l-none`), e as duas classes
são estáticas.

O modificador `!` é necessário em `min-h-0`: ele e o `min-h-[var(--ads-dimension-control-*)]`
do botão empatariam, e o vencedor dependeria da ordem das utilidades no CSS compilado
(o mesmo tipo de conflito que quebrou o estado ativo das abas em
`fix-navigation-theme-contrast`).

Primeira tentativa descartada: copiar o token de campo para o gatilho
(`min-h-[var(--ads-dimension-field-{size})]!`). O teste de geometria mostrou que não
iguala as alturas em `sm`, porque o campo mede 30px e o token vale 28px. Com a altura da
linha como referência, a igualdade vale por construção.

Alternativas descartadas:

- _Mapear o token de campo por `size`_: falha em `sm`, como descrito acima.
- _`self-stretch` apenas no botão_: o botão não é item da linha, e sim do `span` de
  âncora, então não tem efeito.
- _`items-start` na linha_: alinha o topo do campo, mas o gatilho continua mais alto
  que o campo e a linha cresce abaixo; não corrige a aparência.
- _`items-stretch` na linha_: exigiria recentralizar o separador do intervalo e muda a
  linha inteira para resolver um item.
- _Novo tamanho ou prop em `AdsButton`_: mudaria a API pública para resolver um caso
  interno do seletor.
- _Alterar os tokens de controle ou de campo_: afetaria todos os botões e campos.

**Limites de Client e Server Components.** Sem mudança: `AdsDatePicker` continua
Client Component.

**Acessibilidade.** Sem mudança de papéis, nome acessível (`labels.openCalendar`),
foco ou teclado. O alvo do gatilho passa de 36px para 32px em `md` (30px em `sm` e
36px em `lg`, que antes eram 32 e 40px), todos acima do mínimo de 24px de alvo da
WCAG 2.2 (critério 2.5.8).

**Tailwind, tokens e CSS distribuído.** Só classes estáticas; nenhum token novo. A
utilidade `min-h-0!` e a variante `[&>.ads-popover-anchor]:self-stretch` entram no CSS
distribuído, com impacto desprezível no tamanho do bundle.

**Conflitos de CSS com aplicações.** As regras ficam no gatilho e na linha do
seletor (`.ads-date-picker`), sem seletor global.

## Risks / Trade-offs

- O gatilho do calendário fica 4px mais baixo. Mudança intencional, registrada no
  `CHANGELOG.md`.
- Snapshots visuais que incluem o gatilho (por exemplo, páginas do demo com
  `AdsFilterBar` e datas) podem mudar; só devem ser atualizados após revisão do diff,
  conforme `AGENTS.md`. O workflow "Atualizar baselines visuais" regenera os
  baselines Linux na CI, a validação visual deve ser feita lá.
- `!important` em `min-h-0` impede que o consumidor sobrescreva a altura mínima do
  gatilho por `className` sem o mesmo modificador. É aceitável: o gatilho existe para
  acompanhar a altura do campo.
- A altura da linha passa a ser a do campo; se um consumidor aplicar `className` que
  aumente a altura do campo, o gatilho acompanha.
