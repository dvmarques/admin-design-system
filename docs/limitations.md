# Limitações conhecidas

Esta change entrega a fundação do design system, não um catálogo completo de
componentes administrativos.

- `packages/components` contém atualmente fixtures de estilo e o controle de
  tema; componentes como Button, Table, Modal e Sidebar ainda serão changes
  independentes.
- `packages/admin` contém o `AdsAdminShell` e seus estilos próprios, e os padrões de
  dashboard (`AdsMetricCard`, `AdsDashboardGrid`, `AdsDashboardPanel`), mas não
  contém gráficos nem regras de negócio.
- A aplicação consumidora decide como persistir a preferência de tema e deve
  aplicá-la no servidor quando quiser evitar uma troca visual na hidratação.
- Os snapshots visuais usam Chromium e devem ser atualizados conscientemente
  quando tokens, fontes ou o layout de referência mudarem.
- Os baselines visuais são apenas Linux (`*-chromium-linux.png`), gerados em
  `ubuntu-latest`, e os snapshots executam na CI sem serem pulados. Não há
  baselines para Windows nem macOS: renderização de fontes e antialiasing
  diferem, então os snapshots locais nessas plataformas não são suportados.
  Mudanças visuais intencionais são aceitas pelo workflow "Atualizar baselines
  visuais" (ver `docs/quality.md`).
- O baseline de tamanho cobre os artefatos atuais e permite crescimento de
  até 10%; mudanças maiores exigem revisão explícita do baseline.
- A validação automatizada de `axe-core` e Playwright não substitui revisão
  manual com teclado, leitor de tela e testes em dispositivos reais. Firefox e
  WebKit têm apenas smoke tests (`/`, `/clientes` e `/componentes`), sem
  snapshots e sem a suíte completa; o WebKit do Playwright no Linux não equivale
  ao Safari.
- Os utilitários Tailwind só existem no CSS distribuído se aparecerem nas
  fontes de `packages/components`. Por isso o admin demo usa apenas classes
  `demo-` e `ads-`, e um teste de consumo público falha se um `className`
  literal usar outra coisa.
- O `AdsDatePicker` não tem seletor de hora, fusos horários nem calendários não
  gregorianos. Um intervalo pode conter datas desabilitadas, e as regras de
  negócio sobre isso ficam com a aplicação. Os nomes e o formato dependem do
  `Intl` do ambiente, e os textos de interface (`labels`) têm padrão em pt-BR.
  Sem snapshot visual para ele, o comportamento é coberto por testes
  de componente e `axe`.
- O `AdsFilterBar` só emite o estado do filtro: não consulta nem filtra dados,
  não persiste na URL e não oferece filtros salvos nem operadores lógicos. O
  texto é emitido a cada digitação, e o consumidor aplica debounce quando
  necessário. Sem snapshot visual para ele, o comportamento é coberto
  por testes de componente, SSR e `axe`.
- O `AdsSmartTable` só apresenta o estado recebido: não busca, ordena, filtra nem
  pagina dados, não persiste ordenação, seleção ou colunas e não oferece edição
  em linha, redimensionamento, reordenação de colunas, virtualização nem
  exportação. "Selecionar todas" vale só para a página exibida; ids de outras
  páginas em `selectedIds` são preservados e cabe ao consumidor limpá-los. É um
  Client Component: `cell` e `getRowId` são funções e não atravessam a fronteira
  de um Server Component. Sem snapshot visual para ele, o
  comportamento é coberto por testes de componente, SSR e `axe`.
- Os fluxos administrativos (`AdsListFlow`, `AdsBulkActionBar`, `AdsStepForm` e
  `AdsConfirmDialog`) só compõem componentes existentes: não persistem nem
  enviam dados e não usam o roteador. `AdsStepForm` não permite navegar clicando
  no indicador, não tem etapas condicionais nem validação assíncrona (`validate`
  é síncrona), e mantém todas as etapas montadas. O `AdsConfirmDialog` usa
  `role="dialog"`: o painel interno de `@admin-ds/components` aceita
  `alertdialog`, mas o tipo `AdsDialogProps` não expõe `role`. Em `AdsListFlow` o
  slot `filters` da tabela é ocupado pelo fluxo. Sem snapshot visual
  para eles, o comportamento é coberto por testes de componente, SSR e `axe`.
