# HighlightedCodeSnippet (pacote opcional)

O pacote `@admin-ds/highlighted-code` publica `AdsHighlightedCodeSnippet` com syntax highlighting via [Shiki](https://shiki.style), **sem** reexport pelo entrypoint de `@admin-ds/components`. Motor, gramáticas e temas são carregados sob demanda; o código plain aparece imediatamente.

## Instalação

No monorepo o workspace já está registrado. Em um consumidor externo (quando publicado):

```bash
npm install @admin-ds/highlighted-code shiki
```

Importe estilos e tokens:

```ts
import '@admin-ds/tokens/styles.css';
import '@admin-ds/highlighted-code/styles.css';
```

## Uso

```tsx
'use client';
import { AdsHighlightedCodeSnippet } from '@admin-ds/highlighted-code';

export function Exemplo() {
	return (
		<AdsHighlightedCodeSnippet
			code={'SELECT 1;'}
			language="sql"
			theme="auto"
			showLineNumbers
			wrapLines={false}
		/>
	);
}
```

## Props

| Prop              | Tipo                          | Padrão   | Descrição                                                 |
| ----------------- | ----------------------------- | -------- | --------------------------------------------------------- |
| `code`            | `string`                      | —        | Código fonte exibido e copiado                            |
| `language`        | `string`                      | —        | Linguagem Shiki ou alias (`ts`, `js`, `yml`, `sh`)        |
| `showLineNumbers` | `boolean`                     | `false`  | Numeração de linhas                                       |
| `wrapLines`       | `boolean`                     | `false`  | `pre-wrap` em vez de rolagem horizontal                   |
| `theme`           | `'light' \| 'dark' \| 'auto'` | `'auto'` | Tema do highlighting; `auto` segue `data-theme` / sistema |
| `className`       | `string`                      | —        | Classe adicional no container                             |
| `codeLabel`       | `string`                      | —        | Nome acessível da região de código                        |

## Linguagens iniciais

TypeScript, TSX, JavaScript, JSX, Java, SQL, JSON, HTML, CSS, XML, YAML e Bash.

Registre outras com `registerHighlightedLanguageLoader(id, () => import('...'))`.

## Fallback

Linguagem desconhecida ou falha ao carregar motor/gramática/tema mantém o texto **plain**; o cabeçalho e a cópia continuam funcionando.

## Segurança

O conteúdo é renderizado como texto em React a partir dos tokens do Shiki; não use HTML arbitrário na prop `code`.

## Demonstração

No Admin Demo: **Código destacado** em exemplos de aplicação (`/exemplos/codigo-destacado`) e snippets do catálogo com `language="tsx"`.

## Bundle

Importar `@admin-ds/components` **não** inclui Shiki. O cenário `highlighted-code-public` em `npm run inspect:packages` mede o consumo explícito do pacote opcional.
