# Limitações conhecidas

Esta change entrega a fundação do design system, não um catálogo completo de
componentes administrativos.

- `packages/components` contém atualmente fixtures de estilo e o controle de
  tema; componentes como Button, Table, Modal e Sidebar ainda serão changes
  independentes.
- `packages/admin` contém o `AdsAdminShell` e seus estilos próprios, mas ainda
  não contém composições completas de dashboard ou regras de negócio.
- A aplicação consumidora decide como persistir a preferência de tema e deve
  aplicá-la no servidor quando quiser evitar uma troca visual na hidratação.
- Os snapshots visuais usam Chromium e devem ser atualizados conscientemente
  quando tokens, fontes ou o layout de referência mudarem.
- Os baselines visuais existem apenas para `win32`. Por isso os testes de
  snapshot, incluindo o do Admin Shell recolhido e móvel em
  `e2e/admin-demo.spec.ts`, são pulados na CI (Linux) e devem ser executados e
  atualizados localmente no Windows.
- O baseline de tamanho cobre os artefatos atuais e permite crescimento de
  até 10%; mudanças maiores exigem revisão explícita do baseline.
- A validação automatizada de `axe-core` e Playwright não substitui revisão
  manual com teclado, leitor de tela e testes em navegadores adicionais.
- `AdsNav` não comporta um link do consumidor sem gerar conteúdo interativo
  aninhado: com `href` ele renderiza o próprio `<a>` e, sem `href`, um
  `<button>`. `AdsBreadcrumb` aceita um `next/link` em `label`, mas só aplica o
  estilo e o foco de link quando recebe `href`. Os dois divergem da spec
  `navigation-structure` ("Cada item MUST aceitar conteúdo de link…" e o
  cenário "Consumo em Next.js sem acoplamento ao roteador") e devem ser
  corrigidos em change própria. O admin demo usa `next/link` direto na sidebar
  do shell.
- `AdsPagination.renderPage` só recebe o botão pronto da página: envolvê-lo em
  `next/link` ou `<a>` gera conteúdo interativo aninhado, e substituí-lo por um
  link perde o `aria-current="page"` e o estilo de item da biblioteca. Isso
  diverge do cenário "Integração com Next.js" da spec `pagination` e deve ser
  corrigido em change própria. O admin demo usa `onPageChange` com
  `router.push`.
- Os utilitários Tailwind só existem no CSS distribuído se aparecerem nas
  fontes de `packages/components`. Por isso o admin demo usa apenas classes
  `demo-` e `ads-`, e um teste de consumo público falha se um `className`
  literal usar outra coisa.
