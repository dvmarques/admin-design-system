# Licenças e atribuições

O Admin Design System possui implementação própria. Materiais externos
incorporados ao projeto devem respeitar suas licenças e preservar as atribuições.

As licenças abaixo foram conferidas nos manifests das dependências diretas.
As versões e faixas de dependência estão registradas nos arquivos `package.json`
e no `package-lock.json`, evitando duplicar esse inventário nesta página:

| Dependência                                  | Licença    |
| -------------------------------------------- | ---------- |
| React, React DOM                             | MIT        |
| Next.js                                      | MIT        |
| Tailwind CSS e CLI                           | MIT        |
| TypeScript                                   | Apache-2.0 |
| ESLint e TypeScript ESLint                   | MIT        |
| Vitest                                       | MIT        |
| Playwright                                   | Apache-2.0 |
| axe-core                                     | MPL-2.0    |
| Testing Library, Storybook, JSDOM e Prettier | MIT        |

As dependências transitivas continuam sujeitas às licenças declaradas por
seus próprios distribuidores. Antes de uma publicação, a lista deve ser
regenerada a partir do lockfile e revisada com o processo de compliance do
projeto. Novos ícones, fontes, imagens ou snippets externos devem registrar
origem, licença e atribuição nesta página antes de serem incorporados.

## Fontes

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
