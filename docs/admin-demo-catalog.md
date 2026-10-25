# Catálogo da aplicação admin demo (issue #151)

O índice `/catalogo` oferece busca por nome, categoria e descrição. Cada export público de UI tem uma rota `/catalogo/<slug>` gerada estaticamente, inclusive no GitHub Pages. Subcomponentes exibem a composição completa para que possam ser usados com o contexto e a semântica corretos. Slugs desconhecidos retornam 404.

A sidebar oferece grupos expansíveis por teclado, indicação de página ativa e fechamento automático após navegação móvel. As rotas `/`, `/clientes`, `/clientes/novo`, `/preferencias`, `/componentes`, `/componentes/datas`, `/componentes/overlays`, `/componentes/paginacao`, `/componentes/tabela-avancada`, `/data-display` e `/catalogo/lacunas` continuam disponíveis.

## Convenção para novas demonstrações

A sidebar distingue títulos de seção fixos (Componentes, Composições administrativas e Exemplos de aplicação), categorias expansíveis com ícones ou iniciais distintos e links internos recuados. Visão geral e Catálogo são links diretos. Os nomes do menu omitem `Ads`, preservado nas páginas e snippets. A composição pública é fornecida por `AdsAdminShell.Navigation`, `NavigationSection`, `NavigationGroup` e `NavigationItem`; a aplicação controla rotas e expansão. No desktop recolhido, ativar uma categoria expande a sidebar e abre o grupo. O drawer móvel mantém os rótulos completos.

1. Registre o export em `apps/admin-demo/app/catalogo/catalog-data.ts`, com nome, categoria, slug estável, descrição e chave da composição.
2. Implemente a composição em `catalog-demos.tsx` e registre-a em `catalogDemos`. Use apenas imports públicos. Demonstre estados e variantes aplicáveis, controles funcionais, nomes acessíveis e casos limites. Subcomponentes podem compartilhar uma composição, preservando uma rota por export.
3. Execute `node scripts/catalog-snippets.mjs` a partir da raiz após editar os exemplos e formate os arquivos. O código exibido é extraído por AST das mesmas funções TSX executadas, com os imports necessários. Não edite `catalog-snippets.json` à mão.
4. Atualize esta matriz e o Storybook. Todo novo componente público deve incluir sua demonstração na própria issue de implementação, inclusive os futuros componentes do épico #141.
5. Acrescente verificações de interação pertinentes. Execute os testes de cobertura e o Playwright do catálogo antes da validação completa.

O layout de página mostra nome, descrição, exemplos, orientações de composição, seletor de tema e largura, código e cópia com feedback/fallback. O tema sincroniza o documento e os portais; o seletor de largura limita o conteúdo à largura disponível (320px, 768px ou disponível). Overlays seguem a viewport real, por isso os testes também alteram a viewport do navegador. Exemplos não fazem chamadas remotas nem persistem dados de negócio.

## Verificação e exclusões

O teste `apps/admin-demo/catalog-coverage.test.ts` compara os exports runtime dos dois índices públicos por AST com o registro, exige URLs únicas e renderização JSX explícita de cada export no snippet da composição e confere a sincronização com o TSX executável. Ele não substitui a execução no navegador. `e2e/catalog.spec.ts` visita todos os exports em 390px/1280px e claro/escuro, verifica erros, conteúdo e overflow, audita as composições com axe e testa busca, cópia, teclado, navegação móvel, campos, seleção, recuperação de erro e etapas.

Excluídos: exports `type` (não possuem runtime), `fixtureVariants` (mapa de estilos), `getAdsPaginationItems` (função de cálculo) e `useAdsAdminShell` (hook sem representação visual própria, exercitado pelos controles do shell). `AdsThemeControl`, `ThemeToggle` e `StyleFixture` têm exemplos próprios. `AdsAccountMenu`, `AdsNotificationCenter` e `AdsOrganizationSwitcher` (#185) têm showcases próprios na categoria "Conta e contexto": foto, iniciais e falha de imagem; leitura, filtros e estados de carregamento, vazio e erro; troca de organização com busca, estados e sidebar recolhida; e a sidebar com e sem o seletor (`/catalogo-organizacao/?variante=com|sem`, carregada em `iframe` pelo showcase). No cabeçalho e na sidebar do demo os três componentes usam dados fictícios e ações com feedback local (Sair não encerra sessão real). A lista de exclusões é explícita: um novo export runtime não pode ser ignorado silenciosamente.

Comandos concisos: `npx vitest run apps/admin-demo/catalog-coverage.test.ts --silent=passed-only`, `npm run test:e2e -- e2e/catalog.spec.ts --workers=4` e `npm run validate`. Diagnóstico: `npm run test:verbose` e `npm run test:e2e:verbose`. O build valida o consumo de CSS compilado pelo Next.js e o Storybook; não há dependência de Tailwind no consumidor.

## Matriz export → demonstração

Todos os links abaixo abrem exemplos executáveis. As famílias compartilham composições quando a semântica exige contexto (campos, abas, accordion, tabela, card, lista e dashboard). O status final das validações fica na PR e em `validation.md` da change OpenSpec.

| Export público            | Grupo       | Rota                              | Storybook (família)                                           |
| ------------------------- | ----------- | --------------------------------- | ------------------------------------------------------------- |
| `AdsButton`               | Básicos     | `/catalogo/button`                | `admin-flows.stories.tsx`, `admin-shell.stories.tsx`          |
| `AdsBadge`                | Básicos     | `/catalogo/badge`                 | `admin-flows.stories.tsx`, `admin-shell.stories.tsx`          |
| `AdsAvatar`               | Básicos     | `/catalogo/avatar`                | `avatar.stories.tsx`                                          |
| `AdsIcon`                 | Básicos     | `/catalogo/icon`                  | `icon.stories.tsx`                                            |
| `AdsTypography`           | Básicos     | `/catalogo/typography`            | `admin-shell.stories.tsx`, `typography.stories.tsx`           |
| `AdsSurface`              | Básicos     | `/catalogo/surface`               | `navigation.stories.tsx`, `surface.stories.tsx`               |
| `AdsLoadingIndicator`     | Básicos     | `/catalogo/loading-indicator`     | `loading-indicator.stories.tsx`                               |
| `AdsSkeleton`             | Básicos     | `/catalogo/skeleton`              | `data-display.stories.tsx`                                    |
| `AdsSparkline`            | Básicos     | `/catalogo/sparkline`             | `dashboard.stories.tsx`, `sparkline.stories.tsx`              |
| `AdsInput`                | Formulários | `/catalogo/input`                 | `admin-flows.stories.tsx`, `form.stories.tsx`                 |
| `AdsPasswordInput`        | Formulários | `/catalogo/password-input`        | `form.stories.tsx`                                            |
| `AdsTextarea`             | Formulários | `/catalogo/textarea`              | `form.stories.tsx`                                            |
| `AdsSelect`               | Formulários | `/catalogo/select`                | `admin-flows.stories.tsx`, `form.stories.tsx`                 |
| `AdsCheckbox`             | Formulários | `/catalogo/checkbox`              | `form.stories.tsx`                                            |
| `AdsRadio`                | Formulários | `/catalogo/radio`                 | `form.stories.tsx`                                            |
| `AdsSwitch`               | Formulários | `/catalogo/switch`                | `form.stories.tsx`                                            |
| `AdsField`                | Formulários | `/catalogo/field`                 | `admin-flows.stories.tsx`, `date-picker.stories.tsx`          |
| `AdsFieldLabel`           | Formulários | `/catalogo/field-label`           | `catalog-composition.stories.tsx`                             |
| `AdsFieldDescription`     | Formulários | `/catalogo/field-description`     | `catalog-composition.stories.tsx`                             |
| `AdsFieldMessage`         | Formulários | `/catalogo/field-message`         | `catalog-composition.stories.tsx`                             |
| `AdsInputGroup`           | Formulários | `/catalogo/input-group`           | `form.stories.tsx`, `catalog-composition.stories.tsx`         |
| `AdsSelectionGroup`       | Formulários | `/catalogo/selection-group`       | `form.stories.tsx`                                            |
| `AdsDatePicker`           | Formulários | `/catalogo/date-picker`           | `date-picker.stories.tsx`                                     |
| `AdsBreadcrumb`           | Navegação   | `/catalogo/breadcrumb`            | `navigation.stories.tsx`                                      |
| `AdsNav`                  | Navegação   | `/catalogo/nav`                   | `navigation.stories.tsx`                                      |
| `AdsTabs`                 | Navegação   | `/catalogo/tabs`                  | `navigation.stories.tsx`                                      |
| `AdsTabsList`             | Navegação   | `/catalogo/tabs-list`             | `navigation.stories.tsx`                                      |
| `AdsTabsPanel`            | Navegação   | `/catalogo/tabs-panel`            | `navigation.stories.tsx`                                      |
| `AdsTabsTrigger`          | Navegação   | `/catalogo/tabs-trigger`          | `navigation.stories.tsx`                                      |
| `AdsAccordion`            | Navegação   | `/catalogo/accordion`             | `navigation.stories.tsx`                                      |
| `AdsAccordionHeader`      | Navegação   | `/catalogo/accordion-header`      | `navigation.stories.tsx`                                      |
| `AdsAccordionItem`        | Navegação   | `/catalogo/accordion-item`        | `navigation.stories.tsx`                                      |
| `AdsAccordionPanel`       | Navegação   | `/catalogo/accordion-panel`       | `navigation.stories.tsx`                                      |
| `AdsAccordionTrigger`     | Navegação   | `/catalogo/accordion-trigger`     | `navigation.stories.tsx`                                      |
| `AdsDropdown`             | Navegação   | `/catalogo/dropdown`              | `navigation.stories.tsx`, `overlay.stories.tsx`               |
| `AdsPagination`           | Navegação   | `/catalogo/pagination`            | `navigation.stories.tsx`, `smart-table.stories.tsx`           |
| `AdsDialog`               | Feedback    | `/catalogo/dialog`                | `overlay.stories.tsx`                                         |
| `AdsDrawer`               | Feedback    | `/catalogo/drawer`                | `overlay.stories.tsx`                                         |
| `AdsPopover`              | Feedback    | `/catalogo/popover`               | `overlay.stories.tsx`                                         |
| `AdsTooltip`              | Feedback    | `/catalogo/tooltip`               | `overlay.stories.tsx`                                         |
| `AdsToast`                | Feedback    | `/catalogo/toast`                 | `overlay.stories.tsx`                                         |
| `AdsEmptyState`           | Feedback    | `/catalogo/empty-state`           | `dashboard.stories.tsx`, `data-display.stories.tsx`           |
| `AdsProgress`             | Feedback    | `/catalogo/progress`              | `data-display.stories.tsx`                                    |
| `AdsTable`                | Dados       | `/catalogo/table`                 | `data-display.stories.tsx`, `smart-table.stories.tsx`         |
| `AdsTableBody`            | Dados       | `/catalogo/table-body`            | `data-display.stories.tsx`, `catalog-composition.stories.tsx` |
| `AdsTableCaption`         | Dados       | `/catalogo/table-caption`         | `catalog-composition.stories.tsx`                             |
| `AdsTableCell`            | Dados       | `/catalogo/table-cell`            | `data-display.stories.tsx`, `catalog-composition.stories.tsx` |
| `AdsTableHead`            | Dados       | `/catalogo/table-head`            | `data-display.stories.tsx`, `catalog-composition.stories.tsx` |
| `AdsTableHeader`          | Dados       | `/catalogo/table-header`          | `data-display.stories.tsx`, `catalog-composition.stories.tsx` |
| `AdsTableRow`             | Dados       | `/catalogo/table-row`             | `data-display.stories.tsx`, `catalog-composition.stories.tsx` |
| `AdsCard`                 | Dados       | `/catalogo/card`                  | `admin-shell.stories.tsx`, `data-display.stories.tsx`         |
| `AdsCardActions`          | Dados       | `/catalogo/card-actions`          | `data-display.stories.tsx`                                    |
| `AdsCardContent`          | Dados       | `/catalogo/card-content`          | `data-display.stories.tsx`                                    |
| `AdsCardHeader`           | Dados       | `/catalogo/card-header`           | `data-display.stories.tsx`                                    |
| `AdsList`                 | Dados       | `/catalogo/list`                  | `admin-flows.stories.tsx`, `data-display.stories.tsx`         |
| `AdsListItem`             | Dados       | `/catalogo/list-item`             | `data-display.stories.tsx`                                    |
| `AdsAdminShell`           | Admin       | `/catalogo/admin-shell`           | `admin-shell.stories.tsx`                                     |
| `AdsDashboardGrid`        | Admin       | `/catalogo/dashboard-grid`        | `dashboard.stories.tsx`                                       |
| `AdsDashboardPanel`       | Admin       | `/catalogo/dashboard-panel`       | `dashboard.stories.tsx`                                       |
| `AdsMetricCard`           | Admin       | `/catalogo/metric-card`           | `dashboard.stories.tsx`                                       |
| `AdsFilterBar`            | Admin       | `/catalogo/filter-bar`            | `filter-bar.stories.tsx`, `smart-table.stories.tsx`           |
| `AdsSmartTable`           | Admin       | `/catalogo/smart-table`           | `admin-flows.stories.tsx`, `smart-table.stories.tsx`          |
| `AdsBulkActionBar`        | Admin       | `/catalogo/bulk-action-bar`       | `admin-flows.stories.tsx`, `catalog-composition.stories.tsx`  |
| `AdsConfirmDialog`        | Admin       | `/catalogo/confirm-dialog`        | `admin-flows.stories.tsx`                                     |
| `AdsListFlow`             | Admin       | `/catalogo/list-flow`             | `admin-flows.stories.tsx`                                     |
| `AdsStepForm`             | Admin       | `/catalogo/step-form`             | `admin-flows.stories.tsx`                                     |
| `AdsAccountMenu`          | Admin       | `/catalogo/account-menu`          | `account-menu.stories.tsx`                                    |
| `AdsNotificationCenter`   | Admin       | `/catalogo/notification-center`   | `notification-center.stories.tsx`                             |
| `AdsOrganizationSwitcher` | Admin       | `/catalogo/organization-switcher` | `organization-switcher.stories.tsx`                           |
| `AdsThemeControl`         | Básicos     | `/catalogo/theme-control`         | `theme-control.stories.tsx`                                   |
| `ThemeToggle`             | Básicos     | `/catalogo/theme-toggle`          | `admin-shell.stories.tsx`, `foundation.stories.tsx`           |
| `StyleFixture`            | Básicos     | `/catalogo/style-fixture`         | `foundation.stories.tsx`                                      |

O showcase de AdsAdminShell demonstra também `layout="sidebar-header"`, marca oficial e toggle no topo, sem organização obrigatória (#187). A navegação principal preserva ícones e abreviações.
