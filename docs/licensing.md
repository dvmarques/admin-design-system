# Licenças e atribuições

## Licença do projeto

O código próprio do Admin Design System é disponibilizado sob a
[licença MIT](../LICENSE.md), com copyright de 2026 de Daniel Marques.
Os manifests da raiz e dos workspaces declaram o identificador SPDX `MIT`.
O campo `private: true` permanece como proteção contra publicação acidental no npm.

A licença MIT do projeto não substitui as licenças nem os avisos de copyright
dos materiais de terceiros, que devem ser preservados.

## Dependências e materiais de terceiros

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

## Ícones SVG incorporados

O componente `AdsIcon` contém **20 desenhos SVG** embutidos em
`packages/components/src/icon.tsx`. A
[auditoria de procedência de 2026-10-29](icons-license-audit.md)
compara os 20 desenhos com Feather, Lucide, Tabler e Heroicons, inclusive
`building` e `settings`, e distingue similaridade de comprovação de origem.

Algumas geometrias coincidem com Feather e o ícone `settings` se aproxima
fortemente dessa biblioteca, mas os commits do Admin DS não identificam a
origem individual dos desenhos. Por cautela, o aviso integral da licença MIT
do Feather foi preservado em
[`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md).
Isso **não certifica** que os outros ícones sejam cópias do Feather, nem
que sejam criações originais. Na PR #258, o desenho antigo de `building`,
cuja origem era desconhecida, foi **substituído** pelo
[`Building06Icon` oficial da Hugeicons Free](https://github.com/hugeicons/hugeicons/blob/main/packages/core-free-icons/src/Building06Icon.ts),
licenciado sob [MIT](https://github.com/hugeicons/hugeicons/blob/main/packages/core-free-icons/LICENSE.md),
copyright (c) 2025 Hugeicons. Os quatro paths e a espessura original foram
preservados, com atribuição e aviso MIT integral em
[`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md). `AdsIcon name="building"`
permanece compatível com a API anterior; apenas o desenho foi alterado.

Licenças de bibliotecas usadas somente como *referência comparativa* não
são automaticamente atribuições de autoria. Caso uma procedência de outro
ícone seja demonstrada posteriormente, atualize os avisos e a auditoria
antes de publicar um pacote de ícones independente.

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

## Skills de design

As skills `design-taste-frontend`, `high-end-visual-design` e
`redesign-existing-projects` foram adaptadas da origem
[Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), sob licença MIT,
com copyright de 2026 de Leonxlnx. São orientações de desenvolvimento em
`.agents/skills`, espelhadas em `.claude/skills`, e não integram os pacotes de runtime.

O [aviso de licença e copyright](licenses/taste-skill-LICENSE.txt) é preservado
integralmente. A [licença consultada na origem](https://github.com/Leonxlnx/taste-skill/blob/6010f91a9935f1c167dfc500fb1a475681892e6b/LICENSE)
identifica a revisão usada nessa conferência; ela não identifica a revisão de
importação das skills. Os caminhos originais e os hashes de importação permanecem
em `skills-lock.json`; os textos atuais são adaptações locais para a identidade
do Admin Design System.
