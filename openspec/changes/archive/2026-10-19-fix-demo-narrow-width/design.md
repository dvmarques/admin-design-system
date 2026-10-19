# Design

## Decisão

A causa é a mesma das stories corrigidas antes: uma coluna `1fr` (ou `auto`) de
grid tem mínimo igual ao conteúdo, então a paginação (`nav` rolável com
`ul min-w-max`) de 366px alargava a coluna compartilhada pelas três seções de
`.demo-utility-grid` e, com ela, a página.

`minmax(0, 1fr)` permite que a coluna encolha até a largura disponível; o `nav`
da paginação, que já tem `overflow-x: auto`, passa a rolar dentro do painel. O
grid interno do `NavigationShowcase` precisa da mesma coluna, pois a coluna
`auto` dele também tem mínimo igual ao conteúdo.

A troca vale para os cinco grids da mesma regra de media query: onde o conteúdo
cabe, o layout é idêntico; onde não cabe, deixa de alargar a página.

## Não alterado

`AdsPagination` e os demais componentes: o comportamento de rolagem interna já
existe e é o esperado.
