# Medição de distribuição e tráfego de navegador

Execute `npm run build` e `npm run inspect:packages`. A inspeção mantém dois orçamentos independentes por pacote:

- **Distribuição**: todos os arquivos em `dist/`, incluindo mapas e declarações, com tolerância de 10% sobre `docs/bundle-baseline.json`.
- **JS/CSS publicados**: somente arquivos `.js`, `.mjs` e `.css` de `dist/`; exclui `.map` e `.d.ts`. O gzip soma cada arquivo compactado separadamente (nível 9), sem simular o carregamento de todos os arquivos.

Os limites de JS/CSS em `docs/browser-budget.json` foram calibrados a partir de um build limpo, com folga de cerca de 10% arredondada para cima. Medições históricas de referência (não substituem uma execução no commit atual; consulte o histórico em [bundle-baseline.md](bundle-baseline.md)): tokens 18632 B (3187 gzip), components 170367 B (51649 gzip), admin 108057 B (31647 gzip). Não representam desempenho de aplicações consumidoras.

Essas métricas **não representam tamanho minificado de uma aplicação nem bytes realmente carregados**: dependências externas, tree shaking, divisão de chunks, cache e imports do consumidor alteram os resultados. O CSS publicado é compilado; o JavaScript publicado não é necessariamente minificado.

## Atualização de limites

Após executar um build limpo, registre os valores impressos pelo script, revise o diff dos dois arquivos JSON e explique na PR qualquer aumento. Nunca aumente limites apenas para silenciar falhas. Os cenários em `scripts/scenarios/` usam imports públicos e esbuild com minificação e tree shaking, externalizando React e React DOM. Os limites em `docs/scenario-budget.json` foram calibrados com a mesma folga de cerca de 10%. Medições históricas de referência (minificado / gzip; não são valores atuais): tokens-public 3431 / 1135 B, components-public 27589 / 10225 B, admin-public 63592 / 21653 B. O cenário `masked-input-public` mede o subpath opcional `@admin-ds/components/masked-input` com o motor de máscara embutido (React externo); `components-public` deve permanecer sem `imask`, o que `scripts/masked-input-distribution.test.mjs` e `verify-package` verificam. Cada cenário mede também o CSS público correspondente (tokens; tokens e components; tokens, components e admin), minificado e com gzip do conjunto, com limites `cssBytes` e `cssGzipBytes` calibrados da mesma forma (referências: 12981/1724, 49774/8098 e 69621/11131 B). Os cenários não incluem carregamento de chunks dinâmicos nem todos os padrões de consumo. Revise e justifique qualquer aumento de orçamento na PR.

## Testes de integração

`scripts/quality-budget.test.mjs` executa `inspect:packages` de verdade, com `INSPECT_BUDGET_DIR` apontando para cópias dos orçamentos em que um limite é reduzido, e exige falha identificando pacote ou cenário e métrica. Os testes são ignorados quando `dist/` ainda não foi gerado; execute `npm run build` antes.

## Proveniência e interpretação

Os números de referência deste guia registram calibrações anteriores dos orçamentos, **não** uma leitura atual do repositório. Antes de comparar resultados, registre SHA do commit, data, versão do Node e npm, SO/terminações de linha, comandos, estado limpo de `dist/` e versão do toolchain. Registros antigos em Node 22 (quando presentes no histórico) **não** podem ser tratados como medição sob o Node 24 vigente; sem esses metadados a comparação é apenas indicativa. Não foi realizada nova medição nesta revisão documental. A fonte normativa de limites é o trio [bundle-baseline.json](bundle-baseline.json), [browser-budget.json](browser-budget.json) e [scenario-budget.json](scenario-budget.json); alterações desses arquivos precisam de justificativa e validação próprias.
