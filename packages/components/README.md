# @dvmarques/admin-ds-components

Componentes reutilizáveis do Admin Design System para React e Next.js. **Ainda não publicado no npm**: estes comandos devem ser usados somente após a primeira release da #195.

```bash
npm install @dvmarques/admin-ds-tokens @dvmarques/admin-ds-components
```

Importe CSS global compilado, sem instalar Tailwind CSS no consumidor:

```ts
import '@dvmarques/admin-ds-tokens/styles.css';
import '@dvmarques/admin-ds-components/styles.css';
import { AdsButton } from '@dvmarques/admin-ds-components';
```

O subpath `@dvmarques/admin-ds-components/masked-input` exige o peer opcional `react-imask`; não é importado pela entrada principal. Componentes interativos usam limites Client Component em Next.js App Router. Ver [guia de integração](https://github.com/dvmarques/admin-design-system/blob/develop/docs/integration.md).

Licença: MIT (Daniel Marques), com atribuições de terceiros em `dist/THIRD_PARTY_NOTICES.md`.
