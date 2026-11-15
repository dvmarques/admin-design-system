# Padrões leves de layout responsivo — #318

## Why
O ADS já entrega semântica de página (#317), `AdsAdminShell.Main`, `AdsPageHeader`, `AdsCard`, `AdsSurface` e `AdsDashboardGrid`. Entretanto, as composições de filtros, formulários e indicadores ainda repetem regras de container, empilhamento, grid e ações em CSS de demonstração ou estilos inline de Storybook. O consumidor deve conseguir reproduzir esses padrões sem configurar Tailwind.

## What Changes
- Publicar **quatro classes CSS opt-in** no CSS compilado de `@dvmarques/admin-ds-components`: `ads-layout-container`, `ads-layout-stack`, `ads-layout-grid` e `ads-layout-cluster`. Permitem HTML nativo e composição com APIs existentes; não acrescentam elementos ao DOM nem introduzem JS.
- Estabelecer uso recomendado de largura máxima, padding inline, gaps, colunas automáticas baseadas na largura disponível, aninhamento, overflow intencional de tabelas, ações e conteúdo longo.
- Reutilizar os três exemplos semânticos existentes da #317, substituir padrões repetidos por classes distribuídas, e ampliar Storybook e Playwright/axe sem adicionar rotas ou navegação global.
- Documentar decisões, importação de CSS, exemplos, alternativas descartadas, temas, RTL, limites de zoom e distribuição; comparar bundles no SHA efetivo, mantendo budgets sem ajuste especulativo.

## Perfil Critical, pacotes e compatibilidade
**Critical:** CSS público distribuído, acessibilidade e composição multiaplicação. `packages/components` (somente CSS; sem novos exports TypeScript, dependências, APIs React ou tokens globais), `apps/admin-demo`, `apps/docs`, E2E e documentação. `packages/admin` e os consumidores externos não serão alterados. Classes são aditivas e prefixadas; nenhum comportamento preexistente muda sem optar pelas classes. Rollback: remover uso e regras recém-criadas sem alterar contratos React.

## Fora do escopo
`AdsContainer`, `AdsGrid`, `AdsGridItem`, `AdsStack`, frameworks de utilities, classes arbitrárias estilo Tailwind, redesenho, valores globais de tokens, scripts de media queries, autenticação, footer/temas estruturais (#319), integração consolidada (#320), alterações de terceiros, merge, archive e fechamento de issue.