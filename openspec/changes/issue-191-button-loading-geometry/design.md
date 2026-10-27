## Contexto

`AdsButton` é `inline-flex` com `gap-2`; o indicador (16px) era irmão de `children` somente durante o carregamento, somando 24px à largura e deslocando o rótulo.

## Decisões

- **Sobreposição em vez de reserva de espaço.** Reservar espaço permanente alargaria todos os botões e quebraria layouts existentes. O indicador é `absolute inset-0` centralizado; o botão ganha `relative`.
- **Rótulo oculto com `opacity-0`, não `visibility`/`display`.** Mantém o nó no fluxo (dimensões) e o nome acessível; o indicador continua `aria-hidden`, e `aria-busy` e `disabled` seguem como antes.
- **Contêiner interno sempre presente** (`ads-button-content`, `inline-flex gap-2`) para não remontar `children` ao alternar e preservar o espaçamento entre ícone e texto.
- **Client/Server:** nenhuma mudança; continua sem `"use client"`.
- **CSS:** classes Tailwind estáticas, compiladas no CSS distribuído; sem configuração exigida do consumidor. Sem impacto relevante no bundle.
- **Reduced motion:** o indicador já usa `motion-reduce:animate-none`; temas via `currentColor`.

## Alternativas

Reservar sempre a largura do indicador (altera todos os botões); trocar o texto por spinner com `display:none` (muda dimensões); `visibility:hidden` (remove o nome acessível em alguns leitores).
