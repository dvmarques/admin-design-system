# Medição de distribuição e tráfego de navegador

Execute `npm run build` e `npm run inspect:packages`. A inspeção mantém dois orçamentos independentes por pacote:

- **Distribuição**: todos os arquivos em `dist/`, incluindo mapas e declarações, com tolerância de 10% sobre `docs/bundle-baseline.json`.
- **JS/CSS publicados**: somente arquivos `.js`, `.mjs` e `.css` de `dist/`; exclui `.map` e `.d.ts`. O gzip soma cada arquivo compactado separadamente (nível 9), sem simular o carregamento de todos os arquivos.

Os limites de JS/CSS em `docs/browser-budget.json` foram calibrados a partir de um build limpo, com folga de cerca de 10% arredondada para cima. Medições de referência: tokens 18632 B (3187 gzip), components 170367 B (51649 gzip), admin 108057 B (31647 gzip). Não representam desempenho de aplicações consumidoras.

Essas métricas **não representam tamanho minificado de uma aplicação nem bytes realmente carregados**: dependências externas, tree shaking, divisão de chunks, cache e imports do consumidor alteram os resultados. O CSS publicado é compilado; o JavaScript publicado não é necessariamente minificado.

## Atualização de limites

Após executar um build limpo, registre os valores impressos pelo script, revise o diff dos dois arquivos JSON e explique na PR qualquer aumento. Nunca aumente limites apenas para silenciar falhas. Os cenários em `scripts/scenarios/` usam imports públicos e esbuild com minificação e tree shaking, externalizando React e React DOM. Os limites em `docs/scenario-budget.json` foram calibrados com a mesma folga de cerca de 10%. Medições de referência (minificado / gzip): tokens-public 3431 / 1135 B, components-public 27589 / 10225 B, admin-public 63592 / 21653 B. Os cenários não incluem CSS, carregamento de chunks dinâmicos nem todos os padrões de consumo. Revise e justifique qualquer aumento de orçamento na PR.
