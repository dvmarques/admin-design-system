# Acessibilidade visual dos estilos

Os estilos respeitam três preferências do sistema operacional: movimento
reduzido, cores forçadas e maior contraste. Nenhuma exige configuração na
aplicação consumidora nem do Tailwind: tudo vem de `@admin-ds/tokens/styles.css`
e do CSS compilado dos pacotes.

## Movimento reduzido

Com `prefers-reduced-motion: reduce`, `--ads-motion-fast` e `--ads-motion-normal`
passam a `0ms` em todos os temas, e toda transição dos componentes herda esses
tokens: as classes usam `duration-[var(--ads-motion-*)]` e, quando não declaram
duração, herdam `--default-transition-duration`, que aponta para
`--ads-motion-fast`. Animações contínuas (`AdsLoadingIndicator`, `AdsLoadingText`, `AdsSkeleton`,
progresso indeterminado e a faixa de carregamento do filtro) e deslocamentos de
hover são desativados com `motion-reduce:` ou `@media (prefers-reduced-motion)`;
o estado continua exposto por `role="status"` e texto.

Ao personalizar a duração, não a sobrescreva de forma incondicional depois do
`tokens.css`: ela venceria o bloco de movimento reduzido. Use, por exemplo:

```css
@media (prefers-reduced-motion: no-preference) {
	:root {
		--ads-motion-normal: 320ms;
	}
}
```

Um teste em `packages/components/tests/visual-accessibility.test.ts` falha se um
componente usar `duration-<número>` literal ou `animate-*` sem
`motion-reduce:animate-none`.

## Cores forçadas

Com `forced-colors: active`, o navegador substitui cores e remove sombras.
Bordas, `outline` e o foco continuam visíveis porque o navegador os força para
cores de sistema. Os estados que dependiam de fundo ou `box-shadow` têm regras
próprias, com `Highlight`, `HighlightText` e `CanvasText`:

- indicadores marcados de `AdsCheckbox`, `AdsRadio` e `AdsSwitch`;
- item atual de navegação, aba ativa e dia selecionado do `AdsDatePicker`
  (contorno `Highlight`; o foco usa `CanvasText` para se distinguir);
- linha selecionada da `AdsSmartTable` e faixa de carregamento do `AdsFilterBar`.

## Maior contraste

Com `prefers-contrast: more`, `tokens.css` sobrescreve, em cada tema, as bordas
(`border`, `border-strong`, `border-control`), o texto secundário e o foco
(`focus`, `focus-ring`, `form-border-focus`). As sobrescritas ficam em
`color.semanticContrast` de `packages/tokens/source/tokens.mjs`. Sobrescritas da
aplicação continuam valendo se forem declaradas depois do `tokens.css` e, para
os valores de maior contraste, também dentro de `@media (prefers-contrast: more)`.

## Contraste dos tokens

`packages/tokens/tests/contrast-pairs.mjs` lista os pares de papéis de cor
verificados contra o WCAG 2.2 AA nos temas claro e escuro, com e sem
`prefers-contrast: more`: 4,5:1 para texto e 3:1 para limites de controles
(`border-control`), foco e indicadores. Ao criar um papel de cor de conteúdo ou
controle, adicione o par à lista; o teste informa par, tema e razão quando algum
fica abaixo do mínimo. `border-control` existe separado de `border`: `border` é
decorativo (divisores e cartões) e `border-control` delimita campos e
indicadores de seleção.

## Validação no navegador

`e2e/accessibility-preferences.spec.ts` (Chromium) emula `reducedMotion`,
`forcedColors` e `contrast` e verifica, por estilo computado e papéis ARIA,
transições zeradas, ausência de animações contínuas, foco e indicador marcado
com cores de sistema e os tokens de maior contraste nos dois temas, com `axe`.
Não há snapshots dessas preferências.
