# Medição de distribuição e tráfego de navegador

Execute `npm run build` e `npm run inspect:packages`. A inspeção mantém dois orçamentos independentes por pacote:

- **Distribuição**: todos os arquivos em `dist/`, incluindo mapas e declarações, com tolerância de 10% sobre `docs/bundle-baseline.json`.
- **JS/CSS publicados**: somente arquivos `.js`, `.mjs` e `.css` de `dist/`; exclui `.map` e `.d.ts`. O gzip soma cada arquivo compactado separadamente (nível 9), sem simular o carregamento de todos os arquivos.

Os limites de JS/CSS em `docs/browser-budget.json` são **provisórios e conservadores**, derivados dos limites de distribuição anteriores, até a coleta de valores reais e a definição de cenários públicos representativos. **Não são baselines medidos** e não devem ser apresentados como desempenho de aplicações consumidoras.

Essas métricas **não representam tamanho minificado de uma aplicação nem bytes realmente carregados**: dependências externas, tree shaking, divisão de chunks, cache e imports do consumidor alteram os resultados. O CSS publicado é compilado; o JavaScript publicado não é necessariamente minificado.

## Atualização de limites

Após executar um build limpo, registre os valores impressos pelo script, revise o diff dos dois arquivos JSON e explique na PR qualquer aumento. Nunca aumente limites apenas para silenciar falhas. Os cenários em `scripts/scenarios/` usam imports públicos e esbuild com minificação e tree shaking, externalizando React e React DOM. Os limites em `docs/scenario-budget.json` são **tetos iniciais provisórios, não medições de baseline**; devem ser calibrados a partir da saída real da CI. Os cenários não incluem CSS, carregamento de chunks dinâmicos nem todos os padrões de consumo. Revise e justifique qualquer aumento de orçamento na PR.
