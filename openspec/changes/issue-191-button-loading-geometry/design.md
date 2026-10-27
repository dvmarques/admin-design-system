## Contexto

`AdsButton` é `inline-flex` com `gap-2`; o indicador (16px) era irmão de `children` somente durante o carregamento, somando 24px à largura e deslocando o rótulo.

## Decisões

- **Mesma célula de grid em vez de `absolute`.** Reservar espaço permanente alargaria todos os botões; `relative`/`absolute` no botão sobrescreveria `absolute`/`fixed` passados por `className` (a ordem no CSS distribuído favorece `.relative`). Um `inline-grid` interno com rótulo e indicador na mesma célula não usa `position`.
- **Rótulo oculto com `opacity-0`, não `visibility`/`display`.** Mantém o nó no fluxo (dimensões) e o nome acessível; o indicador continua `aria-hidden`, e `aria-busy` e `disabled` seguem como antes.
- **Contêineres internos sempre presentes** (um `span` em `grid` e outro em `inline-flex gap-2`) para não remontar `children` ao alternar e preservar o espaçamento entre ícone e texto.
- **Client/Server:** nenhuma mudança; continua sem `"use client"`.
- **CSS:** classes Tailwind estáticas, compiladas no CSS distribuído; sem configuração exigida do consumidor. Sem impacto relevante no bundle.
- **Reduced motion:** o indicador já usa `motion-reduce:animate-none`; temas via `currentColor`.

## Alternativas

Reservar sempre a largura do indicador (altera todos os botões); trocar o texto por spinner com `display:none` (muda dimensões); `visibility:hidden` (remove o nome acessível em alguns leitores).
