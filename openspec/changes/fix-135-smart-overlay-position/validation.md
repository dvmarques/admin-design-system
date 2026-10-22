# Validação da correção #135

Execução em Linux, Node 24.19.0, npm 11.9.0. O ambiente contém dependências
pré-instaladas que divergem do lockfile (por exemplo, Next.js 16.4.1).
O npm 11.19.1 exigido pelo projeto não está instalado. A instalação offline
falhou com ENOTCACHED; o proxy de rede do executor está inacessível.

## Revisão e implementação

- Os arquivos da PR foram recuperados pelo plugin GitHub, incluindo as mudanças
  anteriores da branch. A árvore local inicial foi conferida pelo hash Git:
  `a964286d5862d7d8121a792947f2bf50a625f901`, idêntico à árvore do commit
  `25541365a07ae93ac6fab833bbba49fb845f1066` da PR.
- A atualização de develop incorpora somente as mudanças de documentação dos
  commits posteriores à base, preservando as entradas do changelog.
- Montagem/observação do painel passam a seguir o anexo real pela ref, sem
  timers; o cleanup cancela frames e desconecta os observers e listeners.
- O estado transitório usa opacity:0, permitindo o foco inicial do Dropdown;
  visibility:hidden impediria o foco no navegador.
- data-placement agora informa o lado efetivo nos três componentes. A seta
  conserva a translação e recebe sua coordenada transversal calculada.
- O teste original esperava 90px para uma seta limitada a 8px da borda de um
  painel de 100px; a expectativa correta é 92px. Também foram cobertos painéis
  menores que 16px e normalização de rects WebKit no pinch zoom.
- Os testes foram movidos de src para tests: o tsconfig da biblioteca também
  emitia os testes que estavam em src. Os artefatos antigos foram removidos do
  dist local antes de medir a distribuição.
- APIs públicas, handlers de foco, Escape, clique externo e infraestrutura da
  issue #91 permanecem preservados. Nenhum snapshot foi alterado.

## Comandos e resultados

| Validação                                                              | Resultado                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format`                                                       | Passou.                                                                                                                                                                                                                                                                                             |
| `npm run lint`                                                         | Passou.                                                                                                                                                                                                                                                                                             |
| `npm run typecheck`                                                    | Passou nos cinco workspaces.                                                                                                                                                                                                                                                                        |
| `npm run test:quiet`                                                   | Passou: testes Node e 722 testes Vitest em 51 arquivos.                                                                                                                                                                                                                                             |
| Testes focados de posicionamento e overlays                            | Passaram: 55 testes, incluindo 32 de geometria/ciclo de vida e 23 regressões existentes.                                                                                                                                                                                                            |
| `npm run build`                                                        | O comando sem adaptação falhou no Next pré-instalado ao capturar stdout de `tsc --showConfig`; pacotes e Storybook compilaram.                                                                                                                                                                      |
| `NODE_OPTIONS=--require=/tmp/overlay-typescript-api.cjs npm run build` | Passou nos cinco workspaces, incluindo a nova rota Next.js e o Storybook. O preload seleciona o caminho oficial de TypeScript pela API (`defaultConfig.experimental.useTypeScriptCli=false`), mantendo a verificação completa de tipos. Não altera arquivos do projeto nem desabilita verificações. |
| `npm run inspect:packages`                                             | Passou, sem elevar o baseline.                                                                                                                                                                                                                                                                      |
| `npm run test:e2e`                                                     | Bloqueado: o sandbox impede o servidor de escutar a porta 3000 (`listen EPERM`). Nenhum teste de navegador foi aprovado.                                                                                                                                                                            |
| Chromium do sistema via Playwright                                     | Também bloqueado pelo sandbox: criação de socket retorna `Operation not permitted`. Não substitui a suíte E2E.                                                                                                                                                                                      |
| `openspec list --json` e `openspec validate --all --strict`            | Não executaram: CLI ausente (`command not found`). Tentativa de instalação pelo npm expirou sem acesso ao registry. Revisão manual não equivale à validação estrita.                                                                                                                                |

O build inicialmente também encontrou a dependência declarada
`@fontsource/inter` 5.3.0 ausente. Os quatro CSS e oito arquivos de fontes usados
pelos apps, mais manifesto e licença, foram recuperados da mesma versão no
repositório oficial fontsource/font-files pelo plugin GitHub, somente em
node_modules. Nenhum manifesto, lockfile, fonte ou licença do projeto mudou.

## Bundle e dependências

Sem dependência nova: preservada a solução própria após comparação com
Floating UI documentada em design.md. Em build isolado com o mesmo compilador,
o dist de components passou de 345608 para 355657 bytes (+10049, 2,91%), ambos
com 145 arquivos. O valor final fica dentro dos 10% permitidos sobre 330033.

O overlay-utils com esbuild (minificado, ESM, React/React DOM externos) passou
de 5268 para 6759 bytes; gzip de 2257 para 2876 (+619). Essa medição compara
o módulo, não o total de JavaScript entregue pela aplicação Next.js.

## Pendências obrigatórias

- Reexecutar com npm 11.19.1 e dependências exatas do lockfile.
- Executar OpenSpec estrito com o CLI oficial instalado.
- Executar toda a suíte E2E com servidor e navegadores permitidos, incluindo os
  12 casos novos de bordas, conteúdo dinâmico, temas, zoom e teclado.
- Confirmar visualmente os stories e o CSS compilado no navegador. O build e
  a inspeção de CSS passaram, mas não substituem a verificação em navegador.
- Verificar os checks do novo commit. A CI automática de PR tem condição que
  pula os jobs enquanto a PR permanece Draft; skipped não significa aprovado.

A PR deve continuar Draft; não está inteiramente validada para concluir a issue.
