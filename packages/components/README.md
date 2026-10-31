# @dvmarques/admin-ds-components

Componentes React reutilizáveis do **Admin Design System**: botões, campos e seleção, navegação, tabelas, overlays, feedback, calendário e visualização compacta. Para fluxos e shell administrativos, combine com `@dvmarques/admin-ds-admin`. A [referência de API no Storybook](https://dvmarques.github.io/admin-design-system/storybook/) descreve os exports disponíveis, variantes e estados.

> **Pré-publicação:** validado como tarball externo na [#194](https://github.com/dvmarques/admin-design-system/issues/194), **ainda não publicado no npm**. Os comandos a seguir valem depois da [#195](https://github.com/dvmarques/admin-design-system/issues/195); a primeira versão publicada será confirmada naquele fluxo.

## Instalar (após a publicação)

```bash
npm install @dvmarques/admin-ds-tokens @dvmarques/admin-ds-components
```

Peers obrigatórios: `react >=18.2.0` e `react-dom >=18.2.0`. Instale os pacotes com versões mutuamente compatíveis. O CSS já está compilado, dispensando Tailwind no consumidor.

## Usar em Next.js App Router

Importe globalmente em `app/layout.tsx`, nesta ordem:

```ts
import '@dvmarques/admin-ds-tokens/styles.css';
import '@dvmarques/admin-ds-components/styles.css';
```

Mantenha eventos e estado em uma fronteira Client Component:

```tsx
'use client';

import { useState } from 'react';
import { AdsButton } from '@dvmarques/admin-ds-components';

export function Example() {
	const [count, setCount] = useState(0);
	return <AdsButton onClick={() => setCount((n) => n + 1)}>Total: {count}</AdsButton>;
}
```

Componentes de apresentação sem interatividade podem ser usados em Server Components quando seus contratos permitirem; não transporte callbacks por fronteiras Server/Client.

## Recursos opcionais

`AdsMaskedInput` **não** pertence ao entrypoint raiz. Apenas se precisar de máscaras:

```bash
npm install react-imask
```

```tsx
'use client';

import { AdsMaskedInput } from '@dvmarques/admin-ds-components/masked-input';
```

O peer opcional `react-imask` usa a faixa `^7.6.1`. Máscara não implica validação de CPF/CNPJ ou de negócio; consulte o guia. Realce de código e Shiki pertencem exclusivamente ao **pacote opcional independente** [`@dvmarques/admin-ds-highlighted-code`](https://github.com/dvmarques/admin-design-system/blob/develop/packages/highlighted-code/README.md), não são reexportados aqui.

## Integração e limites

Os tokens e a fonte ficam sob controle da aplicação. `AdsThemeControl` disponibiliza Claro/Escuro/Sistema sem persistir automaticamente; veja [tema e hidratação](https://github.com/dvmarques/admin-design-system/blob/develop/docs/integration.md). Alguns overlays usam portal, foco e `inert`; testes automatizados não substituem testes manuais com leitores de tela/dispositivos reais.

**Referências:** [integração](https://github.com/dvmarques/admin-design-system/blob/develop/docs/integration.md) · [API Storybook](https://dvmarques.github.io/admin-design-system/storybook/) · [migração](https://github.com/dvmarques/admin-design-system/blob/develop/docs/migration-guide.md) · [limitações](https://github.com/dvmarques/admin-design-system/blob/develop/docs/limitations.md) · [histórico](https://github.com/dvmarques/admin-design-system/blob/develop/docs/component-changelog.md) · [release](https://github.com/dvmarques/admin-design-system/blob/develop/docs/release-process.md) · [MIT](https://github.com/dvmarques/admin-design-system/blob/develop/LICENSE.md) e [avisos de terceiros](https://github.com/dvmarques/admin-design-system/blob/develop/docs/licensing.md).

Licença do projeto: MIT, copyright Daniel Marques.
