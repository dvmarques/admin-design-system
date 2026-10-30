# @dvmarques/admin-ds-highlighted-code

Pacote **opcional e independente** com `AdsHighlightedCodeSnippet` e Shiki sob demanda. Não é reexportado por `@dvmarques/admin-ds-components`, preservando o bundle principal sem Shiki. **Ainda não publicado no npm**: a primeira publicação pertence à #195.

```bash
npm install @dvmarques/admin-ds-tokens @dvmarques/admin-ds-highlighted-code
```

```tsx
'use client';
import { AdsHighlightedCodeSnippet } from '@dvmarques/admin-ds-highlighted-code';
import '@dvmarques/admin-ds-tokens/styles.css';
import '@dvmarques/admin-ds-highlighted-code/styles.css';

export function Example() {
  return <AdsHighlightedCodeSnippet code={'SELECT 1;'} language="sql" theme="auto" />;
}
```

Consulte [contrato e API](https://github.com/dvmarques/admin-design-system/blob/develop/docs/highlighted-code-snippet.md). Licença do projeto: MIT, Daniel Marques. As dependências Shiki mantêm suas próprias licenças.
