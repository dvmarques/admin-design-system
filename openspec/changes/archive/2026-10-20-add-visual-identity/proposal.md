## Why

Os tokens têm uma base técnica sólida (elevação por tema, densidade, movimento reduzido, cores forçadas e contraste WCAG 2.2 AA testado), mas a identidade visual própria ainda não existe: a paleta é a do Tailwind (`blue*`, `slate*`) sem escala de marca, a fonte padrão só existe no Windows, a escala de espaçamento tem lacunas, o tema escuro usa o mesmo valor (`slate700`) para `surfaceRaised`, `surfaceMuted` e `surfaceHover` (um item em hover sobre uma superfície elevada fica indistinguível dela) e não há tokens para gráficos, de que os próximos dashboards dependem (issue #118, relacionada à #89).

## What Changes

- **Superfícies do tema escuro:** `surfaceMuted`, `surfaceRaised` e `surfaceHover` passam a ter valores distintos entre si e de `background` e `surface`; pares de contraste adicionados.
- **Escala de espaçamento:** novos `spacing.5`, `10`, `12` e `16`; valores existentes inalterados.
- **Tokens de gráfico:** oito papéis de cor categórica `chart1`…`chart8` nos dois temas (`--ads-color-chart1`…`--ads-color-chart8`), com contraste mínimo de 3:1 contra a superfície, verificação automatizada para deuteranopia, protanopia e tritanopia e regra documentada de que gráficos não dependem só de cor.
- **Escala de marca:** `brand50`…`brand900` na referência, com os papéis semânticos (`primary`, `primaryHover`, `focus`, `focusRing`, `formBorderFocus`, `surfaceSelected`, `onSurfaceSelected` e `semanticContrast`) repontados sem mudar a aparência (sem hex de marca, mantém-se a família azul).
- **Tipografia:** pilha do corpo com Inter e fallbacks de sistema, novos `fontFamilyHeading` e `fontFamilyMono`, aplicação em `AdsTypography` (títulos) e no tema do Tailwind interno; a biblioteca não distribui a fonte e o carregamento no consumidor é documentado (`next/font`). A fonte padrão muda de Aptos/Segoe UI para Inter com fallbacks.
- **Documentação:** correção dos valores de elevação em `docs/visual-polish.md`, novo `docs/visual-identity.md` linkado no `README.md` e história de fundamentos no Storybook com paleta, tipografia, espaçamento, superfícies e cores de gráfico nos dois temas.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `design-tokens`: superfícies distintas no tema escuro, escala de espaçamento ampliada, tokens de cor para gráficos, escala de marca e tokens de família tipográfica.

## Impact

- **Pacotes e APIs públicas:** `@admin-ds/tokens` (novas variáveis `--ads-spacing-5|10|12|16` e `--ads-color-chart1…8`, novas chaves nos metadados tipados; valores de `--ads-color-surface-muted` e `--ads-color-surface-hover` mudam no tema escuro; nenhum nome removido ou renomeado). `@admin-ds/components` (`AdsTypography` passa a aplicar `font-heading` nos títulos e o tema Tailwind interno expõe `--font-heading` e `--font-mono`; sem mudança de props) e `@admin-ds/admin` não mudam de API. Novas variáveis `--ads-typography-font-family-heading` e `-mono`; `--ads-typography-font-family` muda de valor.
- **Biblioteca x demonstração:** o trabalho está na biblioteca de tokens e na documentação (`apps/docs`); a aplicação de demonstração só valida o consumo e não ganha regras de negócio.
- **Visual:** superfícies em hover e esmaecidas ficam diferentes no tema escuro e a fonte padrão muda para Inter com fallbacks (diff de baselines visuais a ser revisado, nunca aceito automaticamente).
- **Dependências:** nenhuma nova; sem novos assets. O CSS cresce em poucas linhas, dentro da margem do baseline de tamanho.
- **Valor para consumidores:** hover legível sobre superfícies elevadas no tema escuro, paleta categórica acessível para gráficos e espaçamentos maiores, sem exigir Tailwind nas aplicações.

### Fora do escopo

- Componente de gráfico e paletas sequencial e divergente.
- Indicador de variação e sparkline (#89).
- Distribuir arquivos de fonte na biblioteca e uma fonte distinta para títulos.
- Renomear ou remover tokens existentes (inclusive as referências `blue*`).
