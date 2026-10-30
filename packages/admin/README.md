# @dvmarques/admin-ds-admin

Composições administrativas para aplicações React/Next.js, usando `@dvmarques/admin-ds-components` como peer dependency. **Ainda não publicado no npm**: a primeira publicação pertence à #195.

```bash
npm install @dvmarques/admin-ds-tokens @dvmarques/admin-ds-components @dvmarques/admin-ds-admin
```

Carregue o CSS público em ordem:

```ts
import '@dvmarques/admin-ds-tokens/styles.css';
import '@dvmarques/admin-ds-components/styles.css';
import '@dvmarques/admin-ds-admin/styles.css';
import { AdsAdminShell } from '@dvmarques/admin-ds-admin';
```

A aplicação é responsável por navegação, autenticação e persistência de tema. Nenhum código-fonte interno ou Tailwind do monorepo é necessário ao consumidor. Licença: MIT, copyright Daniel Marques.
