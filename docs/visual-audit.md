# Auditoria visual

Origem: issue #152 (auditoria visual do catálogo). O nome dos arquivos não carrega o número da issue; o acompanhamento fica na issue e no OpenSpec.

## Escopo da primeira fase

Esta PR inicia a auditoria com inventário dos exports do Admin Demo e referências às stories. A [matriz](visual-audit-inventory.md) não declara que componentes foram inspecionados. A cobertura de exports já é conferida por `apps/admin-demo/catalog-coverage.test.ts`; o novo verificador trata da rastreabilidade da inspeção.

Na raiz do repositório:

- `node scripts/visual-audit-inventory.mjs --check`: confere nomes, grupos, rotas e stories com a matriz, rejeitando linhas sem evidência quando o status muda de Pendente.
- `node scripts/visual-audit-inventory.mjs --print`: imprime modelo atualizado sem reescrever as evidências existentes.
- `node --test scripts/visual-audit-inventory.test.mjs`: testa ambos os comandos; também integra `test:ci`.

## Protocolo para a próxima fase

Para cada componente, selecionar estados relevantes (default, hover, focus, erro, sucesso, disabled, loading), temas claro/escuro e viewports de 320px, 390px, 768px e 1440px. Verificar teclado, zoom 200%, overflow e, onde aplicável, alto contraste e reduced motion. Registrar browser, viewport real, tema, estado, resultado e link persistente de captura. Nem toda combinação exige um snapshot; a justificativa deve ser explícita.

Estados permitidos na matriz: `Pendente`, `Em análise`, `Sem divergência`, `Divergência confirmada` e `Não aplicável`. Toda linha não pendente precisa indicar evidência/justificativa verificável. O resultado vale somente para os casos documentados, não equivale à cobertura irrestrita de estados.

Para cada divergência confirmada, registrar componente, rota, estado, tema, viewport, zoom, browser, esperado × observado, captura antes/depois, hipótese de causa, severidade, PR ou issue e teste de regressão. Separar diferença estética de defeito comprovado. Corrigir itens coesos, desmembrando alterações transversais; não atualizar snapshots em massa sem revisão.

## Relações

Preservar a cobertura existente (#151) e não duplicar correções concluídas em #138, #140, #191, #242, #243 e #244. Esses casos servem como regressões a conferir, e não como bugs novos. Preservar tokens/identidade e não modificar #91. Não há mudança visual, API ou CSS nesta fase. O restante da #152 depende de inspeção real, evidências e correções verificadas.

## Auditoria automatizada — Playwright (primeira varredura)

Esta etapa adiciona **execução real opt-in**, em separado de `npm run test:e2e`, usando o mesmo build de produção do Admin Demo. A suíte verifica as rotas do catálogo, seleciona o tema, captura o preview renderizado e mede possíveis problemas de layout.

```sh
npm run build
npm run audit:visual
```

O comando usa `playwright.visual-audit.config.ts` e `visual-audit/audit.spec.ts`; o build e o stamp existentes são exigidos para evitar falso verde com código desatualizado. A execução reinicia `visual-audit-results/` (arquivos **ignorados pelo Git**) e produz:

- `visual-audit-results/report.md`: resumo, sinais para revisão e links locais para imagens.
- `visual-audit-results/report.json`: resultados estruturados, métricas, erro e commit, quando disponível.
- `visual-audit-results/screenshots/light-390/`, `dark-390/`, `light-1440/`, `dark-1440/`: PNGs do estado **inicial visível** de cada rota.

A configuração-base executa Chromium nos dois temas e nas larguras de 390px (mobile) e 1440px (desktop). Ela **não** executa todas as variações de estado: hover, foco, 320px, 768px, zoom 200%, menus abertos, alto contraste e reduced motion continuam exigindo rodadas específicas. Para subcomponentes que compartilham composição, as capturas podem ser equivalentes e devem ser interpretadas por export, não como estados distintos.

O auditor registra: erros de rota/captura; console do navegador; overflow horizontal do documento; overflow na região de demonstração; controles fora da borda; controles cujo conteúdo excede a largura. **São heurísticas de triagem**, pois tabelas roláveis, truncamento e outras composições podem ser intencionais. Não realiza julgamento visual subjetivo de cores, espaçamentos, contraste ou alinhamento tipográfico. Um status “sem sinais automatizados” NÃO equivale a aprovação visual e não altera as linhas `Pendente` da matriz. A heurística de truncamento sinaliza apenas controles com conteúdo maior que a caixa e `overflow-x: hidden|clip`; `overflow: visible` não equivale a recorte e os detectores independentes de bordas/viewport permanecem ativos.

Controles visualmente ocultos (largura ou altura de até 2px, como o `input type="file"` nativo com `sr-only` do `AdsFileUpload`) não entram na heurística de conteúdo que excede a largura, pois o overflow deles não é visível.

Para disparar pelo GitHub após o workflow estar presente na branch padrão, abrir Actions → **Auditoria visual** → Run workflow. O artefato contém report.md/report.json e capturas, com retenção de 14 dias. O workflow é manual (`workflow_dispatch`), sem agendamento ou custo recorrente por PR. A primeira validação efetiva só pode ser declarada após rodar e inspecionar esse artefato; nenhum relatório de execução foi pré-gerado nesta PR.

O relatório usa apenas demos com dados fictícios. Não adiciona novos baselines nem altera os snapshots oficiais Linux; qualquer diferença encontrada deve ser investigada e tratada separadamente.

### Tema da demonstração (`applyDemoTheme`)

Tanto `visual-audit/audit.spec.ts` (varredura das 332 capturas iniciais) quanto `visual-audit/states.spec.ts` (22 cenários seletivos) delegam a troca de tema ao helper `visual-audit/demo-theme.ts`. O fluxo aguarda hidratação do `AdsSelect`, repete `selectOption` quando necessário e confirma `data-theme` na região `Demonstração interativa` e em `<html>` antes da captura. Rotas com `iframe` (Admin Shell, showcases de organização) continuam aguardando `html[data-theme]` interno e registrando `iframe-theme-mismatch` quando o tema diverge.

### Hidratação em testes (`waitForHydration`)

O helper reutiliza `e2e/hydration.ts`, que detecta propriedades internas do React 19 (`__reactProps$*`). O catálogo não expõe sinal público estável de mount; expandir a demo com `data-testid` ou eventos dedicados ficaria fora do escopo de tooling da #152. A confirmação observável permanece `data-theme` após a seleção. Atualizar `e2e/hydration.ts` beneficia auditoria e E2E juntos se o React mudar esses nomes.

### Execução serial dos cenários de estado

`states.spec.ts` usa `test.describe.configure({ mode: 'serial' })` para evitar corrida na preferência global de tema ao alternar dark/light nos 22 cenários. Trade-off: a primeira falha interrompe os testes seguintes no mesmo bloco; o relatório de cobertura de estados distingue falha de execução de cenário pendente.

### Triagem — três sinais pós-R1 (SHA `0389f711`, baseline local)

Reprodução controlada com `audit.spec.ts` da R1 (`selectOption` direto, 1 worker, Chromium): **332/332 capturas, 3 sinais `browser-console`**, 0 falhas geométricas. Baseline comparado: [Auditoria visual #43646192995](https://github.com/dvmarques/admin-design-system/actions/runs/43646192995) (0 sinais no container CI).

| Export           | Rota                     | Tema  | Viewport | Código            | Esperado      | Observado                                           | Classificação                                                                                                                               |
| ---------------- | ------------------------ | ----- | -------- | ----------------- | ------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `AdsMultiSelect` | `/catalogo/multi-select` | light | 1440px   | `browser-console` | console limpo | aviso React de hidratação (atributos SSR × cliente) | **Variação ambiental / ruído de triagem**: sem falha de captura; métricas geométricas 0; ausente com `applyDemoTheme` na varredura completa |
| `AdsFileUpload`  | `/catalogo/file-upload`  | light | 390px    | `browser-console` | console limpo | mesmo padrão de hidratação                          | **Variação ambiental / ruído de triagem** (idem)                                                                                            |
| `AdsCheckbox`    | `/catalogo/checkbox`     | light | 1440px   | `browser-console` | console limpo | mesmo padrão de hidratação                          | **Variação ambiental / ruído de triagem** (idem)                                                                                            |

Nenhum ajuste nos limites de detecção. Com `applyDemoTheme` também em `audit.spec.ts`, a execução **local** `npm run audit:visual` no HEAD desta PR registrou **0 sinais** (evidência em `visual-audit-results/report.json`). Esse resultado **não** provém de job de CI: a auditoria visual é opt-in (`workflow_dispatch` ou máquina de desenvolvimento) e não integra a pipeline de PR. Inspeção humana do diff SSR permanece recomendada se o aviso passar a ser reproduzível na CI.

## Triagem da execução #43617023449 — acompanhamento #152

- **Organização:** as capturas dark 390/1440px mostraram dois iframes em light; causa identificada na composição: o URL não incluía `theme`, embora a página isolada espere esse parâmetro. A correção faz os dois exemplos acompanhar o tema efetivo, sem mudar o `AdsOrganizationSwitcher` público.
- **Upload:** as ações do exemplo estavam adjacentes, sem `gap`; a composição agora usa um grupo flexível com separação e quebra de linha. O `AdsFileUpload` público permanece intacto.
- **AdminShell:** sinal `control-text-overflow` no botão de recolher com `overflow: visible` e ícone íntegro nas capturas: classificado como **provável falso positivo** de medição (não é clipping). A heurística de truncamento passa a exigir recorte efetivo; demais checagens não mudam.

## Verificação pós-correção

Execução local (Linux, Chromium) sobre o código da change `issue-152-visual-audit-findings`:

- `npm run audit:visual`: **328/328 capturas, 0 sinais para revisão, 0 falhas, 0 não executadas** (antes: quatro sinais na execução #43617023449). O resultado vale apenas para o estado inicial visível de cada rota e não equivale a aprovação visual.
- `e2e/visual-audit-findings.spec.ts` (Chromium): 6/6 testes aprovados.
- `npm run format`, `lint`, `build`, `typecheck`, `test:quality`, `test:output` (docs), `verify:optional-peer` e OpenSpec estrito (70/70): sem falhas.
- `npx playwright test --project=chromium`: 473 aprovados e 9 falhas de snapshot visual em páginas não alteradas por esta change (`/componentes`, `/clientes`, `/clientes/novo`, `/preferencias`, referência, Admin Shell e dados). A diferença ocorre no ambiente local (build do Chromium/renderização) e a CI passou no mesmo SHA; nenhum snapshot foi atualizado. Firefox e WebKit ficam a cargo da CI.

A matriz segue `Pendente` até inspeção mais completa por estado.

## Fase 3 — matriz e estados seletivos (#152)

A fonte versionada de aplicabilidade é `visual-audit/coverage-matrix.json`. Ela contém uma decisão explícita de perfil por export e cenários seletivos; **não** duplica o nome da rota nem as stories do catálogo. Os nomes, grupos e rotas são obtidos de `apps/admin-demo/app/catalogo/catalog-data.ts`; o inventário e as ligações com Storybook existentes continuam válidos. Estados não mapeados não são automaticamente "não aplicáveis". As exceções N/A exigem motivo, e todo componente continua com revisão humana pendente.

Comandos:

```sh
node scripts/visual-audit-coverage.mjs --check
node scripts/visual-audit-coverage.mjs --print
node --test scripts/visual-audit-coverage.test.mjs scripts/visual-audit-coverage-report.test.mjs
npm run build
npm run audit:visual
```

A validação da matriz integra `test:ci`, inclusive em PRs normais, mas os 22 cenários adicionais Playwright são **opt-in**, no workflow de auditoria manual. O conjunto não executa um produto cartesiano de todos os exports, estados, temas e viewports. Após uma execução, a pasta ignorada `visual-audit-results/` passa a conter `coverage-report.md`, `coverage-report.json`, `states/<id>.json` e `screenshots/states/<id>.png`, além dos relatórios e 328 amostras iniciais preexistentes. Resultados de falha ou capturas ausentes não são aprovados. O relatório agregado original recebe apenas o resumo adicional e um link ao relatório detalhado.

A cobertura contém focos por teclado, estados de validação, aberturas de overlays, dados, sidebar, forced-colors e prefers-reduced-motion em casos selecionados. Emulação de mídia **não é** avaliação perceptual de contraste, e a mudança de viewport/CSS não comprova zoom real do navegador a 200%. Esta verificação permanece pendente de execução manual dedicada (light/dark, desktop/mobile), com capturas e revisão humana antes de alterar seu status. O mesmo vale para diferenças subjetivas de tipografia, densidade, elevação e affordance. Não atualizar snapshots oficiais como parte dessa auditoria.

Revisão de evidências: para cada sinal, registrar export/rota/estado/tema/largura, esperado e observado, severidade, resultado de inspeção humana, link persistente do artefato e PR ou issue de regressão quando cabível. O artefato Actions tem retenção limitada; links efêmeros não substituem evidência preservada quando uma decisão for tomada. A ausência de alertas não permite declarar visual aprovado, e nenhum checkbox geral da #152 deve ser marcado apenas com base na execução automatizada.

## Fase 4 — cobertura seletiva de teclado, foco e reflow (#152)

A branch da fase 4 adiciona uma matriz de 31 cenários prioritários (17 de teclado/reflow e 14 de zoom nativo) em visual-audit/a11y-scenarios.json, executados por visual-audit/a11y.spec.ts. A matriz preexistente (83 exports, 362 estados aplicáveis, 169 N/A) e suas 332 capturas iniciais + 22 cenários seletivos permanecem inalteradas. A suíte nova é **aditiva** e permanece opt-in no mesmo npm run audit:visual e workflow Auditoria visual (workflow_dispatch). Não executa na CI regular nem altera snapshots oficiais.

### Requisitos objetivos

- Botões: Tab e Shift+Tab, posição e indicação de foco visível. A verificação exige mudança em propriedades de pintura do controle ou antecessores, estado :focus-visible, posição visível e hit-test no ponto central; activeElement isolado não conta como foco visual.
- Abas: ArrowRight e Enter, foco e aria-selected. Menus/dropdown: ArrowDown, mudança de menuitem, Escape e retorno ao acionador.
- Dialog e drawer: Enter para abrir, foco inicial, ciclos Tab/Shift+Tab contidos no modal, Escape e retorno do foco ao acionador. Popover e AdminShell móvel: abertura por Enter, Escape e retorno do foco.
- Reflow: documento sem scroll horizontal acima de 2px, painel modal contido no viewport e superfície de tabela disponível. Overflow interno de tabelas e preview é anotado para revisão, pois pode ser rolagem intencional.
- Preferências: prefers-reduced-motion e forced-colors confirmados no navegador antes do teste; não implicam conformidade de contraste em todos os estados.
- Light/dark e viewports 320/390/768/1440px aplicados conforme o risco do cenário, sem produto cartesiano desnecessário.

### Zoom nativo a 200%: distinção obrigatória

A suíte abre um **perfil persistente descartável por cenário** e usa `chrome.settingsPrivate.setDefaultZoom(2)` na página `chrome://settings/appearance`. É o mecanismo nativo das configurações do Chromium: muda o zoom de layout e provoca reflow. O canal `chromium` usa o navegador completo, inclusive em headless; o antigo headless shell não oferece essa página. Não usa CSS zoom, transform, DPR artificial, viewport reduzida, `Page.setDeviceMetricsOverride`, pinch ou `setPageScaleFactor`.

A prova exige simultaneamente: configuração nativa 2, `innerWidth` reduzido por fator 2, DPR aumentado por fator 2, `outerWidth` constante e `visualViewport.scale` próximo de 1. Registra também `innerHeight`, geometria do preview e overflow. Repete as medições no instante da captura; só aprova após restaurar o zoom para 1 e comprovar a volta das métricas. A restauração fica em `finally`, com fechamento do perfil mesmo se houver falha de interação ou screenshot. Um perfil separado impede interferência nos contextos paralelos. O agregador verifica os números, não somente `verified: true`.

Os 14 cenários cobrem dialog, drawer, dropdown, popover, input, SmartTable e AdminShell nos dois temas, com ações de teclado em 200%, painel aberto, reflow e retorno de foco quando aplicável. As capturas nativas usam `Page.captureScreenshot` **sem clip nem overrides de métricas**: a API de screenshot do Playwright pode produzir recortes vazios/deslocados quando o zoom altera a viewport CSS. O CDP aqui somente lê o compositor, não emula zoom.

Execução reproduzível com interface gráfica em Linux, após `npm ci`, browsers Playwright e `npm run build`:

```bash
xvfb-run -a -s '-screen 0 1600x1200x24' env ADS_NATIVE_ZOOM_HEADED=1 npm run audit:visual
```

O workflow manual `Auditoria visual` usa esse comando headed na imagem oficial Playwright e publica relatórios/capturas do SHA selecionado. A CI regular permanece inalterada.

Em desktop Linux com display ativo, basta `ADS_NATIVE_ZOOM_HEADED=1 npm run audit:visual`. Sem essa variável, o mesmo mecanismo nativo roda no Chromium completo headless; não se confunde com o antigo probe de atalhos ignorados pelo headless shell. A API `settingsPrivate` é interna e específica do Chromium; mudanças do navegador devem produzir falha/pendência explícita, nunca aprovação por fallback. Firefox e WebKit continuam cobertos pelos testes E2E pertinentes, mas não há alegação de zoom nativo desses motores.

No Codex Cloud foi possível iniciar Xvfb a partir de pacote Debian oficial extraído em `/tmp`, sem instalar dependências no repositório. O probe headed confirmou **1440→720 CSS px; DPR 1→2; visualViewport.scale 1→1**, e restauração **720→1440; DPR 2→1**. O mesmo mecanismo foi verificado experimentalmente no Chromium completo headless. A tentativa anterior de acelerador em headless, que não aplicou zoom, permanece como evidência histórica nos runs citados abaixo.

**Reflow a 320px é um teste independente e não equivale a zoom 200%.** A inspeção humana da matriz inteira continua pendente mesmo quando os cenários de zoom passam.

### Capturas com o overlay aberto

Os cenários de dialog, drawer, dropdown, popover e navegação móvel capturam a tela **enquanto a camada está aberta e com foco**, antes de testar Escape e a devolução do foco ao acionador. A aprovação objetiva só acontece após validar o fechamento e o foco de retorno. Quando houver falha depois da captura, o PNG disponível permanece associado à falha, sem transformá-la em aprovação.

### Relatórios e auditoria humana

O teardown atual executa também scripts/visual-audit-a11y-report.mjs e publica a11y-report.json e a11y-report.md, referenciados pelo report.json/report.md existentes. Cada resultado conserva export, rota, estado, tema, largura, preferência, ação, verificações, tipo de zoom, screenshot (quando comprovadamente capturado), status, erro e revisão humana pendente. O verificador confere identidade dos manifestos, presença e assinatura PNG e recusa marcar zoom aprovado só por uma imagem ou metadados de viewport.

Os estados explicitamente representados são: aprovação automática, falha comprovada, pendente de execução/comprovação, não aplicável na matriz original e pendente de revisão visual humana. Não marcar como visualmente aprovado um componente apenas porque um desses testes passou. A execução completa continua exigindo revisão humana das diferenças visuais, contraste e anomalias perceptuais. Não usar os números da auditoria histórica como se fossem desta branch.

Executar com build de produção atualizado e npm run audit:visual; para restringir a fase 4 ao diagnosticar: npx playwright test --config playwright.visual-audit.config.ts visual-audit/a11y.spec.ts. As capturas e manifestos completos só são considerados publicados quando o workflow real tiver sido executado, seus checks passarem e o artefato estiver acessível.

### Revisão técnica da retomada da PR #325

| Achado                                | Reprodução / observado                                                                                       | Esperado e correção                                                                                                                              | Severidade                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Captura nativa deslocada ou vazia     | Zoom 200%, abrir dropdown ou navegação em iframe, usar screenshot do Playwright; menu não aparece no recorte | Capturar o compositor sem clip/override e manter o zoom até finalizar a captura                                                                  | Alta para integridade da evidência; não é defeito comprovado do componente |
| Aprovação confiava em fator declarado | Manifesto com `verified` e porcentagem sem medições/restauração coerentes                                    | Agregador exige números de baseline, pós-zoom, captura e restauração; testes rejeitam DPR isolado, viewport isolada, pinch e restauração ausente | Alta para confiabilidade da auditoria                                      |
| Contenção parcial do foco             | Apenas dois Tabs internos não atingiam necessariamente as bordas do modal                                    | Exercitar último→primeiro e primeiro→último por Tab/Shift+Tab                                                                                    | Média para cobertura                                                       |
| PR em conflito com develop            | Novos testes de revisão humana e testes a11y alteravam a mesma linha de `test:ci`                            | Reconciliar preservando as duas suítes; sem mudanças nos gates                                                                                   | Alta para execução de CI                                                   |
| SHA ausente em relatórios locais      | `GITHUB_SHA` não definido fora de Actions                                                                    | Resolver `git rev-parse HEAD` e registrar working tree suja, sem atribuir resultado de código não commitado ao SHA limpo                         | Média para rastreabilidade                                                 |

Esses achados são de revisão de código, asserções automatizadas e inspeção de capturas por agente. **Não representam inspeção perceptual humana integral**, aprovação WCAG completa, nem conclusão dos checkboxes gerais da issue. A matriz aumentou de 83 para 84 exports em `develop` (PR #317); sua revisão humana segue controlada separadamente. Não há mudança distribuída de componente/API/CSS nesta retomada; por isso não se acrescenta nota pública ao changelog.

### Evidências locais da retomada (15/11/2026 UTC)

A execução `npm run audit:visual` com `ADS_NATIVE_ZOOM_HEADED=1`, Chromium **156.0.8078.4** e Xvfb **21.1.16** aprovou **113/113 testes Playwright**, **336/336 capturas iniciais**, **22/22 estados seletivos** e **31/31 cenários da fase 4**, incluindo **14/14 provas de zoom nativo**. Esses números incluem os cenários das PRs #317/#318 incorporados de `develop`; não são comparáveis diretamente aos 45 testes/332 capturas anteriores. A execução anterior durante a revisão usou o formato antigo de captura e foi corretamente rejeitada pelo agregador reforçado: seus PNGs nativos não são usados como aprovação.

Há um sinal de console HTTP 500 em `AdsPageHeader` dark/1440 na varredura geral, sem overflow nem falha de captura. O sinal foi preservado no relatório. Reprodução focalizada após reiniciar o servidor registrou zero respostas HTTP ≥400 e zero erros de página, com `page-header-triage.json/png` em `visual-audit-results`. A varredura coincidiu com recompilação do servidor de testes; manter o registro transitório, sem atribuí-lo como defeito comprovado ao componente. As capturas revisadas pelo agente incluem foco de input e modal estreito, dialog/drawer com rolagem interna a 200%, dropdown/popover abertos e shell móvel em iframe. Essa inspeção por amostragem **não é revisão humana** da matriz inteira.

O SHA final anterior `de8bff8e` não disparou workflows: a PR estava Ready, porém em conflito (`mergeable_state: dirty`) após `develop` integrar #317 (17:57 UTC) e #318 (20:46 UTC), antes desse SHA (21:00 UTC). Sem filtros de paths que justificassem a ausência, o bloqueio é coerente com a restrição do GitHub para eventos `pull_request` em PRs conflitantes. `push` de feature não atende aos filtros develop/master; resolver o conflito e atualizar a branch permite novo `synchronize`. Não é necessário alterar CI/Pages/Security. O conflito em `test:ci` foi reconciliado preservando testes de revisão humana e a11y.

### Corrida de geometria identificada na validação oficial

No SHA `547fbf408974647a51bdecd813be015758dafa76`, [CI #43765356590](https://github.com/dvmarques/admin-design-system/actions/runs/43765356590), [Pages #43765356599](https://github.com/dvmarques/admin-design-system/actions/runs/43765356599) e [Security #43765356587](https://github.com/dvmarques/admin-design-system/actions/runs/43765356587) passaram. A CI executou **565 E2E aprovados + 1 skip preexistente**: Chromium 261 + 253, Firefox 26, WebKit 25 + skip de forced-colors não emulado. Não houve atualização de snapshots oficiais.

A [auditoria oficial #43765567024](https://github.com/dvmarques/admin-design-system/actions/runs/43765567024), [artefato #14182521075](https://github.com/dvmarques/admin-design-system/actions/runs/43765567024/artifacts/14182521075), capturou 336/336 sem sinais, mas ficou **reprovada com 111/113 testes e 29/31 cenários a11y (12/14 nativos aprovados)**. Os dois inputs em 200% foram medidos antes de concluir rolagem/reflow. Severidade média para confiabilidade da auditoria; não é um defeito persistente comprovado do componente.

A falha foi reproduzida isoladamente no Cloud. A correção aguarda a mesma condição de visibilidade/hit-test, sem aumentar tolerâncias, adicionar retries, sleeps ou scroll artificial. O erro passa a mostrar retângulo e viewport; falhas preservam PNG ainda em 200%, antes da restauração. Os dois casos passaram após a correção (8,1s). A auditoria local completa posterior também passou: **113/113**, **336/336 capturas sem sinais**, **22/22 estados**, **31/31 a11y**, **14/14 nativos**.

Naquele estágio, a tarefa 8 permaneceu aberta até publicar a correção e confirmar sua auditoria/checks oficiais; a resolução comprovada está registrada abaixo. A execução reprovada anterior permanece como histórico, sem renomear suas falhas como pendências nem tratar suas capturas como aprovação.

### Correção validada oficialmente — 53d4783

A implementação corrigida no SHA **53d4783f62698f46bff16ae505bfa908298d0ae3** foi validada: [CI #43767132897](https://github.com/dvmarques/admin-design-system/actions/runs/43767132897), [Pages #43767132902](https://github.com/dvmarques/admin-design-system/actions/runs/43767132902), [Security #43767132939](https://github.com/dvmarques/admin-design-system/actions/runs/43767132939) e [Auditoria visual #43766946520](https://github.com/dvmarques/admin-design-system/actions/runs/43766946520) concluídos com sucesso. A auditoria registrou **113/113 testes, 336/336 capturas iniciais sem sinais, 22/22 estados, 31/31 a11y e 14/14 casos nativos**. A conferência do [artefato #14182871496](https://github.com/dvmarques/admin-design-system/actions/runs/43766946520/artifacts/14182871496) validou CRC, SHA dos relatórios, todos os 31 PNGs da fase 4 e as 14 medições antes/captura/restauração em headed; revisão humana permaneceu pendente.

OpenSpec está tecnicamente 9/9, mas permanece ativo por instrução do usuário. As capturas foram inspecionadas por amostragem pelo agente; não há aprovação perceptual humana integral dos 84 exports. O commit posterior que apenas reconcilia esta documentação também deve ter CI/Pages/Security e auditoria confirmados no SHA entregue, conforme os links atualizados da PR #325. O run #43765567024 continua registrado como reprovado e não é usado como aprovação.

## Aprovação humana e encerramento autorizado — 15/11/2026

O usuário aprovou expressamente a revisão humana e autorizou archive e squash da PR #325 nesta conversa. O [registro de aprovação](visual-audit-review-152.md) vincula a declaração ao SHA `aed0352` e ao artefato #14182903200. Foram atualizadas as 83 linhas ainda pendentes do inventário e da cobertura; a aprovação anterior de AdsPageHeader foi preservada. A aprovação agora é humana declarada, e não inferida da automação.

Os trechos anteriores que descrevem revisão humana ou autorização pendentes são históricos e permanecem preservados. Os relatórios automatizados continuam distinguindo execução objetiva de aprovação humana. O encerramento sincroniza o requisito de acessibilidade visual em `quality-assurance` e arquiva a change em `openspec/changes/archive/2026-11-15-issue-152-visual-a11y-zoom-keyboard/`, na branch da PR. Os checks do novo SHA devem aprovar antes do squash. A issue permanece aberta, sem palavra-chave de fechamento automático.

### Verificação dos gates no encerramento

A conferência do encerramento encontrou 16 testes de orçamento pulados indevidamente: o precheck usava o nome publicado `admin-ds-*` como diretório, embora os workspaces sejam `packages/tokens`, `components`, `highlighted-code` e `admin`. O precheck foi corrigido para remover esse prefixo e permitir a execução dos testes existentes após o build. Não se alteraram limites, asserções, snapshots ou componentes. Os skips de plataforma (Windows e checkout com outro UID) continuam condicionados aos ambientes a que se aplicam. O SHA com esta correção deve aprovar os gates antes do squash.

## Reconciliação histórica da #152 — 15/11/2026

A comparação pareada da varredura inicial de 328 screenshots com o artefato pós-merge de 336 capturas, a investigação dos sete estados de teclado/zoom com diferenças de enquadramento e a classificação dos findings estão documentadas em [Reconciliação de evidências visuais #152](visual-audit-reconciliation-152.md). A revisão de pranchas não representa inspeção perceptual individual integral; a issue permanece aberta e exige autorização antes de merge ou fechamento.

## Triagem da affordance dos painéis informativos — #152

A hipótese original sobre `.demo-panel` e `.demo-utility-panel` foi confirmada
diretamente em `apps/admin-demo/app/globals.css`: ambos recebiam
`translateY(-3px)` e sombra mais forte ao passar o mouse, apesar de serem
superfícies informativas `AdsSurface` sem ação de clique própria. Essa elevação
sugeria uma affordance de acionamento inexistente.

A correção remove apenas esse tratamento de hover e suas transições decorativas
nas superfícies da demo; preserva as variantes `AdsSurface`, bordas, raios,
paddings, espaçamento dos controles, temas, `focus-visible` dos controles
interativos e estilos distribuídos da biblioteca. A transição de `transform` e `box-shadow` em `.demo-form-surface` é
preservada, pois essa superfície não faz parte da correção de affordance.
O teste `e2e/visual-audit-findings.spec.ts` verifica separadamente a presença
de ambas as classes e das respectivas regras CSS, e detecta declarações de
`transform`, `box-shadow` ou `translate` em regras de `:hover` que têm a própria
superfície como alvo, sem rejeitar estilos legítimos de hover dos controles
internos. Executa nas larguras 390px e 1440px, não simula o ponteiro nem
substitui inspeção visual individual. Nenhum snapshot é regravado.

Classificação: **inconsistência de affordance confirmada, P3 (baixa severidade,
restrita à demo)**. Não havia evidência de falha funcional nem indicação de
necessidade de mudar tokens ou API pública. Essa correção não representa uma
inspeção individual integral dos 84 exports ou de todos os estados aplicáveis.
