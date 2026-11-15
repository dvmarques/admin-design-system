# Proposta — fase 4 da auditoria visual (#152)

## Motivação
A auditoria existente produz 332 capturas iniciais e 22 cenários seletivos; sua aprovação objetiva não cobre zoom nativo, navegação completa por teclado nem revisão perceptual. Esta change aprofunda as amostras críticas sem criar uma segunda infraestrutura ou declarar conformidade WCAG integral.

## Escopo
- Acrescentar verificações focadas em foco visual, ordem Tab/Shift+Tab, Escape, Enter/Space, setas e gerenciamento de foco de overlays, conforme aplicabilidade.
- Investigar experimentalmente zoom real a 200% em Chromium/Playwright, exigir prova de aplicação e distinguir alternativa de reflow.
- Exercitar light/dark, 320/768px, prefers-reduced-motion e forced-colors em cenários selecionados; medir overflow e acessibilidade geométrica.
- Integrar manifestos com relatório opt-in e documentação das limitações; evidência recuperável para revisão humana.

## Fora do escopo
- Redesenho, alteração de tokens/CSS globais/API pública, atualização em massa de snapshots, declaração de conformidade WCAG completa ou fechamento da #152.
- Automatizar julgamento perceptual humano, intervenções em aplicativos consumidores ou aumentar CI regular.

## Impactos
- Ferramentas e testes internos: visual-audit, scripts de relatório, documentação, workflow manual já existente.
- Pacotes públicos: nenhum. Demos e Storybook: somente alvos de teste, sem alteração distribuída.
- Valor para consumidores: documentação de comportamento e evidências rastreáveis sem alterar contrato público.
- Perfil: Standard; automação interna de auditoria sem alterar comportamento do runtime. Promover a Critical se defeito exigir mudança transversal em acessibilidade pública.

## Riscos e mitigação
- Zoom CDP de página, DPR simulado e viewport reduzida não equivalem a zoom nativo: probe de capacidade com critérios explícitos; inconclusivo fica pendente.
- Foco visível não pode ser inferido de activeElement: exigir foco por teclado, estado :focus-visible, mudança visual calculada e captura.
- Overlays e portais variam: usar ARIA e nomes acessíveis estáveis; testar Escape, contenção e retorno sem sleeps arbitrários.
- Falhas do navegador e artefatos ausentes devem permanecer registradas como falha/pendência; não usar retries genéricos.
