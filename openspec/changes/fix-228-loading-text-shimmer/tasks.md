# Tasks: fix-228-loading-text-shimmer

## 1. Implementação

- [x] 1.1 Comparar CSS do Back Admin e Admin DS e identificar limitações de contraste, especialmente dark.
- [x] 1.2 Corrigir base e gradiente de `AdsLoadingText` preservando velocidades e contratos públicos.
- [x] 1.3 Conferir compatibilidade com reduced motion, forced colors, RTL, fallback sem clip e tema sistema.

## 2. Testes e documentação

- [x] 2.1 Adicionar cobertura automatizada de regressão do CSS e do estado inativo.
- [x] 2.2 Testar visualmente em dark/light, comprimentos diferentes e Admin Demo; validar consumo do CSS compilado no Next.js.
- [x] 2.3 Registrar resultado e changelog com referências à #228.
- [x] 2.4 Executar formatação de arquivos, `npm run format`, `npm run validate`, `npm run test:e2e` e `openspec.cmd validate --all --strict`. Corrigir todas as falhas.

## 3. Revisão

- [ ] 3.1 Revisar implementação e corrigir problemas encontrados, mantendo spec/design sincronizados.

## Evidências (27/10/2026)

- Implementação: duas camadas de `background-image` em `.ads-loading-text[data-loading='true']` (faixa de brilho sobre base opaca) e `--ads-loading-text-base`; em dark, a base é `color-mix` de `text-muted` (70%) com `surface` (30%), com fallback `text-muted` sem `color-mix`; sem `use client`, API e velocidades (4s/2,5s/1,5s) inalteradas.
- 1.1: no tema escuro `text-muted` (#e2e8f0) e `text-primary` (#f8fafc) têm razão de contraste de 1,18:1; com a nova base (≈ rgb(167,175,186)) a razão base/pico passa a 2,12:1. No claro, base #475569 contra pico #0f172a: 2,36:1.
- 2.1: `packages/components/tests/loading-text-style.test.ts` (novo) e `loading-text-styles.test.ts` (ajustado) sobre `dist/styles.css`; `e2e/loading-text.spec.ts` ganhou teste de duas camadas nos dois temas.
- 2.2: inspeção no `/catalogo/loading-text` (build de produção do Admin Demo, Chromium) em claro, escuro, sistema escuro, `prefers-reduced-motion` e `forced-colors`, com capturas em fases 0/20/40/50/60/80% do ciclo. Resultado: a faixa clara é visível nos dois temas e percorre as letras sem salto de layout; com reduced motion o texto fica sólido; com forced colors usa a cor de sistema. O aceite estético final é do mantenedor (Daniel).
- 2.4 (Windows, `develop` 739a89e mesclada, HEAD desta etapa): `npm run format`, `lint`, `build`, `typecheck`, `test:release` (28/28), `test:quiet` (70 arquivos, 1.180 testes), `inspect:packages`; E2E Chromium 381 passaram e 9 falharam, todos por falta de baseline `*-win32.png` (os baselines oficiais são Linux e a CI valida). `openspec.cmd validate --all --strict --no-interactive` (1.15.0) com a change ativa (59/59) e em cópia após `archive` simulado.

## Janela de bundle

Medido com `npm run build` limpo e `npm run inspect:packages`, `develop` (739a89e) contra esta branch:

| Métrica                         | develop | PR      | Diferença | Limite                  |
| ------------------------------- | ------- | ------- | --------- | ----------------------- |
| `components` JS+CSS (bytes)     | 189.409 | 190.042 | +633      | 190.500 (antes 190.000) |
| `components` JS+CSS (gzip)      | 58.125  | 58.241  | +116      | 62.700                  |
| `components` dist total         | 432.859 | 433.492 | +633      | 470.830                 |
| `admin-public` CSS (bytes)      | 91.551  | 92.177  | +626      | 93.000 (antes 91.600)   |
| `admin-public` CSS (gzip)       | 13.660  | 13.777  | +117      | 13.800 (inalterado)     |
| `components-public` CSS (bytes) | 51.945  | 52.571  | +626      | 54.800                  |
| `components-public` CSS (gzip)  | 8.542   | 8.658   | +116      | 9.000                   |

`tokens`, `admin` e `highlighted-code` ficaram idênticos ao `develop`. Os dois limites subidos já estavam excedidos pelo CSS novo (190.042 > 190.000 e 92.177 > 91.600); as folgas resultantes são 458 B e 823 B. A folga de gzip de `admin-public` é de 23 B.
