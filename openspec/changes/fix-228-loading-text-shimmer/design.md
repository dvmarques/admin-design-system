# Design: correção do shimmer

## Diagnóstico

No design system, a base do texto é `var(--ads-color-text-muted)` e o pico `var(--ads-color-text-primary)`. Em dark, são respectivamente slate200 e slate50. O efeito depende apenas do diferencial muito pequeno entre tons claros; o CSS usa uma camada de `background-image` sobre `background-color`, diferentemente do Back Admin, que usa duas camadas de `background-image` com `background-size` e `background-position` coordenados.

## Decisões

1. Restaurar duas camadas explícitas de `background-image`: faixa translúcida com pico na cor de destaque do texto e base sólida usando tokens do tema.
2. Separar as posições de background em keyframes `150% center, 0 0` até `-150% center, 0 0` para facilitar manutenção e comparação com Back Admin.
3. Base apagada nos dois temas, a partir de tokens existentes: `color-mix(text-muted, surface)` com 77% de `text-muted` no claro e 42% no escuro, de modo que a razão de contraste base/pico (`text-primary`) fique em ~4,2:1, como no texto animado de referência indicado pelo mantenedor (base cinza apagada, pico quase branco no escuro; invertido no claro). A base aceita ficar abaixo de 4,5:1 contra a superfície (decisão do mantenedor, igual à referência: 3,3:1 no escuro e 4,2:1 no claro); o pico mantém contraste alto (14,0:1 e 17,9:1). `color-mix` é aprimoramento progressivo, com fallback `text-muted` sólido e legível. Limitar mudança ao componente.
4. Expandir modestamente a região de brilho e manter velocidades `slow`/`normal`/`fast` (4s/2.5s/1.5s).
5. Continuar sem `use client`; CSS é compilado em `@admin-ds/components/styles.css`. Usar seletor prefixado `.ads-loading-text` e tokens semânticos para evitar colisões e dependências.
6. Preservar `@supports` para background clip, reduced motion, forced-colors, RTL e estados inativos. Garantir que fallback mantém cor legível.
7. Não mexer em `as`, `loading`, `speed`, renderização SSR, semântica ARIA, ou exports.
8. Revalidar budget de distribuição, contrastes e comportamento em Storybook e Next.js. Não modificar snapshots sem revisão visual autorizada.

## Trade-offs

Aumentar a faixa e diferença de brilho torna a animação evidente, mas evita flash agressivo ou tons fixos. Se `color-mix` não for suportado, usar a cor muted atual como fallback legível.
