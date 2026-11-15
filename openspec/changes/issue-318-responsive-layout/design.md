# Decisão técnica — #318

## Inventário e comparação
- `AdsAdminShell.Main` já é `main` rolável, com `min-width:0` e padding; não duplicar landmark nem substituir sua região.
- `AdsPageHeader` já oferece H1/descrição/ações, `min-width:0` e `flex-wrap`; não recriar cabeçalho.
- `AdsCard` e `AdsSurface` fornecem apresentação visual, não estrutura de grid; preservar seu propósito.
- `AdsDashboardGrid` do pacote admin usa container queries, spans de painéis e estados; manter para dashboards complexos, e não reimplementar seus atributos.
- Admin Demo define `demo-semantic-stack`, `demo-semantic-section`, `demo-semantic-filters`, `demo-semantic-actions`, `demo-metrics-grid`; Storybook repete styles inline. Há repetição verificável de layout, não de conteúdo ou domínio.
- `AdsFilterBar` e `AdsSmartTable` têm layouts internos e responsividade próprios: não alterar internals.

| Alternativa | Reuso/API | Semântica, a11y, SSR | Responsividade / estilo | Dependências, bundle, manutenção |
| --- | --- | --- | --- | --- |
| A. CSS Grid/Flex nativos documentados | API zero; classes e estilos repetidos por aplicação | total controle de HTML; não requer JS | ótimo, mas guidelines não centralizam casos repetidos | CSS local se multiplica; nenhuma dependência ADS nova |
| B. Quatro classes CSS ads-layout-* (escolhida) | contrato opt-in simples para 4 necessidades recorrentes | elemento e atributos são HTML nativo; SSR/hidratação intactos | grid auto-fit responsivo à largura real; flex-wrap em ações | pequeno acréscimo só ao CSS distribuído; React/JS inalterados; classes estáveis |
| C. Primitivas React AdsContainer/Grid/GridItem/Stack | reduz JSX em alguns casos, mas exige props de colunas/gaps/as, tipos e exports | risco de wrappers/semântica indevida e API ampla | media queries e min-width continuam em CSS | aumenta JS/declarations/catálogo/storybook, sem benefício incremental justificado |

## Contrato CSS mínimo
- `.ads-layout-container`: width 100%, max-width 76rem (pode ser substituída por `--ads-layout-max-width`), margem inline auto, padding horizontal conforme espaçamento existente (4 no mobile; 6 a partir de 48rem), override de gutter via `--ads-layout-gutter`. Aplicar somente quando necessária contenção; dentro do shell que já aplica padding, pode ser omitida.
- `.ads-layout-stack`: fluxo de coluna, gap padrão `--ads-spacing-4`, configurável por `--ads-layout-stack-gap`; `min-width:0`. Não força semântica de grupo.
- `.ads-layout-grid`: grid com `repeat(auto-fit,minmax(min(100%, var(--ads-layout-grid-min-column,16rem)),1fr))`, gap `--ads-spacing-4` configurável por `--ads-layout-grid-gap`, `min-width:0` inclusive em filhos diretos. Auto-fit responde à largura **disponível**, não à viewport; independe de container queries ou JS. Não atribui ordens artificiais; o DOM é a fonte de leitura e teclado.
- `.ads-layout-cluster`: grupo de ações/controles com `display:flex`, `flex-wrap:wrap`, gap `--ads-spacing-3` configurável por `--ads-layout-cluster-gap`, alinhamento central e `min-width:0` em filhos. Não atribuir `role` ou ARIA sem necessidade do consumidor.
- Todas as classes dentro de `@layer components`, com prefixo `ads-` e aplicação opt-in, sem selecionar tags globais nem custom properties de cor; `box-sizing:border-box` apenas no container.
- Tokens públicos `--ads-spacing-3/4/6`; fallback de largura e tamanhos com rem. As propriedades `--ads-layout-*` são pontos de customização opcionais por instância, não uma nova escala de tokens. CSS compilado distribuído como `@dvmarques/admin-ds-components/styles.css`; nenhum Tailwind necessário fora do build interno.
- Conteúdo não quebrável (tabelas, códigos e identificadores) deve obter scroll horizontal **local explícito** ou `overflow-wrap:anywhere` conforme semântica, não `overflow:hidden` em toda página. `AdsSurface` é opcional; `AdsCard` somente para unidade autocontida.
- RTL: `margin-inline`/`padding-inline`; nenhuma dependência de direction, sem inversão da ordem DOM. Temas: classes não definem cores. Interação: ordem nativa de tabulação e foco permanecem intactos.

## Responsividade, risco e distribuição
Testar 320/390/768/1440 px, temas claro/escuro, grid aninhado e conteúdo longo; também reflow simulado para 200% com viewport efetiva menor. Zoom 200% **nativo** e leitura por leitor de tela exigem revisão humana separada. Ações opcionais não deixam espaços vazios. Testar CSS publicado no dist, compilação do app e Storybook, Playwright/axe e SSR/hidratação via páginas existentes. Medir JS/CSS minificados + gzip com `npm run inspect:packages`, antes/depois sobre ambiente comparável; nunca confundir orçamento com bytes observados. Snapshot novo somente após inspeção real. Sem dependências, sem novos JS exports e sem modificação dos budgets sem medição. Workflows oficiais são evidência do último SHA, checks pulados não contam como aprovados.

## Revisão crítica e rollback
Revisar especificidade do CSS, isolamento, `min-width`, containers aninhados, semântica, foco, SSR, imports públicos e duplicações. Preservar a #319 e a #320. Se houver regressão, remover a adoção nas demonstrações e classes opt-in desta change, sem migrar contratos antigos.