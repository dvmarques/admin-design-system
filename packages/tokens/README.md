# @admin-ds/tokens

Os design tokens possuem uma única fonte em `source/tokens.mjs`. A partir
dela, `npm run generate` produz:

- `dist/tokens.css`, com variáveis CSS públicas;
- `dist/tokens.meta.json`, com os metadados de referência;
- `src/generated.ts`, com valores e tipos TypeScript.

## Temas

Use `data-theme="light"` ou `data-theme="dark"` no elemento raiz da
aplicação. Sem um atributo explícito, o CSS respeita
`prefers-color-scheme`.

Overlays portados preservam o tema explícito do escopo que os abriu. Os tokens
`--ads-color-overlay-close-background`, `--ads-color-overlay-close-content` e
`--ads-color-overlay-close-background-hover` personalizam o controle de fechar
de dialogs, drawers e toasts nos dois temas.

Para sobrescrever tokens, declare as variáveis **depois** de importar
`@admin-ds/tokens/styles.css`, com `[data-theme='light']` e
`[data-theme='dark']` (sem `:root`). Overlays em portal (dialog, drawer e
toast) são renderizados em um `div` com `data-theme` próprio, fora do `<html>`;
`:root[data-theme=…]` não os alcança.

```css
[data-theme='dark'] {
	--ads-color-primary: #0ea5e9;
}
```

A aplicação consumidora é responsável por persistir a preferência do
usuário e aplicar o atributo antes da hidratação, quando necessário.

## Elevação, densidade e skeleton

`--ads-elevation-*` tem valores distintos nos temas claro e escuro. A densidade
de tabela usa `--ads-density-cell-padding-x|y`, com o valor compacto aplicado por
`data-density="compact"` no elemento ou em um ancestral, e a altura dos
placeholders usa `--ads-skeleton-height-text|value|block`. Detalhes em
[Elevação, densidade e estados](../../docs/visual-polish.md).

## Tipografia

O token `--ads-typography-font-family` usa a pilha
`Aptos, "Segoe UI Variable", "Segoe UI", sans-serif`. O pacote não distribui
arquivos de fonte: Aptos e Segoe UI só existem em sistemas Microsoft, e nos
demais o texto cai em `sans-serif`. A escolha de uma fonte única e sua
distribuição estão pendentes na issue de identidade visual (#118); consumidores
podem sobrescrever o token com a fonte da aplicação. Se uma fonte for
empacotada, preserve os avisos de licença dela.

## Identidade visual

Superfícies do tema escuro, escala de espaçamento e cores de gráfico estão em
[Identidade visual](../../docs/visual-identity.md).

## Compatibilidade

Nomes de tokens públicos são contratos semânticos. Remoções ou renomeações
exigem orientação de migração e versionamento compatível com uma alteração
de API pública.
