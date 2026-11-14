## Why

A issue #269 requer hardening verificável para o Admin Demo (Next.js) e o Storybook publicados como HTML estático pelo GitHub Pages. A revisão de 30/10/2026 identificou um script inline de tema **fixo** no layout, sem demonstrar XSS. O risco maior é declarar CSP ou headers de segurança que o host não entrega, ou quebrar a hidratação ao impor uma política de scripts incompatível.

**Perfil: Critical** — segurança web e dois consumidores publicados. Nenhuma API pública do design system será alterada.

## What Changes

- Inventariar scripts, HTML, fontes, importações dinâmicas, WASM do Shiki, links externos e formulários simulados, distinguindo evidências de hipóteses.
- Aplicar às páginas estáticas, no ponto de entrada de cada documento, apenas a CSP parcial que o navegador consegue impor via meta: `object-src 'none'; base-uri 'self'; form-action 'self'`. Sem `script-src`/ `default-src` fictício e sem `unsafe-inline` ou `unsafe-eval`.
- Aplicar `referrer` via meta ao demo e aos dois documentos Storybook (manager/preview), preservando links e o escape padrão do React.
- Testar a presença e a consistência da política no build Pages e a integridade do tema, Shiki, hidratação, Storybook e fluxos de autenticação simulados.
- Documentar limitação de headers no Pages, controles que exigem proxy/host próprio e roteiro para uma CSP estrita futura com inventário de scripts efetivamente gerados.

## Out of Scope

- Backend de login, autorização, sessão ou credenciais reais; troca de hospedagem, cabeçalhos de resposta administrados pelo host, alteração de APIs/CSS públicas, infraestrutura npm (#195), atualização de dependências (#265) ou alteração de regras de PR.
- Declarar `frame-ancestors`, `X-Frame-Options`, `Permissions-Policy`, `Cross-Origin-*` ou CSP Report-Only como efetivos em GitHub Pages.

## Impact

- `apps/admin-demo`, `apps/docs`, `e2e-pages`, documentação de segurança e CHANGELOG; pacotes `packages/*` sem mudança.
- A CSP parcial limita incorporação de objetos, base de URL e destinos de formulários **após o processamento do meta**; não constitui mitigação geral de XSS nem impede embedding de páginas.
- Sem dependências adicionais ou mudanças visuais intencionais. Reversão: remover os metas e restaurar os testes/documentos correlatos.

Issue: https://github.com/dvmarques/admin-design-system/issues/269
