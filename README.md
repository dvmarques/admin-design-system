# Admin Design System

Biblioteca de componentes e composições administrativas para **React e Next.js App Router**, com TypeScript, design tokens CSS, componentes de interface e um shell para dashboards, formulários e listagens.

- **UI reutilizável:** formulários, tabelas, overlays, navegação, feedback e estados de interface.
- **Composições administrativas:** shell, cards e painéis de dashboard, filtros, tabelas e fluxos.
- **Personalização:** variáveis `--ads-*`, temas claro/escuro e escolha Sistema.
- **Integração gradual:** instale somente os pacotes necessários; CSS compilado, sem configurar Tailwind no consumidor.
- **Documentação executável:** exemplos na Demo e referência de API no Storybook.

[**Explorar a Demo**](https://dvmarques.github.io/admin-design-system/) · [**Consultar API no Storybook**](https://dvmarques.github.io/admin-design-system/storybook/)

A **Demo** mostra uma aplicação Next.js com dados fictícios; o **Storybook** contém componentes, variantes, estados e referência técnica. A biblioteca não fornece backend, autenticação ou regras de negócio.

> **Disponibilidade (antes da primeira publicação):** os quatro pacotes foram preparados e validados como tarballs na [#194](https://github.com/dvmarques/admin-design-system/issues/194), mas **ainda não estão publicados no npm**. Os comandos `npm install` abaixo são instruções para uso **após** a publicação, que será verificada na [#195](https://github.com/dvmarques/admin-design-system/issues/195). Não representam uma instalação realizada pelo registro. Para teste pré-publicação, consulte o [contrato de distribuição](docs/integration.md#antes-da-primeira-publicação-npm).

## Comece pelos componentes

Após a primeira publicação npm, em uma aplicação React/Next.js com versões compatíveis:

```bash
npm install @dvmarques/admin-ds-tokens @dvmarques/admin-ds-components
```

Importe o CSS público **uma vez**, nesta ordem, no layout raiz (`app/layout.tsx`):

```tsx
import '@dvmarques/admin-ds-tokens/styles.css';
import '@dvmarques/admin-ds-components/styles.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="pt-BR" data-theme="light">
			<body>{children}</body>
		</html>
	);
}
```

Exemplo interativo em `app/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { AdsButton } from '@dvmarques/admin-ds-components';

export default function Page() {
	const [clicks, setClicks] = useState(0);
	return (
		<main>
			<AdsButton onClick={() => setClicks((n) => n + 1)}>
				Cliques: {clicks}
			</AdsButton>
		</main>
	);
}
```

O exemplo usa tema claro fixo para ser mínimo; veja [preferência Sistema, persistência e fonte Inter](docs/integration.md#tema-fonte-e-hidratação) para uma aplicação completa. A UI não requer Tailwind CSS no consumidor. APIs interativas precisam de uma fronteira `'use client'` no App Router; não transforme a aplicação inteira em Client Component sem necessidade.

## Escolha os pacotes

| Pacote                                                                        | O que oferece                                          | Instale quando                                         | Relação                                                      |
| ----------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------ |
| [`@dvmarques/admin-ds-tokens`](packages/tokens/README.md)                     | Tokens e estilos de tema                               | Precisar de temas/variáveis CSS, mesmo sem componentes | Base visual independente                                     |
| [`@dvmarques/admin-ds-components`](packages/components/README.md)             | Botões, campos, tabela, overlays, navegação e feedback | Criar interfaces com componentes básicos               | Use com `tokens` e peers React/React DOM; máscara é opcional |
| [`@dvmarques/admin-ds-admin`](packages/admin/README.md)                       | Shell, dashboard, filtros, tabela inteligente e fluxos | Construir composições administrativas                  | Use com `tokens` e `components`                              |
| [`@dvmarques/admin-ds-highlighted-code`](packages/highlighted-code/README.md) | `AdsHighlightedCodeSnippet` com Shiki                  | Exibir código destacado                                | **Opcional e isolado**; não vem no `components`              |

Não é necessário instalar os quatro. O `react-imask` só é necessário para o subpath opcional `components/masked-input`; Shiki acompanha exclusivamente o pacote `highlighted-code`. Os manifests declaram React/React DOM `>=18.2.0` e peers próprios; a Demo usa React 19 e Next.js 16, mas isso não constitui certificação de todas as versões de Next.js.

## Temas e personalização

O CSS de `tokens` define variáveis `--ads-*`. O elemento raiz pode usar `data-theme="light"` ou `data-theme="dark"`; sem atributo explícito, o CSS acompanha `prefers-color-scheme`. A aplicação decide como salvar a preferência e evitar troca visual na hidratação. `AdsThemeControl` apresenta **Claro, Escuro e Sistema**, mas não implementa persistência sozinho. Consulte [integração](docs/integration.md#tema-fonte-e-hidratação) e [identidade visual](docs/visual-identity.md).

Para overlays renderizados em portal, sobrescreva tokens usando seletores `[data-theme='light']` e `[data-theme='dark']`, não somente `:root[data-theme]`. Fontes (como Inter) são responsabilidade da aplicação.

## Caminho de adoção e documentação

1. [Instalação externa e CSS em App Router](docs/integration.md), incluindo limite Server/Client, tema, fonte, tipos e recursos opcionais.
2. [Storybook / referência técnica de API](https://dvmarques.github.io/admin-design-system/storybook/) e [catálogo demonstrável da aplicação](docs/admin-demo-catalog.md).
3. [Guia de migração](docs/migration-guide.md) dos nomes `@admin-ds/*` e de `ThemeToggle`.
4. [Limitações e testes](docs/limitations.md), [histórico por componente](docs/component-changelog.md) e [CHANGELOG](CHANGELOG.md).
5. [Licença MIT](LICENSE.md) e [atribuições de terceiros](docs/licensing.md).

Para colaborar ou desenvolver no monorepo: [CONTRIBUTING.md](CONTRIBUTING.md), [arquitetura](docs/architecture.md), [AGENTS.md](AGENTS.md) e [OpenSpec](docs/openspec-commands.md). O fluxo interno de versões e publicação npm/GitHub é descrito em [processo de release](docs/release-process.md); **publicação npm e deploy da Demo/Storybook via GitHub Pages são processos distintos**.

O projeto próprio usa a [licença MIT](LICENSE.md), copyright Daniel Marques; componentes e dependências de terceiros preservam seus avisos e licenças próprios.
