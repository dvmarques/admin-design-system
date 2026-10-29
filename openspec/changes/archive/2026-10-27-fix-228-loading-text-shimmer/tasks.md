# Tasks: fix-228-loading-text-shimmer

## 1. Implementação

- [x] 1.1 Comparar a implementação CSS atual com alternativas de gradiente e identificar limitações de contraste, especialmente dark.
- [x] 1.2 Corrigir base e gradiente de `AdsLoadingText` preservando velocidades e contratos públicos.
- [x] 1.3 Conferir compatibilidade com reduced motion, forced colors, RTL, fallback sem clip e tema sistema.

## 2. Testes e documentação

- [x] 2.1 Adicionar cobertura automatizada de regressão do CSS e do estado inativo.
- [x] 2.2 Testar visualmente em dark/light, comprimentos diferentes e Admin Demo; validar consumo do CSS compilado no Next.js.
- [x] 2.3 Registrar resultado e changelog com referências à #228.
- [x] 2.4 Executar formatação de arquivos, `npm run format`, `npm run validate`, `npm run test:e2e` e `openspec.cmd validate --all --strict`. Corrigir todas as falhas.

## 3. Revisão

- [x] 3.1 Revisar implementação e corrigir problemas encontrados, mantendo spec/design sincronizados.

## Evidências (27/10/2026)

- Implementação: duas camadas de `background-image` em `.ads-loading-text[data-loading='true']` (faixa de brilho sobre base opaca) e `--ads-loading-text-base`; a base é `color-mix` de `text-muted` com `surface` (77% de `text-muted` no claro e 42% no escuro, definidos por escopo de tema na variável `--ads-loading-text-muted-share`, como os tokens, inclusive em tema claro aninhado em raiz escura), com fallback `text-muted` sem `color-mix`; sem `use client`, API e velocidades (4s/2,5s/1,5s) inalteradas.
- 1.1: no tema escuro `text-muted` (#e2e8f0) e `text-primary` (#f8fafc) tinham razão de contraste de 1,18:1. Ajuste de 27/10 (referência do mantenedor, ~4,2:1 base/pico nos dois temas): escuro, base #707987 (42% muted + 58% surface) contra pico #f8fafc = 4,19:1 (antes 2,12:1 com base ~rgb(167,175,186)); claro, base #717c8c (77% muted + 23% surface) contra pico #0f172a = 4,23:1 (antes 2,36:1 com base #475569). Base contra superfície: 3,34:1 no escuro (#1e293b) e 4,23:1 no claro (#ffffff); pico contra superfície: 13,98:1 e 17,85:1. Todos os números desta linha são calculados pelos tokens, sem arredondar a mistura (3,336, 4,225, 4,191, 4,225, 13,982 e 17,853).
- 2.1: `packages/components/tests/loading-text-style.test.ts` (novo) e `loading-text-styles.test.ts` (ajustado) sobre `dist/styles.css`; `e2e/loading-text.spec.ts` ganhou teste de duas camadas nos dois temas.
- 2.1 (ajuste 4,2:1): `loading-text-style.test.ts` calcula, a partir dos tokens e das porcentagens do CSS, a razão base/pico (entre 4,1 e 4,3) nos dois temas e confirma os percentuais 77% (claro) e 42% (escuro), a ausência de paradas `transparent 0%/100%` redundantes e o escopo de tema como nos tokens.
- 2.2: inspeção no `/catalogo/loading-text` (build de produção do Admin Demo, Chromium) em claro, escuro, sistema escuro, `prefers-reduced-motion` e `forced-colors`, com capturas em fases 0/20/40/50/60/80% do ciclo. Resultado: a faixa clara é visível nos dois temas e percorre as letras sem salto de layout; com reduced motion o texto fica sólido; com forced colors usa a cor de sistema. O aceite estético final é do mantenedor (Daniel).
- 2.4 (Windows, `develop` 74b5def (#229) mesclada por merge no commit cf36f16, sem rebase): `npm run format`, `lint`, `build`, `typecheck`, `test:release` (28/28), `test:quiet` (70 arquivos, 1.189 testes), `scripts/quality-budget.test.mjs` (22/22, incluindo os 14 de `inspect:packages`), `inspect:packages`; E2E Chromium 411 passaram e 9 falharam, todos por falta de baseline `*-win32.png` (os baselines oficiais são Linux e a CI valida; os `*-win32.png` gerados foram descartados). `openspec.cmd validate --all --strict --no-interactive` (1.15.0) com a change ativa (59/59) e em cópia após `archive` simulado (58/58).
- Medição em pixels (build de produção, Chromium, `/catalogo/loading-text`): razão base/pico renderizada de 4,25:1 no claro (base rgb(113,124,139), pico rgb(14,22,42)) e 4,21:1 no escuro e no escuro do sistema (base rgb(112,121,135), pico rgb(248,250,253)); tema claro aninhado em raiz escura e escuro aninhado em raiz clara resolvem a mesma base que o tema do próprio escopo.

## Janela de bundle

Medido com `npm run build` limpo e `npm run inspect:packages`: `develop` (74b5def, #229) contra esta branch (merge de `develop` + ajuste 4,2:1):

| Métrica                         | develop | PR      | Diferença | Limite  | Folga  |
| ------------------------------- | ------- | ------- | --------- | ------- | ------ |
| `components` JS+CSS (bytes)     | 190.139 | 190.716 | +577      | 191.250 | 534    |
| `components` JS+CSS (gzip)      | 58.350  | 58.474  | +124      | 62.700  | 4.226  |
| `components` dist total         | 434.167 | 434.744 | +577      | 470.830 | 36.086 |
| `admin-public` CSS (bytes)      | 91.551  | 92.123  | +572      | 93.000  | 877    |
| `admin-public` CSS (gzip)       | 13.660  | 13.787  | +127      | 13.800  | 13     |
| `components-public` CSS (bytes) | 51.945  | 52.517  | +572      | 54.800  | 2.283  |
| `components-public` CSS (gzip)  | 8.542   | 8.668   | +126      | 9.000   | 332    |

`tokens`, `admin` e `highlighted-code` ficaram idênticos ao `develop`. Limites alterados nesta PR: `components` JS+CSS de 190.250 (`develop`) para 191.250 (valor confirmado pelo mantenedor em 27/10/2026 às 19:18, horário de Brasília) e `admin-public` CSS de 91.600 para 93.000 (o CSS anterior desta PR já o excedia: 92.177 > 91.600). O gzip de `admin-public` (13 B de folga) e todos os demais limites permanecem inalterados.
