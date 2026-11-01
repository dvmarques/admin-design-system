# Design

## Context

`formControlClasses` (`packages/components/src/form-control-classes.ts`) é usado por
`AdsInput`, `AdsTextarea` e `AdsSelect`. Em `sm` aplica
`min-h-[var(--ads-dimension-field-sm)] px-2 py-1 text-sm`, e `--ads-dimension-field-sm`
vale `1.75rem` (28px), definido em `packages/tokens/source/tokens.mjs`.

Medido com os componentes reais e o CSS distribuído (Chromium 141):

| `size` | `AdsInput` | `AdsSelect` | mínimo (`field-*`) |
| ------ | ---------- | ----------- | ------------------ |
| `sm`   | 30px       | 28px        | 28px               |
| `md`   | 32px       | 32px        | 32px               |
| `lg`   | 36px       | 36px        | 36px               |

O `AdsInput` tem `line-height: 20px` (`text-sm`), então em `sm` o conteúdo soma
20 + 8 (`py-1`) + 2 (borda) = 30px e passa do mínimo. Em `md` e `lg` o conteúdo
(30px e 34px) fica abaixo do mínimo, e o mínimo domina nos dois campos. O
`<select>` nativo mantém `line-height: normal` mesmo com `line-height: 20px !important`,
então o conteúdo dele fica abaixo de 28px e a altura cai para o piso.

Por consequência, o token `--ads-dimension-field-sm` não representa a altura real do
campo pequeno: o `AdsInput` ultrapassa o piso. Os botões (`--ads-dimension-control-*`)
medem 32, 36 e 40px, 2 a 4px acima dos campos de mesmo tamanho.

## Goals / Non-Goals

**Goals:**

- `AdsSelect` e `AdsInput` com a mesma altura em `sm`, `md` e `lg`.
- Orientação documentada para botões ao lado de campos.
- Nenhuma mudança de API pública, de nome de token, de classe `ads-*` ou de variável
  `--ads-*`.

**Non-Goals:**

- Alterar `--ads-dimension-control-*` ou os tokens `--ads-dimension-field-md/lg`.
- Reduzir a altura do `AdsInput` em `sm`.
- Mudar a API de `AdsButton` ou `AdsInputGroup`.

## Decisions

**Subir `--ads-dimension-field-sm` de `1.75rem` para `1.875rem` (30px).** O token passa a
descrever a altura real do campo pequeno: o `AdsInput` continua com 30px (agora igual
ao mínimo), o `AdsSelect` sobe de 28 para 30px e o `AdsTextarea` não muda. A correção
fica na fonte única dos tokens, sem lógica nova nos componentes, e quem sobrescreve o
token continua controlando a altura mínima. A spec `design-tokens` só protege remoção e
renomeação de tokens públicos como alteração incompatível; mudar o valor não é coberto,
e a mudança é registrada no `CHANGELOG.md`.

Alternativas descartadas:

- _Igualar pelo `line-height` do select_: o Chromium mantém `line-height: normal` no
  `<select>` mesmo com `!important`, medido; não é possível.
- _Compensar só no select com `min-h-[calc(var(--ads-dimension-field-sm)+0.125rem)]`_:
  valor mágico acoplado ao `py-1` e ao `line-height` do input; quem sobrescrever o token
  teria o select 2px acima do mínimo declarado.
- _Reduzir o `AdsInput` `sm` para 28px com `leading-4`_: `formControlClasses` também serve
  ao `AdsTextarea`, cujas linhas ficariam apertadas, e a altura do input mudaria em todos
  os consumidores.
- _Mudar os tokens de controle ou de campo `md` e `lg`_: afetaria todos os botões e
  campos e os snapshots.

**Documentar, e não alterar, a diferença entre botão e campo.** Botão e campo têm papéis
diferentes: os botões compartilham a altura de controle com tabs, paginação e outros
controles. Igualar campo e botão mudaria todos eles. A orientação cobre o caso de
consumidor: usar `align-items: stretch` (o padrão de `display: flex`) para que os dois
tenham a mesma altura na linha, ou alinhar pelo topo e aceitar 2 a 4px de diferença.
Colocar um `AdsButton` em `startContent` ou `endContent` de `AdsInputGroup` faz o campo
crescer para 34, 38 e 42px, porque o adendo tem padding horizontal e borda de 1px e
estica a linha, e duplica a borda; a orientação é usar uma linha própria com o botão
ao lado do grupo. O próprio `AdsDatePicker` usa o mecanismo de esticar a âncora do
gatilho até a altura da linha (change `fix-date-picker-trigger-height`).

**Limites de Client e Server Components.** Sem mudança.

**Acessibilidade.** Sem mudança de papéis, nomes acessíveis, foco ou teclado. A altura do
`AdsSelect` `sm` passa de 28 para 30px, acima do mínimo de 24px de alvo da WCAG 2.2
(critério 2.5.8).

**Tailwind, tokens e CSS distribuído.** Só o valor de um token; nenhum token novo e
nenhuma classe nova. O `tokens.css` e o `generated.ts` são regenerados pelo script do
pacote, e `check:generated` valida a sincronia. Impacto no tamanho do bundle desprezível
(um caractere a mais em `1.875rem`).

**Conflitos de CSS com aplicações.** Nenhum seletor novo; o token é um `--ads-*`.

## Risks / Trade-offs

- `AdsSelect` `sm` fica 2px mais alto. Mudança intencional, registrada no `CHANGELOG.md`.
- Consumidores que fixaram a altura de um `AdsSelect` `sm` com base em 28px verão 2px a
  mais; improvável, e quem sobrescreve o token não é afetado.
- Snapshots visuais que incluam um `AdsSelect` `sm` podem mudar; só devem ser atualizados
  após revisão do diff, conforme `AGENTS.md`. Nenhuma story, página do demo ou componente
  do `admin` renderiza `AdsSelect` com `size` hoje (verificado por busca no código), então
  não espero mudança nos baselines existentes; a CI confirma, e o workflow "Atualizar
  baselines visuais" regenera os baselines Linux se necessário. A story de tamanhos nova
  não tem snapshot.
- A orientação documentada não impede que um consumidor ainda coloque um botão no
  adendo de `AdsInputGroup`; ela apenas informa o efeito.
