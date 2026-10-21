## Context

`AdsMetricCard` (`packages/admin/src/dashboard.tsx`) renderiza título, valor, variação (`change`, `trend`, `trendLabel`, `sentiment`), descrição, progresso e estados `loading`, `error` e `empty`. Os tokens `--ads-color-chart1`…`8` (contraste 3:1 sobre `surface`) e `--ads-color-success` e `--ads-color-danger` existem nos dois temas, e `forced-colors`, `prefers-contrast` e `prefers-reduced-motion` já são tratados nos pacotes.

## Decisions

**Onde vive.** `AdsSparkline` é público em `@admin-ds/components`: é uma visualização genérica, sem regra de negócio e útil fora de dashboards (tabelas, listas). O `AdsMetricCard` apenas o compõe pela prop `sparkline`. Alternativas descartadas: interno em `packages/admin` (não reutilizável) e público em `packages/admin` (acopla visualização a layout administrativo).

**API.** `values: readonly (number | null | undefined)[]`, `min` e `max` opcionais para fixar a escala, `labels` opcional (um texto por posição de `values`), `tone` (`default`, `positive`, `negative`), `label` (nome da série no texto acessível, padrão "Tendência"), `summary` (substitui o texto acessível inteiro) e `formatValue` (padrão `Intl.NumberFormat('pt-BR')`). Aceita os atributos do `<svg>` exceto `children`. Em `AdsMetricCard`, `sparkline` recebe as mesmas props menos `tone`, que vem do `sentiment` do card (`positive` e `negative` colorem; `neutral` ou ausente usam `default`).

**Dados.** Valores não finitos (`null`, `undefined`, `NaN`, `±Infinity`) são ignorados, e a posição horizontal segue o índice original em `values`, de modo que a linha continua entre os pontos válidos preservando o espaçamento temporal. Zero pontos válidos: o componente não renderiza nada (o consumidor trata o vazio; no card, o sparkline é omitido e `empty` continua sendo explícito). Um ponto válido: só o marcador, na posição do seu índice. Série constante, ou `max <= min` depois de aplicar `min` e `max`: linha reta no meio. Valores fora de `[min, max]` são limitados às bordas. Alternativa descartada: lançar `RangeError` como `AdsProgress`, por ser uma visualização decorativa que não deve derrubar a renderização no servidor.

**Desenho.** SVG com `viewBox="0 0 100 32"`, `preserveAspectRatio="none"` e `vector-effect: non-scaling-stroke`, de modo que a largura segue o contêiner (100%) sem `ResizeObserver` e o traço não deforma. O marcador do último ponto (e do ponto único) é um segmento de comprimento zero com `stroke-linecap: round`, que continua circular mesmo com a escala não uniforme. As coordenadas são arredondadas a duas casas para o HTML do servidor ser determinístico. Sem animação, então movimento reduzido não precisa de tratamento.

**Alternativa textual.** O `<svg>` usa `role="img"` e `aria-label`. Texto gerado: com dois ou mais pontos, `"<label>: <n> pontos, de <primeiro> a <último>, mínimo <mín>, máximo <máx>."`; com um ponto, `"<label>: 1 ponto, valor <v>."`. Quando `labels` está presente, o rótulo do primeiro e do último ponto entra entre parênteses. `summary` substitui tudo. O texto usa os dados reais (não os limites de escala). Alternativa descartada como padrão: tabela oculta com todos os pontos (verbosa e sem ganho para uma tendência); pode ser feita pelo consumidor com `summary` e conteúdo próprio.

**Cor.** A cor vem de `currentColor` com `color` definido por `data-tone`: `--ads-color-chart1` (padrão), `--ads-color-success` e `--ads-color-danger`. Os três têm de ter 3:1 contra `surface` e `surfaceRaised` (WCAG 1.4.11); `chart1` já é testado, e `success` e `danger` entram em `contrast-pairs.mjs`. A cor nunca é a única informação: o card mantém ícone e texto da variação e o sparkline tem texto alternativo. Em `forced-colors: active`, o traço usa `CanvasText`.

**Estados do card.** `loading` mostra um `AdsSkeleton` com a altura do sparkline (só quando `sparkline` é informado) para evitar salto de layout; `error` e `empty` não mostram sparkline.

**Cliente x servidor, estilos e distribuição.** Sem `"use client"`, hooks nem eventos: funciona em Server Components e hidrata sem diferença. As regras CSS ficam em `packages/components/src/styles.css` com classes `ads-sparkline*`, e o do card em `packages/admin/src/styles.css` (`ads-metric-card-sparkline`, `ads-metric-card-skeleton-sparkline`); Tailwind continua interno. Sem dependência de runtime nova; os baselines de tamanho de `@admin-ds/components` e `@admin-ds/admin` são atualizados se passarem da tolerância.

**Indicador de variação.** Não muda de API: já cumpre os critérios (ícone decorativo, texto acessível, cor pelo `sentiment`). O trabalho é cobrir com testes e story o caso de `sentiment` invertido e usá-lo na demo.

## Risks / Trade-offs

- `preserveAspectRatio="none"` estica a linha horizontalmente com a largura do card; mitigado por `non-scaling-stroke` e por altura fixa.
- O resumo textual descreve a tendência de forma estatística, não cada ponto; quem precisa dos pontos usa `summary` ou uma tabela própria.
- `Intl.NumberFormat('pt-BR')` depende do ICU do ambiente; o Node usado na CI e o navegador têm o locale, e o consumidor pode trocar com `formatValue`.
