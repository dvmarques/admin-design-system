# Design

## Decisões

- **Estado na URL, tratado no servidor**: `lib/customers-query.ts` interpreta
  `q`, `status`, `plano` (lista separada por vírgula), `de`, `ate`, `ordem`
  (`coluna:direção`) e `pagina` e aplica filtro, ordenação e paginação em funções
  puras. Valores inválidos são ignorados (filtro) ou normalizados (página,
  ordenação), então a mesma URL gera sempre o mesmo HTML. Mudar filtro ou
  ordenação volta para a página 1.
- **Cliente só apresenta**: a página (Server Component) passa linhas, totais,
  valores de filtro e ordenação. O Client Component `customers-listing.tsx`
  mantém estado local dos filtros (aplicado na hora, como em
  `docs/integration.md`), navega com `router.replace` e guarda seleção e colunas
  ocultas em estado local, que não vão para a URL.
- **Ordenação por `AdsSmartTable`**: `ordem` tem coluna e direção; clicar de novo
  alterna e a terceira ação remove, como o componente já emite.
- **Paginação**: `AdsPagination` com `renderPageLink` e `next/link` abaixo do
  `AdsSmartTable`, com o `href` construído a partir dos parâmetros atuais. Não
  usa a prop `pagination` porque, dentro do grid do componente, o `ul` com
  `min-w-max` alarga a coluna e a página rola na horizontal em 375 px. É um
  achado da biblioteca (PR #67), registrado em `docs/limitations.md`; a correção
  fica para uma issue própria, pois esta change não altera `packages/*`.
- **Visão geral**: `AdsMetricCard` com variação e tendência (ícone e texto) e
  `AdsDashboardGrid`/`AdsDashboardPanel` para progresso e atividade. Os
  contratos E2E atuais (títulos, grupos e barras de progresso) são mantidos.
- **Estados**: `?estado=vazio|carregando|erro` passa a usar `loading`, `error` e
  `emptyState` do `AdsSmartTable`. Filtros sem resultado mostram o estado vazio
  com ação para limpar.
- **Seleção sem barra de ações**: sem #61, apenas a seleção do `AdsSmartTable`.

## Client e Server Components

A página e a consulta rodam no servidor; apenas `customers-listing.tsx` é
cliente, porque passa funções (`cell`, `getRowId`) ao `AdsSmartTable`. Colunas
são definidas dentro dele.

## Acessibilidade

Nomes acessíveis e `aria-sort`, seleção anunciada e filtros nomeados vêm dos
componentes. O demo mantém um único `h1`, e os testes usam funções ARIA.

## Tailwind, CSS e bundle

O demo usa só classes `demo-` e `ads-`. Sem Tailwind e sem novas dependências.

## Validação visual

Snapshots visuais só têm baseline `win32` e são pulados ou falham fora do
Windows; esta change não cria nem altera baselines. Os snapshots afetados de
`/` e `/clientes` precisam ser revisados e regerados no Windows antes do merge.
No ambiente cloud rodam testes de unidade, E2E funcionais e axe.

## Alternativas

Persistir filtros só em estado local: descartado, pois a issue exige estado na
URL. Simular a barra de ações em massa no demo: descartado, pois seria um
padrão próprio que a #61 vai oferecer na biblioteca.
