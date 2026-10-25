# Comparação visual — issue #187

Capturas do Chromium no Windows, com Inter e dados atuais do demo.
A referência anterior é develop em `21aba2e` (inclui #185 e #182).
Essas imagens são evidências de revisão; não substituem os baselines Linux do E2E.

## Mesmas viewports antes e depois

Desktop: **1280 × 800**. Mobile: **390 × 844** (fechado com página inteira).

- Expandido light: [antes](before/expanded-light.png) · [depois](after/expanded-light.png).
- Expandido dark: [antes](before/expanded-dark.png) · [depois](after/expanded-dark.png).
- Recolhido light: [antes](before/collapsed-light.png) · [depois](after/collapsed-light.png).
- Recolhido dark: [antes](before/collapsed-dark.png) · [depois](after/collapsed-dark.png).
- Mobile fechado light: [antes](before/mobile-closed-light.png) · [depois](after/mobile-closed-light.png).
- Mobile fechado dark: [antes](before/mobile-closed-dark.png) · [depois](after/mobile-closed-dark.png).
- Mobile aberto light: [antes](before/mobile-open-light.png) · [depois](after/mobile-open-light.png).
- Mobile aberto dark: [antes](before/mobile-open-dark.png) · [depois](after/mobile-open-dark.png).

## Diferenças intencionais revisadas

- Apresentação e indicadores se aproximam; saem as linhas e paddings herdados do catálogo.
- Em 1280px expandido, quatro indicadores formam 2×2; recolhido ou em 1600px formam quatro colunas. Mobile mantém uma.
- Descrição e barras de Progresso se aproximam, sem alterar o espaçamento dos componentes em outros consumidores.
- Marca abreviada Admin DS em uma linha e controle circular com chevron na divisória. Recolhido, símbolo e botão permanecem separados e alinhados; o cabeçalho mantém os mesmos 64px. Headers personalizados maiores continuam com altura natural.
- Header desktop mantém tema, notificações e conta; header móvel mantém menu e identificação compacta.
- Navegação light usa preenchimento suavizado também no Drawer; faixa, texto, aria-current e foco permanecem. Cores dark preservadas.
- Avatar da organização usa primary, como o da conta, em ambos os estados e temas. Organização segue opcional; o showcase /catalogo-shell demonstra o layout sem seletor.

## Verificações adicionais

`e2e/dashboard-sidebar-branding.spec.ts` verifica 320, 390, 640, 1280 e 1600px,
header de altura variável, textos/valores longos, foco do toggle, retorno ao menu,
organização, axe e ausência de overflow nos dois temas.
640px CSS representa o reflow equivalente a 1280px com zoom 200%; não é uma
captura de zoom nativo do navegador. As regressões existentes cobrem navegação,
rolagem independente, SSR/hidratação e controles #185/#182.

Snapshots oficiais devem ser regenerados e confirmados em Linux pelo workflow
**Atualizar baselines visuais**, com revisão das diferenças intencionais antes da entrega.

Refinamento de consistência: o seletor expandido ocupa toda a largura disponível, mesmo com nomes curtos. Recolhido, apenas a cor da borda fica transparente; o avatar conserva a posição. A seleção ativa é de 44×44px no recolhido e mantém o mesmo recuo lateral no expandido, com cálculo que considera a scrollbar. A regressão smoke verifica esses contratos nos três navegadores, com gutter stable e auto.
