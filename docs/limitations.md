# Limitações conhecidas

As restrições estão identificadas por componente ou área. Consulte também [histórico por componente](component-changelog.md).

Os limites abaixo descrevem o suporte atual dos pacotes, da demonstração e
das validações automatizadas.

## Dashboard e AdsAdminShell

- `packages/admin` contém o `AdsAdminShell` e seus estilos próprios, e os padrões de
  dashboard (`AdsMetricCard`, `AdsDashboardGrid`, `AdsDashboardPanel`), mas não
  contém gráficos completos (eixos, legendas, tooltips) nem regras de negócio. O
  único gráfico é o `AdsSparkline`, de `@admin-ds/components`, sem interatividade.

## Temas

- A aplicação consumidora decide como persistir a preferência de tema e deve
  aplicá-la no servidor quando quiser evitar uma troca visual na hidratação.

## Snapshots visuais

- Os snapshots visuais usam Chromium e devem ser atualizados conscientemente
  quando tokens, fontes ou o layout de referência mudarem.

## Plataformas de snapshots

- Os baselines visuais são apenas Linux (`*-chromium-linux.png`), gerados em
  `ubuntu-latest`, e os snapshots executam na CI sem serem pulados. Não há
  baselines para Windows nem macOS: renderização de fontes e antialiasing
  diferem, então os snapshots locais nessas plataformas não são suportados.
  Mudanças visuais intencionais são aceitas pelo workflow "Atualizar baselines
  visuais" (ver `docs/quality.md`).

## Orçamentos de distribuição

- O baseline de tamanho cobre os artefatos atuais e permite crescimento de
  até 10%; mudanças maiores exigem revisão explícita do baseline.

## Acessibilidade automatizada

- A validação automatizada de `axe-core` e Playwright não substitui revisão
  manual com teclado, leitor de tela e testes em dispositivos reais. Firefox e
  WebKit têm smoke tests (`/`, `/clientes` e `/componentes`) e a regressão de foco do dropdown, sem
  snapshots e sem a suíte completa; o WebKit do Playwright no Linux não equivale
  ao Safari.

## Contraste e cores forçadas

- `forced-colors` e `prefers-contrast` são validados por emulação em Chromium e
  por testes de CSS e de tokens, sem verificação em Firefox e WebKit. O contraste
  automatizado cobre os pares de tokens listados em
  `packages/tokens/tests/contrast-pairs.mjs`, não combinações arbitrárias de
  sobrescritas da aplicação.

## CSS e Tailwind

- Os utilitários Tailwind só existem no CSS distribuído se aparecerem nas
  fontes de `packages/components`. Por isso o admin demo usa apenas classes
  `demo-` e `ads-`, e um teste de consumo público falha se um `className`
  literal usar outra coisa.

## AdsDialog e AdsDrawer

- O fundo de `AdsDialog` e `AdsDrawer` abertos fica inerte por `inert`, sem fallback: em navegadores
  sem suporte (anteriores a Chromium 102, Firefox 112 e Safari 15.5) ele continua alcançável por
  clique. Overlays de terceiros em `<body>` e o anunciante de rotas do Next.js também ficam inertes
  enquanto há modal aberto; uma navegação nesse intervalo não é anunciada. O bloqueio de rolagem depende da implementação atual e deve ser validado em navegador real. A validação em navegador real cobre o Chromium.

## AdsDatePicker

- O `AdsDatePicker` não tem seletor de hora, fusos horários nem calendários não
  gregorianos. Um intervalo pode conter datas desabilitadas, e as regras de
  negócio sobre isso ficam com a aplicação. Os nomes e o formato dependem do
  `Intl` do ambiente, e os textos de interface (`labels`) têm padrão em pt-BR.
  Sem snapshot visual para ele, o comportamento é coberto por testes
  de componente e `axe`.

## AdsFilterBar

- O `AdsFilterBar` só emite o estado do filtro: não consulta nem filtra dados,
  não persiste na URL e não oferece filtros salvos nem operadores lógicos. O
  texto é emitido a cada digitação, e o consumidor aplica debounce quando
  necessário. Sem snapshot visual para ele, o comportamento é coberto
  por testes de componente, SSR e `axe`.

## AdsSmartTable

- O `AdsSmartTable` só apresenta o estado recebido: não busca, ordena, filtra nem
  pagina dados, não persiste ordenação, seleção, colunas nem larguras e não oferece
  edição em linha nem reordenação de colunas. Virtualização de linhas
  (`virtualization`), redimensionamento de colunas (`onColumnWidthsChange`) e
  exportação (`onExport`) são opcionais. A virtualização exige altura fixa por
  linha (`rowHeight`), corta o conteúdo que excede essa altura (inclusive ao ampliar o texto ou o zoom, pois `rowHeight` é em pixels), não oferece linhas
  de altura variável nem carregamento incremental (a tabela recebe todas as
  linhas) e, como o navegador só conhece as linhas montadas, a busca nativa da
  página (Ctrl+F) e a leitura por leitores de tela encontram só as linhas renderizadas, com `aria-rowcount` e `aria-rowindex` informando o total; a navegação por Tab percorre as
  linhas montadas e a região rolável se move com as setas, PageUp/PageDown, Home e
  End. A exportação emite as colunas visíveis e as linhas recebidas (por exemplo,
  a página exibida): exportar o conjunto completo continua sendo responsabilidade
  do consumidor, e `getAdsSmartTableCsv` é o único formato oferecido. O
  redimensionamento mantém larguras em pixels, sem proporções, e corta o
  conteúdo com reticências. "Selecionar todas" vale só para as linhas recebidas;
  ids de outras páginas em `selectedIds` são preservados e cabe ao consumidor
  limpá-los. É um Client Component: `cell`, `exportValue` e `getRowId` são funções
  e não atravessam a fronteira de um Server Component. Sem snapshot visual para
  ele, o comportamento é coberto por testes de componente, SSR, `axe` e E2E.

## Fluxos administrativos: AdsListFlow, AdsBulkActionBar, AdsStepForm e AdsConfirmDialog

- Os fluxos administrativos (`AdsListFlow`, `AdsBulkActionBar`, `AdsStepForm` e
  `AdsConfirmDialog`) só compõem componentes existentes: não persistem nem
  enviam dados e não usam o roteador. `AdsStepForm` não tem etapas condicionais
  e mantém todas as etapas montadas. O indicador só navega para etapas
  anteriores ou já validadas ao avançar; a marca de "validada" é removida por
  eventos `change` borbulhantes, então campos que não os disparam não a
  invalidam. A validação assíncrona trata rejeição como etapa inválida e não
  cancela a requisição do consumidor (só descarta o resultado obsoleto). Durante
  a espera os campos ficam inertes e um evento `change` cancela a validação
  pendente. Mudanças feitas por código nos valores dos campos nativos
  (`input`, `select`, `textarea`) da etapa também descartam o resultado, por
  comparação dos valores no início e no fim; estado do consumidor que não aparece
  nesses campos (widgets sem campo nativo) não é detectado, e um `true` ainda avança
  com esses dados alterados.
  `AdsConfirmDialog` usa `role="alertdialog"` quando `destructive` (padrão) e
  `dialog` caso contrário; `AdsDrawer` não expõe `role`. Em `AdsListFlow` o
  slot `filters` da tabela é ocupado pelo fluxo. Sem snapshot visual
  para eles, o comportamento é coberto por testes de componente, SSR e `axe`.
