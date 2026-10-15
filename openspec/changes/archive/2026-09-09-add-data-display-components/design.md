## Context

O Admin Design System já fornece fundação visual, primitivas, formulários, overlays e navegação. O próximo incremento do roadmap precisa cobrir apresentação de dados sem transformar componentes básicos em widgets de negócio ou em uma tabela inteligente completa.

A implementação deve preservar os contratos existentes: APIs públicas `Ads*`, CSS distribuído consumível sem Tailwind na aplicação cliente, tokens semânticos, temas claro/escuro, acessibilidade, documentação no Storybook, exemplos no admin demo e validação automatizada.

## Goals / Non-Goals

### Goals

- Fornecer componentes pequenos e composicionáveis para tabelas, listas, cards, progresso e estados vazios.
- Manter semântica HTML e acessibilidade como comportamento padrão, sem exigir configuração adicional para o caso comum.
- Permitir que aplicações controlem dados, ações, navegação e conteúdo sem acoplamento do design system a backend, roteador ou biblioteca de fetching.
- Reutilizar tokens e primitivas existentes antes de criar novos contratos visuais.
- Manter APIs adequadas para evolução posterior dos padrões avançados sem antecipar ordenação, filtros ou dashboards.

### Non-Goals

- Implementar data grid completo, virtualização, sorting, filtering, busca, edição inline ou seleção massiva.
- Buscar, paginar ou transformar dados dentro dos componentes.
- Acoplar os componentes a Next.js, React Query, TanStack Table ou outra biblioteca de dados.
- Introduzir dependência de runtime apenas para esta família.

## Decisions

### 1. Tabela sem engine de dados

`AdsTable` será responsável por estrutura, estilos e estados visuais/semânticos. Dados, ordenação, paginação e transformação permanecem sob responsabilidade do consumidor. A API deve favorecer composição React e elementos tabulares válidos, preservando `<table>`, `<thead>`, `<tbody>`, `<th>` e `<td>` quando a apresentação for realmente tabular.

Isso evita criar uma abstração prematura sobre uma biblioteca de data grid e mantém a base reutilizável para a futura change de padrões avançados.

### 2. Listas e cards serão primitivas de apresentação, não modelos de domínio

`AdsList` organiza coleções com semântica de lista e separação visual. `AdsCard` agrupa conteúdo relacionado e pode expor regiões comuns de cabeçalho, conteúdo e ações, sem impor campos como título, preço, status ou avatar.

### 3. Feedback de dados será explícito e acessível

`AdsProgress` deve suportar progresso determinado e indeterminado. No modo determinado, o valor deve ser exposto a tecnologias assistivas. No modo indeterminado, o componente comunica atividade sem inventar percentual.

`AdsEmptyState` deve permitir título, descrição, ilustração/ícone opcional e ações fornecidas pelo consumidor. O componente não deve presumir que ausência de dados é erro.

### 4. Estados de tabela permanecem composicionais

Estados como vazio ou carregamento podem ser demonstrados em conjunto com `AdsEmptyState` e `AdsProgress`, mas não serão embutidos como lógica de fetching em `AdsTable`. O consumidor decide quando renderizar tabela, progresso ou estado vazio.

### 5. Tokens novos somente quando necessários

Superfícies, bordas, texto, foco e cores semânticas existentes devem ser reutilizados. Novos tokens só serão adicionados para conceitos realmente ausentes, como trilha/indicador de progresso ou estados específicos de linha, mantendo customização por CSS variables públicas.

## Accessibility

- Tabelas devem manter marcação tabular nativa e permitir `scope`/associações adequadas nos cabeçalhos.
- Conteúdo interativo dentro de linhas e cards deve manter foco visível e ordem natural de teclado.
- Listas devem usar semântica de lista quando representarem coleções.
- Progresso determinado deve expor valor, mínimo e máximo coerentes; progresso indeterminado não deve anunciar um valor falso.
- Estados vazios devem manter hierarquia de conteúdo compreensível e não usar regiões de alerta salvo quando o consumidor explicitamente compuser uma mensagem de erro.
- Contraste e diferenciação de estados devem funcionar nos temas claro e escuro.

## Testing Strategy

- Testes unitários e de acessibilidade para semântica, props públicas, estados e interação relevante.
- Testes de consumo público garantindo exports, tipos e CSS compilado.
- Storybook cobrindo variantes representativas e estados de borda.
- Admin demo demonstrando os componentes em contexto administrativo realista sem imports privados.
- Playwright e snapshots visuais para temas claro/escuro, viewport estreita e combinações principais.
- Validação final com format, lint, typecheck, testes, build, E2E e OpenSpec strict.

## Risks / Trade-offs

- Uma API de tabela excessivamente opinativa pode limitar casos futuros; por isso a primeira versão prioriza composição e semântica nativa.
- Cards muito genéricos podem duplicar `AdsSurface`; a implementação deve justificar `AdsCard` por estrutura e estados de apresentação reutilizáveis, reaproveitando `AdsSurface` internamente quando adequado.
- Responsividade de tabelas pode exigir compromisso entre overflow horizontal e transformação visual. A primeira versão deve preservar semântica e acesso ao conteúdo, preferindo container rolável a reestruturações que descaracterizem a tabela.

## Open Questions

Nenhuma decisão externa é necessária para iniciar a implementação. Detalhes finos de API podem ser refinados durante a execução desde que preservem as requirements desta change e não avancem sobre `add-advanced-admin-patterns`.
