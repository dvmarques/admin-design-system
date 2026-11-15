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

A branch da fase 4 adiciona uma matriz pequena de 19 cenários prioritários em visual-audit/a11y-scenarios.json, executados por visual-audit/a11y.spec.ts. A matriz preexistente (83 exports, 362 estados aplicáveis, 169 N/A) e suas 332 capturas iniciais + 22 cenários seletivos permanecem inalteradas. A suíte nova é **aditiva** e permanece opt-in no mesmo npm run audit:visual e workflow Auditoria visual (workflow_dispatch). Não executa na CI regular nem altera snapshots oficiais.

### Requisitos objetivos

- Botões: Tab e Shift+Tab, posição e indicação de foco visível. A verificação exige mudança em propriedades de pintura do controle ou antecessores, estado :focus-visible, posição visível e hit-test no ponto central; activeElement isolado não conta como foco visual.
- Abas: ArrowRight e Enter, foco e aria-selected. Menus/dropdown: ArrowDown, mudança de menuitem, Escape e retorno ao acionador.
- Dialog e drawer: Enter para abrir, foco inicial, ciclos Tab/Shift+Tab contidos no modal, Escape e retorno do foco ao acionador. Popover e AdminShell móvel: abertura por Enter, Escape e retorno do foco.
- Reflow: documento sem scroll horizontal acima de 2px, painel modal contido no viewport e superfície de tabela disponível. Overflow interno de tabelas e preview é anotado para revisão, pois pode ser rolagem intencional.
- Preferências: prefers-reduced-motion e forced-colors confirmados no navegador antes do teste; não implicam conformidade de contraste em todos os estados.
- Light/dark e viewports 320/390/768/1440px aplicados conforme o risco do cenário, sem produto cartesiano desnecessário.

### Zoom nativo a 200%: distinção obrigatória

A suíte tenta usar o acelerador de zoom do navegador Chromium sem CSS zoom, transform, override de viewport ou CDP Emulation.setPageScaleFactor. Registra largura da viewport CSS, devicePixelRatio e visualViewport.scale antes/depois. Somente registra **zoom nativo comprovado** se a viewport CSS for reduzida por fator próximo de 2, DPR aumentar proporcionalmente e a escala visual de pinch permanecer próxima de 1. A captura com sufixo native-200 somente é gerada ANTES da restauração quando a prova for satisfatória. Control+0 e nova medição verificam restauração do estado.

Em Chromium headless, teclas simuladas de zoom podem não afetar o zoom do chrome: nesses casos o manifesto contém pending, sem screenshot falsamente rotulado como 200%, e o requisito permanece aberto na issue #152. **viewport reflow a 320px é um teste separado e não equivale a zoom 200%**. Também não equivalem zoom CSS, transform, dispositivo com DPR=2 ou o comando CDP de escala de página. Um Playwright verde com status pending para o probe NÃO aprova zoom nativo.

### Capturas com o overlay aberto

Os cenários de dialog, drawer, dropdown, popover e navegação móvel capturam a tela **enquanto a camada está aberta e com foco**, antes de testar Escape e a devolução do foco ao acionador. A aprovação objetiva só acontece após validar o fechamento e o foco de retorno. Quando houver falha depois da captura, o PNG disponível permanece associado à falha, sem transformá-la em aprovação.

### Relatórios e auditoria humana

O teardown atual executa também scripts/visual-audit-a11y-report.mjs e publica a11y-report.json e a11y-report.md, referenciados pelo report.json/report.md existentes. Cada resultado conserva export, rota, estado, tema, largura, preferência, ação, verificações, tipo de zoom, screenshot (quando comprovadamente capturado), status, erro e revisão humana pendente. O verificador confere identidade dos manifestos, presença e assinatura PNG e recusa marcar zoom aprovado só por uma imagem ou metadados de viewport.

Os estados explicitamente representados são: aprovação automática, falha comprovada, pendente de execução/comprovação, não aplicável na matriz original e pendente de revisão visual humana. Não marcar como visualmente aprovado um componente apenas porque um desses testes passou. A execução completa continua exigindo revisão humana das diferenças visuais, contraste e anomalias perceptuais. Não usar os números da auditoria histórica como se fossem desta branch.

Executar com build de produção atualizado e npm run audit:visual; para restringir a fase 4 ao diagnosticar: npx playwright test --config playwright.visual-audit.config.ts visual-audit/a11y.spec.ts. As capturas e manifestos completos só são considerados publicados quando o workflow real tiver sido executado, seus checks passarem e o artefato estiver acessível.
