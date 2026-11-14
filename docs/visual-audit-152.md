# Auditoria visual — issue #152

## Escopo da primeira fase

Esta PR inicia a auditoria com inventário dos exports do Admin Demo e referências às stories. A [matriz](visual-audit-152-inventory.md) não declara que componentes foram inspecionados. A cobertura de exports já é conferida por `apps/admin-demo/catalog-coverage.test.ts`; o novo verificador trata da rastreabilidade da inspeção.

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

O auditor registra: erros de rota/captura; console do navegador; overflow horizontal do documento; overflow na região de demonstração; controles fora da borda; controles cujo conteúdo excede a largura. **São heurísticas de triagem**, pois tabelas roláveis, truncamento e outras composições podem ser intencionais. Não realiza julgamento visual subjetivo de cores, espaçamentos, contraste ou alinhamento tipográfico. Um status “sem sinais automatizados” NÃO equivale a aprovação visual e não altera as linhas `Pendente` da matriz.

Para disparar pelo GitHub após o workflow estar presente na branch padrão, abrir Actions → **Auditoria visual #152** → Run workflow. O artefato contém report.md/report.json e capturas, com retenção de 14 dias. O workflow é manual (`workflow_dispatch`), sem agendamento ou custo recorrente por PR. A primeira validação efetiva só pode ser declarada após rodar e inspecionar esse artefato; nenhum relatório de execução foi pré-gerado nesta PR.

O relatório usa apenas demos com dados fictícios. Não adiciona novos baselines nem altera os snapshots oficiais Linux; qualquer diferença encontrada deve ser investigada e tratada separadamente.
