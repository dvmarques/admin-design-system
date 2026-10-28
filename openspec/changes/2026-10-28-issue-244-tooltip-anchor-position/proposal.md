# Corrigir âncora do AdsTooltip no catálogo (#244)

## Why
Na página /catalogo/tooltip, o botão Ajuda está à esquerda do preview, mas o balão aparece no meio da área. O posicionamento atual calcula o centro do span âncora; em um contêiner flex com align-items:stretch, o span inline-flex pode ocupar toda a largura do painel, dissociando-se do botão.

## What Changes
- Confirmar com medidas reais o descompasso entre bounding boxes de botão, wrapper e tooltip.
- Fazer o AdsTooltip se associar geometricamente ao gatilho real, inclusive quando inserido em flex/stretch ou grid, sem depender de correção exclusiva no catálogo.
- Avaliar AdsPopover, que usa wrapper de âncora semelhante e compartilha useAnchoredPosition; corrigir quando o mesmo defeito for reproduzido.
- Preservar flip, shift, posicionamento top/bottom/left/right, seta, foco, Escape, ARIA, responsividade e portais.
- Ampliar testes unitários/E2E de geometria e páginas de demonstração.

## Perfil e riscos
Critical: afeta posicionamento e acessibilidade de overlays públicos do pacote compilado, com múltiplos contextos de layout/tema e consumidores. A correção deve ser mínima e focada na âncora, sem reimplementar o algoritmo entregue pela #135 sem evidência.

## Impact
@admin-ds/components (overlay-anchored.tsx e eventualmente overlay-utils.tsx), CSS compilado, Storybook, apps/admin-demo e testes de integração. Sem mudança de API pública, tokens ou dependências de runtime.

## Fora do escopo
Mudar conteúdo do tooltip, reorganizar a camada de Escape/foco, refazer infraestrutura de modais, impor position:absolute ao preview da aplicação ou alterar comportamento de Dropdown sem bug confirmado.

## Referências
#244, posicionamento anterior #135, auditoria #152; packages/components/src/overlay-anchored.tsx, overlay-utils.tsx, apps/admin-demo/app/globals.css e catalog-demos.tsx.
