# Identidade visual

Superfícies, espaçamento e cores de gráfico dos tokens. Tudo vem de
`@admin-ds/tokens/styles.css`; nenhuma configuração de Tailwind é necessária.
Os valores estão em `packages/tokens/source/tokens.mjs` e a story
**Foundation/Visual identity** (`apps/docs`) mostra tudo nos dois temas.

## Escala de marca

`color.reference.brand50` a `brand900` (`#eff6ff` a `#1e3a8a`) formam a escala de
marca. Sem uma cor de marca definida, ela segue a família azul que já era usada,
então a aparência **não mudou**: `primary`, `primary-hover`, `focus`,
`focus-ring`, `form-border-focus`, `surface-selected` e as sobrescritas de
`prefers-contrast: more` apontam para a escala (por exemplo `primary` é
`brand600` no claro e `brand400` no escuro). As referências `blue*` foram
removidas porque nada mais as usava; elas não eram variáveis CSS públicas.

Para usar outra cor de marca, troque os valores `brand*` em
`packages/tokens/source/tokens.mjs` e confirme os pares de contraste
(`npm run test:node --workspace @admin-ds/tokens`), ou sobrescreva as variáveis
semânticas (`--ads-color-primary` etc.) na aplicação. A escala de referência não é
emitida como variável CSS.

## Tipografia

| Token                                  | Uso                                               |
| -------------------------------------- | ------------------------------------------------- |
| `--ads-typography-font-family`         | corpo (compatível com o anterior)                 |
| `--ads-typography-font-family-heading` | títulos (`AdsTypography` `heading1` a `heading4`) |
| `--ads-typography-font-family-mono`    | código e valores técnicos                         |

A pilha do corpo e dos títulos é `Inter, "Segoe UI Variable", "Segoe UI",
system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif`; a
monoespaçada é `ui-monospace, "SF Mono", "Cascadia Code", Consolas,
"Liberation Mono", Menlo, monospace`. Por enquanto os títulos usam a mesma pilha
do corpo; mudar `fontFamilyHeading` não exige alterar componentes. Use a
monoespaçada em estilos próprios, por exemplo com `font-family:
var(--ads-typography-font-family-mono)`.

**A biblioteca não distribui arquivos de fonte.** Para que a Inter renderize igual
em Windows, Mac, Linux e Android, a aplicação deve carregá-la. Sem isso, cai no
primeiro item disponível da pilha (por exemplo Segoe UI no Windows ou a fonte do
sistema no Mac), sem quebrar o layout. Em Next.js, `next/font` baixa e
hospeda a Inter no próprio build, sem requisição a CDN externa em tempo de
execução:

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" className={inter.className}>
			<body>{children}</body>
		</html>
	);
}
```

Como a pilha começa por `Inter`, `next/font` com `variable` e um
`@font-face` próprio também funcionam: defina uma família chamada `Inter`. A
Inter tem licença SIL Open Font License 1.1; preserve o aviso ao hospedá-la.

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
