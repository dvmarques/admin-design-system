## Approach

Atualizar dependências em grupo com npm 11.19.1 sobre a `develop` após a PR #266. `storybook`, docs addon e react-vite devem resolver na mesma versão estável. Playwright exige correspondência entre pacote, lockfile, `EXPECTED`/constantes, e container `v1.64.1-noble` nas três rotas de automação (CI, Pages e baselines). Não fixar digest nem permissões nesta PR; coordenar com #268 após a versão final.

O `axe-core` novo aplica `label-content-name-mismatch` também a conteúdo visual de avatares. Para manter o texto visível contido no nome acessível, os gatilhos de conta e organização devem incluir as iniciais exibidas antes do nome de usuário/organização, sem alterar componentes genéricos ou suprimir regras axe. Os nomes continuam iniciando por `Menu da conta` e `Organização atual`, inclusive no modo compacto. Em caso de foto/logo, o fallback textual continua compatível com leitor de tela. Testar com imagem ausente e com dados reais da demo, temas claro/escuro e mobile/desktop.

Sem mudança de CSS, tokens ou fronteiras server/client: ambas as composições em `packages/admin` continuam Client Components e usam interfaces públicas de `@dvmarques/admin-ds-components`. A saída CSS compilada, exportações e peerDependencies das bibliotecas devem permanecer idênticas; nenhuma dependência Next.js deve entrar nos pacotes publicáveis. Executar o smoke de tarballs em consumidor Next externo.

Verificação em Node 24/npm 11: `npm ci --ignore-scripts`, `npm ls --depth=0`, build/Storybook API + output, lint, format, typecheck, quality/coverage, testes E2E Chromium/Firefox/WebKit, Pages E2E, OpenSpec estrito, audit JSON completo e produção. Registrar diferenças de advisories, incluindo 14 achados moderados herdados no lote 1; não usar `npm audit fix --force` nem ocultar avisos. Com falhas novas, corrigir apenas dentro do escopo ou documentar o bloqueio e deixar tarefas abertas.

Reversão: reverter o commit do lote 2; não modificar `develop` ou outros lotes sem autorização. A PR vincula `#265` como entrega parcial, sem palavras-chave que a encerrem.
