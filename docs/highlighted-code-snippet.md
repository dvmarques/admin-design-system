# HighlightedCodeSnippet (pacote opcional)

O pacote `@admin-ds/highlighted-code` publica `AdsHighlightedCodeSnippet` com syntax highlighting via [Shiki](https://shiki.style), **sem** reexport pelo entrypoint de `@admin-ds/components`. Motor, gramáticas e temas são carregados sob demanda; o código plain aparece imediatamente.

## Instalação

No monorepo o workspace já está registrado. Em um consumidor externo (quando publicado):

```bash
npm install @admin-ds/highlighted-code
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

| Prop              | Tipo                          | Padrão   | Descrição                                                                                   |
| ----------------- | ----------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `code`            | `string`                      | —        | Código fonte exibido e copiado                                                              |
| `language`        | `string`                      | —        | Linguagem Shiki ou alias (`ts`, `js`, `yml`, `sh`)                                          |
| `showLineNumbers` | `boolean`                     | `false`  | Numeração de linhas                                                                         |
| `wrapLines`       | `boolean`                     | `false`  | `pre-wrap` em vez de rolagem horizontal                                                     |
| `theme`           | `'light' \| 'dark' \| 'auto'` | `'auto'` | Tema do highlighting; `auto` segue o `data-theme` mais próximo, o do documento ou o sistema |
| `className`       | `string`                      | —        | Classe adicional no container                                                               |
| `codeLabel`       | `string`                      | —        | Nome acessível da região de código                                                          |

### Tema `auto`

O tema efetivo é o do `[data-theme]` ancestral mais próximo do snippet; sem ele, o de `document.documentElement`; sem ambos, `prefers-color-scheme`. Mudanças em qualquer `data-theme` e no esquema do sistema são acompanhadas. O tema só é conhecido no cliente: no servidor e na hidratação o snippet mostra o código plain com as cores da página (tokens do design system), sem destaque e sem `data-resolved-theme`; logo após a montagem, antes da pintura, o tema é resolvido e o destaque é feito uma única vez, no tema certo. `light` e `dark` explícitos já saem resolvidos no servidor.

As cores do snippet (fundo, texto e número de linha) pertencem ao tema do snippet e não ao da página, de modo que um snippet `dark` numa página clara mantém contraste de pelo menos 4,5:1.

## Linguagens iniciais

TypeScript, TSX, JavaScript, JSX, Java, SQL, JSON, HTML, CSS, XML, YAML e Bash.

Registre outras com `registerHighlightedLanguageLoader(id, () => import('...'))`, uma vez, na inicialização da aplicação e antes do primeiro uso da linguagem. O módulo deve ter `default` com a gramática (ou lista de gramáticas) do Shiki, e o `name` da gramática **precisa ser igual ao `id`** registrado; caso contrário a linguagem permanece em plain.

```ts
registerHighlightedLanguageLoader('minha-dsl', () => import('./minha-dsl.grammar.js'));
```

O tipo do carregador é `AdsHighlightedCodeLanguageModule` (exportado pelo pacote), sem expor tipos internos do Shiki.

## Fallback

Linguagem desconhecida ou falha ao carregar motor/gramática/tema mantém o texto **plain**; o cabeçalho e a cópia continuam funcionando. Uma falha não fica memorizada: a próxima renderização ou troca de código/linguagem/tema tenta carregar de novo. Carregamentos simultâneos da mesma gramática ou tema compartilham uma única importação.

Linhas vazias mantêm a altura de uma linha. Terminadores CRLF/CR são normalizados na exibição e uma única quebra de linha final não cria uma linha extra; a cópia sempre recebe o valor original de `code`.

## Código extenso

Para manter a interface fluida, acima de **1000 linhas** ou **100 000 caracteres** o snippet não aplica o destaque e permanece em **plain** (sem carregar o motor). O texto continua completo, rolável e copiável.

## Acessibilidade

O bloco rolável recebe `tabindex="0"`, `role="group"` e nome `<codeLabel>: conteúdo`. A região de status do cabeçalho fica sempre montada e anuncia "Código copiado." (ou a falha); a mensagem some depois de alguns segundos e quando `code` muda.

## Segurança

O conteúdo é renderizado como texto em React a partir dos tokens do Shiki; não use HTML arbitrário na prop `code`.

## Demonstração

No Admin Demo: **Código destacado** em exemplos de aplicação (`/exemplos/codigo-destacado`) e snippets do catálogo com `language="tsx"`.

## Bundle

Importar `@admin-ds/components` **não** inclui Shiki. O cenário `highlighted-code-public` em `npm run inspect:packages` mede o consumo explícito do pacote opcional.
