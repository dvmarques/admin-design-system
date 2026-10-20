# Identidade visual

Superfícies, espaçamento e cores de gráfico dos tokens. Tudo vem de
`@admin-ds/tokens/styles.css`; nenhuma configuração de Tailwind é necessária.
Os valores estão em `packages/tokens/source/tokens.mjs` e a story
**Foundation/Visual identity** (`apps/docs`) mostra tudo nos dois temas.

## Estado da identidade visual

A change `add-visual-identity` entrega as superfícies escuras, o espaçamento e
os tokens de gráfico. Ainda dependem de decisão de produto/design e não estão
implementados:

- **Escala de marca** (`brand50`…`brand900`): a paleta continua sendo `blue*` e
  `slate*`. Depende do hex da marca.
- **Tipografia:** `--ads-typography-font-family` é
  `Aptos, "Segoe UI Variable", "Segoe UI", sans-serif`, que só existe em
  sistemas Microsoft (nos demais cai em `sans-serif`). Não há tokens de fonte
  para títulos nem monoespaçada. Para uma aparência igual em todas as
  plataformas, a aplicação pode sobrescrever o token depois de importar
  `@admin-ds/tokens/styles.css`, por exemplo com `next/font`.

## Superfícies do tema escuro

Cada papel tem um valor próprio, do mais escuro ao mais claro:

| Papel                        | Valor     | Uso                                               |
| ---------------------------- | --------- | ------------------------------------------------- |
| `--ads-color-background`     | `#0f172a` | fundo da página                                   |
| `--ads-color-surface-muted`  | `#162033` | áreas esmaecidas (badge neutro, progresso)        |
| `--ads-color-surface`        | `#1e293b` | cards, tabelas, painéis                           |
| `--ads-color-surface-raised` | `#334155` | superfícies elevadas (diálogo, popover)           |
| `--ads-color-surface-hover`  | `#3d4b60` | item em hover, inclusive sobre superfície elevada |

`text` e `text-muted` têm ao menos 4,5:1 sobre todas elas e `border-control`
ao menos 3:1, com e sem `prefers-contrast: more` (pares em
`packages/tokens/tests/contrast-pairs.mjs`). No tema claro nada mudou.

## Espaçamento

`--ads-spacing-1`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12` e `16`
(`0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.25rem`, `1.5rem`, `2rem`,
`2.5rem`, `3rem` e `4rem`). Os valores anteriores não mudaram.

## Cores de gráfico

`--ads-color-chart-1` a `--ads-color-chart-8` são cores categóricas, com valores
próprios em cada tema. Use-as na ordem, uma por série. A ordem é só uma
sequência de uso: a mesma posição não tem o mesmo matiz nos dois temas.

```css
.meu-grafico-serie-1 {
	stroke: var(--ads-color-chart-1);
}
```

**Gráficos não podem depender só de cor.** Acompanhe cada série com rótulo
direto ou legenda com texto e, quando houver mais de uma série, com padrão,
forma do marcador ou estilo de linha diferente. Isso atende o WCAG 1.4.1 e
vale mesmo com as cores distinguíveis abaixo.

### Verificação

- **Contraste (WCAG 1.4.11):** cada cor tem ao menos 3:1 contra `surface` e
  `surface-raised` do respectivo tema (hoje, ao menos 4,7:1 no claro e 4,9:1 no
  escuro sobre `surface`). Os pares ficam em `contrast-pairs.mjs`.
- **Daltonismo:** `packages/tokens/tests/chart-colors.test.mjs` simula
  protanopia, deuteranopia e tritanopia com as matrizes de Machado et al. (2009),
  severidade 1,0, em RGB linear, e mede a distância ΔE (CIE76) em CIELAB. O teste
  exige ΔE mínimo de 10 entre quaisquer duas cores, em visão normal e nas três
  simulações. Valores atuais do menor ΔE: claro, 21,2 (normal), 15,1
  (protanopia), 14,2 (deuteranopia) e 12,8 (tritanopia); escuro, 19,2, 18,5, 17,3
  e 16,1. A simulação é uma aproximação, não substitui a regra de não depender
  só de cor.

Paletas sequencial e divergente e um componente de gráfico estão fora do
escopo desta etapa.

## Personalização

Sobrescreva os tokens depois de importar `@admin-ds/tokens/styles.css`, com
`[data-theme='light']` e `[data-theme='dark']`, como descrito em
`packages/tokens/README.md`. Se trocar as cores de gráfico, valide o contraste e
a distinção sob simulação com os mesmos testes.
