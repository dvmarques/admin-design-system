# @dvmarques/admin-ds-tokens

Tokens CSS semânticos e temas claro/escuro do **Admin Design System**. Use este pacote sozinho para aplicar as variáveis visuais ou como base para `components`, `admin` e `highlighted-code`.

> **Pré-publicação:** artefato preparado e validado como tarball na [#194](https://github.com/dvmarques/admin-design-system/issues/194), **ainda indisponível no npm**. Os comandos de instalação se aplicam depois da [primeira publicação #195](https://github.com/dvmarques/admin-design-system/issues/195). A versão exibida no manifest do repositório é de desenvolvimento, não promessa da versão inicial no registro.

## Instalar (após a publicação)

```bash
npm install @dvmarques/admin-ds-tokens
```

## Usar

Importe a folha de estilos uma vez no entrypoint global de sua aplicação (por exemplo, `app/layout.tsx` no Next.js):

```tsx
import '@dvmarques/admin-ds-tokens/styles.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="pt-BR" data-theme="light">
			<body>{children}</body>
		</html>
	);
}
```

O arquivo `styles.css` carrega o CSS compilado; não configure Tailwind nem importe `src/` no consumidor.

## Temas, personalização e fontes

- `data-theme="light"` e `data-theme="dark"` no elemento raiz forçam um tema; sem atributo, a folha de estilos usa `prefers-color-scheme`.
- A preferência e sua persistência pertencem à aplicação, inclusive o fallback antes da hidratação para a escolha Sistema.
- Sobrescreva variáveis depois do CSS distribuído, em seletores que também alcancem overlays portados:

```css
[data-theme='light'] {
	--ads-color-primary: #2563eb;
}

[data-theme='dark'] {
	--ads-color-primary: #0ea5e9;
}
```

- Tokens de elevação (`--ads-elevation-*`), densidade (`--ads-density-*`), skeleton e tipografia mantêm variantes semânticas. O pacote não inclui arquivos da fonte Inter: carregue-a com `next/font` ou outro recurso da aplicação, respeitando a licença da fonte.

Este pacote não depende de `components`, `admin`, Shiki ou `react-imask`. Suas exportações de TypeScript e CSS estão definidas em `package.json#exports`. Consulte os nomes e metadados em [identidade visual](https://github.com/dvmarques/admin-design-system/blob/develop/docs/visual-identity.md) e [elevação e densidade](https://github.com/dvmarques/admin-design-system/blob/develop/docs/visual-polish.md).

**Referências:** [guia de integração](https://github.com/dvmarques/admin-design-system/blob/develop/docs/integration.md) · [limitações](https://github.com/dvmarques/admin-design-system/blob/develop/docs/limitations.md) · [Storybook](https://dvmarques.github.io/admin-design-system/storybook/) · [release](https://github.com/dvmarques/admin-design-system/blob/develop/docs/release-process.md) · [licença](https://github.com/dvmarques/admin-design-system/blob/develop/LICENSE.md).

Licença do projeto: MIT, copyright Daniel Marques. Fontes e outros materiais de terceiros conservam as próprias licenças e atribuições.
