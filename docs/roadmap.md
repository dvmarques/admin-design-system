# Roadmap do projeto

O roadmap divide o Admin Design System em changes incrementais. Cada
change deve ser planejada, validada, implementada e arquivada antes que
suas specs sejam incorporadas ao conjunto principal.

## 1. `establish-design-system-foundation`

Estabelecer o monorepo, design tokens, temas, estratégia de estilos,
distribuição dos pacotes, Storybook, aplicação Next.js de referência e
controles de qualidade.

## 2. `add-core-primitives`

Adicionar os componentes fundamentais usados pelas demais famílias, como
botões, badges, avatares, superfícies, tipografia, ícones e indicadores
de carregamento.

## 3. `add-form-components`

Adicionar campos de texto, textarea, checkbox, radio, switch, select,
grupos de entrada, validação e estados de formulário.

## 4. `add-overlay-components`

Adicionar modal, drawer ou offcanvas, tooltip, popover, toast e outros
elementos apresentados sobre o conteúdo da página.

## 5. `add-navigation-components`

Adicionar breadcrumbs, tabs, nav, dropdowns, paginação e padrões de
navegação acessíveis por teclado.

## 6. `add-data-display-components`

Adicionar tabelas, listas, cards, indicadores de progresso, estados
vazios e padrões de apresentação de dados administrativos.

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

# Consultar a fundação
openspec.cmd status --change establish-design-system-foundation
```
