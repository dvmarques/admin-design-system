## Context

`OverlayPortal` (`overlay-utils.tsx`) renderiza um `div[data-ads-overlay-root]` como filho direto de `document.body` para todos os overlays: dialog, drawer, tooltip, popover, dropdown e toast. `OverlayPanel` (`overlay-dialog.tsx`) define `aria-modal="true"` e usa `useOverlayFocus` para foco inicial, laço de Tab e devolução de foco. Nada torna o resto da página inerte. A pilha de Escape (#131) registra camadas em efeitos e inclui camadas não modais.

## Goals / Non-Goals

Tornar inerte o fundo de `AdsDialog` e `AdsDrawer`, restaurando exatamente o estado anterior, com aninhamento, StrictMode e desmontagem corretos, sem mudar a API pública, tokens ou dependências. Não incluir scroll lock, `aria-hidden`, API pública de camadas modais, nem as #133 e #135.

## Decisions

**Só `inert`, sem `aria-hidden`.** `inert` bloqueia foco, clique e teclado e remove o subtree da árvore de acessibilidade. `aria-hidden` sem `inert` deixaria o fundo focável (regra `aria-hidden-focus` do axe). O atributo é definido com `setAttribute('inert', '')` sem detecção de recurso: navegadores sem suporte o ignoram, o que mantém o comportamento atual (Tab preso e `aria-modal`). Suporte atual: Chromium 102+, Firefox 112+, Safari 15.5+.

**Camada no root do portal.** `OverlayPortal` ganha a prop interna `layer` (`modal`, `popup` padrão, `toast`) e grava `data-ads-overlay-layer` no root, mantendo `data-ads-overlay-root`. `AdsDialog` e `AdsDrawer` usam `modal`; `AdsToast`, `toast`; os demais, `popup`. A marca é interna e não faz parte da API pública.

**Registro de modais próprio, separado da pilha de Escape.** A pilha de Escape inclui camadas não modais e a #133 pode mudar o contrato dela, então o registro de modais fica em `overlay-utils.tsx` como módulo separado. O registro só é tocado em efeitos, no cliente.

**Reconciliação em vez de snapshot.** Um registro de modais abertos reconcilia o `inert` de `document.body` a cada mudança relevante. Ficam inertes todos os filhos de `body`, exceto: o root do modal mais recente, roots de toast, elementos não renderizados (`script`, `style`, `link`, `meta`, `noscript`, `template`) e popups nascidos dentro de um overlay interativo. Um modal ainda não registrado (root recém-inserido, antes do efeito) é tratado como novo e não é marcado. Com modais empilhados, os roots dos modais anteriores ficam inertes e voltam a ficar interativos quando o mais recente fecha, em qualquer ordem de fechamento.

**Nós criados durante o modal.** Enquanto há modal aberto, um `MutationObserver` em `body` (`childList`, sem `subtree`) dispara a reconciliação quando um filho direto é adicionado, removido ou substituído: navegação do Next.js, portais de terceiros e anunciantes de rota ficam inertes também. O observador existe só enquanto houver modal aberto e é desconectado ao liberar o último.

**Origem dos popups.** O `OverlayPortal` registra a origem lógica (o span oculto que fica na posição do componente na árvore React) de cada root. Um popup (`popover`, `tooltip`, `dropdown`) fica interativo se essa origem estiver dentro de um overlay interativo (o modal mais recente, outro popup interativo ou um toast); um popup cuja origem está na página fica inerte, inclusive se abrir depois do modal por código do fundo. Isso cobre também um popup que monta no mesmo lote de renders do modal.

**Posse do atributo.** A biblioteca só marca nós que ainda não tinham `inert` e só remove o que marcou. Um `inert` que o consumidor já tinha (qualquer valor) nunca é tocado. Uma escrita do consumidor em `inert` num nó marcado pela biblioteca, detectada por `MutationObserver` em cada filho direto, transfere a posse a ele: se acrescentou o atributo (mesmo com o mesmo valor), ele permanece depois do modal; se o removeu, o nó é marcado de novo enquanto o modal está aberto e o atributo fica ausente ao fechar. Um nó marcado que sai de `body` tem o `inert` removido na hora, para que um nó reinserido depois não volte inerte sem posse. Os registros das próprias escritas são descartados com `takeRecords()` depois de cada reconciliação, depois de processar as escritas externas pendentes.

**Ordem dos efeitos e foco.** O registro vive num efeito do `OverlayPortal` (quando `layer="modal"` e o root existe). O cleanup roda na desmontagem do portal, na fase de destruição dos efeitos, antes do efeito de `useOverlayFocus` que devolve o foco ao gatilho, porque elemento inerte não recebe foco. O elemento de origem é capturado em `useEffect` no primeiro commit com `open`, antes de o portal montar e de o registro rodar, então o foco inerte do gatilho não é perdido.

**StrictMode e remontagem.** O ciclo montar, limpar e montar do StrictMode registra, libera e registra de novo; a reconciliação a partir dos modais abertos mantém o resultado idêntico. Desmontar a árvore sem `open=false` também executa o cleanup.

**Server Components e hidratação.** `overlay-utils.tsx` já declara `"use client"`. O portal só monta depois de `useMounted`, e o registro só roda em efeito, então HTML do servidor e hidratação não mudam.

**Retorno de foco com modais aninhados.** O elemento que abriu cada modal é guardado junto de uma lista de alternativas: os elementos que abriram os modais ao redor, obtidos pelo root que contém a origem. Ao fechar, o foco vai ao primeiro candidato que ainda está na página. Assim, se o modal A abre o B e A fecha antes, o fechamento de B devolve o foco ao gatilho da página, e não ao botão de A, que já não existe.

**Sem fallback de `aria-hidden`.** Sem suporte a `inert`, o navegador ignora o atributo e o comportamento anterior continua.

**Backdrop e cliques.** O backdrop fica dentro do root do modal e cobre a viewport, então o clique nele continua tratado por `closeOnBackdrop`. O workaround de `mousedown` do `AdsConfirmDialog` (evita mover o foco para o `body`) continua necessário e não muda.

**Alternativas.** Estender `EscapeLayer` com `modal: boolean` acoplaria os dois registros. `aria-hidden` como fallback exigiria tirar os controles do fundo do foco por outro meio. Marcar apenas os "irmãos do portal" deixaria inertes popover e toast.

## Risks / Trade-offs

Um overlay de terceiro no `body`, existente ou criado durante o modal, fica inerte; documentado em `docs/limitations.md`. Anunciantes de rota do Next.js (`next-route-announcer`) ficam inertes enquanto há modal aberto e uma navegação nesse intervalo não é anunciada. O observador reage a cada alteração dos filhos diretos de `body`, o que é barato (sem `subtree`), mas roda sempre que um portal abre ou fecha. Em navegadores sem `inert` a página continua alcançável por clique; documentado. A rolagem do fundo continua possível (scroll lock fora do escopo).

## Validation

Vitest: fundo inerte com dialog e drawer abertos, restauração ao fechar e ao desmontar, `inert` anterior do consumidor preservado, root do modal, popup nascido no modal e toast sem `inert`, popup do fundo (aberto antes ou durante o modal) inerte, nós inseridos e substituídos em `body` durante o modal, escritas do consumidor em `inert` (acrescentar, reafirmar, remover) com um e dois modais, aninhamento com fechamento em ordens diferentes sem clicar em conteúdo inerte, retorno de foco quando o modal de origem fecha antes, StrictMode, abertura e fechamento no mesmo tick, `AdsConfirmDialog`, sem alteração no HTML do servidor, e `axe` com o modal aberto. Playwright (Chromium) no admin-demo público com foco real: Tab e foco programático não alcançam o fundo, o fundo sai da árvore de acessibilidade (CDP), `axe` com o modal aberto, e a restauração e o foco ao fechar. O clique no fundo não é testado separadamente: o backdrop cobre a viewport e o fundo já está inerte. Story do fundo inerte com modal aninhado. Verificar temas claro e escuro e `prefers-reduced-motion` (sem animação nova). Executar build, typecheck, lint, testes concisos, E2E, format e `validate --all --strict`.

## Limitações conhecidas e trabalhos futuros

- O fundo continua rolável com roda e toque; scroll lock fica para uma issue própria.
- Uma escrita do consumidor em `inert` que reafirme o mesmo valor depois da marcação é tratada como escrita dele; o atributo permanece ao fechar.
- Navegadores sem `inert` mantêm o comportamento anterior.
- API pública de camadas modais e a integração com a pilha de Escape ficam com a #133.
