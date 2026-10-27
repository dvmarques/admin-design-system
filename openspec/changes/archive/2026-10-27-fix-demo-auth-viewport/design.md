## Context

Conforme proposal.md, a proporção do SVG participa do dimensionamento do grid e a página só define altura mínima.

## Goals / Non-Goals

Conter a composição na viewport dinâmica e preservar conteúdo, foco e tipografia. Não alterar APIs públicas nem limites Server/Client.

## Decisions

- Altura de 100dvh com fallback 100vh na página, cabeçalho sem encolher e grid com trilha e min-height que permitem encolhimento.
- SVG absoluto preenchendo o painel, com recorte proporcional via preserveAspectRatio; sua proporção não define mais a altura do grid.
- Main com overflow auto e formulário centralizado por margens automáticas: quando não couber, o início permanece alcançável. Main recebe tabIndex permanente e nome acessível para acesso previsível da região rolável por teclado, com anel de foco interno para evitar recorte nas bordas.
- Em alturas até 700px compactar somente espaçamentos locais. Não diminuir fonte nem escala dos controles.
- CSS demo-auth-* continua no CSS global do Next.js usando tokens semânticos, sem Tailwind no consumidor, CSS público alterado, dependências ou JS adicional relevante. O SVG já usa tokens para ambos os temas.

Alternativas: ocultar overflow do formulário perderia controles; escalar visualmente toda a tela prejudicaria legibilidade; apenas limitar SVG não ofereceria contenção em telas baixas.

## Risks / Trade-offs

- Alturas extremas, zoom, erros extensos e teclado virtual podem exceder a área disponível: rolagem interna preserva a leitura e operação sem rolagem da página.
- Recorte da decoração varia com a proporção da viewport: painel decorativo aria-hidden, sem conteúdo funcional perdido.

## Migration Plan

Publicar o demo pelo fluxo existente; rollback por reversão do commit. Sem migração de consumidor.

Validação local usa porta isolada porque 3000 já está ocupada. A asserção de permanência na página ao simular saída compara a URL inicial, preservando a verificação sem fixar host/porta.
