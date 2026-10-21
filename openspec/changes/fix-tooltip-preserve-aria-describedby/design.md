# Design

## Decisão

Em `overlay-anchored.tsx`, o `aria-describedby` aplicado ao gatilho passa a ser
a lista de ids do consumidor mais o id do tooltip, sem duplicatas
enquanto o tooltip está aberto. Fechado, nada é injetado e o `cloneElement`
preserva o valor original do consumidor, por isso o retorno ao valor original
não exige estado extra, inclusive após Escape ou blur.

A ordem coloca o id do consumidor antes do id do tooltip. O valor do consumidor
é separado por espaços; ids vazios, espaços sobrando e duplicatas são
descartados.

O `AdsTooltip` não fecha com Escape (fecha por blur ou fim do apontamento);
isso não muda aqui.
