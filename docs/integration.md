# Integração do design system

## Instalação e estilos

Uma aplicação consumidora importa as APIs e folhas de estilo públicas:

```ts
import { ThemeToggle } from '@admin-ds/components'
import { tokenValues } from '@admin-ds/tokens'
import '@admin-ds/tokens/styles.css'
import '@admin-ds/components/styles.css'
```

O CSS distribuído já contém as classes necessárias. A aplicação consumidora
não precisa instalar ou configurar Tailwind CSS para usar os componentes.

## Temas

Defina o tema no elemento raiz da aplicação:

```html
<html data-theme="dark"></html>
```

Os valores aceitos são `light` e `dark`. Sem o atributo, os tokens usam a
preferência `prefers-color-scheme` do sistema. A aplicação é responsável por
persistir a preferência e aplicá-la antes da hidratação quando necessário.

## Next.js App Router

Importe os estilos globais em `app/layout.tsx` e mantenha componentes
interativos, como `ThemeToggle`, em um limite de Client Component. Tokens e
componentes puramente apresentacionais podem ser usados por Server Components.
