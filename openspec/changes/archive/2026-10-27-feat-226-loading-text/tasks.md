# Tasks: AdsLoadingText

## 1. Contrato e biblioteca

- [x] 1.1 Revisar padrões de componentes e fixar API `AdsLoadingText`, documentação de tipos e export público.
- [x] 1.2 Implementar apresentação estática/animada, velocidades, polimorfismo e atributos HTML sem dependências novas.
- [x] 1.3 Adicionar CSS `ads-` distribuível com tokens, temas, movimento reduzido e forced colors.

## 2. Testes e demonstrações

- [x] 2.1 Testar estados loading, velocidades, tag, className, atributos e conteúdo multilinha/SSR.
- [x] 2.2 Testar acessibilidade e comportamento de CSS, inclusive reduced motion, forced colors e contraste.
- [x] 2.3 Criar story Storybook e exemplos no catálogo/Admin Demo sem importar caminhos internos.
- [x] 2.4 Verificar consumo do CSS compilado e pacote em aplicação Next.js, além do impacto no bundle.

## 3. Documentação e qualidade

- [x] 3.1 Documentar API, usos, limitações e distinção de Spinner/Skeleton; atualizar `CHANGELOG.md` na seção `0.1.1`.
- [x] 3.2 Revisar implementação e corrigir problemas encontrados, mantendo spec/design sincronizados.
- [x] 3.3 Executar formatação dos arquivos alterados e `npm run format`.
- [x] 3.4 Executar `npm run validate`, incluindo lint, build, typecheck, qualidade e `npm run test:e2e` sem falhas antes do commit final.
- [x] 3.5 Executar `openspec.cmd validate --all --strict`; registrar evidências e pendências reais, sem marcar como concluídas verificações não executadas.

## Evidências (27/10/2026)

- Implementação: `AdsLoadingText` em `packages/components/src/loading-text.tsx`, sem hooks nem `use client`; CSS `ads-loading-text` em `packages/components/src/styles.css`, com tokens, velocidades, `prefers-reduced-motion` e `forced-colors`.
- 2.1: `packages/components/tests/loading-text.test.tsx` com 12 testes (estado, velocidades, tag, `className`, atributos, multilinha, SSR e ausência de `role`/`aria-live`).
- 2.2: `packages/components/tests/loading-text-styles.test.ts` (7 testes sobre `dist/styles.css`: tokens, velocidades, reduced motion e forced colors) e `e2e/loading-text.spec.ts` (6 testes em Chromium: animação e velocidades sem mudar o layout, axe nos temas claro e escuro, quebra de linha, reduced motion e forced colors). Os pares de contraste de `text`, `textPrimary` e `textMuted` já são cobertos por `packages/tokens/tests/contrast-pairs.mjs`.
- 2.3: story `apps/docs/src/loading-text.stories.tsx` (`Speeds` agora com `args.children`, que o typecheck exigia) e exemplo em `/catalogo/loading-text`, sem classes Tailwind literais (o teste de consumo público do demo exige só `demo-` e `ads-`).
- 2.4: `apps/admin-demo/tests/public-consumption.test.ts` passou a incluir `AdsLoadingText` (48 componentes públicos) e o CSS `.ads-loading-text`; `docs/admin-demo-catalog.md` e `docs/visual-accessibility.md` atualizados.
- 3.3: `npm run format` alterou 9 arquivos, só formatação: `catalog-data.ts`, `catalog-demos.tsx`, `docs/integration.md` e os quatro artefatos do OpenSpec desta change, mais os arquivos da própria change.
- 3.4: format, lint, typecheck, build, `test:quiet`, `test:release`, `inspect:packages` e E2E executados na branch mesclada com `develop`. E2E local no Windows: 401 passaram e 9 falharam, todos por falta de baseline `*-win32.png` (já conhecido; os baselines oficiais são Linux e o CI valida).
- 3.5: `openspec.cmd validate --all --strict --no-interactive` com a change ativa e novamente em cópia temporária após `archive` simulado. O spec da change declara `## Purpose`; sem ele o `archive` grava o placeholder `TBD` e o modo estrito falha (57 aprovados, 1 falha).
- Revisão R1 (itens aplicados): `docs/visual-accessibility.md` ressalva que `AdsLoadingText` não tem `role` nem anúncio; o brilho fica em `@supports ((-webkit-background-clip: text) or (background-clip: text))`, com texto sólido na cor atenuada como fallback; o sentido do brilho inverte em RTL com `:dir(rtl)` (regra separada, `animation-direction: reverse`); a change tem `.openspec.yaml`. Testes: `loading-text-styles.test.ts` (9) e E2E RTL em `e2e/loading-text.spec.ts` (7 no total). Atenção: o build do Next converte `:dir(rtl)` em `:lang(ar, he, fa, ...)` para navegadores antigos; nesse caso a inversão depende do atributo `lang` do documento, não de `dir`.
- 3.2: revisão de código R1 e R2 concluídas em 27/10/2026, sem itens bloqueantes; as sugestões foram aplicadas em `a762d17`.

## Janela de bundle de `@admin-ds/components`

Medido com `npm run build` limpo e `npm run inspect:packages`, `develop` (08c2e7f) contra esta branch (HEAD desta etapa):

| Métrica (JS+CSS) | develop | PR      | Diferença | Limite                                  |
| ---------------- | ------- | ------- | --------- | --------------------------------------- |
| Bytes JS+CSS     | 187.253 | 189.161 | +1.908    | 190.000 (antes 187.500); folga de 839 B |
| Gzip JS+CSS      | 57.418  | 58.038  | +620      | 62.700                                  |
| `dist` total     | 428.169 | 432.475 | +4.306    | 470.830                                 |

Composição dos +1.908 B: `loading-text.js` 588, `index.js` 52 e `styles.css` 1.268 (o `@supports` e a regra `:dir(rtl)` somaram 181 B ao CSS). `tokens`, `admin` e `highlighted-code` ficaram idênticos ao `develop`. A reescrita do CSS não reduziu bytes e a folga original era de 247 B, então o aumento era inevitável. Decisão do Daniel: 190.000 (era 189.000 no primeiro commit, com margem de 20 B), alterando só o valor de bytes de `components` em `docs/browser-budget.json`.

Cenários que também consomem o CSS de `components` (limites inalterados):

| Cenário                      | develop | PR     | Limite | Folga   |
| ---------------------------- | ------- | ------ | ------ | ------- |
| `admin-public` CSS           | 90.253  | 91.516 | 91.600 | 84 B    |
| `admin-public` CSS gzip      | 13.398  | 13.639 | 13.800 | 161 B   |
| `components-public` CSS      | 50.647  | 51.910 | 54.800 | 2.890 B |
| `components-public` CSS gzip | 8.249   | 8.521  | 9.000  | 479 B   |

A folga do cenário `admin-public` (CSS e gzip) é pequena: qualquer novo CSS em `components` ou `admin` provavelmente exigirá subir esses limites, que não foram alterados nesta PR.
