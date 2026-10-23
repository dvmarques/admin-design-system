# Catálogo da aplicação admin demo (issue #151)

O índice pesquisável fica em `/catalogo`. O registro de componentes é `apps/admin-demo/app/catalogo/catalog-data.ts`. A navegação existente permanece disponível, inclusive `/`, `/clientes`, `/clientes/novo`, `/preferencias`, `/componentes` e `/data-display`.

## Regra de manutenção

Para cada novo export visual público em `packages/components/src/index.ts` ou `packages/admin/src/index.ts`, registre uma entrada com nome, grupo e URL no catálogo, crie um exemplo interativo com estados relevantes, forneça código TSX copiável e acrescente um teste de interação e acessibilidade. O teste `apps/admin-demo/catalog-coverage.test.ts` identifica divergências no inventário; **não** comprova que o exemplo demonstra o componente.

A verificação considera nomes iniciados por `Ads`, além de `ThemeToggle` e `StyleFixture`. Não considera tipos TypeScript, interfaces, `getAdsPaginationItems` (utilitário de paginação), `useAdsAdminShell` (hook) nem `fixtureVariants` (dados auxiliares). Os dois exports `ThemeToggle` e `StyleFixture` são incluídos no inventário, mas ainda precisam de demonstração específica ou justificativa de exclusão visual.

## Cobertura atual

O registro é um **inventário de navegação**, não uma matriz de cobertura validada. As páginas por categoria existentes são pontos de entrada e não substituem exemplos dedicados. A rota `/catalogo/lacunas` demonstra `AdsInputGroup`, `AdsFieldLabel`, `AdsFieldDescription`, `AdsFieldMessage` e `AdsTableCaption`.

Pendente: rota individual estável por export, snippets válidos copiáveis, estados e variações, visualização responsiva e temas, testes de teclado e Playwright, validação visual e evidências de cobertura de todos os exports. Não marcar 100% de cobertura antes desses itens.
