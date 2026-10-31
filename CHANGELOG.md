# Changelog

Aqui são registradas as principais inclusões, correções e evoluções do Admin
Design System.

O formato segue as convenções do Keep a Changelog. As mudanças são organizadas
por versão e pelas changes correspondentes do OpenSpec.

### [0.1.1] - Em andamento

#### Added

- `issue-195-npm-trusted-publishing` (issue #195, revisão editorial): etapa obrigatória antes de fechar releases, com prévia não destrutiva de tópicos repetidos/longos, consolidação humana, aprovação por hash do changelog e validação na preparação/CI; a marca interna não aparece nas notas públicas. Não altera releases já fechadas nem executa publicação.\n\n- `issue-195-npm-trusted-publishing` (issue #195) - Preparação da publicação dos quatro pacotes públicos por GitHub Actions com Trusted Publishing/OIDC, hashes SHA-512 dos mesmos tarballs validados em Next.js externo, pré-verificação e recuperação idempotente de versões já existentes, separação de permissões npm/GitHub e bloqueio de tag/GitHub Release até confirmação do registry. Inclui testes de falha, documentação de bootstrap e operação; **nenhuma publicação, tag ou versão de release é executada ou selecionada nesta change**.

- `issue-198-consumer-adoption` (issue #198) - Reorganiza o README como entrada para consumidores externos e completa READMEs dos quatro pacotes com dependências/peers, CSS, exemplos e links externos; consolida início rápido Next.js App Router, restaura o logo original com variações claro/escuro, cria guia de desenvolvimento local e remove migração pré-lançamento, mantendo documentação das APIs atuais de tema, histórico por componente (#182, #185, #187), limitações por área e exclusões reais do catálogo. Mantém explícito que os tarballs da #194 ainda não foram publicados no npm e que a publicação pertence à #195. Alteração apenas documental, sem runtime, workflow ou release.

- `issue-267-security-gates` (issue #267) - Novo workflow CodeQL (SAST JS/TS), npm audit (SCA dev/prod) e Gitleaks, com execução apenas para PR Ready, push e agenda semanal; políticas de exceções específicas/expiráveis para SCA e alertas CodeQL high/critical via SARIF, Dependabot semanal agrupado, testes de gate e guia de triagem/métricas. Hardening adicional resolve regras SARIF em driver/extensions, falha fechado quando uma regra não é encontrada, corrige a condição de corrida de arquivos identificada pelo CodeQL no gerador e permite npm audit local no Windows.

- `issue-194-public-npm-packages` (issue #194) - Preparação dos quatro pacotes para distribuição pública sob `@dvmarques/admin-ds-*`, incluindo o `highlighted-code` opcional, com licença MIT e copyright Daniel Marques confirmados. Renomeação de manifests, imports, lockfile, scripts, contratos atuais e consumidores do monorepo; inclusão de READMEs/licenças e smoke de `npm pack`/Next.js externo, com peer opcional e isolamento de Shiki verificados. Raiz e apps permanecem privados; nenhuma publicação no npm, tag ou release foi efetuada.

- `docs/openspec-commands.md` e `AGENTS.md` (issue #193) - Documentam a validação OpenSpec em ambientes sem CLI global via `npx --yes @fission-ai/openspec@1.15.0`, versão fixada igual à CI.

- `issue-193-storybook-api-reference` (issue #193) - Storybook Docs 10.5.5 e docgen de TypeScript habilitados. Um gerador determinístico cria uma página MDX de API por export visual registrado na matriz da #151 (78 exports após incluir AdsAlert na matriz #151), cruza os índices públicos, reutiliza stories executáveis e extrai tipos, obrigatoriedade e defaults literais não ambíguos; 13 APIs complexas possuem observações explícitas em JSON. Exemplos só são vinculados quando a story comprova o uso do componente (inclusive `Componente.Parte` e auxiliares locais), e props herdadas de interfaces do projeto entram na tabela. Novos testes conferem a saída efetivamente gerada (`test:node` gera os MDX sozinho; `test:output` confere o índice publicado após o build, na CI e em `npm run validate`) e o subcaminho Pages, com guia de manutenção em `docs/storybook-api-reference.md`. Validado com npm ci, build, lint, typecheck, testes Node, E2E Pages e OpenSpec estrito (1.15.0); **o E2E principal do demo e a CI do SHA final ainda dependem de execução em CI**; não muda API/runtime do design system nem substitui o catálogo do demo.

- `issue-257-replace-building-icon` (issue #257) - Snapshots de contrato detectam alterações posteriores na geometria e nos atributos dos 20 desenhos de ícones revisados.

- `issue-257-replace-building-icon` (issue #257, escopo ampliado) - Os 20 SVGs de `AdsIcon` passam a corresponder a fontes oficiais licenciadas: 18 Feather (MIT), um Lucide `chevronsUpDown` (ISC) e um Hugeicons Free `building` (MIT). Fontes e copyrights individuais em `docs/icons-license-audit.md`, textos completos em `THIRD_PARTY_NOTICES.md`, copiados com `LICENSE.md` para o `dist` de `@admin-ds/components` e verificados no build. Novos testes cobrem os 20 ícones e o Storybook apresenta catálogo completo. Nomes públicos, acessibilidade e dependências preservados; a geometria visual dos 20 ícones muda intencionalmente. O conjunto foi modularizado em `packages/components/src/icons/` (desenhos, tipos, componente e exports), mantendo `src/icon.tsx` como reexport compatível; futura extração para pacote independente fica fora do escopo (detalhes em `docs/icon-architecture.md`).
- `add-231-ads-masked-input` (issue #231) - Novo `AdsMaskedInput` no subpath opcional `@admin-ds/components/masked-input`, sem reexport no entrypoint raiz: campo com máscara estática, dinâmica (lista de padrões ou `dispatch`), numérica e de data, ou sem máscara (input de texto comum), compatível com `AdsField`, controlado (`value`) ou não (`defaultValue`), `disabled`, `readOnly`, `ref` e `inputRef` (ambos o `HTMLInputElement`) e SSR/hidratação em StrictMode. `value`/`defaultValue` são sempre o texto formatado; `onValueChange` (adaptado do `onAccept` do motor, sem sintetizar `onChange`) informa `maskedValue`, `unmaskedValue` (sempre string, com zeros à esquerda), `typedValue` e `complete`, uma vez por alteração aceita e nunca na montagem nem em atualizações externas de `value`. Novos tipos `AdsMask`, `AdsMaskOptions`, `AdsMaskPattern`, `AdsDynamicMaskState`, `AdsMaskedInputProps` e `AdsMaskedInputValues`. `react-imask` (`^7.6.1`, MIT) é peer opcional (`peerDependenciesMeta`), devDependency dos workspaces que o consomem e **não** entra no entrypoint raiz: `verify-package` percorre o grafo de imports do `dist` raiz e `npm run verify:optional-peer` (também em `npm run validate` e na CI) empacota o pacote e prova, num consumidor temporário, que instalar, tipar, empacotar e executar o entrypoint raiz funciona sem `react-imask` e que o subpath resolve, tipa, empacota e renderiza com ele. Exemplo no catálogo do Admin Demo (`/catalogo/masked-input`, inclusive CPF, CNPJ e documento único, que só formatam e não validam dígito verificador), stories, testes unitários (jsdom, axe), E2E (teclado, caret, colagem, IME via CDP, temas, 390 px, forced-colors) e guia de migração de campos mascarados existentes em `docs/integration.md`. Orçamentos elevados pelo custo medido do novo arquivo publicado (`masked-input.js`, `.d.ts` e mapas): distribuição de `@admin-ds/components` baseline 516.600 → 535.800 (medido 589.318 de 589.380 de limite), JS/CSS 251.150 → 258.500 (medido 258.461; gzip 76.300 → 78.400, medido 78.337), sobre a base combinada com a `develop` (#252, #254 e #253); novo cenário `masked-input-public` (67.490 B, gzip 18.971 B com o motor embutido) enquanto `components-public` não muda por esta change (30.490 B, gzip 11.321 B na base atual) sem `imask`, e o CSS não cresce. Sem dependência de runtime nova nos pacotes publicados; `docs/licensing.md` registra `react-imask` e `imask`.

- `extend-239-combobox-popover` (issue #239) - `AdsCombobox` ganha a apresentação aditiva `presentation="popover"`: um botão (gatilho padrão ou `renderTrigger`) abre um painel `dialog` não modal, portalled, com pesquisa separada (`searchable`, `filterOption`), `listbox` de seleção única e `footer` fora da lista, além de `triggerRef`, `searchInputRef`, `closeOnSelect`, `panelLabel`, `searchLabel`, `listLabel`, `retryLabel`, `statusMessage`, `panelClassName`, `placement` e `align`. Valor confirmado e consulta são independentes (`onInputValueChange(query, 'input' | 'select' | 'close')`), com `name`/`form`/`required` validáveis sem tab stop extra (foco no gatilho inválido), reset de formulário, estados vazio/carregando/erro com retry e Escape/clique externo por camada, inclusive dentro de `AdsDialog`. O modo input (`presentation="input"`, padrão), o `ref` do `input` e `AdsAutocomplete` não mudam; novos tipos `AdsComboboxPopoverProps`, `AdsComboboxTriggerContext`, `AdsComboboxQueryReason` e `AdsComboboxComponent` (`AdsCombobox` passa a ter assinatura sobrecarregada). `AdsOrganizationSwitcher` passa a compor esse modo, sem mudar API, `avatarTone`, `searchable="auto"`, sidebar recolhida, `manage` nem a troca assíncrona sem confirmação otimista. **Possível quebra apenas para testes de consumidores do seletor** (código de produção não muda; receita em `docs/integration.md`): opções viram `role="option"` com `aria-selected` (antes botões com `aria-current`), o erro de carregamento e o pendente são anunciados por `role="status"` e a falha da troca segue `role="alert"`. Exemplos no catálogo do demo e Storybook, documentação em `docs/integration.md`, testes unitários, de acessibilidade e E2E. Sem dependência nova. Orçamentos remedidos sobre a base combinada com a #140 (Node 22.22): `@admin-ds/components` dist 566.459 (baseline 466.700 → 516.000), JS/CSS 249.982 (limite 228.000 → 250.800), gzip 75.698 (69.150 → 76.300); CSS dos cenários `components-public` 57.742 (55.200 → 58.000) e `admin-public` 97.524 (94.800 → 97.800), folgas de 0,1% a 0,9%.

- `enhance-140-ads-select` (issue #140) - `AdsSelect` ganha o `placeholder` opcional (opt-in) para ausência de escolha: `value`/`defaultValue` `null` é ausência e `""` continua sendo a opção real de valor vazio, com `required`, `FormData`, reset e hidratação nativos e sem sentinela (a ausência é a _placeholder label option_ do HTML, não enviada no formulário), stories `Forms/Select`, exemplos no catálogo e guia em `docs/integration.md`. Novos tipo `AdsSelectValue` e módulo cliente `select-placeholder`: `AdsSelect` continua sem hooks e renderizável em Server Components, e o módulo cliente só executa e hidrata quando `placeholder` é usado, mas é importado estaticamente e entra no grafo de módulos do consumidor. Orçamentos elevados pelo custo medido: baseline do dist de `@admin-ds/components` 457.600 → 466.700 bytes (medido 513.348), JS/CSS publicado 226.000 → 228.000 (medido 227.930; gzip 68.500 → 69.150, medido 69.109) e CSS gzip do cenário `components-public` 9.150 → 9.200 (medido 9.167), sem dependência nova.

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

- `issue-268-github-actions-hardening` (issue #268) - GitHub Actions com commits SHA completos e versões rastreáveis, Playwright 1.64.1 Noble fixado por digest OCI nos workflows, checkout sem credenciais persistentes e geração de snapshots isolada do job de push (somente PNGs validados na branch de origem). Adicionados testes estáticos e documentação de permissões/atualizações; nenhum contrato público ou check obrigatório alterado. O workflow manual de commit foi validado em branch de teste (geração, transferência e commit de um PNG) e a revisão corrigiu a perda do `safe.directory` no contêiner de geração.

- `issue-265-deps-batch3` (issue #265) - Atualiza o toolchain de desenvolvimento para TypeScript 6, Vitest/coverage-v8 5, jsdom 30 e lint-staged 17. `typescript` fica em `~6.0.3`, pois `typescript-eslint@8.72.1` suporta apenas `<6.1.0`. Mantém o comportamento anterior de limpeza de mocks com `clearMocks: false`, Node 24 na CI e contratos públicos dos pacotes inalterados. O TypeScript 6 passou a exigir declaração para o import de CSS por efeito colateral em `apps/docs` (`highlighted-code-css.d.ts`). O `jsdom` 30 eleva o mínimo de desenvolvimento para Node 24.15, sem alterar `engines.node >=24.0.0` dos pacotes. CI, Pages e Security Gate aprovados; entrega parcial, não encerra a issue #265.

- `issue-265-deps-batch2` (issue #265, lote 2) - Storybook, addon-docs e react-vite alinhados à linha 10.6.5; Playwright, browsers e imagens de CI/Pages/baselines sincronizados em 1.64.1; axe-core 4.14.0 com correção dos nomes acessíveis dos gatilhos de conta e organização para incluir as iniciais visíveis, e testes E2E específicos. **Mudança de comportamento:** o nome acessível passa de `Menu da conta: Ana Souza` para `Menu da conta: AS Ana Souza` e de `Organização atual: Acme Brasil, Plano Enterprise` para `Organização atual: AB Acme Brasil, Plano Enterprise`; consultas por nome acessível em testes de consumidores precisam ser ajustadas. Mantidos Node 24 na CI, o contrato público dos pacotes, peerDependencies e CSS. Auditoria e evidências de CI estão documentadas na PR #270 e na issue #265 (advisories residuais em `docs/security/continuous-gates.md`); hardening por SHA/digest continua na #268, gates recorrentes na #267.

- `issue-265-dependency-security-audit` (issue #265, complemento de 30/10/2026) - Auditoria pontual de dependências nos lockfiles original e do lote 1, usando Node 24.22.1/npm 11.19.1 com `npm audit --json` completo e `--omit=dev`; quatro execuções históricas sem advisories em 30/10; reauditoria em 31/10 após o merge da `develop` identificou os mesmos **14 achados moderados** em original/`develop`/branch, todos em ferramentas de desenvolvimento (0 em produção e 0 high/critical), sem regressão atribuível à #265. O registro de risco residual, os dois advisories e as evidências atualizadas estão na issue #265 e em `docs/security/continuous-gates.md` (logs e JSON originais no artefato Actions 41145513851, de retenção limitada). Verificação contínua e hardening dos workflows permanecem nas issues #267 e #268; sem alterações de contratos públicos, gate de CI ou regras de branches.

- `issue-265-update-dependencies` (issue #265, lote 1) - Atualizadas dependências externas compatíveis com Node 24 no monorepo (React/React DOM 19.3.1, Next 16.4.3, tipos React, Testing Library, esbuild, ESLint, Prettier e typescript-eslint), com manifests sincronizados e lockfile regenerado por npm 11.19.1. Mantidos `engines.node >=24.0.0` sem teto, `@types/node` da linha 24, APIs públicas, tokens e contratos CSS. `axe-core` permanece temporariamente fixado em `4.12.1`: a atualização para `4.14.0` revelou violações `label-content-name-mismatch` em gatilhos do menu de conta e do seletor de organização no E2E Firefox/WebKit; corrigir os nomes acessíveis em lote próprio da #265 antes de atualizar axe. CI, E2E nos três navegadores e build do Pages aprovados no commit de código `43387fceb6009480068877ed50737f8d64b22009`; a confirmação no SHA final da PR permanece pendente na tarefa 6.2 da change. Entrega parcial: não encerra a issue #265.

- `issue-133-smart-table-columns-escape` (issue #133) - O Escape do painel de colunas do `AdsSmartTable` continua tratado localmente (sem API pública nova de camada de Escape, decisão registrada na change) e passa a ser marcado como tratado (`preventDefault`, além de `stopPropagation`), o marcador que a pilha de camadas respeita; assim o painel não fecha junto com um `AdsDialog`/`AdsDrawer` ao redor mesmo que a propagação chegue ao `document`. Novos testes de regressão cobrem o contrato e o Escape com o painel fechado. Sem mudança de API pública, CSS, Storybook ou demo.

- `docs-sanitize-private-consumer-references` (PR #251) - Removidas referências identificáveis a aplicações consumidoras privadas da documentação, do histórico OpenSpec arquivado e dos exemplos e testes do AdminShell (título neutro `Admin Demo`); mantidos os requisitos técnicos genéricos, sem alterar APIs públicas, comportamento ou estilos. Sem change OpenSpec própria: mudança exclusivamente documental.

- `enhance-140-ads-select` (issue #140) - Texto longo de **todo** `AdsSelect` simples (com ou sem `placeholder`; não `multiple`) fica contido e truncado com reticências antes da seta (sem estourar o contêiner em 390 px nem com zoom de 200%), preservando RTL, `forced-colors` e os demais controles que usam `formControlClasses()`. Se `placeholder` já era passado a `AdsSelect`, o atributo ignorado pelo navegador passa a criar a opção de ausência.

- `issue-240-catalog-families` (#240) - Sidebar do catálogo apresenta famílias compostas em uma entrada por família; a busca mantém nomes individuais e aliases, levando a seções com API e exemplo. URLs legadas por export continuam acessíveis no site estático.

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

- `issue-259-overlay-focus-limits` (issue #259) - O ciclo de Tab de `AdsDialog`, `AdsDrawer` e `AdsConfirmDialog` passa a seguir a ordem real de tabulação (`tabindex` positivo em ordem crescente, depois os demais) e a tratar cada grupo de rádio (mesmo `name` e formulário) como uma parada só, sem sair brevemente do modal nas pontas; um modal montado já aberto em StrictMode recebe o foco inicial. `iframe` na ponta segue como limitação documentada. Sem mudança de API pública. Orçamentos elevados ao medido: `@admin-ds/components` baseline do dist 554.600 → 556.600 (limite = baseline × 1,1: 610.060 → 612.260; medido 612.239), JS/CSS 263.300 → 264.360 (medido 264.351), gzip por arquivo 79.500 → 79.790 (medido 79.786); `components-public` 33.100 → 33.420 / gzip 11.800 → 11.880 (medido 33.417 / 11.877); `admin-public` 71.100 → 71.440 / gzip 23.900 → 24.050 (medido 71.439 / 24.050, após o merge da #262). Medição local (Node/npm do ambiente); CI é a referência.

- `fix-234-overlay-tab-eligibility` (#234) - A armadilha de Tab de `AdsDialog`, `AdsDrawer` e `AdsConfirmDialog` passa a usar o mesmo critério de elegibilidade do foco inicial: controles desabilitados (inclusive por `fieldset disabled`), `inert`, ocultos, em `<details>` fechado ou com `tabindex` negativo deixam de ser pontos de virada, a lista é reavaliada a cada Tab e o `summary` do `details` é parada de Tab. Efeito colateral intencional: controles nativos com `tabindex` negativo deixam de receber o foco inicial. Sem mudança de API. Limitações: grupos de rádio, `iframe` e `tabindex` positivo (`docs/limitations.md`). Baseline de distribuição de `@admin-ds/components` elevado ao mínimo medido sobre a base combinada com a #252, com os limites JS/CSS publicado e do cenário `components-public` (autorizado pelo mantenedor; valores no `design.md`); medições em `design.md`.

- `issue-243-input-group-nowrap` (#243) - Adendos e botões do AdsInputGroup preservam rótulos sem quebra, com espaço flexível para o campo e rolagem local em larguras insuficientes; exemplo próprio com ações Limpar e Restaurar.

- `issue-242-textarea-typography` (#242) - Os controles textuais nativos Input, Textarea e Select (e os campos de AdsCombobox/AdsAutocomplete, que compartilham a mesma classe) passam a usar explicitamente a fonte do token público do design system sem depender de preflight CSS do consumidor, preservando a personalização do token.

- `issue-244-tooltip-anchor-position` (#244) - Tooltip e Popover passam a medir o gatilho visual real em layouts flex/grid que esticam o wrapper da âncora, mantendo o posicionamento, a seta e a lógica de colisões existentes. `AdsPopover` só alterna por clique no gatilho real; clique na área vazia do wrapper esticado não alterna e conta como clique externo. Todos os elementos renderizados pelo gatilho contam como gatilho para o clique e o clique externo, o painel é posicionado pelo primeiro deles e a troca do elemento do gatilho com o painel aberto remede a âncora.

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
