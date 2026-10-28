# Uniformizar tipografia dos controles textuais (#242)

## Why
No catálogo /catalogo/textarea, o texto e o placeholder do AdsTextarea aparentam utilizar a fonte monoespaçada nativa do navegador, enquanto os rótulos e AdsInput apresentam a família tipográfica do Admin DS. A biblioteca não depende do reset CSS da aplicação e atualmente a classe compartilhada de controle não fixa a família.

## What Changes
- Confirmar o defeito por getComputedStyle/inspeção real em consumidores sem preflight.
- Garantir que AdsInput, AdsTextarea e AdsSelect usem a família de fontes definida pelos tokens públicos, incluindo placeholders e estados; priorizar o ponto compartilhado adequado, sem CSS exclusivo desnecessário.
- Criar regressões automatizadas, verificar temas, tamanhos e consumo do CSS distribuído em Next.js.
- Atualizar demonstrações, documentação ou changelog somente conforme a alteração efetiva.

## Perfil e riscos
Critical: embora seja correção visual pontual, envolve classes CSS públicas distribuídas e todos os controles textuais, podendo alterar aparência/medidas dos consumidores. Não alterar fonte global do aplicativo, escala tipográfica, tokens ou props; revisar os efeitos para Input e Select.

## Impact
@admin-ds/components: CSS gerado a partir de form-control-classes.ts e eventual ajuste de stories/testes. apps/admin-demo e apps/docs: regressão visual e de consumo. Sem dependências novas nem impacto intencional em bundle JavaScript.

## Fora do escopo
Trocar Inter por outra fonte, mudar tamanho/altura dos controles ou redesenhar form controls; resolver ajustes de InputGroup (#243) e Tooltip (#244).

## Referências
#242, auditoria #152, packages/components/src/form-control-classes.ts, textarea.tsx, input.tsx, select.tsx, styles.css.
