## Context

O efeito de AdsDropdownContent depende de open e encontra contentRef nulo antes de OverlayPortal liberar seus filhos. A detecção por :focus-visible também confunde intenção com heurística do navegador.

## Goals / Non-Goals

Garantir foco após montagem em estado controlado e não controlado, sem alterar APIs públicas ou identidade. Não alterar OverlayPortal, posicionamento, estilos, tokens, dependências nem a issue #128.

## Decisions

Guardar a intenção de foco em ref privada no contexto, definida pelo evento de teclado do gatilho e limpa por clique. Usar callback ref estável no conteúdo para registrar o nó e consumir a intenção focando o primeiro menuitem habilitado. Consumir uma única vez evita roubar foco em rerenders, inclusive em StrictMode. Manter os hooks existentes de Escape, clique externo e posicionamento.

AdsDropdown permanece Client Component; o portal mantém proteção de hidratação. Não há alterações de Tailwind, CSS compilado, exports ou dependências. Demo e Storybook continuam consumindo APIs públicas.

Alternativas: temporizador depende de timing; MutationObserver adiciona complexidade; mover o efeito apenas para layout effect ainda não garante montagem do portal.

## Risks / Trade-offs

O estado controlado pode adiar a abertura: a intenção deve sobreviver até o conteúdo montar. Abertura por mouse deve limpar intenção anterior. Menus sem itens habilitados não recebem foco em item. Abertura programática não representa evento de teclado.

## Validation

Vitest cobre três teclas, estados controlado/não controlado, StrictMode, desabilitados, navegação, Escape, reabertura, mouse e rerenders. Playwright usa foco real, ativação nativa e CSS compilado no admin-demo, nos temas claro/escuro e viewport estreita/larga. Axe audita o menu aberto. Manter exemplos visuais existentes e documentar teclas no Storybook.

Executar build, tipos, lint, testes concisos, E2E, format e OpenSpec. Snapshots Linux ficam para CI, sem atualizar baselines no Windows. Registrar limitações conhecidas de lint #128 se presentes. Diagnóstico: npm run test:verbose e npm run test:e2e:verbose.
