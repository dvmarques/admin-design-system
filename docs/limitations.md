# Limitações conhecidas

Esta change entrega a fundação do design system, não um catálogo completo de
componentes administrativos.

- `packages/components` contém atualmente fixtures de estilo e o controle de
  tema; componentes como Button, Table, Modal e Sidebar ainda serão changes
  independentes.
- `packages/admin` estabelece o ponto de distribuição, mas ainda não contém
  composições completas de dashboard ou regras de negócio.
- A aplicação consumidora decide como persistir a preferência de tema e deve
  aplicá-la no servidor quando quiser evitar uma troca visual na hidratação.
- Os snapshots visuais usam Chromium e devem ser atualizados conscientemente
  quando tokens, fontes ou o layout de referência mudarem.
- O baseline de tamanho cobre os artefatos atuais e permite crescimento de
  até 10%; mudanças maiores exigem revisão explícita do baseline.
- A validação automatizada de `axe-core` e Playwright não substitui revisão
  manual com teclado, leitor de tela e testes em navegadores adicionais.
