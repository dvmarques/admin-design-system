# Licenças e atribuições

Esta fundação possui implementação própria. O CoreUI foi usado somente como
referência visual e funcional; nenhum código, asset, ícone, fonte ou recurso
proprietário do CoreUI PRO foi incorporado ao repositório.

As licenças abaixo foram conferidas nos manifests das dependências diretas
instaladas no momento da change:

| Dependência                                  | Versão                    | Licença    |
| -------------------------------------------- | ------------------------- | ---------- |
| React, React DOM                             | 19.2.8                    | MIT        |
| Next.js                                      | 16.2.12                   | MIT        |
| Tailwind CSS e CLI                           | 4.3.3                     | MIT        |
| TypeScript                                   | 5.9.3                     | Apache-2.0 |
| ESLint e TypeScript ESLint                   | 10.8.0 / 8.65.0           | MIT        |
| Vitest                                       | 4.1.10                    | MIT        |
| Playwright                                   | 1.62.0                    | Apache-2.0 |
| axe-core                                     | 4.12.1                    | MPL-2.0    |
| Testing Library, Storybook, JSDOM e Prettier | versões do `package.json` | MIT        |

As dependências transitivas continuam sujeitas às licenças declaradas por
seus próprios distribuidores. Antes de uma publicação, a lista deve ser
regenerada a partir do lockfile e revisada com o processo de compliance do
projeto. Novos ícones, fontes, imagens ou snippets externos devem registrar
origem, licença e atribuição nesta página antes de serem incorporados.

## Fontes da fundação visual

A pilha tipográfica pública começa em `Inter` e termina em fontes de sistema
(`system-ui`, Roboto, Helvetica Neue e Arial, entre outras). Inter é distribuída
sob a SIL Open Font License 1.1, que permite uso comercial. Os pacotes
`@admin-ds/*` não empacotam arquivos de fonte nem dependem de fontes
proprietárias: as fontes de sistema da pilha são usadas só se já existirem no
dispositivo. As aplicações `admin-demo` e `docs` (privadas, não publicadas)
carregam a Inter pela dependência `@fontsource/inter` (OFL-1.1, arquivos woff2
hospedados no próprio build, sem CDN externa); o texto da licença acompanha o
pacote em `node_modules/@fontsource/inter/LICENSE`. Quem hospedar a Inter em
outra aplicação deve preservar o aviso de licença.
