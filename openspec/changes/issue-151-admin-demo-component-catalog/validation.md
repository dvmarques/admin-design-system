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
- `npm run typecheck`: passou.
- `npm run lint`: passou.
- `npm run format`: passou.
- `npm run test:quality`: 53 arquivos / 831 testes Vitest passaram, mais testes Node, release, CI, skills e artefatos gerados. A reexecução final também passou.
- `npx vitest run apps/admin-demo/catalog-coverage.test.ts --silent=passed-only`: 3 testes passaram, incluindo Storybook e sincronização de snippets.
- `npm run test:e2e -- --project=chromium --workers=4 --grep-invert 'mantém a apresentação'`: **207 testes funcionais passaram**, incluindo os 11 cenários do catálogo e o shell isolado em claro/escuro.
- `npm run test:e2e -- e2e/overlay.spec.ts --grep 'supports drawer' --repeat-each=3 --workers=1`: três repetições passaram. O teste agora aguarda o retorno de foco do drawer antes de interagir com o tooltip, evitando corrida com o efeito de fechamento.
- `npx @fission-ai/openspec validate --all --strict`: 48 itens passaram; repetir após fechar as tasks.

O ambiente local precisou de navegadores Playwright em diretório temporário e permissão de rede para os subprocessos do build. Isso não exigiu alteração na configuração do projeto. A execução Chromium com snapshots identificou as sete comparações visuais afetadas pela sidebar; os 207 cenários funcionais passaram na repetição final. As diferenças visuais intencionais serão atualizadas pelo workflow oficial `update-visual-baselines.yml`, conforme `docs/quality.md`. Firefox/WebKit serão confirmados nos jobs oficiais de CI.

## Gates remotos

Pendente: workflow de baselines, revisão das imagens geradas e CI completa no SHA final. A PR permanece Draft até concluir a implementação e validações aplicáveis. Nenhum merge, fechamento de issue ou arquivamento foi solicitado.
