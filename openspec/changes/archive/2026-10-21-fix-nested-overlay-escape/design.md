## Context

`useEscapeKey` instala um listener de `keydown` em `document` por camada aberta, sem relação entre eles. Um único Escape dispara todos os listeners, e o diálogo pai fecha junto com o popover, o calendário ou o dropdown internos. Os overlays são renderizados em portal, então a ordem no DOM não reflete o aninhamento lógico.

## Goals / Non-Goals

Garantir que o Escape seja tratado apenas pela camada superior, respeitando `closeOnEscape` e `pending`, sem mudar APIs públicas nem a devolução de foco. Não incluir o Tooltip (#91), o clique dentro do popover (#126), o painel de colunas do `AdsSmartTable`, estilos, tokens nem dependências.

## Decisions

Uma pilha de camadas em módulo, em `overlay-utils.tsx`, com um único listener em `document` ativo enquanto houver camadas. `useEscapeKey` registra a camada ao abrir e a remove ao fechar ou desmontar, na ordem de abertura; a camada mais recente é a superior. O listener ignora eventos com `defaultPrevented`, chama o tratador apenas da camada superior e então `preventDefault()`, sem `stopPropagation()`, para não interferir em quem observa Escape de propósito.

Uma camada registrada com `closeOnEscape` falso ou `pending` continua na pilha e absorve o Escape sem chamar `onEscape`. Assim, o pai nunca fecha no lugar de uma camada que o consumidor protegeu. Por isso `useEscapeKey` distingue camada presente (`open`) de camada que pode fechar (`enabled`).

O registro ocorre num efeito, e só no cliente: não há acesso à pilha durante a renderização, então Server Components e a hidratação não são afetados. O tratador mais recente é guardado em ref, para que um novo callback a cada render não reordene a camada na pilha.

A devolução de foco permanece em cada componente. Com o pai aberto, o foco volta ao gatilho do overlay interno, que está dentro do pai; com o segundo Escape, o pai devolve o foco à origem externa.

Alternativas: Context por árvore React exigiria um provedor e não cobre overlays irmãos em portal; usar a ordem do DOM depende da posição do portal; `stopPropagation()` impede listeners externos legítimos de observar o evento. Cada uma foi descartada.

## Risks / Trade-offs

Compatibilidade: o Escape tratado passa a chegar aos demais listeners de `document` com `defaultPrevented`, e um diálogo com `closeOnEscape={false}` ou `pending` passa a absorver o Escape de camadas inferiores, o que antes não registrava listener algum. Listeners do consumidor que ignoram eventos com `defaultPrevented` deixam de agir sobre esse Escape. Um Escape que cancela uma composição de IME (`isComposing`) é ignorado pela pilha.

Ordem no mesmo commit: o registro ocorre em efeito, e o conteúdo de um overlay só monta depois de `OverlayPortal`, que é montado a cada abertura. Por isso um overlay interno sempre registra depois do pai, mesmo com `open` inicial verdadeiro; os testes cobrem a abertura simultânea, inclusive em StrictMode.

Duas cópias do pacote na mesma página teriam pilhas separadas; não é um cenário suportado. O `AdsDropdown` hoje devolve o foco no próprio tratador de Escape e continua assim. Um overlay que feche por Escape fora da infraestrutura compartilhada (o painel de colunas do `AdsSmartTable`) não participa da pilha e fica registrado como trabalho futuro.

## Validation

Vitest cobre dialog com popover, com calendário e com dropdown, o `AdsConfirmDialog` com `pending` e um overlay interno, `closeOnEscape={false}` no topo, reabertura, a ordem de abertura e o evento marcado com `defaultPrevented`. Playwright usa foco real no admin-demo público. Axe audita o diálogo com o popover aberto. Executar build, tipos, lint, testes concisos, E2E, format e OpenSpec. Diagnóstico: `npm run test:verbose` e `npm run test:e2e:verbose`.
