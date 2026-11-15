# Design — auditoria a11y, reflow e zoom

## Arquitetura

Suíte Playwright opt-in adicional na pasta visual-audit, usando as mesmas rotas, applyDemoTheme, configuração, pasta de evidências e teardown atual. Um manifesto JSON por cenário evita concorrência entre workers; screenshots no mesmo diretório de auditoria. Relatório auxiliar integrado ao teardown existente e referenciado no relatório principal, sem banco ou infraestrutura paralela.

## Estratégia de zoom

1. Abrir perfil persistente descartável por cenário no Chromium completo (`channel: chromium`), em headed com Xvfb quando `ADS_NATIVE_ZOOM_HEADED=1`, ou no modo headless completo.
2. Medir baseline: innerWidth/innerHeight, devicePixelRatio, visualViewport.scale, outerWidth, geometria do preview e overflow horizontal.
3. Aplicar `chrome.settingsPrivate.setDefaultZoom(2)` em `chrome://settings/appearance`, o mecanismo de configuração nativa do browser. Comprovar fator configurado, viewport CSS pela metade, DPR duplicado, janela física constante e ausência de pinch. Nenhuma API de emulação ou mudança artificial de viewport é utilizada.
4. Executar interações críticas em dialog/drawer/dropdown/popover/input/SmartTable/AdminShell, light/dark. Medir novamente imediatamente antes de capturar o compositor via `Page.captureScreenshot` sem clip/override. A screenshot padrão do Playwright foi descartada para zoom nativo após recortes deslocados/vazios observados.
5. Restaurar default zoom para 1 em `finally`, comprovar as métricas de restauração, fechar perfil sempre. A configuração global não é compartilhada com outros testes. Agregador valida as medições e não confia apenas em flags/porcentagem declarada.
6. Manter reflow 320px como cenário independente. A prova específica de Chromium não certifica zoom nativo em Firefox/WebKit nem julgamento perceptual humano.

A abordagem anterior com `Control+=` no headless shell é preservada como histórico de probe inconclusivo nos runs existentes. A nova abordagem comprovou 1440→720 CSS px e DPR 1→2, escala visual constante 1 e restauração em Xvfb. Xvfb e browsers são ferramentas do ambiente; não se acrescentam dependências ao projeto.

## Teclado/foco

Usar pressões reais de Tab/Shift+Tab/Enter/Space/Escape e ArrowRight; verificar avanço/retorno, nome e função acessível, :focus-visible, indicador visual medido no elemento e ancestrais (outline, shadow, borda ou fundo) e geometria com hit-test. Inspecionar contenção quando dialog modal estiver aberto e foco restaurado após Escape. Distinguir affordance meramente observada de prova objetiva do controle.

## Seleção e contenção de escopo

Componentes prioritários: botão e checkbox (ativação), tabs (setas), dialogs/drawers (focus trap/return), dropdown/popover (fechamento), AdminShell móvel em iframe, select e smart-table (reflow e clipping). Não duplicar o inventário completo nem revalidar estados já aprovados quando não acrescentar garantia.

## Evidências e estados

Cada registro: id/export/rota/estado/tema/largura/método de zoom/zoom esperado e comprovado/ação/checks/screenshot/erro/status/humanReview. Status exclusivos: verificação objetiva aprovada, falha comprovada na asserção, pendente de execução, não aplicável, pendente de revisão humana. Uma aprovação técnica mantém humanReview pendente.

## Critérios para falha

Falhar por ação ou asserção objetiva não satisfeita; documentOverflow >2px, clipping de controle não rolável, foco inacessível/coberto, foco visual ausente e perda de foco no modal são candidatos objetivos. Separar rolagem legítima de tabela da rolagem horizontal de documento. Evitar conclusões automáticas sobre contraste WCAG.

## Testes e compatibilidade

Testes E2E reais no Chromium Linux do workflow manual; testes Node para formato e status do agregador; comandos format/lint/build/typecheck/quality/E2E e validação OpenSpec strict. Nenhuma alteração em pacotes distribuídos, Tailwind ou CSS, nem dependências. Preserve as 332 capturas e 22 cenários existentes; relatório ampliado é aditivo. Sem changelog público por ser tooling interno.
