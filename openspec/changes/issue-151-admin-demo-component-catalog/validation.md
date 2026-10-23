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

## Gates remotos — entrega inicial

- [Workflow oficial de baselines](https://github.com/dvmarques/admin-design-system/actions/runs/39978288343): **sucesso**, com **214 testes Chromium passando duas vezes** (regeneração e comparação sem atualizar imagens).
- Commit de baselines `a2be249`: 16 PNGs atualizados. Imagens e diferenças foram inspecionadas, incluindo desktop claro/escuro, shell recolhido e drawer móvel. A mudança intencional é a navegação por grupos; telas de negócio e identidade visual foram preservadas.
- As 12 tasks estão concluídas. A CI da PR no SHA final, incluindo execução de Firefox/WebKit, será acompanhada após marcar Ready for review; os links e o resultado definitivo ficam na descrição/checks da PR.
- Sem merge, fechamento manual de issue ou arquivamento da change. A revisão humana continua pendente.

## Ajustes da revisão

Referência: [revisão da PR #177](https://github.com/dvmarques/admin-design-system/pull/177#pullrequestreview-5630869592).

- Estado da sidebar: identidade por grupo, estado controlado pelo `toggle` nativo e abertura apenas do grupo de destino em mudanças de rota. As escolhas dos outros grupos sobrevivem à navegação e ao histórico.
- Regressões: teste unitário preserva identidade DOM e expansão; Playwright abre/recolhe grupos e navega por links e voltar/avançar, verificando o item ativo e as preferências dos demais grupos.
- Base integrada: `develop` em `75f7d31` (overlays #134 / PR #178), via merge `2071fc9`, sem conflitos. Nenhum commit da base ficou fora da branch no momento da integração.
- `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck` e `npx @fission-ai/openspec validate --all --strict`: passaram (48 itens OpenSpec).
- `npm run test:quality`: **54 arquivos / 846 testes Vitest passaram**, além dos testes Node, release, CI e verificações de artefatos/skills.
- Navegação: **77 testes unitários passaram**, incluindo a regressão de identidade/expansão.
- `npm run test:e2e -- --project=chromium --workers=4`: **209 testes funcionais passaram**, incluindo a nova regressão. Sete comparações de screenshots diferiram localmente por poucos pixels de rasterização de texto, sem mudança de layout na inspeção. Conforme `docs/quality.md`, os baselines oficiais Linux foram mantidos; a comparação definitiva será feita na CI padronizada.

A [CI da correção `7714ab4`](https://github.com/dvmarques/admin-design-system/actions/runs/39983444281) passou por completo: qualidade, artefatos, política de develop e passos reais de Playwright em Chromium, Firefox e WebKit. As comparações com os snapshots oficiais passaram sem alterar imagens. As tarefas 13–15 estão concluídas.

A execução anterior `39979454512` comprova somente a entrega inicial. A CI acima valida a correção e a integração da base; os [checks da PR no SHA atual](https://github.com/dvmarques/admin-design-system/pull/177/checks) e a descrição da PR registram também a confirmação do commit final de evidências. Esse último commit altera somente documentação e tasks, sem mudar o código validado.

## Ajuste local da hierarquia da sidebar — 23/10/2026

- Alterações na branch atual, sem commit, conforme solicitado. Seções não interativas, categorias expansíveis com ícone/chevron e links recuados são fornecidos pelas partes públicas de AdsAdminShell. Rotas e nomes técnicos das páginas permanecem estáveis.
- `npm run build`: pacotes, Next.js e Storybook passaram. `npm run lint`, `npm run typecheck`, `npm run format` e `openspec.cmd validate --all --strict` passaram (48 itens OpenSpec).
- `npx.cmd vitest run packages/admin/tests/sidebar-navigation.test.tsx apps/admin-demo/tests/demo-navigation.test.tsx apps/admin-demo/catalog-coverage.test.ts --silent=passed-only`: 82 testes passaram. A primeira execução no sandbox falhou antes de executar testes com EPERM no cache temporário; a reexecução fora do sandbox passou.
- `npm run test:quiet`: testes Node e 55 arquivos / 848 testes Vitest passaram.
- `npm run test:e2e -- e2e/catalog.spec.ts e2e/smoke.spec.ts --project=chromium --workers=4`: 20 testes passaram, incluindo todos os exports em 390/1280 px e claro/escuro, axe das composições, menu móvel, histórico/expansão e acionamento por teclado do grupo no desktop recolhido.
- Inspeção visual do drawer móvel em claro/escuro: títulos, recuo, ícones, chevrons e página ativa conferidos. Desktop validado nos cenários Playwright.
- Snapshots Linux não foram atualizados nem executados localmente, conforme docs/quality.md. A suíte completa e a atualização oficial dos baselines continuam para o fluxo de CI após revisão; o workflow cria commit e não foi acionado neste ajuste sem commit.

- Servidores dev: Storybook iniciou em 6006, com avisos do sandbox ao gravar configurações globais. `npm run dev --workspace @admin-ds/admin-demo` identificou o servidor já existente em 3000 e encerrou a tentativa duplicada; o existente foi preservado e usado na inspeção e pelos testes E2E. O build Next também passou separadamente. O conteúdo local pré-existente de next-env.d.ts foi restaurado após a geração do build; package-lock.json foi preservado.

## Validação pré-commit e publicação do ajuste da sidebar

- `npm run test:e2e -- --project=chromium --workers=4 --grep-invert 'mantém a apresentação'`: **210 testes funcionais Chromium passaram**, sem falhas, em 5,5 minutos. A exclusão se restringe às comparações com snapshots oficiais Linux, cuja execução local não é suportada.
- A issue #151 e a descrição da PR #177 registram a navegação hierárquica reutilizável como parte do escopo atual, incluindo APIs públicas adicionais, compatibilidade, acessibilidade, documentação e testes.
- Commit/push autorizados na branch atual. Apenas arquivos deste ajuste são incluídos; alterações locais preexistentes em package-lock.json e next-env.d.ts permanecem fora do commit. Snapshots oficiais continuam pendentes de atualização e inspeção no workflow do projeto antes do merge.

## Atendimento da terceira revisão da PR #177

- Seções usam role group e aria-labelledby com ids gerados por useId; testes verificam nome/conteúdo, unicidade e estabilidade entre renderizações.
- Destinos da sidebar recolhida usam ícones públicos adequados ou iniciais distintas, sem iniciais nos links internos. O teste de navegação verifica que não há símbolos repetidos. Changelog Added consolidado em uma entrada.
- Auditoria inicial identificou contraste insuficiente nas iniciais do link ativo; o estado selecionado agora usa o token on-surface-selected e seus símbolos herdam essa cor. A execução inicial foi interrompida para corrigir a falha. Seletores E2E passaram a localizar o rótulo textual isolado dos símbolos decorativos.
- `npm run test:quiet`: 55 arquivos / 850 testes Vitest passaram, além dos testes Node. Build completo Next.js/Storybook, lint, tipos, format e OpenSpec estrito passaram. Os pacotes admin e demo foram reconstruídos após a correção de contraste.
- Regressão focalizada (`npm run test:e2e -- e2e/catalog.spec.ts e2e/data-display.spec.ts --project=chromium --workers=4 --grep 'exibe os sparklines|sidebar preserva|sidebar distingue'`): 3 testes passaram, incluindo axe do destino com iniciais ativo.
- Inspeção visual local no desktop expandido/recolhido confirmou hierarquia, foco e distinção dos símbolos. Contexto obrigatório de NavigationGroup permanece documentado em docs/integration.md.

- A nova seção nomeada tornou ambíguo o antigo getByLabel parcial de Componente nos testes de overlay. Os seletores agora usam combobox com o nome do campo. `npm run test:e2e -- e2e/overlay-position.spec.ts --project=chromium --workers=4`: 18 testes passaram.
- Reexecução final `npm run test:e2e -- --project=chromium --workers=4 --grep-invert 'mantém a apresentação'`: **210 testes passaram**, sem falhas, em 1,9 minuto no build de produção. `npm run format` e `npm run lint` passaram após os ajustes dos seletores.
