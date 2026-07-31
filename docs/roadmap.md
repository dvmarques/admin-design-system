# Roadmap do projeto

O roadmap divide o Admin Design System em changes incrementais. Cada
change deve ser planejada, validada, implementada e arquivada antes que
suas specs sejam incorporadas ao conjunto principal.

## 1. `establish-design-system-foundation`

Estabelecer o monorepo, design tokens, temas, estratégia de estilos,
distribuição dos pacotes, Storybook, aplicação Next.js de referência e
controles de qualidade.

**Status: concluída e arquivada em 2026-07-29.**

Entregas principais:

- workspaces para tokens, componentes, composições admin, Storybook e demo
  Next.js;
- design tokens semânticos, temas claro/escuro e CSS compilado;
- componentes iniciais de fixture e controle acessível de tema;
- documentação, snapshots visuais locais e testes com Vitest, axe-core e
  Playwright;
- pipeline GitHub Actions com qualidade, build, inspeção de pacotes e fluxos
  E2E;
- validação de exports, peer dependencies, baseline de tamanho, licenças e
  limitações conhecidas.

## 2. `add-core-primitives`

Adicionar os componentes fundamentais usados pelas demais famílias, como
botões, badges, avatares, superfícies, tipografia, ícones e indicadores
de carregamento.

**Status: concluída e arquivada em 2026-07-30.**

Entregas principais:

- `AdsButton`, `AdsBadge`, `AdsAvatar`, `AdsSurface`, `AdsTypography`,
  `AdsIcon` e `AdsLoadingIndicator`, com tipos e exports públicos;
- convenção de prefixos públicos `Ads*`, `ads-*` e `--ads-*`;
- CSS compilado para consumo sem Tailwind na aplicação consumidora;
- documentação de todas as primitivas no Storybook e exemplos no admin demo;
- testes unitários, de acessibilidade, E2E e snapshots visuais nos temas claro
  e escuro.

## 3. `add-form-components`

Adicionar campos de texto, textarea, checkbox, radio, switch, select,
grupos de entrada, validação e estados de formulário.

**Status: concluída e arquivada em 2026-07-30.**

Entregas principais:

- `AdsInput`, `AdsTextarea`, `AdsSelect`, `AdsCheckbox`, `AdsRadio` e
  `AdsSwitch`, com tipos públicos e suporte a atributos HTML nativos;
- composição acessível com `AdsField`, descrições, mensagens de erro,
  grupos de entrada e grupos de seleção;
- estados de foco, desabilitado, somente leitura, erro e sucesso, com tokens
  semânticos para os temas claro e escuro;
- documentação no Storybook e exemplos integrados no admin demo;
- testes de comportamento, acessibilidade, consumo público, build, CSS e
  snapshots visuais atualizados.

## 4. `add-overlay-components`

Adicionar modal, drawer ou offcanvas, tooltip, popover, toast e outros
elementos apresentados sobre o conteúdo da página.

**Status: concluída e arquivada em 2026-07-30.**

Entregas principais:

- `AdsDialog` e `AdsDrawer`, com portal seguro, backdrop configurável,
  fechamento por Escape e retorno de foco;
- `AdsTooltip` e `AdsPopover`, com associação ARIA, posicionamento responsivo,
  clique externo e suporte a teclado;
- `AdsToast`, com variantes semânticas, regiões `status`/`alert` e descarte
  acessível;
- tokens semânticos e CSS distribuído para overlays nos temas claro e escuro;
- documentação Storybook, exemplos no admin demo, testes unitários,
  acessibilidade, consumo público, Playwright e snapshots visuais.

As specs `overlay-dialogs`, `anchored-overlays` e `toast-notifications` foram
sincronizadas ao conjunto principal e a change foi arquivada em
`openspec/changes/archive/2026-07-30-add-overlay-components`.

## 5. `add-navigation-components`

Adicionar breadcrumbs, tabs, nav, dropdowns, paginação e padrões de
navegação acessíveis por teclado.

**Status: concluída e arquivada em 2026-07-31.**

Entregas principais:

- `AdsBreadcrumb`, `AdsNav` e `AdsTabs`, com semântica, foco visível,
  navegação por teclado, temas e composição independente de roteador;
- `AdsDropdown`, com portal, alinhamento ancorado, posicionamento responsivo,
  foco gerenciado, clique externo e itens de menu desabilitados;
- `AdsPagination`, com estados atual e desabilitado, intervalo compacto e
  integração por callbacks ou links providos pela aplicação;
- CSS distribuído, documentação no Storybook, exemplos no admin demo,
  validação de consumo público, testes de acessibilidade e snapshots visuais;
- sincronização das specs `navigation-structure`, `navigation-menus` e
  `pagination` ao conjunto principal.

A change está arquivada em
`openspec/changes/archive/2026-07-31-add-navigation-components`.

## 6. `add-data-display-components`

Adicionar tabelas, listas, cards, indicadores de progresso, estados
vazios e padrões de apresentação de dados administrativos.

**Próximo passo:** iniciar o planejamento desta change com
`openspec-propose add-data-display-components`.

## 7. `add-admin-shell`

Adicionar a composição estrutural do admin, incluindo header, sidebar,
área de conteúdo, navegação responsiva e preferências de layout.

## 8. `add-nextjs-admin-demo`

Evoluir a aplicação Next.js de referência para um admin demonstrativo
que consuma exclusivamente as APIs públicas do design system.

## 9. `add-advanced-admin-patterns`

Adicionar padrões avançados depois que os componentes básicos estiverem
estáveis, como filtros complexos, tabelas inteligentes, seletores de
data, dashboards e fluxos administrativos compostos.

## Princípios do roadmap

- Uma change deve representar um incremento coerente e verificável.
- Famílias de componentes sem relação direta devem permanecer separadas.
- Acessibilidade, documentação, temas e testes fazem parte da entrega.
- Funcionalidades semelhantes ao CoreUI PRO devem ter implementação
  própria e independente.
- O roadmap pode ser ajustado conforme decisões registradas nas specs.

## Acompanhamento

```powershell
# Listar changes ativas
openspec.cmd list

# Listar specs principais já consolidadas
openspec.cmd list --specs

# Consultar o histórico arquivado da fundação
Get-ChildItem openspec/changes/archive
```
