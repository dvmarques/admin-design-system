# Design — auditoria a11y, reflow e zoom

## Arquitetura

Suíte Playwright opt-in adicional na pasta visual-audit, usando as mesmas rotas, applyDemoTheme, configuração, pasta de evidências e teardown atual. Um manifesto JSON por cenário evita concorrência entre workers; screenshots no mesmo diretório de auditoria. Relatório auxiliar integrado ao teardown existente e referenciado no relatório principal, sem banco ou infraestrutura paralela.

## Estratégia de zoom

1. Medir baseline (innerWidth, devicePixelRatio, visualViewport.scale, largura física do contexto e caixa testemunha).
2. Tentar atalho de zoom de navegador via teclado (Control+= repetido no Chromium). O probe somente pode declarar zoom real comprovado se a viewport CSS encolher e o devicePixelRatio aumentar de forma aproximadamente proporcional, com visualViewport.scale próximo de 1, sem alteração artificial de viewport, CSS zoom/transform ou CDP Emulation.setPageScaleFactor.
3. Falha na prova não equivale a falha visual: registrar status de zoom nativo como pendente de comprovação. Não etiquetar captura 100% como zoom 200%. Registrar observações reais e restaurar o estado via contexto isolado.
4. Executar _separadamente_ alternativa de reflow em viewport estreita, rotulada como proxy e não como zoom nativo; usar inspeções de overflow e screenshot próprio.

CDP Emulation.setPageScaleFactor é pinch/page scale e não atende ao critério de reflow do zoom de browser. A tentativa de atalho em Chromium headless pode ser ignorada; nesse caso a limitação permanece explicitamente aberta. Não adicionar dependência.

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
