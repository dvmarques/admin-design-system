## Context

`AdsField`, `AdsInput` e `AdsPopover` já existem em `@admin-ds/components`. O date picker os compõe, sem acoplar a Next.js, a regras de negócio ou ao Tailwind na API pública.

## Goals / Non-Goals

### Goals

- Data única e intervalo, controlado e não controlado, com `min`/`max` e datas desabilitadas.
- Locale configurável (padrão `pt-BR`), acessível por teclado e leitores de tela.
- Hidratação determinística em Next.js.

### Non-Goals

- Hora, fusos horários, calendários não gregorianos e demonstração em `apps/admin-demo`.

## Decisions

### 1. Sem dependência de runtime

Nomes de meses e dias, formato e primeiro dia da semana vêm de `Intl.DateTimeFormat`/`Intl.Locale`. A aritmética de calendário usa `Date.UTC` e inteiros. Alternativas como `date-fns` ou `dayjs` aumentariam o bundle sem benefício, pois o escopo exclui fusos e calendários não gregorianos. Um fallback por região define o primeiro dia da semana quando `Intl.Locale#weekInfo` não existe; a prop `firstDayOfWeek` o sobrescreve.

### 2. Valores são strings ISO `AAAA-MM-DD`

O valor único é `string | null`; o intervalo é `AdsDateRange` (`{ start, end }`, ambos `string | null`). Strings evitam deslocamentos de fuso de `Date`, são serializáveis em Server Components e comparáveis lexicograficamente. `min`, `max` e `isDateDisabled` usam o mesmo formato. Anos válidos: 1000 a 9999.

### 3. API em união discriminada por `mode`

`mode="single"` (padrão) e `mode="range"` definem os tipos de `value`, `defaultValue` e `onValueChange`. Isso mantém um único componente sem props condicionais ambíguas. Os rótulos de interface (`labels`) têm padrões em pt-BR e podem ser sobrescritos para outros idiomas.

### 4. Composição e limites de cliente

`AdsDatePicker` é Client Component (`"use client"`). Compõe `AdsInput` para a entrada digitada e `AdsPopover` para o calendário, ancorado ao botão que o abre. Ele aceita `id`, `aria-describedby`, `aria-invalid` e `validationState`, os props injetados por `AdsField`; no intervalo, o `id` fica na entrada inicial.

### 5. Entrada digitada

O texto é validado ao perder o foco ou com `Enter`. Texto válido, dentro dos limites e não desabilitado vira valor (e é normalizado ao formato do locale); campo vazio limpa o valor; texto inválido não altera o valor e marca a entrada com `aria-invalid`. Alterações externas do valor controlado substituem o texto.

### 6. Calendário acessível

O calendário é um `role="grid"` nomeado pelo título do mês (`aria-live="polite"`), com células `gridcell`, `aria-selected` e um único botão com `tabindex=0` (foco móvel). Teclas: setas (dia/semana), `Home`/`End` (início/fim da semana), `PageUp`/`PageDown` (mês) e `Shift`+`PageUp`/`PageDown` (ano), `Enter`/`Espaço` selecionam. Datas fora dos limites ou desabilitadas usam `aria-disabled` e não são selecionáveis. O foco vai ao dia ativo ao abrir e volta ao acionador ao fechar (comportamento do `AdsPopover`). O mês inicial vem do valor, de `min`/`max` ou da data atual, esta lida apenas no cliente ao abrir.

### 7. Hidratação

A renderização inicial depende apenas de props e `Intl`; a data atual só é lida quando o calendário abre, após a montagem do portal. Assim servidor e cliente produzem o mesmo HTML.

### 8. Estilos

Classes `ads-date-picker*` e utilitários Tailwind estáticos compilados no CSS distribuído, com tokens existentes (superfícies, foco, `--ads-color-*`) e suporte aos temas claro e escuro. Em telas estreitas o popover usa a largura disponível.

## Risks / Trade-offs

- Intervalos podem conter datas desabilitadas; o consumidor valida regras de negócio.
- Sem seletor de hora e de fuso; o calendário gregoriano é o único suportado.
- Os snapshots visuais só têm baseline `win32` e são pulados fora do Windows; esta change não adiciona baseline visual novo e o comportamento é coberto por testes de componente e `axe`.
- Impacto no bundle: pequeno acréscimo no JS/CSS do pacote, dentro da margem do baseline.
