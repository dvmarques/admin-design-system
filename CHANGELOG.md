# Changelog

Aqui são registradas as principais inclusões, correções e evoluções do Admin
Design System.

O formato segue as convenções do Keep a Changelog. As mudanças são organizadas
por versão e pelas changes correspondentes do OpenSpec.

### [0.1.1] - Em andamento

#### Added

- `issue-241-highlighted-code-catalog` (#241) - O componente opcional AdsHighlightedCodeSnippet passa a integrar a busca, a categoria Dados e a documentação interativa do catálogo, com Storybook e link ao exemplo avançado, sem mover Shiki para os pacotes principais.

- `add-ads-combobox-autocomplete` (issue #142) - Novos `AdsCombobox` e `AdsAutocomplete` com ícones e avatares opcionais por opção, exibição configurável e seleção única acessível, valor separado do texto, busca local e remota, debounce, descarte de respostas obsoletas, portal compatível com diálogos e temas, controles de limpar e abrir integrados ao campo e seta do AdsSelect com recuo e espaço para texto (parte da issue #140), exemplos no catálogo com orientação de uso de cada componente e itens da sidebar ordenados alfabeticamente por grupo, stories, testes e guia de migração sem `react-select`. Mudanças observáveis: Home/End preservam a edição de texto (não navegam mais pelas opções), o popup passa a ser uma `section` rotulada com o `ul[role=listbox]` interno (visível apenas com resultados), glifos de limpar/abrir viram `AdsIcon`, todo `AdsSelect` simples emite `ads-select` com seta desenhada por CSS, e o `AdsAutocomplete` remoto exibe "Digite para buscar" abaixo de `minQueryLength`. Orçamentos elevados pelo custo medido: JS/CSS publicado de `@admin-ds/components` 197.500 → 226.000 bytes (medido 221.905; gzip 62.700 → 68.500, medido 67.110), baseline do dist 428.028 → 457.000 e CSS dos cenários `components-public` gzip 9.000 → 9.150 e `admin-public` 93.000 → 94.800 / gzip 14.100 → 14.300, sem dependência nova.

- `feat-145-ads-alert-callout` (issue #145) - Novo componente `AdsAlert` inline persistente com variantes semânticas, apresentação compacta ou destacada, ações e fechamento opcional controlado/não controlado; exemplos no catálogo e Storybook, ícone padrão distinto por severidade e fallback de `forced-colors` por borda e preservação do foco ao fechar (`returnFocusRef`). Orçamentos elevados pelo custo medido do componente: JS/CSS publicado de `@admin-ds/components` 191.250 → 197.500 bytes (medido 197.216) e CSS gzip do cenário `admin-public` 13.900 → 14.100 bytes (medido 13.915), sem dependência nova. `AdsIcon` ganha `alertTriangle` e `alertCircle` (a união `AdsIconName` fica mais larga; consumidores com `switch` exaustivo precisam tratar os novos nomes).

- `feat-226-loading-text` (issue #226) - Novo atom `AdsLoadingText` com texto sempre visível, efeito shimmer opcional e velocidades configuráveis, temas, reduced motion e forced-colors, exemplos no Storybook e catálogo, testes e documentação.

- `adopt-mit-license` (issue #219) - Licença MIT do código próprio em `LICENSE.md`, identificador SPDX nos manifests e lockfile e documentação de uso, preservando licenças e atribuições de terceiros.

- `feat-213-highlighted-code-snippet` (#213) - Pacote opcional com Shiki e catálogo para destacar código. Tema `auto` por `data-theme` ancestral, sem flash nem tokenização dupla; trata linhas vazias e CRLF, recupera falhas do motor, garante contraste do número de linha e acessibilidade da cópia, e limita a 1000 linhas/100 000 caracteres.

- `feat-212-demo-auth-flow` (issue #212) - Telas simuladas de login e de senha no demo, que ocupam a viewport sem crescimento causado pelo SVG decorativo: login compacto em telas baixas e rolagem interna acessível quando o conteúdo excede a área, preservando temas e controles (`fix-demo-auth-viewport`).

- `add-codex-project-configuration` - Configuração Codex versionada: MCPs alinhados ao Claude/Cursor, revisores TOML de acessibilidade e API pública e hooks nativos de `apply_patch` que protegem arquivos gerados (inclusive com caixa alternativa no Windows) e formatam com Prettier; negam falhas do bootstrap e aceitam worktrees por symlink/junction. Guia único `docs/agent-setup.md` (ativação, skills, MCPs, revisores e limites dos hooks de Codex, Claude Code e Cursor), que substitui o guia exclusivo do Codex.

- `issue-210-contribution-governance` (issue #210) - Templates de issues e PR, guia CONTRIBUTING e documentação do ciclo OpenSpec com gates de archive/sync, revisão e merge, preservando o fluxo de releases.

- `issue-197-evidence-history` (issue #197) - Separação entre procedimentos vigentes e histórico de bundle, CI e Playwright, com a cronologia movida para comentários nas issues de origem. Índice de documentação, reconciliação dos 17 títulos da change de 06/09 (`docs/openspec-history-reconciliation.md`) e inventário das tasks abertas em changes arquivadas (`docs/archived-openspec-followups.md`). Sem alterar orçamentos, snapshots ou testes.

- `add-ads-password-input` (issue #147) - Novo `AdsPasswordInput` em `@admin-ds/components`: campo de senha mascarado, compatível com `AdsField`, controlado ou não, com botão de visibilidade acessível (`Mostrar senha`/`Ocultar senha`, configurável), indicador opcional de força apenas orientativo (`showStrength`, `strengthLabels`, `strengthPrefix`) e lista opcional de `rules` com status em texto (`test` deve ser puro; se lançar erro, a regra fica pendente). Novos tipos `AdsPasswordRule` e `AdsPasswordStrength`. `AdsInput` passa a aceitar `ref` (`forwardRef`; só quem o chama como função é afetado). Inclui showcase, story, documentação, testes e recalibração do baseline de `@admin-ds/components` (`docs/bundle-baseline.md`).

- `refine-dashboard-sidebar-branding` (issue #187), com os ajustes de `fix-logo-sidebar-alignment` e `stabilize-sidebar-icon-position` (#205) - Composição opcional `AdsAdminShell layout="sidebar-header"` e slot `Sidebar.header` alinham branding e controle de painel lateral ao header, preservando layout padrão, estados e rolagem independente. Marca e ícones de navegação mantêm a mesma posição ao expandir ou recolher (destaque ativo de 44×44px, mesmo com scrollbar nativa; gutter da scrollbar reservado no desktop). O menu móvel preenche a viewport (via CSS fora de `@layer` em `.ads-admin-shell-mobile-drawer`, que prevalece sobre `className`) e `AdsDrawer` deixa de herdar o limite de altura de `AdsDialog`. `AdsOrganization.avatarTone` colore o avatar do seletor. O demo passa a usar a marca abreviada Admin DS na sidebar e organiza os indicadores em 1/2/4 colunas. Seleção light suavizada por `--ads-sidebar-active-background`; dark inalterado.

- `issue-185-account-notifications-organization` (issue #185) - Três composições independentes em `@admin-ds/admin`: `AdsAccountMenu` (menu de conta aberto pelo avatar, com ações por grupos, `Trocar conta` opcional e ações assíncronas pendentes), `AdsNotificationCenter` (sino com contador `99+` e painel lateral sobre `AdsDrawer`, filtros, leitura individual e global por callbacks e estados de carregamento, vazio, erro e "Carregar mais"; abrir o painel nunca marca como lido) e `AdsOrganizationSwitcher` (seletor no topo da sidebar, com busca, troca assíncrona e modo recolhido). Sem autenticação, autorização, backend nem transporte de notificações, e sem mudança em `AdsAdminShell`. Evoluções aditivas: `AdsIcon` ganha `bell`, `building`, `chevronDown`, `chevronsUpDown`, `logOut`, `settings` e `user`; `AdsAvatar` ganha `tone`, `backgroundColor` e `foregroundColor`, tenta de novo a imagem quando `src` muda após falha e aceita `src={undefined}`; `AdsAccountMenu` aceita `user.avatarTone`, `avatarBackgroundColor` e `avatarForegroundColor`; `AdsThemeControl` ganha `triggerVariant` (`secondary` ou `ghost`). No demo: sino e avatar no cabeçalho e seletor de organização na sidebar, com dados fictícios. Inclui stories, showcases em `/catalogo/*`, documentação e testes.

- `issue-94-quality-documentation` (issue #94) - Inspeção de distribuição e JS/CSS publicado com gzip por arquivo, cenários de bundle minificado, orçamentos versionados (folga de cerca de 10% sobre um build medido), documentação de migração e limitações por componente, e cobertura publicada como artefatos. `esbuild` e `@vitest/coverage-v8` entram como devDependencies. Sem mudança de API pública.

- `issue-182-theme-control` (issue #182) - Novo `AdsThemeControl`: seletor exclusivo de Claro, Escuro e Sistema (`AdsThemePreference`), em menu (`variant="menu"`, padrão) ou grupo inline (`variant="group"`), com `optionDisplay`, `labels`, `disabled`, estado controlado e não controlado (`defaultValue` padrão `system`). A biblioteca só emite a preferência, sem provider, persistência nem acesso ao DOM global. Evoluções aditivas: `AdsIcon` ganha `sun`, `moon` e `monitor`; `AdsDropdown.Item` aceita `role="menuitemradio"`; `AdsDropdown.Trigger` aceita `variant` e `size`; `AdsTooltip` aceita `showOnFocus` e `describeTrigger`. `ThemeToggle` permanece inalterado (migração em `docs/integration.md`). No demo, cabeçalho e Preferências compartilham a preferência persistida no cookie `ads-theme` (`light`, `dark` ou `system`), com script inicial para evitar flash. Efeito observável: o padrão sem preferência salva passa a ser Sistema e o botão "Usar tema claro/escuro" é substituído pelo menu "Tema: …".

- `issue-92-admin-flows` (issue #92) - `AdsDialogProps` expõe `role` (`dialog` | `alertdialog`). `AdsConfirmDialog` usa `alertdialog` quando `destructive` (padrão) e `dialog` caso contrário. `AdsStepForm` permite navegar pelo indicador de etapas anteriores e validadas e aceita `validate` assíncrona (`Promise<boolean>`) com `aria-busy`, anúncio `labels.validating` e descarte de resultado obsoleto. Efeito observável: `AdsConfirmDialog` destrutivo passa a expor `role="alertdialog"` (use `role="dialog"` para manter o papel anterior).

- `issue-136-admin-shell-fixed-sidebar` (issue #136) - No desktop, header e sidebar do `AdsAdminShell` ficam fixos e conteúdo e sidebar rolam de forma independente, limitados a `100dvh`, sem rolagem duplicada. `AdsAdminShell.Main` passa a ser focável por padrão (`tabIndex={0}`, sobrescrevível) por ser a região rolável. Layout móvel e Drawer inalterados.

- `enhance-93-smart-table-virtualization-resize-export` (issue #93) - `AdsSmartTable` ganha, de forma opcional, virtualização de linhas de altura fixa (`virtualization`), redimensionamento de colunas acessível por teclado e ponteiro (`columnWidths`, `onColumnWidthsChange`, `minWidth`, `maxWidth`, `resizable`) e gancho de exportação (`onExport`, `exportValue`, `exportable`), além do helper `getAdsSmartTableCsv`, que neutraliza fórmulas. Sem dependências novas. Inclui página `/componentes/tabela-avancada` no demo, stories, testes e atualização de `docs/limitations.md`, `docs/integration.md` e do baseline de `@admin-ds/admin`.

- `issue-151-admin-demo-component-catalog` (issue #151) - Catálogo pesquisável com rotas para todos os exports públicos de UI, composições executáveis, snippets TSX copiáveis, temas e inspeção de largura. Navegação hierárquica reutilizável em `AdsAdminShell.Navigation`, `NavigationSection`, `NavigationGroup` e `NavigationItem`, com seções nomeadas, categorias expansíveis (estado preservado entre páginas, abrindo o grupo do destino sem remontar os demais) e links recuados. Preserva rotas de aplicação, export estático no GitHub Pages e compatibilidade das APIs existentes. Inclui matriz de cobertura, documentação e testes; resolução local de dependências transitivas no lockfile.

- `fix-138-responsive-pagination` (issue #138) - `AdsPagination` observa a largura do próprio contêiner e oferece, por props opcionais, setas, primeira/última página, salto direto validado, carregamento e rótulos personalizáveis, mantendo os controles de texto por padrão. Rodapé opcional da SmartTable com tamanho controlado e resumo das linhas.

- `apply-purple-brand-identity` - Logotipo do projeto (símbolo "A" em roxo profundo) em `assets/brand`, com SVG como fonte, PNG derivado, favicon e lockups claro e escuro. Exibido no cabeçalho e favicon do demo, no Storybook e no README, resolvendo sob o subcaminho do repositório no GitHub Pages. A paleta do logotipo é independente da escala `brand*` dos tokens. Sem mudança em pacotes publicados nem em APIs públicas.

- `tabs-breadcrumb-accordion` (issue #90) - Novo `AdsAccordion` composto (`Root`, `Item`, `Header`, `Trigger`, `Panel`) com `type` `single` (com `collapsible`) ou `multiple`, estado controlado ou não, `unmountOnCollapse` e teclado (↑, ↓, Home, End). `AdsTabs` ganha `activationMode`, `orientation` e `keepMounted`. `AdsBreadcrumb` ganha `maxItems`, `itemsBeforeCollapse`, `itemsAfterCollapse`, `expandLabel` e `separator`. As partes também são exportadas por nome (`AdsTabsList`, `AdsAccordionItem` etc.) para uso em Server Components; `AdsTabs` e `AdsAccordion` declaram `"use client"` e `verify-package` falha se `navigation.js` usar APIs só de cliente. Três correções em `AdsTabs`: o gatilho deixa de submeter formulários (`type="button"`), o `onClick` do consumidor passa a ser chamado e os ids de tab e painel mudam de formato (derivam do `value` codificado), então seletores que dependiam do formato antigo devem usar papéis ARIA. Sem outra mudança incompatível.

- `add-metric-sparkline` (issue #89) - Novo `AdsSparkline` em `@admin-ds/components`: gráfico de linha em SVG, sem dependência de runtime, com `values`, `min`, `max`, `labels`, `tone`, `label`, `summary` e `formatValue`, nome acessível, cores por token e `forced-colors`, compatível com Server Components. `AdsMetricCard` ganha a prop opcional `sparkline`, colorida pelo `sentiment`. `success` e `danger` entram nos pares de contraste (3:1). A visão geral do demo exibe séries e o indicador Cancelamentos.

- `add-visual-identity` (issue #118) - Etapa inicial da identidade visual. No tema escuro, `--ads-color-surface-muted` e `--ads-color-surface-hover` deixam de valer o mesmo que `--ads-color-surface-raised`. Novos `--ads-spacing-5`, `-10`, `-12` e `-16`, tokens de gráfico `--ads-color-chart1` a `--ads-color-chart8` (contraste mínimo de 3:1 nos dois temas) e `--ads-typography-font-family-heading` e `-mono`. A escala `brand50`…`brand900` passa a ser a referência de `primary`, foco e seleção, sem mudar a aparência. Novo `docs/visual-identity.md` e story Foundation/Visual identity. **A fonte padrão mudou**: `--ads-typography-font-family` passa de Aptos/Segoe UI para uma pilha que começa em `Inter`; a biblioteca não distribui a fonte, então a aplicação deve carregá-la (por exemplo com `next/font`, veja `docs/visual-identity.md`) ou sobrescrever o token, e sem isso o texto usa a fonte de sistema da pilha (impacto visual para consumidores). O demo e o Storybook carregam a Inter com `@fontsource/inter` (dependência só dessas aplicações).

#### Changed

- `issue-192-confirm-dialog-initial-focus` (issue #192) - Formaliza o foco inicial de `AdsConfirmDialog` na spec, em `docs/integration.md` e no comentário público: primeiro controle interativo elegível de `children` e, sem ele, "Cancelar". O foco inicial de diálogos e drawers passa a ignorar controles desabilitados por `fieldset`, ocultos e inertes. Testes da composição e exemplo com conteúdo interativo no Storybook e no catálogo.

- `modal-inert-background` e `enhance-134-overlay-layer-manager` (issues #149, #134) - Com `AdsDialog` ou `AdsDrawer` aberto, o conteúdo fora do overlay fica `inert`, com restauração do estado anterior ao fechar (inclusive um `inert` da aplicação) e suporte a modais aninhados em qualquer ordem de fechamento. Popovers, tooltips, menus e calendários abertos a partir do modal seguem interativos, e `AdsToast` nunca fica inerte. Gerenciamento interno de camadas: só o modal superior trata Tab, o clique externo respeita a hierarquia dos portais, o backdrop fecha só a camada superior e a rolagem da página fica bloqueada enquanto houver modal. **Mudança de comportamento**: não é mais possível interagir com a página por trás de um modal aberto. Sem `inert` no navegador, o comportamento anterior continua.

- `polimento-visual-tokens` (issue #88) - Elevação por tema, densidade de tabela e tokens de skeleton; props opcionais em `AdsTable`, `AdsSmartTable`, `AdsSkeleton` e `AdsEmptyState`. `AdsMetricCard` e `AdsDashboardPanel` renderizam `AdsEmptyState` compacto quando `empty` é texto ou número (DOM distinto do texto solto anterior).

- `acessibilidade-visual-estilos` (issue #87) - Movimento por token, `forced-colors` e `prefers-contrast` no CSS distribuído; token `border-control` (3:1) e somente leitura via `[readonly]` sem afetar `AdsSelect`.

- `fix-pages-navigation` (issue #189) - O acesso opcional ao Storybook sai do cabeçalho e vai para a navegação principal, disponível também na sidebar recolhida e no menu móvel. A validação do GitHub Pages passa a distinguir as marcas responsivas desktop e móvel, cobre os dois temas e roda em PRs para `develop` no Linux, sem publicação.

- `ci` (`speed-up-ci`, `skip-docs-only-ci`, `add-visual-regression-and-cross-browser-ci`, `ci-playwright-container-pages-baselines`, `optimize-playwright-ci-container`) - CI de PR com jobs em paralelo e cancelamento de execuções obsoletas; snapshots visuais com baselines só Linux e smoke em Firefox e WebKit. Os jobs E2E (Chromium, Firefox e WebKit), `pages.yml` e `update-visual-baselines.yml` rodam no container oficial `mcr.microsoft.com/playwright:v1.62.0-noble`, o mesmo em que os baselines são gerados e comparados, sem `playwright install --with-deps` nem cache de browsers; o passo de commit dos baselines marca o workspace como `safe.directory` para o `git` funcionar no container. Preserva Node 24, npm 11.19.1, gates e snapshots.

- `optimize-incremental-validation` (issue #164) - Validação por impacto na CI e localmente. Classificador conservador de workspaces e dependentes transitivos (`scripts/ci-impact.mjs`, `docs/ci-impact-validation.md`) com fallback completo: a CI dispensa apenas builds de aplicações e E2E em PRs para `develop` com impacto conhecido, mantendo os checks obrigatórios. Corrige a dispensa de E2E em PRs só de documentação nos jobs em container. Novos `validate:impact:*`, `scripts/ci-metrics.mjs` e workflow manual `ci-metrics.yml`. Medição pós-merge com três PRs só de documentação: tempo total de jobs −27,3% (amostra pequena; sem tokens nem custo), com evidência no archive da change.

- `reconcile-ci-docs-196` (issue #196, revisão em PR #200) - Instruções de CI, skips por impacto, snapshots Linux, checklist `test:quality`, cobertura cross-browser e contratos SSR/export estático do demo reconciliados, incluindo a correção retroativa da matriz (`theme-control` em Firefox/WebKit, Pages independente do escopo por impacto, PRs para `master` com `release-check`). Sem alterar runtime ou workflows.

- `update-openspec-1-15` - Skills geradas do OpenSpec (Codex, Claude Code e Cursor) e validações da CI passam de 1.14.1/1.10.0 para 1.15.0, preservando configuração e skills próprias. Três requisitos reorganizados em cenários para a validação estrita, sem mudar suas exigências. Adiciona `.editorconfig` (UTF-8, LF) e amplia `.gitignore` para logs, metadados de macOS/Windows e preferências locais do Claude Code.

- `agent-workflow` (`fluxo-de-agentes`, `optimize-ai-agent-context` #162, `adaptive-ai-workflow` #163, `#169`) - Compatibilidade entre Claude Code, Cursor e Codex: `AGENTS.md` como fonte única, sincronização de skills (`npm run sync:agent-skills`, verificada em `test:quality`), MCPs em `.mcp.json` e `.cursor/mcp.json`, hook `pre-commit` com Husky e lint-staged, hooks e subagents do Claude Code. Novo `docs/agent-context-map.md` com leitura de contexto por escopo, `openspec/config.yaml` condensado e `docs/models.md` com seleção de modelo por complexidade e custo. Guia e skill `adaptive-ai-workflow` para classificar mudanças Fast, Standard e Critical e orquestrar Issue → OpenSpec → PR → CI → revisão humana. Registro obrigatório no `CHANGELOG.md`, com justificativa na PR quando não houver entrada. Somente tooling e documentação.

- `protect-release-branches` - O processo de release deixa de exigir a exclusão automática de head branches desabilitada: branches `release/*` são protegidas por ruleset contra remoção, e a spec `release-process` ganha o requisito de retenção até o back-merge e a publicação. Somente documentação e processo.

- `split-long-spec-requirements` e `cleanup-project-docs-and-design-guidance` - Dez requisitos de nove specs reescritos com até 500 caracteres (detalhes movidos para cenários), com `openspec validate --all --strict` sem avisos. Documentação atualizada para os recursos entregues, sem referências externas de design nem textos obsoletos de roadmap; skills de design passam a respeitar a Inter e os tokens. Sem mudança de código, API ou aparência.

#### Fixed

- `fix-142-combobox-controlled-sources` (issue #142, revisão da PR #238) - `AdsCombobox` deixa de enviar o `value` antigo quando `inputValue` controlado diverge externamente do rótulo selecionado; `AdsAutocomplete` ganha `requestKey` opcional para invalidar consulta pendente e resultados ao trocar a origem de dados, sem refazer a busca pela mera mudança de identidade de `loadOptions`.

- `fix-pages-customers-filter-flaky-test` - Estabiliza o teste E2E do site publicado `filtros da URL funcionam em /clientes sem servidor`: a contagem era lida logo após o HTML estático (ainda sem filtro, antes da hidratação), o que fazia a CI do GitHub Pages falhar de forma intermitente. O teste agora usa a página sem filtro como referência e espera, com nova tentativa, a contagem exata de clientes inativos. Sem mudança em código publicado.

- `fix-228-loading-text-shimmer` (issue #228) - Melhora a visibilidade do shimmer de `AdsLoadingText` nos temas claro e escuro com duas camadas explícitas de gradiente e base derivada de tokens (contraste base/pico de ~4,2:1), preservando velocidades, acessibilidade e contratos públicos.

- `fix-field-sizing-and-layout` (`fix-select-sm-height-and-document-field-button-pairing`, `fix-date-picker-trigger-height`, `fix-form-control-and-shell-header-layout`, `tighten-field-feedback-spacing` #205) - `--ads-dimension-field-sm` passa de `1.75rem` para `1.875rem` (30px): `AdsSelect` `sm` sobe de 28 para 30px, igual ao `AdsInput`. O gatilho do `AdsDatePicker` tem a altura do campo em `sm`, `md` e `lg`. `AdsInput`, `AdsTextarea` e `AdsSelect` usam `box-border`, deixando de ficar 26px mais largos que a coluna em aplicações sem reset. `ThemeToggle` usa a fonte do design system e rótulo em uma linha. `AdsField` aproxima ajuda e erro do controle (4 px, sem margens nativas dos parágrafos), preservando associações acessíveis. Nova seção em `docs/integration.md` sobre botões ao lado de campos.

- `input-group-button-addons` (`add-input-group-multiple-button-addons`, `fix-input-group-button-addon`) - Um `AdsButton` em `startContent` ou `endContent` de `AdsInputGroup` fica rente ao campo e acompanha a altura dele em qualquer `size` (antes crescia o campo para 34, 38 e 42px). Vários botões no mesmo adendo ficam contíguos, com só a quina externa arredondada e junção de 1px. Texto e botão no mesmo adendo continuam sem suporte, agora documentado. Nova story `InputGroupWithButton`.

- `issue-191-button-loading-geometry` (issue #191) - `AdsButton` mantém largura, altura e posição do rótulo ao alternar `isLoading`: o rótulo fica oculto, não removido, e o indicador ocupa a mesma célula, sem alterar o posicionamento definido pelo consumidor. Inclui regressão de geometria em navegador e story.

- `fix-smart-table-caption-padding` - A legenda visível de `AdsSmartTable` ganha o espaçamento horizontal das células e o vertical da densidade. `hideCaption` e `AdsTable` isolada não mudam.

- `fix-demo-narrow-width` - A rota `/componentes` do demo deixa de rolar 6px na horizontal em 320px (grids com `minmax(0, 1fr)` e paginação com rolagem no próprio painel). O E2E de todas as rotas verifica 320px, a largura mínima da spec.

- `fix-overlays` (`fix-tooltip-preserve-aria-describedby` #148, `fix-tooltip-escape-overlays` #91, `fix-popover-content-click` #126, `fix-popover-font-inheritance`, `fix-135-smart-overlay-position`) - `AdsTooltip` preserva o `aria-describedby` do gatilho enquanto aberto e fecha com Escape sem capturar o foco, absorvendo o primeiro Escape (um diálogo ao redor exige um segundo); regressões cobrem `AdsDrawer` e o painel de colunas do `AdsSmartTable` dentro de diálogos. Cliques em campos e botões no conteúdo de `AdsPopover` mantêm o painel aberto, e `AdsDatePicker` deixa de interromper a propagação dos cliques do calendário. `AdsPopover` e o calendário usam `font-sans`. Tooltip, Popover e Dropdown posicionam com flip/shift, placement efetivo e seta alinhada à âncora, recalculando após mudanças de geometria, scroll e viewport (inclusive pan após pinch zoom). Sem mudança de API pública.

- `fix-lint-nested-worktrees` (#128) - O lint da raiz ignora `.claude/worktrees/**` e resolve `tsconfigRootDir` pela configuração.

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
