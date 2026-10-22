# Validação da correção #135

## Retomada e ambiente

Retomada do commit publicado `0c2fca54328ac788bcb26fbb9e8ff505829abfbe`,
na mesma branch e PR #167. Issue e discussões foram consultadas pelo plugin
GitHub; não havia comentários nem commits novos. Outros checkouts foram
preservados. Um worktree isolado recebeu a branch existente e incorporou
`develop` em `2098905`, sem conflitos; essa atualização contém documentação e
workflow, sem alterações de runtime.

Linux, Node 24.19.0, npm **11.19.1**, OpenSpec oficial **1.14.3** e Playwright
**1.62.0**. `npm ci --ignore-scripts` concluiu usando o lockfile, sem alterações
em manifestos ou lockfile. Next.js **16.4.1 está no lockfile** e foi instalado
nessa versão; a suspeita anterior de divergência não se confirmou nesta retomada.
A fonte Inter 5.3.0 foi instalada normalmente, sem recuperação manual de arquivos.

## Correções e revisão

- A primeira execução dos 12 E2E publicados passou em 11 casos e encontrou
  violação axe `color-contrast` no link “Voltar ao catálogo” no tema escuro.
  A rota agora reutiliza `demo-action-link`, com tokens de cor e foco existentes.
- Dois novos casos E2E (claro/escuro) verificam movimento real da âncora no
  scroll e recálculo após sua largura mudar. O teste anterior rolava a página
  com gatilho fixo e não demonstrava o acompanhamento de uma âncora em movimento.
- Todos os casos dessa spec coletam erros de página e mensagens de hidratação
  desde antes da navegação inicial. A posição é comparada com o span que é a
  âncora real, incluindo seu baseline, e com o placement efetivo.
- Revisados cálculo puro, flip/shift, seta, ref de portal, ResizeObserver,
  visualViewport, cleanup, SSR, APIs públicas e consumidores. Não foi encontrada
  outra falha de runtime demonstrável nesta revisão; isso não elimina riscos
  ainda não verificáveis em Firefox/WebKit.
- Sem alterações na infraestrutura da issue #91, dependências de runtime,
  tolerâncias ou snapshots. A change permanece ativa e a PR permanece Draft.

## Comandos e resultados atuais

| Validação                                          | Resultado                                                                                                                                                                                                                                             |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format`                                   | Passou.                                                                                                                                                                                                                                               |
| `npm run lint`                                     | Passou.                                                                                                                                                                                                                                               |
| `npm run build`                                    | Passou nos cinco workspaces, pelo comando normal, sem preload nem desativação da checagem de tipos.                                                                                                                                                   |
| `npm run typecheck`                                | Passou nos cinco workspaces.                                                                                                                                                                                                                          |
| `npm run test:quiet`                               | Passou: testes Node e 722 testes Vitest em 51 arquivos.                                                                                                                                                                                               |
| `npm run test:quality`                             | Passou, incluindo release, CI, sincronia de skills e tokens gerados.                                                                                                                                                                                  |
| Testes focados Vitest                              | 55 passaram: 32 de geometria/ciclo de vida e 23 regressões de overlays.                                                                                                                                                                               |
| `npm run test:e2e -- e2e/overlay-position.spec.ts` | 14 passaram na rodada final, incluindo os dois casos novos, axe, quatro placements, seta, conteúdo dinâmico, scroll, resize, pinch zoom, teclado e verificação de erros de hidratação.                                                                |
| `npm run test:e2e`                                 | Executou os 201 testes: **179 passaram e 22 falharam**. Dois snapshots Chromium divergem também em develop; dez Firefox expiraram na criação da página e dez WebKit falharam por bibliotecas do sistema ausentes. A suíte completa não está aprovada. |
| `openspec validate --all --strict`                 | Passou: 46 itens, nenhuma falha, após incorporar develop.                                                                                                                                                                                             |
| `npm run inspect:packages`                         | Passou, sem elevar baseline.                                                                                                                                                                                                                          |
| `git diff --check`                                 | Passou.                                                                                                                                                                                                                                               |

### Execução no navegador

O comando padrão de inicialização do Next.js falha neste executor em
`uv_interface_addresses`. O servidor de produção foi iniciado na mesma sessão
com `next start apps/admin-demo --hostname 127.0.0.1 --port 3000`, e o comando
oficial `npm run test:e2e` reutilizou esse servidor. Nenhuma configuração ou
asserção do projeto foi desativada.

O CDN inicial retornou HTML “Site Unavailable” em lugar do ZIP. Chrome for
Testing e Headless Shell **151.0.7922.34**, exatamente a versão do Playwright,
foram obtidos na distribuição oficial `storage.googleapis.com/chrome-for-testing-public`.
O Chromium completo falha em `socket(): Operation not permitted`; o Headless
Shell funciona e executou os testes. Firefox 153.0 e WebKit 26.5 também foram
baixados da distribuição oficial. Firefox expirou no setup de `page`;
WebKit acusa bibliotecas GTK/GStreamer e outras ausentes. `playwright install-deps`
foi tentado e falhou no apt com `setgroups: Operation not permitted` e erros de
mudança de usuário/grupo. Não foram usadas flags para ignorar esses erros.

### Snapshots: comparação com a base

Os snapshots de `/componentes` e `/clientes` no tema escuro falharam em Chromium.
As diferenças ficam em textos de controles e navegação. Para investigar, um
segundo worktree isolado de **develop `2098905`**, sem a implementação da #135,
foi compilado e executou os mesmos dois casos: **ambos falharam também**.
A comparação dos PNGs reais da PR e de develop com Pillow apresentou imagens
**idênticas pixel a pixel** nas duas rotas (1280×4282 e 1280×1354).
Isso demonstra que essas divergências já ocorrem na base neste ambiente;
não demonstra aprovação do baseline na CI. Nenhum snapshot foi atualizado.

### Verificação visual

Capturas reais do admin-demo de produção e do Storybook compilado
`Overlays/Components → ExtremePositions`, em 390×700, foram inspecionadas nos
temas claro e escuro. Verificados painel, contraste do link, foco e seta nas
bordas. O teste no admin-demo usa exports públicos e o CSS distribuído, sem
Tailwind no consumidor. A inspeção visual complementa as asserções geométricas;
não representa uma revisão manual exaustiva de todas as combinações.

## Bundle e dependências

A retomada não altera o runtime das bibliotecas: `components` continua com
**355657 bytes / 145 arquivos**; tokens 36342 bytes e admin 170121 bytes.
A inspeção passou com os limites versionados.

Medição anterior preservada: components 345608 → 355657 bytes (+10049; 2,91%),
145 arquivos; overlay-utils minificado 5268 → 6759 bytes e gzip 2257 → 2876
(+619). Não foi refeita a comparação minificada contra o código pré-issue,
pois o módulo não mudou nesta retomada. O valor final permanece dentro da
margem existente sobre o baseline 330033; nenhum baseline foi elevado.

## Entrega e pendências

- PR #167 continua Draft, com `bug`, assignee `dvmarques` e `Closes #135`,
  conforme a configuração solicitada. Sem merge, fechamento manual ou archive.
- CI automática de PR ignora Draft; `skipped` não equivale a aprovação.
- Permanecem pendentes o gate completo de E2E e a verificação válida de
  Firefox/WebKit e dos snapshots em ambiente compatível/CI.
- A tarefa de entrega para code review permanece aberta: esta retomada não
  autoriza marcar Ready for review nem considerar a issue concluída.

Os resultados antigos de EPERM na porta, CLI ausente e build com preload são
históricos e foram substituídos pelas execuções acima; não são os bloqueios
atuais.
