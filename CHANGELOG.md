# Changelog

Aqui são registradas as principais inclusões, correções e evoluções do Admin
Design System.

O formato segue as convenções do Keep a Changelog. As mudanças são organizadas
por versão e pelas changes correspondentes do OpenSpec.

### [0.1.1] - Em andamento

#### Added

- `apply-purple-brand-identity` - Logotipo do projeto: símbolo "A" em roxo profundo com recorte lilás,
  em `assets/brand` (SVG como fonte, PNG 512×512 derivado, variante sem fundo, favicon chapado e
  lockups claro e escuro). Exibido no cabeçalho do admin demo, no favicon do demo e do Storybook e no
  README. No GitHub Pages, o logotipo e os favicons resolvem sob o subcaminho do repositório. A paleta
  do logotipo é independente da escala `brand*` dos tokens. Sem mudança em pacotes publicados nem em
  APIs públicas.
- `tabs-breadcrumb-accordion` - Tabs, Breadcrumb e Accordion (issue #90). Novo `AdsAccordion` composto
  (`Root`, `Item`, `Header`, `Trigger`, `Panel`) com `type` `single` (com `collapsible`) ou `multiple`,
  estado controlado ou não, heading com `level`, itens desabilitados, teclado (↑, ↓, Home, End) e painel
  oculto por padrão, com `unmountOnCollapse` na raiz e por item. `AdsTabs` ganha `activationMode`
  (`automatic`), `orientation` (`vertical`) e `keepMounted`, ids válidos para qualquer `value`, uma tab
  sempre tabulável e `type="button"` nos gatilhos. `AdsBreadcrumb` ganha `maxItems`,
  `itemsBeforeCollapse`, `itemsAfterCollapse`, `expandLabel` e `separator`. `AdsTabs` e `AdsAccordion`
  declaram `"use client"`; `AdsBreadcrumb` e `AdsNav` seguem compatíveis com Server Components, inclusive
  com `renderLink`. As partes também são exportadas por nome (`AdsTabsList`, `AdsTabsTrigger`,
  `AdsTabsPanel`, `AdsAccordionItem`, `AdsAccordionHeader`, `AdsAccordionTrigger`,
  `AdsAccordionPanel`) para uso em Server Components, onde `AdsTabs.List` não existe. O item aberto de
  um accordion `single` sem `collapsible` expõe `aria-disabled`, e `aria-controls` só referencia painéis
  que existem. `verify-package` passa a falhar se `navigation.js` usar APIs só de cliente. Textos padrão
  em inglês, sobrescritos por prop. Sem mudança incompatível de API;
  três correções de comportamento em `AdsTabs`: o gatilho deixa de submeter formulários
  (`type="button"`), o `onClick` do consumidor passa a ser chamado e os ids de tab e painel mudam de
  formato (derivam do `value` codificado), então seletores que dependiam do formato antigo devem usar
  os papéis ARIA.
- `add-metric-sparkline` - Indicador de variação e sparkline do dashboard (issue #89). Novo
  `AdsSparkline` em `@admin-ds/components`: gráfico de linha em SVG, sem dependência de
  runtime, com `values` (valores não finitos são ignorados), `min`, `max`, `labels`, `tone`,
  `label`, `summary` e `formatValue`, nome acessível gerado (`role="img"`), cores por token e
  `forced-colors`, e compatível com Server Components. `AdsMetricCard` ganha a prop opcional
  `sparkline`, colorida pelo `sentiment`, com placeholder no carregamento. O indicador de
  variação não muda de API; ganha testes e story do `sentiment` invertido (queda de
  cancelamentos é positiva). `success` e `danger` entram nos pares de contraste (3:1). A visão
  geral da demo exibe séries e o indicador Cancelamentos. Sem mudança incompatível.
- `add-visual-identity` - Etapa inicial da identidade visual (issue #118). No tema escuro,
  `--ads-color-surface-muted` (`#162033`) e `--ads-color-surface-hover` (`#3d4b60`) deixam de
  valer o mesmo que `--ads-color-surface-raised`, e um item em hover sobre uma superfície
  elevada passa a ser distinguível dela. A escala de espaçamento ganha `--ads-spacing-5`, `-10`,
  `-12` e `-16`. Novos tokens de cor para gráficos, `--ads-color-chart1` a `--ads-color-chart8`, nos dois
  temas, com contraste mínimo de 3:1 contra a superfície e distinção verificada sob simulação
  de daltonismo. Novo `docs/visual-identity.md`, correção dos valores de elevação em
  `docs/visual-polish.md` e a story Foundation/Visual identity. Sem remoção ou renomeação de
  tokens. A escala de marca `brand50`…`brand900` passa a ser a referência de `primary`, foco e
  seleção, sem mudar a aparência. **A fonte padrão mudou**: `--ads-typography-font-family` passa
  de `Aptos, "Segoe UI Variable", "Segoe UI", sans-serif` para uma pilha que começa em `Inter`
  e termina em fontes de sistema; a biblioteca não distribui a fonte, então a aplicação deve
  carregá-la (por exemplo com `next/font`, veja `docs/visual-identity.md`) ou sobrescrever o
  token, e sem isso o texto usa a fonte de sistema da pilha (impacto visual para consumidores).
  Novos `--ads-typography-font-family-heading` (usado pelos títulos de `AdsTypography`) e
  `--ads-typography-font-family-mono`. O admin demo e o Storybook passam a carregar a Inter
  com `@fontsource/inter` (dependência só dessas aplicações).

#### Changed

- `optimize-playwright-ci-container` - Jobs E2E Chromium, Firefox e WebKit passam a usar a imagem oficial Playwright `v1.62.0-noble`, compatível com o lockfile; removidos cache de browsers e instalações apt redundantes. Preservados Node 24, npm 11.19.1, gates e snapshots. Comparação de tempos pendente de runs CI (issue #171).

- `adaptive-ai-workflow` - Guia e skill compartilhada para classificar mudanças Fast, Standard e Critical e orquestrar Issue → OpenSpec → implementação → PR → CI → revisão humana (issue #163). Preserva gates, schema, políticas de release e APIs existentes.

- `split-long-spec-requirements` - Dez requisitos de nove specs foram reescritos com até 500
  caracteres, movendo detalhes e casos de borda para cenários, e `openspec validate --all
--strict` passa sem avisos. Sem mudança de código, API, classes ou tokens.
- `fix-tooltip-preserve-aria-describedby` - Enquanto aberto, `AdsTooltip` deixa de substituir o
  `aria-describedby` do gatilho: o atributo passa a referenciar o id do consumidor e o do
  tooltip, nessa ordem, e volta ao valor original ao fechar (issue #148). Nova story
  `TooltipWithDescribedTrigger`. Sem mudança de API pública, classes ou tokens.
- `fix-tooltip-escape-overlays` - `AdsTooltip` aberto, por foco ou por apontamento, fecha com Escape
  sem capturar nem deslocar o foco, e só reabre com um novo foco ou apontamento no gatilho. O tooltip
  passa a ser camada na pilha de Escape: um tooltip aberto absorve o primeiro Escape e o evento fica
  marcado com `defaultPrevented`, então um diálogo ao redor exige um segundo Escape. Regressões novas
  cobrem `AdsDrawer` (esquerda e direita) e o painel de colunas do `AdsSmartTable` dentro de
  `AdsDialog`/`AdsDrawer`. Sem mudança de API pública, tokens ou estilos (issue #91).

- `modal-inert-background` - Com `AdsDialog` ou `AdsDrawer` aberto, o conteúdo da página fora do
  overlay passa a ficar inerte (`inert`): sem foco, sem cliques e fora da árvore de acessibilidade,
  em vez de depender só do laço de Tab e de `aria-modal`. Ao fechar ou desmontar, o estado anterior
  é restaurado, inclusive um `inert` que a aplicação já tivesse; nós criados ou substituídos em
  `<body>` durante o modal também ficam inertes, e um `inert` acrescentado pela aplicação durante o
  modal permanece depois dele. Com modais aninhados só o mais recente é interativo e a página só
  volta ao normal quando o último fecha, em qualquer ordem. Popover, tooltip, menu do `AdsDropdown`
  e calendário abertos a partir do modal seguem interativos, um popup aberto pela página fica
  inerte, e `AdsToast` nunca fica inerte. O foco volta ao gatilho da página mesmo quando o modal de
  origem fecha antes de um modal aninhado. **Mudança de comportamento**: não é mais possível
  interagir com a página por trás de um modal aberto. Sem `inert` no navegador o comportamento
  anterior continua; a rolagem do fundo não é bloqueada. Sem mudança de API pública, tokens, estilos
  ou dependências (issue #149).
- `fix-popover-content-click` - Cliques em campos e botões no conteúdo de `AdsPopover`
  mantêm o painel aberto, preservando handlers e propagação de eventos do consumidor.
  Gatilho, Escape, clique externo e fechamento controlado mantêm seus comportamentos.
  `AdsDatePicker` deixa de precisar interromper a propagação dos cliques do calendário.
  Sem mudança de API pública, tokens ou estilos (issue #126).
- `cleanup-project-docs-and-design-guidance` - Documentação atualizada para os recursos
  entregues, com remoção de referências externas como orientação de design e de textos
  obsoletos de roadmap e andamento. As skills de design passam a respeitar a Inter e os
  tokens existentes. Licenças, limitações técnicas, histórico e fluxo de releases são
  preservados; sem mudança de código, API ou aparência.

- `fix-demo-narrow-width` - A rota `/componentes` do admin demo deixa de rolar 6px na
  horizontal em 320px: os grids da demonstração em telas estreitas passam de `1fr` para
  `minmax(0, 1fr)` e a paginação rola dentro do próprio painel. O E2E de todas as rotas
  passa a verificar também 320px, e a spec fixa 320px como largura mínima. Sem mudança
  de API pública, classes ou tokens.
- `add-input-group-multiple-button-addons` - `AdsInputGroup` aceita vários `AdsButton` no
  mesmo `startContent` ou `endContent`: os botões ficam contíguos, com as quinas internas
  retas, só a quina externa do conjunto arredondada e junção de 1px sobreposta, todos com a
  altura do campo. Texto e botão no mesmo adendo continuam sem suporte, agora documentado.
  Sem mudança de API pública, classes ou tokens.
- `fix-input-group-button-addon` - Um `AdsButton` em `startContent` ou `endContent` de
  `AdsInputGroup` deixa de ficar dentro da moldura do adendo e de aumentar o campo
  (34, 38 e 42px em vez de 30, 32 e 36px): o botão fica rente ao campo e acompanha a
  altura dele em qualquer `size`. Adendos de texto não mudam. A orientação em
  `docs/integration.md` deixa de desaconselhar o uso e há uma nova story
  `InputGroupWithButton`. Sem mudança de API pública, classes ou tokens.
- `fix-smart-table-caption-padding` - A legenda visível de `AdsSmartTable` passa a ter o
  espaçamento horizontal das células e o espaçamento vertical da densidade, em vez de
  encostar na borda e no topo do contêiner da tabela. `hideCaption` e `AdsTable` isolada
  não mudam. Sem mudança de API pública, classes ou tokens.
- `fix-select-sm-height-and-document-field-button-pairing` - O token
  `--ads-dimension-field-sm` passa de `1.75rem` para `1.875rem` (30px), a altura real
  do campo pequeno: o `AdsSelect` `sm` sobe de 28 para 30px e passa a ter a mesma
  altura do `AdsInput`; `AdsInput` e `AdsTextarea` não mudam. Nova seção em
  `docs/integration.md` sobre botões ao lado de campos e nova story de tamanhos de
  `AdsInput` e `AdsSelect`. Sem mudança de nomes de tokens nem de API.
- `fix-date-picker-trigger-height` - O gatilho do calendário de `AdsDatePicker`
  passa a ter a altura do campo em `sm`, `md` e `lg` (antes era 2 a 4px mais alto,
  porque o botão usa a altura de controle), e o campo volta a alinhar com os campos
  vizinhos, como no `AdsFilterBar`. Mudança visual intencional; sem mudança de API.
- `fix-form-control-and-shell-header-layout` - `AdsInput`, `AdsTextarea` e
  `AdsSelect` passam a usar `box-border`: campos de texto deixam de ficar 26px
  mais largos que a coluna (e de invadir o campo vizinho, como no
  `AdsFilterBar`) em aplicações sem reset de `box-sizing`. `ThemeToggle` usa a
  fonte do design system e mantém o rótulo em uma linha. Sem mudança de API.
- `fix-popover-font-inheritance` - `AdsPopover` e o calendário de
  `AdsDatePicker` passam a usar a fonte do design system (`font-sans`) como os
  demais overlays; antes caíam para a fonte padrão do navegador em aplicações
  cujo `body` não define `font-family`. Sem mudança de API.
- `polimento-visual-tokens` - Elevação por tema, densidade de tabela e tokens
  de skeleton; props opcionais em `AdsTable`, `AdsSmartTable`, `AdsSkeleton` e
  `AdsEmptyState`; `AdsMetricCard` e `AdsDashboardPanel` renderizam
  `AdsEmptyState` compacto quando `empty` é texto ou número (DOM distinto do
  texto solto anterior). Closes #88.
- `acessibilidade-visual-estilos` - Movimento por token, `forced-colors` e
  `prefers-contrast` no CSS distribuído; token `border-control` (3:1) e
  somente leitura via `[readonly]` sem afetar `AdsSelect`. A revisão manual em
  Windows em alto contraste deixa de ser pendência na documentação. Closes #87.
- `speed-up-ci` - CI de PR com jobs em paralelo, cache do Chromium e
  cancelamento de execuções obsoletas.
- `skip-docs-only-ci` - PRs só de documentação ou specs pulam build e E2E,
  mantendo os required checks.
- `add-visual-regression-and-cross-browser-ci` - Snapshots visuais na CI com
  baselines só Linux (sem `win32`) e smoke em Firefox e WebKit.
- `protect-release-branches` - O processo de release deixa de exigir a exclusão
  automática de head branches desabilitada: as branches `release/*` passam a ser
  protegidas por um ruleset que restringe a remoção, e a exclusão automática
  pode continuar habilitada para as demais branches. A spec `release-process`
  ganha o requisito de retenção da branch de release até o back-merge e a
  publicação. Somente documentação e processo, sem mudança de API pública, pacotes,
  scripts ou workflows.
- `fluxo-de-agentes` - Compatibilidade entre Claude Code, Cursor e Codex:
  `AGENTS.md` como fonte única, sincronização das skills próprias de
  `.agents/skills` para `.claude/skills` (`npm run sync:agent-skills`, com
  verificação em `test:quality`), servidores MCP em `.mcp.json` e
  `.cursor/mcp.json`, hook `pre-commit` com Husky e lint-staged, e hooks e
  subagents do Claude Code. Somente tooling e documentação, sem mudança de API
  pública nem de pacotes distribuídos.
- `optimize-ai-agent-context` - Contexto dos agentes e roteamento de modelos (issue #162). Novo
  `docs/agent-context-map.md` com leitura de contexto por escopo; `AGENTS.md` passa a consultar o mapa
  em vez de exigir a leitura de toda a documentação; o bloco descritivo de `openspec/config.yaml` foi
  condensado, mantendo as regras de artefatos e operações e referenciando `docs/licensing.md`;
  `docs/models.md` troca a recomendação fixa por seleção por complexidade, escalonamento e custo efetivo,
  com método de benchmark. Medição inicial de contexto em `benchmark.md` da change. Somente documentação
  e processo, sem mudança de API pública nem de pacotes distribuídos.

#### Fixed

- `fix-135-smart-overlay-position` - Posicionamento de Tooltip, Popover e Dropdown com flip/shift, placement efetivo, seta alinhada à âncora e recálculo após mudanças de geometria, scroll e viewport, incluindo normalização geométrica do pan após pinch zoom, sem alterar as APIs públicas.

- `fix-lint-nested-worktrees` - O lint da raiz ignora `.claude/worktrees/**` e resolve
  `tsconfigRootDir` pela configuração, preservando os arquivos dos worktrees (#128).

### [0.1.0] - 15-out-2026

#### Added

- `add-admin-flows` - Adicionados a `@admin-ds/admin` os fluxos `AdsListFlow`
  (filtros, tabela, paginação e ações em massa), `AdsBulkActionBar`,
  `AdsStepForm` (formulário em etapas com validação por etapa, foco, anúncio e
  confirmação final) e `AdsConfirmDialog` (confirmação destrutiva), sem regras de
  negócio nem dependência do roteador.
- `demo-advanced-patterns` - O `admin-demo` passa a demonstrar `AdsFilterBar` e
  `AdsListFlow` (com `AdsBulkActionBar` e `AdsConfirmDialog`) em `/clientes`,
  `AdsStepForm` em `/clientes/novo`, filtros, ordenação e página em
  `searchParams` no servidor, e `AdsMetricCard`, `AdsDashboardGrid` e
  `AdsDashboardPanel` na visão geral.
- `add-smart-table` - Adicionado `AdsSmartTable` em `@admin-ds/admin`: tabela
  controlada com ordenação (`aria-sort`), seleção de linhas com estado
  indeterminado, visibilidade de colunas, estados de carregamento, vazio e erro,
  rolagem horizontal acessível e paginação e filtros opcionais. `AdsTable` ganha
  `containerProps` opcional e `AdsTableRow` ganha `interactive`, compatível
  retroativamente.
- `add-filter-bar` - Adicionado `AdsFilterBar` em `@admin-ds/admin`: barra de
  filtros controlada (`value`/`onChange`), com texto, seleção, seleção múltipla
  e data, chips removíveis, layout responsivo e estados, sem acesso à URL ou ao
  roteador.
- `add-date-picker` - Adicionado `AdsDatePicker`, de data única e intervalo,
  com entrada digitada, calendário acessível por teclado, locale configurável
  (`pt-BR` padrão) e integração com `AdsField`, sem dependência de runtime.
  `AdsIconName` ganha `calendar`, `chevronLeft` e `chevronRight`, e o rótulo
  do `AdsField` recebe o id `<id do controle>-label`.
- `add-dashboard-patterns` - Adicionados `AdsMetricCard`, `AdsDashboardGrid` e
  `AdsDashboardPanel` em `@admin-ds/admin`, com estados de carregamento, erro e
  vazio e CSS próprio.
- `add-admin-shell` - Adicionado `AdsAdminShell` responsivo, com sidebar
  recolhível e navegação móvel em drawer, substituindo `createAdminShell` e
  `AdminShellProps`, removidos da API pública.
- `add-data-display-components` - Adicionados `AdsTable`, `AdsList`, `AdsCard`,
  `AdsProgress` e `AdsEmptyState` para apresentação acessível e tematizável de
  dados administrativos, com CSS público, histórias Storybook e exemplos no
  admin demo.
- `automate-release-process` - Automatizado o fluxo de preparação, validação,
  publicação recuperável e documentação operacional de releases.

#### Changed

- `npm run validate` passa no Windows: checkout novo em LF (`.gitattributes`).
- Build, testes unitários e E2E mais rápidos: `npm run build` constrói os
  pacotes uma vez (apps em paralelo), o Vitest roda uma vez na raiz e o E2E
  serve o build de produção (rode `npm run build` antes; `E2E_DEV=1` usa o
  `next dev`). Sem mudança de API pública.
- `fix-pagination-consumer-links` e `fix-navigation-consumer-links` - Adicionados
  `renderLink` aos itens de `AdsNav` e `AdsBreadcrumb` e `renderPageLink` a
  `AdsPagination`, para o consumidor fornecer o link (por exemplo `next/link`)
  sem conteúdo interativo aninhado, mantendo estilo, foco e `aria-current`.
  `renderPage` fica obsoleto, mas continua funcionando. Nenhuma prop existente
  muda.
- `fix-token-override-and-package-tests` - O README de `@admin-ds/tokens` passa a
  indicar `[data-theme='light']` e `[data-theme='dark']` para sobrescrever
  tokens, seletores que alcançam overlays em portal; `:root[data-theme=…]` não
  os alcança. O teste de CSS distribuído de `@admin-ds/components` passa a ser
  executado pelo Vitest, e os links de `AdsNav` deixam de mostrar o sublinhado
  nativo. Nenhuma prop, tipo, classe `ads-*` ou variável `--ads-*` muda.
- `fix-navigation-theme-contrast` - Corrigido o contraste de `AdsBreadcrumb` e
  `AdsTabs` nos temas claro e escuro. Os links do breadcrumb deixam de usar a
  cor padrão do navegador (`text-text-muted`, com `hover:text-text`). A tab
  ativa passa a mostrar a superfície, a cor de texto e a borda de seleção, que
  perdiam a disputa de cascata, e a tab inativa passa de `text-primary` para
  `text-text-secondary`. Nenhuma prop, tipo, classe `ads-*` ou variável
  `--ads-*` muda; a aparência de tabs e breadcrumb muda de forma intencional.
  O `fieldset` de `AdsSelectionGroup` deixa de mostrar a moldura padrão do
  navegador, que no tema escuro aparecia como borda clara.
- `add-nextjs-admin-demo` - O admin demo passa a ser uma aplicação multi-rota
  com layout administrativo compartilhado (visão geral, clientes, novo cliente,
  preferências, catálogo de componentes e exibição de dados), navegação por
  `next/link` com página atual identificada, estado de tema compartilhado e
  testes de consumo público, acessibilidade e responsividade por rota. Restrito
  ao admin demo, sem mudança de API pública.
- `migrate-demo-consumer-links` - O admin demo passa a usar `renderPageLink` na
  paginação de `/clientes` e `renderLink` com `next/link` em `AdsNav` e
  `AdsBreadcrumb`, e `docs/integration.md` reflete o exemplo. O `AdsButton`
  passa a herdar a fonte da página, inclusive na paginação, como os links. Sem
  mudança de API pública.
- `update-node-24` - Atualizados `engines.node` (`>=24.0.0`), CI, release e
  `@types/node` para o Node.js 24; adicionado `.nvmrc` e documentada a versão
  exigida no README. Quem usa Node.js 22 precisa atualizar o runtime.

### [0.0.1] - 08-set-2026

#### Changed

- `refine-component-visual-language` - Refinada a linguagem visual dos
  componentes existentes para maior hierarquia, contraste e consistência entre
  temas claro e escuro.
- Adicionados tokens semânticos para superfícies de hover e seleção, bordas
  fortes, foco, hover de ações, elevação e camadas de overlay.
- Refinados estados de botões, campos, controles de seleção e composição de
  formulários, distinguindo somente leitura, erro, sucesso e indisponibilidade.
- Ajustada a seleção estrutural de navegação e tabs, além de alvos e
  estabilidade visual da paginação em larguras reduzidas.
- Aplicada escala de profundidade e espaçamento responsivo a dropdowns,
  dialogs, drawers, tooltips, popovers e toasts.
- Mantidas as APIs públicas, o CSS distribuído e o escopo do Storybook sem
  alterações estruturais.

- `refine-visual-foundation` - Revisada a fundação visual global de
  tipografia, cores, estados e temas claro/escuro.
- Refinados critérios de contraste WCAG 2.2 AA e estados de foco.
- Atualizados densidade e hierarquia visual dos componentes existentes sem
  criar novas APIs.
- Atualizados exemplos e validações visuais dos componentes.

#### Added

- Adicionada cobertura de testes para os novos estados e comportamentos
  compactos.
- `add-navigation-components` - Adicionados `AdsBreadcrumb`, `AdsNav` e
  `AdsTabs`.
- Adicionados `AdsDropdown` e `AdsPagination` com teclado, foco, Escape e
  posicionamento responsivo.
- Publicados tipos, exports, estilos compilados e testes da família de
  navegação.

- `add-overlay-components` - Adicionados `AdsDialog` e `AdsDrawer` com
  gerenciamento de foco e fechamento previsível.
- Adicionados `AdsTooltip`, `AdsPopover` e `AdsToast` com semântica acessível
  e suporte a temas.
- Adicionados testes de interação, acessibilidade e consumo do CSS distribuído.

- `add-form-components` - Adicionados `AdsInput`, `AdsTextarea`, `AdsSelect`,
  `AdsCheckbox`, `AdsRadio` e `AdsSwitch`.
- Adicionadas composições `AdsField`, `AdsInputGroup` e `AdsSelectionGroup`.
- Definidos estados de foco, validação, sucesso, somente leitura e desabilitado.
- Adicionados testes de teclado, acessibilidade, temas e associação semântica
  de campos.

- `add-core-primitives` - Adicionados `AdsButton`, `AdsBadge`, `AdsAvatar`,
  `AdsSurface`, `AdsTypography`, `AdsIcon` e `AdsLoadingIndicator`.
- Definidas variantes, tamanhos, estados e APIs públicas com prefixo `Ads`.
- Publicados estilos compilados e documentação visual dos componentes.

- `establish-design-system-foundation` - Estruturado o monorepo com workspaces
  para tokens, componentes, documentação e aplicações consumidoras.
- Definidos tokens semânticos de cor, tipografia, espaçamento, borda, elevação
  e movimento.
- Estabelecidos temas claro/escuro, distribuição de CSS compilado e metadados
  TypeScript.
- Configurados Tailwind CSS, Storybook, Next.js, testes, lint, typecheck e
  validações de acessibilidade.
- Definidos contratos de compatibilidade com React, TypeScript e Next.js App
  Router.
