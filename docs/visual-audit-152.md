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
