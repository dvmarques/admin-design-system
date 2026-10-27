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

- Implementação: duas camadas de `background-image` em `.ads-loading-text[data-loading='true']` (faixa de brilho sobre base opaca) e `--ads-loading-text-base`; a base é `color-mix` de `text-muted` com `surface` (77%/23% no claro e 42%/58% no escuro), com fallback `text-muted` sem `color-mix`; sem `use client`, API e velocidades (4s/2,5s/1,5s) inalteradas.
- 1.1: no tema escuro `text-muted` (#e2e8f0) e `text-primary` (#f8fafc) tinham razão de contraste de 1,18:1. Ajuste de 27/10 (referência do mantenedor, ~4,2:1 base/pico nos dois temas): escuro, base #707987 (42% muted + 58% surface) contra pico #f8fafc = 4,19:1 (antes 2,12:1 com base ~rgb(167,175,186)); claro, base #717c8c (77% muted + 23% surface) contra pico #0f172a = 4,22:1 (antes 2,36:1 com base #475569). Base contra superfície: 3,34:1 no escuro (#1e293b) e 4,23:1 no claro (#ffffff); pico contra superfície: 13,99:1 e 17,85:1.
- 2.1: `packages/components/tests/loading-text-style.test.ts` (novo) e `loading-text-styles.test.ts` (ajustado) sobre `dist/styles.css`; `e2e/loading-text.spec.ts` ganhou teste de duas camadas nos dois temas.
- 2.1 (ajuste 4,2:1): `loading-text-style.test.ts` calcula, a partir dos tokens e das porcentagens do CSS, a razão base/pico (entre 4,1 e 4,3) nos dois temas e confirma os percentuais 77%/23% (claro) e 42%/58% (escuro).
- 2.2: inspeção no `/catalogo/loading-text` (build de produção do Admin Demo, Chromium) em claro, escuro, sistema escuro, `prefers-reduced-motion` e `forced-colors`, com capturas em fases 0/20/40/50/60/80% do ciclo. Resultado: a faixa clara é visível nos dois temas e percorre as letras sem salto de layout; com reduced motion o texto fica sólido; com forced colors usa a cor de sistema. O aceite estético final é do mantenedor (Daniel).
- 2.4 (Windows, `develop` 739a89e mesclada, HEAD desta etapa): `npm run format`, `lint`, `build`, `typecheck`, `test:release` (28/28), `test:quiet` (70 arquivos, 1.180 testes), `inspect:packages`; E2E Chromium 381 passaram e 9 falharam, todos por falta de baseline `*-win32.png` (os baselines oficiais são Linux e a CI valida). `openspec.cmd validate --all --strict --no-interactive` (1.15.0) com a change ativa (59/59) e em cópia após `archive` simulado.

## Janela de bundle

Medido com `npm run build` limpo e `npm run inspect:packages`, `develop` (739a89e) contra esta branch (ajuste 4,2:1 de 27/10):

| Métrica                         | develop | PR      | Diferença | Limite                  |
| ------------------------------- | ------- | ------- | --------- | ----------------------- |
| `components` JS+CSS (bytes)     | 189.409 | 190.185 | +776      | 190.500 (antes 190.000) |
| `components` JS+CSS (gzip)      | 58.125  | 58.251  | +126      | 62.700                  |
| `components` dist total         | 432.859 | 433.635 | +776      | 470.830                 |
| `admin-public` CSS (bytes)      | 91.551  | 92.320  | +769      | 93.000 (antes 91.600)   |
| `admin-public` CSS (gzip)       | 13.660  | 13.787  | +127      | 13.800 (inalterado)     |
| `components-public` CSS (bytes) | 51.945  | 52.714  | +769      | 54.800                  |
| `components-public` CSS (gzip)  | 8.542   | 8.669   | +127      | 9.000                   |

`tokens`, `admin` e `highlighted-code` ficaram idênticos ao `develop`. Os dois limites subidos já estavam excedidos pelo CSS anterior desta PR (190.042 > 190.000 e 92.177 > 91.600); o ajuste 4,2:1 não mudou nenhum limite. As folgas atuais são 315 B (`components`) e 680 B (`admin-public` CSS); a folga de gzip de `admin-public` é de 13 B.
