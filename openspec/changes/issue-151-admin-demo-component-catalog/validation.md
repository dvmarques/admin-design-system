# Evidências de validação — issue #151

## Implementação e revisão

- 67 exports visuais com URLs próprias e 44 composições executáveis; tipos e três helpers sem UI excluídos explicitamente.
- Teste por AST cruza exports públicos, registro, JSX renderizado e snippets extraídos das mesmas funções compiladas. A matriz em `docs/admin-demo-catalog.md` relaciona todas as rotas e famílias Storybook.
- Revisão do diff por critérios de aceite: imports públicos, ausência de dependências novas, preservação das rotas antigas, 404, estático/GitHub Pages, semântica de landmarks, associação de campos, foco, temas/portais, copy/fallback e overflow local.
- Corrigidos na revisão/testes: links repetidos na sidebar inicial, tipos da lista de navegação, rótulos aninhados nos exemplos de seleção, contraste de links no escuro, nomes das regiões de paginação e landmarks do shell (agora em documento isolado).
- Inspeção visual das páginas do catálogo em desktop/mobile e diferenças dos snapshots das páginas existentes. A mudança esperada é a sidebar por grupos; não há alteração dos estilos distribuídos dos pacotes.

## Comandos locais

- `npm ci --ignore-scripts`: dependências sincronizadas com o lockfile.
- `npm run build`: pacotes, aplicação Next.js e Storybook passaram.
- `GITHUB_PAGES=true npm run build --workspace @admin-ds/admin-demo`: export estático passou, com HTML gerado para as 67 rotas e links do breadcrumb respeitando `/admin-design-system/`. O build de produção normal foi restaurado em seguida.
- `npm run typecheck`: passou.
- `npm run lint`: passou.
- `npm run format`: passou.
- `npm run test:quality`: 53 arquivos / 831 testes Vitest passaram, mais testes Node, release, CI, skills e artefatos gerados. A reexecução final após o ajuste do breadcrumb também passou.
- `npx vitest run apps/admin-demo/catalog-coverage.test.ts --silent=passed-only`: 3 testes passaram, incluindo Storybook e sincronização de snippets.
- `npm run test:e2e -- --project=chromium --workers=4 --grep-invert 'mantém a apresentação'`: **207 testes funcionais passaram**, incluindo os 11 cenários do catálogo e o shell isolado em claro/escuro.
- `npm run test:e2e -- e2e/overlay.spec.ts --grep 'supports drawer' --repeat-each=3 --workers=1`: três repetições passaram. O teste agora aguarda o retorno de foco do drawer antes de interagir com o tooltip, evitando corrida com o efeito de fechamento.
- `npx @fission-ai/openspec validate --all --strict`: 48 itens passaram; repetir após fechar as tasks.

- `npm run test:e2e -- e2e/catalog.spec.ts --workers=4`: **12 testes passaram** na implementação final, incluindo o novo cenário de navegação Next.js do breadcrumb e as duas auditorias do shell isolado. Os snippets preservam imports default de Next.js, cobertos pelo teste de sincronização.

O ambiente local precisou de navegadores Playwright em diretório temporário e permissão de rede para os subprocessos do build. Isso não exigiu alteração na configuração do projeto. Os 207 cenários funcionais Chromium passaram sem falhas; as sete comparações visuais afetadas pela sidebar foram verificadas pelo workflow oficial, conforme `docs/quality.md`.

## Gates remotos

- [Workflow oficial de baselines](https://github.com/dvmarques/admin-design-system/actions/runs/39978288343): **sucesso**, com **214 testes Chromium passando duas vezes** (regeneração e comparação sem atualizar imagens).
- Commit de baselines `a2be249`: 16 PNGs atualizados. Imagens e diferenças foram inspecionadas, incluindo desktop claro/escuro, shell recolhido e drawer móvel. A mudança intencional é a navegação por grupos; telas de negócio e identidade visual foram preservadas.
- As 12 tasks estão concluídas. A CI da PR no SHA final, incluindo execução de Firefox/WebKit, será acompanhada após marcar Ready for review; os links e o resultado definitivo ficam na descrição/checks da PR.
- Sem merge, fechamento manual de issue ou arquivamento da change. A revisão humana continua pendente.
