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
