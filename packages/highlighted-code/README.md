# @dvmarques/admin-ds-highlighted-code

**Pacote opcional e independente** de destaque de código do Admin Design System. Expõe `AdsHighlightedCodeSnippet`, com Shiki carregado sob demanda. Não é reexportado por `@dvmarques/admin-ds-components`, evitando levar Shiki para o bundle principal de interfaces.

> **Pré-publicação:** tarball validado na [#194](https://github.com/dvmarques/admin-design-system/issues/194), **ainda não publicado no npm**. Os comandos de instalação só se aplicam depois da [#195](https://github.com/dvmarques/admin-design-system/issues/195), com a versão final confirmada.

## Instalar (após a publicação)

```bash
npm install @dvmarques/admin-ds-tokens @dvmarques/admin-ds-highlighted-code
```

Peers obrigatórios: React e React DOM `>=18.2.0`. O motor Shiki é dependência **deste pacote opcional**; não é necessário instalá-lo separadamente na instalação normal nem instalar `components` ou `admin` para usar o realce.

## Usar em Next.js

Importe CSS uma vez no layout global, depois de tokens:

```ts
import '@dvmarques/admin-ds-tokens/styles.css';
import '@dvmarques/admin-ds-highlighted-code/styles.css';
```

Em um arquivo Client Component:

```tsx
'use client';

import { AdsHighlightedCodeSnippet } from '@dvmarques/admin-ds-highlighted-code';

export function SqlSnippet() {
	return <AdsHighlightedCodeSnippet code={'SELECT 1;'} language="sql" theme="auto" />;
}
```

`theme="auto"` acompanha o tema do escopo. O destaque tem carregamento assíncrono; a aplicação deve considerar estados de carregamento, acessibilidade e tamanho de código. O pacote possui limites de 1.000 linhas/100.000 caracteres; consulte [guia específico](https://github.com/dvmarques/admin-design-system/blob/develop/docs/highlighted-code-snippet.md).

**Referências:** [integração](https://github.com/dvmarques/admin-design-system/blob/develop/docs/integration.md) · [Storybook](https://dvmarques.github.io/admin-design-system/storybook/) · [migração](https://github.com/dvmarques/admin-design-system/blob/develop/docs/migration-guide.md) · [limitações](https://github.com/dvmarques/admin-design-system/blob/develop/docs/limitations.md) · [release](https://github.com/dvmarques/admin-design-system/blob/develop/docs/release-process.md) · [MIT](https://github.com/dvmarques/admin-design-system/blob/develop/LICENSE.md) · [atribuições de terceiros](https://github.com/dvmarques/admin-design-system/blob/develop/docs/licensing.md).

Licença do código próprio: MIT, copyright Daniel Marques. Shiki e seus componentes preservam as próprias licenças.
