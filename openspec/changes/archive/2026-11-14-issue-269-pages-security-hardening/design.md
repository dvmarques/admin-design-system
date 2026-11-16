## Decisão de arquitetura

A distribuição do Pages serve arquivos estáticos, sem configuração arbitrária de headers HTTP por `next.config.ts`. Uma regra `headers()` do Next não transforma o conteúdo exportado em resposta com header CSP. Não alterar o deploy nem declarar proteção inexistente.

A CSP `<meta http-equiv="Content-Security-Policy">` é processada pelo navegador a partir de sua posição no HTML, sem proteger recursos anteriores. Empregar apenas `object-src 'none'; base-uri 'self'; form-action 'self'`: são diretivas que não alteram a execução de scripts de Next/Storybook, os estilos inline do design system, os carregamentos de WASM do Shiki ou os iframes usados pelo Storybook. A ausência de `default-src` e `script-src` é **deliberada e explícita**: scripts e fetches continuam sem restrição CSP. Os dois cabeçalhos HTML do Storybook (manager e preview) recebem a mesma política; o RootLayout do Next recebe a própria marcação. `<meta name="referrer" content="strict-origin-when-cross-origin">` aplica a política de navegação compatível com HTML.

## Superfícies verificadas

- `apps/admin-demo/app/layout.tsx` usa `dangerouslySetInnerHTML` apenas para `themeInitScript`, composto como string fixa em `apps/admin-demo/lib/theme.ts` (cookie lido no navegador e comparação com valores `light`, `dark` ou `system`). Não há interpolação de entrada em HTML no layout. A string precisa executar antes da pintura; retirar o inline sem plano de regressão produziria risco de flash de tema.
- `apps/docs/.storybook/{manager-head,preview-head}.html` são templates locais do Storybook, não conteúdo de usuário. Vite/Storybook geram chunks, bootstrap e iframe; builds devem ser examinados antes de definir hashes definitivos.
- Inter é importada por CSS local `@fontsource/inter`; tokens e estilos são importados dos pacotes distribuíveis. URLs `/_next` e `/storybook` têm subcaminhos diferentes no Pages.
- `packages/highlighted-code/src/highlighter.ts` usa `import('shiki/wasm')` e imports dinâmicos de linguagens/temas; código de exemplos é renderizado em spans React como texto, sem injeção de HTML. Dependendo do bundler, `script-src` e/ou `worker-src` podem afetar a carga e a instanciação de WASM.
- `apps/admin-demo/app/storybook-link.tsx`: link `target="_blank"` já tem `rel="noopener"`, com destino interno `/admin-design-system/storybook/`; não exige `noreferrer` por estar na mesma origem.
- `/login`, `/esqueci-senha`, `/redefinir-senha` são demonstrações sem backend. Inputs de credenciais não têm `name`, prevenindo que a submissão GET sem JavaScript vaze esses valores para a URL. Nenhum registro real será adicionado.
- React oferece escaping de dados de texto por padrão; revisões futuras devem rejeitar HTML externo sem sanitização adequada. Inventário estático não é pentest e não comprova ausência de XSS.

## Controles não aplicáveis via meta ou no host atual

- `frame-ancestors`, `sandbox`, `report-uri` e modo `Content-Security-Policy-Report-Only` não funcionam por `meta`; clickjacking exige header servido por proxy/CDN/host configurável. O iframe Storybook **precisa** continuar embutível pelo manager da mesma origem: uma política futura não pode definir `frame-ancestors 'none'` indiscriminadamente no iframe.
- `X-Frame-Options`, `X-Content-Type-Options`, `Permissions-Policy`, `Referrer-Policy` como header, COOP/COEP/CORP e HSTS pertencem à resposta HTTP. O meta de referrer tem efeito próprio, mas não equivale à configuração desses headers.
- Uma CSP estrita exige build reproduzível, descoberta/atualização de hashes dos scripts inline (incluindo payloads do Next), avaliação da estratégia de tema externo ou hash, scripts Storybook, eventuais evals no runtime, CSS inline, iframes e WASM. Nonce por resposta não é apropriado ao Pages sem servidor que o injete. É necessário usar CSP Report-Only em host apropriado antes de enforcement.
- `unsafe-inline`/`unsafe-eval` não são liberados antecipadamente para mascarar erros.

## Compatibilidade, verificação e reversão

- As mudanças não criam estado/efeito novo em React nem tocam tokens, Tailwind, CSS compilado, APIs ou bundles de `packages/*`. Mantém-se o script inicial de tema já testado; introduzir `script-src` sem validação quebraria a hidratação. Nenhuma alteração visual/snapshot é pretendida.
- Testes unitários de política em templates, teste de output Storybook, E2E Pages para marcas e ausência de erros, tema claro/escuro, login simulado e Shiki; CI completa inclui Chromium, Firefox e WebKit no smoke original.
- O CI de PR Ready comprova o build e teste do commit efetivo; uma execução pulada (Draft/docs-only) não comprova. Se falhar, rever bloqueios CSP e diff antes de relaxar diretivas.
- Rollback: reverter metas nos três pontos de entrada; não depender de headers inexistentes nem modificar o workflow de publicação.
