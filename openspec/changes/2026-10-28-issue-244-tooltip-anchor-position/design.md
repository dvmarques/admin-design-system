# Design — âncora geométrica do Tooltip e Popover

## Baseline
AdsTooltip envolve o filho em span.ads-tooltip-anchor.inline-flex e usa anchorRef para useAnchoredPosition(open, anchorRef, contentRef, placement). A demo define display:flex, flex-direction:column e align-items:stretch em .demo-catalog-preview. Um item flex pode ser esticado transversalmente; o centro calculado do wrapper passa a diferir do botão real. AdsPopover usa um wrapper inline-flex comparável. Dropdown utiliza referência ao gatilho real e não deve ser modificado por analogia sem reprovação de teste.

## Decisão e alternativas
Medir anchor.getBoundingClientRect(), trigger.getBoundingClientRect(), panel rect e data-placement em ambiente reproduzível (página do catálogo, story e componente em flex/grid). Se o wrapper esticado for a causa, preferir tornar a âncora shrink-to-fit independentemente do layout pai e assegurar que refs/eventos permaneçam no gatilho; alternativa é medir o elemento filho como referência, respeitando botões com largura responsiva. Escolher a menor alteração com comportamento consistente em flex, grid e bloco.

Não corrigir apenas com align-items no preview: consumidores também usam flex/stretch e precisam de robustez da biblioteca. Não aplicar ajuste fixo de left/top arbitrário, nem assumir ausência de colisão. O algoritmo existente de flip/shift/arrowOffset permanece a referência e só muda se medidas revelarem falha distinta.

## Acessibilidade e comportamento
O tooltip padrão placement=top deve abrir acima do botão e a seta deve apontar para ele. Se não houver espaço, o lado efetivo muda conforme a biblioteca, mantendo data-placement e seta coerentes. Foco e hover abrem; Escape fecha sem deslocar foco e sem fechar modal inferior; aria-describedby combina id do consumidor quando aberto e volta ao original ao fechar. O Popover deve manter interatividade, fechamento externo e retorno de foco. Wrappers que capturam pointerenter/pointerleave e foco não podem perder eventos.

Cobrir múltiplos triggers em mesma coluna, largura total intencional, preview flex stretch, grid, viewport próxima a bordas, scroll de ancestral, resize de janela, conteúdo dinâmico, zoom e modal com portais. O teste não deve exigir centralização perfeita quando o limite da viewport obriga shift: nesse caso validar seta próxima ao centro do gatilho e painel dentro da viewport.

## Pacotes, CSS e SSR
A alteração recai no pacote @admin-ds/components; classes compiladas devem funcionar sem Tailwind no consumidor Next.js. Classes existentes são estáticas, tokenizadas e não mudam tema. O componente já declara use client; renderização SSR/hidratação deve permanecer segura, com portal inicialmente oculto até medidas válidas. Sem nova dependência ou mudança de exports/props.

## Risco, revisão e rollback
Uma estratégia shrink-to-fit pode alterar casos com gatilho width:100%; validar gatilho largo e inline em contêiner flex. Um wrapper que passe a mediar eventos incorretamente pode mudar hover ou foco; testar perda e recuperação. Medições E2E relativas a retângulos tornam o defeito verificável. Revisar CSS publicado, screenshots light/dark, posicionamento junto às bordas e consumo Next.js. Rollback pontual sem alterações globais em overlay-utils.
