# Evolução do AdsSmartTable: virtualização, redimensionamento e exportação (#93)

## Perfil de risco

**Critical**: acrescenta props e exports públicos a `@admin-ds/admin`, altera o CSS distribuído, introduz comportamento acessível novo (separador focável, linhas virtualizadas com `aria-rowcount`/`aria-rowindex`, gerenciamento de foco) e afeta o tamanho do pacote. Exige validação dos consumidores (admin-demo, Storybook), SSR/hidratação, `axe` e E2E.

## Problema

O `AdsSmartTable` renderiza todas as linhas recebidas, não permite ajustar a largura das colunas e não oferece uma saída para os dados exibidos. Listagens grandes ficam lentas, colunas com textos longos não podem ser acomodadas pelo usuário e cada consumidor reimplementa a extração das colunas visíveis para exportar.

## Objetivos

- Virtualização opcional de linhas de altura fixa, preservando seleção, foco, nome acessível e semântica de tabela para leitores de tela.
- Redimensionamento de colunas controlado pelo consumidor, operável por ponteiro e teclado.
- Gancho de exportação: a tabela emite colunas visíveis e dados; o formato fica com o consumidor, com um helper opcional de CSV.
- Atualizar `docs/limitations.md`, `docs/integration.md`, Storybook, demonstração e baseline do pacote.

## Fora do escopo

- Busca, ordenação, filtragem e paginação dentro da tabela, e qualquer regra de negócio.
- Linhas de altura variável, carregamento incremental, virtualização de colunas e reordenação de colunas.
- Geração de XLSX/PDF, download de arquivos e exportação do conjunto completo (cabe ao consumidor).
- Mudanças na identidade visual, nos tokens ou em `@admin-ds/components`.
- Dependências de runtime novas.

## Pacotes e contratos

- Biblioteca: `packages/admin`. Novas props de `AdsSmartTableProps` (`virtualization`, `columnWidths`, `onColumnWidthsChange`, `onExport`), novos campos opcionais em `AdsSmartTableColumn` (`resizable`, `minWidth`, `maxWidth`, `defaultWidth`, `exportable`, `exportValue`) e em `AdsSmartTableLabels` (`export`, `resizeColumn`), novo export `getAdsSmartTableCsv` e tipos `AdsSmartTableVirtualization`, `AdsSmartTableExport*` e `AdsSmartTableCsvOptions`. CSS `ads-smart-table-*` em `@admin-ds/admin/styles.css`.
- `AdsListFlow` herda as props por `Omit<AdsSmartTableProps, 'filters'>`.
- Demonstração (separada da biblioteca): página `/componentes/tabela-avancada` em `apps/admin-demo` e stories em `apps/docs`.

## Valor para os consumidores

Listagens de milhares de linhas sem custo de renderização proporcional ao total, colunas ajustáveis por quem usa a tela e exportação das colunas visíveis sem reimplementar a extração, mantendo o estado sob controle da aplicação.

## Compatibilidade e rollback

Todas as props e campos são opcionais e os campos de `AdsSmartTableLabels` novos são opcionais, então objetos tipados existentes continuam válidos. Sem as props, a marcação e o comportamento permanecem iguais. Reverter os commits da change desfaz módulos, CSS, exports, documentação e baseline em conjunto.
