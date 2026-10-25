# Changelog

Aqui são registradas as principais inclusões, correções e evoluções do Admin
Design System.

O formato segue as convenções do Keep a Changelog. As mudanças são organizadas
por versão e pelas changes correspondentes do OpenSpec.

### [0.1.1] - Em andamento

#### Added

- `add-ads-password-input` (issue #147) - Novo `AdsPasswordInput` em `@admin-ds/components`: campo de senha mascarado, compatível com `AdsField`, controlado ou não, com botão de visibilidade acessível (nome `Mostrar senha`/`Ocultar senha` configurável, sem `aria-pressed`, preserva valor, foco e seleção, não envia o formulário e é desabilitado com o campo), indicador opcional de força apenas orientativo (`showStrength`, `strengthLabels`, `strengthPrefix`) e lista opcional de `rules` com status em texto; força e regras ficam associadas ao campo por `aria-describedby`. Evolução compatível: `AdsInput` passa a aceitar `ref` (`forwardRef`). Novos tipos `AdsPasswordRule` e `AdsPasswordStrength`. Inclui showcase em `/catalogo/password-input`, story, documentação em `docs/integration.md`, testes unitários, SSR e E2E; o baseline de `@admin-ds/components` e o limite gzip do orçamento de navegador foram recalibrados (`docs/bundle-baseline.md`).

- `refine-dashboard-sidebar-branding` (issue #187) - Composição opcional `AdsAdminShell layout="sidebar-header"` e slot `Sidebar.header` alinham branding e controle de painel lateral ao header com altura natural, preservando layout padrão, estados e rolagem independente. O símbolo da marca mantém a posição ao expandir/recolher; o menu móvel preenche a viewport (largura total e sem cantos arredondados abaixo de 48rem, via CSS fora de `@layer` em `.ads-admin-shell-mobile-drawer`, o que prevalece sobre `className` do consumidor) e mostra apenas logo/Admin DS, sem título duplicado. `AdsDrawer` deixa de herdar o limite de altura responsivo de `AdsDialog`, corrigindo a faixa no rodapé. O seletor expandido alinha sua caixa ao destaque raiz da navegação sem variar com o nome; recolhido, sua borda fica transparente sem deslocar o avatar. O destaque ativo recolhido fica em 44×44px mesmo com scrollbar nativa visível (regressão testada sem a ocultação padrão do Chromium), com recuo lateral igual ao expandido e largura da sidebar preservada. O toggle circular com chevron fica na divisória sem aumentar a altura do topo ao recolher. `AdsOrganization.avatarTone` permite colorir o avatar no gatilho e nas opções (padrão neutral); o demo usa primary, como na conta. Demo move a marca abreviada Admin DS em uma linha para a sidebar, mantém abertura móvel alcançável e controles #185/#182; compacta localmente a Visão geral e organiza indicadores em 1/2/4 colunas pela largura útil, com 2×2 em 1280px. Seleção light suavizada por `--ads-sidebar-active-background`, sem alterar dark. Inclui stories, catálogo, documentação, testes e comparação visual.

- `issue-185-account-notifications-organization` (issue #185) - Três composições novas e independentes em `@admin-ds/admin`: `AdsAccountMenu` (menu de conta compacto aberto pelo avatar, com identidade, ações configuráveis por grupos, `Trocar conta` opcional e ações assíncronas pendentes), `AdsNotificationCenter` (sino com contador `99+` e painel lateral direito sobre `AdsDrawer`, filtros Todas/Não lidas, leitura individual e global por callbacks, estados de carregamento, vazio, erro, ação pendente e "Carregar mais"; abrir o painel nunca marca como lido) e `AdsOrganizationSwitcher` (seletor opcional no topo da sidebar, com busca, troca assíncrona sem confirmar antes do sucesso, estados e modo recolhido), sem mudança em `AdsAdminShell`. Evoluções compatíveis em `@admin-ds/components`: `AdsIcon` ganha `bell`, `building`, `chevronDown`, `chevronsUpDown`, `logOut`, `settings` e `user`; `AdsAvatar` tenta de novo a imagem quando `src` muda após uma falha e aceita `src={undefined}`. A biblioteca não implementa autenticação, autorização, backend, persistência nem transporte de notificações. Inclui stories, showcases em `/catalogo/account-menu`, `/catalogo/notification-center` e `/catalogo/organization-switcher` (com exemplo da sidebar sem seletor), integração no cabeçalho e na sidebar do admin demo com dados fictícios, documentação em `docs/integration.md` e testes unitários, de acessibilidade, SSR e E2E. Efeito observável no demo: sino de notificações e avatar da conta no cabeçalho e seletor de organização no topo da sidebar; o menu de tema do cabeçalho mantém o gatilho só com ícone e passa a mostrar ícone e texto nas opções (`optionDisplay="icon-text"`); tema e sino ficam sem borda no cabeçalho e o avatar da conta ganha fundo. `AdsAvatar` ganha `tone` (`neutral` padrão, `primary`, `success`, `warning`, `danger`), `backgroundColor` e `foregroundColor` (qualquer cor CSS); `AdsAccountMenu` aceita `user.avatarTone`, `avatarBackgroundColor` e `avatarForegroundColor` (padrão `primary`); `AdsThemeControl` ganha `triggerVariant` (`secondary` padrão, `ghost` sem borda), tudo aditivo; os baselines visuais do demo devem ser regenerados pelo workflow "Atualizar baselines visuais".

- `issue-94-quality-documentation` (issue #94) - Inspeção de distribuição e JS/CSS publicado com gzip por arquivo, cenários de bundle minificado, orçamentos versionados, documentação de migração e limitações por componente. Limites de navegador e de cenários calibrados com folga de cerca de 10% sobre um build medido; cenários medem também o CSS público; testes dos orçamentos, inclusive de integração que executam `inspect:packages` com limites reduzidos; cobertura publicada como artefatos (V8 dos testes Node e relatório Vitest via `npm run test:coverage`); `esbuild` e `@vitest/coverage-v8` declarados como devDependencies. Sem mudança de API pública.
- `issue-182-theme-control` (issue #182) - Novo `AdsThemeControl`: seletor exclusivo de Claro, Escuro e Sistema (`AdsThemePreference`), com botão compacto só com ícone que abre um menu de opções (`variant="menu"`, padrão) ou grupo inline (`variant="group"`), opções só com ícones, tooltips e nomes acessíveis (`optionDisplay="icon"`; ícone e texto opcional), `labels` personalizáveis, `disabled`, estado controlado (`value`/`onValueChange`) e não controlado (`defaultValue`, padrão `system`) e sincronização externa sem remontagem nem perda de foco. A biblioteca só emite a preferência: sem provider, persistência nem acesso ao DOM global. `AdsIcon` ganha `sun`, `moon` e `monitor`; `AdsDropdown.Item` aceita `role="menuitemradio"` (a escolha devolve o foco ao gatilho), `AdsDropdown.Trigger` aceita `variant` e `size` e `AdsTooltip` aceita `showOnFocus` e `describeTrigger`, tudo de forma aditiva. `ThemeToggle` permanece inalterado (migração em `docs/integration.md`). No admin demo, cabeçalho (menu de ícones) e Preferências (grupo) compartilham a preferência guardada em `<html>`, persistida no cookie `ads-theme` (`light`, `dark` ou `system`; cookies anteriores continuam válidos); Sistema segue `prefers-color-scheme` enquanto selecionado, com script inicial em todos os builds para evitar flash e fallback `light` no servidor. Inclui stories, showcase `/catalogo/theme-control`, testes unitários e E2E. Efeito observável no demo: o padrão sem preferência salva passa a ser Sistema e o botão "Usar tema claro/escuro" do cabeçalho é substituído pelo menu "Tema: …"; os baselines visuais do demo devem ser regenerados pelo workflow "Atualizar baselines visuais".

- `issue-92-admin-flows` (issue #92) - `AdsDialogProps` expõe `role` (`dialog` | `alertdialog`). `AdsConfirmDialog` usa `alertdialog` quando `destructive` (padrão) e `dialog` caso contrário, com `role` explícito prevalecendo; foco, `Escape` e `pending` não mudam. `AdsStepForm` permite navegar pelo indicador de etapas anteriores e das já validadas ao avançar (editar a etapa remove a marca) e aceita `validate` assíncrona (`Promise<boolean>`) com `aria-busy`, anúncio `labels.validating`, carregamento no botão e descarte de resultado obsoleto; rejeição conta como etapa inválida e `validate` síncrona segue síncrona. Stories e catálogo do admin demo atualizados; `docs/limitations.md` e `docs/integration.md` revisados. Efeito observável: `AdsConfirmDialog` destrutivo passa a expor `role="alertdialog"` (use `role="dialog"` para manter o papel anterior).

- `issue-136-admin-shell-fixed-sidebar` (issue #136) - No layout desktop do `AdsAdminShell`, header e sidebar permanecem fixos e o conteúdo principal e a sidebar rolam de forma independente, com altura limitada à viewport (`100dvh`) e sem rolagem duplicada da página. Header com várias linhas não sobrepõe sidebar nem main. `AdsAdminShell.Main` passa a ser focável por padrão (`tabIndex={0}`, sobrescrevível) por ser a região rolável. Layout móvel e Drawer inalterados; sem mudança incompatível de API pública. Inclui story, documentação de integração e E2E em 1280×800, 768×600, 390×844 e altura reduzida.

- `enhance-93-smart-table-virtualization-resize-export` (issue #93) - `AdsSmartTable` ganha, de forma opcional e sem quebra de compatibilidade, virtualização de linhas de altura fixa (`virtualization`, com `aria-rowcount`/`aria-rowindex`, cabeçalho fixo e foco e seleção preservados), redimensionamento de colunas acessível por teclado e ponteiro (`columnWidths` e `onColumnWidthsChange`, alça `role="separator"`, `minWidth`, `maxWidth`, `resizable`) e gancho de exportação (`onExport` com colunas visíveis, `exportValue` e `exportable`), além do helper `getAdsSmartTableCsv`, que neutraliza fórmulas. Sem busca, ordenação ou paginação na tabela e sem dependências novas. Inclui stories, página `/componentes/tabela-avancada` no admin-demo, testes, E2E, atualização de `docs/limitations.md` e `docs/integration.md` e do baseline de `@admin-ds/admin` (199723 para 236799 bytes).

- `issue-151-admin-demo-component-catalog` (issue #151) - Catálogo pesquisável com rotas para todos os exports públicos de UI, composições executáveis, snippets TSX copiáveis, temas e inspeção de largura. Navegação hierárquica reutilizável em `AdsAdminShell.Navigation`, `NavigationSection`, `NavigationGroup` e `NavigationItem`, com seções nomeadas acessíveis, categorias expansíveis com ícones ou iniciais distintos, links recuados e nomes simplificados. Preserva rotas de aplicação, expansão entre páginas, export estático no GitHub Pages e compatibilidade das APIs existentes. Inclui matriz de cobertura, documentação e testes de teclado, interações, acessibilidade e responsividade.

- `fix-138-responsive-pagination` (issue #138) - AdsPagination passa a observar a largura do próprio contêiner e oferece, por props opcionais, setas, primeira/última página, salto direto validado, carregamento e rótulos personalizáveis. Mantém os controles de texto por padrão. Inclui salto por links sem formulário aninhado, correção controlada de página inválida, preservação de foco e rodapé opcional da SmartTable com tamanho controlado e resumo das linhas recebidas. A documentação esclarece a personalização conjunta de texto/nome acessível, o limite de adjacentes por `siblingCount` e a escolha dos controles nativos.

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

- `fix-pages-navigation` (issue #189) - Move o acesso opcional ao Storybook do cabeçalho para a navegação principal, disponível também na sidebar recolhida e no menu móvel.

- `issue-151-admin-demo-component-catalog` (issue #151) - Inclui a resolução local de dependências transitivas no lockfile, sem alterar os manifests ou as versões principais da interface, e os imports de tipos gerados para o modo de desenvolvimento do Next.js.

- `enhance-134-overlay-layer-manager` (issue #134) - Gerenciamento interno de camadas dos overlays: somente o modal superior trata Tab/Shift+Tab (popups descendentes seguem o próprio fluxo), o clique externo respeita a hierarquia lógica dos portais, o backdrop fecha apenas a camada superior quando há um popup aberto, e o scroll da página fica bloqueado enquanto houver modal, com restauração ao fechar o último. Sem mudança em APIs públicas ou CSS.

- `optimize-incremental-validation` (issue #164) - Validação por impacto na CI e localmente. Classificador conservador de workspaces e dependentes transitivos (`scripts/ci-impact.mjs`, `docs/ci-impact-validation.md`) com fallback completo; a CI dispensa apenas builds de aplicações e E2E em PRs para `develop` cujo impacto é conhecido, mantendo `Qualidade rápida`, `Política de develop`, builds e inspeção dos pacotes completos e os nomes dos checks obrigatórios. Corrige a dispensa de E2E em PRs só de documentação, que não funcionava nos jobs em container (`HEAD^1` inacessível em checkout raso). Novos comandos opcionais `validate:impact:*`, `scripts/ci-metrics.mjs` e workflow manual `ci-metrics.yml` para comparar execuções (duração, falhas e reruns; tokens e custo não disponíveis). Cache e artefatos entre jobs avaliados e não adotados, com números. Nenhum ganho de tempo é declarado como medido antes de execuções pós-merge.

- `#169` - Instruções obrigatórias para agentes registrarem alterações relevantes no `CHANGELOG.md`, com referência à issue/change e justificativa explícita na PR quando não houver entrada aplicável. Benchmark de aderência registrado em `openspec/changes/archive/2026-10-22-optimize-ai-agent-context/benchmark-changelog-adherence.md`: registro no changelog em 6/6 execuções na base e 6/6 no head, sem regressão.
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

- `fix-pages-navigation` (issue #189) - Corrige a validação do logo visível no GitHub Pages para não confundir as marcas responsivas desktop e móvel, cobrindo os estados do menu nos dois temas. A validação Pages também executa em PRs para develop no Linux, sem publicação.

- `issue-151-admin-demo-component-catalog` (issue #151) - Preserva os grupos expandidos/recolhidos da sidebar durante a navegação e abre o grupo do destino sem remontar os demais.

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
