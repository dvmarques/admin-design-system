# Changelog

Aqui são registradas as principais inclusões, correções e evoluções do Admin
Design System.

O formato segue as convenções do Keep a Changelog. As mudanças são organizadas
por versão e pelas changes correspondentes do OpenSpec. Consulte a
[política editorial](docs/release-process.md#política-editorial-do-changelog-issue-286)
para distinguir mudanças públicas de manutenção interna.

### [0.1.3] - Em andamento

#### Added

- Novo `AdsTimePicker` com formatos 12h/24h, `HH:mm` canônico, passo de minutos, limites, validação e exemplos no Admin Demo/Storybook. (#144, OpenSpec `add-ads-time-picker-144`)

- Novo `AdsMultiSelect` com busca, chips removíveis, seleção múltipla controlada/não controlada, limites e serialização de formulário; Admin Demo e Storybook navegáveis. (#143, OpenSpec `add-ads-multi-select-143`)
- Novo `AdsOTPInput` para códigos numéricos com comprimento configurável, navegação nativa, colagem e autofill, estados controlados e integração a `AdsField`; exemplos no Admin Demo e Storybook. (#146, OpenSpec `add-ads-otp-input-146`)
- Tokens públicos opcionais de cor da sidebar e do header do Admin Shell (`--ads-sidebar-*`, `--ads-header-*`) com fallback dinâmico para os tokens globais; sem override, as cores renderizadas não mudam. (#306, OpenSpec `issue-306-component-color-overrides`)

#### Changed

- Política editorial das notas públicas orienta o resumo pelo impacto em quem consome os pacotes, com migrações explícitas e rastreabilidade preservada. Sem mudar releases anteriores ou validações. (#286)

- Fluxo de publicação npm ajustado para executar Trusted Publisher/OIDC no merge exato aprovado em `master`, preservando o artifact preparado em `develop`, a integridade, o back-merge e as permissões mínimas. (#298, OpenSpec `issue-298-master-release-provenance`)
- Orçamentos técnicos do `AdsTimePicker` (#144): JS/CSS publicado de `@dvmarques/admin-ds-components` 295.000→302.000 B (medido 299.472 B), gzip de navegador 89.000→91.000 B (89.847 B), `components-public` gzip 11.880→12.000 B (11.881 B), módulo `time-picker.js` ~6.935 B minificado; cenário `admin-public` 71.440→71.800 B e gzip 24.050→24.200 B após medição 71.439/24.050 B (folga mínima anterior); baseline de distribuição completa de components 628.048→693.543 B após I-1 (medido 691.541 B no Windows e 693.543 B na CI Linux/LF, com declarações e source maps do rascunho parcial controlado).
- Orçamento técnico de JS/CSS publicado de `@dvmarques/admin-ds-components` revisto de 285.000 para 295.000 bytes após medição explícita de 292.236 bytes com o novo `AdsMultiSelect`; limite gzip revisto de 86.000 para 89.000 bytes após medição de 87.601 bytes; demais cenários sujeitos à validação. (#143)
- Verificador de distribuição do peer opcional aceita as saídas JSON do npm pack 11 e 12, mantendo o contrato de tarball. (#299)
- Checks de PR otimizados: Chromium em dois shards com check obrigatório agregado, suítes de qualidade sem repetição para coletar cobertura, Pages seletivo para documentação e cancelamento apenas de execuções obsoletas de PR. Os resumos de CI exibem dispensas de escopo sem alegar testes executados; `--prefer-offline` foi removido após não mostrar ganho. Sem redução de cobertura nem de gates de segurança. (#294)
- Teste de transferência de baselines converte URLs em caminhos de arquivo compatíveis com Windows e Unix. (#294)

### [0.1.2] - 02-nov-2026

#### Added

- Adicionado `AdsFileUpload` com seleção nativa, filtros, limites, feedback acessível e estados controlados; o Admin Demo/Storybook simula a importação sem upload HTTP. (#232)

#### Changed

- Reutiliza tarballs npm imutáveis, valida origem/hashes/manifests, limita downloads e retoma falhas sem rebuild; normaliza notas da GitHub Release; atualiza guias pós-0.1.1 sem avisos e sobre Trusted Publishers. (#195)

- Atualizados `actions/checkout` para 7.0.1 e `actions/deploy-pages` para 5.0.1 (Node 24), mantendo pins por SHA. (#276, #277)

<!-- release-changelog-approved sha256:db7f0769e601ba3fe25c0ed891d9aaa2788bd4b6c9447e70fb0de5b10e9dd2fc -->

### [0.1.1] - 31-out-2026

#### Added

- Publicação npm preparada para quatro pacotes, com OIDC, tarballs verificáveis, recuperação idempotente e etapa obrigatória de revisão/aprovação editorial do changelog. Não publica automaticamente. (#195)

- README e guias de adoção externa reorganizados, com instruções Next.js, documentação e exemplos dos quatro pacotes; os avisos de pré-publicação permanecem até a primeira release. (#198, #182, #185, #187, #194, #195)

- Gates contínuos de segurança com CodeQL, npm audit, Gitleaks, políticas de exceção e triagem de alertas em PRs Ready, push e execução semanal. (#267)

- Quatro pacotes `@dvmarques/admin-ds-*` preparados com licença MIT, documentação e smoke de tarballs em Next.js externo; `highlighted-code` mantém Shiki isolado. Publicação ainda pendente. (#194)

- Referência navegável de API no Storybook com páginas MDX geradas e testadas para os exports visuais; OpenSpec 1.15.0 documentado para validação em CLI e CI. (#193, #151)

- Ícones `AdsIcon` regularizados com fontes Feather/Lucide/Hugeicons MIT/ISC e avisos de terceiros; módulo de ícones separado e snapshots de geometria. Mudança visual intencional, sem renomear APIs. (#257)

- Novo `AdsMaskedInput` em subpath opcional, com máscaras dinâmicas, numéricas e de data, tipos, SSR, acessibilidade e exemplos. `react-imask` é peer opcional; o entrypoint principal não o inclui. (#231, #252, #254, #253)

- `AdsCombobox` recebe modo `popover` e compõe `AdsOrganizationSwitcher`. **Atenção a testes:** opções agora usam `role=option`/`aria-selected`, em vez de botões com `aria-current`; produção segue compatível. (#239, #140)

- `AdsSelect` ganha placeholder opcional com `null` distinto de `""`, preservando formulários nativos, e truncamento de texto longo em selects simples, inclusive em telas estreitas. (#140)

- `AdsHighlightedCodeSnippet` incluído no catálogo e Storybook, mantendo Shiki fora dos pacotes principais. (#241)

- Novos `AdsCombobox`/`AdsAutocomplete` com seleção acessível, busca local/remota, debounce e portal; corrigidos valores controlados divergentes e invalidação de consultas por `requestKey`. (#142, #140, #238)

- Novo `AdsAlert` persistente com severidades, ações e fechamento opcional, exemplos e suporte a contraste forçado. (#145)

- Novo `AdsLoadingText` com shimmer opcional, velocidades configuráveis e respeito a reduced motion. (#226)

- Licença MIT adotada para o código próprio e SPDX nos manifests, preservando atribuições de terceiros. (#219)

- Código destacado opcional com Shiki, tema automático, linhas numeradas, botão de cópia acessível e limites contra entradas excessivas. (#213)

- Demo recebe telas simuladas de login e senha, com layout adaptado a viewports baixas e rolagem acessível. (#212)

- Configuração Codex versionada com MCPs, revisores de API/acessibilidade, hooks de formatação e proteção de arquivos gerados.

- Templates de issues/PR, guia `CONTRIBUTING` e processo de changes OpenSpec com revisão, sync/archive e gates de integração. (#210)

- Documentação separa guias vigentes de históricos de CI, bundles e Playwright, com reconciliação e referências às issues de origem. (#197)

- Novo `AdsPasswordInput` com visibilidade acessível, indicador de força opcional, estados controlados e integração com `AdsField`. (#147)

- `AdsAdminShell` ganha layout `sidebar-header` e slot de branding; sidebar e ícones ficam estáveis ao recolher, menu móvel ocupa a viewport e avatar aceita tom customizado. (#187, #205)

- Novos `AdsAccountMenu`, `AdsNotificationCenter` e `AdsOrganizationSwitcher`, com avatar, notificações e troca assíncrona de organização. UI sem autenticação, backend ou transporte embutidos. (#185)

- Qualidade passa a medir distribuição, gzip, cenários de bundle e orçamento versionado, com cobertura como artefato e guia de migração. (#94)

- Novo `AdsThemeControl` oferece Claro, Escuro e Sistema em menu ou grupo inline, com estado controlado ou próprio e preferências de tema. (#182)

- `AdsStepForm` ganha navegação por etapas validadas e validação assíncrona; `AdsConfirmDialog` destrutivo passa a usar `role=alertdialog` por padrão (opte por `dialog` para manter o anterior). (#92)

- Header e sidebar do `AdsAdminShell` passam a ser fixos no desktop, com áreas de rolagem independentes e conteúdo principal focável. (#136)

- `AdsSmartTable` ganha virtualização opcional, redimensionamento acessível de colunas e exportação por callback. (#93)

- Catálogo pesquisável de componentes com rotas, exemplos TSX copiáveis, inspeção de temas e navegação hierárquica. (#151)

- `AdsPagination` ganha modo responsivo por largura do contêiner e controles opcionais; SmartTable recebe rodapé com paginação configurável. (#138)

- Identidade visual roxa aplicada a logo, favicon, assets, demo, Storybook e README, com variações para temas claro e escuro.

- Novos `AdsAccordion` composto e opções para `AdsTabs` e `AdsBreadcrumb`. **Atenção:** IDs de tabs/painéis mudaram; testes devem usar papéis ARIA, não seletores atrelados ao ID antigo. (#90)

- Novo `AdsSparkline` SVG acessível, sem dependência runtime, com integração opcional a `AdsMetricCard`. (#89)

- Tokens visuais de paleta, espaçamento e gráficos ampliados. **Mudança visual:** fonte padrão passa a priorizar Inter; consumidores devem carregá-la ou sobrescrever o token. (#118)

#### Changed

- Workflows endurecidos com Actions fixadas em SHA, Playwright por digest OCI, checkout sem credenciais persistentes e snapshots produzidos na branch de origem. (#268)

- Atualização do toolchain: React 19, Next 16, Storybook 10.6, Playwright 1.64, TypeScript 6, Vitest 5 e jsdom 30. **Atenção:** nomes acessíveis de conta/organização incluem iniciais. Risco residual: 14 avisos moderados em dev, nenhum em produção. (#265, #270, #268, #267)

- Escape do painel de colunas da SmartTable passa a ser consumido localmente sem acionar camadas externas. (#133)

- Referências identificáveis de consumidores privados removidas da documentação, exemplos e histórico OpenSpec. (#251)

- Catálogo agrupa famílias de componentes na sidebar, mantendo busca por export e URLs legadas. (#240)

- Foco inicial de `AdsConfirmDialog` prioriza primeiro controle elegível ou Cancelar; overlays ignoram elementos ocultos ou desabilitados. (#192)

- `AdsDialog`/`AdsDrawer` deixam fundo `inert`, gerenciam camadas e bloqueiam rolagem. **Mudança comportamental:** não se interage com a página por trás do modal aberto. (#149, #134)

- Tokens de elevação e densidade ajustados; tabelas, skeleton e estados vazios ganham opções. **Mudança de DOM:** cartões com `empty` passam a renderizar `AdsEmptyState`. (#88)

- CSS distribuído aprimora reduced motion, alto contraste, bordas de controles e readonly. (#87)

- Acesso ao Storybook migra para a navegação principal; validação do Pages cobre temas e variantes responsivas. (#189)

- CI paraleliza jobs, cancela execuções obsoletas de PR e verifica E2E em Chromium, Firefox e WebKit, com snapshots Linux e baseline em container Playwright.

- Validação incremental usa classificador conservador de impacto, com fallback completo para mudanças globais e desconhecidas. (#164)

- Guias de CI, snapshots, E2E, cobertura e SSR/export estático reconciliados com o comportamento real dos workflows. (#196, #200)

- OpenSpec atualizado para 1.15.0 com skills sincronizadas, validação estrita, `.editorconfig` e limpeza de regras de Git.

- Fluxos de Claude Code, Cursor e Codex alinhados a `AGENTS.md`, MCPs, skills, pre-commit e guia adaptativo Issue → OpenSpec → PR → CI. (#162, #163, #169)

- Branches `release/*` protegidas contra remoção até back-merge e publicação; fluxo de release mantém exclusão automática das demais branches.

- Specs longas divididas em cenários e documentação de desenvolvimento atualizada para os contratos vigentes.

#### Fixed

- Ciclo de Tab dos overlays respeita `tabindex` positivo, grupos de rádio e foco inicial em modal montado aberto; limitação de iframe documentada. (#259, #262)

- Armadilha de Tab dos overlays ignora controles desabilitados, ocultos, inertes ou em detalhes fechados, como já faz o foco inicial. (#234, #252)

- Adendos e botões de `AdsInputGroup` impedem quebra dos rótulos e acomodam larguras estreitas. (#243)

- `AdsInput`, `AdsTextarea`, `AdsSelect` e busca de Combobox/Autocomplete herdam explicitamente a fonte de tokens, sem depender de CSS reset. (#242)

- Tooltip e Popover ancoram no gatilho visual real em layouts flex/grid; clique na área vazia do wrapper não alterna o painel. (#244)

- E2E de filtros de clientes no Pages aguarda hidratação antes de conferir contagens, evitando falhas intermitentes.

- Shimmer de `AdsLoadingText` ganha contraste visível nos temas claro e escuro. (#228)

- Alturas `sm` de Select/Input e do DatePicker alinhadas, campos com `box-border` e espaçamento de ajuda/erro ajustado; token de campo `sm` passa de 28 para 30px. (#205)

- Botões como adendos de `AdsInputGroup` mantêm altura do campo e quinas corretas em todos os tamanhos; múltiplos botões ficam contíguos.

- `AdsButton` em `isLoading` preserva largura, altura e posição do rótulo, com regressão visual. (#191)

- Legenda de `AdsSmartTable` passa a respeitar padding das células e densidade.

- Demo evita rolagem horizontal na rota `/componentes` em telas de 320px.

- Tooltip mantém `aria-describedby` e trata Escape; Popover preserva clique em seu conteúdo; overlays recalculam posicionamento e seta ao rolar, redimensionar ou aplicar zoom. (#148, #91, #126)

- Lint da raiz ignora worktrees aninhadas e resolve o caminho do tsconfig corretamente. (#128)

<!-- release-changelog-approved sha256:dd32a81358830debe95c197e1fa70972074342b5e0865179045ce6bb69c68b8e -->

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
