# Composições administrativas integradas — #320

## Percurso na Demo e no Storybook

O índice `/exemplos/integracao` é um Server Component com links para os três exemplos existentes e as variantes do shell. O `(admin)/layout.tsx` fornece um único `main`, cabeçalho, sidebar, conta, menu e controle de tema; o layout da Demo inclui o footer compartilhado; o componente de footer é opt-in para o consumidor do shell. Não há um segundo shell.

| Cenário    | Rota                                                   | Composição e estados                                                                                                          |
| ---------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Consulta   | `/exemplos/composicao-semantica/consulta`              | `AdsPageHeader`, H2, `AdsField` + `AdsInput`, `AdsTable`, `AdsPagination`, ações de linha, filtro, vazio, carregamento e erro |
| Formulário | `/exemplos/composicao-semantica/formulario`            | H1/H2/H3, `AdsField` e `AdsButton`, validação, feedback, campo desabilitado                                                   |
| Shell      | Índice e rotas acima; `/catalogo-shell` para variantes | `AdsAdminShell`, sidebar normal/recolhida/mobile, menu, tema e footer do layout compartilhado                                 |
| Resumos    | `/exemplos/composicao-semantica/dashboard`             | `AdsMetricCard` e `AdsCard` apenas em indicadores e conteúdo autocontido, não como contêiner de página                        |

O Storybook inclui **Patterns / Page composition / Integrated admin** e os exemplos separados **Consultation**, **Validated form** e **Dashboard**. O catálogo da aplicação aponta para a matriz integrada.

## Escolha entre primitivos e composições

- Use `AdsPageHeader` e HTML nativo `section` + `AdsTypography` para hierarquia H1–H4. Não use `AdsCard` como wrapper obrigatório.
- Use `AdsTable` para uma listagem simples com filtro local, e `AdsSmartTable` ou `AdsListFlow` quando precisar de seleção, ordenação e fluxos mais complexos (veja `/clientes`).
- Use `AdsMetricCard` para indicadores, `AdsCard` para resumos autocontidos e `AdsSurface` para delimitar apenas quando acrescentar informação.
- O layout e o tema pertencem ao consumidor. `AdsAdminShell.Footer` é opt-in e ícones não obrigam fornecedor de biblioteca.

## Contratos públicos

A Demo importa os componentes apenas de `@dvmarques/admin-ds-components` e `@dvmarques/admin-ds-admin`. O layout raiz importa os CSS públicos compilados **na ordem** `tokens/styles.css`, `components/styles.css` e `admin/styles.css`. Classes responsivas `ads-layout-*` não exigem Tailwind no consumidor. Não se criaram exports, dependências de runtime ou tokens nesta change. Ações e estados usam exclusivamente memória local com dados fictícios; sem serviços, sessão ou persistência.

## Validação

Com Node 24/npm 11.19.1, executar `npm run validate`, `npm run inspect:packages`, `npm run verify:optional-peer` e `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`. A suíte `e2e/integrated-admin-compositions.spec.ts` inclui 320/390/768/1440px e light/dark com axe WCAG, H1/landmark, ausência de overflow, erros de hidratação, teclado, filtro, paginação, erro/carregamento e campo desabilitado. As suites existentes verificam shell, portais, tema, footer, teclado e reflow equivalente.

Zoom **nativo** 200% e NVDA/VoiceOver não foram testados. Emulação por viewport ou CSS zoom não é equivalente. Por decisão do solicitante, revisão manual não é gate desta entrega; essa decisão não implica aprovação dos cenários não verificados. Não atualize snapshots automaticamente.

## Orçamentos e comparação

Os três arquivos de orçamento permanecem intactos: [distribuição](bundle-baseline.json), [JS/CSS publicado](browser-budget.json) e [cenários tree-shaken](scenario-budget.json). `inspect:packages` aponta estouros de limite; `public-consumption.test.ts` valida imports públicos, CSS e proíbe Tailwind e imports profundos.

**Medições anteriores, apenas históricas:** a [PR #328](https://github.com/dvmarques/admin-design-system/pull/328) registrou components 306.805 B (gzip 92.067 B) e admin 173.020 B (gzip 46.886 B) de JS/CSS publicados. Não são medições da #320. O diff desta change não altera `packages/`; não há aumento de bundle de pacote intencional. Bytes de rotas Next/Storybook podem mudar e não são inferidos desses números.

O comparativo vigente está abaixo, com SHAs, ambiente e limites; as métricas históricas de distribuição não são substitutas desse comparativo.

### Medição histórica da distribuição

Na [CI #43875243920](https://github.com/dvmarques/admin-design-system/actions/runs/43875243920),
em **16/11/2026**, no commit `0e4e57ed21f955ccfad6f0790307d410d1628c51`
(Node 24 e npm 11.19.1), `inspect:packages` passou com os limites existentes:

- Components: JS/CSS publicados **307.865 B / teto 308.000 B**;
  gzip **92.279 B / teto 92.400 B**.
- Admin: JS/CSS publicados **173.020 B / teto 173.100 B**;
  gzip **46.886 B / teto 47.100 B**.
- Cenário minificado `components-public`: **33.417 B / teto 33.600 B**.
- Cenário CSS minificado `admin-public`: **104.369 B / teto 104.400 B**.

**Interpretação:** orçamento preservado sem alterações em `packages/`. A diferença
entre esses valores e qualquer medição anterior não deve ser atribuída à #320
sem uma base comparável (mesmos scripts, toolchain e conteúdo dos pacotes).

A mesma revisão no commit verificou `format`, lint, build, types, coberturas,
Chromium (2 shards), Firefox, WebKit, CodeQL, Gitleaks, npm audit e build de
Pages; os workflows de [Security](https://github.com/dvmarques/admin-design-system/actions/runs/43875243630)
e [Pages](https://github.com/dvmarques/admin-design-system/actions/runs/43875243625)
concluíram com sucesso. O deploy real é pulado em PRs, por política.

### Comparativo reproduzível — base e HEAD da PR

Em 16/11/2026, Windows x64, Node 24.21.0, npm 11.19.1 e lockfile SHA-256 `7484c326a677075b021e6111aa8a866ba179ee2044e7165a98c4c70307558715`: base `157bb339bb31b483c6acbbfaaa4370d5d6653893` e árvore de trabalho sobre `4d78a1c74321ea608e73197eaefa1bc493e1a6d5`, incluindo as correções de foco e regiões de status da revisão posterior. Ambos usaram worktrees separados, `npm ci --ignore-scripts` e `npm run build`, sem variáveis de Pages, com `next start` em produção. Nenhum budget foi alterado.

Para reproduzir, instale a mesma versão de Node/npm e execute `npm ci --ignore-scripts` e `npm run build` em cada checkout; instale o Chromium do Playwright com `npx playwright install chromium`. Sirva cada checkout com `npm run start --workspace @admin-ds/admin-demo` em portas distintas. A partir da branch desta change, execute `node scripts/measure-integrated-bundles.mjs <worktree> <http://localhost:porta>` para cada servidor. O script registra requisições JS/CSS durante navegação e interações disponíveis nas duas versões, deduplica caminhos, soma gzip nível 9 por arquivo e relaciona os assets por rota com tamanho bruto e gzip de cada arquivo. Os relatórios completos estão em [base](bundle-measurements/issue-320/base.json) e [HEAD](bundle-measurements/issue-320/head.json).

| Rota / conjunto                | Base JS bruto / gzip (B) | HEAD JS bruto / gzip (B) |                Delta bruto / gzip |
| ------------------------------ | -----------------------: | -----------------------: | --------------------------------: |
| Catálogo                       |        593.835 / 178.504 |        594.441 / 178.643 |     +606 (+0,10%) / +139 (+0,08%) |
| Consulta                       |        595.923 / 178.897 |        603.999 / 181.846 | +8.076 (+1,36%) / +2.949 (+1,65%) |
| Formulário                     |        596.937 / 179.031 |        597.040 / 179.069 |      +103 (+0,02%) / +38 (+0,02%) |
| Dashboard                      |        587.195 / 176.120 |        587.195 / 176.120 |                             0 / 0 |
| União sem dupla contagem       |        612.305 / 184.192 |        621.090 / 187.318 | +8.785 (+1,43%) / +3.126 (+1,70%) |
| Storybook: todos os JS gerados |   10.275.788 / 2.576.448 |   10.278.452 / 2.577.255 | +2.664 (+0,026%) / +807 (+0,031%) |

Cada rota carregou os mesmos dois CSS: 121.462 B brutos / 19.279 B gzip na base e no HEAD; a união os conta uma vez. O Storybook gerou dois CSS, 107.154 / 16.692 B em ambos. A rota nova `/exemplos/integracao` não existe na base; no HEAD carregou 587.195 / 176.120 B de JS e 121.462 / 19.279 B de CSS, arquivos já contados na união. Os totais de Storybook são todos os arquivos gerados, não bytes de uma sessão individual.

A investigação identificou que os +8.076 B da consulta correspondem à substituição de seu chunk específico de 8.728 B por outro de 16.804 B. O diff acrescenta estados, ações e paginação usando imports públicos; não adiciona dependências nem altera pacotes. Não foi identificado import massivo novo pelo diff. Os dois arquivos CSS de Storybook têm hashes distintos e o CSS carregado pelo Next não mudou; isso não prova ausência de regras CSS semanticamente duplicadas. Nenhum erro de página ou console de hidratação foi observado nos percursos medidos. A medição cobre as interações explicitadas no script, não todas as combinações possíveis, e os limites existentes de distribuição continuam em `bundle-baseline.json`, `browser-budget.json` e `scenario-budget.json`.

## Dependências e limites

Épico #315: #316/PR #321, #317/PR #326, #318/PR #327 e #319/PR #328 integrados em `develop` antes desta branch. Sem archive, merge ou fechamento administrativo nesta etapa.

## Acessibilidade e limites da execução

A suíte integrada Chromium passou (5 testes), com axe na largura inicial de 1440 px e overflow testado em 320/390/768/1440 px para ambos os temas, além de teclado, semântica e hidratação. Foram capturadas 32 combinações de quatro páginas, dois temas e quatro larguras; folhas de contato foram inspecionadas pela IA e duas capturas também em tamanho original. A tabela de consulta usa rolagem horizontal em telas estreitas. Não foi realizada comparação completa com baselines nem testes reais de zoom nativo e leitor de tela. A remoção da antiga task 12 foi autorizada pelo solicitante e não constitui aprovação dos itens não testados.

A suíte E2E completa local terminou com 597 aprovados, 1 ignorado e 9 falhas por baselines `*-chromium-win32.png` inexistentes. Os 18 arquivos criados automaticamente pelo Playwright foram removidos sem atualizar baselines. A CI Linux usa as baselines oficiais.
