# Design

## Decisão

Em `overlay-anchored.tsx`, o `aria-describedby` aplicado ao gatilho passa a ser
`[children.props['aria-describedby'], tooltipId].filter(Boolean).join(' ')`
enquanto o tooltip está aberto. Fechado, nada é injetado e o `cloneElement`
preserva o valor original do consumidor, por isso o retorno ao valor original
não exige estado extra, inclusive após Escape ou blur.

A ordem coloca o id do consumidor antes do id do tooltip. Ids vazios ou ausentes
são descartados, sem espaços sobrando.
