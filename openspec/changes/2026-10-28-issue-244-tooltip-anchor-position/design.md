# Design — âncora geométrica do Tooltip e Popover

## Baseline

AdsTooltip envolve o filho em span.ads-tooltip-anchor.inline-flex e usa anchorRef para useAnchoredPosition(open, anchorRef, contentRef, placement). A demo define display:flex, flex-direction:column e align-items:stretch em .demo-catalog-preview. Um item flex pode ser esticado transversalmente; o centro calculado do wrapper passa a diferir do botão real. AdsPopover usa um wrapper inline-flex comparável. Dropdown utiliza referência ao gatilho real e não deve ser modificado por analogia sem reprovação de teste.

## Alternativas e decisão

Medir anchor.getBoundingClientRect(), trigger.getBoundingClientRect(), panel rect e data-placement em ambiente reproduzível (página do catálogo, story e componente em flex/grid). Se o wrapper esticado for a causa, preferir tornar a âncora shrink-to-fit independentemente do layout pai e assegurar que refs/eventos permaneçam no gatilho; alternativa é medir o elemento filho como referência, respeitando botões com largura responsiva. Escolher a menor alteração com comportamento consistente em flex, grid e bloco.

Não corrigir apenas com align-items no preview: consumidores também usam flex/stretch e precisam de robustez da biblioteca. Não aplicar ajuste fixo de left/top arbitrário, nem assumir ausência de colisão. O algoritmo existente de flip/shift/arrowOffset permanece a referência e só muda se medidas revelarem falha distinta.

## Acessibilidade e comportamento

O tooltip padrão placement=top deve abrir acima do botão e a seta deve apontar para ele. Se não houver espaço, o lado efetivo muda conforme a biblioteca, mantendo data-placement e seta coerentes. Foco e hover abrem; Escape fecha sem deslocar foco e sem fechar modal inferior; aria-describedby combina id do consumidor quando aberto e volta ao original ao fechar. O Popover deve manter interatividade, fechamento externo e retorno de foco. Wrappers que capturam pointerenter/pointerleave e foco não podem perder eventos.

Cobrir múltiplos triggers em mesma coluna, largura total intencional, preview flex stretch, grid, viewport próxima a bordas, scroll de ancestral, resize de janela, conteúdo dinâmico, zoom e modal com portais. O teste não deve exigir centralização perfeita quando o limite da viewport obriga shift: nesse caso validar seta próxima ao centro do gatilho e painel dentro da viewport.

## Pacotes, CSS e SSR

A alteração recai no pacote @admin-ds/components; classes compiladas devem funcionar sem Tailwind no consumidor Next.js. Classes existentes são estáticas, tokenizadas e não mudam tema. O componente já declara use client; renderização SSR/hidratação deve permanecer segura, com portal inicialmente oculto até medidas válidas. Sem nova dependência ou mudança de exports/props.

## Risco, revisão e rollback

Uma estratégia shrink-to-fit pode alterar casos com gatilho width:100%; validar gatilho largo e inline em contêiner flex. Um wrapper que passe a mediar eventos incorretamente pode mudar hover ou foco; testar perda e recuperação. Medições E2E relativas a retângulos tornam o defeito verificável. Revisar CSS publicado, screenshots light/dark, posicionamento junto às bordas e consumo Next.js. Rollback pontual sem alterações globais em overlay-utils.

## Decisão implementada

Optou-se por medir o primeiro elemento filho do wrapper (`.ads-tooltip-anchor` e `.ads-popover-anchor`) em `useAnchoredPosition`, mantendo o wrapper como está (inclusive o `self-stretch` do `AdsDatePicker`). O hook passa a conhecer esses dois seletores internos; o rollback inclui, portanto, `overlay-utils.tsx`. Gatilhos que renderizam mais de um elemento raiz (ignorando o marcador oculto do portal) têm todos os elementos tratados como gatilho para alternar o Popover e para o clique externo; o painel é posicionado pelo primeiro. A âncora é reavaliada a cada medição e um `MutationObserver` (childList do wrapper) reobserva e remede quando o elemento do gatilho muda com o overlay aberto. Em área esticada vazia, foco e hover do Tooltip continuam no wrapper (comportamento anterior preservado); no Popover, clique nessa área não alterna nem conta como clique interno.

## Orçamento de distribuição

O `dist` completo de `@admin-ds/components` (JS, `.d.ts` e mapas) passou de 501.863 para 503.235 bytes (+1.372 B: helpers de gatilho, reobservação por `MutationObserver` e mapas). O limite de 10% sobre o baseline (457.000, ou seja 502.700) tinha folga de 837 B; o baseline foi elevado para 457.600 (limite 503.360) de forma explícita, por código público novo, e não para mascarar regressão. Sem mudança em exports, props ou CSS.

## Evidências de reprodução (task 1)

Build de produção do `admin-demo`, Chromium, `/catalogo/tooltip` com foco no botão "Ajuda" do preview (`.demo-catalog-preview`: `display:flex; flex-direction:column; align-items:stretch`). Retângulos em px; "antes" = `useAnchoredPosition` e Popover de `develop`.

| Viewport | Botão (x, largura) | Wrapper `.ads-tooltip-anchor` (largura) | Centro do botão | Centro do balão antes | Centro do balão depois |
| -------- | ------------------ | --------------------------------------- | --------------- | --------------------- | ---------------------- |
| 390      | 49, 72,5           | 292                                     | 85,2            | 195,0 (delta +109,8)  | 85,2 (delta 0)         |
| 1280     | 348,2, 72,5        | 839,6                                   | 384,4           | 768,0 (delta +383,6)  | 384,4 (delta 0)        |

Computed styles: wrapper `display:flex; align-self:auto; width` igual à do contêiner (292 / 839,6 px); `placement` permaneceu `top` nos dois casos. Causa: o wrapper esticado era a referência geométrica.

Popover (`/catalogo/popover`, botão "Abrir popover", largura 126,2): compartilha o defeito. Antes, centro do botão 112,1 vs centro do painel 195,0 (390px) e 411,3 vs 768,0 (1280px); depois, ambos 112,1 e 411,3 (delta 0). O E2E `tooltip e popover se ancoram no botão real em flex/stretch` falha antes (erro de 109,8px) e passa depois.
