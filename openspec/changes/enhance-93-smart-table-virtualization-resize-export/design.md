# Design — virtualização, redimensionamento e exportação do AdsSmartTable

## Limites Client/Server

`AdsSmartTable` já é Client Component; os três recursos vivem nele e em módulos auxiliares: `smart-table-virtual.ts` (cálculo puro da janela), `smart-table-resizer.tsx` (Client Component, alça) e `smart-table-export.ts` (utilitário puro, sem DOM, usável também no servidor). Funções (`cell`, `exportValue`, `onExport`) não atravessam a fronteira de Server Components, como já ocorria com `cell`.

## Virtualização

`virtualization={{ rowHeight, height, overscan? }}` com altura fixa por linha. Alternativas: medir linhas (variável) exige reflow e `ResizeObserver` por linha e torna o cálculo da janela instável; bibliotecas de terceiros violam a regra de não adicionar dependências. Escolhemos altura fixa e cálculo aritmético a partir de `scrollTop`.

- A região rolável existente (focável, nomeada pela legenda) passa a ter altura máxima `height` e cabeçalho `sticky`. Linhas fora da janela viram uma ou mais linhas espaçadoras `aria-hidden` que preservam a altura total.
- Semântica: `aria-rowcount` na tabela (linhas + cabeçalho) e `aria-rowindex` em cada linha montada, para que leitores de tela informem o total e a posição reais.
- Foco: o índice da linha que contém o foco é registrado em `focus`/`blur` e a linha permanece montada fora da janela, de modo que rolar não desmonta o controle focado nem perde o foco. A região rolável continua rolando com as setas, PageUp/PageDown, Home e End.
- Seleção: "selecionar todas", a contagem e `isRowSelectable` operam sobre todas as linhas recebidas, não só as montadas; ids selecionados continuam preservados.
- Altura exata: o `divide-y` da tabela somaria bordas à altura da linha e a soma de erros distorceria a rolagem; as linhas virtualizadas anulam a borda inline e os separadores são sombras internas (`box-shadow`), que não alteram o layout. O conteúdo das células é cortado com reticências para respeitar `rowHeight`.
- SSR/hidratação: `scrollTop` inicial é 0, então servidor e cliente renderizam a mesma primeira janela. Configuração inválida (altura não positiva ou não finita) é ignorada e a tabela renderiza todas as linhas.
- Estados de carregamento, vazio e erro mantêm a precedência e não usam janela nem `aria-rowcount`.

## Redimensionamento

`onColumnWidthsChange` habilita uma alça por coluna e `columnWidths` (id → pixels) é a fonte da verdade; a tabela não guarda larguras. A alça é um `role="separator"` focável (padrão window splitter) com `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext` e nome acessível configurável (`labels.resizeColumn`).

- Teclado: ←/→ ±10 px (Shift ±50), Home/End vão ao mínimo/máximo e Enter restaura a largura automática; em contexto RTL as setas se invertem (leitura de `direction`). Ponteiro: `pointerdown` com captura, `pointermove` e `pointerup`; duplo clique também restaura.
- Limites por coluna (`minWidth` 80, `maxWidth` 640), aplicados antes de emitir; a alça mede o cabeçalho no momento da interação para partir da largura real quando a coluna ainda é automática.
- A largura é aplicada como `width`/`min-width`/`max-width` no cabeçalho e nas células da coluna, com conteúdo cortado por reticências; colunas sem largura continuam automáticas.
- Sem `onColumnWidthsChange` não há alça nem estilo extra. A alça tem área de 1,5rem de largura para o alvo de toque (WCAG 2.5.8), foco visível pelo token de anel de foco e usa só tokens `--ads-*`.

## Exportação

`onExport` exibe o botão "Exportar" na barra de ferramentas e emite `AdsSmartTableExport<Row>`: `columns` (visíveis, em ordem, `exportable !== false`), `rows`, `records`, `selectedIds` e `selectedRows`. O valor da célula vem de `exportValue` ou do retorno de `cell` quando for texto ou número; conteúdo React vira `null` para não inventar texto. O formato é do consumidor; `getAdsSmartTableCsv` é um helper opcional e puro (RFC 4180, separador configurável, BOM opcional, só selecionadas opcional) que neutraliza textos iniciados por `=`, `+`, `-` ou `@` contra injeção de fórmulas. O botão fica desabilitado durante carregamento, erro e sem linhas. A tabela não baixa arquivos nem busca dados; exportar o conjunto completo é decisão do consumidor.

## CSS, Tailwind e tokens

Estilos novos em `packages/admin/src/styles.css`, camada `components`, classes `ads-smart-table-*` e tokens semânticos existentes (`--ads-color-*`); sem Tailwind exigido do consumidor, sem `@apply`. As regras específicas da virtualização ficam sob `[data-virtualized]` na raiz da tabela, evitando conflito com aplicações consumidoras e com `AdsTable` isolada.

## Bundle e dependências

Sem dependência de runtime. `@admin-ds/admin` passa de 199723 (develop) para 236799 bytes (+37076), em três módulos novos mais CSS e declarações; o baseline foi atualizado e justificado em `docs/bundle-baseline.md`.

## Riscos e alternativas

Linhas de altura variável e virtualização de colunas ficam como melhoria futura. Busca nativa (Ctrl+F) só encontra linhas montadas, o que é um limite documentado em `docs/limitations.md`. Se os gates de acessibilidade ou de consumo falharem, reverter os commits da change em conjunto.
