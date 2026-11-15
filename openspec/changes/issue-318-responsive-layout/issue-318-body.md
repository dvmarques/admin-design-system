Relacionado ao épico #315.

## Objetivo

Definir uma maneira consistente e portátil de compor layouts administrativos responsivos, com mínima abstração e sem acoplar o consumidor a um framework CSS específico.

## Decisão a validar antes de implementar

Comparar **CSS Grid/Flexbox nativos** versus primitivas públicas como `AdsContainer`, `AdsGrid`, `AdsGridItem` e/ou `AdsStack`. Não criar todos os componentes por antecipação: só publicar aqueles que reduzirem repetição relevante e oferecerem contrato estável.

**Decisão registrada (B + Grid/Flex nativos):** quatro classes CSS opt-in (`ads-layout-container`, `ads-layout-stack`, `ads-layout-grid`, `ads-layout-cluster`) no CSS distribuído; sem novos componentes React ou Tailwind obrigatório no consumidor. Detalhes na change OpenSpec `issue-318-responsive-layout` e na PR [#327](https://github.com/dvmarques/admin-design-system/pull/327).

## Proposta de trabalho

1. Inventariar padrões de layout recorrentes nas composições existentes do ADS (dashboard, filtros, formulários, navegação, Admin Demo).
2. Elaborar opções com exemplos equivalentes e trade-offs: CSS puro documentado, classes utilitárias CSS próprias ou pequenos componentes React.
3. Definir regras de largura máxima, padding horizontal, gaps, empilhamento e número de colunas responsivas; priorizar semântica neutra e composição com elementos nativos.
4. Caso haja primitivas novas, propor API tipada mínima (sem clone de um grid de terceiros), sem inline styles desnecessários, com breakpoints/tokens existentes, sem JS para media queries simples.
5. Validar disposição em nested grids, conteúdo extenso, RTL quando aplicável, reflow a 320px/390px/768px/desktop e zoom 200%.
6. Garantir ausência de dependência de Tailwind no projeto consumidor e prevenir CSS global conflitante.
7. Documentar padrões recomendados com `AdsPageHeader` (se aprovado) ou cabeçalho composto, `AdsSurface` e `AdsSmartTable`.

## Critérios de aceite

- [x] Comparação documentada das alternativas, com decisão de implementar ou usar CSS nativo.
- [x] Padrões de container, colunas, espaçamento e empilhamento definidos e reproduzíveis.
- [x] Se criar componentes públicos, exports/tipos, exemplos e contrato de acessibilidade/SSR verificados; nenhum componente especulativo. **Não aplicável:** decisão B não criou componentes React.
- [x] Composições responsivas demonstradas no Admin Demo e Storybook, nos dois temas.
- [ ] Sem overflow horizontal inesperado em viewports estreitas e zoom; sem estilos que escapem do escopo do ADS. **Parte automatizada concluída** (E2E 320/390/768/1440, RTL, axe, teclado, reflow estreito e capturas focalizadas 24/24 no SHA `ca6b042`); **pendente de zoom nativo 200%, leitor de tela e aceite visual humano** (Daniel).
- [x] Testes de layout/regressão apropriados, OpenSpec, docs/changelog e checks oficiais concluídos no SHA de código/CI `452283bc9d94a0a6ac78c71c69d174a141600b06` ([CI #43752585078](https://github.com/dvmarques/admin-design-system/actions/runs/43752585078), [Security #43752584975](https://github.com/dvmarques/admin-design-system/actions/runs/43752584975), [Pages #43752584972](https://github.com/dvmarques/admin-design-system/actions/runs/43752584972)).

## Dependência

Alinhar com a issue de composição semântica de páginas do épico #315; as avaliações podem avançar em paralelo.

## Fora do escopo

Sistema completo de utilities CSS, CSS-in-JS obrigatório, roteamento, replicar frameworks CSS existentes ou reinventar breakpoints sem motivo.

## Status (15/11/2026, PR Ready sem merge)

Branch [`feat/318-responsive-layout-patterns`](https://github.com/dvmarques/admin-design-system/tree/feat/318-responsive-layout-patterns), change OpenSpec ativa **sem archive**. Entregas: CSS distribuído, três exemplos (consulta, formulário, dashboard), Storybook, testes, guia `docs/responsive-layout.md`, inventário visual focal em `docs/visual-audit-inventory.md`. **Não integrar, arquivar OpenSpec nem fechar esta issue** até revisão humana (task 9) e autorização explícita.
