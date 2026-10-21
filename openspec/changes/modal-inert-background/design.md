## Context

`OverlayPortal` (`overlay-utils.tsx`) renderiza um `div[data-ads-overlay-root]` como filho direto de `document.body` para todos os overlays: dialog, drawer, tooltip, popover, dropdown e toast. `OverlayPanel` (`overlay-dialog.tsx`) define `aria-modal="true"` e usa `useOverlayFocus` para foco inicial, laço de Tab e devolução de foco. Nada torna o resto da página inerte. A pilha de Escape (#131) registra camadas em efeitos e inclui camadas não modais.

## Goals / Non-Goals

Tornar inerte o fundo de `AdsDialog` e `AdsDrawer`, restaurando exatamente o estado anterior, com aninhamento, StrictMode e desmontagem corretos, sem mudar a API pública, tokens ou dependências. Não incluir scroll lock, `aria-hidden`, observação do `body` depois da abertura, API pública de camadas modais, nem as #133 e #135.

## Decisions

**Só `inert`, sem `aria-hidden`.** `inert` bloqueia foco, clique e teclado e remove o subtree da árvore de acessibilidade. `aria-hidden` sem `inert` deixaria o fundo focável (regra `aria-hidden-focus` do axe). O atributo é definido com `setAttribute('inert', '')` sem detecção de recurso: navegadores sem suporte o ignoram, o que mantém o comportamento atual (Tab preso e `aria-modal`). Suporte atual: Chromium 102+, Firefox 112+, Safari 15.5+.

**Camada no root do portal.** `OverlayPortal` ganha a prop interna `layer` (`modal`, `popup` padrão, `toast`) e grava `data-ads-overlay-layer` no root, mantendo `data-ads-overlay-root`. `AdsDialog` e `AdsDrawer` usam `modal`; `AdsToast`, `toast`; os demais, `popup`. A marca é interna e não faz parte da API pública.

**Registro de modais próprio, separado da pilha de Escape.** A pilha de Escape inclui camadas não modais e a #133 pode mudar o contrato dela, então o registro de modais fica em `overlay-utils.tsx` como módulo separado. O registro só é tocado em efeitos, no cliente.

**Quem fica inerte.** Ao registrar um modal, ficam inertes todos os filhos de `document.body` existentes naquele momento, exceto o root do próprio modal, roots de `toast` e elementos não renderizados (`script`, `style`, `link`, `meta`, `noscript`, `template`). Como um overlay aberto depois do modal ainda não existe no registro, popover, tooltip, dropdown e calendário abertos dentro do modal ficam interativos sem regra extra. Um popover aberto antes do modal fica inerte junto com a página. Com modais empilhados, o root do modal anterior já existe e fica inerte.

**Contagem por nó, não só por modal.** Um mapa `nó → { contagem, inert anterior }` evita que um modal restaure um nó que outro modal ainda cobre. Cada registro guarda os nós que cobriu e, ao liberar, decrementa. Na transição 0 → 1 o estado anterior de `inert` é gravado (presente, com valor, ou ausente) e só nesse momento o atributo é definido; na transição 1 → 0 ele é restaurado. Assim um `inert` aplicado pelo consumidor é preservado, e fechar modais fora de ordem não deixa a página interativa antes da hora nem inerte depois.

**Ordem dos efeitos e foco.** O registro vive num efeito do `OverlayPortal` (quando `layer="modal"` e o root existe). O cleanup roda na desmontagem do portal, na fase de destruição dos efeitos, antes do efeito de `useOverlayFocus` que devolve o foco ao gatilho, porque elemento inerte não recebe foco. O elemento de origem é capturado em `useEffect` no primeiro commit com `open`, antes de o portal montar e de o registro rodar, então o foco inerte do gatilho não é perdido.

**StrictMode e remontagem.** O ciclo montar, limpar e montar do StrictMode registra, libera e registra de novo; a contagem por nó mantém o resultado idêntico. Desmontar a árvore sem `open=false` também executa o cleanup.

**Server Components e hidratação.** `overlay-utils.tsx` já declara `"use client"`. O portal só monta depois de `useMounted`, e o registro só roda em efeito, então HTML do servidor e hidratação não mudam.

**Sem fallback e sem observador.** Nós adicionados ao `body` depois da abertura (portais de terceiros, anunciantes de rota) não são marcados. Observar o `body` com `MutationObserver` aumentaria complexidade e risco de marcar overlays legítimos; fica como trabalho futuro se houver demanda. Nós já presentes no `body` quando o modal abre, inclusive de terceiros, ficam inertes.

**Backdrop e cliques.** O backdrop fica dentro do root do modal e cobre a viewport, então o clique nele continua tratado por `closeOnBackdrop`. O workaround de `mousedown` do `AdsConfirmDialog` (evita mover o foco para o `body`) continua necessário e não muda.

**Alternativas.** Estender `EscapeLayer` com `modal: boolean` acoplaria os dois registros. `aria-hidden` como fallback exigiria tirar os controles do fundo do foco por outro meio. Marcar apenas os "irmãos do portal" deixaria inertes popover e toast.

## Risks / Trade-offs

Um overlay de terceiro já presente no `body` fica inerte com o modal aberto; documentado em `docs/limitations.md`. Anunciantes de rota do Next.js (`next-route-announcer`) ficam inertes enquanto há modal aberto e uma navegação nesse intervalo não é anunciada; é um caso raro. Em navegadores sem `inert` a página continua alcançável por clique; documentado. A rolagem do fundo continua possível (scroll lock fora do escopo).

## Validation

Vitest: fundo inerte com dialog e drawer abertos, restauração ao fechar e ao desmontar, `inert` anterior do consumidor preservado, root do modal, popup aberto depois e toast sem `inert`, popup aberto antes inerte, aninhamento com fechamento em ordens diferentes, StrictMode, abertura e fechamento no mesmo tick, `AdsConfirmDialog`, sem alteração no HTML do servidor, e `axe` com o modal aberto. Playwright (Chromium) no admin-demo público com foco real: Tab e foco programático não alcançam o fundo, o fundo sai da árvore de acessibilidade (CDP), `axe` com o modal aberto, e a restauração e o foco ao fechar. O clique no fundo não é testado separadamente: o backdrop cobre a viewport e o fundo já está inerte. Story do fundo inerte com modal aninhado. Verificar temas claro e escuro e `prefers-reduced-motion` (sem animação nova). Executar build, typecheck, lint, testes concisos, E2E, format e `validate --all --strict`.

## Limitações conhecidas e trabalhos futuros

- O fundo continua rolável com roda e toque; scroll lock fica para uma issue própria.
- Nós adicionados ao `body` depois da abertura do modal não ficam inertes.
- Navegadores sem `inert` mantêm o comportamento anterior.
- API pública de camadas modais e a integração com a pilha de Escape ficam com a #133.
