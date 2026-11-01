# Referência de API no Storybook (issue #193)

A referência de API é navegável sob `API/Ads*` no próprio Storybook e complementa as histórias visuais existentes. O índice de componentes visuais continua sendo a matriz da [issue #151](admin-demo-catalog.md#matriz-export--demonstração). Não há alteração dos exports públicos ou do catálogo do admin demo.

## Geração e fontes

`scripts/generate-storybook-api.mjs` gera uma página MDX por export visual a partir de:

1. Exports runtime de `packages/components/src/index.ts`, `packages/admin/src/index.ts` e dos entrypoints opcionais `packages/highlighted-code/src/index.ts` e `packages/components/src/masked-input.tsx`.
2. Matriz de exports, grupos e arquivos de stories em `docs/admin-demo-catalog.md`, com confronto bidirecional; novos exports sem registro e entradas obsoletas provocam erro.
3. Descrições em `apps/admin-demo/app/catalogo/catalog-data.ts`, propriedades e obrigatoriedade declaradas em interfaces TypeScript, e valores padrão literais extraídos quando inequívocos da implementação.
4. Observações revisadas de APIs compostas, genéricas ou opcionais em `apps/docs/api-reference-notes.json`.
5. Stories existentes para exemplos executáveis por `Canvas` do próprio Storybook.

As páginas MDX são **geradas e ignoradas pelo Git** em `apps/docs/src/api-reference/`. Os scripts `predev` e `prebuild` do workspace `@admin-ds/docs` regeneram automaticamente as páginas antes de iniciar o catálogo ou compilar o site estático. Não edite as páginas geradas à mão.

## Campos e limites da extração

Cada página apresenta nome, propósito, pacote de importação público, campos e tipos locais, obrigatoriedade, defaults verificados, herança/composição, orientações e pelo menos um exemplo executável. `—` significa **não verificado**, nunca promessa de default. Tipos React herdados, interfaces importadas, tipos genéricos, unions e propriedades estáticas de composições podem exigir complemento em `api-reference-notes.json` ou metadados de `argTypes` na story: não confundir omissão do extrator com ausência da API pública.

A origem exata do tipo é apontada na ficha para auditoria. O comportamento do componente e seus tipos exportados prevalecem sobre a documentação quando ela estiver desatualizada. No caso de componentes sem interface `*Props` local, a ficha expõe o tipo/composição de origem e os exemplos; recomenda-se complementar as partes relevantes com observação explícita.

Exclusões intencionais (sem UI independente): `fixtureVariants`, `getAdsPaginationItems`, `getAdsSmartTableCsv` e `useAdsAdminShell`. No pacote opcional de highlighted code, também são excluídos `ADS_HIGHLIGHTED_CODE_LANGUAGES`, `languageLabel`, `normalizeHighlightedLanguage` e `registerHighlightedLanguageLoader`. Um novo export público de UI não é excluído automaticamente.

## Validação exigida

- `npm run build --workspace @admin-ds/docs` — gera páginas e a saída real em `apps/docs/storybook-static/index.json`.
- `npm run test:node --workspace @admin-ds/docs` — gera as páginas MDX por conta própria (não exige build) e confere, para todo export da matriz, título, tabela, variantes e exemplo real. Roda em `test:quality`.
- `npm run test:output --workspace @admin-ds/docs` — após o build, confere o `storybook-static/index.json` **publicado**: uma página `API/<Export>` indexada por export da matriz, sem IDs duplicados. Roda no job de build da CI e em `npm run validate`.
- `npm run build:pages` e `npm run test:e2e:pages` — exercitam a navegação em `/admin-design-system/storybook/`, páginas de Docs, tabelas, exemplos, temas e assets reais no Pages.
- `npm run validate` e `openspec.cmd validate --all --strict` — gates obrigatórios do repositório.

A geração estática, o índice e o teste de navegador são verificações distintas: um índice com páginas presentes **não prova** que as tabelas e os exemplos renderizem sem erro. Registre as execuções e falhas reais na PR. Não atualize snapshots sem alteração visual intencional revisada.

## Escopo

A referência técnica de API pertence à #193; texto de adoção, links de consumo e orientações de migração para novos usuários pertencem à #198. O catálogo do demo (#151), a navegação para o Storybook (#189) e o workflow Pages são preservados.
