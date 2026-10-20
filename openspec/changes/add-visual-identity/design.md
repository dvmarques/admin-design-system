## Context

`tokens.mjs` é a fonte única; o gerador emite `--ads-*` e metadados tipados. No tema escuro, `surfaceRaised`, `surfaceMuted` e `surfaceHover` valem `slate700`; só há `spacing` 1, 2, 3, 4, 6 e 8; não há cores para gráficos. A documentação `docs/visual-polish.md` cita valores de elevação que não são os reais.

## Decisions

**Superfícies escuras.** `surfaceRaised` permanece `slate700`. `surfaceMuted` ganha a nova referência `slate850` (`#162033`), entre `background` (`slate900`) e `surface` (`slate800`). `surfaceHover` ganha `slate650` (`#3d4b60`), entre `slate700` e `slate600`. A sugestão inicial da issue era `slate600` para o hover, mas `borderControl` (`slate400`) sobre `slate600` dá 2,96:1, abaixo dos 3:1 exigidos pelo par `borderControl` × `surfaceHover` já existente; `slate650` resulta em 3,5:1 e ainda é distinto de `surfaceRaised`. `text` e `textMuted` continuam cobertos pelos pares existentes, que já listam as três superfícies. Alternativa descartada: elevar `borderControl` do tema escuro, que mudaria todos os campos.

**Espaçamento.** Apenas adições (`5`, `10`, `12`, `16`); nenhum valor existente muda.

**Tokens de gráfico.** Oito papéis `chart1`…`chart8` por tema, como hexadecimais em `color.semantic.{light,dark}` (mesma convenção dos papéis de estado), emitidos como `--ads-color-chart-1`…`-8`. As cores foram escolhidas por busca entre as escalas 300 a 700 da paleta do Tailwind, com duas restrições: contraste mínimo de 3:1 contra `surface` e `surfaceRaised` (WCAG 1.4.11; as escolhidas passam de 4,5:1 sobre `surface`) e maior distância mínima entre pares sob simulação de visão. Método (automatizado em `packages/tokens/tests/chart-colors.test.mjs` e `color-vision.mjs`): matrizes de Machado et al. (2009), severidade 1,0, em RGB linear para protanopia, deuteranopia e tritanopia; distância ΔE (CIE76) em CIELAB; o teste exige ΔE mínimo de 10 entre quaisquer duas cores, em visão normal e nas três simulações. As cores por tema não têm correspondência de matiz entre si: a série `chartN` é só uma ordem de uso, não uma identidade semântica. Gráficos não devem depender só de cor: rótulos, padrões ou formas devem acompanhar a cor (regra documentada em `docs/visual-identity.md`). Alternativas descartadas: paleta Okabe-Ito (amarelo e laranja não atingem 3:1 sobre branco) e paletas sequencial e divergente (fora do escopo).

**Escala de marca e tipografia (pendentes).** Dependem da cor de marca e da fonte. Para a fonte, a escolha de empacotamento deverá registrar neste `design.md` a justificativa de dependência ou asset (`@font-face` + woff2 no pacote, Fontsource ou só token com fallback), o impacto no peso do CSS e o aviso no `CHANGELOG`.

**Cliente x servidor, acessibilidade e distribuição.** Nenhum componente muda; só tokens, documentação e uma story. O contraste é verificado por teste (`contrast-pairs.mjs`, com e sem `prefers-contrast: more`). Tailwind continua interno e os tokens novos têm prefixo `--ads-`, sem conflito com aplicações consumidoras e personalizáveis sem recompilar.

**Bundle.** Poucas linhas de variáveis CSS, sem dependências novas.

## Risks / Trade-offs

- `surfaceMuted` e `surfaceHover` mudam no tema escuro; baselines visuais que mostram essas superfícies mudam e precisam de revisão.
- A simulação de daltonismo é uma aproximação (CIE76 e modelo de Machado); a regra de não depender só de cor continua obrigatória.
