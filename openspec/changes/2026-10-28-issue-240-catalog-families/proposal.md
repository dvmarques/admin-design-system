# Consolidar a documentação por famílias no catálogo (#240)

## Why

O catálogo do Admin Demo exibe uma entrada na sidebar e uma rota para cada export público, inclusive partes de uma mesma composição. Tabs, Accordion, Field, Table, Card e List ocupam vários links e repetem exemplos. A busca deve continuar descobrindo cada export; a navegação deve apresentar as famílias sem perder documentação individual nem links existentes.

## What Changes

- Distinguir representação de navegação (uma página principal por família) de índice de busca e cobertura (cada nome público rastreável).
- Consolidar Tabs, Accordion, Field, Table, Card e List; documentar as partes compostas de Dropdown e AdminShell; reunir DashboardGrid, DashboardPanel e MetricCard em uma página de composição, sem afirmar dependência obrigatória entre eles.
- Exibir no começo de cada página todos os nomes reais e âncoras estáveis, com seção de API e exemplo por componente/parte.
- Manter rotas legadas por export como aliases funcionais durante a migração estática do GitHub Pages, oferecendo redirecionamento à página e âncora quando possível.
- Adaptar busca, sidebar, matriz de cobertura, teste de cobertura e E2E.

## Profile e riscos

Critical: modifica navegação, URLs públicas do demo, links profundos, cobertura automatizada, documentação de APIs e acessibilidade transversal. Revisar requisitos/rotas e os resultados de testes de forma independente antes de considerar o plano pronto. Não confundir número de páginas com número de exports cobertos.

## Impact

Apps: apps/admin-demo, docs/admin-demo-catalog.md, testes de catálogo e E2E; revisar referências e exemplos pertinentes em apps/docs. Pacotes: manter exports e CSS de @admin-ds/components e @admin-ds/admin intactos. Consumidores ganham documentação organizada e pesquisa precisa sem migração de componentes ou dependências de runtime.

## Fora do escopo

Não fundir componentes independentes (Input, InputGroup, PasswordInput, SelectionGroup, Select, Table vs SmartTable, Dialog vs ConfirmDialog); não criar novos exports nem alterar API pública; não executar a geração de documentação API do Storybook da #193; não incluir o pacote opcional HighlightedCodeSnippet (tratado na #241).

## Referências

Issue #240; catálogo original #151; API de referência #193; apps/admin-demo/app/catalogo/catalog-data.ts, demo-navigation.tsx e a rota de detalhe; docs/admin-demo-catalog.md.
